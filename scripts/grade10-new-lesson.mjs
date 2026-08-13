// ============================================================================
// grade10-new-lesson.mjs — создаёт КАРКАС нового урока 10 класса на общем слое
// экранов (`screens.jsx`) и записывает урок в реестр.
//
// Зачем: обвязка урока одна и та же, и переписывать её руками 52 раза — это 52
// повода забыть тег, роль или язык. В 3 классе ту же работу делает
// `grade3-new-lesson.mjs`, и там это дало 51 урок.
//
// Что делает:
//   1) читает `DARSLAR_REJASI_10SINF.md` и берёт оттуда тему урока ДОСЛОВНО и
//      границы блока — метка урока обязана совпадать с планом, а не с памятью;
//   2) пишет `src/components/grade10/DarsNN.jsx`: метка, блок, пятнадцать
//      объектов данных с объявленными ролями и способами ответа, пятнадцать
//      коротких обвязок, корень через `makeLesson`;
//   3) добавляет запись в `src/lessons/grade10.js` — без неё урока на сайте нет.
//
// Чего НЕ делает намеренно: не сочиняет математику и не выбирает механику
// экранов. Это этап скелета, его утверждает методист. В файле остаются метки
// `TODO`, и `grade10-lesson-audit.mjs --release` не пропустит урок, пока они там.
//
// Запуск:
//   node scripts/grade10-new-lesson.mjs 1 dars01-radianlar "Radianlar" "Radians"
//                                       ^номер ^slug        ^тема UZ    ^тема EN
// ============================================================================
import fs from 'node:fs'
import path from 'node:path'

const [numArg, slug, titleUz, titleEn] = process.argv.slice(2)
if (!numArg || !slug || !titleUz || !titleEn) {
  console.log('нужно: node scripts/grade10-new-lesson.mjs <номер> <slug> "<тема UZ>" "<тема EN>"')
  console.log('тема RU берётся из плана дословно, придумывать её нельзя')
  process.exit(1)
}
const NO = Number(numArg)
if (!(NO >= 1 && NO <= 53)) { console.log('номер урока 10 класса — от 1 до 53'); process.exit(1) }
const NN = String(NO).padStart(2, '0')

const PLAN = path.resolve('src/books/grade10/DARSLAR_REJASI_10SINF.md')
const FILE = path.resolve(`src/components/grade10/Dars${NN}.jsx`)
const REG = path.resolve('src/lessons/grade10.js')

if (fs.existsSync(FILE)) { console.log(`${FILE} уже есть — не перезаписываю`); process.exit(1) }

// --- тема и блок из плана ---------------------------------------------------
const plan = fs.readFileSync(PLAN, 'utf8')
let block = null
let topicRu = null
let blockFrom = null
let blockTo = null
let blockNo = null
for (const chunk of plan.split(/\n## /).slice(1)) {
  const head = chunk.split('\n')[0]
  const bm = head.match(/^Блок (\d+)\./)
  if (!bm) continue
  const nums = []
  let mine = null
  for (const line of chunk.split('\n')) {
    const row = line.match(/^\|\s*(\d+)\s*\|\s*([^|]+?)\s*\|/)
    if (!row) continue
    const n = Number(row[1])
    nums.push(n)
    if (n === NO) mine = row[2]
  }
  if (mine) {
    blockNo = Number(bm[1])
    topicRu = mine
    block = head.replace(/^Блок \d+\.\s*/, '').trim()
    blockFrom = Math.min(...nums)
    blockTo = Math.max(...nums)
  }
}
if (!topicRu) { console.log(`урок ${NO} в плане не найден — сверься с DARSLAR_REJASI_10SINF.md`); process.exit(1) }

// Тема из плана уходит в `lesson_name` как есть, с сокращениями: по ней отчёт
// LMS ложится на план (решение методиста 2026-08-12).
const esc = (s) => s.replace(/"/g, '\\"')

// --- роли, способы ответа и форматы: контракт эталона §4.1, §4.6, §5.4 ------
const PLANNED = [
  ['hook', 'pick4', null, 'ХУК. Прогноз: две соперничающие записи. Не оценивается.'],
  ['support', 'lead', null, 'ОПОРА. Два-три коротких на прошлое знание.'],
  ['explain1', 'lead', null, 'ОБЪЯСНЕНИЕ 1. Первая модель, ученик действует рукой.'],
  ['explain2', 'lead', null, 'ОБЪЯСНЕНИЕ 2. Разграничение: похожее, но не это.'],
  ['explain3', 'lead', null, 'ОБЪЯСНЕНИЕ 3. Второе представление той же идеи.'],
  ['explain4', 'lead', null, 'ОБЪЯСНЕНИЕ 4. Сам, на новом случае.'],
  ['explain5', 'number', null, 'ОБЪЯСНЕНИЕ 5. Граничный случай, проверка числом.'],
  ['rule', 'pick2', null, 'ПРАВИЛО. Чек различения, потом карточка словами учебника.'],
  ['drill', 'build', 'table', 'ПРАКТИКА 1. Цепочка коротких однотипных.'],
  ['guided', 'lead', 'place', 'ПРАКТИКА 2. Направляемая: шаги названы, порядок жёсткий.'],
  ['paper', 'number', 'number+order', 'ПРАКТИКА 3. БЕЗ ПРИБОРА. На ДТМ чертежа не будет.'],
  ['trap', 'number', 'audit', 'ПРАКТИКА 4. ЛОВУШКА: все шаги верны, ответ неверен. Контрпример вводит ученик.'],
  ['transfer', 'lead', 'place+multi', 'ПЕРЕНОС. Обратная задача или сюжетная.'],
  ['blitz', 'mixed', 'chain', 'БЛИЦ. Четыре вопроса, ЕДИНСТВЕННЫЙ оцениваемый экран.'],
  ['summary', 'none', null, 'ИТОГ. Прогноз против результата. Новой математики нет.'],
]

const screenData = PLANNED.map(([role, answer, format, comment], i) => {
  const n = i + 1
  const noTool = role === 'paper' ? '\n  noTool: true,' : ''
  const tag = (n >= 2 && n <= 14)
    ? "\n  tag: 'TODO-teg-iz-etalona-2',   // тег ТОЛЬКО из ETALON_10SINF.md §2 или §8.5"
    : ''
  const fmt = format ? `\n  format: '${format}',` : ''
  return `// ============================================================
// ${n}. ${comment}
// ============================================================
const S${n} = {
  role: '${role}',
  answer: '${answer}',${fmt}${noTool}
  eyebrow: L('TODO uz', 'TODO ru', 'TODO en'),
  title: L('TODO uz', 'TODO ru', 'TODO en'),${tag}
  audio: [
    A('mount', 'TODO uz', 'TODO ru', 'TODO en'),
  ],
}

const Screen${n} = (p) => (
  <Screen data={S${n}} {...p}>
    {({ audio, phase, solved, solve, t }) => (
      // TODO: механика экрана. Прибор — КОНТРОЛЁР, не оракул: ответ до действия
      // не показывается, кнопки «показать ответ» нет (эталон §5.0).
      null
    )}
  </Screen>
)`
}).join('\n\n')

const head = `// ============================================================================
// 10-sinf, Dars ${NO}. ${titleUz.toUpperCase()}.  (${topicRu})
//
// Bu faylda FAQAT MA'LUMOT bor. O'ram \`screens.jsx\` da, mexanika \`tools.jsx\` da,
// yadro \`core.jsx\` da. Infratuzilma KO'CHIRILMAYDI.
//   reja:      src/books/grade10/DARSLAR_REJASI_10SINF.md, ${NO}-dars
//   skelet:    src/books/grade10/DARS${NN}_SKELET.md
//   kontrakt:  src/books/grade10/ETALON_10SINF.md
//
// Tuzilishi: 15 ekran, rollar etalon §4.1 bo'yicha, tartib O'ZGARMAYDI.
// Baholanadi FAQAT blits (14-ekran).
//
// Tekshirish:
//   node scripts/grade10-lesson-audit.mjs src/components/grade10/Dars${NN}.jsx
//   node scripts/grade10-noscroll.mjs · grade10-hand.mjs · grade10-tts-check.mjs
//
// \`import React\` SHART (LMS klassik rejim).
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { Col, Cols, Expr, Insight, L, Panel, Slot, Tag } from './core.jsx'
import {
  A,
  BlitzBody,
  HookBody,
  RuleBody,
  Screen,
  SummaryBody,
  makeLesson,
} from './screens.jsx'
import { Scene, UnitCircle } from './tools.jsx'

// Метка урока (решение методиста 2026-08-12): \`lesson_id\` = grade10-<номер>,
// \`lesson_name\` = номер + тема ИЗ ПЛАНА дословно, с сокращениями. По ней отчёт
// LMS и кэш озвучки ложатся на план. Заголовок на экране может быть другим.
const LESSON_NO = ${NO}
const LESSON_ID = \`grade10-\${String(LESSON_NO).padStart(2, '0')}\`
const LESSON_TITLE = L(
  \`\${LESSON_NO}-dars. ${esc(titleUz)}\`,
  \`Урок \${LESSON_NO}. ${esc(topicRu)}\`,
  \`Lesson \${LESSON_NO}. ${esc(titleEn)}\`,
)

// Блок ${blockNo}: ${block}. Уроки ${blockFrom}–${blockTo} по плану класса.
// \`B${blockNo}\` ЛАТИНСКОЙ буквой: на UZ и EN экране кириллицы быть не должно.
const BLOCK = { label: 'B${blockNo}', from: ${blockFrom}, to: ${blockTo}, current: ${NO} }
`

const tail = `
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

fs.writeFileSync(FILE, head + '\n' + screenData + '\n' + tail)

// --- запись в реестр --------------------------------------------------------
const reg = fs.readFileSync(REG, 'utf8')
if (reg.includes(`Dars${NN}.jsx`)) {
  console.log('в реестре запись уже есть — не дублирую')
} else {
  const entry = `  {
    slug: '${slug}',
    title: 'Dars ${NO}. ${titleUz}',
    desc: "TODO: bir gapda mavzu. 15 slayd, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade10/Dars${NN}.jsx')),
  },
`
  const at = reg.lastIndexOf(']')
  fs.writeFileSync(REG, reg.slice(0, at) + entry + reg.slice(at))
}

console.log(`создан ${path.relative(process.cwd(), FILE)}`)
console.log(`тема из плана: «${topicRu}» · блок ${blockNo} (${block}), уроки ${blockFrom}-${blockTo}`)
console.log('дальше: заполнить данные по скелету, потом')
console.log(`  node scripts/grade10-lesson-audit.mjs src/components/grade10/Dars${NN}.jsx`)
