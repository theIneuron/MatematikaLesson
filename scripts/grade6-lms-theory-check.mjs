// Yig'ilgan NAZARIY dars faylini LMS BILAN BIR XIL rejimda tekshiradi.
//
// Nima uchun kerak: lokal vite JSX ni "automatic runtime" da kompilyatsiya
// qiladi, LMS esa KLASSIK rejimda (`React.createElement`). Bundan tashqari
// 2026-08-15 dan dars obvyazkasi `screens.jsx` da yashaydi va LMS fayliga
// SBORSHCHIK tomonidan ichkariga qo'yiladi — bu joyni hech narsa tekshirmasdi.
//
// Har bir fayl: klassik JSX ga kompilyatsiya qilinadi -> `react-dom/server`
// bilan render qilinadi. Ekran chiqsa va matn bo'lsa — fayl tirik.
//
// Ishlatish:
//   node scripts/grade6-lms-theory-check.mjs           // 1-46
//   node scripts/grade6-lms-theory-check.mjs 1 2 7
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { build } from 'vite';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');
const bundleDir = path.join(rootDir, 'src', 'components', 'grade6', 'lms-grade6-standalone');
const tmpDir = path.join(rootDir, '.tmp-lms-theory-check');
const pad = (n) => String(n).padStart(2, '0');
const EXTERNAL = new Set(['react', 'react-dom', 'react/jsx-runtime', 'react-dom/client']);

const PLATFORM_PROPS = {
  lang: 'uz',
  studentName: "O'quvchi",
  ttsApiBase: '',
  voiceGender: 'm',
  onFinished: () => {},
};

function parseArgs(argv) {
  if (!argv.length) return Array.from({ length: 46 }, (_, i) => i + 1);
  const out = [];
  for (const a of argv) {
    const m = a.match(/^(\d+)-(\d+)$/);
    if (m) for (let i = Number(m[1]); i <= Number(m[2]); i += 1) out.push(i);
    else out.push(Number(a));
  }
  return out.filter((n) => n >= 1 && n <= 46);
}

const numbers = parseArgs(process.argv.slice(2));
await fs.mkdir(tmpDir, { recursive: true });
const problems = [];

for (const n of numbers) {
  const file = path.join(bundleDir, `Dars${pad(n)}.jsx`);
  try {
    await fs.access(file);
  } catch {
    problems.push(`Dars${pad(n)}.jsx: fayl yo'q (avval build-grade6-lms.mjs)`);
    continue;
  }
  const outFile = path.join(tmpDir, `Dars${pad(n)}.mjs`);
  try {
    await build({
      logLevel: 'error',
      configFile: false,
      esbuild: { jsx: 'transform', jsxFactory: 'React.createElement', jsxFragment: 'React.Fragment' },
      build: {
        write: true, minify: false, target: 'node18', emptyOutDir: false,
        lib: { entry: file, formats: ['es'], fileName: () => path.basename(outFile) },
        outDir: tmpDir,
        rollupOptions: { external: (id) => EXTERNAL.has(id) },
      },
    });
    const mod = await import(`${pathToFileURL(outFile).href}?t=${numbers.length}${n}`);
    const Component = mod.default;
    if (typeof Component !== 'function') throw new Error('default export komponent emas');
    const html = renderToString(createElement(Component, PLATFORM_PROPS));
    const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (text.length < 20) throw new Error(`render bo'sh chiqdi (${text.length} belgi)`);
    console.log(`Dars${pad(n)}.jsx\tOK\t${text.length} belgi matn`);
  } catch (e) {
    problems.push(`Dars${pad(n)}.jsx: ${String(e.message || e).split('\n')[0]}`);
    console.log(`Dars${pad(n)}.jsx\tXATO\t${String(e.message || e).split('\n')[0]}`);
  }
}

console.log(`\n=== NATIJA === tekshirildi: ${numbers.length}, muammo: ${problems.length}`);
problems.forEach((p) => console.log('  ' + p));
process.exit(problems.length ? 1 : 0);
