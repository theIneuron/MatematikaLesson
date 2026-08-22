// Dars36 · Amaliyot 08 — Ikki grafik kesishishi · 🔴 · build · tag: graph_cross
// Mexanika: kit.jsx -> BuildLine. Raskladka: 8-o'rin `build`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): k manfiy va kasr bo'ladi,
// savol ikki qadamli -- PODXOD_7SINF.md 13-band.
// y = 2x − 1 va y = 5: 2x − 1 = 5 -> x = 3, nuqta (3; 5).
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'graph_cross',
  level: '🔴',
  eyebrow: L(
    'Kesishish nuqtasi',
    'Точка пересечения',
    'The crossing point'),
  setup: L(
    "Ikki grafik kesishgan nuqtada qiymatlar teng bo'ladi. Ikkinchi grafik gorizontal: y har doim 5.",
    'В точке пересечения двух графиков значения равны. Второй график горизонтальный: y всегда 5.',
    'At the crossing the values are equal. The second graph is horizontal: y is always 5.'),
  given: [['y = 2x − 1', 'va', 'y = 5']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [
    { id: 'a', label: '(3; 5)' },
    { id: 'b', label: '(2; 5)' },
    { id: 'c', label: '(5; 3)' },
    { id: 'd', label: '(3; 3)' },
  ],
  answerSeq: ['a'],
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
    "To'g'ri. 2x − 1 = 5 dan 2x = 6 va x = 3. Ordinata esa 5 bo'lib qoladi.",
    'Верно. Из 2x − 1 = 5 следует 2x = 6 и x = 3. А ордината остаётся 5.',
    'Correct. 2x − 1 = 5 gives 2x = 6 and x = 3, while the ordinate stays 5.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('b') !== -1,
      text: L(
        "2 chiqishi uchun 4 ikkiga bo'lingan: 5 + 1 = 6, keyin 6 : 2 = 3.",
        'Чтобы вышло 2, делили 4: сначала 5 + 1 = 6, потом 6 : 2 = 3.',
        '2 halves 4, but 5 + 1 = 6 and 6 : 2 = 3.'),
    },
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        'Koordinatalar joyi almashgan: abssissa 3, ordinata 5.',
        'Координаты поменялись местами: абсцисса 3, ордината 5.',
        'The coordinates swapped: abscissa 3, ordinate 5.'),
    },
    {
      when: (s) => s.seq.indexOf('d') !== -1,
      text: L(
        "Ikkinchi grafikda y har doim 5, ya'ni kesishishda ordinata 5.",
        'На втором графике y всегда 5, значит в пересечении ордината 5.',
        'On the second graph y is always 5, so the crossing has ordinate 5.'),
    },
  ],
  wrongText: L(
    "Ikki yozuvni tenglashtirib x ni toping, ordinata esa 5 bo'lib qoladi.",
    'Приравняй две записи и найди x, а ордината останется 5.',
    'Set the two expressions equal to find x; the ordinate stays 5.'),
};

export default function D36_08(props) { return <BuildLine data={DATA} {...props} />; }
