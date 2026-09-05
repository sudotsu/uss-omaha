'use server'

import { getSession } from '@/lib/auth'
import { parseContent, validateContent } from '@/lib/content-schema'
import { loadContent } from '@/lib/content'
import type { ContentData } from '@/types/content'
import yaml from 'js-yaml'
import { Octokit } from 'octokit'
import { revalidatePath } from 'next/cache'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const REPO_OWNER = process.env.REPO_OWNER
const REPO_NAME = process.env.REPO_NAME
const TARGET_BRANCH = 'main'
const CONTENT_PATH = 'content.yml'
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024

export type PublishStatus = {
  state: 'building' | 'live' | 'failed'
  label: string
  url?: string
}

export type RevisionSummary = {
  sha: string
  message: string
  date: string
  author: string
  url: string
}

export type MediaAsset = {
  path: string
  publicPath: string
  name: string
}

function validateConfig() {
  if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
    throw new Error('GitHub configuration (TOKEN, OWNER, or NAME) is missing')
  }
}

function getOctokit() {
  validateConfig()
  return new Octokit({ auth: GITHUB_TOKEN })
}

function safeLoadLocalContent(): ContentData {
  try {
    return loadContent()
  } catch (error) {
    console.error('CRITICAL: Failed to load local content.yml:', error)
    throw new Error('Site content is corrupted or missing.')
  }
}

async function requireSession() {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized: Please log in again')
}

async function readPublishedContent(octokit: Octokit) {
  const { data: fileData } = await octokit.rest.repos.getContent({
    owner: REPO_OWNER!,
    repo: REPO_NAME!,
    path: CONTENT_PATH,
    ref: TARGET_BRANCH,
  })

  if (Array.isArray(fileData) || fileData.type !== 'file') {
    throw new Error('Could not read content.yml from the repository.')
  }

  const raw = Buffer.from(fileData.content, 'base64').toString('utf8')
  return {
    content: parseContent(yaml.load(raw)),
    raw,
    sha: fileData.sha,
  }
}

export async function loadDraftContent(): Promise<{ content: ContentData; sha: string | null }> {
  if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
    return { content: safeLoadLocalContent(), sha: null }
  }

  const octokit = new Octokit({ auth: GITHUB_TOKEN })
  try {
    const published = await readPublishedContent(octokit)
    return { content: published.content, sha: published.sha }
  } catch (error: any) {
    if (error?.status !== 404) console.error('Error loading published content from GitHub:', error)
    return { content: safeLoadLocalContent(), sha: null }
  }
}

export async function saveContent(newData: ContentData, expectedSha: string | null) {
  try {
    await requireSession()
  } catch (error: any) {
    return { success: false as const, message: error.message }
  }

  const validation = validateContent(newData)
  if (!validation.success) return { success: false as const, message: `Cannot publish: ${validation.message}` }

  if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
    if (process.env.NODE_ENV === 'development') {
      try {
        const fs = await import('fs')
        const path = await import('path')
        const yamlStr = yaml.dump(validation.data, { indent: 2, lineWidth: -1 })
        fs.writeFileSync(path.join(process.cwd(), CONTENT_PATH), yamlStr)
        revalidatePath('/')
        revalidatePath('/print')
        return { success: true as const, changed: true, message: 'Saved to disk (Dev Mode)', contentSha: expectedSha || undefined }
      } catch (error: any) {
        return { success: false as const, message: `Dev Mode Save Failed: ${error.message}` }
      }
    }
    return { success: false as const, message: 'GitHub configuration is missing.' }
  }

  const octokit = new Octokit({ auth: GITHUB_TOKEN })
  try {
    const published = await readPublishedContent(octokit)

    if (!expectedSha || published.sha !== expectedSha) {
      return {
        success: false as const,
        stale: true as const,
        message: 'The live content changed after this editor was opened. Your edits were preserved and can be merged with the latest version.',
        latestContent: published.content,
        latestSha: published.sha,
      }
    }

    if (JSON.stringify(published.content) === JSON.stringify(validation.data)) {
      return {
        success: true as const,
        changed: false,
        message: 'Everything is already published.',
        contentSha: published.sha,
      }
    }

    const yamlStr = yaml.dump(validation.data, { indent: 2, lineWidth: -1 })
    const { data: update } = await octokit.rest.repos.createOrUpdateFileContents({
      owner: REPO_OWNER!,
      repo: REPO_NAME!,
      path: CONTENT_PATH,
      message: 'Update site content via Admin UI',
      content: Buffer.from(yamlStr).toString('base64'),
      sha: published.sha,
      branch: TARGET_BRANCH,
    })

    revalidatePath('/')
    revalidatePath('/print')

    return {
      success: true as const,
      changed: true,
      message: 'Published. Deployment is now being verified.',
      contentSha: update.content?.sha || published.sha,
      commitSha: update.commit.sha,
      commitUrl: update.commit.html_url || undefined,
    }
  } catch (error: any) {
    console.error('GitHub save failed:', error)
    return { success: false as const, message: error?.message || 'Failed to publish content.' }
  }
}

export async function getPublishStatus(commitSha: string): Promise<PublishStatus> {
  await requireSession()
  const octokit = getOctokit()

  try {
    const [{ data: statuses }, { data: checks }, { data: deployments }] = await Promise.all([
      octokit.rest.repos.getCombinedStatusForRef({ owner: REPO_OWNER!, repo: REPO_NAME!, ref: commitSha }),
      octokit.rest.checks.listForRef({ owner: REPO_OWNER!, repo: REPO_NAME!, ref: commitSha, per_page: 100 }),
      octokit.rest.repos.listDeployments({ owner: REPO_OWNER!, repo: REPO_NAME!, sha: commitSha, per_page: 10 }),
    ])

    const vercelStatuses = statuses.statuses.filter((status) => status.context.toLowerCase().includes('vercel'))
    const vercelChecks = checks.check_runs.filter((check) => {
      const haystack = `${check.name} ${check.app?.name || ''}`.toLowerCase()
      return haystack.includes('vercel')
    })

    let deploymentState: string | undefined
    let deploymentUrl: string | undefined
    for (const deployment of deployments.slice(0, 5)) {
      const { data: deploymentStatuses } = await octokit.rest.repos.listDeploymentStatuses({
        owner: REPO_OWNER!,
        repo: REPO_NAME!,
        deployment_id: deployment.id,
        per_page: 1,
      })
      const latest = deploymentStatuses[0]
      if (!latest) continue
      deploymentState = latest.state
      deploymentUrl = latest.environment_url || latest.target_url || undefined
      if (latest.state === 'success' || ['error', 'failure'].includes(latest.state)) break
    }

    const failedStatus = vercelStatuses.find((status) => ['failure', 'error'].includes(status.state))
    const failedCheck = vercelChecks.find((check) => ['failure', 'cancelled', 'timed_out', 'action_required'].includes(check.conclusion || ''))
    if (failedStatus || failedCheck || (deploymentState && ['error', 'failure'].includes(deploymentState))) {
      return {
        state: 'failed',
        label: 'Deployment failed',
        url: failedStatus?.target_url || failedCheck?.details_url || deploymentUrl,
      }
    }

    const successful = vercelStatuses.some((status) => status.state === 'success')
      || vercelChecks.some((check) => check.conclusion === 'success')
      || deploymentState === 'success'
    if (successful) {
      return {
        state: 'live',
        label: 'Live',
        url: vercelStatuses.find((status) => status.state === 'success')?.target_url
          || vercelChecks.find((check) => check.conclusion === 'success')?.details_url
          || deploymentUrl
          || '/',
      }
    }

    const pending = vercelStatuses.some((status) => status.state === 'pending')
      || vercelChecks.some((check) => check.status !== 'completed')
      || (deploymentState != null && ['queued', 'pending', 'in_progress'].includes(deploymentState))
    if (pending || vercelStatuses.length || vercelChecks.length || deployments.length) {
      return { state: 'building', label: 'Building', url: vercelStatuses[0]?.target_url || vercelChecks[0]?.details_url || deploymentUrl }
    }

    return { state: 'building', label: 'Published; awaiting deployment signal' }
  } catch (error) {
    console.error('Could not read deployment status:', error)
    return { state: 'building', label: 'Published; deployment status unavailable' }
  }
}

export async function getContentRevisions(): Promise<RevisionSummary[]> {
  await requireSession()
  const octokit = getOctokit()
  const { data } = await octokit.rest.repos.listCommits({
    owner: REPO_OWNER!,
    repo: REPO_NAME!,
    sha: TARGET_BRANCH,
    path: CONTENT_PATH,
    per_page: 12,
  })

  return data.map((commit) => ({
    sha: commit.sha,
    message: commit.commit.message.split('\n')[0],
    date: commit.commit.committer?.date || commit.commit.author?.date || '',
    author: commit.commit.author?.name || commit.author?.login || 'Unknown',
    url: commit.html_url,
  }))
}

export async function restoreRevision(commitSha: string, expectedSha: string | null) {
  try {
    await requireSession()
    const octokit = getOctokit()
    const current = await readPublishedContent(octokit)

    if (!expectedSha || current.sha !== expectedSha) {
      return {
        success: false as const,
        stale: true as const,
        message: 'The live content changed before the rollback could be applied. Reload revisions and try again.',
        latestContent: current.content,
        latestSha: current.sha,
      }
    }

    const { data: oldFile } = await octokit.rest.repos.getContent({
      owner: REPO_OWNER!,
      repo: REPO_NAME!,
      path: CONTENT_PATH,
      ref: commitSha,
    })
    if (Array.isArray(oldFile) || oldFile.type !== 'file') throw new Error('Revision content could not be read.')

    const oldRaw = Buffer.from(oldFile.content, 'base64').toString('utf8')
    const oldContent = parseContent(yaml.load(oldRaw))
    const yamlStr = yaml.dump(oldContent, { indent: 2, lineWidth: -1 })

    const { data: update } = await octokit.rest.repos.createOrUpdateFileContents({
      owner: REPO_OWNER!,
      repo: REPO_NAME!,
      path: CONTENT_PATH,
      message: `Restore site content from ${commitSha.slice(0, 7)}`,
      content: Buffer.from(yamlStr).toString('base64'),
      sha: current.sha,
      branch: TARGET_BRANCH,
    })

    revalidatePath('/')
    revalidatePath('/print')

    return {
      success: true as const,
      content: oldContent,
      contentSha: update.content?.sha || current.sha,
      commitSha: update.commit.sha,
      message: 'Revision restored and published.',
    }
  } catch (error: any) {
    console.error('Rollback failed:', error)
    return { success: false as const, message: error?.message || 'Rollback failed.' }
  }
}

function safeFilename(name: string) {
  const base = name.split(/[\\/]/).pop() || 'image'
  return base.toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'image'
}

export async function uploadMedia(formData: FormData) {
  try {
    await requireSession()
    const file = formData.get('file')
    if (!(file instanceof File)) return { success: false as const, message: 'Choose an image to upload.' }
    if (file.size <= 0) return { success: false as const, message: 'The selected image is empty.' }
    if (file.size > MAX_UPLOAD_BYTES) return { success: false as const, message: 'Images must be 8 MB or smaller.' }

    const allowed = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
    if (!allowed.has(file.type)) return { success: false as const, message: 'Use JPG, PNG, WebP, or GIF images.' }

    const octokit = getOctokit()
    const filename = `${Date.now()}-${safeFilename(file.name)}`
    const repoPath = `public/images/uploads/${filename}`
    const bytes = Buffer.from(await file.arrayBuffer())

    const { data: update } = await octokit.rest.repos.createOrUpdateFileContents({
      owner: REPO_OWNER!,
      repo: REPO_NAME!,
      path: repoPath,
      message: `Upload admin media: ${filename}`,
      content: bytes.toString('base64'),
      branch: TARGET_BRANCH,
    })

    return {
      success: true as const,
      message: 'Image uploaded.',
      path: `/images/uploads/${filename}`,
      commitSha: update.commit.sha,
    }
  } catch (error: any) {
    console.error('Media upload failed:', error)
    return { success: false as const, message: error?.message || 'Image upload failed.' }
  }
}

export async function listMediaAssets(): Promise<MediaAsset[]> {
  await requireSession()
  const octokit = getOctokit()

  const { data: commit } = await octokit.rest.repos.getCommit({
    owner: REPO_OWNER!,
    repo: REPO_NAME!,
    ref: TARGET_BRANCH,
  })
  const treeSha = commit.commit.tree.sha
  const { data: tree } = await octokit.rest.git.getTree({
    owner: REPO_OWNER!,
    repo: REPO_NAME!,
    tree_sha: treeSha,
    recursive: 'true',
  })

  return tree.tree
    .filter((item) => item.type === 'blob' && !!item.path && /^public\/images\//.test(item.path) && /\.(png|jpe?g|webp|gif)$/i.test(item.path))
    .map((item) => ({
      path: item.path!,
      publicPath: item.path!.replace(/^public/, ''),
      name: item.path!.split('/').pop() || item.path!,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, 300)
}
