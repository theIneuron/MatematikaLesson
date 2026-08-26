// ============================================================================
// grade11-lesson-audit.mjs — СТАТИЧЕСКАЯ проверка урока 11 класса по контракту
// эталона (`src/books/grade11/ETALON_11SINF.md`). Браузер не нужен.
//
// Зачем. Методист 2026-08-14: новый урок отличается от урока 12 не больше чем
// на 10%. Пока это правило проверяется глазами, оно проверяется на каждом из 50
// уроков заново — и на сороковом перестаёт проверяться вовсе. Скрипт делает
// сравнение с контрактом машинным.
//
// Что НЕ хардкодится: роли и теги вычитываются из эталона (§1 и §5). Добавили
// роль или тег в документ — скрипт принимает их сам. Иначе документ и проверка
// расходятся, и виноватым оказывается тот, кто читал документ.
//
// Как читаются данные: файл разбирается acorn + acorn-jsx и объекты экранов
// собираются из AST. Песочница (как в 10 классе) здесь не годится: в данных
// 11 класса законно встречается JSX — `fig: (t) => <BaseSlider …/>`.
//
// Запуск:
//   node scripts/grade11-lesson-audit.mjs                       (урок 12)
//   node scripts/grade11-lesson-audit.mjs src/components/grade11/Dars09.jsx
//   node scripts/grade11-lesson-audit.mjs --release             (режим сдачи)
// ============================================================================
import fs from 'node:fs'
import path from 'node:path'
import * as acorn from 'acorn'
import jsx from 'acorn-jsx'

const args = process.argv.slice(2)
const RELEASE = args.includes('--release')
const FILE = path.resolve(args.find((a) => !a.startsWith('--')) || 'src/components/grade11/Dars12.jsx')
const ETALON = path.resolve('src/books/grade11/ETALON_11SINF.md')
const REGISTRY = path.resolve('src/lessons/grade11.js')
const CORE = path.resolve('src/components/grade11/core.jsx')

const problems = []
const notes = []
const bad = (s) => problems.push(s)
const note = (s) => notes.push(s)

// ---------------------------------------------------------------------------
// КОНТРАКТ ИЗ ЭТАЛОНА
// ---------------------------------------------------------------------------
const etalon = fs.readFileSync(ETALON, 'utf8')

// §1: таблица ролей. Колонка 2 в строках вида `| 7 | `twoway` | … |`.
function rolesFromEtalon(fromMark, toMark) {
  const from = etalon.indexOf(fromMark || '## §1.')
  const to = etalon.indexOf(toMark || '### 1.1.')
  if (from < 0 || to < 0) { bad('эталон: не нашёл §1 — роли проверить нечем'); return [] }
  const out = []
  for (const line of etalon.slice(from, to).split('\n')) {
    const m = line.match(/^\|\s*(\d+)\s*\|\s*`([a-z]+)`\s*\|/)
    if (m) out[Number(m[1]) - 1] = m[2]
  }
  return out
}

// §5: таблица тегов. Первая колонка в строках вида `| `log_domain` | … |`.
function tagsFromEtalon() {
  const from = etalon.indexOf('## §5.')
  const to = etalon.indexOf('## §6.')
  if (from < 0 || to < 0) { bad('эталон: не нашёл §5 — теги проверить нечем'); return new Set() }
  const set = new Set()
  for (const line of etalon.slice(from, to).split('\n')) {
    // RAQAM ham: `dist_2d` kabi teg avval o'qilmasdi va «эталonda yo'q»
    // bo'lib chiqardi, aslida esa jadvalda turgan edi.
    const m = line.match(/^\|\s*`([a-z0-9_]+)`\s*\|/)
    if (m) set.add(m[1])
  }
  return set
}

// TAG_NAMES: yakun ekrani «zaif joy» yozuvini SHU YERDAN o'qiydi. Teg
// etalonda tasvirlangan, lekin bu ro'yxatda yo'q bo'lsa -- ekranda ikki
// nuqtadan keyin BO'SHLIQ chiqadi. B5 blokining 23 tegi shunday qolib
// ketgan edi: audit teg etalonda borligini tekshirardi, ekranda nomi
// bor-yo'qligini esa hech kim tekshirmasdi.
function tagsFromScreens() {
  // Qoralama ABSOLYUT yo'ldan tekshirilishi mumkin (C:/tmp/DarsNN.jsx), shuning
  // uchun screens.jsx darsning yonidan emas, LOYIHADAN o'qiladi.
  const near = path.join(path.dirname(FILE), 'screens.jsx')
  const src = fs.readFileSync(fs.existsSync(near) ? near : 'src/components/grade11/screens.jsx', 'utf8')
  const from = src.indexOf('export const TAG_NAMES = {')
  if (from < 0) { bad('screens.jsx: TAG_NAMES topilmadi'); return new Set() }
  const to = src.indexOf('\n}', from)
  const set = new Set()
  for (const line of src.slice(from, to).split('\n')) {
    const m = line.match(/^\s{2}([a-z0-9_]+):\s*L\(/)
    if (m) set.add(m[1])
  }
  return set
}

let ROLES = rolesFromEtalon()
const TAGS = tagsFromEtalon()
const NAMED = tagsFromScreens()
// §1.1: роли, которые не убираются ни при каких условиях.
const MUST_HAVE = ['hook', 'blitz', 'audit', 'summary']
// §2: число вопросов блица.
const BLITZ_N = Number((etalon.match(/\*\*(шесть|пять|четыре|семь)\s+вопросов\*\*/) || [])[1]
  ? { четыре: 4, пять: 5, шесть: 6, семь: 7 }[(etalon.match(/\*\*(шесть|пять|четыре|семь)\s+вопросов\*\*/) || [])[1]]
  : 6)
// §3: сколько экранов ответ пишет ученик.
const WRITTEN_MIN = Number((etalon.match(/минимум на \*\*(\w+)\*\* экранах/) || [])[1] === 'трёх' ? 3 : 3)

// ---------------------------------------------------------------------------
// ЧТЕНИЕ ДАННЫХ УРОКА ИЗ AST
// ---------------------------------------------------------------------------
const Parser = acorn.Parser.extend(jsx())
const src = fs.readFileSync(FILE, 'utf8')

// DTM REJIMI (etalon 1.2-band). Dars o'z anatomiyasini E'LON qiladi:
// `const MODE = 'dtm'`. Shunda tekshiruv 1.2 jadvalini oladi, aks holda
// 1-band jadvalini. Deklaratsiyasiz rejim yo'q -- 43-45 darslar B6 da
// turadi, lekin etalon bo'yicha yig'ilgan.
const MODE = (src.match(/const\s+MODE\s*=\s*'([a-z]+)'/) || [])[1] || 'etalon'

let ast
try {
  ast = Parser.parse(src, { ecmaVersion: 'latest', sourceType: 'module', locations: true })
} catch (e) {
  console.error(`${path.basename(FILE)}: файл не разбирается — ${e.message}`)
  process.exit(1)
}

if (MODE === 'dtm') {
  const dtm = rolesFromEtalon('### 1.2.', '## §2.')
  if (dtm.filter(Boolean).length === 15) {
    ROLES = dtm
    note('режим ДТМ: анатомия по эталону 1.2 — ' + dtm.join(', '))
  } else {
    bad('эталон: таблица 1.2 не читается — анатомию ДТМ проверить нечем')
  }
}

const CODE = Symbol('code') // JSX, функция, ссылка на код — значение не нужно
const consts = new Map()    // имя -> узел значения

for (const node of ast.body) {
  if (node.type !== 'VariableDeclaration') continue
  for (const d of node.declarations) {
    if (d.id.type === 'Identifier' && d.init) consts.set(d.id.name, d.init)
  }
}

const lineOf = (n) => (n && n.loc ? n.loc.start.line : 0)

function val(node, depth = 0) {
  if (!node || depth > 12) return CODE
  switch (node.type) {
    case 'Literal': return node.value
    case 'TemplateLiteral':
      return node.quasis.length === 1 ? node.quasis[0].value.cooked : CODE
    case 'UnaryExpression':
      if (node.operator === '-') { const v = val(node.argument, depth + 1); return typeof v === 'number' ? -v : CODE }
      return CODE
    case 'Identifier': {
      const ref = consts.get(node.name)
      return ref ? val(ref, depth + 1) : CODE
    }
    case 'ArrayExpression':
      return node.elements.map((el) => (el ? val(el, depth + 1) : null))
    case 'ObjectExpression': {
      const out = {}
      Object.defineProperty(out, '__line', { value: lineOf(node), enumerable: false })
      for (const p of node.properties) {
        if (p.type !== 'Property') continue
        const key = p.key.name || p.key.value
        out[key] = val(p.value, depth + 1)
        if (out[key] && typeof out[key] === 'object' && !out[key].__line) {
          try { Object.defineProperty(out[key], '__line', { value: lineOf(p.value), enumerable: false }) } catch { /* массив */ }
        }
      }
      return out
    }
    case 'CallExpression': {
      const fn = node.callee.name
      // L(uz, ru, en) — строка урока. A(on, uz, ru, en) — кусок озвучки.
      if (fn === 'L' && node.arguments.length >= 3) {
        return { uz: val(node.arguments[0], depth + 1), ru: val(node.arguments[1], depth + 1), en: val(node.arguments[2], depth + 1) }
      }
      if (fn === 'A' && node.arguments.length >= 4) {
        return {
          on: val(node.arguments[0], depth + 1),
          text: { uz: val(node.arguments[1], depth + 1), ru: val(node.arguments[2], depth + 1), en: val(node.arguments[3], depth + 1) },
        }
      }
      return CODE
    }
    default: return CODE
  }
}

// Экраны берутся из вызова `makeLesson({ screens: [...] })`: массив -- источник
// истины. Объявленный, но не подключённый объект в урок не входит.
function readLesson() {
  let call = null
  for (const node of ast.body) {
    if (node.type !== 'ExportDefaultDeclaration') continue
    if (node.declaration.type === 'CallExpression' && node.declaration.callee.name === 'makeLesson') call = node.declaration
  }
  if (!call) { bad('нет `export default makeLesson({…})` — урок не подключён к слою экранов'); return null }
  const arg = call.arguments[0]
  if (!arg || arg.type !== 'ObjectExpression') { bad('makeLesson вызван без объекта настроек'); return null }
  const out = { screenNames: [] }
  for (const p of arg.properties) {
    const key = p.key.name || p.key.value
    if (key === 'screens' && p.value.type === 'ArrayExpression') {
      out.screenNames = p.value.elements.map((el) => (el && el.type === 'Identifier' ? el.name : null))
      out.screens = p.value.elements.map((el) => val(el))
    } else {
      out[key] = val(p.value)
    }
  }
  return out
}

const lesson = readLesson()
if (!lesson) { report(); process.exit(problems.length ? 1 : 0) }

const screens = lesson.screens || []
const isL = (v) => v && typeof v === 'object' && 'uz' in v && 'ru' in v && 'en' in v

// ---------------------------------------------------------------------------
// §1. РОЛИ И ПОРЯДОК
// ---------------------------------------------------------------------------
if (screens.length !== ROLES.length) {
  bad(`экранов ${screens.length}, эталон §1 требует ${ROLES.length}`)
}
const roles = screens.map((s) => (s && s.role) || null)
roles.forEach((r, i) => {
  if (!r) bad(`экран ${i + 1} (${lesson.screenNames[i] || '?'}): нет поля role`)
})
MUST_HAVE.forEach((r) => {
  if (roles.indexOf(r) === -1) bad(`нет экрана с ролью \`${r}\` — эталон §1.1 запрещает её убирать`)
})
if (roles.filter((r) => r === 'blitz').length !== 1) {
  bad(`экранов с ролью \`blitz\` — ${roles.filter((r) => r === 'blitz').length}, должен быть ровно один (эталон §2)`)
}
// Правило 10%: сколько позиций разошлось с эталонным порядком.
const drift = roles.filter((r, i) => r && ROLES[i] && r !== ROLES[i])
const limit = Math.floor(ROLES.length * 0.1) // 1 экран из 15
if (drift.length > limit) {
  const where = roles.map((r, i) => (r !== ROLES[i] ? `${i + 1}: ${ROLES[i]} → ${r}` : null)).filter(Boolean)
  bad(`порядок ролей разошёлся с эталоном на ${drift.length} экрана(ов), допустимо ${limit} — ${where.join('; ')}`)
} else if (drift.length) {
  note(`роль заменена на ${drift.length} экране (в пределах 10%): ` + roles.map((r, i) => (r !== ROLES[i] ? `${i + 1}: ${ROLES[i]} → ${r}` : null)).filter(Boolean).join('; '))
}

// ---------------------------------------------------------------------------
// §9. ПАСПОРТ УРОКА
// ---------------------------------------------------------------------------
const fileNo = Number((path.basename(FILE).match(/Dars(\d+)/) || [])[1])
const meta = lesson.meta || {}
const block = lesson.block || {}
if (!meta.id || typeof meta.id !== 'string' || !/^alg_11_\d+$/.test(meta.id)) {
  bad(`meta.id = ${JSON.stringify(meta.id)} — эталон §9 требует вид alg_11_NN`)
} else if (fileNo && Number(meta.id.split('_').pop()) !== fileNo) {
  bad(`meta.id = ${meta.id}, а файл Dars${fileNo} — номера расходятся`)
}
if (!isL(meta.title)) bad('meta.title должен быть L(uz, ru, en) — из него идёт lesson_name в TTS')
if (fileNo && block.current !== fileNo) {
  bad(`block.current = ${block.current}, файл Dars${fileNo} — номер урока в шапке будет чужой`)
}
if (block.from !== undefined && block.current !== undefined && (block.current < block.from || block.current > block.to)) {
  bad(`block.current = ${block.current} вне диапазона блока ${block.from}–${block.to}`)
}
if (typeof block.label === 'string' && /[А-Яа-яЁё]/.test(block.label)) {
  bad(`block.label = «${block.label}» кириллицей — на UZ/EN экране кириллицы быть не должно (§8)`)
}

// ---------------------------------------------------------------------------
// §2 и §5. ВОПРОСЫ, ВАРИАНТЫ, РАЗБОРЫ, ТЕГИ
// ---------------------------------------------------------------------------
// Блок вопроса: `{ items: [ {id, label, correct?, hint?} … ] }`.
function checkQuestion(q, where, opts = {}) {
  if (!q || typeof q !== 'object' || !Array.isArray(q.items)) return
  const items = q.items.filter((it) => it && typeof it === 'object')
  const correct = items.filter((it) => it.correct === true)
  const predict = opts.predict || correct.length === 0

  // §2 «вопрос = 4 варианта». Два допускаются там, где выбор идёт между двумя
  // заявленными ответами (экран 3), больше двух правильных не бывает нигде.
  if (items.length !== 4 && items.length !== 2) {
    bad(`${where}: вариантов ${items.length}, эталон требует 4 (или 2 для выбора из двух ответов)`)
  }
  if (correct.length > 1) bad(`${where}: верных вариантов ${correct.length}`)
  if (!predict && correct.length === 0) bad(`${where}: нет верного варианта`)

  // Разбор на КАЖДЫЙ неверный вариант. У прогноза разборов нет по замыслу.
  if (!predict) {
    items.filter((it) => !it.correct).forEach((it) => {
      if (!it.hint) bad(`${where}, вариант ${it.id}: нет разбора (эталон §10.2)`)
      else if (!isL(it.hint)) bad(`${where}, вариант ${it.id}: разбор не на трёх языках`)
    })
  }
}

let written = 0
let noLineScreens = 0
const usedTags = new Set()

screens.forEach((s, i) => {
  if (!s || typeof s !== 'object') return
  const no = i + 1
  const name = lesson.screenNames[i] || 'S' + no
  const where = `экран ${no} (${name}, ${s.role})`

  // Обязательные поля §9.
  if (!isL(s.eyebrow)) bad(`${where}: eyebrow не на трёх языках`)
  if (!isL(s.title)) bad(`${where}: title не на трёх языках`)
  if (!Array.isArray(s.audio) || !s.audio.length) bad(`${where}: нет озвучки`)

  if (s.tag) {
    usedTags.add(s.tag)
    if (!TAGS.has(s.tag)) bad(`${where}: тег \`${s.tag}\` не описан в эталоне §5`)
    if (!NAMED.has(s.tag)) bad(`${where}: тег \`${s.tag}\` не назван в TAG_NAMES — итог покажет пустоту`)
  }

  // §6.3. Выдержка кадров нужна там, где раскрытие ведёт ОЗВУЧКА.
  const audioLed = s.led !== 'student'
  if (audioLed && Array.isArray(s.audio)) {
    const need = s.audio.length - 1
    if (!Array.isArray(s.holds)) bad(`${where}: раскрытие ведёт озвучка, но таблицы holds нет (§6.3)`)
    else if (s.holds.length < need) bad(`${where}: holds ${s.holds.length}, нужно ${need} — последние кадры без выдержки`)
  }

  // Вопросы экрана.
  const predictRoles = { hook: true }
  if (s.probe) checkQuestion(s.probe, `${where}, probe`, { predict: !!predictRoles[s.role] })
  if (s.probe1) checkQuestion(s.probe1, `${where}, probe1`)
  if (s.probe2) checkQuestion(s.probe2, `${where}, probe2`, { predict: true })
  if (s.role === 'support' && Array.isArray(s.tasks)) {
    s.tasks.forEach((q, k) => checkQuestion(q, `${where}, задание ${k + 1}`))
  }
  if (s.role === 'blitz' && Array.isArray(s.items)) {
    if (s.items.length !== BLITZ_N) bad(`${where}: вопросов ${s.items.length}, эталон §2 требует ${BLITZ_N}`)
    s.items.forEach((q, k) => {
      checkQuestion(q, `${where}, вопрос ${k + 1}`)
      if (!q || !q.tag) bad(`${where}, вопрос ${k + 1}: нет тега — результат будет процентом без диагноза (§5)`)
      else {
        usedTags.add(q.tag)
        if (!TAGS.has(q.tag)) bad(`${where}, вопрос ${k + 1}: тег \`${q.tag}\` не описан в эталоне §5`)
        if (!NAMED.has(q.tag)) bad(`${where}, вопрос ${k + 1}: тег \`${q.tag}\` не назван в TAG_NAMES`)
      }
    })
  }

  // §3. Ответ пишет ученик.
  if (s.answer && s.answer.value) written += 1
  if (s.role === 'chain' && s.noLine === true) noLineScreens += 1

  // §1. Интерактивные роли ведёт ученик, а не таймер.
  const studentRoles = ['points', 'sign', 'chain', 'blitz', 'audit', 'build']
  if (studentRoles.indexOf(s.role) !== -1 && s.led !== 'student') {
    bad(`${where}: роль интерактивная, нужен led: 'student' (§1)`)
  }
})

if (written < WRITTEN_MIN) {
  bad(`ответ пишет ученик на ${written} экранах, эталон §3 требует минимум ${WRITTEN_MIN}`)
}
if (noLineScreens < 1) {
  bad('нет ни одного экрана практики без числовой прямой (noLine) — эталон §3')
}

// ---------------------------------------------------------------------------
// РЕЕСТР И ЯДРО
// ---------------------------------------------------------------------------
try {
  const reg = fs.readFileSync(REGISTRY, 'utf8')
  const base = path.basename(FILE)
  if (reg.indexOf(base) === -1) bad(`урок не подключён в ${path.basename(REGISTRY)} — на сайте его не будет`)
  else if (fileNo) {
    // Тема, номер и описание в реестре обязаны совпадать с уроком (CLAUDE.md §7).
    const entry = reg.split(/\{\s*$/m).find((chunk) => chunk.indexOf(base) !== -1) || ''
    if (entry && !new RegExp('Dars ' + fileNo + '\\b|dars' + fileNo + '\\b').test(entry)) {
      note(`в реестре у ${base} не видно номера ${fileNo} — проверь slug и title`)
    }
  }
} catch { note('реестр не прочитан') }

try {
  const core = fs.readFileSync(CORE, 'utf8')
  const free = /export const FREE_NAV = (\w+)/.exec(core)
  if (free && free[1] === 'true') {
    if (RELEASE) bad('FREE_NAV = true — перед сдачей класса должно быть false (§10.2)')
    else note('FREE_NAV = true (режим разработки)')
  }
} catch { note('ядро не прочитано') }

// ---------------------------------------------------------------------------
// ОТЧЁТ
// ---------------------------------------------------------------------------
function report() {
  const name = path.basename(FILE)
  console.log(`\n=== АУДИТ ПО ЭТАЛОНУ: ${name}${RELEASE ? '  (режим сдачи)' : ''} ===`)
  console.log(`роли: ${roles ? roles.filter(Boolean).length : 0}/${ROLES.length} · теги в работе: ${[...usedTags].join(', ') || '—'}`)
  console.log(`ответ пишет ученик: ${written} экран(ов) · экранов без прямой: ${noLineScreens}`)
  if (notes.length) {
    console.log('\nЗАМЕТКИ')
    notes.forEach((n) => console.log('  · ' + n))
  }
  if (problems.length) {
    console.log(`\nНАРУШЕНИЙ КОНТРАКТА: ${problems.length}`)
    problems.forEach((p) => console.log('  ✗ ' + p))
  } else {
    console.log('\nКонтракт эталона выполнен.')
  }
}

report()
process.exitCode = problems.length ? 1 : 0
