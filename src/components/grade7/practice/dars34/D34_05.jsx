// Dars34 · Amaliyot 05 — Jadvalni to'ldirish · 🟡 · slots · tag: fn_table
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 5-o'rin.
// f(x) = 5 − 2x: f(0) = 5, f(1) = 3, f(3) = −1.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'fn_table', level: '🟡',
  eyebrow: L("Jadval", 'Таблица', 'A table'),
  setup: L(
    "Har x uchun qiymat hisoblanadi. Ko'paytuvchi manfiy bo'lgani uchun x oshgan sari y kamayadi.",
    'Для каждого x считается значение. Множитель отрицательный, поэтому с ростом x значение y падает.',
    'Each x gives a value. The factor is negative, so as x grows y falls.'),
  given: [['f(x)', '=', '5', '−', '2x']],
  givenLabel: L('Formula:', 'Формула:', 'The rule:'),
  rows: [
    [{ t: ['f(0)', '='] }, { slot: 0 }, { t: ['f(1)', '='] }, { slot: 1 }, { t: ['f(3)', '='] }, { slot: 2 }],
  ],
  cards: ['5', '3', '−1', '0', '7', '1'],
  answer: ['5', '3', '−1'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 5 − 0 = 5, 5 − 2 = 3, 5 − 6 = −1. Har qadamda ikkiga kamaydi.",
    'Верно. 5 − 0 = 5, 5 − 2 = 3, 5 − 6 = −1. На каждом шаге убыло по два.',
    'Correct. 5 − 0 = 5, 5 − 2 = 3, 5 − 6 = −1. It drops by two each step.'),
  wrongs: [
    { when: (s) => s.slots[0] === '0', text: L(
      "f(0) da 2x nol bo'ladi, lekin 5 qoladi: 5 − 0 = 5.",
      'В f(0) член 2x равен нулю, но 5 остаётся: 5 − 0 = 5.',
      'In f(0) the 2x is zero but the 5 stays: 5 − 0 = 5.') },
    { when: (s) => s.slots[1] === '7', text: L(
      "f(1) da ayirish turibdi: 5 − 2 = 3, qo'shish emas.",
      'В f(1) стоит вычитание: 5 − 2 = 3, а не сложение.',
      'In f(1) it is a subtraction: 5 − 2 = 3, not an addition.') },
    { when: (s) => s.slots[2] === '1', text: L(
      "f(3) da 2 · 3 = 6, ya'ni 5 − 6 = −1: javob manfiy.",
      'В f(3) выходит 2 · 3 = 6, значит 5 − 6 = −1: ответ отрицательный.',
      'In f(3) we get 2 · 3 = 6, so 5 − 6 = −1: the answer is negative.') },
  ],
  wrongText: L(
    "Har x uchun avval 2x ni hisoblang, keyin beshdan ayiring.",
    'Для каждого x сначала посчитай 2x, потом вычти из пяти.',
    'For each x work out 2x first, then subtract from five.'),
};

export default function D34_05(props) { return <SlotsBank data={DATA} {...props} />; }
