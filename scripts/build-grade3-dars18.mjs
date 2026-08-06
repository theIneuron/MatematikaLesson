// build-grade3-dars18.mjs — собирает Dars18.jsx из донора Dars17.jsx (этап 3, сборка).
//
// Донор уже на общем движке `_kit/`, поэтому копируется только то, что у уроков общее по
// структуре: импорты кита, вспомогательные компоненты (NumPad, MeasureCell, MCOne, NumOne)
// и каркас корневого компонента. Всё, что относится к уроку, заменяется блоками из
// заготовок: шапка, метаданные, CONTENT, мосты, сцена, фигуры, экраны, свой CSS.
//
// Одноразовый генератор: после сборки источник правды — сам `src/components/grade3/Dars18.jsx`.
// Запуск: node scripts/build-grade3-dars18.mjs [--out src/components/grade3/Dars18.jsx]
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.resolve('src/components/grade3/Dars17.jsx');
const OUT = path.resolve(process.argv.includes('--out') ? process.argv[process.argv.indexOf('--out') + 1] : 'src/components/grade3/Dars18.jsx');
const BLK = path.resolve(process.env.D18_BLOCKS || 'C:/Users/USER/AppData/Local/Temp/claude/c--Users-USER-MatematikaLesson/f093dee5-b110-48ec-8639-7805bc86f15f/scratchpad');
const read = (f) => fs.readFileSync(path.join(BLK, f), 'utf8').split(String.fromCharCode(13)).join('');

// заготовки: один файл с секциями ===ИМЯ=== плюс отдельные крупные блоки
const blocks = {};
for (const part of read('d18-blocks.txt').split(/^===([A-Z]+)===$/m).slice(1).reduce((acc, x, i, a) => (i % 2 ? acc : [...acc, [x, a[i + 1]]]), [])) blocks[part[0]] = part[1].trim();
blocks.CONTENT = read('d18-content.txt').trim();
blocks.SCREENS = read('d18-screens.txt').trim();

const CR = String.fromCharCode(13);
let s = fs.readFileSync(SRC, 'utf8').split(CR).join('');

const cut = (startAnchor, endAnchor, replacement, label) => {
  const a = s.indexOf(startAnchor);
  if (a < 0) throw new Error(`${label}: начало не найдено -> ${startAnchor.slice(0, 60)}`);
  const b = s.indexOf(endAnchor, a + startAnchor.length);
  if (b < 0) throw new Error(`${label}: конец не найден -> ${endAnchor.slice(0, 60)}`);
  s = s.slice(0, a) + replacement + s.slice(b);
  console.log(`${label}: ${b - a} -> ${replacement.length} знаков`);
};

// 1) шапка урока: от строки-разделителя перед «DD 3-SINF | Dars17» до конца комментария.
const HEAD_START = '// ============================================================================\n// DD 3-SINF | Dars17';
// Конец шапки — начало первого кода урока. Заодно уходит мусор, оставшийся после выноса
// движка: осиротевший комментарий к FREE_NAV и пустые строки от удалённых объявлений.
const HEAD_END = '\n// AI-проверка открытых ответов';
cut(HEAD_START, HEAD_END, blocks.HEAD, 'шапка');
// 2) метаданные
cut('const TOTAL_SCREENS = 15;', '\n// ============================================================\n// CONTENT', blocks.META, 'метаданные');
// 3) CONTENT
cut('const CONTENT = {', "\n\n// v9 KO'PRIK", blocks.CONTENT, 'CONTENT');
// 4) мосты и payoff
cut('const BRIDGES = {', '\n\n// s14 payoff', blocks.BRIDGES, 'мосты');
cut('const S14_PAYOFF = {', '\n\n// ', blocks.PAYOFF, 'payoff');
// 5) сцена: мастерская урока 17 -> раздаточный стеллаж
cut('// --- USTAXONA (D19)', 'const NumPad = ({ value', blocks.SCENE + '\n', 'сцена');
// 6) фигуры урока
cut('// --- MODUL DETALLARI', 'const MCOne = ', blocks.FIGS + '\n', 'фигуры');
// 7) экраны
cut('const Screen0 = (props) => {', '// ============================================================\n// KORNEVOY KOMPONENT', blocks.SCREENS + '\n\n', 'экраны');
// 8) имя корневого компонента
if (!s.includes('export default function TwoDigitMulLesson({')) throw new Error('корневой компонент не найден');
s = s.replace('export default function TwoDigitMulLesson({', 'export default function TwoDigitDivLesson({');
// 9) CSS: берём хвост донора БЕЗ его урочных правил (`.d19-*`) и дописываем свои.
//    В хвосте донора лежит базовое правило `.lm-scene` с aspect-ratio: в кит оно не ушло,
//    потому что у уроков разные clamp-значения. Без него сцена получает нулевую высоту —
//    на этом первая сборка урока и споткнулась.
const si = s.indexOf('const STYLES = BASE_STYLES + `');
if (si < 0) throw new Error('STYLES не найден');
const sj = s.indexOf('`;', si);
const donorTail = s.slice(si + 'const STYLES = BASE_STYLES + `'.length, sj);
const keep = donorTail.replace(/(^|\n)([^\n{}]*\{[^}]*\})/g, (m, pre, rule) => {
  const sel = rule.slice(0, rule.indexOf('{'));
  return /\.d19-/.test(sel) ? pre.replace(/\n$/, '') : m;
});
s = s.slice(0, si) + 'const STYLES = BASE_STYLES + `' + keep + '\n' + blocks.STYLES + '\n`;' + s.slice(sj + 2);

fs.writeFileSync(OUT, s, 'utf8');
console.log(`\nЗаписано: ${OUT} (${s.split('\n').length} строк)`);
