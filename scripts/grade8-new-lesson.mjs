// ============================================================================
// grade8-new-lesson.mjs — новый урок 8 класса из плана, за одну команду.
//
// Зачем. Урок 8 класса — это ДАННЫЕ: пятнадцать экранов с ролями из §13,
// подключение приборов, теги, озвучка. Всё, кроме математики, в каждом уроке
// одинаково. Набирать этот каркас руками пятьдесят пять раз значит пятьдесят
// пять раз забыть тег, роль или фразу-мост.
//
// Что делает скрипт:
//   1. берёт номер урока и находит его строку в DARSLAR_REJASI_8SINF.md —
//      тему, блок, строку мастер-файла и номер прибора;
//   2. пишет `src/components/grade8/DarsNN.jsx` с пятнадцатью экранами в
//      правильных ролях, с заглушками ТЕМА-МЕТКАМИ вместо математики;
//   3. пишет заготовку раскадровки `src/books/grade8/DARSNN_SKELET.md`;
//   4. добавляет запись в `src/lessons/grade8.js`.
//
// Заглушки помечены словом TODO и НЕ проходят `check-grade8.mjs`: пустой
// урок не должен выглядеть готовым.
//
// Запуск:
//   node scripts/grade8-new-lesson.mjs 2
//   node scripts/grade8-new-lesson.mjs 2 --slug dars02-kasrning-asosiy-xossasi
// ============================================================================
import fs from 'node:fs'
import path from 'node:path'

const args = process.argv.slice(2)
const n = Number(args.find((a) => /^\d+$/.test(a)))
const slugArg = (() => {
  const i = args.indexOf('--slug')
  return i === -1 ? null : args[i + 1]
})()

if (!n || n < 1 || n > 55) {
  console.error('Укажи номер урока: node scripts/grade8-new-lesson.mjs 2')
  process.exit(1)
}

const nn = String(n).padStart(2, '0')
const PLAN = path.resolve('src/books/grade8/DARSLAR_REJASI_8SINF.md')
const OUT = path.resolve(`src/components/grade8/Dars${nn}.jsx`)
const SKELET = path.resolve(`src/books/grade8/DARS${nn}_SKELET.md`)
const REG = path.resolve('src/lessons/grade8.js')

if (fs.existsSync(OUT)) {
  console.error(`${OUT} уже есть. Скрипт ничего не перезаписывает.`)
  process.exit(1)
}

// --- строка плана ----------------------------------------------------------
const plan = fs.readFileSync(PLAN, 'utf8')
const row = plan.split('\n').find((l) => new RegExp(`^\\|\\s*${n}\\s*\\|`).test(l))
if (!row) {
  console.error(`В плане нет строки урока ${n}. План — источник тем, вручную тему не выдумываем.`)
  process.exit(1)
}
const cells = row.split('|').map((c) => c.trim())
const topicRu = cells[2].replace(/\*\*/g, '')
const mfRow = cells[3]
const block = /Б\d/.exec(row) ? /Б\d/.exec(row)[0] : 'Б1'
const tool = cells[6] || '1'
const id = (n <= 36 ? 'alg' : 'geo') + '-8-' + nn
const slug = slugArg || `dars${nn}-todo-uzbekcha-nom`

// --- файл урока ------------------------------------------------------------
const T = 'TODO'
const screenStub = (i, role, toolName, kind, tag) => `  {
    role: '${role}',${toolName ? ` tool: '${toolName}',` : ''}${kind ? ` kind: '${kind}',` : ''}${tag ? ` tag: '${tag}',` : ''}
    eyebrow: L('${T}', '${T}', '${T}'),
    title: L('${T}', '${T}', '${T}'),
    audio: [
      A('${i === 0 ? 'mount' : 'mount'}', '${T} ko\\'prik', '${T} мост', '${T} bridge'),
    ],
    props: {},
  },`

const lesson = `// ============================================================================
// 8-sinf, Dars ${n}. ${topicRu.toUpperCase()}.
//
// Bu faylda FAQAT MA'LUMOT (ETALON_8SINF.md §13.2). Mexanika tools.jsx da,
// o'ram screens.jsx da, yadro core.jsx da.
// Raskadrovka: src/books/grade8/DARS${nn}_SKELET.md
// Reja: DARSLAR_REJASI_8SINF.md, ${n}-dars, master-fayl satri ${mfRow}, asbob ${tool}.
//
// TODO belgilari qolgan bo'lsa, dars TAYYOR EMAS:
//   node scripts/check-grade8.mjs src/components/grade8/Dars${nn}.jsx
// ============================================================================
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { L, Row } from './core.jsx'
import { A, W, makeLesson } from './screens.jsx'
import { F, ValueTable } from './tools.jsx'

export const META = {
  id: '${id}',
  n: ${n},
  row: ${mfRow},
  block: '${block}',
  topic: L('TODO uzbekcha', '${topicRu}', 'TODO english'),
  voice: 'm',
  total: 15,
}

// Bir-uchta tasdiq: 8-ekrandagi kartochka va 15-ekrandagi jamlanma.
export const STATEMENTS = [
  L('TODO', 'TODO', 'TODO'),
]

// Adashishlar §11 dan. З16 SHART: har darsda 12-ekran tuzoq bor.
export const MISS = {
  'З16': {
    what: L('javob son bilan tekshirilmadi', 'ответ не проверен числом', 'the answer was not checked with a number'),
    wrong: null,
    at: 0,
  },
}

// Rollar tartibi §13: 1 xuk · 2 tayanch · 3-7 tushuntirish (7 chegara) ·
// 8 qoida · 9-12 mashq · 13 ko'chirish · 14 blits · 15 yakun.
export const SCREENS = [
${screenStub(0, 'hook', 'substitute', null, null)}
${screenStub(1, 'support', 'chain', null, null)}
${screenStub(2, 'explain', 'fields', 'model', 'З16')}
${screenStub(3, 'explain', 'fields', 'divide', 'З16')}
${screenStub(4, 'explain', 'fields', 'odz', 'З16')}
${screenStub(5, 'explain', 'transform', 'selfstep', 'З16')}
${screenStub(6, 'explain', 'boundary', 'boundary', 'З16')}
${screenStub(7, 'rule', 'rule', null, 'З16')}
${screenStub(8, 'practice', 'chain', 'chain', 'З16')}
${screenStub(9, 'practice', 'fields', 'guided', 'З16')}
${screenStub(10, 'practice', 'solo', 'solo', 'З16')}
${screenStub(11, 'practice', 'audit', 'audit', 'З16')}
${screenStub(12, 'transfer', 'inverse', null, 'З16')}
${screenStub(13, 'blitz', 'blitz', null, null)}
${screenStub(14, 'summary', 'summary', null, null)}
]

export default makeLesson({ META, STATEMENTS, MISS, SCREENS })
`

// --- раскадровка -----------------------------------------------------------
const skelet = `# Урок ${n}. ${topicRu} — раскадровка

**Статус: ЧЕРНОВИК, ждёт утверждения методиста. Сборка не начата.**
Контракт: \`ETALON_8SINF.md\` — возрастной регистр §2.1, схема экранов §13,
данные §13.2, озвучка §13.3, приёмка §20.

План: урок ${n}, строка мастер-файла ${mfRow}, блок ${block}, прибор ${tool}.

## Что ученик делает руками

TODO: одно предложение. Если ответ «выбирает верный вариант» — экран переделывается.

## Заблуждения урока (§11)

| Код | Заблуждение | На каком экране | Чем опровергается |
|---|---|---|---|
| З16 | ответ не проверен числом | 12 | ловушка, контрпример вводит ученик |
| TODO | | | |

## Пятнадцать экранов

| № | Роль | Математика | Прибор | Что уходит в результат |
|---:|---|---|---|---|
| 1 | хук | TODO: две записи, обе похожи на верную | substitute | прогноз |
| 2 | опора | TODO: 2–3 задания | chain | ничего |
| 3 | объяснение, первая модель | TODO | fields | тег |
| 4 | объяснение, разграничение | TODO | fields | тег |
| 5 | объяснение, второе представление | TODO | fields | тег |
| 6 | объяснение, сам на новом случае | TODO | transform | тег |
| 7 | объяснение, ГРАНИЦА | TODO | boundary | тег |
| 8 | правило | TODO: формулировка словами учебника, параграф и страница | rule | тег |
| 9 | практика: цепочка | TODO | chain | тег |
| 10 | практика: направляемая | TODO | fields | тег |
| 11 | практика: САМ, БЕЗ ПРИБОРА | TODO | нет | тег |
| 12 | практика: ЛОВУШКА | TODO: 4 строки, первая неверная | audit | тег, З16 |
| 13 | перенос: обратная задача | TODO | inverse | тег |
| 14 | блиц | TODO: 4 вопроса о признаке | blitz | готовность словами |
| 15 | итог | прогноз против результата, готовность словами | summary | ничего |

## Синхронизация озвучки с открытием (§13.3)

Один шаг — одна мысль — один сегмент. Озвучен не каждый шаг: следствие
действия ученика голосом не сопровождается. Экраны 2–15 начинаются с
фразы-моста, на экран она не выводится.

| Экран | Сегмент | Событие | Озвучен |
|---:|---|---|---|
| 1 | mount | открытие | да |
| 1 | guess | позиция занята | да |
| 1 | sub1, sub2 | подстановка | да |
| 1 | ask | вопрос-вывод | да |

## Открытые вопросы

1. Параграф и страница учебника для карточки правила (§20 п. 12).
2. TODO
`

fs.writeFileSync(OUT, lesson, 'utf8')
fs.writeFileSync(SKELET, skelet, 'utf8')

// --- реестр ----------------------------------------------------------------
const reg = fs.readFileSync(REG, 'utf8')
if (!reg.includes(`Dars${nn}.jsx`)) {
  const entry = `  {
    slug: '${slug}',
    title: 'Dars ${n}. TODO uzbekcha nom',
    desc: "TODO: nima o'rganiladi. 15 ekran, UZ/RU/EN.",
    Component: lazy(() => import('../components/grade8/Dars${nn}.jsx')),
  },
`
  fs.writeFileSync(REG, reg.replace(/\n\]\n$/, '\n' + entry + ']\n'), 'utf8')
}

console.log(`\nурок ${n} — «${topicRu}»`)
console.log('  ' + path.relative(process.cwd(), OUT))
console.log('  ' + path.relative(process.cwd(), SKELET))
console.log('  запись в src/lessons/grade8.js')
console.log('\nПорядок дальше: раскадровка на утверждение -> математика в данные -> проверка:')
console.log(`  node scripts/check-grade8.mjs src/components/grade8/Dars${nn}.jsx\n`)
