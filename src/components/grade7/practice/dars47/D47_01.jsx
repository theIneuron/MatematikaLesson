// Dars47 · Amaliyot 01 — Sirkul nima beradi · 🟢 · slots · tag: comp_meaning
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 1-o'rin `slots`.
// Sirkulning ma'nosi -- TENG MASOFA. Ikki yoy kesishgan nuqta ikki uchdan bir xil uzoqlikda bo'ladi.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'comp_meaning',
  level: '🟢',
  eyebrow: L(
    'Sirkulning ishi',
    'Работа циркуля',
    'What the compass does'),
  setup: L(
    "Sirkulning bir uchi qadaladi, ikkinchisi bir xil uzoqlikdagi nuqtalarni beradi. A dan va B dan chizilgan yoylar kesishsa, kesishgan nuqta ikkovidan bir xil uzoqlikda bo'ladi.",
    'Одна ножка циркуля стоит на месте, вторая даёт точки на одинаковом расстоянии. Если дуги из A и из B пересеклись, точка пересечения одинаково удалена от обеих.',
    'One compass leg stays put while the other marks points at equal distance. Where arcs from A and B cross, the point is equally far from both.'),
  given: [['A', L('va', 'и', 'and'), 'B', L('dan', 'из', 'from'), L('yoylar', 'дуги', 'arcs')]],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  rows: [[{ t: [L('sirkul', 'циркуль', 'compass'), L('beradi', 'даёт', 'gives')] }, { slot: 0 }], [{ t: ['P', L('nuqta', 'точка', 'point'), L('uchun', 'для', 'for')] }, { slot: 1 }]],
  cards: [L('teng masofa', 'равное расстояние', 'equal distance'), 'PA = PB', L('teng burchak', 'равный угол', 'an equal angle'), 'PA + PB'],
  answer: ['teng masofa', 'PA = PB'],
  ask: L(
    "Kartani bosing, keyin bo'sh katakni bosing.",
    'Нажми карточку, затем клетку.',
    'Tap a card, then tap a cell.'),
  bank: L(
    'Kartalar',
    'Карточки',
    'Cards'),
  correctText: L(
    "To'g'ri. Sirkul teng masofani beradi, ya'ni kesishgan nuqta uchun PA = PB.",
    'Верно. Циркуль даёт равное расстояние, значит для точки пересечения PA = PB.',
    'Correct. The compass gives equal distance, so PA = PB at the crossing point.'),
  wrongs: [
    {
      when: (s) => s.slots[0] === 'teng burchak',
      text: L(
        "Sirkul burchak o'lchamaydi: u faqat masofani bir xil saqlaydi.",
        'Циркуль не измеряет угол: он лишь сохраняет расстояние.',
        'A compass does not measure angles: it keeps the distance the same.'),
    },
    {
      when: (s) => s.slots[1] === 'PA + PB',
      text: L(
        "Yig'indi emas, TENGLIK: PA va PB bir xil uzunlikda.",
        'Не сумма, а РАВЕНСТВО: PA и PB одной длины.',
        'Not a sum but an EQUALITY: PA and PB have the same length.'),
    },
    {
      when: (s) => s.slots.indexOf(null) !== -1,
      text: L(
        "Hamma bo'sh katak to'ldirilishi kerak.",
        'Надо заполнить все клетки.',
        'Every cell must be filled.'),
    },
  ],
  wrongText: L(
    "Sirkulning ochilishi o'zgarmasa, u nimani bir xil qiladi?",
    'Если раствор циркуля не меняется, что остаётся одинаковым?',
    'If the compass opening stays fixed, what stays the same?'),
};

export default function D47_01(props) { return <SlotsBank data={DATA} {...props} />; }
