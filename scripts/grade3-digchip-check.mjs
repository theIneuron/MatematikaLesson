// grade3-digchip-check.mjs — фишка с цифрой: проверяем, что цифра стоит по центру.
//
// Зачем: один и тот же класс `.lm-digchip` вешается и на <button>, и на <span>. У кнопки
// браузер центрирует содержимое сам, у span нет — и до правки цифра прижималась к верхнему
// левому углу (замечание методиста по уроку 1). Скрипт проходит урок экран за экраном,
// находит все фишки и сравнивает центр текста с центром самой фишки: расхождение больше
// двух пикселей считается ошибкой.
//
// Запуск: node scripts/grade3-digchip-check.mjs [--slug dars01-…] [--port 5179] [--last 14]
import { chromium } from 'playwright';

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > 0 && process.argv[i + 1] ? process.argv[i + 1] : d; };
const PORT = arg('port', '5179');
const SLUG = arg('slug', 'dars01-yuzlik-onlik-birlik');
const LAST = Number(arg('last', '14'));

const measure = () => {
  const out = [];
  for (const el of document.querySelectorAll('.lm-digchip')) {
    const box = el.getBoundingClientRect();
    if (box.width < 2 || box.height < 2) continue;
    const node = [...el.childNodes].find((n) => n.nodeType === 3 && n.textContent.trim());
    if (!node) continue;
    const r = document.createRange();
    r.selectNodeContents(node);
    const t = r.getBoundingClientRect();
    out.push({
      text: node.textContent.trim().slice(0, 6),
      dx: +((t.left + t.right) / 2 - (box.left + box.right) / 2).toFixed(1),
      dy: +((t.top + t.bottom) / 2 - (box.top + box.bottom) / 2).toFixed(1),
      display: getComputedStyle(el).display
    });
  }
  return out;
};

const run = async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`http://localhost:${PORT}/3-sinf/matematika/nazariy/${SLUG}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  // звук выключаем, иначе ответы заблокированы до конца реплики
  // звук выключаем через тот же переключатель, что и остальные проверки
  await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find((x) => /ovoz|звук|mute/i.test(x.getAttribute('aria-label') || x.title || ''));
    if (b) b.click();
  }).catch(() => {});

  let seen = 0;
  let bad = 0;
  for (let s = 0; s <= LAST; s++) {
    await page.waitForTimeout(320);
    for (const c of await page.evaluate(measure)) {
      seen++;
      const off = Math.abs(c.dx) > 2 || Math.abs(c.dy) > 2;
      if (off) {
        bad++;
        console.log(`ekran ${String(s).padStart(2)} | «${c.text}» | XATO | markazdan ${c.dx} / ${c.dy} px | display ${c.display}`);
      } else {
        console.log(`ekran ${String(s).padStart(2)} | «${c.text}» | OK   | markazdan ${c.dx} / ${c.dy} px | display ${c.display}`);
      }
    }
    const next = page.locator('button').filter({ hasText: /^(Дальше|Davom etish)$/ });
    if (!(await next.count())) break;
    const btn = next.last();
    if (await btn.isDisabled().catch(() => true)) break;
    await btn.click({ force: true }).catch(() => {});
  }
  await browser.close();
  console.log(`\nfishka tekshirildi: ${seen}, markazda emas: ${bad}`);
  process.exit(bad ? 1 : 0);
};

run();
