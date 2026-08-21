// Dars48 · Amaliyot 07 — Teskari masala · 🟡 · slots · tag: area_reverse
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 7-o'rin.
// Uchburchak S = 24: asos 8 bo'lsa balandlik 6; balandlik 4 bo'lsa asos 12.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'area_reverse', level: '🟡',
  eyebrow: L('Teskari masala', 'Обратная задача', 'The reverse task'),
  setup: L(
    "Yuza berilgan, asos yoki balandlik so'ralgan. S = a · h : 2 dan a · h = 2S, ya'ni ko'paytma 48 ga teng.",
    'Дана площадь, спрашивается основание или высота. Из S = a · h : 2 выходит a · h = 2S, то есть произведение равно 48.',
    'The area is given and a side is asked. From S = a · h : 2 we get a · h = 2S, so the product is 48.'),
  given: [['S', '=', '24']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  rows: [
    [{ t: ['asos', '=', '8', '→', 'balandlik', '='] }, { slot: 0 }],
    [{ t: ['balandlik', '=', '4', '→', 'asos', '='] }, { slot: 1 }],
  ],
  cards: ['6', '12', '3', '20'],
  answer: ['6', '12'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. a · h = 48. Asos 8 bo'lsa balandlik 48 : 8 = 6; balandlik 4 bo'lsa asos 48 : 4 = 12.",
    'Верно. a · h = 48. При основании 8 высота 48 : 8 = 6; при высоте 4 основание 48 : 4 = 12.',
    'Correct. a · h = 48. With base 8 the height is 6; with height 4 the base is 12.'),
  wrongs: [
    { when: (s) => s.slots[0] === '3', text: L(
      "3 chiqishi uchun 24 ni 8 ga bo'lgan. Lekin S da ikkiga bo'lish bor: a · h = 48, keyin 48 : 8 = 6.",
      'Чтобы вышло 3, разделили 24 на 8. Но в S есть деление на два: a · h = 48, потом 48 : 8 = 6.',
      'To get 3 the 24 was divided by 8. But S halves: a · h = 48, then 48 : 8 = 6.') },
    { when: (s) => s.slots[1] === '20', text: L(
      "20 emas: 48 : 4 = 12. Ko'paytma 48 ga teng bo'lishi kerak.",
      'Не 20: 48 : 4 = 12. Произведение должно быть равно 48.',
      'Not 20: 48 : 4 = 12. The product must be 48.') },
  ],
  wrongText: L(
    "Yuzani ikkiga ko'paytiring: asos va balandlik ko'paytmasi shuncha bo'ladi.",
    'Умножь площадь на два: столько и будет произведение основания на высоту.',
    'Double the area: that is the product of base and height.'),
};

export default function D48_07(props) { return <SlotsBank data={DATA} {...props} />; }
