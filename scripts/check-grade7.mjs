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

// Metodist 2026-08-05 da rad etgan prototip. O'chirilgan edi, lekin ish
// daraxtida qaytib paydo bo'ldi va yana git da kuzatilmoqda. Ro'yxatga
// (`src/lessons/grade7.js`) ULANMAGAN, ya'ni saytda ko'rinmaydi.
// Tekshiruvdan CHIQARILDI, lekin jimgina emas -- pastda ogohlantirish chiqadi.
const SKIP = new Set(['Dars01.jsx'])

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

const all = (await readdir(DIR)).filter((f) => f.endsWith('.jsx'))
const skipped = all.filter((f) => SKIP.has(f))
const files = all.filter((f) => !SKIP.has(f))

for (const file of files) {
  const full = path.join(DIR, file)
  const text = await readFile(full, 'utf8')
  const lines = text.split(/\r?\n/)

  // 1. Tipografik belgilar
  for (const [ch, label] of BAD_CHARS) {
    lines.forEach((line, i) => {
      if (line.includes(ch)) problems.push(`${file}:${i + 1} ${label}`)
    })
  }

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
