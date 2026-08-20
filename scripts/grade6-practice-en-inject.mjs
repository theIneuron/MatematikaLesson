// Tayyor inglizcha matnni topshiriq fayllariga yozadi.
//
//   node scripts/grade6-practice-en-inject.mjs <json>        // yozish
//   node scripts/grade6-practice-en-inject.mjs <json> --force // borini almashtirish
//
// JSON ko'rinishi:
//   { "D01_01": { "topic": "...", "prompt": "...", "explanation": "...",
//                 "labels": { "Ha": "Yes", "Yo'q": "No" } } }
//
// Yozishdan oldin tekshiriladi: fayl bor, matn bo'sh emas, kirillcha harf yo'q,
// `labels` kalitlari topshiriqning haqiqiy variant yozuvlari.
import fs from 'node:fs';
import { labelsOf, readItem, taskId, taskPath, writeItem } from './grade6-practice-en-lib.mjs';

const [jsonPath, ...flags] = process.argv.slice(2);
if (!jsonPath) { console.error('JSON fayl yo\'li kerak'); process.exit(1); }
const force = flags.includes('--force');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const CYRILLIC = /[Ѐ-ӿ]/;

const errors = [];
const written = [];

for (const [id, block] of Object.entries(data)) {
  const match = /^D(\d{2})_(\d{2})$/.exec(id);
  if (!match) { errors.push(`${id}: kalit D01_01 ko'rinishida bo'lishi kerak`); continue; }
  const lesson = Number(match[1]);
  const task = Number(match[2]);
  const file = taskPath(lesson, task);
  if (!fs.existsSync(file)) { errors.push(`${id}: fayl yo'q — ${file}`); continue; }
  if (id !== taskId(lesson, task)) { errors.push(`${id}: nomi mos emas`); continue; }

  const { src, item, block: itemBlock } = readItem(file);
  if (item.prompt.en && !force) { errors.push(`${id}: inglizchasi allaqachon bor (--force)`); continue; }

  const local = [];
  for (const key of ['topic', 'prompt', 'explanation']) {
    const value = block[key];
    if (typeof value !== 'string' || !value.trim()) { local.push(`${id}: ${key} bo'sh`); continue; }
    if (CYRILLIC.test(value)) local.push(`${id}: ${key} da kirill harflari bor`);
    item[key] = { ...item[key], en: value.trim() };
  }

  const labels = block.labels || {};
  const known = new Set(labelsOf(item));
  for (const [uz, en] of Object.entries(labels)) {
    if (!known.has(uz)) local.push(`${id}: "${uz}" — bunday variant yozuvi yo'q`);
    if (typeof en !== 'string' || !en.trim()) local.push(`${id}: "${uz}" tarjimasi bo'sh`);
    else if (CYRILLIC.test(en)) local.push(`${id}: "${uz}" tarjimasida kirill harflari bor`);
  }
  if (Object.keys(labels).length) {
    item.translationsEn = { ...(item.translationsEn || {}), ...labels };
  }

  if (local.length) { errors.push(...local); continue; }
  writeItem(file, src, itemBlock, item);
  written.push(id);
}

if (written.length) console.log(`yozildi: ${written.length} topshiriq (${written[0]} … ${written[written.length - 1]})`);
if (errors.length) {
  console.error(`\nXATO (${errors.length}):`);
  for (const line of errors) console.error(`  ${line}`);
  process.exit(1);
}
