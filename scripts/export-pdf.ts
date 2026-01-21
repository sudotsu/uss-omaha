import fs from 'fs'
import path from 'path'
import { chromium } from 'playwright'

const PORT = 3000
const PRINT_URL = `http://localhost:${PORT}/print`
const OUTPUT_PATH = path.join(process.cwd(), 'dist', 'USS_Omaha_Memorial.pdf')

async function checkServer(): Promise<boolean> {
  try {
    const response = await fetch(PRINT_URL, { method: 'HEAD' })
    return response.ok
  } catch (e) {
    return false
  }
}

async function exportPDF() {
  console.log(`🔍 Checking for running server at ${PRINT_URL}...`)
  const isServerRunning = await checkServer()

  if (!isServerRunning) {
    console.error(`
❌ No server detected at ${PRINT_URL}
---------------------------------------------------------
Please start the server in a separate terminal:
  1. Open a new terminal
  2. Run: npm run dev
  3. Wait for it to be ready
  4. Run this script again: npm run export:pdf
---------------------------------------------------------
`)
    process.exit(1)
  }

  console.log('✅ Server detected.')

  let browser

  try {
    console.log('🌐 Launching browser...')
    browser = await chromium.launch()
    const page = await browser.newPage()

    console.log(`📄 Navigating to ${PRINT_URL}...`)
    await page.goto(PRINT_URL, {
      waitUntil: 'networkidle',
      timeout: 60000
    })

    console.log('⏳ Waiting for fonts and images to load...')

    // Wait for fonts to be ready
    await page.evaluate(() => document.fonts.ready)

    // Wait for all images to complete loading (with timeout)
    await page.evaluate(() => {
      const images = Array.from(document.images)
      const imagePromises = images.map((img) => {
        if (img.complete) return Promise.resolve()
        return new Promise((resolve) => {
          img.onload = resolve
          img.onerror = resolve // Resolve even on error to prevent hanging
        })
      })

      // Limit wait to 5 seconds max (local images should be fast)
      const timeout = new Promise((resolve) => setTimeout(resolve, 5000))
      return Promise.race([Promise.all(imagePromises), timeout])
    })

    // Wait for two animation frames to ensure layout is settled
    await page.evaluate(() => {
      return new Promise((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(resolve)
        })
      })
    })

    console.log('✅ Page fully loaded and settled')

    const distDir = path.dirname(OUTPUT_PATH)
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true })
    }

    console.log('📋 Generating PDF...')
    await page.pdf({
      path: OUTPUT_PATH,
      format: 'Letter',
      printBackground: true,
      preferCSSPageSize: false,
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in',
      },
    })

    console.log(`✅ PDF exported successfully to ${OUTPUT_PATH}`)
  } catch (error) {
    console.error('❌ PDF export failed:', error)
    process.exit(1)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

exportPDF()
