// СМЕШЕНИЕ ЯЗЫКОВ в 6 классе. Ищет четыре беды, каждая уже случалась:
//
//   1) ОБЩАЯ строка вместо узла {ru,uz,en}. Её показывают все три языка сразу,
//      поэтому узбек видел «6 часов», а англичанин «12 см». Кириллица считается
//      любая, даже одной буквой: «600 г», «5 л», «1 и 24».
//   2) кириллица внутри uz или en;
//   3) латинское слово внутри ru (кроме обозначений и формул);
//   4) чужое служебное слово внутри строки: английское «and» в узбекской,
//      узбекское «to'g'ri» в английской.
//
// Плюс то, что лежит ВНЕ CONTENT: вызовы tri(lang, ru, uz, en) в сценах и
// кириллический литерал в разметке без tri() — такую подпись тоже видят все три.
//
// Запуск: node scripts/grade6-lang-mix.mjs
// Выход: 1, если есть замечания.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const LANGS = ['ru', 'uz', 'en'];
const CYR = /[А-Яа-яЁё]/;
// Латиница, допустимая в русской строке: обозначения, единицы, формулы.
// В русской строке законны: обозначения и их произведения (a, ab, ah, abc),
// римские цифры, единицы и ИМЕНА собственные — они пишутся с большой буквы.
const RU_OK_LATIN = /^([a-z]{1,3}|[A-Z][A-Za-z]*|[IVXLCM]+|pi|cm|mm|dm|km|kg|g|l|ml|sm|min|max)$/;
const LATIN_WORD = /[A-Za-z']{2,}/g;
// Маркеры чужого языка — только однозначные служебные слова.
const EN_MARK = /(?<![A-Za-z])(the|and|with|from|each|then|this|that|hours|days|cannot|answer)(?![A-Za-z])/i;
const UZ_MARK = /(?<![A-Za-z'])(va|bo'ladi|yo'q|ko'p|uchun|qancha|nechta|soat|barobar|teng|to'g'ri)(?![A-Za-z'])/i;
// Технические поля на экран не попадают; языковые двойники помечены суффиксом.
const TECH = /\.(kind|bin|tone|id|type|template|scope|key|mode|shape|pair)(\[\d+\])?$/;
const TWIN = /_uz(\[\d+\])?$|_en(\[\d+\])?$|_ru(\[\d+\])?$/;

// Вырезает литерал объекта по имени объявления. Комментарии пропускаются:
// апостроф в «don't» иначе открыл бы строку и счёт скобок поехал бы.
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
    else if (ch === '}') { depth -= 1; if (!depth) return { text: code.slice(start, j + 1), from: start, to: j }; }
  }
  return null;
}

const shared = [];
const cyrIn = [];
const latIn = [];
const mark = [];
const triHits = [];
const bareHits = [];
const rawRender = [];

const walk = (value, trail, lesson) => {
  if (value === null || value === undefined) return;
  if (typeof value === 'string') {
    if (TECH.test(trail) || TWIN.test(trail)) return;
    const words = value.match(/[А-Яа-яЁё]+|[A-Za-z']{2,}/g) || [];
    const real = words.filter((w) => !/^(sm|dm|km|mm|cm|kg|ml|pi|max|min)$/i.test(w));
    if (real.length) shared.push(`${lesson} ${trail}: ${value.slice(0, 70)}   [${real.slice(0, 4).join(', ')}]`);
    return;
  }
  if (Array.isArray(value)) { value.forEach((v, i) => walk(v, `${trail}[${i}]`, lesson)); return; }
  if (typeof value !== 'object') return;
  // Финальный тест собирает варианты как o.ru / o.uz / o.en у КАЖДОГО элемента.
  // Плоская строка среди узлов даст пустую кнопку, и её не видно ни в аудите
  // контента, ни в рендере первого экрана.
  if (Array.isArray(value.opts_i18n)) {
    value.opts_i18n.forEach((o, i) => {
      const okNode = o && typeof o === 'object' && LANGS.every((l) => typeof o[l] === 'string');
      if (!okNode) rawRender.push(`${lesson} ${trail}.opts_i18n[${i}]: не узел {ru,uz,en} — кнопка будет пустой`);
    });
  }
  const keys = Object.keys(value);
  const isNode = LANGS.some((l) => l in value) && keys.every((k) => LANGS.includes(k));
  if (!isNode) { keys.forEach((k) => walk(value[k], trail ? `${trail}.${k}` : k, lesson)); return; }

  ['uz', 'en'].forEach((l) => {
    const v = value[l];
    (Array.isArray(v) ? v : [v]).forEach((s, i) => {
      if (typeof s !== 'string') return;
      const at = `${lesson} ${trail}.${l}${Array.isArray(v) ? `[${i}]` : ''}`;
      if (CYR.test(s)) cyrIn.push(`${at}: ${s.slice(0, 70)}`);
      const bad = (l === 'uz' ? EN_MARK : UZ_MARK).exec(s);
      if (bad) mark.push(`${at}: [${bad[0]}] ${s.slice(0, 70)}`);
    });
  });
  const ru = value.ru;
  (Array.isArray(ru) ? ru : [ru]).forEach((s, i) => {
    if (typeof s !== 'string') return;
    const hits = (s.match(LATIN_WORD) || []).filter((w) => !RU_OK_LATIN.test(w));
    if (hits.length) {
      latIn.push(`${lesson} ${trail}.ru${Array.isArray(ru) ? `[${i}]` : ''}: ${s.slice(0, 70)}   [${[...new Set(hits)].slice(0, 4).join(', ')}]`);
    }
  });
};

// Аргументы вызова tri(...) с учётом строк и вложенных скобок.
function triArgs(src, from) {
  const open = src.indexOf('(', from);
  if (open < 0) return null;
  let depth = 0; let inStr = null; const args = []; let cur = '';
  for (let i = open; i < src.length; i += 1) {
    const ch = src[i];
    if (inStr) { cur += ch; if (ch === inStr && src[i - 1] !== '\\') inStr = null; continue; }
    if (ch === "'" || ch === '"' || ch === '`') { inStr = ch; cur += ch; continue; }
    if (ch === '(' || ch === '[' || ch === '{') { depth += 1; if (depth > 1) cur += ch; continue; }
    if (ch === ')' || ch === ']' || ch === '}') {
      depth -= 1;
      if (!depth) { args.push(cur.trim()); return { args, end: i }; }
      cur += ch; continue;
    }
    if (ch === ',' && depth === 1) { args.push(cur.trim()); cur = ''; continue; }
    cur += ch;
  }
  return null;
}
const unquote = (s) => {
  const m = s.match(/^(['"`])([\s\S]*)\1$/);
  return m ? m[2].replace(/\\'/g, "'") : null;
};

for (let n = 1; n <= 46; n += 1) {
  const label = `Dars${String(n).padStart(2, '0')}`;
  const file = path.resolve(`src/components/grade6/${label}.jsx`);
  const src = fs.readFileSync(file, 'utf8');
  const lit = cutLiteral(src, 'const CONTENT = {');
  walk(vm.runInNewContext(`(${lit.text})`, {}, { timeout: 5000 }), '', label);

  // Прибор урока рисует свои варианты сам. Если вариант стал узлом, а в разметку
  // уходит `{o}` без t(), в кнопку попадёт объект и экран упадёт. Правильно —
  // `{t(o)}` для слов и `{mt(t(o))}` там, где в варианте математика.
  if (/play_opts:\s*\[\s*\n?\s*\{\s*ru:/.test(src) && />\{o\}<\/button>/.test(src)) {
    rawRender.push(`${label}: play_opts — узлы, а рендер оставлен как {o}; нужен {t(o)} или {mt(t(o))} и key={i}`);
  }

  // tri(lang, ru, uz, en) в сценах
  let at = 0;
  for (;;) {
    at = src.indexOf('tri(', at);
    if (at < 0) break;
    const parsed = triArgs(src, at + 3);
    const line = src.slice(0, at).split('\n').length;
    at += 4;
    if (!parsed || parsed.args.length < 4) continue;
    const [, ruRaw, uzRaw, enRaw] = parsed.args;
    const ru = unquote(ruRaw); const uz = unquote(uzRaw); const en = unquote(enRaw);
    const where = `${label}:${line}`;
    if (uz && CYR.test(uz)) triHits.push(`${where} кириллица в uz: ${uz}`);
    if (en && CYR.test(en)) triHits.push(`${where} кириллица в en: ${en}`);
    if (uz && EN_MARK.test(uz)) triHits.push(`${where} английское слово в uz: ${uz}`);
    if (en && UZ_MARK.test(en)) triHits.push(`${where} узбекское слово в en: ${en}`);
    if (ru && uz && ru === uz && CYR.test(ru)) triHits.push(`${where} uz повторяет ru: ${ru}`);
  }

  // Кириллический литерал в разметке без tri(). Пропускаем то, что УЖЕ разложено
  // по языкам: CONTENT и план озвучки фильма S1_AUDIO_PLAN в уроке 1.
  const skip = [lit, cutLiteral(src, 'const S1_AUDIO_PLAN = {')].filter(Boolean)
    .map((x) => [src.slice(0, x.from).split('\n').length, src.slice(0, x.to).split('\n').length]);
  src.split('\n').forEach((ln, i) => {
    const lineNo = i + 1;
    if (skip.some(([a, b]) => lineNo >= a && lineNo <= b)) return;
    if (!CYR.test(ln)) return;
    const t = ln.trim();
    if (t.startsWith('//') || t.startsWith('*') || t.startsWith('/*')) return;
    if (ln.includes('tri(')) return;
    // однострочный языковой узел — не общая подпись
    if (/^\s*(ru|uz|en):/.test(ln) || /\{\s*ru:/.test(ln)) return;
    const strs = ln.match(/'[^']*[А-Яа-яЁё][^']*'|"[^"]*[А-Яа-яЁё][^"]*"|>[^<>{]*[А-Яа-яЁё][^<>{]*</g);
    if (strs) bareHits.push(`${label}:${lineNo} ${strs.join(' | ').slice(0, 100)}`);
  });
}

// Мёртвые данные: поля, которые никуда не рендерятся. Их держим списком, чтобы
// проверка не шумела, но и не молчала о новых случаях.
const KNOWN_DEAD = [
  /^Dars01 s_error\.t2_opts\[/,   // рядом лежат t2_opts_uz и t2_opts_en
  /^Dars33 s_task\.items\[1\]\.opts\[1\]: 12xy/,  // формула
];

const realShared = shared.filter((x) => !KNOWN_DEAD.some((re) => re.test(x)));
const groups = [
  ['ОБЩАЯ строка вместо узла {ru,uz,en}', realShared],
  ['кириллица в uz или en', cyrIn],
  ['латинское слово в ru', latIn],
  ['чужое слово внутри строки', mark],
  ['tri(): смешение', triHits],
  ['кириллица в разметке без tri()', bareHits],
  ['узел ушёл в рендер как есть', rawRender],
];

let total = 0;
groups.forEach(([title, list]) => {
  total += list.length;
  console.log(`\n=== ${title}: ${list.length} ===`);
  list.slice(0, 60).forEach((x) => console.log('  ' + x));
  if (list.length > 60) console.log(`  … ещё ${list.length - 60}`);
});
console.log(`\nВСЕГО замечаний: ${total}`);
if (total) process.exitCode = 1;
