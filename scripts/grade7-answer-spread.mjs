// ============================================================================
// 7-sinf: TO'G'RI JAVOB QAYERGA TUSHADI.
//
// `grade7-shuffle-check.mjs` dan FARQI. U variantlar tartibi ochilishlar
// orasida o'zgarishini qaraydi -- ya'ni aralashtirish ishlayotganini. Lekin
// aralashtirish ISHLAB TURIB ham qiyshiq bo'lishi mumkin: 2026-08-25 da QA
// «javoblarning ko'pchiligi A» dedi, va o'lchov uni tasdiqladi -- eski
// generator past bitlarga tayanardi, natijada A ulushi 33 foiz, B ulushi 17
// foiz edi, ayrim ochilishlarda esa bitta darsda A 70 foizdan oshardi.
//
// Bu tekshiruv boshqa savolni beradi: DARSNI O'TIB CHIQQANDA to'g'ri javob
// A, B, C, D orasida qanday taqsimlandi. Har savolda variantlar birma-bir
// bosiladi va qaysi biri yashil bo'lgani yoziladi.
//
// Ishga tushirish:
//   npx vite --port 5261 --strictPort
//   node scripts/grade7-answer-spread.mjs
//
// GRADE7_SLUGS -- vergul bilan ajratilgan darslar, GRADE7_PORT -- port.
// ============================================================================
import { chromium } from 'playwright'
import { readFile } from 'node:fs/promises'

// ============================================================================
// 1-BOSQICH: ARALASHTIRGICHNING O'ZI. Brauzer kerak emas.
//
// Nega alohida. Brauzerdagi yurish bir darsda o'ttizga yaqin savol beradi --
// bunda 33 va 25 foizni ajratib bo'lmaydi, tasodifiy tebranish shuncha.
// Aralashtirgichni esa yuz minglab urug' bilan tekshirsa bo'ladi va
// qiyshiqlik darrov ko'rinadi: eski generator 33/17/25/25 berardi.
//
// Funksiya `core.jsx` DAN O'QILADI, ko'chirilmaydi -- aks holda tekshiruv
// eski nusxani tekshirib, «toza» deb turaverardi.
// ============================================================================
const core = await readFile('src/components/grade7/core.jsx', 'utf8')
const cut = (from, to) => {
  const a = core.indexOf(from)
  const b = core.indexOf(to, a)
  if (a === -1 || b === -1) throw new Error('core.jsx dan ' + from + ' topilmadi')
  return core.slice(a, b)
}
const algo = cut('function mix32(', 'export function useShuffled')
const makeShuffle = new Function('SALT', algo + '\nreturn shuffleSeeded')

const spreadOf = (runs) => {
  const grid = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
  for (let k = 0; k < runs; k += 1) {
    const shuffle = makeShuffle(Math.floor(Math.random() * 1e9))
    const seed = (Math.random() * 4294967296) >>> 0
    const out = shuffle([0, 1, 2, 3], seed)
    for (let i = 0; i < 4; i += 1) grid[i][out.indexOf(i)] += 1
  }
  return grid
}

const RUNS = 200000
const grid = spreadOf(RUNS)
const algoBad = []
grid.forEach((row, i) => {
  const line = row.map((x) => ((100 * x) / RUNS).toFixed(1) + '%').join(' ')
  console.log(`aralashtirgich: ${i + 1}-band -> ${line}`)
  row.forEach((x, j) => {
    const share = (100 * x) / RUNS
    // 200 ming urinishda tasodifiy og'ish 0.3 foizdan oshmaydi; 2 foiz
    // chegara qiyshiqlikni ushlaydi va yolg'on xabar bermaydi.
    if (Math.abs(share - 25) > 2) algoBad.push(`${i + 1}-band ${j + 1}-o'ringa ${share.toFixed(1)}% tushdi`)
  })
})
if (algoBad.length) {
  console.log('\nARALASHTIRGICH QIYSHIQ:')
  algoBad.forEach((b) => console.log(' - ' + b))
  process.exitCode = 1
}
console.log('')


const PORT = process.env.GRADE7_PORT || '5261'
const SLUGS = (process.env.GRADE7_SLUGS || [
  'dars17-bir-had-darajasi',
  'dars22-umumiy-kopaytuvchi',
  'dars34-funksiya-tushunchasi',
  'dars41-uchburchak-turlari',
].join(',')).split(',').map((x) => x.trim()).filter(Boolean)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// Oxirgi variantlar qutisining holati. `ok` -- yashil bo'lgan variant o'rni.
const readBox = (page) => page.evaluate(() => {
  const box = document.querySelectorAll('.g7-options')
  const last = box[box.length - 1]
  if (!last) return null
  const bs = Array.from(last.querySelectorAll('button'))
  return {
    n: bs.length,
    sig: bs.map((b) => b.textContent.trim()).join('|'),
    ok: bs.findIndex((b) => (b.className || '').includes('g7-opt-ok')),
  }
})

const clickAt = (page, k) => page.evaluate((i) => {
  const box = document.querySelectorAll('.g7-options')
  const last = box[box.length - 1]
  const bs = last ? Array.from(last.querySelectorAll('button')) : []
  if (bs[i] && !bs[i].disabled) bs[i].click()
}, k)

async function walk(browser, slug) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 120)))
  await page.goto(`http://localhost:${PORT}/7-sinf/matematika/nazariy/${slug}?lang=uz`, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('.stage-content')
  // Ovoz o'chiriladi: replika tugashini kutib o'tirmaymiz.
  await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll('button')).find((x) => /ovoz|звук|sound/i.test(x.getAttribute('title') || ''))
    if (b) b.click()
  })

  const pos = []
  const seen = new Set()
  const dupes = []
  for (let slide = 1; slide <= 15; slide += 1) {
    for (let q = 0; q < 6; q += 1) {
      const st = await readBox(page)
      if (!st || st.n !== 4 || st.ok !== -1) break
      // ZANJIRDAGI ESKIRGAN RO'YXAT. 2026-08-22 da aralashtirishning
      // birinchi tahriri ikkinchi savolga BIRINCHISINING variantlarini
      // qaytargan edi -- shuning uchun ro'yxat takrorlanishi ham yoziladi.
      if (seen.has(st.sig)) dupes.push(slide + ': ' + st.sig.slice(0, 46))
      seen.add(st.sig)
      let hit = -1
      for (let k = 0; k < 4; k += 1) {
        await clickAt(page, k)
        await sleep(650)
        const now = await readBox(page)
        if (!now) { hit = k; break }
        if (now.ok !== -1) { hit = now.ok; break }
      }
      if (hit === -1) break
      pos.push(hit)
      await sleep(2200)
    }
    const moved = await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('button')).find((x) => /davom|yakunlash/i.test(x.textContent || ''))
      if (b && !b.disabled) { b.click(); return true }
      return false
    })
    await sleep(800)
    if (!moved) break
  }
  await page.close()
  return { pos, dupes, errors }
}

const browser = await chromium.launch()
const total = [0, 0, 0, 0]
const problems = []
for (const slug of SLUGS) {
  const { pos, dupes, errors } = await walk(browser, slug)
  const c = [0, 0, 0, 0]
  pos.forEach((p) => { c[p] += 1 })
  pos.forEach((p) => { total[p] += 1 })
  console.log(`${slug}  savol ${pos.length}  | A B C D: ${c.join(' ')}  | ${pos.join('')}`)
  if (dupes.length) problems.push(`${slug}: variantlar ro'yxati takrorlandi -- ${dupes[0]}`)
  errors.forEach((e) => problems.push(`${slug}: sahifada xato -- ${e}`))
  if (pos.length < 6) problems.push(`${slug}: o'lchash uchun savol kam (${pos.length}) -- yurish uzilgan`)
}
await browser.close()

const n = total.reduce((a, b) => a + b, 0)
console.log(`\njami ${n} savol | A B C D: ${total.map((x) => (n ? Math.round((100 * x) / n) : 0) + '%').join(' ')}`)
// Chegaralar: to'rt joyning ulushi 25 foiz atrofida bo'lishi kerak. Tasodifiy
// tebranishga joy qoldiriladi, lekin 40 foizdan oshgani -- qiyshiqlik.
if (n >= 24) {
  total.forEach((x, i) => {
    const share = (100 * x) / n
    if (share > 40) problems.push(`${'ABCD'[i]} o'rni ${Math.round(share)} foiz -- juda ko'p`)
    if (share < 12) problems.push(`${'ABCD'[i]} o'rni ${Math.round(share)} foiz -- juda kam`)
  })
} else {
  problems.push(`o'lchov kam (${n} savol) -- xulosa chiqarib bo'lmaydi`)
}

if (problems.length) {
  console.log('\nMUAMMOLAR:')
  problems.forEach((p) => console.log(' - ' + p))
  process.exitCode = 1
} else {
  console.log("\nOK: to'g'ri javob to'rt o'rin bo'ylab tekis tarqalgan.")
}
