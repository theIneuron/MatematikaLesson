// grade3-renumber.mjs — ПОЛНАЯ перенумерация уроков 3 класса в сплошную (1…51).
//
// Решение методиста 2026-08-06: «перенумеруй уроки, чтобы при создании не ошибиться».
// Раньше номер урока брался из строки плана, а контрольные (ПК/ИК) не делаются — из-за
// этого в списке были дыры (…8, 10, …17, 19), и файл Dars19.jsx был семнадцатым уроком.
// Теперь совпадает всё сразу: файл, slug, lessonId, заголовок и номер практики.
//
//   строка плана 1–8   -> уроки 1–8    (не меняются)
//   строка плана 10–17 -> уроки 9–16   (сдвиг −1: пропущена строка 9, ПК1)
//   строка плана 19–25 -> уроки 17–23  (сдвиг −2: пропущена строка 18, ПК2)
//   дальше сдвиг растёт на 1 за каждую пропущенную контрольную (строки 26, 36, 46, 57, 58)
//
// Что НЕ трогается (проверено до запуска отчётом по контексту каждой ссылки):
//   - практика: slug `darsNN-amaliyot`, папки `practice/darsNN/`, `DarsNNPractice.jsx` —
//     она давно пронумерована подряд и теперь совпадает с теорией;
//   - уроки методики учебника («Metodika (uzb 2022) 27-28-dars», «darslik 27-darsining») —
//     это нумерация книги, а не наша;
//   - файлы других классов (`grade5/Dars04.jsx` и подобные).
//
// Порядок: сначала `git mv` (по возрастанию, чтобы не затирать), потом текст.
// Запуск: node scripts/grade3-renumber.mjs [--dry]   (--dry — только отчёт, без записи)
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execSync } from 'node:child_process';

const DRY = process.argv.includes('--dry');
// Отчёт кладём во временную папку системы, а не в репозиторий: в коммит он не нужен.
const REPORT = path.join(os.tmpdir(), 'grade3-renumber-report.txt');

// Старый номер -> новый. Верхняя строка — наши уроки; нижняя — строки плана, на которые
// уроки ссылаются как на будущие (столбик, остаток): они тоже становятся номерами уроков.
const MAP = {
  10: 9, 11: 10, 12: 11, 13: 12, 14: 13, 15: 14, 16: 15, 17: 16, 19: 17,
  20: 18, 21: 19, 23: 21, 26: 23
};
const pad2 = (n) => String(n).padStart(2, '0');

// Плейсхолдер вокруг уже переписанного числа: следующий шаблон не примет его за исходное,
// потому что цифры перестают быть соседями текста, по которому шаблон опознаёт ссылку.
const L = '';
const R = '';
const ph = (s) => L + s + R;
const unph = (s) => s.split(L).join('').split(R).join('');

// --- 1. ФАЙЛЫ ---------------------------------------------------------------
const renames = [];
for (const [oldN, newN] of Object.entries(MAP)) {
  const from = `src/components/grade3/Dars${pad2(oldN)}.jsx`;
  if (fs.existsSync(from)) renames.push([from, `src/components/grade3/Dars${pad2(newN)}.jsx`]);
}
// одноразовые генераторы: имя должно указывать на новый номер урока
for (const [oldN, newN] of Object.entries(MAP)) {
  const from = `scripts/build-grade3-dars${pad2(oldN)}.mjs`;
  if (fs.existsSync(from)) renames.push([from, `scripts/build-grade3-dars${pad2(newN)}.mjs`]);
}
renames.sort((a, b) => a[0].localeCompare(b[0]));   // по возрастанию: Dars10 -> Dars09 первым

// --- 2. ТЕКСТ ---------------------------------------------------------------
// Дословные замены: то, что нельзя посчитать. ПК2 больше не урок, а строка плана,
// и обещание «в следующий раз проверим себя» стало неправдой.
const LITERAL = [
  ['Блок про умножение и деление мы прошли. В следующий раз соберём всё вместе и проверим себя!',
    'Блок про умножение и деление мы прошли. В следующий раз научимся умножать двузначное число!'],
  ["Ko'paytirish va bo'lish bo'limini o'tdik. Keyingi safar hammasini birga yig'amiz va o'zimizni sinaymiz!",
    "Ko'paytirish va bo'lish bo'limini o'tdik. Keyingi safar ikki xonali sonni ko'paytirishni o'rganamiz!"],
  ['повторение блока и проверочная работа', 'умножение двузначного на однозначное'],
  ["bo'lim takrori va nazorat ishi", "ikki xonalini bir xonaliga ko'paytirish"],
  ['(kryuchok 18-darsga)', '(kryuchok keyingi darsga)'],
  ["18-dars (ПК2) O'TKAZILADI", "reja satri 18 (ПК2) O'TKAZILADI"],
  ["18-dars (nazorat) o'tkazildi", "reja satri 18 (nazorat) o'tkazildi"]
];

// Шаблоны. Каждый возвращает строку с плейсхолдером — повторно не переписывается.
const RULES = [
  // lessonId: num-3-NN
  [/num-3-(\d{1,2})/g, (m, n) => (MAP[+n] ? 'num-3-' + ph(pad2(MAP[+n])) : m)],

  // файлы и компоненты: Dars17.jsx, grade3/Dars12, «Dars 17», «Dars 10.»
  // ВАЖНО: «Dars 10 amaliyoti» — это ПРАКТИКА. Она уже пронумерована подряд и после сдвига
  // теории совпадёт с ней номер в номер, поэтому её трогать нельзя.
  [/(grade([1-9])[/ ])?Dars( )?(\d{1,2})(Practice| amaliyot)?/g, (m, pre, gr, sp, n, prac) => {
    if (prac) return m;                       // DarsNNPractice.jsx и «Dars N amaliyoti»
    if (gr && gr !== '3') return m;           // grade5/Dars04.jsx и подобные
    if (!MAP[+n]) return m;
    return (pre || '') + 'Dars' + (sp || '') + ph(sp ? String(MAP[+n]) : pad2(MAP[+n]));
  }],

  // имена генераторов: build-grade3-dars17.mjs
  [/grade3-dars(\d{1,2})\.mjs/g, (m, n) => (MAP[+n] ? 'grade3-dars' + ph(pad2(MAP[+n])) + '.mjs' : m)],

  // slug: dars17-boluvchilar… (но не dars17-amaliyot — это практика)
  [/dars(\d{1,2})-(?!amaliyot)/g, (m, n) => (MAP[+n] ? 'dars' + ph(pad2(MAP[+n])) + '-' : m)],

  // UZ диапазон: «12-13-dars», «1-10-darsdan», «19-23-dars»
  [/(\d{1,2})\s*[-–]\s*(\d{1,2})(-dars\w*)/g, (m, a, b, tail) => {
    if (!MAP[+a] && !MAP[+b]) return m;       // «27-28-dars» — методика учебника
    return ph(String(MAP[+a] || a)) + '-' + ph(String(MAP[+b] || b)) + tail;
  }],

  // UZ пара: «12 va 13-darslar»
  [/(\d{1,2})(\s+va\s+)(\d{1,2})(-dars\w*)/g, (m, a, sep, b, tail) => {
    if (!MAP[+a] && !MAP[+b]) return m;
    return ph(String(MAP[+a] || a)) + sep + ph(String(MAP[+b] || b)) + tail;
  }],

  // Перечисления через запятую — только дословно. Общее правило тут опасно: в строке
  // «KONSOL (7 · 12, 1-dars uslubi…)» число 12 — множитель, а не номер урока.
  [/уроки 10, 11/g, () => 'уроки ' + ph('9') + ', ' + ph('10')],
  [/10, 11-darslar/g, () => ph('9') + ', ' + ph('10') + '-darslar'],

  // UZ одиночная ссылка: «10-dars», «16-darsdan», «12-darsdagidek»
  [/(\d{1,2})(-dars\w*)/g, (m, n, tail) => (MAP[+n] ? ph(String(MAP[+n])) + tail : m)],

  // RU: «урок 10», «Урок 15.» в заголовке, «уроки 12 и 13», «уроках 11–14».
  // Флаг i обязателен: с заглавной буквы начинается `lessonTitle`.
  [/(уро(?:к|ка|ке|ки|ков|кам|ках)\s+)(\d{1,2})(\s*(?:и|[–—-])\s*(\d{1,2}))?/gi,
    (m, word, a, tailAll, b) => {
      if (!MAP[+a] && !(b && MAP[+b])) return m;
      const first = word + ph(String(MAP[+a] || a));
      if (!b) return first;
      return first + tailAll.replace(b, ph(String(MAP[+b] || b)));
    }]
];

const textFiles = () => [
  ...fs.readdirSync('src/components/grade3').filter((f) => /^Dars\d+\.jsx$/.test(f)).map((f) => 'src/components/grade3/' + f),
  'src/books/grade3/KONTENT_3SINF.md',
  'src/lessons/grade3.js',
  ...fs.readdirSync('scripts').filter((f) => /^(grade3-|build-grade3-)/.test(f)).map((f) => 'scripts/' + f)
].filter((f) => fs.existsSync(f) && !f.endsWith('grade3-renumber.mjs'));

// --- ВЫПОЛНЕНИЕ -------------------------------------------------------------
const log = ['=== ПЕРЕИМЕНОВАНИЕ ФАЙЛОВ ==='];
for (const [from, to] of renames) {
  log.push(`  ${from}  ->  ${to}`);
  if (!DRY) execSync(`git mv "${from}" "${to}"`, { stdio: 'pipe' });
}

log.push('\n=== ТЕКСТ ===');
let changedFiles = 0;
let changedLines = 0;
for (const f of textFiles()) {
  const src = fs.readFileSync(f, 'utf8');
  let s = src;
  for (const [from, to] of LITERAL) s = s.split(from).join(to);
  for (const [re, fn] of RULES) s = s.replace(re, fn);
  s = unph(s);
  if (s === src) continue;
  changedFiles += 1;
  const a = src.split('\n');
  const b = s.split('\n');
  const diffs = [];
  for (let i = 0; i < a.length; i += 1) if (a[i] !== b[i]) diffs.push(i);
  changedLines += diffs.length;
  log.push(`\n--- ${f} (строк изменено: ${diffs.length}) ---`);
  for (const i of diffs) {
    log.push(`  ${i + 1}- ${a[i].trim().slice(0, 160)}`);
    log.push(`  ${i + 1}+ ${b[i].trim().slice(0, 160)}`);
  }
  if (!DRY) fs.writeFileSync(f, s, 'utf8');
}

log.push(`\nИТОГО: файлов ${changedFiles}, строк ${changedLines}, переименований ${renames.length}${DRY ? ' (ЧЕРНОВИК, ничего не записано)' : ''}`);
fs.writeFileSync(REPORT, log.join('\n'), 'utf8');
console.log(log.filter((l) => !/^ {2}\d+[-+] /.test(l)).join('\n'));
console.log(`\nполный отчёт со всеми строками: ${REPORT}`);
