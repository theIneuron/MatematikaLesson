// grade3-block-check.mjs — сквозная проверка ГРУППЫ уроков (блока).
//
// Аудит эталона (`grade3-lesson-audit.mjs`) смотрит на урок в одиночку и не видит ошибок,
// которые появляются только в блоке: одна и та же сцена в двух уроках, повтор примера из
// финала соседа, ссылка на урок, которого нет, обещание в крючке, не совпадающее с темой
// следующего урока. Раньше это ловилось глазами — при сборке пяти уроков подряд так нельзя.
//
// Проверки:
//   1. номер в имени файла = lessonId = номер в заголовке = slug в реестре;
//   2. компонент сцены у каждого урока свой (правило методиста: сцена не повторяется);
//   3. примеры финальной диагностики не встречаются в теле СОСЕДНИХ уроков блока;
//   4. `conn_refs` ссылается только на существующие уроки;
//   5. `conn_next` у каждого урока свой и не пустой (крючок ведёт дальше).
//
// Запуск: node scripts/grade3-block-check.mjs 17 18 19 20 21 22 23
import fs from 'node:fs';
import path from 'node:path';

const DIR = path.resolve('src/components/grade3');
const nums = process.argv.slice(2).filter((a) => /^\d+$/.test(a));
if (!nums.length) { console.log('нужно: node scripts/grade3-block-check.mjs 18 19 20 …'); process.exit(1); }

const read = (f) => fs.readFileSync(f, 'utf8').split('\r').join('');
const registry = read(path.resolve('src/lessons/grade3.js'));
const builtNums = [...registry.matchAll(/grade3\/Dars(\d+)\.jsx/g)].map((m) => Number(m[1])).filter((n) => n > 0);
const maxLesson = Math.max(...builtNums);

const errors = [];
const warns = [];
const lessons = [];

for (const n of nums) {
  const NN = String(n).padStart(2, '0');
  const file = path.join(DIR, `Dars${NN}.jsx`);
  if (!fs.existsSync(file)) { errors.push(`урок ${n}: файла Dars${NN}.jsx нет`); continue; }
  const src = read(file);

  // 1) номера
  const id = (src.match(/lessonId: '([^']+)'/) || [])[1] || '';
  if (id !== `num-3-${NN}` && !id.startsWith(`num-3-${NN}-`)) errors.push(`урок ${n}: lessonId «${id}» не совпадает с файлом Dars${NN}.jsx`);
  const titleRu = (src.match(/lessonTitle: \{ ru: '([^']+)'/) || [])[1] || '';
  if (!new RegExp(`Урок ${n}\\.`).test(titleRu)) errors.push(`урок ${n}: заголовок «${titleRu}» не начинается с «Урок ${n}.»`);
  // между slug и импортом лежат title и desc — окно должно быть с запасом
  const slug = (registry.match(new RegExp(`slug: '(dars${NN}-[^']+)'[\\s\\S]{0,900}?Dars${NN}\\.jsx`)) || [])[1];
  if (!slug) errors.push(`урок ${n}: в реестре нет записи со slug dars${NN}-… и файлом Dars${NN}.jsx`);

  // 2) сцена
  const scene = (src.match(/const (\w*(?:Bg))\s*=\s*\(\)\s*=>/) || [])[1] || null;
  // 3) выражения: тело против финала
  const contentStart = src.indexOf('const CONTENT = {');
  const s13Start = src.indexOf('  s13: {', contentStart);
  const s14Start = src.indexOf('  s14: {', contentStart);
  const body = src.slice(contentStart, s13Start > 0 ? s13Start : src.length);
  const final = s13Start > 0 ? src.slice(s13Start, s14Start > 0 ? s14Start : src.length) : '';
  const exprs = (t) => new Set((t.match(/\b\d{1,3}\s*[:·×]\s*\d{1,3}\b/g) || []).map((x) => x.replace(/\s+/g, ' ')));

  // 4) ссылки на другие уроки
  const refs = [...src.matchAll(/уро(?:к|ки|ка|ке)\s+(\d{1,2})/gi)].map((m) => Number(m[1]));
  for (const r of new Set(refs)) if (r > maxLesson) errors.push(`урок ${n}: ссылка на урок ${r}, которого ещё нет (последний ${maxLesson})`);

  const connNext = (src.match(/conn_next: \{ ru: '([^']*)'/) || [])[1] || '';
  if (!connNext) errors.push(`урок ${n}: conn_next пуст — крючок никуда не ведёт`);

  lessons.push({ n, scene, bodyExprs: exprs(body), finalExprs: exprs(final), connNext, titleRu });
}

// 2) сцена уникальна
const bySceneName = new Map();
for (const l of lessons) {
  if (!l.scene) { warns.push(`урок ${l.n}: не нашёл компонент сцены (…Bg)`); continue; }
  if (bySceneName.has(l.scene)) errors.push(`сцена «${l.scene}» повторяется: уроки ${bySceneName.get(l.scene)} и ${l.n}`);
  else bySceneName.set(l.scene, l.n);
}

// 3) финал урока не должен повторять примеры из тела соседей
for (const a of lessons) {
  for (const b of lessons) {
    if (a.n === b.n) continue;
    const same = [...a.finalExprs].filter((e) => b.bodyExprs.has(e));
    if (same.length) warns.push(`урок ${a.n}: финальные примеры уже были в теле урока ${b.n} — ${same.join(', ')}`);
  }
}

// 5) conn_next не повторяется
const nexts = new Map();
for (const l of lessons) {
  if (!l.connNext) continue;
  if (nexts.has(l.connNext)) warns.push(`уроки ${nexts.get(l.connNext)} и ${l.n} обещают одно и то же: «${l.connNext}»`);
  else nexts.set(l.connNext, l.n);
}

console.log(`проверено уроков: ${lessons.length} (${lessons.map((l) => l.n).join(', ')})`);
for (const l of lessons) console.log(`  ${l.n}: сцена ${l.scene || '—'}, примеров в теле ${l.bodyExprs.size}, в финале ${l.finalExprs.size}, дальше «${l.connNext}»`);
if (errors.length) { console.log(`\nОШИБКИ (${errors.length}):`); errors.forEach((e) => console.log('  ' + e)); }
if (warns.length) { console.log(`\nПРЕДУПРЕЖДЕНИЯ (${warns.length}):`); warns.forEach((w) => console.log('  ' + w)); }
if (!errors.length && !warns.length) console.log('\nсквозных ошибок нет');
process.exit(errors.length ? 1 : 0);
