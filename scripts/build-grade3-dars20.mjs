// build-grade3-dars20.mjs — собирает Dars20.jsx из донора Dars19.jsx (этап 3, сборка).
//
// Отличие от прошлых генераторов: у уроков 19 и 20 совпадает большинство экранов
// (крючок, правило, сортировка, консоль, «найди ошибку», тренажёр, задача, финал, итог),
// поэтому блок экранов НЕ переписывается целиком — заменяются только пять различающихся
// (s1, s2, s4, s9, s10). Меньше нового кода — меньше мест, где можно ошибиться.
//
// Одноразовый генератор: после сборки источник правды — сам `src/components/grade3/Dars20.jsx`.
// Запуск: node scripts/build-grade3-dars20.mjs
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.resolve('src/components/grade3/Dars19.jsx');
const OUT = path.resolve('src/components/grade3/Dars20.jsx');
const BLK = path.resolve(process.env.D20_BLOCKS || 'C:/Users/USER/AppData/Local/Temp/claude/c--Users-USER-MatematikaLesson/f093dee5-b110-48ec-8639-7805bc86f15f/scratchpad');
const read = (f) => fs.readFileSync(path.join(BLK, f), 'utf8').split(String.fromCharCode(13)).join('');
const sections = (f) => Object.fromEntries(read(f).split(/^===([A-Z0-9]+)===$/m).slice(1)
  .reduce((acc, x, i, a) => (i % 2 ? acc : [...acc, [x, a[i + 1].trim()]]), []));

const blocks = sections('d20-blocks.txt');
const screens = sections('d20-screens.txt');
blocks.CONTENT = read('d20-content.txt').trim();

let s = fs.readFileSync(SRC, 'utf8').split(String.fromCharCode(13)).join('');
const cut = (a1, a2, rep, label) => {
  const a = s.indexOf(a1);
  if (a < 0) throw new Error(`${label}: начало не найдено -> ${a1.slice(0, 60)}`);
  const b = s.indexOf(a2, a + a1.length);
  if (b < 0) throw new Error(`${label}: конец не найден -> ${a2.slice(0, 60)}`);
  s = s.slice(0, a) + rep + s.slice(b);
  console.log(`${label}: ${b - a} -> ${rep.length} знаков`);
};

cut('// ============================================================================\n// DD 3-SINF | Dars19', '\n// AI-проверка открытых ответов', blocks.HEAD, 'шапка');
cut('const TOTAL_SCREENS = 15;', '\n// ============================================================\n// CONTENT', blocks.META, 'метаданные');
cut('const CONTENT = {', "\n\n// v9 KO'PRIK", blocks.CONTENT, 'CONTENT');
cut('const BRIDGES = {', '\n\n// s14 payoff', blocks.BRIDGES, 'мосты');
cut('const S14_PAYOFF = {', '\n\n// ', blocks.PAYOFF, 'payoff');
cut('// --- TENG ULASH STOLI (D19)', 'const NumPad = ({ value', blocks.SCENE + '\n', 'сцена');
cut('// --- DETAL (17 va 18-darsdan)', 'const MCOne = ', blocks.FIGS + '\n', 'фигуры');

// экраны: только те, что отличаются от урока 19
cut('// s1 — TARQATISH', '// s2 — ', screens.S1 + '\n\n', 'экран s1');
cut("// s2 — O'SHA 11", '// s3 — ', screens.S2 + '\n\n', 'экран s2');
cut("// s4 — BIT TUZOG'I", '// s5 — ', screens.S4 + '\n\n', 'экран s4');
cut('// s9 — BONUS', '// s10 — ', screens.S9 + '\n\n', 'экран s9');
cut('// s10 — TEST: qaysi yozuvda', '// s11 — ', screens.S10 + '\n\n', 'экран s10');

// сцена, герой факткарды и классы урока: имена донора меняем на свои.
// WeekFig (календарь урока 19) заменяется на BarcodeFig — иначе финальный экран
// сошлётся на фигуру, которой в этом уроке нет.
const head = s.slice(0, s.indexOf('const STYLES = BASE_STYLES + `'));
const tail = s.slice(s.indexOf('const STYLES = BASE_STYLES + `'));
s = head.split('ShareScene').join('ControlScene').split('WeekFig').join('BarcodeFig').split('d19-').join('d20-') + tail;

if (!s.includes('export default function RemainderLesson({')) throw new Error('корневой компонент не найден');
s = s.replace('export default function RemainderLesson({', 'export default function CheckDivisionLesson({');

// CSS: хвост донора без правил урока 19, затем свои
const si = s.indexOf('const STYLES = BASE_STYLES + `');
const sj = s.indexOf('`;', si);
const donorTail = s.slice(si + 'const STYLES = BASE_STYLES + `'.length, sj);
const keep = donorTail.replace(/(^|\n)([^\n{}]*\{[^}]*\})/g, (m, pre, rule) => {
  const sel = rule.slice(0, rule.indexOf('{'));
  return /\.d19-/.test(sel) ? pre.replace(/\n$/, '') : m;
});
s = s.slice(0, si) + 'const STYLES = BASE_STYLES + `' + keep + '\n' + blocks.STYLES + '\n`;' + s.slice(sj + 2);

fs.writeFileSync(OUT, s, 'utf8');
console.log(`\nЗаписано: ${OUT} (${s.split('\n').length} строк)`);
