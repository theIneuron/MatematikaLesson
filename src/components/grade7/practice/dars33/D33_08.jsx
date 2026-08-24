// Dars33 · Amaliyot 08 — To'rtinchi uch · 🔴 · build · tag: point_fourth
// Mexanika: kit.jsx -> BuildLine. Raskladka: 8-o'rin `build`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): sonlar ikki xonali va manfiy,
// qadamlar soni ikkitadan boshlanadi -- PODXOD_7SINF.md 13-band.
// A(−3; 2), B(5; 2), C(5; −4) -> to'rtburchakning to'rtinchi uchi D(−3; −4).
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'point_fourth',
  level: '🔴',
  eyebrow: L(
    "To'rtinchi uch",
    'Четвёртая вершина',
    'The fourth vertex'),
  setup: L(
    "Uch uchi berilgan to'g'ri to'rtburchakning to'rtinchi uchini toping: qarama-qarshi tomonlar bir xil to'g'ri chiziqlarda yotadi.",
    'Найди четвёртую вершину прямоугольника по трём данным: противоположные стороны лежат на тех же прямых.',
    'Find the fourth vertex of the rectangle: opposite sides lie on the same lines.'),
  given: [['A(−3; 2)', ',', 'B(5; 2)', ',', 'C(5; −4)']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [
    { id: 'a', label: '(−3; −4)' },
    { id: 'b', label: '(−4; −3)' },
    { id: 'c', label: '(3; −4)' },
    { id: 'd', label: '(−3; 4)' },
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
    "To'g'ri. D ning abssissasi A bilan bir xil (−3), ordinatasi C bilan bir xil (−4).",
    'Верно. У D абсцисса как у A (−3), ордината как у C (−4).',
    'Correct. D shares the abscissa of A (−3) and the ordinate of C (−4).'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('b') !== -1,
      text: L(
        'Koordinatalar joyi almashgan: avval abssissa, keyin ordinata.',
        'Координаты поменялись местами: сначала абсцисса, потом ордината.',
        'The coordinates swapped: abscissa first, ordinate second.'),
    },
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        "Abssissa A bilan bir xil bo'lishi kerak, ya'ni −3, musbat 3 emas.",
        'Абсцисса должна совпасть с A, то есть −3, а не 3.',
        'The abscissa must match A: −3, not 3.'),
    },
    {
      when: (s) => s.seq.indexOf('d') !== -1,
      text: L(
        "Ordinata C bilan bir xil: −4. Bu yerda ishora yo'qolgan.",
        'Ордината совпадает с C: −4. Здесь потерян знак.',
        'The ordinate matches C: −4. The sign is lost here.'),
    },
  ],
  wrongText: L(
    'D nuqta A bilan bir vertikalda va C bilan bir gorizontalda turadi.',
    'Точка D стоит на одной вертикали с A и на одной горизонтали с C.',
    'D shares a vertical with A and a horizontal with C.'),
};

export default function D33_08(props) { return <BuildLine data={DATA} {...props} />; }
