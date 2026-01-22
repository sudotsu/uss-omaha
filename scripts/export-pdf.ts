import { ChildProcess, spawn } from 'child_process'
import fs from 'fs'
import getPort from 'get-port'
import path from 'path'
import { chromium } from 'playwright'

const OUTPUT_PATH = path.join(process.cwd(), 'dist', 'USS_Omaha_Memorial.pdf')

let serverProcess: ChildProcess | null = null

async function startServer(port: number): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log('🏗️  Building Next.js application...')

    // 1. Build first (synchronous-like)
    const build = spawn('npm', ['run', 'build'], { stdio: 'inherit', shell: true })

    build.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Build failed with code ${code}`))
        return
      }

      console.log(`🚀 Starting production server on port ${port}...`)

      // 2. Start server on dynamic port
      serverProcess = spawn('npm', ['run', 'start'], {
        env: { ...process.env, PORT: port.toString() },
        shell: true,
      })

      if (!serverProcess) return reject(new Error('Failed to spawn server'))

      // Robust timeout
      const timeoutId = setTimeout(() => {
        reject(new Error(`Server failed to start within 45s on port ${port}`))
      }, 45000)

      let resolved = false
      const onReady = () => {
        if (!resolved) {
          resolved = true
          clearTimeout(timeoutId)
          setTimeout(resolve, 3000) // Settle time
        }
      }

      serverProcess.stdout?.on('data', (data) => {
        const msg = data.toString()
        console.log(`[Server]: ${msg}`) // DEBUG LOGGING
        if (msg.toLowerCase().includes('ready') || msg.toLowerCase().includes('started')) onReady()
      })

      serverProcess.stderr?.on('data', (data) => {
        console.error(`[Server Error]: ${data.toString()}`)
      })

      serverProcess.on('error', (err) => {
         reject(err)
      })

      serverProcess.on('exit', (code) => {
         if (!resolved && code !== null && code !== 0) {
             reject(new Error(`Server process exited with code ${code}`))
         }
      })
    })
  })
}

async function exportPDF() {
  let browser
  try {
    // 1. Get a random free port to guarantee NO conflicts
    const port = await getPort()
    const url = `http://localhost:${port}/print`

    // 2. Start the server
    await startServer(port)

    // 3. Launch Browser
    console.log('🌐 Launching browser...')
    browser = await chromium.launch()
    const page = await browser.newPage()

    console.log(`📄 Navigating to ${url}...`)
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })

    // 4. Wait for Assets
    console.log('⏳ Waiting for assets (max 10s)...')
    await page.evaluate(() => document.fonts.ready)
    await page.evaluate(() => {
        const images = Array.from(document.images)
        const imagePromises = images.map(img => {
            if (img.complete) return Promise.resolve()
            return new Promise(resolve => {
                img.onload = resolve
                img.onerror = resolve
            })
        })

        // 10s timeout for assets
        const timeout = new Promise(resolve => setTimeout(resolve, 10000))
        return Promise.race([Promise.all(imagePromises), timeout])
    })

    // 5. Generate PDF
    const distDir = path.dirname(OUTPUT_PATH)
    if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true })

    console.log('📋 Generating PDF...')
    await page.pdf({
      path: OUTPUT_PATH,
      format: 'Letter',
      printBackground: true,
      preferCSSPageSize: false,
      margin: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' },
    })

    console.log(`✅ PDF exported successfully: ${OUTPUT_PATH}`)

  } catch (error) {
    console.error('❌ Export failed:', error)
    process.exit(1)
  } finally {
    if (browser) await browser.close()
    if (serverProcess) {
        console.log('🛑 Stopping server...')
        if (process.platform === 'win32') {
            spawn(`taskkill /pid ${serverProcess.pid} /t /f`, { shell: true })
        } else {
            serverProcess.kill()
        }
    }
  }
}

exportPDF()
