// ============================================================================
// 7-sinf: NUQTA BOSILGAN TUGUNGA TUSHDIMI (Plane asbobi).
//
// QA nuqsoni 2026-08-22: 36-darsda to'rtga bosilardi, nuqta esa beshga
// tushardi. Sabab -- teskari hisob to'g'ri hisobning aynan teskarisi emasdi:
// tekislikning boshi `ox` da, teskari hisobda esa kadrning chap maydoni
// (P.l) turardi. 12 ga 8 oynada farq 27,5 px, bir katak esa 26,25 px, ya'ni
// promax ROSA BIR birlik.
//
// Bunday xatoni KO'Z bilan topib bo'lmaydi: chizma to'g'ri ko'rinadi, nuqta
// ham tugunga tushadi -- faqat BOSHQA tugunga. Shuning uchun o'lchov
// mashinaviy: skript o'q raqamining piksel joyini oladi, o'sha joyga bosadi
// va qo'yilgan nuqtaning IMZOSINI o'qiydi. Imzo bosilgan tugun bilan mos
// kelmasa -- xato.
//
// Ishga tushirish:
//   npx vite --port 5261 --strictPort
//   SLUG=dars36-grafiklarni-qurish SLIDE=3 node scripts/grade7-plane-check.mjs
//   GRADE7_W=390 GRADE7_H=745 SLUG=... SLIDE=3 node ...   -- telefon
//
// PX / PY -- tekshiriladigan tugunlar (defolt: chekkalar va o'rta).
// Nol tekshirilmaydi: o'qda uning raqami chizilmaydi.
// ============================================================================
import { chromium } from 'playwright'

const PORT = process.env.GRADE7_PORT || '5261'
const SLUG = process.env.SLUG || 'dars36-grafiklarni-qurish'
const SLIDE = Number(process.env.SLIDE || 3)
const LANG = process.env.GRADE7_LANG || 'uz'
const PX = (process.env.PX || '-6,-3,-1,2,4,6').split(',').map(Number)
const PY = (process.env.PY || '-4,-3,1,4').split(',').map(Number)
const BASE = 'http://localhost:' + PORT + '/7-sinf/matematika/nazariy/' + SLUG

// O'lcham sozlanadi: bosish TELEFONDA ham tugunga tushishi kerak, u yerda
// chizma kichrayadi va ulush boshqacha hisoblanadi.
const W = Number(process.env.GRADE7_W || 1366)
const H = Number(process.env.GRADE7_H || 768)
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: W, height: H } })

// Slaydga borish: har ekranda birinchi ochiq variant bosiladi, keyin oldinga.
const goTo = async (n) => {
  await page.goto(BASE + '?lang=' + LANG, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.waitForSelector('.stage-content', { timeout: 60000 })
  await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll('button')).find((x) => /ovoz|sound/i.test(x.getAttribute('title') || ''))
    if (b) b.click()
  })
  await page.waitForTimeout(500)
  for (let i = 1; i < n; i += 1) {
    await page.evaluate(() => {
      const boxes = document.querySelectorAll('.g7-options')
      const last = boxes[boxes.length - 1]
      const b = last && Array.from(last.querySelectorAll('button')).find((x) => !x.disabled)
      if (b) b.click()
    })
    await page.waitForTimeout(480)
    await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('button')).find((x) => /davom|continue/i.test(x.textContent || ''))
      if (b && !b.disabled) b.click()
    })
    await page.waitForTimeout(360)
  }
  await page.waitForTimeout(1600)
}

// O'q raqamlarining piksel joyi: shu joydan tugunning markazi olinadi.
const axisPositions = () => page.evaluate(() => {
  const svg = document.querySelector('.g7-pl-svg')
  if (!svg) return null
  const xs = {}
  const ys = {}
  svg.querySelectorAll('text.g7-pl-num').forEach((t) => {
    const v = (t.textContent || '').trim()
    if (!/^-?\d+$/.test(v)) return
    const r = t.getBoundingClientRect()
    if (t.getAttribute('text-anchor') === 'middle') xs[v] = r.left + r.width / 2
    if (t.getAttribute('text-anchor') === 'end') ys[v] = r.top + r.height / 2
  })
  return { xs, ys }
})

await goTo(SLIDE)
const axes = await axisPositions()
if (!axes) {
  console.log('Bu slaydda Plane asbobi yo\'q: ' + SLUG + ' slayd ' + SLIDE)
  await browser.close()
  process.exit(0)
}

let bad = 0
let tried = 0
for (const x of PX) {
  for (const y of PY) {
    const cx = axes.xs[String(x)]
    const cy = axes.ys[String(y)]
    if (cx === undefined || cy === undefined) continue
    // Nuqta bir marta qo'yiladi, shuning uchun har tugun uchun ekran qaytadan.
    await goTo(SLIDE)
    await page.mouse.click(cx, cy)
    await page.waitForTimeout(360)
    const got = await page.evaluate(() => {
      const t = document.querySelector('.g7-pl-dotg.is-mine text.g7-pl-lab')
      return t ? (t.textContent || '').trim() : null
    })
    const want = '(' + x + '; ' + y + ')'
    tried += 1
    if (got !== want) {
      bad += 1
      console.log('XATO: bosildi ' + want + ' -> nuqta ' + got)
    }
  }
}

console.log(bad
  ? 'XATO ' + bad + ' / ' + tried + ' tugun'
  : 'OK: ' + tried + ' tugun, hammasi bosilgan joyiga tushdi (' + SLUG + ', slayd ' + SLIDE + ')')
await browser.close()
