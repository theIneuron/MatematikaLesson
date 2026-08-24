// Dars34 · Amaliyot 05 — Jadvalni to'ldirish · 🟡 · slots · tag: fn_table
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 5-o'rin `slots`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): sonlar ikki xonali va manfiy,
// qadamlar soni ikkitadan boshlanadi -- PODXOD_7SINF.md 13-band.
// f(x) = 7 − 2x: f(−4) = 15, f(0) = 7, f(6) = −5.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'fn_table',
  level: '🟡',
  eyebrow: L(
    'Jadval',
    'Таблица',
    'The table'),
  setup: L(
    'Uch qiymatni hisoblang. Manfiy x da ikki minus plyus beradi, katta x da esa natija manfiy chiqadi.',
    'Посчитай три значения. При отрицательном x два минуса дают плюс, а при большом x результат становится отрицательным.',
    'Compute three values. A negative x turns the minuses into a plus, a large x makes the result negative.'),
  given: [['f(x) = 7 − 2x']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  rows: [
    [{ t: ['f(−4)', '='] }, { slot: 0 }, { t: ['f(0)', '='] }, { slot: 1 }],
    [{ t: ['f(6)', '='] }, { slot: 2 }],
  ],
  cards: ['15', '7', '−5', '−1', '19'],
  answer: ['15', '7', '−5'],
  ask: L(
    'Kartani bosing, keyin uyani bosing.',
    'Нажми карточку, затем клетку.',
    'Tap a card, then tap a cell.'),
  bank: L(
    'Kartalar',
    'Карточки',
    'Cards'),
  correctText: L(
    "To'g'ri. 7 − 2 · (−4) = 7 + 8 = 15; 7 − 0 = 7; 7 − 12 = −5.",
    'Верно. 7 − 2 · (−4) = 7 + 8 = 15; 7 − 0 = 7; 7 − 12 = −5.',
    'Correct. 7 − 2 · (−4) = 7 + 8 = 15; 7 − 0 = 7; 7 − 12 = −5.'),
  wrongs: [
    {
      when: (s) => s.slots[0] === '−1',
      text: L(
        '−1 chiqishi uchun 7 − 8 hisoblangan: manfiy x da ikki minus PLYUS beradi.',
        'Чтобы вышло −1, считали 7 − 8: при отрицательном x два минуса дают ПЛЮС.',
        '−1 comes from 7 − 8, yet a negative x makes two minuses a PLUS.'),
    },
    {
      when: (s) => s.slots.indexOf('19') !== -1,
      text: L(
        '19 chiqishi uchun 7 + 12 hisoblangan. f(6) da 12 AYIRILADI.',
        'Чтобы вышло 19, считали 7 + 12. В f(6) двенадцать ВЫЧИТАЕТСЯ.',
        '19 comes from 7 + 12, but f(6) SUBTRACTS the twelve.'),
    },
    {
      when: (s) => s.slots.indexOf(null) !== -1,
      text: L(
        "Hamma uya to'ldirilishi kerak.",
        'Надо заполнить все клетки.',
        'Every cell must be filled.'),
    },
  ],
  wrongText: L(
    "Har x ni 2 ga ko'paytirib 7 dan ayiring, ishoralarga diqqat qiling.",
    'Каждый x умножь на 2 и вычти из 7, следи за знаками.',
    'Multiply each x by 2, subtract from 7, and watch the signs.'),
};

export default function D34_05(props) { return <SlotsBank data={DATA} {...props} />; }
