'use client'

import type { MediaAsset } from '@/app/admin/actions'
import { useEffect, useState } from 'react'

export type JsonValue = string | number | boolean | null | undefined | JsonValue[] | { [key: string]: JsonValue }

interface ContentEditorProps {
  value: JsonValue
  path: string
  mediaAssets: MediaAsset[]
  uploadingPath: string | null
  onChange: (path: string, value: JsonValue) => void
  onUpload: (file: File, path: string) => Promise<void>
}

const FIELD_HELP: Record<string, string> = {
  'metadata.title': 'Browser/search title and footer identity.',
  'metadata.subtitle': 'Search description and footer subtitle.',
  'metadata.year': 'Project/copyright year displayed by the site.',
  'hero.backgroundImage': 'Homepage hero background image.',
  'navy250.deadline': 'The countdown target is stored as an absolute timestamp and interpreted as Omaha time in this editor.',
  'navy250.images': 'Images used in the print/PDF Navy anniversary presentation.',
  'footer.logos': 'Each partner logo can include its own clickable website link.',
}

const LONG_FIELD = /(description|statement|details|body|note|excerpt|tagline|subheading|promiseText|paragraph)/i
const IMAGE_KEYS = new Set(['image', 'logo', 'src', 'renderImage', 'floodImage', 'mapImage', 'backgroundImage'])

function humanize(value: string) {
  if (/^\d+$/.test(value)) return `Item ${Number(value) + 1}`
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/^./, (char) => char.toUpperCase())
}

function isRecord(value: JsonValue): value is { [key: string]: JsonValue } {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isMediaPath(path: string) {
  const key = path.split('.').pop() || ''
  return IMAGE_KEYS.has(key) || /^navy250\.images\.\d+$/.test(path)
}

function emptyLike(value: JsonValue): JsonValue {
  if (typeof value === 'string') return ''
  if (typeof value === 'number') return 0
  if (typeof value === 'boolean') return false
  if (Array.isArray(value)) return []
  if (isRecord(value)) return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, emptyLike(child)]))
  return null
}

function defaultArrayItem(path: string): JsonValue {
  const defaults: Record<string, JsonValue> = {
    'agenda.items': { title: '', description: '' },
    'background.milestones': { year: '', month: '', event: '' },
    'letters.items': { title: '', image: '', excerpt: '' },
    'submarineFacts.facts': { label: '', value: '' },
    'timeline.milestones': { date: '', title: '', details: '' },
    'phases.phaseList': { number: 0, title: '', description: '', status: '', cost: '', percentComplete: 0 },
    'whatYourGiftBuilds.items': { name: '', description: '' },
    'gallery.images': { src: '', caption: '' },
    'executionPhotos.photos': { src: '', caption: '', year: '' },
    'whyNow.projects': { name: '', cost: '' },
    'stakeholders.members': { name: '', title: '', subtitle: '' },
    'presentedBy.presenters': { name: '', org: '', title: '' },
    'footer.quickLinks': { label: '', href: '' },
    'footer.logos': { src: '', alt: '', href: '' },
  }
  return defaults[path] ?? ''
}

function toOmahaLocalInput(iso: string) {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Chicago',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(date)
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value || ''
  return `${part('year')}-${part('month')}-${part('day')}T${part('hour')}:${part('minute')}`
}

function timeZoneOffsetMs(timestamp: number, timeZone: string) {
  const date = new Date(timestamp)
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
  }).formatToParts(date)
  const value = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((item) => item.type === type)?.value || 0)
  const asUtc = Date.UTC(value('year'), value('month') - 1, value('day'), value('hour'), value('minute'), value('second'))
  return asUtc - timestamp
}

function omahaLocalToUtc(localValue: string) {
  const match = localValue.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/)
  if (!match) return ''
  const [, y, m, d, hh, mm] = match
  const desiredWallUtc = Date.UTC(Number(y), Number(m) - 1, Number(d), Number(hh), Number(mm), 0)
  let offset = timeZoneOffsetMs(desiredWallUtc, 'America/Chicago')
  let timestamp = desiredWallUtc - offset
  const refinedOffset = timeZoneOffsetMs(timestamp, 'America/Chicago')
  if (refinedOffset !== offset) {
    offset = refinedOffset
    timestamp = desiredWallUtc - offset
  }
  return new Date(timestamp).toISOString().replace('.000Z', 'Z')
}

function FieldShell({ label, path, children }: { label: string; path: string; children: React.ReactNode }) {
  const help = FIELD_HELP[path]
  return (
    <div className="min-w-0">
      <div className="mb-2 flex items-center gap-2">
        <label className="text-sm font-semibold text-slate-200">{label}</label>
        {help && <span title={help} className="cursor-help text-xs text-slate-500">ⓘ</span>}
      </div>
      {children}
    </div>
  )
}

function MediaInput({
  value,
  path,
  assets,
  uploading,
  onChange,
  onUpload,
}: {
  value: string
  path: string
  assets: MediaAsset[]
  uploading: boolean
  onChange: (value: string) => void
  onUpload: (file: File) => Promise<void>
}) {
  const inputId = `upload-${path.replace(/[^a-z0-9]/gi, '-')}`
  return (
    <div className="space-y-2">
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none focus:border-yellow-500"
      />
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-[auto_1fr]">
        <label htmlFor={inputId} className={`cursor-pointer rounded-lg border border-slate-700 px-3 py-2 text-center text-xs font-semibold transition ${uploading ? 'pointer-events-none text-slate-500' : 'text-slate-200 hover:border-yellow-500 hover:text-yellow-400'}`}>
          {uploading ? 'Uploading…' : 'Upload image'}
        </label>
        <input
          id={inputId}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sr-only"
          onChange={async (event) => {
            const file = event.target.files?.[0]
            if (file) await onUpload(file)
            event.currentTarget.value = ''
          }}
        />
        <select
          value=""
          onChange={(event) => event.target.value && onChange(event.target.value)}
          className="min-w-0 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-300 outline-none focus:border-yellow-500"
        >
          <option value="">Choose from media library…</option>
          {assets.map((asset) => <option key={asset.path} value={asset.publicPath}>{asset.name}</option>)}
        </select>
      </div>
    </div>
  )
}

function DeadlinePastWarning({ value }: { value: string }) {
  const [isPast, setIsPast] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const target = new Date(value).getTime()
      setIsPast(Boolean(value) && Number.isFinite(target) && target <= Date.now())
    }, 0)
    return () => window.clearTimeout(timer)
  }, [value])

  if (!isPast) return null
  return <p className="mt-1.5 text-xs font-medium text-yellow-300">This deadline is in the past. The countdown will show zero until you update the date or hide the countdown.</p>
}

type RenderNode = (node: JsonValue, nodePath: string, label: string) => React.ReactNode

function ArrayNode({
  node,
  nodePath,
  label,
  renderNode,
  onChange,
}: {
  node: JsonValue[]
  nodePath: string
  label: string
  renderNode: RenderNode
  onChange: (path: string, value: JsonValue) => void
}) {
  const [ids, setIds] = useState<string[]>(() => node.map(() => crypto.randomUUID()))

  const itemKey = (item: JsonValue, index: number) => ids[index] || `${nodePath}-external-${index}-${JSON.stringify(item)}`

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h4 className="text-base font-semibold text-white">{label}</h4>
          {FIELD_HELP[nodePath] && <p className="mt-1 text-xs text-slate-500">{FIELD_HELP[nodePath]}</p>}
        </div>
        <button
          type="button"
          onClick={() => {
            const template = node.length ? emptyLike(node[node.length - 1]) : defaultArrayItem(nodePath)
            setIds((current) => [...current, crypto.randomUUID()])
            onChange(nodePath, [...node, template])
          }}
          className="shrink-0 rounded-lg border border-slate-600 px-3 py-2 text-xs font-semibold text-slate-200 hover:border-yellow-500 hover:text-yellow-400"
        >
          + Add
        </button>
      </div>

      {node.length === 0 && <p className="rounded-xl border border-dashed border-slate-700 px-4 py-5 text-sm text-slate-500">No items yet.</p>}

      {node.map((item, index) => {
        const itemPath = `${nodePath}.${index}`
        return (
          <div key={itemKey(item, index)} className="rounded-xl border border-slate-700 bg-slate-800/45 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-xs font-semibold text-slate-400">{humanize(nodePath.split('.').pop() || 'Item')} {index + 1}</span>
              <button
                type="button"
                onClick={() => {
                  if (!window.confirm(`Remove ${humanize(nodePath.split('.').pop() || 'item')} ${index + 1}?`)) return
                  setIds((current) => current.filter((_, itemIndex) => itemIndex !== index))
                  onChange(nodePath, node.filter((_, itemIndex) => itemIndex !== index))
                }}
                className="rounded-md px-2 py-1 text-xs font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300"
              >
                Remove
              </button>
            </div>
            {renderNode(item, itemPath, `Item ${index + 1}`)}
          </div>
        )
      })}
    </div>
  )
}

export function ContentEditor({ value, path, mediaAssets, uploadingPath, onChange, onUpload }: ContentEditorProps) {
  const renderNode: RenderNode = (node, nodePath, label) => {
    if (Array.isArray(node)) {
      return <ArrayNode node={node} nodePath={nodePath} label={label} renderNode={renderNode} onChange={onChange} />
    }

    if (isRecord(node)) {
      return (
        <div className="space-y-5">
          {Object.entries(node).map(([key, child]) => {
            const childPath = nodePath ? `${nodePath}.${key}` : key
            const nested = isRecord(child) || Array.isArray(child)
            return nested ? (
              <div key={childPath} className="border-l border-slate-700 pl-4 sm:pl-5">
                {renderNode(child, childPath, humanize(key))}
              </div>
            ) : (
              <div key={childPath}>{renderNode(child, childPath, humanize(key))}</div>
            )
          })}
        </div>
      )
    }

    if (typeof node === 'boolean') {
      return (
        <FieldShell label={label} path={nodePath}>
          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3">
            <span className="text-sm text-slate-400">{node ? 'Enabled' : 'Disabled'}</span>
            <input type="checkbox" checked={node} onChange={(event) => onChange(nodePath, event.target.checked)} className="h-5 w-5 accent-green-500" />
          </label>
        </FieldShell>
      )
    }

    if (typeof node === 'number') {
      return (
        <FieldShell label={label} path={nodePath}>
          <input
            type="number"
            value={Number.isFinite(node) ? node : 0}
            onChange={(event) => onChange(nodePath, Number(event.target.value))}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none focus:border-yellow-500"
          />
        </FieldShell>
      )
    }

    const stringValue = node == null ? '' : String(node)

    if (nodePath === 'metadata.mode') {
      return (
        <FieldShell label={label} path={nodePath}>
          <select
            value={stringValue}
            onChange={(event) => onChange(nodePath, event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none focus:border-yellow-500"
          >
            <option value="memorial">Memorial</option>
            <option value="donor">Donor</option>
          </select>
        </FieldShell>
      )
    }

    if (nodePath === 'navy250.deadline') {
      return (
        <FieldShell label="Event date and time (Omaha)" path={nodePath}>
          <input
            type="datetime-local"
            value={toOmahaLocalInput(stringValue)}
            onChange={(event) => onChange(nodePath, omahaLocalToUtc(event.target.value))}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none focus:border-yellow-500"
          />
          <p className="mt-1.5 text-xs text-slate-500">Stored with an absolute time-zone offset so every visitor sees the same deadline.</p>
          <DeadlinePastWarning value={stringValue} />
        </FieldShell>
      )
    }

    if (isMediaPath(nodePath)) {
      return (
        <FieldShell label={label} path={nodePath}>
          <MediaInput
            value={stringValue}
            path={nodePath}
            assets={mediaAssets}
            uploading={uploadingPath === nodePath}
            onChange={(next) => onChange(nodePath, next)}
            onUpload={(file) => onUpload(file, nodePath)}
          />
        </FieldShell>
      )
    }

    const key = nodePath.split('.').pop() || ''
    const multiline = LONG_FIELD.test(key) || stringValue.length > 120
    return (
      <FieldShell label={label} path={nodePath}>
        {multiline ? (
          <textarea
            value={stringValue}
            rows={Math.min(8, Math.max(3, Math.ceil(stringValue.length / 90)))}
            onChange={(event) => onChange(nodePath, event.target.value)}
            className="w-full resize-y rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm leading-relaxed text-white outline-none focus:border-yellow-500"
          />
        ) : (
          <input
            value={stringValue}
            onChange={(event) => onChange(nodePath, event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none focus:border-yellow-500"
          />
        )}
      </FieldShell>
    )
  }

  return <>{renderNode(value, path, humanize(path.split('.').pop() || 'Content'))}</>
}
