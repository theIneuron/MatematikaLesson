// ============================================================================
// 10-sinf darsi tekshiruvi: SKROLL YO'Q + uch til + konsol xatolari.
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
//   npx vite --port 5210 --strictPort
//   node scripts/grade10-noscroll.mjs
// (qumtutqichda 127.0.0.1 bloklangan, shu sababli localhost)
// ============================================================================
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const PORT = process.env.GRADE10_PORT || '5210'
const SLUG = 'dars03-trigonometrik-doira'
const BASE = `http://localhost:${PORT}/10-sinf/matematika/nazariy/${SLUG}?g10fast=1`
const OUT = '.tmp/grade10-noscroll'
const TOTAL_SLIDES = 15
const MAX_STEPS_PER_SLIDE = 22

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

// Chizma poli. 11-sinf qolipida chizma IKKI XIL rol o'ynaydi:
//   ISH YUZASI -- o'quvchi nuqtani o'zi qo'yadi (2-7, 9, 10, 13-ekranlar).
//     Pol 220: o'lchangan eng kichigi 229 (7-ekran, telefon).
//   YORDAMCHI panel -- xuk, qoida, tuzoq isboti, blits, yakun. Balandligi
//     ataylab aniq berilgan (140-300), pol tekshirilmaydi.
const WORK_SCREENS = [2, 3, 4, 5, 6, 7, 9, 10, 13]
let FLOOR = 220
let SLIDE = 1
const exempt = () => WORK_SCREENS.indexOf(SLIDE) === -1

async function measure(page, where) {
  const m = await page.evaluate(() => {
    const content = document.querySelector('.stage-content')
    const root = document.querySelector('.lesson-root')
    if (!content || !root) return null
    // Kartochka ICHIDAGI obrezka skroll BERMAYDI -- matn shunchaki yo'qoladi va
    // buni ko'z ilg'amaydi. Namuna: design/etalon-7-10/measure.mjs.
    const clipped = Array.from(root.querySelectorAll('*'))
      .map((el) => {
        const cs = getComputedStyle(el)
        // Ataylab yig'ilgan element obrezka emas: u ko'rinmaydi.
        if (el.clientHeight === 0 || cs.opacity === '0' || cs.maxHeight === '0px') return null
        const clipY = cs.overflowY === 'hidden' || cs.overflowY === 'clip'
        const clipX = cs.overflowX === 'hidden' || cs.overflowX === 'clip'
        const dy = clipY ? el.scrollHeight - el.clientHeight : 0
        const dx = clipX ? el.scrollWidth - el.clientWidth : 0
        if (dy <= 2 && dx <= 2) return null
        return String(el.className).slice(0, 34) + (dy > 2 ? ' +' + dy + 'px balandlik' : '') + (dx > 2 ? ' +' + dx + 'px kenglik' : '')
      })
      .filter(Boolean)
    const svg = document.querySelector('.g10-circle')
    return {
      overY: content.scrollHeight - content.clientHeight,
      overX: content.scrollWidth - content.clientWidth,
      docOverX: document.documentElement.scrollWidth - window.innerWidth,
      docOverY: document.documentElement.scrollHeight - window.innerHeight,
      budget: content.clientHeight,
      clipped,
      svg: svg ? Math.round(svg.getBoundingClientRect().width) : 0,
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
  if (m.clipped.length) problems.push(`${where}: kartochka ichida OBREZKA -> ${m.clipped.join(' | ')}`)
  // Chizma poli: ish yuzasi bo'lgan ekranlarda. Yordamchi panellar va
  // chizmasiz ekranlar (11, 15) tekshiruvga kirmaydi.
  if (m.svg > 0 && m.svg < FLOOR && !exempt()) problems.push(`${where}: chizma ${m.svg}px -- pol ${FLOOR}px dan past`)
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

async function walkSlide(page, tag, lang) {
  for (let i = 0; i < MAX_STEPS_PER_SLIDE; i += 1) {
    await measure(page, `${tag} qadam ${i}`)
    if (i === 0) await checkNoCyrillic(page, tag, lang)
    const clicked = await page.evaluate(() => {
      const content = document.querySelector('.stage-content')
      if (!content) return false
      const nodes = Array.from(content.querySelectorAll('button')).filter((b) => !b.disabled)
      if (!nodes.length) return false
      nodes[0].click()
      return true
    })
    if (!clicked) break
    await page.waitForTimeout(180)
  }
  await measure(page, `${tag} yakun`)
  await checkNoCyrillic(page, `${tag} yakun`, lang)
}

async function run(vp, lang) {
  const tag = `${vp.name}/${lang}`
  FLOOR = vp.w < 640 ? 210 : 220
  const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } })
  const consoleErrors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error' && !msg.text().includes('ERR_NETWORK_ACCESS_DENIED')) {
      consoleErrors.push(msg.text())
    }
  })
  page.on('pageerror', (err) => consoleErrors.push('pageerror: ' + err.message))

  await page.goto(`${BASE}&lang=${lang}`, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.waitForSelector('.stage-content', { timeout: 60000 })
  await page.waitForTimeout(700)

  for (let slide = 0; slide < TOTAL_SLIDES; slide += 1) {
    SLIDE = slide + 1
    const shown = await page.evaluate(() => {
      const c = document.querySelector('.g10-count')
      return c ? c.textContent : ''
    })
    if (shown !== `${slide + 1}/${TOTAL_SLIDES}`) {
      problems.push(`${tag}: ${slide + 1}-slaydda kutildi, hisoblagichda "${shown}"`)
    }
    await walkSlide(page, `${tag} slayd ${slide + 1}`, lang)
    if (slide === 0 || slide === 7 || slide === 15) {
      await page.screenshot({ path: `${OUT}/${vp.name}-${lang}-s${String(slide + 1).padStart(2, '0')}.png` })
    }
    if (slide < TOTAL_SLIDES - 1) {
      const advanced = await page.evaluate(() => {
        const nav = document.querySelector('.stage-nav')
        if (!nav) return false
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

const LANGS = (process.env.GRADE10_LANGS || 'uz,ru,en').split(',')
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
