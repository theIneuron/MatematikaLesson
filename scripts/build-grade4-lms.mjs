// ============================================================================
// 4-sinf nazariy darslarini LMS uchun avtonom fayllarga yig'adi.
//
// SABAB. LMS darsni BITTA fayl sifatida o'qiydi va faqat tashqi paketlarni
// ko'taradi. src/components/grade4 ichidagi darslar esa `./kit/index.js`,
// `../theoryShell/...`, `./wrongAnswerFlash.js` kabi lokal modullarga tayanadi —
// shu holatda LMS ularni ochmaydi. Bu skript har bir darsni o'z bog'liqliklari
// bilan birga bitta faylga qo'yadi.
//
// SHAKL. Chiqish fayli 6-sinfning `lms-grade6-standalone` fayllari bilan bir xil
// shaklda: bitta modul, ichida darsning o'z kodi va kerakli kit/theoryShell
// qismlari, uslublar `<style>` ichida, tashqariga faqat `react` va `react-dom`
// qoladi. JSX klassik rejimda (`React.createElement`) yig'iladi — shuning uchun
// faylda `react/jsx-runtime` kabi qo'shimcha import paydo bo'lmaydi.
//
// MANBA TEGILMAYDI. Skript faqat o'qiydi. Dars fayllarining o'zi o'zgarmaydi,
// SHA-guard (Dars01) buzilmaydi.
//
// Ishlatish:
//   node scripts/build-grade4-lms.mjs            # 1-51
//   node scripts/build-grade4-lms.mjs 15 41-51   # tanlab
//   node scripts/build-grade4-lms.mjs --check    # tayyor fayllarni tekshirish
// ============================================================================
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import react from '@vitejs/plugin-react';
import * as espree from 'espree';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');
const sourceDir = path.join(rootDir, 'src', 'components', 'grade4');
// Yig'ilgan fayllar darslar bilan yonma-yon turadi va .gitignore da.
const outputDir = path.join(sourceDir, 'lms-grade4-standalone');

const FIRST_LESSON = 1;
const LAST_LESSON = 51;

// LMS ko'taradigan tashqi paketlar. Bu ro'yxatdan tashqari har qanday import —
// xato: demak fayl avtonom emas.
const ALLOWED_IMPORTS = new Set([
  'react',
  'react-dom',
  'react-dom/client',
]);

const lessonFileName = (lessonNumber) => `Dars${String(lessonNumber).padStart(2, '0')}.jsx`;

// Klassik JSX `React.createElement` yozadi, lekin kit ustida qurilgan darslar
// (Dars11-20, 30, 41-51) React ni nomma-nom import qilmaydi: ular faqat
// `./kit/index.js` dan komponent oladi. Shu holatda yig'ilgan faylda
// "React is not defined" chiqadi. Shuning uchun JSX bor har bir modulga
// yetishmayotgan `import React` qo'shiladi — rollup keyin uni o'zi
// nomlaydi va bittaga birlashtiradi.
function makeReactImportPlugin() {
  // Vite id larida yo'l ajratgichi har doim `/`, Windows da ham.
  const grade4Prefix = `${sourceDir.split(path.sep).join('/')}/`;
  return {
    name: 'grade4-lms-react-import',
    enforce: 'pre',
    transform(code, id) {
      const file = id.split('?')[0].split('\\').join('/');
      if (!file.startsWith(grade4Prefix)) return null;
      if (!/\.jsx?$/.test(file)) return null;
      if (/^\s*import\s+React\b/m.test(code)) return null;
      if (!/<[A-Za-z]/.test(code)) return null;
      return { code: `import React from 'react';\n${code}`, map: null };
    },
  };
}

function parseSelection(args) {
  if (args.includes('--check')) return { checkOnly: true, lessons: [] };
  const selections = args.length ? args : [`${FIRST_LESSON}-${LAST_LESSON}`];
  const selected = new Set();
  for (const value of selections) {
    const match = /^(\d{1,2})(?:-(\d{1,2}))?$/.exec(value);
    if (!match) throw new Error(`Noto'g'ri diapazon: ${value}. Misol: 15 yoki 41-51.`);
    const start = Number(match[1]);
    const end = Number(match[2] || match[1]);
    if (start < FIRST_LESSON || end > LAST_LESSON || start > end) {
      throw new Error(`Diapazon ${FIRST_LESSON}-${LAST_LESSON} ichida bo'lishi kerak: ${value}`);
    }
    for (let lesson = start; lesson <= end; lesson += 1) selected.add(lesson);
  }
  return { checkOnly: false, lessons: [...selected].sort((a, b) => a - b) };
}

function hasDefaultExport(ast) {
  return ast.body.some((node) => {
    if (node.type === 'ExportDefaultDeclaration') return true;
    if (node.type !== 'ExportNamedDeclaration') return false;
    return node.specifiers.some((spec) => spec.exported?.name === 'default');
  });
}

// Yig'ilgan fayl LMS kontraktiga javob beradimi: lokal import yo'q, default
// export bor, uslublar ichkarida.
function validateCode(code, fileName) {
  const ast = espree.parse(code, {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  });
  const imports = ast.body
    .filter((node) => node.type === 'ImportDeclaration')
    .map((node) => node.source.value);
  const forbidden = imports.filter((source) => !ALLOWED_IMPORTS.has(source));
  if (forbidden.length) {
    throw new Error(`${fileName}: LMS ruxsat bermaydigan importlar: ${forbidden.join(', ')}`);
  }
  if (!hasDefaultExport(ast)) throw new Error(`${fileName}: default export topilmadi.`);
  if (!/createElement\(\s*"style"/.test(code)) {
    throw new Error(`${fileName}: ichki <style> topilmadi — uslublar faylda emas.`);
  }
  return imports;
}

function normalizeBuildOutputs(result) {
  const builds = Array.isArray(result) ? result : [result];
  return builds.flatMap((item) => item?.output || []);
}

async function bundleLesson(lessonNumber) {
  const fileName = lessonFileName(lessonNumber);
  const entry = path.join(sourceDir, fileName);
  await fs.access(entry);

  const result = await build({
    configFile: false,
    root: rootDir,
    logLevel: 'error',
    // Klassik JSX: chiqishda React.createElement, qo'shimcha runtime importi yo'q.
    plugins: [makeReactImportPlugin(), react({ jsxRuntime: 'classic' })],
    build: {
      write: false,
      minify: false,
      sourcemap: false,
      target: 'es2020',
      cssCodeSplit: false,
      reportCompressedSize: false,
      lib: {
        entry,
        formats: ['es'],
        fileName: () => fileName,
      },
      rollupOptions: {
        external: (id) => ALLOWED_IMPORTS.has(id),
      },
    },
  });

  const chunk = normalizeBuildOutputs(result).find((item) => item.type === 'chunk' && item.isEntry);
  if (!chunk) throw new Error(`${fileName} uchun bundle yaratilmadi.`);

  const banner = `/* 4-sinf ${lessonNumber}-dars: LMS uchun avtonom fayl.
   Avtomatik yaratilgan: node scripts/build-grade4-lms.mjs ${lessonNumber}
   Manba: src/components/grade4/${fileName} — o'zgartirilmagan. */\n`;
  const code = `${banner}${chunk.code.trimEnd()}\n`;
  const imports = validateCode(code, fileName);

  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(path.join(outputDir, fileName), code, 'utf8');
  return { lessonNumber, bytes: Buffer.byteLength(code), imports };
}

async function validateExistingFiles() {
  const rows = [];
  for (let lessonNumber = FIRST_LESSON; lessonNumber <= LAST_LESSON; lessonNumber += 1) {
    const fileName = lessonFileName(lessonNumber);
    const code = await fs.readFile(path.join(outputDir, fileName), 'utf8');
    const imports = validateCode(code, fileName);
    rows.push({ lessonNumber, bytes: Buffer.byteLength(code), imports });
  }
  return rows;
}

async function writeReadme() {
  const readme = `# 4-sinf LMS standalone nazariy darslari

Bu papkadagi \`Dars01.jsx\`–\`Dars${LAST_LESSON}.jsx\` fayllari LMS ga bittadan
yuklash uchun yig'ilgan.

- Har bir faylda darsning o'z kodi, kerakli \`kit/\` va \`theoryShell/\` qismlari
  hamda barcha uslublar ichkarida.
- \`./...\` yoki \`../...\` ko'rinishidagi lokal importlar yo'q.
- Tashqariga faqat \`react\` va \`react-dom\` qoladi.
- \`src/components/grade4\` manba fayllari o'zgartirilmaydi.

Papka \`.gitignore\` da: fayllar kerak bo'lganda qayta yaratiladi.

Qayta yaratish:

\`\`\`powershell
npm run lms:grade4
npm run lms:grade4:check
\`\`\`
`;
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(path.join(outputDir, 'README.md'), readme, 'utf8');
}

function printRows(rows) {
  for (const row of rows) {
    const imports = row.imports.length ? row.imports.join(', ') : 'none';
    const kb = (row.bytes / 1024).toFixed(0);
    console.log(`${lessonFileName(row.lessonNumber)}\t${kb} KB\timports: ${imports}`);
  }
}

const selection = parseSelection(process.argv.slice(2));
if (selection.checkOnly) {
  const rows = await validateExistingFiles();
  printRows(rows);
  console.log(`OK: ${rows.length} ta LMS fayli tekshirildi.`);
} else {
  const rows = [];
  for (const lessonNumber of selection.lessons) rows.push(await bundleLesson(lessonNumber));
  await writeReadme();
  printRows(rows);
  console.log(`OK: ${rows.length} ta LMS fayli yaratildi: ${outputDir}`);
}
