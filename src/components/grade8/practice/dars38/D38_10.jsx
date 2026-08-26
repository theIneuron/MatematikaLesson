// Dars38 · Amaliyot 10 — Chizmalar · 🔴 🖼 · tag: condition_to_figure
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §10 (38-dars, 10-pozitsiya)
//
// TO'RT SHART ↔ TO'RT CHIZMA, va har chizmada DIAGONALLAR o'tkazilgan:
//   AC = BD           -> to'g'ri to'rtburchak
//   AC ⊥ BD           -> romb
//   AC = BD, AC ⊥ BD  -> kvadrat
//   ikkalasi ham yo'q -> ixtiyoriy parallelogramm
// Diagonallar chizilgani muhim: shart KO'RINIB turadi, ya'ni o'quvchi
// yodlangan nomni emas, figuraning o'zini o'qiydi (skelet §0a.2).
//
// To'rt figura bitta oiladan — hammasi parallelogramm, — va ular faqat
// diagonallarning xossasi bilan ajraladi. З79 va З80 shu yerda birga.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

// Kadr kichik (o'lchov 2026-08-25): MatchPairs ning katagi 76px, va to'rt
// chizma ustma-ust turadi — katta kadr butun topshiriqni kadrdan chiqarardi.
const F = { fig: 'poly', w: 62, h: 44 };
// Diagonallar `segs` bilan chiziladi, uchlarning INDEKSI orqali:
// 0-2 va 1-3. Ular urg'u rangida turadi — figuraning o'zi emas,
// MASALANING bo'lagi (`fig.jsx` dagi izoh).
const DIAG = [{ from: 0, to: 2 }, { from: 1, to: 3 }];

const DATA = {
  tag: 'condition_to_figure', level: '🔴',
  connect: true,
  targetSize: 13, itemSize: 12,
  items: [
    { id: 'm1', tokens: ['AC = BD'] },
    { id: 'm2', tokens: ['AC ⊥ BD'] },
    { id: 'm3', tokens: ['AC = BD,  AC ⊥ BD'] },
    { id: 'm4', tokens: ['AC ≠ BD,  AC ⊥̸ BD'] },
  ],
  targets: [
    // to'g'ri to'rtburchak: diagonallar teng, perpendikulyar emas
    { id: 't1', tokens: [{ ...F, pts: [[7, 34], [7, 10], [55, 10], [55, 34]], segs: DIAG }] },
    // romb: diagonallar perpendikulyar, teng emas
    { id: 't2', tokens: [{ ...F, pts: [[31, 4], [57, 22], [31, 40], [5, 22]], segs: DIAG }] },
    // kvadrat: ikkalasi ham
    { id: 't3', tokens: [{ ...F, pts: [[16, 5], [46, 5], [46, 34], [16, 34]], segs: DIAG }] },
    // ixtiyoriy parallelogramm: na teng, na perpendikulyar
    { id: 't4', tokens: [{ ...F, pts: [[4, 37], [19, 9], [58, 9], [43, 37]], segs: DIAG }] },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Chizmalar', 'Рисунки', 'Drawings'),
  setup: L(
    "To'rt chizmada to'rt parallelogramm turibdi, va har birida diagonallar o'tkazilgan. Chapda esa diagonallarning shartlari. Figuralarning nomi yozilmagan — shartni chizmaning o'zidan o'qish kerak.",
    'На четырёх рисунках четыре параллелограмма, и в каждом проведены диагонали. Слева — условия на диагонали. Названия фигур не написаны: условие надо прочитать по самому рисунку.',
    'Four drawings hold four parallelograms, each with its diagonals drawn. On the left are conditions on the diagonals. The figures are not named — the condition must be read from the drawing itself.'),
  ask: L(
    "Chapdan shartni bosing, keyin o'ngdan unga mos chizmani bosing.",
    'Нажми условие слева, потом соответствующий рисунок справа.',
    'Tap a condition on the left, then its matching drawing on the right.'),
  correctText: L(
    "To'g'ri. To'rt figura ham parallelogramm. Teng diagonallar — to'g'ri to'rtburchak; perpendikulyar — romb; ikkovi birga — kvadrat; hech biri — oddiy parallelogramm. To'rttasida ham diagonallar teng ikkiga bo'linadi, ya'ni bu xossa ajratmaydi.",
    'Верно. Все четыре фигуры — параллелограммы. Равные диагонали — прямоугольник; перпендикулярные — ромб; оба вместе — квадрат; ни одного — обычный параллелограмм. Во всех четырёх диагонали делятся пополам, значит это свойство не различает.',
    'Correct. All four figures are parallelograms. Equal diagonals — a rectangle; perpendicular — a rhombus; both together — a square; neither — an ordinary parallelogram. In all four the diagonals bisect each other, so that property distinguishes nothing.'),
  wrongs: [
    { when: (s) => s.pair.m1 === 't2' || s.pair.m2 === 't1', text: L(
      "Ikki shart almashib ketdi. Birinchi figurada diagonallar bir xil UZUNLIKDA, lekin yotiq burchak ostida kesishadi; ikkinchisida turli uzunlikda, lekin to'g'ri burchak ostida. Tenglik UZUNLIKNI, perpendikulyarlik BURCHAKNI tekshiradi.",
      'Два условия поменялись местами. В первой фигуре диагонали одной ДЛИНЫ, но пересекаются под пологим углом; во второй разной длины, зато под прямым. Равенство проверяет ДЛИНУ, перпендикулярность — УГОЛ.',
      'The two conditions changed places. In the first figure the diagonals are the same LENGTH but cross at a shallow angle; in the second they differ in length yet cross at a right angle. Equality tests LENGTH, perpendicularity tests ANGLE.') },
    { when: (s) => s.pair.m3 !== 't3', text: L(
      "Uchinchi shartda IKKALA xossa ham talab qilinyapti, va faqat bitta figura ikkalasini birga bajaradi — kvadrat. Chizmaga qarang: uning diagonallari bir xil uzunlikda VA to'g'ri burchak ostida kesishadi. Qolgan uch figurada har doim bitta xossa yetishmaydi.",
      'В третьем условии требуются ОБА свойства, и только одна фигура выполняет их вместе — квадрат. Посмотри на рисунок: его диагонали одной длины И пересекаются под прямым углом. В остальных трёх фигурах всегда одного свойства не хватает.',
      'The third condition demands BOTH properties, and only one figure meets them together — the square. Look at the drawing: its diagonals are the same length AND cross at a right angle. In the other three figures one property is always missing.') },
    { when: (s) => s.pair.m4 !== 't4', text: L(
      "To'rtinchi shart INKORdan iborat: diagonallar na teng, na perpendikulyar. Bunday parallelogramm hech qanday maxsus nomga ega emas — u shunchaki parallelogramm. Chizmaga qarang: uning bir diagonali sezilarli uzun, kesishish burchagi esa to'g'ri emas. Bu figura qolgan uchtasining «asosi» bo'lib, ularning har biri unga qo'shimcha shart qo'shishdan chiqadi.",
      'Четвёртое условие состоит из ОТРИЦАНИЙ: диагонали ни равны, ни перпендикулярны. У такого параллелограмма особого названия нет — он просто параллелограмм. Посмотри на рисунок: одна его диагональ заметно длиннее, а угол пересечения не прямой. Эта фигура — «основа» остальных трёх, каждая из которых получается добавлением условия.',
      'The fourth condition is made of NEGATIONS: the diagonals are neither equal nor perpendicular. Such a parallelogram has no special name — it is simply a parallelogram. Look at the drawing: one diagonal is noticeably longer and the crossing angle is not right. This figure is the «base» of the other three, each of which comes from adding a condition to it.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har chizmada ikki narsani alohida ko'ring: ikki diagonalning uzunligi tengmi, va ular qanday burchak ostida kesishadi. Ikki javob to'rt kombinatsiyani beradi, va to'rt figura aynan shu to'rt kombinatsiya.",
      'В каждом рисунке смотри на две вещи отдельно: равны ли длины двух диагоналей и под каким углом они пересекаются. Два ответа дают четыре комбинации, и четыре фигуры — это как раз они.',
      'In every drawing look at two things separately: are the two diagonals equal in length, and at what angle do they cross. Two answers give four combinations, and the four figures are exactly those.') },
  ],
  wrongText: L(
    "Diagonallarning uzunligini va kesishish burchagini alohida tekshiring. Tenglik to'g'ri to'rtburchakni, perpendikulyarlik rombni, ikkovi birga kvadratni beradi.",
    'Проверяй длину диагоналей и угол пересечения по отдельности. Равенство даёт прямоугольник, перпендикулярность — ромб, оба вместе — квадрат.',
    'Check the length of the diagonals and their crossing angle separately. Equality gives the rectangle, perpendicularity the rhombus, both together the square.'),
};

export default function D38_10(props) { return <MatchPairs data={DATA} {...props} />; }
