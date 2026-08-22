// ============================================================================
// 7-sinf: MATN CHETIDAN CHIQIB KETMAYAPTIMI (gorizontal).
//
// QA nuqsoni 2026-08-22: 28-darsning 13-slaydida uzun yozuv ikkinchi qatorga
// tushmay, chetidan qirqilardi. QA haq: bunday joy boshqa darslarda ham
// bo'lishi mumkin, va uni bittada topib chiqish kerak.
//
// Nima o'lchanadi: har slaydda `scrollWidth` `clientWidth` dan katta
// bo'lgan element bormi. Bu aynan «sig'madi va ko'rinmay qoldi» degani --
// `overflow: clip` tufayli skroll paydo bo'lmaydi, matn shunchaki yo'qoladi.
//
// VERTIKAL o'lchov bu yerda YO'Q: uni to'liq prognon (`grade7-noscroll`)
// qiladi, va u ancha uzoq. Bu tekshiruv tez: bir dars ~20 soniya.
//
// Ishga tushirish:
//   npx vite --port 5261 --strictPort
//   node scripts/grade7-overflow-audit.mjs            -- hamma darslar
//   GRADE7_ONLY=dars28-formulalarni-qollash node ...   -- bitta dars
//
// Til: GRADE7_LANGS=uz,ru,en (defolt uz -- so'zlari eng uzun).
// ============================================================================
import { chromium } from 'playwright'
import { readFileSync } from 'node:fs'

const PORT = process.env.GRADE7_PORT || '5261'
const LANGS = (process.env.GRADE7_LANGS || 'uz').split(',')
const ONLY = process.env.GRADE7_ONLY || ''
const SLIDES = 15
const H = Number(process.env.GRADE7_H || 768)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// Darslar ro'yxati reyestrdan olinadi: qo'lda yozilgan ro'yxat eskiradi.
const reg = readFileSync('src/lessons/grade7.js', 'utf8')
const slugs = []
const re = /slug:\s*'([^']+)'[\s\S]{0,700}?Dars(\d+)\.jsx/g
let m
while ((m = re.exec(reg))) {
  if (!/amaliyot/.test(m[1])) slugs.push(m[1])
}
const list = ONLY ? slugs.filter((s) => s === ONLY) : slugs

const bad = []
for (const lang of LANGS) {
  for (const slug of list) {
    let page
    let browser
    try {
    browser = await chromium.launch()
    page = await browser.newPage({ viewport: { width: 1366, height: H } })
    await page.goto(`http://localhost:${PORT}/7-sinf/matematika/nazariy/${slug}?lang=${lang}`, { waitUntil: 'networkidle' })
    await sleep(600)
    for (let s = 1; s <= SLIDES; s += 1) {
      const shown = await page.evaluate(() => {
        const m = (document.body.innerText || '').match(/(\d+)\s*\/\s*15/)
        return m ? Number(m[1]) : -1
      })
      if (shown !== s) {
        bad.push({ lang, slug, slide: s, over: [{ over: 0, t: 'OTISH BOLMADI: ekranda ' + shown + '-slayd turibdi' }] })
        break
      }
      const inside = await page.evaluate(() => !!document.querySelector('.stage-content'))
      if (!inside) { bad.push({ lang, slug, slide: s, over: [{ over: 0, t: 'DARSDAN CHIQIB KETDI: slaydga o\'tish qulflangan' }] }); break }
      const over = await page.evaluate(() => {
        const root = document.querySelector('.stage-content')
        const out = []
        for (const el of root.querySelectorAll('*')) {
          const st = getComputedStyle(el)
          const clips = st.overflowX !== 'visible'
          if (clips && el.scrollWidth - el.clientWidth > 2 && el.clientWidth > 0) {
            const t = (el.textContent || '').trim().slice(0, 44)
            if (t) out.push({ cls: (el.className || '').toString().slice(0, 28), over: el.scrollWidth - el.clientWidth, t })
          }
        }
        // eng tashqi elementni qoldiramiz: ichkilari o'shani takrorlaydi
        return out.slice(0, 2)
      })
      if (over.length) bad.push({ lang, slug, slide: s, over })
      const y = await page.evaluate(() => {
        const c = document.querySelector('.stage-content')
        return c ? c.scrollHeight - c.clientHeight : 0
      })
      if (y > 2) bad.push({ lang, slug, slide: s, over: [{ over: y, t: 'VERTIKAL sigmadi: balandlikka joy yetmadi' }] })
      if (s < SLIDES) {
        // «Davom etish» NOMI bo'yicha bosiladi. Kursda erkin navigatsiya
        // yoniq, shuning uchun javob berish shart emas.
        const moved = await page.evaluate(() => {
          const nav = document.querySelector('.stage-nav')
          if (!nav) return false
          const want = ['davom', 'продолж', 'continue']
          const btn = Array.from(nav.querySelectorAll('button')).find((x) => {
            const t = (x.textContent || '').toLowerCase()
            return !x.disabled && want.some((w) => t.includes(w))
          })
          if (btn) { btn.click(); return true }
          return false
        })
        await sleep(430)
        if (!moved) {
          bad.push({ lang, slug, slide: s, over: [{ over: 0, t: 'DAVOM tugmasi topilmadi' }] })
          break
        }
      }
    }
    await page.close()
    await browser.close()
    } catch (e) {
      bad.push({ lang, slug, slide: 0, over: [{ over: 0, t: 'TEKSHIRUV YIQILDI: ' + String(e).slice(0, 60) }] })
      try { if (browser) await browser.close() } catch (e2) { /* allaqachon yopilgan */ }
    }
    process.stdout.write('.')
  }
}
console.log('')
if (!bad.length) {
  console.log('OK: hech qayerda matn chetidan chiqmadi (' + list.length + ' dars, ' + LANGS.join(',') + ')')
  process.exit(0)
}
console.log('CHETIDAN CHIQQAN JOYLAR: ' + bad.length)
for (const b of bad) {
  console.log('  %s  slayd %d  [%s]  +%dpx  %s', b.slug, b.slide, b.lang, b.over[0].over, b.over[0].t)
}
process.exit(1)
