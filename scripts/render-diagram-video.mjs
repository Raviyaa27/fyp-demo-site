import puppeteer from 'puppeteer'
import { spawnSync } from 'node:child_process'
import { mkdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import ffmpeg from '@ffmpeg-installer/ffmpeg'

const URL = 'http://localhost:5173/#/architecture'
const FPS = 30
const DURATION = 20 // seconds
const FRAMES = FPS * DURATION
const OUT_DIR = 'export'
const FRAME_DIR = join(tmpdir(), 'fyp-arch-frames')

rmSync(FRAME_DIR, { recursive: true, force: true })
mkdirSync(FRAME_DIR, { recursive: true })
mkdirSync(OUT_DIR, { recursive: true })

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 1024, deviceScaleFactor: 2 })
await page.goto(URL, { waitUntil: 'networkidle0' })

await page.waitForFunction(
  () => [...document.querySelectorAll('svg')].some((s) => (s.getAttribute('viewBox') || '').includes('1440')),
  { timeout: 20000 },
)
// let Framer entrance animations finish
await new Promise((r) => setTimeout(r, 1500))

const handle = await page.evaluateHandle(() =>
  [...document.querySelectorAll('svg')].find((s) => (s.getAttribute('viewBox') || '').includes('1440')),
)

// freeze both timelines so frames are deterministic and smooth
await page.evaluate(() => {
  const root = [...document.querySelectorAll('svg')].find((s) => (s.getAttribute('viewBox') || '').includes('1440'))
  window.__root = root
  root.pauseAnimations() // SMIL (animateMotion / animateTransform / dash)
  document.getAnimations().forEach((a) => {
    try {
      a.pause()
    } catch {}
  })
})

console.log(`Capturing ${FRAMES} frames @ ${FPS}fps ...`)
for (let f = 0; f < FRAMES; f++) {
  const t = f / FPS
  await page.evaluate((t) => {
    window.__root.setCurrentTime(t) // SMIL timeline
    document.getAnimations().forEach((a) => {
      try {
        a.currentTime = t * 1000 // CSS / WAAPI timeline (ms)
      } catch {}
    })
  }, t)
  const idx = String(f).padStart(4, '0')
  await handle.screenshot({ path: join(FRAME_DIR, `frame_${idx}.png`) })
  if (f % 60 === 0) console.log(`  ${f}/${FRAMES}`)
}
await browser.close()

console.log('Encoding MP4 ...')
const out = join(OUT_DIR, 'fyp-architecture-diagram.mp4')
const res = spawnSync(
  ffmpeg.path,
  [
    '-y',
    '-framerate', String(FPS),
    '-i', join(FRAME_DIR, 'frame_%04d.png'),
    '-vf', 'scale=1920:-2:flags=lanczos,format=yuv420p',
    '-c:v', 'libx264',
    '-crf', '18',
    '-preset', 'slow',
    '-movflags', '+faststart',
    out,
  ],
  { stdio: 'inherit' },
)

rmSync(FRAME_DIR, { recursive: true, force: true })
if (res.status !== 0) throw new Error('ffmpeg failed')
console.log('Done ->', out)
