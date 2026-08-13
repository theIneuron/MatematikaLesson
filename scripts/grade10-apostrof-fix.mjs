// ============================================================================
// grade10-apostrof-fix.mjs — заменяет типографский апостроф в узбекских строках
// урока на ASCII `'` и, если строка была в одинарных кавычках, переводит её в
// двойные. Без второго шага файл рвётся: `'bo'lgan'` — это уже не строка.
//
// Зачем скрипт, а не правка руками: учебник 2022 набран `ʻ` (U+02BB), местами
// `'` (U+2018). Скопированный термин проходит глазами и падает на проверке —
// эталон §3.1 называет это ловушкой, и в 11 классе она уже срабатывала.
//
// Почему посимвольный разбор, а не регекс: регекс по `'...'` цепляет закрывающую
// кавычку одной строки и открывающую следующей, и «починка» портит файл целиком.
// Проверено на себе.
//
// Запуск:
//   node scripts/grade10-apostrof-fix.mjs src/components/grade10/Dars01.jsx
//   node scripts/grade10-apostrof-fix.mjs <файл> --dry     (только показать)
// ============================================================================
import fs from 'node:fs'
import path from 'node:path'

const args = process.argv.slice(2)
const DRY = args.includes('--dry')
const FILE = path.resolve(args.find((a) => !a.startsWith('--')) || '')
if (!FILE || !fs.existsSync(FILE)) {
  console.log('нужно: node scripts/grade10-apostrof-fix.mjs <файл урока> [--dry]')
  process.exit(1)
}

const TYPO = /[‘’ʻʼ]/g
const src = fs.readFileSync(FILE, 'utf8')

// Разбор: идём по символам, помним, внутри какой строки находимся. Шаблонные
// строки (backtick) тоже строки, но их переделывать не нужно — апостроф в них
// законен.
const out = []
let i = 0
let quote = null      // "'", '"' или '`'
let start = -1        // начало текущего литерала в out
let hadTypo = false
let fixedStrings = 0
let fixedChars = 0

const flushLiteral = (endQuote) => {
  const body = out.slice(start + 1).join('')
  if (!hadTypo) { out.push(endQuote); return }
  fixedStrings += 1
  const clean = body.replace(TYPO, "'")
  fixedChars += (body.match(TYPO) || []).length
  // Одинарные кавычки больше не подходят: внутри появился ASCII-апостроф.
  const wrap = endQuote === "'" ? '"' : endQuote
  const safe = wrap === '"' ? clean.split('"').join('\\"') : clean
  out.length = start
  out.push(wrap, safe, wrap)
}

while (i < src.length) {
  const ch = src[i]
  if (quote) {
    if (ch === '\\') { out.push(ch, src[i + 1]); i += 2; continue }
    if (ch === quote) { flushLiteral(ch); quote = null; start = -1; hadTypo = false; i += 1; continue }
    if (TYPO.test(ch)) hadTypo = true
    TYPO.lastIndex = 0
    out.push(ch)
    i += 1
    continue
  }
  if (ch === "'" || ch === '"' || ch === '`') {
    quote = ch
    start = out.length
    hadTypo = false
    out.push(ch)
    i += 1
    continue
  }
  // Комментарии не трогаем совсем: там апостроф — часть узбекского текста
  // пояснения, и он никуда не уходит.
  if (ch === '/' && src[i + 1] === '/') {
    const nl = src.indexOf('\n', i)
    const end = nl === -1 ? src.length : nl
    out.push(src.slice(i, end))
    i = end
    continue
  }
  out.push(ch)
  i += 1
}

const res = out.join('')
console.log(`${path.relative(process.cwd(), FILE)}: строк с типографским апострофом ${fixedStrings}, символов ${fixedChars}`)
if (DRY) process.exit(0)
if (!fixedStrings) process.exit(0)
fs.writeFileSync(FILE, res)
console.log('исправлено; одинарные кавычки у этих строк заменены на двойные')
