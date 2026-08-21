// Dars37 · Amaliyot 09 — Manfiy nuqtadan formula · 🔴 · build · tag: prop_neg_build
// Mexanika: kit.jsx -> BuildLine. Raskladka: 9-o'rin.
// (−4; 20): k = 20 : (−4) = −5, ya'ni y = −5x.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'prop_neg_build', level: '🔴',
  eyebrow: L('Manfiy nuqta', 'Отрицательная точка', 'A negative point'),
  setup: L(
    "Abssissa manfiy, ordinata musbat: bo'linma manfiy chiqadi. Grafik ikkinchi va to'rtinchi chorakdan o'tadi.",
    'Абсцисса отрицательная, ордината положительная: частное выходит отрицательным. График идёт через вторую и четвёртую четверти.',
    'Negative abscissa, positive ordinate: the quotient is negative. The graph runs through quadrants II and IV.'),
  given: [['(−4;', '20)']],
  givenLabel: L('Nuqta:', 'Точка:', 'The point:'),
  cards: [
    { id: 'a', label: 'k = −5' },
    { id: 'b', label: 'y = −5x' },
    { id: 'c', label: 'k = 5' },
    { id: 'd', label: 'y = 5x' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("k ni topib formulani yozing", 'Найди k и запиши формулу', 'Find k and write the rule'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. k = 20 : (−4) = −5, ya'ni y = −5x. Tekshirish: −5 · (−4) = 20.",
    'Верно. k = 20 : (−4) = −5, значит y = −5x. Проверка: −5 · (−4) = 20.',
    'Correct. k = 20 : (−4) = −5, so y = −5x. Check: −5 · (−4) = 20.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1 || s.seq.indexOf('d') !== -1, text: L(
      "Ishorani tekshiring: 5 · (−4) = −20, bizda esa +20. Ya'ni k manfiy bo'lishi kerak.",
      'Проверь знак: 5 · (−4) = −20, а у нас +20. Значит k должен быть отрицательным.',
      'Check the sign: 5 · (−4) = −20, but we need +20. So k must be negative.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Ikki bo'lak kerak: k va formula.",
      'Нужны две части: k и формула.',
      'Two parts are needed: k and the rule.') },
  ],
  wrongText: L(
    "20 ni −4 ga bo'ling: musbatni manfiyga bo'lsa qanday ishora chiqadi?",
    'Раздели 20 на −4: какой знак даёт положительное, делённое на отрицательное?',
    'Divide 20 by −4: what sign does a positive over a negative give?'),
};

export default function D37_09(props) { return <BuildLine data={DATA} {...props} />; }
