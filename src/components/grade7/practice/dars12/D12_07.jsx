// Dars12 · Amaliyot 07 — Yo'lning ikki bo'lagi · 🔴 · tag: two_leg_trip
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SlotsBank.
//
// «Mashina 5 soat x km/soat tezlik bilan yurdi, keyin yana 60 km bosdi,
// jami 300 km.»
//   5x + 60 = 300  ->  5x = 240  ->  x = 48
// SONLAR ALMASHTIRILDI (metodist QA si, 2026-08-22): ilgari 4x edi va javob
// x = 60 chiqardi -- aynan shu son shartda turgani uchun uni ko'chirib qo'yish
// mumkin edi. Endi javob shartdagi hech qaysi son bilan mos kelmaydi.
// Kartalar orasida 360 (60 ni qo'shgan), 60 (eski javob) va 5 turadi.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'two_leg_trip', level: '🔴',
  eyebrow: L("Yo'lning ikki bo'lagi", 'Две части пути', 'Two legs of a trip'),
  setup: L(
    "Mashina 5 soat davomida x km/soat tezlik bilan yurdi, keyin yana 60 km bosdi. Jami yo'l 300 km.",
    'Машина 5 часов ехала со скоростью x км/ч, потом прошла ещё 60 км. Весь путь 300 км.',
    'A car drove for 5 hours at x km/h, then covered another 60 km. The whole trip was 300 km.'),
  rows: [
    [{ t: ['5x', '+', '60', '=', '300'] }],
    [{ t: ['5x', '='] }, { slot: 0 }],
    [{ t: ['x', '='] }, { slot: 1 }],
  ],
  cards: ['240', '48', '360', '60', '5', '1200'],
  answer: ['240', '48'],
  ask: L("Kartani bosing, keyin bo'sh katakni bosing.", 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 5x = 300 − 60 = 240, keyin x = 240 : 5 = 48. Tezlik 48 km/soat.",
    'Верно. 5x = 300 − 60 = 240, затем x = 240 : 5 = 48. Скорость 48 км/ч.',
    'Correct. 5x = 300 − 60 = 240, then x = 240 : 5 = 48. The speed is 48 km/h.'),
  wrongs: [
    { when: (s) => s.slots[0] === '360', text: L(
      "60 km chap tomonda qo'shilgan edi: o'ngga ko'chganda ayiriladi, 300 − 60 = 240.",
      'Шестьдесят километров были слева прибавлены: при переносе направо они вычитаются, 300 − 60 = 240.',
      'The 60 km was added on the left: moving right it is subtracted, 300 − 60 = 240.') },
    { when: (s) => s.slots[1] === '60', text: L(
      "60 bu eski javob. Birinchi bo'lakda 240 km bosilgan: 240 : 5 = 48.",
      '60 это ответ к другой задаче. На первом участке пройдено 240 км: 240 : 5 = 48.',
      '60 belongs to another task. The first leg covered 240 km: 240 : 5 = 48.') },
    { when: (s) => s.slots[1] === '1200', text: L(
      "1200 bu 240 · 5. Tezlik topish uchun yo'l vaqtga BO'LINADI: 240 : 5 = 48.",
      '1200 это 240 · 5. Чтобы найти скорость, путь ДЕЛЯТ на время: 240 : 5 = 48.',
      '1200 is 240 · 5. Speed comes from dividing the distance by the time: 240 : 5 = 48.') },
  ],
  wrongText: L(
    "Avval 60 km ni ayirib, tezlik bilan bosilgan yo'lni toping. Keyin uni 5 soatga bo'ling.",
    'Сначала вычти 60 км и найди путь, пройденный с этой скоростью. Потом раздели его на 5 часов.',
    'First take the 60 km away to get the distance driven at that speed. Then divide it by the 5 hours.'),
};

export default function D12_07(props) { return <SlotsBank data={DATA} {...props} />; }
