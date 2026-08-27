// Dars36 · Amaliyot 07 — Jadval · 🟡 · slots · tag: graph_table
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 7-o'rin `slots`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): k manfiy va kasr bo'ladi,
// savol ikki qadamli -- PODXOD_7SINF.md 13-band.
// y = 12 − 3x: x = −2 -> 18, x = 4 -> 0, x = 7 -> −9.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'graph_table',
  level: '🟡',
  eyebrow: L(
    'Jadval',
    'Таблица',
    'The table'),
  setup: L(
    "Uch qiymatni hisoblang. Manfiy x da natija o'sadi, katta x da esa manfiy chiqadi.",
    'Посчитай три значения. При отрицательном x результат растёт, при большом x становится отрицательным.',
    'Compute three values. A negative x raises the result, a large x makes it negative.'),
  given: [['y = 12 − 3x']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  rows: [
    [{ t: ['x = −2', '->'] }, { slot: 0 }, { t: ['x = 4', '->'] }, { slot: 1 }],
    [{ t: ['x = 7', '->'] }, { slot: 2 }],
  ],
  cards: ['18', '0', '−9', '6', '33'],
  answer: ['18', '0', '−9'],
  ask: L(
    "Kartani bosing, keyin bo'sh katakni bosing.",
    'Нажми карточку, затем клетку.',
    'Tap a card, then tap a cell.'),
  bank: L(
    'Kartalar',
    'Карточки',
    'Cards'),
  correctText: L(
    "To'g'ri. 12 + 6 = 18; 12 − 12 = 0; 12 − 21 = −9.",
    'Верно. 12 + 6 = 18; 12 − 12 = 0; 12 − 21 = −9.',
    'Correct. 12 + 6 = 18; 12 − 12 = 0; 12 − 21 = −9.'),
  wrongs: [
    {
      when: (s) => s.slots[0] === '6',
      text: L(
        '6 chiqishi uchun 12 − 6 hisoblangan. x manfiy: −3 · (−2) = +6.',
        'Чтобы вышло 6, считали 12 − 6. x отрицательный: −3 · (−2) = +6.',
        '6 comes from 12 − 6, yet −3 · (−2) = +6.'),
    },
    {
      when: (s) => s.slots.indexOf('33') !== -1,
      text: L(
        '33 chiqishi uchun 12 + 21 hisoblangan. x = 7 da 21 AYIRILADI.',
        'Чтобы вышло 33, считали 12 + 21. При x = 7 двадцать один ВЫЧИТАЕТСЯ.',
        '33 adds 12 and 21. At x = 7 the 21 is SUBTRACTED.'),
    },
    {
      when: (s) => s.slots.indexOf(null) !== -1,
      text: L(
        "Hamma bo'sh katak to'ldirilishi kerak.",
        'Надо заполнить все клетки.',
        'Every cell must be filled.'),
    },
  ],
  wrongText: L(
    "Har x ni 3 ga ko'paytirib 12 dan ayiring, ishorani saqlang.",
    'Каждый x умножь на 3 и вычти из 12, следи за знаком.',
    'Multiply each x by 3, subtract from 12, keep the sign.'),
};

export default function D36_07(props) { return <SlotsBank data={DATA} {...props} />; }
