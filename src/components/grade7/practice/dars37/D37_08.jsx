// Dars37 · Amaliyot 08 — Jadval · 🔴 · slots · tag: prop_table
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 8-o'rin `slots`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): manfiy va kasr koeffitsiyent,
// ikki qadamli savol, yaqin tuzoq -- PODXOD_7SINF.md 13-band.
// y = −2x: x = −7 -> 14, x = 0 -> 0, x = 13 -> −26.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'prop_table',
  level: '🔴',
  eyebrow: L(
    'Jadval',
    'Таблица',
    'The table'),
  setup: L(
    'Uch qiymatni hisoblang. Manfiy x da natija musbat, nolda nol, katta x da manfiy chiqadi.',
    'Посчитай три значения. При отрицательном x результат положительный, в нуле ноль, при большом x отрицательный.',
    'Compute three values: a negative x gives a positive, zero gives zero, a large x gives a negative.'),
  given: [['y = −2x']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  rows: [
    [{ t: ['x = −7', '->'] }, { slot: 0 }, { t: ['x = 0', '->'] }, { slot: 1 }],
    [{ t: ['x = 13', '->'] }, { slot: 2 }],
  ],
  cards: ['14', '0', '−26', '−14', '26'],
  answer: ['14', '0', '−26'],
  ask: L(
    'Kartani bosing, keyin uyani bosing.',
    'Нажми карточку, затем клетку.',
    'Tap a card, then tap a cell.'),
  bank: L(
    'Kartalar',
    'Карточки',
    'Cards'),
  correctText: L(
    "To'g'ri. −2 · (−7) = 14; −2 · 0 = 0; −2 · 13 = −26.",
    'Верно. −2 · (−7) = 14; −2 · 0 = 0; −2 · 13 = −26.',
    'Correct. −2 · (−7) = 14; −2 · 0 = 0; −2 · 13 = −26.'),
  wrongs: [
    {
      when: (s) => s.slots[0] === '−14',
      text: L(
        'Ikki minus plyus beradi: −2 · (−7) = +14.',
        'Два минуса дают плюс: −2 · (−7) = +14.',
        'Two minuses give a plus: −2 · (−7) = +14.'),
    },
    {
      when: (s) => s.slots.indexOf('26') !== -1,
      text: L(
        "x = 13 musbat, k manfiy, ya'ni natija manfiy: −26.",
        'x = 13 положительный, k отрицательный, значит результат отрицательный: −26.',
        'x = 13 is positive and k negative, so the result is −26.'),
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
    "Har x ni −2 ga ko'paytiring va ishorani sanang.",
    'Каждый x умножь на −2 и посчитай знак.',
    'Multiply each x by −2 and work out the sign.'),
};

export default function D37_08(props) { return <SlotsBank data={DATA} {...props} />; }
