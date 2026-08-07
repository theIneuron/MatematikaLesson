// ============================================================================
// 8-sinf, Dars 3: uchta MAXSUS ekranni suratga oladi va yakundagi TAYYORLIK
// DARAJASI blitsdan yetib kelganini tekshiradi.
//   node scripts/grade8-dars03-shot.mjs [port]
//
// Nima uchun kerak. Maydon rangi (§14) va tayyorlik darajasi (§2.2.5) -- bu
// ko'z bilan ko'riladigan narsa, prokliklash skripti ularni tekshirmaydi.
// Suratlar `.tmp/grade8-dars03/` ga tushadi (git ga kirmaydi).
// ============================================================================
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const port = process.argv[2] || '5233'
const URL = `http://localhost:${port}/8-sinf/matematika/nazariy/dars03-kasrlarni-qisqartirish`
const OUT = '.tmp/grade8-dars03'
mkdirSync(OUT, { recursive: true })

const problems = []
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1366, height: 655 }, deviceScaleFactor: 2 })
page.on('pageerror', (e) => problems.push('PAGEERROR ' + String(e).slice(0, 200)))
await page.goto(URL, { waitUntil: 'networkidle' })
await page.waitForTimeout(600)

const fieldClass = () => page.evaluate(() => {
  const s = document.querySelector('.g8-stack')
  return s ? s.className : ''
})
const next = async () => {
  const b = page.locator('.g8-nav .g8-btn-solid')
  await b.first().click({ force: true })
  await page.waitForTimeout(340)
}
const answerAll = async () => {
  for (let i = 0; i < 12; i += 1) {
    const o = page.locator('.g8-opt:not(:disabled)')
    if (await o.count() === 0) break
    await o.first().click({ force: true })
    await page.waitForTimeout(280)
  }
}

// Ekran 1 -- XUK, maydon FIRUZA
let cls = await fieldClass()
if (cls.indexOf('g8-zone-hook') === -1) problems.push('ekran 1: firuza maydon YO\'Q, class=' + cls)
await page.screenshot({ path: OUT + '/01-hook.png' })

// Ekran 8 -- QOIDA, maydon APELSIN, kartochka javobdan KEYIN
for (let i = 1; i <= 7; i += 1) await next()
cls = await fieldClass()
if (cls.indexOf('g8-zone-rule') === -1) problems.push('ekran 8: apelsin maydon YO\'Q, class=' + cls)
const lockBefore = await page.locator('.g8-rule-masked').count()
const cardBefore = await page.locator('.g8-rule:not(.g8-rule-masked)').count()
if (lockBefore === 0) problems.push('ekran 8: QULF yo\'q -- kartochka javobdan oldin ochiq')
if (cardBefore > 0) problems.push('ekran 8: kartochka javobdan OLDIN ko\'rinib turadi')
await page.screenshot({ path: OUT + '/08-rule-locked.png' })
await answerAll()
const cardAfter = await page.locator('.g8-rule:not(.g8-rule-masked)').count()
if (cardAfter === 0) problems.push('ekran 8: to\'g\'ri javobdan keyin ham kartochka ochilmadi')
await page.screenshot({ path: OUT + '/08-rule-open.png' })

// Ekran 14 -- BLITS: hammasiga javob beramiz
for (let i = 8; i <= 13; i += 1) await next()
await answerAll()
await page.screenshot({ path: OUT + '/14-blitz.png' })

// Ekran 15 -- YAKUN, maydon YASHIL, tayyorlik blitsdan keladi
await next()
await page.waitForTimeout(700)
cls = await fieldClass()
if (cls.indexOf('g8-zone-summary') === -1) problems.push('ekran 15: yashil maydon YO\'Q, class=' + cls)
const chip = await page.locator('.g8-chip-ok').first().textContent().catch(() => null)
if (!chip || chip.indexOf('/') === -1) problems.push('ekran 15: tayyorlik darajasi YETIB KELMADI, chip=' + String(chip))
// Progress SEGMENTLI (11-sinf etaloni): oxirgi ekranda 14 ta o'tilgan va
// bittasi joriy bo'lishi kerak. Foizli chiziq YO'Q.
const segNow = await page.locator('.g8-seg-i.is-now').count()
const segDone = await page.locator('.g8-seg-i.is-done').count()
if (segNow !== 1 || segDone !== 14) {
  problems.push('ekran 15: segmentli progress noto\'g\'ri, now=' + segNow + ' done=' + segDone)
}
await page.screenshot({ path: OUT + '/15-summary.png' })

await browser.close()
console.log('')
console.log('  suratlar: ' + OUT)
console.log('  yakundagi tayyorlik: ' + String(chip).trim())
console.log('  muammolar: ' + problems.length)
problems.forEach((p) => console.log('   x ' + p))
console.log('')
if (problems.length) process.exitCode = 1
