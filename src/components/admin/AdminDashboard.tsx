'use client'

import {
  getContentRevisions,
  getPublishStatus,
  listMediaAssets,
  restoreRevision,
  saveContent,
  uploadMedia,
  type MediaAsset,
  type PublishStatus,
  type RevisionSummary,
} from '@/app/admin/actions'
import { logout } from '@/app/admin/logout-action'
import { validateContent } from '@/lib/content-schema'
import { mergeContentChanges } from '@/lib/content-merge'
import type { ContentData } from '@/types/content'
import yaml from 'js-yaml'
import { useEffect, useMemo, useState } from 'react'
import { ContentEditor, type JsonValue } from './ContentEditor'
import { HelpModal } from './HelpSystem'

interface AdminDashboardProps {
  initialData: ContentData
  initialContentSha: string | null
}

type Message = { type: 'success' | 'error' | 'info'; text: string }
type PublishState = 'idle' | 'publishing' | 'building' | 'live' | 'failed'

const SECTION_GROUPS: Array<{ group: string; items: Array<[string, string]> }> = [
  {
    group: 'General',
    items: [
      ['metadata', 'Site Identity'],
      ['hero', 'Hero Section'],
      ['mission', 'Mission'],
      ['agenda', 'Meeting Agenda'],
      ['footer', 'Footer & Links'],
    ],
  },
  {
    group: 'Historical Content',
    items: [
      ['background', 'Background Info'],
      ['timeline', 'Ship History'],
      ['submarineFacts', 'Submarine Facts'],
      ['letters', 'Support Letters'],
    ],
  },
  {
    group: 'The Project',
    items: [
      ['phases', 'Project Phases'],
      ['whatYourGiftBuilds', 'What Your Gift Builds'],
      ['budget', 'Budget & Need'],
      ['locationShift', 'Site Selection'],
      ['sitePlan', 'Site Plan'],
    ],
  },
  {
    group: 'Media',
    items: [
      ['gallery', 'Image Gallery'],
      ['executionPhotos', 'Execution Photos'],
      ['navy250', 'Countdown & Navy 250'],
    ],
  },
  {
    group: 'Engagement',
    items: [
      ['fundraisingProgress', 'Fundraising Stats'],
      ['whyNow', 'Why Now?'],
      ['callToAction', 'Donation Info'],
      ['volunteer', 'Volunteer Info'],
      ['stakeholders', 'Action Committee'],
      ['presentedBy', 'Presenters'],
      ['close', 'Closing Screen'],
    ],
  },
  {
    group: 'Advanced',
    items: [['godmode', 'God Mode (Raw YAML)']],
  },
]

const SECTION_LABELS = Object.fromEntries(SECTION_GROUPS.flatMap((group) => group.items)) as Record<string, string>

function clonePath(root: unknown, path: string, value: unknown): ContentData {
  const keys = path.split('.').map((key) => (/^\d+$/.test(key) ? Number(key) : key))
  const cloneContainer = (input: any) => Array.isArray(input) ? [...input] : { ...input }
  const nextRoot: any = cloneContainer(root)
  let previous: any = root
  let next: any = nextRoot

  for (let index = 0; index < keys.length - 1; index += 1) {
    const key = keys[index] as any
    const previousChild = previous?.[key]
    const nextChild = cloneContainer(previousChild ?? (typeof keys[index + 1] === 'number' ? [] : {}))
    next[key] = nextChild
    previous = previousChild
    next = nextChild
  }

  next[keys[keys.length - 1] as any] = value
  return nextRoot as ContentData
}

function statusClasses(state: PublishState) {
  if (state === 'live') return 'border-green-500/40 bg-green-500/10 text-green-300'
  if (state === 'failed') return 'border-red-500/40 bg-red-500/10 text-red-300'
  if (state === 'publishing' || state === 'building') return 'border-yellow-500/40 bg-yellow-500/10 text-yellow-300'
  return 'border-slate-700 bg-slate-800 text-slate-400'
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function AdminDashboard({ initialData, initialContentSha }: AdminDashboardProps) {
  const [data, setData] = useState<ContentData>(initialData)
  const [lastPublishedData, setLastPublishedData] = useState<ContentData>(initialData)
  const [publishedContentSha, setPublishedContentSha] = useState(initialContentSha)
  const [activeSection, setActiveSection] = useState<string>('metadata')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [message, setMessage] = useState<Message | null>(null)
  const [publishState, setPublishState] = useState<PublishState>('idle')
  const [publishDetails, setPublishDetails] = useState<PublishStatus | null>(null)
  const [rawYaml, setRawYaml] = useState(() => yaml.dump(initialData, { indent: 2, lineWidth: -1 }))
  const [yamlError, setYamlError] = useState<string | null>(null)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [showRevisions, setShowRevisions] = useState(false)
  const [revisions, setRevisions] = useState<RevisionSummary[]>([])
  const [loadingRevisions, setLoadingRevisions] = useState(false)
  const [restoringSha, setRestoringSha] = useState<string | null>(null)
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([])
  const [uploadingPath, setUploadingPath] = useState<string | null>(null)

  const canPublish = isDirty && !isSaving && !yamlError
  const activeLabel = SECTION_LABELS[activeSection] || 'Content'

  useEffect(() => {
    const warnBeforeLeaving = (event: BeforeUnloadEvent) => {
      if (!isDirty) return
      event.preventDefault()
    }
    window.addEventListener('beforeunload', warnBeforeLeaving)
    return () => window.removeEventListener('beforeunload', warnBeforeLeaving)
  }, [isDirty])

  useEffect(() => {
    listMediaAssets().then(setMediaAssets).catch((error) => console.error('Media library failed to load:', error))
  }, [])

  const sectionValue = useMemo(() => {
    if (activeSection === 'godmode') return null
    return (data as unknown as Record<string, JsonValue>)[activeSection]
  }, [activeSection, data])

  const selectSection = (id: string) => {
    if (id === 'godmode') {
      setRawYaml(yaml.dump(data, { indent: 2, lineWidth: -1 }))
      setYamlError(null)
    }
    setActiveSection(id)
    setIsSidebarOpen(false)
  }

  const updateField = (path: string, value: JsonValue) => {
    setData((current) => clonePath(current, path, value))
    setIsDirty(true)
    setMessage(null)
    if (publishState === 'live') setPublishState('idle')
  }

  const refreshMedia = async () => {
    try {
      setMediaAssets(await listMediaAssets())
    } catch (error) {
      console.error('Failed to refresh media library:', error)
    }
  }

  const handleUpload = async (file: File, path: string) => {
    setUploadingPath(path)
    setMessage(null)
    try {
      const form = new FormData()
      form.set('file', file)
      const result = await uploadMedia(form)
      if (!result.success) {
        setMessage({ type: 'error', text: result.message })
        return
      }
      updateField(path, result.path)
      setMessage({ type: 'success', text: 'Image uploaded and selected. Publish Changes to make the content update live.' })
      await refreshMedia()
    } catch {
      setMessage({ type: 'error', text: 'Image upload failed.' })
    } finally {
      setUploadingPath(null)
    }
  }

  const trackDeployment = async (commitSha: string) => {
    setPublishState('building')
    setPublishDetails({ state: 'building', label: 'Building' })

    for (let attempt = 0; attempt < 24; attempt += 1) {
      try {
        const status = await getPublishStatus(commitSha)
        setPublishDetails(status)
        setPublishState(status.state)
        if (status.state === 'live' || status.state === 'failed') return
      } catch (error) {
        console.error('Deployment status check failed:', error)
      }
      await delay(5000)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setPublishState('publishing')
    setPublishDetails({ state: 'building', label: 'Publishing' })
    setMessage(null)

    try {
      const result = await saveContent(data, publishedContentSha)

      if (!result.success && 'stale' in result && result.stale && result.latestContent && result.latestSha) {
        const { merged, conflicts } = mergeContentChanges(lastPublishedData, data, result.latestContent)
        setData(merged)
        setLastPublishedData(result.latestContent)
        setPublishedContentSha(result.latestSha)
        setIsDirty(true)
        setPublishState('idle')
        setPublishDetails(null)
        setMessage({
          type: 'info',
          text: conflicts.length
            ? `Someone else published first. Their changes were merged with yours; ${conflicts.length} overlapping field${conflicts.length === 1 ? '' : 's'} kept your version. Review and publish again.`
            : 'Someone else published first. Their changes were merged with yours and your edits were preserved. Publish again when ready.',
        })
        return
      }

      if (!result.success) {
        setPublishState('failed')
        setPublishDetails({ state: 'failed', label: 'Publish failed' })
        setMessage({ type: 'error', text: result.message })
        return
      }

      setLastPublishedData(data)
      if (result.contentSha) setPublishedContentSha(result.contentSha)
      setIsDirty(false)
      setMessage({ type: 'success', text: result.message })

      if (result.commitSha) {
        void trackDeployment(result.commitSha)
      } else {
        setPublishState('live')
        setPublishDetails({ state: 'live', label: result.changed === false ? 'Already live' : 'Saved' })
      }
    } catch {
      setPublishState('failed')
      setPublishDetails({ state: 'failed', label: 'Publish failed' })
      setMessage({ type: 'error', text: 'An unexpected publishing error occurred.' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleRawYamlChange = (value: string) => {
    setRawYaml(value)
    try {
      const parsed = yaml.load(value)
      const validation = validateContent(parsed)
      if (!validation.success) throw new Error(validation.message)
      setData(validation.data)
      setYamlError(null)
      setIsDirty(JSON.stringify(validation.data) !== JSON.stringify(lastPublishedData))
    } catch (error: any) {
      setYamlError(error?.message || 'Invalid YAML')
    }
  }

  const toggleRevisions = async () => {
    const next = !showRevisions
    setShowRevisions(next)
    if (!next || revisions.length) return

    setLoadingRevisions(true)
    try {
      setRevisions(await getContentRevisions())
    } catch (error: any) {
      setMessage({ type: 'error', text: error?.message || 'Could not load revision history.' })
    } finally {
      setLoadingRevisions(false)
    }
  }

  const handleRestore = async (revision: RevisionSummary) => {
    if (!window.confirm(`Restore the site content from “${revision.message}”? This creates a new rollback commit; it does not erase history.`)) return

    setRestoringSha(revision.sha)
    setMessage(null)
    try {
      const result = await restoreRevision(revision.sha, publishedContentSha)
      if (!result.success) {
        setMessage({ type: 'error', text: result.message })
        return
      }
      setData(result.content)
      setLastPublishedData(result.content)
      setPublishedContentSha(result.contentSha)
      setIsDirty(false)
      setRawYaml(yaml.dump(result.content, { indent: 2, lineWidth: -1 }))
      setMessage({ type: 'success', text: result.message })
      setRevisions(await getContentRevisions())
      if (result.commitSha) void trackDeployment(result.commitSha)
    } finally {
      setRestoringSha(null)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-white">
      {isSidebarOpen && <button type="button" aria-label="Close menu" className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setIsSidebarOpen(false)} />}

      <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-900 transition-transform md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="border-b border-slate-800 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-lg font-bold text-yellow-400">Omaha Command</h1>
              <p className="mt-1 text-xs text-slate-500">USS Omaha SSN-692 CMS</p>
            </div>
            <button type="button" onClick={() => setIsSidebarOpen(false)} className="text-xl text-slate-500 md:hidden" aria-label="Close menu">×</button>
          </div>
          <div className={`mt-3 inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClasses(publishState)}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${publishState === 'live' ? 'bg-green-400' : publishState === 'failed' ? 'bg-red-400' : publishState === 'idle' ? 'bg-slate-500' : 'bg-yellow-400'}`} />
            {publishDetails?.label || (isDirty ? 'Unpublished edits' : 'Published')}
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          {SECTION_GROUPS.map((group) => (
            <div key={group.group} className="mb-5">
              <h2 className="mb-1 px-2 text-xs font-semibold text-slate-500">{group.group}</h2>
              <div className="space-y-0.5">
                {group.items.map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => selectSection(id)}
                    className={`w-full rounded-lg px-2.5 py-2 text-left text-sm transition ${activeSection === id ? 'bg-yellow-400 text-slate-950 font-semibold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="space-y-2 border-t border-slate-800 p-3">
          <button type="button" onClick={toggleRevisions} className="w-full rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-300 hover:border-slate-500 hover:text-white">
            Revision history
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!canPublish}
            className={`w-full rounded-lg px-3 py-3 text-sm font-bold transition ${canPublish ? 'bg-green-600 text-white hover:bg-green-500' : 'cursor-not-allowed bg-slate-800 text-slate-500'}`}
          >
            {isSaving ? 'Publishing…' : isDirty ? 'Publish Changes' : 'Published'}
          </button>
          <form action={logout}>
            <button type="submit" className="w-full px-3 py-2 text-xs text-slate-500 hover:text-red-400">Sign out</button>
          </form>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-slate-950 pb-24 md:pb-8">
        <div className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-slate-800 bg-slate-950/95 px-4 py-3 backdrop-blur md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button type="button" onClick={() => setIsSidebarOpen(true)} className="rounded-lg border border-slate-700 px-2.5 py-2 text-sm text-yellow-400 md:hidden" aria-label="Open menu">☰</button>
            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold">{activeLabel}</h2>
              <p className="truncate text-xs text-slate-500">{isDirty ? 'Changes not published yet' : 'Matches published content'}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button type="button" onClick={() => setIsHelpOpen(true)} className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 hover:border-yellow-500 hover:text-yellow-400">Help</button>
            <a href="/" target="_blank" rel="noopener noreferrer" className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 hover:border-slate-500 hover:text-white">View site</a>
          </div>
        </div>

        <div className="mx-auto max-w-5xl space-y-5 p-4 md:p-6">
          {message && (
            <div className={`flex items-start justify-between gap-4 rounded-xl border p-4 text-sm ${message.type === 'error' ? 'border-red-500/40 bg-red-500/10 text-red-200' : message.type === 'success' ? 'border-green-500/40 bg-green-500/10 text-green-200' : 'border-blue-500/40 bg-blue-500/10 text-blue-200'}`}>
              <span>{message.text}</span>
              <button type="button" onClick={() => setMessage(null)} className="shrink-0 opacity-60 hover:opacity-100" aria-label="Dismiss message">×</button>
            </div>
          )}

          {showRevisions && (
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 md:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold">Revision history</h3>
                  <p className="mt-1 text-xs text-slate-500">Restore an earlier content.yml as a new commit. Nothing is deleted from Git history.</p>
                </div>
                <button type="button" onClick={() => setShowRevisions(false)} className="text-slate-500 hover:text-white" aria-label="Close revision history">×</button>
              </div>
              {loadingRevisions ? <p className="text-sm text-slate-500">Loading revisions…</p> : (
                <div className="divide-y divide-slate-800">
                  {revisions.map((revision) => (
                    <div key={revision.sha} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-200">{revision.message}</p>
                        <p className="mt-1 text-xs text-slate-500">{revision.date ? new Date(revision.date).toLocaleString() : 'Unknown date'} · {revision.author} · {revision.sha.slice(0, 7)}</p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <a href={revision.url} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-400 hover:text-white">Commit</a>
                        <button type="button" onClick={() => handleRestore(revision)} disabled={!!restoringSha} className="rounded-lg border border-yellow-500/40 px-3 py-2 text-xs font-semibold text-yellow-300 hover:bg-yellow-500/10 disabled:opacity-40">
                          {restoringSha === revision.sha ? 'Restoring…' : 'Restore'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeSection === 'godmode' ? (
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 md:p-5">
              <div className="mb-4">
                <h3 className="text-xl font-semibold">Raw YAML</h3>
                <p className="mt-1 text-sm text-slate-500">Uses the same shared schema as the visual editor and server publish path.</p>
              </div>
              <textarea
                aria-label="Raw YAML editor"
                value={rawYaml}
                onChange={(event) => handleRawYamlChange(event.target.value)}
                className={`h-[65vh] w-full resize-y rounded-xl border bg-black p-4 font-mono text-sm leading-relaxed text-green-300 outline-none ${yamlError ? 'border-red-500' : 'border-slate-700 focus:border-yellow-500'}`}
              />
              {yamlError && <p className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3 font-mono text-xs text-red-200">{yamlError}</p>}
            </section>
          ) : sectionValue !== undefined ? (
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 md:p-5">
              <ContentEditor
                value={sectionValue}
                path={activeSection}
                mediaAssets={mediaAssets}
                uploadingPath={uploadingPath}
                onChange={updateField}
                onUpload={handleUpload}
              />
            </section>
          ) : (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">This content section is missing from the loaded data.</div>
          )}
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-800 bg-slate-900/95 p-3 backdrop-blur md:hidden">
        <button
          type="button"
          onClick={handleSave}
          disabled={!canPublish}
          className={`w-full rounded-xl py-3 text-sm font-bold ${canPublish ? 'bg-green-600 text-white' : 'bg-slate-800 text-slate-500'}`}
        >
          {isSaving ? 'Publishing…' : isDirty ? 'Publish Changes' : publishDetails?.label || 'Published'}
        </button>
      </div>

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} initialSection={activeSection} />
    </div>
  )
}
