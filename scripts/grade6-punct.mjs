// ЗНАКИ ПРЕПИНАНИЯ в 6 классе. Четыре проверки, каждая объективная:
//
//   1) РАСХОЖДЕНИЕ концовок между языками. Если в русском вопрос, а в узбекском
//      точка — один из трёх неверен. Проверка не зависит от языка и потому самая
//      надёжная: она нашла английский шаг метода без знака вопроса.
//   2) ПРЯМОЙ ВОПРОС ПОСЛЕ ДВОЕТОЧИЯ с точкой в конце. «начинают с одного
//      вопроса: что дано, целое или часть.» — знак нужен во всех трёх языках.
//      Косвенный вопрос внутри повествования («смотри, что спрашивают») — норма,
//      поэтому клауза после двоеточия должна САМА быть вопросом.
//   3) ТОЧКА В КОНЦЕ ШАГА. Шаг способа — указание, а не предложение, точки в
//      конце у него нет. Знак вопроса, наоборот, нужен, если шаг спрашивает
//      (уточнение QA 2026-08-20).
//   4) МУСОР: пробел перед знаком, двойная точка, «?.», «,,».
//      Двоеточие в записи деления «20 : 5» — норма класса, не мусор.
//
// Запуск: node scripts/grade6-punct.mjs
// Выход: 1, если есть замечания.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const LANGS = ['ru', 'uz', 'en'];

function cutLiteral(code, decl) {
  const i = code.indexOf(decl);
  if (i < 0) return null;
  const start = code.indexOf('{', i);
  let depth = 0; let inStr = null;
  for (let j = start; j < code.length; j += 1) {
    const ch = code[j];
    if (inStr) { if (ch === inStr && code[j - 1] !== '\\') inStr = null; continue; }
    if (ch === '/' && code[j + 1] === '/') { j = code.indexOf('\n', j); if (j < 0) break; continue; }
    if (ch === "'" || ch === '"' || ch === '`') { inStr = ch; continue; }
    if (ch === '{') depth += 1;
    else if (ch === '}') { depth -= 1; if (!depth) return code.slice(start, j + 1); }
  }
  return null;
}

// Клауза после двоеточия должна сама быть вопросом. Точку снимаем, иначе
// концевые шаблоны («или нет», узбекское -mi) не совпадут.
const Q_AFTER = {
  ru: /^(что|какой|какая|какое|какие|сколько|где|когда|почему|зачем|кто|чему)\s|\sли\s|или нет$/i,
  // По-узбекски вопрос ставят частицей -mi в конце. Слова вроде «yarmi» тоже
  // кончаются на mi, поэтому требуем глагольную концовку.
  uz: /^(nima|qaysi|qancha|nechta|necha|qayerda|qachon|kim)\s|(dimi|adimi|midi|mikan)$|yoki yo'q$|(dimi|adimi)\s+yoki/i,
  // По-английски вопрос — обратный порядок в начале клаузы, кроме «does not».
  en: /^(does|do|is|are|was|were|can|will|would|should)\s+(?!not\s)/i,
};
// Известные исключения: повествование, внутри которого лежит косвенный вопрос.
const KNOWN_INDIRECT = [
  'Dars11 s_recall.audio[2].ru',
  'Dars35 s_back.audio[0].uz',
  'Dars37 s_recall.audio[2].ru',
  'Dars39 s_recall.audio[0].ru',
  'Dars43 s_recall.audio[0].ru',
];

const mismatch = [];
const colonQ = [];
const junk = [];
const stepMark = [];

// Шаг списка — указание, а не предложение: точки в конце у него нет. Но если сам
// шаг СПРАШИВАЕТ, знак вопроса нужен — уточнение QA 2026-08-20 по шагу
// «So'rang: ikkinchi kattalik oshadimi yoki kamayadimi?».
// Многоточие тоже остаётся: в шаге «5 : 11 = 0,4545…» это математика, а не знак.
const isStepField = (trail) => /steps(\[\d+\])?$/.test(trail.replace(/\.(ru|uz|en)$/, ''));

const tailOf = (s) => {
  const last = s.trim().slice(-1);
  return '?!.:…'.includes(last) ? last : '';
};

const check = (lesson, trail, node) => {
  const vals = {};
  LANGS.forEach((l) => { if (typeof node[l] === 'string' && node[l].trim()) vals[l] = node[l].trim(); });
  const present = Object.keys(vals);
  if (present.length < 2) return;

  const set = new Set(present.map((l) => tailOf(vals[l])));
  if (set.size > 1) {
    // двоеточие или многоточие против точки — стилистика перечисления, не ошибка
    const only = [...set].sort().join('');
    if (!['.:', ':', '', '.…', '…'].includes(only)) {
      mismatch.push(`${lesson} ${trail}: ${present.map((l) => l + tailOf(vals[l])).join(' | ')}\n      `
        + present.map((l) => `${l}: ${vals[l].slice(0, 80)}`).join('\n      '));
    }
  }

  present.forEach((l) => {
    const s = vals[l];
    const parts = s.split(/(?<=[.!?…])\s+/);
    const last = parts[parts.length - 1].trim();
    const at = `${lesson} ${trail}.${l}`;
    if (last.endsWith('.') && last.includes(': ')) {
      const afterColon = last.split(': ').slice(-1)[0].replace(/\.$/, '');
      if (Q_AFTER[l].test(afterColon) && !KNOWN_INDIRECT.includes(at)) {
        colonQ.push(`${at}: ${last.slice(0, 110)}`);
      }
    }
    if (/\s[.,?!;](\s|$)|[.,]{2}|\?\.|\.\?|!\.|\s{2,}/.test(s.replace(/\.\.\./g, '…'))) {
      junk.push(`${at}: ${s.slice(0, 90)}`);
    }
    if (isStepField(trail) && /[.!]$/.test(s.trim())) {
      stepMark.push(`${at}: ${s.slice(0, 90)}`);
    }
  });
};

const walk = (value, trail, lesson) => {
  if (!value || typeof value !== 'object') return;
  if (Array.isArray(value)) { value.forEach((v, i) => walk(v, `${trail}[${i}]`, lesson)); return; }
  const keys = Object.keys(value);
  const isNode = LANGS.some((l) => l in value) && keys.every((k) => LANGS.includes(k));
  if (!isNode) { keys.forEach((k) => walk(value[k], trail ? `${trail}.${k}` : k, lesson)); return; }
  // у экрана-фильма на каждый язык массив строк — сверяем построчно
  const len = LANGS.map((l) => (Array.isArray(value[l]) ? value[l].length : -1)).find((n) => n >= 0);
  if (len >= 0) {
    for (let i = 0; i < len; i += 1) {
      const slice = {};
      LANGS.forEach((l) => { if (Array.isArray(value[l])) slice[l] = value[l][i]; });
      check(lesson, `${trail}[${i}]`, slice);
    }
  } else {
    check(lesson, trail, value);
  }
};

for (let n = 1; n <= 46; n += 1) {
  const label = `Dars${String(n).padStart(2, '0')}`;
  const src = fs.readFileSync(path.resolve(`src/components/grade6/${label}.jsx`), 'utf8');
  walk(vm.runInNewContext(`(${cutLiteral(src, 'const CONTENT = {')})`, {}, { timeout: 5000 }), '', label);
}

let total = 0;
[['РАСХОЖДЕНИЕ концовок между языками', mismatch],
  ['ВОПРОС после двоеточия без знака вопроса', colonQ],
  ['ТОЧКА В КОНЦЕ ШАГА', stepMark],
  ['МУСОР в пунктуации', junk]].forEach(([title, list]) => {
  total += list.length;
  console.log(`\n=== ${title}: ${list.length} ===`);
  list.slice(0, 50).forEach((x) => console.log('  ' + x));
  if (list.length > 50) console.log(`  … ещё ${list.length - 50}`);
});
console.log(`\nВСЕГО замечаний: ${total}`);
if (total) process.exitCode = 1;
