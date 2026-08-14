// ============================================================================
// 10-sinf: OVOZ SO'ROVINI tekshirish. Uch tilda ham marker va dars belgisi
// ketyaptimi.
//
// Platforma talabi (2-sinfdagi naqsh, tts-lang-marker): TTS ga ketayotgan har
// satr oldida til markeri turishi shart -- `[Русское произношение]`,
// `[O'zbekcha tallaffuz]`, `[English pronunciation]`. Marker bo'lmasa ovoz
// asosiy tilda noto'g'ri o'qiydi. So'rovda yana `lesson_id` va `lesson_name`
// bo'lishi kerak, aks holda serverdagi kesh hamma darsga bitta bo'lib qoladi.
//
// Bu tekshiruv MAKETNI emas, HAQIQIY tarmoq so'rovini o'qiydi: previu
// `?tts=<baza>` bilan HTTP yo'lini yoqadi, so'rovlar ushlab olinadi.
//
// Ishga tushirish:
//   npx vite --port 5210 --strictPort
//   node scripts/grade10-tts-check.mjs
// ============================================================================
import { chromium } from 'playwright'
import { readFile } from 'node:fs/promises'

const PORT = process.env.GRADE10_PORT || '5210'
// Dars ARGUMENT bilan tanlanadi, aks holda tekshiruv bitta darsga qadalib qoladi.
//   node scripts/grade10-tts-check.mjs dars01
const LESSON = process.argv.slice(2).find((a) => !a.startsWith('--')) || 'dars03'
const LESSONS = {
  dars03: { slug: 'dars03-trigonometrik-doira', no: 3, segments: 4 },
  dars01: { slug: 'dars01-radianlar', no: 1, segments: 4 },
  dars02: { slug: 'dars02-sin-cos-tg', no: 2, segments: 4 },
  dars04: { slug: 'dars04-ishoralar-qiymatlar', no: 4, segments: 4 },
  dars05: { slug: 'dars05-juftlik-davr', no: 5, segments: 4 },
  dars06: { slug: 'dars06-grafiklar', no: 6, segments: 4 },
  dars08: { slug: 'dars08-arkfunksiyalar', no: 8, segments: 4 },
  dars09: { slug: 'dars09-sodda-tenglamalar', no: 9, segments: 4 },
  dars10: { slug: 'dars10-sin-x-a', no: 10, segments: 4 },
}
if (!LESSONS[LESSON]) {
  console.log(`nomalum dars: ${LESSON}. Bor: ${Object.keys(LESSONS).join(', ')}`)
  process.exit(1)
}
const SLUG = LESSONS[LESSON].slug
const NO = LESSONS[LESSON].no
const TTS_HOST = 'https://tts.check.local'
const LANGS = ['ru', 'uz', 'en']

const MARKER = {
  ru: '[Русское произношение]',
  uz: "[O'zbekcha tallaffuz]",
  en: '[English pronunciation]',
}
// Dars nomi = raqam + REJADAGI tema aynan (metodist qarori 2026-08-12).
// Temaning O'ZI bu yerda tekshirilmaydi -- uni statik tekshiruv rejaga solishtiradi.
// Bu yerda muhimi: nom BO'SH emas va tilga MOS boshlanadi.
const PREFIX = {
  ru: `Урок ${NO}. `,
  uz: `${NO}-dars. `,
  en: `Lesson ${NO}. `,
}
const LESSON_ID = `grade10-${String(NO).padStart(2, '0')}`
// Birinchi ekrandagi ovoz bo'laklari soni (DarsNN.jsx, S1.audio).
const EXPECTED_SEGMENTS = LESSONS[LESSON].segments
const CYR = /[А-Яа-яЁё]/

// Javob HAQIQIY ovoz bo'lishi kerak: bo'sh javobda media-element `error` beradi,
// dvijokda esa `onerror` va `play().catch` IKKALASI ham keyingi bo'lakka o'tkazadi
// -- bir bo'lak sakrab ketadi va tekshiruv kamroq so'rov ko'radi. Shu sababli
// 60 ms jimlik: WAV, 8 kHz, mono, 16 bit.
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

// Avtoplay ruxsati SHART: usiz `el.play()` rad etiladi, dvijok bo'laklarni
// birin-ketin O'TKAZIB yuboradi va tarmoqda faqat oxirgisi ko'rinadi -- ya'ni
// tekshiruv har bo'lakni emas, bittasini ko'rgan bo'lardi.
// STATIK QISM. Xato javob RAZBORI (`pushOneOff`) faqat mashq ekranlarida
// gapiradi, xukda emas -- brauzerda uni ushlash uchun butun darsni bosib
// o'tish kerak. Shuning uchun bu yo'l manbadan tekshiriladi: `buildTtsUrl`
// ning HAR chaqirig'i tilni uzatishi shart, aks holda marker `ru` ga tushib
// qoladi va o'zbek razbori rus talaffuzi bilan o'qiladi.
{
  const src = await readFile('src/components/grade10/core.jsx', 'utf8')
  const calls = src.match(/buildTtsUrl\([^)]*\)/g) || []
  // Ta'rifning o'zi hisobga olinmaydi -- faqat CHAQIRIQLAR.
  const uses = calls.filter((c) => !/^buildTtsUrl\(base, text, gender/.test(c))
  if (uses.length < 2) problems.push(`core.jsx: buildTtsUrl chaqiriqlari ${uses.length} ta, kutilgani 2 (bayon va razbor)`)
  uses.forEach((c) => {
    if (c.split(',').length < 4) problems.push(`core.jsx: chaqiriqda til yo'q -- ${c}`)
  })
  note(`statik: buildTtsUrl chaqiriqlari ${uses.length}, hammasida til bor: ${uses.every((c) => c.split(',').length >= 4)}`)
}

const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] })
for (const lang of LANGS) {
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } })
  const seen = []
  // So'rov tashqariga CHIQMAYDI: ushlab olamiz va qisqa jimlik qaytaramiz.
  await page.route(TTS_HOST + '/**', async (route) => {
    seen.push(route.request().url())
    await route.fulfill({ status: 200, contentType: 'audio/wav', body: SILENCE })
  })
  const url =
    `http://localhost:${PORT}/10-sinf/matematika/nazariy/${SLUG}` +
    `?g10fast=1&lang=${lang}&tts=${encodeURIComponent(TTS_HOST)}`
  await page.goto(url, { waitUntil: 'networkidle' })
  // Avtoplay uchun jest: bosishsiz brauzer ovozni boshlamaydi.
  await page.mouse.click(5, 5)
  // Bayon tugashini KUTAMIZ: javob ko'rsatma tugagunicha yopiq, erta bosish
  // hech narsa qilmaydi. Tugadi = 2,5 s davomida yangi so'rov yo'q.
  let quiet = 0
  for (let waited = 0; waited < 40000 && quiet < 2500; waited += 500) {
    const before = seen.length
    await page.waitForTimeout(500)
    quiet = seen.length === before ? quiet + 500 : 0
  }
  const narration = seen.length
  // Ikkinchi ovoz yo'li: xato javob RAZBORI (`pushOneOff`). U navbatdan tashqari
  // ketadi, shuning uchun alohida tekshiriladi -- markersiz qolib ketishi oson.
  const opts = page.locator('button.g10-opt')
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
  if (!razbor) note(`  (xuk ekranida razbor yo'q -- taxmin baholanmaydi; pushOneOff statik tekshirilgan)`)

  if (!seen.length) {
    problems.push(`${lang}: ovoz so'rovi UMUMAN ketmadi`)
    await page.close()
    continue
  }
  const first = seen[0]
  const q = new URL(first).searchParams
  const text = q.get('text') || ''
  note(`  text = ${text.slice(0, 90)}${text.length > 90 ? '…' : ''}`)
  note(`  lesson_id = ${q.get('lesson_id')}   lesson_name = ${q.get('lesson_name')}   g = ${q.get('g')}`)

  if (!text.startsWith(MARKER[lang])) problems.push(`${lang}: matn boshida marker yo'q -- «${text.slice(0, 40)}»`)
  if (q.get('lesson_id') !== LESSON_ID) problems.push(`${lang}: lesson_id = ${q.get('lesson_id')}, kutilgani ${LESSON_ID}`)
  const nm = q.get('lesson_name') || ''
  if (!nm.startsWith(PREFIX[lang])) problems.push(`${lang}: lesson_name = «${nm}», «${PREFIX[lang]}...» bilan boshlanishi kerak`)
  if (nm.length <= PREFIX[lang].length) problems.push(`${lang}: lesson_name da tema yo'q, faqat raqam`)
  if (q.get('g') !== 'm') problems.push(`${lang}: g = ${q.get('g')}, 10-sinfda erkak ovoz kutiladi`)
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
// SERVER XATO BERSA. Ovoz serveri javob bermasa, dars bo'lakni O'TKAZIB
// yubormasligi kerak: `onerror` va `play()` rad javobi birga keladi, ilgari
// ikkalasi ham navbatni surar va bir gap jimgina yo'qolardi (2026-08-12 tuzatildi).
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
    `http://localhost:${PORT}/10-sinf/matematika/nazariy/${SLUG}?g10fast=1&lang=ru&tts=${encodeURIComponent(TTS_HOST)}`,
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
console.log("OK: uch tilda ham marker, lesson_id va lesson_name so'rovga ketyapti.")
