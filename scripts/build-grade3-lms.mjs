// build-grade3-lms.mjs — собирает из урока 3 класса САМОДОСТАТОЧНЫЙ файл для LMS.
//
// Зачем: уроки пишутся модульно (общий движок в `_kit/`), а в LMS нужен один файл на урок,
// который ни на что не ссылается. Сборщик вшивает кит внутрь урока и проверяет результат.
//
// Проверки перед записью (файл не выйдет, если хоть одна не прошла):
//   1. в файле остался ровно один импорт — `react`, и он ИМЕНОВАННЫЙ (`import React, {…}`):
//      LMS компилирует JSX в классическом режиме, без имени React урок падает с
//      «React is not defined», а локальное превью этого не показывает;
//   2. нет ни одной ссылки на соседний файл (`./` или `../`);
//   3. ровно один `export default`, других экспортов нет;
//   4. файл разбирается парсером и в нём нет повторных объявлений одного имени.
//
// Запуск: node scripts/build-grade3-lms.mjs [Dars17.jsx …]   (без аргументов — все уроки)
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const espree = require('espree');

const DIR = path.resolve('src/components/grade3');
const KIT = path.join(DIR, '_kit');
// Куда складывать. По умолчанию — рабочая папка класса; --out=<папка> пишет в другую,
// чтобы не затирать уже отданные в LMS файлы (они не под git, восстановить их нечем).
const outArg = process.argv.find((a) => a.startsWith('--out='));
const OUT = path.resolve(outArg ? outArg.slice('--out='.length) : 'src/components/grade3/lms-grade3-standalone');
const read = (p) => fs.readFileSync(p, 'utf8').split('\r').join('');
const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const lessons = args.length ? args : fs.readdirSync(DIR).filter((f) => /^Dars\d+\.jsx$/.test(f)).sort();

// кит без строки импорта и без списка экспортов — только объявления
const kitRaw = read(path.join(KIT, 'index.jsx'));
const kitBody = kitRaw
  .replace(/^import React[^\n]*\n/m, '')
  .replace(/export \{[\s\S]*?\};\s*$/m, '')
  .replace(/^export const /gm, 'const ');
const stylesBody = read(path.join(KIT, 'styles.js')).replace(/^export const /gm, 'const ');

const REACT_IMPORT = "import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';\n";

const names = (src) => {
  const ast = espree.parse(src, { ecmaVersion: 2022, sourceType: 'module', jsx: true, ecmaFeatures: { jsx: true } });
  const out = [];
  for (const n of ast.body) {
    if (n.type === 'VariableDeclaration') n.declarations.forEach((d) => d.id.name && out.push(d.id.name));
    else if (n.type === 'FunctionDeclaration' || n.type === 'ClassDeclaration') out.push(n.id.name);
  }
  return out;
};

fs.mkdirSync(OUT, { recursive: true });
let bad = 0;
for (const file of lessons) {
  const src = read(path.join(DIR, file));
  if (!src.includes("from './_kit/index.jsx'")) { console.log(`${file}: не на ките, пропускаю`); continue; }
  const lessonBody = src
    .replace(/^import React[^\n]*\n/m, '')
    .replace(/^import \{[^}]*\} from '\.\/_kit\/index\.jsx';\n/m, '')
    // из styles.js урок берёт BASE_STYLES (уроки 1-36) или LESSON_STYLES (уроки из данных)
    .replace(/^import \{[^}]*\} from '\.\/_kit\/styles\.js';\n/m, '');

  const bundle = `${REACT_IMPORT}\n// ВНИМАНИЕ: файл собран автоматически (scripts/build-grade3-lms.mjs) из
// src/components/grade3/${file} и общего движка _kit/. Править нужно ИСХОДНИК, а не этот файл:
// при следующей сборке правки здесь пропадут.\n${kitBody}\n${stylesBody}\n${lessonBody}`;

  const problems = [];
  const imports = bundle.match(/^import [^\n]*/gm) || [];
  if (imports.length !== 1) problems.push(`импортов ${imports.length}, а должен быть один`);
  if (!/^import React,\s*\{/.test(imports[0] || '')) problems.push('React импортирован не по имени (LMS: классический режим)');
  if (/from ['"]\.{1,2}\//.test(bundle)) problems.push('осталась ссылка на соседний файл');
  const exports = bundle.match(/^export /gm) || [];
  if (exports.length !== 1 || !/export default/.test(bundle)) problems.push(`экспортов ${exports.length}, нужен один export default`);
  let decl = [];
  try { decl = names(bundle); } catch (e) { problems.push(`не разбирается: ${e.message}`); }
  const dup = decl.filter((n, i) => decl.indexOf(n) !== i);
  if (dup.length) problems.push(`повторные объявления: ${[...new Set(dup)].join(', ')}`);

  if (problems.length) { console.log(`${file}: НЕ СОБРАН — ${problems.join('; ')}`); bad += 1; continue; }
  fs.writeFileSync(path.join(OUT, file), bundle, 'utf8');
  console.log(`${file}: ${bundle.split('\n').length} строк, ${Math.round(bundle.length / 1024)} КБ — импорт только react, ссылок наружу нет`);
}
console.log(`\nготово: ${OUT}${bad ? `, не собрано: ${bad}` : ''}`);
process.exit(bad ? 1 : 0);
