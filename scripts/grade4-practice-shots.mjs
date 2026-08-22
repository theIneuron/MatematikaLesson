#!/usr/bin/env node

// ============================================================================
// 4-SINF AMALIYOTI — VIZUAL KO'RIK SNAPSHOTLARI
//
// Nima uchun alohida skript. `grade4-lesson-shots.mjs` nazariy darsga
// mo'ljallangan: u `.stage` va `.btn-next` ni izlaydi, amaliyotda esa bunday
// elementlar yo'q. Bu skript har topshiriqning IKKI holatini oladi: savol
// (javob berilmagan) va tahlil (javobdan keyin), va har holatning balandligi
// bilan skrollini bosib chiqaradi.
//
// Ishlatish:
//   npx vite --port 5179 --strictPort
//   node scripts/grade4-practice-shots.mjs 41 [papka]
//   W=390 H=844 LANG=ru node scripts/grade4-practice-shots.mjs 41
//
// BASE localhost bo'ladi: vite ::1 da tinglaydi va 127.0.0.1 ga ulanmaydi.
// ============================================================================

import { mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { runInNewContext } from 'node:vm';
import babelParser from '@babel/parser';
import { chromium } from 'playwright';

const { parse } = babelParser;
const ROOT = process.cwd();
const BASE = process.env.BASE || 'http://localhost:5179';
const LESSON = Number(process.argv[2]);
const OUT = process.argv[3] || `tmp-shots/g4-${LESSON}-practice`;
const WIDTH = Number(process.env.W || 1440);
const HEIGHT = Number(process.env.H || 900);
const LANG = process.env.LANG_CODE || process.env.LANG || 'uz';

if (!Number.isInteger(LESSON)) {
  console.error("Dars raqami kerak: node scripts/grade4-practice-shots.mjs 41");
  process.exit(2);
}

const file = path.join(ROOT, 'src', 'components', 'grade4', `Dars${LESSON}Practice.jsx`);
const source = readFileSync(file, 'utf8');
const ast = parse(source, { sourceType: 'module', plugins: ['jsx'] });

// Bank modul darajasidagi konstantalarga tayanishi mumkin (50-darsda DAYS va
// WEEKS): ular avval shu fayldan hisoblanib, sandboxga qo'shiladi.
function initializer(name, seen = new Set()) {
  let found = null;
  const visit = (node) => {
    if (!node || typeof node !== 'object' || found) return;
    if (node.type === 'VariableDeclarator' && node.id?.name === name) { found = node.init; return; }
    for (const value of Object.values(node)) {
      if (Array.isArray(value)) value.forEach(visit);
      else visit(value);
    }
  };
  visit(ast);
  if (!found) throw new Error(`${name} topilmadi`);
  const code = source.slice(found.start, found.end);
  const sandbox = {
    b: (ru, uz, en) => ({ ru, uz, en }),
    option: (id, ru, uz, en, correct = false, wrongRu = '', wrongUz = '', wrongEn = '') => ({
      id, text: { ru, uz, en }, correct, wrong: wrongRu ? { ru: wrongRu, uz: wrongUz, en: wrongEn } : null,
    }),
  };
  seen.add(name);
  for (const identifier of new Set(code.split(/[^A-Za-z0-9_]+/).filter((word) => /^[A-Z][A-Z0-9_]*$/.test(word)))) {
    if (identifier in sandbox || seen.has(identifier)) continue;
    try { sandbox[identifier] = initializer(identifier, seen); } catch { /* konstanta emas */ }
  }
  return runInNewContext(`(${code})`, sandbox, { timeout: 2_000 });
}

const TASKS = initializer('TASKS');
const registry = readFileSync(path.join(ROOT, 'src', 'lessons', 'grade4.js'), 'utf8');
const slug = new RegExp(`slug:\\s*'([^']+)'[\\s\\S]{0,400}?Dars${LESSON}Practice\\.jsx`).exec(registry)?.[1];
if (!slug) {
  console.error(`Dars${LESSON}Practice.jsx reyestrda topilmadi`);
  process.exit(2);
}

const say = (value) => (value && typeof value === 'object' ? value[LANG] ?? value.uz : value);
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT } });
const errors = [];
page.on('pageerror', (error) => errors.push(String(error)));
page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });

await page.goto(`${BASE}/4-sinf/matematika/amaliy/${slug}`, { waitUntil: 'networkidle' });
await page.waitForSelector('.p4-task', { timeout: 30_000 });

// Aniq moslik afzal: «x + 90» kartasi «x + 90 = 300» kartasining ichida ham
// uchraydi va substring bo'yicha izlash ishlatilgan kartani bosib qo'yadi.
const byText = async (selector, text) => {
  const wanted = String(text).replace(/\s+/g, ' ').trim();
  const items = page.locator(selector);
  const count = await items.count();
  const candidates = [];
  for (let index = 0; index < count; index += 1) {
    const item = items.nth(index);
    if (!(await item.isVisible()) || !(await item.isEnabled())) continue;
    candidates.push({ index, text: ((await item.textContent()) || '').replace(/\s+/g, ' ').trim() });
  }
  const match = candidates.find((item) => item.text === wanted)
    ?? candidates.find((item) => item.text.includes(wanted));
  if (!match) throw new Error(`«${wanted}» uchun ${selector} topilmadi: [${candidates.map((item) => item.text).join(' | ')}]`);
  await items.nth(match.index).click();
};

async function solve(task) {
  if (task.kind === 'mc') {
    await byText('.p4-options button', say(task.options.find((item) => item.correct).text));
    return;
  }
  if (task.kind === 'numpad' || task.kind === 'missing') {
    for (const digit of String(task.answer)) await byText('.p4-pad-keys button', digit);
    return;
  }
  if (task.kind === 'gap') {
    await page.locator(`.p4-gap[aria-label="${task.correctGap}"]`).click();
    return;
  }
  if (task.kind === 'ticks') {
    // Bo'linma shkalada (45, 47-dars) yoki chizma o'qida (50-dars) bo'ladi.
    const tick = `[aria-label="${task.answer}"]`;
    await page.locator(`.p4-scale-tick button${tick}, .p4-chart-value button${tick}`).first().click();
    return;
  }
  if (task.kind === 'fracbuild') {
    const groups = page.locator('.p4-frac-builder > div');
    await groups.nth(0).getByRole('button', { name: String(task.answer.n), exact: true }).click();
    await groups.nth(1).getByRole('button', { name: String(task.answer.d), exact: true }).click();
    return;
  }
  if (task.kind === 'shade' && !task.visual.map) {
    // Kasr bo'yashda kataklarning soni muhim: birinchi bo'sh kataklarni bosamiz.
    const cells = page.locator('.p4-cells button');
    for (let index = 0; index < task.selectCount; index += 1) await cells.nth(index).click();
    return;
  }
  if (task.kind === 'shade') {
    for (const [rowIndex, row] of task.visual.map.entries()) {
      for (const [colIndex, char] of row.split('').entries()) {
        if (char === '+') await page.locator(`.p4-grid button[data-cell="${rowIndex}-${colIndex}"]`).click();
      }
    }
    return;
  }
  if (task.kind === 'match') {
    for (const pair of task.pairs) {
      await byText('.p4-match-col:first-child button', say(pair.left));
      await byText('.p4-match-col:last-child button', say(task.right.find((item) => item.id === pair.correctRight).text));
    }
    return;
  }
  if (task.kind === 'order') {
    for (const [index, step] of task.steps.entries()) {
      await page.locator('.p4-order-slots button').nth(index).click();
      await byText('.p4-card-bank button', say(task.cards.find((card) => card.order === index).text));
      void step;
    }
    return;
  }
  if (task.kind === 'slots') {
    for (const [index, slot] of task.slots.entries()) {
      await page.locator('.p4-slot-list .p4-slot').nth(index).click();
      await byText('.p4-card-bank .p4-card', say(task.cards.find((card) => card.id === slot.correct).text));
    }
    return;
  }
  if (task.kind === 'sort') {
    for (const item of task.items) {
      await byText('.p4-sort-pool button', say(item.text));
      await byText('.p4-sort-bin-head', say(task.bins.find((bin) => bin.id === item.bin).label));
    }
    return;
  }
  throw new Error(`qo'llanmagan mexanika: ${task.kind}`);
}

const measure = () => page.evaluate(() => ({
  over: Math.max(0, document.documentElement.scrollHeight - window.innerHeight),
  height: document.documentElement.scrollHeight,
}));

for (const [index, task] of TASKS.entries()) {
  await page.waitForTimeout(240);
  const before = await measure();
  await page.screenshot({ path: `${OUT}/${task.id}-savol.png` });
  await solve(task);
  await page.waitForTimeout(160);
  await page.locator('.p4-actions .p4-btn').first().click();
  await page.waitForTimeout(320);
  const after = await measure();
  await page.screenshot({ path: `${OUT}/${task.id}-tahlil.png` });
  const solved = await page.locator('.p4-feedback.is-ok').count();
  console.log(
    `${task.id} ${task.kind.padEnd(7)} savol ${String(before.height).padStart(4)} (skroll ${before.over})`
    + ` · tahlil ${String(after.height).padStart(4)} (skroll ${after.over})`
    + ` · ${solved ? "to'g'ri" : 'XATO'}`,
  );
  if (!solved) break;
  if (index < TASKS.length - 1) {
    await page.locator('.p4-actions .p4-btn-ready').click();
  } else {
    await page.locator('.p4-actions .p4-btn-ready').click();
    await page.waitForTimeout(320);
    await page.screenshot({ path: `${OUT}/natija.png` });
  }
}

console.log(errors.length ? `konsol xatolari: ${errors.length}\n${errors.join('\n')}` : 'konsol toza');
console.log(`snapshotlar: ${OUT}`);
await browser.close();
