// Dars40 · Amaliyot 02 — Kesma va o'rta nuqta · 🟢 · chain · tag: seg_chain
// Mexanika: kit.jsx -> SlotsBank (ikki qator). Raskladka: 2-o'rin.
// AC = 5, CB = 9 -> AB = 14. AB ning o'rtasi M: AM = 7.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'seg_chain', level: '🟢',
  eyebrow: L("O'rta nuqta", 'Середина', 'The midpoint'),
  setup: L(
    "Avval butun kesma topiladi, keyin uning o'rtasi. O'rta nuqta kesmani teng ikkiga bo'ladi.",
    'Сначала находится весь отрезок, потом его середина. Середина делит отрезок на две равные части.',
    'First the whole segment, then its midpoint. The midpoint splits it into two equal halves.'),
  rows: [
    [{ t: ['AC', '=', '5,', 'CB', '=', '9', '→', 'AB', '='] }, { slot: 0 }],
    [{ t: ['AM', '='] }, { slot: 1 }],
  ],
  cards: ['14', '7', '4', '28'],
  answer: ['14', '7'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. AB = 5 + 9 = 14, o'rtasi esa 14 : 2 = 7.",
    'Верно. AB = 5 + 9 = 14, а середина 14 : 2 = 7.',
    'Correct. AB = 5 + 9 = 14 and the half is 14 : 2 = 7.'),
  wrongs: [
    { when: (s) => s.slots[0] === '4', text: L(
      "4 bu 9 − 5. C nuqta kesma ICHIDA, ya'ni bo'laklar qo'shiladi.",
      '4 это 9 − 5. Точка C лежит ВНУТРИ отрезка, значит части складываются.',
      '4 is 9 − 5. C lies INSIDE the segment, so the parts add.') },
    { when: (s) => s.slots[1] === '28', text: L(
      "28 bu 14 · 2. O'rta nuqta kesmani BO'LADI, ko'paytirmaydi.",
      '28 это 14 · 2. Середина ДЕЛИТ отрезок, а не умножает.',
      '28 is 14 · 2. The midpoint DIVIDES the segment.') },
  ],
  wrongText: L(
    "Ikki bo'lakni qo'shing, keyin natijani ikkiga bo'ling.",
    'Сложи две части, потом раздели результат на два.',
    'Add the two parts, then halve the result.'),
};

export default function D40_02(props) { return <SlotsBank data={DATA} {...props} />; }
