// Dars33 · Amaliyot 01 — Nuqtaning yozuvi · 🟢 · build · tag: point_write
// Mexanika: kit.jsx -> BuildLine. Raskladka: 1-o'rin `build`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): sonlar ikki xonali va manfiy,
// qadamlar soni ikkitadan boshlanadi -- PODXOD_7SINF.md 13-band.
// Abssissa −12, ordinata 25 -> (−12; 25). Tartib muhim.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'point_write',
  level: '🟢',
  eyebrow: L(
    'Nuqtaning yozuvi',
    'Запись точки',
    'Writing a point'),
  setup: L(
    'Nuqta yozuvida avval abssissa (x), keyin ordinata (y) turadi. Tartib almashsa boshqa nuqta chiqadi.',
    'В записи точки сначала абсцисса (x), потом ордината (y). Если поменять порядок, выйдет другая точка.',
    'A point is written abscissa (x) first, ordinate (y) second. Swapping them gives a different point.'),
  given: [['abssissa −12', ',', 'ordinata 25']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [
    { id: 'a', label: '(−12; 25)' },
    { id: 'b', label: '(25; −12)' },
    { id: 'c', label: '(12; 25)' },
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
    "To'g'ri. Avval abssissa −12, keyin ordinata 25.",
    'Верно. Сначала абсцисса −12, потом ордината 25.',
    'Correct. Abscissa −12 first, then ordinate 25.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('b') !== -1,
      text: L(
        "Tartib almashgan: (25; −12) da abssissa 25 bo'lib qoladi.",
        'Порядок поменялся: в (25; −12) абсциссой становится 25.',
        'The order flipped: in (25; −12) the abscissa becomes 25.'),
    },
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        "Ishora yo'qolgan: abssissa MANFIY, ya'ni −12.",
        'Потерян знак: абсцисса ОТРИЦАТЕЛЬНАЯ, то есть −12.',
        'The sign is gone: the abscissa is NEGATIVE, −12.'),
    },
    {
      when: (s) => s.seq.length < 1,
      text: L(
        'Bitta karta kerak.',
        'Нужна одна карточка.',
        'One card is needed.'),
    },
  ],
  wrongText: L(
    'Avval x, keyin y. Ishoralarni saqlang.',
    'Сначала x, потом y. Сохрани знаки.',
    'x first, then y. Keep the signs.'),
};

export default function D33_01(props) { return <BuildLine data={DATA} {...props} />; }
