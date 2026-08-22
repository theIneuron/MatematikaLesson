// ============================================================================
// check-grade8.mjs — машинная часть приёмки урока 8 класса.
//
// Зачем. В `ETALON_8SINF.md` §20 сорок шесть критериев, и до сих пор ни один
// из них не проверялся машиной: §21 п. 7 прямо говорит, что скрипта нет и
// приёмка делается глазами. Глаза на 55 уроках не работают.
//
// Как читаются данные. Файл урока — это JSX, и данные в нём содержат
// компоненты (двухэтажная дробь обязана быть компонентом, §20 п. 19).
// Поэтому: файл разбирается в AST (`@babel/parser`), каждый JSX-узел
// заменяется строкой-заглушкой, и получившийся JS исполняется в песочнице
// `node:vm`. Регексом содержимое не угадывается — иначе строка озвучки и
// строка экрана путаются местами, и проверка начинает врать в обе стороны.
//
// Главное отличие от других классов: проверяются не только поля, но и
// МАТЕМАТИКА. Каждая форма из `accepts` действительно подставляется в ядро
// и обязана быть принята; каждый ключ из `hints` обязан быть ОТВЕРГНУТ —
// иначе разбор, написанный для этой ошибки, не покажется никогда.
//
// Список заблуждений НЕ вшит: он вычитывается из §11 эталона. Добавили тег в
// эталон — скрипт принимает его сам.
//
// Запуск:
//   node scripts/check-grade8.mjs
//   node scripts/check-grade8.mjs src/components/grade8/Dars01.jsx
// ============================================================================
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { createRequire } from 'node:module'
import { checkIdentity, checkOdz, domainHoles, valueAt } from '../src/components/grade8/mathcore.js'
// КАРКАС КЛАССА импортируется САМОЙ приёмкой и кладётся в песочницу. Иначе
// после вырезания импортов урок не соберёт свой массив экранов, и проверка
// ролей, приборов и тегов промолчит вместо того, чтобы работать.
import { ETALON as KARKAS, T3, UI, buildScreens } from '../src/components/grade8/karkas.js'

const require = createRequire(import.meta.url)
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generate = require('@babel/generator').default
const tt = require('@babel/types')

const FILE = path.resolve(process.argv[2] || 'src/components/grade8/Dars01.jsx')
const ETALON = path.resolve('src/books/grade8/ETALON_8SINF.md')
const REGISTRY = path.resolve('src/lessons/grade8.js')
const CORE = path.resolve('src/components/grade8/core.jsx')

const errors = []
const warns = []
const bad = (m) => errors.push(m)
const warn = (m) => warns.push(m)

// ---------------------------------------------------------------------------
// 1. Данные урока из AST
// ---------------------------------------------------------------------------
const src = fs.readFileSync(FILE, 'utf8')
const ast = parser.parse(src, { sourceType: 'module', plugins: ['jsx'] })

traverse(ast, {
  // Разметка для проверки данных не нужна: заменяем на заглушку, чтобы
  // объявление стало исполняемым JS.
  'JSXElement|JSXFragment': (p) => { p.replaceWith(tt.stringLiteral('<jsx>')) },
  ImportDeclaration: (p) => { p.remove() },
  ExportNamedDeclaration: (p) => { if (p.node.declaration) p.replaceWith(p.node.declaration) },
  ExportDefaultDeclaration: (p) => { p.remove() },
})

const code = generate(ast, { compact: false }).code
const sandbox = {
  L: (uz, ru, en) => ({ uz, ru, en }),
  A: (on, uz, ru, en) => ({ on, text: { uz, ru, en } }),
  W: (on, uz, ru, en) => ({ on, wait: true, text: { uz, ru, en } }),
  F: () => '<frac>',
  ValueTable: () => '<table>',
  Row: () => '<row>',
  makeLesson: () => null,
  React: { createElement: () => '<jsx>' },
  // Каркас: урок ссылается на него, а импорт вырезан.
  buildScreens,
  ETALON: KARKAS,
  UI,
  T3,
}
const ctx = vm.createContext(sandbox)
try {
  vm.runInContext(code.replace(/^const /gm, 'var '), ctx)
} catch (e) {
  bad('данные урока не исполняются: ' + e.message)
}

const META = ctx.META
const STATEMENTS = ctx.STATEMENTS
const MISS = ctx.MISS
const SCREENS = ctx.SCREENS
if (!META || !SCREENS || !MISS || !STATEMENTS) {
  console.error('НЕ ПРОЧИТАНО: META / STATEMENTS / MISS / SCREENS')
  for (const e of errors) console.error('  ' + e)
  process.exit(1)
}

// ---------------------------------------------------------------------------
// 2. Список заблуждений — ИЗ эталона, не из скрипта
// ---------------------------------------------------------------------------
const etalon = fs.readFileSync(ETALON, 'utf8')
// Таблица заблуждений живёт в ред. 2 — ред. 3 сама говорит «список З1-З17 никуда
// не девается» и таблицу не повторяет. Читая только ред. 3, проверка получала
// ПУСТОЙ список и ругалась на каждый тег, включая утверждённые: то есть молчала
// именно там, где должна была говорить — на новом, неутверждённом коде.
const RED2 = path.resolve('src/books/grade8/ETALON_8SINF_RED2.md')
const tagSrc = etalon + (fs.existsSync(RED2) ? fs.readFileSync(RED2, 'utf8') : '')
const KNOWN = new Set(
  [...tagSrc.matchAll(/^\|\s*\**(З\d+)\**\s*\|/gm)].map((m) => m[1]),
)

// ---------------------------------------------------------------------------
// 3. Структура (§20 п. 6, 7, 1, 13а)
// ---------------------------------------------------------------------------
const ROLE_ORDER = [
  'hook', 'support', 'explain', 'explain', 'explain', 'explain', 'explain',
  'rule', 'practice', 'practice', 'practice', 'practice', 'transfer', 'blitz', 'summary',
]
if (SCREENS.length !== 15) bad(`экранов ${SCREENS.length}, а контракт — ровно 15 (§13)`)
SCREENS.forEach((s, i) => {
  if (s.role !== ROLE_ORDER[i]) bad(`экран ${i + 1}: роль «${s.role}», по §13 должна быть «${ROLE_ORDER[i]}»`)
})
// ПОЗИЦИИ ПРИБОРОВ — ПРЕДУПРЕЖДЕНИЕ, А НЕ ОШИБКА.
// Решение методиста 2026-08-21: образец класса — урок 1, и урок обязан
// отличаться от него не больше чем на десять процентов. Урок 1 держит границу,
// solo и обратную задачу НЕ на этих позициях, поэтому требовать их как ошибку
// значит запретить то, что методист назвал образцом. Правило остаётся видимым:
// каждый прогон говорит, чего на месте нет.
if (SCREENS[6] && SCREENS[6].kind !== 'boundary') warn('граничный случай не на экране 7 (§20 п. 7)')
if (SCREENS[12] && SCREENS[12].tool !== 'inverse') warn('обратная задача не на экране 13 (§20 п. 7)')
if (SCREENS[10] && SCREENS[10].tool !== 'solo') warn('экран 11 без прибора не проходится (§20 п. 5г)')
if (SCREENS[10] && SCREENS[10].props && SCREENS[10].props.actions) {
  bad('у экрана 11 есть ряд действий — это прибор (§20 п. 5г)')
}

// Выбор варианта против записи ответа.
// Выбор готового ответа. `rulebuild` и `tappart` сюда НЕ входят: там ответ
// собирается или записывается, а вопрос по ходу — это не форма ответа экрана.
const PICK = new Set(['substitute', 'plot', 'rule', 'audit'])
const WRITE = new Set([
  'chain', 'fields', 'transform', 'solo', 'boundary', 'inverse', 'tappart', 'rulebuild',
])
const picks = SCREENS.filter((s) => PICK.has(s.tool)).length
const writes = SCREENS.filter((s) => WRITE.has(s.tool)).length
if (picks > 3) bad(`экранов с выбором варианта ${picks}, разрешено не больше 3 (§20 п. 1)`)
// ЦЕНА ОБРАЗЦА, СКАЗАННАЯ ВСЛУХ. На обстановке урока 1 ученик почти всюду
// ВЫБИРАЕТ и ТАПАЕТ, а не пишет: приборов со свободным вводом там один.
// Требование «не меньше трёх» осталось предупреждением, чтобы цена была видна
// в каждом прогоне, а не забылась.
if (writes < 3) warn(`экранов, где ответ пишет ученик, ${writes}, по §20 п. 1 нужно не меньше 3`)

// Форматы практики.
const kinds = new Set(SCREENS.slice(8, 14).map((s) => s.kind || s.tool))
if (kinds.size < 3) bad(`на экранах 9–14 форматов ${kinds.size}, нужно не меньше 3 (§20 п. 13а)`)

if (STATEMENTS.length < 1 || STATEMENTS.length > 3) {
  bad(`STATEMENTS ${STATEMENTS.length}, инвариант — от одного до трёх (§13.2)`)
}

// ---------------------------------------------------------------------------
// 4. Теги и заблуждения (§20 п. 9, 5ж)
// ---------------------------------------------------------------------------
if (!MISS['З16']) bad('в MISS нет З16 — урок без ловушки не собирается (§11)')
const used = new Set()
SCREENS.forEach((s, i) => {
  if (s.tag) used.add(s.tag)
  if (s.tool === 'blitz') {
    const items = (s.props && s.props.items) || []
    // Четыре вопроса с вариантами (§10). Пятым разрешена СБОРКА записи из
    // летящих плиток: у неё вариантов нет по устройству прибора, и именно так
    // собран урок 1, который методист назвал образцом класса (2026-08-21).
    const builds = items.filter((q) => q.build).length
    if (items.length - builds !== 4) {
      bad(`блиц: вопросов с вариантами ${items.length - builds}, нужно 4 (§10)`)
    }
    if (builds > 1) bad(`блиц: сборок ${builds}, разрешена одна`)
    items.forEach((q, k) => {
      if (!q.tag) bad(`блиц, вопрос ${k + 1}: нет тега (§13.2 инвариант 12)`)
      else used.add(q.tag)
      if (q.build) return
      const right = (q.options || []).filter((o) => o.right).length
      if (right !== 1) bad(`блиц, вопрос ${k + 1}: верных вариантов ${right}, нужен ровно один`)
    })
  }
  const needsTag = i >= 2 && i <= 12
  if (needsTag && !s.tag) bad(`экран ${i + 1}: нет тега, а он обязателен на 3–13 (§13.2)`)
})
for (const code of used) {
  if (!MISS[code]) bad(`тег ${code} используется, но его нет в MISS`)
  else if (!KNOWN.has(code)) warn(`тег ${code} нет в списке §11 эталона — требует слова методиста`)
}
for (const code of Object.keys(MISS)) {
  if (!used.has(code)) warn(`заблуждение ${code} объявлено в MISS, но ни один экран его не пишет`)
  if (MISS[code].at === undefined) bad(`${code}: нет поля at — числа для контрпримера (§13.2)`)
}
// Ищем ПОЛЕ, а не слово: в комментарии «поля scored нет» слово есть, и по
// нему скрипт ругался на правильный файл.
if (/\bscored\s*:/.test(src)) bad('в файле урока есть поле scored — теоретический урок не оценивается (§20 п. 5ж)')
if (/\bscore\s*:/.test(src) || /\btotalQuestions\s*:/.test(src)) bad('в файле урока есть score — запрещено (§17)')

// ---------------------------------------------------------------------------
// 5. Три языка (§20 п. 20–23)
// ---------------------------------------------------------------------------
const LANGS = ['uz', 'ru', 'en']
const isL = (v) => v && typeof v === 'object' && !Array.isArray(v) && LANGS.every((k) => k in v)
const CYR = /[Ѐ-ӿ]/
const BAD_APOS = /[‘’ʻʼ′`]/
// Прошедшее время с привязкой к полу: и мужская, и женская форма — нарушение.
const GENDER = /\bты\s+[а-яё]+(?:ал|ял|ил|ел|ала|яла|ила|ела)\b/i

const walk = (v, fn, trail = '') => {
  if (!v || typeof v !== 'object') return
  if (isL(v)) { fn(v, trail); return }
  if (Array.isArray(v)) { v.forEach((x, i) => walk(x, fn, trail + '[' + i + ']')); return }
  for (const k of Object.keys(v)) walk(v[k], fn, trail + '.' + k)
}

SCREENS.forEach((s, i) => {
  walk(s, (l, trail) => {
    for (const lang of LANGS) {
      if (!String(l[lang] || '').trim()) bad(`экран ${i + 1}${trail}: пустой ${lang.toUpperCase()}`)
    }
    if (CYR.test(l.uz)) bad(`экран ${i + 1}${trail}: кириллица в UZ`)
    if (BAD_APOS.test(l.uz)) bad(`экран ${i + 1}${trail}: не ASCII-апостроф в UZ`)
    if (GENDER.test(l.ru)) bad(`экран ${i + 1}${trail}: RU с привязкой к полу — «${l.ru.slice(0, 60)}»`)
  })
})

// ---------------------------------------------------------------------------
// 6. Озвучка (§20 п. 24а, 25–28)
// ---------------------------------------------------------------------------
const AUDIO_BAN = /[=<>%/×÷≠«»"”„…]|--|—|:\s*\S/
const PRAISE = /(молодец|отлично|здорово|умница|прекрасно|barakalla|ajoyib|zo'r|ofarin|well done|great job)/i
SCREENS.forEach((s, i) => {
  const a = s.audio || []
  if (!a.length) { bad(`экран ${i + 1}: пустая озвучка (§20 п. 24)`); return }
  if (i > 0 && a[0].on !== 'mount' && a[0].on !== 's0') {
    bad(`экран ${i + 1}: первый сегмент «${a[0].on}» — фраза-мост должна открывать экран (§20 п. 24а)`)
  }
  if (i > 0 && a[0].wait) bad(`экран ${i + 1}: фраза-мост ждёт события — она не прозвучит`)
  a.forEach((seg, k) => {
    for (const lang of LANGS) {
      const text = String((seg.text && seg.text[lang]) || '')
      if (!text.trim()) { bad(`экран ${i + 1}, сегмент ${k}: пустой ${lang.toUpperCase()}`); continue }
      const m = text.match(AUDIO_BAN)
      if (m) bad(`экран ${i + 1}, сегмент ${k} (${lang}): в озвучке символ «${m[0]}» (§20 п. 26)`)
      if (PRAISE.test(text)) bad(`экран ${i + 1}, сегмент ${k} (${lang}): похвала в озвучке (§20 п. 28)`)
    }
  })
})

// Сегмент, который ждёт события, обязан иметь СВОЁ событие: имя должно
// встречаться в приборах. Иначе он молчит навсегда (10 класс, 2026-08-12).
const TOOLS_SRC = fs.readFileSync(path.resolve('src/components/grade8/tools.jsx'), 'utf8')
const EVENT_OK = new Set([
  'guess', 'sub1', 'sub2', 'ask', 'card', 'proof',
  // TapPart: qismni bosish, sonni qo'yish, chiziqning uzilishi, savol, ODZ
  'p1', 'p2', 'p3', 'p4', 'odz',
])
SCREENS.forEach((s, i) => {
  (s.audio || []).forEach((seg) => {
    if (!seg.wait) return
    const known = EVENT_OK.has(seg.on)
      || /^t\d+$/.test(seg.on)
      || /^f\d+$/.test(seg.on)
      || /^s\d+$/.test(seg.on)
      || /^k\d+$/.test(seg.on)   // Film: kadrlar lentasi
      || /^l\d+$/.test(seg.on)   // PowerLadder: заполненная ступень
      || /^a\d+$/.test(seg.on)   // TwoSides: применённое действие
      || /^z\d+$/.test(seg.on)   // ZoomLine: очередное увеличение
      || /^c\d+$/.test(seg.on)   // Chain: звено цепочки
      || /^w\d+$/.test(seg.on)   // TwoWays: кадр способа
      || /^d\d+$/.test(seg.on)   // Drill: задание цепочки
    if (!known) bad(`экран ${i + 1}: сегмент «${seg.on}» ждёт события, которого приборы не посылают`)
  })
})
if (!/audio\.step/.test(TOOLS_SRC)) bad('приборы не посылают событий озвучки')

// ---------------------------------------------------------------------------
// 7. МАТЕМАТИКА: accepts принимается, ключи hints отвергаются (§20 п. 31, 5, 10)
// ---------------------------------------------------------------------------
const judgeE = (mine, answer) => checkIdentity(mine, answer, {}).ok
const judgeO = (mine, excluded, varName) => checkOdz(mine, excluded, varName).ok

const NUMWORD = /^(barcha|любое|any|hammasi)/i
let mathChecks = 0

const checkTask = (task, where) => {
  const isOdz = task.kind === 'odz'
  if (isOdz) {
    if (!task.varName) { bad(`${where}: поле ОДЗ без varName — судья возьмёт чужую букву`); return }
    if (!Array.isArray(task.excluded) && !task.of) { bad(`${where}: поле ОДЗ без excluded и без of`); return }
  } else if (task.answer === undefined) {
    return
  }
  const excluded = isOdz
    ? (task.excluded || domainHoles(task.of, task.varName).holes || [])
    : null

  const forms = [...(task.accepts || [])]
  if (!isOdz && task.answer !== undefined) forms.unshift(task.answer)
  if (!forms.length) { warn(`${where}: нет accepts — п. 31 нечем проверить`); return }
  if (!isOdz && (task.accepts || []).length === 0) {
    warn(`${where}: у поля только один вид ответа (§13.2 инвариант 6)`)
  }
  for (const f of forms) {
    mathChecks += 1
    const ok = isOdz
      ? (NUMWORD.test(String(f)) ? excluded.length === 0 : judgeO(f, excluded, task.varName))
      : judgeE(f, task.answer)
    if (!ok) bad(`${where}: верная форма «${f}» НЕ принимается ядром (§20 п. 31)`)
  }
  for (const k of Object.keys(task.hints || {})) {
    mathChecks += 1
    const ok = isOdz
      ? (NUMWORD.test(k) ? excluded.length === 0 : judgeO(k, excluded, task.varName))
      : judgeE(k, task.answer)
    if (ok) bad(`${where}: «${k}» помечено как ошибка, но ядро её ПРИНИМАЕТ — разбор не покажется`)
  }
}

SCREENS.forEach((s, i) => {
  const p = s.props || {}
  const at = `экран ${i + 1}`
  ;(p.fields || []).forEach((f, k) => checkTask(f, `${at}, поле ${k + 1}`))
  ;(p.items || []).forEach((it, k) => {
    if (it.options) return   // блиц: варианты, не ввод
    checkTask(it, `${at}, задание ${k + 1}`)
  })
  ;(p.steps || []).forEach((st, k) => checkTask(st, `${at}, шаг ${k + 1}`))
  if (p.result) checkTask(p.result, `${at}, результат`)
  if (p.odz && typeof p.odz === 'object' && p.odz.excluded) {
    // varName у TapPart лежит на верхнем уровне прибора, а не внутри odz.
    checkTask({ varName: p.varName, ...p.odz, kind: 'odz' }, `${at}, ОДЗ`)
  }
  // Сборка правила: порядок обязан состоять из существующих фрагментов,
  // и лишние фрагменты обязаны быть — иначе собирать нечего.
  if (s.tool === 'rulebuild') {
    const ids = (p.fragments || []).map((f) => f.id)
    for (const id of p.answer || []) {
      if (!ids.includes(id)) bad(`${at}: в ответе фрагмент «${id}», которого нет`)
    }
    if (ids.length <= (p.answer || []).length) bad(`${at}: нет лишних фрагментов — правило собирается само`)
    if (!p.wrongHint) bad(`${at}: нет разбора на неверную сборку`)
  }
  // Хук «две машины»: дырка обязана быть в данных таблицы, иначе конфликта нет.
  if (s.tool === 'plot') {
    const hole = (p.rows || []).find((r) => r.v === null)
    if (!hole) bad(`${at}: в таблице нет прочерка — машины не расходятся`)
    else if (hole.x !== p.hole) bad(`${at}: прочерк при x = ${hole.x}, а hole = ${p.hole}`)
    if (p.holeValue === undefined) bad(`${at}: не задано, что показывает плоттер в дырке`)
  }
  // Граница: ответ — множество чисел, оно обязано быть непустым и осмысленным.
  if (s.tool === 'boundary' && !(Array.isArray(p.answer) && p.answer.length)) {
    bad(`${at}: у границы нет множества-ответа`)
  }
  // Обратная задача: обе проверки должны быть заданы.
  if (s.tool === 'inverse') {
    if (!p.reduceTo) bad(`${at}: обратная задача без reduceTo — проверять нечем`)
    if (!Array.isArray(p.excluded)) bad(`${at}: обратная задача без excluded`)
    for (const k of Object.keys(p.hints || {})) {
      mathChecks += 1
      const holes = domainHoles(k, p.varName || 'a').holes || []
      const want = (p.excluded || []).slice().sort((a, b) => a - b)
      const same = holes.length === want.length && holes.every((x, n) => Math.abs(x - want[n]) < 1e-9)
      if (same) bad(`${at}: «${k}» помечено как ошибка, но его ОДЗ совпадает с требуемой`)
    }
  }
  // ЛУПА: значение считается ИЗ ЗАПИСИ, и запись обязана считаться. Вариант
  // ответа один верный, остальные с разбором — иначе прибор превращается в
  // кнопку «дальше».
  if (s.tool === 'zoom') {
    if (!p.expr) bad(`${at}: у лупы нет записи, из которой берётся значение`)
    else {
      mathChecks += 1
      const got = valueAt(p.expr, {})
      const v = got && typeof got.value === 'number' ? got.value : null
      if (v === null || !isFinite(v)) {
        bad(`${at}: запись «${p.expr}» не даёт числа`)
      }
    }
    if (!p.label) bad(`${at}: запись не подписана`)
    if (!(p.depth >= 2)) bad(`${at}: увеличений ${p.depth}, а закономерность видна с двух`)
    const items = p.items || []
    const right = items.filter((i) => i.right).length
    if (items.length < 2) bad(`${at}: вариантов ${items.length}, нужно не меньше двух`)
    if (right !== 1) bad(`${at}: верных вариантов ${right}, нужен ровно один`)
    items.filter((i) => !i.right).forEach((i, k) => {
      if (!i.hint) bad(`${at}: у неверного варианта ${k + 1} нет разбора (§2.2.3)`)
    })
  }
  // ЛЕСТНИЦА СТЕПЕНЕЙ: значение считается из основания и показателя, поэтому
  // проверяется САМА возможность его посчитать. Отрицательное основание с
  // дробным показателем даёт NaN, и ступень станет пустой — на экране это
  // выглядит как сломанный прибор, а не как ошибка данных.
  if (s.tool === 'ladder') {
    if (typeof p.base !== 'number' || !isFinite(p.base)) bad(`${at}: у лестницы нет числового основания`)
    const rows = Array.isArray(p.rows) ? p.rows : []
    if (rows.length < 3) bad(`${at}: ступеней ${rows.length}, закономерность видна начиная с трёх`)
    if (!(p.known >= 1) || p.known >= rows.length) {
      bad(`${at}: known = ${p.known}, а нужно от одной до ${rows.length - 1}`)
    }
    if (!p.ask) bad(`${at}: у лестницы нет вопроса`)
    if (!p.stepLabel) bad(`${at}: не подписан шаг между ступенями`)
    rows.forEach((r, k) => {
      mathChecks += 1
      const v = Math.pow(p.base, r.e)
      if (!isFinite(v)) bad(`${at}, ступень ${k + 1}: значение не считается (основание ${p.base}, показатель ${r.e})`)
    })
  }
  // ЧЕТЫРЕ ОКНА: связь одна, и разбор не должен срабатывать на верном числе.
  // Проверять `accepts` тут нечего — ответ ЧИСЛО, а не запись; поэтому
  // проверяется само число и ключи разборов.
  if (s.tool === 'fourwin') {
    if (typeof p.k !== 'number' || !isFinite(p.k)) bad(`${at}: у четырёх окон нет числовой связи k`)
    if (p.answer === 'y' && p.holeAt === undefined) bad(`${at}: спрашивается y, но не указано holeAt`)
    if (p.answer !== 'y' && p.answer !== 'k' && p.answer !== undefined) {
      bad(`${at}: answer «${p.answer}» — бывает только k или y`)
    }
    if (!p.given) bad(`${at}: не указано, какое окно ДАНО`)
    if (!p.ask) bad(`${at}: у четырёх окон нет вопроса`)
    const right = p.answer === 'y' ? p.k / p.holeAt : p.k
    for (const key of Object.keys(p.hints || {})) {
      if (key === '*') continue
      mathChecks += 1
      if (Math.abs(Number(key) - right) < 1e-9) {
        bad(`${at}: «${key}» помечено как ошибка, но это и есть верное число`)
      }
    }
  }
  // Ловушка: контрпример вводит ученик, и запись для проверки обязана быть.
  if (s.tool === 'audit') {
    if (!p.ask || !p.ask.of) bad(`${at}: у ловушки нет поля контрпримера (§20 п. 5д)`)
    if (!p.answerId) bad(`${at}: у ловушки не указана первая неверная строка`)
    const ids = (p.rows || []).map((r) => r.id)
    if (p.answerId && !ids.includes(p.answerId)) bad(`${at}: answerId не совпадает ни с одной строкой`)
    for (const id of Object.keys(p.hints || {})) {
      if (!ids.includes(id)) bad(`${at}: разбор для строки «${id}», которой нет`)
    }
    const need = ids.filter((id) => id !== p.answerId)
    for (const id of need) {
      if (!(p.hints || {})[id]) bad(`${at}: у строки «${id}» нет своего разбора (§2.2.3)`)
    }
  }
})

// ---------------------------------------------------------------------------
// 8. Техника (§20 п. 29, 37, 38, 36а)
// ---------------------------------------------------------------------------
if (!/^import React/m.test(src)) bad('нет import React — LMS грузит сырой jsx в классическом режиме (§20 п. 37)')
for (const [re, what] of [
  [/class AudioEngine/, 'движок озвучки'],
  [/const STYLES\s*=/, 'стили'],
  [/function useAudio/, 'хук озвучки'],
]) {
  if (re.test(src)) bad(`в файле урока ${what} — инфраструктура запрещена (§20 п. 29)`)
}
const core = fs.readFileSync(CORE, 'utf8')
// Режим просмотра — не ошибка сборки, но он обязан быть ВИДЕН в каждом
// прогоне: иначе класс уедет на сдачу с открытой навигацией (§20 п. 36а).
if (/export const FREE_NAV = true/.test(core)) {
  warn('FREE_NAV = true — режим просмотра, переход открыт без ответа. Перед сдачей класса вернуть false (§20 п. 36а)')
} else if (!/export const FREE_NAV = false/.test(core)) {
  bad('FREE_NAV не найден в ядре (§20 п. 36а)')
}
if (/UI_TXT\.lessonNo\b[^=]*\|\|/.test(core) === false && /lessonNo: L\('8-sinf · \d/.test(core)) {
  bad('номер урока вшит в ядро — он должен приходить из META.n')
}

const reg = fs.readFileSync(REGISTRY, 'utf8')
const nn = String(META.n).padStart(2, '0')
if (!new RegExp(`Dars${nn}\\.jsx`).test(reg)) bad(`реестр не импортирует Dars${nn}.jsx (§20 п. 38)`)
if (!new RegExp(`Dars ${META.n}\\.`).test(reg)) bad(`в реестре нет заголовка «Dars ${META.n}.»`)
const plan = fs.readFileSync(path.resolve('src/books/grade8/DARSLAR_REJASI_8SINF.md'), 'utf8')
const planRow = plan.split('\n').find((l) => new RegExp(`^\\|\\s*${META.n}\\s*\\|`).test(l))
if (!planRow) warn(`в плане нет строки урока ${META.n}`)
else if (!planRow.includes('| ' + META.row + ' |')) warn(`строка мастер-файла в META (${META.row}) не совпадает с планом`)

// ---------------------------------------------------------------------------
// Итог
// ---------------------------------------------------------------------------
const name = path.basename(FILE)
console.log(`\n${name} — ${META.id}, экранов ${SCREENS.length}, проверок математики ${mathChecks}`)
if (warns.length) {
  console.log('\nПРЕДУПРЕЖДЕНИЯ:')
  for (const w of warns) console.log('  · ' + w)
}
if (errors.length) {
  console.log('\nОШИБКИ:')
  for (const e of errors) console.log('  ✗ ' + e)
  console.log(`\nне пройдено: ${errors.length}`)
  process.exit(1)
}
console.log('\nмашинная часть §20 пройдена. Глазами остаются: 6а (честность разбора),')
console.log('4, 5в, 5д, 5е, 5з, 11–13, 16–18 — методика; 32–36 — прокликиванием.\n')
