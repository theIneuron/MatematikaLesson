// ============================================================================
// 7-sinf: SLAYD SURATI. O'lchov «sig'dimi» deb javob beradi, «KO'RINDIMI» deb
// emas. 1-darsda aynan shu farq ikki marta qimmatga tushdi: telefonda
// kalkulyatorlarda sonlar yo'q edi va o'lchov yashil turardi; qo'l stikeri
// esa 50 px da noto'g'ri o'qilardi. Ikkalasi ham FAQAT kattalashtirilgan
// suratda ko'rinadi (DARS01_HOLAT.md §9.5, §10.7).
//
// Ishga tushirish:
//   npx vite --port 5261 --strictPort
//   GRADE7_SLUG=dars02-ozgaruvchili-ifodalar GRADE7_SHOTS=1,3,7,15 \
//     node scripts/grade7-shot.mjs
//
// GRADE7_VP -- o'lcham: noutbuk (1366x615) yoki telefon (390x745).
// ============================================================================
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const PORT = process.env.GRADE7_PORT || '5261'
const SLUG = process.env.GRADE7_SLUG || 'dars01-sonli-ifodalar'
const LANG = process.env.GRADE7_LANG || 'ru'
const SHOTS = (process.env.GRADE7_SHOTS || '1').split(',').map((s) => Number(s.trim()))
const VPS = { noutbuk: { w: 1366, h: 615 }, telefon: { w: 390, h: 745 } }
// Windowsda muhit o'zgaruvchisiga ko'rinmas belgi yopishib kelishi mumkin,
// shuning uchun nom TOZALANADI va noma'lum nom jim qolmaydi.
const VPNAME = (process.env.GRADE7_VP || 'noutbuk').trim()
const VP = VPS[VPNAME]
if (!VP) { console.error("Noma'lum o'lcham: " + JSON.stringify(VPNAME) + '. Bor: ' + Object.keys(VPS).join(', ')); process.exit(1) }
const BASE = `http://localhost:${PORT}/7-sinf/matematika/nazariy/${SLUG}`
const OUT = '.tmp/grade7-shot'

await mkdir(OUT, { recursive: true })
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: VP.w, height: VP.h }, deviceScaleFactor: 2 })

await page.goto(`${BASE}?lang=${LANG}`, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForSelector('.stage-content', { timeout: 60000 })
// Ovozni o'chiramiz: zamok javobni yopib turmasin.
await page.evaluate(() => {
  const b = Array.from(document.querySelectorAll('button')).find((x) => /ovoz|звук|sound/i.test(x.getAttribute('title') || ''))
  if (b) b.click()
})
await page.waitForTimeout(700)

const goTo = async (n) => {
  for (let i = 1; i < n; i += 1) {
    const ok = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      const next = btns.find((b) => /davom|продолж|continue/i.test(b.textContent || ''))
      if (next && !next.disabled) { next.click(); return true }
      return false
    })
    if (!ok) return false
    await page.waitForTimeout(420)
  }
  return true
}

for (const n of SHOTS) {
  await page.goto(`${BASE}?lang=${LANG}`, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.waitForSelector('.stage-content', { timeout: 60000 })
  await page.waitForTimeout(500)
  const reached = await goTo(n)
  // Kutish UZUN: yo'laklar va kadrlar ikki soniyagacha o'ynaydi, va qisqa
  // kutishda surat ORALIQ holatni oladi -- unda ekran «tugallanmagan» bo'lib
  // ko'rinadi va noto'g'ri xulosa chiqariladi (2026-08-15).
  await page.waitForTimeout(Number(process.env.GRADE7_WAIT || 2800))
  const file = `${OUT}/${SLUG}-${LANG}-${VPNAME}-s${n}.png`
  await page.screenshot({ path: file })
  console.log(`${reached ? 'ok ' : 'YETIB BORMADI '} slayd ${n} -> ${file}`)
}

await browser.close()
