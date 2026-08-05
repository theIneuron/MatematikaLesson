// grade3-geometry.mjs — геометрия первого и последнего экрана уроков 3 класса.
// Зачем: у сцены (.lm-scene) высота задаётся одним правилом на весь урок, поэтому её легко
// незаметно сжать, а панели реквизита легко выдавливают содержимое в скролл после ответа.
// Скрипт печатает: размер сцены, переполнение .stage-content ДО ответа и ПОСЛЕ ответа,
// высоты рамок. Эталон — урок 1: сцена 629x330 при 1440x900, переполнения нет.
//
// Запуск (превью должно быть поднято):
//   npx vite --port 5179 --strictPort
//   node scripts/grade3-geometry.mjs
//   node scripts/grade3-geometry.mjs --port 5180 --sizes 1440x900,1366x768,390x844
//   node scripts/grade3-geometry.mjs --lessons dars13-yigindini-bolish,dars14-amallar-tartibi
//   node scripts/grade3-geometry.mjs --last          # последний экран (клики «Дальше»)
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const arg = (name, def) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 && process.argv[i + 1] ? process.argv[i + 1] : def;
};
const has = (name) => process.argv.includes(`--${name}`);

const PORT = arg('port', '5179');
const BASE = `http://localhost:${PORT}`;
const SIZES = arg('sizes', '1440x900').split(',').map((s) => s.split('x').map(Number));
const LESSONS = arg('lessons', [
  'dars01-yuzlik-onlik-birlik',
  'dars10-kopaytirish-jadvali',
  'dars11-kopaytirish-bolish-10-100',
  'dars12-yigindini-kopaytirish',
  'dars13-yigindini-bolish',
  'dars14-amallar-tartibi'
].join(',')).split(',');
const LAST = has('last');

const measure = (page) => page.evaluate(() => {
  const sc = document.querySelector('.stage-content');
  const scene = document.querySelector('.lm-scene');
  const r = (el) => { const b = el.getBoundingClientRect(); return { w: Math.round(b.width), h: Math.round(b.height) }; };
  return {
    over: sc ? sc.scrollHeight - sc.clientHeight : null,
    scene: scene ? r(scene) : null,
    frames: Array.from(document.querySelectorAll('.frame')).map((f) => Math.round(f.getBoundingClientRect().height)),
    opts: document.querySelectorAll('button.option').length,
    screen: (document.querySelector('.mono')?.textContent || '').replace(/\s/g, '')
  };
});

const mute = async (page) => {
  const b = page.locator('button[title="Sound off"]');
  if (await b.count()) { await b.first().click({ force: true }); await page.waitForTimeout(120); }
};

const browser = await chromium.launch();
for (const [vw, vh] of SIZES) {
  console.log(`\n=== ${vw}x${vh} ${LAST ? '(последний экран)' : '(первый экран)'} ===`);
  for (const slug of LESSONS) {
    const page = await browser.newPage({ viewport: { width: vw, height: vh } });
    const errs = [];
    page.on('pageerror', (e) => errs.push(e.message.slice(0, 90)));
    try {
      await page.goto(`${BASE}/3-sinf/matematika/nazariy/${slug}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1200);
      await mute(page);

      if (LAST) {
        for (let i = 0; i < 20; i += 1) {
          const nx = page.locator('button.btn-white-accent').last();
          if (!(await nx.count())) break;
          const label = (await nx.innerText().catch(() => '')) || '';
          if (/Завершить|Tugatish/.test(label)) break;
          await nx.click({ force: true });
          await page.waitForTimeout(260);
          await mute(page);
        }
        await page.waitForTimeout(1200);
        const m = await measure(page);
        console.log(`${slug.padEnd(34)} сцена ${m.scene ? m.scene.w + 'x' + m.scene.h : 'нет'} | скролл +${m.over} | рамки ${m.frames.join(',')}`);
      } else {
        const before = await measure(page);
        let after = null;
        if (await page.locator('button.option').count()) {
          await page.locator('button.option').first().click({ force: true });
          await page.waitForTimeout(1400);
          after = await measure(page);
        }
        console.log(`${slug.padEnd(34)} сцена ${before.scene ? before.scene.w + 'x' + before.scene.h : 'нет'} | скролл до +${before.over}` +
          (after ? ` / после +${after.over}` : ' / ответа нет') +
          ` | вариантов ${before.opts} | рамки ${before.frames.join(',')}`);
      }
      if (errs.length) console.log(`   ОШИБКИ: ${[...new Set(errs)].slice(0, 3).join(' | ')}`);
    } catch (e) {
      console.log(`${slug.padEnd(34)} НЕ ОТКРЫЛСЯ: ${e.message.slice(0, 80)}`);
    }
    await page.close();
  }
}
await browser.close();
