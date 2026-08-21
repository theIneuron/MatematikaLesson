// Dars33 · Amaliyot 09 — Uch chorak · 🔴 · sort · tag: quadrant_zones
// Mexanika: kit.jsx -> Zones. Raskladka: 9-o'rin.
// (2; 5) -> I;  (−2; 5) -> II;  (−2; −5) -> III.
// Sonlar bir xil, faqat ishoralari boshqa.
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'quadrant_zones', level: '🔴', itemSize: 22, zoneLbl: 90,
  eyebrow: L('Choraklar', 'Четверти', 'Quadrants'),
  setup: L(
    "Uch nuqtada bir xil sonlar: 2 va 5. Chorakni faqat ishoralar belgilaydi: birinchi chorakda ikkovi musbat, uchinchisida ikkovi manfiy.",
    'В трёх точках одни числа: 2 и 5. Четверть определяют только знаки: в первой оба положительные, в третьей оба отрицательные.',
    'The three points share 2 and 5. Only the signs decide the quadrant: both positive in I, both negative in III.'),
  zones: [
    { id: 'z1', label: L('I chorak', 'I четверть', 'Quadrant I') },
    { id: 'z2', label: L('II chorak', 'II четверть', 'Quadrant II') },
    { id: 'z3', label: L('III chorak', 'III четверть', 'Quadrant III') },
  ],
  items: [
    { id: 'i1', tokens: ['(2;', '5)'], zone: 'z1' },
    { id: 'i2', tokens: ['(−2;', '5)'], zone: 'z2' },
    { id: 'i3', tokens: ['(−2;', '−5)'], zone: 'z3' },
  ],
  ask: L('Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  bank: L('Nuqtalar', 'Точки', 'Points'),
  correctText: L(
    "To'g'ri. Ikkinchi chorak chapda va tepada: abssissa manfiy, ordinata musbat. Uchinchisi chapda va pastda.",
    'Верно. Вторая четверть слева и сверху: абсцисса отрицательная, ордината положительная. Третья слева и снизу.',
    'Correct. Quadrant II is left and up: negative abscissa, positive ordinate. Quadrant III is left and down.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('i2') !== -1, text: L(
      "(−2; 5) chapda va tepada: bu ikkinchi chorak.",
      '(−2; 5) слева и сверху: это вторая четверть.',
      '(−2; 5) is left and up: quadrant II.') },
    { when: (s) => s.bad.indexOf('i3') !== -1, text: L(
      "(−2; −5) da ikki koordinata ham manfiy: uchinchi chorak.",
      'У (−2; −5) обе координаты отрицательные: третья четверть.',
      '(−2; −5) has both negative: quadrant III.') },
    { when: (s) => s.bad.indexOf('i1') !== -1, text: L(
      "(2; 5) da ikkovi musbat: birinchi chorak.",
      'У (2; 5) обе положительные: первая четверть.',
      '(2; 5) has both positive: quadrant I.') },
  ],
  wrongText: L(
    "Har nuqtada ikki ishorani ko'ring: nuqta chapdami yoki o'ngda, tepadami yoki pastda?",
    'Смотри на два знака: точка слева или справа, сверху или снизу?',
    'Look at the two signs: left or right, up or down?'),
};

export default function D33_09(props) { return <Zones data={DATA} {...props} />; }
