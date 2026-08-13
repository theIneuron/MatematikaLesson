// grade3-lms-check.mjs — проверяет собранные для LMS уроки 3 класса ТАК ЖЕ, как их
// компилирует платформа: в КЛАССИЧЕСКОМ режиме JSX (`React.createElement`).
//
// Зачем именно так: локальное превью (vite) собирает JSX в «автоматическом» режиме, где имя
// `React` не нужно. LMS — в классическом. Из-за этой разницы урок 6 класса падал на
// платформе с «React is not defined», а в браузере на этой машине всё выглядело исправно.
// Поэтому проверка компилирует файл классически и рендерит его в строку.
//
// Запуск: node scripts/grade3-lms-check.mjs [Dars17.jsx …]   (без аргументов — все)
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { build } from 'vite';

const EXTERNAL = new Set(['react', 'react-dom', 'react/jsx-runtime', 'react-dom/client', 'react-dom/server']);

// Собранные файлы 3 класса лежат рядом с уроками, в src/components/grade3/
// (перенесены из корня 2026-08-12). Другую папку задаёт флаг:
// --out=src/components/grade3/lms-grade3-standalone-tts
const outArg = process.argv.find((a) => a.startsWith('--out='));
const OUT = path.resolve(outArg ? outArg.slice('--out='.length) : 'src/components/grade3/lms-grade3-standalone');
const TMP = path.resolve('.tmp-lms-check');
const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const files = args.length ? args : fs.readdirSync(OUT).filter((f) => /^Dars\d+\.jsx$/.test(f)).sort();

fs.mkdirSync(TMP, { recursive: true });
let bad = 0;
for (const file of files) {
  try {
    // плагин react НЕ подключаем специально: он ставит автоматический runtime и спрятал бы
    // ровно ту ошибку, ради которой проверка и написана.
    const res = await build({
      configFile: false, root: OUT, logLevel: 'error',
      esbuild: { jsx: 'transform', jsxFactory: 'React.createElement', jsxFragment: 'React.Fragment' },
      oxc: { jsx: { runtime: 'classic' } },
      build: {
        write: false, minify: false, sourcemap: false, target: 'es2020', reportCompressedSize: false,
        lib: { entry: path.join(OUT, file), formats: ['es'], fileName: () => file.replace('.jsx', '') },
        rollupOptions: { external: (id) => EXTERNAL.has(id) }
      }
    });
    const outputs = Array.isArray(res) ? res.flatMap((r) => r.output ?? []) : res?.output ?? [];
    const chunk = outputs.find((o) => o.type === 'chunk' && o.isEntry);
    if (!chunk) throw new Error('сборка не дала результата');
    const out = path.join(TMP, file.replace('.jsx', '.mjs'));
    fs.writeFileSync(out, chunk.code, 'utf8');
    const mod = await import(pathToFileURL(out).href + `?t=${file}`);
    const Comp = mod.default;
    if (typeof Comp !== 'function') throw new Error('нет экспортируемого компонента');
    const html = renderToString(createElement(Comp, { lang: 'uz', studentName: 'Test', ttsApiBase: '', onFinished: () => {} }));
    if (!html || html.length < 500) throw new Error(`пустой рендер (${html.length} символов)`);
    console.log(`${file}: рендерится, ${Math.round(html.length / 1024)} КБ разметки`);
  } catch (e) {
    console.log(`${file}: ОШИБКА — ${String(e.message).slice(0, 160)}`);
    bad += 1;
  }
}
fs.rmSync(TMP, { recursive: true, force: true });
console.log(bad ? `\nне прошли: ${bad}` : '\nвсе файлы проходят проверку платформы');
process.exit(bad ? 1 : 0);
