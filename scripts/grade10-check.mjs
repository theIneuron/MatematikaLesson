// ============================================================================
// grade10-check.mjs — ВСЕ ПРОВЕРКИ УРОКА ОДНОЙ КОМАНДОЙ.
//
// ЗАЧЕМ. Проверок пять, и порядок между ними неочевидный: сервер на 5210 это
// `vite preview`, то есть он отдаёт СОБРАННЫЙ бандл. Правка урока без
// `npm run build` в проверку не попадает, и 2026-08-14 я дважды «чинил» одно и
// то же место, получая тот же список нарушений. Плюс два прогона браузера
// одновременно душат друг друга: цикл по шести урокам вставал на четвёртом.
//
// Здесь порядок зашит: сборка → контракт → проход руками → вёрстка → озвучка,
// строго по одному. Первая же упавшая проверка останавливает остальные: чинить
// надо её, а не читать три следующих отчёта про то же самое.
//
// Запуск:
//   node scripts/grade10-check.mjs dars11
//   node scripts/grade10-check.mjs dars11 --skip-build     (сборка уже была)
//   node scripts/grade10-check.mjs dars11 --fast           (без озвучки)
// ============================================================================
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'

const args = process.argv.slice(2)
const LESSON = args.find((a) => !a.startsWith('--'))
const SKIP_BUILD = args.includes('--skip-build')
const FAST = args.includes('--fast')

if (!LESSON) {
  console.log('надо: node scripts/grade10-check.mjs dars11 [--skip-build] [--fast]')
  process.exit(1)
}

// Слаг берётся ИЗ РЕЕСТРА, а не из второго списка: иначе появляется третье
// место, где живёт одно и то же имя, и оно разъезжается.
const registry = fs.readFileSync('src/lessons/grade10.js', 'utf8')
const no = LESSON.replace(/^dars/, '')
const slug = (registry.match(new RegExp(`slug: '(dars${no}-[a-z0-9-]+)'`)) || [])[1]
if (!slug) {
  console.log(`в src/lessons/grade10.js нет урока ${LESSON}`)
  process.exit(1)
}
const file = `src/components/grade10/Dars${no}.jsx`

const run = (title, cmd, cmdArgs, env) => {
  process.stdout.write(`\n### ${title}\n`)
  const r = spawnSync(cmd, cmdArgs, {
    stdio: 'pipe',
    encoding: 'utf8',
    shell: process.platform === 'win32',
    env: { ...process.env, ...(env || {}) },
  })
  const out = (r.stdout || '') + (r.stderr || '')
  // Печатаем ХВОСТ: у прохода руками полезное в конце, а полный вывод в
  // пятнадцать экранов на четырёх размерах читать не надо.
  const lines = out.trim().split('\n')
  console.log(lines.slice(-14).join('\n'))
  if (r.status !== 0) console.log(`  [код возврата ${r.status}${r.error ? ', ' + r.error.message : ''}]`)
  // Судим ТОЛЬКО по коду возврата: каждая проверка сама ставит его в единицу,
  // когда нашла нарушение. Первая редакция искала ещё и слова в выводе, и
  // слово «OBREZKA» из построчного отчёта роняло шаг, который прошёл.
  return r.status === 0
}

const steps = []
if (!SKIP_BUILD) steps.push(['сборка', 'npm', ['run', 'build']])
steps.push(['контракт эталона', 'node', ['scripts/grade10-lesson-audit.mjs', file]])
steps.push(['проход руками', 'node', ['scripts/grade10-hand.mjs', LESSON]])
steps.push([
  'вёрстка (2 размера, 3 языка)', 'node', ['scripts/grade10-noscroll.mjs', slug],
  { GRADE10_ONLY: '1366x615,393x660' },
])
if (!FAST) steps.push(['озвучка', 'node', ['scripts/grade10-tts-check.mjs', LESSON]])

console.log(`Урок ${LESSON}  ·  ${slug}  ·  ${file}`)
// Пауза после сборки. `vite preview` отдаёт файлы из `dist`, а сборка их
// перезаписывает: если браузер зайдёт в этот момент, страница окажется пустой
// и проверка скажет «экрана нет» вместо настоящей причины.
const settle = (ms) => spawnSync(process.execPath, ['-e', `setTimeout(()=>{}, ${ms})`])
for (const [title, cmd, cmdArgs, env] of steps) {
  if (title === 'контракт эталона') settle(2500)
  if (!run(title, cmd, cmdArgs, env)) {
    console.log(`\nОСТАНОВЛЕНО на шаге «${title}». Остальные проверки не запускались.`)
    process.exit(1)
  }
}
console.log('\nВСЕ ПРОВЕРКИ ЗЕЛЁНЫЕ.')
