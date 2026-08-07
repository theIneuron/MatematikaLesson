// Dars QO'L BILAN o'tiladimi: skript o'quvchi rolini o'ynaydi -- nuqtani
// aylanaga qo'yadi, chiplarni tanlaydi, sonni yozadi. Har ekranda «yechildi»
// belgisi paydo bo'lishi SHART, aks holda ekran o'tib bo'lmaydigan.
import { chromium } from 'playwright'

const BASE = 'http://localhost:5210/10-sinf/matematika/nazariy/dars03-trigonometrik-doira'
const VIEWPORTS = [
  { name: '1366x655', w: 1366, h: 655 },
  { name: '1366x615', w: 1366, h: 615 },
  { name: '390x745', w: 390, h: 745 },
]

const problems = []

async function circleClick(page, deg) {
  const box = await page.evaluate(() => {
    const svg = document.querySelector('.g10-circle')
    if (!svg) return null
    const r = svg.getBoundingClientRect()
    return { x: r.left, y: r.top, w: r.width, h: r.height }
  })
  if (!box) return false
  const R = box.w * 0.37
  const cx = box.x + box.w / 2
  const cy = box.y + box.h / 2
  const rad = (deg * Math.PI) / 180
  await page.mouse.click(cx + R * Math.cos(rad), cy - R * Math.sin(rad))
  await page.waitForTimeout(260)
  return true
}

async function clickText(page, text) {
  const ok = await page.evaluate((needle) => {
    const nodes = Array.from(document.querySelectorAll('.stage-content button'))
    const hit = nodes.find((b) => (b.textContent || '').replace(/\s+/g, ' ').includes(needle) && !b.disabled)
    if (!hit) return false
    hit.click()
    return true
  }, text)
  await page.waitForTimeout(300)
  return ok
}

// Chipni AYNAN chip ro'yxatidan bosamiz: jadval katakchalari ham tugma va
// to'lgandan keyin ular ham o'sha matnni ko'rsatadi.
async function clickChip(page, label) {
  const ok = await page.evaluate((needle) => {
    const chips = Array.from(document.querySelectorAll('.g10-chip')).filter((b) => !b.disabled)
    const hit = chips.find((b) => (b.textContent || '').trim() === needle)
    if (!hit) return false
    hit.click()
    return true
  }, label)
  await page.waitForTimeout(220)
  return ok
}

async function typeNumber(page, digits) {
  for (const ch of digits) {
    const ok = await clickText(page, ch)
    if (!ok) return false
  }
  return clickText(page, 'Проверить')
}

async function has(page, sel) {
  return page.evaluate((s) => !!document.querySelector(s), sel)
}

// Har ekran uchun: nima qilish va «yechildi» belgisi nima.
const PLAN = [
  { n: 1, act: async (p) => { await p.waitForTimeout(3000); await clickText(p, 'перв') }, done: '.g10-fb' },
  { n: 2, act: async (p) => { await circleClick(p, 30); await circleClick(p, 90) }, done: '.g10-fb-ok' },
  { n: 3, act: async (p) => { await circleClick(p, 20); await circleClick(p, 110); await circleClick(p, 200) }, done: '.g10-fb-ok' },
  { n: 4, act: async (p) => circleClick(p, 45), done: '.g10-fb-ok' },
  { n: 5, act: async (p) => { await circleClick(p, 30); await circleClick(p, 60) }, done: '.g10-fb-ok' },
  { n: 6, act: async (p) => { await circleClick(p, 0); await circleClick(p, 90); await circleClick(p, 180); await circleClick(p, 270) }, done: '.g10-fb-ok' },
  { n: 7, act: async (p) => { await circleClick(p, 90); await circleClick(p, 90); await typeNumber(p, ['−', '0', ',', '4', '4']) }, done: '.g10-entry-ok' },
  { n: 8, act: async (p) => clickText(p, '(1/2; √3/2)'), done: '.g10-rule' },
  { n: 9, act: async (p) => { for (const c of ['√3/2', '1/2', '√2/2', '√2/2', '1/2', '√3/2']) await clickChip(p, c); await clickText(p, 'Проверить') }, done: '.g10-fb-ok' },
  { n: 10, act: async (p) => { await circleClick(p, 30); await circleClick(p, 150) }, done: '.g10-fb-ok' },
  { n: 11, act: async (p) => { await typeNumber(p, ['1']); await p.waitForTimeout(1800); await typeNumber(p, ['0', ',', '5']) }, done: '.g10-entry-ok' },
  { n: 12, act: async (p) => { await clickText(p, 'cos 120° = cos 60°'); await typeNumber(p, ['−', '0', ',', '5']) }, done: '.g10-entry-ok' },
  { n: 13, act: async (p) => { await circleClick(p, 135); await p.waitForTimeout(1700); await circleClick(p, 225) }, done: '.g10-fb-ok' },
  { n: 14, act: async (p) => { for (const a of ['√2/2', '−1', '3π/2', 'два']) { await clickText(p, a); await p.waitForTimeout(1700) } }, done: '.g10-done' },
  { n: 15, act: async () => {}, done: '.g10-print' },
]

const browser = await chromium.launch({ headless: true })
for (const vp of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } })
  const errs = []
  page.on('pageerror', (e) => errs.push(e.message))
  page.on('console', (m) => { if (m.type() === 'error' && !m.text().includes('ERR_NETWORK')) errs.push(m.text()) })
  await page.goto(BASE + '?g10fast=1&lang=ru', { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.waitForSelector('.stage-content', { timeout: 60000 })
  await page.waitForTimeout(900)

  for (const step of PLAN) {
    await step.act(page)
    await page.waitForTimeout(1000)
    const solved = await has(page, step.done)
    // o'lchov: FINAL holatda skroll va obrezka
    const m = await page.evaluate(() => {
      const c = document.querySelector('.stage-content')
      const svg = document.querySelector('.g10-circle')
      const clipped = Array.from(document.querySelectorAll('.lesson-root *'))
        .map((el) => {
          const cs = getComputedStyle(el)
          // Ataylab yig'ilgan element (javobdan keyin so'nadigan variant)
          // obrezka EMAS: u ko'rinmaydi va o'quvchi hech narsa yo'qotmaydi.
          if (el.clientHeight === 0 || cs.opacity === '0' || cs.maxHeight === '0px') return null
          const cy = cs.overflowY === 'hidden' || cs.overflowY === 'clip'
          const cx = cs.overflowX === 'hidden' || cs.overflowX === 'clip'
          const dy = cy ? el.scrollHeight - el.clientHeight : 0
          const dx = cx ? el.scrollWidth - el.clientWidth : 0
          return dy > 2 || dx > 2 ? String(el.className).slice(0, 30) + (dy ? ' +' + dy + 'h' : '') + (dx ? ' +' + dx + 'w' : '') : null
        })
        .filter(Boolean)
      return {
        over: c ? c.scrollHeight - c.clientHeight : 0,
        svg: svg ? Math.round(svg.getBoundingClientRect().width) : 0,
        clipped,
      }
    })
    const flag = solved ? 'OK ' : 'NET'
    console.log(`${vp.name} ekran ${String(step.n).padStart(2)} ${flag} chizma ${String(m.svg).padStart(3)} oshish ${m.over}${m.clipped.length ? '  OBREZKA: ' + m.clipped.join(' | ') : ''}`)
    if (!solved) problems.push(`${vp.name} ekran ${step.n}: qo'l bilan yechilmadi`)
    if (m.over > 1) problems.push(`${vp.name} ekran ${step.n}: kontent ${m.over}px oshdi`)
    if (m.clipped.length) problems.push(`${vp.name} ekran ${step.n}: obrezka ${m.clipped.join(' | ')}`)
    if (step.n < 15) {
      await page.evaluate(() => {
        const nav = document.querySelector('.stage-nav')
        const bs = nav ? Array.from(nav.querySelectorAll('button')).filter((b) => !b.disabled) : []
        if (bs.length) bs[bs.length - 1].click()
      })
      await page.waitForTimeout(420)
    }
  }
  if (errs.length) problems.push(`${vp.name}: konsol -> ${errs.slice(0, 3).join(' | ')}`)
  await page.close()
}
await browser.close()

if (problems.length) {
  console.log('\nMUAMMOLAR: ' + problems.length)
  problems.forEach((p) => console.log('  ' + p))
  process.exitCode = 1
} else {
  console.log('\nOK: dars qo\'l bilan to\'liq o\'tiladi, skroll va obrezka yo\'q.')
}
