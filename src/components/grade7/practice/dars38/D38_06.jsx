// Dars38 · Amaliyot 06 — Qo'shish usuli · 🟡 · slots · tag: sys_add
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 6-o'rin `slots`.
// x + y = 14 va x − y = 6: qo'shsak 2x = 20 -> x = 10, keyin y = 4.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'sys_add',
  level: '🟡',
  eyebrow: L(
    "Qo'shish usuli",
    'Способ сложения',
    'Adding method'),
  setup: L(
    "Ikki tenglamani qo'shsak y yo'qoladi: +y va −y bir-birini yo'q qiladi. Ikki bo'sh katakni to'ldiring.",
    'Если сложить два уравнения, y исчезнет: +y и −y уничтожают друг друга. Заполни две клетки.',
    'Adding the equations kills y: +y and −y cancel. Fill both cells.'),
  given: [['x + y = 14', ';', 'x − y = 6']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  rows: [[{ t: ['x', '='] }, { slot: 0 }, { t: ['y', '='] }, { slot: 1 }]],
  cards: ['10', '4', '20', '8'],
  answer: ['10', '4'],
  ask: L(
    "Kartani bosing, keyin bo'sh katakni bosing.",
    'Нажми карточку, затем клетку.',
    'Tap a card, then tap a cell.'),
  bank: L(
    'Kartalar',
    'Карточки',
    'Cards'),
  correctText: L(
    "To'g'ri. Qo'shsak 2x = 20, ya'ni x = 10. Keyin 10 + y = 14 va y = 4.",
    'Верно. Сложив, получаем 2x = 20, значит x = 10. Затем 10 + y = 14 и y = 4.',
    'Correct. Adding gives 2x = 20, so x = 10. Then 10 + y = 14 and y = 4.'),
  wrongs: [
    {
      when: (s) => s.slots[0] === '20',
      text: L(
        "20 bu 2x. x ni topish uchun ikkiga bo'lish kerak.",
        '20 это 2x. Чтобы найти x, надо разделить на два.',
        '20 is 2x. Halve it to get x.'),
    },
    {
      when: (s) => s.slots[1] === '8',
      text: L(
        "8 chiqishi uchun 14 − 6 hisoblangan. y ni topish uchun x ni tenglamaga qo'ying.",
        'Чтобы вышло 8, считали 14 − 6. Чтобы найти y, подставь x в уравнение.',
        '8 comes from 14 − 6. To get y, put x back into an equation.'),
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
    "Tenglamalarni qo'shing: y yo'qoladi. Keyin x ni birinchi tenglamaga qo'ying.",
    'Сложи уравнения: y исчезнет. Потом подставь x в первое уравнение.',
    'Add the equations to kill y, then substitute x back.'),
};

export default function D38_06(props) { return <SlotsBank data={DATA} {...props} />; }
