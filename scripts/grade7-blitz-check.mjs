// ============================================================================
// 7-sinf, Dars 5: BLITS va YAKUN ning FUNKSIONAL tekshiruvi.
//
// `grade7-noscroll.mjs` tugmalarni ketma-ket bosadi, ya'ni blitsni ATAYLAB
// xato javob bilan o'tadi. Bu skript boshqasini tekshiradi:
//   1. blitsning to'rt savoliga BIRINCHI urinishda to'g'ri javob berilsa,
//      yakundagi halqa 4/4 ni ko'rsatadimi;
//   2. teg yozilmagan bo'lsa, yakun «takrorlash kerak joy yo'q» deydimi;
//   3. yuqori paneldagi til almashtirgichi ishlaydimi.
//
// Ishga tushirish:
//   npx vite preview --port 5299 --strictPort   (yoki npx vite --port 5299)
//   node scripts/grade7-blitz-check.mjs
// ============================================================================
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

// Skript BITTA darsga qotib qolmasin: dars slug bilan tanlanadi, to'g'ri
// javoblar va yakun matnlari esa shu jadvalda turadi. Yangi dars -- shu yerga
// bitta qator, yangi fayl EMAS.
const LESSONS = {
  'dars01-sonli-ifodalar': {
    right: ['16', '18', '20', 'число, полученное в результате действий'],
    noGap: /Пробелов нет/i,
    // Yakun 2026-08-13 da 6-sinf naqshiga o'tkazildi: HALQA olib tashlandi,
    // tayyorlik esa kartochka ichida SO'Z bilan turadi. Tekshiruv shu
    // tuzilishni kutadi -- eskisini emas.
    ring: false,
    readySel: '.g7-readyline',   // aynan TAYYORLIK satri, boshqa izohlar emas
  },
  'dars02-ozgaruvchili-ifodalar': {
    // 4a da a teng 3 -- 12; 10 ayirish 2a da a teng 4 -- 2; 6 bo'lish a da
    // qo'yib bo'lmaydigan son -- 0; oxirgisi so'z bilan.
    right: ['12', '2', '0', 'Сколько чисел поставим вместо буквы'],
    noGap: /Пробелов нет/i,
    ring: false,
    readySel: '.g7-readyline',
  },
  'dars07-tenglama-ildizi': {
    right: ['6', '7', 'Ни одного', 'Найти все корни или показать, что их нет'],
    noGap: /Пробелов нет/i,
    ring: false,
    readySel: '.g7-readyline',
  },
  'dars08-chiziqli-tenglama': {
    right: ['12', '3', 'Все числа', 'Сразу к обеим частям'],
    noGap: /Пробелов нет/i,
    ring: false,
    readySel: '.g7-readyline',
  },
  'dars09-tenglamalarni-yechish': {
    right: ['5', '+7', 'Все числа', 'Уничтожают в обеих частях'],
    noGap: /Пробелов нет/i,
    ring: false,
    readySel: '.g7-readyline',
  },
  'dars10-modulli-tenglama': {
    right: ['8 и −8', '6', 'Ни одного', 'По обе стороны от центра есть точки'],
    noGap: /Пробелов нет/i,
    ring: false,
    readySel: '.g7-readyline',
  },
  'dars11-masala-tenglama': {
    right: ['6x', 'Меньшую', 'Из связи в условии', '36'],
    noGap: /Пробелов нет/i,
    ring: false,
    readySel: '.g7-readyline',
  },
  'dars12-masala-tuzish': {
    right: ['25 − x', '6 000 − 300x', 'Одна', '18'],
    noGap: /Пробелов нет/i,
    ring: false,
    readySel: '.g7-readyline',
  },
  'dars13-daraja': {
    // DIQQAT: `Fx` ustki ko'rsatkichni <sup> qiladi, innerText da u
    // oddiy raqam bo'ladi -- shuning uchun `2x3`, `2x³` emas.
    right: ['−8a3', '2x3', '−9', '9'],
    noGap: /Пробелов нет/i,
    ring: false,
    readySel: '.g7-readyline',
  },
  'dars14-daraja-xossalari': {
    // innerText da ustki ko'rsatkich oddiy raqam bo'ladi.
    right: ['a15', 'b20', 'x7', '(ab)4'],
    noGap: /Пробелов нет/i,
    ring: false,
    readySel: '.g7-readyline',
  },
  'dars15-bir-had': {
    right: ['−5', '−1', '12b3', '2a + b'],
    noGap: /Пробелов нет/i,
    ring: false,
    readySel: '.g7-readyline',
  },
  'dars16-bir-hadlarni-kopaytirish': {
    right: ['10a3', '−12x3', '10ab', '4x3'],
    noGap: /Пробелов нет/i,
    ring: false,
    readySel: '.g7-readyline',
  },
  'dars17-bir-had-darajasi': {
    right: ['25a2', '−8x9', '2a2', '4a2 : 2a5'],
    noGap: /Пробелов нет/i,
    ring: false,
    readySel: '.g7-readyline',
  },
  'dars06-oxshash-hadlar': {
    right: ['9a', '6b', 'Нет, буквы разные', 'Складывают'],
    noGap: /Пробелов нет/i,
    ring: false,
    readySel: '.g7-readyline',
  },
  'dars05-qavslarni-ochish': {
    right: ['4', '14', '−3', 'Меняет знак каждого слагаемого внутри'],
    noGap: /Пробелов нет/i,
    ring: false,
    readySel: '.g7-readyline',
  },
  'dars03-amallar-xossalari': {
    // 25 karra 37 karra 4; ayirishdagi qavs; 4 karra qavs 10 qo'shuv 3;
    // oxirgisi so'z bilan.
    right: ['3700', 'Нет, 12 и 18', '52', 'Отправляет множитель к каждому слагаемому'],
    noGap: /Пробелов нет/i,
    ring: false,
    readySel: '.g7-readyline',
  },
}

const PORT = process.env.GRADE7_PORT || '5299'
const SLUG = process.env.GRADE7_SLUG || 'dars01-sonli-ifodalar'
const CFG = LESSONS[SLUG]
if (!CFG) {
  console.error(`Noma'lum dars: ${SLUG}. LESSONS jadvaliga qo'shing.`)
  process.exit(1)
}
const BASE = `http://localhost:${PORT}/7-sinf/matematika/nazariy/${SLUG}`
const OUT = '.tmp/grade7-blitz'
const BLITZ = 13 // 0 dan hisoblanadi: 14-ekran
const RIGHT = CFG.right

await mkdir(OUT, { recursive: true })
const problems = []
const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1366, height: 655 } })
const errors = []
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message))
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })

await page.goto(`${BASE}?lang=ru`, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForSelector('.stage-content', { timeout: 60000 })
await page.waitForTimeout(900)

// --- blitsgacha «Davom» bilan boramiz (FREE_NAV=true)
for (let i = 0; i < BLITZ; i += 1) {
  const ok = await page.evaluate(() => {
    const nav = document.querySelector('.stage-nav')
    const btns = nav ? Array.from(nav.querySelectorAll('button')).filter((b) => !b.disabled) : []
    const next = btns[btns.length - 1]
    if (!next) return false
    next.click()
    return true
  })
  if (!ok) { problems.push(`${i + 1}-ekrandan o'tolmadi`); break }
  await page.waitForTimeout(260)
}

const shown = await page.evaluate(() => {
  const c = document.querySelector('.g7-count')
  return c ? c.textContent : ''
})
// Hisoblagich yadroda `{screen + 1} / {total}` bo'lib chiziladi, ya'ni
// probellar bilan. Skript ilgari `14/15` ni kutardi va SHU SABABLI 5-darsda
// ham yiqilardi (tekshirildi 2026-08-13). Taqqoslash probelsiz qilinadi.
const norm = (s) => String(s || '').replace(/\s+/g, '')
if (norm(shown) !== '14/15') problems.push(`blits kutildi (14/15), hisoblagichda "${shown}"`)

// --- to'rt savolga BIRINCHI urinishda to'g'ri javob
for (const want of RIGHT) {
  // Ko'rsatma qulfi ochilishini KUTAMIZ: `useInstructionGate` mount dan keyin
  // 900 ms davomida javobni yopib turadi (ovoz yoniqda -- ko'rsatma tugagunicha).
  let clicked = false
  for (let tryNo = 0; tryNo < 12 && !clicked; tryNo += 1) {
    await page.waitForTimeout(300)
    clicked = await page.evaluate((label) => {
      const opts = Array.from(document.querySelectorAll('.stage-content .g7-opt'))
      const txt = (b) => (b.innerText || '').replace(/\s+/g, ' ').trim()
      // AVVAL aniq moslik. `includes` bilan «2» degan javob «32» variantini
      // bosib yuborardi -- variantlar har kirishda aralashadi (§8.3), ya'ni
      // qaysi biri oldin turishi oldindan ma'lum emas. Variant matni oldida
      // harf belgisi turadi, shuning uchun oxiriga qarab solishtiramiz.
      const hit = opts.find((b) => txt(b) === label || txt(b).endsWith(' ' + label))
        || opts.find((b) => txt(b).includes(label))
      if (!hit || hit.disabled) return false
      hit.click()
      return true
    }, want)
  }
  if (!clicked) problems.push(`blitsda «${want}» varianti topilmadi yoki qulflangan`)
  await page.waitForTimeout(2300) // 1900 ms yig'ilish + zapas
}
await page.screenshot({ path: `${OUT}/blits.png` })

// --- yakunga o'tamiz
await page.evaluate(() => {
  const nav = document.querySelector('.stage-nav')
  const btns = nav ? Array.from(nav.querySelectorAll('button')).filter((b) => !b.disabled) : []
  const next = btns[btns.length - 1]
  if (next) next.click()
})
await page.waitForTimeout(1200)

await page.evaluate((sel) => { window.__readySel = sel }, CFG.readySel)
const wrap = await page.evaluate(() => {
  const ring = document.querySelector('.g7-ring svg')
  const texts = ring ? Array.from(ring.querySelectorAll('text')).map((t) => t.textContent) : []
  const insight = document.querySelector(window.__readySel)
  return { count: document.querySelector('.g7-count')?.textContent || '', ring: texts, insight: insight ? insight.innerText : null }
})
if (norm(wrap.count) !== '15/15') problems.push(`yakun kutildi (15/15), hisoblagichda "${wrap.count}"`)
if (CFG.ring && wrap.ring.join(' ') !== '4 / 4') problems.push(`halqada 4 va / 4 kutildi, bor: ${JSON.stringify(wrap.ring)}`)
// «zakryt» so'zi FAQAT halqasi bor darsda bo'ladi: 1-darsda yakun 6-sinf
// naqshiga o'tkazilgan va u yerda tayyorlik DARAJASI ko'rsatilmaydi, faqat
// kamchilik satri turadi (metodist qarori 2026-08-13).
if (!wrap.insight) problems.push(`tayyorlik matni topilmadi`)
else if (CFG.ring && !/закрыт/i.test(wrap.insight)) problems.push(`tayyorlik matni kutilgandek emas: ${JSON.stringify(wrap.insight)}`)
if (wrap.insight && !CFG.noGap.test(wrap.insight)) problems.push(`teg yo'q edi, lekin kamchilik yozilgan: ${JSON.stringify(wrap.insight)}`)
await page.screenshot({ path: `${OUT}/yakun.png` })

// --- o'zbek tili
// Ilgari bu yerda DARS ICHIDAGI til almashtirgichi bosilardi. Bunday
// almashtirgich endi YO'Q: metodist uni 2026-08-06 da olib tashlagan
// (ETALON_7SINF.md §4.5 -- «sayt o'zinikini chizadi, ikkita bo'lib ketgandi»).
// `LangSwitch` yadroda qolgan, lekin hech qayerda chizilmaydi, shuning uchun
// eski tekshiruv HAR DOIM yiqilardi: bosiladigan tugma yo'q, sahifa rus tilida
// qolardi va kirill «topilardi». 5-darsda ham xuddi shunday (2026-08-13).
// Til endi qanday kelsa, shunday tekshiriladi: manzildagi `?lang=uz` bilan.
await page.goto(`${BASE}?lang=uz`, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForSelector('.stage-content', { timeout: 60000 })
await page.waitForTimeout(700)
for (let i = 0; i < 14; i += 1) {
  const ok = await page.evaluate(() => {
    const nav = document.querySelector('.stage-nav')
    const btns = nav ? Array.from(nav.querySelectorAll('button')).filter((b) => !b.disabled) : []
    const next = btns[btns.length - 1]
    if (!next) return false
    next.click()
    return true
  })
  if (!ok) break
  await page.waitForTimeout(240)
}
const uz = await page.evaluate(() => {
  const root = document.querySelector('.lesson-root')
  const txt = root ? root.innerText : ''
  return {
    cyr: /[А-Яа-я]{3,}/.test(txt),
    count: (root.querySelector('.g7-count') || {}).textContent || '',
    sample: (root.querySelector('.g7-title') || {}).innerText || '',
  }
})
if (norm(uz.count) !== '15/15') problems.push(`UZ da yakunga yetib borilmadi, hisoblagich "${uz.count}"`)
if (uz.cyr) problems.push(`UZ ekranida kirill matni qoldi: ${uz.sample}`)
await page.screenshot({ path: `${OUT}/yakun-uz.png` })

if (errors.length) problems.push('konsol: ' + errors.slice(0, 3).join(' | '))
await browser.close()

if (problems.length) {
  console.error(`MUAMMOLAR (${problems.length}):`)
  problems.forEach((p) => console.error('  ' + p))
  process.exitCode = 1
} else {
  console.log("OK: blits 4/4, halqa to'g'ri, teg yo'q, dars UZ da to'liq o'tiladi, konsol toza.")
}
