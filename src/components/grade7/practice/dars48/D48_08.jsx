// Dars48 · Amaliyot 08 — Uch yuza · 🔴 · sort · tag: area_zones
// Mexanika: kit.jsx -> Zones. Raskladka: 8-o'rin.
// To'rtburchak 6 va 4 -> 24;  uchburchak asos 12 balandlik 8 -> 48;
// uchburchak asos 6 balandlik 4 -> 12.
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'area_zones', level: '🔴', itemSize: 17, zoneLbl: 68,
  eyebrow: L('Uch yuza', 'Три площади', 'Three areas'),
  setup: L(
    "Ikki xil shakl bor: to'rtburchakda ikkiga bo'lish yo'q, uchburchakda esa bor. Sonlar ataylab yaqin.",
    'Здесь две разные фигуры: у прямоугольника деления на два нет, у треугольника есть. Числа специально близкие.',
    'Two shapes: the rectangle has no halving, the triangle does. The numbers are deliberately close.'),
  zones: [
    { id: 'z24', label: L('24', '24', '24') },
    { id: 'z48', label: L('48', '48', '48') },
    { id: 'z12', label: L('12', '12', '12') },
  ],
  items: [
    { id: 'i1', tokens: ["to'rtburchak", '6', 'va', '4'], zone: 'z24' },
    { id: 'i2', tokens: ['uchburchak', '12', 'va', '8'], zone: 'z48' },
    { id: 'i3', tokens: ['uchburchak', '6', 'va', '4'], zone: 'z12' },
  ],
  ask: L('Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  bank: L('Shakllar', 'Фигуры', 'Shapes'),
  correctText: L(
    "To'g'ri. 6 · 4 = 24 (to'rtburchak); 12 · 8 : 2 = 48; 6 · 4 : 2 = 12. Bir xil sonlar ikki xil natija berdi.",
    'Верно. 6 · 4 = 24 (прямоугольник); 12 · 8 : 2 = 48; 6 · 4 : 2 = 12. Одни числа дали разные результаты.',
    'Correct. 6 · 4 = 24 (rectangle); 12 · 8 : 2 = 48; 6 · 4 : 2 = 12. Same numbers, different results.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('i3') !== -1, text: L(
      "Uchburchakda ikkiga bo'lish bor: 6 · 4 : 2 = 12, 24 emas.",
      'У треугольника есть деление на два: 6 · 4 : 2 = 12, а не 24.',
      'A triangle halves: 6 · 4 : 2 = 12, not 24.') },
    { when: (s) => s.bad.indexOf('i1') !== -1, text: L(
      "To'rtburchakda ikkiga bo'lish yo'q: 6 · 4 = 24.",
      'У прямоугольника деления на два нет: 6 · 4 = 24.',
      'A rectangle does not halve: 6 · 4 = 24.') },
    { when: (s) => s.bad.indexOf('i2') !== -1, text: L(
      "12 · 8 = 96, ikkiga bo'linsa 48.",
      '12 · 8 = 96, при делении на два выходит 48.',
      '12 · 8 = 96, halved gives 48.') },
  ],
  wrongText: L(
    "Har shaklda ikkiga bo'lish kerakmi -- shuni tekshiring.",
    'Проверь в каждой фигуре: нужно ли делить на два?',
    'Check each shape: does it need halving?'),
};

export default function D48_08(props) { return <Zones data={DATA} {...props} />; }
