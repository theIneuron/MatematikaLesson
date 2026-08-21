// Dars37 · Amaliyot 08 — Jadval · 🔴 · slots · tag: prop_table
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 8-o'rin.
// y = −2x: x = −3 -> 6, x = 0 -> 0, x = 5 -> −10.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'prop_table', level: '🔴',
  eyebrow: L('Jadval', 'Таблица', 'A table'),
  setup: L(
    "k manfiy: manfiy x musbat y beradi, musbat x esa manfiy y beradi. Nol har doim nolga o'tadi.",
    'k отрицательный: отрицательный x даёт положительный y, а положительный x отрицательный y. Нуль всегда переходит в нуль.',
    'k is negative: a negative x gives a positive y and vice versa. Zero always maps to zero.'),
  given: [['y', '=', '−2x']],
  givenLabel: L('Formula:', 'Формула:', 'The rule:'),
  rows: [
    [{ t: ['x', '=', '−3', '→'] }, { slot: 0 }, { t: ['x', '=', '0', '→'] }, { slot: 1 }, { t: ['x', '=', '5', '→'] }, { slot: 2 }],
  ],
  cards: ['6', '0', '−10', '−6', '10', '2'],
  answer: ['6', '0', '−10'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. −2 · (−3) = 6, −2 · 0 = 0, −2 · 5 = −10.",
    'Верно. −2 · (−3) = 6, −2 · 0 = 0, −2 · 5 = −10.',
    'Correct. −2 · (−3) = 6, −2 · 0 = 0, −2 · 5 = −10.'),
  wrongs: [
    { when: (s) => s.slots[0] === '−6', text: L(
      "Ikki minus musbat beradi: −2 · (−3) = +6.",
      'Два минуса дают плюс: −2 · (−3) = +6.',
      'Two minuses give a plus: −2 · (−3) = +6.') },
    { when: (s) => s.slots[2] === '10', text: L(
      "Bitta minus bor: −2 · 5 = −10.",
      'Минус один: −2 · 5 = −10.',
      'One minus: −2 · 5 = −10.') },
    { when: (s) => s.slots[1] === '2', text: L(
      "Nolga ko'paytirilsa nol chiqadi: −2 · 0 = 0.",
      'При умножении на нуль выходит нуль: −2 · 0 = 0.',
      'Multiplying by zero gives zero: −2 · 0 = 0.') },
  ],
  wrongText: L(
    "Har x uchun minuslar sonini sanang: bitta minus manfiy, ikkita minus musbat beradi.",
    'Для каждого x посчитай минусы: один минус даёт отрицательное, два положительное.',
    'Count the minuses for each x: one gives negative, two give positive.'),
};

export default function D37_08(props) { return <SlotsBank data={DATA} {...props} />; }
