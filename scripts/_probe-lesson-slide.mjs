// Darsning BITTA slaydini oladi: SLIDE=4 SLUG=... OUT=...
// Ovoz o'chirilgan holatda ochiladi, keyin `.g11-nav-r` tugmasi bilan
// kerakli slaydgacha o'tiladi va kadrlar ochilishi kutiladi.
import { chromium } from 'playwright'

const port = process.env.PORT || 5299
const slug = process.env.SLUG || 'dars35-fazoda-koordinatalar'
const slide = Number(process.env.SLIDE || 1)
const lang = process.env.LANG3 || 'ru'
const wait = Number(process.env.WAIT || 2600)

const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: Number(process.env.W || 1366), height: Number(process.env.H || 655) } })
const errs = []
p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 140)) })
p.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message.slice(0, 140)))
await p.goto(`http://localhost:${port}/11-sinf/matematika/nazariy/${slug}`, { waitUntil: 'networkidle' })
await p.waitForTimeout(700)

// Til
const sw = p.locator('.g11-langsw button')
if (await sw.count()) {
  const idx = { uz: 0, ru: 1, en: 2 }[lang]
  await sw.nth(idx).click({ force: true }).catch(() => {})
}
// Ovozni o'chirish: jim yo'lda kadrlar taymer bilan ochiladi va TEZROQ
// yig'iladi, ya'ni surat haqiqiy oxirgi holatni ko'rsatadi.
await p.locator('button[aria-label]').filter({ hasText: '' }).first().waitFor({ timeout: 2000 }).catch(() => {})
await p.evaluate(() => {
  const b = Array.from(document.querySelectorAll('button')).find((x) => (x.className || '').indexOf('g11-tool') !== -1 && x.textContent.indexOf('♪') !== -1)
  if (b) b.click()
})
await p.waitForTimeout(300)

for (let i = 1; i < slide; i += 1) {
  await p.locator('.g11-nav-r button').first().click({ force: true })
  await p.waitForTimeout(220)
}
await p.waitForTimeout(wait)
await p.screenshot({ path: process.env.OUT || 'C:/tmp/slide.png' })
console.log('slide', slide, lang, '| console:', errs.length ? errs.slice(0, 4) : 'toza')
await b.close()
