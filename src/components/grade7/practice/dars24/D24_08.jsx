// Dars24 · Amaliyot 08 — Ikki harfli bo'lish · 🔴 · slots · tag: div_two_letters
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 8-o'rin.
// (56x⁷y³ − 42x⁵y²) : 14x⁴y² = 4x³y − 3x.
//   56 : 14 = 4, x: 7 − 4 = 3, y: 3 − 2 = 1
//   42 : 14 = 3, x: 5 − 4 = 1, y: 2 − 2 = 0
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'div_two_letters', level: '🔴',
  eyebrow: L('Ikki harf', 'Две буквы', 'Two letters'),
  setup: L(
    "Har hadda uch amal bor: sonni bo'lish, x larni qisqartirish, y larni qisqartirish. Ikkinchi hadda y butunlay qisqaradi.",
    'В каждом члене три действия: разделить число, сократить x, сократить y. Во втором члене y сокращается полностью.',
    'Each term needs three actions: divide the number, cancel the x, cancel the y. In the second term the y goes entirely.'),
  rows: [
    [{ t: ['(56x⁷y³', '−', '42x⁵y²)', ':', '14x⁴y²', '='] }, { slot: 0 }, { slot: 1 }],
  ],
  cards: ['4x³y', '−3x', '4x³', '−3xy', '+3x', '4x³y²'],
  answer: ['4x³y', '−3x'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Birinchi hadda y dan bittasi qoldi: 3 − 2 = 1. Ikkinchisida esa 2 − 2 = 0, y yo'qoldi.",
    'Верно. В первом члене от y осталась одна: 3 − 2 = 1. Во втором 2 − 2 = 0, y исчезла.',
    'Correct. The first term keeps one y: 3 − 2 = 1. In the second 2 − 2 = 0 and the y is gone.'),
  wrongs: [
    { when: (s) => s.slots[0] === '4x³', text: L(
      "Birinchi hadda y qoladi: bo'linuvchida y³, bo'luvchida y², ya'ni 3 − 2 = 1.",
      'В первом члене y остаётся: в делимом y³, в делителе y², значит 3 − 2 = 1.',
      'The first term keeps a y: the dividend has y³ and the divisor y², so 3 − 2 = 1.') },
    { when: (s) => s.slots[1] === '−3xy', text: L(
      "Ikkinchi hadda y qolmaydi: ikkovida ham y², 2 − 2 = 0.",
      'Во втором члене y не остаётся: у обоих y², 2 − 2 = 0.',
      'The second term keeps no y: both have y², so 2 − 2 = 0.') },
    { when: (s) => s.slots[1] === '+3x', text: L(
      "Ishora yo'qoldi: bo'linuvchida ayirma turgan.",
      'Потерялся знак: в делимом стоит разность.',
      'The sign got lost: the dividend is a difference.') },
    { when: (s) => s.slots[0] === '4x³y²', text: L(
      "y ning ko'rsatkichi ayiriladi, ko'chirilmaydi: 3 − 2 = 1.",
      'Показатель y вычитается, а не переписывается: 3 − 2 = 1.',
      'The exponent of y is subtracted, not copied: 3 − 2 = 1.') },
  ],
  wrongText: L(
    "Har hadda uchta ishni bajaring: son, x, y. Har biri alohida hisoblanadi.",
    'В каждом члене сделай три дела: число, x, y. Каждое считается отдельно.',
    'Do three things in each term: the number, the x, the y. Each on its own.'),
};

export default function D24_08(props) { return <SlotsBank data={DATA} {...props} />; }
