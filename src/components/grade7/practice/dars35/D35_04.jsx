// Dars35 · Amaliyot 04 — k va b · 🟡 · slots · tag: k_and_b
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 4-o'rin.
// y = −5x + 7: k = −5 (ishora bilan), b = 7.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'k_and_b', level: '🟡',
  eyebrow: L('k va b', 'k и b', 'k and b'),
  setup: L(
    "k -- x oldidagi son, ishorasi bilan birga. b -- ozod had, u ham ishorasi bilan olinadi.",
    'k это число перед x вместе со знаком. b это свободный член, тоже со своим знаком.',
    'k is the number before x, sign included. b is the free term, sign included.'),
  rows: [
    [{ t: ['y', '=', '−5x', '+', '7'] }],
    [{ t: ['k', '='] }, { slot: 0 }, { t: ['b', '='] }, { slot: 1 }],
  ],
  cards: ['−5', '7', '5', '−7'],
  answer: ['−5', '7'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. k = −5: minus koeffitsiyentning bir qismi. b = 7: grafik y o'qini shu nuqtada kesadi.",
    'Верно. k = −5: минус часть коэффициента. b = 7: график пересекает ось y в этой точке.',
    'Correct. k = −5: the minus belongs to the coefficient. b = 7: the graph crosses the y axis there.'),
  wrongs: [
    { when: (s) => s.slots[0] === '5', text: L(
      "Minus koeffitsiyentga tegishli: k = −5, 5 emas.",
      'Минус относится к коэффициенту: k = −5, а не 5.',
      'The minus belongs to the coefficient: k = −5, not 5.') },
    { when: (s) => s.slots[1] === '−7', text: L(
      "Ozod had musbat: yozuvda +7 turibdi.",
      'Свободный член положительный: в записи стоит +7.',
      'The free term is positive: the record has +7.') },
  ],
  wrongText: L(
    "Har songa o'z ishorasi bilan qarang: x oldida nima turadi, oxirida nima?",
    'Смотри на числа вместе со знаками: что стоит перед x и что в конце?',
    'Read the numbers with their signs: what stands before x and what at the end?'),
};

export default function D35_04(props) { return <SlotsBank data={DATA} {...props} />; }
