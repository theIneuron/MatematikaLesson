// Dars40 · Amaliyot 03 — Kesma bo'laklari · 🟢 · slots · tag: seg_slots
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 3-o'rin `slots`.
// AB = 24, M -- AB ning o'rtasi -> AM = 12. K nuqta AK = 5 -> KM = 12 − 5 = 7.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'seg_slots',
  level: '🟢',
  eyebrow: L(
    "Kesma bo'laklari",
    'Части отрезка',
    'Parts of a segment'),
  setup: L(
    "Kesmaning o'rtasi uni ikki teng bo'lakka bo'ladi. K nuqta A va M orasida yotadi, ya'ni KM ni ayirish bilan topamiz.",
    'Середина отрезка делит его на две равные части. Точка K лежит между A и M, поэтому KM находим вычитанием.',
    'The midpoint splits a segment in half. Point K lies between A and M, so KM comes from subtraction.'),
  given: [['AB = 24', ',', 'AK = 5']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  rows: [[{ t: ['AM', '='] }, { slot: 0 }, { t: ['KM', '='] }, { slot: 1 }]],
  cards: ['12', '7', '19', '24'],
  answer: ['12', '7'],
  ask: L(
    "Kartani bosing, keyin bo'sh katakni bosing.",
    'Нажми карточку, затем клетку.',
    'Tap a card, then tap a cell.'),
  bank: L(
    'Kartalar',
    'Карточки',
    'Cards'),
  correctText: L(
    "To'g'ri. 24 : 2 = 12, keyin 12 − 5 = 7.",
    'Верно. 24 : 2 = 12, затем 12 − 5 = 7.',
    'Correct. 24 : 2 = 12, then 12 − 5 = 7.'),
  wrongs: [
    {
      when: (s) => s.slots[1] === '19',
      text: L(
        "19 bu 24 − 5, ya'ni butun kesmadan ayirilgan. KM esa AM dan ayiriladi.",
        '19 это 24 − 5, вычли из всего отрезка. А KM вычитается из AM.',
        '19 is 24 − 5, taken from the whole segment. KM comes out of AM instead.'),
    },
    {
      when: (s) => s.slots[0] === '24',
      text: L(
        "24 bu butun AB. O'rta nuqta uni ikkiga bo'ladi: 12.",
        '24 это весь AB. Середина делит его на два: 12.',
        '24 is the whole AB. The midpoint halves it: 12.'),
    },
    {
      when: (s) => s.slots.indexOf(null) !== -1,
      text: L(
        "Ikki bo'sh katak ham to'ldirilishi kerak.",
        'Надо заполнить обе клетки.',
        'Both cells must be filled.'),
    },
  ],
  wrongText: L(
    'Avval AM ni toping (kesmaning yarmi), keyin undan AK ni ayiring.',
    'Сначала найди AM (половина отрезка), потом вычти из него AK.',
    'Find AM first (half the segment), then subtract AK from it.'),
};

export default function D40_03(props) { return <SlotsBank data={DATA} {...props} />; }
