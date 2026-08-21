// Dars48 · Amaliyot 05 — Kvadrat yuzasi · 🟡 · order · tag: area_square
// Mexanika: kit.jsx -> BuildLine (tartib muhim). Raskladka: 5-o'rin.
// Tomoni 9 bo'lgan kvadrat: 9 · 9 = 81, S = 81.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'area_square', level: '🟡',
  eyebrow: L('Kvadrat yuzasi', 'Площадь квадрата', 'Area of a square'),
  setup: L(
    "Kvadratda hamma tomon teng, ya'ni yuza tomonning kvadratiga teng bo'ladi.",
    'В квадрате все стороны равны, значит площадь это квадрат стороны.',
    'A square has equal sides, so the area is the side squared.'),
  given: [['tomon', '=', '9']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  cards: [
    { id: 'a', label: '9 · 9' },
    { id: 'b', label: '81' },
    { id: 'c', label: '9 · 4' },
    { id: 'd', label: '36' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Hisoblab yozing", 'Запиши вычисление', 'Write the working'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. S = 9 · 9 = 81.",
    'Верно. S = 9 · 9 = 81.',
    'Correct. S = 9 · 9 = 81.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1 || s.seq.indexOf('d') !== -1, text: L(
      "9 · 4 = 36 bu PERIMETR: to'rt tomonning yig'indisi. Yuza esa tomonning kvadrati.",
      '9 · 4 = 36 это ПЕРИМЕТР: сумма четырёх сторон. А площадь это квадрат стороны.',
      '9 · 4 = 36 is the PERIMETER: four sides. Area is the side squared.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Ikki bo'lak kerak: hisoblash va natija.",
      'Нужны две части: вычисление и результат.',
      'Two parts are needed: the working and the result.') },
  ],
  wrongText: L(
    "Kvadrat yuzasi uchun tomon nechchi marta ko'paytiriladi?",
    'Сколько раз умножается сторона для площади квадрата?',
    'How many times is the side multiplied for the area?'),
};

export default function D48_05(props) { return <BuildLine data={DATA} {...props} />; }
