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

const PORT = process.env.GRADE7_PORT || '5299'
const BASE = `http://localhost:${PORT}/7-sinf/matematika/nazariy/dars05-qavslarni-ochish`
const OUT = '.tmp/grade7-blitz'
const BLITZ = 13 // 0 dan hisoblanadi: 14-ekran
const RIGHT = ['x + 8', '−2a + 6', 'x + y − 3', '9 − x + 4']

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
if (shown !== '14/15') problems.push(`blits kutildi (14/15), hisoblagichda "${shown}"`)

// --- to'rt savolga BIRINCHI urinishda to'g'ri javob
for (const want of RIGHT) {
  // Ko'rsatma qulfi ochilishini KUTAMIZ: `useInstructionGate` mount dan keyin
  // 900 ms davomida javobni yopib turadi (ovoz yoniqda -- ko'rsatma tugagunicha).
  let clicked = false
  for (let tryNo = 0; tryNo < 12 && !clicked; tryNo += 1) {
    await page.waitForTimeout(300)
    clicked = await page.evaluate((label) => {
      const opts = Array.from(document.querySelectorAll('.stage-content .g7-opt'))
      const hit = opts.find((b) => (b.innerText || '').replace(/\s+/g, ' ').includes(label))
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

const wrap = await page.evaluate(() => {
  const ring = document.querySelector('.g7-ring svg')
  const texts = ring ? Array.from(ring.querySelectorAll('text')).map((t) => t.textContent) : []
  const insight = document.querySelector('.g7-insight-body')
  return { count: document.querySelector('.g7-count')?.textContent || '', ring: texts, insight: insight ? insight.innerText : null }
})
if (wrap.count !== '15/15') problems.push(`yakun kutildi (15/15), hisoblagichda "${wrap.count}"`)
if (wrap.ring.join(' ') !== '4 / 4') problems.push(`halqada 4 va / 4 kutildi, bor: ${JSON.stringify(wrap.ring)}`)
if (!wrap.insight || !/закрыт/i.test(wrap.insight)) problems.push(`tayyorlik matni kutilgandek emas: ${JSON.stringify(wrap.insight)}`)
if (wrap.insight && !/Мест для повтора нет/i.test(wrap.insight)) problems.push(`teg yo'q edi, lekin kamchilik yozilgan: ${JSON.stringify(wrap.insight)}`)
await page.screenshot({ path: `${OUT}/yakun.png` })

// --- til almashtirgich
await page.evaluate(() => {
  const b = Array.from(document.querySelectorAll('.g7-langsw-b')).find((x) => x.textContent.trim() === 'UZ')
  if (b) b.click()
})
await page.waitForTimeout(700)
const uz = await page.evaluate(() => {
  const root = document.querySelector('.lesson-root')
  const txt = root ? root.innerText : ''
  return { cyr: /[А-Яа-я]{3,}/.test(txt), sample: (root.querySelector('.g7-title') || {}).innerText || '' }
})
if (uz.cyr) problems.push(`UZ ga o'tgandan keyin ekranda kirill matni qoldi: ${uz.sample}`)
await page.screenshot({ path: `${OUT}/yakun-uz.png` })

if (errors.length) problems.push('konsol: ' + errors.slice(0, 3).join(' | '))
await browser.close()

if (problems.length) {
  console.error(`MUAMMOLAR (${problems.length}):`)
  problems.forEach((p) => console.error('  ' + p))
  process.exitCode = 1
} else {
  console.log("OK: blits 4/4, halqa to'g'ri, teg yo'q, til almashtirgich ishlaydi, konsol toza.")
}
