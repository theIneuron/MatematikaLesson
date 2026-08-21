// Dars45 · Amaliyot 04 — Mos, keyin qo'shni · 🟡 · chain · tag: par_chain
// Mexanika: kit.jsx -> SlotsBank (ikki qator). Raskladka: 4-o'rin.
// 48° ning mos burchagi 48°, uning qo'shnisi esa 180 − 48 = 132°.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'par_chain', level: '🟡',
  eyebrow: L('Ikki qadam', 'Два шага', 'Two steps'),
  setup: L(
    "Avval mos burchak topiladi -- u teng. Keyin uning qo'shnisi hisoblanadi -- u 180 ga to'ldiradi.",
    'Сначала находится соответственный угол — он равен. Потом его смежный — он дополняет до 180.',
    'First the corresponding angle, which is equal. Then its adjacent, which completes 180.'),
  rows: [
    [{ t: ['48°', 'mos', 'burchagi', '='] }, { slot: 0 }],
    [{ t: ['uning', "qo'shnisi", '='] }, { slot: 1 }],
  ],
  cards: ['48°', '132°', '42°', '96°'],
  answer: ['48°', '132°'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Mos burchak 48°, uning qo'shnisi 180 − 48 = 132°.",
    'Верно. Соответственный угол 48°, его смежный 180 − 48 = 132°.',
    'Correct. The corresponding angle is 48°, its adjacent 180 − 48 = 132°.'),
  wrongs: [
    { when: (s) => s.slots[0] === '132°', text: L(
      "Mos burchak TENG bo'ladi: 48°. 132° esa uning qo'shnisi.",
      'Соответственный угол РАВЕН: 48°. А 132° это его смежный.',
      'The corresponding angle is EQUAL: 48°. The 132° is its adjacent.') },
    { when: (s) => s.slots[1] === '42°', text: L(
      "42 bu 90 − 48. Qo'shni burchak esa 180 dan hisoblanadi.",
      '42 это 90 − 48. А смежный угол считается от 180.',
      '42 is 90 − 48. The adjacent angle comes from 180.') },
    { when: (s) => s.slots[1] === '96°', text: L(
      "96 bu 48 · 2. Qo'shni burchak ko'paytirish bilan topilmaydi.",
      '96 это 48 · 2. Смежный угол не находят умножением.',
      '96 is 48 · 2. An adjacent angle is not found by doubling.') },
  ],
  wrongText: L(
    "Mos burchak teng, qo'shni burchak esa 180 dan ayirish bilan topiladi.",
    'Соответственный угол равен, а смежный находится вычитанием из 180.',
    'The corresponding angle is equal; the adjacent one is 180 minus it.'),
};

export default function D45_04(props) { return <SlotsBank data={DATA} {...props} />; }
