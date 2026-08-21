// Dars08 · Amaliyot 08 — Qavsli tenglama · 🔴 · tag: bracket_equation
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SlotsBank.
//
// 3(x − 2) = x + 4.
//   qavs ochiladi:  3x − 6 = x + 4
//   ko'chirish:     3x − x = 4 + 6
//   yig'ish:        2x = 10
//   bo'lish:        x = 5
// Tekshirish: 3 · (5 − 2) = 9 va 5 + 4 = 9.
// Kartalar orasida 4x (ayirish o'rniga qo'shgan), −2 (qavsni ochmagan),
// 2 (10 : 2 ni teskari hisoblagan) turadi.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'bracket_equation', level: '🔴',
  eyebrow: L('Qavsli tenglama', 'Уравнение со скобкой', 'An equation with a bracket'),
  setup: L(
    "Qavs bo'lsa, avval u ochiladi. Shundan keyingina hadlarni ko'chirish mumkin.",
    'Если есть скобка, сначала раскрывают её. Только потом переносят слагаемые.',
    'If there is a bracket, open it first. Only then move the terms.'),
  rows: [
    [{ t: ['3', '·', '(', 'x', '−', '2', ')', '=', 'x', '+', '4'] }],
    [{ t: ['3x', '−', '6', '=', 'x', '+', '4'] }],
    [{ slot: 0 }, { t: ['='] }, { slot: 1 }],
    [{ t: ['x', '='] }, { slot: 2 }],
  ],
  cards: ['2x', '10', '5', '4x', '−2', '2'],
  answer: ['2x', '10', '5'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 3x − x = 2x, 4 + 6 = 10, keyin 10 : 2 = 5. Tekshirish: 3 · (5 − 2) = 9 va 5 + 4 = 9.",
    'Верно. 3x − x = 2x, 4 + 6 = 10, затем 10 : 2 = 5. Проверка: 3 · (5 − 2) = 9 и 5 + 4 = 9.',
    'Correct. 3x − x = 2x, 4 + 6 = 10, then 10 : 2 = 5. Check: 3 · (5 − 2) = 9 and 5 + 4 = 9.'),
  wrongs: [
    { when: (s) => s.slots[0] === '4x', text: L(
      "x o'ng tomondan chapga ko'chganda ishorasi o'zgardi: 3x − x = 2x.",
      'Когда x перешёл справа налево, его знак поменялся: 3x − x = 2x.',
      'When the x moved from right to left its sign flipped: 3x − x = 2x.') },
    { when: (s) => s.slots[1] === '−2', text: L(
      "Sonlar: −6 chap tomonda edi, ko'chganda +6 bo'ldi. 4 + 6 = 10.",
      'Числа: −6 было слева, при переносе стало +6. 4 + 6 = 10.',
      'The numbers: −6 was on the left and became +6 when it moved. 4 + 6 = 10.') },
    { when: (s) => s.slots[2] === '2', text: L(
      "Oxirgi qadamda 10 ni 2 ga bo'lish kerak: x = 5. Sonlar joyi almashib ketgan.",
      'На последнем шаге надо 10 разделить на 2: x = 5. Числа перепутаны местами.',
      'The last step divides 10 by 2: x = 5. The numbers got swapped.') },
  ],
  wrongText: L(
    "Ikkinchi qatordan boshlang: noma'lumlarni chapga, sonlarni o'ngga ko'chiring, keyin koeffitsiyentga bo'ling.",
    'Начни со второй строки: неизвестные влево, числа вправо, потом раздели на коэффициент.',
    'Start from the second line: unknowns left, numbers right, then divide by the coefficient.'),
};

export default function D08_08(props) { return <SlotsBank data={DATA} {...props} />; }
