// ============================================================================
// 9-sinf: ETALON §6 uchun O'LCHOV. Hujjatdagi raqamlar bu yerdan keladi, boshqa
// sinfdan ko'chirilmaydi. O'lchanadi: `.stage-content` budjeti, o'q va grafik
// kartochkasining haqiqiy o'lchami, sahna kengligi.
//   npx vite --port 5271 --strictPort
//   node scripts/grade9-measure.mjs
// ============================================================================
import { chromium } from 'playwright'

const PORT = process.env.GRADE9_PORT || '5271'
const BASE = `http://localhost:${PORT}/9-sinf/matematika/nazariy/dars15-oraliqlar-usuli`
const VIEWPORTS = [
  { name: '1366x615', w: 1366, h: 615 },
  { name: '1366x655', w: 1366, h: 655 },
  { name: '1920x950', w: 1920, h: 950 },
  { name: '390x745', w: 390, h: 745 },
  { name: '360x690', w: 360, h: 690 },
]
const SCREENS = [1, 3, 5, 9, 15]

const browser = await chromium.launch()
const budget = {}
const figures = {}

for (const vp of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } })
  await page.goto(`${BASE}?lang=ru`, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.waitForSelector('.stage-content', { timeout: 60000 })
  await page.evaluate(() => { const b = document.querySelector('.stage-header .lc-icon'); if (b) b.click() })
  await page.waitForTimeout(400)

  budget[vp.name] = await page.evaluate(() => {
    const c = document.querySelector('.stage-content')
    const st = document.querySelector('.stage')
    const hd = document.querySelector('.stage-header')
    const nv = document.querySelector('.stage-nav')
    const r = (el) => (el ? Math.round(el.getBoundingClientRect().height) : null)
    return {
      content: c.clientHeight,
      sceneW: st ? Math.round(st.getBoundingClientRect().width) : null,
      header: r(hd),
      nav: r(nv),
      window: window.innerHeight,
      zoom: getComputedStyle(document.documentElement).getPropertyValue('--lcz').trim() || '1',
    }
  })

  figures[vp.name] = {}
  for (let s = 1; s <= 15; s += 1) {
    if (SCREENS.includes(s)) {
      // пройти экран до появления прибора
      for (let k = 0; k < 12; k += 1) {
        const hit = await page.evaluate(() => {
          const c = document.querySelector('.stage-content')
          const n = Array.from(c.querySelectorAll('button')).filter((x) => !x.disabled)
          if (!n.length) return false
          n[0].click(); return true
        })
        if (!hit) await page.waitForTimeout(600)
        else await page.waitForTimeout(200)
      }
      figures[vp.name][s] = await page.evaluate(() => {
        const pick = document.querySelector('.g9-plane-card, .g9-axis-card')
        if (!pick) return null
        const r = pick.getBoundingClientRect()
        return { w: Math.round(r.width), h: Math.round(r.height) }
      })
    }
    if (s < 15) {
      await page.evaluate(() => {
        const nav = document.querySelector('.stage-nav')
        const b = Array.from(nav.querySelectorAll('button')).filter((x) => !x.disabled)
        if (b.length) b[b.length - 1].click()
      })
      await page.waitForTimeout(320)
    }
  }
  await page.close()
}
await browser.close()

console.log('БЮДЖЕТ .stage-content')
console.log('размер      окно  шапка  панель  бюджет  сцена')
for (const [k, v] of Object.entries(budget)) {
  console.log(`${k.padEnd(11)} ${String(v.window).padStart(4)}  ${String(v.header).padStart(5)}  ${String(v.nav).padStart(6)}  ${String(v.content).padStart(6)}  ${String(v.sceneW).padStart(5)}`)
}
console.log('\nКАРТОЧКА ПРИБОРА (ширина x высота)')
for (const [k, v] of Object.entries(figures)) {
  const cells = Object.entries(v).map(([s, r]) => `экран ${s}: ${r ? r.w + 'x' + r.h : '—'}`)
  console.log(`${k.padEnd(11)} ${cells.join('   ')}`)
}
