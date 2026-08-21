// Dars12 · Amaliyot 07 — Yo'lning ikki bo'lagi · 🔴 · tag: two_leg_trip
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SlotsBank.
//
// «Mashina 4 soat x km/soat tezlik bilan yurdi, keyin yana 60 km bosdi,
// jami 300 km.»
//   4x + 60 = 300  ->  4x = 240  ->  x = 60
// Kartalar orasida 360 (60 ni qo'shgan), 90 (360 : 4) va 4 turadi.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'two_leg_trip', level: '🔴',
  eyebrow: L("Yo'lning ikki bo'lagi", 'Две части пути', 'Two legs of a trip'),
  setup: L(
    "Mashina 4 soat davomida x km/soat tezlik bilan yurdi, keyin yana 60 km bosdi. Jami yo'l 300 km.",
    'Машина 4 часа ехала со скоростью x км/ч, потом прошла ещё 60 км. Весь путь 300 км.',
    'A car drove for 4 hours at x km/h, then covered another 60 km. The whole trip was 300 km.'),
  rows: [
    [{ t: ['4x', '+', '60', '=', '300'] }],
    [{ t: ['4x', '='] }, { slot: 0 }],
    [{ t: ['x', '='] }, { slot: 1 }],
  ],
  cards: ['240', '60', '360', '90', '4', '75'],
  answer: ['240', '60'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 4x = 300 − 60 = 240, keyin x = 240 : 4 = 60. Tezlik 60 km/soat.",
    'Верно. 4x = 300 − 60 = 240, затем x = 240 : 4 = 60. Скорость 60 км/ч.',
    'Correct. 4x = 300 − 60 = 240, then x = 240 : 4 = 60. The speed is 60 km/h.'),
  wrongs: [
    { when: (s) => s.slots[0] === '360', text: L(
      "60 km chap tomonda qo'shilgan edi: o'ngga ko'chganda ayiriladi, 300 − 60 = 240.",
      'Шестьдесят километров были слева прибавлены: при переносе направо они вычитаются, 300 − 60 = 240.',
      'The 60 km was added on the left: moving right it is subtracted, 300 − 60 = 240.') },
    { when: (s) => s.slots[1] === '90', text: L(
      "90 bu 360 : 4. Lekin birinchi bo'lakda 240 km bosilgan: 240 : 4 = 60.",
      '90 это 360 : 4. Но на первом участке пройдено 240 км: 240 : 4 = 60.',
      '90 is 360 : 4. But the first leg covered 240 km: 240 : 4 = 60.') },
    { when: (s) => s.slots[1] === '75', text: L(
      "75 bu 300 : 4, ya'ni oxirgi 60 km hisobga olinmagan. Ular tezlik bilan bosilgan yo'lga kirmaydi.",
      '75 это 300 : 4, то есть последние 60 км не учтены. Они не входят в путь, пройденный с этой скоростью.',
      '75 is 300 : 4, so the last 60 km were not taken out. They are not part of the distance driven at that speed.') },
  ],
  wrongText: L(
    "Avval 60 km ni ayirib, tezlik bilan bosilgan yo'lni toping. Keyin uni 4 soatga bo'ling.",
    'Сначала вычти 60 км и найди путь, пройденный с этой скоростью. Потом раздели его на 4 часа.',
    'First take the 60 km away to get the distance driven at that speed. Then divide it by the 4 hours.'),
};

export default function D12_07(props) { return <SlotsBank data={DATA} {...props} />; }
