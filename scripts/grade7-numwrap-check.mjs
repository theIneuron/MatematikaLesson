// ============================================================================
// 7-sinf: SON IKKI QATORGA BO'LINIB QOLMADIMI (telefonda).
//
// QA nuqsoni 2026-08-22: 390 px da «12» varianti «1» va «2» bo'lib, «335
// daraja» esa «33» va «5 daraja» bo'lib ikki qatorga tushardi. Sabab -- son
// varianti ham umumiy `overflow-wrap: anywhere` qoidasiga tushardi, u esa
// ISTALGAN joydan uzadi.
//
// Ko'z bilan tekshirish ishonchsiz: nuqson faqat MA'LUM sonlarda va faqat tor
// ekranda chiqadi. Shuning uchun o'lchov mashinaviy: matn tugunining nechta
// to'rtburchagi borligi sanaladi (Range.getClientRects). Bittadan ko'p bo'lsa
// -- matn ko'chirilgan.
//
// Ishga tushirish:
//   npx vite --port 5261 --strictPort
//   node scripts/grade7-numwrap-check.mjs           -- hamma darslar, 390x745
//   GRADE7_ONLY=dars40-chiziqlar-va-burchaklar node ...
// ============================================================================
import { chromium } from 'playwright'
import { readFileSync } from 'node:fs'

const PORT = process.env.GRADE7_PORT || '5261'
const LANG = process.env.GRADE7_LANG || 'uz'
const W = Number(process.env.GRADE7_W || 390)
const H = Number(process.env.GRADE7_H || 745)
const ONLY = process.env.GRADE7_ONLY || ''
const SLIDES = 15

const reg = readFileSync('src/lessons/grade7.js', 'utf8')
const slugs = []
const re = /slug:\s*'([^']+)'[\s\S]{0,700}?Dars(\d+)\.jsx/g
let m
while ((m = re.exec(reg))) { if (!/amaliyot/.test(m[1])) slugs.push(m[1]) }
const list = ONLY ? slugs.filter((s) => s === ONLY) : slugs

const browser = await chromium.launch()
const bad = []

for (const slug of list) {
  const page = await browser.newPage({ viewport: { width: W, height: H } })
  await page.goto(`http://localhost:${PORT}/7-sinf/matematika/nazariy/${slug}?lang=${LANG}`, { waitUntil: 'domcontentloaded', timeout: 60000 })
  try { await page.waitForSelector('.stage-content', { timeout: 20000 }) } catch { bad.push({ slug, slide: 0, txt: 'OCHILMADI' }); await page.close(); continue }
  await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll('button')).find((x) => /ovoz|sound/i.test(x.getAttribute('title') || ''))
    if (b) b.click()
  })
  for (let s = 1; s <= SLIDES; s += 1) {
    await page.waitForTimeout(700)
    const hits = await page.evaluate(() => {
      const out = []
      document.querySelectorAll('.g7-opt-num').forEach((el) => {
        const t = (el.textContent || '').trim()
        if (!t) return
        const r = document.createRange()
        r.selectNodeContents(el)
        // Matn nechta qatorga yotdi. DIQQAT: to'rtburchaklar SONI qator soni
        // EMAS -- Fx har raqamni alohida span ga o'raydi, va bitta qatorda
        // ham bir nechta to'rtburchak chiqadi. Qator -- HAR XIL vertikal
        // joy, shuning uchun ustki chekkalar yig'iladi.
        const tops = new Set()
        Array.from(r.getClientRects())
          .filter((x) => x.height > 1 && x.width > 0)
          .forEach((x) => tops.add(Math.round(x.top / 4)))
        const lines = tops.size
        if (lines > 1) out.push({ txt: t, lines })
      })
      return out
    })
    hits.forEach((h) => bad.push({ slug, slide: s, txt: h.txt, lines: h.lines }))
    await page.evaluate(() => {
      const box = document.querySelectorAll('.g7-options')
      const last = box[box.length - 1]
      const b = last && Array.from(last.querySelectorAll('button')).find((x) => !x.disabled)
      if (b) b.click()
    })
    await page.waitForTimeout(420)
    await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('button')).find((x) => /davom|continue|yakunlash/i.test(x.textContent || ''))
      if (b && !b.disabled) b.click()
    })
  }
  await page.close()
  process.stdout.write('.')
}

console.log('')
if (bad.length) {
  console.log('SON KO\'CHIRILGAN JOYLAR: ' + bad.length)
  bad.slice(0, 30).forEach((b) => console.log('  ' + b.slug + '  slayd ' + b.slide + '  «' + b.txt + '»  ' + b.lines + ' qator'))
} else {
  console.log('OK: hech bir son ikkiga bo\'linmadi (' + list.length + ' dars, ' + LANG + ', ' + W + 'x' + H + ')')
}
await browser.close()
