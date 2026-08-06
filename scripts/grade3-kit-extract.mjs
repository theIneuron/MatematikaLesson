// grade3-kit-extract.mjs — собирает общий модуль `src/components/grade3/_kit/` из уроков.
//
// Зачем: сейчас каждый урок 3 класса — самостоятельный файл на ~5 600 строк, из которых
// 73-86 % байт-в-байт совпадают с соседним уроком. Из-за этого правка методиста стоит не
// одну правку, а семнадцать (правило «последний вопрос остаётся» разносили скриптом по 29
// компонентам), а новый урок начинается с копирования движка.
//
// Что считается общим — не на глаз: в кит уходит ТОЛЬКО то объявление, текст которого
// БАЙТ-В-БАЙТ одинаков во всех уроках. Если хоть в одном уроке версия своя (так разошлись
// `NumPad`, `CheckStrip`, `TaskTable`), объявление остаётся в уроках, и скрипт пишет об
// этом в отчёт. Поэтому вынос не может изменить поведение: заменяем текст на тот же текст.
//
// Зависимости проверяются: если общее объявление ссылается на урочное (`brgSeg` читает
// `BRIDGES`), оно в кит не уходит — иначе в модуле будет неопределённое имя.
//
// Запуск: node scripts/grade3-kit-extract.mjs [--dry]
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const espree = require('espree');

const DRY = process.argv.includes('--dry');
const DIR = path.resolve('src/components/grade3');
const KIT = path.join(DIR, '_kit');

const lessons = fs.readdirSync(DIR).filter((f) => /^Dars\d+\.jsx$/.test(f)).sort();

const readSrc = (f) => fs.readFileSync(path.join(DIR, f), 'utf8').split('\r').join('');

// --- разбор файла на объявления верхнего уровня ------------------------------
function declsOf(src) {
  const ast = espree.parse(src, { ecmaVersion: 2022, sourceType: 'module', jsx: true, ecmaFeatures: { jsx: true }, range: true, comment: true });
  const out = [];
  for (const n of ast.body) {
    const push = (name, node) => out.push({ name, text: src.slice(node.range[0], node.range[1]), start: node.range[0], end: node.range[1] });
    if (n.type === 'VariableDeclaration') n.declarations.forEach((d) => d.id.name && push(d.id.name, n));
    else if (n.type === 'FunctionDeclaration') push(n.id.name, n);
    else if (n.type === 'ClassDeclaration') push(n.id.name, n);
  }
  return out;
}

// --- CSS: разбивка строки STYLES на блоки (комментарий, правило, @media) -----
export function cssBlocks(css) {
  const out = [];
  let i = 0;
  while (i < css.length) {
    while (i < css.length && /\s/.test(css[i])) i += 1;
    if (i >= css.length) break;
    if (css.startsWith('/*', i)) { const e = css.indexOf('*/', i); out.push(css.slice(i, e + 2)); i = e + 2; continue; }
    const b = css.indexOf('{', i);
    if (b < 0) { out.push(css.slice(i)); break; }
    let d = 0; let j = b;
    for (; j < css.length; j += 1) { if (css[j] === '{') d += 1; else if (css[j] === '}') { d -= 1; if (d === 0) { j += 1; break; } } }
    out.push(css.slice(i, j)); i = j;
  }
  return out.map((s) => s.trim()).filter(Boolean);
}
export const stylesRange = (src) => {
  const i = src.indexOf('const STYLES = `');
  const j = src.indexOf('`;', i);
  return { start: i, end: j + 2, css: src.slice(i + 'const STYLES = `'.length, j) };
};

// --- 1. какие объявления одинаковы ВО ВСЕХ уроках ----------------------------
const perLesson = new Map(lessons.map((f) => [f, new Map(declsOf(readSrc(f)).map((d) => [d.name, d.text]))]));
const bases = declsOf(readSrc('Dars17.jsx'));           // порядок берём из самого нового урока
const identical = new Set();
const variants = [];
// Общим считается объявление, одинаковое ВЕЗДЕ, ГДЕ ОНО ЕСТЬ, и встречающееся минимум в
// двух уроках. Виджет, которого нет в старых уроках (`CheckStrip`, `TaskTable`), выносить
// безопасно: урок, который им не пользуется, его просто не импортирует.
for (const d of bases) {
  let ok = true; let seen = 0;
  for (const f of lessons) { const t = perLesson.get(f).get(d.name); if (t === undefined) continue; seen += 1; if (t !== d.text) ok = false; }
  if (ok && seen >= 2) identical.add(d.name);
  else if (seen > 1) variants.push({ name: d.name, seen, same: lessons.filter((f) => perLesson.get(f).get(d.name) === d.text).length });
}

// --- 2. зависимости: общее не должно ссылаться на урочное --------------------
const allNames = new Set(bases.map((d) => d.name));
const lessonNames = new Set([...allNames].filter((n) => !identical.has(n)));
const refs = (text, name) => {
  const ids = new Set(text.match(/[A-Za-z_$][A-Za-z0-9_$]*/g) || []);
  ids.delete(name);
  return [...ids];
};
let changed = true;
const excluded = new Map();
while (changed) {
  changed = false;
  for (const d of bases) {
    if (!identical.has(d.name)) continue;
    const bad = refs(d.text, d.name).filter((id) => lessonNames.has(id));
    if (bad.length) {
      identical.delete(d.name); lessonNames.add(d.name);
      excluded.set(d.name, bad.slice(0, 3));
      changed = true;
    }
  }
}

// --- 3. CSS: блоки, общие для всех уроков ------------------------------------
const cssPer = new Map(lessons.map((f) => [f, cssBlocks(stylesRange(readSrc(f)).css)]));
const cssCount = new Map();
for (const [, bl] of cssPer) for (const b of new Set(bl)) cssCount.set(b, (cssCount.get(b) || 0) + 1);
const baseCssSet = new Set([...cssCount].filter(([, n]) => n === lessons.length).map(([b]) => b));
const baseCss = cssPer.get('Dars17.jsx').filter((b) => baseCssSet.has(b));   // порядок как в Dars17

// --- 4. пишем кит -------------------------------------------------------------
const kitDecls = bases.filter((d) => identical.has(d.name));
const kitNames = kitDecls.map((d) => d.name);
const header = `// _kit/index.jsx — ОБЩИЙ ДВИЖОК УРОКОВ 3 КЛАССА.
//
// Сюда вынесено только то, что было БАЙТ-В-БАЙТ одинаково во всех уроках: движок звука и
// навигации, персонажи и анимационный кит, сцена Лумо, базовые компоненты. Текст не
// переписан — он перенесён как есть, поэтому вынос не меняет поведение уроков.
//
// Что осталось в уроке: CONTENT, BRIDGES, S14_PAYOFF, LESSON_META, SCREEN_META, сцена
// урока, его фигуры, экраны, корневой компонент и собственный CSS.
//
// Виджеты с разошедшимися версиями (NumPad, CheckStrip, TaskTable, FoldRow, useTapSteps,
// MeasureCell) СПЕЦИАЛЬНО не вынесены: в разных уроках они отличаются, свести их к одной
// версии можно только с разбором каждой правки — это отдельная задача.
//
// Файл собран скриптом scripts/grade3-kit-extract.mjs. Правки вносить сюда, а не в копии.
import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';

`;
// brgSeg читает BRIDGES урока, поэтому в кит уходит фабрика, а урок делает
// `const brgSeg = makeBrgSeg(BRIDGES);` — все вызовы остаются прежними.
const factory = `
// Мост между экранами: текст берётся из BRIDGES урока, поэтому кит отдаёт фабрику.
export const makeBrgSeg = (BRIDGES) => (key, lang) => ({ id: \`\${key}_brg\`, text: BRIDGES[key][lang], trigger: 'on_mount', waits_for: null });
`;
const body = kitDecls.map((d) => d.text).join('\n\n');
const exportList = `\n\nexport {\n${kitNames.map((n) => '  ' + n).join(',\n')}\n};\n`;
const kitSrc = header + body + '\n' + factory + exportList;

const stylesSrc = `// _kit/styles.js — базовый CSS уроков 3 класса (общий для всех уроков байт-в-байт).
// Урок дописывает свой хвост: \`const STYLES = BASE_STYLES + \\\`…\\\`;\`
// Собран скриптом scripts/grade3-kit-extract.mjs.
export const BASE_STYLES = \`
${baseCss.join('\n')}
\`;
`;

if (!DRY) {
  fs.mkdirSync(KIT, { recursive: true });
  fs.writeFileSync(path.join(KIT, 'index.jsx'), kitSrc, 'utf8');
  fs.writeFileSync(path.join(KIT, 'styles.js'), stylesSrc, 'utf8');
}

console.log(`уроков разобрано: ${lessons.length}`);
console.log(`в кит уходит: ${kitDecls.length} объявлений, ${body.split('\n').length} строк`);
console.log(`базовый CSS: ${baseCss.length} блоков, ${baseCss.join('\n').split('\n').length} строк`);
console.log(`\nОСТАЮТСЯ В УРОКАХ (версии разошлись):`);
for (const v of variants.slice(0, 20)) console.log(`  ${v.name}: одинаково в ${v.same} из ${v.seen} уроков`);
console.log(`\nНЕ ВЫНЕСЕНЫ (ссылаются на урочное):`);
for (const [n, bad] of excluded) console.log(`  ${n} -> ${bad.join(', ')}`);
if (DRY) console.log('\n(ЧЕРНОВИК, файлы не записаны)');
