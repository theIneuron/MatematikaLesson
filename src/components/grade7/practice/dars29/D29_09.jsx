// Dars29 · Amaliyot 09 — Kvadrat ichida kvadrat · 🔴 · bracket · tag: fact_group_square
// Mexanika: kit.jsx -> BuildLine (qavs kartalari). Raskladka: 9-o'rin.
// x² + 10x + 25 − y² = (x + 5)² − y² = (x + 5 − y)(x + 5 + y).
// Uch had to'liq kvadratga yig'iladi, keyin kvadratlar ayirmasi ishlaydi.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'fact_group_square', level: '🔴',
  eyebrow: L('Kvadrat ichida', 'Квадрат внутри', 'A square inside'),
  setup: L(
    "Birinchi uch had to'liq kvadrat: (x + 5)². Undan y² ayirilsa, yana kvadratlar ayirmasi chiqadi -- asoslari (x + 5) va y.",
    'Первые три члена это полный квадрат: (x + 5)². Если вычесть y², снова выходит разность квадратов с основаниями (x + 5) и y.',
    'The first three terms make (x + 5)². Subtracting y² gives another difference of squares, with bases (x + 5) and y.'),
  expr: ['x²', '+', '10x', '+', '25', '−', 'y²'], exprSize: 26,
  cards: [
    { id: 'a', label: '(x + 5 − y)' },
    { id: 'b', label: '(x + 5 + y)' },
    { id: 'c', label: '(x + 5)²' },
    { id: 'd', label: '(x − 5 + y)' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Ikki qavsni qo'ying", 'Поставь две скобки', 'Place the two brackets'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. (x + 5)² − y² = (x + 5 − y)(x + 5 + y). Asoslar (x + 5) va y.",
    'Верно. (x + 5)² − y² = (x + 5 − y)(x + 5 + y). Основания это (x + 5) и y.',
    'Correct. (x + 5)² − y² = (x + 5 − y)(x + 5 + y). The bases are (x + 5) and y.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "(x + 5)² bu faqat birinchi qadam: undan y² ayirilishi kerak, ya'ni ajratish davom etadi.",
      '(x + 5)² это только первый шаг: из него надо вычесть y², то есть разложение продолжается.',
      '(x + 5)² is only the first step: y² must still be subtracted, so the split continues.') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "Birinchi asos (x + 5), ya'ni ikki qavsda ham x + 5 turadi. Faqat y ning ishorasi farq qiladi.",
      'Первое основание это (x + 5), значит в обеих скобках стоит x + 5. Различается только знак y.',
      'The first base is (x + 5), so both brackets hold x + 5. Only the sign of y differs.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Javob ikki qavsdan iborat: biri minus, biri plyus bilan.",
      'Ответ состоит из двух скобок: одна с минусом, другая с плюсом.',
      'The answer has two brackets: one with a minus, one with a plus.') },
  ],
  wrongText: L(
    "Birinchi uch hadni bitta kvadratga yig'ing, keyin kvadratlar ayirmasini qo'llang.",
    'Собери первые три члена в один квадрат, потом примени разность квадратов.',
    'Fold the first three terms into one square, then apply the difference of squares.'),
};

export default function D29_09(props) { return <BuildLine data={DATA} {...props} />; }
