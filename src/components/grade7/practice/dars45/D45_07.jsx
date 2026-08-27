// Dars45 · Amaliyot 07 — Uch burchak birga · 🟡 · slots · tag: par_slots
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 7-o'rin.
// ∠1 = 75°: almashinuvchi 75°, bir tomonli 105°.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'par_slots', level: '🟡',
  eyebrow: L('Ikki juft', 'Две пары', 'Two pairs'),
  setup: L(
    "Bitta burchakdan ikki xil juftlik hisoblanadi: teng bo'lgani va 180 ga to'ldiradigani.",
    'От одного угла считаются две разные пары: равная и дополняющая до 180.',
    'One angle gives two different pairs: the equal one and the one completing 180.'),
  given: [['∠1', '=', '75°']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  rows: [
    [{ t: [L('almashinuvchi', 'накрест лежащий', 'alternate'), '='] }, { slot: 0 }, { t: [L('bir', 'один', 'one'), L('tomonli', 'по сторонам', 'by sides'), '='] }, { slot: 1 }],
  ],
  cards: ['75°', '105°', '15°', '150°'],
  answer: ['75°', '105°'],
  ask: L("Kartani bosing, keyin bo'sh katakni bosing.", 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Almashinuvchi burchak teng: 75°. Bir tomonli esa 180 − 75 = 105°.",
    'Верно. Накрест лежащий равен: 75°. А односторонний 180 − 75 = 105°.',
    'Correct. The alternate angle is 75°. The same-side one is 180 − 75 = 105°.'),
  wrongs: [
    { when: (s) => s.slots[1] === '15°', text: L(
      "15 bu 90 − 75. Bir tomonli burchaklar 180 gradusga to'ldiradi.",
      '15 это 90 − 75. Односторонние углы дополняют до 180.',
      '15 is 90 − 75. Same-side angles complete 180.') },
    { when: (s) => s.slots[1] === '150°', text: L(
      "150 bu 75 · 2. Bir tomonli burchak 180 dan ayirish bilan topiladi.",
      '150 это 75 · 2. Односторонний угол находится вычитанием из 180.',
      '150 is 75 · 2. The same-side angle is 180 minus the given.') },
    { when: (s) => s.slots[0] === '105°', text: L(
      "Almashinuvchi burchak TENG bo'ladi, 105° esa bir tomonli.",
      'Накрест лежащий угол РАВЕН, а 105° это односторонний.',
      'The alternate angle is EQUAL; 105° is the same-side one.') },
  ],
  wrongText: L(
    "Bir juft teng, ikkinchisi 180 ga to'ldiradi. Qaysi biri qaysi?",
    'Одна пара равна, другая дополняет до 180. Какая из них какая?',
    'One pair is equal, the other completes 180. Which is which?'),
};

export default function D45_07(props) { return <SlotsBank data={DATA} {...props} />; }
