// Dars27 · Amaliyot 02 — Koeffitsiyentlar · 🟢 · choice · tag: cube_coefs
// Mexanika: kit.jsx -> Choice. Raskladka: 2-o'rin (isinish).
// (a + b)³ = a³ + 3a²b + 3ab² + b³. Koeffitsiyentlar 1, 3, 3, 1.
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'cube_coefs', level: '🟢', optCols: 3,
  eyebrow: L('Koeffitsiyentlar', 'Коэффициенты', 'The coefficients'),
  setup: L(
    "Kub to'rt haddan iborat. Har hadning koeffitsiyenti ma'lum: kvadratdagi 1, 2, 1 kabi, kubda ham o'z tartibi bor.",
    'Куб состоит из четырёх членов. У каждого свой коэффициент: как в квадрате 1, 2, 1, так и в кубе есть свой порядок.',
    'A cube has four terms, each with its own coefficient: like 1, 2, 1 in a square, a cube has its own run.'),
  expr: ['(a', '+', 'b)³'], exprSize: 34,
  ask: L('Koeffitsiyentlar qanday ketadi?', 'Как идут коэффициенты?', 'How do the coefficients run?'),
  opts: [
    { label: ['1', '·', '3', '·', '3', '·', '1'] },
    { label: ['1', '·', '2', '·', '2', '·', '1'] },
    { label: ['1', '·', '3', '·', '1'] },
  ],
  correct: 0,
  correctText: L(
    "To'g'ri. a³ + 3a²b + 3ab² + b³: chetdagilar bir, o'rtadagilar uch.",
    'Верно. a³ + 3a²b + 3ab² + b³: крайние по одному, средние по три.',
    'Correct. a³ + 3a²b + 3ab² + b³: the outer ones are one, the middle ones three.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "1, 2, 2, 1 emas: ikkilik KVADRATDA uchraydi. Kubda o'rtadagi koeffitsiyentlar uch.",
      'Не 1, 2, 2, 1: двойка бывает в КВАДРАТЕ. В кубе средние коэффициенты равны трём.',
      'Not 1, 2, 2, 1: the two belongs to the SQUARE. In a cube the middle coefficients are three.') },
    { when: (s) => s.picked === 2, text: L(
      "Uch had emas, TO'RT had: kubda a³, a²b, ab², b³ bo'ladi.",
      'Не три члена, а ЧЕТЫРЕ: в кубе есть a³, a²b, ab², b³.',
      'Not three terms but FOUR: a cube has a³, a²b, ab², b³.') },
  ],
  wrongText: L(
    "Kubni ko'paytma sifatida yozib ko'ring: (a + b)²(a + b). Nechta had chiqadi?",
    'Запиши куб как произведение: (a + b)²(a + b). Сколько членов выходит?',
    'Write the cube as a product: (a + b)²(a + b). How many terms appear?'),
};

export default function D27_02(props) { return <Choice data={DATA} {...props} />; }
