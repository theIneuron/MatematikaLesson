// Dars36 · Amaliyot 07 — Jadval · 🟡 · slots · tag: graph_table
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 7-o'rin.
// y = 4 − x: x = 0 -> 4, x = 4 -> 0, x = 6 -> −2.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'graph_table', level: '🟡',
  eyebrow: L('Jadval', 'Таблица', 'A table'),
  setup: L(
    "Uch nuqta uchun qiymat hisoblanadi. x to'rtdan katta bo'lsa y manfiy tomonga o'tadi.",
    'Считаются значения для трёх точек. Если x больше четырёх, y уходит в отрицательную сторону.',
    'Values for three points. Once x passes four, y goes negative.'),
  given: [['y', '=', '4', '−', 'x']],
  givenLabel: L('Formula:', 'Формула:', 'The rule:'),
  rows: [
    [{ t: ['x', '=', '0', '→'] }, { slot: 0 }, { t: ['x', '=', '4', '→'] }, { slot: 1 }, { t: ['x', '=', '6', '→'] }, { slot: 2 }],
  ],
  cards: ['4', '0', '−2', '−4', '8', '2'],
  answer: ['4', '0', '−2'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 4 − 0 = 4, 4 − 4 = 0, 4 − 6 = −2. Grafik x o'qini x = 4 da kesadi.",
    'Верно. 4 − 0 = 4, 4 − 4 = 0, 4 − 6 = −2. График пересекает ось x при x = 4.',
    'Correct. 4 − 0 = 4, 4 − 4 = 0, 4 − 6 = −2. The graph meets the x axis at x = 4.'),
  wrongs: [
    { when: (s) => s.slots[0] === '−4', text: L(
      "x = 0 bo'lganda 4 − 0 = 4: ozod had o'zi qoladi.",
      'При x = 0 выходит 4 − 0 = 4: свободный член остаётся сам.',
      'At x = 0 we get 4 − 0 = 4: the free term stays.') },
    { when: (s) => s.slots[2] === '2' || s.slots[2] === '8', text: L(
      "x = 6 bo'lganda 4 − 6 = −2: javob manfiy.",
      'При x = 6 выходит 4 − 6 = −2: ответ отрицательный.',
      'At x = 6 we get 4 − 6 = −2: the answer is negative.') },
    { when: (s) => s.slots[1] !== '0' && s.slots[1] != null, text: L(
      "x = 4 bo'lganda 4 − 4 = 0: aynan bu nuqtada grafik x o'qini kesadi.",
      'При x = 4 выходит 4 − 4 = 0: именно здесь график пересекает ось x.',
      'At x = 4 we get 4 − 4 = 0: exactly where the graph meets the x axis.') },
  ],
  wrongText: L(
    "Har x uchun to'rtdan uni ayiring: natija musbat, nol yoki manfiy bo'lishi mumkin.",
    'Для каждого x вычитай его из четырёх: результат может быть положительным, нулём или отрицательным.',
    'For each x subtract it from four: the result may be positive, zero or negative.'),
};

export default function D36_07(props) { return <SlotsBank data={DATA} {...props} />; }
