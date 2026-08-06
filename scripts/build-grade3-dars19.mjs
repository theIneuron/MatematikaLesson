// build-grade3-dars19.mjs — собирает Dars19.jsx из донора Dars18.jsx (этап 3, сборка).
//
// Донор уже на общем движке `_kit/`: копируются только общие для уроков части (импорты
// кита, NumPad, MeasureCell, MCOne, NumOne, каркас корневого компонента), а всё урочное —
// шапка, метаданные, CONTENT, мосты, сцена, фигуры, экраны, свой CSS — берётся из заготовок.
//
// Одноразовый генератор: после сборки источник правды — сам `src/components/grade3/Dars19.jsx`.
// Запуск: node scripts/build-grade3-dars19.mjs
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.resolve('src/components/grade3/Dars18.jsx');
const OUT = path.resolve('src/components/grade3/Dars19.jsx');
const BLK = path.resolve(process.env.D19_BLOCKS || 'C:/Users/USER/AppData/Local/Temp/claude/c--Users-USER-MatematikaLesson/f093dee5-b110-48ec-8639-7805bc86f15f/scratchpad');
const read = (f) => fs.readFileSync(path.join(BLK, f), 'utf8').split(String.fromCharCode(13)).join('');

const blocks = {};
for (const part of read('d19b-blocks.txt').split(/^===([A-Z]+)===$/m).slice(1).reduce((acc, x, i, a) => (i % 2 ? acc : [...acc, [x, a[i + 1]]]), [])) blocks[part[0]] = part[1].trim();
blocks.CONTENT = read('d19b-content.txt').trim();
blocks.SCREENS = read('d19b-screens.txt').trim();

let s = fs.readFileSync(SRC, 'utf8').split(String.fromCharCode(13)).join('');
const cut = (a1, a2, rep, label) => {
  const a = s.indexOf(a1);
  if (a < 0) throw new Error(`${label}: начало не найдено -> ${a1.slice(0, 60)}`);
  const b = s.indexOf(a2, a + a1.length);
  if (b < 0) throw new Error(`${label}: конец не найден -> ${a2.slice(0, 60)}`);
  s = s.slice(0, a) + rep + s.slice(b);
  console.log(`${label}: ${b - a} -> ${rep.length} знаков`);
};

cut('// ============================================================================\n// DD 3-SINF | Dars18', '\n// AI-проверка открытых ответов', blocks.HEAD, 'шапка');
cut('const TOTAL_SCREENS = 15;', '\n// ============================================================\n// CONTENT', blocks.META, 'метаданные');
cut('const CONTENT = {', "\n\n// v9 KO'PRIK", blocks.CONTENT, 'CONTENT');
cut('const BRIDGES = {', '\n\n// s14 payoff', blocks.BRIDGES, 'мосты');
cut('const S14_PAYOFF = {', '\n\n// ', blocks.PAYOFF, 'payoff');
cut('// --- TAQSIMOT RAFI (D18)', 'const NumPad = ({ value', blocks.SCENE + '\n', 'сцена');
cut('// --- DETALLAR: o', 'const MCOne = ', blocks.FIGS + '\n', 'фигуры');
cut('const Screen0 = (props) => {', '// ============================================================\n// KORNEVOY KOMPONENT', blocks.SCREENS + '\n\n', 'экраны');

if (!s.includes('export default function TwoDigitDivLesson({')) throw new Error('корневой компонент не найден');
s = s.replace('export default function TwoDigitDivLesson({', 'export default function RemainderLesson({');

// CSS: хвост донора без его урочных правил (`.d18-…`), затем свои. Базовое правило
// `.lm-scene` с пропорцией живёт именно в хвосте — без него сцена схлопывается в ноль
// (на этом споткнулась первая сборка урока 18).
const si = s.indexOf('const STYLES = BASE_STYLES + `');
if (si < 0) throw new Error('STYLES не найден');
const sj = s.indexOf('`;', si);
const donorTail = s.slice(si + 'const STYLES = BASE_STYLES + `'.length, sj);
const keep = donorTail.replace(/(^|\n)([^\n{}]*\{[^}]*\})/g, (m, pre, rule) => {
  const sel = rule.slice(0, rule.indexOf('{'));
  return /\.d18-/.test(sel) ? pre.replace(/\n$/, '') : m;
});
s = s.slice(0, si) + 'const STYLES = BASE_STYLES + `' + keep + '\n' + blocks.STYLES + '\n`;' + s.slice(sj + 2);

fs.writeFileSync(OUT, s, 'utf8');
console.log(`\nЗаписано: ${OUT} (${s.split('\n').length} строк)`);
