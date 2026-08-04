// ============================================================================
// scripts/informatika-smoke.mjs — ПРОКЛИКИВАНИЕ УРОКА 1 ИНФОРМАТИКИ
//
// Сборка и линт не ловят то, из-за чего урок не доходит до ребёнка. На уроке 1
// математики они проходили, пока урок: не открывался вообще, запирал на шестом
// экране, показывал пустую рамку на девятом и закрывался сам на пятнадцатом.
// Все четыре нашлись только прокликиванием.
//
// Поэтому проверка идёт как у ребёнка: ЗВУК ВЫКЛЮЧЕН, пятнадцать экранов до
// конца, на каждом снимок и проверка на переполнение вёрстки, в конце пусто
// ли в консоли.
//
// Запуск:
//   npx vite --port 5183         (в другом окне)
//   node scripts/informatika-smoke.mjs
// ============================================================================

import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const port = process.env.INF_PORT || '5183';
const base = `http://localhost:${port}/3-sinf/informatika/nazariy/dars01-kompyuter-nima`;
const out = '.tmp/informatika-smoke';

await mkdir(out, { recursive: true });

// Верные ответы по экранам — текстом, а не позицией: позиция верного варианта
// меняется от вопроса к вопросу по требованию методиста (§4.3), и скрипт,
// нажимающий вторую кнопку, «проходил» бы урок мимо смысла.
const CORRECT = {
  s1: ['Молоток'],
  s7: ['Направлением данных'],
  s8: ['Устройство ввода', 'Устройство вывода', 'Внутренняя часть'],
  s9: ['Считает и выполняет команды', 'Держит то, с чем работаешь сейчас', 'На диске'],
  s10: [
    'Экран показывает, то есть данные выходят из компьютера',
    'Память при выключении пустеет, а диск хранит',
    'Компьютер выполняет только данную команду',
  ],
  s11: ['Процессор', 'Микрофон', 'Диск'],
  s12: ['Выполнит и ошибочную команду'],
  s14: ['Устройство ввода', 'Принтер', 'Принимает данные'],
};

const DEVICES_S5 = ['Клавиатура', 'Микрофон', 'Экран', 'Принтер'];

async function run(name, viewport) {
  const page = await browser.newPage({ viewport });
  const issues = [];
  let shot = 0;

  page.on('console', (m) => {
    const text = m.text();
    // INF_VERBOSE=1 — печатать всё, что говорит страница: нужно, когда экран
    // ведёт себя не так, а ошибок в консоли нет.
    if (process.env.INF_VERBOSE) console.log(`  [${m.type()}] ${text.slice(0, 300)}`);
    if (m.type() === 'error') issues.push(`${name} console.error: ${text}`);
    // Предупреждения каркаса о нарушении контракта — тоже находка, а не шум:
    // именно так LessonShell сообщает о непокрытых ролях и рассинхроне сцен.
    if (m.type() === 'warning' && /LessonShell|i18n|visuals|стадий/.test(text)) {
      issues.push(`${name} console.warn: ${text}`);
    }
  });
  page.on('pageerror', (e) => issues.push(`${name} pageerror: ${e.message}`));

  await page.goto(base, { waitUntil: 'domcontentloaded' });
  await page.locator('.stage').waitFor({ timeout: 20000 });

  // Звук выключаем сразу: обязательное условие проверки — урок проходится молча.
  await page.getByRole('button', { name: 'Выключить звук' }).click();
  await page.waitForTimeout(200);

  const audit = async (label) => {
    shot += 1;
    const box = await page.evaluate(() => ({
      viewport: [window.innerWidth, window.innerHeight],
      doc: [document.documentElement.scrollWidth, document.documentElement.scrollHeight],
      broken: [...document.querySelectorAll('.mono')]
        .map((el) => el.textContent || '')
        .filter((t) => /⟨.*\?⟩|⟨сцена|⟨тип/.test(t)),
    }));
    if (box.doc[0] > box.viewport[0] + 1) {
      issues.push(`${name} ${label}: горизонтальное переполнение ${box.doc[0]} при ширине ${box.viewport[0]}`);
    }
    if (box.broken.length) {
      issues.push(`${name} ${label}: незаполненный визуал ${JSON.stringify(box.broken)}`);
    }
    await page.screenshot({ path: `${out}/${name}-${String(shot).padStart(2, '0')}-${label}.png` });
  };

  const next = async (label) => {
    const btn = page.getByRole('button', { name: 'Дальше', exact: true });
    if (await btn.isDisabled()) {
      issues.push(`${name} ${label}: «Дальше» заблокирована — экран не отпускает`);
      await page.screenshot({ path: `${out}/${name}-STUCK-${label}.png` });
      return false;
    }
    // force: кнопка «Дальше» пульсирует, когда идти уже можно (btn-ready), и
    // Playwright не считает её стабильной. Для ребёнка это не помеха, для
    // ожидания стабильности — бесконечная.
    await btn.click({ force: true });
    await page.waitForTimeout(420);
    return true;
  };

  // Ищем по ПОДСТРОКЕ, а не по полному имени: у варианта ответа слева стоит
  // буква позиции (a, b, c, d), поэтому доступное имя кнопки — «d Молоток»,
  // и точное совпадение не находит ничего. Первая версия скрипта на этом
  // молча не нажимала ни один вариант и «проходила» урок, никуда не двигаясь.
  const pick = async (text, label) => {
    let btn = page.locator('button.option', { hasText: text });
    if (!(await btn.count())) btn = page.getByRole('button', { name: text });
    if (!(await btn.count())) {
      issues.push(`${name} ${label}: нет варианта «${text}»`);
      return false;
    }
    await btn.first().click();
    // Верный вариант держится 1100 мс, потом варианты гаснут 600 мс (§6.1).
    await page.waitForTimeout(1900);
    return true;
  };

  // --- 1 hook -------------------------------------------------------------
  await audit('01-hook');
  await pick(CORRECT.s1[0], '01-hook');
  await next('01-hook');

  // --- 2..4 объяснение (звук выключен: показывается всё сразу) -------------
  for (const label of ['02-recall', '03-parts-3d', '04-inside-3d']) {
    await audit(label);
    await next(label);
  }

  // --- 5 открытие признака: нажать все четыре устройства ------------------
  await audit('05-discovery');
  for (const d of DEVICES_S5) await pick(d, '05-discovery');
  await audit('05-discovery-done');
  await next('05-discovery');

  // --- 6 цепочка ----------------------------------------------------------
  await audit('06-chain');
  await next('06-chain');

  // --- 7 правило после вопроса -------------------------------------------
  await audit('07-rule');
  await pick(CORRECT.s7[0], '07-rule');
  await audit('07-rule-open');
  await next('07-rule');

  // --- 8..11 упражнения по три раунда ------------------------------------
  for (const [label, answers] of [
    ['08-guided', CORRECT.s8],
    ['09-independent', CORRECT.s9],
    ['10-error-find', CORRECT.s10],
    ['11-reverse', CORRECT.s11],
  ]) {
    await audit(label);
    for (const a of answers) await pick(a, label);
    await next(label);
  }

  // --- 12 «компьютер не думает» ------------------------------------------
  await audit('12-myth');
  await pick(CORRECT.s12[0], '12-myth');
  await audit('12-myth-open');
  await next('12-myth');

  // --- 13 жизненная задача: ответ НАБИРАЕТСЯ -----------------------------
  await audit('13-case');
  await page.locator('button.d2-numpad-key').filter({ hasText: /^2$/ }).first().click();
  await page.getByRole('button', { name: 'Проверить', exact: true }).click();
  await page.waitForTimeout(900);
  await audit('13-case-solved');
  await next('13-case');

  // --- 14 итоговая диагностика -------------------------------------------
  await audit('14-final');
  for (const a of CORRECT.s14) await pick(a, '14-final');
  await next('14-final');

  // --- 15 итог ------------------------------------------------------------
  await audit('15-summary');
  const finish = page.getByRole('button', { name: 'Завершить урок', exact: true });
  if (!(await finish.count())) {
    issues.push(`${name} 15-summary: нет кнопки «Завершить урок»`);
  } else if (await finish.isDisabled()) {
    issues.push(`${name} 15-summary: «Завершить урок» заблокирована`);
  } else {
    await finish.click({ force: true });
    await page.waitForTimeout(700);
    // Платформа понимает onFinished как «урок закончен» и уводит к списку.
    if (page.url().includes('dars01-kompyuter-nima')) {
      issues.push(`${name} 15-summary: после завершения остались на уроке (${page.url()})`);
    }
  }

  await page.close();
  return issues;
}

async function locales() {
  const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });
  const issues = [];
  await page.goto(base, { waitUntil: 'domcontentloaded' });
  await page.locator('.stage').waitFor({ timeout: 20000 });
  for (const [code, expect] of [
    ['UZ', 'Bit deydi'],
    ['EN', 'Bit says'],
    ['RU', 'Бит говорит'],
  ]) {
    await page.getByRole('button', { name: code, exact: true }).click();
    await page.waitForTimeout(350);
    if (!(await page.getByText(expect, { exact: false }).count())) {
      issues.push(`локаль ${code}: не найден текст «${expect}»`);
    }
    // Пропущенная локаль в i18n превью помечается видимым маркером.
    const missing = await page.getByText('⟨', { exact: false }).count();
    if (missing) issues.push(`локаль ${code}: маркер пропущенной локали на экране`);
  }
  await page.close();
  return issues;
}

const browser = await chromium.launch({ headless: true });
const all = [];
// INF_ONLY=desktop — прогнать только один размер, когда чиним конкретный экран.
const only = process.env.INF_ONLY || '';
if (only !== 'mobile') all.push(...await run('desktop', { width: 1366, height: 800 }));
if (only !== 'desktop') all.push(...await run('mobile', { width: 390, height: 844 }));
if (!only) all.push(...await locales());
await browser.close();

if (all.length) {
  console.error(`НЕ ПРОШЁЛ (${all.length}):\n` + all.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Урок 1 информатики: 15 экранов пройдены со выключенным звуком, десктоп и 390px, три локали, консоль чистая.');
}
