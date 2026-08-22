// ============================================================================
// 7-sinf: VARIANTLAR ARALASHADIMI.
//
// QA nuqsoni 2026-08-22: to'g'ri javob 650 savolning 650 tasida BIRINCHI
// turgan edi. Tuzatish `Options` va `SlotFill` ichiga qo'yildi, lekin
// yig'ilish (`npm run build`) buni tekshirmaydi: xato bo'lsa ham fayl
// yig'iladi. Shuning uchun tekshiruv BRAUZERDA: sahifa bir necha marta
// ochiladi va variantlar tartibi solishtiriladi.
//
// Mezon ikkita:
//   1) tartib ochilishlar orasida O'ZGARADI (aralashtirish ishlayapti);
//   2) to'g'ri javob har safar bir joyda TURMAYDI.
//
// Ishga tushirish:
//   npx vite --port 5261 --strictPort
//   node scripts/grade7-shuffle-check.mjs
//
// GRADE7_SLUG bilan dars tanlanadi, GRADE7_RUNS bilan ochilish soni.
// ============================================================================
import { chromium } from 'playwright'

const PORT = process.env.GRADE7_PORT || '5261'
const SLUG = process.env.GRADE7_SLUG || 'dars40-chiziqlar-va-burchaklar'
const RUNS = Number(process.env.GRADE7_RUNS || 6)
const SLIDE = Number(process.env.GRADE7_SLIDE || 2)
const URL = `http://localhost:${PORT}/7-sinf/matematika/nazariy/${SLUG}?lang=uz`

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// Bitta ochilish: SLIDE ga o'tadi va variantlarning MATNINI tartib bilan oladi.
async function readOnce(browser) {
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } })
  await page.goto(URL, { waitUntil: 'networkidle' })
  await sleep(700)

  for (let s = 1; s < SLIDE; s += 1) {
    await page.evaluate(() => {
      const nav = document.querySelector('.stage-nav') || document
      const marked = nav.querySelector('button[data-next]')
      if (marked && !marked.disabled) { marked.click(); return }
      const btns = Array.from(nav.querySelectorAll('button')).filter((b) => !b.disabled)
      if (btns.length) btns[btns.length - 1].click()
    })
    await sleep(900)
  }

  const labels = await page.evaluate(() => {
    const c = document.querySelector('.stage-content') || document.body
    return Array.from(c.querySelectorAll('button'))
      .filter((b) => { const c = b.className || ''; return c.includes('g7-opt') || c.includes('g7-sz-chip') })
      .map((b) => (b.querySelector('.g7-opt-text') || b).textContent.trim())
      .filter((x) => x.length)
  })
  const where = await page.evaluate(() => {
    const t = (document.body.textContent || '').match(/(\d+)\s*\/\s*15/)
    const c = document.querySelector('.stage-content') || document.body
    const cls = Array.from(c.querySelectorAll('button')).map((b) => b.className).filter(Boolean)
    return { slide: t ? t[1] : '?', btns: Array.from(new Set(cls)).slice(0, 4) }
  })
  await page.close()
  if (!labels.length) console.log('   [diag] slayd', where.slide, '| tugmalar:', JSON.stringify(where.btns))
  return labels
}

const browser = await chromium.launch()
const seen = []
for (let i = 0; i < RUNS; i += 1) {
  const l = await readOnce(browser)
  seen.push(l)
  console.log(`ochilish ${i + 1}: ${l.join(' | ') || '(variant topilmadi)'}`)
}
await browser.close()

const bad = []
if (!seen[0] || !seen[0].length) bad.push('variantlar topilmadi -- selektor yoki sahifa buzilgan')
const uniq = new Set(seen.map((x) => x.join('|')))
console.log(`\nhar xil tartib: ${uniq.size} / ${RUNS}`)
if (seen[0] && seen[0].length >= 3 && uniq.size === 1) {
  bad.push('tartib hech qachon o\'zgarmadi -- aralashtirish ishlamayapti')
}
// birinchi o'rinda qaysi variant turgani
const firsts = {}
seen.forEach((l) => { if (l[0]) firsts[l[0]] = (firsts[l[0]] || 0) + 1 })
console.log('birinchi o\'rinda turgan variantlar:', JSON.stringify(firsts))
if (Object.keys(firsts).length === 1 && RUNS >= 4 && seen[0].length >= 3) {
  bad.push('birinchi o\'rinda har safar bitta variant turdi')
}

if (bad.length) {
  console.log('\nPROBLEMA:')
  bad.forEach((b) => console.log(' -', b))
  process.exit(1)
}
console.log('\nOK: variantlar aralashadi va birinchi o\'rin qotib qolmagan.')
