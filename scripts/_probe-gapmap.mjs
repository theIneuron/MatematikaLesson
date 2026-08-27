// KAMCHILIKLAR XARITASI ekranda ROSTDAN chiqadimi.
//
// Xarita faqat localStorage da yozuv bo'lganda ko'rinadi, yozuv esa dars
// oxirida paydo bo'ladi. Shu sababli tekshiruv uni O'ZI ekadi va yakun
// ekranini oladi. Aks holda «xarita ishlaydi» degan gap tekshirilmagan
// bo'lib qolardi.
//
//   SLUG=dars49-... node scripts/_probe-gapmap.mjs
import { chromium } from 'playwright'

const port = process.env.PORT || 5299
const slug = process.env.SLUG || 'dars49-matnli-masalalar-yakun'
const lang = process.env.LANG3 || 'ru'
const out = process.env.OUT || 'C:/tmp/gapmap.png'

const SEED = {
  B2: { base_direction: { n: 3, at: ['alg_11_10'] }, log_domain: { n: 1, at: ['alg_11_12'] } },
  B5: { slant_not_distance: { n: 2, at: ['alg_11_40'] } },
  B6: { word_model: { n: 1, at: ['alg_11_49'] } },
}

const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1366, height: 655 } })
const errs = []
p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 140)) })
p.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message.slice(0, 140)))

await p.goto(`http://localhost:${port}/`, { waitUntil: 'domcontentloaded' })
await p.evaluate((seed) => window.localStorage.setItem('g11_gaps_v1', JSON.stringify(seed)), SEED)

await p.goto(`http://localhost:${port}/11-sinf/matematika/nazariy/${slug}`, { waitUntil: 'networkidle' })
await p.waitForTimeout(700)

// Til
const sw = p.locator('.g11-langsw button')
if (await sw.count()) {
  const idx = { uz: 0, ru: 1, en: 2 }[lang]
  await sw.nth(idx).click()
  await p.waitForTimeout(400)
}
// Ovozni o'chirish
const mute = p.locator('.g11-mute, [aria-label*="ovoz"], [aria-label*="звук"]').first()
if (await mute.count()) { await mute.click().catch(() => {}) }

// Oxirgi slaydgacha borish
for (let i = 0; i < 14; i += 1) {
  const next = p.locator('.g11-nav-r button, .g11-nav-r').first()
  await next.click({ force: true }).catch(() => {})
  await p.waitForTimeout(280)
}
await p.waitForTimeout(Number(process.env.WAIT || 9000))

const txt = await p.locator('.stage-content').innerText().catch(() => '')
const hasMap = /Карта пробелов|Kamchiliklar xaritasi|gap map/i.test(txt)
const rows = (txt.match(/B[1-7]/g) || []).length
await p.screenshot({ path: out })
console.log(slug, '| slayd 15 | xarita yozuvi:', hasMap ? 'BOR' : "YO'Q", '| blok belgisi:', rows)
console.log('konsol:', errs.length ? errs.slice(0, 4) : 'toza')
await b.close()
process.exit(hasMap ? 0 : 1)
