// ============================================================================
// 11-sinf: OVOZ SO'ROVINI tekshirish. Uch tilda ham TIL MARKERI va dars
// belgisi ketyaptimi, va server yiqilganda bo'lak YO'QOLMAYAPTIMI.
//
// NEGA 11-SINFDA BU MUHIMROQ. `MIGRATION_v5_2_math.md` da «server tilni o'zi
// aniqlaydi: ru kirill, uz lotin» deb yozilgan. Bu IKKI tilli dars uchun
// yozilgan qoida. 11-sinfda til uchta, va o'zbekcha bilan inglizcha IKKALASI
// ham lotin -- alifbo bo'yicha ularni ajratib bo'lmaydi. Markersiz o'zbekcha
// matn ingliz talaffuzida o'qiladi.
//
// Bu tekshiruv MAKETNI emas, HAQIQIY tarmoq so'rovini o'qiydi: previu
// `?tts=<baza>` bilan HTTP yo'lini yoqadi, so'rovlar ushlab olinadi.
//
// Ishga tushirish:
//   npx vite --port 5263 --strictPort
//   node scripts/grade11-tts-check.mjs
//   node scripts/grade11-tts-check.mjs dars12
// ============================================================================
import { chromium } from 'playwright'
import { readFile } from 'node:fs/promises'

const PORT = process.env.GRADE11_PORT || '5263'
const LESSON = process.argv.slice(2).find((a) => !a.startsWith('--')) || 'dars12'
const LESSONS = {
  dars12: { slug: 'dars12-logarifmik-tengsizliklar', id: 'alg_11_12', segments: 4 },
}
if (!LESSONS[LESSON]) {
  console.log(`nomalum dars: ${LESSON}. Bor: ${Object.keys(LESSONS).join(', ')}`)
  process.exit(1)
}
const { slug: SLUG, id: LESSON_ID, segments: EXPECTED_SEGMENTS } = LESSONS[LESSON]
const TTS_HOST = 'https://tts.check.local'
const LANGS = ['ru', 'uz', 'en']

const MARKER = {
  ru: '[Русское произношение]',
  uz: "[O'zbekcha tallaffuz]",
  en: '[English pronunciation]',
}
const CYR = /[А-Яа-яЁё]/

// Javob HAQIQIY ovoz bo'lishi kerak: bo'sh javobda media-element `error` beradi
// va tekshiruv o'z tekshirayotgan xatosini keltirib chiqaradi. 60 ms jimlik.
function silentWav(ms = 60) {
  const rate = 8000
  const samples = Math.round((rate * ms) / 1000)
  const data = samples * 2
  const buf = Buffer.alloc(44 + data)
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + data, 4); buf.write('WAVE', 8)
  buf.write('fmt ', 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20)
  buf.writeUInt16LE(1, 22); buf.writeUInt32LE(rate, 24); buf.writeUInt32LE(rate * 2, 28)
  buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34)
  buf.write('data', 36); buf.writeUInt32LE(data, 40)
  return buf
}
const SILENCE = silentWav()

const problems = []
const note = (s) => console.log(s)

// ---------------------------------------------------------------------------
// STATIK QISM. Xato javob RAZBORI (`pushOneOff`) faqat mashq ekranlarida
// gapiradi -- brauzerda uni ushlash uchun butun darsni bosib o'tish kerak.
// Shuning uchun bu yo'l MANBADAN tekshiriladi: `buildTtsUrl` ning HAR
// chaqirig'i tilni uzatishi shart, aks holda marker `ru` ga tushib qoladi va
// o'zbek razbori rus talaffuzi bilan o'qiladi.
// ---------------------------------------------------------------------------
{
  const src = await readFile('src/components/grade11/core.jsx', 'utf8')
  // Qavslarni SANAB olamiz. `[^)]*` YARAMAYDI: chaqiriq ichida boshqa chaqiriq
  // bor (`speakable(text, this.lang)`) va yozuv birinchi yopuvchi qavsda
  // uzilib qoladi -- tekshiruv o'zi kesib olgan bo'lakka qarab «til yo'q» deb
  // yozardi. Xato KODDA emas, tekshiruvning o'zida edi.
  const calls = []
  for (let i = src.indexOf('buildTtsUrl('); i !== -1; i = src.indexOf('buildTtsUrl(', i + 1)) {
    let depth = 0
    for (let j = i; j < src.length; j += 1) {
      if (src[j] === '(') depth += 1
      else if (src[j] === ')') {
        depth -= 1
        if (depth === 0) { calls.push(src.slice(i, j + 1)); break }
      }
    }
  }
  const uses = calls.filter((c) => !/^buildTtsUrl\(base, text, gender/.test(c))
  // Argument VERGUL bo'yicha sanaladi, ichki qavsdagi vergul hisoblanmaydi.
  const argCount = (call) => {
    const inner = call.slice(call.indexOf('(') + 1, -1)
    let depth = 0
    let n = 1
    for (const ch of inner) {
      if (ch === '(' || ch === '[') depth += 1
      else if (ch === ')' || ch === ']') depth -= 1
      else if (ch === ',' && depth === 0) n += 1
    }
    return n
  }
  if (uses.length < 2) problems.push(`core.jsx: buildTtsUrl chaqiriqlari ${uses.length} ta, kutilgani 2 (bayon va razbor)`)
  uses.forEach((c) => {
    if (argCount(c) < 4) problems.push(`core.jsx: chaqiriqda til yo'q -- ${c}`)
  })
  note(`statik: buildTtsUrl chaqiriqlari ${uses.length}, hammasida til bor: ${uses.every((c) => argCount(c) >= 4)}`)
}

const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] })

for (const lang of LANGS) {
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } })
  const seen = []
  await page.route(TTS_HOST + '/**', async (route) => {
    seen.push(route.request().url())
    await route.fulfill({ status: 200, contentType: 'audio/wav', body: SILENCE })
  })
  const url =
    `http://localhost:${PORT}/11-sinf/matematika/nazariy/${SLUG}` +
    `?g11fast=1&lang=${lang}&tts=${encodeURIComponent(TTS_HOST)}`
  await page.goto(url, { waitUntil: 'networkidle' })
  // Avtoplay uchun jest: bosishsiz brauzer ovozni boshlamaydi.
  await page.mouse.click(5, 5)
  let quiet = 0
  for (let waited = 0; waited < 40000 && quiet < 2500; waited += 500) {
    const before = seen.length
    await page.waitForTimeout(500)
    quiet = seen.length === before ? quiet + 500 : 0
  }
  const narration = seen.length
  // Ikkinchi ovoz yo'li: xato javob razbori. Xuk ekranida prognoz baholanmaydi,
  // shuning uchun razbor bo'lmasligi mumkin -- statik qism uni qopladi.
  const opts = page.locator('button.g11-opt')
  const count = await opts.count()
  for (let i = 0; i < count; i += 1) {
    try { await opts.nth(i).click({ timeout: 900 }) } catch { /* bosilmaydigan tugma */ }
    await page.waitForTimeout(900)
    if (seen.length > narration) break
  }
  const razbor = seen.length - narration
  note(`\n[${lang}] ovoz so'rovlari: bayon ${narration}, razbor ${razbor}`)
  if (narration < EXPECTED_SEGMENTS) {
    problems.push(`${lang}: birinchi ekranda ${narration}/${EXPECTED_SEGMENTS} bo'lak aytildi -- qolgani o'tkazib yuborilgan`)
  }
  if (!seen.length) {
    problems.push(`${lang}: ovoz so'rovi UMUMAN ketmadi`)
    await page.close()
    continue
  }

  const q = new URL(seen[0]).searchParams
  const text = q.get('text') || ''
  note(`  text = ${text.slice(0, 90)}${text.length > 90 ? '…' : ''}`)
  note(`  lesson_id = ${q.get('lesson_id')}   lesson_name = ${q.get('lesson_name')}   g = ${q.get('g')}`)

  if (!text.startsWith(MARKER[lang])) problems.push(`${lang}: matn boshida marker yo'q -- «${text.slice(0, 40)}»`)
  if (q.get('lesson_id') !== LESSON_ID) problems.push(`${lang}: lesson_id = ${q.get('lesson_id')}, kutilgani ${LESSON_ID}`)
  if (!q.get('lesson_name')) problems.push(`${lang}: lesson_name bo'sh -- serverdagi kesh darslarni ajratmaydi`)
  if (q.get('g') !== 'm') problems.push(`${lang}: g = ${q.get('g')}, 11-sinfda erkak ovoz kutiladi`)

  // Marker o'zi ruscha yozilgan, shuning uchun uni olib tashlab tekshiramiz.
  const body = text.slice(MARKER[lang].length)
  if ((lang === 'uz' || lang === 'en') && CYR.test(body)) {
    problems.push(`${lang}: ovoz matnida KIRILL bor -- «${body.slice(0, 60)}»`)
  }
  // Har so'rovda marker va belgi bo'lsin, faqat birinchisida emas.
  for (const u of seen) {
    const p = new URL(u).searchParams
    if (!(p.get('text') || '').startsWith(MARKER[lang])) { problems.push(`${lang}: markersiz so'rov bor`); break }
    if (p.get('lesson_id') !== LESSON_ID) { problems.push(`${lang}: lesson_id siz so'rov bor`); break }
  }
  await page.close()
}

// ============================================================================
// SERVER XATO BERSA. Bir o'qishni TO'RT hodisa yopishi mumkin: `onended`,
// `onerror`, `play()` va'dasining rad javobi va straj. Yopuvchi BIR MARTALIK
// bo'lmasa, navbat ikki qadam siljiydi va bir gap jimgina yo'qoladi -- yomoni,
// ochilish fazasi ham shu indeksga qarab boradi, ya'ni KADR sakraydi.
// Mezon: xato javobda ham so'rovlar soni ishlaydigan serverdagicha.
// ============================================================================
{
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } })
  const seen = []
  await page.route(TTS_HOST + '/**', async (route) => {
    seen.push(route.request().url())
    await route.fulfill({ status: 500, contentType: 'text/plain', body: 'server yiqildi' })
  })
  await page.goto(
    `http://localhost:${PORT}/11-sinf/matematika/nazariy/${SLUG}?g11fast=1&lang=ru&tts=${encodeURIComponent(TTS_HOST)}`,
    { waitUntil: 'networkidle' },
  )
  await page.mouse.click(5, 5)
  let quiet = 0
  for (let waited = 0; waited < 40000 && quiet < 2500; waited += 500) {
    const before = seen.length
    await page.waitForTimeout(500)
    quiet = seen.length === before ? quiet + 500 : 0
  }
  note(`\n[xato server] so'rovlar: ${seen.length}, kutilgani ${EXPECTED_SEGMENTS}`)
  if (seen.length < EXPECTED_SEGMENTS) {
    problems.push(`xato serverda ${EXPECTED_SEGMENTS - seen.length} ta bo'lak o'tkazib yuborildi (${seen.length}/${EXPECTED_SEGMENTS})`)
  }
  await page.close()
}

await browser.close()

console.log('')
if (problems.length) {
  console.log('MUAMMOLAR:')
  problems.forEach((p) => console.log('  - ' + p))
  process.exit(1)
}
console.log(`OK: uch tilda ham marker, lesson_id va erkak ovoz; xato serverda bo'lak yo'qolmadi.`)
