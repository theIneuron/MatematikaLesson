// ============================================================================
// 8-SINF AMALIYOTI tekshiruvi: TO'G'RI javoblar bilan o'tish + kadrga sig'ish.
//
// NEGA ALOHIDA SKRIPT. `grade8-smoke.mjs` walkeri KO'R: u faol tugmalarni
// aylantirib bosadi. Amaliyotda esa yarim topshiriq YIG'ISH bilan yechiladi
// (karta -> uya, yozuv -> zona, satr -> son) — ko'r obhod ularni oxirigacha
// yetkazmaydi va eng TIG'IZ holat, razbor ekranda turgan holat, o'lchanmay
// qoladi. 7-sinfda aynan shu sababdan o'nta darsning yettitasida oshib
// ketish topilgan edi.
//
// Shu sababli bu skript javoblarni BILADI. Javoblar SKRIPTDA turadi,
// razmetkada YO'Q — aks holda ularni o'quvchi ham ko'rardi.
//
// U bir vaqtda ikki narsani tekshiradi:
//   1. HAR bosishdan keyin topshiriq ish maydonidan chiqib ketmaydi
//      (5 o'lcham, 3 til) — `.pq-body` da `overflow: clip`, ya'ni chiqib
//      ketgan narsa shunchaki YO'QOLADI va topshiriqni yopish imkoni bo'lmaydi;
//   2. amaliyot to'g'ri javoblar bilan BIRINCHI urinishda o'tiladi va
//      yakunda 10 dan 10 chiqadi.
//
// Ishga tushirish:
//   npx vite --port 5199 --strictPort
//   node scripts/grade8-practice-check.mjs
//   G8_FAST=1 node scripts/grade8-practice-check.mjs     # noutbuk + uz,ru
//   G8_WRONG=1 node scripts/grade8-practice-check.mjs    # XATO yo'llar: razbor bormi
//   G8_VP=telefon node scripts/grade8-practice-check.mjs # faqat telefon o'lchamlari
// ============================================================================
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import { PLAN, step } from './grade8-practice-plan.mjs'

const PORT = process.env.G8_PORT || '5199'
const SLUG = process.env.G8_SLUG || 'dars01-amaliyot'
const BASE = `http://localhost:${PORT}/8-sinf/matematika/amaliy/${SLUG}`
const OUT = '.tmp/grade8-practice'

const VIEWPORTS = [
  { name: 'noutbuk-1366x615', w: 1366, h: 615 },
  { name: 'noutbuk-1366x655', w: 1366, h: 655 },
  { name: 'monitor-1920x950', w: 1920, h: 950 },
  { name: 'telefon-390x745', w: 390, h: 745 },
  { name: 'telefon-360x690', w: 360, h: 690 },
]
const FAST = process.env.G8_FAST === '1'
const WRONG_MODE = process.env.G8_WRONG === '1'
const ONLY_VP = process.env.G8_VP || ''
const VP_LIST = (FAST ? VIEWPORTS.filter((v) => v.name.startsWith('noutbuk')) : VIEWPORTS)
  .filter((v) => !ONLY_VP || v.name.includes(ONLY_VP))
const LANGS = (process.env.G8_LANGS || (FAST ? 'uz,ru' : 'uz,ru,en')).split(',')

// ============================================================
// XATO YO'LLAR. `G8_WRONG=1` bilan ishga tushadi. Har topshiriqqa ATAYLAB
// noto'g'ri javob beriladi va uchta narsa tekshiriladi:
//   1. ball berilmaydi (chip `is-no`), yakunda 0 dan 10;
//   2. RAZBOR chiqadi va u BO'SH EMAS — uch tilda ham. Bo'sh razbor eng
//      yashirin nuqson: hamma tekshiruv yashil, ekranda esa hech narsa yo'q;
//   3. razbor bilan birga kontent kadrdan chiqmaydi.
// ============================================================
const WRONG = [
  [{ type: '6' }],                                                   // ishora yo'qoldi
  [
    { item: 'a' }, { zone: 'f' }, { item: 'c' }, { zone: 'f' }, { item: 'e' }, { zone: 'f' },
    { item: 'b' }, { zone: 'w' }, { item: 'd' }, { zone: 'w' }, { item: 'g' }, { zone: 'w' },
  ],
  [{ card: '28' }, { slot: 0 }, { card: '7' }, { slot: 1 }, { card: '=' }, { slot: 2 }],
  [{ none: true }],                                                  // «qiymat yo'q» — Z18
  [{ type: '7', at: 0 }, { type: 'x != 3', at: 1 }],                 // hisobda xato
  [{ card: 'x' }, { card: '+' }, { card: '(x − 6)' }],               // plus bilan bog'lash
  [{ type: '4', at: 0 }, { type: 'x != 5', at: 1 }],                 // shart yarim qoldi
  [{ type: '1' }],                                                   // ajralish nuqtasi emas
  [{ row: 'r1' }, { type: '0' }],                                    // boshqa satr
  [{ type: 'x != 4' }],                                              // ortiqcha taqiq
]

const fails = []
const note = (m) => { console.log(m) }

async function overflow(page) {
  return page.evaluate(() => {
    const body = document.querySelector('.pq-body')
    if (!body) return { bad: true, why: 'ish maydoni topilmadi' }
    const b = body.getBoundingClientRect()
    let worst = 0
    for (const el of body.children) {
      const r = el.getBoundingClientRect()
      worst = Math.max(worst, Math.round(r.bottom - b.bottom), Math.round(b.top - r.top))
    }
    const go = document.querySelector('[data-go="1"]')
    const goR = go ? go.getBoundingClientRect() : null
    const cut = goR ? Math.round(goR.bottom - window.innerHeight) : 0
    return { over: worst, goCut: cut }
  })
}


// Razbor bloki BO'SH EMASMI.
async function razbor(page) {
  return page.evaluate(() => {
    const els = [...document.querySelectorAll('.g8-note-no, .g8-cx, .pq-mark.is-no')]
    const txt = els.map((e) => e.textContent.trim()).filter(Boolean)
    return { blocks: els.length, text: txt.join(' | ').slice(0, 90) }
  })
}

async function run(page, vp, lang) {
  const tag = `${vp.name} · ${lang}`
  await page.setViewportSize({ width: vp.w, height: vp.h })
  await page.goto(`${BASE}?lang=${lang}`, { waitUntil: 'networkidle' })
  await page.waitForSelector('.pq-root', { timeout: 15000 })

  const plan = WRONG_MODE ? WRONG : PLAN
  for (let i = 0; i < plan.length; i += 1) {
    const n = i + 1
    await page.waitForSelector('.pq-wrap', { timeout: 8000 })
    for (const act of plan[i]) {
      await step(page, act)
      const o = await overflow(page)
      if (o.bad) { fails.push(`${tag} · ${n}: ${o.why}`); return }
      if (o.over > 1) fails.push(`${tag} · ${n}: kontent ${o.over}px chiqib ketdi`)
      if (o.goCut > 0) fails.push(`${tag} · ${n}: tugma ${o.goCut}px pastda`)
    }
    const go = page.locator('[data-go="1"]')
    // Tugmaning ochilishini KUTADI: `isDisabled` bir zumdagi holatni oladi va
    // React effekt orqali qilgan qayta renderdan oldin o'lchab qo'yadi
    // (topildi 2026-08-21: ekranda hammasi joyida, skript esa yiqilardi).
    const opened = await page
      .waitForFunction(() => { const b = document.querySelector('[data-go="1"]'); return !!b && !b.disabled }, { timeout: 3000 })
      .then(() => true).catch(() => false)
    if (!opened) {
      // Nima yetmaganini AYTADI: aks holda «ochilmadi» degan xabar bilan
      // topshiriqni qidirishga to'g'ri keladi.
      const st = await page.evaluate(() => ({
        pool: document.querySelectorAll('.pq-cards [data-item]').length,
        slots: [...document.querySelectorAll('[data-slot]')].filter((e) => !e.textContent.trim()).length,
        fields: [...document.querySelectorAll('.g8-input')].filter((e) => !e.value.trim()).length,
        row: document.querySelector('.pq-audit-row.is-on') ? 1 : 0,
      }))
      await mkdir(OUT, { recursive: true })
      await page.screenshot({ path: `${OUT}/${vp.name}-${lang}-${n}-ochilmadi.png` })
      fails.push(`${tag} · ${n}: «Tekshirish» ochilmadi (${JSON.stringify(st)})`)
      return
    }
    await go.click()                                    // tekshirish
    await page.waitForTimeout(120)
    const o2 = await overflow(page)
    if (o2.over > 1) fails.push(`${tag} · ${n}: RAZBOR bilan ${o2.over}px chiqib ketdi`)
    const chip = await page.locator(`[data-tab="${String(n).padStart(2, '0')}"]`).getAttribute('class')
    if (WRONG_MODE) {
      if (!chip.includes('is-no')) fails.push(`${tag} · ${n}: xato javobga BALL berildi`)
      const r = await razbor(page)
      if (!r.blocks) fails.push(`${tag} · ${n}: razbor bloki YO'Q`)
      else if (!r.text) fails.push(`${tag} · ${n}: razbor BO'SH (blok bor, matn yo'q)`)
    } else if (!chip.includes('is-ok')) {
      fails.push(`${tag} · ${n}: to'g'ri javob QABUL QILINMADI`)
    }
    if (n < plan.length) await go.click()               // keyingisi
    await page.waitForTimeout(80)
  }

  await page.locator('[data-go="1"]').click()           // yakunlash
  await page.waitForTimeout(150)
  const score = await page.locator('.pq-final-n').textContent().catch(() => null)
  const want = WRONG_MODE ? '0/10' : '10/10'
  if (score === null) fails.push(`${tag}: yakun ekrani chiqmadi`)
  else if (score.replace(/\s/g, '') !== want) fails.push(`${tag}: yakunda ${score}, ${want} emas`)
  await mkdir(OUT, { recursive: true })
  await page.screenshot({ path: `${OUT}/${vp.name}-${lang}-yakun${WRONG_MODE ? '-xato' : ''}.png` })
  note(`  ${tag}: ${score === null ? 'yakun yo\'q' : score.trim()}`)
}

const browser = await chromium.launch()
const page = await browser.newPage()
page.on('console', (m) => { if (m.type() === 'error') fails.push(`konsol: ${m.text().slice(0, 160)}`) })
page.on('pageerror', (e) => fails.push(`pageerror: ${String(e).slice(0, 160)}`))

for (const vp of VP_LIST) {
  for (const lang of LANGS) {
    await run(page, vp, lang)
  }
}
await browser.close()

console.log('')
if (!fails.length) {
  console.log(WRONG_MODE
    ? 'HAMMASI JOYIDA: xato javobga ball yo\'q, razbor uch tilda ham bor.'
    : 'HAMMASI JOYIDA: 10 dan 10, kadrdan chiqish yo\'q.')
} else {
  console.log(`NUQSONLAR (${fails.length}):`)
  for (const f of fails) console.log('  - ' + f)
  process.exitCode = 1
}
