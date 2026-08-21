// Dars21 · Amaliyot 05 — Uch natija · 🟡 · sort · tag: product_zones
// Mexanika: kit.jsx -> Zones. Raskladka: 5-o'rin.
// (x + 3)(x + 5) = x² + 8x + 15;  (x + 5)(x − 3) = x² + 2x − 15;
// (x − 3)(x − 5) = x² − 8x + 15. Farq faqat ishorada.
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'product_zones', level: '🟡', itemSize: 20, zoneLbl: 108,
  eyebrow: L('Ishora hal qiladi', 'Решает знак', 'The sign decides'),
  setup: L(
    "Uch ko'paytmada sonlar bir xil: 3 va 5. Faqat ishoralari boshqa, natijalar esa butunlay har xil chiqadi.",
    'В трёх произведениях числа одинаковые: 3 и 5. Различаются только знаки, а результаты выходят совсем разные.',
    'The three products share the numbers 3 and 5. Only the signs differ, and the results come out quite different.'),
  zones: [
    { id: 'z1', label: L('x² + 8x + 15', 'x² + 8x + 15', 'x² + 8x + 15') },
    { id: 'z2', label: L('x² + 2x − 15', 'x² + 2x − 15', 'x² + 2x − 15') },
    { id: 'z3', label: L('x² − 8x + 15', 'x² − 8x + 15', 'x² − 8x + 15') },
  ],
  items: [
    { id: 'i1', tokens: ['(x', '+', '3)', '(x', '+', '5)'], zone: 'z1' },
    { id: 'i2', tokens: ['(x', '+', '5)', '(x', '−', '3)'], zone: 'z2' },
    { id: 'i3', tokens: ['(x', '−', '3)', '(x', '−', '5)'], zone: 'z3' },
  ],
  ask: L('Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  bank: L("Ko'paytmalar", 'Произведения', 'Products'),
  correctText: L(
    "To'g'ri. Ikki plyus: 3 + 5 = 8 va 3 · 5 = 15. Har xil ishora: 5 − 3 = 2 va ozod had manfiy. Ikki minus: yig'indi manfiy, ko'paytma musbat.",
    'Верно. Два плюса: 3 + 5 = 8 и 3 · 5 = 15. Разные знаки: 5 − 3 = 2, свободный член отрицательный. Два минуса: сумма отрицательная, произведение положительное.',
    'Correct. Two pluses: 3 + 5 = 8 and 3 · 5 = 15. Mixed signs: 5 − 3 = 2 with a negative free term. Two minuses: negative sum, positive product.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('i2') !== -1, text: L(
      "(x + 5)(x − 3) da ozod had 5 · (−3) = −15, o'rta had esa −3x + 5x = +2x.",
      'В (x + 5)(x − 3) свободный член 5 · (−3) = −15, а средний −3x + 5x = +2x.',
      'In (x + 5)(x − 3) the free term is 5 · (−3) = −15 and the middle one −3x + 5x = +2x.') },
    { when: (s) => s.bad.indexOf('i3') !== -1, text: L(
      "(x − 3)(x − 5) da ikki minus: ozod had (−3)(−5) = +15, o'rta had esa −3x − 5x = −8x.",
      'В (x − 3)(x − 5) два минуса: свободный член (−3)(−5) = +15, а средний −3x − 5x = −8x.',
      'In (x − 3)(x − 5) two minuses: the free term (−3)(−5) = +15 and the middle one −3x − 5x = −8x.') },
    { when: (s) => s.bad.indexOf('i1') !== -1, text: L(
      "(x + 3)(x + 5) da hammasi musbat: 8x va 15.",
      'В (x + 3)(x + 5) всё положительное: 8x и 15.',
      'In (x + 3)(x + 5) everything is positive: 8x and 15.') },
  ],
  wrongText: L(
    "Har ko'paytmada ikki narsani hisoblang: ozod hadlar ko'paytmasi va o'rta hadlar yig'indisi.",
    'В каждом произведении посчитай две вещи: произведение свободных членов и сумму средних.',
    'In each product work out two things: the product of the free terms and the sum of the middle ones.'),
};

export default function D21_05(props) { return <Zones data={DATA} {...props} />; }
