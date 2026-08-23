// ============================================================================
// 7-sinf STATIK tekshiruvi: apostrof, ovoz matni, uch tilning to'liqligi.
// Brauzer kerak emas. Ishga tushirish: node scripts/check-grade7.mjs
//
// Nimani ushlaydi:
//  1. Tipografik apostrof/qo'shtirnoq (UZ da faqat ASCII ' bo'lishi shart)
//  2. Ovoz matnida belgi: = < > % $ ^ × ÷ / va uzun tire, qo'shtirnoqlar
//     (TTS ularni o'qiy olmaydi yoki g'alati o'qiydi)
//  3. Ovoz matnida texnik marker (platforma qo'shadi, kontentda bo'lmasligi kerak)
//  4. L(...) uchligida bo'sh til
// ============================================================================
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

const DIR = 'src/components/grade7'
const problems = []

// UZBEKCHA SATR BITTA QAVSDA BO'LMAYDI (loyiha qoidasi, CLAUDE.md §7).
// Sabab amaliy: L('ko'paytirish', ...) dagi apostrof satrni UZIB qo'yadi va
// sahifa ochilmaydi. Bu 2026-08-20 da IKKI MARTA sodir bo'ldi (14 va
// 15-darslar). Build uni tutadi, lekin build sekin ishlaydi -- bu tekshiruv
// esa bir zumda.
const singleQuotedApostrophe = (src, file) => {
  src.split(String.fromCharCode(10)).forEach((line, i) => {
    // FAQAT `L(` chaqiruvi. Umumiy qoida bo'lsa, tekshiruv izohlardagi
    // apostroflarni ham ushlab, 4883 ta yolg'on xabar berardi -- shunday
    // tekshiruvni hech kim o'qimaydi. Bu yerda naqsh aniq: birinchi
    // argument uzilgan bo'lsa, yopilish qavsidan keyin DARROV harf keladi.
    if (line.trim().startsWith('//')) return
    // Ekranlangan apostrof (\') to'g'ri yozuv -- u satrni uzmaydi.
    const m = line.match(/L\('(?:[^'\\]|\\.)*'[A-Za-z]/)
    if (m) problems.push(`${file}:${i + 1} bitta qavsdagi satrda apostrof: ${m[0].slice(0, 32)} -- qo'sh qavs kerak`)
  })
}

// 2026-08-13: `Dars01.jsx` endi ro'yxatdan chiqarilmaydi. Ilgari bu yerda
// metodist 2026-08-05 da rad etgan prototip turardi; u NOLDAN qayta yozildi
// (DARS01_SKELET.md, DARS01_KONTENT.md) va `src/lessons/grade7.js` ga ulandi,
// ya'ni saytda ko'rinadi -- demak tekshiruvdan chiqarib bo'lmaydi.
const SKIP = new Set([])

const BAD_CHARS = [
  ['‘', 'tipografik apostrof U+2018'],
  ['’', 'tipografik apostrof U+2019'],
  ['ʻ', "o'zbek apostrofi U+02BB"],
  ['ʼ', "o'zbek apostrofi U+02BC"],
  ['“', 'qo\'shtirnoq U+201C'],
  ['”', 'qo\'shtirnoq U+201D'],
]

// Ovozda TAQIQLANGAN belgilar. Tire va qavslar ovozda ham uchraydi, lekin
// matematik belgilar so'z bilan aytilishi kerak.
const AUDIO_BAD = ['=', '<', '>', '%', '$', '^', '×', '÷', '≠', '—', '«', '»', '"']

// PAPKALAR ICHIGA HAM KIRAMIZ. 2026-08-20 da amaliyot `practice/darsNN/`
// papkalariga yotdi (1, 2 va 5-sinflardagi joylashuv), va bir qavatli
// `readdir` ularni KO'RMAY qolardi: o'n ikkita yangi fayl uch til, apostrof
// va ovoz tekshiruvidan JIMGINA tushib qolgan bo'lardi.
// LMS uchun yig'ilgan papka tekshirilmaydi: u avtomatik, manba fayllari
// allaqachon tekshirilgan (nusxada bir xil matn ikki marta hisoblanardi).
const SKIP_DIRS = ['lms-grade7-practice-standalone'];
const listJsx = async (dir, prefix = '') => {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const rel = prefix ? prefix + '/' + entry.name : entry.name
    if (entry.isDirectory()) {
      if (SKIP_DIRS.includes(entry.name)) continue;
      out.push(...await listJsx(path.join(dir, entry.name), rel))
    } else if (entry.name.endsWith('.jsx')) {
      out.push(rel)
    }
  }
  return out
}

const all = await listJsx(DIR)
const skipped = all.filter((f) => SKIP.has(f))

//
// 2026-08-22 da bu xato uch marta takrorlandi: CSS izohida teskari apostrof
// yozilgan, shablon satri uzilgan, va `.g7-dl` yoki `.g7-expr` kabi yozuv
// JS ifodasi bo'lib qolgan -- «dl is not defined», «expr is not defined».
// Dars BO'SH SAHIFA bo'ladi. `npm run build` bunda muvaffaqiyatli tugaydi,
// chunki chiqqan ifoda sintaktik jihatdan to'g'ri. Shuning uchun qo'riqchi
// STATIK tekshiruvda turadi.
// ============================================================================
const files = all.filter((f) => !SKIP.has(f))

// STYLES ichida TESKARI APOSTROF. `export const STYLES = ` ... ` ` -- shablon
// satri. Uning ichidagi izohga teskari apostrof yozilsa shablon O'SHA YERDA
// yopiladi va butun fayl parse bo'lmaydi. Xato JIM: dars sahifasi 500 beradi,
// tekshiruvlar esa «o'lchanadigan narsa yo'q» deb toza rapor qiladi.
// 2026-08-13 da bu KETMA-KET UCH MARTA takrorlandi, shuning uchun endi
// tekshiruv ushlaydi.
const stylesBacktick = (text) => {
  const start = text.indexOf('export const STYLES = `')
  if (start === -1) return null
  const from = start + 'export const STYLES = `'.length
  const end = text.indexOf('\n`', from)
  const body = text.slice(from, end === -1 ? text.length : end)
  const idx = body.indexOf('`')
  if (idx === -1) return null
  const line = text.slice(0, from + idx).split(/\r?\n/).length
  return line
}

for (const file of files) {
  const full = path.join(DIR, file)
  const text = await readFile(full, 'utf8')
  const lines = text.split(/\r?\n/)

  const btLine = stylesBacktick(text)
  if (btLine) {
    problems.push(`${file}:${btLine} -- STYLES ICHIDA teskari apostrof: shablon satri shu yerda yopiladi va fayl buziladi`)
  }

  // 1. Tipografik belgilar
  for (const [ch, label] of BAD_CHARS) {
    lines.forEach((line, i) => {
      if (line.includes(ch)) problems.push(`${file}:${i + 1} ${label}`)
    })
  }

  singleQuotedApostrophe(text, file)

  // 2-3. Ovoz satrlari: A('<qadam>', "uz", 'ru', 'en')
  // DIQQAT: qo'shtirnoq JS chegarasi bo'lishi mumkin (UZ satrlarida ASCII
  // apostrof bo'lgani uchun ular " bilan yoziladi). Shu sababli belgilarni
  // satrning O'ZIDA emas, ajratib olingan MATN ICHIDA tekshiramiz.
  lines.forEach((line, i) => {
    const trimmed = line.trim()
    if (!trimmed.startsWith('A(')) return
    const found = []
    let j = 0
    while (j < trimmed.length) {
      const ch = trimmed[j]
      if (ch === "'" || ch === '"') {
        let k = j + 1
        let buf = ''
        while (k < trimmed.length) {
          if (trimmed[k] === '\\') { buf += trimmed[k + 1] || ''; k += 2; continue }
          if (trimmed[k] === ch) break
          buf += trimmed[k]
          k += 1
        }
        found.push(buf)
        j = k + 1
        continue
      }
      j += 1
    }
    // birinchi satr -- qadam nomi, ovoz matni emas
    const texts = found.slice(1)
    texts.forEach((txt) => {
      for (const bad of AUDIO_BAD) {
        if (txt.includes(bad)) {
          problems.push(`${file}:${i + 1} ovoz matnida taqiqlangan belgi "${bad}"`)
        }
      }
      if (/\[(O'zbekcha|Русское|English)/i.test(txt)) {
        problems.push(`${file}:${i + 1} ovozda til markeri -- uni PLATFORMA qo'shadi`)
      }
    })
  })

  // 4. L(...) uchligida bo'sh til
  const lRe = /\bL\(\s*(['"])((?:\\.|(?!\1)[^\\])*)\1\s*,\s*(['"])((?:\\.|(?!\3)[^\\])*)\3\s*,\s*(['"])((?:\\.|(?!\5)[^\\])*)\5\s*\)/g
  let m
  while ((m = lRe.exec(text)) !== null) {
    const trio = [m[2], m[4], m[6]]
    if (trio.some((s) => s.trim() === '')) {
      const upto = text.slice(0, m.index).split(/\r?\n/).length
      problems.push(`${file}:${upto} L(...) da bo'sh til`)
    }
  }
}

if (skipped.length) {
  console.log('DIQQAT: tekshiruvdan chiqarilgan (rad etilgan prototip): ' + skipped.join(', '))
}

if (problems.length) {
  console.error(`MUAMMOLAR (${problems.length}):`)
  problems.slice(0, 50).forEach((p) => console.error('  ' + p))
  if (problems.length > 50) console.error(`  ... yana ${problems.length - 50}`)
  process.exitCode = 1
} else {
  console.log(`OK: ${files.length} fayl -- apostrof ASCII, ovoz matni toza, uch til to'la.`)
}
