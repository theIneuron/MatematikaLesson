// ============================================================================
// 8-sinf, Dars 3: HAR QADAMDA kesilish tekshiruvi.
// Kontrakt: ETALON_8SINF.md §20 p. 35 va 35a
//   node scripts/grade8-dars03-steps.mjs [port]
//
// NIMASI BILAN `grade8-dars03-smoke.mjs` dan FARQ QILADI.
// Smoke har ekranning FAQAT BOSHLANG'ICH holatini o'lchaydi: u hech narsaga
// javob bermaydi va «keyingi» ni bosmaydi. Lekin ekran ochilgan sari O'SADI --
// tahlil bloki, kontrprimer, ochilgan qoida kartochkasi, blitsning javoblari.
// Aynan shu holatlarda kontent chiqib ketadi.
//
// Bu skript har ekranda:
//   1) boshlang'ich holatni o'lchaydi;
//   2) «keyingi» bor ekan -- bosadi va har bosishdan keyin o'lchaydi;
//   3) variant bor ekan -- BIRINCHISINI bosadi (to'g'ri yoki xato -- ikkisi
//      ham blok ochadi) va o'lchaydi;
//   4) keyingi ekranga o'tadi.
//
// Kesilish PROKRUTKA BERMAYDI: `.g8-body` da `overflow: clip`, ya'ni sig'magan
// matn shunchaki YO'Q BO'LADI va ko'z bilan ko'rinmaydi. Shuning uchun
// o'lchanadigan narsa -- ish zonasining pastki chegarasidan chiqqan piksel.
// ============================================================================
import { chromium } from 'playwright'

const port = process.argv[2] || '5233'
const URL = `http://localhost:${port}/8-sinf/matematika/nazariy/dars03-kasrlarni-qisqartirish`
const SIZES = [
  { w: 1366, h: 615, name: 'noutbuk tor' },
  { w: 1366, h: 655, name: 'noutbuk' },
  { w: 1920, h: 950, name: 'katta ekran' },
  { w: 390, h: 745, name: 'telefon' },
  { w: 360, h: 690, name: 'kichik telefon' },
]
const MAX_STEPS = 10

const errors = []
const bad = []
let measured = 0

const measure = (page) => page.evaluate(() => {
  const body = document.querySelector('.g8-body')
  const stack = document.querySelector('.g8-stack')
  if (!body || !stack) return null
  const bRect = body.getBoundingClientRect()
  let deepest = 0
  let widest = 0
  // Ish zonasi `overflow: clip` -- ya'ni O'NGGA chiqqan matn ham prokrutka
  // bermaydi, u shunchaki KESILADI. Shuning uchun vertikal bilan birga
  // GORIZONTAL chiqishni ham o'lchaymiz, va faqat bevosita bolalarni emas,
  // ichkaridagi HAR QANDAY elementni: ustun ichidagi nowrap satr aynan
  // shunday yo'qoladi.
  stack.querySelectorAll('*').forEach((el) => {
    const r = el.getBoundingClientRect()
    if (r.height <= 0 || r.width <= 0) return
    deepest = Math.max(deepest, r.bottom)
    widest = Math.max(widest, r.right)
  })
  for (const el of stack.children) {
    const r = el.getBoundingClientRect()
    if (r.height > 0) deepest = Math.max(deepest, r.bottom)
  }
  // Kartochka ICHIDAGI kesilish ham: overflow hidden/clip bo'lgan har qanday
  // idish, ichidagisi o'zidan baland yoki keng bo'lsa (measure.mjs printsipi).
  let inner = 0
  document.querySelectorAll('.lesson-root *').forEach((el) => {
    const cs = getComputedStyle(el)
    const cy = cs.overflowY === 'hidden' || cs.overflowY === 'clip'
    const cx = cs.overflowX === 'hidden' || cs.overflowX === 'clip'
    if (el.classList.contains('g8-body')) return   // ish zonasi yuqorida o'lchandi
    const dy = cy ? el.scrollHeight - el.clientHeight : 0
    const dx = cx ? el.scrollWidth - el.clientWidth : 0
    inner = Math.max(inner, dy, dx)
  })
  return {
    cut: Math.round(deepest - bRect.bottom),
    cutX: Math.round(widest - bRect.right),
    inner: Math.round(inner),
    hScroll: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    bodyH: Math.round(bRect.height),
    bodyW: Math.round(bRect.width),
  }
})

const check = (m, where) => {
  measured += 1
  if (!m) { errors.push(`${where}: .g8-body topilmadi`); return }
  if (m.cut > 2) bad.push(`${where}: ish zonasidan PASTGA chiqdi +${m.cut}px (zona ${m.bodyH}px)`)
  if (m.cutX > 2) bad.push(`${where}: ish zonasidan O'NGGA chiqdi +${m.cutX}px (zona ${m.bodyW}px)`)
  if (m.inner > 2) bad.push(`${where}: kartochka ichida KESILDI +${m.inner}px`)
  if (m.hScroll > 2) bad.push(`${where}: gorizontal prokrutka +${m.hScroll}px`)
}

for (const size of SIZES) {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: size.w, height: size.h } })
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`${size.name}: ${m.text().slice(0, 160)}`) })
  page.on('pageerror', (e) => errors.push(`${size.name}: PAGEERROR ${String(e).slice(0, 160)}`))
  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.waitForTimeout
    ? await page.waitForTimeout(500)
    : null

  for (let screen = 1; screen <= 15; screen += 1) {
    check(await measure(page), `${size.name}, ekran ${screen}, boshlang'ich`)

    // «keyingi» bilan ochilishning HAR QADAMI
    for (let step = 1; step <= MAX_STEPS; step += 1) {
      const ns = page.locator('.g8-nextstep')
      if (await ns.count() === 0) break
      if (!(await ns.first().isVisible())) break
      await ns.first().click({ force: true })
      await page.waitForTimeout(260)
      check(await measure(page), `${size.name}, ekran ${screen}, qadam ${step}`)
    }

    // HAMMA variant birma-bir bosiladi. Sababi: eng BALAND holatlar aynan
    // shunda paydo bo'ladi -- xato varianti tahlil blokini ochadi, hammasi
    // to'g'ri bo'lsa qoida kartochkasi ochiladi (ekran 8) va blits yopiladi
    // (ekran 14), undan keyin 15-ekranda tayyorlik darajasi chiqadi.
    for (let round = 1; round <= 12; round += 1) {
      const opts = page.locator('.g8-opt:not(:disabled)')
      if (await opts.count() === 0) break
      await opts.first().click({ force: true })
      await page.waitForTimeout(300)
      check(await measure(page), `${size.name}, ekran ${screen}, variant ${round}`)
    }

    // Variantdan keyin ham ochilish qadamlari bo'lishi mumkin (masalan
    // kartochka ochilgandan keyingi izoh).
    for (let step = 1; step <= MAX_STEPS; step += 1) {
      const ns = page.locator('.g8-nextstep')
      if (await ns.count() === 0) break
      if (!(await ns.first().isVisible())) break
      await ns.first().click({ force: true })
      await page.waitForTimeout(260)
      check(await measure(page), `${size.name}, ekran ${screen}, javobdan keyin qadam ${step}`)
    }

    if (screen === 15) break
    const next = page.locator('.g8-nav .g8-btn-solid')
    if (await next.count() === 0) break
    if (await next.first().isDisabled()) {
      errors.push(`${size.name}: ekran ${screen} -- «Davom» YOPIQ, dars to'xtadi`)
      break
    }
    await next.first().click({ force: true })
    await page.waitForTimeout(320)
  }
  await browser.close()
}

console.log('')
console.log(`  o'lchandi: ${measured} holat`)
console.log(`  konsol xatolari: ${errors.length}`)
errors.slice(0, 12).forEach((e) => console.log('   x ' + e))
console.log(`  kesilgan: ${bad.length}`)
bad.slice(0, 25).forEach((s) => console.log('   ! ' + s))
console.log('')
if (errors.length || bad.length) process.exitCode = 1
else console.log('  Dars 3: har qadamda kesilish YO\'Q\n')
