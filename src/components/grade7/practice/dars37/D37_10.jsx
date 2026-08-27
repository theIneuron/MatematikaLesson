// Dars37 · Amaliyot 10 — Kasr k bilan zanjir · 🔴 · chain · tag: prop_chain
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 10-o'rin `chain`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): manfiy va kasr koeffitsiyent,
// ikki qadamli savol, yaqin tuzoq -- PODXOD_7SINF.md 13-band.
// (2; −9): k = −4,5; keyin x = 6 da y = −27.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'prop_chain',
  level: '🔴',
  eyebrow: L(
    'Zanjir',
    'Цепочка',
    'A chain'),
  setup: L(
    'Birinchi qatorda koeffitsiyent topiladi -- u kasr chiqadi. Ikkinchi qatorda esa yangi qiymat hisoblanadi.',
    'В первой строке находим коэффициент — он выйдет дробным. Во второй считаем новое значение.',
    'The first row finds the coefficient, which is fractional. The second computes a new value.'),
  given: [['(2; −9)']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  rows: [[{ t: ['k', '='] }, { slot: 0 }], [{ t: ['x = 6', 'da', 'y', '='] }, { slot: 1 }]],
  cards: ['−4,5', '−27', '4,5', '−18'],
  answer: ['−4,5', '−27'],
  ask: L(
    "Kartani bosing, keyin bo'sh katakni bosing.",
    'Нажми карточку, затем клетку.',
    'Tap a card, then tap a cell.'),
  bank: L(
    'Kartalar',
    'Карточки',
    'Cards'),
  correctText: L(
    "To'g'ri. −9 : 2 = −4,5, keyin −4,5 · 6 = −27.",
    'Верно. −9 : 2 = −4,5, затем −4,5 · 6 = −27.',
    'Correct. −9 : 2 = −4.5, then −4.5 · 6 = −27.'),
  wrongs: [
    {
      when: (s) => s.slots[0] === '4,5',
      text: L(
        "Ordinata manfiy, ya'ni k = −4,5.",
        'Ордината отрицательная, значит k = −4,5.',
        'The ordinate is negative, so k = −4.5.'),
    },
    {
      when: (s) => s.slots[1] === '−18',
      text: L(
        "−18 chiqishi uchun k = −3 deb olingan. k = −4,5, ya'ni −4,5 · 6 = −27.",
        'Чтобы вышло −18, брали k = −3. А k = −4,5, значит −4,5 · 6 = −27.',
        '−18 uses k = −3. With k = −4.5 the value is −27.'),
    },
    {
      when: (s) => s.slots.indexOf(null) !== -1,
      text: L(
        "Hamma bo'sh katak to'ldirilishi kerak.",
        'Надо заполнить все клетки.',
        'Every cell must be filled.'),
    },
  ],
  wrongText: L(
    "Avval −9 ni 2 ga bo'ling, keyin natijani 6 ga ko'paytiring.",
    'Сначала раздели −9 на 2, потом умножь результат на 6.',
    'Divide −9 by 2 first, then multiply by 6.'),
};

export default function D37_10(props) { return <SlotsBank data={DATA} {...props} />; }
