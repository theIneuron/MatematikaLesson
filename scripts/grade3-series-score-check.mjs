// grade3-series-score-check.mjs — экраны-серии («Собери число» и подобные) обязаны считать
// верные ответы честно.
//
// Замечание методиста по уроку 1, экран 09: одна серия решена с ошибкой, а внизу всё равно
// «3 / 3». У таких экранов счёта не было вовсе — число рисовалось жёстко.
//
// Скрипт открывает экран, первый раунд проваливает намеренно (жмёт «Проверить» на неверном
// наборе), потом решает всё верно и читает итог. Ожидание: верных меньше, чем раундов.
//
// Запуск: node scripts/grade3-series-score-check.mjs --slug dars01-… --screen 9 --rounds 3
import { chromium } from 'playwright';

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > 0 && process.argv[i + 1] ? process.argv[i + 1] : d; };
const PORT = arg('port', '5179');
const SLUG = arg('slug', 'dars01-yuzlik-onlik-birlik');
const SCREEN = Number(arg('screen', '9'));
const TARGETS = arg('targets', '').split(',').filter(Boolean);
const ROUNDS = TARGETS.length || Number(arg('rounds', '3'));

const readResult = () => {
  const box = document.querySelector('.frame-success');
  if (!box) return null;
  const m = (box.textContent || '').match(/(\d+)\s*(?:из|tadan)\s*(\d+)/);
  return m ? `${m[1]}/${m[2]}` : (box.textContent || '').trim().slice(0, 40);
};

const run = async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`http://localhost:${PORT}/3-sinf/matematika/nazariy/${SLUG}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find((x) => /ovoz|звук|mute/i.test(x.getAttribute('aria-label') || x.title || ''));
    if (b) b.click();
  }).catch(() => {});

  // листаем до нужного экрана
  for (let s = 0; s < SCREEN; s++) {
    const next = page.locator('button').filter({ hasText: /^(Дальше|Davom etish)$/ }).last();
    if (!(await next.count())) break;
    await next.click({ force: true }).catch(() => {});
    await page.waitForTimeout(450);
  }
  await page.waitForTimeout(500);

  const check = page.locator('button').filter({ hasText: /^(Проверить|Tekshir)$/ });
  if (!(await check.count())) { console.log('экран с сериями не найден'); await browser.close(); process.exit(1); }

  // раунд 1 — намеренная ошибка: жмём «Проверить» на пустом/неверном наборе
  await check.first().click({ force: true }).catch(() => {});
  await page.waitForTimeout(1700);
  console.log('раунд 1: сначала ОШИБКА');

  // дальше решаем верно: «+» у каждого разряда по цифрам целевого числа
  for (let r = 0; r < ROUNDS; r++) {
    const target = TARGETS[r];
    if (!target) break;
    const digits = target.padStart(3, '0').split('').map(Number);
    const plus = page.locator('button:visible').filter({ hasText: /^\+$/ });
    const n = await plus.count();
    for (let d = 0; d < Math.min(n, digits.length); d++) {
      for (let k = 0; k < digits[d]; k++) { await plus.nth(d).click({ force: true }).catch(() => {}); await page.waitForTimeout(45); }
    }
    await check.first().click({ force: true }).catch(() => {});
    await page.waitForTimeout(1700);
    console.log(`раунд ${r + 1}: верно (${target})`);
  }

  await page.waitForTimeout(700);
  const shown = await page.evaluate(readResult);
  const want = `${ROUNDS - 1}/${ROUNDS}`;
  console.log(`\nитог на экране: ${shown} | должно быть: ${want}`);
  await browser.close();
  process.exit(shown === want ? 0 : 1);
};

run();
