// grade3-hint-fact-shot.mjs — глазами методиста: экран-тренажёр урока.
// Делает два снимка: (1) после НЕВЕРНОГО ответа — виден ли разбор ошибки, (2) после всех
// ответов — появилась ли карточка факта с картинкой.
// Проверяет не только снимки: меряет, что блок разбора реально в DOM и у него красная рамка,
// и что внутри карточки факта есть svg.
//
// Запуск (нужен поднятый vite --port 5179):
//   node scripts/grade3-hint-fact-shot.mjs --slug dars02-... --screen 13 --out c:/tmp/shots
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
import fs from 'node:fs';

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > 0 && process.argv[i + 1] ? process.argv[i + 1] : d; };
const PORT = arg('port', '5179');
const SLUG = arg('slug', '');
const SCREEN = Number(arg('screen', '13'));
const OUT = arg('out', 'c:/tmp/shots');
const LANG = arg('lang', 'ru');
const NUMS = arg('nums', '').split(',').filter(Boolean);

fs.mkdirSync(OUT, { recursive: true });
const [VW, VH] = arg('size', '900x1000').split('x').map(Number);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: VW, height: VH } });
const errs = [];
page.on('pageerror', (e) => errs.push(e.message.slice(0, 100)));

const mute = async () => {
  const b = page.locator('button[title="Sound off"]');
  if (await b.count()) await b.first().click({ force: true }).catch(() => {});
};

await page.goto(`http://localhost:${PORT}/3-sinf/matematika/nazariy/${SLUG}?lang=${LANG}`, { waitUntil: 'networkidle' });
await page.waitForTimeout(700);
await mute();

// листаем до экрана-тренажёра
for (let s = 0; s < SCREEN; s++) {
  await mute();
  const next = page.locator('button').filter({ hasText: /^(Дальше|Davom etish)$/ }).last();
  if (!(await next.count())) break;
  await next.click({ force: true }).catch(() => {});
  await page.waitForTimeout(380);
}
await mute();
await page.waitForTimeout(400);

// 1. намеренная ошибка
let wrongDone = false;
const opts = page.locator('button.option:not([disabled])');
if (await opts.count()) {
  // первый вариант может оказаться верным — тогда подсказки не будет; пробуем дальше
  for (let k = 0; k < 4; k++) {
    const o = page.locator('button.option:not([disabled])');
    if (!(await o.count())) break;
    await o.first().click({ force: true }).catch(() => {});
    await page.waitForTimeout(1500);
    wrongDone = true;
    if (await page.evaluate(() => !!document.querySelector('.lm-hint-bad'))) break;
  }
} else {
  const pad = page.locator('button').filter({ hasText: /^[0-9]$/ });
  if (await pad.count()) {
    await pad.first().click({ force: true }).catch(() => {});   // заведомо неверная цифра
    const chk = page.locator('button').filter({ hasText: /^(Проверить|Tekshir)$/ });
    if (await chk.count()) { await chk.first().click({ force: true }).catch(() => {}); wrongDone = true; }
    await page.waitForTimeout(900);
  }
}

const hint = await page.evaluate(() => {
  const el = document.querySelector('.lm-hint-bad');
  if (!el) return null;
  const cs = getComputedStyle(el);
  const r = el.getBoundingClientRect();
  return { text: (el.textContent || '').slice(0, 60), bg: cs.backgroundColor, border: cs.borderLeftColor, w: Math.round(r.width), h: Math.round(r.height) };
});
await page.screenshot({ path: `${OUT}/${SLUG.slice(0, 6)}-hint.png` });

// 2. дорешиваем до конца экрана
const DBG = process.argv.includes('--debug');
// Задание сменяется не сразу: после верного ответа экран ещё ~1,7 с держит разбор, а клавиатура
// заперта. Поэтому каждый шаг ждёт готовности и подтверждения, что номер задания сменился.
const taskNo = () => page.evaluate(() => ((document.querySelector('.frame .mono') || {}).textContent || '').trim());
const waitReady = async (ms = 4000) => {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    const ok = await page.evaluate(() => {
      if (document.querySelector('.d2-factcard')) return true;
      if (document.querySelector('button.option:not([disabled])')) return true;
      return Array.from(document.querySelectorAll('button')).some((b) => /^[0-9]$/.test((b.textContent || '').trim()) && !b.disabled);
    });
    if (ok) return true;
    await page.waitForTimeout(150);
  }
  return false;
};

for (let guard = 0; guard < 40; guard++) {
  if (await page.evaluate(() => !!document.querySelector('.d2-factcard'))) break;
  await waitReady();
  const before = await taskNo();
  if (DBG) console.log(`  шаг ${guard}: ${before} | вариантов ${await page.locator('button.option:not([disabled])').count()}`);

  const o = page.locator('button.option:not([disabled])');
  let usedNum = false;
  if (await o.count()) {
    await o.first().click({ force: true }).catch(() => {});
  } else {
    usedNum = true;
    const pad = page.locator('button').filter({ hasText: /^[0-9]$/ });
    if (!(await pad.count())) break;
    const back = page.locator('button').filter({ hasText: /^⌫$/ });
    for (let k = 0; k < 5 && (await back.count()); k++) await back.first().click({ force: true }).catch(() => {});
    const want = NUMS[0] || '1';
    for (const ch of String(want)) await page.locator('button').filter({ hasText: new RegExp(`^${ch}$`) }).first().click({ force: true }).catch(() => {});
    const chk = page.locator('button').filter({ hasText: /^(Проверить|Tekshir)$/ });
    if (await chk.count()) await chk.first().click({ force: true }).catch(() => {});
  }
  // ответ принят, если сменилось задание или показалась карточка факта
  for (let w = 0; w < 26; w++) {
    await page.waitForTimeout(150);
    const now = await taskNo();
    const fin = await page.evaluate(() => !!document.querySelector('.d2-factcard'));
    if (fin || now !== before) { if (usedNum && NUMS.length) NUMS.shift(); break; }   // число тратится, только если им и отвечали
  }
}
await page.waitForTimeout(900);

const fact = await page.evaluate(() => {
  const card = document.querySelector('.d2-factcard');
  if (!card) return null;
  const hero = card.querySelector('.d2-fact-hero svg');
  const r = hero ? hero.getBoundingClientRect() : null;
  return { hasHero: !!hero, w: r ? Math.round(r.width) : 0, h: r ? Math.round(r.height) : 0, anim: card.querySelectorAll('[class*="lm-ff-"]').length };
});
await page.screenshot({ path: `${OUT}/${SLUG.slice(0, 6)}-fact.png`, fullPage: true });

console.log(`${SLUG}`);
console.log(`  разбор ошибки: ${hint ? `есть, ${hint.w}x${hint.h}, фон ${hint.bg}, кант ${hint.border}` : (wrongDone ? 'НЕТ БЛОКА' : 'не удалось ошибиться')}`);
console.log(`  карточка факта: ${fact ? (fact.hasHero ? `картинка ${fact.w}x${fact.h}, анимаций ${fact.anim}` : 'БЕЗ КАРТИНКИ') : 'не дошёл'}`);
const over = await page.evaluate(() => { const sc = document.querySelector('.stage-content'); return sc ? sc.scrollHeight - sc.clientHeight : null; });
console.log(`  экран ${VW}x${VH}: перелив ${over} px`);
if (errs.length) console.log(`  ошибки страницы: ${errs.join(' | ')}`);
await browser.close();
process.exit(hint && fact && fact.hasHero ? 0 : 1);
