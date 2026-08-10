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

// После неверного ответа плита гаснет на время разбора: пока она погашена, клики пропадают,
// и проверка засчитывала «верный ответ не позеленел», хотя цифры просто не дошли.
const waitPad = async (page) => {
  for (let i = 0; i < 40; i++) {
    const on = await page.evaluate(() => [...document.querySelectorAll('button')]
      .some((b) => /^[0-9]$/.test((b.textContent || '').trim()) && !b.disabled));
    if (on) return;
    await page.waitForTimeout(250);
  }
};
const type = async (page, digits) => {
  await waitPad(page);
  // поле не очищается само: без «стереть» верный ответ дописывается к неверному
  const back = page.locator('button').filter({ hasText: /^⌫$/ });
  for (let k = 0; k < 6 && (await back.count()); k++) await back.first().click({ force: true }).catch(() => {});
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
  // Кнопка звука подписана title="Sound off". Старый поиск по /звук|mute/ её не находил,
  // урок оставался озвученным и БЛОКИРОВАЛ ввод — проверка читала это как «поле не позеленело».
  const mute = async () => { const b = page.locator('button[title="Sound off"]'); if (await b.count()) await b.first().click({ force: true }).catch(() => {}); };
  await mute();

  const NUMS = arg('nums', '').split(',').filter(Boolean);
  const SKIP = Number(arg('skip', '0'));   // сколько экранов с полем пропустить
  let boxSeen = 0;
  let numI = 0;
  let found = false;

  for (let s = 0; s <= LAST; s++) {
    await mute();
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
      // «Поменялось» — мало: поле обязано покраснеть на ошибке и позеленеть на верном.
      // Иначе проверка засчитает красный на правильном ответе (так и случилось 2026-08-09,
      // когда в --right подставили не тот ответ).
      const RED = 'rgb(224, 86, 58)';
      const GREEN = 'rgb(31, 122, 77)';
      const badChanged = bad?.border === RED && /lm-ans-bad/.test(bad?.cls || '');
      const okChanged = ok?.border === GREEN;
      console.log(`
xatoda qizil: ${badChanged ? 'HA' : "YO'Q"} | to'g'rida yashil: ${okChanged ? 'HA' : "YO'Q"}`);
      if (!okChanged && ok?.border === RED) console.log("  eslatma: to'g'ri javob QIZIL — demak --right ga noto'g'ri son berilgan");
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
