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
// Dars ARGUMENT bilan tanlanadi: sinfda endi bitta dars emas, va tekshiruv
// bittasiga qadalib qolmasligi kerak.
//   node scripts/grade11-noscroll.mjs            -- 12-dars (etalon)
//   node scripts/grade11-noscroll.mjs dars09     -- 9-dars
const LESSONS = {
  dars01: 'dars01-boshlangich-funksiya',
  dars02: 'dars02-qoidalar',
  dars03: 'dars03-aniqmas-integral',
  dars04: 'dars04-aniq-integral',
  dars05: 'dars05-nyuton-leybnits',
  dars06: 'dars06-figura-yuzasi',
  dars07: 'dars07-tatbiqlar',
  dars16: 'dars16-orin-almashtirishlar',
  dars17: 'dars17-orinlashtirishlar',
  dars18: 'dars18-guruhlashlar',
  dars19: 'dars19-nyuton-binomi',
  dars20: 'dars20-ehtimollik',
  dars21: 'dars21-qoshish-kopaytirish',
  dars22: 'dars22-ortacha-mediana',
  dars23: 'dars23-ikki-qator',
  dars27: 'dars27-silindr',
  dars28: 'dars28-konus',
  dars29: 'dars29-shar-sfera',
  dars30: 'dars30-sirtlar',
  dars31: 'dars31-hajm-prizma',
  dars32: 'dars32-hajm-konus',
  dars24: 'dars24-taqsimotlar',
  dars09: 'dars09-korsatkichli-tenglamalar',
  dars10: 'dars10-korsatkichli-tengsizliklar',
  dars11: 'dars11-logarifmik-tenglamalar',
  dars12: 'dars12-logarifmik-tengsizliklar',
  dars13: 'dars13-sistemalar',
  dars14: 'dars14-masalalar',
}
const WANT = process.argv.slice(2).find((a) => !a.startsWith('--')) || 'dars12'
const SLUG = LESSONS[WANT] || WANT
const BASE = `http://localhost:${PORT}/11-sinf/matematika/nazariy/${SLUG}`
const OUT = '.tmp/grade11-noscroll'
const TOTAL_SLIDES = 15
const MAX_STEPS_PER_SLIDE = 34

const VIEWPORTS = [
  { name: 'noutbuk-1366x615', w: 1366, h: 615 },
  { name: 'noutbuk-1366x655', w: 1366, h: 655 },
  { name: 'monitor-1920x950', w: 1920, h: 950 },
  { name: 'telefon-390x745', w: 390, h: 745 },
  // HAQIQIY telefon: yuqorida holat paneli, pastda brauzer paneli -- kontentga
  // ~660px qoladi. 745 da qirqilish KO'RINMAYDI, telefonda esa ko'rinadi.
  { name: 'telefon-393x660', w: 393, h: 660 },
  { name: 'telefon-360x690', w: 360, h: 690 },
].filter((vp) => !process.env.GRADE11_ONLY || vp.name.indexOf(process.env.GRADE11_ONLY) !== -1)

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
      // ANIMATSIYA paytida blok vaqtincha suriladi (`g11-reveal` translateY
      // bilan chiqadi) va qo'shnisiga 2-3px minib turadi. Bu vyorstka xatosi
      // EMAS -- bir necha yuz millisekunddan keyin o'z joyiga tushadi.
      // Shuning uchun animatsiyasi KETAYOTGAN bloklar tekshirilmaydi.
      const busy = (el) => {
        try {
          return typeof el.getAnimations === 'function'
            && el.getAnimations().some((an) => an.playState === 'running')
        } catch { return false }
      }
      for (let i = 0; i < kids.length - 1 && !clash; i += 1) {
        if (busy(kids[i]) || busy(kids[i + 1])) continue
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
      // Ostona 6px: blok balandliklari kasrli (masalan 113,25px), ochilish
      // animatsiyasi paytida yaxlitlash 2-3px farq beradi va bu HAQIQIY
      // muammo emas. 7-slayddagi haqiqiy holat 52px edi -- ya'ni ostona
      // ma'noli xatolarni bemalol ushlaydi.
      if (!clash) {
        for (const el of kids) {
          // Ichida animatsiya ketayotgan blok o'tkazib yuboriladi: `g11-reveal`
          // paytida scrollHeight vaqtincha oshadi va yolg'on signal beradi.
          let inner = []
          try { inner = typeof el.getAnimations === 'function' ? el.getAnimations({ subtree: true }) : [] } catch { inner = [] }
          if (busy(el) || inner.some((an) => an.playState === 'running')) continue
          if (el.scrollHeight - el.clientHeight > 6 && getComputedStyle(el).overflow === 'visible') {
            clash = { over: el.scrollHeight - el.clientHeight, a: (el.className || '').slice(0, 34), b: 'kontent tashqarida' }
            break
          }
        }
      }
    }

    // GORIZONTAL KESILISH. `.stage-content` da `overflow: clip` turibdi, va
    // clip skroll konteyneri YARATMAYDI: ichkaridagi uzun formula ekrandan
    // chiqib ketsa, `content.scrollWidth` o'smaydi va tekshiruv «toza» deydi.
    // 2-darsning xuki telefonda «(2x + 1» da kesilgan edi, o'lchov esa nol
    // ko'rsatgan. Shuning uchun HAR BIR matnli element o'zi bilan solishtiriladi.
    let cutX = null
    {
      const busyX = (el) => {
        try {
          return typeof el.getAnimations === 'function'
            && el.getAnimations({ subtree: true }).some((an) => an.playState === 'running')
        } catch { return false }
      }
      for (const el of content.querySelectorAll('*')) {
        if (el instanceof SVGElement) continue
        const over = el.scrollWidth - el.clientWidth
        if (over <= 2) continue
        if (el.clientWidth < 2) continue
        const cs = getComputedStyle(el)
        if (cs.overflowX === 'auto' || cs.overflowX === 'scroll') continue
        if (busyX(el)) continue
        cutX = {
          over,
          cls: (el.className || el.tagName).toString().slice(0, 26),
          txt: (el.textContent || '').trim().slice(0, 30),
        }
        break
      }
    }

    // YUQORI PANEL va NAVIGATSIYA ham o'lchanadi. Ilgari faqat ish maydoni
    // tekshirilardi, panel esa telefonda 199px ga chiqib ketib, til
    // almashtirgichni ekrandan tashqariga chiqarib qo'ygan edi -- `overflow:
    // clip` tufayli skroll paydo bo'lmagan va tekshiruv «toza» degan.
    const chrome = []
    for (const sel of ['.stage-header', '.stage-nav']) {
      const el = root.querySelector(sel)
      if (!el) continue
      const ox = el.scrollWidth - el.clientWidth
      if (ox > 1) chrome.push(sel + ' gorizontal ' + ox + 'px')
      // Bola element ekran chegarasidan chiqib ketdimi
      const vw = window.innerWidth
      for (const kid of el.querySelectorAll('*')) {
        const r = kid.getBoundingClientRect()
        if (r.width < 2 || r.height < 2) continue
        if (r.right > vw + 1 || r.left < -1) {
          chrome.push(sel + ' > ' + (kid.className || kid.tagName).toString().slice(0, 22)
            + ' ekrandan tashqarida (' + Math.round(r.left) + '..' + Math.round(r.right) + ' / ' + vw + ')')
          break
        }
      }
    }

    return {
      chrome: chrome.length ? chrome.slice(0, 2) : null,
      overY: content.scrollHeight - content.clientHeight,
      overX: content.scrollWidth - content.clientWidth,
      docOverX: document.documentElement.scrollWidth - window.innerWidth,
      docOverY: document.documentElement.scrollHeight - window.innerHeight,
      budget: content.clientHeight,
      clash,
      cutX,
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
  if (m.chrome) {
    for (const c of m.chrome) problems.push(`${where}: PANEL -> ${c}`)
  }
  if (m.clash) {
    problems.push(`${where}: BLOKLAR USTMA-UST ${m.clash.over}px -> "${m.clash.a}" va "${m.clash.b}"`)
    if (m.clash.over > worst.over) worst = { over: m.clash.over, where: where + ' (ustma-ust)' }
  }
  if (m.cutX) {
    problems.push(`${where}: MATN KESILDI ${m.cutX.over}px -> "${m.cutX.cls}" : ${m.cutX.txt}`)
    if (m.cutX.over > worst.over) worst = { over: m.cutX.over, where: where + ' (kesildi)' }
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
  // 60 x 400 ms = 24 s. Ochilish endi ovoz VAQTIGA teng, eng uzun slayd
  // (2-slayd, 88 s) `g11fast=1` da ~11 s oladi -- eski 9,6 s yetmasdi va
  // tekshiruv kech ochilgan fazalarni umuman o'lchamasdi.
  for (let w = 0; w < 60 && stable < 2; w += 1) {
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
  // Ish jarayoni KO'RINSIN: prokat 20 daqiqadan oshadi, hisobot esa faqat
  // oxirida yoziladi -- tashqaridan qotib qolgandek ko'rinardi.
  const t0 = process.hrtime.bigint()
  const before = problems.length
  process.stdout.write(`[${tag}] boshlandi
`)
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
  const secs = Number((process.hrtime.bigint() - t0) / 1000000000n)
  const found = problems.length - before
  process.stdout.write(
    `[${tag}] tugadi -- ${secs} s, ${found ? found + ' muammo' : 'toza'}, jami o'lchov ${measurements}
`,
  )
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
  // XULOSA JADVALI ro'yxatdan OLDIN. Sabab: ro'yxat kesilganda kesilgan
  // qismdagi muammolar ko'rinmay qolardi va prokat «toza» degandek
  // o'qilardi -- aynan shu bo'lgan: telefon satrlari 60 dan keyin qolib,
  // xulosa esa faqat noutbukni ko'rsatgan.
  const worstBy = new Map()
  for (const p of uniq) {
    const m = /^(\S+)\/(\w+) slayd (\d+).*?(\d+)px/.exec(p)
    if (!m) continue
    const key = `s${m[3].padStart(2, '0')} ${m[1]}`
    const px = Number(m[4])
    if (!worstBy.has(key) || worstBy.get(key) < px) worstBy.set(key, px)
  }
  if (worstBy.size) {
    console.error('\nXULOSA -- slayd va o\'lcham bo\'yicha eng katta oshib ketish:')
    Array.from(worstBy.entries())
      .sort((a, b) => b[1] - a[1])
      .forEach(([k, px]) => console.error(`  ${k}  +${px}px`))
  }
  console.error('')
  uniq.slice(0, 400).forEach((p) => console.error('  ' + p))
  if (uniq.length > 400) console.error(`  ... yana ${uniq.length - 400}`)
  if (worst.over) console.error(`\nEng yomoni: ${worst.over}px -- ${worst.where}`)
  process.exitCode = 1
} else {
  console.log('OK: 15 slayd, hamma ochilish qadami, 5 o\'lcham, 3 til -- skroll yo\'q, konsol toza.')
}
