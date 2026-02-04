import fs from 'fs'
import path from 'path'
import { chromium } from 'playwright'

const EXAMPLES_DIR = path.join(process.cwd(), 'examples')
const OUTPUT_FILE = path.join(process.cwd(), 'examples', 'merged-slides.pdf')

async function mergeImages() {
  console.log(`📂 Reading images from ${EXAMPLES_DIR}...`)

  if (!fs.existsSync(EXAMPLES_DIR)) {
      console.error(`❌ Directory not found: ${EXAMPLES_DIR}`)
      process.exit(1)
  }

  const fileNames = fs.readdirSync(EXAMPLES_DIR).filter(f => f.toLowerCase().endsWith('.png') || f.toLowerCase().endsWith('.jpg'))

  if (fileNames.length === 0) {
      console.error('❌ No images found to merge')
      process.exit(1)
  }

  console.log(`📸 Found ${fileNames.length} images. Processing...`)

  // Convert images to base64 to embed safely without a server
  const imagesHtml = fileNames.map(fileName => {
    const filePath = path.join(EXAMPLES_DIR, fileName)
    const base64 = fs.readFileSync(filePath, 'base64')
    const ext = path.extname(fileName).substring(1)
    const dataUri = `data:image/${ext};base64,${base64}`

    return `
      <div class="slide">
        <div class="image-container">
            <img src="${dataUri}" />
        </div>
        <div class="caption">${fileName}</div>
      </div>
    `
  }).join('')

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { margin: 0; padding: 0; background: #1a1a1a; font-family: 'Segoe UI', sans-serif; }
        .slide {
          width: 100vw;
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          page-break-after: always;
          position: relative;
        }
        .image-container {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 95%;
            height: 90%;
            padding: 20px;
        }
        img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          border-radius: 8px;
        }
        .caption {
          color: #888;
          height: 40px;
          display: flex;
          align-items: center;
          font-size: 14px;
          font-family: monospace;
          background: #000;
          color: lime;
          padding: 4px 12px;
          border-radius: 4px;
          margin-bottom: 20px;
        }
      </style>
    </head>
    <body>
      ${imagesHtml}
    </body>
    </html>
  `

  console.log('🌐 Launching browser for PDF generation...')
  const browser = await chromium.launch()
  const page = await browser.newPage()

  await page.setContent(htmlContent)

  console.log('📋 Exporting to PDF...')
  // Use a standard landscape size
  await page.pdf({
    path: OUTPUT_FILE,
    printBackground: true,
    width: '1280px',
    height: '720px',
  })

  await browser.close()
  console.log(`✅ Merged PDF created successfully at:`)
  console.log(OUTPUT_FILE)
}

mergeImages().catch(error => {
    console.error('❌ Failed:', error)
    process.exit(1)
})
