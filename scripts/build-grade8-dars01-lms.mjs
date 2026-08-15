// build-grade8-dars01-lms.mjs — собирает из урока 8 класса САМОДОСТАТОЧНЫЙ .jsx для LMS.
//
// Зачем: урок написан модульно (движок в `core.jsx`, дизайн-слой в `labkit.jsx`),
// а в LMS нужен ОДИН файл, который ни на что не ссылается. Тот же приём, что в
// scripts/build-grade3-lms.mjs и build-grade6-lms.mjs.
//
// Из `core.jsx` вшивается только ДВИЖОК (три языка, озвучка v5.2, мобильный zoom).
// UI-примитивы core НЕ берутся: у них те же имена, что в `labkit.jsx` (`Frac`),
// и сборка упала бы на повторном объявлении.
//
// Проверки перед записью (файл не выйдет, если хоть одна не прошла):
//   1. ровно один импорт — `react`, и он ИМЕНОВАННЫЙ (`import React, {…}`):
//      LMS компилирует JSX в классическом режиме, без имени React урок падает
//      с «React is not defined», а локальное превью этого не показывает;
//   2. нет ни одной ссылки на соседний файл (`./` или `../`);
//   3. ровно один `export default`, других экспортов нет;
//   4. файл разбирается парсером, повторных объявлений нет;
//   5. дымовая проверка в браузере: файл собирается esbuild, монтируется,
//      15 экранов на месте, первые цепочки проходятся, консоль чистая.
//
// Запуск: node scripts/build-grade8-dars01-lms.mjs [--no-smoke]
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { spawnSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'

const require = createRequire(import.meta.url)
const espree = require('espree')

const DIR = path.resolve('src/components/grade8')
// Собранный файл лежит рядом с уроками класса (перенесён из корня 2026-08-12).
const OUT = path.resolve('src/components/grade8/lms-grade8-standalone')
const TMP = path.resolve('.tmp/g8-lms-smoke')
const LESSON = 'Dars01v2.jsx'
const read = (p) => fs.readFileSync(p, 'utf8').split('\r').join('')
const noSmoke = process.argv.includes('--no-smoke')

// Из core.jsx берём ИМЕННО ЭТИ объявления, по порядку. Список закрытый:
// если в core.jsx что-то переименуют, сборка скажет об этом, а не молча
// соберёт урок без движка.
const CORE_PARTS = [
  'L', 'tr', 'LangContext', 'LangProvider', 'useLang', 'useT',
  'cfg', 'configureLesson',
  'LANG_TAG', 'LEAD_TAG_RE', 'withLangTag', 'lessonMetaQuery',
  'buildTtsUrl', 'locale',
  'AudioEngine', 'engine', 'getAudioEngine', 'useAudio',
  'MOBILE_W', 'useMobileZoom',
]

const parse = (src) => espree.parse(src, {
  ecmaVersion: 2022,
  sourceType: 'module',
  ecmaFeatures: { jsx: true },
})

// Верхнеуровневые объявления файла: имя -> исходный текст (с `export` снятым).
function declarations(src) {
  const ast = parse(src)
  const map = new Map()
  for (const node of ast.body) {
    let target = node
    let start = node.start
    if (node.type === 'ExportNamedDeclaration' && node.declaration) {
      target = node.declaration
      start = target.start
    }
    const text = src.slice(start, target.end)
    if (target.type === 'VariableDeclaration') {
      target.declarations.forEach((d) => { if (d.id.name) map.set(d.id.name, text) })
    } else if (target.type === 'FunctionDeclaration' || target.type === 'ClassDeclaration') {
      map.set(target.id.name, text)
    }
  }
  return map
}

const coreSrc = read(path.join(DIR, 'core.jsx'))
const coreDecl = declarations(coreSrc)
const missing = CORE_PARTS.filter((n) => !coreDecl.has(n))
if (missing.length) {
  console.log(`НЕ СОБРАН: в core.jsx нет объявлений: ${missing.join(', ')}`)
  process.exit(1)
}
const coreBody = CORE_PARTS.map((n) => coreDecl.get(n)).join('\n\n')

// labkit и урок: снимаем импорты и слово `export` (кроме `export default`).
const strip = (src) => src
  .replace(/^\/\/ eslint-disable-next-line no-unused-vars\n/m, '')
  .replace(/^import React[^\n]*\n/m, '')
  .replace(/^import \{[\s\S]*?\} from '\.\/[^']+'\n/gm, '')
  .replace(/^export const /gm, 'const ')
  .replace(/^export function /gm, 'function ')

const kitBody = strip(read(path.join(DIR, 'labkit.jsx')))
const lessonBody = strip(read(path.join(DIR, LESSON)))

const HEADER = `import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

// ВНИМАНИЕ: файл собран автоматически (scripts/build-grade8-dars01-lms.mjs) из
// src/components/grade8/{core.jsx, labkit.jsx, ${LESSON}}. Править нужно ИСХОДНИК,
// а не этот файл: при следующей сборке правки здесь пропадут.
//
// 8 класс, урок 1. Рациональные выражения и рациональные дроби. 15 экранов,
// UZ/RU/EN, озвучка по контракту v5.2. Props: { lang, ttsApiBase, studentName,
// onFinished }.
`

const bundle = `${HEADER}\n${coreBody}\n\n${kitBody}\n${lessonBody}`

// ---- проверки ----
const problems = []
const imports = bundle.match(/^import [^\n]*/gm) || []
if (imports.length !== 1) problems.push(`импортов ${imports.length}, а должен быть один`)
if (!/^import React,\s*\{/.test(imports[0] || '')) problems.push('React импортирован не по имени (LMS: классический режим)')
if (/from ['"]\.{1,2}\//.test(bundle)) problems.push('осталась ссылка на соседний файл')
const exports = bundle.match(/^export /gm) || []
if (exports.length !== 1 || !/^export default/m.test(bundle)) problems.push(`экспортов ${exports.length}, нужен один export default`)
let decl = []
try {
  decl = [...declarations(bundle).keys()]
  // повторные объявления парсер не ловит: считаем сами, по всем узлам
  const ast = parse(bundle)
  const names = []
  for (const node of ast.body) {
    const target = node.type === 'ExportDefaultDeclaration' ? node.declaration : node
    if (target.type === 'VariableDeclaration') target.declarations.forEach((d) => d.id.name && names.push(d.id.name))
    else if (target.type === 'FunctionDeclaration' || target.type === 'ClassDeclaration') names.push(target.id && target.id.name)
  }
  const dup = names.filter((n, i) => n && names.indexOf(n) !== i)
  if (dup.length) problems.push(`повторные объявления: ${[...new Set(dup)].join(', ')}`)
} catch (e) {
  problems.push(`не разбирается: ${e.message}`)
}
if (!decl.length) problems.push('в файле нет объявлений')

if (problems.length) {
  console.log(`${LESSON}: НЕ СОБРАН — ${problems.join('; ')}`)
  process.exit(1)
}

fs.mkdirSync(OUT, { recursive: true })
const outFile = path.join(OUT, LESSON)
fs.writeFileSync(outFile, bundle, 'utf8')

const README = `# 8-sinf, 1-dars — LMS uchun avtonom fayl

\`${LESSON}\` — bitta fayl, tashqi havolasi YO'Q: import faqat \`react\`, eksport
faqat \`export default\`. LMS xom JSX ni klassik rejimda yuklaydi, shuning uchun
React NOM bilan import qilingan.

Props: \`lang\` (\`uz\` | \`ru\` | \`en\`), \`ttsApiBase\`, \`studentName\`, \`onFinished\`.
Ovoz: HTTP TTS v5.2 (\`{base}/api/tts?text=...&g=m\`). \`ttsApiBase\` berilmasa
brauzer Web Speech zaxirasi ishlaydi (faqat previu uchun).

Fayl QO'LDA tahrirlanmaydi. Manba:
\`src/components/grade8/{core.jsx, labkit.jsx, ${LESSON}}\`.
Qayta yig'ish: \`node scripts/build-grade8-dars01-lms.mjs\`.
`
fs.writeFileSync(path.join(OUT, 'README.md'), README, 'utf8')

const kb = Math.round(bundle.length / 1024)
console.log(`${LESSON}: ${bundle.split('\n').length} строк, ${kb} КБ — импорт только react, ссылок наружу нет`)

// ---- дымовая проверка в браузере ----
if (noSmoke) {
  console.log(`готово: ${OUT} (дымовая проверка пропущена)`)
  process.exit(0)
}

fs.mkdirSync(TMP, { recursive: true })
const entry = path.join(TMP, 'entry.jsx')
fs.writeFileSync(entry, `import React from 'react'
import { createRoot } from 'react-dom/client'
import Lesson from ${JSON.stringify(outFile.split(path.sep).join('/'))}
createRoot(document.getElementById('root')).render(<Lesson lang="ru" />)
`, 'utf8')
fs.writeFileSync(path.join(TMP, 'index.html'), `<!doctype html><meta charset="utf-8">
<style>html,body{margin:0;height:100%}</style><div id="root"></div><script src="./app.js"></script>`, 'utf8')

const esb = spawnSync([
  'npx esbuild', JSON.stringify(entry),
  '--bundle', '--format=iife', '--loader:.jsx=jsx', '--jsx=automatic',
  '--define:process.env.NODE_ENV=\\"production\\"',
  '--outfile=' + JSON.stringify(path.join(TMP, 'app.js')),
].join(' '), { stdio: 'inherit', shell: true })
if (esb.status !== 0) {
  console.log('дымовая проверка: esbuild не собрал файл')
  process.exit(1)
}

const { chromium } = await import('playwright')
const browser = await chromium.launch({ headless: true, args: ['--disable-gpu'] })
const page = await browser.newPage({ viewport: { width: 1366, height: 768 } })
const errors = []
page.on('pageerror', (e) => errors.push(String(e.message)))
page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()) })
await page.goto(pathToFileURL(path.join(TMP, 'index.html')).href, { waitUntil: 'domcontentloaded' })

const smoke = []
try {
  await page.waitForSelector('.g8l-screen.is-active', { timeout: 15000 })
  const screens = await page.locator('.g8l-screen').count()
  if (screens !== 15) smoke.push(`экранов ${screens}, нужно 15`)
  // экран 1: клавиатурой, как ученик без мыши
  await page.locator('.d1-val').nth(2).focus()
  await page.keyboard.press('Enter')
  await page.waitForTimeout(900)
  if (await page.locator('.d1-result.is-bad').count() !== 1) smoke.push('экран 1: запрет не показан')
  if (await page.locator('.g8l-nav.is-primary').isDisabled()) smoke.push('экран 1: «Далее» не открылась')
  await page.locator('.g8l-nav.is-primary').click()
  await page.waitForTimeout(700)
  // экран 2: замок
  await page.locator('.g8l-screen.is-active .g8l-lock').nth(2).click({ force: true })
  await page.waitForTimeout(200)
  if (await page.locator('.g8l-screen.is-active .g8l-lock.is-done').count() !== 0) smoke.push('экран 2: замок открылся не по порядку')
  for (let i = 0; i < 4; i += 1) {
    await page.locator('.g8l-screen.is-active .g8l-lock').nth(i).click()
    await page.waitForTimeout(240)
  }
  if (await page.locator('.d2-concl').count() !== 1) smoke.push('экран 2: вывод не появился')
  await page.screenshot({ path: path.join(TMP, 'smoke.png') })
} catch (e) {
  smoke.push(`дымовая проверка сорвалась: ${e.message}`)
}
if (errors.length) smoke.push(`консоль: ${errors.slice(0, 3).join(' | ')}`)
await browser.close()

if (smoke.length) {
  console.log(`ДЫМОВАЯ ПРОВЕРКА НЕ ПРОШЛА:\n  - ${smoke.join('\n  - ')}`)
  process.exit(1)
}
console.log('дымовая проверка: 15 экранов, клавиатура, замки, консоль — чисто')
console.log(`готово: ${OUT}`)
