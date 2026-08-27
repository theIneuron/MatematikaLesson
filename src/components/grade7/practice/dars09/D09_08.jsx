// Dars09 · Amaliyot 08 — Ikki qavsli tenglama · 🔴 · tag: two_brackets_equation
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SlotsBank.
//
// 4(x − 1) = 2(x + 3).
//   qavslar:     4x − 4 = 2x + 6
//   ko'chirish:  4x − 2x = 6 + 4
//   yig'ish:     2x = 10
//   bo'lish:     x = 5
// Tekshirish: 4 · (5 − 1) = 16 va 2 · (5 + 3) = 16.
// Kartalar orasida 6x (ko'chirishda ishorani o'zgartirmagan), 2 (sonlarni
// ayirgan) va 20 (10 : 2 ni teskari qilgan) turadi.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'two_brackets_equation', level: '🔴',
  eyebrow: L('Ikki qavs', 'Две скобки', 'Two brackets'),
  setup: L(
    "Ikki tomonda ham qavs bor. Ikkovini ochib, keyin hadlarni ko'chirish kerak.",
    'Скобки стоят в обеих частях. Надо раскрыть обе, а потом переносить слагаемые.',
    'There are brackets on both sides. Open both, then move the terms.'),
  rows: [
    [{ t: ['4', '·', '(', 'x', '−', '1', ')', '=', '2', '·', '(', 'x', '+', '3', ')'] }],
    [{ t: ['4x', '−', '4', '=', '2x', '+', '6'] }],
    [{ slot: 0 }, { t: ['='] }, { slot: 1 }],
    [{ t: ['x', '='] }, { slot: 2 }],
  ],
  cards: ['2x', '10', '5', '6x', '2', '20'],
  answer: ['2x', '10', '5'],
  ask: L("Kartani bosing, keyin bo'sh katakni bosing.", 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 4x − 2x = 2x, 6 + 4 = 10, keyin 10 : 2 = 5. Tekshirish: 4 · (5 − 1) = 16 va 2 · (5 + 3) = 16.",
    'Верно. 4x − 2x = 2x, 6 + 4 = 10, затем 10 : 2 = 5. Проверка: 4 · (5 − 1) = 16 и 2 · (5 + 3) = 16.',
    'Correct. 4x − 2x = 2x, 6 + 4 = 10, then 10 : 2 = 5. Check: 4 · (5 − 1) = 16 and 2 · (5 + 3) = 16.'),
  wrongs: [
    { when: (s) => s.slots[0] === '6x', text: L(
      "2x o'ng tomondan chapga ko'chganda ishorasi o'zgardi: 4x − 2x = 2x.",
      'Когда 2x перешло справа налево, его знак поменялся: 4x − 2x = 2x.',
      'When 2x moved from right to left its sign flipped: 4x − 2x = 2x.') },
    { when: (s) => s.slots[1] === '2', text: L(
      "−4 chap tomonda edi, o'ngga ko'chganda +4 bo'ldi: 6 + 4 = 10.",
      '−4 было слева, при переносе направо стало +4: 6 + 4 = 10.',
      'The −4 was on the left and became +4 when it moved right: 6 + 4 = 10.') },
    { when: (s) => s.slots[2] === '20', text: L(
      "Oxirgi qadam: 2x = 10 dan x = 10 : 2 = 5. Sonlar joyi almashib ketgan.",
      'Последний шаг: из 2x = 10 выходит x = 10 : 2 = 5. Числа перепутаны местами.',
      'The last step: from 2x = 10 you get x = 10 : 2 = 5. The numbers got swapped.') },
  ],
  wrongText: L(
    "Ikkinchi qatordan davom ettiring: noma'lumlarni chapga, sonlarni o'ngga, keyin koeffitsiyentga bo'ling.",
    'Продолжай со второй строки: неизвестные влево, числа вправо, потом раздели на коэффициент.',
    'Carry on from the second line: unknowns left, numbers right, then divide by the coefficient.'),
};

export default function D09_08(props) { return <SlotsBank data={DATA} {...props} />; }
