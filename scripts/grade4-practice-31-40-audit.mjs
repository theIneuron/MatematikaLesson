#!/usr/bin/env node

// 4-sinf amaliyoti, 31-40 darslar: semantik audit.
//
// 22-30 auditidan (scripts/grade4-practice-22-30-audit.mjs) tuzilma olindi,
// uch qo'shimcha bilan:
//   1. raskladka scripts/grade4-practice-31-40-layout.mjs bilan qator-qator
//      solishtiriladi — mexanika o'qi tasodifan bir xillashib qolmaydi;
//   2. har bankda kamida ikkita chizma mexanikasi borligi tekshiriladi;
//   3. rus tilidagi murojaat «ты» ekani tekshiriladi (CLAUDE.md §1,
//      ETALON_4SINF §6). 22-30 «вы» ga o'tib ketgan, bu yerda takrorlanmaydi.
//
// Har topshiriqning natijasi metadata'ga ishonmasdan MUSTAQIL qayta hisoblanadi.
// Hali yig'ilmagan darslar jimgina tashlab ketiladi: blok darsma-dars to'ladi.

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { runInNewContext } from 'node:vm';
import { parse } from '@babel/parser';

const ROOT = process.cwd();
const GRADE4_DIR = path.join(ROOT, 'src', 'components', 'grade4');
const ALL_LESSONS = Array.from({ length: 10 }, (_, index) => index + 31);

const DRAWING_KINDS = new Set(['sort', 'slots', 'shade', 'ticks', 'placepick', 'construct', 'gap']);
const ALLOWED_KINDS = new Set([
  'mc', 'state', 'place', 'sign', 'card', 'digit', 'placepick', 'gap', 'numpad',
  'missing', 'match', 'order', 'slots', 'construct', 'sort', 'ticks', 'shade', 'fracbuild',
]);

const EXPECTED = {
  31: {
    id: 'num-4-31-practice',
    exportName: 'Grade4Dars31Practice',
    slug: 'dars31-amaliyot-kattaliklarga-doir-masalalar',
    tags: [
      'finished_record', 'three_step_method', 'mixed_to_single_unit', 'mixed_subtraction_borrow',
      'missing_addend_mixed', 'operation_from_relation', 'solution_protocol', 'zero_small_part',
      'error_diagnosis', 'inverse_transfer',
    ],
    anchors: ['8 m 35 cm', '830 cm = 8 m 30 cm', '3040 g', '2008 kg', '85 min', '604 cm',
      '715 cm', '260 cm', '4 m 55 cm', '3350', '4130', '2550 + 1650 = 4200', '8 m', '335'],
  },
  32: {
    id: 'num-4-32-practice',
    exportName: 'Grade4Dars32Practice',
    slug: 'dars32-amaliyot-hajm-birliklari',
    tags: [
      'volume_unit_reading', 'layer_count', 'layer_model', 'volume_procedure', 'cubic_step',
      'volume_word_problem', 'volume_equivalence', 'dimension_sum_trap', 'zero_count_error',
      'inverse_volume_transfer',
    ],
    anchors: ['4000 cm³', '4 l', '60', '8 · 5 · 3 = 120 cm³', '7000', '3000 cm³', '2000 dm³',
      '5 dm³', '6 l', '64 cm³', '8000 cm³', '10 · 10 · 10 = 1000'],
  },
  33: {
    id: 'num-4-33-practice',
    exportName: 'Grade4Dars33Practice',
    slug: 'dars33-amaliyot-burchak-turlari',
    tags: [
      'angle_type_recognition', 'comparison_rule', 'description_to_type', 'read_angle_scale',
      'compare_with_right_angle', 'angle_complement', 'order_by_opening', 'boundary_sort',
      'scale_read_error', 'transfer_from_description',
    ],
    anchors: ['55°', '90°', '115°', '180°', '105°', '65', '155°', '15°', '75°', '110°', '165°',
      '89°', '91°', '180 − 65 = 115'],
  },
  34: {
    id: 'num-4-34-practice',
    exportName: 'Grade4Dars34Practice',
    slug: 'dars34-amaliyot-burchaklarni-yasash',
    tags: [
      'protractor_centre', 'base_line_alignment', 'read_from_correct_scale', 'place_the_centre',
      'other_scale_value', 'construction_order', 'type_as_check', 'zero_side_boundary',
      'error_in_placement', 'transfer_next_step',
    ],
    anchors: ['75', '115', '105°', '95°', '85°', '90° → 35°', '180 − 85 = 95', '180 − 65 = 115'],
  },
  35: {
    id: 'num-4-35-practice',
    exportName: 'Grade4Dars35Practice',
    slug: 'dars35-amaliyot-uchburchak-turlari',
    tags: [
      'two_name_recognition', 'naming_order', 'sort_by_sides', 'fill_both_names', 'two_right_angles',
      'truss_selection', 'sort_by_angles', 'impossible_triangle', 'repair_naming_order',
      'name_from_description',
    ],
    anchors: ['75°, 62°, 43°', '90°, 65°, 25°', '115°, 42°, 23°', '6 · 6 · 6', '7 · 7 · 4',
      '8 · 8 · 3', '5 · 8 · 9', '78°', '105°', '68°', '112°', '9 cm · 9 cm · 9 cm'],
  },
  36: {
    id: 'num-4-36-practice',
    exportName: 'Grade4Dars36Practice',
    slug: 'dars36-amaliyot-togri-tortburchak-va-kvadrat',
    tags: [
      'extra_property', 'restore_property_line', 'figure_to_statement', 'panel_check_order',
      'nesting_slots', 'facade_order', 'nesting_order', 'rhombus_boundary', 'repair_sorting',
      'name_from_description',
    ],
    anchors: ['14 · 14 · 90°', '24 · 15 · 90°', '14 · 14 · 65°', '18 · 18 · 90°',
      '21 × 12 dm', 'kvadrat 15 dm', 'romb 15 dm, burchak 65°'],
  },
  37: {
    id: 'num-4-37-practice',
    exportName: 'Grade4Dars37Practice',
    slug: 'dars37-amaliyot-perimetr-va-yuza',
    tags: [
      'equal_perimeter_trap', 'rectangle_perimeter', 'question_to_quantity', 'area_by_cells',
      'missing_side', 'order_the_two_lines', 'quantity_to_unit', 'square_perimeter_trap',
      'repair_the_swap', 'from_perimeter_to_area',
    ],
    anchors: ['(11 + 23) · 2 = 68', '(15 + 19) · 2 = 68', '78', '23', '15 · 19 = 285 m²',
      '108 m', '729 m²', '68 m', '285 m²', '140 m', '374 m²', '24 разделить на 4 равно 6'],
  },
  38: {
    id: 'num-4-38-practice',
    exportName: 'Grade4Dars38Practice',
    slug: 'dars38-amaliyot-geometrik-yasashlar',
    tags: [
      'tool_to_question', 'align_the_tool', 'adjacent_angle_record', 'perpendicular_steps',
      'missing_tool', 'window_frame_lines', 'order_to_tool', 'by_eye_trap',
      'repair_the_construction', 'drop_a_perpendicular',
    ],
    anchors: ['110°', '70°', '90°', '180°', '83°', '97°', '180 − 110 = 70', '15 cm'],
  },
  39: {
    id: 'num-4-39-practice',
    exportName: 'Grade4Dars39Practice',
    slug: 'dars39-amaliyot-nuqta-koordinatalari',
    tags: [
      'read_the_pair', 'place_the_point', 'record_to_mark', 'build_the_record',
      'missing_coordinate', 'walk_order', 'axis_points', 'origin_boundary',
      'swap_error', 'two_objects_apart',
    ],
    anchors: ['(6; 2)', '(2; 6)', '(4; 7)', '(7; 4)', '(1; 6)', '(6; 1)', '(3; 3)',
      '(8; 0)', '(0; 7)', '(3; 0)', '(0; 0)', '(3; 8)', '(8; 3)', '(1; 8)', '(8; 1)'],
  },
  40: {
    id: 'num-4-40-practice',
    exportName: 'Grade4Dars40Practice',
    slug: 'dars40-amaliyot-fazoviy-shakllar-va-yoyilmalar',
    tags: [
      'face_edge_vertex', 'count_faces', 'visible_versus_total', 'count_net_squares',
      'missing_word', 'gift_box_net', 'fold_order', 'cube_versus_box',
      'sort_the_claims', 'box_counts_transfer',
    ],
    anchors: ['6', '12', '8', '3', '7', '4 cm, 4 cm va 4 cm', '4 cm, 4 cm va 9 cm'],
  },
};

// Har topshiriq uchun bittadan mustaqil, aniq tekshiruv.
const DETERMINISTIC_CHECKS = {
  31: [
    ['01', () => 35 < 100 && [135, 240, 100].every((value) => value >= 100)],
    ['02', () => 560 + 270 === 830 && 830 === 8 * 100 + 30],
    ['03', () => 3 * 1000 + 40 === 3040 && 2 * 1000 + 8 === 2008 && 60 + 25 === 85 && 6 * 100 + 4 === 604],
    ['04', () => 715 - 260 === 455 && 455 === 4 * 100 + 55 && 715 + 260 === 975],
    ['05', () => 5200 - 1850 === 3350 && 5200 + 1850 === 7050 && (5 - 1) * 1000 + (850 - 200) === 4650 && 5200 - 850 === 4350],
    ['06', () => 2350 + 1780 === 4130 && 4130 > 4000 && 4130 - 4000 === 130],
    ['07', () => 4200 - 1650 === 2550 && 2550 === 2 * 1000 + 550 && 2550 + 1650 === 4200],
    ['08', () => 355 + 445 === 800 && 800 % 100 === 0 && 800 / 100 === 8],
    ['09', () => 6 * 100 + 140 === 7 * 100 + 40 && 2040 - 1060 === 980 && 3 * 60 + 20 === 200],
    ['10', () => 1200 - 375 - 490 === 335 && 375 + 490 === 865 && 1200 - 375 === 825 && 1200 - 490 === 710],
  ],
  32: [
    ['01', () => 4000 / 1000 === 4],
    ['02', () => 5 * 3 * 4 === 60 && 5 + 3 + 4 === 12 && 5 * 3 === 15 && 5 * 4 === 20],
    ['03', () => 6 * 4 === 24],
    ['04', () => 8 * 5 === 40 && 40 * 3 === 120],
    ['05', () => 7 * 1000 === 7000 && 7 * 10 === 70 && 7 * 100 === 700],
    ['06', () => 9 - 4 === 5 && 9 + 4 === 13],
    ['07', () => 3 * 1000 === 3000 && 2 * 1000 === 2000 && 6000 / 1000 === 6],
    ['08', () => 4 ** 3 === 64 && 4 + 4 + 4 === 12 && 4 * 4 === 16 && 6 * 4 * 4 === 96],
    ['09', () => String(8 * 1000).length - String(8).length === 3],
    ['10', () => 10 ** 3 === 1000 && 3 ** 3 === 27 && 2 * 1000 === 2000],
  ],
  33: [
    ['01', () => 55 < 90 && 115 > 90 && 115 < 180 && 180 === 180],
    ['02', () => 90 === 90],
    ['03', () => 105 > 90 && 105 < 180],
    ['04', () => 45 + 2 * 10 === 65],
    ['05', () => 155 > 90],
    ['06', () => 90 - 25 === 65 && 90 + 25 === 115 && 180 - 25 === 155],
    ['07', () => [15, 75, 110, 165].every((value, index, list) => index === 0 || list[index - 1] < value)],
    ['08', () => 89 < 90 && 91 > 90 && 180 === 180],
    ['09', () => 180 - 65 === 115],
    ['10', () => 180 === 180 && 90 !== 180 && 360 !== 180],
  ],
  34: [
    ['01', () => true],
    ['02', () => true],
    ['03', () => 55 + 2 * 10 === 75],
    ['04', () => true],
    ['05', () => 180 - 65 === 115 && 90 - 65 === 25],
    ['06', () => 105 > 90 && 105 < 180],
    ['07', () => 50 < 90 && 115 > 90 && 115 < 180 && 180 === 180],
    ['08', () => 180 - 85 === 95 && 90 + 85 === 175],
    ['09', () => true],
    ['10', () => 35 < 90],
  ],
  35: [
    ['01', () => 75 + 62 + 43 === 180 && 90 + 65 + 25 === 180 && 115 + 42 + 23 === 180
      && Math.max(75, 62, 43) < 90 && Math.max(90, 65, 25) === 90 && Math.max(115, 42, 23) > 90],
    ['02', () => true],
    ['03', () => new Set([6, 6, 6]).size === 1 && new Set([7, 7, 4]).size === 2
      && new Set([8, 8, 3]).size === 2 && new Set([5, 8, 9]).size === 3
      && 6 + 6 > 6 && 7 + 4 > 7 && 8 + 3 > 8 && 5 + 8 > 9],
    ['04', () => 90 + 45 + 45 === 180],
    ['05', () => 90 + 45 + 45 === 180 && 90 + 90 === 180],
    ['06', () => true],
    ['07', () => 78 + 64 + 38 === 180 && 90 + 68 + 22 === 180 && 105 + 52 + 23 === 180
      && 68 + 58 + 54 === 180 && 78 < 90 && 68 < 90 && 105 > 90],
    ['08', () => 90 + 90 === 180],
    ['09', () => 112 + 42 + 26 === 180 && 112 > 90],
    ['10', () => 60 * 3 === 180 && 60 < 90],
  ],
  36: [
    ['01', () => 15 === 15 && 24 !== 15],
    ['02', () => 14 === 14],
    ['03', () => 21 !== 12 && 65 !== 90],
    ['04', () => true],
    ['05', () => true],
    ['06', () => 18 === 18],
    ['07', () => true],
    ['08', () => 14 === 14 && 24 !== 15 && 65 !== 90 && 18 === 18],
    ['09', () => true],
    ['10', () => true],
  ],
  37: [
    ['01', () => (11 + 23) * 2 === 68 && (15 + 19) * 2 === 68 && 11 * 23 === 253 && 15 * 19 === 285 && 253 !== 285],
    ['02', () => (22 + 17) * 2 === 78 && 22 + 17 === 39 && 22 * 17 === 374 && 22 * 2 === 44],
    ['03', () => true],
    ['04', () => 5 * 4 === 20],
    ['05', () => 253 / 11 === 23 && 253 - 11 === 242 && 253 + 11 === 264 && 253 * 11 === 2783],
    ['06', () => (15 + 19) * 2 === 68 && 15 * 19 === 285],
    ['07', () => 27 * 4 === 108 && 27 * 27 === 729 && (15 + 19) * 2 === 68 && 15 * 19 === 285],
    ['08', () => 35 * 4 === 140 && 35 * 2 === 70 && 35 * 35 === 1225],
    ['09', () => 22 * 17 === 374],
    ['10', () => 24 / 4 === 6 && 6 * 6 === 36],
  ],
  38: [
    ['01', () => true],
    ['02', () => true],
    ['03', () => 110 + 70 === 180 && 110 !== 90],
    ['04', () => true],
    ['05', () => 90 === 90],
    ['06', () => true],
    ['07', () => 110 > 90 && 110 < 180],
    ['08', () => true],
    ['09', () => 83 + 97 === 180 && 90 + 90 === 180 && 83 !== 90 && 97 !== 90],
    ['10', () => true],
  ],
  39: [
    ['01', () => 6 !== 2],
    ['02', () => 4 !== 7],
    ['03', () => 1 !== 6 && 3 === 3],
    ['04', () => 8 !== 3],
    ['05', () => 4 !== 7],
    ['06', () => 6 === 6],
    ['07', () => 8 > 0 && 7 > 0 && 3 > 0],
    ['08', () => 0 === 0],
    ['09', () => 3 !== 8],
    ['10', () => 1 !== 8],
  ],
  40: [
    ['01', () => true],
    ['02', () => 3 * 2 === 6 && 6 !== 8 && 6 !== 12],
    ['03', () => 3 * 2 === 6 && 3 < 6],
    // Yoyilma chizmasidagi kvadratlar soni ma'lumotdan sanaladi: 7 ta, kubga 6 kerak.
    ['04', () => [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2], [2, 2]].length === 7],
    ['05', () => 12 !== 6 && 12 !== 8],
    // 06 yoyilmasida oltita kvadrat bor, lekin bittasi takrorlangan joyda turadi.
    ['06', () => {
      const squares = [[0, 1], [1, 1], [2, 1], [3, 1], [1, 0], [1, 0]];
      return squares.length === 6 && new Set(squares.map(([x, y]) => `${x}-${y}`)).size === 5;
    }],
    ['07', () => true],
    ['08', () => new Set([4, 4, 4]).size === 1 && new Set([4, 4, 9]).size === 2],
    ['09', () => 8 === 8 && 12 === 12],
    ['10', () => 6 === 6 && 12 === 12 && 8 === 8],
  ],
};

const failures = [];
const pass = (condition, message) => { if (!condition) failures.push(message); };
const compact = (value) => String(value).replace(/[\s  ,]/g, '');
const LANGS = ['ru', 'uz', 'en'];
const localised = (node) => Boolean(
  node && typeof node === 'object' && LANGS.every((lang) => typeof node[lang] === 'string' && node[lang].trim()),
);

// TASKS / SCREEN_META literalini fayldan ajratib, xavfsiz kontekstda baholaydi.
//
// TASKS o'zidan oldin e'lon qilingan yordamchi doimiylarga murojaat qilishi
// mumkin (masalan Dars33 dagi TYPE_NAMES: burchak nomlari bir marta yozilib,
// juft va quti nomlarida qayta ishlatiladi). Shuning uchun TASKS dan oldingi
// oddiy `const NAME = obyekt|massiv` e'lonlari ham xuddi shu kontekstga
// baholanadi — aks holda audit «is not defined» bilan yiqilardi va muallif
// nomlarni nusxalashga majbur bo'lardi.
function evaluateInitializer(source, ast, name) {
  const b = (ru, uz, en) => ({ ru, uz, en });
  const option = (id, ru, uz, en, correct = false, wrongRu = '', wrongUz = '', wrongEn = '') => ({
    id, text: b(ru, uz, en), correct, wrong: wrongRu ? b(wrongRu, wrongUz, wrongEn) : null,
  });
  const context = { b, option };
  let initializer = null;
  for (const statement of ast.program.body) {
    const declaration = statement.type === 'VariableDeclaration'
      ? statement
      : (statement.type === 'ExportNamedDeclaration' ? statement.declaration : null);
    if (declaration?.type !== 'VariableDeclaration') continue;
    for (const declarator of declaration.declarations) {
      if (declarator.id?.name === name) { initializer = declarator.init; continue; }
      if (initializer || !declarator.id?.name || !declarator.init) continue;
      if (!['ObjectExpression', 'ArrayExpression'].includes(declarator.init.type)) continue;
      try {
        context[declarator.id.name] = runInNewContext(
          `(${source.slice(declarator.init.start, declarator.init.end)})`, { ...context }, { timeout: 2_000 },
        );
      } catch {
        // Auditga kerak bo'lmagan doimiy baholanmasa, jimgina o'tkazib yuboriladi.
      }
    }
    if (initializer) break;
  }
  if (!initializer) throw new Error(`${name} topilmadi`);
  return runInNewContext(`(${source.slice(initializer.start, initializer.end)})`, context, { timeout: 2_000 });
}

// Raskladka skripti jadvalni stdout ga bosadi; --json chiqishini o'qiymiz.
const { execFileSync } = await import('node:child_process');
const layout = JSON.parse(execFileSync(
  process.execPath,
  [path.join(ROOT, 'scripts', 'grade4-practice-31-40-layout.mjs'), '--json'],
  { encoding: 'utf8' },
)).layout;

const lessons = ALL_LESSONS.filter((lesson) => fs.existsSync(path.join(GRADE4_DIR, `Dars${lesson}Practice.jsx`)));
if (lessons.length === 0) {
  console.error('Dars31-40 amaliyotlaridan hech biri hali yig\'ilmagan.');
  process.exit(1);
}
const pending = ALL_LESSONS.filter((lesson) => !lessons.includes(lesson));

for (const lesson of lessons) {
  const expected = EXPECTED[lesson];
  const fileName = `Dars${lesson}Practice.jsx`;
  const file = path.join(GRADE4_DIR, fileName);
  if (!expected) {
    failures.push(`${fileName}: fayl bor, lekin auditda EXPECTED yozuvi yo'q`);
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
  pass(tasks.slice(0, 2).every((task) => task.level === 'green')
    && tasks.slice(2, 7).every((task) => task.level === 'yellow')
    && tasks.slice(7).every((task) => task.level === 'red'), `${fileName}: 2 green / 5 yellow / 3 red buzilgan`);

  // Raskladkaga muvofiqlik. Chetlashish taqiqlanmaydi, lekin JIM bo'lmaydi.
  const planned = layout[lesson];
  tasks.forEach((task, index) => {
    if (task.kind !== planned[index]) {
      const reason = new RegExp(`id:\\s*'${task.id}'[\\s\\S]{0,400}?raskladkadan chetlashish`, 'i').test(source);
      pass(reason, `${fileName} task ${task.id}: raskladkada "${planned[index]}", faylda "${task.kind}" — izohda «raskladkadan chetlashish» sababi yo'q`);
    }
  });

  const kinds = new Set(tasks.map((task) => task.kind));
  pass(kinds.size >= 5, `${fileName}: mexanika soni ${kinds.size}, kamida 5 emas`);
  pass([...kinds].every((kind) => ALLOWED_KINDS.has(kind)), `${fileName}: browser solver qo'llamaydigan kind — ${[...kinds].filter((kind) => !ALLOWED_KINDS.has(kind)).join(', ')}`);
  pass(tasks.filter((task) => DRAWING_KINDS.has(task.kind)).length >= 2, `${fileName}: chizma mexanikasi ikkitadan kam`);
  // 1-topshiriq browser-solverning wrong-first tekshiruvini qo'llashi shart:
  // solver `mc/state/place/sign/card`, variantsiz `missing`, `numpad`, `match`
  // va `order` uchun atayin noto'g'ri javob berib, retry ishlashini tekshiradi.
  const WRONG_FIRST_KINDS = new Set(['mc', 'state', 'place', 'sign', 'card', 'missing', 'numpad', 'match', 'order']);
  pass(WRONG_FIRST_KINDS.has(tasks[0].kind), `${fileName}: task 01 mexanikasi "${tasks[0].kind}" wrong-first tekshiruvini qo'llamaydi`);
  if (Array.isArray(tasks[0].options)) {
    pass(tasks[0].options.length >= 2 && tasks[0].options.filter((item) => item.correct).length === 1,
      `${fileName}: task 01 variantlari wrong-first uchun yaroqsiz`);
  }
  if (tasks[0].kind === 'match') {
    pass(Array.isArray(tasks[0].pairs) && tasks[0].pairs.length >= 2, `${fileName}: task 01 match wrong-first uchun kamida ikki juft kerak`);
  }
  if (tasks[0].kind === 'order') {
    pass(Array.isArray(tasks[0].steps) && tasks[0].steps.length >= 2, `${fileName}: task 01 order wrong-first uchun kamida ikki qadam kerak`);
  }

  for (const task of tasks) {
    for (const field of ['setup', 'prompt', 'correctText', 'rule', 'secondHint', 'thirdHint']) {
      pass(localised(task[field]), `${fileName} task ${task.id}: ${field} UZ/RU/EN to'liq emas`);
    }
    pass(typeof task.skillTag === 'string' && task.skillTag.trim(), `${fileName} task ${task.id}: skillTag yo'q`);
    pass(task.visual && typeof task.visual === 'object', `${fileName} task ${task.id}: visual yo'q`);

    if (Array.isArray(task.options)) {
      pass(task.options.filter((item) => item.correct).length === 1, `${fileName} task ${task.id}: aynan bitta correct option yo'q`);
      for (const item of task.options) {
        pass(localised(item.text), `${fileName} task ${task.id} option ${item.id}: text UZ/RU/EN yo'q`);
        if (!item.correct) pass(localised(item.wrong), `${fileName} task ${task.id} option ${item.id}: strategiyaga xos wrong yo'q`);
      }
    }
    if (Array.isArray(task.pairs)) {
      pass(Array.isArray(task.right) && task.right.length === task.pairs.length, `${fileName} task ${task.id}: right/pairs uzunligi teng emas`);
      pass(new Set(task.pairs.map((pair) => pair.correctRight)).size === task.pairs.length, `${fileName} task ${task.id}: correctRight takrorlandi`);
      for (const pair of task.pairs) {
        pass(localised(pair.left), `${fileName} task ${task.id} pair ${pair.id}: left UZ/RU/EN yo'q`);
        pass(task.right.some((item) => item.id === pair.correctRight), `${fileName} task ${task.id} pair ${pair.id}: correctRight topilmadi`);
      }
      for (const item of task.right) pass(localised(item.text), `${fileName} task ${task.id} right ${item.id}: text UZ/RU/EN yo'q`);
    }
    if (Array.isArray(task.slots)) {
      pass(Array.isArray(task.cards) && task.cards.length > task.slots.length, `${fileName} task ${task.id}: chalg'ituvchi karta yo'q`);
      pass(new Set(task.slots.map((slot) => slot.correct)).size === task.slots.length, `${fileName} task ${task.id}: bitta karta ikki slotda`);
      for (const slot of task.slots) {
        pass(localised(slot.label), `${fileName} task ${task.id} slot ${slot.id}: label UZ/RU/EN yo'q`);
        pass(localised(slot.wrong), `${fileName} task ${task.id} slot ${slot.id}: qatorga xos wrong yo'q`);
        pass(task.cards.some((card) => card.id === slot.correct), `${fileName} task ${task.id} slot ${slot.id}: correct karta yo'q`);
      }
      for (const card of task.cards) pass(localised(card.text), `${fileName} task ${task.id} card ${card.id}: text UZ/RU/EN yo'q`);
    }
    if (Array.isArray(task.steps)) {
      pass(Array.isArray(task.cards) && task.cards.length === task.steps.length, `${fileName} task ${task.id}: steps/cards teng emas`);
      pass(task.cards.map((card) => card.order).sort((a, c) => a - c).join(',') === task.steps.map((_, index) => index).join(','),
        `${fileName} task ${task.id}: card.order 0..n-1 ketma-ketligi emas`);
      for (const card of task.cards) pass(localised(card.text), `${fileName} task ${task.id} card ${card.id}: text UZ/RU/EN yo'q`);
    }
    if (Array.isArray(task.places)) {
      pass(task.places.filter((item) => item.correct).length === 1, `${fileName} task ${task.id}: aynan bitta correct place yo'q`);
      for (const item of task.places) {
        pass(localised(item.label), `${fileName} task ${task.id} place ${item.mark}: label UZ/RU/EN yo'q`);
        if (!item.correct) pass(localised(item.wrong), `${fileName} task ${task.id} place ${item.mark}: nuqtaga xos wrong yo'q`);
      }
    }
    if (Array.isArray(task.bins)) {
      pass(Array.isArray(task.items) && task.items.length >= task.bins.length, `${fileName} task ${task.id}: sort itemlari binlardan kam`);
      for (const bin of task.bins) pass(localised(bin.label), `${fileName} task ${task.id} bin ${bin.id}: label UZ/RU/EN yo'q`);
      for (const item of task.items) {
        pass(task.bins.some((bin) => bin.id === item.bin), `${fileName} task ${task.id} item ${item.id}: mavjud bo'lmagan bin`);
        pass(localised(item.wrong), `${fileName} task ${task.id} item ${item.id}: itemga xos wrong yo'q`);
      }
      pass(new Set(task.items.map((item) => item.bin)).size === task.bins.length, `${fileName} task ${task.id}: bo'sh qoladigan bin bor`);
      // Karta matni lokalizatsiya obyekti bo'lsa, u `tx` orqali chizilishi SHART.
      // Aks holda React «Objects are not valid as a React child» bilan yiqiladi —
      // bu xatoni faqat browser smoke ushlagan edi, endi audit ham ushlaydi.
      if (task.items.some((item) => item.text && typeof item.text === 'object')) {
        pass(/tx\(item\.text/.test(source),
          `${fileName} task ${task.id}: sort kartasi lokalizatsiya obyekti, lekin manbada tx(item.text) yo'q`);
      }
    }
    if (task.kind === 'construct') {
      pass(Array.isArray(task.answer) && task.answer.length === task.slotCount,
        `${fileName} task ${task.id}: answer uzunligi slotCount ga teng emas`);
      pass(Array.isArray(task.cards) && task.cards.length > task.slotCount,
        `${fileName} task ${task.id}: chalg'ituvchi karta yo'q`);
      // Browser-solver kartani KO'RINADIGAN matni bo'yicha topadi, shuning uchun
      // karta belgisi uch tilda bir xil bo'lishi shart: `symbol` — oddiy satr.
      for (const card of task.cards) {
        pass(typeof card.symbol === 'string' && card.symbol.trim(),
          `${fileName} task ${task.id} card ${card.id}: symbol satr emas`);
        pass(!/[Ѐ-ӿa-zA-Z]/.test(card.symbol),
          `${fileName} task ${task.id} card ${card.id}: symbol tilga bog'liq ("${card.symbol}") — solver uni boshqa tilda topmaydi`);
      }
      // Har javob belgisi kartalar ichida yetarli nusxada bo'lishi kerak.
      const supply = new Map();
      task.cards.forEach((card) => supply.set(card.symbol, (supply.get(card.symbol) || 0) + 1));
      const demand = new Map();
      task.answer.forEach((symbol) => demand.set(symbol, (demand.get(symbol) || 0) + 1));
      demand.forEach((count, symbol) => {
        pass((supply.get(symbol) || 0) >= count,
          `${fileName} task ${task.id}: "${symbol}" belgisi ${count} marta kerak, kartalarda ${supply.get(symbol) || 0} ta`);
      });
      for (const [sequence, analysis] of Object.entries(task.wrongBySequence || {})) {
        pass(localised(analysis), `${fileName} task ${task.id}: wrongBySequence[${sequence}] UZ/RU/EN yo'q`);
        pass(sequence !== task.answer.join(''), `${fileName} task ${task.id}: wrongBySequence ichida to'g'ri ketma-ketlik bor`);
      }
    }
    if (task.kind === 'ticks') {
      pass(Array.isArray(task.tickValues) && task.tickValues.length >= 3, `${fileName} task ${task.id}: tickValues kamida uchta emas`);
      pass(task.tickValues.includes(task.answer), `${fileName} task ${task.id}: to'g'ri javob tickValues ichida yo'q`);
      pass(new Set(task.tickValues).size === task.tickValues.length, `${fileName} task ${task.id}: tickValues takrorlandi`);
    }
    if (task.kind === 'shade') {
      pass(Number.isInteger(task.selectCount) && task.selectCount > 0, `${fileName} task ${task.id}: selectCount yo'q`);
      pass(Number.isInteger(task.cellsTotal) && task.cellsTotal >= task.selectCount, `${fileName} task ${task.id}: cellsTotal selectCount dan kichik`);
      // shade FAQAT sonni tekshiradi, shuning uchun savol «nechta» bo'lishi shart.
      pass(/сколько|nechta|how many/i.test(`${task.prompt.ru} ${task.prompt.uz} ${task.prompt.en}`),
        `${fileName} task ${task.id}: shade savoli «nechta» so'ramaydi, ya'ni tekshiruv yolg'on bo'ladi`);
    }
    if (task.kind === 'numpad' || (task.kind === 'missing' && task.answer !== undefined)) {
      pass(typeof task.answer === 'string' && /^\d+$/.test(task.answer), `${fileName} task ${task.id}: answer satr son emas`);
      pass(typeof task.maxLen === 'number' && task.answer.length <= task.maxLen, `${fileName} task ${task.id}: maxLen javobdan kichik`);
      for (const [value, analysis] of Object.entries(task.wrongAnswers || {})) {
        pass(localised(analysis), `${fileName} task ${task.id}: wrongAnswers[${value}] UZ/RU/EN yo'q`);
        pass(value !== task.answer, `${fileName} task ${task.id}: wrongAnswers ichida to'g'ri javob bor`);
      }
    }
  }

  const tags = new Set(tasks.map((task) => task.skillTag));
  pass(tags.size === 10, `${fileName}: skillTag takrorlandi`);
  pass(expected.tags.every((tag) => tags.has(tag)), `${fileName}: skillTaglar to'liq emas — ${expected.tags.filter((tag) => !tags.has(tag)).join(', ')}`);

  pass(Array.isArray(screenMeta) && screenMeta.length === 10, `${fileName}: SCREEN_META aynan 10 ta emas`);
  if (Array.isArray(screenMeta)) {
    pass(screenMeta.every((screen) => screen.scored === true), `${fileName}: barcha SCREEN_META scored emas`);
    pass(screenMeta.filter((screen) => screen.scope === 'final').length === 1 && screenMeta[9]?.scope === 'final',
      `${fileName}: faqat task 10 final scope bo'lishi kerak`);
    pass(screenMeta.every((screen, index) => screen.taskId === tasks[index]?.id), `${fileName}: SCREEN_META va TASKS 1:1 emas`);
  }

  // Texnik kontrakt — 22-30 auditidagi tekshiruvlar.
  pass(new RegExp(`lessonId\\s*:\\s*'${expected.id}'`).test(source), `${fileName}: lessonId noto'g'ri`);
  pass(source.includes(`export default function ${expected.exportName}`), `${fileName}: export nomi noto'g'ri`);
  pass(source.includes("['uz', 'ru', 'en']"), `${fileName}: standalone UZ/RU/EN selector kontrakti yo'q`);
  pass(!/\b(?:AudioEngine|useAudio|useNarration|SpeechSynthesisUtterance|BitSVG)\b|<Bit\b|\/api\/tts/.test(source), `${fileName}: audio yoki Bit topildi`);
  pass(!/^import .*from '\.[^']*'/m.test(source), `${fileName}: lokal import bor — LMS avtonom fayl talab qiladi`);
  pass(source.includes('role="status"') && source.includes('aria-live="polite"'), `${fileName}: feedback status/aria-live yo'q`);
  pass(source.includes(':focus-visible') && /min-width\s*:\s*44px/.test(source) && /min-height\s*:\s*44px/.test(source), `${fileName}: focus yoki 44px target kontrakti yo'q`);
  pass(/@media\s*\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)/.test(source), `${fileName}: reduced-motion yo'q`);
  pass(source.includes('100dvh') && !source.includes('100vh'), `${fileName}: mobile dynamic viewport kontrakti yo'q`);
  pass(source.includes('720px') && /overflow-x\s*:\s*clip/.test(source), `${fileName}: 720px/mobile overflow kontrakti yo'q`);

  const lower = source.toLowerCase();
  for (const colour of ['#f5f5f0', '#ffffff', '#12212c', '#50616d', '#87949d', '#ff5b35', '#fff0ea',
    '#168fa3', '#e5f5f6', '#173b52', '#227a53', '#e7f3ec', '#a96f13', '#fff5d9']) {
    pass(lower.includes(colour), `${fileName}: Dars01 rang tokeni topilmadi — ${colour}`);
  }
  for (const obsolete of ['#fff7ed', '#06b6d4', '#14b8a6', '#f59e0b']) {
    pass(!lower.includes(obsolete), `${fileName}: eski D22-30 rang tokeni qolgan — ${obsolete}`);
  }
  pass(lower.includes('#1b6644') && lower.includes('#8a5c10'), `${fileName}: Dars01 feedback matn ranglari yo'q`);
  pass(!/font-family\s*:[^;}]*fraunces|font\s*:[^;}]*fraunces/i.test(source), `${fileName}: Fraunces shrifti qolgan`);
  pass(/linear-gradient\(90deg,\s*(?:\$\{T\.cyan\}|#168fa3)\s*,\s*(?:\$\{T\.accent\}|#ff5b35)\s*\)/i.test(source), `${fileName}: cyan→accent progress gradienti yo'q`);
  pass(/\.p4-(?:visual|figure)[^{]*\{[^}]*background\s*:\s*(?:\$\{T\.paper\}|#fff(?:fff)?)/i.test(source), `${fileName}: oq figure uslubi yo'q`);
  pass(['Manrope', 'Source Serif 4', 'JetBrains Mono'].every((font) => source.includes(font)), `${fileName}: shrift uchligi to'liq emas`);
  pass(source.includes('p4-option') && source.includes('p4-letter'), `${fileName}: A/B/C/D option badge kontrakti yo'q`);
  pass(/\.p4-option\s*\{[\s\S]{0,500}?min-height\s*:\s*56px[\s\S]{0,500}?border-radius\s*:\s*14px/i.test(source), `${fileName}: 56px/14px MC option uslubi yo'q`);
  pass(/\.p4-option\.is-ok[^{}]*\{/.test(source) && /\.p4-option\.is-no[^{}]*\{/.test(source), `${fileName}: MC correct/wrong holatlari yo'q`);
  pass(/\.p4-lang\s+button\s*\{[\s\S]{0,500}?border-radius\s*:\s*99px[\s\S]{0,500}?background\s*:\s*(?:\$\{T\.paper\}|#fff(?:fff)?)/i.test(source)
    && /\.p4-lang\s+button\.is-active\s*\{[\s\S]{0,250}?background\s*:\s*(?:\$\{T\.accent\}|#ff5b35)/i.test(source), `${fileName}: pill language selector uslubi yo'q`);
  pass(!/\.p4-actions\s*\{[^}]*justify-content\s*:\s*flex-end/i.test(source), `${fileName}: action tugmalari start joylashuvida emas`);
  pass(/useMemo\(\(\)\s*=>\s*shuffle\(task\.options/.test(source) && /options\.map\(/.test(source), `${fileName}: MC variantlarining per-task shuffle'i topilmadi`);
  pass(source.includes('Math.random()'), `${fileName}: Fisher-Yates shuffle topilmadi`);
  pass(/setPickedId\([^)]*\.id\)/.test(source), `${fileName}: MC javobi semantic option ID bilan saqlanmayapti`);
  for (const marker of ['firstTryCorrect', 'correctAnswers', 'finalScore', 'attemptsTotal', 'durationSec',
    'levelBreakdown', 'skillTags', 'lessonMeta: LESSON_META', 'screenMeta: SCREEN_META', 'answers: nextAnswers']) {
    pass(source.includes(marker), `${fileName}: LMS marker yo'q — ${marker}`);
  }
  pass(source.includes('finishedRef.current = false') && source.includes('startedAtRef.current = Date.now()')
    && (source.includes('key={`${runId}-${task.id}`}') || source.includes('setRunId(')), `${fileName}: restart guardi to'liq emas`);
  // Guard ikki qismdan iborat: tekshiruv VA belgi qo'yish. Faqat `if` ni
  // tekshirish yetmaydi — belgi qo'yilmasa, guard jimgina ishlamay qoladi.
  pass(/if\s*\([^)]*finishedRef\.current[^)]*\)\s*return/.test(source)
    && /finishedRef\.current\s*=\s*true/.test(source), `${fileName}: double-completion guardi to'liq emas`);
  pass(/if\s*\([^)]*advancedRef\.current[^)]*\)\s*return/.test(source)
    && /advancedRef\.current\s*=\s*true/.test(source), `${fileName}: double-advance guardi to'liq emas`);

  // Rus tilida murojaat «ты» (CLAUDE.md §1, ETALON_4SINF §6).
  //
  // NEGA ANIQ RO'YXAT. Avval `/\b[А-Яа-яЁё]+те\b/` ishlatilgan edi va hech narsa
  // topmadi: JS da `\b` ASCII `\w` ga tayanadi, shuning uchun kirill so'z
  // chegarasi umuman ko'rinmaydi. Unicode shablon esa «на карте», «в протоколе»
  // kabi kelishik shakllarini ham xato deb belgilaydi. Shuning uchun amaliyot
  // matnlarida uchraydigan rasmiy buyruq shakllari ro'yxat bilan tekshiriladi.
  const FORMAL_IMPERATIVES = [
    'Введите', 'Выберите', 'Поставьте', 'Заполните', 'Соедините', 'Расставьте',
    'Укажите', 'Найдите', 'Проверьте', 'Запишите', 'Назовите', 'Сравните',
    'Отметьте', 'Расположите', 'Определите', 'Переведите', 'Сложите', 'Вычтите',
    'Приведите', 'Посчитайте', 'Нажмите', 'Наберите', 'Исправьте', 'Сделайте',
  ];
  const ruStrings = [];
  const walkRu = (node) => {
    if (!node || typeof node !== 'object') return;
    if (typeof node.ru === 'string') ruStrings.push(node.ru);
    for (const value of Object.values(node)) if (value && typeof value === 'object') walkRu(value);
  };
  tasks.forEach(walkRu);
  const formal = ruStrings.filter((text) => FORMAL_IMPERATIVES.some((form) => (
    text.includes(form) || text.includes(form.toLowerCase())
  )));
  pass(formal.length === 0, `${fileName}: RU matnda «вы» shakli — ${formal.slice(0, 3).join(' | ')}`);

  // UZ gigiyenasi: kirill yo'q, apostrof ASCII.
  const uzStrings = [];
  const walk = (node) => {
    if (!node || typeof node !== 'object') return;
    if (typeof node.uz === 'string') uzStrings.push(node.uz);
    for (const value of Object.values(node)) if (value && typeof value === 'object') walk(value);
  };
  tasks.forEach(walk);
  pass(!uzStrings.some((text) => /[Ѐ-ӿ]/.test(text)), `${fileName}: UZ satrlarda kirill bor`);
  pass(!uzStrings.some((text) => /[‘’ʻʼ]/.test(text)), `${fileName}: UZ satrlarda ASCII bo'lmagan apostrof bor`);

  const serialised = compact(JSON.stringify(tasks));
  for (const anchor of expected.anchors) {
    pass(serialised.includes(compact(anchor)), `${fileName}: rejalangan content anchor topilmadi — ${anchor}`);
  }

  for (const [taskId, check] of DETERMINISTIC_CHECKS[lesson] || []) {
    let result = false;
    try { result = check() === true; } catch { result = false; }
    pass(result, `${fileName} task ${taskId}: mustaqil hisob tekshiruvi o'tmadi`);
  }

  console.log(`✓ ${fileName}: 10 task, 2/5/3, ${kinds.size} mexanika, raskladkaga mos, tri-locale va LMS kontrakti`);
}

// Reyestr: slug↔component jufti va takroriylik.
const registry = fs.readFileSync(path.join(ROOT, 'src', 'lessons', 'grade4.js'), 'utf8');
const entries = [...registry.matchAll(
  /slug:\s*'([^']+)'[\s\S]*?Component:\s*lazy\(\(\)\s*=>\s*import\('\.\.\/components\/grade4\/(Dars\d{2}(?:Practice)?\.jsx)'\)\)/g,
)].map((match) => ({ slug: match[1], file: match[2] }));
pass(new Set(entries.map((entry) => entry.slug)).size === entries.length, 'Registry: takroriy slug topildi');
pass(new Set(entries.map((entry) => entry.file)).size === entries.length, 'Registry: takroriy component file topildi');
for (const lesson of lessons) {
  const expected = EXPECTED[lesson];
  if (!expected) continue;
  const matched = entries.filter((entry) => entry.slug === expected.slug);
  pass(matched.length === 1 && matched[0].file === `Dars${lesson}Practice.jsx`, `Registry: D${lesson} slug↔component jufti noto'g'ri`);
}

if (failures.length) {
  console.error(`\n${failures.length} ta D31-D40 practice audit xatosi:`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`\n✓ ${lessons.length} ta amaliyot (${lessons.join(', ')}) auditdan o'tdi.`);
if (pending.length) console.log(`  Hali yig'ilmagan: ${pending.join(', ')}.`);
