// build-grade3-dars33.mjs — собирает Dars33.jsx из донора Dars32.jsx (этап 3, сборка).
//
// Фон блока остаётся тот же (квартал древних знаков урока 8), поэтому целиком сцена не
// переписывается: заменяется только рабочий узел — стела, левый и правый артефакты.
// Экранов различается два: s2 (берём несколько долей) и s4 (вопрос по рисунку).
//
// Одноразовый генератор: после сборки источник правды — сам `src/components/grade3/Dars33.jsx`.
// Запуск: node scripts/build-grade3-dars33.mjs
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.resolve('src/components/grade3/Dars32.jsx');
const OUT = path.resolve('src/components/grade3/Dars33.jsx');
const BLK = path.resolve(process.env.D33_BLOCKS || 'C:/Users/USER/AppData/Local/Temp/claude/c--Users-USER-MatematikaLesson/f093dee5-b110-48ec-8639-7805bc86f15f/scratchpad');
const read = (f) => fs.readFileSync(path.join(BLK, f), 'utf8').split(String.fromCharCode(13)).join('');
const sections = (f) => Object.fromEntries(read(f).split(/^===([A-Z0-9]+)===$/m).slice(1)
  .reduce((acc, x, i, a) => (i % 2 ? acc : [...acc, [x, a[i + 1].trim()]]), []));

const blocks = sections('d33-blocks.txt');
const screens = sections('d33-screens.txt');
blocks.CONTENT = read('d33-content.txt').trim();

let s = fs.readFileSync(SRC, 'utf8').split(String.fromCharCode(13)).join('');
const cut = (a1, a2, rep, label) => {
  const a = s.indexOf(a1);
  if (a < 0) throw new Error(`${label}: начало не найдено -> ${a1.slice(0, 60)}`);
  const b = s.indexOf(a2, a + a1.length);
  if (b < 0) throw new Error(`${label}: конец не найден -> ${a2.slice(0, 60)}`);
  s = s.slice(0, a) + rep + s.slice(b);
  console.log(`${label}: ${b - a} -> ${rep.length} знаков`);
};

cut('// ============================================================================\n// DD 3-SINF | Dars32', '\n// AI-проверка открытых ответов', blocks.HEAD, 'шапка');
cut('const TOTAL_SCREENS = 15;', '\n// ============================================================\n// CONTENT', blocks.META, 'метаданные');
cut('const CONTENT = {', "\n\n// v9 KO'PRIK", blocks.CONTENT, 'CONTENT');
cut('const BRIDGES = {', '\n\n// s14 payoff', blocks.BRIDGES, 'мосты');
cut('const S14_PAYOFF = {', '\n\n// ', blocks.PAYOFF, 'payoff');

// новый регион: сцена меняется ЦЕЛИКОМ. Фон берётся из кита — `LumoCityBg` урока 1,
// поверх ложится свой слой с кристальной панелью.
cut('// --- ULUSH KVARTALI (D32)', 'const NumPad = ({ value', blocks.SCENE + '\n', 'сцена');

cut('// --- ULUSH FIGURASI', 'const MCOne = ', blocks.FIGS + '\n', 'фигуры');

cut("// s2 — MODEL: bitta bo'lak", '// s3 — ', screens.S2 + '\n\n', 'экран s2');
// маркер берётся длиннее: короткий совпал бы с комментарием внутри CONTENT
cut("// s4 — RASM BO'YICHA: suratlar teng", '// s5 — ', screens.S4 + '\n\n', 'экран s4');

// герой факткарды и префикс урока: имена донора меняем на свои.
// `d26` меняется целиком, а не только `d26-`: так же названы id градиентов сцены.
const head = s.slice(0, s.indexOf('const STYLES = BASE_STYLES + `'));
const tail = s.slice(s.indexOf('const STYLES = BASE_STYLES + `'));
s = head.split('CheckLoopFig').join('SamePerimFig').split('InventoryHallScene').join('CrystalCityScene').split('d32').join('d33') + tail;

if (!s.includes('export default function ShareTasksLesson({')) throw new Error('корневой компонент не найден');
s = s.replace('export default function ShareTasksLesson({', 'export default function PerimeterLesson({');

// CSS: правила позапрошлого урока выбрасываем, свои переименовываем
const si = s.indexOf('const STYLES = BASE_STYLES + `');
const sj = s.indexOf('`;', si);
const donorTail = s.slice(si + 'const STYLES = BASE_STYLES + `'.length, sj);
const keep = donorTail.replace(/(^|\n)([^\n{}]*\{[^}]*\})/g, (m, pre, rule) => {
  const sel = rule.slice(0, rule.indexOf('{'));
  return /\.d31-/.test(sel) ? pre.replace(/\n$/, '') : m;
})
  .replace(/(^|\n)@media[^\n]*\.d24-[^\n]*/g, (m, pre) => pre.replace(/\n$/, ''))
  .split('d32-').join('d33-');
const left = (keep.match(/\.d(31|32)-/g) || []).length;
if (left) throw new Error(`в хвосте CSS осталось ${left} правил прошлых уроков`);
s = s.slice(0, si) + 'const STYLES = BASE_STYLES + `' + keep + '\n' + blocks.STYLES + '\n`;' + s.slice(sj + 2);

// последняя проверка: ни одной ссылки на донора
for (const dead of ['d32', 'CheckLoopFig', 'ShareTasksLesson', 'InventoryHall', 'ShareFig']) {
  if (s.includes(dead)) throw new Error(`в файле осталась ссылка донора: ${dead}`);
}

// из кита нужны фон города (урок 1) и геометрический набор
s = s.replace("import { BackLabel,", "import { GridFig, LumoCityBg, BackLabel,");

fs.writeFileSync(OUT, s, 'utf8');
console.log(`\nЗаписано: ${OUT} (${s.split('\n').length} строк)`);
