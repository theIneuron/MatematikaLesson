// Dars46 · Amaliyot 09 — Ikki chegara · 🔴 · slots · tag: ineq_slots
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 9-o'rin.
// Tomonlar 7 va 10: uchinchi tomon 3 dan katta va 17 dan kichik bo'lishi
// kerak (10 − 7 va 10 + 7).
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'ineq_slots', level: '🔴',
  eyebrow: L('Ikki chegara', 'Две границы', 'Two bounds'),
  setup: L(
    "Uchinchi tomon ikki chegara orasida bo'ladi: tomonlar ayirmasidan katta va yig'indisidan kichik.",
    'Третья сторона лежит между двумя границами: больше разности сторон и меньше их суммы.',
    'The third side lies between two bounds: above the difference and below the sum.'),
  given: [['7', 'va', '10']],
  givenLabel: L('Tomonlar:', 'Стороны:', 'Sides:'),
  rows: [
    [{ t: ['uchinchi', 'tomon', '>'] }, { slot: 0 }, { t: ['va', '<'] }, { slot: 1 }],
  ],
  cards: ['3', '17', '7', '70'],
  answer: ['3', '17'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 10 − 7 = 3 va 10 + 7 = 17. Uchinchi tomon shu ikki son orasida bo'lishi kerak.",
    'Верно. 10 − 7 = 3 и 10 + 7 = 17. Третья сторона должна лежать между этими числами.',
    'Correct. 10 − 7 = 3 and 10 + 7 = 17. The third side lies between them.'),
  wrongs: [
    { when: (s) => s.slots[0] === '7' || s.slots[1] === '7', text: L(
      "7 bu tomonning o'zi. Chegaralar esa ayirma va yig'indidan chiqadi.",
      '7 это сама сторона. А границы выходят из разности и суммы.',
      '7 is a side itself. The bounds come from the difference and the sum.') },
    { when: (s) => s.slots[1] === '70', text: L(
      "70 bu 7 · 10. Yuqori chegara YIG'INDI: 7 + 10 = 17.",
      '70 это 7 · 10. Верхняя граница это СУММА: 7 + 10 = 17.',
      '70 is 7 · 10. The upper bound is the SUM: 7 + 10 = 17.') },
  ],
  wrongText: L(
    "Pastki chegara -- tomonlar ayirmasi, yuqori chegara -- yig'indisi.",
    'Нижняя граница это разность сторон, верхняя это сумма.',
    'The lower bound is the difference of the sides, the upper is the sum.'),
};

export default function D46_09(props) { return <SlotsBank data={DATA} {...props} />; }
