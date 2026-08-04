// ============================================================================
// scripts/validate-informatika.mjs — ПРОВЕРКА УРОКА ИНФОРМАТИКИ ПО КОНТРАКТУ
//
// Зачем свой валидатор, а не тот, что у математики. Общего в контрактах много:
// три локали без пропусков, запрещённое в озвучке, регистр обращения, длина
// сегмента, 3–4 варианта ответа, свой разбор на каждый неверный вариант.
// Разного — ровно то, что предметное: каталог механик математики (столбик,
// числовая прямая, разрядные единицы) к информатике не применим, и требовать
// «примеры с разложением числа» от урока про процессор бессмысленно.
//
// Поэтому здесь: универсальные проверки берутся из движка (kit/schema.js),
// предметные — заданы ниже списком ролей и механик информатики.
//
// Запуск:
//   node scripts/validate-informatika.mjs
//   node scripts/validate-informatika.mjs --data src/courses/informatika3/content/Dars01.data.js
// ============================================================================

import { pathToFileURL } from 'node:url';
import {
  findForbiddenInSpeech, findUzTextIssues, findRuTextIssues,
  longSegments, badOptionCounts, estimateLessonSeconds, TIMING, ANSWER_RULES,
  LESSON_RULES,
} from '../src/courses/informatika3/engine/kit/schema.js';

const arg = (name, def) => {
  const i = process.argv.indexOf(name);
  return i !== -1 ? process.argv[i + 1] : def;
};
const dataPath = arg('--data', 'src/courses/informatika3/content/Dars01.data.js');

const LOCALES = ['uz', 'ru', 'en'];

// --- КОНТРАКТ ИНФОРМАТИКИ ---------------------------------------------------
// Роли те же педагогические, что у математики, плюс своя: myth_check —
// снятие ложной модели («компьютер сам думает»). Это не упражнение и не
// открытие признака: ребёнок предсказывает, а урок показывает следствие.
const ROLES = {
  problem: { type: 'hook', required: true, scored: false },
  recall: { type: 'exploration', required: true, scored: false },
  concrete_model: { type: 'exploration', required: true, scored: false },
  second_model: { type: 'exploration', required: true, scored: false },
  discovery: { type: 'exploration', required: true, scored: false },
  bridge: { type: 'exploration', required: false, scored: false },
  myth_check: { type: 'exploration', required: false, scored: false },
  rule: { type: 'rule', required: true, scored: false },
  guided_practice: { type: 'test', required: true, scored: true },
  independent_practice: { type: 'test', required: true, scored: true },
  error_find: { type: 'test', required: true, scored: true },
  reverse_task: { type: 'test', required: true, scored: true },
  final_diagnostic: { type: 'test', required: true, scored: true },
  life_problem: { type: 'case', required: true, scored: true },
  summary: { type: 'summary', required: false, scored: false },
};

// Механики информатики. Ключ — как ребёнок отвечает, а не как выглядит экран.
const INTERACTIONS = ['mc', 'classify', 'error_spot', 'pick_object', 'numpad', 'chain_slot'];

const errors = [];
const warnings = [];
const notes = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

const mod = await import(pathToFileURL(dataPath).href);
const lesson = mod.default;
const screens = lesson.screens || [];

// --- 1. локали: пропуск локали ребёнок читает как чужой язык -----------------
const walk = (node, path) => {
  if (node === null || node === undefined) return;
  if (Array.isArray(node)) {
    node.forEach((v, i) => walk(v, `${path}[${i}]`));
    return;
  }
  if (typeof node !== 'object') return;
  const keys = Object.keys(node);
  const looksLocalized = LOCALES.some((l) => keys.includes(l));
  if (looksLocalized) {
    const missing = LOCALES.filter((l) => !node[l] || (typeof node[l] === 'string' && !node[l].trim()));
    if (missing.length) err(`${path}: нет локалей ${missing.join(', ')}`);
    return;
  }
  keys.forEach((k) => walk(node[k], `${path}.${k}`));
};
walk(lesson.title, 'title');
screens.forEach((s, i) => walk(s, `screen[${i}](${s.id || i})`));

// --- 2. озвучка: запрещённые символы, длина, регистр -------------------------
const audioFields = (s) => {
  const out = [];
  const push = (node, label) => {
    if (!node) return;
    LOCALES.forEach((l) => {
      const v = node[l];
      if (!v) return;
      (Array.isArray(v) ? v : [v]).forEach((text, i) => out.push({ text, label: `${label}[${l}][${i}]` }));
    });
  };
  push(s.audio?.intro, 'audio.intro');
  push(s.audio?.rule, 'audio.rule');
  push(s.audio, 'audio');
  ['on_correct', 'on_wrong', 'on_unknown'].forEach((k) => {
    const node = s.audio?.[k];
    if (Array.isArray(node)) node.forEach((n, i) => push(n, `audio.${k}[${i}]`));
    else push(node, `audio.${k}`);
  });
  (s.rounds || []).forEach((r, ri) => {
    push(r.audio?.intro, `rounds[${ri}].audio.intro`);
    push(r.audio?.on_correct, `rounds[${ri}].audio.on_correct`);
    (Array.isArray(r.audio?.on_wrong) ? r.audio.on_wrong : [r.audio?.on_wrong]).forEach((n, i) => push(n, `rounds[${ri}].audio.on_wrong[${i}]`));
    (r.escalation || []).forEach((n, i) => push(n, `rounds[${ri}].escalation[${i}]`));
  });
  (s.devices || []).forEach((d, di) => push(d.say, `devices[${di}].say`));
  (s.escalation || []).forEach((n, i) => push(n, `escalation[${i}]`));
  push(s.verdict, 'verdict');
  push(s.doneText, 'doneText');
  return out;
};

let segments = 0;
let ruWords = 0;
screens.forEach((s, i) => {
  const where = `screen[${i}](${s.id || i})`;
  audioFields(s).forEach(({ text, label }) => {
    segments += 1;
    if (/\[ru\]/.test(label)) ruWords += String(text).split(/\s+/).filter(Boolean).length;
    findForbiddenInSpeech(text).forEach(({ name, why }) => err(`${where}.${label}: ${name} — ${why}`));
    if (/\[uz\]/.test(label)) {
      findUzTextIssues(text).forEach(({ name, why, found }) => err(`${where}.${label}: ${name} «${found}» — ${why}`));
    }
    if (/\[ru\]/.test(label)) {
      findRuTextIssues(text).forEach(({ name, why, found }) => err(`${where}.${label}: ${name} «${found}» — ${why}`));
    }
  });
  const ru = s.audio?.intro?.ru || s.audio?.ru || [];
  longSegments(Array.isArray(ru) ? ru : [ru]).forEach(({ at, words }) => {
    warn(`${where}.audio.intro[ru][${at}]: ${words} слов; норма ${TIMING.wordsPerSegment.join('–')}`);
  });
});

// --- 3. текст экрана: тот же регистр и апострофы, что в озвучке --------------
const textNodes = (s) => [s.lead, s.q, s.topic, s.context, s.rule, s.checkQ, s.checkOk, s.checkNo,
  s.praise, s.fact, s.bridge, s.info, s.strongHint, ...(s.options || []),
  ...(s.rounds || []).flatMap((r) => [r.q, ...(r.options || [])]),
  ...(s.devices || []).map((d) => d.label)].filter(Boolean);

screens.forEach((s, i) => {
  textNodes(s).forEach((node, k) => {
    if (node.uz) findUzTextIssues(node.uz).forEach(({ name, why, found }) => err(`screen[${i}].текст[${k}][uz]: ${name} «${found}» — ${why}`));
    if (node.ru) findRuTextIssues(node.ru).forEach(({ name, why, found }) => err(`screen[${i}].текст[${k}][ru]: ${name} «${found}» — ${why}`));
    LOCALES.forEach((l) => {
      if (node[l] && /[‘’ʻʼ]/.test(node[l])) err(`screen[${i}].текст[${k}][${l}]: типографский апостроф, нужен ASCII`);
    });
  });
});

// --- 4. роли, состав и хронометраж ------------------------------------------
const used = screens.flatMap((s) => (Array.isArray(s.role) ? s.role : [s.role]).filter(Boolean));
Object.entries(ROLES).filter(([, v]) => v.required).forEach(([key]) => {
  if (!used.includes(key)) err(`не покрыта обязательная роль «${key}»`);
});
used.forEach((r) => { if (!ROLES[r]) err(`неизвестная роль «${r}»; допустимые: ${Object.keys(ROLES).join(', ')}`); });

if (screens.length < LESSON_RULES.screensMin || screens.length > LESSON_RULES.screensMax) {
  err(`экранов ${screens.length}; контракт требует ${LESSON_RULES.screensMin}–${LESSON_RULES.screensMax}`);
}

const metas = screens.map((s) => ({ type: s.type || ROLES[s.role]?.type || 'exploration' }));
const est = estimateLessonSeconds(metas);
if (est > TIMING.lessonSeconds) err(`расчётная длительность ${est} с превышает ${TIMING.lessonSeconds} с`);

screens.forEach((s, i) => {
  if (s.interaction && !INTERACTIONS.includes(s.interaction)) {
    err(`screen[${i}]: механика «${s.interaction}» не из каталога информатики (${INTERACTIONS.join(', ')})`);
  }
});

const kinds = new Set(screens.map((s) => s.interaction).filter(Boolean));
// Ребёнок должен отвечать по-разному: выбор, касание и самостоятельный ввод.
if (kinds.size < 3) err(`типов взаимодействия ${kinds.size}; нужно не меньше 3, иначе урок это один и тот же вопрос пятнадцать раз`);

// --- 5. варианты ответа: количество и разбор на каждый неверный -------------
badOptionCounts(screens).forEach(({ at, n }) => err(`screen[${at}]: вариантов ${n}; нужно ${ANSWER_RULES.optionsMin}–${ANSWER_RULES.optionsMax}`));

const checkWrong = (options, correct, wrong, where) => {
  if (!options) return;
  if (!Array.isArray(wrong)) {
    err(`${where}: нет разбора на каждый неверный вариант (on_wrong должен быть массивом по числу вариантов)`);
    return;
  }
  if (wrong.length !== options.length) {
    err(`${where}: разборов ${wrong.length}, вариантов ${options.length} — должно совпадать, иначе разбор уедет к чужому ответу`);
  }
  options.forEach((_, i) => {
    if (i === correct) return;
    if (!wrong[i]) err(`${where}: у неверного варианта ${i} нет своего разбора (§9)`);
  });
  if (wrong[correct]) warn(`${where}: у ВЕРНОГО варианта ${correct} задан разбор ошибки — вероятно, сдвиг массива`);
};

screens.forEach((s, i) => {
  const where = `screen[${i}](${s.id || i})`;
  if (s.options && s.role !== 'rule') checkWrong(s.options, s.correct, s.audio?.on_wrong, where);
  (s.rounds || []).forEach((r, ri) => {
    if (r.options) checkWrong(r.options, r.correct, r.audio?.on_wrong, `${where}.rounds[${ri}]`);
    if (r.options && r.correct === undefined) err(`${where}.rounds[${ri}]: не указан correct`);
  });
  if (ROLES[s.role]?.type === 'test' && (s.rounds || []).length !== LESSON_RULES.roundsPerTest) {
    err(`${where}: раундов ${(s.rounds || []).length}; контракт требует ${LESSON_RULES.roundsPerTest}`);
  }
});

// --- 6. что ребёнок делает сам ----------------------------------------------
// Три способа не быть лекцией: раскрытие под озвучку (stages), раскрытие
// действием ребёнка (devices) и предсказание, следствие которого показывает
// сцена (options + scene). Третий — это экран «компьютер сам думает?»:
// stages там не нужны, ребёнок сначала отвечает, и только потом видит ответ.
const revealScreens = screens.filter((s) => s.stages || s.devices || s.countdown
  || (s.options && s.scene));
const explorations = screens.filter((s) => (s.type || ROLES[s.role]?.type) === 'exploration');
explorations.forEach((s, i) => {
  if (!revealScreens.includes(s)) err(`screen «${s.id || i}»: экран объяснения без поэтапного раскрытия (stages) и без действия ребёнка (devices)`);
});
if (!screens.some((s) => s.devices)) err('ни одного экрана, где раскрытием управляет ребёнок: только показ — это лекция');
const predictions = screens.filter((s) => s.options && (s.role === 'problem' || s.role === 'myth_check'));
if (predictions.length < 2) err(`экранов с предсказанием до объяснения ${predictions.length}; нужно не меньше 2`);

// --- 7. отчёт ---------------------------------------------------------------
notes.push(`расчётная длительность ${est} с из ${TIMING.lessonSeconds}`);
notes.push(`сегментов озвучки ${segments}, RU-слов ${ruWords}`);
notes.push(`экранов ${screens.length}, механик ${[...kinds].join(', ')}`);
notes.push(`вопросов с вариантами ${screens.reduce((n, s) => n + (s.options ? 1 : 0) + (s.rounds || []).filter((r) => r.options).length, 0)}`);

const name = dataPath.split(/[\\/]/).pop();
console.log(`${name} — ${errors.length ? 'НЕ ПРОШЁЛ' : 'ПРОШЁЛ'} (ошибок ${errors.length}, предупреждений ${warnings.length})`);
errors.forEach((m) => console.log(`  ОШИБКА    ${m}`));
warnings.forEach((m) => console.log(`  внимание  ${m}`));
notes.forEach((m) => console.log(`  —         ${m}`));
if (errors.length) process.exitCode = 1;
