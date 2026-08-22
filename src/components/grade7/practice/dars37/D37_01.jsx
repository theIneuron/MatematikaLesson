// Dars37 · Amaliyot 01 — Manfiy k ni topish · 🟢 · build · tag: prop_find_k
// Mexanika: kit.jsx -> BuildLine. Raskladka: 1-o'rin `build`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): manfiy va kasr koeffitsiyent,
// ikki qadamli savol, yaqin tuzoq -- PODXOD_7SINF.md 13-band.
// y = kx, (−4; 20): k = 20 : (−4) = −5.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'prop_find_k',
  level: '🟢',
  eyebrow: L(
    'k ni topish',
    'Найти k',
    'Find k'),
  setup: L(
    "To'g'ri proporsionallikda k = y : x. Nuqtaning abssissasi manfiy, ya'ni k ham manfiy chiqadi.",
    'В прямой пропорциональности k = y : x. Абсцисса точки отрицательная, значит и k выйдет отрицательным.',
    'For direct proportion k = y : x. The abscissa is negative, so k comes out negative.'),
  given: [['(−4; 20)']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [{ id: 'a', label: 'k = −5' }, { id: 'b', label: 'k = 5' }, { id: 'c', label: 'k = −80' }],
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
    "To'g'ri. 20 : (−4) = −5, ya'ni y = −5x.",
    'Верно. 20 : (−4) = −5, значит y = −5x.',
    'Correct. 20 : (−4) = −5, so y = −5x.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('b') !== -1,
      text: L(
        "Ishora tashlab ketilgan: musbatni manfiyga bo'lsak manfiy chiqadi.",
        'Потерян знак: положительное делить на отрицательное даёт отрицательное.',
        'The sign is lost: positive over negative is negative.'),
    },
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        "−80 bu 20 · (−4). k bo'lish bilan topiladi: y : x.",
        '−80 это 20 · (−4). k находится делением: y : x.',
        '−80 is 20 · (−4). k comes from dividing: y : x.'),
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
    'k = y : x. Ishoraga diqqat.',
    'k = y : x. Следи за знаком.',
    'k = y : x. Watch the sign.'),
};

export default function D37_01(props) { return <BuildLine data={DATA} {...props} />; }
