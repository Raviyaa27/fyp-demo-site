import puppeteer from 'puppeteer'
import { writeFileSync, mkdirSync } from 'node:fs'

const URL = 'http://localhost:5173/#/architecture'
const OUT = 'export'
mkdirSync(OUT, { recursive: true })

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: 1680, height: 1200, deviceScaleFactor: 3 })
await page.goto(URL, { waitUntil: 'networkidle0' })

// wait for the big isometric SVG (viewBox contains 1440) to mount
await page.waitForFunction(
  () => [...document.querySelectorAll('svg')].some((s) => (s.getAttribute('viewBox') || '').includes('1440')),
  { timeout: 20000 },
)
// let entrance animations settle
await new Promise((r) => setTimeout(r, 1200))

const handle = await page.evaluateHandle(() =>
  [...document.querySelectorAll('svg')].find((s) => (s.getAttribute('viewBox') || '').includes('1440')),
)

// 1) standalone SVG (vector, scales forever)
const svgMarkup = await page.evaluate((el) => {
  const clone = el.cloneNode(true)
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')
  const vb = (el.getAttribute('viewBox') || '0 0 1440 1000').split(' ')
  clone.setAttribute('width', vb[2])
  clone.setAttribute('height', vb[3])
  return clone.outerHTML
}, handle)
writeFileSync(`${OUT}/fyp-architecture-diagram.svg`, `<?xml version="1.0" encoding="UTF-8"?>\n` + svgMarkup)

// 2) high-res PNG of the diagram on a white card
const png = await handle.screenshot({ omitBackground: false })
writeFileSync(`${OUT}/fyp-architecture-diagram.png`, png)

const box = await handle.boundingBox()
console.log('Exported. PNG pixel size ~', Math.round(box.width * 3) + 'x' + Math.round(box.height * 3))

await browser.close()
