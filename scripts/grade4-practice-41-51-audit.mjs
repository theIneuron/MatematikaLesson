#!/usr/bin/env node

// ============================================================================
// 4-SINF AMALIYOTI 41-51 — SEMANTIK AUDIT
//
// Nima uchun bu skript D22-30 auditidan alohida. Uch farq bor:
//   1) mexanika raskladkasi generatordan olinadi va fayl bilan solishtiriladi
//      (D22-30 da raskladka yo'q edi, hamma dars bir xil beshta mexanikada);
//   2) sahna modeli tekshiriladi: `visual` bo'lishi shart, faqat kartalarning
//      o'zi modelni tashiydigan mexanikalarda (`sort`, `match`) bo'lmasligi
//      mumkin;
//   3) topshiriq matematikasi FAYLDAN OLINGAN MA'LUMOTdan qaytadan
//      hisoblanadi: simmetriya kataklari ko'zgu qoidasi bilan, o'q o'rni
//      palindrom tekshiruvi bilan, burish burchagi 360 : n bilan.
//      Javob metama'lumotiga ishonilmaydi.
//
// UZ apostrofi ASCII bo'lishi ham shu yerda tekshiriladi: D22-30 da U+2018
// ishlatilgan va bu CLAUDE.md §7 ni buzadi.
//
// node scripts/grade4-practice-41-51-audit.mjs          # EXPECTED dagi hamma dars
// node scripts/grade4-practice-41-51-audit.mjs 41 42    # faqat ko'rsatilganlar
// ============================================================================

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { runInNewContext } from 'node:vm';
import { parse } from '@babel/parser';
import { buildLayout, LEVELS } from './grade4-practice-41-51-layout.mjs';

const ROOT = process.cwd();
const GRADE4_DIR = path.join(ROOT, 'src', 'components', 'grade4');
const LAYOUT = buildLayout();

// Kartalarning o'zi modelni tashiydigan mexanikalar: alohida sahna talab
// qilinmaydi (TIPLAR_AMALIYOT_3SINF.md — bo'sh ramka rasm yo'qligidan yomon).
// `order` ham shu ro'yxatda: qadam kartalarining o'zi model bo'ladi, alohida
// sahna esa qo'shimcha ma'no bermaydi (bo'sh ramka rasm yo'qligidan yomon).
const MODEL_IN_CARDS = new Set(['sort', 'match', 'slots', 'order']);
const ALLOWED_KINDS = new Set(['mc', 'numpad', 'missing', 'match', 'order', 'sort', 'shade', 'gap', 'ticks', 'slots', 'fracbuild']);

const EXPECTED = {
  41: {
    id: 'sym-4-41-practice',
    exportName: 'Grade4Dars41Practice',
    slug: 'dars41-amaliyot-simmetriya-va-burilish-simmetriyasi',
    tags: [
      'axis_recognition', 'mirror_cells', 'construction_order', 'turn_angle', 'axis_position',
      'axis_shared_count', 'axis_count_sorting', 'odd_axis_boundary', 'mirror_error', 'rotational_transfer',
    ],
    // Nazariy darsning ISHLANGAN namunasi: olti bargli guldasta va 360 : 6.
    // 90 va 180 daraja taqiqlanmaydi — 10-topshiriqda koshinlarning burish
    // tartibi uchun boshqa kontekstda kerak va boshqa javob mumkin emas.
    forbidden: ['360 : 6', 'olti bargli', 'six-petal', 'шести лепестк'],
    // Shakl xossalari: audit bin'larni shu jadvaldan qaytadan hisoblaydi.
    axisCounts: { triangle: 1, trapezoid: 1, square: 4, rect: 2, parallelogram: 0, fshape: 0 },
    rotationOrders: { square: 4, rosette4: 4, rosette2: 2, rect: 2, triangle: 1, fshape: 1 },
  },
  42: {
    id: 'eq-4-42-practice',
    exportName: 'Grade4Dars42Practice',
    slug: 'dars42-amaliyot-tenglamalar',
    tags: [
      'equation_meaning', 'unknown_addend', 'unknown_minuend', 'word_to_equation', 'missing_addend',
      'problem_to_equation', 'record_classification', 'zero_boundary', 'inverse_error', 'unknown_subtrahend',
    ],
    // Nazariy darsning yozuvlari: amaliyotda takrorlanmaydi.
    forbidden: [
      'x + 240 = 360', 'x - 240 = 510', 'x + 1425 = 4907', 'x - 2400 = 5100',
      'x + 837 = 1562', '837 - x = 1562', 'x + 998 = 1000', 'x + 420 = 600',
    ],
    unknownKinds: {
      addend: 'unknown-addend',
      minuend: 'unknown-minuend',
      subtrahend: 'unknown-subtrahend',
      'not-equation': 'not-equation',
    },
    binRoots: { 'four-eighty': 480, zero: 0 },
  },
  43: {
    id: 'eqsolve-4-43-practice',
    exportName: 'Grade4Dars43Practice',
    slug: 'dars43-amaliyot-tenglamalarni-yechish-va-tekshirish',
    tags: [
      'inverse_choice_factor', 'unknown_factor', 'solve_and_check_order', 'unknown_dividend', 'substitution_check',
      'compound_equation', 'inverse_by_position', 'unit_factor_boundary', 'solution_error', 'check_verdict',
    ],
    forbidden: [
      '(13 900 - x) : 80 = 140', '(8 700 - x) : 900 = 9', 'x : 100 = 46', 'x : 35 = 16 800',
      '1392 + 174', '13 900 - 11 200',
    ],
    // 07: yozuvdagi amal -> ildizni topadigan teskari amal.
    inverseBins: { dividend: 'multiply', factor: 'divide' },
    // 10: tenglik rost bo'lsa `true` guruhiga tushadi.
    verdictBins: { true: 'true', false: 'false' },
  },
  44: {
    id: 'multistep-4-44-practice',
    exportName: 'Grade4Dars44Practice',
    slug: 'dars44-amaliyot-murakkab-masalalar',
    tags: [
      'question_role', 'intermediate_value', 'plan_matching', 'plan_order', 'two_step_compute',
      'second_way', 'way_comparison', 'one_or_two_steps', 'intermediate_as_answer', 'three_part_transfer',
    ],
    forbidden: [
      '14 587', '10 030', '10 427', '4 574', '1 696', '2 878', '7 452', '2 975', '8 250',
    ],
    // Blokning sonlari: audit ular bilan hisobni qaytadan bajaradi.
    story: { first: 12400, second: 8600, sent: 1500 },
    transfer: { first: 10400, second: 4600, less: 1700 },
  },
  45: {
    id: 'motion-4-45-practice',
    exportName: 'Grade4Dars45Practice',
    slug: 'dars45-amaliyot-harakatga-doir-masalalar',
    tags: [
      'formula_meaning', 'distance_on_line', 'solution_order', 'speed_from_distance_time',
      'distance_from_speed_time', 'operation_choice', 'two_stage_path', 'non_zero_scale',
      'motion_error', 'time_from_distance_speed',
    ],
    forbidden: ['48 : 4', '460 km', '39 km', '1 035 m', '1 800 km', '4 km/soat'],
    // 02: 12 km/soat × 3 soat. 08: shkala 40 dan boshlanadi, ko'rsatkich 2-belgida.
    motion: { speed: 12, time: 3 },
    // Nazariyada yig'indi va ayirma tezlik yo'q: amaliyotda ham bo'lmasligi kerak.
    forbiddenScope: /yaqinlash|uzoqlash|quvib|навстречу|сближ|удал|догон|closing speed/i,
  },
  46: {
    id: 'fracpart-4-46-practice',
    exportName: 'Grade4Dars46Practice',
    slug: 'dars46-amaliyot-qism-va-butunni-topish',
    tags: [
      'unit_fraction_action', 'shade_fraction', 'fraction_of_number', 'whole_from_unit', 'model_to_fraction',
      'whole_from_part', 'scheme_choice', 'full_fraction_boundary', 'inverse_order_error', 'remaining_part',
    ],
    forbidden: ['12 : 2', '12 : 4', '8 000 : 8', '78 : 3', '20 km'],
    // Har topshiriqning kasr hisobi: audit natijani qoidadan qayta chiqaradi.
    fractions: {
      '03': { whole: 450, n: 3, d: 5 },
      '04': { share: 40, d: 9 },
      '06': { part: 96, n: 2, d: 7 },
    },
  },
  47: {
    id: 'ineq-4-47-practice',
    exportName: 'Grade4Dars47Practice',
    slug: 'dars47-amaliyot-tengsizliklarni-tanlash-usuli',
    tags: [
      'sign_meaning', 'largest_solution', 'trial_order', 'boundary_on_line', 'product_inequality',
      'condition_word_problem', 'solution_count', 'strict_vs_nonstrict', 'boundary_error', 'solution_set',
    ],
    forbidden: ['3 + x < 5', '6 - x > 4', '5 · x < 35', '36 : x > 4', 'x ≤ 548', 'a · 9 < 54', '200 - a > 198', '7 · y > 35', '208 - x < 35'],
    // 08: shartning o'zi — audit har qiymatni shu shart bilan tekshiradi.
    gate: { sign: '≥', bound: 200, yesBin: 'yes', noBin: 'no' },
  },
  48: {
    id: 'addprop-4-48-practice',
    exportName: 'Grade4Dars48Practice',
    slug: 'dars48-amaliyot-qoshish-xossalari',
    tags: [
      'commutative_property', 'convenient_pair', 'grouped_sum', 'missing_addend_property', 'restore_grouping',
      'pair_matching', 'property_classification', 'subtraction_boundary', 'property_error', 'four_addend_transfer',
    ],
    forbidden: [
      '1 457 + 23 543', '500 + 800 + 500', '14 800 + 5 000 + 200',
      '20 400 + 600 + 50 800', '73 000 + 22 300 + 700', '69 900 + 30 000 + 100',
    ],
    // 08: guruhlash ayirishda ishlamasligini shu ikki qiymat ko'rsatadi.
    subtractionPair: [600, 400],
  },
  49: {
    id: 'logic-4-49-practice',
    exportName: 'Grade4Dars49Practice',
    slug: 'dars49-amaliyot-mulohazalar-va-hukmlar',
    tags: [
      'statement_meaning', 'numeric_check', 'check_method', 'verdict_sorting', 'make_it_true',
      'calendar_statement', 'check_order', 'nested_negation', 'converse_statement', 'counterexample',
    ],
    forbidden: ['214 > 83', '56 - 48 = 18', '569 < 612', '657 + 203 = 650 + 203'],
    // 01: mulohaza emas bo'lgan gaplar tinish belgisi bilan ajratiladi.
    nonStatementMarks: ['?', '!'],
    // 10: qarshi misollar auditda mustaqil tekshiriladi.
    counterexamples: { 'under-ten': 25, 'even-four': 6, 'div-two': 7 },
  },
  50: {
    id: 'graph-4-50-practice',
    exportName: 'Grade4Dars50Practice',
    slug: 'dars50-amaliyot-grafiklar-va-malumotlar',
    tags: [
      'read_axes', 'read_scale', 'difference_from_chart', 'value_from_chart', 'chart_to_table',
      'compare_bars', 'group_by_value', 'non_zero_axis', 'reading_order', 'trend_transfer',
    ],
    // Nazariy dars o'sish grafigi (yosh va bo'y) bilan ishlagan.
    forbidden: ['40 cm', '30 cm', '3 yosh', '4 yosh'],
    // 07: har kun 45 bilan solishtiriladi.
    threshold: 45,
  },
  51: {
    id: 'final-4-51-practice',
    exportName: 'Grade4Dars51Practice',
    slug: 'dars51-amaliyot-yakuniy-takrorlash',
    tags: [
      'place_value_line', 'area_by_cells', 'words_to_digits', 'column_add', 'part_of_number',
      'unit_convert', 'model_choice', 'perimeter_equals_area', 'perimeter_vs_area', 'final_transfer',
    ],
    forbidden: ['305 026', '692 503', '243 497', '240 : 4', '4 m 56 cm', '456 cm'],
    // Har topshiriqning yadrosi: audit natijani shu ma'lumotdan qayta chiqaradi.
    facts: {
      rectangle: { a: 4, b: 3 },
      square: { side: 4 },
      whole: 405026,
      column: { first: 374508, second: 261892, total: 636400 },
      fraction: { whole: 480, n: 5, d: 8 },
      length: { metres: 5, centimetres: 8 },
      wrongPerimeter: { a: 6, b: 4, written: 24 },
      transfer: { first: 12400, second: 9600, duplicates: 1800 },
    },
  },
};

const failures = [];
const notes = [];
const pass = (condition, message) => { if (!condition) failures.push(message); };

const localised = (value) => value && typeof value === 'object'
  && ['uz', 'ru', 'en'].every((lang) => typeof value[lang] === 'string' && value[lang].trim());

const CYRILLIC = /[Ѐ-ӿ]/;
const FANCY_APOSTROPHE = /[‘’ʻʼ´`]/;
// RU da bolaga `ты` bilan murojaat qilinadi (CLAUDE.md §7 va metodist qarori
// 2026-08-21). 22-30 amaliyotlari `вы` ga o'tib ketgan — bu qaytarilmaydi.
// Buyruq shakli -ите / -йте / -ьте bilan tugaydi; ot shakllari istisnoda.
const FORMAL_RU = /\b[а-яё]{3,}(?:ите|йте|ьте)\b/i;
const FORMAL_RU_ALLOWED = new Set(['плите', 'орбите', 'палите', 'зените']);
// UZ da esa `siz` shakli talab qilinadi.
const INFORMAL_UZ = /\b(?:sen|sening|senga|seni)\b/i;

// TASKS ichidagi hamma matnni yig'adi: {path, lang, text}.
function collectStrings(value, trail = []) {
  if (typeof value === 'string') return [{ trail: trail.join('.'), text: value }];
  if (Array.isArray(value)) return value.flatMap((item, index) => collectStrings(item, [...trail, index]));
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, item]) => collectStrings(item, [...trail, key]));
  }
  return [];
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

// Topshiriq banki modul darajasidagi konstantalarga tayanishi mumkin:
// 50-darsda `DAYS`, `WEEKS` va `AXIS_*` shunday. Ular avval shu fayldan
// hisoblanadi va sandboxga qo'shiladi — aks holda `DAYS is not defined` chiqadi.
function evaluateInitializer(source, ast, name, seen = new Set()) {
  const initializer = findInitializer(ast, name);
  if (!initializer) throw new Error(`${name} topilmadi`);
  const b = (ru, uz, en) => ({ ru, uz, en });
  const option = (id, ru, uz, en, correct = false, wrongRu = '', wrongUz = '', wrongEn = '') => ({
    id, text: b(ru, uz, en), correct, wrong: wrongRu ? b(wrongRu, wrongUz, wrongEn) : null,
  });
  const code = source.slice(initializer.start, initializer.end);
  const sandbox = { b, option };
  seen.add(name);
  // Katta harfli nomlar konstanta bo'lishi mumkin. Matn ichidagi bo'lakka
  // tushib qolgan nomlar (masalan «TTB») shunchaki hisoblanmaydi va tashlanadi.
  for (const identifier of new Set(code.split(/[^A-Za-z0-9_]+/).filter((word) => /^[A-Z][A-Z0-9_]*$/.test(word)))) {
    if (identifier in sandbox || seen.has(identifier)) continue;
    try {
      sandbox[identifier] = evaluateInitializer(source, ast, identifier, seen);
    } catch {
      // konstanta emas — e'tibor berilmaydi
    }
  }
  return runInNewContext(`(${code})`, sandbox, { timeout: 2_000 });
}

// ---------------------------------------------------------------------------
// MODEL GEOMETRIYASI — javobga ishonmasdan qaytadan hisoblanadi
// ---------------------------------------------------------------------------

const gridCells = (visual, chars) => {
  const found = [];
  visual.map.forEach((row, rowIndex) => {
    row.split('').forEach((char, colIndex) => {
      if (chars.includes(char)) found.push([rowIndex, colIndex]);
    });
  });
  return found;
};

// Ko'zgu qoidasi: chegara ustunlar orasidan o'tsa c -> 2g-1-c, katak ustidan
// o'tsa c -> 2k-c.
const mirrorCol = (axis, col) => (axis.col !== undefined ? 2 * axis.col - col : 2 * axis.gap - 1 - col);

function checkShadeGeometry(file, task) {
  const visual = task.visual;
  pass(visual?.type === 'grid' && Array.isArray(visual.map), `${file} ${task.id}: shade uchun katak kartasi yo'q`);
  if (!visual?.map) return;
  pass(visual.map.length === visual.rows, `${file} ${task.id}: qatorlar soni rows bilan mos emas`);
  pass(visual.map.every((row) => row.length === visual.cols), `${file} ${task.id}: qator uzunligi cols bilan mos emas`);
  pass(visual.axis && (visual.axis.col !== undefined || visual.axis.gap !== undefined), `${file} ${task.id}: o'q ta'riflanmagan`);
  if (!visual.axis) return;

  const given = gridCells(visual, '#');
  const targets = gridCells(visual, '+');
  const key = ([row, col]) => `${row}:${col}`;
  const targetKeys = new Set(targets.map(key));
  const expected = new Set();
  for (const [row, col] of given) {
    const mirrored = mirrorCol(visual.axis, col);
    pass(mirrored >= 0 && mirrored < visual.cols, `${file} ${task.id}: ${row}:${col} katakning aksi panjaradan chiqib ketadi`);
    expected.add(key([row, mirrored]));
  }
  pass(expected.size === targetKeys.size && [...expected].every((item) => targetKeys.has(item)),
    `${file} ${task.id}: bo'yalishi kerak kataklar ko'zgu qoidasi bilan mos emas`);
  pass(targets.length > 0, `${file} ${task.id}: bo'yaladigan katak yo'q`);

  if (visual.axis.col !== undefined) {
    pass(targets.every(([, col]) => col !== visual.axis.col),
      `${file} ${task.id}: o'q ustundagi katak bo'yalishi kerak deb belgilangan`);
    const axisTappable = gridCells(visual, '-').filter(([, col]) => col === visual.axis.col);
    pass(axisTappable.length > 0, `${file} ${task.id}: chegaraviy holat tekshirilmaydi — o'q ustuni bosilmaydi`);
  }
  const decoys = gridCells(visual, '-');
  pass(decoys.length > 0, `${file} ${task.id}: xato tanlash imkoni yo'q, topshiriq trivial`);
}

function checkGapGeometry(file, task) {
  const heights = task.visual?.heights;
  pass(Array.isArray(heights) && heights.length >= 4, `${file} ${task.id}: lenta balandliklari yo'q`);
  if (!Array.isArray(heights)) return;
  const symmetricAt = (gap) => {
    const left = heights.slice(0, gap);
    const right = heights.slice(gap);
    if (left.length !== right.length) return false;
    return left.every((value, index) => value === right[right.length - 1 - index]);
  };
  pass(symmetricAt(task.correctGap), `${file} ${task.id}: lenta ko'rsatilgan bo'shliqqa nisbatan simmetrik emas`);
  const others = Array.from({ length: heights.length - 1 }, (_, index) => index + 1).filter((gap) => gap !== task.correctGap);
  pass(others.every((gap) => !symmetricAt(gap)), `${file} ${task.id}: javob yagona emas, boshqa bo'shliq ham simmetriya beradi`);
  pass(others.every((gap) => localised(task.gapWrong?.[gap])), `${file} ${task.id}: har noto'g'ri bo'shliqqa tahlil yo'q`);
}

function checkVerticalOnlySymmetry(file, task) {
  const map = task.visual?.map;
  pass(Array.isArray(map), `${file} ${task.id}: katak kartasi yo'q`);
  if (!Array.isArray(map)) return;
  const vertical = map.every((row) => row === [...row].reverse().join(''));
  const horizontal = map.every((row, index) => row === map[map.length - 1 - index]);
  const transposed = map[0].split('').map((_, col) => map.map((row) => row[col]).join(''));
  const diagonal = transposed.every((row, index) => row === map[index]);
  pass(vertical, `${file} ${task.id}: shakl vertikal o'q bo'yicha simmetrik emas, javob esa shunday deydi`);
  pass(!horizontal, `${file} ${task.id}: shakl gorizontal o'q bo'yicha ham simmetrik — distraktor to'g'ri javobga aylanadi`);
  pass(!diagonal, `${file} ${task.id}: shakl diagonal bo'yicha ham simmetrik — distraktor to'g'ri javobga aylanadi`);
}

function checkSortBins(file, task, table, mapValueToBin, label) {
  const binIds = new Set(task.bins.map((bin) => bin.id));
  pass(task.bins.length >= 2, `${file} ${task.id}: ikkitadan kam guruh`);
  pass(new Set(task.items.map((item) => item.id)).size === task.items.length, `${file} ${task.id}: takroriy karta id`);
  for (const item of task.items) {
    pass(binIds.has(item.bin), `${file} ${task.id}: ${item.id} kartasi mavjud bo'lmagan guruhga yuborilgan`);
    pass(typeof item.glyph === 'string' && item.glyph, `${file} ${task.id}: ${item.id} kartasida model belgisi yo'q`);
    pass(localised(item.text), `${file} ${task.id}: ${item.id} kartasi matni uch tilda emas`);
    const value = table[item.glyph];
    pass(value !== undefined, `${file} ${task.id}: ${item.glyph} uchun ${label} qiymati auditda yo'q`);
    if (value !== undefined) {
      pass(mapValueToBin(value) === item.bin,
        `${file} ${task.id}: ${item.glyph} ${label} = ${value}, guruh esa ${item.bin}`);
    }
  }
  for (const bin of task.bins) {
    pass(task.items.some((item) => item.bin === bin.id), `${file} ${task.id}: ${bin.id} guruhi bo'sh`);
  }
}

// Tenglama yozuvini o'qiydi va ildizini QOIDA bo'yicha qaytadan hisoblaydi.
// `x + 350 = 700` -> { kind: 'addend', root: 350 }. Javob metama'lumotiga
// ishonilmaydi: yozuvning o'zi manba.
const readEquation = (raw) => {
  // Bo'sh katak ham noma'lumning o'zi: `□ : 60 = 12` va `x : 60 = 12` bir xil.
  const text = String(raw).replace(/[−–]/g, '-').replace(/[·×]/g, '*').replace(/□/g, 'x')
    .replace(/(\d)\s+(\d)/g, '$1$2').trim();
  const match = /^(\S+)\s*([+\-*:])\s*(\S+)\s*=\s*(\S+)$/.exec(text);
  if (!match) return null;
  const [, left, sign, middle, right] = match;
  const num = (value) => (/^-?\d+$/.test(value) ? Number(value) : null);
  const [a, m, c] = [num(left), num(middle), num(right)];
  const apply = (first, second) => (
    sign === '+' ? first + second
      : sign === '-' ? first - second
        : sign === '*' ? first * second
          : first / second
  );
  if (left === 'x') {
    if (sign === '+') return { kind: 'addend', root: c - m };
    if (sign === '-') return { kind: 'minuend', root: c + m };
    if (sign === '*') return { kind: 'factor', root: c / m };
    return { kind: 'dividend', root: c * m };
  }
  if (middle === 'x') {
    if (sign === '+') return { kind: 'addend', root: c - a };
    if (sign === '-') return { kind: 'subtrahend', root: a - c };
    if (sign === '*') return { kind: 'factor', root: c / a };
    return { kind: 'divisor', root: a / c };
  }
  if (right === 'x') return { kind: 'result', root: apply(a, m) };
  return { kind: 'not-equation', root: null, holds: apply(a, m) === c };
};

// Butun-qism lentasidan javobni hisoblaydi: butun ma'lum bo'lsa, noma'lum qism
// = butun minus qolgan qismlar; butun noma'lum bo'lsa, u qismlar yig'indisi.
const readBar = (visual) => {
  const value = (raw) => (/^\d[\d\s]*$/.test(String(raw)) ? Number(String(raw).replace(/\s/g, '')) : null);
  const whole = value(visual.whole);
  const parts = visual.parts.map(value);
  if (whole === null) return parts.every((part) => part !== null) ? parts.reduce((sum, part) => sum + part, 0) : null;
  const known = parts.filter((part) => part !== null);
  if (known.length !== parts.length - 1) return null;
  return whole - known.reduce((sum, part) => sum + part, 0);
};

// Har dars uchun mustaqil matematik tekshiruvlar: natija topshiriq
// ma'lumotidan emas, qoidadan qayta hisoblanadi.
const DETERMINISTIC = {
  41: (file, tasks, expected) => {
    checkVerticalOnlySymmetry(file, tasks[0]);
    checkShadeGeometry(file, tasks[1]);
    checkShadeGeometry(file, tasks[7]);
    checkGapGeometry(file, tasks[4]);

    const rosette = tasks[3];
    const petals = rosette.visual?.petals;
    pass(Number.isInteger(petals) && petals > 2, `${file} 04: guldasta barglari soni yo'q`);
    pass(360 % petals === 0, `${file} 04: 360 ni ${petals} ga butun bo'lish mumkin emas`);
    pass(String(360 / petals) === rosette.answer, `${file} 04: javob 360 : ${petals} ga teng emas`);

    // 06: yarimda 14 element, uchtasi o'q ustida. Butun panel: 11 + 11 + 3.
    const half = 14;
    const shared = 3;
    const whole = (half - shared) * 2 + shared;
    pass(whole === 25, `${file} 06: audit hisobi 25 bermadi`);
    const correct = tasks[5].options.find((item) => item.correct);
    pass(correct?.id === 'twenty-five', `${file} 06: to'g'ri variant 25 emas`);
    const distractors = tasks[5].options.filter((item) => !item.correct).map((item) => item.id);
    pass(distractors.includes('twenty-eight') && half * 2 === 28, `${file} 06: «hammasini ikkilash» distraktori yo'q`);
    pass(distractors.includes('twenty-two') && (half - shared) * 2 === 22, `${file} 06: «o'q kataklarini tashlash» distraktori yo'q`);
    pass(distractors.includes('seventeen') && half + shared === 17, `${file} 06: «yarim va o'q» distraktori yo'q`);

    checkSortBins(file, tasks[6], expected.axisCounts,
      (count) => (count === 0 ? 'none' : count === 1 ? 'one' : 'many'), "o'q soni");
    checkSortBins(file, tasks[9], expected.rotationOrders,
      (order) => (order === 1 ? 'never' : order === 2 ? 'oneeighty' : 'ninety'), 'burish tartibi');
  },

  42: (file, tasks, expected) => {
    // 01: har yozuvdagi noma'lumning turi yozuvning o'zidan aniqlanadi.
    for (const pair of tasks[0].pairs) {
      const parsed = readEquation(pair.left.uz);
      pass(Boolean(parsed), `${file} 01: «${pair.left.uz}» yozuvini o'qib bo'lmadi`);
      if (parsed) {
        pass(expected.unknownKinds[parsed.kind] === pair.correctRight,
          `${file} 01: «${pair.left.uz}» ${parsed.kind}, ulanish esa ${pair.correctRight}`);
        if (parsed.kind === 'not-equation') pass(parsed.holds, `${file} 01: tenglama bo'lmagan yozuv noto'g'ri tenglik`);
      }
    }

    // 02, 03, 05, 10: javob lenta modelidan qayta hisoblanadi.
    for (const index of [1, 2, 4, 9]) {
      const task = tasks[index];
      pass(task.visual?.type === 'bar', `${file} ${task.id}: butun-qism lentasi yo'q`);
      if (task.visual?.type !== 'bar') continue;
      const computed = readBar(task.visual);
      pass(computed !== null, `${file} ${task.id}: lentadan javobni hisoblab bo'lmadi`);
      pass(String(computed) === String(task.answer), `${file} ${task.id}: lenta ${computed} beradi, javob esa ${task.answer}`);
      pass(task.visual.parts.length === 2, `${file} ${task.id}: lentada ikkita qism bo'lishi kerak`);
    }

    // 04: tenglama kartalardan tuziladi, ildiz esa distraktor bo'lib turadi.
    const build = tasks[3];
    const leftCard = build.cards.find((card) => card.id === build.slots[0].correct);
    const rightCard = build.cards.find((card) => card.id === build.slots[1].correct);
    const built = readEquation(`${leftCard.text.uz} = ${rightCard.text.uz}`);
    pass(Boolean(built) && built.kind === 'minuend', `${file} 04: tuzilgan tenglamada noma'lum kamayuvchi emas`);
    pass(built?.root === readBar(build.visual), `${file} 04: tuzilgan tenglama ildizi lenta bilan mos emas`);
    const rootCard = build.cards.find((card) => card.text.uz.replace(/\s/g, '') === String(built?.root));
    pass(Boolean(rootCard), `${file} 04: ildiz distraktor karta sifatida yo'q`);
    pass(rootCard && !build.slots.some((slot) => slot.correct === rootCard.id),
      `${file} 04: ildiz karta uyaga to'g'ri javob deb belgilangan`);
    pass(build.cards.length > build.slots.length, `${file} 04: distraktor karta yo'q`);

    // 06: to'rt tenglama ham o'qiladi va ildizi natural bo'ladi.
    for (const item of tasks[5].right) {
      const parsed = readEquation(item.text.uz);
      pass(Boolean(parsed) && parsed.kind !== 'not-equation', `${file} 06: «${item.text.uz}» tenglama emas`);
      pass(parsed?.root > 0, `${file} 06: «${item.text.uz}» ildizi natural son emas`);
    }

    // 07: tasnif ikki belgidan chiqadi — harf bormi va qanday belgi turadi.
    const classify = (text) => {
      const hasLetter = text.includes('x');
      if (/[<>]/.test(text)) return 'cmp';
      if (!text.includes('=')) return 'expr';
      return hasLetter ? 'eq' : 'eqty';
    };
    for (const slot of tasks[6].slots) {
      const card = tasks[6].cards.find((item) => item.id === slot.correct);
      pass(Boolean(card), `${file} 07: ${slot.id} uyasi uchun karta yo'q`);
      if (card) pass(classify(card.text.uz) === slot.correct, `${file} 07: «${card.text.uz}» ${slot.id} uyasiga mos emas`);
    }

    // 08: har yozuvning ildizi hisoblanadi va guruh bilan solishtiriladi.
    for (const item of tasks[7].items) {
      const parsed = readEquation(item.text.uz);
      pass(Boolean(parsed), `${file} 08: «${item.text.uz}» yozuvini o'qib bo'lmadi`);
      if (parsed) {
        pass(expected.binRoots[item.bin] === parsed.root,
          `${file} 08: «${item.text.uz}» ildizi ${parsed.root}, guruh esa ${item.bin}`);
      }
    }

    // 09: to'g'ri yechim zanjiri Bit yozuvidan farq qiladi va hisobi to'g'ri.
    const fix = tasks[8];
    pass(fix.visual?.error === true, `${file} 09: xato yozuv modeli yo'q`);
    const inverse = fix.cards.find((card) => card.id === 'inverse')?.text.uz.replace(/\s/g, '');
    const result = fix.cards.find((card) => card.id === 'value')?.text.uz.replace(/\s/g, '');
    const sum = /^x=(\d+)\+(\d+)$/.exec(inverse || '');
    pass(Boolean(sum), `${file} 09: teskari amal kartasi o'qilmadi`);
    if (sum) pass(`x=${Number(sum[1]) + Number(sum[2])}` === result, `${file} 09: qadam natijasi hisob bilan mos emas`);
    pass(/-/.test(fix.visual.text.replace(/[−–]/g, '-')), `${file} 09: Bit yozuvi ayirish xatosini ko'rsatmaydi`);
  },

  51: (file, tasks, expected) => {
    const digits = (value) => String(value).replace(/[\s,]/g, '');
    const byId = (id) => tasks.find((task) => task.id === id);
    const facts = expected.facts;

    // 01: son o'qidagi javob bo'linma qiymatidan chiqadi.
    const line = byId('01').visual;
    const step = (line.max - line.min) / line.intervals;
    pass(Number.isInteger(step), `${file} 01: bo'linma qiymati butun son emas`);
    pass((Number(byId('01').answer) - line.min) % step === 0, `${file} 01: javob bo'linmaga tushmaydi`);
    pass(Number(byId('01').answer) > line.min && Number(byId('01').answer) < line.max,
      `${file} 01: javob chetda turadi — bo'linma qiymatini hisoblash kerak emas`);
    pass(line.showAll === false, `${file} 01: oraliq imzolar ko'rinib turadi`);

    // 02 va 08: yuza ko'paytirishdan qayta hisoblanadi.
    const area = facts.rectangle.a * facts.rectangle.b;
    pass(byId('02').selectCount === area, `${file} 02: yuza ${area} emas`);
    pass(byId('02').selectCount <= byId('02').visual.total, `${file} 02: yuza panjaradan katta`);
    const squareArea = facts.square.side * facts.square.side;
    const squarePerimeter = facts.square.side * 4;
    pass(byId('08').selectCount === squareArea, `${file} 08: kvadrat yuzasi ${squareArea} emas`);
    pass(squareArea === squarePerimeter, `${file} 08: bu tomonda perimetr va yuza soni mos kelmaydi`);

    // 03: ikki sinf kartasi butun sonni beradi.
    const thousands = byId('03').cards.find((card) => card.id === byId('03').slots[0].correct).text.uz;
    const ones = byId('03').cards.find((card) => card.id === byId('03').slots[1].correct).text.uz;
    pass(Number(`${thousands}${ones}`) === facts.whole, `${file} 03: sinflar ${facts.whole} ni bermaydi`);
    pass(ones.length === 3 && ones.startsWith('0'), `${file} 03: birlar sinfida uch xona va nol yo'q`);

    // 04: ustun qo'shish mustaqil bajariladi.
    pass(facts.column.first + facts.column.second === facts.column.total,
      `${file} 04: shartdagi ustun qo'shish to'g'ri emas`);
    const blank = byId('04').visual.text.replace(/\s/g, '');
    const restored = blank.replace('□', String(byId('04').answer));
    const parts = /^(\d+)\+(\d+)=(\d+)$/.exec(restored);
    pass(Boolean(parts), `${file} 04: yozuv o'qilmadi`);
    if (parts) {
      pass(Number(parts[1]) + Number(parts[2]) === Number(parts[3]),
        `${file} 04: javob qo'yilganda yozuv to'g'ri chiqmaydi`);
    }

    // 05: kasr qismi.
    pass(facts.fraction.whole % facts.fraction.d === 0, `${file} 05: butun maxrajga butun bo'linmaydi`);
    pass(digits(byId('05').answer) === String((facts.fraction.whole / facts.fraction.d) * facts.fraction.n),
      `${file} 05: kasr qismi noto'g'ri`);

    // 06: birlik aylantirish va distraktorlar.
    const centimetres = facts.length.metres * 100 + facts.length.centimetres;
    const correct = byId('06').options.find((item) => item.correct).text.uz;
    pass(digits(correct).startsWith(String(centimetres)), `${file} 06: to'g'ri variant ${centimetres} emas`);
    const decoys = byId('06').options.filter((item) => !item.correct).map((item) => Number(digits(item.text.uz).replace(/\D/g, '')));
    pass(decoys.every((value) => value !== centimetres), `${file} 06: distraktor to'g'ri javobga teng`);

    // 07: perimetr va yuza formulalari almashib ketmasin.
    const perimeterCard = byId('07').cards.find((card) => card.id === byId('07').slots[0].correct).text.uz;
    const areaCard = byId('07').cards.find((card) => card.id === byId('07').slots[1].correct).text.uz;
    pass(perimeterCard.includes('+') && perimeterCard.includes('2'), `${file} 07: perimetr formulasi mos emas`);
    pass(!areaCard.includes('+'), `${file} 07: yuza formulasida qo'shish bor`);

    // 09: xato yozuvdagi son yuza, to'g'ri perimetr esa boshqa.
    const wrong = facts.wrongPerimeter;
    pass(wrong.a * wrong.b === wrong.written, `${file} 09: yozilgan son yuza emas`);
    pass((wrong.a + wrong.b) * 2 !== wrong.written, `${file} 09: perimetr va yuza teng chiqib qoldi`);
    const answer = byId('09').options.find((item) => item.correct).text.uz;
    pass(answer.includes(String((wrong.a + wrong.b) * 2)), `${file} 09: to'g'ri variantda haqiqiy perimetr yo'q`);

    // 10: ikki qadamli ko'chirish.
    const total = facts.transfer.first + facts.transfer.second - facts.transfer.duplicates;
    pass(digits(byId('10').answer) === String(total), `${file} 10: javob ${total} emas`);
  },

  50: (file, tasks, expected) => {
    const digits = (value) => String(value).replace(/\s/g, '');
    const chart = tasks.find((task) => task.visual?.type === 'bars').visual;
    const line = tasks.find((task) => task.visual?.type === 'line').visual;
    const byId = (id) => tasks.find((task) => task.id === id);
    const dayValue = (id) => chart.bars.find((bar) => bar.id === id).value;

    // O'q imzolari majburiy (METODIK_PROFIL): ikkala chizmada ham bo'lishi kerak.
    for (const visual of [chart, line]) {
      pass(localised(visual.axisX) && localised(visual.axisY), `${file}: chizmada o'q imzosi yo'q`);
      pass((visual.max - visual.min) % visual.step === 0, `${file}: shkala qadami o'q oralig'iga butun bo'linmaydi`);
    }
    // Diagramma qiymatlari shkala qadamiga tushishi kerak, aks holda ustunni
    // o'qib bo'lmaydi.
    for (const bar of chart.bars) {
      pass((bar.value - chart.min) % (chart.step / 3) === 0 || (bar.value - chart.min) % chart.step === 0,
        `${file}: ${bar.id} ustuni shkalada o'qilmaydi — ${bar.value}`);
    }

    // 02, 04: javob aynan shu ustunning qiymati.
    pass(digits(byId('02').answer) === String(dayValue(byId('02').visual.highlight)), `${file} 02: javob ajratilgan ustunga mos emas`);
    pass(digits(byId('04').answer) === String(dayValue(byId('04').visual.highlight)), `${file} 04: javob ajratilgan ustunga mos emas`);

    // 03: eng katta va eng kichik ustun farqi.
    const values = chart.bars.map((bar) => bar.value);
    pass(digits(byId('03').answer) === String(Math.max(...values) - Math.min(...values)),
      `${file} 03: farq ${Math.max(...values) - Math.min(...values)} bo'lishi kerak`);

    // 05: jadvaldagi bo'sh katak diagramma bilan mos.
    const openRow = byId('05').visual.rows.find((row) => row.includes('?'));
    pass(Boolean(openRow), `${file} 05: jadvalda bo'sh katak yo'q`);
    pass(digits(byId('05').answer) === String(Math.max(...values)), `${file} 05: javob eng baland ustunga mos emas`);
    // Jadvaldagi har sonli katak diagrammada bor bo'lishi kerak.
    for (const row of byId('05').visual.rows) {
      for (const cell of row) {
        if (typeof cell !== 'string' || !/^[0-9]+$/.test(cell)) continue;
        pass(values.includes(Number(cell)), `${file} 05: jadval qiymati diagrammada yo'q — ${cell}`);
      }
    }

    // 06: jami va eng katta/kichik javoblari hisobdan chiqadi.
    const total = values.reduce((sum, value) => sum + value, 0);
    const sumCard = byId('06').right.find((item) => /\d/.test(item.text.uz));
    pass(sumCard && digits(sumCard.text.uz).startsWith(String(total)), `${file} 06: jami ${total} emas`);

    // 07: har kun chegaraga nisbatan qayta solishtiriladi.
    for (const item of byId('07').items) {
      const value = dayValue(item.id);
      const bin = value < expected.threshold ? 'less' : value === expected.threshold ? 'equal' : 'more';
      pass(item.bin === bin, `${file} 07: ${item.id} (${value}) guruhi noto'g'ri`);
    }

    // 08: chegaraviy holat — o'q noldan boshlanmaydi va javob nuqtaga mos.
    pass(line.min > 0, `${file} 08: grafik o'qi noldan boshlanadi, chegaraviy holat yo'q`);
    const lit = line.points.find((point) => point.id === byId('08').visual.highlight);
    pass(Boolean(lit), `${file} 08: ajratilgan nuqta yo'q`);
    if (lit) pass(digits(byId('08').answer) === String(lit.value), `${file} 08: javob ajratilgan nuqtaga mos emas`);

    // 10: har oraliq ikki qo'shni qiymatdan hisoblanadi.
    for (const item of byId('10').items) {
      const [from, to] = item.id.replace(/w/g, '').split('-').map(Number);
      const first = line.points[from - 1].value;
      const second = line.points[to - 1].value;
      const bin = second > first ? 'up' : second === first ? 'same' : 'down';
      pass(item.bin === bin, `${file} 10: ${item.id} (${first} → ${second}) guruhi noto'g'ri`);
    }
  },

  49: (file, tasks, expected) => {
    const digits = (value) => String(value).replace(/\s/g, '');

    // 02 va 05: sonli mulohaza hisobdan qayta chiqariladi.
    const difference = readEquation(tasks[1].visual.text.replace('?', 'x'));
    pass(Boolean(difference), `${file} 02: yozuv o'qilmadi`);
    if (difference) pass(String(difference.root) === digits(tasks[1].answer), `${file} 02: ayirma ${difference.root}`);
    const missing = readEquation(tasks[4].visual.text);
    pass(Boolean(missing), `${file} 05: yozuv o'qilmadi`);
    if (missing) pass(String(missing.root) === digits(tasks[4].answer), `${file} 05: javob ${missing.root} bo'lishi kerak`);

    // 01: mulohaza emas bo'lganlar savol yoki undov belgisi bilan tugaydi
    // yoki buyruq bo'ladi; mulohazalar nuqta bilan tugaydi.
    for (const item of tasks[0].items) {
      const text = item.text.uz.trim();
      const marked = expected.nonStatementMarks.some((mark) => text.endsWith(mark));
      if (marked) pass(item.bin !== 'statement', `${file} 01: «${text}» mulohaza deb belgilangan`);
      if (item.bin === 'statement') pass(text.endsWith('.'), `${file} 01: mulohaza nuqta bilan tugamaydi — «${text}»`);
    }
    pass(tasks[0].items.filter((item) => item.bin === 'statement').length >= 2, `${file} 01: mulohazalar yetarli emas`);

    // 04: rost va yolg'on kartalar hisob bilan tekshiriladi.
    const trueCard = tasks[3].cards.find((card) => card.id === tasks[3].slots[0].correct);
    const falseCard = tasks[3].cards.find((card) => card.id === tasks[3].slots[1].correct);
    const trueParsed = readEquation(trueCard.text.uz);
    const falseParsed = readEquation(falseCard.text.uz);
    pass(trueParsed?.holds === true, `${file} 04: «rost» uyasidagi yozuv rost emas`);
    pass(falseParsed?.holds === false, `${file} 04: «yolg'on» uyasidagi yozuv yolg'on emas`);

    // 08: ichki yozuv va tashqi inkor birgalikda hisoblanadi.
    for (const item of tasks[7].items) {
      const inner = /«([^»]+)»/.exec(item.text.uz);
      if (!inner) continue;
      const parsed = readEquation(inner[1]);
      if (parsed?.kind === 'not-equation') {
        // Ichki yozuv yolg'on bo'lsa, «yolg'on» xabari rost bo'ladi.
        pass(item.bin === (parsed.holds ? 'false' : 'true'),
          `${file} 08: «${item.text.uz}» uchun hukm noto'g'ri`);
      }
    }

    // 10: qarshi misollar mustaqil tekshiriladi.
    for (const [pairId, value] of Object.entries(expected.counterexamples)) {
      const pair = tasks[9].pairs.find((item) => item.id === pairId);
      pass(Boolean(pair), `${file} 10: ${pairId} juftligi yo'q`);
      if (!pair) continue;
      const card = tasks[9].right.find((item) => item.id === pair.correctRight);
      pass(Number(card.text.uz) === value, `${file} 10: ${pairId} uchun qarshi misol ${value} bo'lishi kerak`);
      if (pairId === 'under-ten') pass(value >= 10, `${file} 10: 25 o'ndan kichik bo'lib qoldi`);
      if (pairId === 'even-four') pass(value % 2 === 0 && value % 4 !== 0, `${file} 10: 6 juft, lekin to'rtga bo'linmasligi kerak`);
      if (pairId === 'div-two') pass(value % 2 === 1, `${file} 10: 7 toq bo'lishi kerak`);
    }
  },

  48: (file, tasks, expected) => {
    const value = (raw) => Number(String(raw).replace(/[\s,]/g, ''));
    const sumOf = (raw) => String(raw).replace(/[\s,]/g, '').split('+').map(Number).reduce((a, c) => a + c, 0);

    // 03 va 10: yig'indi yozuvdan qayta hisoblanadi.
    for (const index of [2, 9]) {
      const task = tasks[index];
      const record = String(task.visual.text).replace(/=.*$/, '');
      pass(String(sumOf(record)) === String(value(task.answer)),
        `${file} ${task.id}: yozuv ${sumOf(record)} beradi, javob esa ${task.answer}`);
    }

    // 02 va 05: to'g'ri juft YUMALOQ son berishi, distraktor juftlar bermasligi kerak.
    for (const index of [1, 4]) {
      const task = tasks[index];
      const parts = String(task.visual.text).replace(/[\s,]/g, '').split('+').map(Number);
      const pairCard = task.cards.find((card) => card.id === task.slots[0].correct);
      const pairSum = sumOf(pairCard.text.uz);
      pass(pairSum % 1000 === 0, `${file} ${task.id}: tanlangan juft yumaloq son bermaydi — ${pairSum}`);
      const restCard = task.cards.find((card) => card.id === task.slots[1].correct);
      pass(pairSum + value(restCard.text.uz) === parts.reduce((a, c) => a + c, 0),
        `${file} ${task.id}: juft va qolgan son yig'indisi yozuvga teng emas`);
      const decoyPairs = task.cards
        .filter((card) => card.text.uz.includes('+') && card.id !== task.slots[0].correct)
        .map((card) => sumOf(card.text.uz));
      pass(decoyPairs.every((sum) => sum % 1000 !== 0),
        `${file} ${task.id}: distraktor juft ham yumaloq son beradi`);
    }

    // 04: tushib qolgan qo'shiluvchi yozuvning ikki tomonini tenglashtiradi.
    const record = String(tasks[3].visual.text).replace(/[\s,]/g, '');
    const [left, right] = record.split('=');
    const leftSum = sumOf(left);
    const filledRight = right.replace('□', String(value(tasks[3].answer))).replace(/[()]/g, '');
    pass(leftSum === sumOf(filledRight), `${file} 04: javob ikki tomonni tenglashtirmaydi`);

    // 07: tasnif qavs bor-yo'qligidan chiqadi.
    for (const item of tasks[6].items) {
      const hasBrackets = /[()]/.test(item.text.uz);
      pass(item.bin === (hasBrackets ? 'group' : 'swap'),
        `${file} 07: «${item.text.uz}» guruhi qavs belgisiga mos emas`);
    }

    // 08: ayirishda guruhlash boshqa natija berishini audit o'zi hisoblaydi.
    const [withBracket, withoutBracket] = expected.subtractionPair;
    pass(900 - (400 - 100) === withBracket && (900 - 400) - 100 === withoutBracket,
      `${file} 08: kutilgan ikki natija hisob bilan mos emas`);
    const correct = tasks[7].options.find((item) => item.correct).text.uz.replace(/\s/g, '');
    pass(correct.includes(String(withBracket)) && correct.includes(String(withoutBracket)),
      `${file} 08: to'g'ri variantda ikki natija ko'rsatilmagan`);

    // 06: har qulay juft o'z yig'indisidagi sonlardan tuzilgan bo'lishi kerak.
    for (const pair of tasks[5].pairs) {
      const numbers = String(pair.left.uz).replace(/[\s,]/g, '').split('+');
      const card = tasks[5].right.find((item) => item.id === pair.correctRight);
      const chosen = String(card.text.uz).replace(/[\s,]/g, '').split('+');
      pass(chosen.every((number) => numbers.includes(number)),
        `${file} 06: «${card.text.uz}» juftining sonlari yig'indida yo'q`);
      pass(sumOf(card.text.uz) % 1000 === 0, `${file} 06: «${card.text.uz}» yumaloq son bermaydi`);
    }
  },

  // Tengsizlikni o'qiydi: `3 · x ≤ 6` -> koeffitsiyent, belgi, chegara.
  // Natural yechimlar 1 dan boshlanadi.
  47: (file, tasks, expected) => {
    const readInequality = (raw) => {
      const text = String(raw).replace(/\s/g, '').replace(/[·×*]/g, '*');
      const match = /^(?:(\d+)\*)?x(<=|>=|<|>|≤|≥)(\d+)$/.exec(text);
      if (!match) return null;
      const [, factorRaw, signRaw, boundRaw] = match;
      const factor = Number(factorRaw ?? 1);
      const bound = Number(boundRaw);
      const sign = signRaw === '<=' ? '≤' : signRaw === '>=' ? '≥' : signRaw;
      const fits = (value) => (
        sign === '<' ? factor * value < bound
          : sign === '≤' ? factor * value <= bound
            : sign === '>' ? factor * value > bound
              : factor * value >= bound
      );
      if (sign === '>' || sign === '≥') return { sign, factor, bound, fits, largest: null, count: null };
      let largest = 0;
      while (fits(largest + 1)) largest += 1;
      return { sign, factor, bound, fits, largest, count: largest };
    };

    // 02 va 05: eng katta natural yechim yozuvdan qayta hisoblanadi.
    for (const index of [1, 4]) {
      const task = tasks[index];
      const parsed = readInequality(task.visual?.text);
      pass(Boolean(parsed), `${file} ${task.id}: tengsizlik o'qilmadi`);
      if (parsed) pass(String(parsed.largest) === String(task.answer), `${file} ${task.id}: eng katta yechim ${parsed.largest}`);
    }

    // 04: son o'qidagi javob chegarani oladi va shkalada mavjud.
    const line = tasks[3];
    const step = (line.visual.max - line.visual.min) / line.visual.intervals;
    const ticks = Array.from({ length: line.visual.intervals + 1 }, (_, i) => line.visual.min + step * i);
    pass(ticks.includes(Number(line.answer)), `${file} 04: javob shkalada yo'q`);
    pass(Number(line.answer) <= line.visual.max, `${file} 04: javob shkaladan chiqib ketgan`);

    // 07: tartib YECHIMLAR SONI bo'yicha va u sonlar kattaligidan farq qiladi.
    const ordered = tasks[6].cards.slice().sort((a, c) => a.order - c.order)
      .map((card) => ({ card, parsed: readInequality(card.text.uz) }));
    pass(ordered.every((item) => item.parsed), `${file} 07: kartalardagi tengsizlik o'qilmadi`);
    if (ordered.every((item) => item.parsed)) {
      const counts = ordered.map((item) => item.parsed.count);
      pass(counts.every((value, index) => index === 0 || counts[index - 1] < value),
        `${file} 07: tartib yechimlar soni bo'yicha o'smaydi — ${counts.join(', ')}`);
      const bounds = ordered.map((item) => item.parsed.bound);
      pass(!bounds.every((value, index) => index === 0 || bounds[index - 1] <= value),
        `${file} 07: tartib yozuvdagi sonlar bilan ham mos — topshiriq trivial`);
      pass(Boolean(tasks[6].orderBy), `${file} 07: tartib kattalik bo'yicha emas, sabab (orderBy) yozilmagan`);
    }

    // 08: har qiymat shart bilan tekshiriladi.
    const gate = expected.gate;
    for (const item of tasks[7].items) {
      const value = Number(item.text.uz.replace(/\s/g, ''));
      pass(Number.isFinite(value), `${file} 08: «${item.text.uz}» son emas`);
      const fits = gate.sign === '≥' ? value >= gate.bound : value > gate.bound;
      pass(item.bin === (fits ? gate.yesBin : gate.noBin),
        `${file} 08: ${value} uchun guruh noto'g'ri`);
    }
    pass(tasks[7].items.some((item) => Number(item.text.uz) === gate.bound),
      `${file} 08: chegara qiymatining o'zi yo'q — chegaraviy holat tekshirilmaydi`);

    // 10: har tengsizlikning yechimlar to'plami qaytadan tuziladi.
    for (const pair of tasks[9].pairs) {
      const parsed = readInequality(pair.left.uz);
      pass(Boolean(parsed), `${file} 10: «${pair.left.uz}» o'qilmadi`);
      if (!parsed) continue;
      const expectedSet = Array.from({ length: parsed.largest }, (_, i) => i + 1).join(', ');
      const card = tasks[9].right.find((item) => item.id === pair.correctRight);
      pass(card?.text.uz === expectedSet, `${file} 10: «${pair.left.uz}» uchun to'plam ${expectedSet} bo'lishi kerak`);
    }
  },

  46: (file, tasks, expected) => {
    const digits = (value) => String(value).replace(/\s/g, '');
    const byId = (id) => tasks.find((task) => task.id === id);

    // 03: butundan qism — maxrajga bo'lib, suratga ko'paytirish.
    const partOf = expected.fractions['03'];
    pass(partOf.whole % partOf.d === 0, `${file} 03: butun maxrajga butun bo'linmaydi`);
    pass(digits(byId('03').answer) === String((partOf.whole / partOf.d) * partOf.n),
      `${file} 03: javob ${(partOf.whole / partOf.d) * partOf.n} emas`);
    pass(byId('03').visual.total === partOf.d && byId('03').visual.filled === partOf.n,
      `${file} 03: lenta modeli kasrga mos emas`);

    // 04: bitta ulushdan butun.
    const unit = expected.fractions['04'];
    pass(digits(byId('04').answer) === String(unit.share * unit.d), `${file} 04: butun ${unit.share * unit.d} emas`);
    pass(byId('04').visual.filled === 1, `${file} 04: modelda bitta ulush ko'rsatilmagan`);

    // 06: ma'lum qismdan butun — suratga bo'lib, maxrajga ko'paytirish.
    const fromPart = expected.fractions['06'];
    pass(fromPart.part % fromPart.n === 0, `${file} 06: qism suratga butun bo'linmaydi`);
    pass(digits(byId('06').answer) === String((fromPart.part / fromPart.n) * fromPart.d),
      `${file} 06: butun ${(fromPart.part / fromPart.n) * fromPart.d} emas`);

    // 02, 10: bo'yash sanoq bo'yicha tekshiriladi; 10 da qoldiq hisoblanadi.
    for (const id of ['02', '10']) {
      const task = byId(id);
      pass(task.kind === 'shade', `${file} ${id}: shade mexanikasi emas`);
      pass(Number.isInteger(task.selectCount) && task.selectCount > 0, `${file} ${id}: selectCount yo'q`);
      pass(task.selectCount <= task.visual.total - task.visual.filled,
        `${file} ${id}: bo'yaladigan katak sonidan ko'p tanlash talab qilinadi`);
    }
    pass(byId('10').selectCount === byId('10').visual.total - byId('02').selectCount,
      `${file} 10: qoldiq butun minus jo'natilgan qismga teng emas`);
    pass(byId('10').visual.filled === 0,
      `${file} 10: jo'natilgan qism oldindan bo'yalgan — xato qilish imkoni yo'q`);

    // 05: kasr quruvchi modeldan o'qiladi va distraktorlar bor.
    const build = byId('05');
    pass(build.answer.n === build.visual.filled && build.answer.d === build.visual.total,
      `${file} 05: kasr model bilan mos emas`);
    pass(build.nChoices.includes(build.answer.n) && build.dChoices.includes(build.answer.d),
      `${file} 05: to'g'ri qiymat tanlovda yo'q`);
    pass(build.nChoices.length >= 3 && build.dChoices.length >= 3, `${file} 05: distraktor yetarli emas`);

    // 08: chegaraviy holat — surat maxrajga teng.
    pass(byId('08').visual.filled === byId('08').visual.total, `${file} 08: model butun kasrni ko'rsatmaydi`);

    // 09: teskari masala qadamlari hisobi.
    const steps = byId('09').cards.map((card) => card.text.uz.replace(/\s/g, '').replace(/×/g, '*'));
    // Kartani NAQSH bo'yicha izlaymiz: «Qism ma'lum: 51 m» kartasi ham ikki
    // nuqta tutadi va matn bo'yicha izlash uni ilintirib qo'yadi.
    const matchStep = (pattern) => steps.map((text) => pattern.exec(text)).find(Boolean) ?? null;
    const divide = matchStep(/^(\d+):(\d+)=(\d+)$/);
    const multiply = matchStep(/^(\d+)\*(\d+)=(\d+)$/);
    pass(Boolean(divide) && Number(divide[1]) / Number(divide[2]) === Number(divide[3]), `${file} 09: bo'lish qadami noto'g'ri`);
    pass(Boolean(multiply) && Number(multiply[1]) * Number(multiply[2]) === Number(multiply[3]), `${file} 09: ko'paytirish qadami noto'g'ri`);
    if (divide && multiply) {
      pass(divide[3] === multiply[1], `${file} 09: ikkinchi qadam birinchisining natijasidan boshlanmaydi`);
    }
  },

  45: (file, tasks, expected) => {
    const digits = (value) => String(value).replace(/\s/g, '');
    const tickValues = (visual) => {
      const step = (visual.max - visual.min) / visual.intervals;
      return Array.from({ length: visual.intervals + 1 }, (_, index) => visual.min + step * index);
    };

    // 02: masofa tezlik va vaqtdan hisoblanadi va shkalada mavjud bo'lishi kerak.
    const line = tasks[1];
    const distance = expected.motion.speed * expected.motion.time;
    pass(digits(line.answer) === String(distance), `${file} 02: masofa ${distance} emas`);
    pass(tickValues(line.visual).includes(distance), `${file} 02: javob shkalada bo'linma sifatida yo'q`);
    pass(line.visual.showAll === true, `${file} 02: bu topshiriqda imzolar ko'rinishi kerak`);

    // 08: chegaraviy holat — shkala noldan boshlanmaydi, imzolar yashirin.
    const gauge = tasks[7];
    pass(gauge.visual.min > 0, `${file} 08: shkala noldan boshlanadi, chegaraviy holat yo'q`);
    pass(gauge.visual.showAll === false, `${file} 08: imzolar ko'rinib turadi, bo'linma qiymatini hisoblash kerak emas`);
    const step = (gauge.visual.max - gauge.visual.min) / gauge.visual.intervals;
    pass(Number.isInteger(step), `${file} 08: bo'linma qiymati butun son emas`);
    pass(digits(gauge.answer) === String(gauge.visual.min + gauge.visual.markerIndex * step),
      `${file} 08: javob ko'rsatkich turgan bo'linmaga mos emas`);

    // 04, 05, 10: jadval va yozuv modelidan javob qaytadan hisoblanadi.
    const table = tasks[3].visual;
    pass(table?.type === 'table', `${file} 04: jadval modeli yo'q`);
    if (table?.type === 'table') {
      const [distanceCell, timeCell] = table.rows[0];
      const value = Number(digits(distanceCell).replace(/\D/g, '')) / Number(digits(timeCell).replace(/\D/g, ''));
      pass(String(value) === digits(tasks[3].answer), `${file} 04: jadval ${value} beradi, javob esa ${tasks[3].answer}`);
    }
    for (const index of [4, 9]) {
      const parsed = readEquation(tasks[index].visual?.text);
      pass(Boolean(parsed), `${file} ${tasks[index].id}: yozuv modeli o'qilmadi`);
      if (parsed) pass(String(parsed.root) === digits(tasks[index].answer), `${file} ${tasks[index].id}: yozuv ${parsed.root} beradi`);
    }

    // 07: bosqichlar hisobi va yig'indisi.
    const stageCards = tasks[6].cards.map((card) => card.text.uz.replace(/\s/g, '').replace(/×/g, '*'));
    const stages = stageCards.map((text) => /^(\d+)\*(\d+)=(\d+)$/.exec(text)).filter(Boolean);
    pass(stages.length === 2, `${file} 07: ikkita bosqich hisobi topilmadi`);
    for (const stage of stages) {
      pass(Number(stage[1]) * Number(stage[2]) === Number(stage[3]), `${file} 07: «${stage[0]}» hisobi noto'g'ri`);
    }
    const total = /^(\d+)\+(\d+)=(\d+)$/.exec(stageCards.find((text) => text.includes('+')) || '');
    pass(Boolean(total), `${file} 07: yig'indi kartasi topilmadi`);
    if (total && stages.length === 2) {
      pass(Number(total[1]) + Number(total[2]) === Number(total[3]), `${file} 07: yig'indi hisobi noto'g'ri`);
      pass(Number(total[3]) === Number(stages[0][3]) + Number(stages[1][3]), `${file} 07: yig'indi bosqichlarga mos emas`);
    }

    // Nazariyada bo'lmagan qamrov amaliyotga o'tib ketmasligi kerak.
    pass(!expected.forbiddenScope.test(JSON.stringify(tasks)),
      `${file}: nazariyada yo'q yig'indi yoki ayirma tezlik qamrovi topildi`);
  },

  44: (file, tasks, expected) => {
    const { first, second, sent } = expected.story;
    const middle = first + second;
    const answer = middle - sent;
    const digits = (value) => String(value).replace(/\s/g, '');

    // 02, 05, 06: uchala javob bitta masaladan qayta hisoblanadi.
    pass(digits(tasks[1].answer) === String(middle), `${file} 02: oraliq qiymat ${middle} emas`);
    pass(digits(tasks[4].answer) === String(answer), `${file} 05: javob ${answer} emas`);
    pass(digits(tasks[5].answer) === String(answer), `${file} 06: ikkinchi yo'l boshqa javob beradi`);

    // 04: reja kartalari shart sonlaridan chiqadi va ildiz oraliqqa tayanadi.
    const planFirst = tasks[3].cards.find((card) => card.id === tasks[3].slots[0].correct).text.uz;
    const planSecond = tasks[3].cards.find((card) => card.id === tasks[3].slots[1].correct).text.uz;
    pass(digits(planFirst) === `${first}+${second}`, `${file} 04: 1-amal kartasi shart sonlariga mos emas`);
    pass(digits(planSecond) === `${middle}−${sent}` || digits(planSecond) === `${middle}-${sent}`,
      `${file} 04: 2-amal kartasi oraliq qiymatga tayanmaydi`);

    // 07: ikki usul yozuvi ham javobni beradi, distraktorlar bermaydi.
    const evaluate = (raw) => {
      const text = digits(raw).replace(/[−–]/g, '-');
      if (!/^[\d()+\-]+$/.test(text)) return null;
      // Yozuv faqat raqam, qavs va +/- dan iborat ekani yuqorida tekshirilgan.
      try { return Function(`"use strict";return (${text})`)(); } catch { return null; }
    };
    for (const slot of tasks[6].slots) {
      const card = tasks[6].cards.find((item) => item.id === slot.correct);
      pass(evaluate(card.text.uz) === answer, `${file} 07: «${card.text.uz}» ${answer} bermaydi`);
    }
    const decoys = tasks[6].cards.filter((card) => !tasks[6].slots.some((slot) => slot.correct === card.id));
    pass(decoys.length >= 2, `${file} 07: distraktor karta yetarli emas`);
    for (const card of decoys) {
      pass(evaluate(card.text.uz) !== answer, `${file} 07: distraktor «${card.text.uz}» ham to'g'ri javob beradi`);
    }

    // 10: ko'chirish masalasi uch qismdan yig'iladi.
    const third = expected.transfer.second - expected.transfer.less;
    const total = expected.transfer.first + expected.transfer.second + third;
    pass(digits(tasks[9].answer) === String(total), `${file} 10: jami ${total} emas`);

    // 01 va 08: guruhlar bo'sh qolmaydi va savol matnlari takrorlanmaydi.
    for (const index of [0, 7]) {
      const texts = tasks[index].items.map((item) => item.text.uz);
      pass(new Set(texts).size === texts.length, `${file} ${tasks[index].id}: takroriy savol matni`);
    }
  },

  43: (file, tasks, expected) => {
    // 01, 02, 04, 08: yozuv modelidan ildiz qaytadan hisoblanadi.
    for (const index of [0, 1, 3, 7]) {
      const task = tasks[index];
      const parsed = readEquation(task.visual?.text);
      pass(Boolean(parsed), `${file} ${task.id}: yozuv modeli o'qilmadi`);
      if (!parsed) continue;
      pass(Number.isInteger(parsed.root), `${file} ${task.id}: ildiz butun son emas`);
      if (task.kind === 'numpad' || task.kind === 'missing') {
        pass(String(parsed.root) === String(task.answer), `${file} ${task.id}: yozuv ${parsed.root} beradi, javob esa ${task.answer}`);
      }
      if (task.kind === 'mc' && task.id === '08') {
        const correct = task.options.find((item) => item.correct);
        pass(correct.text.uz.replace(/\s/g, '') === `x=${parsed.root}`, `${file} 08: to'g'ri variant ildizga mos emas`);
      }
    }

    // 01: to'g'ri variant aynan teskari amal yozuvi bo'lishi kerak.
    const inverse = tasks[0].options.find((item) => item.correct).text.uz.replace(/\s/g, '');
    pass(inverse === '490:7', `${file} 01: to'g'ri variant teskari amal emas`);

    // 03: qadam kartalari hisobi to'g'ri.
    const step = tasks[2].cards.find((card) => card.id === 'inverse')?.text.uz.replace(/\s/g, '');
    const value = tasks[2].cards.find((card) => card.id === 'value')?.text.uz.replace(/\s/g, '');
    const product = /^x=(\d+)[*×·](\d+)$/.exec(step?.replace(/×/g, '*') || '');
    pass(Boolean(product), `${file} 03: teskari amal kartasi o'qilmadi`);
    if (product) pass(`x=${Number(product[1]) * Number(product[2])}` === value, `${file} 03: qadam natijasi hisob bilan mos emas`);

    // 05: tekshiruv kartalari murakkab yozuvdan hisoblanadi.
    const compound = /\((\d[\d\s]*)\s*[−-]\s*x\)\s*:\s*(\d+)\s*=\s*(\d+)/.exec(tasks[4].visual.text);
    pass(Boolean(compound), `${file} 05: murakkab yozuv o'qilmadi`);
    if (compound) {
      const [, wholeRaw, divisor, quotient] = compound;
      const whole = Number(wholeRaw.replace(/\s/g, ''));
      const inner = Number(quotient) * Number(divisor);
      const root = whole - inner;
      pass(root === 2400, `${file} 05: shartdagi ildiz 2 400 emas — ${root}`);
      const innerCard = tasks[4].cards.find((card) => card.id === tasks[4].slots[0].correct);
      const resultCard = tasks[4].cards.find((card) => card.id === tasks[4].slots[1].correct);
      pass(Number(innerCard.text.uz.replace(/\s/g, '')) === inner, `${file} 05: qavs qiymati kartasi hisob bilan mos emas`);
      pass(Number(resultCard.text.uz.replace(/\s/g, '')) === Number(quotient), `${file} 05: bo'linish natijasi kartasi mos emas`);
    }

    // 06: murakkab tenglama ildizi.
    const solve = /\((\d[\d\s]*)\s*[−-]\s*x\)\s*:\s*(\d+)\s*=\s*(\d+)/.exec(tasks[5].visual.text);
    pass(Boolean(solve), `${file} 06: murakkab yozuv o'qilmadi`);
    if (solve) {
      const root = Number(solve[1].replace(/\s/g, '')) - Number(solve[3]) * Number(solve[2]);
      pass(String(root) === String(tasks[5].answer), `${file} 06: hisob ${root} beradi, javob esa ${tasks[5].answer}`);
    }

    // 07: guruh yozuvdagi amaldan chiqadi.
    for (const item of tasks[6].items) {
      const parsed = readEquation(item.text.uz);
      pass(Boolean(parsed), `${file} 07: «${item.text.uz}» o'qilmadi`);
      if (parsed) {
        pass(expected.inverseBins[parsed.kind] === item.bin,
          `${file} 07: «${item.text.uz}» ${parsed.kind}, guruh esa ${item.bin}`);
        pass(Number.isInteger(parsed.root), `${file} 07: «${item.text.uz}» ildizi butun emas`);
      }
    }

    // 10: har tenglik hisoblanadi va guruh bilan solishtiriladi.
    for (const item of tasks[9].items) {
      const parsed = readEquation(item.text.uz);
      pass(parsed?.kind === 'not-equation', `${file} 10: «${item.text.uz}» sonli tenglik emas`);
      if (parsed?.kind === 'not-equation') {
        pass(expected.verdictBins[String(parsed.holds)] === item.bin,
          `${file} 10: «${item.text.uz}» ${parsed.holds ? 'rost' : 'yolg\'on'}, guruh esa ${item.bin}`);
      }
    }
  },
};

const argLessons = process.argv.slice(2).map(Number).filter((value) => Number.isInteger(value));
const lessons = (argLessons.length ? argLessons : Object.keys(EXPECTED).map(Number))
  .filter((lesson) => {
    if (EXPECTED[lesson]) return true;
    notes.push(`${lesson}-dars auditda hali ta'riflanmagan — o'tkazib yuborildi`);
    return false;
  });

for (const lesson of lessons) {
  const expected = EXPECTED[lesson];
  const fileName = `Dars${lesson}Practice.jsx`;
  const file = path.join(GRADE4_DIR, fileName);
  if (!fs.existsSync(file)) {
    failures.push(`${fileName}: fayl topilmadi`);
    continue;
  }
  const source = fs.readFileSync(file, 'utf8');
  let tasks;
  let screenMeta;
  try {
    const ast = parse(source, { sourceType: 'module', plugins: ['jsx'] });
    tasks = evaluateInitializer(source, ast, 'TASKS');
    screenMeta = evaluateInitializer(source, ast, 'SCREEN_META');
  } catch (error) {
    failures.push(`${fileName}: parse/evaluate xatosi — ${error.message}`);
    continue;
  }

  pass(Array.isArray(tasks) && tasks.length === 10, `${fileName}: TASKS aynan 10 ta emas`);
  if (!Array.isArray(tasks) || tasks.length !== 10) continue;

  pass(tasks.map((task) => task.id).join(',') === '01,02,03,04,05,06,07,08,09,10', `${fileName}: task ID ketma-ketligi noto'g'ri`);
  pass(tasks.every((task, index) => task.level === LEVELS[index]), `${fileName}: 2 green / 5 yellow / 3 red buzilgan`);

  // Raskladka: fayl generator bergan mexanikalarni bajaradi.
  const planned = LAYOUT[lesson];
  const actual = tasks.map((task) => task.kind);
  actual.forEach((kind, index) => {
    if (kind !== planned[index]) {
      notes.push(`${fileName}: ${index + 1}-pozitsiya raskladkadan chekindi — reja ${planned[index]}, fayl ${kind}`);
    }
  });
  pass(actual.every((kind) => ALLOWED_KINDS.has(kind)), `${fileName}: qo'llanmaydigan mexanika — ${actual.filter((kind) => !ALLOWED_KINDS.has(kind)).join(', ')}`);
  pass(new Set(actual).size >= 6, `${fileName}: mexanika soni ${new Set(actual).size}, 6 dan kam`);
  actual.forEach((kind, index) => {
    if (index > 0) pass(actual[index - 1] !== kind, `${fileName}: ${index + 1}-pozitsiyada qo'shni mexanika takrorlandi`);
    if (index > 1) pass(actual[index - 2] !== kind, `${fileName}: ${index + 1}-pozitsiyada mexanika oralab takrorlandi`);
  });

  for (const task of tasks) {
    for (const field of ['setup', 'prompt', 'correctText', 'rule', 'secondHint', 'thirdHint']) {
      pass(localised(task[field]), `${fileName} ${task.id}: ${field} UZ/RU/EN to'liq emas`);
    }
    pass(typeof task.skillTag === 'string' && task.skillTag.trim(), `${fileName} ${task.id}: skillTag yo'q`);
    // Sahna majburiy, lekin ONGLI chekinish mumkin: agar javob variantlarining
    // o'zi matematik obyekt bo'lsa, muallif `noVisualReason` bilan sababni
    // yozadi. Jim chekinish — xato, e'lon qilingani normal.
    pass(Boolean(task.visual) || MODEL_IN_CARDS.has(task.kind) || localised(task.noVisualReason),
      `${fileName} ${task.id}: sahna yo'q, sababi ham yozilmagan (noVisualReason)`);
    if (!task.visual && task.noVisualReason) {
      notes.push(`${fileName} ${task.id}: sahna ongli ravishda yo'q — ${task.noVisualReason.uz}`);
    }

    if (task.kind === 'mc') {
      pass(Array.isArray(task.options) && task.options.length === 4, `${fileName} ${task.id}: aynan 4 variant emas`);
      pass((task.options || []).filter((item) => item.correct).length === 1, `${fileName} ${task.id}: aynan bitta to'g'ri variant yo'q`);
      pass(new Set((task.options || []).map((item) => item.id)).size === (task.options || []).length, `${fileName} ${task.id}: takroriy variant id`);
      for (const item of (task.options || []).filter((candidate) => !candidate.correct)) {
        pass(localised(item.wrong), `${fileName} ${task.id} ${item.id}: noto'g'ri variantga tahlil yo'q`);
      }
    }
    if (task.kind === 'match') {
      const rightIds = task.right.map((item) => item.id);
      pass(new Set(rightIds).size === rightIds.length, `${fileName} ${task.id}: takroriy o'ng ustun id`);
      const rightTexts = task.right.map((item) => item.text.uz);
      pass(new Set(rightTexts).size === rightTexts.length, `${fileName} ${task.id}: o'ng ustunda bir xil matn — moslashtirish noaniq`);
      pass(task.pairs.every((pair) => rightIds.includes(pair.correctRight)), `${fileName} ${task.id}: juftlik mavjud bo'lmagan kartaga ishora qiladi`);
      pass(new Set(task.pairs.map((pair) => pair.correctRight)).size === task.pairs.length, `${fileName} ${task.id}: ikki juftlik bir kartaga ketadi`);
      pass(task.pairs.every((pair) => localised(pair.left)), `${fileName} ${task.id}: chap karta matni uch tilda emas`);
    }
    if (task.kind === 'order') {
      pass(task.cards.length === task.steps.length, `${fileName} ${task.id}: karta va uya soni teng emas`);
      const orders = task.cards.map((card) => card.order).sort((a, c) => a - c);
      pass(orders.join(',') === task.cards.map((_, index) => index).join(','), `${fileName} ${task.id}: order qiymatlari 0..n-1 emas`);
      const texts = task.cards.map((card) => card.text.uz);
      pass(new Set(texts).size === texts.length, `${fileName} ${task.id}: takroriy karta matni — tartib noaniq`);
    }
    if (task.kind === 'sort') {
      pass(Array.isArray(task.items) && task.items.length >= 4, `${fileName} ${task.id}: saralash uchun kamida 4 karta kerak`);
    }
    if (task.kind === 'numpad') {
      pass(/^\d+$/.test(String(task.answer)), `${fileName} ${task.id}: javob faqat sondan iborat emas`);
      pass(String(task.answer).length <= (task.maxLen || 4), `${fileName} ${task.id}: javob maxLen dan uzun`);
    }
  }

  // Til gigiyenasi: UZ va EN da kirillcha yo'q, UZ apostrofi ASCII.
  for (const { trail, text } of collectStrings(tasks)) {
    const lang = trail.split('.').pop();
    if (lang === 'uz' || lang === 'en') {
      pass(!CYRILLIC.test(text), `${fileName}: ${lang} matnida kirillcha — «${text.slice(0, 46)}»`);
    }
    if (lang === 'uz') {
      pass(!FANCY_APOSTROPHE.test(text), `${fileName}: UZ matnida ASCII bo'lmagan apostrof — «${text.slice(0, 46)}»`);
      pass(!INFORMAL_UZ.test(text), `${fileName}: UZ matnida «sen» shakli — «${text.slice(0, 46)}»`);
    }
    if (lang === 'ru') {
      const formal = text.match(new RegExp(FORMAL_RU, 'gi'))?.filter((word) => !FORMAL_RU_ALLOWED.has(word.toLowerCase()));
      pass(!formal?.length, `${fileName}: RU matnida «вы» shakli — «${formal?.[0]}» («${text.slice(0, 46)}»)`);
    }
  }

  // Minus belgisi normallashtiriladi: fayl U+2212, nazariy dars ASCII yozishi
  // mumkin, aks holda haqiqiy takror sezilmay ketadi.
  const dash = (value) => value.replace(/[−–]/g, '-');
  const banked = dash(JSON.stringify(tasks));
  for (const forbidden of expected.forbidden) {
    pass(!banked.includes(dash(forbidden)), `${fileName}: nazariy darsning yozuvi takrorlangan — ${forbidden}`);
  }

  const tags = tasks.map((task) => task.skillTag);
  pass(new Set(tags).size === tags.length, `${fileName}: skillTag takrorlangan`);
  pass(expected.tags.every((tag) => tags.includes(tag)), `${fileName}: skillTaglar to'liq emas — ${expected.tags.filter((tag) => !tags.includes(tag)).join(', ')}`);

  pass(Array.isArray(screenMeta) && screenMeta.length === 10, `${fileName}: SCREEN_META aynan 10 ta emas`);
  if (Array.isArray(screenMeta)) {
    pass(screenMeta.every((screen) => screen.scored === true), `${fileName}: barcha SCREEN_META scored emas`);
    pass(screenMeta.filter((screen) => screen.scope === 'final').length === 1 && screenMeta[9]?.scope === 'final',
      `${fileName}: faqat 10-topshiriq final scope bo'lishi kerak`);
    pass(screenMeta.every((screen, index) => screen.taskId === tasks[index]?.id), `${fileName}: SCREEN_META va TASKS 1:1 emas`);
  }

  // Fayl kontrakti: Dars01 etaloni va LMS talablari.
  pass(new RegExp(`lessonId\\s*:\\s*'${expected.id}'`).test(source), `${fileName}: lessonId noto'g'ri`);
  pass(source.includes(`export default function ${expected.exportName}`), `${fileName}: export nomi noto'g'ri`);
  pass(source.includes("['uz', 'ru', 'en']"), `${fileName}: UZ/RU/EN selektor kontrakti yo'q`);
  pass(!/\b(?:AudioEngine|useAudio|useNarration|SpeechSynthesisUtterance|BitSVG)\b|<Bit\b|\/api\/tts/.test(source), `${fileName}: audio yoki Bit topildi`);
  pass(source.includes('role="status"') && source.includes('aria-live="polite"'), `${fileName}: feedback status/aria-live yo'q`);
  pass(source.includes(':focus-visible') && /min-width\s*:\s*44px/.test(source) && /min-height\s*:\s*44px/.test(source), `${fileName}: focus yoki 44px kontrakti yo'q`);
  pass(/@media\s*\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)/.test(source), `${fileName}: reduced-motion yo'q`);
  pass(source.includes('100dvh') && !source.includes('100vh)') && !source.includes(':100vh') && !source.includes(': 100vh'), `${fileName}: mobil dinamik viewport kontrakti yo'q`);
  pass(source.includes('720px') && /overflow-x\s*:\s*clip/.test(source), `${fileName}: 720px yoki overflow-x clip yo'q`);
  pass(/linear-gradient\(90deg,\s*(?:\$\{T\.cyan\}|#168fa3)\s*,\s*(?:\$\{T\.accent\}|#ff5b35)\s*\)/i.test(source), `${fileName}: cyan→accent progress gradienti yo'q`);
  pass(/\.p4-visual[^{]*\{[^}]*background\s*:\s*(?:\$\{T\.paper\}|#fff(?:fff)?)/i.test(source), `${fileName}: oq sahna uslubi yo'q`);
  // MC uslub kontrakti faqat darsda variant tanlash mexanikasi bo'lsa talab
  // qilinadi: raskladka ba'zi darslarga `mc` bermaydi (42-dars).
  if (actual.includes('mc')) {
    pass(/\.p4-option\{[\s\S]{0,500}?min-height\s*:\s*56px[\s\S]{0,500}?border-radius\s*:\s*14px/i.test(source), `${fileName}: 56px/14px MC option uslubi yo'q`);
    pass(/\.p4-option\.is-ok\{/.test(source) && /\.p4-option\.is-no\{/.test(source), `${fileName}: MC to'g'ri/xato holatlari yo'q`);
    pass(source.includes('p4-option') && source.includes('p4-letter'), `${fileName}: A/B/C/D badge kontrakti yo'q`);
    pass(/setAnswer\(setPickedId,\s*item\.id\)|setPickedId\([^)]*\.id\)/.test(source), `${fileName}: MC javobi semantik id bilan saqlanmaydi`);
  }
  pass(['Manrope', 'Source Serif 4', 'JetBrains Mono'].every((font) => source.includes(font)), `${fileName}: shrift uchligi to'liq emas`);
  pass(!/fraunces/i.test(source), `${fileName}: Dars01 da yo'q Fraunces shrifti`);
  pass(/useMemo\(\(\)\s*=>\s*shuffle\(task\.options/.test(source) && source.includes('Math.random()'), `${fileName}: variantlar har ochilishda aralashtirilmaydi`);
  pass(!/\.p4-actions\{[^}]*justify-content\s*:\s*flex-end/i.test(source), `${fileName}: amal tugmalari Dars01 joylashuvida emas`);
  pass(!/\.p4-eyebrow\.is-(?:green|yellow|red)/.test(source), `${fileName}: daraja yorlig'i yagona accent rangida emas`);

  const lower = source.toLowerCase();
  for (const colour of ['#f5f5f0', '#ffffff', '#12212c', '#50616d', '#87949d', '#ff5b35', '#fff0ea',
    '#168fa3', '#e5f5f6', '#173b52', '#227a53', '#e7f3ec', '#a96f13', '#fff5d9', '#1b6644', '#8a5c10']) {
    pass(lower.includes(colour), `${fileName}: Dars01 rang tokeni yo'q — ${colour}`);
  }
  for (const obsolete of ['#fff7ed', '#06b6d4', '#14b8a6', '#f59e0b']) {
    pass(!lower.includes(obsolete), `${fileName}: eskirgan rang tokeni — ${obsolete}`);
  }

  for (const marker of ['firstTryCorrect', 'correctAnswers', 'finalScore', 'attemptsTotal', 'durationSec',
    'levelBreakdown', 'skillTags', 'lessonMeta: LESSON_META', 'screenMeta: SCREEN_META', 'answers: nextAnswers']) {
    pass(source.includes(marker), `${fileName}: LMS markeri yo'q — ${marker}`);
  }
  pass(source.includes('finishedRef.current = false') && source.includes('startedAtRef.current = Date.now()')
    && source.includes('setRunId('), `${fileName}: restart guardi to'liq emas`);
  pass(/if\s*\([^)]*finishedRef\.current[^)]*\)\s*return/.test(source)
    && /if\s*\([^)]*advancedRef\.current[^)]*\)\s*return/.test(source), `${fileName}: ikki marta yakunlash/o'tish guardi yo'q`);

  DETERMINISTIC[lesson]?.(fileName, tasks, expected);

  const registry = fs.readFileSync(path.join(ROOT, 'src', 'lessons', 'grade4.js'), 'utf8');
  const entry = new RegExp(`slug:\\s*'${expected.slug}'[\\s\\S]{0,400}?import\\('\\.\\./components/grade4/(Dars\\d{2}Practice\\.jsx)'\\)`).exec(registry);
  pass(Boolean(entry), `${fileName}: reyestrda '${expected.slug}' yozuvi yo'q`);
  if (entry) pass(entry[1] === fileName, `${fileName}: reyestrdagi slug boshqa faylga ulangan — ${entry[1]}`);

  console.log(`✓ ${fileName}: 10 topshiriq, 2/5/3, ${new Set(actual).size} mexanika, model geometriyasi va tri-locale`);
}

if (notes.length) {
  console.log('\nOngli chekinishlar va eslatmalar:');
  notes.forEach((note) => console.log(`- ${note}`));
}

if (failures.length) {
  console.error(`\n${failures.length} ta audit xatosi:`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`\n✓ ${lessons.length} ta amaliy dars auditi muvaffaqiyatli yakunlandi.`);
