// grade3-kit-migrate.mjs — переводит урок 3 класса на общий модуль `_kit/`.
//
// Правило безопасности: объявление удаляется из урока ТОЛЬКО если его текст байт-в-байт
// равен тексту вките. Всё остальное остаётся в уроке, и скрипт пишет об этом. То же для
// CSS: из строки STYLES убираются только блоки, дословно совпадающие с базовым CSS.
// Поэтому миграция не может изменить поведение — код заменяется на тот же самый код.
//
// Что проверяется дополнительно:
//   - селекторы собственного CSS урока не должны совпадать с базовыми (иначе порядок
//     каскада изменится, и правило начнёт побеждать другое — единственный такой случай
//     в классе `.lm-fly` в первом уроке);
//   - имена, которые урок использует, но которых нет ни в ките, ни в самом уроке.
//
// Запуск: node scripts/grade3-kit-migrate.mjs [--dry] Dars17.jsx [Dars16.jsx …]
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const espree = require('espree');

const DRY = process.argv.includes('--dry');
const DIR = path.resolve('src/components/grade3');
const KIT = path.join(DIR, '_kit');
const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const targets = args.length ? args : fs.readdirSync(DIR).filter((f) => /^Dars\d+\.jsx$/.test(f)).sort();

const read = (p) => fs.readFileSync(p, 'utf8').split('\r').join('');
const kitSrc = read(path.join(KIT, 'index.jsx'));
const kitStyles = read(path.join(KIT, 'styles.js'));

const declsOf = (src) => {
  const ast = espree.parse(src, { ecmaVersion: 2022, sourceType: 'module', jsx: true, ecmaFeatures: { jsx: true }, range: true });
  const out = [];
  for (const n of ast.body) {
    const push = (name, node) => out.push({ name, text: src.slice(node.range[0], node.range[1]), start: node.range[0], end: node.range[1] });
    if (n.type === 'VariableDeclaration') n.declarations.forEach((d) => d.id.name && push(d.id.name, n));
    else if (n.type === 'FunctionDeclaration') push(n.id.name, n);
    else if (n.type === 'ClassDeclaration') push(n.id.name, n);
  }
  return out;
};
const cssBlocks = (css) => {
  const out = []; let i = 0;
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
};
const selOf = (b) => (b.startsWith('/*') ? null : b.slice(0, b.indexOf('{')).trim().replace(/\s+/g, ' '));

// кит: имена и тексты
const kitDecls = new Map(declsOf(kitSrc).map((d) => [d.name, d.text]));
const kitExports = new Set([...(kitSrc.match(/export \{([\s\S]*?)\};/) || [])[1].split(',').map((s) => s.trim()).filter(Boolean), 'makeBrgSeg']);
const baseCss = cssBlocks(kitStyles.slice(kitStyles.indexOf('BASE_STYLES = `') + 15, kitStyles.lastIndexOf('`;')));
const baseCssSet = new Set(baseCss);
const baseSelSet = new Set(baseCss.map(selOf).filter(Boolean));

let failed = 0;
for (const file of targets) {
  const p = path.join(DIR, file);
  const src = read(p);
  if (src.includes("from './_kit/index.jsx'")) { console.log(`${file}: уже на ките, пропускаю`); continue; }

  const decls = declsOf(src);
  const move = []; const keep = [];
  for (const d of decls) {
    if (!kitDecls.has(d.name)) continue;
    if (kitDecls.get(d.name) === d.text) move.push(d); else keep.push(d.name);
  }

  // CSS: убираем только дословно совпадающие блоки
  const si = src.indexOf('const STYLES = `');
  const sj = src.indexOf('`;', si);
  const css = src.slice(si + 'const STYLES = `'.length, sj);
  const blocks = cssBlocks(css);
  const ownBlocks = blocks.filter((b) => !baseCssSet.has(b));
  // Совпадение селектора с базовым опасно ТОЛЬКО если своё правило сейчас стоит РАНЬШЕ
  // базового: после сборки «база, потом своё» оно начнёт побеждать, хотя раньше проигрывало.
  // Если своё и так идёт последним (урок 1 переиспользует `.lm-fly` под карточку), порядок
  // сохраняется и правило остаётся тем же.
  const collisions = [...new Set(ownBlocks.map(selOf).filter(Boolean))].filter((s) => {
    if (!baseSelSet.has(s) || s.startsWith('@media')) return false;
    const lastBase = blocks.reduce((acc, b, i) => (baseCssSet.has(b) && selOf(b) === s ? i : acc), -1);
    const firstOwn = blocks.findIndex((b) => !baseCssSet.has(b) && selOf(b) === s);
    return firstOwn >= 0 && firstOwn < lastBase;
  });
  if (collisions.length) {
    console.log(`${file}: ОСТАНОВЛЕНО — свои правила перекрывают базовые: ${collisions.join(', ')}`);
    console.log('   порядок каскада изменится, нужен ручной разбор');
    failed += 1;
    continue;
  }

  // собираем новый файл: вырезаем перенесённые объявления с конца, чтобы не сбить смещения.
  // Вместе с объявлением уходит комментарий, который его описывает (сплошные строки `//`
  // прямо над ним) — иначе в уроке остаются подписи к коду, которого там больше нет.
  let out = src;
  for (const d of [...move].sort((a, b) => b.start - a.start)) {
    let from = d.start;
    for (;;) {
      const lineStart = out.lastIndexOf('\n', from - 2) + 1;
      const line = out.slice(lineStart, from).trim();
      if (line.startsWith('//')) { from = lineStart; continue; }
      break;
    }
    out = out.slice(0, from) + out.slice(d.end);
  }
  // STYLES -> BASE_STYLES + свой хвост
  const si2 = out.indexOf('const STYLES = `');
  const sj2 = out.indexOf('`;', si2);
  out = out.slice(0, si2) + 'const STYLES = BASE_STYLES + `\n' + ownBlocks.join('\n') + '\n`;' + out.slice(sj2 + 2);

  // импорт: берём только то, что урок действительно упоминает
  const usedNames = new Set(out.match(/[A-Za-z_$][A-Za-z0-9_$]*/g) || []);
  const imports = [...kitExports].filter((n) => usedNames.has(n)).sort();
  if (out.includes('BRIDGES') && !imports.includes('makeBrgSeg')) imports.push('makeBrgSeg');
  const importLine = `import { ${imports.join(', ')} } from './_kit/index.jsx';\nimport { BASE_STYLES } from './_kit/styles.js';\n`;
  out = out.replace(/^import React[^\n]*\n/, (m) => m + importLine);
  // brgSeg/withBridgeAudio читают BRIDGES урока — оставляем в уроке, но через фабрику кита
  out = out.replace(/^const brgSeg = [^\n]*\n/m, 'const brgSeg = makeBrgSeg(BRIDGES);\n');

  // урок обязан остаться разбираемым и не потерять имён: проверяем до записи
  try { espree.parse(out, { ecmaVersion: 2022, sourceType: 'module', jsx: true, ecmaFeatures: { jsx: true } }); }
  catch (e) { console.log(`${file}: ОСТАНОВЛЕНО — файл после правки не разбирается: ${e.message}`); failed += 1; continue; }
  const outNames = new Set(declsOf(out).map((d) => d.name));
  const known = new Set([...outNames, ...kitExports, 'React', 'BASE_STYLES']);
  const lost = [...move].map((d) => d.name).filter((n) => !known.has(n) && new RegExp(`\\b${n}\\b`).test(out));
  if (lost.length) { console.log(`${file}: ОСТАНОВЛЕНО — имена используются, но не импортируются: ${lost.join(', ')}`); failed += 1; continue; }

  const before = src.split('\n').length;
  const after = out.split('\n').length;
  console.log(`${file}: перенесено ${move.length} объявлений, CSS-блоков своих ${ownBlocks.length}; строк ${before} -> ${after} (−${Math.round((1 - after / before) * 100)} %)`);
  if (keep.length) console.log(`   осталось своей версией: ${keep.join(', ')}`);
  if (!DRY) fs.writeFileSync(p, out, 'utf8');
}
if (DRY) console.log('\n(ЧЕРНОВИК, файлы не записаны)');
process.exit(failed ? 1 : 0);
