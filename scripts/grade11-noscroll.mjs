// ============================================================================
// 11-sinf darsi tekshiruvi: SKROLL YO'Q + uch til + konsol xatolari.
//
// Metodist talabi (2026-08-06): na kompyuterda, na telefonda skroll bo'lmasin.
// Shu sababli tekshiruv slaydning FAQAT yakuniy holatini emas, HAR BIR
// ochilish qadamini o'lchaydi: slayd oxirida sig'ib, o'rtasida sig'masligi
// mumkin (savol hali ekranda, razbor allaqachon ochilgan).
//
// `.stage-content` da `overflow: clip` -- ya'ni skroll paydo bo'lmaydi, lekin
// sig'magan kontent KO'RINMAY QOLADI. Shuning uchun mezon: scrollHeight
// clientHeight dan katta bo'lmasin.
//
// Ishga tushirish:
//   npx vite --port 5262 --strictPort
//   node scripts/grade11-noscroll.mjs
// (qumtutqichda 127.0.0.1 bloklangan, shu sababli localhost)
// ============================================================================
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const PORT = process.env.GRADE11_PORT || '5263'
const SLUG = 'dars12-logarifmik-tengsizliklar'
const BASE = `http://localhost:${PORT}/11-sinf/matematika/nazariy/${SLUG}`
const OUT = '.tmp/grade11-noscroll'
const TOTAL_SLIDES = 15
const MAX_STEPS_PER_SLIDE = 34

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

    // USTMA-UST TUSHISH. Vertikal ustundagi qo'shni bloklar kesishmasligi
    // kerak. Bu skrolldan MUSTAQIL xato: siqilgan flex konteyner kontentni
    // tashqariga chiqaradi, scrollHeight esa o'zgarmaydi.
    let clash = null
    const stack = content.querySelector('.g11-stack')
    if (stack) {
      const kids = Array.from(stack.children).filter((el) => {
        const cs = getComputedStyle(el)
        if (cs.display === 'none' || cs.position === 'absolute') return false
        const r = el.getBoundingClientRect()
        return r.height > 2
      })
      for (let i = 0; i < kids.length - 1 && !clash; i += 1) {
        const a = kids[i].getBoundingClientRect()
        const b = kids[i + 1].getBoundingClientRect()
        const over = Math.round(a.bottom - b.top)
        if (over > 2) {
          clash = {
            over,
            a: (kids[i].className || '').slice(0, 34),
            b: (kids[i + 1].className || '').slice(0, 34),
          }
        }
      }
      // Konteyner o'z kontentidan kichik bo'lib qolganini ham ushlaymiz.
      if (!clash) {
        for (const el of kids) {
          if (el.scrollHeight - el.clientHeight > 2 && getComputedStyle(el).overflow === 'visible') {
            clash = { over: el.scrollHeight - el.clientHeight, a: (el.className || '').slice(0, 34), b: 'kontent tashqarida' }
            break
          }
        }
      }
    }

    return {
      overY: content.scrollHeight - content.clientHeight,
      overX: content.scrollWidth - content.clientWidth,
      docOverX: document.documentElement.scrollWidth - window.innerWidth,
      docOverY: document.documentElement.scrollHeight - window.innerHeight,
      budget: content.clientHeight,
      clash,
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
  if (m.clash) {
    problems.push(`${where}: BLOKLAR USTMA-UST ${m.clash.over}px -> "${m.clash.a}" va "${m.clash.b}"`)
    if (m.clash.over > worst.over) worst = { over: m.clash.over, where: where + ' (ustma-ust)' }
  }
  if (m.overX > 1) problems.push(`${where}: gorizontal oshib ketish ${m.overX}px`)
  if (m.docOverX > 1) problems.push(`${where}: sahifa gorizontal skroll ${m.docOverX}px`)
  if (m.docOverY > 1) problems.push(`${where}: sahifa vertikal skroll ${m.docOverY}px`)
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
    if (!clicked) {
      // Qayta urinish: kollaps taymeri (1700 ms) tugashini kutamiz.
      let again = false
      for (let r = 0; r < 4; r += 1) {
        await page.waitForTimeout(600)
        again = await page.evaluate(() => {
          const content = document.querySelector('.stage-content')
          if (!content) return false
          const nodes = Array.from(content.querySelectorAll('button')).filter((b) => !b.disabled)
          if (!nodes.length) return false
          nodes[0].click()
          return true
        })
        if (again) break
      }
      if (!again) break
    }
    await page.waitForTimeout(180)
  }
  // Ochilish OVOZ bilan boradi, tugma bosilmasa ham kontent o'sadi. Shuning
  // uchun yakuniy o'lchovdan oldin slaydning TINCHLANISHINI kutamiz: balandlik
  // ketma-ket ikki tekshiruvda o'zgarmasa -- ochilish tugagan.
  let prevH = -1
  let stable = 0
  for (let w = 0; w < 24 && stable < 2; w += 1) {
    await page.waitForTimeout(400)
    const h = await page.evaluate(() => {
      const c = document.querySelector('.stage-content')
      return c ? c.scrollHeight : -1
    })
    stable = h === prevH ? stable + 1 : 0
    prevH = h
    // tinchlanish paytida ham o'lchaymiz: o'rtada sig'masligi mumkin
    await measure(page, `${tag} ochilish ${w}`)
    const clicked = await page.evaluate(() => {
      const content = document.querySelector('.stage-content')
      if (!content) return false
      const nodes = Array.from(content.querySelectorAll('button')).filter((b) => !b.disabled)
      if (!nodes.length) return false
      nodes[0].click()
      return true
    })
    if (clicked) stable = 0
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
  // Stekni ham yozamiz: `pageerror` bir marta chiqib, takrorlanmasligi mumkin --
  // xabarning o'zi qaysi joyda ekanini ko'rsatmaydi.
  page.on('pageerror', (err) => {
    const stack = String(err.stack || '').replace(/\s+/g, ' ').slice(0, 200)
    consoleErrors.push('pageerror: ' + err.message + ' | ' + stack)
  })

  // `g11fast=1` -- ovoz bilan sinxron ochilishni tezlatadi, aks holda
  // 15 slayd x 5 o'lchov x 3 til bir soatdan oshadi.
  await page.goto(`${BASE}?lang=${lang}&g11fast=1`, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.waitForSelector('.stage-content', { timeout: 60000 })
  await page.waitForTimeout(700)

  // Dars HAQIQATAN so'ralgan tilda ochildimi. Bu tekshiruvsiz `?lang=` e'tiborga
  // olinmasa ham prokat «uch til tekshirildi» deb yozib qo'yadi, ammo uch marta
  // BIR XIL til o'lchanadi. Aynan shu bo'lgan: LessonPage 11-sinfni bilmasdi.
  const langSeen = await page.evaluate(() => {
    const el = document.querySelector('.stage-content')
    const txt = el ? el.textContent || '' : ''
    return { cyr: /[А-я]/.test(txt), len: txt.length }
  })
  firstTitle[lang] = await page.evaluate(() => {
    const el = document.querySelector('.g11-title')
    return el ? (el.textContent || '').trim() : ''
  })
  if (langSeen.len < 20) {
    problems.push(`${tag}: ekran bo'sh (matn ${langSeen.len} belgi)`)
  } else if (lang === 'ru' && !langSeen.cyr) {
    problems.push(`${tag}: ru so'raldi, lekin kirill matn YO'Q -> til uzatilmagan`)
  } else if (lang !== 'ru' && langSeen.cyr) {
    problems.push(`${tag}: ${lang} so'raldi, lekin kirill matn BOR`)
  }

  for (let slide = 0; slide < TOTAL_SLIDES; slide += 1) {
    const readCount = () => page.evaluate(() => {
      const c = document.querySelector('.g11-count')
      return c ? c.textContent : ''
    })
    let shown = await readCount()
    if (shown !== `${slide + 1}/${TOTAL_SLIDES}`) {
      await page.waitForTimeout(600)
      shown = await readCount()
    }
    if (shown !== `${slide + 1}/${TOTAL_SLIDES}`) {
      problems.push(`${tag}: ${slide + 1}-slaydda kutildi, hisoblagichda "${shown}"`)
    }
    await walkSlide(page, `${tag} slayd ${slide + 1}`, lang)
    if (slide === 0 || slide === 3 || slide === 14) {
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
      await page.waitForTimeout(700)
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

// Har til uchun 1-slayd sarlavhasi: uz va en ikkisi ham lotin, kirill tekshiruvi
// ularni ajratmaydi. Sarlavhalar bir xil chiqsa -- til aslida almashmagan.
const firstTitle = {}

const LANGS = (process.env.GRADE11_LANGS || 'uz,ru,en').split(',')
for (const vp of VIEWPORTS) {
  for (const lang of LANGS) {
    await run(vp, lang)
  }
}
await browser.close()

const titles = Object.entries(firstTitle).filter(([, v]) => v)
if (titles.length > 1) {
  const seen = new Map()
  for (const [lng, txt] of titles) {
    if (seen.has(txt)) problems.push(`til almashmagan: ${seen.get(txt)} va ${lng} sarlavhasi bir xil -> "${txt}"`)
    else seen.set(txt, lng)
  }
}

console.log(`O'lchovlar: ${measurements}`)
titles.forEach(([lng, txt]) => console.log(`  ${lng}: ${txt}`))
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
