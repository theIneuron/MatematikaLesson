// 6-sinf AMALIYOT topshiriqlarini LMS uchun avtonom fayllarga yig'adi.
//
// PLATFORMA KONTRAKTI: amaliyotda HAR BIR TOPSHIRIQ alohida fayl bo'lib
// yuklanadi (jsx-question). Platformaning o'zi «Tekshirish» tugmasini beradi va
// komponentga `onReady`, `registerCheck`, `onSubmit`, `playCorrect`,
// `playWrong` proplarini uzatadi. Shuning uchun bir darsdan BITTA fayl emas,
// O'NTA fayl chiqadi: dars 1 -> D01_01 … D01_10.
//
// `PracticeHost` LMS ga KIRMAYDI: u faqat lokal previewda platforma host'ini
// taqlid qilish uchun (o'z «Tekshirish» tugmasi bilan).
//
// Nima uchun kerak: manbadagi topshiriq fayli `../Grade6Question.jsx` ni import
// qiladi, LMS esa lokal importlarni ko'tarmaydi — «Modul topilmadi» xatosi
// shundan chiqadi. Bu skript umumiy savol qobig'ini har bir topshiriq fayli
// ichiga joylashtiradi. JSX o'z ko'rinishida qoladi (transpile qilinmaydi):
// LMS JSX ni o'zi kompilyatsiya qiladi, muammo faqat importlarda edi.
//
// Ishlatish:
//   node scripts/build-grade6-practice-lms.mjs 1-46
//   node scripts/build-grade6-practice-lms.mjs 7          // faqat 7-dars
//   node scripts/build-grade6-practice-lms.mjs --check
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as espree from 'espree';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');
const practiceDir = path.join(rootDir, 'src', 'components', 'grade6', 'practice');
const sharedQuestionPath = path.join(practiceDir, 'Grade6Question.jsx');
// Собранные файлы лежат рядом с уроками класса (перенесены из корня 2026-08-12).
const outputDir = path.join(rootDir, 'src', 'components', 'grade6', 'lms-grade6-practice-standalone');

const TOTAL_LESSONS = 46;
const TASKS_PER_LESSON = 10;
const ALLOWED_IMPORTS = new Set(['react', 'react/jsx-runtime', 'react/jsx-dev-runtime']);

const pad = (n) => String(n).padStart(2, '0');
const lessonDir = (n) => path.join(practiceDir, `dars${pad(n)}`);
const taskFileName = (lesson, task) => `D${pad(lesson)}_${pad(task)}.jsx`;

function parseSelection(args) {
  if (args.includes('--check')) return { checkOnly: true, lessons: [] };
  const selections = args.length ? args : ['1-46'];
  const selected = new Set();
  for (const value of selections) {
    const match = /^(\d{1,2})(?:-(\d{1,2}))?$/.exec(value);
    if (!match) throw new Error(`Noto'g'ri diapazon: ${value}. Misol: 1-6 yoki 16-26.`);
    const start = Number(match[1]);
    const end = Number(match[2] || match[1]);
    if (start < 1 || end > TOTAL_LESSONS || start > end) {
      throw new Error(`Diapazon 1-${TOTAL_LESSONS} ichida bo'lishi kerak: ${value}`);
    }
    for (let i = start; i <= end; i += 1) selected.add(i);
  }
  return { checkOnly: false, lessons: [...selected].sort((a, b) => a - b) };
}

// Umumiy savol qobig'i: react importi olib tashlanadi (u yuqorida bir marta
// yoziladi), default export esa oddiy funksiyaga aylanadi.
async function readSharedQuestion() {
  const source = await fs.readFile(sharedQuestionPath, 'utf8');
  const reactImport = source.match(/^import\s+\{([^}]+)\}\s+from\s+'react';\s*$/m);
  if (!reactImport) throw new Error('Grade6Question.jsx: react importi topilmadi.');
  const hooks = reactImport[1].split(',').map((s) => s.trim()).filter(Boolean);
  const body = source
    .replace(reactImport[0], '')
    .replace('export default function Grade6Question(', 'function Grade6Question(')
    .trim();
  if (!body.includes('function Grade6Question(')) {
    throw new Error('Grade6Question.jsx: default export imzosi o\'zgargan.');
  }
  return { hooks, body };
}

function buildTaskFile({ lesson, task, taskSource, shared }) {
  const importLine = taskSource.match(/^import\s+Grade6Question\s+from\s+'\.\.\/Grade6Question\.jsx';\s*$/m);
  if (!importLine) {
    throw new Error(`${taskFileName(lesson, task)}: Grade6Question importi topilmadi.`);
  }
  // Topshiriqning o'zida boshqa lokal import bo'lmasligi kerak.
  const taskBody = taskSource.replace(importLine[0], '').trim();
  const leftovers = [...taskBody.matchAll(/^import\s+.*?from\s+'([^']+)';/gm)]
    .map((m) => m[1])
    .filter((source) => source.startsWith('.') || source.startsWith('..'));
  if (leftovers.length) {
    throw new Error(`${taskFileName(lesson, task)}: qo'shimcha lokal importlar: ${leftovers.join(', ')}`);
  }
  // Topshiriqda react hook'lari ishlatilsa, ular ham bitta importga qo'shiladi.
  const taskReactImport = taskBody.match(/^import\s+\{([^}]+)\}\s+from\s+'react';\s*$/m);
  const taskHooks = taskReactImport
    ? taskReactImport[1].split(',').map((s) => s.trim()).filter(Boolean)
    : [];
  const cleanTaskBody = taskReactImport ? taskBody.replace(taskReactImport[0], '').trim() : taskBody;
  const hooks = [...new Set([...shared.hooks, ...taskHooks])].sort();

  // `React` DEFAULT importi SHART: LMS jsx ni klassik rejimda
  // (`React.createElement`) kompilyatsiya qiladi, shuning uchun faqat hook'lar
  // import qilinsa «React is not defined» xatosi chiqadi. Lokal previewda
  // (vite, automatic runtime) bu sezilmaydi. Grade5 amaliyot fayllari ham shu
  // naqshda: `import React, { ... } from 'react'`.
  return `/* 6-sinf ${lesson}-dars amaliyoti, ${task}-topshiriq: LMS uchun avtonom fayl.
   Avtomatik yaratilgan: scripts/build-grade6-practice-lms.mjs
   Ichida umumiy Grade6Question qobig'i bor, lokal import YO'Q.
   Platforma proplari: onReady, registerCheck, onSubmit, playCorrect, playWrong. */
import React, { ${hooks.join(', ')} } from 'react';

${shared.body}

${cleanTaskBody}
`;
}

function validateCode(code, fileName) {
  const ast = espree.parse(code, {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  });
  const imports = ast.body
    .filter((node) => node.type === 'ImportDeclaration')
    .map((node) => node.source.value);
  const local = imports.filter((source) => source.startsWith('.'));
  if (local.length) throw new Error(`${fileName}: lokal importlar qoldi: ${local.join(', ')}`);
  const forbidden = imports.filter((source) => !ALLOWED_IMPORTS.has(source));
  if (forbidden.length) throw new Error(`${fileName}: LMS ruxsat bermaydigan importlar: ${forbidden.join(', ')}`);
  const hasDefault = ast.body.some((node) => node.type === 'ExportDefaultDeclaration');
  if (!hasDefault) throw new Error(`${fileName}: default export topilmadi.`);
  if (!code.includes('function Grade6Question(')) {
    throw new Error(`${fileName}: Grade6Question qobig'i ichkariga joylashmagan.`);
  }
  // LMS jsx ni klassik rejimda kompilyatsiya qiladi: `React` nomi kerak.
  // Bu tekshiruv «React is not defined» xatosining qaytishiga yo'l qo'ymaydi.
  const reactDefaultImport = ast.body.some((node) => node.type === 'ImportDeclaration'
    && node.source.value === 'react'
    && node.specifiers.some((spec) => spec.type === 'ImportDefaultSpecifier'));
  if (!reactDefaultImport) {
    throw new Error(`${fileName}: 'react' dan default React importi yo'q (LMS da «React is not defined» beradi).`);
  }
  return imports;
}

async function bundleLesson(lessonNumber, shared) {
  const outDir = path.join(outputDir, `dars${pad(lessonNumber)}`);
  await fs.mkdir(outDir, { recursive: true });
  const rows = [];
  for (let task = 1; task <= TASKS_PER_LESSON; task += 1) {
    const fileName = taskFileName(lessonNumber, task);
    const taskSource = await fs.readFile(path.join(lessonDir(lessonNumber), fileName), 'utf8');
    const code = buildTaskFile({ lesson: lessonNumber, task, taskSource, shared });
    const imports = validateCode(code, fileName);
    await fs.writeFile(path.join(outDir, fileName), code, 'utf8');
    rows.push({ fileName, bytes: Buffer.byteLength(code), imports });
  }
  return rows;
}

async function validateExistingFiles() {
  const rows = [];
  for (let lesson = 1; lesson <= TOTAL_LESSONS; lesson += 1) {
    for (let task = 1; task <= TASKS_PER_LESSON; task += 1) {
      const fileName = taskFileName(lesson, task);
      const filePath = path.join(outputDir, `dars${pad(lesson)}`, fileName);
      const code = await fs.readFile(filePath, 'utf8');
      const imports = validateCode(code, fileName);
      rows.push({ fileName, bytes: Buffer.byteLength(code), imports });
    }
  }
  return rows;
}

async function writeReadme() {
  const readme = `# 6-sinf LMS standalone AMALIYOT topshiriqlari

Har bir dars uchun \`darsNN/\` papkasida **10 ta alohida fayl**:
\`D01_01.jsx\` … \`D01_10.jsx\`. Platformaga topshiriqlar BITTALAB yuklanadi
(jsx-question kontrakti) — bitta dars = 10 fayl, jami 460 fayl.

- Har bir faylda umumiy \`Grade6Question\` qobig'i ICHKARIGA joylangan.
- \`./...\` yoki \`../...\` ko'rinishidagi lokal importlar YO'Q: LMS ularni
  ko'tarmaydi va «Modul topilmadi» xatosi chiqaradi.
- Faqat \`react\` import qilinadi.
- \`PracticeHost\` LMS ga KIRMAYDI: u lokal preview uchun, platformaning
  «Tekshirish» tugmasini taqlid qiladi. Platformada tugmani LMS o'zi beradi.
- Platforma proplari: \`onReady\`, \`registerCheck\`, \`onSubmit\`,
  \`playCorrect\`, \`playWrong\`.
- Manba fayllari (\`src/components/grade6/practice\`) o'zgartirilmagan.

Qayta yaratish:

\`\`\`powershell
node scripts/build-grade6-practice-lms.mjs 1-46
node scripts/build-grade6-practice-lms.mjs --check
\`\`\`

MUHIM: topshiriq matni yoki umumiy qobiq o'zgarsa, fayllarni QAYTA yig'ish
shart — aks holda platformada eski nusxa qoladi.
`;
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(path.join(outputDir, 'README.md'), readme, 'utf8');
}

const selection = parseSelection(process.argv.slice(2));
if (selection.checkOnly) {
  const rows = await validateExistingFiles();
  const bytes = rows.reduce((sum, row) => sum + row.bytes, 0);
  console.log(`OK: ${rows.length} ta topshiriq fayli tekshirildi (${Math.round(bytes / 1024)} KB).`);
} else {
  const shared = await readSharedQuestion();
  let count = 0;
  for (const lessonNumber of selection.lessons) {
    const rows = await bundleLesson(lessonNumber, shared);
    count += rows.length;
    const kb = Math.round(rows.reduce((sum, row) => sum + row.bytes, 0) / 1024);
    console.log(`dars${pad(lessonNumber)}: ${rows.length} ta fayl, ${kb} KB`);
  }
  await writeReadme();
  console.log(`OK: ${count} ta topshiriq fayli yaratildi: ${outputDir}`);
}
