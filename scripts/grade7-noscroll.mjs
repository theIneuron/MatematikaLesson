// ============================================================================
// 7-sinf darsi tekshiruvi: SKROLL YO'Q + uch til + konsol xatolari.
//
// Metodist talabi (2026-08-05): na kompyuterda, na telefonda skroll bo'lmasin.
// Shu sababli tekshiruv slaydning FAQAT yakuniy holatini emas, HAR BIR
// ochilish qadamini o'lchaydi: slayd oxirida sig'ib, o'rtasida sig'masligi
// mumkin (savol hali ekranda, razbor allaqachon ochilgan).
//
// `.stage-content` da `overflow: clip` -- ya'ni skroll paydo bo'lmaydi, lekin
// sig'magan kontent KO'RINMAY QOLADI. Shuning uchun mezon: scrollHeight
// clientHeight dan katta bo'lmasin.
//
// Ishga tushirish:
//   npx vite --port 5261 --strictPort
//   node scripts/grade7-noscroll.mjs
// (qumtutqichda 127.0.0.1 bloklangan, shu sababli localhost)
// ============================================================================
import { chromium } from 'playwright'
import { readFileSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'

const PORT = process.env.GRADE7_PORT || '5261'
// Yangi dars alohida manzilda turibdi: GRADE7_SLUG bilan tanlanadi.
const SLUG = process.env.GRADE7_SLUG || 'dars05-qavslarni-ochish'
const BASE = `http://localhost:${PORT}/7-sinf/matematika/nazariy/${SLUG}`
const OUT = '.tmp/grade7-noscroll'
const TOTAL_SLIDES = 15
const MAX_STEPS_PER_SLIDE = 22

// KIRITISH bilan javob beriladigan ekranlar (9-ekran). Javoblar SAHIFADAN
// emas, MANBA FAYLDAN olinadi: metodist 2026-08-11 da «lekin o'quvchi
// javobni ko'rmasin» dedi, shuning uchun razmetkada javob YO'Q.
const ANSWERS = (() => {
  try {
    const src = readFileSync('src/components/grade7/Dars05v2.jsx', 'utf8')
    const blk = src.slice(src.indexOf('const S9 = {'), src.indexOf('const S10 = {'))
    return [...blk.matchAll(/solution: '([^']+)'/g)].map((m) => m[1])
  } catch { return [] }
})()
let answerIdx = 0
// Xuk slaydida savoldan oldin kino ketadi (~6 s). Shuncha kutamiz.
const WAIT_POLLS = 30
const WAIT_STEP_MS = 300

const VIEWPORTS = [
  { name: 'noutbuk-1366x615', w: 1366, h: 615 },
  { name: 'noutbuk-1366x655', w: 1366, h: 655 },
  { name: 'monitor-1920x950', w: 1920, h: 950 },
  { name: 'telefon-390x745', w: 390, h: 745 },
  { name: 'telefon-360x690', w: 360, h: 690 },
]

await mkdir(OUT, { recursive: true })
const browser = await chromium.launch({ headless: true })
const problems = []
let measurements = 0
let worst = { over: 0, where: '' }

async function measure(page, where) {
  const m = await page.evaluate(() => {
    const content = document.querySelector('.stage-content')
    const root = document.querySelector('.lesson-root')
    if (!content || !root) return null
    return {
      overY: content.scrollHeight - content.clientHeight,
      overX: content.scrollWidth - content.clientWidth,
      docOverX: document.documentElement.scrollWidth - window.innerWidth,
      docOverY: document.documentElement.scrollHeight - window.innerHeight,
      budget: content.clientHeight,
    }
  })
  if (!m) {
    problems.push(`${where}: .stage-content topilmadi`)
    return
  }
  measurements += 1
  if (m.overY > 1) {
    problems.push(`${where}: kontent ${m.overY}px oshib ketdi (budjet ${m.budget}px)`)
    if (m.overY > worst.over) worst = { over: m.overY, where }
  }
  if (m.overX > 1) problems.push(`${where}: gorizontal oshib ketish ${m.overX}px`)
  if (m.docOverX > 1) problems.push(`${where}: sahifa gorizontal skroll ${m.docOverX}px`)
  if (m.docOverY > 1) problems.push(`${where}: sahifa vertikal skroll ${m.docOverY}px`)

  // KESILGAN KONTENT. `.stage-content` ni o'lchash YETMAYDI: kartochka ichida
  // kesilgan matn skroll YARATMAYDI -- shunchaki yo'qoladi va ko'z bilan
  // ko'rinmaydi. Shu sababli `overflow: hidden/clip` bo'lgan HAR BIR quti
  // tekshiriladi (design/etalon-7-10/measure.mjs naqshi, ETALON_7SINF.md §9.1).
  const clipped = await page.evaluate(() => {
    const out = []
    document.querySelectorAll('.lesson-root, .lesson-root *').forEach((el) => {
      const cs = getComputedStyle(el)
      const hidY = cs.overflowY === 'hidden' || cs.overflowY === 'clip'
      const hidX = cs.overflowX === 'hidden' || cs.overflowX === 'clip'
      if (!hidX && !hidY) return
      // Yig'ilib ketayotgan variant (max-height 0 ga o'tmoqda) yolg'on
      // signal beradi -- animatsiya paytida o'lchamaymiz.
      if (cs.maxHeight === '0px' || parseFloat(cs.opacity) < 0.9) return
      // Uch nuqta bilan qisqartirish ATAYLAB qilingan va KO'RINADI -- bu
      // jimgina yo'qotish emas, shuning uchun hisobga olinmaydi.
      if (cs.textOverflow === 'ellipsis') return
      if (el.clientHeight === 0 || el.clientWidth === 0) return
      const overY = hidY ? el.scrollHeight - el.clientHeight : 0
      const overX = hidX ? el.scrollWidth - el.clientWidth : 0
      if (overY > 4 || overX > 4) {
        const name = typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/).join('.') : el.tagName
        out.push(`${name} (${overX}x${overY})`)
      }
    })
    return Array.from(new Set(out)).slice(0, 3)
  })
  if (clipped.length) problems.push(`${where}: kontent KESILDI -> ${clipped.join(' | ')}`)
}

// Slayd ichidagi hamma ochilish qadamini bosib chiqadi: variantlar, ochish
// tugmalari, «Tekshirish». Har bosishdan keyin o'lchaydi.
// UZ va EN da ekranda KIRILL harfi bo'lmasligi kerak. Bu uch tilning
// to'liqligini tekshiradi: agar biror satrda `en` yozilmagan bo'lsa, dars
// jimgina `ru` ga tushadi va shu tekshiruv uni ushlaydi.
async function checkNoCyrillic(page, tag, lang) {
  if (lang === 'ru') return
  const found = await page.evaluate(() => {
    const root = document.querySelector('.lesson-root')
    if (!root) return null
    const text = root.innerText || ''
    const m = text.match(/[Ѐ-ӿ]{2,}/g)
    return m ? Array.from(new Set(m)).slice(0, 4) : null
  })
  if (found) problems.push(`${tag}: ${lang} ekranida kirill matni -> ${found.join(', ')}`)
}

// Bosishlar SONINI qaytaradi. Bu MUHIM: javob qulfi ochilmasa, slaydda hech
// narsa bosilmaydi, `Davom` esa FREE_NAV bilan baribir ishlaydi -- tekshiruv
// «yashil» bo'lib qolardi, holbuki darsni javob berib o'tib bo'lmaydi.
// 2026-08-07 da aynan shu yolg'on yashil topildi.
async function walkSlide(page, tag, lang) {
  let clicks = 0
  let waited = 0
  for (let i = 0; i < MAX_STEPS_PER_SLIDE; i += 1) {
    await measure(page, `${tag} qadam ${i}`)
    if (i === 0) await checkNoCyrillic(page, tag, lang)
    const clicked = await page.evaluate(() => {
      const content = document.querySelector('.stage-content')
      if (!content) return false
      // `data-control` -- ovoz/qayta o'ynatish kabi BOSHQARUV tugmalari:
      // ular javob emas, ularni bosaverish darsni oldinga surmaydi.
      const nodes = Array.from(content.querySelectorAll('button')).filter((b) => !b.disabled && !b.hasAttribute('data-control'))
      if (!nodes.length) return false
      nodes[0].click()
      return true
    })
    if (!clicked) {
      // Kiritish maydoni bor bo'lsa -- javobni yozamiz va tekshiramiz.
      const typed = await page.evaluate((val) => {
        const inp = document.querySelector('.v2-input')
        if (!inp || inp.disabled || !val) return false
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set
        setter.call(inp, val)
        inp.dispatchEvent(new Event('input', { bubbles: true }))
        return true
      }, ANSWERS[answerIdx])
      if (typed) {
        await page.waitForTimeout(160)
        const sent = await page.evaluate(() => {
          const b = Array.from(document.querySelectorAll('.stage-content button'))
            .filter((x) => !x.disabled && !x.hasAttribute('data-control') && !x.hasAttribute('data-next'))
          if (!b.length) return false
          b[0].click()
          return true
        })
        if (sent) {
          answerIdx += 1
          clicks += 1
          await page.waitForTimeout(2400)
          continue
        }
      }
      // Slaydda hali hech narsa bosilmagan bo'lsa, qulf ochilishini KUTAMIZ.
      // Ikki sabab bo'ladi: mount dan keyin ~700 ms javob yopiq turadi, VA
      // xuk slaydida savoldan oldin ~6 soniyalik kino ketadi. Kutmasak,
      // «bosiladigan narsa yo'q» degan YOLG'ON xato chiqadi.
      // DIQQAT: kutish `i` ni yemasligi kerak -- shuning uchun ichki halqa,
      // `continue` emas. Aks holda kutish qadam budjetini tugatadi.
      if (clicks === 0 && !waited) {
        waited = 1
        let appeared = false
        for (let w = 0; w < WAIT_POLLS && !appeared; w += 1) {
          await page.waitForTimeout(WAIT_STEP_MS)
          appeared = await page.evaluate(() => {
            const content = document.querySelector('.stage-content')
            if (!content) return false
            return Array.from(content.querySelectorAll('button')).some((b) => !b.disabled && !b.hasAttribute('data-control'))
          })
        }
        if (appeared) { i -= 1; continue }
      }
      break
    }
    clicks += 1
    // Javobdan keyin keyingi savol DARROV chiqmaydi: maqtov o'qilishi uchun
    // 2 soniyacha kutiladi. Kutmasak, ko'p savolli ekran «bosiladigan narsa
    // yo'q» deb yarim yo'lda tashlab ketilardi (2026-08-11).
    await page.waitForTimeout(180)
    for (let w = 0; w < 14; w += 1) {
      const has = await page.evaluate(() => {
        const c = document.querySelector('.stage-content')
        if (!c) return false
        return Array.from(c.querySelectorAll('button')).some((b) => !b.disabled && !b.hasAttribute('data-control'))
      })
      if (has) break
      await page.waitForTimeout(220)
    }
  }
  await measure(page, `${tag} yakun`)
  await checkNoCyrillic(page, `${tag} yakun`, lang)
  return clicks
}

async function run(vp, lang) {
  const tag = `${vp.name}/${lang}`
  const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } })
  const consoleErrors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error' && !msg.text().includes('ERR_NETWORK_ACCESS_DENIED')) {
      consoleErrors.push(msg.text())
    }
  })
  page.on('pageerror', (err) => consoleErrors.push('pageerror: ' + err.message))

  answerIdx = 0
  await page.goto(`${BASE}?lang=${lang}`, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.waitForSelector('.stage-content', { timeout: 60000 })
  await page.waitForTimeout(700)
  // OVOZNI O'CHIRAMIZ. Etalon: ovoz o'chiq bo'lsa dars to'liq o'tiladi (9.2).
  // Ovoz yoniq bo'lsa javob ko'rsatma tugagunicha qulflangan -- bu TO'G'RI,
  // lekin har ekranda 5-6 soniya kutish kerak bo'lardi. Ovoz yoniq holatdagi
  // qulfni `grade7-blitz-check.mjs` tekshiradi.
  await page.evaluate(() => {
    const b = document.querySelector('.g7-tool-sound')
    if (b) b.click()
  })
  await page.waitForTimeout(300)

  for (let slide = 0; slide < TOTAL_SLIDES; slide += 1) {
    const shown = await page.evaluate(() => {
      // 2026-08-06: 7-sinf o'z yadrosiga qaytdi, prefiks `g7-`.
      const c = document.querySelector('.g7-count')
      return c ? c.textContent : ''
    })
    // Hisoblagich 3-sinfdagidek «08 / 15» ko'rinishida -- bo'shliqlar e'tiborga olinmaydi
    // «01 / 15» ham, «1/15» ham to'g'ri: bo'shliq va oldingi nol e'tiborsiz.
    const norm = String(shown).replace(/\s+/g, '').replace(/(^|\/)0+(\d)/g, '$1$2')
    if (norm !== `${slide + 1}/${TOTAL_SLIDES}`) {
      problems.push(`${tag}: ${slide + 1}-slaydda kutildi, hisoblagichda "${shown}"`)
    }
    const clicks = await walkSlide(page, `${tag} slayd ${slide + 1}`, lang)
    // Yakuniy ekranda javob berilmaydi -- u yerda bosiladigan narsa
    // bo'lmasligi NORMAL (xulosa ekrani).
    if (clicks === 0 && slide < TOTAL_SLIDES - 1) {
      problems.push(`${tag}: ${slide + 1}-slaydda BOSILADIGAN narsa yo'q -- javob qulfi ochilmadi?`)
    }
    if (slide === 0 || slide === 7 || slide === TOTAL_SLIDES - 1) {
      await page.screenshot({ path: `${OUT}/${vp.name}-${lang}-s${String(slide + 1).padStart(2, '0')}.png` })
    }
    if (slide < TOTAL_SLIDES - 1) {
      const advanced = await page.evaluate(() => {
        const nav = document.querySelector('.stage-nav')
        if (!nav) return false
        // `data-next` bo'lsa AYNAN o'sha bosiladi. Aks holda «oxirgi ochiq
        // tugma» qoidasi «Davom» qulflanganda «Orqaga» ni bosib yuborardi --
        // dars oldinga emas, orqaga ketardi (2026-08-11 o'lchovi).
        const marked = nav.querySelector('button[data-next]')
        if (marked) {
          if (marked.disabled) return false
          marked.click()
          return true
        }
        const btns = Array.from(nav.querySelectorAll('button')).filter((b) => !b.disabled)
        const next = btns[btns.length - 1]
        if (!next) return false
        next.click()
        return true
      })
      if (!advanced) {
        problems.push(`${tag}: ${slide + 1}-slayddan o'tolmadi (Davom qulflangan)`)
        break
      }
      await page.waitForTimeout(320)
    }
  }

  // Yakuniy tugma
  const finished = await page.evaluate(() => {
    const nav = document.querySelector('.stage-nav')
    const btns = nav ? Array.from(nav.querySelectorAll('button')) : []
    const fin = btns[btns.length - 1]
    if (!fin || fin.disabled) return false
    fin.click()
    return true
  })
  if (!finished) problems.push(`${tag}: darsni yakunlash tugmasi ishlamadi`)

  if (consoleErrors.length) {
    problems.push(`${tag}: konsol xatolari -> ${consoleErrors.slice(0, 3).join(' | ')}`)
  }
  await page.close()
}

const LANGS = (process.env.GRADE7_LANGS || 'uz,ru,en').split(',')
for (const vp of VIEWPORTS) {
  for (const lang of LANGS) {
    await run(vp, lang)
  }
}
await browser.close()

console.log(`O'lchovlar: ${measurements}`)
if (problems.length) {
  console.error(`\nMUAMMOLAR (${problems.length}):`)
  const uniq = Array.from(new Set(problems))
  uniq.slice(0, 60).forEach((p) => console.error('  ' + p))
  if (uniq.length > 60) console.error(`  ... yana ${uniq.length - 60}`)
  if (worst.over) console.error(`\nEng yomoni: ${worst.over}px -- ${worst.where}`)
  process.exitCode = 1
} else {
  console.log('OK: 15 slayd, hamma ochilish qadami, 5 o\'lcham, 3 til -- skroll yo\'q, konsol toza.')
}
