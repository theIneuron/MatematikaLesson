// ============================================================================
// check-grade9-content.mjs — машинная проверка КОНТЕНТА урока 9 класса:
// три языка, узбекская гигиена, символы в ПРОИЗНОСИМОМ тексте.
//
// Зачем отдельно от прогона в браузере: браузер видит вёрстку, но не видит,
// что в разборе стоит знак «не равно», который движок озвучки прочитает
// мусором или пропустит. Правило «в озвучке всё словами» относится не к
// массиву `audio`, а к КАЖДОМУ ключу, который доезжает до `audio.say()`.
//
// Список произносимых ключей выведен из вызовов `audio.say()` в слое 8 класса
// (`feed.jsx`, `tools.jsx`, `plot.jsx`, `method.jsx`, `math.jsx`), а не угадан.
// Ключи `text`, `question`, `ask`, `after` встречаются в двух ролях, поэтому
// решение принимается ПО ФОРМЕ родительского объекта — см. комментарии ниже.
//
//   node scripts/check-grade9-content.mjs src/components/grade9/Dars01.jsx
// ============================================================================
import fs from 'node:fs'
import parser from '@babel/parser'
import traverseMod from '@babel/traverse'

const traverse = traverseMod.default || traverseMod


const file = process.argv[2]
const ast = parser.parse(fs.readFileSync(file, 'utf8'), { sourceType: 'module', plugins: ['jsx'] })

const CYR = /[Ѐ-ӿ]/
const BAD_APOS = /[ʻ‘’ʼ`]/
const BADSYM = /[%$\/×÷=<>✗─≠≥≤·√→±∞]/
const DASH = /—/
const QUOTES = /[«»“”]/

// всегда произносится
const ALWAYS = new Set(['hint', 'ok', 'afterSay', 'ask2', 'zeroNote', 'broke',
  'nextSay', 'noneWrong', 'wrongHint', 'question'])

const problems = []
let nL = 0
let nSpoken = 0

const isL = (n) => n && n.type === 'CallExpression' && n.callee.type === 'Identifier' && n.callee.name === 'L'
const strOf = (n) => {
  if (!n) return null
  if (n.type === 'StringLiteral') return n.value
  if (n.type === 'TemplateLiteral' && n.quasis.length === 1) return n.quasis[0].value.cooked
  return null
}
const ln = (n) => (n.loc ? n.loc.start.line : '?')
const keysOf = (obj) => (obj && obj.type === 'ObjectExpression'
  ? obj.properties.map((p) => (p.key ? p.key.name || p.key.value : null)) : [])

traverse(ast, {
  CallExpression(path) {
    const n = path.node
    if (isL(n)) {
      nL += 1
      const a = n.arguments
      if (a.length !== 3) { problems.push(`${ln(n)}: L() с ${a.length} аргументами`); return }
      const [uz, ru, en] = a.map(strOf)
      if (uz === null || ru === null || en === null) { problems.push(`${ln(n)}: L() нестроковый аргумент`); return }
      if (!uz.trim() || !ru.trim() || !en.trim()) problems.push(`${ln(n)}: пустой язык`)
      if (CYR.test(uz)) problems.push(`${ln(n)}: КИРИЛЛИЦА в UZ: ${uz.slice(0, 50)}`)
      if (CYR.test(en)) problems.push(`${ln(n)}: КИРИЛЛИЦА в EN: ${en.slice(0, 50)}`)
      if (BAD_APOS.test(uz)) problems.push(`${ln(n)}: не-ASCII апостроф в UZ: ${uz.slice(0, 50)}`)
      if (/\b(sen|sening|senga|senda)\b/i.test(uz)) problems.push(`${ln(n)}: UZ «sen» вместо «siz»: ${uz.slice(0, 50)}`)
      return
    }
    if (n.callee.type !== 'Identifier' || (n.callee.name !== 'A' && n.callee.name !== 'W')) return
    const texts = n.arguments.slice(1).map(strOf)
    if (texts.length !== 3) { problems.push(`${ln(n)}: ${n.callee.name}() без трёх языков`); return }
    nSpoken += 1
    texts.forEach((s, i) => {
      const lang = ['uz', 'ru', 'en'][i]
      if (s === null) { problems.push(`${ln(n)}: озвучка нестроковая`); return }
      const m = s.match(BADSYM)
      if (m) problems.push(`${ln(n)}: символ «${m[0]}» в озвучке ${lang}`)
      if (DASH.test(s)) problems.push(`${ln(n)}: длинное тире в озвучке ${lang}`)
      if (QUOTES.test(s)) problems.push(`${ln(n)}: кавычки в озвучке ${lang}`)
    })
  },

  ObjectProperty(path) {
    const key = path.node.key.name || path.node.key.value
    const parentKeys = keysOf(path.parent)
    let spoken = ALWAYS.has(key)
    // `question` произносится у Drill (feed.jsx, `nq`) — его задание всегда
    // несёт `expr`. У цепочки (Chain) вопрос только рисуется, там `expr` нет.
    if (key === 'question') spoken = parentKeys.indexOf('expr') !== -1
    // `after` произносится, только если рядом нет afterSay
    if (key === 'after') spoken = parentKeys.indexOf('afterSay') === -1
    // `ask` произносится только внутри goals[] у Steppers (форма {value, ask, after})
    if (key === 'ask') spoken = parentKeys.indexOf('value') !== -1
    // `text` произносится только внутри wrong[] у PlotTap (форма {at, text})
    if (key === 'text') spoken = parentKeys.indexOf('at') !== -1
    if (key === 'hints' && path.node.value.type === 'ObjectExpression') {
      path.node.value.properties.forEach((p) => check(p.value, 'hints'))
      return
    }
    if (!spoken) return
    check(path.node.value, key)
  },
})

function check(node, why) {
  if (!isL(node)) return
  nSpoken += 1
  node.arguments.map(strOf).forEach((s, i) => {
    if (s === null) return
    const lang = ['uz', 'ru', 'en'][i]
    const m = s.match(BADSYM)
    if (m) problems.push(`${ln(node)}: символ «${m[0]}» в произносимом ${why} ${lang}: ${s.slice(0, 60)}`)
    if (DASH.test(s)) problems.push(`${ln(node)}: длинное тире в произносимом ${why} ${lang}`)
    if (QUOTES.test(s)) problems.push(`${ln(node)}: кавычки в произносимом ${why} ${lang}`)
  })
}

console.log(`L() всего ${nL}, произносимых блоков ${nSpoken}`)
if (!problems.length) { console.log('ЧИСТО'); process.exit(0) }
console.log(`НАЙДЕНО ${problems.length}:`)
problems.forEach((p) => console.log('  ' + p))
process.exit(1)
