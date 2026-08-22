// Dars38 · Amaliyot 09 — Ikki qadamli zanjir · 🔴 · chain · tag: sys_chain
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 9-o'rin `chain`.
// 3x + y = 17 va y = x − 3: 3x + (x − 3) = 17 -> 4x = 20 -> x = 5, y = 2.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'sys_chain',
  level: '🔴',
  eyebrow: L(
    'Zanjir',
    'Цепочка',
    'A chain'),
  setup: L(
    "Birinchi qatorda x, ikkinchi qatorda esa yechim juftligi so'raladi.",
    'В первой строке спрашивают x, во второй пару-решение.',
    'The first row asks for x, the second for the solution pair.'),
  given: [['3x + y = 17', ';', 'y = x − 3']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  rows: [[{ t: ['x', '='] }, { slot: 0 }], [{ t: ['yechim'] }, { slot: 1 }]],
  cards: ['5', '(5; 2)', '4', '(5; 5)'],
  answer: ['5', '(5; 2)'],
  ask: L(
    'Kartani bosing, keyin uyani bosing.',
    'Нажми карточку, затем клетку.',
    'Tap a card, then tap a cell.'),
  bank: L(
    'Kartalar',
    'Карточки',
    'Cards'),
  correctText: L(
    "To'g'ri. 3x + (x − 3) = 17, ya'ni 4x = 20 va x = 5. Keyin y = 5 − 3 = 2.",
    'Верно. 3x + (x − 3) = 17, значит 4x = 20 и x = 5. Затем y = 5 − 3 = 2.',
    'Correct. 3x + (x − 3) = 17 gives 4x = 20 and x = 5, then y = 5 − 3 = 2.'),
  wrongs: [
    {
      when: (s) => s.slots[0] === '4',
      text: L(
        "4 chiqishi uchun −3 ko'chirilmagan: 17 + 3 = 20, keyin 20 : 4 = 5.",
        'Чтобы вышло 4, не перенесли −3: 17 + 3 = 20, потом 20 : 4 = 5.',
        '4 forgets to move the −3: 17 + 3 = 20, then 20 : 4 = 5.'),
    },
    {
      when: (s) => s.slots[1] === '(5; 5)',
      text: L(
        'y ni ikkinchi tenglamadan hisoblash kerak: y = 5 − 3 = 2.',
        'y надо посчитать из второго уравнения: y = 5 − 3 = 2.',
        'y comes from the second equation: y = 5 − 3 = 2.'),
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
    "y ni qo'yib x ni toping, keyin y ni hisoblang.",
    'Подставь y, найди x, потом посчитай y.',
    'Substitute y, find x, then compute y.'),
};

export default function D38_09(props) { return <SlotsBank data={DATA} {...props} />; }
