// STYLES ichida TESKARI APOSTROF bo'lmasligini tekshiradi.
//
// Nima uchun alohida skript. `core.jsx` dagi STYLES -- shablon satr. Uning
// ichidagi izohga teskari apostrof tushsa, satr o'sha yerda UZILADI va fayl
// butunlay sinadi: dev server 500 qaytaradi, yig'ilish yiqiladi. Bu xato
// loyihada uch marta takrorlangan (3-sinf, shared/lesson-core, 11-sinf).
// `node --check` uni ko'rsatmaydi, chunki natija ba'zan sintaktik to'g'ri
// chiqadi. Shuning uchun tekshiruv aniq: STYLES tanasida backtick yo'q.
import { readFileSync } from 'node:fs'

const FILES = [
  'src/components/grade11/core.jsx',
  'src/components/shared/lesson-core.jsx',
]

let bad = 0
for (const f of FILES) {
  let src
  try { src = readFileSync(f, 'utf8') } catch { continue }
  const m = src.match(/(?:export )?const STYLES = `/)
  if (!m) { console.log(`${f}: STYLES yo'q, o'tkazildi`); continue }
  const from = src.indexOf(m[0]) + m[0].length
  const end = src.indexOf('\n`', from)
  const body = end === -1 ? src.slice(from) : src.slice(from, end)
  const lines = body.split('\n')
  const hits = []
  lines.forEach((l, i) => { if (l.includes('`')) hits.push(`${i + 1}: ${l.trim().slice(0, 80)}`) })
  if (hits.length) {
    bad += hits.length
    console.error(`XATO ${f}: STYLES ichida ${hits.length} teskari apostrof`)
    hits.slice(0, 5).forEach((h) => console.error('   ' + h))
  } else {
    console.log(`${f}: toza (${lines.length} satr)`)
  }
}
if (bad) {
  console.error('\nTeskari apostrof shablon satrni uzadi. Izohda unga o\'rin yo\'q.')
  process.exitCode = 1
}
