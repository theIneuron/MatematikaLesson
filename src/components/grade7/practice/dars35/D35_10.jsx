// Dars35 · Amaliyot 10 — Ikki nuqtadan formula · 🔴 · build · tag: lin_from_points
// Mexanika: kit.jsx -> BuildLine. Raskladka: 10-o'rin.
// (0; 1) va (1; 4): b = 1 (x = 0 dagi qiymat), k = 4 − 1 = 3.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'lin_from_points', level: '🔴',
  eyebrow: L('Ikki nuqtadan', 'По двум точкам', 'From two points'),
  setup: L(
    "Birinchi nuqta x = 0 da turadi, ya'ni u to'g'ridan b ni beradi. Bir qadamda y qancha oshgani esa k ni beradi.",
    'Первая точка стоит при x = 0, значит она сразу даёт b. А насколько вырос y за шаг — это k.',
    'The first point has x = 0, so it gives b at once. How much y grew in one step gives k.'),
  given: [['(0;', '1)'], ['(1;', '4)']],
  givenLabel: L('Nuqtalar:', 'Точки:', 'Points:'),
  cards: [
    { id: 'a', label: 'k = 3' },
    { id: 'b', label: 'b = 1' },
    { id: 'c', label: 'k = 4' },
    { id: 'd', label: 'b = 3' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("k va b ni toping", 'Найди k и b', 'Find k and b'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. b = 1, chunki x = 0 da y = 1. k = 4 − 1 = 3: bir qadamda y uchga oshdi. Formula y = 3x + 1.",
    'Верно. b = 1, потому что при x = 0 выходит y = 1. k = 4 − 1 = 3: за шаг y вырос на три. Формула y = 3x + 1.',
    'Correct. b = 1 since y = 1 at x = 0. k = 4 − 1 = 3: y grew by three in one step. The rule is y = 3x + 1.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "k = 4 emas: 4 bu ikkinchi nuqtaning ordinatasi. k esa O'SISH: 4 − 1 = 3.",
      'k не 4: четвёрка это ордината второй точки. А k это ПРИРОСТ: 4 − 1 = 3.',
      'k is not 4: that is the second ordinate. k is the GROWTH: 4 − 1 = 3.') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "b = 3 emas: b bu x = 0 dagi qiymat, ya'ni 1.",
      'b не 3: b это значение при x = 0, то есть 1.',
      'b is not 3: b is the value at x = 0, which is 1.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Ikki son kerak: k va b.",
      'Нужны два числа: k и b.',
      'Two numbers are needed: k and b.') },
  ],
  wrongText: L(
    "x = 0 dagi qiymat nima beradi? x bir oshganda y qancha o'zgardi?",
    'Что даёт значение при x = 0? На сколько изменился y при росте x на единицу?',
    'What does the value at x = 0 give? How much did y change when x grew by one?'),
};

export default function D35_10(props) { return <BuildLine data={DATA} {...props} />; }
