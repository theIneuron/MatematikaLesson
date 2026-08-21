// Dars33 · Amaliyot 10 — Nuqtani o'qish · 🔴 · slots · tag: point_read
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 10-o'rin.
// A(−4; 7): abssissa −4, ordinata 7, chorak II.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'point_read', level: '🔴',
  eyebrow: L('Nuqtani o\'qish', 'Прочитать точку', 'Read the point'),
  setup: L(
    "Nuqta yozuvidan uch narsa o'qiladi: abssissa, ordinata va chorak. Chorak ikki ishoradan chiqadi.",
    'Из записи точки читаются три вещи: абсцисса, ордината и четверть. Четверть выходит из двух знаков.',
    'Three things can be read: the abscissa, the ordinate and the quadrant. The quadrant comes from the two signs.'),
  rows: [
    [{ t: ['A(−4;', '7)'] }],
    [{ t: ['x', '='] }, { slot: 0 }, { t: ['y', '='] }, { slot: 1 }, { t: ['chorak'] }, { slot: 2 }],
  ],
  cards: ['−4', '7', 'II', '4', '−7', 'III'],
  answer: ['−4', '7', 'II'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Abssissa −4 (chapda), ordinata 7 (tepada), ya'ni ikkinchi chorak.",
    'Верно. Абсцисса −4 (слева), ордината 7 (сверху), значит вторая четверть.',
    'Correct. Abscissa −4 (left), ordinate 7 (up), so quadrant II.'),
  wrongs: [
    { when: (s) => s.slots[0] === '4' || s.slots[1] === '−7', text: L(
      "Ishoralarni yozuvdan aynan ko'chirish kerak: abssissa manfiy, ordinata musbat.",
      'Знаки надо переносить точно из записи: абсцисса отрицательная, ордината положительная.',
      'Copy the signs exactly: the abscissa is negative and the ordinate positive.') },
    { when: (s) => s.slots[2] === 'III', text: L(
      "Uchinchi chorakda ikki koordinata ham manfiy. Bizda ordinata musbat, ya'ni ikkinchi chorak.",
      'В третьей четверти обе координаты отрицательные. У нас ордината положительная, значит вторая.',
      'Quadrant III has both negative. Ours has a positive ordinate, so quadrant II.') },
  ],
  wrongText: L(
    "Yozuvdagi birinchi son x, ikkinchisi y. Chorakni ikki ishora belgilaydi.",
    'Первое число в записи это x, второе y. Четверть определяют два знака.',
    'The first number is x, the second y. The two signs give the quadrant.'),
};

export default function D33_10(props) { return <SlotsBank data={DATA} {...props} />; }
