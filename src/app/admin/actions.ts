'use server'

import { loadContent } from '@/lib/content'
import { ContentData } from '@/types/content'
import yaml from 'js-yaml'
import { Octokit } from 'octokit'
import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const REPO_OWNER = process.env.REPO_OWNER
const REPO_NAME = process.env.REPO_NAME
const TARGET_BRANCH = 'main'

function validateConfig() {
  if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
    throw new Error('GitHub configuration (TOKEN, OWNER, or NAME) is missing')
  }
}

// Wrapper to safely load local content
function safeLoadLocalContent(): ContentData {
  try {
    return loadContent()
  } catch (e) {
    console.error('CRITICAL: Failed to load local content.yml:', e)
    throw new Error('Site content is corrupted or missing.')
  }
}

export async function loadDraftContent(): Promise<ContentData> {
  if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
    return safeLoadLocalContent()
  }

  const octokit = new Octokit({ auth: GITHUB_TOKEN })

  try {
    const { data: fileData } = await octokit.rest.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: 'content.yml',
      ref: TARGET_BRANCH,
    })

    if (!Array.isArray(fileData) && fileData.type === 'file') {
      const content = Buffer.from(fileData.content, 'base64').toString('utf8')
      return yaml.load(content) as ContentData
    }
  } catch (e: any) {
    // Only swallow 404s (branch/file doesn't exist)
    // If it's a 401 (Auth) or 403 (Rate limit), we want to see it in the logs
    if (e.status !== 404) {
       console.error('Error loading draft from GitHub:', e)
       // We still fall back to local content so the UI doesn't crash
    }
  }

  return safeLoadLocalContent()
}

function validateContent(data: ContentData) {
  const requiredSections = [
    'metadata', 'hero', 'mission', 'agenda', 'background',
    'letters', 'submarineFacts', 'timeline', 'phases',
    'fundraisingProgress', 'budget', 'locationShift',
    'sitePlan', 'gallery', 'executionPhotos', 'whyNow',
    'callToAction', 'volunteer', 'stakeholders', 'close',
    'presentedBy', 'footer', 'navy250',
  ]

  const missing = requiredSections.filter((key) => !(data as any)?.[key])
  if (missing.length > 0) {
    throw new Error(`Cannot publish: missing sections [${missing.join(', ')}]`)
  }
  if (!Array.isArray(data.agenda.items)) throw new Error('Cannot publish: agenda items are invalid')
  if (!Array.isArray(data.phases.phaseList)) throw new Error('Cannot publish: project phases are invalid')
  if (!Array.isArray(data.gallery.images)) throw new Error('Cannot publish: gallery images are invalid')
}

export async function saveContent(newData: ContentData) {
  const session = await getSession()
  if (!session) {
    return { success: false, message: 'Unauthorized: Please log in again' }
  }

  try {
    validateConfig()
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      try {
        const fs = await import('fs')
        const path = await import('path')
        const yamlStr = yaml.dump(newData, { indent: 2, lineWidth: -1 })
        fs.writeFileSync(path.join(process.cwd(), 'content.yml'), yamlStr)
        revalidatePath('/')
        return { success: true, message: 'Saved to disk (Dev Mode)' }
      } catch (e: any) {
        return { success: false, message: 'Dev Mode Save Failed: ' + e.message }
      }
    }
    return { success: false, message: error.message }
  }

  const octokit = new Octokit({ auth: GITHUB_TOKEN })

  try {
    validateContent(newData)

    // Read the latest published file so concurrent or duplicate saves fail safely
    let fileData: any
    try {
      const response = await octokit.rest.repos.getContent({
        owner: REPO_OWNER!,
        repo: REPO_NAME!,
        path: 'content.yml',
        ref: TARGET_BRANCH,
      })
      fileData = response.data
    } catch (e: any) {
      if (e.status === 404) {
        return { success: false, message: 'Could not find content.yml in the repository.' }
      }
      throw e
    }

    if (!Array.isArray(fileData) && fileData.type === 'file') {
      const sha = fileData.sha
      const currentYaml = Buffer.from(fileData.content, 'base64').toString('utf8')
      const yamlStr = yaml.dump(newData, { indent: 2, lineWidth: -1 })

      if (currentYaml.trim() === yamlStr.trim()) {
        return { success: true, changed: false, message: 'Everything is already published.' }
      }

      const { data: update } = await octokit.rest.repos.createOrUpdateFileContents({
        owner: REPO_OWNER!,
        repo: REPO_NAME!,
        path: 'content.yml',
        message: 'Publish content via Admin Portal',
        content: Buffer.from(yamlStr).toString('base64'),
        sha: sha,
        branch: TARGET_BRANCH,
      })

      revalidatePath('/')

      return {
        success: true,
        changed: true,
        message: 'Published. The live site is updating now.',
        commitUrl: update.commit.html_url,
      }
    }
    
    return { success: false, message: 'Invalid file type found in repo' }
  } catch (error: any) {
    console.error('GitHub API Error:', error)
    return { success: false, message: error.message || 'Failed to update GitHub' }
  }
}
