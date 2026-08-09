// grade3-score-check.mjs — счётчик финальной панели обязан считать ЧЕСТНО.
//
// Замечание методиста: одно задание решено неверно, два верно, а панель показала «3 из 3».
// Скрипт доходит до финальной панели, ПЕРВОЕ задание проваливает намеренно (вводит заведомо
// неверное число, потом верное), остальные решает сразу верно и читает итоговый счёт.
// Ожидание: верных на единицу меньше, чем заданий.
//
// Запуск:
//   node scripts/grade3-score-check.mjs --slug dars35-… --nums 5,7,35,40,4,28,6 --final 27,36,5
import { chromium } from 'playwright';

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > 0 && process.argv[i + 1] ? process.argv[i + 1] : d; };
const PORT = arg('port', '5179');
const SLUG = arg('slug', '');
const NUMS = arg('nums', '').split(',').filter(Boolean);
const FINAL = arg('final', '').split(',').filter(Boolean);
const WRONG = arg('wrong', '99');
const LAST = Number(arg('last', '16'));

const type = async (page, digits) => {
  for (const d of String(digits).split('')) {
    await page.locator('button:visible').filter({ hasText: new RegExp(`^${d}$`) }).last().click({ force: true, timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(80);
  }
};
const clearField = async (page) => {
  for (let i = 0; i < 4; i++) {
    await page.locator('button:visible').filter({ hasText: /^⌫$/ }).last().click({ force: true, timeout: 1500 }).catch(() => {});
    await page.waitForTimeout(60);
  }
};
const counter = () => {
  const el = [...document.querySelectorAll('*')].reverse().find((e) => e.children.length === 0 && /^Задание \d+ из \d+$/.test((e.textContent || '').trim()));
  return el ? el.textContent.trim() : null;
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

  let numI = 0;
  let onFinal = false;

  for (let s = 0; s <= LAST; s++) {
    await page.waitForTimeout(300);
    const check = page.locator('button').filter({ hasText: /^(Проверить|Tekshir)$/ });
    // финальную панель узнаём по счётчику вида «1 / 3» рядом с заданием
    const cnt = await page.evaluate(counter);
    if (!onFinal && cnt && cnt.startsWith(`Задание 1 из ${FINAL.length}`) && (await check.count())) onFinal = true;

    if (onFinal) {
      console.log(`финальная панель найдена, счётчик заданий: ${cnt}`);
      for (let k = 0; k < FINAL.length; k++) {
        if (k === 0) {
          await type(page, WRONG);
          await check.first().click({ force: true }).catch(() => {});
          await page.waitForTimeout(1900);
          await clearField(page);
          console.log(`  задание 1: сначала ОШИБКА (${WRONG})`);
        }
        // MCPICK: если задание с вариантами, вместо набора выбираем верный вариант перебором
        const hasPad = await page.locator('button').filter({ hasText: /^(Проверить|Tekshir)$/ }).count();
        if (hasPad) {
          await type(page, FINAL[k]);
          await page.locator('button').filter({ hasText: /^(Проверить|Tekshir)$/ }).first().click({ force: true }).catch(() => {});
          await page.waitForTimeout(2000);
        } else {
          const opts = page.locator('.option:visible');
          const n = await opts.count();
          for (let o = 0; o < n; o++) {
            await opts.nth(o).click({ force: true }).catch(() => {});
            await page.waitForTimeout(700);
            const solved = await page.locator('.option-correct').count();
            if (solved) break;
          }
          await page.waitForTimeout(1600);
        }
        console.log(`  задание ${k + 1}: верно (${FINAL[k]})`);
      }
      await page.waitForTimeout(900);
      // итог живёт в зелёном блоке результата, а не в счётчике экранов наверху
      const shown = await page.evaluate(() => {
        const box = document.querySelector('.frame-success');
        if (!box) return null;
        const m = (box.textContent || '').match(/(\d+)\s*(?:\/|из|tadan)\s*(\d+)/);
        return m ? `${m[1]} / ${m[2]}` : null;   // «Верно: 2 из 3» тоже читается
      });
      const want = `${FINAL.length - 1} / ${FINAL.length}`;
      console.log(`\nитог на экране: ${shown} | должно быть: ${want}`);
      await browser.close();
      process.exit(shown === want ? 0 : 1);
    }

    // на экране-консоли ввод повторяется несколько раз подряд — отвечаем, пока просят
    let guard = 0;
    while ((await check.count()) && numI < NUMS.length && guard++ < 4) {
      const v = NUMS[numI++];
      await type(page, v);
      await check.first().click({ force: true }).catch(() => {});
      await page.waitForTimeout(1600);
    }
    const next = page.locator('button').filter({ hasText: /^(Дальше|Davom etish)$/ });
    if (!(await next.count())) break;
    const btn = next.last();
    if (await btn.isDisabled().catch(() => true)) { await page.waitForTimeout(700); if (await btn.isDisabled().catch(() => true)) break; }
    await btn.click({ force: true }).catch(() => {});
  }
  await browser.close();
  console.log('финальная панель не найдена');
  process.exit(1);
};

run();
