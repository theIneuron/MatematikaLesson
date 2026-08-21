// Dars47 · Amaliyot 06 — Uch juftlik · 🟡 · sort · tag: pyth_zones
// Mexanika: kit.jsx -> Zones. Raskladka: 6-o'rin.
// 3 va 4 -> 5;  5 va 12 -> 13;  7 va 24 -> 25.
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'pyth_zones', level: '🟡', itemSize: 22, zoneLbl: 72,
  eyebrow: L('Uch juftlik', 'Три пары', 'Three pairs'),
  setup: L(
    "Bu uchliklar tez-tez uchraydi. Har juft katet uchun gipotenuzani toping.",
    'Эти тройки встречаются часто. Для каждой пары катетов найди гипотенузу.',
    'These triples appear often. For each pair of legs find the hypotenuse.'),
  zones: [
    { id: 'z5', label: L('5', '5', '5') },
    { id: 'z13', label: L('13', '13', '13') },
    { id: 'z25', label: L('25', '25', '25') },
  ],
  items: [
    { id: 'i1', tokens: ['3', 'va', '4'], zone: 'z5' },
    { id: 'i2', tokens: ['5', 'va', '12'], zone: 'z13' },
    { id: 'i3', tokens: ['7', 'va', '24'], zone: 'z25' },
  ],
  ask: L('Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  bank: L('Katetlar', 'Катеты', 'Legs'),
  correctText: L(
    "To'g'ri. 9 + 16 = 25 -> 5; 25 + 144 = 169 -> 13; 49 + 576 = 625 -> 25.",
    'Верно. 9 + 16 = 25 → 5; 25 + 144 = 169 → 13; 49 + 576 = 625 → 25.',
    'Correct. 9 + 16 = 25 → 5; 25 + 144 = 169 → 13; 49 + 576 = 625 → 25.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('i1') !== -1, text: L(
      "3 va 4 uchun 9 + 16 = 25, ya'ni gipotenuza 5.",
      'Для 3 и 4 выходит 9 + 16 = 25, значит гипотенуза 5.',
      'For 3 and 4: 9 + 16 = 25, so the hypotenuse is 5.') },
    { when: (s) => s.bad.indexOf('i2') !== -1, text: L(
      "5 va 12 uchun 25 + 144 = 169, gipotenuza 13.",
      'Для 5 и 12 выходит 25 + 144 = 169, гипотенуза 13.',
      'For 5 and 12: 25 + 144 = 169, the hypotenuse is 13.') },
    { when: (s) => s.bad.indexOf('i3') !== -1, text: L(
      "7 va 24 uchun 49 + 576 = 625, gipotenuza 25.",
      'Для 7 и 24 выходит 49 + 576 = 625, гипотенуза 25.',
      'For 7 and 24: 49 + 576 = 625, the hypotenuse is 25.') },
  ],
  wrongText: L(
    "Har juft uchun kvadratlarni qo'shing va ildiz oling.",
    'Для каждой пары сложи квадраты и извлеки корень.',
    'For each pair add the squares and take the root.'),
};

export default function D47_06(props) { return <Zones data={DATA} {...props} />; }
