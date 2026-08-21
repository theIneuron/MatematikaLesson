// Dars36 · Amaliyot 08 — Manfiy abssissa · 🔴 · build · tag: graph_neg_x
// Mexanika: kit.jsx -> BuildLine. Raskladka: 8-o'rin.
// y = 2x + 5, x = −3: y = −6 + 5 = −1.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'graph_neg_x', level: '🔴',
  eyebrow: L('Manfiy abssissa', 'Отрицательная абсцисса', 'A negative abscissa'),
  setup: L(
    "Grafikning chap qismidagi nuqta. Manfiy x qo'yilganda ko'paytma manfiy bo'ladi, keyin ozod had qo'shiladi.",
    'Точка в левой части графика. При отрицательном x произведение отрицательное, потом прибавляется свободный член.',
    'A point on the left of the graph. With a negative x the product is negative, then the free term joins.'),
  given: [['y', '=', '2x', '+', '5'], ['x', '=', '−3']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  cards: [
    { id: 'a', label: '2 · (−3) + 5' },
    { id: 'b', label: '−1' },
    { id: 'c', label: '11' },
    { id: 'd', label: '−11' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Hisoblab yozing", 'Запиши вычисление', 'Write the working'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 2 · (−3) = −6, keyin −6 + 5 = −1. Nuqta (−3; −1).",
    'Верно. 2 · (−3) = −6, потом −6 + 5 = −1. Точка (−3; −1).',
    'Correct. 2 · (−3) = −6, then −6 + 5 = −1. The point is (−3; −1).'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "11 chiqishi uchun 6 va 5 qo'shilgan. Ko'paytma manfiy: −6 + 5 = −1.",
      'Чтобы вышло 11, сложили 6 и 5. Произведение отрицательное: −6 + 5 = −1.',
      'To get 11 the 6 and 5 were added. The product is negative: −6 + 5 = −1.') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "−11 chiqishi uchun 5 ham ayirilgan. Formulada +5 turibdi.",
      'Чтобы вышло −11, ещё и 5 вычли. В формуле стоит +5.',
      'To get −11 the 5 was subtracted too. The rule has +5.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Ikki bo'lak kerak: hisoblash va natija.",
      'Нужны две части: вычисление и результат.',
      'Two parts are needed: the working and the result.') },
  ],
  wrongText: L(
    "2 ni −3 ga ko'paytiring: qanday ishora chiqadi? Keyin 5 ni qo'shing.",
    'Умножь 2 на −3: какой знак выйдет? Потом прибавь 5.',
    'Multiply 2 by −3: what sign appears? Then add 5.'),
};

export default function D36_08(props) { return <BuildLine data={DATA} {...props} />; }
