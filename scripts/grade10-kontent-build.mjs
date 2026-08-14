// ============================================================================
// grade10-kontent-build.mjs — ЭТАП 2 → ЭТАП 3. Из документа контента собирает
// файл урока: данные заполнены, тела экранов оставлены заглушками.
//
// ЗАЧЕМ ЭТОТ СКРИПТ СУЩЕСТВУЕТ. По `CLAUDE.md` §3 этапов четыре: скелет,
// контент, сборка, QA. Этап 2 — документ, который методист читает и правит до
// того, как появился код: правка формулировки в markdown стоит минуту, а та же
// правка в собранном уроке стоит сборки, прогона вёрстки и снимка.
//
// Но отдельный документ контента ускоряет только при одном условии: сборка из
// него должна быть МЕХАНИЧЕСКОЙ. Иначе это писание одного текста дважды —
// именно так вышло с уроком 3, где контент есть, а сборка делалась руками.
// Поэтому здесь: данные (озвучка, кадры, варианты, разборы, правило, итог —
// около семидесяти процентов файла) собираются машиной, а тела экранов, где
// выбираются приборы и фигуры, то есть где живут математические решения,
// остаются автору. Ровно то разделение, которое требует эталон §5.3.
//
// ФОРМАТ ДОКУМЕНТА описан в начале самого документа контента. Коротко: на
// каждый экран заголовок `## Экран N · роль · ответ X · формат Y · тег Z` и две
// таблицы — «Текст» (ключ, RU, UZ, EN) и «Формулы» (ключ, значение). Ключи в
// точечной записи, звёздочка после имени реплики означает движение.
//
// Запуск:
//   node scripts/grade10-kontent-build.mjs src/books/grade10/DARS04_KONTENT.md 4
//   node scripts/grade10-kontent-build.mjs <контент> <номер> [--force]
// ============================================================================
import fs from 'node:fs'
import path from 'node:path'

const args = process.argv.slice(2)
const FORCE = args.includes('--force')
const rest = args.filter((a) => !a.startsWith('--'))
const SRC = rest[0]
const NO = Number(rest[1])

if (!SRC || !NO) {
  console.log('надо: node scripts/grade10-kontent-build.mjs <файл контента> <номер урока> [--force]')
  process.exit(1)
}

const MARK = '// ======== QOLDA YOZILGAN QISM: bundan pastdagisi saqlanadi ========'

const nn = String(NO).padStart(2, '0')
const OUT = path.resolve(`src/components/grade10/Dars${nn}.jsx`)

// ПЕРЕСБОРКА МЕНЯЕТ ТОЛЬКО ДАННЫЕ.
//
// Первая редакция при `--force` перезаписывала файл целиком — вместе с телами
// экранов, написанными руками. Тогда документ контента становится ОДНОРАЗОВЫМ:
// методист правит формулировку, я пересобираю и теряю всю сборку. Ровно то, от
// чего этап 2 должен был избавить.
//
// Теперь: шапка (там правленный заголовок урока и импорты фигур) и тела экранов
// СОХРАНЯЮТСЯ, заменяется только блок `const S1..S15`. Полная перезапись — по
// отдельному ключу `--fresh`, и она нужна только на первой сборке.
const FRESH = args.includes('--fresh')
const has = fs.existsSync(OUT)
let keepHead = null
let keepTail = null
if (has && !FRESH) {
  const old = fs.readFileSync(OUT, 'utf8')
  const iData = old.indexOf('const S1 = {')
  // Граница слияния — ЯВНЫЙ маркер, а не первый `const Screen1`. Причина:
  // между данными и компонентами живут написанные руками помощники (разбор
  // строк таблицы, числа из контента), и при границе по `Screen1` они попадали
  // в заменяемую зону и стирались. Урок падал с «SIGN_ROWS is not defined».
  const iMark = old.indexOf(MARK)
  const iBody = iMark > 0 ? iMark : old.indexOf('const Screen1 = (p) => (')
  if (iData > 0 && iBody > iData) {
    keepHead = old.slice(0, iData)
    keepTail = old.slice(iBody)
  } else if (!FORCE) {
    console.log(`${path.relative(process.cwd(), OUT)} не разбирается на части. Нужен --fresh или --force.`)
    process.exit(1)
  }
}

const ROLES = [
  'hook', 'support', 'explain1', 'explain2', 'explain3', 'explain4', 'explain5',
  'rule', 'drill', 'guided', 'paper', 'trap', 'transfer', 'blitz', 'summary',
]

// ---------------------------------------------------------------------------
// Разбор. Таблицы читаются по строкам с трубой: столбцов либо четыре (текст),
// либо два (формула). Заголовок и разделитель таблицы пропускаются.
// ---------------------------------------------------------------------------
const cells = (line) => line.split('|').slice(1, -1).map((c) => c.trim())
const isRule = (line) => /^\|[\s:-]+\|/.test(line)

const problems = []

function parse(src) {
  const screens = []
  let cur = null
  for (const raw of src.split('\n')) {
    const line = raw.trim()
    const head = line.match(/^##\s+Экран\s+(\d+)\s*·(.*)$/)
    if (head) {
      const meta = head[2]
      cur = {
        n: Number(head[1]),
        role: (meta.match(/`(\w+)`/) || [])[1],
        answer: (meta.match(/ответ\s+`?(\w+\+?\w*)`?/) || [])[1],
        format: (meta.match(/формат\s+`?([\w+-]+)`?/) || [])[1] || null,
        tag: /тега нет/.test(meta) ? null : (meta.match(/тег\s+`([a-z0-9-]+)`/) || [])[1] || null,
        noTool: /без прибора/.test(meta),
        text: [],
        expr: [],
      }
      screens.push(cur)
      continue
    }
    if (!cur || line[0] !== '|' || isRule(line)) continue
    const c = cells(line)
    if (c.length === 4) {
      if (/^Ключ$/i.test(c[0])) continue
      const key = c[0].replace(/`/g, '').replace(/\s*\[верно\]\s*/, '').trim()
      const correct = /\[верно\]/.test(c[0])
      if (!key) continue
      cur.text.push({ key, correct, ru: c[1], uz: c[2], en: c[3] })
    } else if (c.length === 2) {
      if (/^Ключ$/i.test(c[0])) continue
      const key = c[0].replace(/`/g, '').replace(/\s*\[верно\]\s*/, '').trim()
      const correct = /\[верно\]/.test(c[0])
      if (!key) continue
      cur.expr.push({ key, correct, value: c[1].replace(/`/g, '').trim() })
    }
  }
  return screens
}

// ---------------------------------------------------------------------------
// Вывод строк. UZ-апостроф ASCII, поэтому UZ всегда в двойных кавычках; RU и EN
// в одинарных, если внутри нет одинарной. Если есть и та и другая — backtick.
// ---------------------------------------------------------------------------
const q = (s) => {
  const t = String(s)
  if (t.indexOf("'") === -1) return "'" + t + "'"
  if (t.indexOf('"') === -1) return '"' + t + '"'
  return '`' + t.replace(/`/g, '\\`') + '`'
}
const L = (r) => `L(${q(r.uz)}, ${q(r.ru)}, ${q(r.en)})`

// ---------------------------------------------------------------------------
// Точечные ключи → вложенный объект. `probe.a.hint` даёт {probe:{a:{hint}}}.
// Порядок появления сохраняется: он важен для озвучки и для вариантов.
// ---------------------------------------------------------------------------
// ЛИСТ, У КОТОРОГО ПОЯВИЛИСЬ ДЕТИ, СВОЁ ЗНАЧЕНИЕ НЕ ТЕРЯЕТ.
//
// `probe.b` это метка варианта, `probe.b.hint` — его разбор. Первая редакция
// при встрече второго ключа заменяла лист пустой веткой, и метка ИСЧЕЗАЛА: у
// вопроса оставался один вариант вместо четырёх, а у «отметь все» пропадали
// разборы. Проверка контракта это поймала сразу — ровно то, для чего она есть.
// Теперь значение переезжает под `__self`, а дети живут рядом.
function nest(rows, render) {
  const root = {}
  for (const r of rows) {
    const parts = r.key.split('.')
    let node = root
    for (let i = 0; i < parts.length - 1; i += 1) {
      const p = parts[i]
      if (!node[p]) node[p] = {}
      else if (node[p].__leaf) node[p] = { __self: node[p] }
      node = node[p]
    }
    const last = parts[parts.length - 1]
    const value = { __leaf: true, code: render(r), correct: r.correct, raw: r }
    if (node[last] && !node[last].__leaf) node[last].__self = value
    else node[last] = value
  }
  return { root }
}

const self = (v) => (!v ? null : v.__leaf ? v : v.__self || null)
const leaf = (v) => { const s = self(v); return s ? s.code : null }
const marked = (v) => { const s = self(v); return !!(s && s.correct) }
// Служебный ключ в перечислениях не участвует.
const kids = (node) => Object.keys(node).filter((k) => k !== '__self')

// ---------------------------------------------------------------------------
// Сборка одного экрана.
// ---------------------------------------------------------------------------
function build(scr) {
  const n = scr.n
  const want = ROLES[n - 1]
  if (scr.role !== want) problems.push(`экран ${n}: роль «${scr.role}», по §4.1 здесь «${want}»`)
  if (!scr.answer) problems.push(`экран ${n}: не объявлено, как сдаётся ответ`)

  // Дерево ОДНО на текст и формулы. Два дерева не годятся: под одним ключом
  // бывает и то и другое (`row.a.name` — текст, `row.a.value` — формула), и при
  // поиске по двум деревьям первое найденное закрывало второе, а формулы молча
  // терялись. Поймано на первом же прогоне сборщика.
  // Значение формулы с разделителем ` · ` — это СПИСОК, а не строка. Так
  // записываются шпаргалка, чипы таблицы, углы блица, шаги порядка: в документе
  // они читаются одной строкой, в данных обязаны быть массивом.
  const rows = scr.text.map((r) => ({ ...r, code: L(r) }))
    .concat(scr.expr.map((r) => ({
      ...r,
      code: r.value.indexOf(' · ') !== -1
        ? '[' + r.value.split(' · ').map((x) => q(x.replace(/^`|`$/g, '').trim())).join(', ') + ']'
        : q(r.value),
    })))
  const t = nest(rows, (r) => r.code)
  const get = (k) => {
    const path0 = k.split('.')
    let node = t.root
    for (const p of path0) { if (!node || !(p in node)) return null; node = node[p] }
    return node
  }
  const val = (k) => leaf(get(k))

  const out = []
  const put = (k, v) => { if (v) out.push(`  ${k}: ${v},`) }

  out.push(`  role: '${scr.role}',`)
  out.push(`  answer: '${scr.answer}',`)
  if (scr.format) out.push(`  format: '${scr.format}',`)
  if (scr.noTool) out.push('  noTool: true,')
  put('eyebrow', val('eyebrow'))
  put('title', val('title'))
  if (scr.tag) out.push(`  tag: '${scr.tag}',`)

  // КАДРЫ ПОКАЗА: show.<кадр>.<строка>, текст и формулы вперемешку.
  const frames = new Map()
  for (const r of scr.text.concat(scr.expr)) {
    const m = r.key.match(/^show\.(\d+)\.(\d+)$/)
    if (!m) continue
    const f = Number(m[1])
    if (!frames.has(f)) frames.set(f, [])
    frames.get(f).push({ i: Number(m[2]), code: r.value === undefined ? L(r) : q(r.value) })
  }
  if (frames.size) {
    const keys = [...frames.keys()].sort((a, b) => a - b)
    const body = keys.map((f) => {
      const lines = frames.get(f).sort((a, b) => a.i - b.i).map((x) => `      ${x.code},`).join('\n')
      return `    [\n${lines}\n    ],`
    }).join('\n')
    out.push(`  show: [\n${body}\n  ],`)
  }

  // ОЗВУЧКА и движение: имя со звёздочкой попадает в `motion`.
  const audio = scr.text.filter((r) => /^audio\./.test(r.key))
  if (audio.length) {
    const motion = []
    const segs = audio.map((r) => {
      const name = r.key.slice('audio.'.length).replace(/\*$/, '')
      if (/\*$/.test(r.key)) motion.push(name)
      return `    A('${name}', ${q(r.uz)}, ${q(r.ru)}, ${q(r.en)}),`
    })
    if (motion.length) out.push(`  motion: [${motion.map((m) => `'${m}'`).join(', ')}],`)
    out.push(`  audio: [\n${segs.join('\n')}\n  ],`)
  } else {
    problems.push(`экран ${n}: озвучки нет`)
  }

  // ВАРИАНТЫ одного вопроса: probe.<id> плюс .hint и .ok.
  const probe = get('probe')
  if (probe && !probe.__leaf) {
    const list = kids(probe).filter((k) => !['question', 'after', 'done'].includes(k))
    const items = list.map((id) => {
      const node = probe[id]
      const label = leaf(node)
      if (!label) { problems.push(`экран ${n}: у варианта «${id}» нет метки`); return null }
      const bits = [`id: '${id}'`, `label: ${label}`]
      if (marked(node)) bits.push('correct: true')
      const ok = node.ok ? leaf(node.ok) : null
      const hint = node.hint ? leaf(node.hint) : null
      if (ok) bits.push(`ok: ${ok}`)
      if (hint) bits.push(`hint: ${hint}`)
      return `      { ${bits.join(', ')} },`
    }).filter(Boolean)
    const head = []
    if (val('probe.question')) head.push(`    question: ${val('probe.question')},`)
    if (val('probe.after')) head.push(`    afterPredict: ${val('probe.after')},`)
    out.push(`  probe: {\n${head.join('\n')}${head.length ? '\n' : ''}    items: [\n${items.join('\n')}\n    ],\n  },`)
  }

  // ЦЕПОЧКА ВОПРОСОВ: q1, q2, ... с prompt, done и вариантами.
  const qKeys = [...new Set(rows.map((r) => (r.key.match(/^(q\d+)\./) || [])[1]).filter(Boolean))]
  if (qKeys.length) {
    const blocks = qKeys.map((qk) => {
      const node = get(qk)
      const opts = kids(node).filter((k) => !['prompt', 'done'].includes(k))
      const items = opts.map((id) => {
        const label = leaf(node[id])
        if (!label) { problems.push(`экран ${n}, ${qk}: у варианта «${id}» нет метки`); return null }
        const bits = [`id: '${id}'`, `label: ${label}`]
        if (marked(node[id])) bits.push('correct: true')
        const ok = node[id].ok ? leaf(node[id].ok) : null
        const hint = node[id].hint ? leaf(node[id].hint) : null
        if (ok) bits.push(`ok: ${ok}`)
        if (hint) bits.push(`hint: ${hint}`)
        return `        { ${bits.join(', ')} },`
      }).filter(Boolean)
      const done = val(`${qk}.done`)
      return `    {\n      id: '${qk}',\n      ask: true,\n      prompt: ${val(`${qk}.prompt`)},\n`
        + (done ? `      done: ${done},\n` : '')
        + `      items: [\n${items.join('\n')}\n      ],\n    },`
    })
    out.push(`  items: [\n${blocks.join('\n')}\n  ],`)
  }

  // «ОТМЕТЬ ВСЕ»: у `MultiPick` верный вариант помечается полем `ok`, а не
  // `correct`. Без своей ветки флаг «верно» терялся и все пять записей
  // становились неверными — экран было бы не пройти.
  const multi = get('multi')
  if (multi && !multi.__leaf) {
    const ids = kids(multi).filter((k) => !['prompt', 'title', 'ok'].includes(k))
    const items = ids.map((id) => {
      const node = multi[id]
      const label = leaf(node)
      if (!label) { problems.push(`экран ${n}: у записи «${id}» нет текста`); return null }
      const bits = [`id: '${id}'`, `label: ${label}`]
      if (marked(node)) bits.push('ok: true')
      const hint = node.hint ? leaf(node.hint) : null
      if (hint) bits.push(`hint: ${hint}`)
      return `      { ${bits.join(', ')} },`
    }).filter(Boolean)
    const head = ['prompt', 'title', 'ok']
      .filter((k) => val(`multi.${k}`))
      .map((k) => `    ${k === 'ok' ? 'ok' : k}: ${val(`multi.${k}`)},`)
    out.push(`  multi: {\n${head.join('\n')}\n    items: [\n${items.join('\n')}\n    ],\n  },`)
  }

  // ОСТАЛЬНОЕ отдаётся как есть: `work`, `rule`, `table`, `order`, `entry`,
  // `task`, `multi`, `place`, `row`, `hint`, `can`, `levels`, `sheet` и прочее.
  // Массивы собираются из числовых ключей (`work.hint.1`, `rule.line.1`).
  const done = new Set(['eyebrow', 'title', 'probe', 'audio', 'show', 'multi'])
  const groups = [...new Set(rows
    .map((r) => r.key.split('.')[0])
    .filter((g) => !done.has(g) && !/^q\d+$/.test(g) && !/^audio$/.test(g)))]

  for (const g of groups) {
    const node = get(g)
    if (!node) continue
    if (node.__leaf) { put(g, node.code); continue }
    const keys = kids(node)
    const numeric = keys.length > 0 && keys.every((k) => /^\d+$/.test(k))
    if (numeric) {
      const body = keys.sort((a, b) => a - b).map((k) => `    ${leaf(node[k])},`).join('\n')
      out.push(`  ${g}: [\n${body}\n  ],`)
      continue
    }
    const inner = keys.map((k) => {
      const sub = node[k]
      if (sub.__leaf) return `    ${k}: ${sub.code},`
      const subKeys = kids(sub)
      if (subKeys.every((x) => /^\d+$/.test(x))) {
        const body = subKeys.sort((a, b) => a - b).map((x) => `      ${leaf(sub[x])},`).join('\n')
        return `    ${k}: [\n${body}\n    ],`
      }
      // У ключа бывает И СВОЁ значение, И дети: `match.d` это подпись
      // «впадина», а `match.d.hint` — разбор к ней. Общая ветка выводила
      // только детей, и подпись исчезала молча — ровно та же потеря, что
      // ловилась в вариантах вопроса. Своё значение выходит под именем
      // `label`, как у вариантов.
      const own = sub.__self ? [`      label: ${sub.__self.code},`] : []
      const deep = own.concat(subKeys.map((x) => `      ${x}: ${leaf(sub[x])},`)).join('\n')
      return `    ${k}: {\n${deep}\n    },`
    }).join('\n')
    out.push(`  ${g}: {\n${inner}\n  },`)
  }

  return `const S${n} = {\n${out.join('\n')}\n}`
}

// ---------------------------------------------------------------------------
const src = fs.readFileSync(path.resolve(SRC), 'utf8')
const screens = parse(src)
if (screens.length !== 15) problems.push(`экранов в контенте ${screens.length}, эталон §4.1 требует 15`)

const data = screens.sort((a, b) => a.n - b.n).map(build)
const stubs = screens.map((s) => `const Screen${s.n} = (p) => (
  <Screen data={S${s.n}} {...p}>
    {(s) => (
      // TODO тело экрана ${s.n} (${s.role}): выбрать фигуру и прибор.
      // Данные уже собраны из контента, здесь только математические решения.
      <Slot mh={200} />
    )}
  </Screen>
)`).join('\n\n')

const file = `// ============================================================================
// 10-sinf, Dars ${NO}. KARKAS: MA'LUMOT KONTENTDAN YIG'ILDI.
//
// Bu fayl \`scripts/grade10-kontent-build.mjs\` bilan yasalgan:
//   manba:  ${SRC}
// Ma'lumot (ovoz, kadrlar, variantlar, razborlar, qoida, yakun) tayyor.
// EKRAN TANALARI esa \`TODO\` bo'lib qoldi: asbob va figurani tanlash --
// matematik qaror, va u avtomatlashtirilmaydi (etalon §5.3).
//
// Tartib: tanalarni to'ldirish, keyin \`grade10-lesson-audit.mjs\`, keyin
// tez yarus (2 o'lcham), keyin to'liq prognon. Har yangi figura oldin
// \`probe/figures.html\` stendida suratga olinadi.
//
// \`import React\` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { Col, Cols, Expr, L, Panel, Slot } from './core.jsx'
import {
  A,
  BlitzBody,
  HookBody,
  RuleBody,
  Screen,
  SummaryBody,
  makeLesson,
} from './screens.jsx'
import {
  AuditRows,
  BuildPoint,
  MultiPick,
  NoteList,
  NumberEntry,
  OrderRow,
  PlaceAngle,
  ProbeChain,
  Readout,
  Scene,
  TableFill,
  UnitCircle,
} from './tools.jsx'

// Метка урока: \`lesson_id\` = grade10-<номер>, \`lesson_name\` = номер + тема
// ИЗ ПЛАНА дословно.
const LESSON_NO = ${NO}
const LESSON_ID = \`grade10-\${String(LESSON_NO).padStart(2, '0')}\`
const LESSON_TITLE = L(
  \`\${LESSON_NO}-dars. TODO tema\`,
  \`Урок \${LESSON_NO}. TODO тема\`,
  \`Lesson \${LESSON_NO}. TODO topic\`,
)

const BLOCK = { label: 'B1', from: 1, to: 7, current: ${NO} }

${data.join('\n\n')}

${MARK}

${stubs}

const SCREENS = [
  Screen1, Screen2, Screen3, Screen4, Screen5,
  Screen6, Screen7, Screen8, Screen9, Screen10,
  Screen11, Screen12, Screen13, Screen14, Screen15,
]

export default makeLesson({
  meta: { id: LESSON_ID, no: LESSON_NO, title: LESSON_TITLE },
  block: BLOCK,
  screens: SCREENS,
  voice: 'm',
})
`

// Слияние: шапка и тела экранов остаются как были, заменяется только блок данных.
const result = keepHead !== null
  ? keepHead + data.join('\n\n') + '\n\n' + keepTail
  : file
fs.writeFileSync(OUT, result, 'utf8')
if (keepHead !== null) console.log('\nОбновлены ТОЛЬКО данные. Тела экранов и шапка сохранены.')
console.log(`\nСобрано: ${path.relative(process.cwd(), OUT)}`)
console.log(`Экранов: ${screens.length}  ·  строк: ${result.split('\n').length}`)
const audioCount = screens.reduce((a, s) => a + s.text.filter((r) => /^audio\./.test(r.key)).length, 0)
const strings = screens.reduce((a, s) => a + s.text.length, 0)
console.log(`Строк текста собрано: ${strings} (из них озвучки ${audioCount})`)
if (problems.length) {
  console.log(`\nЗАМЕЧАНИЯ: ${problems.length}`)
  problems.forEach((p) => console.log('  - ' + p))
}
console.log('\nДальше: заполнить тела экранов, потом grade10-lesson-audit.mjs.')
