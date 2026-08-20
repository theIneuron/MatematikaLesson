// КОНТЕНТ ПОД НИЖНЕЙ ПАНЕЛЬЮ — сразу по всему классу, на двух языках.
//
// Полный smoke (grade6-lesson-smoke.mjs) ходит по экранам ногами и делает это
// одним уроком за раз: класс целиком им не проверить. Здесь только один замер —
// scrollHeight против clientHeight у .stage-content, — зато на всех 46 уроках.
// Так были найдены четыре обрезка на телефоне после того, как нижняя панель
// получила отступ: уроки 1, 37, 40, 41.
//
// ВЫДЕРЖКА ВАЖНА. Замер во время fade-up показывает дефекты, которых нет:
// элемент в этот момент сдвинут вниз. Поэтому первый замер только на 4-й
// секунде, второй на 7-й — оба уже после анимаций, но второй ловит экраны,
// которые досчитывают строки. Экраны-фильмы растут до 30-й секунды, их этой
// проверкой не покрыть: для них остаётся smoke с флагом --film.
//
// Нужен поднятый dev-сервер (параметр ?screen=N — отладочный):
//   npx vite --port 5199
//   node scripts/grade6-fold-sweep.mjs                       // 46 уроков, ru+uz, телефон
//   SIZE=1366x768 node scripts/grade6-fold-sweep.mjs         // десктоп
//   LESSONS=37,40 LANGS=ru node scripts/grade6-fold-sweep.mjs
//
// Выход: 1, если где-то контент не влез.
import { chromium } from 'playwright';
import { grade6Nazariy } from '../src/lessons/grade6.js';

const BASE = process.env.BASE || 'http://localhost:5199';
const LESSONS = (process.env.LESSONS || Array.from({ length: 46 }, (_, i) => i + 1).join(','))
  .split(',').map(Number).filter((n) => n >= 1 && n <= 46);
const LANGS = (process.env.LANGS || 'ru,uz').split(',');
const [W, H] = (process.env.SIZE || '390x844').split('x').map(Number);
const WORKERS = Number(process.env.WORKERS || 3);

const jobs = [];
LESSONS.forEach((n) => LANGS.forEach((lang) => jobs.push([n, lang])));

const browser = await chromium.launch();
const hits = [];
let done = 0;

const fold = (page) => page.evaluate(() => {
  const el = document.querySelector('.lesson-root .stage-content');
  return el ? Math.max(0, Math.round(el.scrollHeight - el.clientHeight)) : 0;
});

async function work(id) {
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  for (let k = id; k < jobs.length; k += WORKERS) {
    const [n, lang] = jobs[k];
    const lesson = grade6Nazariy[n - 1];  // реестр без поля number: порядок = номер
    if (!lesson) { console.log(`урок ${n}: нет в реестре`); continue; }
    for (let s = 1; s <= 15; s += 1) {
      const at = `Dars${String(n).padStart(2, '0')} ${lang} экран ${s}`;
      try {
        await page.goto(`${BASE}/6-sinf/matematika/nazariy/${lesson.slug}?lang=${lang}&screen=${s}`,
          { waitUntil: 'domcontentloaded', timeout: 25000 });
        await page.waitForSelector('.lesson-root .stage-content', { timeout: 10000 });
        // Ждём ШРИФТЫ. Пока они грузятся, страница рисуется запасным шрифтом, а он
        // выше: под нагрузкой это давало 9 лишних пикселей там, где их нет.
        await page.evaluate(() => document.fonts && document.fonts.ready).catch(() => {});
        await page.waitForTimeout(4000);
        let under = await fold(page);
        await page.waitForTimeout(3000);
        under = Math.max(under, await fold(page));
        // Замер под нагрузкой может попасть в незакончившуюся анимацию. Если он
        // что-то нашёл, перепроверяем в устоявшемся состоянии и верим второму.
        if (under > 0) {
          await page.waitForTimeout(3500);
          under = await fold(page);
        }
        if (under > 0) hits.push(`${at}: ${under}px`);
      } catch (e) {
        hits.push(`${at}: НЕ ОТКРЫЛСЯ — ${String(e.message).slice(0, 50)}`);
      }
    }
    done += 1;
    console.log(`[${done}/${jobs.length}] Dars${String(n).padStart(2, '0')} ${lang} — замечаний ${hits.length}`);
  }
  await page.close();
}

await Promise.all(Array.from({ length: WORKERS }, (_, i) => work(i)));
await browser.close();
console.log(`\nразмер ${W}x${H}, языки ${LANGS.join('+')}, уроков ${LESSONS.length}`);
console.log(hits.length ? `ПОД ПАНЕЛЬЮ: ${hits.length}` : 'нигде не уходит под панель');
hits.sort().forEach((h) => console.log('  ' + h));
if (hits.length) process.exitCode = 1;
