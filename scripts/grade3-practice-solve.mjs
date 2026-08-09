// Прогон практики 3 класса «как ученик»: скрипт САМ отвечает на все 340 заданий верным
// ответом из банка и требует, чтобы движок засчитал его.
//
// Зачем отдельно от grade3-practice-walk.mjs: тот меряет вёрстку и не нажимает ответы.
// Ошибка «правильный ответ на самом деле неверный» им не ловится — её ловит валидатор
// (§7.6) и вот этот прогон: если ответ из банка нельзя ввести через интерфейс
// (нет клавиши, клетка не принимает цифру, вариант перетасован) — задание падает здесь.
//
// Запуск:
//   npx vite --port 5181 --strictPort
//   node scripts/grade3-practice-solve.mjs [номер урока ...]
//
// Готово = «решено 10/10» на каждом уроке и errors 0.
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';

const asked = process.argv.slice(2).map(Number).filter(Boolean);
const lessons = (asked.length ? asked : Array.from({ length: 51 }, (_, i) => i + 1))
  .filter((n) => existsSync(`src/components/grade3/practice/banks/dars${String(n).padStart(2, '0')}.js`));

// SHOW=1 — открыть настоящее окно браузера и замедлить клики, чтобы прогон
// можно было смотреть глазами: node scripts/grade3-practice-solve.mjs 5 --show
const show = process.argv.includes('--show') || process.env.SHOW === '1';
const errors = [];
const browser = await chromium.launch(show ? { headless: false, slowMo: 320 } : {});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on('pageerror', (e) => errors.push(`runtime: ${e.message}`));

// Кнопка по точному тексту — варианты перетасовываются на каждом монтировании,
// поэтому по индексу нажимать нельзя.
const escape = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const byText = (scope, selector, label) => page.locator(`${scope} ${selector}`)
  .filter({ hasText: new RegExp(`^\\s*${escape(label)}\\s*$`) }).first();
// Карточка с рисунком печатает и подпись рисунка («8сотни»), поэтому левый столбец
// сопоставления ищется вхождением, а не полным совпадением.
const byPart = (scope, selector, label) => page.locator(`${scope} ${selector}`)
  .filter({ hasText: new RegExp(escape(label)) }).first();
const settle = () => page.waitForTimeout(140);

async function answer(item) {
  const t = item.text.ru;
  if (item.type === 'choice') {
    await byText('.g3-answer-zone', 'button', t.options[item.correct]).click();
  } else if (item.type === 'multi') {
    for (const idx of item.correct) { await byText('.g3-answer-zone', 'button', t.options[idx]).click(); await settle(); }
  } else if (item.type === 'order') {
    for (const idx of item.correct) { await byText('.g3-answer-zone', 'button', t.options[idx]).click(); await settle(); }
  } else if (item.type === 'match') {
    for (let left = 0; left < t.left.length; left += 1) {
      await byPart('.g3-match-rows', 'button.g3-match-left', t.left[left]).click();
      await settle();
      await byText('.g3-match-bank', 'button.g3-match-right', t.right[item.correct[left]]).click();
      await settle();
    }
  } else if (item.type === 'dnd') {
    for (let token = 0; token < t.tokens.length; token += 1) {
      await byText('.g3-dnd', 'button.g3-dnd-token', t.tokens[token]).click();
      await settle();
      await page.locator(`.g3-dnd-zones [data-zone="${item.correct[token]}"]`).click();
      await settle();
    }
  } else if (item.type === 'input') {
    const value = String(Array.isArray(item.correct) ? item.correct[0] : item.correct);
    const pad = page.locator('.g3-lesson-numpad');
    if (await pad.count()) {
      for (const ch of value) {
        await pad.locator(`button[aria-label="${ch === ',' ? 'Vergul' : ch}"]`).click();
      }
    } else {
      await page.locator('.g3-numeric-answer-zone input').fill(value);
    }
  } else if (item.type === 'grid') {
    const expected = [];
    const push = (row) => (row.fill === 'all' ? row.cells.map((_, i) => i) : (row.fill || []))
      .forEach((i) => expected.push(String(row.cells[i])));
    (item.grid.rows || []).forEach(push);
    if (item.grid.quotient) push(item.grid.quotient);
    const cells = page.locator('.g3-grid-cell');
    for (let i = 0; i < expected.length; i += 1) {
      await cells.nth(i).click();
      for (const ch of expected[i]) {
        await page.locator(`.g3-lesson-numpad button[aria-label="${ch}"]`).click();
      }
    }
  }
}

for (const lesson of lessons) {
  const nn = String(lesson).padStart(2, '0');
  const module = await import(`../src/components/grade3/practice/banks/dars${nn}.js`);
  const bank = module.default || Object.values(module)[0];
  let solved = 0;

  for (let i = 0; i < bank.items.length; i += 1) {
    const item = bank.items[i];
    await page.goto(`http://localhost:5181/3-sinf/matematika/amaliy/dars${nn}-amaliyot`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(180);

    // Сначала задание чипом полосы (aria-label = «N. подпись»), потом язык:
    // смена задания сбрасывает язык обратно на UZ.
    // Перезагрузка страницы (vite hmr, когда параллельно правят файлы) уносит чип —
    // поэтому переход повторяется, а не роняет весь прогон.
    let opened = false;
    for (let attempt = 0; attempt < 3 && !opened; attempt += 1) {
      try {
        const chip = page.locator(`button[aria-label^="${i + 1}. "]`).first();
        await chip.scrollIntoViewIfNeeded({ timeout: 8000 }).catch(() => {});
        await chip.click({ force: true, timeout: 8000 });
        opened = true;
      } catch {
        await page.goto(`http://localhost:5181/3-sinf/matematika/amaliy/dars${nn}-amaliyot`, { waitUntil: 'networkidle' }).catch(() => {});
        await page.waitForTimeout(600);
      }
    }
    if (!opened) { errors.push(`У${lesson}/${item.id}: задание не открылось`); continue; }
    await page.waitForTimeout(260);
    await page.locator('.g3-practice-toolbar button', { hasText: /^RU$/ }).first().click({ force: true });
    await page.waitForTimeout(320);

    try {
      await answer(item);
      // «Проверить» включается через эффект onReady — ждём кнопку, а не спим наугад:
      // на фиксированном ожидании прогон врал про 45 заданий из 340.
      await page.locator('.g3-practice-footer button:not([disabled])').first()
        .click({ timeout: 8000 }).catch(() => {});
      await page.locator('.g3-practice-pop').first().waitFor({ timeout: 5000 }).catch(() => {});
      const ok = await page.locator('.g3-practice-pop', { hasText: item.text.ru.correct.slice(0, 40) }).count();
      if (ok) solved += 1;
      else errors.push(`У${lesson}/${item.id} (${item.type}): движок не засчитал ответ из банка`);
      if (show) {
        console.log(`  ${item.id} ${item.type.padEnd(6)} ${ok ? 'верно' : 'НЕ ЗАСЧИТАН'} — ${item.text.ru.ask}`);
        await page.waitForTimeout(1200);
      }
    } catch (e) {
      errors.push(`У${lesson}/${item.id} (${item.type}): ${String(e.message).split('\n')[0].slice(0, 120)}`);
    }
  }
  console.log(`урок ${lesson}: решено ${solved}/${bank.items.length}${solved === bank.items.length ? '' : ' ⚠'}`);
}

console.log(`\nerrors: ${errors.length}`);
errors.forEach((e) => console.log('  ' + e));
await browser.close();
process.exit(errors.length ? 1 : 0);
