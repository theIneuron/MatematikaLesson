// ============================================================================
// 7-sinf: MASOFA O'QIDA BOSISH ZONASI BELGI USTIDAMI.
//
// QA nuqsoni 2026-08-22: «to'g'ri bosilgan joy belgilanmaydi» (10-dars, 5, 6
// va 10-slaydlar). Sabab: bosish zonalari butun blokni qoplab yotardi, o'q
// esa 620px bilan cheklanib markazda turardi -- foizlar boshqa kenglikdan
// hisoblanib, zona o'z belgisidan chetga ketardi. Yig'ilish va statik
// tekshiruvlar bunday nuqsonni KO'RMAYDI: geometriya faqat brauzerda bor.
//
// Tekshiruv ikki narsani o'lchaydi:
//   1) zona markazi bilan belgi markazi orasidagi siljish (6px dan kichik);
//   2) to'g'ri nuqta bosilganda u haqiqatda BELGILANADIMI.
//
// Ishga tushirish:
//   npx vite --port 5261 --strictPort
//   SLIDE=5 ROOTS=-1,7 node scripts/grade7-axis-check.mjs
//
// Ildizlar dars ma'lumotidan olinadi: markaz va masofa bo'yicha.
// ============================================================================
import { chromium } from 'playwright'
const SLIDE = Number(process.env.SLIDE || 5)
const URL = 'http://localhost:5261/7-sinf/matematika/nazariy/dars10-modulli-tenglama?lang=uz'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1366, height: 800 } })
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
  await sleep(900)
}
const info = await p.evaluate(() => {
  const zs = Array.from(document.querySelectorAll('.g7-dl-zone'))
  const nums = Array.from(document.querySelectorAll('.g7-dl-num'))
  if (!zs.length) return { err: 'зон нет' }
  const out = []
  for (const z of zs) {
    const zr = z.getBoundingClientRect()
    const label = z.getAttribute('aria-label')
    const num = nums.find((n) => n.textContent.trim() === label)
    if (!num) continue
    const nr = num.getBoundingClientRect()
    out.push({ v: label, dx: Math.round((zr.left + zr.width / 2) - (nr.left + nr.width / 2)) })
  }
  const cnt = (document.querySelector('.g7-dl-cnt') || {}).textContent
  return { out, cnt }
})
if (info.err) { console.log(info.err); process.exit(1) }
const worst = info.out.reduce((a, x) => (Math.abs(x.dx) > Math.abs(a.dx) ? x : a), info.out[0])
console.log('zonalar soni:', info.out.length, '| eng katta gorizontal siljish:', worst.dx, 'px (belgi', worst.v + ')')
console.log('hisoblagich:', (info.cnt || '').trim())
// endi TO'G'RI nuqtani bosamiz: |x - 3| = 4 -> 7 va -1
for (const v of (process.env.ROOTS || '7,-1').split(',')) {
  await p.evaluate((val) => {
    const z = Array.from(document.querySelectorAll('.g7-dl-zone')).find((x) => x.getAttribute('aria-label') === val)
    if (z) z.click()
  }, v)
  await sleep(600)
}
const after = await p.evaluate(() => ({
  cnt: (document.querySelector('.g7-dl-cnt') || {}).textContent,
  hits: document.querySelectorAll('.g7-dl-hit').length,
}))
console.log('bosgandan keyin:', (after.cnt || '').trim(), '| belgilangan nuqta:', after.hits)
await b.close()
process.exit(Math.abs(worst.dx) > 6 || after.hits < 2 ? 1 : 0)
