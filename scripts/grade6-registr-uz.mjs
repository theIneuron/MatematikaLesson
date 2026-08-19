// ============================================================================
// grade6-registr-uz.mjs — УЗБЕКСКИЙ РЕГИСТР: обращение на `siz`, ВЕСЬ КЛАСС.
//
// Что было не так до 2026-08-19: скрипт читал ОДИН файл (Dars01.jsx) и искал
// повелительное только В НАЧАЛЕ предложения. Поэтому «Ko'paytir, keyin o'tkaz»
// в уроке 20 и пять шагов на «сен» в финальной сцене урока 35 он не видел, а
// отчёт «обращение везде на siz» относился к одному уроку из сорока шести.
//
// Три проверки, и главная — третья:
//   1) местоимения на «sen»;
//   2) личные окончания второго лица единственного числа (-san, -ding, …);
//   3) СКРЕЩИВАНИЕ ЯЗЫКОВ. Русский в 6 классе на «ты», значит русское
//      повелительное = это инструкция ученику. Узбекская пара такой строки
//      обязана быть на siz: -ng / -ing / -ingiz, либо именной формой
//      («topish», «bo'lish»), где команды не слышно. Такой проход не зависит
//      от словаря глаголов: что урок просит по-русски, то и проверяется.
//
// Осторожно: `\b` в JS считает словом только ASCII, поэтому с кириллицей он
// молча не срабатывает — границы русских слов ищутся просмотром вперёд и назад.
//
// Запуск:
//   node scripts/grade6-registr-uz.mjs            все 46 уроков и общий слой
//   node scripts/grade6-registr-uz.mjs 20         один урок
// ============================================================================
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const arg = process.argv.slice(2).find((a) => /^\d+$/.test(a));
const NUMS = arg ? [Number(arg)] : Array.from({ length: 46 }, (_, i) => i + 1);

const problems = [];
const bad = (where, msg, text) => problems.push(`${where}  ${msg}\n      ${String(text).slice(0, 110)}`);

// ---------------------------------------------------------------------------
// Чтение содержимого урока как ДАННЫХ: строка озвучки и строка экрана не
// путаются местами, а к каждой строке есть путь до узла.
// ---------------------------------------------------------------------------
function cutLiteral(code, decl) {
  const i = code.indexOf(decl);
  if (i < 0) return null;
  const start = code.indexOf('{', i);
  let depth = 0;
  let inStr = null;
  for (let j = start; j < code.length; j += 1) {
    const ch = code[j];
    const prev = code[j - 1];
    if (inStr) { if (ch === inStr && prev !== '\\') inStr = null; continue; }
    if (ch === "'" || ch === '"' || ch === '`') { inStr = ch; continue; }
    if (ch === '/' && code[j + 1] === '/') { j = code.indexOf('\n', j); if (j < 0) break; continue; }
    if (ch === '{') depth += 1;
    else if (ch === '}') { depth -= 1; if (depth === 0) return code.slice(start, j + 1); }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Признаки обращения на «сен»
// ---------------------------------------------------------------------------
const PRON = /\b(sen|sening|senga|seni|sendan|senda)\b/i;
const FIN = /\b[a-z'’]+(san|ding|gansan|yapsan|arsan|ibsan|masan)\b/i;
const FIN_OK = /^(insan|doston|dostan)$/i;

// Русские повелительные, которые встречаются в уроках класса. Список открытый:
// новый глагол дописывается сюда, и проверка сразу видит его пару в узбекском.
const RU_IMP_WORDS = [
  'найди', 'найдите', 'нажми', 'сравни', 'посчитай', 'реши', 'проверь', 'выбери', 'запиши',
  'назови', 'поставь', 'обозначь', 'вырази', 'составь', 'вернись', 'умножь', 'умножай',
  'раздели', 'сократи', 'приведи', 'округли', 'отметь', 'подставь', 'сложи', 'вычти',
  'переверни', 'упрости', 'разложи', 'начни', 'смотри', 'запомни', 'подумай', 'попробуй',
  'открой', 'закрой', 'закрывай', 'возьми', 'скажи', 'прочитай', 'нарисуй', 'измерь',
  'соедини', 'переведи', 'переводи', 'уменьши', 'увеличь', 'заполни', 'дополни', 'исправь',
  'сдвинь', 'отложи', 'обведи', 'сверь', 'выпиши', 'подели', 'дели', 'считай', 'ищи',
  'отрази', 'построй', 'достань', 'убери', 'добавь', 'сотри', 'зачеркни', 'спроси',
  'ставь', 'клади', 'тяни', 'верни', 'повтори', 'продолжи', 'раскрой',
];
const RU_IMP = new RegExp(`(?<![а-яёА-ЯЁ])(${RU_IMP_WORDS.join('|')})(?![а-яёА-ЯЁ])`, 'i');

// Вежливая узбекская форма: -ng / -ing / -ingiz. Именная форма на -sh/-ish
// («topish», «bo'lish») командой не звучит и тоже проходит.
const UZ_POLITE = /\b[a-z'’]+(ing|ng|ingiz)\b/i;
const UZ_NOMINAL = /\b[a-z'’]+(sh|shi|shni|shda|shga)\b/i;

// «как ни сложи», «что ни говори» — русский оборот, а не команда ученику:
// узбекская пара там в третьем лице, и это нормально.
const RU_RHETORIC = /(как ни|что ни|куда ни|сколько ни)\s/i;

const check = (where, ru, uz) => {
  if (typeof uz !== 'string' || !uz.trim()) return;
  if (PRON.test(uz)) bad(where, 'местоимение не на siz', uz);
  const m = uz.match(FIN);
  if (m && !FIN_OK.test(m[0])) bad(where, `личная форма на «ты» (${m[0]})`, uz);
  if (typeof ru !== 'string') return;
  if (!RU_IMP.test(ru) || RU_RHETORIC.test(ru)) return;
  if (UZ_POLITE.test(uz) || UZ_NOMINAL.test(uz)) return;
  bad(where, `русская сторона просит («${ru.match(RU_IMP)[0]}»), узбекская без -ng`, uz);
};

// Пары ru/uz из CONTENT.
const walkContent = (value, trail, lesson) => {
  if (value === null || value === undefined || typeof value !== 'object') return;
  if (Array.isArray(value)) { value.forEach((v, i) => walkContent(v, `${trail}[${i}]`, lesson)); return; }
  const keys = Object.keys(value);
  const isNode = ['ru', 'uz', 'en'].some((l) => l in value) && keys.every((k) => ['ru', 'uz', 'en'].includes(k));
  if (isNode) {
    const ru = Array.isArray(value.ru) ? value.ru : [value.ru];
    const uz = Array.isArray(value.uz) ? value.uz : [value.uz];
    uz.forEach((s, i) => check(`${lesson} ${trail}${uz.length > 1 ? `[${i}]` : ''}`, ru[i], s));
    return;
  }
  keys.forEach((k) => walkContent(value[k], trail ? `${trail}.${k}` : k, lesson));
};

// Строки ВНЕ CONTENT: подписи чипов и кнопок живут в вызовах tri(lang, ru, uz, en).
// Именно там пряталась пятёрка шагов урока 35.
const TRI_RE = /tri\(\s*lang\s*,\s*(['"])((?:\\.|(?!\1)[^\\])*)\1\s*,\s*(['"])((?:\\.|(?!\3)[^\\])*)\3/g;
const walkTri = (src, label) => {
  TRI_RE.lastIndex = 0;
  let m;
  while ((m = TRI_RE.exec(src)) !== null) {
    const line = src.slice(0, m.index).split('\n').length;
    check(`${label}:${line}`, m[2], m[4]);
  }
};

// ---------------------------------------------------------------------------
let files = 0;
const shared = path.resolve('src/components/grade6/screens.jsx');
if (!arg && fs.existsSync(shared)) { walkTri(fs.readFileSync(shared, 'utf8'), 'screens.jsx'); files += 1; }

for (const n of NUMS) {
  const file = path.resolve(`src/components/grade6/Dars${String(n).padStart(2, '0')}.jsx`);
  if (!fs.existsSync(file)) continue;
  files += 1;
  const src = fs.readFileSync(file, 'utf8');
  const label = `Dars${String(n).padStart(2, '0')}`;
  const literal = cutLiteral(src, 'const CONTENT = {');
  if (literal) {
    try {
      walkContent(vm.runInNewContext(`(${literal})`, {}, { timeout: 5000 }), '', label);
    } catch (e) {
      problems.push(`${label}  CONTENT не читается как данные: ${String(e.message).split('\n')[0]}`);
    }
  }
  walkTri(src, label);
}

console.log(`узбекский регистр: проверено файлов ${files}`);
if (!problems.length) {
  console.log('обращение везде на siz');
} else {
  problems.forEach((p) => console.log('  ' + p));
}
console.log(`всего замечаний: ${problems.length}`);
process.exit(problems.length ? 1 : 0);
