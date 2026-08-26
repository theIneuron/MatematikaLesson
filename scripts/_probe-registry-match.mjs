// REYESTR va DARS bir narsani aytadimi. Etalon §10.2 shuni talab qiladi:
// «тема, номер и описание совпадают с src/lessons/grade11.js». Buni hech
// bir tekshiruv qilmaydi -- 41 dars bo'lganda esa qo'lda solishtirish
// ishonchsiz.
import { readFileSync, readdirSync } from 'node:fs'

const reg = readFileSync('src/lessons/grade11.js', 'utf8')
const entries = [...reg.matchAll(/slug:\s*'([^']+)'[\s\S]*?title:\s*(["'])(.*?)\2[\s\S]*?Dars(\d+)\.jsx/g)]
  .map((m) => ({ slug: m[1], title: m[3], file: 'Dars' + m[4] + '.jsx', num: Number(m[4]) }))

const problems = []
for (const e of entries) {
  const src = readFileSync('src/components/grade11/' + e.file, 'utf8')
  const id = (src.match(/id:\s*'alg_11_(\d+)'/) || [])[1]
  const cur = (src.match(/current:\s*(\d+)/) || [])[1]
  const from = (src.match(/from:\s*(\d+)/) || [])[1]
  const to = (src.match(/to:\s*(\d+)/) || [])[1]
  const label = (src.match(/label:\s*'([^']+)'/) || [])[1]
  const slugNum = (e.slug.match(/^dars(\d+)/) || [])[1]
  if (Number(id) !== e.num) problems.push(`${e.file}: meta.id = alg_11_${id}, fayl raqami ${e.num}`)
  if (Number(cur) !== e.num) problems.push(`${e.file}: block.current = ${cur}, fayl raqami ${e.num}`)
  if (Number(slugNum) !== e.num) problems.push(`${e.file}: slug «${e.slug}», fayl raqami ${e.num}`)
  if (!e.title.includes('Dars ' + e.num)) problems.push(`${e.file}: reyestr sarlavhasi «${e.title}» raqamni aytmaydi`)
  if (Number(cur) < Number(from) || Number(cur) > Number(to)) {
    problems.push(`${e.file}: current ${cur} blok ${label} (${from}–${to}) dan tashqarida`)
  }
}
const nums = entries.map((e) => e.num)
const dup = nums.filter((n, i) => nums.indexOf(n) !== i)
if (dup.length) problems.push('takrorlangan raqamlar: ' + dup.join(', '))

// Reyestrda YO'Q dars fayllari.
const files = readdirSync('src/components/grade11').filter((f) => /^Dars\d+\.jsx$/.test(f))
files.forEach((f) => {
  if (!entries.some((e) => e.file === f)) problems.push(`${f}: reyestrda yo'q -- saytda ko'rinmaydi`)
})

console.log(`reyestrda ${entries.length} dars, fayl ${files.length} ta`)
if (problems.length) {
  console.log('\nMOS KELMAYDI:')
  problems.forEach((p) => console.log('  x ' + p))
  process.exit(1)
}
console.log('reyestr va darslar mos: raqam, id, blok, slug')
