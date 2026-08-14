// ============================================================================
// grade10-kontent-skelet.mjs — ПУСТОЙ ДОКУМЕНТ КОНТЕНТА СО ВСЕМИ КЛЮЧАМИ.
//
// ЗАЧЕМ. Документ контента на урок это ~220 строк, и структура у всех уроков
// одна: пятнадцать экранов, у каждой роли свой набор ключей. Переписывать эту
// структуру заново на каждый урок — работа без содержания, и именно в ней
// теряются ключи: в уроке 6 у одного экрана не оказалось `audio.mount`, а у
// другого не хватило кадра показа под вторую реплику, и то и другое всплыло
// только на сборке.
//
// Скрипт выдаёт каркас: заголовки экранов с ролью, способом ответа, форматом и
// тегом, обе таблицы и все обязательные ключи с пустыми ячейками. Автор
// заполняет ТОЛЬКО текст.
//
// ПРАВИЛО КАДРОВ. Кадров показа должно быть столько же, сколько реплик до
// `work`. Иначе работа откроется под ещё не сказанную реплику. В каркасе на
// каждом экране объяснения два кадра и две реплики до работы — менять можно,
// но парами.
//
// Запуск:
//   node scripts/grade10-kontent-skelet.mjs 11 > src/books/grade10/DARS11_KONTENT.md
//   node scripts/grade10-kontent-skelet.mjs 11 --tema "cos x = a"
// ============================================================================
const args = process.argv.slice(2)
const NO = Number(args.find((a) => !a.startsWith('--')))
const TEMA = (() => {
  const i = args.indexOf('--tema')
  return i === -1 ? 'ТЕМА' : args[i + 1]
})()

if (!NO) {
  console.log('надо: node scripts/grade10-kontent-skelet.mjs <номер> [--tema "тема"]')
  process.exit(1)
}

const T = (key, note = '') => `| \`${key.replace(/!$/, '')}\`${key.endsWith('!') ? ' [верно]' : ''} | ${note} |  |  |`
const F = (key, note = '') => `| \`${key.replace(/!$/, '')}\`${key.endsWith('!') ? ' [верно]' : ''} | ${note} |`
const head = 'Ключ | RU | UZ | EN'
const headF = 'Ключ | Значение'

const textTable = (rows) => ['**Текст**', '', `| ${head} |`, '|---|---|---|---|', ...rows, ''].join('\n')
const exprTable = (rows) => ['**Формулы**', '', `| ${headF} |`, '|---|---|', ...rows, ''].join('\n')

// Вопрос из четырёх: метка плюс разбор на каждый неверный вариант. Разбор
// указывает на ПРИЗНАК, а не даёт ответ (эталон §6).
const q4 = (q) => [
  T(`${q}.prompt`),
  T(`${q}.a!`),
  T(`${q}.b`), T(`${q}.b.hint`),
  T(`${q}.c`), T(`${q}.c.hint`),
  T(`${q}.d`), T(`${q}.d.hint`),
]

const explain = (n, tag, move, num) => [
  `## Экран ${n} · \`explain${n - 2}\` · ответ \`${num ? 'number' : 'lead'}\` · тег \`${tag}\``,
  '',
  textTable([
    T('eyebrow', 'ОБЪЯСНЕНИЕ'), T('title'),
    T('show.1.1'), T('show.1.2'), T('show.2.1'), T('show.2.2'),
    T('audio.mount'), T(`audio.${move}*`), T('audio.work'),
    T('work.prompt'), T('work.ok'),
    T('work.hint.1'), T('work.hint.2'), T('work.hint.3'),
  ]),
  exprTable(num ? [F('work.answer')] : []),
  '---',
  '',
].join('\n')

const out = []
out.push(`# Урок ${NO} — ${TEMA} · КОНТЕНТ (этап 2)`, '')
out.push('**Читается и правится методистом.** Формат тот же, что в `DARS08_KONTENT.md`: на экран')
out.push('две таблицы — «Текст» (ключ, RU, UZ, EN) и «Формулы» (ключ, значение). Звёздочка после')
out.push('имени реплики означает, что во время неё на экране движется.', '')
out.push('**В формулах не должно быть слов ни одного языка:** значение одно на три языка.', '')
out.push('**В озвучке и в разборах нет символов:** дроби и знаки словами.', '')
out.push(`Скелет: \`DARS..._SKELET.md\`. Опора в учебнике: алгебра 2022, стр. ...`, '')
out.push('---', '')

// 1. Хук
out.push('## Экран 1 · `hook` · ответ `pick4` · тега нет', '')
out.push(textTable([
  T('eyebrow'), T('title'),
  T('row.a.name'), T('row.b.name'),
  T('probe.question'),
  T('probe.a'), T('probe.b!'),
  T('probe.both'), T('probe.none'), T('probe.after'),
  T('audio.mount*'), T('audio.r1'), T('audio.r2'), T('audio.ask'),
]))
out.push(exprTable([F('expr'), F('row.a.value'), F('row.b.value')]))
out.push('---', '')

// 2. Опора
out.push('## Экран 2 · `support` · ответ `pick4` · тег `support`', '')
out.push(textTable([T('eyebrow', 'ОПОРА'), T('title'), ...q4('q1'), ...q4('q2'), ...q4('q3'), T('audio.mount')]))
out.push(exprTable([F('q1.done'), F('q2.done'), F('q3.done')]))
out.push('---', '')

// 3–7. Объяснение. Последние два обычно с числом.
out.push(explain(3, 'ТЕГ', 'move'))
out.push(explain(4, 'ТЕГ', 'move'))
out.push(explain(5, 'ТЕГ', 'move'))
out.push(explain(6, 'ТЕГ', 'move', true))
out.push(explain(7, 'ТЕГ', 'move', true))

// 8. Правило
out.push('## Экран 8 · `rule` · ответ `pick2` · тег `ТЕГ`', '')
out.push(textTable([
  T('eyebrow', 'ПРАВИЛО'), T('title'),
  T('probe.question'), T('probe.a!'), T('probe.b'), T('probe.b.hint'),
  T('rule.lawLabel'), T('rule.lines.1'), T('rule.lines.2'), T('rule.lines.3'),
  T('audio.mount'), T('audio.rule*'),
]))
out.push(exprTable([F('rule.law')]))
out.push('---', '')

// 9. Соответствие
out.push('## Экран 9 · `drill` · ответ `match` · формат `match` · тег `ТЕГ`', '')
out.push(textTable([T('eyebrow', 'ПРАКТИКА'), T('title'), T('match.prompt'), T('match.ok'), T('audio.mount')]))
out.push(exprTable([F('match.left', '`…` · `…` · `…` · `…`'), F('match.a'), F('match.b'), F('match.c'), F('match.d')]))
out.push('---', '')

// 10. Порядок
out.push('## Экран 10 · `guided` · ответ `order` · формат `order-steps` · тег `ТЕГ`', '')
out.push(textTable([
  T('eyebrow', 'ПРАКТИКА'), T('title'), T('order.prompt'),
  T('order.s1'), T('order.s2'), T('order.s3'), T('order.s4'),
  T('order.ok'), T('order.bad'), T('audio.mount'),
]))
out.push(exprTable([F('order.mark')]))
out.push('---', '')

// 11. Без прибора
out.push('## Экран 11 · `paper` · ответ `number` · формат `number+order` · без прибора · тег `bumaga`', '')
out.push(textTable([
  T('eyebrow', 'БЕЗ ПРИБОРА'), T('title'),
  T('task.ok'), T('task.hint.1'), T('task.hint.2'), T('task.hint.3'),
  T('order.prompt'), T('order.title'), T('order.ok'), T('order.bad'),
  T('audio.mount'), T('audio.next'),
]))
out.push(exprTable([F('task.prompt'), F('task.answer'), F('order.items', '`…` · `…` · `…` · `…`'), F('order.answer')]))
out.push('---', '')

// 12. Ловушка
out.push('## Экран 12 · `trap` · ответ `number` · формат `audit` · тег `check`', '')
out.push(textTable([
  T('eyebrow', 'ЛОВУШКА'), T('title'),
  T('hint.r1'), T('hint.r2'), T('hint.r4'), T('proof'),
  T('entry.prompt'), T('entry.ok'), T('entry.hint.1'), T('entry.hint.2'), T('entry.hint.3'),
  T('audio.mount'), T('audio.next'),
]))
out.push(exprTable([F('row.r1'), F('row.r2'), F('row.r3'), F('row.r4'), F('answerId', '`r3`'), F('entry.answer')]))
out.push('---', '')

// 13. Перенос
out.push('## Экран 13 · `transfer` · ответ `lead` · формат `place+multi` · тег `obratnoe`', '')
out.push(textTable([
  T('eyebrow', 'ПЕРЕНОС'), T('title'),
  T('place.prompt'), T('place.ok'), T('place.wrong'),
  T('multi.prompt'), T('multi.title'), T('multi.d.hint'), T('multi.e.hint'), T('multi.ok'),
  T('audio.mount'), T('audio.work'),
]))
out.push(exprTable([
  F('place.target'), F('place.step'),
  F('multi.a!'), F('multi.b!'), F('multi.c!'),
  F('multi.d'), F('multi.e'),
]))
out.push('---', '')

// 14. Блиц
out.push('## Экран 14 · `blitz` · ответ `mixed` · формат `chain` · тег `ТЕГ`', '')
out.push(textTable([T('eyebrow', 'БЛИЦ'), T('title'), ...q4('q1'), ...q4('q2'), ...q4('q3'), ...q4('q4'), T('audio.mount')]))
out.push(exprTable([F('q1.done'), F('q2.done'), F('q3.done'), F('q4.done'), F('angles', '`…` · `…` · `…` · `…`')]))
out.push('---', '')

// 15. Итог
out.push('## Экран 15 · `summary` · ответ `none` · тега нет', '')
out.push(textTable([
  T('eyebrow', 'ИТОГ'), T('title'),
  T('can.1'), T('can.2'), T('can.3'), T('can.4'),
  T('levels.full'), T('levels.gap'), T('levels.back'),
  T('bridge'), T('lifehack'), T('sheetTitle'), T('sheetSrc'),
  T('audio.mount'), T('audio.next'),
]))
out.push(exprTable([
  F('hook.a', 'КОРОТКО'), F('hook.b', 'КОРОТКО'), F('proved'), F('law'),
  F('sheet.1'), F('sheet.2'), F('sheet.3'), F('sheet.4'), F('sheet.5'),
]))

console.log(out.join('\n'))
