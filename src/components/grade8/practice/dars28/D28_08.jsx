// Dars28 · Amaliyot 08 — Pazl · 🔴 · tag: solution_to_answer
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §10 (28-dars, 8-pozitsiya)
//
// YAXLITLASH YO'NALISHINI TENGSIZLIK BELGISI HAL QILADI:
//   x ≤ 6,6  javob PASTGA yaxlitlanadi -> 6
//   x ≥ 6,6  javob YUQORIGA            -> 7
//   x ≥ 4    chegara butun va kiradi   -> 4, ya'ni yaxlitlash yo'q
//
// Uchinchi juftlik alohida: chegaraning o'zi butun bo'lsa va belgi ostida
// chiziq bo'lsa, hech qanday yaxlitlash kerak emas (З54).
// Kartalarda yozuv bo'shliqsiz (skelet §0a.3).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'solution_to_answer', level: '🔴',
  faceSize: 13, faceSizePhone: 11,
  cards: [
    { id: 'f1', side: 0, tokens: ['x≤6,6'] },
    { id: 'f2', side: 0, tokens: ['x≥6,6'] },
    { id: 'f3', side: 0, tokens: ['x≥4'] },
    { id: 'v1', side: 1, v: '6' },
    { id: 'v2', side: 1, v: '7' },
    { id: 'v3', side: 1, v: '4' },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "Uch masalada tengsizlik yechilgan, va har birida x — BUTUN kattalik (odamlar soni, kunlar soni). Har yechimdan javobga o'tish kerak: eng yaqin mos butun son.",
    'В трёх задачах неравенство решено, и в каждой x — ЦЕЛАЯ величина (число людей, число дней). Из каждого решения надо перейти к ответу: ближайшее подходящее целое число.',
    'In three problems the inequality has been solved, and in each x is a WHOLE quantity (a count of people, a count of days). From each solution one must move to the answer: the nearest fitting whole number.'),
  ask: L(
    'Yechimni bosing, keyin uyani bosing.',
    'Нажми решение, потом ячейку.',
    'Tap a solution, then a slot.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Yaxlitlash yo'nalishini belgi hal qiladi: «kichik» pastga, «katta» yuqoriga. Uchinchisida esa chegara butun va belgi ostida chiziq bor — to'rtning o'zi javob bo'ladi, yaxlitlash kerak emas.",
    'Верно. Направление округления решает знак: «меньше» вниз, «больше» вверх. А в третьем граница целая и под знаком черта — ответом будет сама четвёрка, округлять не нужно.',
    'Correct. The sign decides the direction of rounding: «less» rounds down, «greater» rounds up. In the third the boundary is whole and the sign carries a line — four itself is the answer, no rounding needed.'),
  wrongs: [
    { when: (s) => s.mate.f1 !== 'v1', text: L(
      "Birinchi yechimda x chegaradan KICHIK. Demak javobni chegaradan chapga qarab izlash kerak: olti butun oltidan o'ndan kichik eng katta butun son — olti. Yettini tekshiring: yetti olti butun oltidan o'ndan katta, ya'ni yechimga kirmaydi.",
      'В первом решении x МЕНЬШЕ границы. Значит ответ надо искать левее границы: наибольшее целое, меньшее шести целых шести десятых, — это шесть. Проверь семёрку: семь больше шести целых шести десятых, значит в решение она не входит.',
      'In the first solution x is LESS than the boundary. So the answer must be sought to the left of it: the largest whole number below six point six is six. Check seven: seven is greater than six point six, so it does not belong to the solution.') },
    { when: (s) => s.mate.f2 !== 'v2', text: L(
      "Ikkinchi yechimda x chegaradan KATTA. Demak javobni chegaradan o'ngga qarab izlash kerak: olti butun oltidan o'ndan katta eng kichik butun son — yetti. Oltini tekshiring: olti olti butun oltidan o'ndan kichik, ya'ni yechimga kirmaydi. Birinchi juftlik bilan solishtiring — kasr son bir xil, javob esa boshqa.",
      'Во втором решении x БОЛЬШЕ границы. Значит ответ надо искать правее границы: наименьшее целое, большее шести целых шести десятых, — это семь. Проверь шестёрку: шесть меньше шести целых шести десятых, значит в решение она не входит. Сравни с первой парой — дробь та же, а ответ другой.',
      'In the second solution x is GREATER than the boundary. So the answer must be sought to the right: the smallest whole number above six point six is seven. Check six: six is less than six point six, so it does not belong to the solution. Compare with the first pair — the same fraction, a different answer.') },
    { when: (s) => s.mate.f3 !== 'v3', text: L(
      "Uchinchi yechimda chegara BUTUN son, va belgi ostida chiziq bor: x to'rtdan katta yoki TENG. Demak to'rtning o'zi yechimga kiradi va u eng kichik javob bo'ladi — yaxlitlash umuman kerak emas. Agar belgi chiziqsiz bo'lganida, javob besh bo'lardi.",
      'В третьем решении граница ЦЕЛАЯ, и под знаком есть черта: x больше или РАВЕН четырём. Значит сама четвёрка входит в решение и является наименьшим ответом — округлять не нужно вовсе. Будь знак без черты, ответом было бы пять.',
      'In the third solution the boundary is a WHOLE number and the sign carries a line: x is greater than or EQUAL to four. So four itself belongs to the solution and is the smallest answer — no rounding is needed. Had the sign carried no line, the answer would be five.') },
  ],
  wrongText: L(
    "Yaxlitlash yo'nalishini tengsizlik belgisi hal qiladi: «kichik» — pastga, «katta» — yuqoriga. Chegara butun va chiziqli belgi bilan bo'lsa, yaxlitlash umuman kerak emas.",
    'Направление округления решает знак неравенства: «меньше» — вниз, «больше» — вверх. Если граница целая и знак с чертой, округлять не нужно вовсе.',
    'The direction of rounding is decided by the inequality sign: «less» rounds down, «greater» rounds up. If the boundary is whole and the sign carries a line, no rounding is needed at all.'),
};

export default function D28_08(props) { return <PairSlots data={DATA} {...props} />; }
