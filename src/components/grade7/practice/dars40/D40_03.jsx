// Dars40 · Amaliyot 03 — Ikki nuqta · 🟢 · slots · tag: seg_slots
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 3-o'rin.
// AB = 24, M o'rta nuqta -> AM = 12. K nuqta AK = 5 -> KM = 12 − 5 = 7.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'seg_slots', level: '🟢',
  eyebrow: L('Ikki nuqta', 'Две точки', 'Two points'),
  setup: L(
    "Kesmada ikki nuqta bor: o'rta nuqta M va yana bir nuqta K. Ular orasidagi masofa ayirish bilan topiladi.",
    'На отрезке две точки: середина M и ещё точка K. Расстояние между ними находится вычитанием.',
    'The segment holds two points: the midpoint M and another point K. Subtraction gives the gap.'),
  given: [['AB', '=', '24'], ['AK', '=', '5']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  rows: [
    [{ t: ['AM', '='] }, { slot: 0 }, { t: ['KM', '='] }, { slot: 1 }],
  ],
  cards: ['12', '7', '24', '17'],
  answer: ['12', '7'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. AM = 24 : 2 = 12, keyin KM = 12 − 5 = 7.",
    'Верно. AM = 24 : 2 = 12, потом KM = 12 − 5 = 7.',
    'Correct. AM = 24 : 2 = 12, then KM = 12 − 5 = 7.'),
  wrongs: [
    { when: (s) => s.slots[0] === '24', text: L(
      "24 bu butun kesma. O'rta nuqtagacha uning yarmi: 12.",
      '24 это весь отрезок. До середины его половина: 12.',
      '24 is the whole segment. To the midpoint is half: 12.') },
    { when: (s) => s.slots[1] === '17', text: L(
      "17 chiqishi uchun 5 butun kesmadan ayirilgan. K va M orasidagi masofa esa AM dan hisoblanadi: 12 − 5.",
      'Чтобы вышло 17, пятёрку вычли из всего отрезка. А расстояние между K и M считается от AM: 12 − 5.',
      'To get 17 the 5 was taken from the whole. The gap K to M comes from AM: 12 − 5.') },
  ],
  wrongText: L(
    "Avval o'rta nuqtagacha masofani toping, keyin undan AK ni ayiring.",
    'Сначала найди расстояние до середины, потом вычти AK.',
    'Find the distance to the midpoint first, then subtract AK.'),
};

export default function D40_03(props) { return <SlotsBank data={DATA} {...props} />; }
