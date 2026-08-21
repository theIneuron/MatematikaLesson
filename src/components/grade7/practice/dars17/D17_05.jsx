// Dars17 · Amaliyot 05 — Uch javobga ajratish · 🟡 · sort · tag: power_zones
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Mexanika RASKLADKADAN: 17-dars, 5-o'rin `sort`.
//
// (4t⁴)² = 16t⁸   (4² = 16, 4 · 2 = 8)
// (4t³)² = 16t⁶   (4² = 16, 3 · 2 = 6)
// (8t³)² = 64t⁶   (8² = 64, 3 · 2 = 6)
// Zonalar bir-biridan faqat bitta son yoki bitta ko'rsatkich bilan farq
// qiladi: ko'z bilan tanib olib bo'lmaydi, hisoblash kerak.
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'power_zones', level: '🟡', itemSize: 23, zoneLbl: 88,
  eyebrow: L('Uch javob', 'Три ответа', 'Three answers'),
  setup: L(
    "Uch qavsning sonlari va ko'rsatkichlari yaqin. Har birini oxirigacha hisoblab, javobiga qo'ying.",
    'У трёх скобок числа и показатели близки. Посчитай каждую до конца и поставь к своему ответу.',
    'The three brackets have close numbers and exponents. Work each one out fully and put it with its answer.'),
  zones: [
    { id: 'z16t8', label: L('16t⁸', '16t⁸', '16t⁸') },
    { id: 'z16t6', label: L('16t⁶', '16t⁶', '16t⁶') },
    { id: 'z64t6', label: L('64t⁶', '64t⁶', '64t⁶') },
  ],
  items: [
    { id: 'i1', tokens: ['(4t⁴)²'], zone: 'z16t8' },
    { id: 'i2', tokens: ['(4t³)²'], zone: 'z16t6' },
    { id: 'i3', tokens: ['(8t³)²'], zone: 'z64t6' },
  ],
  ask: L('Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  bank: L('Qavslar', 'Скобки', 'Brackets'),
  correctText: L(
    "To'g'ri. Ikki qavsda son 4² = 16, farqi ko'rsatkichda: 4 · 2 = 8 va 3 · 2 = 6. Uchinchisida esa 8² = 64.",
    'Верно. В двух скобках число 4² = 16, разница в показателе: 4 · 2 = 8 и 3 · 2 = 6. А в третьей 8² = 64.',
    'Correct. Two brackets give 4² = 16 and differ in the exponent: 4 · 2 = 8 and 3 · 2 = 6. The third gives 8² = 64.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('i1') !== -1, text: L(
      "(4t⁴)² da ko'rsatkich 4 · 2 = 8, ya'ni 16t⁸. Sakkiz bilan olti aralashib ketdi.",
      'В (4t⁴)² показатель 4 · 2 = 8, то есть 16t⁸. Восемь и шесть перепутались.',
      'In (4t⁴)² the exponent is 4 · 2 = 8, that is 16t⁸. Eight and six got mixed up.') },
    { when: (s) => s.bad.indexOf('i3') !== -1, text: L(
      "(8t³)² da son 8² = 64, 16 emas. Ko'rsatkich esa 3 · 2 = 6.",
      'В (8t³)² число 8² = 64, а не 16. А показатель 3 · 2 = 6.',
      'In (8t³)² the number is 8² = 64, not 16. The exponent is 3 · 2 = 6.') },
    { when: (s) => s.bad.indexOf('i2') !== -1, text: L(
      "(4t³)² da son 16, ko'rsatkich esa 3 · 2 = 6. Ya'ni 16t⁶.",
      'В (4t³)² число 16, а показатель 3 · 2 = 6. Значит 16t⁶.',
      'In (4t³)² the number is 16 and the exponent 3 · 2 = 6. So 16t⁶.') },
  ],
  wrongText: L(
    "Har qavsda ikki narsani hisoblang: son qanday chiqadi va ko'rsatkichlar ko'paytmasi nechchi.",
    'В каждой скобке посчитай две вещи: что выходит из числа и сколько даёт произведение показателей.',
    'In each bracket work out two things: what the number gives and what the exponents multiply to.'),
};

export default function D17_05(props) { return <Zones data={DATA} {...props} />; }
