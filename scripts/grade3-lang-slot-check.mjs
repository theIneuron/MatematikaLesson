// grade3-lang-slot-check.mjs — русское поле должно быть русским, узбекское узбекским.
//
// Замечание методиста 2026-08-10: «посмотри, чтобы языки не путались, то есть русский язык
// на узбекской озвучке и наоборот». Проверка `grade3-lang-mix-check` смотрит только подписи,
// вшитые в рисунок. Здесь берём сам CONTENT и смотрим КАЖДУЮ пару `{ ru, uz }` — и текст на
// экране, и то, что произносится.
//
// Ошибка:
//   - в `ru` нет кириллицы, но есть слова латиницей (узбекский текст лёг в русское поле);
//   - в `uz` есть кириллица (русский текст лёг в узбекское поле).
// Предупреждение:
//   - `ru` и `uz` совпадают дословно и это не число и не формула (перевод забыли).
//
// Нейтральное пропускаем: числа, знаки, единицы (sm, kg, m²), одиночные буквы, римские цифры.
//
// Запуск: node scripts/grade3-lang-slot-check.mjs [src/components/grade3/Dars19.jsx | --all]
import fs from 'node:fs';
import path from 'node:path';

const DIR = 'src/components/grade3';
const args = process.argv.slice(2);
const files = args.length && !args[0].startsWith('--')
  ? args
  : fs.readdirSync(DIR).filter((x) => /^Dars\d+\.jsx$/.test(x)).sort().map((f) => path.join(DIR, f));

const CYR = /[А-Яа-яЁё]/;
// слова, одинаковые в обоих языках
const SAME = new Set(['sm', 'dm', 'mm', 'km', 'm', 'g', 'kg', 'sm²', 'm²', 'ml', 'l',
  'x', 'a', 'b', 'c', 'S', 'P', 'V', 'XII', 'IX', 'XIV', 'XV', 'algebra', 'al-jabr',
  'kg', 'Bit', 'Lumo', 'Anvar', 'Zuhra', 'Jasur', "Ra'no", 'Dilnoza', 'Sardor']);

// ключи, где строка — не текст для ученика, а устройство экрана
const STRUCT = new Set(['id', 'kind', 'role', 'type', 'mech', 'fig', 'icon', 'cls', 'className',
  'color', 'tone', 'layout', 'slot', 'key', 'name', 'variant', 'scene', 'anim', 'shape', 'unit',
  'scope', 'template', 'goal', 'mode', 'view', 'style', 'qk', 'ck', 'ansKey', 'fig_shape']);
// римские цифры и формулы одинаковы в обоих языках
const NEUTRAL_TXT = /^[\sIVXLCMDivxlcmd0-9+\-−·:×÷=<>≤≥?.,()[\]{}/|°'’%№²³]*$/;
// строки-без-перевода ищем только в CONTENT: в SCREEN_META строки — это устройство урока
const PLAIN_IN = 'CONTENT';
// общий код: часть уроков рисует свои данные экранами кита
const KIT = fs.existsSync('src/components/grade3/_kit/index.jsx') ? fs.readFileSync('src/components/grade3/_kit/index.jsx', 'utf8') : '';

let err = 0;
let warn = 0;
const rows = [];

// Один объект-данные из файла, прочитанный как настоящий JS.
const readObj = (src, decl) => {
  const a = src.indexOf(decl);
  if (a < 0) return null;
  const open = decl.trim().endsWith('[') ? '\n];' : '\n};';
  const b = src.indexOf(open, a);
  if (b < 0) return null;
  const body = src.slice(a + decl.length - 1, b + 2);
  try { return eval(`(${body})`); } catch { return null; }
};

for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  const name = path.basename(file);
  // проверяем ВСЕ данные урока, а не только CONTENT: подписи экранов, мостики и финал
  // тоже видит ученик, и там язык путался ровно так же
  const blocks = {
    CONTENT: readObj(src, 'const CONTENT = {'),
    LESSON_META: readObj(src, 'const LESSON_META = {'),
    SCREEN_META: readObj(src, 'const SCREEN_META = ['),
    BRIDGES: readObj(src, 'const BRIDGES = {'),
    S14_PAYOFF: readObj(src, 'const S14_PAYOFF = {')
  };
  if (!blocks.CONTENT) { rows.push(`${name}: CONTENT не прочитан`); err++; continue; }

  // какие `*_uz` вообще читаются кодом — урока или общего кита
  const code = src + '\n' + KIT;
  const readsUz = new Set([...code.matchAll(/\b([a-z_0-9]+_uz)\b/g)]
    .map((m) => m[1])
    .filter((k) => new RegExp(`[.\\[]\\s*${k}\\b|\\b${k}\\s*\\]`).test(code) || new RegExp(`\\.${k}\\b`).test(code)));

  const pairs = [];
  const walk = (node, p) => {
    if (!node || typeof node !== 'object') return;
    const hasRu = node.ru !== undefined;
    const hasUz = node.uz !== undefined;
    // одностороннее поле — беда тихая: кит при отсутствии `uz` подставит русское
    // (_kit/index.jsx:118), и на узбекском экране зазвучит русский
    if (hasRu !== hasUz) { rows.push(`${name} ОШИБКА ${p.join('.')} — есть только ${hasRu ? 'ru' : 'uz'}, второй язык отсутствует`); err++; }
    if (typeof node.ru === 'string' && typeof node.uz === 'string') pairs.push({ p: p.join('.'), ru: node.ru, uz: node.uz });
    else if (Array.isArray(node.ru) && Array.isArray(node.uz)) {
      if (node.ru.length !== node.uz.length) { rows.push(`${name} ОШИБКА ${p.join('.')} — сегментов ru ${node.ru.length}, uz ${node.uz.length}`); err++; }
      node.ru.forEach((v, i) => { if (typeof v === 'string' && typeof node.uz[i] === 'string') pairs.push({ p: `${p.join('.')}[${i}]`, ru: v, uz: node.uz[i] }); });
    }
    for (const [k, v] of Object.entries(node)) {
      if (k === 'ru' || k === 'uz') continue;
      // вторая форма пары в уроках: `line` и `line_uz` рядом (или `labels_ru`/`labels_uz`).
      if (k.endsWith('_uz')) continue;
      const uzKey = node[`${k}_uz`] !== undefined ? `${k}_uz`
        : (k.endsWith('_ru') && node[k.replace(/_ru$/, '_uz')] !== undefined ? k.replace(/_ru$/, '_uz') : null);
      if (uzKey) {
        // Пара `key` + `key_uz` работает, только если КОД её читает. На уроке 21 узбекский
        // fig_line_uz лежал в данных, а на экран уходил один fig_line — узбек видел русское.
        if (!readsUz.has(uzKey)) { rows.push(`${name} ОШИБКА ${[...p, uzKey].join('.')} — узбекский вариант есть, но код его не читает`); err++; }
        const u = node[uzKey];
        if (typeof v === 'string' && typeof u === 'string') pairs.push({ p: [...p, k].join('.'), ru: v, uz: u });
        else if (Array.isArray(v) && Array.isArray(u)) {
          if (v.length !== u.length) { rows.push(`${name} ОШИБКА ${[...p, k].join('.')} — строк ru ${v.length}, uz ${u.length}`); err++; }
          v.forEach((x, i) => { if (typeof x === 'string' && typeof u[i] === 'string') pairs.push({ p: `${[...p, k].join('.')}[${i}]`, ru: x, uz: u[i] }); });
        }
        continue;
      }
      // Строка БЕЗ пары языков рисуется одинаково в обоих: русская подпись останется на
      // узбекском экране. Так на уроке 51 в узбекском стояло «15 = 1 десяток и 5».
      if (typeof v === 'string' && !STRUCT.has(k)) flagPlain(v, [...p, k].join('.'));
      else if (Array.isArray(v)) v.forEach((x, i) => { if (typeof x === 'string' && !STRUCT.has(k)) flagPlain(x, `${[...p, k].join('.')}[${i}]`); else walk(x, [...p, `${k}[${i}]`]); });
      else walk(v, [...p, k]);
    }
  };
  const flagPlain = (v, where) => {
    if (!where.startsWith(PLAIN_IN)) return;
    // кириллица на узбекском экране не нужна НИКОГДА, даже одной буквой сокращения (см, кг)
    if (!CYR.test(v) && NEUTRAL_TXT.test(v)) return;
    if (CYR.test(v)) { rows.push(`${name} ОШИБКА ${where} — текст без перевода, виден на обоих языках: «${v.slice(0, 60)}»`); err++; return; }
    const words = (v.match(/[A-Za-zА-Яа-яЁё']{3,}/g) || []).filter((w) => !SAME.has(w) && !SAME.has(w.toLowerCase()));
    if (!words.length) return;
    rows.push(`${name} ОШИБКА ${where} — текст без перевода, виден на обоих языках: «${v.slice(0, 60)}»`);
    err++;
  };
  for (const [bn, obj] of Object.entries(blocks)) if (obj) walk(obj, [bn]);

  for (const { p, ru, uz } of pairs) {
    const words = (s) => (s.match(/[A-Za-z']{3,}/g) || []).filter((w) => !SAME.has(w));
    const ruWords = words(ru);
    if (!CYR.test(ru) && ruWords.length >= 2) { rows.push(`${name} ОШИБКА ${p}.ru — латиница вместо русского: «${ru.slice(0, 70)}»`); err++; }
    if (CYR.test(uz)) { rows.push(`${name} ОШИБКА ${p}.uz — кириллица в узбекском: «${uz.slice(0, 70)}»`); err++; }
    if (ru === uz && (ru.match(/[A-Za-zА-Яа-я]{4,}/g) || []).some((w) => !SAME.has(w))) {
      rows.push(`${name} ВНИМАНИЕ ${p} — ru и uz дословно совпали: «${ru.slice(0, 60)}»`); warn++;
    }
  }
}

rows.forEach((r) => console.log(r));
console.log(err || warn ? `\nошибок: ${err}, предупреждений: ${warn}` : `чисто: языки на своих местах, уроков ${files.length}`);
process.exit(err ? 1 : 0);
