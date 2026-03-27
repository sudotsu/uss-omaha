'use server'

import { loadContent } from '@/lib/content'
import { ContentData } from '@/types/content'
import yaml from 'js-yaml'
import { Octokit } from 'octokit'
import { revalidatePath } from 'next/cache'

import { getSession } from '@/lib/auth'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const REPO_OWNER = process.env.REPO_OWNER || 'sudotsu'
const REPO_NAME = process.env.REPO_NAME || 'uss-omaha'
const TARGET_BRANCH = 'admin-content-updates'
const BASE_BRANCH = 'main' // The source branch to branch off from

export async function saveContent(newData: ContentData) {
  // 0. Security Check: Verify the user is actually logged in
  const session = await getSession()
  if (!session) {
    return { success: false, message: 'Unauthorized: Please log in again' }
  }

  if (!GITHUB_TOKEN) {
    console.error('GITHUB_TOKEN is not set')
    if (process.env.NODE_ENV === 'development') {
      const fs = await import('fs')
      const path = await import('path')
      const yamlStr = yaml.dump(newData, { indent: 2, lineWidth: -1 })
      fs.writeFileSync(path.join(process.cwd(), 'content.yml'), yamlStr)
      revalidatePath('/')
      return { success: true, message: 'Saved to disk (Dev Mode)' }
    }
    return { success: false, message: 'GitHub configuration missing' }
  }

  const octokit = new Octokit({ auth: GITHUB_TOKEN })

  try {
    // 1. Ensure the 'admin-content-updates' branch exists
    let branchExists = true
    try {
      await octokit.rest.repos.getBranch({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        branch: TARGET_BRANCH,
      })
    } catch (e) {
      branchExists = false
    }

    if (!branchExists) {
      // Get the SHA of the base branch
      const { data: baseRef } = await octokit.rest.git.getRef({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        ref: `heads/${BASE_BRANCH}`,
      })

      // Create the new branch
      await octokit.rest.git.createRef({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        ref: `refs/heads/${TARGET_BRANCH}`,
        sha: baseRef.object.sha,
      })
    }

    // 2. Get the current file's SHA from the target branch
    const { data: fileData } = await octokit.rest.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: 'content.yml',
      ref: TARGET_BRANCH,
    })

    if (!Array.isArray(fileData) && fileData.type === 'file') {
      const sha = fileData.sha
      const yamlStr = yaml.dump(newData, { indent: 2, lineWidth: -1 })

      // 3. Commit the change to the target branch
      await octokit.rest.repos.createOrUpdateFileContents({
        owner: REPO_OWNER,
        repo: REPO_NAME,
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
