// grade3-final-score-check.mjs — счёт на финальной панели обязан быть честным.
//
// Методист (2026-08-09) ответил на три вопроса, один неверно, а увидел «3 из 3». Скрипт
// проходит до финальной панели, ПЕРВЫЙ вопрос заваливает намеренно, остальные решает верно
// и читает зелёную плашку: там должно стоять меньше, чем всего вопросов.
//
// Ответы берутся из самого урока, как и в прогоне.
// Запуск: node scripts/grade3-final-score-check.mjs --slug dars46-tenglama --screen 13
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > 0 && process.argv[i + 1] ? process.argv[i + 1] : d; };
const PORT = arg('port', '5181');
const SLUG = arg('slug', '');
const SCREEN = Number(arg('screen', '13'));
// --all-right: отвечаем ВСЁ верно и ждём полный балл. Без флага первый ответ заваливаем
// намеренно и ждём балл МЕНЬШЕ полного. Две стороны одной проверки: счёт не должен ни
// приписывать лишнее, ни терять заработанное.
const ALL_RIGHT = process.argv.includes('--all-right');

// Урок находим по слагу, ответы и НОМЕР ЭКРАНА с панелью берём из самого файла:
// у уроков разное число экранов, и угадывать индекс нельзя.
const lessonSrc = () => {
  const reg = fs.readFileSync('src/lessons/grade3.js', 'utf8');
  const at = reg.indexOf(`slug: '${SLUG}'`);
  const m = at < 0 ? null : reg.slice(at).match(/import\('\.\.\/components\/grade3\/([^']+)'\)/);
  return m ? fs.readFileSync(`src/components/grade3/${m[1]}`, 'utf8') : '';
};
const src = lessonSrc();
// компонент с панелью, его номер в списке экранов и ключ его данных в CONTENT
const panel = (() => {
  const at = src.indexOf('<div className="d2-factcard');
  if (at < 0) return { screen: SCREEN, key: 's13' };
  // имя компонента — ближайшее объявление ВЕРХНЕГО уровня с заглавной буквы:
  // внутри компонента есть свои const, и брать первый попавшийся нельзя
  const head = src.slice(0, at);
  const decls = [...head.matchAll(/^const ([A-Z]\w*) = /gm)];
  const last = decls[decls.length - 1];
  const name = last ? last[1] : '';
  const body = src.slice(last ? last.index : 0, at);
  const key = (body.match(/CONTENT\.(s\d+)/) || [, 's13'])[1];
  const arr = (src.match(/const screens = \[([^\]]*)\]/) || [, ''])[1].split(',').map((x) => x.trim());
  const i = arr.indexOf(name);
  return { screen: i >= 0 ? i : SCREEN, key };
})();
// у урока из данных экраны лежат в ките, там панель всегда тринадцатая
const panelScreen = process.argv.includes('--screen') ? SCREEN : (/createLesson\(/.test(src) ? 13 : panel.screen);
const panelKey = /createLesson\(/.test(src) ? 's13' : panel.key;
// Задания панели по порядку: число — со своим ответом, выбор — с текстом ВЕРНОГО варианта.
// Верный вариант в контенте всегда `opt0`: разборы называются wrong_1…wrong_3, то есть
// нумеруются от него. На экране варианты перемешиваются, поэтому ищем по тексту, не по месту.
const panelBlock = (() => {
  const a = src.indexOf(`  ${panelKey}: {`);
  if (a < 0) return '';
  const b = src.indexOf(`\n  s${Number(panelKey.slice(1)) + 1}: {`, a);
  return src.slice(a, b < 0 ? src.length : b);
})();
const items = (() => {
  const out = [];
  const re = /kind:\s*'(num|mc)'|\bans:\s*(\d+)|opt0:\s*\{\s*ru:\s*(?:'([^']*)'|"([^"]*)")/g;
  for (const m of panelBlock.matchAll(re)) {
    if (m[1]) out.push({ kind: m[1] });
    else if (out.length) {
      const it = out[out.length - 1];
      if (m[2] !== undefined && it.kind === 'num' && it.ans === undefined) it.ans = m[2];
      if (m[3] !== undefined || m[4] !== undefined) { if (it.correct === undefined) it.correct = m[3] !== undefined ? m[3] : m[4]; }
    }
  }
  return out;
})();
const nums = items.filter((i) => i.kind === 'num' && i.ans !== undefined).map((i) => i.ans);
const rights = items.filter((i) => i.kind === 'mc' && i.correct).map((i) => i.correct);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 900, height: 1000 } });
const mute = async () => { const b = page.locator('button[title="Sound off"]'); if (await b.count()) await b.first().click({ force: true }).catch(() => {}); };

await page.goto(`http://localhost:${PORT}/3-sinf/matematika/nazariy/${SLUG}`, { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
for (let s = 0; s < panelScreen; s++) {
  await mute();
  const next = page.locator('button').filter({ hasText: /^(Дальше|Davom etish)$/ }).last();
  if (!(await next.count())) break;
  await next.click({ force: true }).catch(() => {});
  await page.waitForTimeout(420);
}
await mute();
await page.waitForTimeout(700);

// После неверного ответа плита гаснет на время разбора. Пока она погашена, клики пропадают —
// именно так проверка теряла второй ответ и не доходила до панели.
const waitPad = async () => {
  for (let i = 0; i < 40; i++) {
    const on = await page.evaluate(() => [...document.querySelectorAll('button')]
      .some((b) => /^[0-9]$/.test((b.textContent || '').trim()) && !b.disabled));
    if (on) return;
    await page.waitForTimeout(250);
  }
};
const type = async (v) => {
  await waitPad();
  const back = page.locator('button').filter({ hasText: /^⌫$/ });
  for (let k = 0; k < 6 && (await back.count()); k++) await back.first().click({ force: true }).catch(() => {});
  for (const ch of String(v)) await page.locator('button').filter({ hasText: new RegExp(`^${ch}$`) }).first().click({ force: true }).catch(() => {});
  const chk = page.locator('button').filter({ hasText: /^(Проверить|Tekshir)$/ });
  if (await chk.count()) await chk.first().click({ force: true }).catch(() => {});
};
const taskNo = () => page.evaluate(() => ((document.querySelector('.frame .mono') || {}).textContent || '').trim());
const done = () => page.evaluate(() => !!document.querySelector('.d2-factcard'));

// Поле ответа: моноширинный блок с разрядкой и толстой рамкой. Замечание методиста
// «визуально не показывается ошибка» — значит смотрим не текст разбора, а само поле.
let redOnWrong = null;
let greenOnRight = null;
const fieldLook = () => page.evaluate(() => {
  const el = [...document.querySelectorAll('div')].find((d) => {
    const cs = getComputedStyle(d);
    return cs.letterSpacing === '4px' && parseFloat(cs.borderTopWidth) >= 2 && d.getBoundingClientRect().height > 28;
  });
  if (!el) return null;
  const cs = getComputedStyle(el);
  return { border: cs.borderTopColor, cls: String(el.className) };
});

// Вариант с выбором: жмём ИМЕННО верный, с первого раза — иначе балл честно не начислится.
const solveMC = async () => {
  for (let i = 0; i < 40; i++) {                       // варианты тоже гаснут на время разбора
    if (await page.locator('button.option:not([disabled])').count()) break;
    if (await page.evaluate(() => !!document.querySelector('.d2-factcard'))) return false;
    await page.waitForTimeout(250);
  }
  const want = rights.shift();
  const hit = want ? await page.evaluate((w) => {
    const b = [...document.querySelectorAll('button.option:not([disabled])')]
      .find((x) => (x.textContent || '').trim() === w.trim());
    if (b) { b.click(); return true; }
    return false;
  }, want) : false;
  if (!hit) await page.locator('button.option:not([disabled])').first().click({ force: true }).catch(() => {});
  await page.waitForTimeout(1200);
  return hit;
};

// Неверный ответ на выбор: любой вариант, кроме верного. Верный не забираем из очереди —
// после промаха тот же вопрос надо ещё и решить, иначе панель не пропустит дальше.
const missMC = async () => {
  const want = rights[0] || '';
  await page.evaluate((w) => {
    const b = [...document.querySelectorAll('button.option:not([disabled])')]
      .find((x) => (x.textContent || '').trim() !== w.trim());
    if (b) b.click();
  }, want);
  await page.waitForTimeout(1400);
};

let before = '';
let asked = 0;
for (let step = 0; step < 40; step++) {
  if (await done()) break;
  for (let g = 0; g < 30; g++) {
    const ready = await page.evaluate(() => document.querySelector('button.option:not([disabled])')
      || [...document.querySelectorAll('button')].some((b) => /^[0-9]$/.test((b.textContent || '').trim()) && !b.disabled));
    if (ready || await done()) break;
    await page.waitForTimeout(200);
  }
  if (await done()) break;
  before = await taskNo();
  const miss = !ALL_RIGHT && asked === 0;             // первый вопрос заваливаем намеренно
  const opts = page.locator('button.option:not([disabled])');
  if (await opts.count()) {
    if (miss) await missMC();
    await solveMC();                                   // после промаха тот же вопрос решаем верно
  } else {
    const v = nums.shift();
    if (v === undefined) break;
    if (miss) {
      await type(String(v) === '1' ? '2' : '1');
      await page.waitForTimeout(1100);
      redOnWrong = await fieldLook();                 // ошибка обязана быть ВИДНА, а не только в тексте
      await type(v);
      await page.waitForTimeout(1300);
      greenOnRight = await fieldLook();
    } else await type(v);
  }
  asked += 1;
  if (miss) console.log('вопрос 1: ответили НЕВЕРНО, потом верно — балл не должен начислиться');
  for (let w = 0; w < 30; w++) { await page.waitForTimeout(200); if (await taskNo() !== before || await done()) break; }
}
await page.waitForTimeout(900);

const shown = await page.evaluate(() => {
  const box = document.querySelector('.frame-success');
  if (!box) return null;
  const m = (box.textContent || '').match(/(\d+)\s*(?:из|tadan)\s*(\d+)/);
  return m ? { got: Number(m[1]), total: Number(m[2]) } : (box.textContent || '').trim().slice(0, 40);
});
await browser.close();

if (!shown || typeof shown === 'string') { console.log(`итог не прочитан: ${shown || 'панели нет'}`); process.exit(1); }
// Всё верно — полный балл. Один промах в начале — ровно на один меньше: и не приписали, и
// не потеряли остальные.
const ok = ALL_RIGHT ? shown.got === shown.total : shown.got === shown.total - 1;
const wait = ALL_RIGHT ? `ровно ${shown.total}` : `ровно ${shown.total - 1}`;
// Цвет поля читаем только там, где первый вопрос был числовым: у вопроса с вариантами поля нет.
const RED = 'rgb(224, 86, 58)';
const GREEN = 'rgb(31, 122, 77)';
let look = 'поле не проверялось (первый вопрос с вариантами)';
let lookOk = true;
if (redOnWrong || greenOnRight) {
  const r = redOnWrong && redOnWrong.border === RED && /lm-ans-bad/.test(redOnWrong.cls || '');
  const g = greenOnRight && greenOnRight.border === GREEN;
  lookOk = Boolean(r && g);
  look = `поле: на ошибке красное ${r ? 'ДА' : 'НЕТ'}, на верном зелёное ${g ? 'ДА' : 'НЕТ'}`;
}
console.log(`\nна экране: верно ${shown.got} из ${shown.total} | ожидали ${wait}: ${ok ? 'ДА' : 'НЕТ, счёт врёт'} | ${look}`);
process.exit(ok && lookOk ? 0 : 1);
