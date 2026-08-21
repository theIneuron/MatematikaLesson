// Dars37 · Amaliyot 10 — Ikki qadamli zanjir · 🔴 · chain · tag: prop_chain
// Mexanika: kit.jsx -> SlotsBank (ikki qator). Raskladka: 10-o'rin.
// 1-qator: (2; 6) -> k = 3. 2-qator: x = 10 -> y = 30.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'prop_chain', level: '🔴',
  eyebrow: L('Zanjir', 'Цепочка', 'A chain'),
  setup: L(
    "Avval nuqtadan k topiladi, keyin shu k bilan boshqa qiymat hisoblanadi. Ikkinchi qator birinchisiga tayanadi.",
    'Сначала по точке находится k, потом с этим k считается другое значение. Вторая строка опирается на первую.',
    'First k is found from the point, then that k gives another value. The second row rests on the first.'),
  rows: [
    [{ t: ['(2;', '6)', '→', 'k', '='] }, { slot: 0 }],
    [{ t: ['x', '=', '10', '→', 'y', '='] }, { slot: 1 }],
  ],
  cards: ['3', '30', '12', '10'],
  answer: ['3', '30'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. k = 6 : 2 = 3, ya'ni y = 3x. Keyin x = 10 da y = 30.",
    'Верно. k = 6 : 2 = 3, значит y = 3x. Потом при x = 10 выходит y = 30.',
    'Correct. k = 6 : 2 = 3, so y = 3x. Then x = 10 gives y = 30.'),
  wrongs: [
    { when: (s) => s.slots[0] === '12', text: L(
      "12 bu 6 · 2. k ni topish uchun bo'lish kerak: 6 : 2 = 3.",
      '12 это 6 · 2. Чтобы найти k, надо делить: 6 : 2 = 3.',
      '12 is 6 · 2. Finding k needs division: 6 : 2 = 3.') },
    { when: (s) => s.slots[1] === '10', text: L(
      "10 bu x ning o'zi. y ni topish uchun uni k ga ko'paytirish kerak: 3 · 10 = 30.",
      '10 это сам x. Чтобы найти y, его надо умножить на k: 3 · 10 = 30.',
      '10 is x itself. To get y multiply by k: 3 · 10 = 30.') },
    { when: (s) => s.slots[0] === '30' || s.slots[1] === '3', text: L(
      "Qatorlar almashib ketdi: birinchi qatorda k, ikkinchisida y.",
      'Строки перепутались: в первой k, во второй y.',
      'The rows got swapped: k first, then y.') },
  ],
  wrongText: L(
    "Birinchi qatorda k ni bo'lish bilan toping, keyin uni x ga ko'paytiring.",
    'В первой строке найди k делением, потом умножь его на x.',
    'Find k by dividing in the first row, then multiply it by x.'),
};

export default function D37_10(props) { return <SlotsBank data={DATA} {...props} />; }
