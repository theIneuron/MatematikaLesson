// Yig'ilgan amaliyot fayllarini LMS BILAN BIR XIL rejimda tekshiradi.
//
// Nima uchun kerak: lokal vite/preview JSX ni "automatic runtime" da
// kompilyatsiya qiladi va `React` nomi kerak bo'lmaydi. LMS esa KLASSIK rejimda
// (`React.createElement`) kompilyatsiya qiladi — shu sababli faqat hook'lar
// import qilingan fayl platformada «React is not defined» xatosini berdi, lokal
// brauzer testi esa buni ko'rmadi. Endi tekshiruv aynan klassik rejimda.
//
// Har bir fayl: klassik JSX ga kompilyatsiya qilinadi -> `react-dom/server`
// bilan platforma proplari uzatilib render qilinadi.
//
// Ishlatish:
//   node scripts/grade6-practice-lms-check.mjs          // hammasi (460)
//   node scripts/grade6-practice-lms-check.mjs 1-3 7
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { build } from 'vite';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');
const bundleDir = path.join(rootDir, 'lms-grade6-practice-standalone');
const tmpDir = path.join(rootDir, '.tmp-lms-practice-check');

const TOTAL_LESSONS = 46;
const TASKS = 10;
const pad = (n) => String(n).padStart(2, '0');
const EXTERNAL = new Set(['react', 'react-dom', 'react/jsx-runtime', 'react-dom/client']);

const PLATFORM_PROPS = {
  lang: 'uz',
  onReady: () => {},
  registerCheck: () => {},
  onSubmit: () => {},
  playCorrect: () => {},
  playWrong: () => {},
};

function parseArgs(argv) {
  const list = [];
  for (const arg of argv) {
    const range = arg.match(/^(\d+)-(\d+)$/);
    if (range) {
      for (let i = Number(range[1]); i <= Number(range[2]); i += 1) list.push(i);
    } else if (/^\d+$/.test(arg)) list.push(Number(arg));
  }
  return list.length ? list : Array.from({ length: TOTAL_LESSONS }, (_, i) => i + 1);
}

// LMS kabi KLASSIK jsx: React.createElement. `react` plugin ATAYLAB
// ishlatilmaydi — u automatic runtime qo'yadi va xatoni yashiradi.
async function compileClassic(entry, outName) {
  const result = await build({
    configFile: false,
    root: rootDir,
    logLevel: 'error',
    esbuild: { jsx: 'transform', jsxFactory: 'React.createElement', jsxFragment: 'React.Fragment' },
    oxc: { jsx: { runtime: 'classic' } },
    build: {
      write: false,
      minify: false,
      sourcemap: false,
      target: 'es2020',
      reportCompressedSize: false,
      lib: { entry, formats: ['es'], fileName: () => outName },
      rollupOptions: { external: (id) => EXTERNAL.has(id) },
    },
  });
  const outputs = Array.isArray(result) ? result.flatMap((r) => r.output ?? []) : result?.output ?? [];
  const chunk = outputs.find((item) => item.type === 'chunk' && item.isEntry);
  return chunk?.code ?? '';
}

async function checkFile(lesson, task) {
  const fileName = `D${pad(lesson)}_${pad(task)}.jsx`;
  const entry = path.join(bundleDir, `dars${pad(lesson)}`, fileName);
  const code = await compileClassic(entry, `${pad(lesson)}_${pad(task)}.js`);
  if (!code) return { fileName, ok: false, error: 'bundle yaratilmadi' };
  if (!code.includes('React.createElement')) {
    return { fileName, ok: false, error: 'klassik rejimda React.createElement chiqmadi' };
  }
  const tmpFile = path.join(tmpDir, `${pad(lesson)}_${pad(task)}.mjs`);
  await fs.writeFile(tmpFile, code, 'utf8');
  try {
    const mod = await import(pathToFileURL(tmpFile).href);
    const Comp = mod.default;
    if (typeof Comp !== 'function') return { fileName, ok: false, error: 'default export komponent emas' };
    const html = renderToString(createElement(Comp, PLATFORM_PROPS));
    if (!html || html.length < 40) return { fileName, ok: false, error: `render bo'sh (${html.length} belgi)` };
    return { fileName, ok: true, html: html.length };
  } catch (error) {
    return { fileName, ok: false, error: String(error.message).slice(0, 140) };
  }
}

const lessons = parseArgs(process.argv.slice(2));
await fs.mkdir(tmpDir, { recursive: true });
let failed = 0;
let checked = 0;
for (const lesson of lessons) {
  const problems = [];
  for (let task = 1; task <= TASKS; task += 1) {
    const result = await checkFile(lesson, task);
    checked += 1;
    if (!result.ok) {
      failed += 1;
      problems.push(`${result.fileName}: ${result.error}`);
    }
  }
  const head = `dars${pad(lesson)}: ${TASKS} ta topshiriq`;
  console.log(problems.length ? `FAIL ${head} — ${problems.slice(0, 3).join(' | ')}` : `OK   ${head}`);
}
await fs.rm(tmpDir, { recursive: true, force: true });
console.log(failed
  ? `\nMUAMMO: ${failed} / ${checked} fayl LMS rejimida ishlamadi.`
  : `\nHammasi LMS rejimida (klassik JSX) renderlandi: ${checked} fayl.`);
process.exit(failed ? 1 : 0);
