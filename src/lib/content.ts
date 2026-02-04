import type { ContentData } from '@/types/content'
import fs from 'fs'
import yaml from 'js-yaml'
import path from 'path'

export function loadContent(): ContentData {
  const contentPath = path.join(process.cwd(), 'content.yml')
  const fileContents = fs.readFileSync(contentPath, 'utf8')
  const content = yaml.load(fileContents) as ContentData
  return content
}
