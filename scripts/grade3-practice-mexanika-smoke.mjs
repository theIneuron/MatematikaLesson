// Дымовой прогон механик практики 3 класса: match, dnd (тап и настоящее перетаскивание),
// grid (столбик + и ×, уголок). Витрина — /lab/g3-tiplar, банк — practice/probeBank.js.
//
// Запуск:
//   npx vite --port 5181 --strictPort
//   node scripts/grade3-practice-mexanika-smoke.mjs .tmp
//
// Готово = все шесть строк отчёта дают correct, overflow 0 на обоих размерах, errors 0.
// Порядок клеток в fillGrid — порядок DOM (в уголке частное рисуется последним),
// он намеренно отличается от grid.fillOrder, который задаёт порядок автоперехода.
import { chromium } from 'playwright';

const URL = 'http://localhost:5181/lab/g3-tiplar';
const OUT = process.argv[2] || '.tmp';
const errors = [];
const W = 160;

const overflow = (page) => page.evaluate(() => {
  const nodes = [...document.querySelectorAll('div, main, section')];
  return nodes.reduce((max, el) => {
    const over = el.scrollHeight - el.clientHeight;
    return over > max && getComputedStyle(el).overflowY !== 'visible' ? over : max;
  }, Math.max(0, document.body.scrollHeight - window.innerHeight));
});

async function run(size, label) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: size });
  page.on('pageerror', (e) => errors.push(`[${label}] pageerror: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error' && !/api\/tts|503/.test(m.text())) errors.push(`[${label}] console: ${m.text()}`); });
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const report = [];
  const goto = async (n) => {
    await page.locator('button', { hasText: new RegExp(`^${n}\\.\\s`) }).first().click({ force: true });
    await page.waitForTimeout(400);
  };
  const mobileOpen = async () => {
    const b = page.locator('.g3-mobile-step-button');
    if (await b.count()) { await b.first().click({ force: true }); await page.waitForTimeout(250); }
  };
  const check = async () => {
    const btn = page.getByRole('button', { name: /Tekshirish|Проверить/i }).first();
    const disabled = await btn.isDisabled();
    await btn.click({ force: true });
    await page.waitForTimeout(500);
    return disabled;
  };
  const verdict = async () => (await page.locator('.g3-result-correct').count() ? 'correct'
    : await page.locator('.g3-result-wrong').count() ? 'wrong' : 'none');

  /* ---------------------------- 1. match ---------------------------- */
  await goto(1); await mobileOpen();
  const targets = ['olti yuz sakson', "to'rt yuz o'ttiz", "to'qqiz yuz uch"];
  for (let i = 0; i < targets.length; i += 1) {
    await page.locator('.g3-match-left').nth(i).click({ force: true });
    await page.waitForTimeout(W);
    await page.locator('.g3-match-right', { hasText: targets[i] }).first().click({ force: true });
    await page.waitForTimeout(W);
  }
  const mDis = await check();
  report.push(`match      : ${await verdict()} (tugma bloklangan edi: ${mDis}) · overflow ${await overflow(page)}`);
  await page.screenshot({ path: `${OUT}/probe-${label}-1-match.png` });

  /* ----------------------- 2. dnd, тап-режим ------------------------ */
  await goto(2); await mobileOpen();
  const tokens = ['3 yuzlik', "0 o'nlik", '6 birlik'];
  for (let i = 0; i < tokens.length; i += 1) {
    const tok = page.locator('.g3-dnd-token', { hasText: tokens[i] }).first();
    const box = await tok.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.waitForTimeout(W);
    await page.mouse.up();
    await page.waitForTimeout(W);
    await page.locator('.g3-dnd-zone').nth(i).click({ force: true });
    await page.waitForTimeout(W);
  }
  const dDis = await check();
  report.push(`dnd (tap)  : ${await verdict()} (tugma bloklangan edi: ${dDis}) · overflow ${await overflow(page)}`);
  await page.screenshot({ path: `${OUT}/probe-${label}-2-dnd.png` });

  /* ------------------- 3. dnd, настоящее перетаскивание ------------------- */
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  await goto(2); await mobileOpen();
  let dragOk = 'n/a';
  {
    const tok = page.locator('.g3-dnd-token', { hasText: tokens[0] }).first();
    const from = await tok.boundingBox();
    const to = await page.locator('.g3-dnd-zone').nth(0).boundingBox();
    await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
    await page.mouse.down();
    await page.waitForTimeout(W);
    await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, { steps: 12 });
    await page.waitForTimeout(W);
    await page.mouse.up();
    await page.waitForTimeout(300);
    dragOk = await page.locator('.g3-dnd-zone').nth(0).locator('.g3-dnd-token').count() ? 'karta maydonda' : 'MAYDONGA TUSHMADI';
  }
  report.push(`dnd (drag) : ${dragOk}`);

  /* ------------------------------ grid ------------------------------ */
  const fillGrid = async (n, digits, name) => {
    await goto(n); await mobileOpen();
    const cells = page.locator('.g3-grid-cell');
    const total = await cells.count();

    // сперва заведомо неверно — смотрим поклеточную подсветку
    await cells.first().click({ force: true });
    await page.waitForTimeout(W);
    await page.locator('.g3-lesson-numpad__key', { hasText: /^9$/ }).first().click({ force: true });
    await page.waitForTimeout(W);
    await check();
    const afterWrong = await verdict();
    const reds = await page.locator('.g3-grid-cell.is-no').count();
    const greens = await page.locator('.g3-grid-cell.is-ok').count();

    // очистка и верный ответ
    for (let i = 0; i < total; i += 1) {
      await cells.nth(i).click({ force: true });
      await page.locator('.g3-lesson-numpad__back').first().click({ force: true });
      await page.locator('.g3-lesson-numpad__back').first().click({ force: true });
    }
    for (let i = 0; i < digits.length; i += 1) {
      if (digits[i] === '') continue;
      await cells.nth(i).click({ force: true });
      await page.waitForTimeout(60);
      await page.locator('.g3-lesson-numpad__key', { hasText: new RegExp(`^${digits[i]}$`) }).first().click({ force: true });
      await page.waitForTimeout(60);
    }
    await check();
    report.push(`${name.padEnd(11)}: xato->${afterWrong} qizil ${reds}/yashil ${greens} · to'g'ri->${await verdict()} · kataklar ${total} · overflow ${await overflow(page)}`);
    await page.screenshot({ path: `${OUT}/probe-${label}-${n}-${name}.png` });
  };

  await fillGrid(3, ['', '1', '', '4', '3', '6'], 'grid-add');
  await fillGrid(4, ['', '9', '2', '', '2', '3', '3', '2', '2'], 'grid-mul');
  // DOM tartibi: qatorlar bloki, keyin bo'linma (burchak o'ng tomonda chiziladi).
  await fillGrid(5, ['8', '1', '6', '1', '6', '0', '2', '4'], 'grid-div');

  await browser.close();
  return report;
}

const desktop = await run({ width: 1440, height: 900 }, 'desktop');
const mobile = await run({ width: 390, height: 844 }, 'mobile');

console.log('--- 1440x900 ---');
desktop.forEach((r) => console.log('  ' + r));
console.log('--- 390x844 ---');
mobile.forEach((r) => console.log('  ' + r));
console.log(`--- errors: ${errors.length} ---`);
errors.slice(0, 12).forEach((e) => console.log('  ' + e));
