// Dars QO'L BILAN o'tiladimi: skript o'quvchi rolini o'ynaydi -- nuqtani
// aylanaga qo'yadi, chiplarni tanlaydi, sonni yozadi. Har ekranda «yechildi»
// belgisi paydo bo'lishi SHART, aks holda ekran o'tib bo'lmaydigan.
import { chromium } from 'playwright'

// Dars ARGUMENT bilan tanlanadi. Har darsning o'z bosish rejasi bor: bu
// tekshiruv «qo'l bilan o'tiladimi» degan savolga javob beradi, ya'ni har
// ekranda AYNIQSA nima qilish kerakligini bilishi shart. Reja darsdan qolib
// ketmasin: 3-darsning 11 va 13-ekrani o'zgarganda reja eskirib qolgan edi va
// tekshiruv ikki ekranni «yechilmadi» deb yozib turgan edi.
//   node scripts/grade10-hand.mjs dars01
const LESSON = process.argv.slice(2).find((a) => !a.startsWith('--')) || 'dars03'
const SLUGS = {
  dars03: 'dars03-trigonometrik-doira',
  dars01: 'dars01-radianlar',
}
if (!SLUGS[LESSON]) {
  console.log(`nomalum dars: ${LESSON}. Bor: ${Object.keys(SLUGS).join(', ')}`)
  process.exit(1)
}
const BASE = `http://localhost:5210/10-sinf/matematika/nazariy/${SLUGS[LESSON]}`
const VIEWPORTS = [
  { name: '1366x655', w: 1366, h: 655 },
  { name: '1366x615', w: 1366, h: 615 },
  { name: '390x745', w: 390, h: 745 },
  // HAQIQIY telefon: metodist 2026-08-11 da aynan shu o'lchamda pastki
  // qatorlar kesilganini ko'rdi, 745 va 690 esa o'tib ketgan edi. Eng qattiq
  // o'lcham shu, va u qo'l bilan o'tish tekshiruvida ham bo'lishi kerak.
  { name: '393x660', w: 393, h: 660 },
].filter((vp) => !process.env.GRADE10_ONLY || vp.name.indexOf(process.env.GRADE10_ONLY) !== -1)

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

// «Yechildi» belgisi: yo selektor, yo {sel, count}.
// SANOQ nima uchun kerak: savollar zanjirida javob berilgan savol `.g10-done`
// qatoriga yig'iladi, ya'ni belgi BIRINCHI javobdan keyin paydo bo'ladi. Faqat
// selektorga qarab tekshirsak, to'rt savoldan bittasiga javob bergan ekran ham
// «o'tildi» bo'lib chiqadi. Shuning uchun zanjirlarda qator SONI tekshiriladi.
async function has(page, done) {
  const sel = typeof done === 'string' ? done : done.sel
  const need = typeof done === 'string' ? 1 : done.count
  return page.evaluate(
    ({ s, n }) => document.querySelectorAll(s).length >= n,
    { s: sel, n: need },
  )
}

// ISHGA TAYYORLIGINI KUTAMIZ, taymerga ishonmaymiz.
// Sabab: tushuntirish ekranlari «ko'rsatish, keyin ish» tartibida ishlaydi
// (metodist, 2026-08-11) -- ko'rsatish kadrlarida aylana QULFLANGAN va bosish
// hech narsa qilmaydi. Qat'iy `waitForTimeout` bilan skript qulflangan
// asbobni bosardi va «qo'l bilan yechilmadi» deb yozardi: dars emas,
// taymer o'lchanardi. Endi kutamiz: bosiladigan tugma yoki OCHIQ aylana.
async function waitReady(page, ms = 20000) {
  const step = 250
  for (let t = 0; t < ms; t += step) {
    const ready = await page.evaluate(() => {
      const live = document.querySelector('.g10-circle:not(.g10-circle-locked)')
      const btn = Array.from(document.querySelectorAll('.stage-content button')).some((b) => !b.disabled)
      const pad = document.querySelector('.g10-key, .g10-chip')
      return !!(live || pad || btn)
    })
    if (ready) { await page.waitForTimeout(200); return true }
    await page.waitForTimeout(step)
  }
  return false
}

// ISHCHI AYLANANI kutamiz -- AYNAN uni, tugmani emas.
// `waitReady` dan farqi: u «biror bosiladigan narsa bormi» deb qaraydi, va
// `FREE_NAV` yoqiq bo'lganda «Davom» tugmasi HAR DOIM bosiladigan -- ya'ni
// ko'rsatish kadrida ham «tayyor» deb javob beradi. Nuqta qo'yish kerak
// bo'lgan ekranda bu yetarli emas: skript qulflangan chizmani bosardi.
async function waitCircle(page, ms = 25000) {
  const step = 250
  for (let t = 0; t < ms; t += step) {
    const live = await page.evaluate(() => !!document.querySelector('.g10-circle:not(.g10-circle-locked)'))
    if (live) { await page.waitForTimeout(250); return true }
    await page.waitForTimeout(step)
  }
  return false
}

// Har ekran uchun: nima qilish va «yechildi» belgisi nima.
const PLANS = {}

PLANS.dars03 = [
  { n: 1, act: async (p) => clickText(p, 'перв'), done: '.g10-fb' },
  { n: 2, act: async (p) => { await circleClick(p, 30); await circleClick(p, 90) }, done: '.g10-fb-ok' },
  { n: 3, act: async (p) => { await circleClick(p, 20); await circleClick(p, 110); await circleClick(p, 200) }, done: '.g10-fb-ok' },
  { n: 4, act: async (p) => circleClick(p, 45), done: '.g10-fb-ok' },
  { n: 5, act: async (p) => { await circleClick(p, 30); await circleClick(p, 60) }, done: '.g10-fb-ok' },
  { n: 6, act: async (p) => { await circleClick(p, 0); await circleClick(p, 90); await circleClick(p, 180); await circleClick(p, 270) }, done: '.g10-fb-ok' },
  { n: 7, act: async (p) => { await circleClick(p, 90); await circleClick(p, 90); await typeNumber(p, ['−', '0', ',', '4', '4']) }, done: '.g10-entry-ok' },
  { n: 8, act: async (p) => clickText(p, '(1/2; √3/2)'), done: '.g10-rule' },
  { n: 9, act: async (p) => { for (const c of ['√3/2', '1/2', '√2/2', '√2/2', '1/2', '√3/2']) await clickChip(p, c); await clickText(p, 'Проверить') }, done: '.g10-fb-ok' },
  // 10-ekran ikki qadamli: nuqta qo'yish, keyin MOSLASHTIRISH. Belgi ikkinchi
  // qadamdan olinadi: to'rt juft yig'ilgan qatorlar soni.
  { n: 10,
    act: async (p) => {
      await circleClick(p, 30)
      await circleClick(p, 150)
      await p.waitForTimeout(2200)
      await waitReady(p)
      for (const [a, b] of [['π/6', '(√3/2; 1/2)'], ['π/4', '(√2/2; √2/2)'], ['π/3', '(1/2; √3/2)'], ['π/2', '(0; 1)']]) {
        await clickText(p, a)
        await clickText(p, b)
      }
    },
    done: { sel: '.g10-done', count: 4 } },
  { n: 11,
    act: async (p) => {
      await typeNumber(p, ['1'])
      await p.waitForTimeout(2000)
      await waitReady(p)
      // Ikkinchi qadam: KAMAYISH tartibi. cos 0 > cos 60 > cos 90 > cos 180.
      for (const c of ['cos 0', 'cos 60', 'cos 90', 'cos 180']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok' },
  { n: 12, act: async (p) => { await clickText(p, 'cos 120° = cos 60°'); await typeNumber(p, ['−', '0', ',', '5']) }, done: '.g10-entry-ok' },
  { n: 13,
    act: async (p) => {
      await circleClick(p, 135)
      await p.waitForTimeout(2000)
      await waitReady(p)
      // Ikkinchi qadam: HAMMA mumkin bo'lgan yozuv belgilanadi.
      for (const c of ['sin α = 0,9', 'sin α = −1', 'sin α = √2/2']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok' },
  { n: 14, act: async (p) => { for (const a of ['√2/2', 'Отразить', '3π/2', 'два']) { await clickText(p, a); await p.waitForTimeout(1700) } }, done: { sel: '.g10-done', count: 4 } },
  { n: 15, act: async () => {}, done: '.g10-print' },
]

// 1-dars: RADIANLAR. Bu yerda burchak UZUNLIK bilan o'lchanadi, shuning uchun
// bosishlar yoy va vatar chegaralari bo'yicha boradi: bir radian 57,3°.
const R1 = 57.29578
PLANS.dars01 = [
  { n: 1, act: async (p) => clickText(p, 'втор'), done: '.g10-fb' },
  {
    n: 2,
    act: async (p) => {
      for (const a of ['2π', '6,28', '1/4']) { await clickText(p, a); await p.waitForTimeout(1600) }
    },
    done: { sel: '.g10-done', count: 3 },
  },
  {
    n: 3,
    // Oltita radiusni yoy bo'ylab yotqizib, aylanani yopamiz: yettinchi bosish
    // -- yopilish, undan keyingina qoldiq ko'rsatiladi.
    act: async (p) => {
      for (let i = 1; i <= 6; i += 1) await circleClick(p, (i * R1) % 360)
      await circleClick(p, 0)
    },
    done: '.g10-fb-ok',
  },
  {
    n: 4,
    // Vatarlar: oltitasi aylanani AYNAN yopadi, qo'shimcha bosish kerak emas.
    act: async (p) => { for (let i = 1; i <= 6; i += 1) await circleClick(p, (i * 60) % 360) },
    done: '.g10-fb-ok',
  },
  {
    n: 5,
    // Radiusni IKKI chekkaga ham surish kerak: nisbat qimirlamaganini bir
    // chekkada ko'rish yetarli emas.
    act: async (p) => {
      const r = p.locator('.g10-range')
      await r.fill('35')
      await p.waitForTimeout(500)
      await r.fill('95')
      await p.waitForTimeout(500)
    },
    done: '.g10-fb-ok',
  },
  {
    n: 6,
    act: async (p) => {
      await waitCircle(p)
      await circleClick(p, 90)
      await circleClick(p, 60)
      await circleClick(p, 120)
    },
    done: '.g10-fb-ok',
  },
  { n: 7, act: async (p) => typeNumber(p, ['0', ',', '7']), done: '.g10-entry-ok' },
  { n: 8, act: async (p) => clickText(p, 'π/180'), done: '.g10-rule' },
  {
    n: 9,
    act: async (p) => {
      for (const [a, b] of [['30°', 'π/6'], ['45°', 'π/4'], ['60°', 'π/3'], ['90°', 'π/2']]) {
        await clickText(p, a)
        await clickText(p, b)
      }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  {
    n: 10,
    act: async (p) => {
      for (const c of ['135 · π/180', 'сократить на 45', '3π/4']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 11,
    act: async (p) => {
      await typeNumber(p, ['3', '6'])
      await p.waitForTimeout(2000)
      await waitReady(p)
      // Ikkinchi qadam: O'SISH tartibi. π/4 = 45, 50°, 1 rad = 57, π/3 = 60.
      for (const c of ['π/4', '50°', '1 rad', 'π/3']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 12,
    act: async (p) => {
      await clickText(p, 'α = 60')
      await p.waitForTimeout(1200)
      await typeNumber(p, ['1', '2', ',', '6'])
    },
    done: '.g10-entry-ok',
  },
  {
    n: 13,
    act: async (p) => {
      // 13-ekranda avval KARUSEL aylanadi (ko'rsatish), keyin ishchi aylana
      // keladi. Shuning uchun tugmani emas, AYLANANI kutamiz.
      await waitCircle(p)
      await circleClick(p, 60)
      await p.waitForTimeout(2000)
      await waitReady(p)
      for (const c of ['60°', 'π/3', '2π/6']) await clickText(p, c)
      await clickText(p, 'Проверить')
    },
    done: '.g10-fb-ok',
  },
  {
    n: 14,
    act: async (p) => {
      for (const a of ['45°', '3π/2', '180/π', 'меньше']) { await clickText(p, a); await p.waitForTimeout(1700) }
    },
    done: { sel: '.g10-done', count: 4 },
  },
  { n: 15, act: async () => {}, done: '.g10-print' },
]

const PLAN = PLANS[LESSON]

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
    await waitReady(page)
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
    if (m.over > 1) {
      problems.push(`${vp.name} ekran ${step.n}: kontent ${m.over}px oshdi`)
      // NIMA joy egallaganini DARHOL aytamiz. Aks holda «40 px oshdi» degan son
      // bilan qolamiz va har safar alohida o'lchagich yozishga to'g'ri keladi --
      // shu bilan yarim kun ketgan edi (2026-08-12).
      const parts = await page.evaluate(() => {
        const c = document.querySelector('.stage-content')
        const out = []
        const walk = (el, depth) => {
          for (const ch of el.children) {
            const h = Math.round(ch.getBoundingClientRect().height)
            if (h > 14) out.push('  '.repeat(depth) + String(ch.className).slice(0, 28) + ' ' + h)
            if (depth < 5) walk(ch, depth + 1)
          }
        }
        if (c) walk(c, 0)
        return out
      })
      problems.push(`${vp.name} ekran ${step.n}: tarkibi ->\n      ${parts.join('\n      ')}`)
    }
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
