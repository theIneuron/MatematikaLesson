// 6-sinf amaliyotining inglizcha qatlamini tekshiradi: qancha topshiriq tarjima
// qilingan va tarjimada nima buzilgan.
//
//   node scripts/grade6-practice-en.mjs          // barcha darslar
//   node scripts/grade6-practice-en.mjs 1-6      // faqat tanlangan darslar
//
// Xatolar:
//   - topic / prompt / explanation da inglizchasi yo'q yoki bo'sh
//   - inglizcha matnda kirill harflari
//   - tarjimani talab qiladigan variant yozuvi translationsEn ga tushmagan
//   - translationsEn da bunday variant yozuvi yo'q (topshiriq o'zgargan)
//   - inglizchasi uzbekchaning aynan nusxasi (matn ko'chirilgan)
import {
  TASKS_PER_LESSON, labelsOf, needsTranslation, parseLessons, readItem, taskId, taskPath,
} from './grade6-practice-en-lib.mjs';

const CYRILLIC = /[Ѐ-ӿ]/;
const lessons = parseLessons(process.argv.slice(2));
const FIELDS = ['topic', 'prompt', 'explanation'];

let done = 0;
let total = 0;
const errors = [];

for (const lesson of lessons) {
  let translated = 0;
  for (let task = 1; task <= TASKS_PER_LESSON; task += 1) {
    const id = taskId(lesson, task);
    const { item } = readItem(taskPath(lesson, task));
    total += 1;

    const filled = FIELDS.filter((key) => item[key]?.en?.trim());
    if (!filled.length) continue;
    translated += 1;
    done += 1;

    for (const key of FIELDS) {
      const value = item[key]?.en;
      if (!value?.trim()) { errors.push(`${id}: ${key} da inglizchasi yo'q`); continue; }
      if (CYRILLIC.test(value)) errors.push(`${id}: ${key} da kirill harflari — «${value.slice(0, 40)}»`);
      // Sof matematik satr bir xil bo'lishi mumkin, izohli matn esa yo'q.
      if (value === item[key].uz && /[a-z]{4}/i.test(value)) {
        errors.push(`${id}: ${key} uzbekchadan ko'chirilgan — «${value.slice(0, 40)}»`);
      }
    }

    const labels = labelsOf(item);
    const table = item.translationsEn || {};
    for (const label of labels) {
      if (needsTranslation(label) && !table[label]) {
        errors.push(`${id}: "${label}" variant yozuvining inglizchasi yo'q`);
      }
    }
    for (const key of Object.keys(table)) {
      if (!labels.includes(key)) errors.push(`${id}: translationsEn da ortiqcha yozuv — "${key}"`);
      else if (CYRILLIC.test(table[key])) errors.push(`${id}: "${key}" tarjimasida kirill harflari`);
    }
  }
  const mark = translated === TASKS_PER_LESSON ? '' : ' ·';
  console.log(`dars ${String(lesson).padStart(2)}: EN ${translated}/${TASKS_PER_LESSON}${mark}`);
}

console.log(`\njami: EN ${done}/${total}`);
if (errors.length) {
  console.error(`\nXATO (${errors.length}):`);
  for (const line of errors) console.error(`  ${line}`);
  process.exit(1);
}
console.log('xato yo\'q');
