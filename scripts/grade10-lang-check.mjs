// ============================================================================
// 10-sinf: TARJIMASIZ SATRLARNI topadi.
//
// Nima uchun kerak. `grade10-noscroll.mjs` UZ va EN ekranida KIRILL bor-yo'qni
// tekshiradi -- ya'ni «ruscha o'zbekcha ekranga tushib qolgan» holatni. TESKARI
// holatni esa u ko'rmaydi: yozuv ustuniga o'zbekcha oddiy satr yozib qo'yilsa,
// u RUS ekranida ham o'zbekcha chiqadi va tekshiruv jim qoladi. Aynan shunday
// bo'lgan edi: «h asosni teng ikkiga bo'ladi» rus ekranida turdi.
//
// Mezon. Chiqarish ustunidagi element yo FORMULA (matematik belgilar), yo
// `L(...)` bo'lishi kerak. Oddiy satr ichida matematik bo'lmagan SO'Z bo'lsa --
// bu tarjimasiz matn.
//
// Ishga tushirish: node scripts/grade10-lang-check.mjs
// ============================================================================
import { readFile } from 'node:fs/promises'

const FILE = process.argv[2] || 'src/components/grade10/Dars03.jsx'

// Matematik belgilar: ular tildan qat'i nazar bir xil yoziladi.
const MATH = new Set([
  'cos', 'sin', 'tg', 'ctg', 'arccos', 'arcsin', 'sqrt', 'max', 'min',
  'a', 'b', 'c', 'h', 'x', 'y', 'r', 'd', 'n', 'k', 'm', 't',
])

const src = await readFile(FILE, 'utf8')
const problems = []

// CSS shabloni ichidagi BACKTICK -- shu loyihada uch marta takrorlangan xato.
// U shablonni UZIB yuboradi va izohning bir bo'lagi JS kodga aylanadi:
// «ReferenceError: header is not defined». Brauzerda dars umuman ochilmaydi,
// lekin xato izohda turgani uchun ko'z bilan topilmaydi.
const CORE = 'src/components/grade10/core.jsx'
try {
  const core = await readFile(CORE, 'utf8')
  const open = core.indexOf('export const STYLES = `')
  if (open !== -1) {
    const body = core.slice(open + 'export const STYLES = `'.length, core.lastIndexOf('`'))
    const n = (body.match(/`/g) || []).length
    if (n) problems.push(`${CORE}: STYLES shabloni ichida ${n} ta backtick -- shablon uziladi`)
  }
} catch (e) {
  problems.push(`${CORE}: o'qib bo'lmadi -- ${e.message}`)
}

// `show:` va `notes:` massivlaridagi oddiy satrlarni yig'amiz. L(...) ichidagi
// satrlar hisobga olinmaydi -- ular allaqachon uch tilda.
const blocks = src.matchAll(/\n\s*(show|notes|steps):\s*\[/g)
for (const b of blocks) {
  const start = b.index + b[0].length - 1
  let depth = 0
  let end = start
  for (let i = start; i < src.length; i += 1) {
    if (src[i] === '[') depth += 1
    if (src[i] === ']') { depth -= 1; if (depth === 0) { end = i; break } }
  }
  const body = src.slice(start, end + 1)
  // L(...) chaqiruvlarini olib tashlaymiz: ular tekshiruvdan o'tgan
  const bare = body.replace(/\bL\(([\s\S]*?)\)(?=\s*[,\]}])/g, '')
  const strings = bare.matchAll(/'([^'\\]*)'|"([^"\\]*)"/g)
  for (const m of strings) {
    const text = (m[1] !== undefined ? m[1] : m[2]).trim()
    if (!text) continue
    const words = text.match(/[A-Za-z\u02BB'‘’]{2,}/g) || []
    const bad = words.filter((w) => {
      const clean = w.replace(/[\u02BB'‘’]/g, '').toLowerCase()
      return clean.length >= 3 && !MATH.has(clean)
    })
    if (bad.length) {
      problems.push(`${b[1]}: "${text}" -> tarjimasiz so'z: ${bad.join(', ')}`)
    }
  }
}

if (problems.length) {
  console.error(`TARJIMASIZ SATRLAR (${problems.length}):`)
  problems.forEach((p) => console.error('  ' + p))
  console.error('\nHar bir SO\'Z satri L(uz, ru, en) bo\'lishi shart. Formula -- oddiy satr.')
  process.exit(1)
}
console.log('OK: chiqarish ustunida tarjimasiz satr yo\'q.')
