#!/usr/bin/env node
// ============================================================================
// scripts/check-grade4.mjs — ПРОВЕРКА УРОКА 4 КЛАССА
//
// Запуск:
//   node scripts/check-grade4.mjs                       все уроки в src/components/grade4
//   node scripts/check-grade4.mjs Dars01                конкретный урок
//
// Проверяет то, что не видят ни сборка, ни линтер, ни глаз при просмотре урока:
// апострофы, кириллицу в узбекском, регистр обращения, род в русском прошедшем
// времени, запрещённые символы и цифры в озвучке, число вариантов ответа и наличие
// разбора на каждый неверный вариант.
//
// Почему такой скрипт нужен. Проверка урока 1 вручную нашла 82 не-ASCII апострофа,
// длинное тире и кавычки в озвучке и узбекскую озвучку с цифрами там, где русская
// произносит числа словами. Ни одно из этих нарушений не заметно при просмотре
// урока в браузере, а исправлять их после публикации дороже, чем поймать заранее.
//
// Модуль самодостаточен: правила и числительные лежат здесь же, чтобы проверка не
// зависела ни от одного файла урока.
// ============================================================================

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { pathToFileURL } from 'node:url';

const LESSON_DIR = path.resolve('src/components/grade4');
const NBSP = String.fromCharCode(160);
const NUM_RE = new RegExp(`\\d[\\d\\s${NBSP}]*\\d|\\d`, 'g');

// ---------------------------------------------------------------------------
// ЧИСЛА СЛОВАМИ — чтобы сообщение об ошибке сразу давало готовую замену.
// Узбекские формы — по чтению многозначных чисел в учебнике 4 класса; спорные
// случаи (круглая тысяча без «bir») помечены в коде.
// ---------------------------------------------------------------------------
const RU_ONES_M = ['', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять'];
const RU_ONES_F = ['', 'одна', 'две', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять'];
const RU_TEENS = ['десять', 'одиннадцать', 'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать',
  'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать'];
const RU_TENS = ['', '', 'двадцать', 'тридцать', 'сорок', 'пятьдесят', 'шестьдесят', 'семьдесят', 'восемьдесят', 'девяносто'];
const RU_HUNDREDS = ['', 'сто', 'двести', 'триста', 'четыреста', 'пятьсот', 'шестьсот', 'семьсот', 'восемьсот', 'девятьсот'];
const UZ_ONES = ['', 'bir', 'ikki', 'uch', "to'rt", 'besh', 'olti', 'yetti', 'sakkiz', "to'qqiz"];
const UZ_TENS = ['', "o'n", 'yigirma', "o'ttiz", 'qirq', 'ellik', 'oltmish', 'yetmish', 'sakson', "to'qson"];
const RU_SCALES = [null, { f: ['тысяча', 'тысячи', 'тысяч'], fem: true }, { f: ['миллион', 'миллиона', 'миллионов'] }];
const UZ_SCALES = [null, 'ming', 'million'];

const pluralRu = (n, [one, few, many]) => {
  const a = n % 10;
  const b = n % 100;
  if (a === 1 && b !== 11) return one;
  if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return few;
  return many;
};
const tripleRu = (n, fem) => {
  const out = [];
  const h = Math.floor(n / 100);
  const rest = n % 100;
  if (h) out.push(RU_HUNDREDS[h]);
  if (rest >= 10 && rest < 20) out.push(RU_TEENS[rest - 10]);
  else {
    const t = Math.floor(rest / 10);
    const o = rest % 10;
    if (t) out.push(RU_TENS[t]);
    if (o) out.push((fem ? RU_ONES_F : RU_ONES_M)[o]);
  }
  return out.join(' ');
};
const tripleUz = (n) => {
  const out = [];
  const h = Math.floor(n / 100);
  const rest = n % 100;
  if (h) out.push(h === 1 ? 'bir yuz' : `${UZ_ONES[h]} yuz`);
  const t = Math.floor(rest / 10);
  const o = rest % 10;
  if (t) out.push(UZ_TENS[t]);
  if (o) out.push(UZ_ONES[o]);
  return out.join(' ');
};
const numToWords = (value, lang) => {
  const n = Number(String(value).replace(new RegExp(`[\\s${NBSP}]`, 'g'), ''));
  if (!Number.isInteger(n) || n < 0) return '';
  if (n === 0) return lang === 'uz' ? 'nol' : 'ноль';
  if (n === 100 && lang === 'uz') return 'yuz';
  const groups = [];
  let rest = n;
  while (rest > 0) { groups.push(rest % 1000); rest = Math.floor(rest / 1000); }
  if (groups.length > RU_SCALES.length) return '';
  const parts = [];
  for (let gi = groups.length - 1; gi >= 0; gi -= 1) {
    const g = groups[gi];
    if (!g) continue;
    if (lang === 'uz') {
      // Круглая тысяча читается «ming», без «bir».
      parts.push([gi > 0 && g === 1 ? '' : tripleUz(g), UZ_SCALES[gi]].filter(Boolean).join(' '));
    } else {
      const sc = RU_SCALES[gi];
      parts.push([gi > 0 && g === 1 ? '' : tripleRu(g, !!sc?.fem), sc ? pluralRu(g, sc.f) : ''].filter(Boolean).join(' '));
    }
  }
  return parts.join(' ').replace(/\s{2,}/g, ' ').trim();
};

// ---------------------------------------------------------------------------
// ПРАВИЛА. Состав символьных классов выписан в комментарии: подмена типографского
// апострофа на ASCII глазами неотличима, и однажды такое правило пометило ошибкой
// каждую узбекскую строку.
// ---------------------------------------------------------------------------
// « » “ ” „ ‟ ‘ ’ — без ASCII " и '
const FORBIDDEN_IN_AUDIO = [
  { name: 'типографские кавычки', re: /[«»“”„‟‘’]/ },
  { name: 'графика столбика', re: /[─━│┌┐└┘├┤┬┴┼]/ },
  { name: 'галочки и крестики', re: /[✓✔✗✘]/ },
  { name: 'знаки операций', re: /[=<>≥≤×÷±]/, hint: 'напиши словами: равно, больше, меньше, умножить' },
  { name: 'плюс или минус знаком', re: /\s[+−]\s/, hint: 'напиши словами: плюс, минус' },
  { name: 'процент или валюта', re: /[%$€]/ },
  { name: 'дробь цифрами', re: /\d+\s*\/\s*\d+/, hint: 'дроби только словами' },
  { name: 'двоеточие в конце', re: /:\s*$/ },
  { name: 'длинное тире', re: /[—–]/, hint: 'ту же паузу даёт запятая' },
];
// ʻ ʼ ‘ ’ — модификаторы и типографские апострофы
const APOSTROPHES = /[ʻʼ‘’]/;
const CYRILLIC = /[Ѐ-ӿ]/;
const UZ_SEN = /\b(sen|senga|sening|seni|senda|sendan)\b/i;
// \b с кириллицей в JavaScript не работает: \w это [A-Za-z0-9_]. Границы — группами.
const RU_YOU = '(?<![а-яё])ты(?![а-яё])';
const RU_GENDERED = [
  new RegExp(`${RU_YOU}\\s+(?:[а-яё]+\\s+){0,2}[а-яё]{2,}л(?:ся|а|ась)?(?![а-яё])`, 'i'),
  new RegExp(`${RU_YOU}\\s+(?:[а-яё]+\\s+){0,2}(?:ошибся|ошиблась|смог|смогла|помог|помогла)(?![а-яё])`, 'i'),
];
// Родовые формы обращения без «ты» рядом: пол ученика платформе неизвестен.
const RU_GENDERED_WORDS = /(?<![а-яё])(внимателен|внимательна|уверен|уверена|готов|готова|молодец, ты \w+л)(?![а-яё])/i;

/**
 * Достаёт объект-литерал `const ИМЯ = { … };` из текста файла.
 *
 * Скобки считаются с учётом строк и комментариев: в контенте полно апострофов и
 * фигурных скобок внутри текста, и наивный поиск `};` обрезал бы объект на первой
 * же реплике вида «то'g'ri». Строки распознаются по кавычкам с учётом экранирования.
 */
const extractObject = (source, name) => {
  const start = source.indexOf(`const ${name} = {`);
  if (start < 0) return null;
  let i = source.indexOf('{', start);
  let depth = 0;
  let quote = null;
  for (; i < source.length; i += 1) {
    const ch = source[i];
    if (quote) {
      if (ch === '\\') { i += 1; continue; }
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { quote = ch; continue; }
    if (ch === '/' && source[i + 1] === '/') { i = source.indexOf('\n', i); if (i < 0) break; continue; }
    if (ch === '{') depth += 1;
    else if (ch === '}') {
      depth -= 1;
      if (depth === 0) {
        const literal = source.slice(source.indexOf('{', start), i + 1);
        try {
          return vm.runInNewContext(`(${literal})`, {}, { timeout: 2000 });
        } catch {
          return null;
        }
      }
    }
  }
  return null;
};

const walk = (node, at, inAudio, lang, out) => {
  if (typeof node === 'string') { out.push({ path: at, text: node, lang, inAudio }); return; }
  if (Array.isArray(node)) { node.forEach((v, i) => walk(v, `${at}[${i}]`, inAudio, lang, out)); return; }
  if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      const nextLang = k === 'ru' || k === 'uz' ? k : lang;
      walk(v, at ? `${at}.${k}` : k, inAudio || k === 'audio', nextLang, out);
    }
  }
};

const checkLesson = async (name) => {
  const errors = [];
  const warnings = [];
  const jsxPath = path.join(LESSON_DIR, `${name}.jsx`);
  const jsxSource = await readFile(jsxPath, 'utf8');

  // --- код урока -----------------------------------------------------------
  if (/FREE_NAV\s*=\s*true/.test(jsxSource)) {
    errors.push(`${name}.jsx: FREE_NAV = true — переход открыт без ответа, урок проходится молча`);
  }
  const aposInJsx = (jsxSource.match(new RegExp(APOSTROPHES, 'g')) || []).length;
  if (aposInJsx) errors.push(`${name}.jsx: не-ASCII апострофов ${aposInJsx}; в узбекском только ASCII '`);
  const relImports = [...jsxSource.matchAll(/from\s+['"](\.[^'"]+)['"]/g)].map((m) => m[1]);
  if (relImports.length) {
    warnings.push(`${name}.jsx: относительные импорты (${relImports.join(', ')}) — для ЛМС урок должен быть одним файлом`);
  }

  // --- контент -------------------------------------------------------------
  // Контент лежит внутри файла урока (требование ЛМС: один файл). Импортировать
  // .jsx в Node нельзя — JSX он не разбирает, поэтому объект CONTENT вырезается из
  // текста по фигурным скобкам и вычисляется в песочнице. Это чистые данные: ни
  // вызовов, ни JSX внутри, поэтому вычисление безопасно.
  let content = extractObject(jsxSource, 'CONTENT');
  if (!content) {
    // Старая схема: контент отдельным файлом рядом.
    const sideCar = path.join(LESSON_DIR, `${name}Content.js`);
    const side = await import(pathToFileURL(sideCar).href).catch(() => null);
    content = side?.CONTENT;
    if (content) warnings.push(`${name}: контент в отдельном файле ${name}Content.js — для ЛМС нужен один файл`);
  }
  if (!content) {
    warnings.push(`${name}: CONTENT не найден, проверены только код и текст файла`);
    return { name, errors, warnings };
  }

  const strings = [];
  walk(content, '', false, null, strings);

  for (const s of strings) {
    if (APOSTROPHES.test(s.text)) errors.push(`${s.path}: не-ASCII апостроф`);
    if (s.lang === 'uz' && CYRILLIC.test(s.text)) errors.push(`${s.path}: кириллица в узбекском`);
    if (s.lang === 'uz' && UZ_SEN.test(s.text)) errors.push(`${s.path}: обращение sen; в узбекском siz`);
    if (s.lang === 'ru' && RU_GENDERED.some((re) => re.test(s.text))) {
      errors.push(`${s.path}: род в прошедшем времени после «ты»; пол ученика неизвестен`);
    }
    if (s.lang === 'ru' && RU_GENDERED_WORDS.test(s.text)) {
      warnings.push(`${s.path}: родовая форма «${RU_GENDERED_WORDS.exec(s.text)[1]}»; нужна безродовая`);
    }
    if (!s.inAudio) continue;
    for (const rule of FORBIDDEN_IN_AUDIO) {
      const m = rule.re.exec(s.text);
      if (m) errors.push(`${s.path}: в озвучке ${rule.name} («${m[0].trim()}»)${rule.hint ? `; ${rule.hint}` : ''}`);
    }
    const nums = s.text.match(NUM_RE);
    if (nums) {
      const words = nums.map((n) => `${n} → «${numToWords(n, s.lang || 'ru')}»`).join('; ');
      errors.push(`${s.path}: цифры в озвучке; ${words}`);
    }
    const wordCount = s.text.split(/\s+/).filter(Boolean).length;
    if (wordCount > 28) warnings.push(`${s.path}: сегмент ${wordCount} слов, норма до 28 — раздели`);
  }

  // --- варианты ответа -----------------------------------------------------
  const visit = (node, at) => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) { node.forEach((v, i) => visit(v, `${at}[${i}]`)); return; }
    if (Array.isArray(node.options)) {
      const n = node.options.length;
      // Решение методиста 2026-08-04: вариантов ровно четыре. Три допустимы, когда
      // область ответа закрыта (больше, меньше, равно) или это прогноз на входе.
      if (n > 4) errors.push(`${at}: вариантов ${n}; допустимо не больше четырёх`);
      if (n === 3 && node.closedSet !== true) {
        warnings.push(`${at}: вариантов три; норма четыре, иначе пометь closedSet: true`);
      }
      // Разбор неверного ответа в уроках этого класса записан по-разному:
      // массивом по вариантам (wrong, audio.on_wrong) или одним текстом на весь
      // вопрос (wrongText, hint). Эталон §7 требует РАЗБОР НА КАЖДЫЙ неверный
      // вариант: он должен называть ту стратегию, по которой ребёнок ошибся.
      const perOption = node.wrong || node.audio?.on_wrong;
      const single = node.wrongText || node.hint;
      if (Array.isArray(perOption)) {
        if (perOption.length !== n) {
          errors.push(`${at}: разборов ${perOption.length}, вариантов ${n}; нужен свой разбор на каждый неверный`);
        }
      } else if (single) {
        warnings.push(`${at}: разбор один на все неверные варианты; эталон требует свой на каждый`);
      } else {
        warnings.push(`${at}: нет разбора неверного ответа`);
      }
    }
    for (const [k, v] of Object.entries(node)) visit(v, at ? `${at}.${k}` : k);
  };
  visit(content, '');

  return { name, errors, warnings };
};

const arg = process.argv[2];
const names = arg
  ? [arg.replace(/\.jsx$/, '')]
  : (await readdir(LESSON_DIR)).filter((f) => /^Dars\d+\.jsx$/.test(f)).map((f) => f.replace('.jsx', '')).sort();

let failed = false;
for (const name of names) {
  const r = await checkLesson(name);
  console.log(`\n=== ${r.name} ===`);
  if (r.warnings.length) {
    console.log(`предупреждения (${r.warnings.length}):`);
    r.warnings.forEach((w) => console.log(`  ~ ${w}`));
  }
  if (r.errors.length) {
    failed = true;
    console.log(`ОШИБКИ (${r.errors.length}):`);
    r.errors.forEach((e) => console.log(`  ! ${e}`));
  } else {
    console.log('ошибок нет');
  }
}
if (failed) process.exitCode = 1;
