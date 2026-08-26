// Stend suratini oladi: probe/secant.html
import { chromium } from 'playwright'

const port = process.env.PORT || 5298
const out = process.env.OUT || 'C:/tmp/secant.png'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1180, height: 2100 }, deviceScaleFactor: 1.4 })
const errs = []
p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()) })
p.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message))
await p.goto(`http://localhost:${port}/probe/secant.html`, { waitUntil: 'networkidle' })
await p.waitForTimeout(Number(process.env.WAIT || 900))
await p.screenshot({ path: out, fullPage: true })
console.log('svg count:', await p.locator('svg').count())
console.log('console errors:', errs.length ? errs.slice(0, 10) : 'yo\'q')
await b.close()
