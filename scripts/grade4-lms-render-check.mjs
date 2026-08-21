// ============================================================================
// 4-sinf LMS standalone fayllarini haqiqiy brauzerda ochib tekshiradi.
//
// `build-grade4-lms.mjs --check` faqat shaklni ko'radi: import yo'q, default
// export bor, uslub ichkarida. Bu yetarli emas — yig'ilgan fayl mount bo'lmasa
// ham shu tekshiruvdan o'tadi. Shuning uchun har bir fayl alohida sahifada
// React ostida chinakam render qilinadi va konsol xatolari yig'iladi.
//
// Ishlatish:
//   node scripts/grade4-lms-render-check.mjs            # 1-51, uz
//   node scripts/grade4-lms-render-check.mjs 15 41-51
//   GRADE4_LMS_LANGS=uz,ru,en node scripts/grade4-lms-render-check.mjs 15
// ============================================================================
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';
import { chromium } from 'playwright';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');
const standaloneDir = path.join(rootDir, 'src', 'components', 'grade4', 'lms-grade4-standalone');
const probeDir = path.join(rootDir, '.tmp', 'lms-grade4-probe');

const FIRST_LESSON = 1;
const LAST_LESSON = 51;
const LANGS = (process.env.GRADE4_LMS_LANGS || 'uz').split(',').map((v) => v.trim()).filter(Boolean);
const PORT = Number(process.env.GRADE4_LMS_PORT || 5311);

const lessonName = (n) => `Dars${String(n).padStart(2, '0')}`;

function parseSelection(args) {
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
  return [...selected].sort((a, b) => a - b);
}

// Sinov sahifasi: LMS bergan proplar bilan bitta standalone faylni mount qiladi.
async function writeProbe() {
  await fs.mkdir(probeDir, { recursive: true });
  await fs.writeFile(path.join(probeDir, 'index.html'), `<!doctype html>
<html lang="uz">
<head><meta charset="utf-8"><title>4-sinf LMS probe</title></head>
<body><div id="root"></div><script type="module" src="./main.jsx"></script></body>
</html>
`, 'utf8');
  await fs.writeFile(path.join(probeDir, 'main.jsx'), `import { createElement } from 'react';
import { createRoot } from 'react-dom/client';

const lessons = import.meta.glob('/src/components/grade4/lms-grade4-standalone/Dars*.jsx');
const params = new URLSearchParams(location.search);
const dars = params.get('dars') || 'Dars01';
const lang = params.get('lang') || 'uz';
const key = '/src/components/grade4/lms-grade4-standalone/' + dars + '.jsx';

window.__probe = { mounted: false, error: null };

const loader = lessons[key];
if (!loader) {
  window.__probe.error = 'Fayl topilmadi: ' + key;
} else {
  loader().then((mod) => {
    const Lesson = mod.default;
    if (typeof Lesson !== 'function') {
      window.__probe.error = 'default export komponent emas: ' + typeof Lesson;
      return;
    }
    createRoot(document.getElementById('root')).render(
      createElement(Lesson, {
        studentName: 'Anvar',
        lang,
        ttsApiBase: '',
        voiceGender: 'f',
        onFinished: () => { window.__probe.finished = true; },
      }),
    );
    window.__probe.mounted = true;
  }).catch((error) => {
    window.__probe.error = String(error && error.stack ? error.stack : error);
  });
}
`, 'utf8');
}

const IGNORED_CONSOLE = [
  /Download the React DevTools/i,
  /favicon/i,
  // Ovoz LMS dan tashqarida yo'q: TTS manzili bo'sh, audio ob'ekti yuklanmaydi.
  /the server responded with a status of 40\d/i,
  /Failed to load resource/i,
  /net::ERR_/i,
];

const isNoise = (text) => IGNORED_CONSOLE.some((re) => re.test(text));

async function checkLesson(page, dars, lang) {
  const problems = [];
  const onConsole = (msg) => {
    if (msg.type() !== 'error' && msg.type() !== 'warning') return;
    const text = msg.text();
    if (isNoise(text)) return;
    problems.push(`${msg.type()}: ${text}`);
  };
  const onPageError = (error) => {
    const text = String(error && error.stack ? error.stack : error);
    if (isNoise(text)) return;
    problems.push(`pageerror: ${text}`);
  };

  page.on('console', onConsole);
  page.on('pageerror', onPageError);
  try {
    await page.goto(`http://127.0.0.1:${PORT}/.tmp/lms-grade4-probe/index.html?dars=${dars}&lang=${lang}`, {
      waitUntil: 'load',
    });
    const probe = await page.evaluate(async () => {
      const deadline = Date.now() + 15000;
      while (Date.now() < deadline) {
        if (window.__probe?.error) return window.__probe;
        if (window.__probe?.mounted) return window.__probe;
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      return window.__probe || { mounted: false, error: 'probe ishga tushmadi' };
    });
    if (probe.error) problems.push(`import: ${probe.error}`);
    if (!probe.mounted && !probe.error) problems.push('mount bo\'lmadi');

    // Ekranda dars ildizi va o'qiladigan matn bormi.
    const rendered = await page.evaluate(() => {
      const root = document.querySelector('#root');
      const lessonRoot = root?.querySelector('[class*="root"]') || null;
      return {
        hasRoot: Boolean(lessonRoot),
        styleTags: root ? root.querySelectorAll('style').length : 0,
        textLength: (root?.innerText || '').trim().length,
      };
    });
    if (!rendered.hasRoot) problems.push('dars ildizi (root elementi) chizilmadi');
    if (!rendered.styleTags) problems.push('ichki <style> DOM ga tushmadi');
    if (rendered.textLength < 20) problems.push(`ekranda matn yo'q (${rendered.textLength} belgi)`);
  } finally {
    page.off('console', onConsole);
    page.off('pageerror', onPageError);
  }
  return problems;
}

const lessons = parseSelection(process.argv.slice(2));
await writeProbe();

const server = await createServer({
  configFile: false,
  root: rootDir,
  plugins: [react()],
  logLevel: 'error',
  server: { host: '127.0.0.1', port: PORT, strictPort: true },
});
await server.listen();

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
const page = await context.newPage();

let failed = 0;
try {
  for (const lessonNumber of lessons) {
    const dars = lessonName(lessonNumber);
    for (const lang of LANGS) {
      const problems = await checkLesson(page, dars, lang);
      if (problems.length) {
        failed += 1;
        console.log(`FAIL ${dars} [${lang}]`);
        for (const problem of problems.slice(0, 6)) console.log(`     ${problem}`);
      } else {
        console.log(`ok   ${dars} [${lang}]`);
      }
    }
  }
} finally {
  await browser.close();
  await server.close();
}

if (failed) {
  console.log(`\nXATO: ${failed} ta sinov muvaffaqiyatsiz.`);
  process.exit(1);
}
console.log(`\nOK: ${lessons.length * LANGS.length} ta sinov o'tdi.`);
