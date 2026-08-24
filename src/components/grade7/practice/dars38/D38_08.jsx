// Dars38 · Amaliyot 08 — Koeffitsiyentli qo'shish · 🔴 · build · tag: sys_add_coef
// Mexanika: kit.jsx -> BuildLine. Raskladka: 8-o'rin `build`.
// 2x + y = 13 va x − y = 2: qo'shsak 3x = 15 -> x = 5, keyin y = 3.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'sys_add_coef',
  level: '🔴',
  eyebrow: L(
    "Qo'shish",
    'Сложение',
    'Adding'),
  setup: L(
    "Bu yerda x larning koeffitsiyenti boshqa, lekin y lar bir-birini yo'q qiladi. Ikki javob kerak.",
    'Здесь коэффициенты при x разные, но y уничтожают друг друга. Нужны два ответа.',
    'The x coefficients differ, yet the y cancel. Two answers.'),
  given: [['2x + y = 13', ';', 'x − y = 2']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [
    { id: 'a', label: 'x = 5' },
    { id: 'b', label: 'y = 3' },
    { id: 'c', label: 'x = 7,5' },
    { id: 'd', label: 'y = 5' },
  ],
  answerSeq: ['a', 'b'],
  fieldH: 44,
  ask: L(
    "Kartani bosish uni chiziqqa qo'yadi.",
    'Нажатие на карточку ставит её в строку.',
    'Tapping a card puts it in the line.'),
  empty: L(
    'Kartalarni bosib javobni tuzing',
    'Нажимай карточки и собери ответ',
    'Tap the cards to build the answer'),
  bank: L(
    'Kartalar',
    'Карточки',
    'Cards'),
  correctText: L(
    "To'g'ri. Qo'shsak 3x = 15, ya'ni x = 5. Keyin 5 − y = 2 va y = 3.",
    'Верно. Сложив, получаем 3x = 15, значит x = 5. Затем 5 − y = 2 и y = 3.',
    'Correct. Adding gives 3x = 15, so x = 5. Then 5 − y = 2 and y = 3.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        "7,5 chiqishi uchun 15 ikkiga bo'lingan. Qo'shgach 3x qoladi: 2x + x.",
        'Чтобы вышло 7,5, делили 15 на два. После сложения остаётся 3x: 2x + x.',
        '7.5 halves 15. Adding leaves 3x: 2x + x.'),
    },
    {
      when: (s) => s.seq.indexOf('d') !== -1,
      text: L(
        "y = 5 bu x ning qiymati. y uchun x ni ikkinchi tenglamaga qo'ying.",
        'y = 5 это значение x. Для y подставь x во второе уравнение.',
        'y = 5 is the x value. Put x into the second equation for y.'),
    },
    {
      when: (s) => s.seq.length < 2,
      text: L(
        'Ikki karta kerak.',
        'Нужны две карточки.',
        'Two cards are needed.'),
    },
  ],
  wrongText: L(
    "Tenglamalarni qo'shing, x ni toping, keyin y ni hisoblang.",
    'Сложи уравнения, найди x, потом посчитай y.',
    'Add the equations, find x, then compute y.'),
};

export default function D38_08(props) { return <BuildLine data={DATA} {...props} />; }
