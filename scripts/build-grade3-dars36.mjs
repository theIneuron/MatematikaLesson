// build-grade3-dars36.mjs — собирает Dars36.jsx из донора Dars35.jsx (этап 3, сборка).
//
// Что меняется по сравнению с донором:
//   - сцена: решение методиста от 2026-08-09 — во всех оставшихся уроках стоит зал урока 8.
//     Сам зал теперь в ките (`AncientHallBg`), урок кладёт поверх только свой узел.
//   - весь CONTENT, шапка, мосты, payoff;
//   - герой карточки факта: верёвка одной длины в двух формах;
//   - плашка на крючке: было «11 : 2», стало «6 · 6».
// Механики экранов те же: клетки, сортировка, консоль, ловушка, тренажёр — новая тут
// величина (сторона), а не способ работы.
//
// Одноразовый генератор: после сборки источник правды — сам `src/components/grade3/Dars36.jsx`.
// Запуск: node scripts/build-grade3-dars36.mjs
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.resolve('src/components/grade3/Dars35.jsx');
const OUT = path.resolve('src/components/grade3/Dars36.jsx');
const BLK = path.resolve(process.env.D36_BLOCKS || 'C:/Users/USER/AppData/Local/Temp/claude/c--Users-USER-MatematikaLesson/f093dee5-b110-48ec-8639-7805bc86f15f/scratchpad');
const read = (f) => fs.readFileSync(path.join(BLK, f), 'utf8').split(String.fromCharCode(13)).join('');
const sections = (f) => Object.fromEntries(read(f).split(/^===([A-Z0-9]+)===$/m).slice(1)
  .reduce((acc, x, i, a) => (i % 2 ? acc : [...acc, [x, a[i + 1].trim()]]), []));

const blocks = sections('d36-blocks.txt');
const parts = sections('d36-screens.txt');
blocks.CONTENT = read('d36-content.txt').trim();

let s = fs.readFileSync(SRC, 'utf8').split(String.fromCharCode(13)).join('');
const cut = (a1, a2, rep, label) => {
  const a = s.indexOf(a1);
  if (a < 0) throw new Error(`${label}: начало не найдено -> ${a1.slice(0, 60)}`);
  const b = s.indexOf(a2, a + a1.length);
  if (b < 0) throw new Error(`${label}: конец не найден -> ${a2.slice(0, 60)}`);
  s = s.slice(0, a) + rep + s.slice(b);
  console.log(`${label}: ${b - a} -> ${rep.length} знаков`);
};

cut('// ============================================================================\n// DD 3-SINF | Dars35', '\n// AI-проверка открытых ответов', blocks.HEAD, 'шапка');
cut('const TOTAL_SCREENS = 15;', '\n// ============================================================\n// CONTENT', blocks.META, 'метаданные');
cut('const CONTENT = {', "\n\n// v9 KO'PRIK", blocks.CONTENT, 'CONTENT');
cut('const BRIDGES = {', '\n\n// s14 payoff', blocks.BRIDGES, 'мосты');
cut('const S14_PAYOFF = {', '\n\n// ', blocks.PAYOFF, 'payoff');

// сцена целиком: город урока 1 уходит, приходит зал урока 8 из кита
cut('// --- QATORLAR QATLAMI (D35)', 'const NumPad = ({ value', blocks.SCENE + '\n', 'сцена');
cut('// --- FACTCARD QAHRAMONI', 'const MCOne = ', parts.FIGS + '\n', 'герой факта');

// плашка на крючке
cut('            <span className="d35-order">', '\n            <span className="d35-note">', parts.S0PLATE, 'плашка крючка');

// имена: сцена и герой факта переименованы, использование тоже
s = s.split('<CrystalCityScene').join('<LessonScene');
s = s.split('<SplitFig/>').join('<RopeFig/>');

// импорт кита: город больше не нужен, нужен зал и размер плиты
s = s.replace('import { GridFig, LumoCityBg,', 'import { GridFig, AncientHallBg, HALL_SLAB,');

// класс сцены урока: в CSS-хвосте остались имена донора
s = s.split('d35-').join('d36-');

fs.writeFileSync(OUT, s, 'utf8');
console.log(`\n${path.basename(OUT)}: ${s.split('\n').length} строк`);
const left = ['Dars35', 'num-3-35', 'CrystalCityScene', 'SplitFig', 'LumoCityBg'].filter((x) => s.includes(x));
console.log(left.length ? `ОСТАЛОСЬ ОТ ДОНОРА: ${left.join(', ')}` : 'следов донора не осталось');
