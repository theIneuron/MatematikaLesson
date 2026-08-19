// ============================================================================
// grade6-lesson-smoke.mjs — БРАУЗЕРНАЯ проверка ЛЮБОГО урока 6 класса.
//
// Раньше такая проверка существовала только для урока 1 (`grade6-dars01-smoke`)
// и держала список селекторов-«лиц» на каждый его экран. Для нового урока её
// приходилось копировать. Здесь всё, что не зависит от темы:
//   1. каждый экран открывается, счётчик совпадает с номером;
//   2. в консоли нет ошибок;
//   3. ничего не вылезает вбок и НИЧЕГО не уходит под нижнюю панель;
//   4. контракт хука: два варианта, строка-обещание, разбор НЕ появляется,
//      после выбора урок сам уходит на второй экран.
//
// Экраны-фильмы растут во времени: их контент досчитывается до 30-й секунды.
// Поэтому их номера передаются флагом --film, иначе обрезанный блок проскочит.
//
// Запуск:
//   npx vite --port 5199                      (в отдельном терминале)
//   node scripts/grade6-lesson-smoke.mjs 1 --film 2,3,5,6,7
//   node scripts/grade6-lesson-smoke.mjs 2 --lang ru --size 1366x768
// ============================================================================
import fs from 'node:fs';
import { chromium } from 'playwright';
import { grade6Nazariy } from '../src/lessons/grade6.js';

const args = process.argv.slice(2);
const flag = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : def;
};
const NUM = Number(args.find((a) => /^\d+$/.test(a)) || 1);
const FILM = String(flag('film', '')).split(',').map(Number).filter(Boolean);
const BASE = process.env.BASE || 'http://localhost:5199';
const LANGS = String(flag('lang', 'ru,uz')).split(',');
const SIZES = String(flag('size', '1366x768,390x844')).split(',').map((s) => s.split('x').map(Number));

const lesson = grade6Nazariy[NUM - 1];
if (!lesson) { console.log(`Урока ${NUM} нет в src/lessons/grade6.js`); process.exit(1); }

// Сколько экранов — берём из самого урока, а не из головы.
const file = `src/components/grade6/Dars${String(NUM).padStart(2, '0')}.jsx`;
const totalMatch = fs.existsSync(file) && fs.readFileSync(file, 'utf8').match(/const TOTAL_SCREENS = (\d+)/);
const TOTAL = totalMatch ? Number(totalMatch[1]) : 15;

const problems = [];
const note = (m) => console.log('  ' + m);
const fail = (m) => { problems.push(m); console.log('  XATO: ' + m); };

const overflowX = (page) => page.evaluate(() => {
  const root = document.querySelector('.lesson-root');
  if (!root) return ['.lesson-root нет'];
  const box = root.getBoundingClientRect();
  const clipped = (el) => {
    let p = el.parentElement;
    while (p && p !== document.body) {
      const ov = getComputedStyle(p).overflowX;
      if (ov === 'hidden' || ov === 'clip' || ov === 'auto' || ov === 'scroll') return true;
      p = p.parentElement;
    }
    return false;
  };
  const bad = [];
  document.querySelectorAll('.lesson-root .stage-content *').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return;
    if ((r.right > box.right + 1.5 || r.left < box.left - 1.5) && !clipped(el)) {
      bad.push(String(el.className || el.tagName).slice(0, 40));
    }
  });
  return bad.slice(0, 3);
});

const fold = (page) => page.evaluate(() => {
  const el = document.querySelector('.lesson-root .stage-content');
  return el ? Math.max(0, Math.round(el.scrollHeight - el.clientHeight)) : 0;
});

const mute = async (page) => {
  const b = page.locator('button[title="Sound off"]').first();
  if (await b.count()) await b.click().catch(() => {});
};

async function run(lang, w, h) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  console.log(`\n[${lang}] ${w}x${h} — урок ${NUM}, экранов ${TOTAL}`);

  for (let i = 1; i <= TOTAL; i += 1) {
    await page.goto(`${BASE}/6-sinf/matematika/nazariy/${lesson.slug}?lang=${lang}&screen=${i}`, { waitUntil: 'networkidle' });
    try {
      await page.waitForSelector('.lesson-root', { timeout: 12000 });
    } catch {
      fail(`экран ${i} не открылся`);
      continue;
    }
    await mute(page);
    await page.waitForTimeout(700);

    const counter = (await page.locator('.chrome .mono').first().innerText().catch(() => '')).trim();
    const want = String(i).padStart(2, '0');
    if (!counter.startsWith(want)) fail(`экран ${i}: счётчик «${counter}», ожидался ${want}`);

    (await overflowX(page)).forEach((o) => fail(`экран ${i}: ${o} вылез вбок`));

    // Замер ПОСЛЕ того, как осядут входные анимации, иначе покажет дефекты,
    // которых нет. Для фильмов замер повторяется, пока кадры досчитываются.
    await page.waitForTimeout(1300);
    let under = await fold(page);
    await page.waitForTimeout(4500);
    under = Math.max(under, await fold(page));
    if (FILM.includes(i)) {
      await page.waitForTimeout(26000);
      under = Math.max(under, await fold(page));
    }
    if (under) fail(`экран ${i}: контент ушёл под нижнюю панель на ${under}px`);
    else note(`${counter || i} — чисто`);
  }

  // ---- КОНТРАКТ ХУКА ----
  await page.goto(`${BASE}/6-sinf/matematika/nazariy/${lesson.slug}?lang=${lang}&screen=1`, { waitUntil: 'networkidle' });
  await page.waitForSelector('.lesson-root', { timeout: 12000 });
  await mute(page);
  await page.waitForTimeout(900);
  const opts = page.locator('.g6-hook-options .option');
  const n = await opts.count();
  if (n < 2) fail(`хук: вариантов ${n}, а должно быть два`);
  if (!(await page.locator('.g6-hook-note').count())) fail('хук: нет строки «ответ проверим по ходу урока»');
  if (n >= 2) {
    await opts.first().click();
    await page.waitForTimeout(260);
    for (const [sel, what] of [
      ['.hk-team', 'команды'], ['.hk-bench', 'скамейка'], ['.hk-eq', 'формула'],
      ['.hk-both', 'сравнение двух случаев'], ['.hk-why', 'блок «где ещё нужно»'],
      ['.option-correct', 'зелёный верный'], ['.option-picked-wrong', 'красный неверный'],
    ]) {
      if (await page.locator(sel).count()) fail(`хук: после выбора появился разбор (${what})`);
    }
    await page.waitForTimeout(1400);
    const after = (await page.locator('.chrome .mono').first().innerText().catch(() => '')).trim();
    if (!after.startsWith('02')) fail(`хук: после ответа урок не ушёл дальше, счётчик «${after}»`);
    else note('хук: ответ принят, урок ушёл на 02');
  }

  await browser.close();
  return errors;
}

// ---------------------------------------------------------------------------
// ПРЕВЬЮ БЕЗ ?lang= — так урок открывают со страницы списка.
// Все проверки выше идут с языком в адресе, а тогда переключатель RU/UZ/EN не
// рендерится (`isPreview` ложно) — и весь превью-слой для теста невидим. Именно
// так мимо smoke прошла обрезанная нижняя панель: класс рисовал переключатель
// блоком В ПОТОКЕ, он опускал сцену на 24 px, и кнопка «Davom etish» уходила за
// нижний край (нашёл методист глазами 2026-08-19, тест молчал).
// Здесь два замера: панель целиком в кадре и переключатель не накрывает
// кнопки звука и повтора в шапке урока.
// ---------------------------------------------------------------------------
async function previewChrome(w, h) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  console.log(`\n[превью без lang] ${w}x${h}`);
  await page.goto(`${BASE}/6-sinf/matematika/nazariy/${lesson.slug}`, { waitUntil: 'networkidle' });
  await page.waitForSelector('.stage-nav', { timeout: 12000 }).catch(() => {});
  await page.waitForTimeout(2200);
  const m = await page.evaluate(() => {
    const nav = document.querySelector('.stage-nav');
    const sw = document.querySelector('.g6-lang-switch');
    const header = document.querySelector('.stage-header');
    const box = (el) => { const b = el.getBoundingClientRect(); return { l: b.left, t: b.top, r: b.right, b: b.bottom }; };
    const hit = (a, b) => !(a.r <= b.l || b.r <= a.l || a.b <= b.t || b.b <= a.t);
    const s = sw ? box(sw) : null;
    const covered = s && header
      ? [...header.querySelectorAll('button')].filter((el) => hit(s, box(el)))
        .map((el) => el.getAttribute('title') || 'кнопка')
      : [];
    return {
      vh: window.innerHeight,
      navBottom: nav ? Math.round(box(nav).b) : null,
      hasSwitch: !!sw,
      switchTop: s ? Math.round(s.t) : null,
      switchBottom: s ? Math.round(s.b) : null,
      covered,
    };
  });
  if (m.navBottom === null) fail('превью: нижней панели нет на экране');
  else if (m.navBottom > m.vh + 1) fail(`превью: нижняя панель обрезана на ${m.navBottom - m.vh}px (экран ${m.vh})`);
  else note(`нижняя панель в кадре (до ${m.navBottom} при ${m.vh})`);
  if (!m.hasSwitch) note('переключателя языка нет — урок открылся не в режиме превью');
  else if (m.covered.length) fail(`превью: переключатель языка накрывает ${m.covered.join(', ')}`);
  else note(`переключатель ${m.switchTop}..${m.switchBottom} — шапку урока не накрывает`);
  await browser.close();
}

const all = [];
for (const lang of LANGS) {
  for (const [w, h] of SIZES) all.push(...(await run(lang, w, h)));
}
for (const [w, h] of SIZES) await previewChrome(w, h);
// В превью нет адреса TTS — запрос озвучки даёт 404. Это не дефект урока.
const real = all.filter((e) => !/favicon|net::ERR_|Web Speech|speechSynthesis|Failed to load resource/i.test(e));
console.log('\n=== ИТОГ ===');
console.log('ошибок консоли: ' + real.length);
real.slice(0, 8).forEach((e) => console.log('  ' + e));
console.log('проблем: ' + problems.length);
problems.forEach((p) => console.log('  ' + p));
process.exit(problems.length || real.length ? 1 : 0);
