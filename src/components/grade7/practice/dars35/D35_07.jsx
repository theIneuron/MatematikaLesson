// Dars35 · Amaliyot 07 — x o'qini kesish · 🟡 · bracket · tag: lin_cross
// Mexanika: kit.jsx -> BuildLine. Raskladka: 7-o'rin `bracket`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): k manfiy va kasr bo'ladi,
// savol ikki qadamli -- PODXOD_7SINF.md 13-band.
// y = 5x − 45: y = 0 da 5x = 45, x = 9, nuqta (9; 0).
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'lin_cross',
  level: '🟡',
  eyebrow: L(
    "x o'qini kesish",
    'Пересечение с осью x',
    'The x intercept'),
  setup: L(
    "x o'qida ordinata nol. Shuning uchun y ni nolga tenglashtirib x topiladi, keyin nuqta yoziladi.",
    'На оси x ордината ноль. Поэтому приравниваем y к нулю, находим x и записываем точку.',
    'On the x axis the ordinate is zero, so set y to zero, find x and write the point.'),
  given: [['y = 5x − 45']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [
    { id: 'a', label: '(9;' },
    { id: 'b', label: '0)' },
    { id: 'c', label: '(0;' },
    { id: 'd', label: '−45)' },
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
    "To'g'ri. 5x − 45 = 0 dan x = 9, ya'ni nuqta (9; 0).",
    'Верно. Из 5x − 45 = 0 следует x = 9, значит точка (9; 0).',
    'Correct. 5x − 45 = 0 gives x = 9, so the point is (9; 0).'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('c') !== -1 && s.seq.indexOf('d') !== -1,
      text: L(
        "(0; −45) -- bu y o'qini kesish nuqtasi. Bizga x o'qi kerak.",
        '(0; −45) это пересечение с осью y. А нам нужна ось x.',
        '(0; −45) is the y intercept. We need the x axis.'),
    },
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        "x o'qidagi nuqtada BIRINCHI son noldan farq qiladi, ikkinchisi nol.",
        'У точки на оси x первое число не ноль, а второе ноль.',
        'On the x axis the first number is non-zero and the second is zero.'),
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
    'y ni nolga tenglashtirib tenglamani yeching.',
    'Приравняй y к нулю и решай уравнение.',
    'Set y to zero and solve.'),
};

export default function D35_07(props) { return <BuildLine data={DATA} {...props} />; }
