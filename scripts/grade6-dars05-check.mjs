// 6 класс, урок 5 (НОД) — ПРОХОД УРОКА РУКАМИ и замер вёрстки.
//
// Зачем отдельный скрипт. Экраны этого урока свои (утверждённый макет: счета, шаги,
// правила, поля ввода), общий grade6-lesson-walk их не знает и до конца урока
// не доходит. Этот скрипт знает ответы: он проходит все 15 экранов как ученик.
//
// Что измеряется (требование ТЗ: на 1366x768 прокрутки НЕТ):
//   1. нет вертикальной прокрутки страницы;
//   2. нет горизонтальной прокрутки;
//   3. контент не заходит на нижнюю навигацию;
//   4. внутри .stage-content нет скрытой прокрутки (overflow: hidden режет
//      контент молча, поэтому сравниваем scrollHeight с clientHeight).
// Замер берётся ПОСЛЕ КАЖДОГО действия: самое высокое состояние приходит
// вместе с решением, которое раскрывается после верного ответа.
//
// Запуск:
//   npx vite --port 5199
//   node scripts/grade6-dars05-check.mjs
//   node scripts/grade6-dars05-check.mjs --lang ru
import { chromium } from 'playwright';

const BASE = process.env.SMOKE_BASE || 'http://localhost:5199';
const SLUG = 'dars05-eng-katta-umumiy-boluvchi';
const VIEWPORT = { width: 1366, height: 768 };
const TOL = 2; // округление в 1-2 px — норма

const argLang = (() => {
  const i = process.argv.indexOf('--lang');
  return i > -1 ? [process.argv[i + 1]] : ['uz', 'ru'];
})();
// `--audio`: звук не глушится, запросы к TTS перехватываются и по ним видно,
// на каком экране озвучка не пошла и везде ли стоит языковой маркер.
const AUDIO_MODE = process.argv.includes('--audio');

const problems = [];
let measures = 0;
let tracks = [];      // тексты дорожек, накопленные с последней проверки
let tracksTotal = 0;

function audioCheck(where, minTracks = 1) {
  if (!AUDIO_MODE) { tracks = []; return; }
  if (tracks.length < minTracks) {
    problems.push(`${where}: озвучки нет (дорожек ${tracks.length}, нужно ${minTracks})`);
  }
  tracks = [];
}

async function measure(page, where) {
  const m = await page.evaluate(() => {
    const root = document.querySelector('.lesson-root');
    const content = document.querySelector('.stage');
    const nav = document.querySelector('.footer');
    if (!root || !content) return null;
    const navTop = nav ? nav.getBoundingClientRect().top : Infinity;
    let worstOverlap = 0;
    let overlapTag = '';
    content.querySelectorAll('*').forEach((el) => {
      if (el.clientHeight <= 1 && el.clientWidth <= 1) return;
      const r = el.getBoundingClientRect();
      if (r.height === 0 || r.width === 0) return;
      const over = r.bottom - navTop;
      if (over > worstOverlap) {
        worstOverlap = over;
        overlapTag = el.className && String(el.className).slice(0, 40);
      }
    });
    return {
      pageScroll: document.documentElement.scrollHeight - document.documentElement.clientHeight,
      hScroll: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      rootScroll: root.scrollHeight - root.clientHeight,
      contentScroll: Math.max(
        content.scrollHeight - content.clientHeight,
        (() => { const b = document.querySelector('.body'); return b ? b.scrollHeight - b.clientHeight : 0; })(),
      ),
      overlap: worstOverlap,
      overlapTag,
    };
  });
  measures += 1;
  if (!m) { problems.push(`${where}: разметка не найдена`); return; }
  if (m.pageScroll > TOL) problems.push(`${where}: вертикальная прокрутка страницы +${m.pageScroll}px`);
  if (m.hScroll > TOL) problems.push(`${where}: горизонтальная прокрутка +${m.hScroll}px`);
  if (m.rootScroll > TOL) problems.push(`${where}: .lesson-root переполнен +${m.rootScroll}px`);
  if (m.contentScroll > TOL) problems.push(`${where}: .stage обрезан +${m.contentScroll}px`);
  if (m.overlap > TOL) problems.push(`${where}: контент заходит на навигацию +${Math.round(m.overlap)}px (${m.overlapTag})`);
}

const pause = (page, ms = 220) => page.waitForTimeout(ms);

// Колонка экрана центрируется по вертикали, поэтому раскрытие разбора не должно
// менять общую высоту: иначе зона нажатия уезжает из-под руки ученика прямо в
// момент клика. Меряем верх зоны действия до и после ответа.
let anchor = null;
async function anchorTop(page) {
  return page.evaluate(() => {
    const el = document.querySelector('.choices, .action-list, .class-cards, .input, .apply-rule');
    return el ? Math.round(el.getBoundingClientRect().top) : null;
  });
}
async function jumpStart(page) { anchor = await anchorTop(page); }
async function jumpEnd(page, where) {
  const after = await anchorTop(page);
  if (anchor === null || after === null) return;
  const d = Math.abs(after - anchor);
  if (d > 8) problems.push(`${where}: зона нажатия сдвинулась на ${d}px при раскрытии разбора`);
  anchor = null;
}

async function clickNth(page, selector, n, where) {
  const els = page.locator(selector);
  const count = await els.count();
  if (count <= n) { problems.push(`${where}: нет элемента ${selector}[${n}] (найдено ${count})`); return false; }
  await els.nth(n).click();
  await pause(page);
  return true;
}

async function next(page, where) {
  const btn = page.locator('.footer .next');
  for (let i = 0; i < 40; i += 1) {
    if (!(await btn.isDisabled())) break;
    await page.waitForTimeout(250);
  }
  if (await btn.isDisabled()) { problems.push(`${where}: «Продолжить» осталась заблокированной`); return false; }
  await btn.click();
  await page.waitForTimeout(320);
  return true;
}

// Ответы по экранам. Индексы — позиция варианта в своей группе.
const S9_ANS = [0, 1, 0, 1, 1];              // = 1 / > 1
const S10_ANS = ['15', '12', '6', '8', '9']; // ввод числа
const S12_ANS = [0, 1, 2, 3, 0];             // 4, 3, 6, 12, 5
const S14_ANS = [0, 0, 0, 0, 0];             // 6, 12, «8 и 9», 7, 20
const S13_ANS = [0, 1, 0, 1, 0, 1];          // = 1 / > 1 для шести пар

async function walk(page, lang) {
  const tag = (n) => `[${lang}] экран ${String(n).padStart(2, '0')}`;

  const q = AUDIO_MODE ? `?lang=${lang}&tts=${encodeURIComponent(BASE)}` : `?lang=${lang}`;
  await page.goto(`${BASE}/6-sinf/matematika/nazariy/${SLUG}${q}`, { waitUntil: 'networkidle' });
  await page.waitForSelector('.lesson-root.g6d05 .deck', { timeout: 15000 });
  await pause(page, 400);

  if (!AUDIO_MODE) {
    // Звук глушим: без TTS-базы движок уходит в Web Speech, в headless он не
    // отдаёт onend и каждый сегмент ждал бы сторожевой таймер. С muted замок
    // «Продолжить» снят по контракту, вёрстка от этого не меняется.
    await page.locator('.tools button').last().click();
    await pause(page, 200);
  }

  // 1 — хук
  await measure(page, tag(1));
  await clickNth(page, '.choices .choice', 2, tag(1));           // 6 человек
  await page.locator('.primary.orange').click();
  await pause(page, 1400);
  await measure(page, `${tag(1)} после деления`);
  audioCheck(tag(1), 2);
  await next(page, tag(1));

  // 2 — четыре шага
  await measure(page, tag(2));
  for (let i = 0; i < 4; i += 1) {
    await clickNth(page, '.action-list .action', i, tag(2));
    await measure(page, `${tag(2)} шаг ${i + 1}`);
  }
  audioCheck(tag(2));
  await next(page, tag(2));

  // 3 — подстановка: сперва неверный вариант, потом верный
  await measure(page, tag(3));
  await clickNth(page, '.choices .choice', 1, tag(3));           // 2 — неверно
  await pause(page, 2000);
  await measure(page, `${tag(3)} неверный вариант`);
  await jumpStart(page);
  await clickNth(page, '.choices .choice', 3, tag(3));           // 6 — верно
  await pause(page, 2400);
  await jumpEnd(page, tag(3));
  await measure(page, `${tag(3)} решение`);
  audioCheck(tag(3));
  await next(page, tag(3));

  // 4 — различие
  await measure(page, tag(4));
  await clickNth(page, '.choices .choice', 0, tag(4));           // 3 — неверно
  await measure(page, `${tag(4)} неверный вариант`);
  await jumpStart(page);
  await clickNth(page, '.choices .choice', 1, tag(4));           // 4 — верно
  await pause(page, 1500);
  await jumpEnd(page, tag(4));
  await measure(page, `${tag(4)} решение`);
  audioCheck(tag(4));
  await next(page, tag(4));

  // 5 — НОД(16; 24)
  await measure(page, tag(5));
  await jumpStart(page);
  await clickNth(page, '.choices .choice', 3, tag(5));           // 8
  await pause(page, 1500);
  await jumpEnd(page, tag(5));
  await measure(page, `${tag(5)} решение`);
  audioCheck(tag(5));
  await next(page, tag(5));

  // 6 — разложение
  await measure(page, tag(6));
  await jumpStart(page);
  await clickNth(page, '.choices .choice', 2, tag(6));           // 6
  await pause(page, 2600);
  await jumpEnd(page, tag(6));
  await measure(page, `${tag(6)} решение и бонус`);
  audioCheck(tag(6));
  await next(page, tag(6));

  // 7 — два способа
  await measure(page, tag(7));
  await jumpStart(page);
  await clickNth(page, '.rule-gate .action-list .action', 1, tag(7));   // разложение
  await pause(page, 1400);
  await jumpEnd(page, tag(7));
  await measure(page, `${tag(7)} сравнение`);
  audioCheck(tag(7));
  await next(page, tag(7));

  // 8 — три правила
  await measure(page, tag(8));
  await jumpStart(page);
  await clickNth(page, '.choices .choice', 3, tag(8));           // 5
  await pause(page, 900);
  await jumpEnd(page, tag(8));
  await measure(page, `${tag(8)} ответ`);
  for (let i = 0; i < 3; i += 1) {
    await clickNth(page, '.apply-rule', i, tag(8));
    await measure(page, `${tag(8)} правило ${i + 1}`);
  }
  audioCheck(tag(8));
  await next(page, tag(8));

  // 9 — пять проверок
  for (let i = 0; i < 5; i += 1) {
    await measure(page, `${tag(9)} задание ${i + 1}`);
    await jumpStart(page);
    await clickNth(page, '.choices .choice', S9_ANS[i], `${tag(9)} задание ${i + 1}`);
    await pause(page, 700);
    await jumpEnd(page, `${tag(9)} задание ${i + 1}`);
    await measure(page, `${tag(9)} задание ${i + 1} решено`);
    audioCheck(`${tag(9)} задание ${i + 1}`);
    await next(page, `${tag(9)} задание ${i + 1}`);
  }

  // 10 — пять задач с вводом
  for (let i = 0; i < 5; i += 1) {
    await measure(page, `${tag(10)} задача ${i + 1}`);
    await jumpStart(page);
    await page.locator('.input').fill(S10_ANS[i]);
    await page.locator('.mix-work .primary').click();
    await pause(page, 800);
    await jumpEnd(page, `${tag(10)} задача ${i + 1}`);
    await measure(page, `${tag(10)} задача ${i + 1} решена`);
    audioCheck(`${tag(10)} задача ${i + 1}`);
    await next(page, `${tag(10)} задача ${i + 1}`);
  }

  // 11 — пять коротких случаев
  for (let i = 0; i < 5; i += 1) {
    await measure(page, `${tag(11)} пример ${i + 1}`);
    await jumpStart(page);
    await clickNth(page, '.choices .choice', 0, `${tag(11)} пример ${i + 1}`);
    await pause(page, 700);
    await jumpEnd(page, `${tag(11)} пример ${i + 1}`);
    await measure(page, `${tag(11)} пример ${i + 1} решён`);
    audioCheck(`${tag(11)} пример ${i + 1}`);
    await next(page, `${tag(11)} пример ${i + 1}`);
  }

  // 12 — пять смешанных пар
  for (let i = 0; i < 5; i += 1) {
    await measure(page, `${tag(12)} пара ${i + 1}`);
    await jumpStart(page);
    await clickNth(page, '.choices .choice', S12_ANS[i], `${tag(12)} пара ${i + 1}`);
    await pause(page, 700);
    await jumpEnd(page, `${tag(12)} пара ${i + 1}`);
    await measure(page, `${tag(12)} пара ${i + 1} решена`);
    audioCheck(`${tag(12)} пара ${i + 1}`);
    await next(page, `${tag(12)} пара ${i + 1}`);
  }

  // 13 — классификация и бонус
  await measure(page, tag(13));
  await jumpStart(page);
  for (let i = 0; i < 6; i += 1) {
    const idx = i * 2 + S13_ANS[i];
    await clickNth(page, '.class-card button', idx, `${tag(13)} пара ${i + 1}`);
  }
  await pause(page, 1300);
  await jumpEnd(page, tag(13));
  await measure(page, `${tag(13)} бонус раскрыт`);
  audioCheck(tag(13));
  await next(page, tag(13));

  // 14 — финальный микс
  for (let i = 0; i < 5; i += 1) {
    await measure(page, `${tag(14)} задание ${i + 1}`);
    await jumpStart(page);
    await clickNth(page, '.choices .choice', S14_ANS[i], `${tag(14)} задание ${i + 1}`);
    await pause(page, 700);
    await jumpEnd(page, `${tag(14)} задание ${i + 1}`);
    await measure(page, `${tag(14)} задание ${i + 1} решено`);
    audioCheck(`${tag(14)} задание ${i + 1}`);
    await next(page, `${tag(14)} задание ${i + 1}`);
  }

  // 15 — итог
  await pause(page, 4200);
  await measure(page, `${tag(15)} все карточки`);

  const counter = await page.locator('.bar-meta .count').first().innerText();
  if (!counter.startsWith('15')) problems.push(`[${lang}] дошли не до 15 экрана, счётчик: ${counter}`);

  // Контроль запретов из ТЗ
  const forbidden = await page.evaluate(() => ({
    imgs: document.querySelectorAll('.lesson-root img').length,
    bgImages: Array.from(document.querySelectorAll('.lesson-root *'))
      .filter((el) => {
        const bi = getComputedStyle(el).backgroundImage;
        // CSS-градиенты разрешены: это не изображения. Ловим url() и base64.
        return bi !== 'none' && /url\(/i.test(bi);
      }).length,
    // Фон проверяется НА КАЖДОМ слое оболочки. Тема 6 класса красит .stage
    // своим цветом через !important, и проверка одного .lesson-root это
    // пропускала: корень был правильный, а видимая рабочая область — нет.
    bg: ['.lesson-root', '.deck', '.topbar', '.stage', '.footer']
      .map((sel) => {
        const el = document.querySelector(sel);
        return sel + '=' + (el ? getComputedStyle(el).backgroundColor : 'нет');
      }),
  }));
  if (forbidden.imgs) problems.push(`[${lang}] на экране ${forbidden.imgs} тегов img`);
  if (forbidden.bgImages) problems.push(`[${lang}] найдены фоновые изображения: ${forbidden.bgImages}`);
  forbidden.bg.forEach((pair) => {
    const [sel, color] = pair.split('=');
    // Сцена и дека прозрачны — сквозь них виден фон корня, это по макету.
    const ok = color === 'rgb(244, 239, 230)' || color === 'rgba(0, 0, 0, 0)' || color === 'rgba(244, 239, 230, 0.94)';
    if (!ok) problems.push(`[${lang}] фон ${sel}: ${color}, ожидался rgb(244, 239, 230)`);
  });
}

(async () => {
  const browser = await chromium.launch();
  for (const lang of argLang) {
    const ctx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    page.on('pageerror', (e) => problems.push(`[${lang}] ошибка в консоли: ${e.message}`));
    if (AUDIO_MODE) {
      const MARK = lang === 'uz' ? "[O'zbekcha tallaffuz]" : '[Русское произношение]';
      await page.route('**/api/tts*', (route) => {
        const text = decodeURIComponent(new URL(route.request().url()).searchParams.get('text') || '');
        tracks.push(text);
        tracksTotal += 1;
        if (!text.startsWith(MARK)) problems.push(`[${lang}] дорожка без языкового маркера: ${text.slice(0, 60)}`);
        if (text.includes(MARK, 1)) problems.push(`[${lang}] маркер продублирован: ${text.slice(0, 60)}`);
        route.abort();
      });
    }
    try {
      await walk(page, lang);
    } catch (e) {
      problems.push(`[${lang}] проход оборвался: ${e.message}`);
    }
    await ctx.close();
  }
  await browser.close();

  console.log(`\nЗамеров сделано: ${measures}`);
  if (AUDIO_MODE) console.log(`Дорожек озвучки поймано: ${tracksTotal}`);
  if (!problems.length) {
    console.log('Нарушений нет: 15 экранов, 1366x768, прокрутки и перекрытий не найдено.\n');
    process.exit(0);
  }
  console.log(`\nНАРУШЕНИЯ (${problems.length}):`);
  problems.forEach((p) => console.log('  - ' + p));
  console.log('');
  process.exit(1);
})();
