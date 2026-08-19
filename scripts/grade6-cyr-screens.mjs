// РУССКИЕ БУКВЫ НА УЗБЕКСКОМ И АНГЛИЙСКОМ ЭКРАНЕ.
//
// Статическая проверка (grade6-lang-mix.mjs) смотрит данные. Эта смотрит то, что
// реально нарисовано: варианты ответа, подписи в сценах, кнопки, таблицы. Именно
// так был найден QA-случай «6 часов / 10 часов / 12 часов» на узбекском экране
// урока 19: строка лежала не в узле {ru,uz,en}, а общей для трёх языков.
//
// Нужен поднятый dev-сервер, потому что параметр ?screen=N — отладочный:
//   npx vite --port 5199
//   node scripts/grade6-cyr-screens.mjs                 // все 46, uz и en
//   LESSONS=19,20 LANGS=uz node scripts/grade6-cyr-screens.mjs
//
// Выход: 1, если русская буква нашлась.
import { chromium } from 'playwright';
import { grade6Nazariy } from '../src/lessons/grade6.js';

const BASE = process.env.BASE || 'http://localhost:5199';
const LESSONS = (process.env.LESSONS || Array.from({ length: 46 }, (_, i) => i + 1).join(','))
  .split(',').map(Number).filter((n) => n >= 1 && n <= 46);
const LANGS = (process.env.LANGS || 'uz,en').split(',');
const CYR = /[А-Яа-яЁё]/;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const hits = [];
let checked = 0;

for (const n of LESSONS) {
  const lesson = grade6Nazariy[n - 1];  // реестр без поля number: порядок = номер
  if (!lesson) { console.log(`урок ${n}: нет в реестре`); continue; }
  for (const lang of LANGS) {
    for (let s = 1; s <= 15; s += 1) {
      const url = `${BASE}/6-sinf/matematika/nazariy/${lesson.slug}?lang=${lang}&screen=${s}`;
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
        await page.waitForSelector('.lesson-root', { timeout: 8000 });
        await page.waitForTimeout(250);
        const text = await page.evaluate(() => {
          const root = document.querySelector('.lesson-root');
          return root ? root.innerText : '';
        });
        checked += 1;
        if (CYR.test(text)) {
          const bad = [...new Set(text.match(/[А-Яа-яЁё][А-Яа-яЁё\s\d,.:—-]{0,40}/g) || [])];
          hits.push(`Dars${String(n).padStart(2, '0')} ${lang} экран ${s}: ${bad.slice(0, 4).join(' | ')}`);
        }
      } catch (e) {
        hits.push(`Dars${String(n).padStart(2, '0')} ${lang} экран ${s}: НЕ ОТКРЫЛСЯ — ${String(e.message).slice(0, 60)}`);
      }
    }
  }
  console.log(`Dars${String(n).padStart(2, '0')} пройден, замечаний пока ${hits.length}`);
}

await browser.close();
console.log(`\nэкранов проверено: ${checked}`);
console.log(hits.length ? `РУССКИЕ БУКВЫ В UZ/EN: ${hits.length}` : 'русских букв в узбекском и английском нет');
hits.forEach((h) => console.log('  ' + h));
if (hits.length) process.exitCode = 1;
