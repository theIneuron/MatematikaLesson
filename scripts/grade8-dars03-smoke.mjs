// ============================================================================
// 8-sinf, Dars 3: prokliklash va SKROLL tekshiruvi.
// Kontrakt: ETALON_8SINF.md §20 p.35-36
//   node scripts/grade8-dars03-smoke.mjs [port]
//
// Tekshiradi: konsolda xato yo'q, skroll yo'q, har ekran ochiladi.
// Faqat oxirgi holat emas, HAR QADAM tekshiriladi (§20).
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

const errors = []
const scrolls = []

for (const size of SIZES) {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: size.w, height: size.h } })
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`${size.name}: ${m.text().slice(0, 160)}`) })
  page.on('pageerror', (e) => errors.push(`${size.name}: PAGEERROR ${String(e).slice(0, 160)}`))
  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)

  for (let screen = 1; screen <= 15; screen += 1) {
    // MUHIM: .g8-body da overflow: clip. Skrollni o'lchash YETMAYDI --
    // sig'magan kontent skroll bermaydi, u KESILADI. Shuning uchun oxirgi
    // bolaning pastki chegarasi ish zonasidan chiqib ketganini o'lchaymiz.
    const box = await page.evaluate(() => {
      const body = document.querySelector('.g8-body')
      const stack = document.querySelector('.g8-stack')
      if (!body || !stack) return null
      const bRect = body.getBoundingClientRect()
      let deepest = 0
      for (const el of stack.children) {
        const r = el.getBoundingClientRect()
        if (r.height > 0) deepest = Math.max(deepest, r.bottom)
      }
      return {
        cut: Math.round(deepest - bRect.bottom),
        hScroll: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        bodyH: Math.round(bRect.height),
        contentH: Math.round(deepest - bRect.top),
      }
    })
    if (!box) { errors.push(`${size.name}: ekran ${screen} — .lesson-root topilmadi`); break }
    if (box.cut > 2 || box.hScroll > 2) {
      scrolls.push(`${size.name}, ekran ${screen}: KESILDI +${box.cut}px, gorizontal +${box.hScroll}px (ish zonasi ${box.bodyH}px, kontent ${box.contentH}px)`)
    }
    // «Davom» -> keyingi ekran. FREE_NAV=true bo'lgani uchun ochiq.
    const next = page.locator('.g8-nav .g8-btn-solid')
    if (await next.count() === 0) break
    const disabled = await next.first().isDisabled()
    if (disabled || screen === 15) break
    await next.first().click({ force: true })  // «Davom» pulsatsiya qiladi: Playwright uni «beqaror» deb hisoblaydi
    await page.waitForTimeout(320)
  }
  await browser.close()
}

console.log('')
console.log(`  konsol xatolari: ${errors.length}`)
errors.slice(0, 12).forEach((e) => console.log('   ✗ ' + e))
console.log(`  kesilgan yoki chiqib ketgan: ${scrolls.length}`)
scrolls.slice(0, 20).forEach((s) => console.log('   ! ' + s))
console.log('')
if (errors.length || scrolls.length) process.exitCode = 1
else console.log('  Dars 3: xato yo\'q, skroll yo\'q\n')
