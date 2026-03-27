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
const TARGET_BRANCH = 'admin-content-updates'
const BASE_BRANCH = 'main'

function validateConfig() {
  if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
    throw new Error('GitHub configuration (TOKEN, OWNER, or NAME) is missing')
  }
}

export async function loadDraftContent(): Promise<ContentData> {
  if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
    return loadContent()
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
    if (e.status !== 404) {
       console.error('Error loading draft from GitHub:', e)
    }
  }

  return loadContent()
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
      const fs = await import('fs')
      const path = await import('path')
      const yamlStr = yaml.dump(newData, { indent: 2, lineWidth: -1 })
      fs.writeFileSync(path.join(process.cwd(), 'content.yml'), yamlStr)
      revalidatePath('/')
      return { success: true, message: 'Saved to disk (Dev Mode)' }
    }
    return { success: false, message: error.message }
  }

  const octokit = new Octokit({ auth: GITHUB_TOKEN })

  try {
    // 1. Check if branch exists with proper error handling
    let branchExists = true
    try {
      await octokit.rest.repos.getBranch({
        owner: REPO_OWNER!,
        repo: REPO_NAME!,
        branch: TARGET_BRANCH,
      })
    } catch (e: any) {
      if (e.status === 404) {
        branchExists = false
      } else {
        throw e // Re-throw 401, 429, 500 etc.
      }
    }

    if (!branchExists) {
      const { data: baseRef } = await octokit.rest.git.getRef({
        owner: REPO_OWNER!,
        repo: REPO_NAME!,
        ref: `heads/${BASE_BRANCH}`,
      })

      await octokit.rest.git.createRef({
        owner: REPO_OWNER!,
        repo: REPO_NAME!,
        ref: `refs/heads/${TARGET_BRANCH}`,
        sha: baseRef.object.sha,
      })
    }

    // 2. Get file SHA
    const { data: fileData } = await octokit.rest.repos.getContent({
      owner: REPO_OWNER!,
      repo: REPO_NAME!,
      path: 'content.yml',
      ref: TARGET_BRANCH,
    })

    if (!Array.isArray(fileData) && fileData.type === 'file') {
      const sha = fileData.sha
      const yamlStr = yaml.dump(newData, { indent: 2, lineWidth: -1 })

      await octokit.rest.repos.createOrUpdateFileContents({
        owner: REPO_OWNER!,
        repo: REPO_NAME!,
        path: 'content.yml',
        message: 'Update content via Admin UI (Needs Review)',
        content: Buffer.from(yamlStr).toString('base64'),
        sha: sha,
        branch: TARGET_BRANCH,
      })

      return { 
        success: true, 
        message: `Changes pushed to branch '${TARGET_BRANCH}'. Check GitHub to review and merge!` 
      }
    }
    
    return { success: false, message: 'Could not find content.yml in repo' }
  } catch (error: any) {
    console.error('GitHub API Error:', error)
    return { success: false, message: error.message || 'Failed to update GitHub' }
  }
}
