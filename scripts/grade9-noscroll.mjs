// ============================================================================
// 9-sinf darsi tekshiruvi: SKROLL YO'Q + uch til + konsol xatolari.
// 7-sinf tekshiruvidan olindi (grade7-noscroll.mjs), farqi: 15 slayd, boshqa slug.
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
//   npx vite --port 5271 --strictPort
//   node scripts/grade9-noscroll.mjs
// (qumtutqichda 127.0.0.1 bloklangan, shu sababli localhost)
// ============================================================================
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const PORT = process.env.GRADE9_PORT || '5271'
const SLUG = 'dars15-oraliqlar-usuli'
const BASE = `http://localhost:${PORT}/9-sinf/matematika/nazariy/${SLUG}`
const OUT = '.tmp/grade9-noscroll'
const TOTAL_SLIDES = 15
const MAX_STEPS_PER_SLIDE = 30

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

// ETALON_9SINF_v2 §6.1. Ikki xil o'lchov, ikkovi ham HAR QADAMDA:
//   1) `.stage-content` sig'dimi -- skroll yo'qligi;
//   2) ICHKARIDA biror qutining kontenti kesilmadimi. Kartochka ichidagi kesilish
//      TASHQARIDAN KO'RINMAYDI: matn shunchaki yo'qoladi, skroll ham paydo bo'lmaydi.
//      Namuna: design/etalon-7-10/measure.mjs -- u 33 varaqda yettita kadr topgan,
//      shu jumladan 390 da 158px gorizontal chiqish.
// O'tishlar tugashini kutadi. Kesilish o'lchovi FAQAT tinch holatda ma'noli:
// javob berilgach variantlar 300 ms davomida yig'iladi, va o'sha paytda har
// qanday quti «kesyapti» deb ko'rinadi. Cheksiz animatsiyalar (kutish halqasi,
// tayyorlik pulsatsiyasi) hisobga olinmaydi -- ular hech qachon tugamaydi.
async function settle(page, ms = 700) {
  const step = 100
  for (let t = 0; t < ms; t += step) {
    const busy = await page.evaluate(() => document.getAnimations().some((a) => {
      if (a.playState !== 'running') return false
      try { return a.effect.getTiming().iterations !== Infinity } catch { return false }
    }))
    if (!busy) return
    await page.waitForTimeout(step)
  }
}

async function measure(page, where) {
  await settle(page)
  const m = await page.evaluate(() => {
    const content = document.querySelector('.stage-content')
    const root = document.querySelector('.lesson-root')
    if (!content || !root) return null

    // Kesuvchi qutilar. `.stage-content` ning O'ZI yuqorida alohida o'lchanadi,
    // shuning uchun bu yerda o'tkazib yuboriladi -- ikki marta yozilmasin.
    //
    // ATAYLAB yashirilgan element kesmaydi, u YO'Q: javob berilgach ortiqcha
    // variantlar `maxHeight: 0` va `opacity: 0` ga yig'iladi. Ularni hisoblash
    // har javobdan keyin uchta soxta xato berardi.
    const clipped = []
    root.querySelectorAll('*').forEach((el) => {
      if (el === content) return
      const cs = getComputedStyle(el)
      if (cs.display === 'none' || cs.visibility === 'hidden') return
      if (parseFloat(cs.opacity) < 0.05) return
      const r = el.getBoundingClientRect()
      if (r.height < 1 || r.width < 1) return
      const clipY = cs.overflowY === 'hidden' || cs.overflowY === 'clip'
      const clipX = cs.overflowX === 'hidden' || cs.overflowX === 'clip'
      const dy = clipY ? el.scrollHeight - el.clientHeight : 0
      const dx = clipX ? el.scrollWidth - el.clientWidth : 0
      if (dy > 2 || dx > 2) {
        clipped.push({ cls: (el.className || '').toString().slice(0, 40) || el.tagName.toLowerCase(), dy, dx })
      }
    })

    return {
      overY: content.scrollHeight - content.clientHeight,
      overX: content.scrollWidth - content.clientWidth,
      docOverX: document.documentElement.scrollWidth - window.innerWidth,
      docOverY: document.documentElement.scrollHeight - window.innerHeight,
      budget: content.clientHeight,
      clipped,
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
  for (const c of m.clipped) {
    const what = [c.dy ? `+${c.dy}px balandlikda` : '', c.dx ? `+${c.dx}px enda` : ''].filter(Boolean).join(', ')
    problems.push(`${where}: KESILISH -- "${c.cls}" o'z kontentini kesmoqda (${what})`)
  }
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
  let idle = 0
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
    // Tushuntirish O'ZI ochiladi (ovoz o'chiq bo'lsa taymer bilan), shu paytda
    // bosiladigan tugma bo'lmaydi. Shuning uchun darhol chiqmaymiz: bir necha
    // marta KUTAMIZ va o'lchashni davom etamiz -- ochilish oralig'idagi holat
    // ham sig'ishi kerak.
    if (!clicked) {
      idle += 1
      if (idle > 6) break
      await page.waitForTimeout(700)
      continue
    }
    idle = 0
    await page.waitForTimeout(180)
  }
  await measure(page, `${tag} yakun`)
  await checkNoCyrillic(page, `${tag} yakun`, lang)
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

  await page.goto(`${BASE}?lang=${lang}`, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.waitForSelector('.stage-content', { timeout: 60000 })
  await page.waitForTimeout(700)

  // OVOZNI O'CHIRAMIZ. Sabab: 9-sinf darsida javob ko'rsatma tugamaguncha
  // qulflangan (`useInstructionGate`). Ovoz yoniq bo'lsa tekshiruv har ekranda
  // 12 soniya zaxira taymerini kutardi. Ovoz o'chiq bo'lsa qulf DARHOL ochiladi
  // -- bu ayni paytda «ovozsiz dars to'liq o'tiladi» talabini ham tekshiradi.
  await page.evaluate(() => {
    const btn = document.querySelector('.stage-header .lc-icon')
    if (btn) btn.click()
  })
  await page.waitForTimeout(250)

  for (let slide = 0; slide < TOTAL_SLIDES; slide += 1) {
    const shown = await page.evaluate(() => {
      // 2026-08-06: yadro shared ga ko'chdi, prefiks `g7-` -> `lc-`.
      const c = document.querySelector('.lc-count')
      return c ? c.textContent : ''
    })
    if (shown !== `${slide + 1}/${TOTAL_SLIDES}`) {
      problems.push(`${tag}: ${slide + 1}-slaydda kutildi, hisoblagichda "${shown}"`)
    }
    await walkSlide(page, `${tag} slayd ${slide + 1}`, lang)
    if (slide === 0 || slide === 4 || slide === 7 || slide === 14) {
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

const LANGS = (process.env.GRADE9_LANGS || 'uz,ru,en').split(',')
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
  console.log('OK: 15 slayd, hamma ochilish qadami, 5 o\'lcham, 3 til -- skroll yo\'q, kesilish yo\'q, konsol toza.')
}
