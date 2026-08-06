// build-grade3-dars24.mjs — собирает Dars24.jsx из донора Dars23.jsx (этап 3, сборка).
//
// Урок 24 открывает блок Б4, поэтому меняется больше обычного: другой регион сюжета
// (мастерская закончилась, начинается дастархан), новая механика `ShareFig` вместо
// ящиков, два переписанных экрана (s2 — анатомия дроби, s4 — вопрос с картинкой).
// Остальные одиннадцать экранов берутся у донора как есть.
//
// Одноразовый генератор: после сборки источник правды — сам `src/components/grade3/Dars24.jsx`.
// Запуск: node scripts/build-grade3-dars24.mjs
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.resolve('src/components/grade3/Dars23.jsx');
const OUT = path.resolve('src/components/grade3/Dars24.jsx');
const BLK = path.resolve(process.env.D24_BLOCKS || 'C:/Users/USER/AppData/Local/Temp/claude/c--Users-USER-MatematikaLesson/f093dee5-b110-48ec-8639-7805bc86f15f/scratchpad');
const read = (f) => fs.readFileSync(path.join(BLK, f), 'utf8').split(String.fromCharCode(13)).join('');
const sections = (f) => Object.fromEntries(read(f).split(/^===([A-Z0-9]+)===$/m).slice(1)
  .reduce((acc, x, i, a) => (i % 2 ? acc : [...acc, [x, a[i + 1].trim()]]), []));

const blocks = sections('d24-blocks.txt');
const screens = sections('d24-screens.txt');
blocks.CONTENT = read('d24-content.txt').trim();

let s = fs.readFileSync(SRC, 'utf8').split(String.fromCharCode(13)).join('');
const cut = (a1, a2, rep, label) => {
  const a = s.indexOf(a1);
  if (a < 0) throw new Error(`${label}: начало не найдено -> ${a1.slice(0, 60)}`);
  const b = s.indexOf(a2, a + a1.length);
  if (b < 0) throw new Error(`${label}: конец не найден -> ${a2.slice(0, 60)}`);
  s = s.slice(0, a) + rep + s.slice(b);
  console.log(`${label}: ${b - a} -> ${rep.length} знаков`);
};

cut('// ============================================================================\n// DD 3-SINF | Dars23', '\n// AI-проверка открытых ответов', blocks.HEAD, 'шапка');
cut('const TOTAL_SCREENS = 15;', '\n// ============================================================\n// CONTENT', blocks.META, 'метаданные');
cut('const CONTENT = {', "\n\n// v9 KO'PRIK", blocks.CONTENT, 'CONTENT');
cut('const BRIDGES = {', '\n\n// s14 payoff', blocks.BRIDGES, 'мосты');
cut('const S14_PAYOFF = {', '\n\n// ', blocks.PAYOFF, 'payoff');
cut("// --- JO'NATISH STOLI (D23)", 'const NumPad = ({ value', blocks.SCENE + '\n', 'сцена');
cut('// --- YASHIKLAR:', 'const MCOne = ', blocks.FIGS + '\n', 'фигуры');

cut('// s2 — YASHIKLAR:', '// s3 — ', screens.S2 + '\n\n', 'экран s2');
cut('// s4 — XATONI TOP:', '// s5 — ', screens.S4 + '\n\n', 'экран s4');

// MCOne учится показывать картинку, а не только строку с выражением
const MC_SIG = 'const MCOne = ({ props, ck, mono = false, figLine = null }) => {';
if (!s.includes(MC_SIG)) throw new Error('сигнатура MCOne не найдена');
s = s.replace(MC_SIG, 'const MCOne = ({ props, ck, mono = false, figLine = null, figNode = null }) => {');
const MC_FIG = '{figLine && <span className="mono d23-errline">{figLine}</span>}';
if (!s.includes(MC_FIG)) throw new Error('место вывода figLine не найдено');
s = s.replace(MC_FIG, '{figNode}\n          ' + MC_FIG);

// сцена, герой факткарды и классы урока: имена донора меняем на свои
const head = s.slice(0, s.indexOf('const STYLES = BASE_STYLES + `'));
const tail = s.slice(s.indexOf('const STYLES = BASE_STYLES + `'));
s = head.split('ShipmentScene').join('DasturxonScene').split('BracketFig').join('HoneyFig').split('d23-').join('d24-') + tail;

if (!s.includes('export default function TwoStepTasksLesson({')) throw new Error('корневой компонент не найден');
s = s.replace('export default function TwoStepTasksLesson({', 'export default function ShareIntroLesson({');

// CSS: правила прошлого урока переименовываем, позапрошлые выбрасываем, затем свои
const si = s.indexOf('const STYLES = BASE_STYLES + `');
const sj = s.indexOf('`;', si);
const donorTail = s.slice(si + 'const STYLES = BASE_STYLES + `'.length, sj);
const keep = donorTail.replace(/(^|\n)([^\n{}]*\{[^}]*\})/g, (m, pre, rule) => {
  const sel = rule.slice(0, rule.indexOf('{'));
  return /\.d22-/.test(sel) ? pre.replace(/\n$/, '') : m;
})
  .replace(/(^|\n)@media[^\n]*\.d22-[^\n]*/g, (m, pre) => pre.replace(/\n$/, ''))
  .split('d23-').join('d24-');
const left = (keep.match(/\.d2[23]-/g) || []).length;
if (left) throw new Error(`в хвосте CSS осталось ${left} правил прошлых уроков`);
s = s.slice(0, si) + 'const STYLES = BASE_STYLES + `' + keep + '\n' + blocks.STYLES + '\n`;' + s.slice(sj + 2);

// последняя проверка: ни одной ссылки на донора
for (const dead of ['d23-', 'Shipment', 'BracketFig', 'BoxFill']) {
  if (s.includes(dead)) throw new Error(`в файле осталась ссылка донора: ${dead}`);
}

fs.writeFileSync(OUT, s, 'utf8');
console.log(`\nЗаписано: ${OUT} (${s.split('\n').length} строк)`);
