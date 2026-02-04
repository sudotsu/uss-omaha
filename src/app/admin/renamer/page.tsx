import { RenamerClient } from '@/components/admin/RenamerClient'
import fs from 'fs'
import path from 'path'

export default function RenamerPage() {
  const dirPath = path.join(process.cwd(), 'public', 'temp_renamer_images')

  let files: string[] = []

  try {
    if (fs.existsSync(dirPath)) {
      files = fs.readdirSync(dirPath).filter(f => !f.startsWith('.'))
      // Sort numerically if they are numbers
      files.sort((a, b) => {
        const numA = parseInt(a)
        const numB = parseInt(b)
        if (!isNaN(numA) && !isNaN(numB)) return numA - numB
        return a.localeCompare(b)
      })
    }
  } catch (error) {
    console.error('Failed to read renamer directory', error)
  }

  return <RenamerClient files={files} />
}
