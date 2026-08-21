// Dars16 · Amaliyot 10 — Uch ko'paytma, uch javob · 🔴 · tag: product_zones
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
//
// Darsning yakuni. Sonlar ataylab yaqin, farqni faqat hisob ko'rsatadi:
//   5x² · 20x³ = 100x⁵    (5 · 20 = 100, 2 + 3 = 5)
//   25x² · 4x⁴ = 100x⁶    (25 · 4 = 100, 2 + 4 = 6)
//   4x² · 5x³  = 20x⁵     (4 · 5 = 20, 2 + 3 = 5)
// Ya'ni bir zonada son bir xil, boshqasida ko'rsatkich bir xil.
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'product_zones', level: '🔴', itemSize: 21, zoneLbl: 92,
  eyebrow: L('Uch javob', 'Три ответа', 'Three answers'),
  setup: L(
    "Uch ko'paytmaning sonlari va ko'rsatkichlari juda yaqin. Har birini oxirigacha hisoblab, javobiga qo'ying.",
    'У трёх произведений числа и показатели очень близки. Посчитай каждое до конца и поставь к своему ответу.',
    'The three products have very close numbers and exponents. Work each one out fully and put it with its answer.'),
  zones: [
    { id: 'z100x5', label: L('100x⁵', '100x⁵', '100x⁵') },
    { id: 'z100x6', label: L('100x⁶', '100x⁶', '100x⁶') },
    { id: 'z20x5', label: L('20x⁵', '20x⁵', '20x⁵') },
  ],
  items: [
    { id: 'i1', tokens: ['5x²', '·', '20x³'], zone: 'z100x5' },
    { id: 'i2', tokens: ['25x²', '·', '4x⁴'], zone: 'z100x6' },
    { id: 'i3', tokens: ['4x²', '·', '5x³'], zone: 'z20x5' },
  ],
  ask: L('Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  bank: L("Ko'paytmalar", 'Произведения', 'Products'),
  correctText: L(
    "To'g'ri. 5 · 20 = 100 va 2 + 3 = 5. 25 · 4 ham 100, lekin 2 + 4 = 6. 4 · 5 = 20 va 2 + 3 = 5.",
    'Верно. 5 · 20 = 100 и 2 + 3 = 5. 25 · 4 тоже 100, но 2 + 4 = 6. 4 · 5 = 20 и 2 + 3 = 5.',
    'Correct. 5 · 20 = 100 and 2 + 3 = 5. 25 · 4 is also 100, but 2 + 4 = 6. 4 · 5 = 20 and 2 + 3 = 5.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('i2') !== -1, text: L(
      "25x² · 4x⁴ da son 100 chiqadi, lekin ko'rsatkichlar 2 + 4 = 6. Ya'ni javob 100x⁶.",
      'В 25x² · 4x⁴ число выходит 100, но показатели 2 + 4 = 6. Значит ответ 100x⁶.',
      'In 25x² · 4x⁴ the number is 100, but the exponents give 2 + 4 = 6. So the answer is 100x⁶.') },
    { when: (s) => s.bad.indexOf('i3') !== -1, text: L(
      "4x² · 5x³ da ko'rsatkich beshta, lekin son 4 · 5 = 20. Yuz emas.",
      'В 4x² · 5x³ показатель пять, но число 4 · 5 = 20. Не сто.',
      'In 4x² · 5x³ the exponent is five, but the number is 4 · 5 = 20. Not a hundred.') },
    { when: (s) => s.bad.indexOf('i1') !== -1, text: L(
      "5x² · 20x³ da son 5 · 20 = 100, ko'rsatkich esa 2 + 3 = 5. Javob 100x⁵.",
      'В 5x² · 20x³ число 5 · 20 = 100, а показатель 2 + 3 = 5. Ответ 100x⁵.',
      'In 5x² · 20x³ the number is 5 · 20 = 100 and the exponent 2 + 3 = 5. The answer is 100x⁵.') },
  ],
  wrongText: L(
    "Har ko'paytmada ikki narsani tekshiring: sonlar ko'paytmasi va ko'rsatkichlar yig'indisi.",
    'В каждом произведении проверь две вещи: произведение чисел и сумму показателей.',
    'Check two things in each product: the product of the numbers and the sum of the exponents.'),
};

export default function D16_10(props) { return <Zones data={DATA} {...props} />; }
