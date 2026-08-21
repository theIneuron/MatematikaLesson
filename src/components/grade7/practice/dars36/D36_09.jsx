// Dars36 · Amaliyot 09 — x o'qini kesish · 🔴 · bracket · tag: graph_x_cross
// Mexanika: kit.jsx -> BuildLine (qavs kartalari). Raskladka: 9-o'rin.
// y = 3x − 12: y = 0 da x = 4, ya'ni nuqta (4; 0).
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'graph_x_cross', level: '🔴',
  eyebrow: L("x o'qini kesish", 'Пересечение с осью x', 'The x intercept'),
  setup: L(
    "Grafik x o'qini y = 0 bo'lgan joyda kesadi. Avval tenglama yechiladi, keyin nuqta yoziladi.",
    'График пересекает ось x там, где y = 0. Сначала решается уравнение, потом записывается точка.',
    'The graph meets the x axis where y = 0. Solve the equation first, then write the point.'),
  given: [['y', '=', '3x', '−', '12']],
  givenLabel: L('Formula:', 'Формула:', 'The rule:'),
  cards: [
    { id: 'a', label: '(4;' },
    { id: 'b', label: '0)' },
    { id: 'c', label: '(0;' },
    { id: 'd', label: '4)' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Nuqtaning yozuvini tuzing", 'Составь запись точки', 'Build the point record'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 3x − 12 = 0 -> x = 4, ya'ni nuqta (4; 0): ordinata nol.",
    'Верно. 3x − 12 = 0 → x = 4, значит точка (4; 0): ордината нуль.',
    'Correct. 3x − 12 = 0 → x = 4, so the point is (4; 0): the ordinate is zero.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1 || s.seq.indexOf('d') !== -1, text: L(
      "(0; 4) bu y o'qidagi nuqta. x o'qida ORDINATA nol bo'ladi, ya'ni nol ikkinchi o'rinda.",
      '(0; 4) это точка на оси y. На оси x нулём является ОРДИНАТА, значит нуль стоит вторым.',
      '(0; 4) sits on the y axis. On the x axis the ORDINATE is zero, so the zero comes second.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Yozuv ikki bo'lakdan iborat.",
      'Запись состоит из двух частей.',
      'The record has two parts.') },
  ],
  wrongText: L(
    "x o'qida qaysi koordinata nol? Tenglamadan x ni toping.",
    'Какая координата равна нулю на оси x? Найди x из уравнения.',
    'Which coordinate is zero on the x axis? Solve for x.'),
};

export default function D36_09(props) { return <BuildLine data={DATA} {...props} />; }
