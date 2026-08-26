// Dars44 · Amaliyot 07 — Uch to'plam · 🟡 · sort · tag: sum_zones
// Mexanika: kit.jsx -> Zones. Raskladka: 7-o'rin `sort`.
// 60/70/50 = 180 bor; 80/60/50 = 190 ko'p; 40/50/60 = 150 kam.
// TARTIB SAQLANADI (`noShuffle`): razbor yozuvlarga TARTIB bilan murojaat
// qiladi, aralashtirilsa izoh ekrandagiga mos kelmaydi.
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'sum_zones', noShuffle: true,
  level: '🟡',
  eyebrow: L(
    "Uch to'plam",
    'Три набора',
    'Three sets'),
  setup: L(
    "Har to'plamni qo'shing va 180 bilan solishtiring: teng, katta yoki kichik.",
    'Сложи каждый набор и сравни с 180: равно, больше или меньше.',
    'Add each set and compare with 180: equal, more or less.'),
  itemSize: 18,
  zoneLbl: 108,
  zones: [
    {
      id: 'ze',
      label: L(
        'Uchburchak bor',
        'Треугольник есть',
        'Triangle exists'),
    },
    {
      id: 'zm',
      label: L(
        "180 dan ko'p",
        'Больше 180',
        'More than 180'),
    },
    {
      id: 'zl',
      label: L(
        '180 dan kam',
        'Меньше 180',
        'Less than 180'),
    },
  ],
  items: [
    { id: 'i1', tokens: ['60°, 70°, 50°'], zone: 'ze' },
    { id: 'i2', tokens: ['80°, 60°, 50°'], zone: 'zm' },
    { id: 'i3', tokens: ['40°, 50°, 60°'], zone: 'zl' },
  ],
  bank: L(
    "To'plamlar",
    'Наборы',
    'Sets'),
  ask: L(
    'Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  correctText: L(
    "To'g'ri. 180, 190 va 150. Faqat birinchi to'plam uchburchak beradi.",
    'Верно. 180, 190 и 150. Только первый набор даёт треугольник.',
    'Correct. 180, 190 and 150. Only the first set gives a triangle.'),
  wrongs: [
    {
      when: (s) => s.bad.indexOf('i1') !== -1,
      text: L(
        '60 + 70 + 50 = 180: uchburchak bor.',
        '60 + 70 + 50 = 180: треугольник есть.',
        '60 + 70 + 50 = 180: the triangle exists.'),
    },
    {
      when: (s) => s.bad.indexOf('i2') !== -1,
      text: L(
        "80 + 60 + 50 = 190: 180 dan ko'p.",
        '80 + 60 + 50 = 190: больше 180.',
        '80 + 60 + 50 = 190: more than 180.'),
    },
    {
      when: (s) => s.bad.indexOf('i3') !== -1,
      text: L(
        '40 + 50 + 60 = 150: 180 dan kam.',
        '40 + 50 + 60 = 150: меньше 180.',
        '40 + 50 + 60 = 150: less than 180.'),
    },
  ],
  wrongText: L(
    "Uch sonni qo'shing, keyin 180 bilan solishtiring.",
    'Сложи три числа и сравни с 180.',
    'Add the three numbers and compare with 180.'),
};

export default function D44_07(props) { return <Zones data={DATA} {...props} />; }
