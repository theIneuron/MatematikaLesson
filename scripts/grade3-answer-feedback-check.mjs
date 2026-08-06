// grade3-answer-feedback-check.mjs — числовой ответ обязан отвечать ВИДИМО.
//
// Замечание методиста по уроку 1: «нажал проверить — перекидывает на следующее задание, не
// показывает верно или нет; при ошибке только текст, визуально ничего». Скрипт доходит до
// экрана с полем ввода, вводит заведомо неверное число, жмёт «Проверить» и смотрит, что
// поле поменяло вид (рамка и фон), а не осталось прежним. Потом то же самое с верным
// ответом — поле должно стать зелёным.
//
// Запуск: node scripts/grade3-answer-feedback-check.mjs --slug dars01-… --wrong 111 --right 645
import { chromium } from 'playwright';

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > 0 && process.argv[i + 1] ? process.argv[i + 1] : d; };
const PORT = arg('port', '5179');
const SLUG = arg('slug', 'dars01-yuzlik-onlik-birlik');
const WRONG = arg('wrong', '111');
const RIGHT = arg('right', '645');
const LAST = Number(arg('last', '14'));

const boxStyle = () => {
  // поле ответа: моноширинный блок с толстой рамкой и разрядкой букв
  const el = [...document.querySelectorAll('div')].find((d) => {
    const cs = getComputedStyle(d);
    return cs.letterSpacing === '4px' && parseFloat(cs.borderTopWidth) >= 2 && d.getBoundingClientRect().height > 28;
  });
  if (!el) return null;
  const cs = getComputedStyle(el);
  return { text: (el.textContent || '').trim(), border: cs.borderTopColor, bg: cs.backgroundColor, cls: String(el.className) };
};

const type = async (page, digits) => {
  for (const d of digits.split('')) {
    await page.locator('button:visible').filter({ hasText: new RegExp(`^${d}$`) }).last().click({ force: true, timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(90);
  }
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

  const NUMS = arg('nums', '').split(',').filter(Boolean);
  const SKIP = Number(arg('skip', '0'));   // сколько экранов с полем пропустить
  let boxSeen = 0;
  let numI = 0;
  let found = false;

  for (let s = 0; s <= LAST; s++) {
    await page.waitForTimeout(300);
    const check = page.locator('button').filter({ hasText: /^(Проверить|Tekshir)$/ });
    const hasBox = await page.evaluate(boxStyle);

    // поле NumPad найдено — здесь и проверяем обратную связь
    if (hasBox && (await check.count()) && boxSeen++ >= SKIP) {
      const before = hasBox;
      await type(page, WRONG);
      await check.first().click({ force: true }).catch(() => {});
      await page.waitForTimeout(250);
      const bad = await page.evaluate(boxStyle);
      await page.waitForTimeout(1800);
      await type(page, RIGHT);
      await check.first().click({ force: true }).catch(() => {});
      await page.waitForTimeout(250);
      const ok = await page.evaluate(boxStyle);
      console.log(`ekran ${s} | javob maydoni topildi`);
      console.log(`  boshida   | ramka ${before.border} | fon ${before.bg}`);
      console.log(`  xatoda    | ramka ${bad?.border} | fon ${bad?.bg} | klass "${bad?.cls}"`);
      console.log(`  to'g'rida | ramka ${ok?.border} | fon ${ok?.bg}`);
      const badChanged = bad && (bad.border !== before.border || bad.bg !== before.bg);
      const okChanged = ok && (ok.border !== before.border || ok.bg !== before.bg);
      console.log(`
xatoda ko'rinadi: ${badChanged ? 'HA' : "YO'Q"} | to'g'rida ko'rinadi: ${okChanged ? 'HA' : "YO'Q"}`);
      found = true;
      await browser.close();
      process.exit(badChanged && okChanged ? 0 : 1);
    }

    // промежуточный экран с проверкой — отвечаем и идём дальше
    if (await check.count()) {
      const v = NUMS[numI++];
      if (v) { await type(page, v); await check.first().click({ force: true }).catch(() => {}); await page.waitForTimeout(1500); }
    }

    const next = page.locator('button').filter({ hasText: /^(Дальше|Davom etish)$/ });
    if (!(await next.count())) break;
    const btn = next.last();
    if (await btn.isDisabled().catch(() => true)) { await page.waitForTimeout(600); if (await btn.isDisabled().catch(() => true)) break; }
    await btn.click({ force: true }).catch(() => {});
  }

  await browser.close();
  console.log(found ? '' : 'javob maydoni topilmadi');
  process.exit(1);
};

run();
