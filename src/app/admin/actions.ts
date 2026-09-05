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

export async function loadDraftContent(): Promise<{ content: ContentData; sha: string | null }> {
  if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
    return { content: safeLoadLocalContent(), sha: null }
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
      return { content: yaml.load(content) as ContentData, sha: fileData.sha }
    }
  } catch (e: any) {
    // Only swallow 404s (branch/file doesn't exist)
    // If it's a 401 (Auth) or 403 (Rate limit), we want to see it in the logs
    if (e.status !== 404) {
       console.error('Error loading draft from GitHub:', e)
       // We still fall back to local content so the UI doesn't crash
    }
  }

  return { content: safeLoadLocalContent(), sha: null }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function validateContent(data: ContentData) {
  const root = data as unknown
  if (!isRecord(root)) throw new Error('Cannot publish: content must be an object')

  const objectAt = (parent: Record<string, unknown>, key: string) => {
    const value = parent[key]
    if (!isRecord(value)) throw new Error(`Cannot publish: ${key} must be an object`)
    return value
  }
  const stringAt = (parent: Record<string, unknown>, key: string, path = key) => {
    if (typeof parent[key] !== 'string') throw new Error(`Cannot publish: ${path} must be text`)
  }
  const numberAt = (parent: Record<string, unknown>, key: string, path = key) => {
    if (typeof parent[key] !== 'number' || !Number.isFinite(parent[key])) {
      throw new Error(`Cannot publish: ${path} must be a number`)
    }
  }
  const stringsAt = (parent: Record<string, unknown>, key: string, path = key) => {
    const value = parent[key]
    if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
      throw new Error(`Cannot publish: ${path} must be a list of text values`)
    }
  }
  const objectsAt = (
    parent: Record<string, unknown>,
    key: string,
    fields: Record<string, 'string' | 'number'>,
    path = key,
  ) => {
    const value = parent[key]
    if (!Array.isArray(value)) throw new Error(`Cannot publish: ${path} must be a list`)
    value.forEach((item, index) => {
      if (!isRecord(item)) throw new Error(`Cannot publish: ${path}[${index}] must be an object`)
      Object.entries(fields).forEach(([field, type]) => {
        if (typeof item[field] !== type) {
          throw new Error(`Cannot publish: ${path}[${index}].${field} must be ${type === 'string' ? 'text' : 'a number'}`)
        }
      })
    })
  }

  const metadata = objectAt(root, 'metadata')
  ;['title', 'subtitle', 'year', 'mode'].forEach((key) => stringAt(metadata, key, `metadata.${key}`))
  if (!['memorial', 'donor'].includes(metadata.mode as string)) throw new Error('Cannot publish: metadata.mode is invalid')

  const hero = objectAt(root, 'hero')
  ;['heading', 'subheading', 'backgroundImage'].forEach((key) => stringAt(hero, key, `hero.${key}`))

  const mission = objectAt(root, 'mission')
  ;['heading', 'statement'].forEach((key) => stringAt(mission, key, `mission.${key}`))
  stringsAt(mission, 'highlights', 'mission.highlights')

  const agenda = objectAt(root, 'agenda')
  stringAt(agenda, 'heading', 'agenda.heading')
  objectsAt(agenda, 'items', { title: 'string', description: 'string' }, 'agenda.items')

  const background = objectAt(root, 'background')
  stringAt(background, 'heading', 'background.heading')
  stringsAt(background, 'paragraphs', 'background.paragraphs')
  stringsAt(background, 'keyPoints', 'background.keyPoints')
  objectsAt(background, 'milestones', { year: 'string', month: 'string', event: 'string' }, 'background.milestones')

  const letters = objectAt(root, 'letters')
  ;['heading', 'description'].forEach((key) => stringAt(letters, key, `letters.${key}`))
  objectsAt(letters, 'items', { title: 'string', image: 'string', excerpt: 'string' }, 'letters.items')

  const facts = objectAt(root, 'submarineFacts')
  ;['heading', 'image'].forEach((key) => stringAt(facts, key, `submarineFacts.${key}`))
  objectsAt(facts, 'facts', { label: 'string', value: 'string' }, 'submarineFacts.facts')

  const timeline = objectAt(root, 'timeline')
  stringAt(timeline, 'heading', 'timeline.heading')
  objectsAt(timeline, 'milestones', { date: 'string', title: 'string', details: 'string' }, 'timeline.milestones')

  const phases = objectAt(root, 'phases')
  stringAt(phases, 'heading', 'phases.heading')
  objectsAt(phases, 'phaseList', {
    number: 'number', title: 'string', description: 'string', status: 'string', cost: 'string', percentComplete: 'number',
  }, 'phases.phaseList')

  const progress = objectAt(root, 'fundraisingProgress')
  ;['raised', 'goal', 'donorCount'].forEach((key) => numberAt(progress, key, `fundraisingProgress.${key}`))
  stringAt(progress, 'lastGiftTime', 'fundraisingProgress.lastGiftTime')

  const budget = objectAt(root, 'budget')
  ;['heading', 'totalRemaining', 'note'].forEach((key) => stringAt(budget, key, `budget.${key}`))

  const location = objectAt(root, 'locationShift')
  ;['heading', 'subtitle', 'floodImage', 'floodCaption', 'newLocationHeading', 'newLocationBody', 'mapImage'].forEach(
    (key) => stringAt(location, key, `locationShift.${key}`),
  )
  if (location.mapCaption !== undefined) stringAt(location, 'mapCaption', 'locationShift.mapCaption')

  const sitePlan = objectAt(root, 'sitePlan')
  ;['heading', 'description', 'detail', 'renderImage'].forEach((key) => stringAt(sitePlan, key, `sitePlan.${key}`))

  const gallery = objectAt(root, 'gallery')
  stringAt(gallery, 'heading', 'gallery.heading')
  objectsAt(gallery, 'images', { src: 'string', caption: 'string' }, 'gallery.images')

  const execution = objectAt(root, 'executionPhotos')
  stringAt(execution, 'heading', 'executionPhotos.heading')
  objectsAt(execution, 'photos', { src: 'string', caption: 'string', year: 'string' }, 'executionPhotos.photos')

  const whyNow = objectAt(root, 'whyNow')
  ;['heading', 'tagline'].forEach((key) => stringAt(whyNow, key, `whyNow.${key}`))
  objectsAt(whyNow, 'projects', { name: 'string', cost: 'string' }, 'whyNow.projects')
  const memorial = objectAt(whyNow, 'memorial')
  ;['name', 'cost'].forEach((key) => stringAt(memorial, key, `whyNow.memorial.${key}`))

  const validateCta = (modeName: string) => {
    const ctaRoot = objectAt(root, 'callToAction')
    const mode = objectAt(ctaRoot, modeName)
    ;['heading', 'tagline', 'donationHeading', 'taxNote', 'pledgeFormText', 'pledgeFormUrl'].forEach(
      (key) => stringAt(mode, key, `callToAction.${modeName}.${key}`),
    )
    const primary = objectAt(mode, 'primaryOrg')
    ;['name', 'ein', 'website', 'email', 'phone'].forEach(
      (key) => stringAt(primary, key, `callToAction.${modeName}.primaryOrg.${key}`),
    )
    const mailing = objectAt(primary, 'mailingAddress')
    ;['attention', 'address', 'city'].forEach(
      (key) => stringAt(mailing, key, `callToAction.${modeName}.primaryOrg.mailingAddress.${key}`),
    )
    const alternate = objectAt(mode, 'alternateOrg')
    ;['name', 'ein', 'note'].forEach(
      (key) => stringAt(alternate, key, `callToAction.${modeName}.alternateOrg.${key}`),
    )
    if (mode.trustIndicators !== undefined) stringsAt(mode, 'trustIndicators', `callToAction.${modeName}.trustIndicators`)
  }
  validateCta('memorial')
  validateCta('donor')

  const volunteer = objectAt(root, 'volunteer')
  ;['heading', 'subheading'].forEach((key) => stringAt(volunteer, key, `volunteer.${key}`))
  if (volunteer.contact !== undefined) {
    const contact = objectAt(volunteer, 'contact')
    stringAt(contact, 'email', 'volunteer.contact.email')
    if (contact.name !== undefined) stringAt(contact, 'name', 'volunteer.contact.name')
    if (contact.phone !== undefined) stringAt(contact, 'phone', 'volunteer.contact.phone')
  }
  if (volunteer.opportunities !== undefined) stringsAt(volunteer, 'opportunities', 'volunteer.opportunities')
  if (volunteer.organization !== undefined) stringAt(volunteer, 'organization', 'volunteer.organization')
  if (volunteer.organizationContact !== undefined) stringAt(volunteer, 'organizationContact', 'volunteer.organizationContact')

  const stakeholders = objectAt(root, 'stakeholders')
  stringAt(stakeholders, 'heading', 'stakeholders.heading')
  objectsAt(stakeholders, 'members', { name: 'string', title: 'string' }, 'stakeholders.members')

  const close = objectAt(root, 'close')
  ;['heading', 'subheading'].forEach((key) => stringAt(close, key, `close.${key}`))
  const contactInfo = objectAt(close, 'contactInfo')
  ;['organization', 'website', 'contact'].forEach((key) => stringAt(contactInfo, key, `close.contactInfo.${key}`))

  const presented = objectAt(root, 'presentedBy')
  stringAt(presented, 'heading', 'presentedBy.heading')
  objectsAt(presented, 'presenters', { name: 'string', org: 'string', title: 'string' }, 'presentedBy.presenters')

  const footer = objectAt(root, 'footer')
  stringsAt(footer, 'address', 'footer.address')
  const footerContact = objectAt(footer, 'contact')
  ;['name', 'email', 'phone'].forEach((key) => stringAt(footerContact, key, `footer.contact.${key}`))
  objectsAt(footer, 'quickLinks', { label: 'string', href: 'string' }, 'footer.quickLinks')
  objectsAt(footer, 'logos', { src: 'string', alt: 'string' }, 'footer.logos')

  const navy = objectAt(root, 'navy250')
  ;['logo', 'heading', 'subheading', 'subtitle'].forEach((key) => stringAt(navy, key, `navy250.${key}`))
  ;['deadline', 'deadlineLabel', 'deadlineText'].forEach((key) => {
    if (navy[key] !== undefined) stringAt(navy, key, `navy250.${key}`)
  })
  stringsAt(navy, 'images', 'navy250.images')
}

export async function saveContent(newData: ContentData, expectedSha: string | null) {
  const session = await getSession()
  if (!session) {
    return { success: false, message: 'Unauthorized: Please log in again' }
  }

  try {
    validateContent(newData)
  } catch (error: any) {
    return { success: false, message: error.message || 'Cannot publish invalid content' }
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
      if (!expectedSha || fileData.sha !== expectedSha) {
        return {
          success: false,
          message: 'The site changed after this page was opened. Refresh before publishing so nobody else\'s changes are overwritten.',
        }
      }

      const sha = fileData.sha
      const currentYaml = Buffer.from(fileData.content, 'base64').toString('utf8')
      const yamlStr = yaml.dump(newData, { indent: 2, lineWidth: -1 })

      const currentData = yaml.load(currentYaml)
      if (JSON.stringify(currentData) === JSON.stringify(newData)) {
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
        contentSha: update.content?.sha ?? null,
      }
    }
    
    return { success: false, message: 'Invalid file type found in repo' }
  } catch (error: any) {
    console.error('GitHub API Error:', error)
    return { success: false, message: error.message || 'Failed to update GitHub' }
  }
}
