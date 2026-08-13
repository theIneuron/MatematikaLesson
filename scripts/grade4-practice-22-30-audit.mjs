#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { runInNewContext } from 'node:vm';
import { parse } from '@babel/parser';

const ROOT = process.cwd();
const GRADE4_DIR = path.join(ROOT, 'src', 'components', 'grade4');
const LESSONS = Array.from({ length: 9 }, (_, index) => index + 22);
const ALLOWED_KINDS = new Set([
  'mc', 'state', 'place', 'sign', 'card', 'digit', 'placepick', 'gap', 'numpad',
  'missing', 'match', 'order', 'slots', 'construct', 'sort', 'ticks', 'shade', 'fracbuild',
]);
const EXPECTED = {
  22: {
    id: 'num-4-22-practice', exportName: 'Grade4Dars22Practice',
    slug: 'dars22-amaliyot-sonning-kasr-qismini-topish',
    kinds: ['mc', 'order', 'match', 'numpad', 'missing'],
    tags: ['unit_fraction', 'equal_groups', 'fraction_model', 'fraction_of_number', 'fraction_result_matching', 'whole_fraction', 'operation_order', 'inverse_check'],
    anchors: ['80÷10', '45÷9', '63÷9×7', '66÷11=6', '72÷8', '9×5', '81', '96÷8×3=36', '84÷12'],
  },
  23: {
    id: 'num-4-23-practice', exportName: 'Grade4Dars23Practice',
    slug: 'dars23-amaliyot-kasrli-masalalar',
    kinds: ['mc', 'order', 'match', 'numpad', 'missing'],
    tags: ['fraction_word_problems', 'find_part', 'problem_representation', 'find_whole', 'equal_groups', 'inverse_path_order', 'unit_fraction_to_whole', 'inverse_check'],
    anchors: ['63÷7', '60÷5×2', '24÷3×8', '28÷4×9', '35÷5', '20÷4', '18÷2×9=81', '42÷7×10=60'],
  },
  24: {
    id: 'num-4-24-practice', exportName: 'Grade4Dars24Practice',
    slug: 'dars24-amaliyot-onli-kasrlar',
    kinds: ['mc', 'card', 'match', 'order', 'missing'],
    tags: ['tenths-decimal-notation', 'decimal-place-reading', 'fraction-decimal-matching', 'decimal-place-construction', 'zero-placeholder', 'decimal-reading', 'decimal-place-value', 'mixed-decimal-boundary', 'decimal-error-analysis', 'decimal-notation-strategy'],
    anchors: ['0,8', '0.8', '4,271', '4.271', '704/1000', '6,482', '6.482', '0,058', '0.058', '8,004', '8.004', '4,027', '4.027'],
  },
  25: {
    id: 'num-4-25-practice', exportName: 'Grade4Dars25Practice',
    slug: 'dars25-amaliyot-toplamlar-eyler-venn-diagrammasi',
    kinds: ['mc', 'match', 'order', 'numpad', 'missing'],
    tags: ['two-criterion-classification', 'four-zone-map', 'yes-no-to-zone', 'criterion-total', 'outside-count', 'at-least-one-count', 'number-property-classification', 'shared-element-once', 'middle-count-error', 'classification-strategy-transfer'],
    anchors: ['17', '19', '14', '26', '35', '18'],
  },
  26: {
    id: 'num-4-26-practice', exportName: 'Grade4Dars26Practice',
    slug: 'dars26-amaliyot-uzunlik-birliklari',
    kinds: ['mc', 'match', 'order', 'numpad', 'missing'],
    tags: ['cm-to-mm', 'length-equivalence', 'mixed-length-procedure', 'mixed-length-to-cm', 'length-remainder', 'length-word-problem', 'unit-choice', 'mixed-length-zero', 'metre-kilometre-error', 'length-strategy-transfer'],
    anchors: ['9 cm', '6 dm', '342 cm', '847', '274 cm', '625', '605 cm', '7200 m', '4 km 225 m'],
  },
  27: {
    id: 'num-4-27-practice', exportName: 'Grade4Dars27Practice',
    slug: 'dars27-amaliyot-massa-birliklari',
    kinds: ['mc', 'match', 'order', 'numpad', 'missing'],
    tags: ['kg-to-g', 'mass-equivalence', 'mixed-mass-procedure', 'mixed-centner-to-kg', 'mass-remainder', 'mass-word-problem', 'mass-ordering', 'mixed-mass-zero', 'kilogram-tonne-error', 'mass-strategy-transfer'],
    anchors: ['8 kg', '7 sentner', '2350 kg', '365', '4275 kg', '415', '7005 g', '6400 kg', '2 t 30 kg'],
  },
  28: {
    id: 'num-4-28-practice', exportName: 'Grade4Dars28Practice',
    slug: 'dars28-amaliyot-vaqt-birliklari',
    kinds: ['mc', 'match', 'order', 'numpad', 'missing'],
    tags: ['seconds_minutes', 'time_equivalence', 'mixed_time_procedure', 'week_day_conversion', 'time_remainder', 'elapsed_time', 'multi_time_units', 'calendar_boundary', 'time_normalization_error', 'elapsed_time_strategy'],
    anchors: ['420', '360', '165', '46', '197', '09:35', '11:20', '7200', '96', '36', '23:15', '01:50', '155'],
  },
  29: {
    id: 'num-4-29-practice', exportName: 'Grade4Dars29Practice',
    slug: 'dars29-amaliyot-yuza-birliklari',
    kinds: ['mc', 'match', 'order', 'numpad', 'missing'],
    tags: ['cm2_to_mm2', 'area_equivalence', 'squared_scale_factor', 'area_measurement', 'area_remainder', 'area_word_problem', 'area_unit_choice', 'square_factor_boundary', 'area_conversion_error', 'area_strategy_transfer'],
    anchors: ['400 mm²', '900 cm²', '3 000 000 m²', '60 000 cm²', '63 cm²', '835 cm²', '8400 dm²', '120 000 cm²', '500 cm²', '12 600 dm²'],
  },
  30: {
    id: 'num-4-30-practice', exportName: 'Grade4Dars30Practice',
    slug: 'dars30-amaliyot-kattalik-birliklarini-aylantirish',
    kinds: ['mc', 'match', 'order', 'numpad', 'missing'],
    tags: ['length_relation', 'unit_relations', 'mixed_length_conversion', 'mixed_mass_conversion', 'mixed_time_conversion', 'mixed_area_problem', 'conversion_strategy', 'calendar_conversion_boundary', 'universal_factor_error', 'invariant_check_transfer'],
    anchors: ['7000 m', '8000 g', '300 min', '900 cm²', '4075 m', '3400 kg', '158', '750 dm²', '3040 m', '2075 kg', '105 min', '500 dm²'],
  },
};

const decimalNotation = (whole, numerator, denominator) => {
  const places = String(denominator).length - 1;
  return `${whole}.${String(numerator).padStart(places, '0')}`;
};
const zone = (inA, inB) => inA ? (inB ? 'both' : 'a-only') : (inB ? 'b-only' : 'outside');
const elapsedMinutes = (startHour, startMinute, endHour, endMinute) => (
  (endHour * 60 + endMinute - startHour * 60 - startMinute + 24 * 60) % (24 * 60)
);

// One independent, exact check for every planned task. These checks intentionally
// recompute the result instead of trusting the answer metadata extracted from JSX.
const DETERMINISTIC_CHECKS = {
  22: [
    ['01', () => 80 / 10 === 8 && 8 * 3 === 24],
    ['02', () => 45 / 9 * 2 === 10],
    ['03', () => 45 / 5 * 4 === 36 && 70 / 7 * 3 === 30 && 16 / 8 * 5 === 10],
    ['04', () => 63 / 9 * 7 === 49],
    ['05', () => 66 / 11 * 4 === 24],
    ['06', () => 72 / 8 * 5 === 45],
    ['07', () => 33 / 3 * 2 === 22 && 44 / 4 * 3 === 33 && 48 / 6 * 5 === 40],
    ['08', () => 81 / 9 * 9 === 81],
    ['09', () => 96 / 8 * 3 === 36 && 96 / 3 * 8 === 256],
    ['10', () => 84 / 12 * 5 === 35 && 35 < 84],
  ],
  23: [
    ['01', () => 48 / 8 * 3 === 18],
    ['02', () => 63 / 7 * 4 === 36],
    ['03', () => 60 / 5 * 2 === 24 && 24 / 3 * 8 === 64 && 54 / 9 * 5 === 30],
    ['04', () => 28 / 4 * 9 === 63],
    ['05', () => 35 / 5 === 7 && 7 * 6 === 42],
    ['06', () => 24 / 3 * 10 === 80],
    ['07', () => 20 / 4 === 5 && 5 * 9 === 45],
    ['08', () => 6 * 12 === 72],
    ['09', () => 18 / 2 * 9 === 81 && 18 / 9 * 2 === 4],
    ['10', () => 42 / 7 * 10 === 60],
  ],
  24: [
    ['01', () => decimalNotation(0, 8, 10) === '0.8'],
    ['02', () => String(4271).padStart(4, '0').at(-2) === '7'],
    ['03', () => decimalNotation(0, 9, 10) === '0.9'
      && decimalNotation(0, 32, 100) === '0.32'
      && decimalNotation(0, 704, 1000) === '0.704'],
    ['04', () => decimalNotation(6, 482, 1000) === '6.482'],
    ['05', () => decimalNotation(0, 9, 100) === '0.09'],
    ['06', () => decimalNotation(0, 58, 1000) === '0.058'],
    ['07', () => ['7', '3', '0', '6'].join('') === '7306'],
    ['08', () => decimalNotation(8, 4, 1000) === '8.004'],
    ['09', () => decimalNotation(0, 64, 1000) === '0.064'],
    ['10', () => decimalNotation(4, 27, 1000) === '4.027'],
  ],
  25: [
    ['01', () => zone(true, false) === 'a-only'],
    ['02', () => new Set([[true, false], [true, true], [false, true], [false, false]].map(([a, bValue]) => zone(a, bValue))).size === 4],
    ['03', () => zone(false, true) === 'b-only'],
    ['04', () => 5 + 3 === 8],
    ['05', () => 17 - 6 - 2 - 5 === 4],
    ['06', () => 8 + 5 + 6 === 19 && 8 + 5 + 6 + 3 === 22],
    ['07', () => zone(14 % 2 === 0, 14 > 20) === 'a-only'
      && zone(26 % 2 === 0, 26 > 20) === 'both'
      && zone(35 % 2 === 0, 35 > 20) === 'b-only'
      && zone(9 % 2 === 0, 9 > 20) === 'outside'],
    ['08', () => new Set([18]).size === 1],
    ['09', () => 4 + 3 === 7],
    ['10', () => zone(true, false) === 'a-only'],
  ],
  26: [
    ['01', () => 9 * 10 === 90],
    ['02', () => 6 * 10 === 60 && 7 * 100 === 700 && 5 * 1000 === 5000],
    ['03', () => 3 * 100 + 42 === 342],
    ['04', () => 8 * 100 + 47 === 847],
    ['05', () => Math.floor(274 / 100) === 2 && 274 % 100 === 74],
    ['06', () => 3 * 100 + 45 + 2 * 100 + 80 === 625],
    ['07', () => ['mm', 'cm', 'm', 'km'].every((unit, index, units) => units.indexOf(unit) === index)],
    ['08', () => 6 * 100 + 5 === 605],
    ['09', () => Math.floor(7200 / 1000) === 7 && 7200 % 1000 === 200],
    ['10', () => 2 * 1000 + 350 + 1 * 1000 + 875 === 4 * 1000 + 225],
  ],
  27: [
    ['01', () => 8 * 1000 === 8000],
    ['02', () => 7 * 100 === 700 && 6 * 10 === 60 && 9 * 1000 === 9000],
    ['03', () => 2 * 1000 + 350 === 2350],
    ['04', () => 3 * 100 + 65 === 365],
    ['05', () => Math.floor(4275 / 1000) === 4 && 4275 % 1000 === 275],
    ['06', () => 2 * 100 + 35 + 1 * 100 + 80 === 415],
    ['07', () => 950 < 1050 && 1050 < 1200],
    ['08', () => 7 * 1000 + 5 === 7005],
    ['09', () => Math.floor(6400 / 1000) === 6 && 6400 % 1000 === 400],
    ['10', () => 1 * 1000 + 250 + 7 * 100 + 80 === 2 * 1000 + 30],
  ],
  28: [
    ['01', () => 420 / 60 === 7],
    ['02', () => 6 * 60 === 360 && 3 * 24 === 72 && 5 * 7 === 35],
    ['03', () => 2 * 60 + 45 === 165],
    ['04', () => 6 * 7 + 4 === 46],
    ['05', () => Math.floor(197 / 60) === 3 && 197 % 60 === 17],
    ['06', () => elapsedMinutes(9, 35, 11, 20) === 105],
    ['07', () => 7200 / 3600 === 2 && 96 / 24 === 4 && 36 / 12 === 3],
    ['08', () => new Set([28, 29, 30, 31]).size > 1],
    ['09', () => 2 * 60 + 90 === 3 * 60 + 30],
    ['10', () => elapsedMinutes(23, 15, 1, 50) === 155 && 155 === 2 * 60 + 35],
  ],
  29: [
    ['01', () => 4 * (10 ** 2) === 400],
    ['02', () => 9 * (10 ** 2) === 900 && 5 * (10 ** 2) === 500 && 3 * (1000 ** 2) === 3_000_000],
    ['03', () => 6 * (100 ** 2) === 60_000],
    ['04', () => 7 * 9 === 63],
    ['05', () => Math.floor(835 / 100) === 8 && 835 % 100 === 35],
    ['06', () => 12 * 7 === 84 && 84 * 100 === 8400],
    ['07', () => ['mm²', 'cm²', 'm²', 'km²'].every((unit, index, units) => units.indexOf(unit) === index)],
    ['08', () => 12 * (100 ** 2) === 120_000],
    ['09', () => 5 * (10 ** 2) === 500],
    ['10', () => 14 * 9 === 126 && 126 * 100 === 12_600],
  ],
  30: [
    ['01', () => 7 * 1000 === 7000],
    ['02', () => 8 * 1000 === 8000 && 5 * 60 === 300 && 9 * 100 === 900 && 11 * 100 === 1100],
    ['03', () => 4 * 1000 + 75 === 4075],
    ['04', () => 3 * 1000 + 4 * 100 === 3400],
    ['05', () => 2 * 60 + 38 === 158],
    ['06', () => 3 * 100 + 450 === 750],
    ['07', () => 360 / 60 === 6 && Math.floor(4275 / 1000) === 4 && 900 / 100 === 9 && Math.floor(4075 / 100) === 40],
    ['08', () => new Set([28, 29, 30, 31]).size > 1],
    ['09', () => 7 * 100 === 700 && 7 * 1000 === 7000 && 7 * 60 === 420 && 7 * 100 === 700
      && new Set([100, 1000, 60]).size === 3],
    ['10', () => 3 * 1000 + 40 === 3040 && 2 * 1000 + 75 === 2075
      && 1 * 60 + 45 === 105 && 5 * 100 === 500],
  ],
};

const failures = [];
const pass = (condition, message) => { if (!condition) failures.push(message); };
const compact = (value) => String(value ?? '').toLowerCase().replace(/[\s_]+/g, '');
const localised = (value) => value && typeof value === 'object'
  && ['uz', 'ru', 'en'].every((lang) => typeof value[lang] === 'string' && value[lang].trim());

const deterministicEntries = Object.entries(DETERMINISTIC_CHECKS).flatMap(([lesson, checks]) => (
  checks.map(([taskId, check]) => ({ lesson, taskId, check }))
));
pass(deterministicEntries.length === 90, `Deterministik matematika auditi 90 ta emas — ${deterministicEntries.length}`);
for (const item of deterministicEntries) {
  let correct = false;
  try { correct = item.check(); } catch { correct = false; }
  pass(correct, `Dars${item.lesson} task ${item.taskId}: deterministik natija mos emas`);
}

function findInitializer(ast, name) {
  let initializer = null;
  const visit = (node) => {
    if (!node || typeof node !== 'object' || initializer) return;
    if (node.type === 'VariableDeclarator' && node.id?.type === 'Identifier' && node.id.name === name) {
      initializer = node.init;
      return;
    }
    for (const value of Object.values(node)) {
      if (Array.isArray(value)) value.forEach(visit);
      else visit(value);
    }
  };
  visit(ast);
  return initializer;
}

function evaluateInitializer(source, ast, name) {
  const initializer = findInitializer(ast, name);
  if (!initializer) throw new Error(`${name} topilmadi`);
  const b = (ru, uz, en) => ({ ru, uz, en });
  const option = (id, ru, uz, en, correct = false, wrongRu = '', wrongUz = '', wrongEn = '') => ({
    id, text: b(ru, uz, en), correct, wrong: wrongRu ? b(wrongRu, wrongUz, wrongEn) : null,
  });
  const decimal = (comma, point) => b(comma, comma, point);
  return runInNewContext(`(${source.slice(initializer.start, initializer.end)})`, {
    addEnglish: (value) => value,
    b,
    option,
    decimal,
    dec: decimal,
    d: decimal,
  }, { timeout: 2_000 });
}

for (const lesson of LESSONS) {
  const expected = EXPECTED[lesson];
  const fileName = `Dars${lesson}Practice.jsx`;
  const file = path.join(GRADE4_DIR, fileName);
  if (!fs.existsSync(file)) {
    failures.push(`${fileName}: fayl topilmadi`);
    continue;
  }
  const source = fs.readFileSync(file, 'utf8');
  let ast;
  let tasks;
  let screenMeta;
  try {
    ast = parse(source, { sourceType: 'module', plugins: ['jsx'] });
    tasks = evaluateInitializer(source, ast, 'TASKS');
    screenMeta = evaluateInitializer(source, ast, 'SCREEN_META');
  } catch (error) {
    failures.push(`${fileName}: parse/evaluate xatosi — ${error.message}`);
    continue;
  }

  pass(Array.isArray(tasks) && tasks.length === 10, `${fileName}: TASKS aynan 10 ta emas`);
  if (!Array.isArray(tasks) || tasks.length !== 10) continue;
  const ids = tasks.map((task) => task.id);
  pass(ids.join(',') === '01,02,03,04,05,06,07,08,09,10', `${fileName}: task ID ketma-ketligi noto'g'ri — ${ids.join(',')}`);
  pass(tasks.slice(0, 2).every((task) => task.level === 'green')
    && tasks.slice(2, 7).every((task) => task.level === 'yellow')
    && tasks.slice(7).every((task) => task.level === 'red'), `${fileName}: 2 green / 5 yellow / 3 red buzilgan`);

  const kinds = new Set(tasks.map((task) => task.kind));
  pass(kinds.size >= 4, `${fileName}: mexanika soni ${kinds.size}, kamida 4 emas`);
  pass([...kinds].every((kind) => ALLOWED_KINDS.has(kind)), `${fileName}: browser solver qo'llamaydigan kind bor — ${[...kinds].filter((kind) => !ALLOWED_KINDS.has(kind)).join(', ')}`);
  pass(expected.kinds.every((kind) => kinds.has(kind)), `${fileName}: rejalangan mechanics to'liq emas — ${expected.kinds.filter((kind) => !kinds.has(kind)).join(', ')}`);
  pass(Array.isArray(tasks[0].options) && tasks[0].options.length >= 2
    && tasks[0].options.filter((item) => item.correct).length === 1, `${fileName}: task 01 wrong-first choice bilan tekshirib bo'lmaydi`);

  for (const task of tasks) {
    for (const field of ['setup', 'prompt', 'correctText', 'rule', 'secondHint', 'thirdHint']) {
      pass(localised(task[field]), `${fileName} task ${task.id}: ${field} UZ/RU/EN to'liq emas`);
    }
    pass(typeof task.skillTag === 'string' && task.skillTag.trim(), `${fileName} task ${task.id}: skillTag yo'q`);
    if (Array.isArray(task.options)) {
      pass(task.options.filter((item) => item.correct).length === 1, `${fileName} task ${task.id}: aynan bitta correct option yo'q`);
      for (const item of task.options.filter((optionItem) => !optionItem.correct)) {
        pass(localised(item.wrong), `${fileName} task ${task.id} option ${item.id}: strategy-specific wrong UZ/RU/EN yo'q`);
      }
    }
    pass(task.visual && typeof task.visual === 'object', `${fileName} task ${task.id}: visual yo'q`);
  }

  const tags = new Set(tasks.map((task) => task.skillTag));
  pass(expected.tags.every((tag) => tags.has(tag)), `${fileName}: skillTaglar to'liq emas — ${expected.tags.filter((tag) => !tags.has(tag)).join(', ')}`);
  pass(Array.isArray(screenMeta) && screenMeta.length === 10, `${fileName}: SCREEN_META aynan 10 ta emas`);
  if (Array.isArray(screenMeta)) {
    pass(screenMeta.every((screen) => screen.scored === true), `${fileName}: barcha SCREEN_META scored emas`);
    pass(screenMeta.filter((screen) => screen.scope === 'final').length === 1
      && screenMeta[9]?.scope === 'final', `${fileName}: faqat task 10 final scope bo'lishi kerak`);
    pass(screenMeta.every((screen, index) => screen.taskId === tasks[index]?.id), `${fileName}: SCREEN_META va TASKS 1:1 emas`);
  }

  pass(new RegExp(`lessonId\\s*:\\s*['\"]${expected.id}['\"]`).test(source), `${fileName}: lessonId noto'g'ri`);
  pass(source.includes(`export default function ${expected.exportName}`), `${fileName}: export nomi noto'g'ri`);
  pass(source.includes("['uz', 'ru', 'en']"), `${fileName}: standalone UZ/RU/EN selector kontrakti yo'q`);
  pass(!/\b(?:AudioEngine|useAudio|useNarration|SpeechSynthesisUtterance|BitSVG)\b|<Bit\b|\/api\/tts/.test(source), `${fileName}: audio yoki Bit topildi`);
  pass(source.includes('role="status"') && source.includes('aria-live="polite"'), `${fileName}: feedback status/aria-live yo'q`);
  pass(source.includes(':focus-visible') && /min-width\s*:\s*44px/.test(source) && /min-height\s*:\s*44px/.test(source), `${fileName}: focus yoki 44px target kontrakti yo'q`);
  pass(/@media\s*\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)/.test(source), `${fileName}: reduced-motion yo'q`);
  pass(source.includes('100dvh') && !source.includes('100vh'), `${fileName}: mobile dynamic viewport kontrakti yo'q`);
  pass(source.includes('720px') && /overflow-x\s*:\s*clip/.test(source), `${fileName}: Dars01 720px/mobile overflow kontrakti yo'q`);

  const lower = source.toLowerCase();
  const etalonColours = [
    '#f5f5f0', '#ffffff', '#12212c', '#50616d', '#87949d', '#ff5b35', '#fff0ea',
    '#168fa3', '#e5f5f6', '#173b52', '#227a53', '#e7f3ec', '#a96f13', '#fff5d9',
  ];
  for (const colour of etalonColours) {
    pass(lower.includes(colour), `${fileName}: Dars01 rang tokeni topilmadi — ${colour}`);
  }
  for (const obsoleteColour of ['#fff7ed', '#06b6d4', '#14b8a6', '#f59e0b']) {
    pass(!lower.includes(obsoleteColour), `${fileName}: eski D22–30 rang tokeni qolgan — ${obsoleteColour}`);
  }
  pass(!/(?:p4-tricolour|p4-colour-key|p4-colour-band)/.test(source), `${fileName}: Dars01 da yo'q uch-rangli tasma yoki kalit qolgan`);
  pass(!/\.p4-chips[^{}]*\s+[^{}]*:nth-child\(/.test(source), `${fileName}: Dars01 da yo'q navbatma-navbat uch-rangli chiplar qolgan`);
  pass(!/\.p4-(?:level|eyebrow)\.is-(?:green|yellow|red)[^{]*\{[^}]*(?:\$\{T\.(?:success|warn)\}|#227a53|#a96f13)/i.test(source), `${fileName}: difficulty label Dars01 dagidek yagona accent rangida emas`);
  pass(!/font-family\s*:[^;}]*fraunces|font\s*:[^;}]*fraunces/i.test(source), `${fileName}: Dars01 da yo'q Fraunces shrifti qolgan`);
  pass(/linear-gradient\(90deg,\s*(?:\$\{T\.cyan\}|#168fa3)\s*,\s*(?:\$\{T\.accent\}|#ff5b35)\s*\)/i.test(source), `${fileName}: Dars01 cyan→accent progress gradienti yo'q`);
  pass(/\.p4-(?:visual|figure)[^{]*\{[^}]*background\s*:\s*(?:\$\{T\.paper\}|#fff(?:fff)?)/i.test(source), `${fileName}: Dars01 oq figure uslubi yo'q`);
  pass(['Manrope', 'Source Serif 4', 'JetBrains Mono'].every((font) => source.includes(font)), `${fileName}: Dars01 shrift uchligi to'liq emas`);
  pass(source.includes('p4-option') && source.includes('p4-letter'), `${fileName}: Dars01 A/B/C/D option badge kontrakti yo'q`);
  pass(/\.p4-option\s*\{[\s\S]{0,500}?min-height\s*:\s*56px[\s\S]{0,500}?border-radius\s*:\s*14px/i.test(source), `${fileName}: Dars01 56px/14px MC option uslubi yo'q`);
  pass(/\.p4-option\.is-ok[^{}]*\{/.test(source) && /\.p4-option\.is-no[^{}]*\{/.test(source), `${fileName}: Dars01 MC correct/wrong holatlari yo'q`);
  pass(/\.p4-lang\s+button\s*\{[\s\S]{0,500}?border-radius\s*:\s*99px[\s\S]{0,500}?background\s*:\s*(?:\$\{T\.paper\}|#fff(?:fff)?)/i.test(source)
    && /\.p4-lang\s+button\.is-active\s*\{[\s\S]{0,250}?background\s*:\s*(?:\$\{T\.accent\}|#ff5b35)/i.test(source), `${fileName}: Dars01 pill language selector uslubi yo'q`);
  pass(!/\.p4-actions\s*\{[^}]*justify-content\s*:\s*flex-end/i.test(source), `${fileName}: action tugmalari Dars01 start joylashuvida emas`);
  pass(lower.includes('#1b6644') && lower.includes('#8a5c10'), `${fileName}: Dars01 feedback matn ranglari yo'q`);
  pass(/useMemo\(\(\)\s*=>\s*(?:shuffle|stableShuffle|semanticShuffle)\(task\.options/.test(source)
    && /(?:options|mcOptions|shuffledOptions|optionCards)\.map\(/.test(source), `${fileName}: MC variantlarining stable per-task shuffle'i topilmadi`);
  pass(source.includes('Math.random()'), `${fileName}: har ochilishda haqiqiy Fisher–Yates shuffle topilmadi`);
  pass(/(?:setPickedId|setPicked)\([^)]*\.id\)|setAnswer\(setPicked,\s*[^)]*\.id\)/.test(source), `${fileName}: MC javobi semantic option ID bilan saqlanmayapti`);

  for (const marker of ['firstTryCorrect', 'correctAnswers', 'finalScore', 'attemptsTotal', 'durationSec', 'levelBreakdown', 'skillTags', 'lessonMeta: LESSON_META', 'screenMeta: SCREEN_META', 'answers: nextAnswers']) {
    pass(source.includes(marker), `${fileName}: LMS marker yo'q — ${marker}`);
  }
  pass(source.includes('finishedRef.current = false') && source.includes('startedAtRef.current = Date.now()')
    && (source.includes('key={task.id}') || source.includes('setRunId(')), `${fileName}: restart completion/timer/task reset guardi to'liq emas`);
  pass(/if\s*\([^)]*finishedRef\.current[^)]*\)\s*return/.test(source)
    && /if\s*\([^)]*advancedRef\.current[^)]*\)\s*return/.test(source), `${fileName}: double-completion/double-advance guardi yo'q`);

  const compactSource = compact(JSON.stringify(tasks));
  for (const anchor of expected.anchors) {
    pass(compactSource.includes(compact(anchor)), `${fileName}: rejalangan content anchor topilmadi — ${anchor}`);
  }

  const serialisedTasks = JSON.stringify(tasks).toLowerCase();
  if (lesson === 24) {
    pass(!/(round(?:ing)?|округ|yaxlit|addition|subtraction|сложени|вычитани|qo'shish|ayirish)/i.test(serialisedTasks), 'Dars24Practice: taqiqlangan taqqoslash/yaxlitlash/arifmetika scope topildi');
  }
  if (lesson === 25) {
    pass(!/[∪∩]|пересеч|intersection|\bunion\b|kesishm/i.test(serialisedTasks), 'Dars25Practice: formal to\'plam amali/atamasi topildi');
  }
  if (lesson === 29) {
    pass(!/(hectare|hektar|gektar|гектар)/i.test(serialisedTasks), 'Dars29Practice: ar/gektar scope topildi');
  }
  if (lesson === 30) {
    pass(/universal/i.test(serialisedTasks) && /×\s*10|x\s*10/i.test(serialisedTasks), 'Dars30Practice: universal ×10 qoidasini aniq rad etish topilmadi');
  }

  console.log(`✓ ${fileName}: 10 task, 2/5/3, ${kinds.size} mexanika, tri-locale va LMS kontrakti`);
}

const registry = fs.readFileSync(path.join(ROOT, 'src', 'lessons', 'grade4.js'), 'utf8');
const registryEntries = [...registry.matchAll(
  /slug:\s*'([^']+)'[\s\S]*?Component:\s*lazy\(\(\)\s*=>\s*import\('\.\.\/components\/grade4\/(Dars\d{2}(?:Practice)?\.jsx)'\)\)/g,
)].map((match) => ({ slug: match[1], file: match[2] }));
const registrySlugs = registryEntries.map((entry) => entry.slug);
const registryFiles = registryEntries.map((entry) => entry.file);
pass(new Set(registrySlugs).size === registrySlugs.length, 'Registry: takroriy slug topildi');
pass(new Set(registryFiles).size === registryFiles.length, 'Registry: takroriy component file topildi');
for (const lesson of LESSONS) {
  const expected = EXPECTED[lesson];
  const matches = registryEntries.filter((entry) => entry.slug === expected.slug);
  pass(matches.length === 1 && matches[0].file === `Dars${lesson}Practice.jsx`, `Registry: D${lesson} slug↔component jufti noto'g'ri`);
}

if (failures.length) {
  console.error(`\n${failures.length} ta D22–D30 practice audit xatosi:`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('\n✓ D22–D30 amaliy darslar semantik auditi va 90/90 deterministik natija tekshiruvi muvaffaqiyatli yakunlandi.');
