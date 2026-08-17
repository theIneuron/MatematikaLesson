// grade6-apostrophe-fix.mjs — приводит узбекский апостроф к ASCII `'` во всём 6 классе.
//
// Зачем. CLAUDE.md §7 требует в узбекских строках ASCII-апостроф. В 6 классе он выдержан
// на 40 947 знаках, но 558 мест остались типографскими (‘ ’ ʻ ʼ). Это не косметика:
//   - на экране в соседних подписях одного слайда стоит «To'g'ri yo‘l» — два разных знака
//     в одной строке (Dars10:210), ребёнок видит разнобой;
//   - TTS чинит это только на озвучке (`toTtsMath` → `typographySafe` в Dars01.jsx:216),
//     экранный текст остаётся как есть;
//   - поиск и сверка терминов по файлам ломаются: «bo'lish» и «bo‘lish» — разные строки.
//
// Проверено перед заменой: ни одного случая, где ‘ ’ стоят ПАРНОЙ кавычкой вокруг слова.
// Все 558 — внутрисловный узбекский апостроф (o‘, g‘, ma’no). Замена однозначна.
//
// ЛОВУШКА, ради которой написан скрипт. Простой sed сломал бы сборку: строка
// `'Qo‘llash'` после замены станет `'Qo'llash'` — литерал закроется на апострофе.
// Поэтому файл разбирается на литералы, и там, где после замены внутри появился `'`,
// литерал переоткрывается двойными кавычками (или бэктиками, если есть и `"`).
// Это ровно то, чего требует чек-лист: «JS-строки с UZ-контентом — двойные кавычки».
//
// Запуск:
//   node scripts/grade6-apostrophe-fix.mjs --dry     # показать, ничего не писать
//   node scripts/grade6-apostrophe-fix.mjs           # применить
import fs from 'node:fs';
import path from 'node:path';

const DIR = 'src/components/grade6';
const DRY = process.argv.includes('--dry');
const BAD = /[‘’ʻʼ´]/g;

// Разбор файла на литералы. Возвращает список { start, end, quote, body }.
// Нужен ровно для того, чтобы отличить текст внутри строки от кода снаружи.
function stringLiterals(src) {
  const out = [];
  let i = 0;
  let prev = '';
  while (i < src.length) {
    const ch = src[i];
    if (ch === '/' && src[i + 1] === '/') { while (i < src.length && src[i] !== '\n') i++; continue; }
    if (ch === '/' && src[i + 1] === '*') {
      i += 2;
      while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) i++;
      i += 2;
      continue;
    }
    if (ch === '/' && /^[(,=:[!&|?{};+\-*%<>~^]$/.test(prev)) {
      // Регулярка — НЕПРИКОСНОВЕННА. Именно здесь живёт нормализатор TTS
      // `.replace(/[‘’ʻʼ]/g, "'")`: типографские знаки в его классе символов — это
      // то, ЧТО он ловит, а не текст урока. Первый прогон заменил их на четыре
      // ASCII-апострофа и тихо выключил защиту озвучки. Диапазон копируется как есть.
      const rxStart = i;
      i++;
      let inClass = false;
      while (i < src.length) {
        if (src[i] === '\\') { i += 2; continue; }
        if (src[i] === '[') inClass = true;
        else if (src[i] === ']') inClass = false;
        else if (src[i] === '/' && !inClass) { i++; break; }
        else if (src[i] === '\n') break;
        i++;
      }
      while (i < src.length && /[a-z]/.test(src[i])) i++;
      out.push({ start: rxStart, end: i, quote: '/', frozen: true, raw: src.slice(rxStart, i) });
      prev = '/';
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') {
      const quote = ch;
      const start = i;
      i++;
      let hasInterp = false;
      while (i < src.length) {
        const c = src[i];
        if (c === '\\') { i += 2; continue; }
        if (c === quote) { i++; break; }
        if (quote === '`' && c === '$' && src[i + 1] === '{') {
          hasInterp = true;
          let depth = 1;
          i += 2;
          while (i < src.length && depth > 0) {
            if (src[i] === '{') depth++;
            else if (src[i] === '}') depth--;
            i++;
          }
          continue;
        }
        i++;
      }
      out.push({ start, end: i, quote, hasInterp, raw: src.slice(start, i) });
      prev = 'x';
      continue;
    }
    if (!/\s/.test(ch)) prev = ch;
    i++;
  }
  return out;
}

// Перевыпуск литерала с новым телом: выбираем кавычку, при которой не нужно
// экранировать апостроф — так строка остаётся читаемой в исходнике.
//
// ВАЖНО. Тело здесь — уже исходный текст, а не значение строки: в нём `${x}` это
// живая подстановка, а `\n` — два символа. Экранировать его нельзя. Первый прогон
// скрипта на этом и споткнулся: шаблонная строка `Final natijasi: ${finalScore}`
// превратилась в `\${finalScore}`, и на узбекском финальном экране вместо числа
// печаталось бы само выражение. Поэтому шаблон возвращается как есть, а экранируем
// только при ПЕРЕВОДЕ обычной строки в шаблон.
function requote(body, origQuote) {
  if (origQuote === '`') return '`' + body + '`';           // уже шаблон — не трогаем
  if (!body.includes("'")) return "'" + body + "'";
  if (!body.includes('"')) return '"' + body + '"';
  return '`' + body.replace(/`/g, '\\`').replace(/\$\{/g, '\\${') + '`';
}

const files = fs.readdirSync(DIR).filter((f) => /\.(jsx|js)$/.test(f)).sort();
let totalFixed = 0;
let totalRequoted = 0;
const report = [];

for (const name of files) {
  const file = path.join(DIR, name);
  const src = fs.readFileSync(file, 'utf8');
  if (!BAD.test(src)) { BAD.lastIndex = 0; continue; }
  BAD.lastIndex = 0;

  const lits = stringLiterals(src);
  let out = '';
  let cursor = 0;
  let fixed = 0;
  let requoted = 0;

  for (const lit of lits) {
    // код между литералами: JSX-текст, комментарии — правим напрямую
    const between = src.slice(cursor, lit.start);
    const betweenHits = (between.match(BAD) || []).length;
    BAD.lastIndex = 0;
    fixed += betweenHits;
    out += between.replace(BAD, "'");
    BAD.lastIndex = 0;

    // регулярка копируется дословно
    if (lit.frozen) { out += lit.raw; cursor = lit.end; continue; }

    // тело литерала без кавычек
    const bodyRaw = lit.raw.slice(1, -1);
    const hits = (bodyRaw.match(BAD) || []).length;
    BAD.lastIndex = 0;
    if (!hits) { out += lit.raw; cursor = lit.end; continue; }

    const newBody = bodyRaw.replace(BAD, "'");
    BAD.lastIndex = 0;
    fixed += hits;
    // если апостроф столкнулся с кавычкой-делимитером — переоткрываем литерал
    const rebuilt = requote(newBody, lit.quote);
    if (rebuilt[0] !== lit.quote) requoted++;
    out += rebuilt;
    cursor = lit.end;
  }
  const tail = src.slice(cursor);
  fixed += (tail.match(BAD) || []).length;
  BAD.lastIndex = 0;
  out += tail.replace(BAD, "'");
  BAD.lastIndex = 0;

  if (out !== src) {
    if (!DRY) fs.writeFileSync(file, out, 'utf8');
    totalFixed += fixed;
    totalRequoted += requoted;
    report.push({ name, fixed, requoted });
  }
}

console.log(DRY ? 'ПРОБНЫЙ ПРОГОН (файлы не изменены)\n' : 'Применено\n');
for (const r of report) {
  console.log(`  ${String(r.fixed).padStart(4)} апострофов  ${String(r.requoted).padStart(3)} перекавычено  ${r.name}`);
}
console.log(`\nИТОГО: ${totalFixed} апострофов в ${report.length} файлах, ${totalRequoted} литералов сменили кавычку.`);
