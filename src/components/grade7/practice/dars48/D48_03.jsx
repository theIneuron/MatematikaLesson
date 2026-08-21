// Dars48 · Amaliyot 03 — Yuza va perimetr · 🟢 · slots · tag: area_slots
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 3-o'rin.
// To'rtburchak 12 va 5: S = 60, P = 2(12 + 5) = 34.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'area_slots', level: '🟢',
  eyebrow: L('Yuza va perimetr', 'Площадь и периметр', 'Area and perimeter'),
  setup: L(
    "Bir to'rtburchak uchun ikki xil kattalik hisoblanadi: yuza ko'paytirish bilan, perimetr esa qo'shish bilan.",
    'Для одного прямоугольника считаются две величины: площадь умножением, периметр сложением.',
    'One rectangle gives two quantities: area by multiplying, perimeter by adding.'),
  given: [['12', 'va', '5']],
  givenLabel: L('Tomonlar:', 'Стороны:', 'Sides:'),
  rows: [
    [{ t: ['S', '='] }, { slot: 0 }, { t: ['P', '='] }, { slot: 1 }],
  ],
  cards: ['60', '34', '17', '120'],
  answer: ['60', '34'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. S = 12 · 5 = 60, P = 2 · (12 + 5) = 34.",
    'Верно. S = 12 · 5 = 60, P = 2 · (12 + 5) = 34.',
    'Correct. S = 12 · 5 = 60, P = 2 · (12 + 5) = 34.'),
  wrongs: [
    { when: (s) => s.slots[1] === '17', text: L(
      "17 bu faqat 12 + 5. Perimetrda har tomon IKKI marta hisobga olinadi: 2 · 17 = 34.",
      '17 это только 12 + 5. В периметре каждая сторона учитывается ДВАЖДЫ: 2 · 17 = 34.',
      '17 is only 12 + 5. The perimeter counts each side TWICE: 2 · 17 = 34.') },
    { when: (s) => s.slots[0] === '120', text: L(
      "120 bu 60 · 2. Yuza uchun faqat tomonlar ko'paytiriladi: 12 · 5 = 60.",
      '120 это 60 · 2. Для площади просто перемножаются стороны: 12 · 5 = 60.',
      '120 is 60 · 2. Area just multiplies the sides: 12 · 5 = 60.') },
  ],
  wrongText: L(
    "Yuza uchun ko'paytiring, perimetr uchun to'rt tomonni qo'shing.",
    'Для площади умножь, для периметра сложи четыре стороны.',
    'Multiply for the area; add the four sides for the perimeter.'),
};

export default function D48_03(props) { return <SlotsBank data={DATA} {...props} />; }
