// Dars41 · Amaliyot 06 — Nom va perimetr · 🟡 · slots · tag: kind_name_perimeter
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 6-o'rin `slots`.
// 6, 6, 9 -- teng yonli, P = 6 + 6 + 9 = 21.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'kind_name_perimeter',
  level: '🟡',
  eyebrow: L(
    'Nom va perimetr',
    'Имя и периметр',
    'Name and perimeter'),
  setup: L(
    "Avval tomonlar bo'yicha nomni toping, keyin perimetrni hisoblang: perimetr uch tomonning yig'indisi.",
    'Сначала найди имя по сторонам, потом посчитай периметр: это сумма трёх сторон.',
    'Find the side name first, then the perimeter: the sum of the three sides.'),
  given: [['6, 6, 9']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  rows: [[{ t: ['turi', '='] }, { slot: 0 }, { t: ['P', '='] }, { slot: 1 }]],
  cards: ['teng yonli', '21', 'teng tomonli', '18'],
  answer: ['teng yonli', '21'],
  ask: L(
    'Kartani bosing, keyin uyani bosing.',
    'Нажми карточку, затем клетку.',
    'Tap a card, then tap a cell.'),
  bank: L(
    'Kartalar',
    'Карточки',
    'Cards'),
  correctText: L(
    "To'g'ri. Ikki tomon teng -- teng yonli; 6 + 6 + 9 = 21.",
    'Верно. Две стороны равны — равнобедренный; 6 + 6 + 9 = 21.',
    'Correct. Two equal sides make it isosceles; 6 + 6 + 9 = 21.'),
  wrongs: [
    {
      when: (s) => s.slots[1] === '18',
      text: L(
        "18 bu 6 · 3, ya'ni uch tomon ham 6 deb olingan. Uchinchi tomon 9.",
        '18 это 6 · 3, будто все стороны по 6. Третья сторона равна 9.',
        '18 is 6 · 3, as if every side were 6. The third side is 9.'),
    },
    {
      when: (s) => s.slots[0] === 'teng tomonli',
      text: L(
        'Teng tomonlida uch tomon teng. Bu yerda 9 boshqa.',
        'У равностороннего три равные стороны. Здесь 9 отличается.',
        'An equilateral has three equal sides. Here 9 differs.'),
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
    "Tomonlarni solishtiring, keyin uchtasini qo'shing.",
    'Сравни стороны, потом сложи все три.',
    'Compare the sides, then add all three.'),
};

export default function D41_06(props) { return <SlotsBank data={DATA} {...props} />; }
