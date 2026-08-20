// Tarjima uchun matnni chiqaradi: har bir topshiriqning mavzusi, savoli, izohi va
// (kerak bo'lsa) variant yozuvlari. Inglizchasi bor topshiriq chiqmaydi.
//
// Ishlatish:
//   node scripts/grade6-practice-en-extract.mjs 1-4        // matn
//   node scripts/grade6-practice-en-extract.mjs --stats    // hisob-kitob
import {
  TASKS_PER_LESSON, labelsOf, needsTranslation, parseLessons, readItem, taskId, taskPath,
} from './grade6-practice-en-lib.mjs';

const args = process.argv.slice(2);
const stats = args.includes('--stats');
const lessons = parseLessons(args.filter((a) => !a.startsWith('--')));

let done = 0;
let total = 0;
let labelCount = 0;
let chars = 0;
const lines = [];

for (const lesson of lessons) {
  for (let task = 1; task <= TASKS_PER_LESSON; task += 1) {
    const { item } = readItem(taskPath(lesson, task));
    const id = taskId(lesson, task);
    total += 1;
    if (item.prompt.en) { done += 1; continue; }
    const labels = [...new Set(labelsOf(item).filter(needsTranslation))];
    labelCount += labels.length;
    chars += [item.topic.uz, item.prompt.uz, item.explanation.uz,
      item.topic.ru, item.prompt.ru, item.explanation.ru].join('').length;
    if (stats) continue;
    lines.push(`### ${id} · ${item.type}`);
    lines.push(`topic.uz | ${item.topic.uz}`);
    lines.push(`topic.ru | ${item.topic.ru}`);
    lines.push(`prompt.uz | ${item.prompt.uz}`);
    lines.push(`prompt.ru | ${item.prompt.ru}`);
    lines.push(`explanation.uz | ${item.explanation.uz}`);
    lines.push(`explanation.ru | ${item.explanation.ru}`);
    if (item.answer !== undefined) lines.push(`answer | ${item.answer}`);
    if (labels.length) lines.push(`labels | ${labels.join(' || ')}`);
    lines.push('');
  }
}

if (stats) {
  console.log(`topshiriq: ${total}, inglizchasi bor: ${done}, qolgan: ${total - done}`);
  console.log(`tarjima kutayotgan variant yozuvi: ${labelCount}`);
  console.log(`manba matni: ${Math.round(chars / 1000)} ming belgi`);
} else {
  console.log(lines.join('\n'));
}
