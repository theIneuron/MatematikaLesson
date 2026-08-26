// Dars48 · Amaliyot 06 — Tengsizlik va chegara · 🟡 · chain · tag: rev_ineq_chain
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 6-o'rin `chain`.
// Tomonlar 5 va 9: uchinchi tomon 4 dan katta va 14 dan kichik.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rev_ineq_chain',
  level: '🟡',
  eyebrow: L(
    'Ikki chegara',
    'Две границы',
    'Two bounds'),
  setup: L(
    "Ikki tomon berilgan. Uchburchak tengsizligi uchinchi tomonga ikki chegara qo'yadi.",
    'Даны две стороны. Неравенство треугольника ставит третьей стороне две границы.',
    'Two sides are given. The triangle inequality puts two bounds on the third.'),
  given: [['5', L('va', 'и', 'and'), '9']],
  givenLabel: L(
    'Tomonlar:',
    'Стороны:',
    'Sides:'),
  rows: [
    [{ t: [L('uchinchi', 'третья', 'the third'), L('tomon', 'сторона', 'side'), '>'] }, { slot: 0 }],
    [{ t: [L('uchinchi', 'третья', 'the third'), L('tomon', 'сторона', 'side'), '<'] }, { slot: 1 }],
  ],
  cards: ['4', '14', '5', '45'],
  answer: ['4', '14'],
  ask: L(
    'Kartani bosing, keyin uyani bosing.',
    'Нажми карточку, затем клетку.',
    'Tap a card, then tap a cell.'),
  bank: L(
    'Kartalar',
    'Карточки',
    'Cards'),
  correctText: L(
    "To'g'ri. 9 − 5 = 4 va 9 + 5 = 14. Uchinchi tomon shu chegaralar orasida.",
    'Верно. 9 − 5 = 4 и 9 + 5 = 14. Третья сторона между этими границами.',
    'Correct. 9 − 5 = 4 and 9 + 5 = 14. The third side lies between them.'),
  wrongs: [
    {
      when: (s) => s.slots[0] === '5',
      text: L(
        "5 bu tomonning o'zi. Pastki chegara ayirma: 9 − 5 = 4.",
        '5 это сама сторона. Нижняя граница это разность: 9 − 5 = 4.',
        '5 is a side itself. The lower bound is the difference: 9 − 5 = 4.'),
    },
    {
      when: (s) => s.slots[1] === '45',
      text: L(
        "45 bu 5 · 9. Yuqori chegara yig'indi: 14.",
        '45 это 5 · 9. Верхняя граница это сумма: 14.',
        '45 is 5 · 9. The upper bound is the sum: 14.'),
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
    "Ayirma va yig'indini hisoblang.",
    'Посчитай разность и сумму.',
    'Compute the difference and the sum.'),
};

export default function D48_06(props) { return <SlotsBank data={DATA} {...props} />; }
