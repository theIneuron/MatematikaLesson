#!/usr/bin/env node
// ============================================================================
// 4-sinf AMALIYOT topshiriqlarini LMS uchun avtonom fayllarga yig'adi.
//
// PLATFORMA KONTRAKTI (metodist yuborgan namuna: 6-sinfning D01_01.jsx).
// Amaliyotda HAR BIR TOPSHIRIQ alohida fayl bo'lib yuklanadi. «Tekshirish»
// tugmasini platformaning O'ZI beradi va komponentga `lang`, `mode`,
// `onReady`, `registerCheck`, `onSubmit`, `playCorrect`, `playWrong`
// proplarini uzatadi. Shuning uchun bitta darsdan O'NTA fayl chiqadi:
// 2-dars -> D02_01 … D02_10.
//
// NEGA 6-SINF QOBIG'I ISHLATILMADI. U to'rt turni biladi: choice, bool, match,
// input. 4-sinf amaliyotida esa mc, numpad, missing, match, order, gap, shade,
// ticks, fracbuild, card, sort bor va har darsning O'Z chizmalari mavjud.
// Ularni to'rt turga siqish mexanikalarning yarmini yo'qotardi (CLAUDE.md 2-bo'lim:
// obuchayushchi mahsulotda "keyin tuzatamiz" degan rejim yo'q). Shuning uchun
// topshiriq fayli darsning O'Z kodini to'liq oladi va faqat bitta topshiriqni
// chizadi — mexanika bir bitga ham o'zgarmaydi.
//
// MANBA TEGILMAYDI. Skript faqat o'qiydi.
//
// Ishlatish:
//   node scripts/build-grade4-practice-lms.mjs            # 1-51
//   node scripts/build-grade4-practice-lms.mjs 2 41-51    # tanlab
//   node scripts/build-grade4-practice-lms.mjs --check     # tayyor fayllarni tekshirish
// ============================================================================
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');
const grade4Dir = path.join(rootDir, 'src', 'components', 'grade4');
const outputDir = path.join(grade4Dir, 'lms-grade4-practice-standalone');

const TOTAL_LESSONS = 51;
const TASKS_PER_LESSON = 10;
const pad = (n) => String(n).padStart(2, '0');
const taskFileName = (lesson, task) => `D${pad(lesson)}_${pad(task)}.jsx`;

function parseSelection(args) {
  if (args.includes('--check')) return { checkOnly: true, lessons: [] };
  const selections = args.filter((a) => !a.startsWith('--'));
  const list = selections.length ? selections : [`1-${TOTAL_LESSONS}`];
  const picked = new Set();
  for (const item of list) {
    const range = /^(\d+)-(\d+)$/.exec(item);
    if (range) {
      for (let n = Number(range[1]); n <= Number(range[2]); n += 1) picked.add(n);
      continue;
    }
    if (!/^\d+$/.test(item)) {
      console.error(`Noma'lum tanlov: ${item}`);
      process.exit(2);
    }
    picked.add(Number(item));
  }
  const lessons = [...picked].sort((a, b) => a - b);
  const bad = lessons.filter((n) => n < 1 || n > TOTAL_LESSONS);
  if (bad.length) { console.error(`Dars raqami 1-${TOTAL_LESSONS} oralig'ida bo'lishi kerak: ${bad.join(', ')}`); process.exit(2); }
  return { checkOnly: false, lessons };
}

// `export default function X(` dan boshlab MOS keluvchi yopiluvchi qavsgacha
// kesib tashlaydi. Qavslarni sanaydi, satr va izohlarni hisobga oladi.
function cutDefaultExport(source) {
  const start = source.search(/export default function\s+\w+\s*\(/);
  if (start < 0) return null;
  // Parametr ro'yxatini AVVAL o'tkazamiz: `({ lang, onFinished })` dagi figurali
  // qavs tana emas, destrukturizatsiya. Uni tana deb olsak, kesish funksiya
  // o'rtasida to'xtaydi.
  const parenOpen = source.indexOf('(', start);
  if (parenOpen < 0) return null;
  let parenDepth = 0;
  let parenEnd = -1;
  for (let i = parenOpen; i < source.length; i += 1) {
    if (source[i] === '(') parenDepth += 1;
    else if (source[i] === ')') {
      parenDepth -= 1;
      if (parenDepth === 0) { parenEnd = i; break; }
    }
  }
  if (parenEnd < 0) return null;
  const open = source.indexOf('{', parenEnd);
  if (open < 0) return null;
  let depth = 0;
  let inLine = false;
  let inBlock = false;
  let quote = null;
  for (let i = open; i < source.length; i += 1) {
    const ch = source[i];
    const next = source[i + 1];
    if (inLine) { if (ch === '\n') inLine = false; continue; }
    if (inBlock) { if (ch === '*' && next === '/') { inBlock = false; i += 1; } continue; }
    if (quote) {
      if (ch === '\\') { i += 1; continue; }
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '/' && next === '/') { inLine = true; i += 1; continue; }
    if (ch === '/' && next === '*') { inBlock = true; i += 1; continue; }
    if (ch === '\'' || ch === '"' || ch === '`') { quote = ch; continue; }
    if (ch === '{') depth += 1;
    else if (ch === '}') {
      depth -= 1;
      if (depth === 0) return { before: source.slice(0, start), after: source.slice(i + 1) };
    }
  }
  return null;
}

function buildTaskFile(lessonSource, lesson, task) {
  const cut = cutDefaultExport(lessonSource);
  if (!cut) throw new Error('default export topilmadi');
  const eol = lessonSource.includes('\r\n') ? '\r\n' : '\n';
  let body = `${cut.before.trimEnd()}${eol}${cut.after.trimStart()}`;

  // Faqat `react` importi qoladi va React nomi JSX uchun kerak.
  body = body.replace(/^import \{([^}]*)\} from 'react';/m, (m, names) => `import React, {${names}} from 'react';`);

  // Darslar bir xil yozilmagan: uslublar konstantasi `STYLES` yoki `CSS`,
  // topshiriq komponenti `Task` yoki `PracticeTask`, ildiz sinfi `p4-root`
  // yoki `g4p-root`. Nomlarni FAYLDAN o'qiymiz — qotib qolgan nom 12, 13, 22,
  // 23, 24-darslarning avtonom faylini jim buzgan edi: `STYLES is not defined`
  // yoki uslubsiz ekran.
  const styleName = /\bconst (STYLES|CSS) = `/.exec(lessonSource)?.[1];
  if (!styleName) throw new Error("uslublar konstantasi topilmadi (STYLES/CSS)");
  const taskName = /\bfunction (PracticeTask|Task)\(\{/.exec(lessonSource)?.[1];
  if (!taskName) throw new Error("topshiriq komponenti topilmadi (Task/PracticeTask)");
  const rootClass = /className=[{`"']*((?:g4p|p4)-root)\b/.exec(lessonSource)?.[1];
  if (!rootClass) throw new Error("ildiz sinfi topilmadi (p4-root/g4p-root)");

  const name = `D${pad(lesson)}_${pad(task)}`;
  const header = [
    `/* 4-sinf ${lesson}-dars amaliyoti, ${task}-topshiriq: LMS uchun avtonom fayl.`,
    '   Avtomatik yaratilgan: scripts/build-grade4-practice-lms.mjs',
    '   Ichida darsning o\'z mexanikasi va uslublari bor, lokal import YO\'Q.',
    '   Platforma proplari: lang, mode, onReady, registerCheck, onSubmit,',
    '   playCorrect, playWrong. «Tekshirish» tugmasini platforma beradi. */',
  ].join(eol);

  const footer = [
    '',
    `export default function ${name}({`,
    '  lang = \'uz\', mode, onReady, registerCheck, onSubmit, playCorrect, playWrong,',
    '}) {',
    '  return (',
    `    <div className="${rootClass}">`,
    `      <style>{${styleName}}</style>`,
    `      <${taskName}`,
    `        task={TASKS[${task - 1}]}`,
    '        lang={lang}',
    '        platform',
    '        mode={mode}',
    '        onReady={onReady}',
    '        registerCheck={registerCheck}',
    '        onSubmit={onSubmit}',
    '        playCorrect={playCorrect}',
    '        playWrong={playWrong}',
    '      />',
    '    </div>',
    '  );',
    '}',
    '',
  ].join(eol);

  return `${header}${eol}${body.trimEnd()}${eol}${footer}`;
}

const ALLOWED_IMPORTS = new Set(['react']);

function validate(code, lesson, task) {
  const issues = [];
  const name = `D${pad(lesson)}_${pad(task)}`;
  for (const m of code.matchAll(/^import [^\n]*from '([^']+)';/gm)) {
    if (!ALLOWED_IMPORTS.has(m[1])) issues.push(`ruxsatsiz import: ${m[1]}`);
  }
  if (!code.includes(`export default function ${name}`)) issues.push('default export nomi noto\'g\'ri');
  if ((code.match(/^export /gm) || []).length !== 1) issues.push('bitta default eksportdan boshqasi bor');
  // TASKS har darsda boshqacha yozilgan: `[` yoki `addEnglish([`.
  if (!/const TASKS = /.test(code)) issues.push("TASKS yo'q");
  // Komponent nomi ikki xil: `Task` va `PracticeTask`.
  if (!/function (?:Task|PracticeTask)\(\{/.test(code)) issues.push("Task komponenti yo'q");
  if (!/registerCheck/.test(code)) issues.push('platforma kontrakti yo\'q (registerCheck)');
  // Qobiq faqat SHU faylda mavjud nomlarga murojaat qilishi kerak. Aks holda
  // fayl shakl jihatidan to'g'ri, ammo brauzerda «X is not defined» beradi.
  const usedStyle = /<style>\{(\w+)\}<\/style>/.exec(code)?.[1];
  if (!usedStyle) issues.push("qobiqda <style> yo'q");
  else if (!new RegExp(`\\bconst ${usedStyle} = \``).test(code)) {
    issues.push(`qobiq ${usedStyle} ga murojaat qiladi, lekin u aniqlanmagan`);
  }
  const usedTask = /\r?\n {6}<(\w+)\r?\n {8}task=\{TASKS\[/.exec(code)?.[1];
  if (!usedTask) issues.push("qobiqda topshiriq komponenti yo'q");
  else if (!new RegExp(`\\bfunction ${usedTask}\\(\\{`).test(code)) {
    issues.push(`qobiq ${usedTask} ga murojaat qiladi, lekin u aniqlanmagan`);
  }
  const usedRoot = /<div className="([\w-]+)">\r?\n {6}<style>/.exec(code)?.[1];
  if (!usedRoot) issues.push("qobiqda ildiz div yo'q");
  else if (!new RegExp(`\\.${usedRoot}\\s*\\{`).test(code)) {
    issues.push(`ildiz sinfi ${usedRoot} uslublarda yo'q`);
  }
  return issues;
}

const { checkOnly, lessons } = parseSelection(process.argv.slice(2));

if (checkOnly) {
  let bad = 0;
  let seen = 0;
  for (let lesson = 1; lesson <= TOTAL_LESSONS; lesson += 1) {
    const dir = path.join(outputDir, `dars${pad(lesson)}`);
    let entries;
    try { entries = await fs.readdir(dir); } catch { continue; }
    for (const file of entries.filter((f) => f.endsWith('.jsx')).sort()) {
      const task = Number(/_(\d\d)\.jsx$/.exec(file)?.[1]);
      const code = await fs.readFile(path.join(dir, file), 'utf8');
      const issues = validate(code, lesson, task);
      seen += 1;
      if (issues.length) { bad += 1; console.log(`- ${file}: ${issues.join('; ')}`); }
    }
  }
  console.log(`${seen} fayl tekshirildi, ${bad} tasida muammo.`);
  process.exit(bad ? 1 : 0);
}

let written = 0;
const failures = [];
for (const lesson of lessons) {
  const lessonPath = path.join(grade4Dir, `Dars${pad(lesson)}Practice.jsx`);
  let source;
  try { source = await fs.readFile(lessonPath, 'utf8'); } catch {
    failures.push(`Dars${pad(lesson)}Practice.jsx topilmadi`);
    continue;
  }
  if (!source.includes('registerCheck')) {
    failures.push(`Dars${pad(lesson)}Practice.jsx: platforma kontrakti yo'q — avval Task ga proplar qo'shilishi kerak`);
    continue;
  }
  const outDir = path.join(outputDir, `dars${pad(lesson)}`);
  await fs.mkdir(outDir, { recursive: true });
  for (let task = 1; task <= TASKS_PER_LESSON; task += 1) {
    let code;
    try { code = buildTaskFile(source, lesson, task); } catch (error) {
      failures.push(`Dars${pad(lesson)} ${pad(task)}: ${error.message}`);
      continue;
    }
    const issues = validate(code, lesson, task);
    if (issues.length) { failures.push(`Dars${pad(lesson)} ${pad(task)}: ${issues.join('; ')}`); continue; }
    await fs.writeFile(path.join(outDir, taskFileName(lesson, task)), code, 'utf8');
    written += 1;
  }
  console.log(`Dars${pad(lesson)}: ${TASKS_PER_LESSON} topshiriq yig'ildi`);
}

console.log(`\n${written} fayl yozildi.`);
for (const f of failures) console.log('XATO', f);
process.exit(failures.length ? 1 : 0);
