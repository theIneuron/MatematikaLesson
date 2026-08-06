// build-grade3-dars23.mjs — собирает Dars23.jsx из донора Dars22.jsx (этап 3, сборка).
//
// Как и в прошлый раз, блок экранов не переписывается целиком: у 22 и 23 уроков совпадают
// все экраны, кроме модели (s2), — там вместо клеточной сетки ящики с остатком.
//
// Отличие от build-grade3-dars22.mjs: хвост CSS чистится жёстче. Раньше каждый урок тащил
// правила двух прошлых уроков (в Dars22.jsx лежат мёртвые `.d20-` и `.d21-`), хотя код
// обращается только к своим классам. Здесь `.d20-`/`.d21-` выбрасываются, а `.d22-`
// переименовываются в `.d23-` — ни одного класса не теряется и мёртвых правил не остаётся.
//
// Одноразовый генератор: после сборки источник правды — сам `src/components/grade3/Dars23.jsx`.
// Запуск: node scripts/build-grade3-dars23.mjs
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.resolve('src/components/grade3/Dars22.jsx');
const OUT = path.resolve('src/components/grade3/Dars23.jsx');
const BLK = path.resolve(process.env.D23_BLOCKS || 'C:/Users/USER/AppData/Local/Temp/claude/c--Users-USER-MatematikaLesson/f093dee5-b110-48ec-8639-7805bc86f15f/scratchpad');
const read = (f) => fs.readFileSync(path.join(BLK, f), 'utf8').split(String.fromCharCode(13)).join('');
const sections = (f) => Object.fromEntries(read(f).split(/^===([A-Z0-9]+)===$/m).slice(1)
  .reduce((acc, x, i, a) => (i % 2 ? acc : [...acc, [x, a[i + 1].trim()]]), []));

const blocks = sections('d23-blocks.txt');
const screens = sections('d23-screens.txt');
blocks.CONTENT = read('d23-content.txt').trim();

let s = fs.readFileSync(SRC, 'utf8').split(String.fromCharCode(13)).join('');
const cut = (a1, a2, rep, label) => {
  const a = s.indexOf(a1);
  if (a < 0) throw new Error(`${label}: начало не найдено -> ${a1.slice(0, 60)}`);
  const b = s.indexOf(a2, a + a1.length);
  if (b < 0) throw new Error(`${label}: конец не найден -> ${a2.slice(0, 60)}`);
  s = s.slice(0, a) + rep + s.slice(b);
  console.log(`${label}: ${b - a} -> ${rep.length} знаков`);
};

cut('// ============================================================================\n// DD 3-SINF | Dars22', '\n// AI-проверка открытых ответов', blocks.HEAD, 'шапка');
cut('const TOTAL_SCREENS = 15;', '\n// ============================================================\n// CONTENT', blocks.META, 'метаданные');
cut('const CONTENT = {', "\n\n// v9 KO'PRIK", blocks.CONTENT, 'CONTENT');
cut('const BRIDGES = {', '\n\n// s14 payoff', blocks.BRIDGES, 'мосты');
cut('const S14_PAYOFF = {', '\n\n// ', blocks.PAYOFF, 'payoff');
cut("// --- KATTA MODUL (D22)", 'const NumPad = ({ value', blocks.SCENE + '\n', 'сцена');
cut("// --- KATAK TO'R:", 'const MCOne = ', blocks.FIGS + '\n', 'фигуры');

cut('// s2 — KATAK TO\'R', '// s3 — ', screens.S2 + '\n\n', 'экран s2');

// сцена, герой факткарды и классы урока: имена донора меняем на свои
const head = s.slice(0, s.indexOf('const STYLES = BASE_STYLES + `'));
const tail = s.slice(s.indexOf('const STYLES = BASE_STYLES + `'));
s = head.split('BigModuleScene').join('ShipmentScene').split('StairFig').join('BracketFig').split('d22-').join('d23-') + tail;

if (!s.includes('export default function TwoByTwoLesson({')) throw new Error('корневой компонент не найден');
s = s.replace('export default function TwoByTwoLesson({', 'export default function TwoStepTasksLesson({');

// клавиатура: у донора значение по умолчанию две цифры, а в этом уроке ответы трёхзначные
s = s.replace('const NumPad = ({ value, setValue, disabled, max = 2 }) => {',
  'const NumPad = ({ value, setValue, disabled, max = 3 }) => {');

// CSS: правила прошлых уроков выбрасываем, свои переименовываем, затем добавляем новые
const si = s.indexOf('const STYLES = BASE_STYLES + `');
const sj = s.indexOf('`;', si);
const donorTail = s.slice(si + 'const STYLES = BASE_STYLES + `'.length, sj);
const keep = donorTail.replace(/(^|\n)([^\n{}]*\{[^}]*\})/g, (m, pre, rule) => {
  const sel = rule.slice(0, rule.indexOf('{'));
  return /\.d2[01]-/.test(sel) ? pre.replace(/\n$/, '') : m;
})
  // однострочные media-обёртки прошлых уроков блочный фильтр не видит: он читает селектор
  // до первой скобки, а класс лежит внутри. Убираем такие строки целиком.
  .replace(/(^|\n)@media[^\n]*\.d2[01]-[^\n]*/g, (m, pre) => pre.replace(/\n$/, ''))
  .split('d22-').join('d23-');
const left = (keep.match(/\.d2[01]-/g) || []).length;
if (left) throw new Error(`в хвосте CSS осталось ${left} правил прошлых уроков`);
s = s.slice(0, si) + 'const STYLES = BASE_STYLES + `' + keep + '\n' + blocks.STYLES + '\n`;' + s.slice(sj + 2);

// последняя проверка: код не должен ссылаться на классы и компоненты донора
for (const dead of ['d22-', 'BigModule', 'StairFig', 'RectSplit']) {
  if (s.includes(dead)) throw new Error(`в файле осталась ссылка донора: ${dead}`);
}

fs.writeFileSync(OUT, s, 'utf8');
console.log(`\nЗаписано: ${OUT} (${s.split('\n').length} строк)`);
