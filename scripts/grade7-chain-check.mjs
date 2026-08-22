// ============================================================================
// 7-sinf: ZANJIR EKRANI O'Z VARIANTLARINI KO'RSATADIMI.
//
// Bu tekshiruv 2026-08-22 da yozildi, chunki aralashtirishning BIRINCHI
// varianti zanjirni sindirdi: kalit faqat ID lardan yig'ilgan edi, zanjirdagi
// hamma savolda esa ID lar bir xil (a, b, c, d). Natijada ikkinchi savol
// BIRINCHISINING variantlarini ko'rsatdi. Yig'ilish ham, statik tekshiruvlar
// ham buni ko'rmadi -- faqat brauzer ko'rdi.
//
// Ishga tushirish:
//   npx vite --port 5261 --strictPort
//   SLUG=dars40-chiziqlar-va-burchaklar SLIDE=14 OK='155°;ular teng;180°;90°' //     node scripts/grade7-chain-check.mjs
//
// OK -- to'g'ri javoblar ro'yxati, nuqtali vergul bilan. Har savolda to'g'ri
// javob bosiladi, keyingisining variantlari o'qiladi va to'g'ri javob turgan
// O'RIN chiqariladi: o'rinlar har xil bo'lishi kerak.
// ============================================================================
import { chromium } from 'playwright'
const SLUG = process.env.SLUG || 'dars40-chiziqlar-va-burchaklar'
const SLIDE = Number(process.env.SLIDE || 14)
const OK = (process.env.OK || '').split(';').filter(Boolean)
const URL = `http://localhost:5261/7-sinf/matematika/nazariy/${SLUG}?lang=uz`
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1366, height: 900 } })
await p.goto(URL, { waitUntil: 'networkidle' })
await sleep(700)
for (let s = 1; s < SLIDE; s += 1) {
  await p.evaluate(() => {
    const nav = document.querySelector('.stage-nav') || document
    const m = nav.querySelector('button[data-next]')
    if (m && !m.disabled) return m.click()
    const bs = Array.from(nav.querySelectorAll('button')).filter((x) => !x.disabled)
    if (bs.length) bs[bs.length - 1].click()
  })
  await sleep(850)
}
const read = () => p.evaluate(() => {
  const c = document.querySelector('.stage-content') || document.body
  return Array.from(c.querySelectorAll('button'))
    .filter((x) => (x.className || '').includes('g7-opt'))
    .map((x) => (x.querySelector('.g7-opt-text') || x).textContent.trim())
})
let bad = 0
for (let i = 0; i < OK.length; i += 1) {
  const opts = await read()
  const at = opts.findIndex((o) => o === OK[i] || o.includes(OK[i]))
  console.log(`savol ${i + 1}: ${opts.join(' | ')}   -> to'g'ri javob o'rni: ${at + 1}`)
  if (at < 0) { console.log('   !! to\'g\'ri javob ro\'yxatda topilmadi'); bad += 1; break }
  await p.evaluate((lbl) => {
    const c = document.querySelector('.stage-content') || document.body
    const btn = Array.from(c.querySelectorAll('button'))
      .filter((x) => (x.className || '').includes('g7-opt'))
      .find((x) => ((x.querySelector('.g7-opt-text') || x).textContent || '').trim().includes(lbl))
    if (btn) btn.click()
  }, OK[i])
  await sleep(2600)
}
await b.close()
process.exit(bad ? 1 : 0)
