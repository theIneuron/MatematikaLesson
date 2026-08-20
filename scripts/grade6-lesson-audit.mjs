// ============================================================================
// grade6-lesson-audit.mjs — СТАТИЧЕСКАЯ проверка урока 6 класса по контракту
// эталона (`context/GRADE6_ETALON.md`). Браузер не нужен, работает за секунду.
//
// Зачем: до этого скрипта соблюдение контракта проверялось глазами методиста —
// то есть на каждом уроке заново. Ту же работу в 3, 8 и 10 классах делает
// аудит урока, и именно он заменил ручное ревью.
//
// Что читается как ДАННЫЕ, а не регексом: `CONTENT`, `SCREEN_META`,
// `LESSON_META` вырезаются из файла и выполняются в песочнице (`node:vm`).
// Иначе строка озвучки и строка экрана путаются местами, и проверка начинает
// врать в обе стороны.
//
// Запуск:
//   node scripts/grade6-lesson-audit.mjs                     (урок 1)
//   node scripts/grade6-lesson-audit.mjs 2
//   node scripts/grade6-lesson-audit.mjs src/components/grade6/Dars02.jsx
// ============================================================================
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const args = process.argv.slice(2);
const arg = args.find((a) => !a.startsWith('--')) || '1';
const FILE = path.resolve(/^\d+$/.test(arg)
  ? `src/components/grade6/Dars${String(arg).padStart(2, '0')}.jsx`
  : arg);
const SHARED = path.resolve('src/components/grade6/screens.jsx');
const REGISTRY = path.resolve('src/lessons/grade6.js');

const problems = [];
const notes = [];
const bad = (s) => problems.push(s);
const note = (s) => notes.push(s);

if (!fs.existsSync(FILE)) {
  console.log(`Файл не найден: ${FILE}`);
  process.exit(1);
}
const src = fs.readFileSync(FILE, 'utf8');
const name = path.basename(FILE);

// ---------------------------------------------------------------------------
// ЧТЕНИЕ ДАННЫХ УРОКА
// ---------------------------------------------------------------------------
function cutLiteral(code, decl) {
  const i = code.indexOf(decl);
  if (i < 0) return null;
  const start = code.indexOf(decl.endsWith('[') ? '[' : '{', i);
  const open = code[start];
  const close = open === '[' ? ']' : '}';
  let depth = 0;
  let inStr = null;
  for (let j = start; j < code.length; j += 1) {
    const ch = code[j];
    const prev = code[j - 1];
    if (inStr) {
      if (ch === inStr && prev !== '\\') inStr = null;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') { inStr = ch; continue; }
    if (ch === '/' && code[j + 1] === '/') { j = code.indexOf('\n', j); if (j < 0) break; continue; }
    if (ch === open) depth += 1;
    else if (ch === close) { depth -= 1; if (depth === 0) return code.slice(start, j + 1); }
  }
  return null;
}

const evalLiteral = (text, what) => {
  if (!text) { bad(`${what}: не найден в файле`); return null; }
  try {
    return vm.runInNewContext(`(${text})`, {}, { timeout: 4000 });
  } catch (e) {
    bad(`${what}: не читается как данные — ${String(e.message).split('\n')[0]}`);
    return null;
  }
};

const CONTENT = evalLiteral(cutLiteral(src, 'const CONTENT = {'), 'CONTENT');
const SCREEN_META = evalLiteral(cutLiteral(src, 'const SCREEN_META = ['), 'SCREEN_META');
const LESSON_META = evalLiteral(cutLiteral(src, 'const LESSON_META = {'), 'LESSON_META');

// ---------------------------------------------------------------------------
// 1. АРХИТЕКТУРА: урок не держит обвязку у себя
// ---------------------------------------------------------------------------
if (!/from '\.\/screens\.jsx'/.test(src)) {
  bad('урок не импортирует общий слой ./screens.jsx');
}
const OWN = [
  ['class AudioEngine', 'движок озвучки'],
  ['const Stage = ', 'обвязка экрана Stage'],
  ['function useAudio', 'хук useAudio'],
  ['const QuestionScreen = ', 'типовой экран QuestionScreen'],
  ['function useMobileZoom', 'мобильный масштаб'],
  ['const NavNext = ', 'кнопка Дальше'],
];
OWN.forEach(([needle, what]) => {
  if (src.includes(needle)) bad(`${what} скопирован в урок — он живёт в screens.jsx`);
});
if (!/registerLesson\(\s*\{/.test(src)) {
  bad('нет вызова registerLesson({ meta, screenMeta }) — озвучка уйдёт без lessonId');
}

// ---------------------------------------------------------------------------
// 2. СТРУКТУРА: пятнадцать экранов, роли на местах
// ---------------------------------------------------------------------------
if (SCREEN_META) {
  if (SCREEN_META.length !== 15) bad(`экранов ${SCREEN_META.length}, а по эталону 15`);
  const type = (i) => SCREEN_META[i] && SCREEN_META[i].type;
  if (type(0) !== 'hook') bad('первый экран не хук');
  if (type(SCREEN_META.length - 1) !== 'summary') bad('последний экран не итог');
  if (!SCREEN_META.some((s) => s.type === 'rule')) bad('в уроке нет экрана с правилом');
  const scored = SCREEN_META.filter((s) => s.scored).length;
  if (scored < 5) note(`оцениваемых экранов ${scored} — практики мало`);
  const screensArr = src.match(/const screens = \[([\s\S]*?)\];/);
  if (screensArr) {
    const n = screensArr[1].split(',').map((s) => s.trim()).filter(Boolean).length;
    if (n !== SCREEN_META.length) bad(`массив screens (${n}) и SCREEN_META (${SCREEN_META.length}) разной длины — роли разъедутся`);
  } else {
    note('массив screens не найден — порядок экранов не сверен');
  }
}

// ---------------------------------------------------------------------------
// 3. ХУК И ФИНАЛ: свои сцены, разбора на хуке нет
// ---------------------------------------------------------------------------
const hookCall = src.match(/<HookScreen[\s\S]{0,400}?\/>/);
if (!hookCall) bad('экран хука не собран из HookScreen общего слоя');
else {
  if (!/content=\{/.test(hookCall[0])) bad('HookScreen без content');
  if (!/sceneNode=\{/.test(hookCall[0])) bad('HookScreen без своей сцены (sceneNode)');
}
const sumCall = src.match(/<SummaryScreen[\s\S]{0,400}?\/>/);
if (!sumCall) bad('итог не собран из SummaryScreen общего слоя');
else if (!/sceneNode=\{/.test(sumCall[0])) bad('SummaryScreen без финальной сцены (sceneNode)');

const viewBoxes = [...src.matchAll(/viewBox="0 0 (\d+) (\d+)"/g)].map((m) => `${m[1]}x${m[2]}`);
if (!viewBoxes.includes('400x154')) note('сцены хука в размере 400x154 нет — хук будет другой высоты, чем в остальных уроках');
if (!viewBoxes.includes('400x92')) note('сцены финала в размере 400x92 нет');

if (CONTENT && CONTENT.s_hook) {
  const h = CONTENT.s_hook;
  ['conclusion', 'why_1', 'why_label', 'other_btn', 'cmp_5', 'res_5', 'res_6'].forEach((k) => {
    if (k in h || (h.audio && k in h.audio)) bad(`хук держит разбор (${k}) — он выдаёт ответ, который ребёнок должен получить сам`);
  });
  if (!h.gesture) bad('на хуке нет строки-обещания «ответ проверим по ходу урока»');
}

// ---------------------------------------------------------------------------
// 4. ОЦЕНКА И ЗАМОК: теория 6 класса не оценивается, но переход ЗАПЕРТ
// Решение методиста 2026-08-20: кнопка «Дальше» открывается только после того,
// как озвучка слайда договорила. Значение по умолчанию в общем слое — `true`,
// поэтому урок не должен передавать `navLock` вовсе. Раньше правило требовало
// обратного (решение 2026-08-13), и `navLock: false` разошёлся по всем 46 урокам.
// ---------------------------------------------------------------------------
if (/navLock:\s*false/.test(src)) bad('урок выключает замок перехода (navLock: false) — с 2026-08-20 замок включён');
if (/passed:\s*(true|false|[a-z])/.test(src) && !/passed:\s*null/.test(src)) {
  bad('в onFinished уходит passed — теория 6 класса не оценивается');
}

// ---------------------------------------------------------------------------
// 5. CSS: ловушки шаблонной строки и склейка с базой
// ---------------------------------------------------------------------------
if (!/const STYLES = BASE_STYLES/.test(src)) {
  bad('нет `const STYLES = BASE_STYLES + LESSON_STYLES` — базовый CSS класса не подключён');
}
if (!/<style>\{STYLES\}<\/style>/.test(src)) {
  bad('в корне нет <style>{STYLES}</style> — сборщик LMS на него завязан');
}
const lessonStyles = cutLiteral(src, 'const LESSON_STYLES = ');
{
  const m = src.match(/const LESSON_STYLES = `([\s\S]*?)`;/);
  const body = m ? m[1] : (lessonStyles || '');
  if (body.includes('`')) bad('обратная кавычка внутри LESSON_STYLES — урок станет белым экраном');
  if (/\\(?![nrt\\`$u])/.test(body)) bad('обратный слэш внутри LESSON_STYLES — «Bad escape sequence»');
}

// ---------------------------------------------------------------------------
// 6. ТЕКСТ: три языка, апострофы, кириллица, символы в озвучке
// ---------------------------------------------------------------------------
const LANGS = ['ru', 'uz', 'en'];
const isNode = (v) => v && typeof v === 'object' && !Array.isArray(v)
  && LANGS.some((k) => k in v) && Object.keys(v).every((k) => LANGS.includes(k));

const CYR = /[А-Яа-яЁё]/;
const BAD_APOS = /[ʻ‘’ʼ]/;
// В звучащей строке символов быть не должно: их читают как мусор или молчат.
const BAD_AUDIO = /[%$×÷=<>✗π√²³°]|—|(?<![:\d])\d+\s*\/\s*\d+/;
const AUDIO_KEY = /(^|\.)(audio|hint_audio|.*_audio)(\.|\[|$)/;

// `*_forms` — тройка русских форм счётного слова для plRu («ряд, ряда, рядов»).
// В узбекском и английском счётное слово не меняется, поэтому узел РУССКИЙ по
// назначению, а не недоделанный перевод.
const FORMS_KEY = /_forms$/;

const seen = { nodes: 0, langMissing: 0 };
const walk = (value, trail) => {
  if (isNode(value) && FORMS_KEY.test(trail)) return;
  if (isNode(value)) {
    seen.nodes += 1;
    LANGS.forEach((l) => {
      const v = value[l];
      if (v === undefined || v === null || (typeof v === 'string' && !v.trim())) {
        seen.langMissing += 1;
        if (seen.langMissing <= 8) bad(`${trail}: нет текста на «${l}»`);
        return;
      }
      const strings = Array.isArray(v) ? v : [v];
      strings.forEach((s, i) => {
        if (typeof s !== 'string') return;
        const where = Array.isArray(v) ? `${trail}.${l}[${i}]` : `${trail}.${l}`;
        if (l === 'uz' && CYR.test(s)) bad(`${where}: кириллица в узбекской строке`);
        if (l === 'uz' && BAD_APOS.test(s)) bad(`${where}: апостроф не ASCII`);
        if (AUDIO_KEY.test(trail)) {
          const m = s.match(BAD_AUDIO);
          if (m) bad(`${where}: символ «${m[0]}» в звучащей строке — писать словом`);
          if (/[«»"]/.test(s)) bad(`${where}: кавычки в звучащей строке`);
        }
      });
    });
    return;
  }
  if (Array.isArray(value)) { value.forEach((v, i) => walk(v, `${trail}[${i}]`)); return; }
  if (value && typeof value === 'object') {
    Object.entries(value).forEach(([k, v]) => walk(v, trail ? `${trail}.${k}` : k));
  }
};
if (CONTENT) walk(CONTENT, '');

// ---------------------------------------------------------------------------
// 7. ЗАГОТОВКИ ШАБЛОНА
// Урок, в котором остались строки шаблона, выглядит готовым и молча уходит на
// проверку с чужим текстом.
// ---------------------------------------------------------------------------
[
  ["grade6-NN", 'lessonId остался шаблонным'],
  ['Название урока', 'русское название урока не заполнено'],
  ['Dars nomi', 'узбекское название урока не заполнено'],
  ['Lesson title', 'английское название урока не заполнено'],
  ['const Zaglushka', 'в уроке остались экраны-заглушки шаблона'],
].forEach(([needle, what]) => {
  if (src.includes(needle)) bad(what);
});

// ---------------------------------------------------------------------------
// 7b. ЧИСЛОВОЙ ОТВЕТ ВВОДИТСЯ КЛАВИАТУРОЙ
// Клавиатура финала принимает ограниченное число цифр. Задание урока 44 «сколько
// кубических сантиметров в литре» с ответом 1000 при пределе три оказалось
// недостижимым: поле набирало «100» и дальше не пускало. Предел читаем из общего
// слоя, чтобы проверка не разошлась с ним.
// ---------------------------------------------------------------------------
if (CONTENT && CONTENT.s_final && Array.isArray(CONTENT.s_final.items) && fs.existsSync(SHARED)) {
  const m = fs.readFileSync(SHARED, 'utf8').match(/const MAX_NUM_LEN = (\d+)/);
  const limit = m ? Number(m[1]) : 3;
  CONTENT.s_final.items.forEach((it, i) => {
    if (it.kind !== 'num' || it.ans === undefined) return;
    const digits = String(it.ans).replace('-', '').length;
    if (digits > limit) {
      bad(`s_final.items[${i}]: ответ ${it.ans} длиннее клавиатуры (${digits} знаков против ${limit}) — ввести нельзя`);
    }
  });
}

// ---------------------------------------------------------------------------
// 8. РЕЕСТР УРОКОВ
// ---------------------------------------------------------------------------
if (LESSON_META && fs.existsSync(REGISTRY)) {
  const reg = fs.readFileSync(REGISTRY, 'utf8');
  const num = name.match(/Dars(\d+)/);
  if (num) {
    const needle = `Dars${Number(num[1])}.`;
    if (!reg.includes(needle) && !reg.includes(`dars${num[1]}-`)) {
      bad(`урока нет в src/lessons/grade6.js — на сайте он не появится`);
    }
  }
  if (!LESSON_META.lessonId) bad('LESSON_META без lessonId');
}

// ---------------------------------------------------------------------------
console.log(`\n=== АУДИТ ${name} ===`);
console.log(`языковых узлов: ${seen.nodes}, экранов: ${SCREEN_META ? SCREEN_META.length : '?'}, строк: ${src.split('\n').length}`);
if (fs.existsSync(SHARED)) {
  const sharedLines = fs.readFileSync(SHARED, 'utf8').split('\n').length;
  console.log(`общий слой screens.jsx: ${sharedLines} строк (в уроке не дублируется)`);
}
notes.forEach((n) => console.log('  замечание: ' + n));
console.log(`\nнарушений: ${problems.length}`);
problems.slice(0, 40).forEach((p) => console.log('  ' + p));
if (problems.length > 40) console.log(`  … и ещё ${problems.length - 40}`);
process.exit(problems.length ? 1 : 0);
