// ============================================================================
// scripts/validate-grade3.mjs — ВАЛИДАТОР УРОКОВ 3 КЛАССА
//
// Проверяет урок против src/books/grade3/ETALON_3SINF_v2.md, опираясь на машинное
// выражение контракта в src/courses/grade3/kit/schema.js.
//
// Зачем это нужно именно машиной. При сборке каркаса выяснилось, что из чисел,
// которые я внёс в эталон «по расчёту», два оказались неверными: длина сегмента
// озвучки (16–30 слов вместо измеренных 8–18) и значения кнопок с рамками (были
// взяты из перебиваемого слоя CSS). Проверять контракт представлениями нельзя —
// только кодом.
//
// РЕЖИМЫ
//   node scripts/validate-grade3.mjs --control
//       контрольная проверка валидатора: эталонный Dars01 должен ПРОЙТИ,
//       Dars22 (озвучка склейкой) — УПАСТЬ. Если наоборот, неверен валидатор.
//
//   node scripts/validate-grade3.mjs --legacy Dars01 [Dars22 ...]
//       аудит существующих уроков-монолитов: наличие озвучки, запрещённые символы
//       в том, что уходит в TTS, локали, FREE_NAV, обработка on_event.
//
//   node scripts/validate-grade3.mjs --data src/courses/grade3/content/Dars52.data.js
//       полная проверка урока нового формата: роли, экраны, хронометраж, аудио,
//       локали, варианты ответа, механики.
// ============================================================================

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const KIT = path.join(ROOT, 'src/courses/grade3/kit');

const schema = await import(pathToFileURL(path.join(KIT, 'schema.js')).href);
const verbalize = await import(pathToFileURL(path.join(KIT, 'verbalize.js')).href);
const i18n = await import(pathToFileURL(path.join(KIT, 'i18n.js')).href);
const answers = await import(pathToFileURL(path.join(KIT, 'answers.js')).href);

// ---------------------------------------------------------------------------
// вывод
// ---------------------------------------------------------------------------
const C = { red: '\x1b[31m', yellow: '\x1b[33m', green: '\x1b[32m', dim: '\x1b[2m', off: '\x1b[0m' };
const mk = () => ({ errors: [], warnings: [], notes: [] });
const err = (r, msg) => r.errors.push(msg);
const warn = (r, msg) => r.warnings.push(msg);
const note = (r, msg) => r.notes.push(msg);

function report(title, r) {
  const bad = r.errors.length;
  const soft = r.warnings.length;
  const head = bad ? `${C.red}НЕ ПРОШЁЛ${C.off}` : soft ? `${C.yellow}прошёл с замечаниями${C.off}` : `${C.green}прошёл${C.off}`;
  console.log(`\n${title} — ${head}  (ошибок ${bad}, предупреждений ${soft})`);
  for (const m of r.errors) console.log(`  ${C.red}ОШИБКА${C.off}  ${m}`);
  for (const m of r.warnings) console.log(`  ${C.yellow}внимание${C.off}  ${m}`);
  for (const m of r.notes) console.log(`  ${C.dim}—       ${m}${C.off}`);
  return bad === 0;
}

// ---------------------------------------------------------------------------
// разбор старого урока-монолита
// ---------------------------------------------------------------------------
function audioRegions(src) {
  const out = [];
  let i = 0;
  for (;;) {
    i = src.indexOf('audio:', i);
    if (i < 0) break;
    const j = src.indexOf('{', i);
    if (j < 0) break;
    let d = 0;
    let k = j;
    for (; k < src.length; k += 1) {
      if (src[k] === '{') d += 1;
      else if (src[k] === '}') { d -= 1; if (d === 0) { k += 1; break; } }
    }
    out.push(src.slice(j, k));
    i = k;
  }
  return out;
}

// Строки, которые действительно являются КОНТЕНТОМ.
// Шаблонные строки с ${...} — это код (например, withBridgeAudio склеивает мостик
// с интро), и они попадали в проверку как контент: символ $ давал ложную ошибку
// «percent/currency» в эталонном уроке. Контент интерполяций не содержит.
const strings = (chunk) => [...chunk.matchAll(/(['"`])((?:\\.|(?!\1)[\s\S])*?)\1/g)]
  .map((m) => m[2])
  .filter((s) => s.length > 8 && /\s/.test(s) && !s.includes('${'));

/** Строки поля visual — именно они уходили в озвучку в уроках на раннере. */
const visualStrings = (src) => [...src.matchAll(/visual:\s*(['"`])((?:\\.|(?!\1)[\s\S])*?)\1/g)].map((m) => m[2]);

function auditLegacy(file) {
  const r = mk();
  const src = fs.readFileSync(file, 'utf8');
  const name = path.basename(file);

  // 1. Есть ли написанная озвучка вообще.
  const regions = audioRegions(src);
  const spoken = regions.flatMap(strings);
  if (spoken.length === 0) {
    err(r, 'нет ни одной написанной реплики: озвучка собирается из экранного текста. '
      + 'ETALON §9 требует, чтобы аудио было ШИРЕ инструкции, а не её копией');
  } else {
    note(r, `реплик найдено: ${spoken.length}`);
  }

  // 2. Запрещённые символы в том, что уходит в TTS: и в репликах, и в visual-строках.
  const toTts = [...spoken, ...visualStrings(src)];
  const symbolHits = [];
  for (const text of toTts) {
    const { errors } = verbalize.checkSpeech(text);
    for (const e of errors) symbolHits.push({ text, name: e.name, found: e.found });
  }
  if (symbolHits.length) {
    const uniq = [...new Set(symbolHits.map((h) => h.name))];
    err(r, `запрещённые символы в озвучке (${symbolHits.length} мест, типы: ${uniq.join(', ')}). `
      + `Например: ${JSON.stringify(symbolHits[0].text.slice(0, 60))}`);
  }

  // 3. Длинные сегменты и цифры — предупреждения (пороги измерены по 19 урокам).
  const long = spoken.filter((s) => s.split(/\s+/).filter(Boolean).length > schema.TIMING.wordsPerSegment[1]);
  if (long.length) warn(r, `сегментов длиннее ${schema.TIMING.wordsPerSegment[1]} слов: ${long.length}`);

  // 4. FREE_NAV.
  const fn = /^\s*const FREE_NAV\s*=\s*(true|false)/m.exec(src);
  if (fn && fn[1] === 'true') err(r, 'FREE_NAV = true: блокировка навигации отключена, ребёнок проматывает объяснение (§5)');

  // 5. Обработка on_event — все три части.
  if (/on_event:/.test(src)) {
    const guard = /trigger\.indexOf\('on_event:'\)\s*===\s*0|startsWith\('on_event:'\)/.test(src);
    const forced = (src.match(/playNext\(true\)/g) || []).length;
    if (!guard) err(r, 'сегменты on_event не ждут своего события: объяснение звучит до ответа ребёнка (§3.3)');
    else if (forced < 3) warn(r, `guard on_event есть, но playNext(true) встречается ${forced} раз вместо 3 — часть цепочки может молчать`);
    else note(r, 'обработка on_event полная: guard + 3 принудительных вызова');
  }

  // 6. Автоскролл.
  if (/const autoScrollTo\s*=\s*\(\s*\)\s*=>\s*\{\s*\}/.test(src)) {
    err(r, 'автоскролл отключён (autoScrollTo пустой): появившийся разбор уходит за экран (§6.3)');
  }

  // 7. Локали в озвучке: en отсутствует во всех старых уроках — это долг, не ошибка файла.
  const hasEn = /\ben:\s*['"`]/.test(src);
  if (!hasEn) warn(r, 'английской локали нет (§9.1 требует три локали) — общий долг старых уроков');

  return { ok: report(`${name}  [старый формат]`, r), r };
}

// ---------------------------------------------------------------------------
// полная проверка урока нового формата
// ---------------------------------------------------------------------------
async function validateData(file) {
  const r = mk();
  const mod = await import(pathToFileURL(path.resolve(file)).href);
  const lesson = mod.default || mod.LESSON;
  if (!lesson) { err(r, 'файл не экспортирует урок (default или LESSON)'); return { ok: report(file, r), r }; }

  const screens = lesson.screens || [];
  const n = screens.length;

  // структура
  if (n < schema.LESSON_RULES.screensMin || n > schema.LESSON_RULES.screensMax) {
    err(r, `экранов ${n}; эталон требует ${schema.LESSON_RULES.screensMin}–${schema.LESSON_RULES.screensMax} (§1)`);
  }
  const missing = schema.missingRoles(screens);
  if (missing.length) err(r, `не покрыты обязательные роли: ${missing.join(', ')} (§1)`);

  const kinds = schema.interactionKinds(screens);
  if (kinds.length < schema.LESSON_RULES.interactionKindsMin) {
    err(r, `типов взаимодействия ${kinds.length}; нужно не меньше ${schema.LESSON_RULES.interactionKindsMin} (§2.11)`);
  }
  const share = schema.activeScreensShare(screens);
  if (share < schema.LESSON_RULES.activeScreensShareMin) {
    err(r, `активных экранов ${Math.round(share * 100)}%; нужно не меньше ${schema.LESSON_RULES.activeScreensShareMin * 100}% (§3)`);
  }

  // хронометраж
  const est = schema.estimateLessonSeconds(screens.map((s, i) => ({ type: s.type || schema.roleDef(schema.rolesOf(s)[0])?.type })));
  if (est > schema.TIMING.lessonSeconds) {
    err(r, `расчётная длительность ${est} с превышает ${schema.TIMING.lessonSeconds} с (§1.2)`);
  } else {
    note(r, `расчётная длительность ${est} с из ${schema.TIMING.lessonSeconds}`);
  }

  // локали и озвучка
  const gaps = i18n.collectMissingLocales(lesson);
  for (const g of gaps.slice(0, 8)) err(r, `нет локалей ${g.missing.join(',')} в ${g.path} (§9.1)`);
  if (gaps.length > 8) err(r, `...и ещё ${gaps.length - 8} мест без локали`);

  let words = 0;
  let segs = 0;
  const walkAudio = (node, at) => {
    if (!node || typeof node !== 'object') return;
    if (i18n.isLocalizedNode(node)) return;
    for (const [k, v] of Object.entries(node)) {
      if (k === 'audio' && v && typeof v === 'object') {
        for (const [field, val] of Object.entries(v)) {
          const list = Array.isArray(val) ? val : [val];
          for (const item of list) {
            for (const loc of ['uz', 'ru', 'en']) {
              const text = item && item[loc];
              if (typeof text !== 'string') continue;
              if (loc === 'ru') { words += text.split(/\s+/).filter(Boolean).length; segs += 1; }
              // strictStyle: новый контент пишется без длинного тире — ту же паузу
              // даёт запятая, а поведение боевого TTS на «—» не проверено.
              // Во 2 классе тире вычистили целиком (0 на 3806 сегментов).
              const res = verbalize.checkSpeech(text, loc, { strictStyle: true });
              for (const e of res.errors) err(r, `${at}.audio.${field} [${loc}]: ${e.name} ${JSON.stringify(e.found)}${e.suggest ? ` — напиши «${e.suggest}»` : ''}`);
              for (const w of res.warnings) if (w.code === 'segment_too_long') warn(r, `${at}.audio.${field} [${loc}]: ${w.detail}`);
            }
          }
        }
      } else walkAudio(v, at ? `${at}.${k}` : k);
    }
  };
  screens.forEach((s, i) => walkAudio(s, `screen[${i}]`));

  const [wMin, wMax] = schema.TIMING.wordsPerLessonRu;
  if (words && (words < wMin || words > wMax)) {
    warn(r, `RU-слов в озвучке ${words}; измеренная норма ${wMin}–${wMax} (§1.2)`);
  } else if (words) note(r, `RU-слов в озвучке ${words}, сегментов ${segs}`);

  // аудио не должно быть пересказом экрана
  screens.forEach((s, i) => {
    const intro = s.audio?.intro;
    if (!intro) return;
    for (const loc of ['uz', 'ru', 'en']) {
      const a = intro[loc];
      if (typeof a !== 'string') continue;
      const onScreen = [s.eyebrow?.[loc], s.lead?.[loc], s.q?.[loc]].filter(Boolean);
      if (schema.isAudioDerivedFromScreen(a, onScreen)) {
        err(r, `screen[${i}].audio.intro [${loc}]: озвучка повторяет экранный текст; §9 требует, чтобы она была ШИРЕ`);
      }
    }
  });

  // варианты ответа
  for (const b of schema.badOptionCounts(screens)) {
    err(r, `screen[${b.at}]: вариантов ${b.n}; допустимо ${schema.ANSWER_RULES.optionsMin}–${schema.ANSWER_RULES.optionsMax} (§4.1)`);
  }
  for (const m of schema.roleInteractionMismatch(screens)) {
    err(r, `screen[${m.at}] роль ${m.role} требует механику из: ${m.allowed.join(', ')}, а стоит «${m.interaction}» (§2)`);
  }
  const { slots } = answers.collectAnswerSlots(screens);
  if (slots.length) note(r, `вопросов с вариантами: ${slots.length}`);

  // сцена-обрамление
  const first = screens[0];
  const last = screens[n - 1];
  if (!first?.scene || !last?.scene) err(r, 'нет сцены-обрамления на первом или последнем экране (§1.3)');
  else if (first.scene !== last.scene) err(r, `сцена первого экрана «${first.scene}» не совпадает с последним «${last.scene}» (§1.3)`);

  // механики
  const expl = screens.filter((s) => schema.rolesOf(s).some((k) => schema.roleDef(k)?.type === 'exploration'));
  const noStages = expl.filter((s) => !s.stages || s.stages.length < 2);
  if (noStages.length) err(r, `${noStages.length} exploration-экранов без поэтапного reveal (§3.1): нужны stages`);
  if (!screens.some((s) => s.workedExamples)) err(r, 'нет блока примеров с решениями (§3.2)');

  // FREE_NAV в новом формате берётся из каркаса, проверяем только явное переопределение
  if (lesson.freeNav === true) err(r, 'freeNav = true в данных урока (§5 требует false)');

  return { ok: report(path.basename(file) + '  [новый формат]', r), r };
}

// ---------------------------------------------------------------------------
// контрольная проверка самого валидатора
// ---------------------------------------------------------------------------
/**
 * Контроль проверяет РАЗЛИЧАЮЩУЮ СПОСОБНОСТЬ валидатора, а не «ноль ошибок».
 *
 * Первая версия контроля требовала, чтобы эталонный Dars01 прошёл без ошибок.
 * Это оказалось неверным ожиданием: Dars01 в рабочем дереве несёт чужую правку
 * (FREE_NAV = true, вырезанный автоскролл), и валидатор поймал её совершенно
 * правильно. Требовать «ноль ошибок» от файла значит проверять файл, а не
 * валидатор. Поэтому контроль сверяет КОНКРЕТНЫЕ признаки.
 */
async function control() {
  console.log('КОНТРОЛЬНАЯ ПРОВЕРКА ВАЛИДАТОРА');
  console.log('Проверяется различающая способность: отличает ли валидатор написанную');
  console.log('вручную озвучку от собранной раннером из экранного текста.\n');

  const dir = path.join(ROOT, 'src/components/grade3');
  const a = auditLegacy(path.join(dir, 'Dars01.jsx'));
  const b = auditLegacy(path.join(dir, 'Dars22.jsx'));

  const noAudio = (res) => res.r.errors.some((m) => m.startsWith('нет ни одной написанной реплики'));
  const symbols = (res) => res.r.errors.some((m) => m.startsWith('запрещённые символы'));

  const checks = [
    ['Dars01: озвучка написана вручную — ошибка «нет реплик» НЕ сработала', !noAudio(a)],
    ['Dars01: запрещённых символов в озвучке нет', !symbols(a)],
    ['Dars22: озвучка собирается раннером — ошибка «нет реплик» СРАБОТАЛА', noAudio(b)],
    ['Dars01: чужая правка FREE_NAV = true поймана', a.r.errors.some((m) => m.includes('FREE_NAV'))],
    ['Dars01: вырезанный автоскролл пойман', a.r.errors.some((m) => m.includes('автоскролл'))],
  ];

  console.log('\n' + '='.repeat(72));
  let all = true;
  for (const [name, ok] of checks) {
    console.log(`  ${ok ? C.green + 'да ' : C.red + 'НЕТ'}${C.off}  ${name}`);
    if (!ok) all = false;
  }
  console.log(`\nВАЛИДАТОР ${all ? C.green + 'РАБОТАЕТ' : C.red + 'НЕВЕРЕН'}${C.off}`);
  if (all) {
    console.log(`${C.dim}Ошибки, найденные в Dars01, — настоящие: это чужая незакоммиченная`);
    console.log(`правка в рабочем дереве, а не сбой проверки.${C.off}`);
  }
  return all;
}

// ---------------------------------------------------------------------------
const argv = process.argv.slice(2);
let ok = true;

if (argv[0] === '--control') {
  ok = await control();
} else if (argv[0] === '--legacy') {
  const dir = path.join(ROOT, 'src/components/grade3');
  const names = argv.slice(1);
  const files = names.length
    ? names.map((x) => (x.endsWith('.jsx') ? path.resolve(x) : path.join(dir, `${x}.jsx`)))
    : fs.readdirSync(dir).filter((f) => /^Dars\d+\.jsx$/.test(f)).map((f) => path.join(dir, f));
  for (const f of files) ok = auditLegacy(f).ok && ok;
} else if (argv[0] === '--data') {
  for (const f of argv.slice(1)) ok = (await validateData(f)).ok && ok;
} else {
  const dir = path.join(ROOT, 'src/courses/grade3/content');
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.data.js')) : [];
  if (files.length === 0) {
    console.log('Уроков нового формата пока нет (src/courses/grade3/content/*.data.js).');
    console.log('Проверить валидатор:      node scripts/validate-grade3.mjs --control');
    console.log('Аудит старых уроков:      node scripts/validate-grade3.mjs --legacy Dars01 Dars22');
  } else {
    for (const f of files) ok = (await validateData(path.join(dir, f))).ok && ok;
  }
}

process.exit(ok ? 0 : 1);
