// 7-sinf AMALIYOT topshiriqlarini LMS uchun avtonom fayllarga yig'adi.
//
// NEGA KERAK. LMS faqat tashqi paketlarni beradi (react va boshqalar), `./` va
// `../` importlarini ko'tarmaydi -- 6-sinfda aynan shu «Modul topilmadi»
// xatosini bergan (2026-08-05). 7-sinf amaliyotining topshiriq fayllari esa
// `../kit.jsx` va `../frac.jsx` ni import qiladi: sayt uchun bu to'g'ri
// (umumiy kod bir joyda), LMS uchun esa fayl avtonom bo'lishi kerak.
//
// NIMA QILADI. Har topshiriq faylining ichiga u ISHLATADIGAN umumiy kodni
// joylashtiradi:
//   `../kit.jsx` ni import qilsa   -> frac + kit ichkariga tushadi
//   faqat `../frac.jsx` ni import qilsa -> faqat frac tushadi
// (1-dars fayllari kit'dan oldin yozilgan, ular o'z uslublarini o'zi
// belgilaydi -- kit'ni ularga qo'shsa `S`, `HFB` nomlari ikki marta
// e'lon qilinib, fayl butunlay yiqilardi.)
//
// JSX transpile QILINMAYDI: LMS uni o'zi kompilyatsiya qiladi, muammo faqat
// importlarda edi. `React` DEFAULT importi majburiy: LMS klassik rejimda
// (`React.createElement`) yig'adi.
//
// PracticeHost va DarsNNPractice LMS ga KIRMAYDI: platforma har topshiriqni
// alohida oladi va «Tekshirish» tugmasini o'zi beradi (jsx-question kontrakti).
//
// Ishlatish:
//   node scripts/build-grade7-practice-lms.mjs            // hamma dars
//   node scripts/build-grade7-practice-lms.mjs 3 5        // faqat 3 va 5
//   node scripts/build-grade7-practice-lms.mjs --check    // yig'ilganini tekshirish
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as espree from 'espree';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');
const practiceDir = path.join(rootDir, 'src', 'components', 'grade7', 'practice');
const outputDir = path.join(practiceDir, 'lms-grade7-practice-standalone');
const ALLOWED_IMPORTS = new Set(['react', 'react/jsx-runtime', 'react/jsx-dev-runtime']);

const pad = (n) => String(n).padStart(2, '0');

// Umumiy moduldan LMS ga yaramaydigan qismlarni olib tashlaymiz: react
// importi (u yuqorida bir marta yoziladi), lokal importlar va `export`
// kalit so'zlari.
const stripModule = (source, file) => {
  const hooks = new Set();
  let body = source;
  const reactImports = [...body.matchAll(/^import\s+React(?:\s*,\s*\{([^}]*)\})?\s+from\s+'react';\s*$/gm)];
  if (!reactImports.length) throw new Error(`${file}: 'react' dan default import topilmadi.`);
  for (const m of reactImports) {
    for (const h of (m[1] || '').split(',').map((s) => s.trim()).filter(Boolean)) hooks.add(h);
    body = body.replace(m[0], '');
  }
  body = body.replace(/^import\s+[^;]*?from\s+'\.[^']*';\s*$/gm, '');   // lokal importlar
  body = body.replace(/^export\s+\{[^}]*\};\s*$/gm, '');                 // re-export
  body = body.replace(/^export\s+(const|function|let)\s/gm, '$1 ');      // export const/function
  return { hooks: [...hooks], body: body.trim() };
};

const readShared = async () => {
  const frac = stripModule(await fs.readFile(path.join(practiceDir, 'frac.jsx'), 'utf8'), 'frac.jsx');
  const kit = stripModule(await fs.readFile(path.join(practiceDir, 'kit.jsx'), 'utf8'), 'kit.jsx');
  return { frac, kit };
};

const buildTask = ({ lesson, file, source, shared }) => {
  const localImports = [...source.matchAll(/^import\s+[^;]*?from\s+'(\.[^']*)';\s*$/gm)].map((m) => m[1]);
  const unknown = localImports.filter((s) => s !== '../kit.jsx' && s !== '../frac.jsx');
  if (unknown.length) throw new Error(`${file}: kutilmagan lokal import: ${unknown.join(', ')}`);
  const usesKit = localImports.includes('../kit.jsx');
  // frac faqat kerak bo'lsa qo'shiladi: 1-darsning ba'zi fayllari o'z 
  // komponentini e'lon qiladi, frac ni majburan qo'shsa nom to'qnashadi.
  const usesFrac = usesKit || localImports.includes('../frac.jsx');

  const task = stripModule(source, file);
  const pieces = usesKit ? [shared.frac.body, shared.kit.body] : (usesFrac ? [shared.frac.body] : []);
  const hooks = [...new Set([
    ...task.hooks,
    ...(usesFrac ? shared.frac.hooks : []),
    ...(usesKit ? shared.kit.hooks : []),
  ])].sort();
  const hookPart = hooks.length ? `, { ${hooks.join(', ')} }` : '';

  return `/* 7-sinf ${lesson}-dars amaliyoti, ${file}: LMS uchun avtonom fayl.
   Avtomatik yaratilgan: scripts/build-grade7-practice-lms.mjs -- QO'LDA TAHRIRLANMAYDI.
   Ichida umumiy mexanikalar (practice/kit.jsx) va kasr renderi (practice/frac.jsx),
   lokal import YO'Q. Platforma proplari: lang, onReady, registerCheck, onSubmit,
   playCorrect, playWrong. */
import React${hookPart} from 'react';

${pieces.join('\n\n')}

${task.body}
`;
};

const validate = (code, file) => {
  let ast;
  try { ast = espree.parse(code, { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } }); }
  catch (e) { throw new Error(file + ': parse -- ' + e.message); }
  const imports = ast.body.filter((n) => n.type === 'ImportDeclaration');
  const sources = imports.map((n) => n.source.value);
  const local = sources.filter((s) => s.startsWith('.'));
  if (local.length) throw new Error(`${file}: lokal importlar qoldi: ${local.join(', ')}`);
  const forbidden = sources.filter((s) => !ALLOWED_IMPORTS.has(s));
  if (forbidden.length) throw new Error(`${file}: LMS ruxsat bermaydigan import: ${forbidden.join(', ')}`);
  if (!imports.some((n) => n.source.value === 'react' && n.specifiers.some((s) => s.type === 'ImportDefaultSpecifier'))) {
    throw new Error(`${file}: 'react' dan default React importi yo'q (LMS da «React is not defined»).`);
  }
  if (!ast.body.some((n) => n.type === 'ExportDefaultDeclaration')) {
    throw new Error(`${file}: default export topilmadi.`);
  }
  // Bir xil nom ikki marta e'lon qilinmaganini tekshiramiz: kit va topshiriq
  // fayli ikkovi ham `S` yoki `HFB` ni e'lon qilsa, LMS da fayl yiqiladi.
  const names = new Map();
  for (const node of ast.body) {
    const decls = node.type === 'VariableDeclaration' ? node.declarations
      : node.type === 'FunctionDeclaration' ? [{ id: node.id }] : [];
    for (const d of decls) {
      if (!d.id || d.id.type !== 'Identifier') continue;
      if (names.has(d.id.name)) throw new Error(`${file}: «${d.id.name}» ikki marta e'lon qilingan.`);
      names.set(d.id.name, true);
    }
  }
  return sources;
};

const lessonDirs = async () => {
  const entries = await fs.readdir(practiceDir, { withFileTypes: true });
  return entries.filter((e) => e.isDirectory() && /^dars\d\d$/.test(e.name)).map((e) => e.name).sort();
};

const run = async () => {
  const args = process.argv.slice(2);
  const checkOnly = args.includes('--check');
  const wanted = args.filter((a) => /^\d+$/.test(a)).map((a) => 'dars' + pad(Number(a)));
  const shared = await readShared();
  const dirs = (await lessonDirs()).filter((d) => !wanted.length || wanted.includes(d));
  if (!dirs.length) throw new Error('Dars papkalari topilmadi.');

  let total = 0;
  const report = [];
  for (const dir of dirs) {
    const lesson = Number(dir.slice(4));
    const files = (await fs.readdir(path.join(practiceDir, dir)))
      .filter((f) => /^D\d\d_\d\d\.jsx$/.test(f)).sort();
    if (files.length !== 10) report.push(`${dir}: ${files.length} topshiriq (10 kutilgan)`);
    const outDir = path.join(outputDir, dir);
    if (!checkOnly) await fs.mkdir(outDir, { recursive: true });
    for (const file of files) {
      const source = await fs.readFile(path.join(practiceDir, dir, file), 'utf8');
      const code = buildTask({ lesson, file, source, shared });
      validate(code, `${dir}/${file}`);
      if (!checkOnly) await fs.writeFile(path.join(outDir, file), code, 'utf8');
      total += 1;
    }
  }
  console.log(`${checkOnly ? 'Tekshirildi' : 'Yig\'ildi'}: ${total} fayl, ${dirs.length} dars.`);
  console.log(`Papka: ${path.relative(rootDir, outputDir)}`);
  if (report.length) { console.log('Diqqat:'); for (const r of report) console.log('  ' + r); }
};

run().catch((e) => { console.error('XATO:', e.message); process.exit(1); });
