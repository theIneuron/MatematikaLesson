// REGRESS tekshiruvi: `screens.jsx` ga tegilgandan keyin AVVALGI darslar
// ham ochilishi kerak. Bitta qatlam butun sinfni yiqitadi.
import { chromium } from 'playwright'

const port = process.env.PORT || 5299
const slug = process.env.SLUG || 'dars27-silindr'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1366, height: 655 } })
const errs = []
p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 160)) })
p.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message.slice(0, 160)))
await p.goto(`http://localhost:${port}/11-sinf/matematika/nazariy/${slug}`, { waitUntil: 'networkidle' })
await p.waitForTimeout(1500)
const stage = await p.locator('.stage-content').count()
console.log(slug, '| .stage-content:', stage, '| svg:', await p.locator('svg').count())
console.log('console:', errs.length ? errs.slice(0, 6) : "toza")
if (process.env.OUT) await p.screenshot({ path: process.env.OUT })
await b.close()
