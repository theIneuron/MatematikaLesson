// ============================================================================
// grade6-new-lesson.mjs — заготовка урока 6 класса из шаблона.
//
// Зачем: собирая урок руками, легко забыть то, что не видно на экране —
// идентификатор урока для озвучки, вызов `registerLesson`, запись в реестр.
// Скрипт делает механическую часть, дальше работает методика.
//
// Что делает:
//   1. берёт `DarsShablon.jsx` и подставляет номер урока и его lessonId;
//   2. берёт название и slug из `src/lessons/grade6.js` (там все 46 уроков уже
//      записаны) и кладёт узбекское название в LESSON_META;
//   3. отказывается затирать существующий урок без --force (с бэкапом);
//   4. печатает, что делать дальше.
//
// Запуск:
//   node scripts/grade6-new-lesson.mjs 2
//   node scripts/grade6-new-lesson.mjs 2 --force
//   node scripts/grade6-new-lesson.mjs 2 --out .tmp/Dars02.preview.jsx   (примерка)
// ============================================================================
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const FORCE = args.includes('--force');
const OUT = args.includes('--out') ? args[args.indexOf('--out') + 1] : null;
const N = Number(args.find((a) => /^\d+$/.test(a)));
if (!N || N < 1 || N > 46) {
  console.log('Укажи номер урока: node scripts/grade6-new-lesson.mjs 2');
  process.exit(1);
}

const pad = String(N).padStart(2, '0');
const dir = 'src/components/grade6';
const target = OUT || path.join(dir, `Dars${pad}.jsx`);
const template = path.join(dir, 'DarsShablon.jsx');

if (!fs.existsSync(template)) {
  console.log(`Шаблон не найден: ${template}`);
  process.exit(1);
}
if (fs.existsSync(target) && !FORCE) {
  console.log(`${target} уже существует. Перезаписать — с флагом --force (старый файл сохранится как .bak).`);
  process.exit(1);
}

// Реестр уроков: оттуда берём slug и название, чтобы они не разошлись.
const registrySrc = fs.readFileSync('src/lessons/grade6.js', 'utf8');
const entryRe = new RegExp(`slug: '(dars${pad}-[^']+)',\\s*\\n\\s*title: (["'])([\\s\\S]*?)\\2`, 'm');
const entry = registrySrc.match(entryRe);
if (!entry) {
  console.log(`В src/lessons/grade6.js нет теоретического урока ${N} — сначала запиши его туда.`);
  process.exit(1);
}
const slug = entry[1];
const titleUz = entry[3];

let code = fs.readFileSync(template, 'utf8');
code = code
  .replace('// 6 КЛАСС — ШАБЛОН УРОКА', `// 6 КЛАСС, УРОК ${N}`)
  .replace('// Скопируй этот файл в DarsNN.jsx и заполни. Здесь стоит ВСЁ, что урок обязан',
    '// Заготовка сделана scripts/grade6-new-lesson.mjs. Здесь стоит ВСЁ, что урок обязан')
  .replace("lessonId: 'grade6-NN'", `lessonId: 'grade6-${pad}'`)
  .replace("uz: 'Dars nomi'", `uz: ${JSON.stringify(titleUz)}`)
  .replace('export default function LessonRoot(', `export default function Dars${pad}Lesson(`);

if (fs.existsSync(target)) fs.copyFileSync(target, `${target}.bak`);
fs.writeFileSync(target, code);

console.log(`\nСоздан ${target}`);
console.log(`  адрес превью: /6-sinf/matematika/nazariy/${slug}?lang=uz`);
console.log(`  lessonId: grade6-${pad}`);
console.log(`  название из реестра: ${titleUz}`);
console.log(`
Дальше по эталону (context/GRADE6_ETALON.md):
  1. скелет 15 экранов и сюжет двух сцен -> показать методисту, дождаться «да»;
  2. контент на RU, UZ и EN, озвучка шире экрана;
  3. свои сцены хука (400 на 154) и финала (400 на 92), экраны со своей математикой;
  4. проверки:
       node scripts/grade6-lesson-audit.mjs ${N}
       node scripts/grade6-lesson-smoke.mjs ${N} --film <номера экранов-фильмов>
       npm run build
       node scripts/build-grade6-lms.mjs ${N} && node scripts/grade6-lms-theory-check.mjs ${N}
`);
