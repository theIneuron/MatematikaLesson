// Dars46 · Amaliyot 07 — Ikki chegara · 🟡 · chain · tag: ineq_chain
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 7-o'rin `chain`.
// Tomonlar 4 va 9: uchinchi tomon 9 − 4 = 5 dan katta va 9 + 4 = 13 dan kichik.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'ineq_chain',
  level: '🟡',
  eyebrow: L(
    'Ikki chegara',
    'Две границы',
    'Two bounds'),
  setup: L(
    "Uchinchi tomon ikki chegara orasida yotadi: tomonlar ayirmasidan katta va yig'indisidan kichik.",
    'Третья сторона лежит между двумя границами: больше разности сторон и меньше их суммы.',
    'The third side lies between two bounds: above the difference and below the sum.'),
  given: [['4', L('va', 'и', 'and'), '9']],
  givenLabel: L(
    'Tomonlar:',
    'Стороны:',
    'Sides:'),
  rows: [
    [{ t: [L('uchinchi', 'третья', 'the third'), L('tomon', 'сторона', 'side'), '>'] }, { slot: 0 }],
    [{ t: [L('uchinchi', 'третья', 'the third'), L('tomon', 'сторона', 'side'), '<'] }, { slot: 1 }],
  ],
  cards: ['5', '13', '4', '36'],
  answer: ['5', '13'],
  ask: L(
    'Kartani bosing, keyin uyani bosing.',
    'Нажми карточку, затем клетку.',
    'Tap a card, then tap a cell.'),
  bank: L(
    'Kartalar',
    'Карточки',
    'Cards'),
  correctText: L(
    "To'g'ri. 9 − 4 = 5 va 9 + 4 = 13. Uchinchi tomon shu ikki son orasida.",
    'Верно. 9 − 4 = 5 и 9 + 4 = 13. Третья сторона между этими числами.',
    'Correct. 9 − 4 = 5 and 9 + 4 = 13. The third side lies between them.'),
  wrongs: [
    {
      when: (s) => s.slots[0] === '4',
      text: L(
        "4 bu tomonning o'zi. Pastki chegara AYIRMA: 9 − 4 = 5.",
        '4 это сама сторона. Нижняя граница это РАЗНОСТЬ: 9 − 4 = 5.',
        '4 is a side itself. The lower bound is the DIFFERENCE: 9 − 4 = 5.'),
    },
    {
      when: (s) => s.slots[1] === '36',
      text: L(
        "36 bu 4 · 9. Yuqori chegara YIG'INDI: 4 + 9 = 13.",
        '36 это 4 · 9. Верхняя граница это СУММА: 4 + 9 = 13.',
        '36 is 4 · 9. The upper bound is the SUM: 4 + 9 = 13.'),
    },
    {
      when: (s) => s.slots.indexOf(null) !== -1,
      text: L(
        "Hamma uya to'ldirilishi kerak.",
        'Надо заполнить все клетки.',
        'Every cell must be filled.'),
    },
  ],
  wrongText: L(
    "Pastki chegara -- ayirma, yuqorisi -- yig'indi.",
    'Нижняя граница это разность, верхняя это сумма.',
    'The lower bound is the difference, the upper is the sum.'),
};

export default function D46_07(props) { return <SlotsBank data={DATA} {...props} />; }
