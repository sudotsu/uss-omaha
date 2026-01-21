import { ChildProcess, spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import { chromium } from 'playwright'

const PORT = 3000
const PRINT_URL = `http://localhost:${PORT}/print`
const OUTPUT_PATH = path.join(process.cwd(), 'dist', 'USS_Omaha_Memorial.pdf')

let serverProcess: ChildProcess | null = null

async function startServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log('🏗️  Building Next.js application using npm...')

    const buildProcess = spawn('npm', ['run', 'build'], {
      stdio: 'inherit',
      shell: true,
    })

    buildProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Build failed with code ${code}`))
        return
      }

      console.log('✅ Build complete')
      console.log(`🚀 Starting server on port ${PORT}...`)

      serverProcess = spawn('npm', ['run', 'start'], {
        env: { ...process.env, PORT: PORT.toString() },
        shell: true,
      })

      serverProcess.stdout?.on('data', (data) => {
        const output = data.toString()
        console.log(output)
        if (output.includes('ready') || output.includes('started')) {
          setTimeout(resolve, 2000)
        }
      })

      serverProcess.stderr?.on('data', (data) => {
        console.error(data.toString())
      })

      serverProcess.on('error', (error) => {
        reject(error)
      })

      setTimeout(resolve, 5000)
    })
  })
}

function stopServer(): void {
  if (serverProcess) {
    console.log('🛑 Stopping server...')
    serverProcess.kill()
    serverProcess = null
  }
}

async function exportPDF() {
  let browser

  try {
    await startServer()

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

    // Wait for all images to complete loading
    await page.evaluate(() => {
      const images = Array.from(document.images)
      return Promise.all(
        images.map((img) => {
          if (img.complete) return Promise.resolve()
          return new Promise((resolve) => {
            img.onload = resolve
            img.onerror = resolve // Resolve even on error to prevent hanging
          })
        })
      )
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
    stopServer()
  }
}

process.on('SIGINT', () => {
  stopServer()
  process.exit(0)
})

process.on('SIGTERM', () => {
  stopServer()
  process.exit(0)
})

exportPDF()
