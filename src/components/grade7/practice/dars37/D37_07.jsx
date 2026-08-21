// Dars37 · Amaliyot 07 — Formulani tuzish · 🟡 · build · tag: prop_build
// Mexanika: kit.jsx -> BuildLine. Raskladka: 7-o'rin.
// (3; 12) -> k = 12 : 3 = 4, ya'ni y = 4x.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'prop_build', level: '🟡',
  eyebrow: L('Formulani tuzish', 'Составить формулу', 'Build the rule'),
  setup: L(
    "Bitta nuqta yetadi: proporsionallikda ozod had yo'q, shuning uchun faqat k topiladi.",
    'Одной точки достаточно: в пропорциональности нет свободного члена, поэтому находится только k.',
    'One point is enough: a proportion has no free term, so only k is needed.'),
  given: [['(3;', '12)']],
  givenLabel: L('Nuqta:', 'Точка:', 'The point:'),
  cards: [
    { id: 'a', label: 'k = 4' },
    { id: 'b', label: 'y = 4x' },
    { id: 'c', label: 'k = 36' },
    { id: 'd', label: 'y = 3x' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("k ni topib formulani yozing", 'Найди k и запиши формулу', 'Find k and write the rule'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. k = 12 : 3 = 4, ya'ni y = 4x. Tekshirish: 4 · 3 = 12.",
    'Верно. k = 12 : 3 = 4, значит y = 4x. Проверка: 4 · 3 = 12.',
    'Correct. k = 12 : 3 = 4, so y = 4x. Check: 4 · 3 = 12.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "36 bu 12 · 3. k ni topish uchun bo'lish kerak.",
      '36 это 12 · 3. Чтобы найти k, надо делить.',
      '36 is 12 · 3. Finding k needs division.') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "y = 3x da 3 · 3 = 9, 12 emas. Koeffitsiyent 4.",
      'В y = 3x выходит 3 · 3 = 9, а не 12. Коэффициент равен 4.',
      'In y = 3x we get 3 · 3 = 9, not 12. The coefficient is 4.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Ikki bo'lak kerak: k va formula.",
      'Нужны две части: k и формула.',
      'Two parts are needed: k and the rule.') },
  ],
  wrongText: L(
    "12 ni 3 ga bo'ling, keyin topilgan sonni formulaga qo'ying.",
    'Раздели 12 на 3, потом подставь найденное число в формулу.',
    'Divide 12 by 3, then put that number into the rule.'),
};

export default function D37_07(props) { return <BuildLine data={DATA} {...props} />; }
