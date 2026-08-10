// build-grade3-practice-lms.mjs — собирает практику 3 класса в САМОДОСТАТОЧНЫЕ файлы для LMS.
//
// КОНТРАКТ ПЛАТФОРМЫ: в LMS грузится ОТДЕЛЬНЫЙ ФАЙЛ НА КАЖДОЕ ЗАДАНИЕ (jsx-question).
// Кнопку «Проверить» рисует сама платформа и передаёт компоненту пропсы `lang`, `mode`,
// `initialAnswer`, `onReady`, `registerCheck`, `onSubmit`, `playCorrect`, `playWrong`.
// Поэтому из урока выходит не один файл, а десять: dars05 -> D05_01 … D05_10.
// `PracticeHost` в LMS НЕ едет: он только для локального превью, где host платформы
// приходится изображать самим (со своей кнопкой «Проверить»).
//
// ЗАЧЕМ СБОРЩИК. В исходнике файл задания — три строки:
//     import { createPracticeQuestion } from '../QuestionFactory.jsx';
//     import { DARS05_BANK } from '../banks/dars05.js';
//     export default createPracticeQuestion(DARS05_BANK.items[0]);
// Фабрика тянет `../LessonNumPad` и `./artKit.jsx`, банк тянет `./_helpers.js` — пять
// чужих файлов на одно задание. LMS локальные импорты не поднимает: именно отсюда
// «Модуль не найден», на котором споткнулся 6 класс. Сборщик вшивает движок и данные
// задания внутрь файла, оставляя единственный импорт — react.
//
// ПРОВЕРКИ ПЕРЕД ЗАПИСЬЮ (файл не выйдет, если хоть одна не прошла):
//   1. остался ровно один импорт — `react`, и он ИМЕНОВАННЫЙ (`import React, {…}`):
//      LMS компилирует JSX в классическом режиме, без имени React задание падает
//      с «React is not defined», а локальное превью этого не показывает;
//   2. нет ни одной ссылки на соседний файл (`./` или `../`);
//   3. ровно один `export default`, других экспортов нет;
//   4. файл разбирается парсером, и в нём нет повторных объявлений одного имени;
//   5. данные задания совпадают с банком после сериализации (ничего не потерялось);
//   6. с флагом `--render` каждый файл КОМПИЛИРУЕТСЯ КЛАССИЧЕСКИ и рендерится в строку —
//      так же, как это делает платформа. Плагин react при этом не подключается специально:
//      он поставил бы автоматический runtime и спрятал ровно ту ошибку, ради которой
//      проверка написана (на ней падал 6 класс).
//
// Запуск (из корня репозитория):
//   node src/components/grade3/practice/build-grade3-practice-lms.mjs [5 17 …] [--render]
// Без номеров — все 51 урок. Результат: lms-grade3-practice-standalone/darsNN/DNN_MM.jsx
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const espree = require('espree');

const HERE = path.dirname(fileURLToPath(import.meta.url));
const GRADE3 = path.resolve(HERE, '..');
const OUT = path.resolve('lms-grade3-practice-standalone');

const read = (p) => fs.readFileSync(p, 'utf8').split('\r').join('');
const asked = process.argv.slice(2).map(Number).filter(Boolean);
const lessons = asked.length ? asked : Array.from({ length: 51 }, (_, i) => i + 1);
const wantRender = process.argv.includes('--render');

// Хуки перечисляются ИМЕНОВАННО: платформа компилирует классически, `React.useState`
// без имени React не соберётся.
const REACT_IMPORT = "import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';\n";

// --- тела модулей без синтаксиса модулей -------------------------------------------------

const stripModule = (src) => src
  .replace(/^import[^\n]*\n/gm, '')
  .replace(/^export default function /gm, 'function ')
  .replace(/^export function /gm, 'function ')
  .replace(/^export const /gm, 'const ');

const artBody = stripModule(read(path.join(HERE, 'artKit.jsx')));
// COLORS есть и в клавиатуре, и в фабрике — имя клавиатуры переименовывается.
const padBody = stripModule(read(path.join(GRADE3, 'LessonNumPad.jsx')))
  .replace(/\bCOLORS\b/g, 'NUMPAD_COLORS');
const factoryBody = stripModule(read(path.join(HERE, 'QuestionFactory.jsx')));

// --- сериализация задания ----------------------------------------------------------------

// JSON теряет `undefined` внутри массивов (в `wrongBy` он означает «у верного варианта
// разбора нет»), поэтому объект печатается своим обходом.
function literal(value, indent = '  ') {
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (typeof value === 'string') return JSON.stringify(value);
  const next = indent + '  ';
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    return `[\n${value.map((v) => next + literal(v, next)).join(',\n')},\n${indent}]`;
  }
  const keys = Object.keys(value);
  if (keys.length === 0) return '{}';
  const body = keys
    .map((k) => `${next}${/^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k)}: ${literal(value[k], next)}`)
    .join(',\n');
  return `{\n${body},\n${indent}}`;
}

// --- проверки --------------------------------------------------------------------------

function topLevelNames(src) {
  const ast = espree.parse(src, { ecmaVersion: 2022, sourceType: 'module', jsx: true, ecmaFeatures: { jsx: true } });
  const out = [];
  for (const node of ast.body) {
    if (node.type === 'VariableDeclaration') node.declarations.forEach((d) => d.id.name && out.push(d.id.name));
    else if (node.type === 'FunctionDeclaration' || node.type === 'ClassDeclaration') out.push(node.id.name);
  }
  return out;
}

function verify(file, src) {
  const problems = [];
  const imports = src.match(/^import[^\n]*$/gm) || [];
  if (imports.length !== 1) problems.push(`импортов ${imports.length}, а должен быть один — react`);
  else if (!/^import React, \{[^}]+\} from 'react';$/.test(imports[0])) problems.push('импорт react не именованный');
  if (/from\s+'\.{1,2}\//.test(src)) problems.push('осталась ссылка на соседний файл');
  const defaults = src.match(/^export default /gm) || [];
  if (defaults.length !== 1) problems.push(`export default ${defaults.length}, а должен быть один`);
  if (/^export (?!default)/m.test(src)) problems.push('есть лишний экспорт');
  let names = [];
  try {
    names = topLevelNames(src);
  } catch (e) {
    problems.push(`не разбирается: ${e.message}`);
  }
  const seen = new Set();
  const dup = names.filter((n) => (seen.has(n) ? true : (seen.add(n), false)));
  if (dup.length) problems.push(`повторные объявления: ${[...new Set(dup)].join(', ')}`);
  return problems.map((p) => `${file}: ${p}`);
}

// --- сборка ------------------------------------------------------------------------------

fs.mkdirSync(OUT, { recursive: true });
const errors = [];
let written = 0;

for (const lesson of lessons) {
  const nn = String(lesson).padStart(2, '0');
  const bankPath = path.join(HERE, 'banks', `dars${nn}.js`);
  if (!fs.existsSync(bankPath)) continue;
  const mod = await import(`file:///${bankPath.split(path.sep).join('/')}`);
  const bank = mod.default || Object.values(mod)[0];
  const dir = path.join(OUT, `dars${nn}`);
  fs.mkdirSync(dir, { recursive: true });

  bank.items.forEach((item, index) => {
    const file = `D${nn}_${String(index + 1).padStart(2, '0')}.jsx`;
    const spec = literal(item);
    const bundle = [
      `// ${bank.title} · topshiriq ${item.id} — LMS uchun avtonom fayl.`,
      '// Yig\'uvchi: src/components/grade3/practice/build-grade3-practice-lms.mjs',
      '// QO\'LDA TAHRIRLANMAYDI: manba — practice/banks/dars' + nn + '.js',
      '',
      REACT_IMPORT.trim(),
      '',
      artBody.trim(),
      '',
      padBody.trim(),
      '',
      factoryBody.trim(),
      '',
      `const SPEC = ${spec};`,
      '',
      'export default createPracticeQuestion(SPEC);',
      '',
    ].join('\n');

    const problems = verify(file, bundle);
    // пятая проверка: данные не потерялись при печати
    if (JSON.stringify(item) !== JSON.stringify(eval(`(${spec})`))) {
      problems.push(`${file}: данные задания разошлись с банком`);
    }
    if (problems.length) {
      errors.push(...problems);
      return;
    }
    fs.writeFileSync(path.join(dir, file), bundle, 'utf8');
    written += 1;
  });
}

console.log(`собрано файлов: ${written}`);
if (errors.length) {
  console.log(`\nне собрано: ${errors.length}`);
  errors.slice(0, 20).forEach((e) => console.log('  ' + e));
  process.exit(1);
}
console.log(`готово: ${OUT}`);

// --- проверка платформой: классический JSX и рендер в строку ------------------------------

if (wantRender) {
  const { build } = await import('vite');
  const { createElement } = await import('react');
  const { renderToString } = await import('react-dom/server');
  const EXTERNAL = new Set(['react', 'react-dom', 'react/jsx-runtime', 'react-dom/client', 'react-dom/server']);
  const TMP = path.resolve('.tmp-lms-practice-check');
  fs.mkdirSync(TMP, { recursive: true });
  let bad = 0;
  let checked = 0;

  for (const lesson of lessons) {
    const nn = String(lesson).padStart(2, '0');
    const dir = path.join(OUT, `dars${nn}`);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.jsx')).sort()) {
      try {
        const res = await build({
          configFile: false, root: dir, logLevel: 'error',
          esbuild: { jsx: 'transform', jsxFactory: 'React.createElement', jsxFragment: 'React.Fragment' },
          oxc: { jsx: { runtime: 'classic' } },
          build: {
            write: false, minify: false, sourcemap: false, target: 'es2020', reportCompressedSize: false,
            lib: { entry: path.join(dir, file), formats: ['es'], fileName: () => file.replace('.jsx', '') },
            rollupOptions: { external: (id) => EXTERNAL.has(id) },
          },
        });
        const outputs = Array.isArray(res) ? res.flatMap((r) => r.output ?? []) : res?.output ?? [];
        const chunk = outputs.find((o) => o.type === 'chunk' && o.isEntry);
        if (!chunk) throw new Error('сборка не дала результата');
        const out = path.join(TMP, file.replace('.jsx', '.mjs'));
        fs.writeFileSync(out, chunk.code, 'utf8');
        const mod = await import(pathToFileURL(out).href + `?t=${nn}${file}`);
        if (typeof mod.default !== 'function') throw new Error('нет экспортируемого компонента');
        const html = renderToString(createElement(mod.default, {
          lang: 'uz', mode: 'answer', onReady: () => {}, registerCheck: () => {}, onSubmit: () => {},
          playCorrect: () => {}, playWrong: () => {},
        }));
        if (!html || html.length < 400) throw new Error(`пустой рендер (${html.length} символов)`);
        checked += 1;
      } catch (e) {
        console.log(`  ${file}: ОШИБКА — ${String(e.message).slice(0, 160)}`);
        bad += 1;
      }
    }
  }
  fs.rmSync(TMP, { recursive: true, force: true });
  console.log(bad ? `\nне прошли проверку платформы: ${bad}` : `\nпроверку платформы прошли все ${checked} файлов`);
  if (bad) process.exit(1);
}
