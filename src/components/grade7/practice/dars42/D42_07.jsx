// Dars42 · Amaliyot 07 — Uch to'plam, uch alomat · 🟡 · sort · tag: eq_signs_zones
// Mexanika: kit.jsx -> Zones. Raskladka: 7-o'rin `sort`.
// 5, 7, orasidagi 40° -> ikki tomon va burchak; 6 va yopishgan 30°, 50° -> tomon va ikki burchak; 4, 6, 9 -> uch tomon.
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'eq_signs_zones',
  level: '🟡',
  eyebrow: L(
    'Uch alomat',
    'Три признака',
    'Three criteria'),
  setup: L(
    "Har to'plam bitta alomatga to'g'ri keladi. Burchak tomonlar ORASIDA turgani yoki tomonga YOPISHGANI muhim.",
    'Каждый набор отвечает одному признаку. Важно, стоит ли угол МЕЖДУ сторонами или ПРИЛЕЖИТ к стороне.',
    'Each set matches one criterion. What matters is whether the angle sits BETWEEN sides or is ADJACENT to one.'),
  itemSize: 18,
  zoneLbl: 112,
  zones: [
    {
      id: 'z1',
      label: L(
        'Uch tomon',
        'Три стороны',
        'Three sides'),
    },
    {
      id: 'z2',
      label: L(
        'Ikki tomon va burchak',
        'Две стороны и угол',
        'Two sides and angle'),
    },
    {
      id: 'z3',
      label: L(
        'Tomon va ikki burchak',
        'Сторона и два угла',
        'Side and two angles'),
    },
  ],
  items: [
    { id: 'i1', tokens: ['4, 6, 9'], zone: 'z1' },
    { id: 'i2', tokens: ['5, 7, orasidagi 40°'], zone: 'z2' },
    { id: 'i3', tokens: ['6, yopishgan 30° va 50°'], zone: 'z3' },
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
    "To'g'ri. Uch son -- uch tomon; ikki tomon va orasidagi burchak; bitta tomon va unga yopishgan ikki burchak.",
    'Верно. Три числа это три стороны; две стороны и угол между ними; одна сторона и два прилежащих угла.',
    'Correct. Three numbers are three sides; two sides with the included angle; one side with two adjacent angles.'),
  wrongs: [
    {
      when: (s) => s.bad.indexOf('i1') !== -1,
      text: L(
        "4, 6, 9 -- uchtasi ham tomon, burchak yo'q.",
        '4, 6, 9 это три стороны, углов нет.',
        '4, 6, 9 are three sides with no angle.'),
    },
    {
      when: (s) => s.bad.indexOf('i2') !== -1,
      text: L(
        'Bu yerda ikki tomon va ular ORASIDAGI burchak berilgan.',
        'Здесь две стороны и угол МЕЖДУ ними.',
        'Here we have two sides and the angle BETWEEN them.'),
    },
    {
      when: (s) => s.bad.indexOf('i3') !== -1,
      text: L(
        'Bitta tomon va unga YOPISHGAN ikki burchak -- uchinchi alomat.',
        'Одна сторона и два ПРИЛЕЖАЩИХ к ней угла это третий признак.',
        'One side with two ADJACENT angles is the third criterion.'),
    },
  ],
  wrongText: L(
    "Har to'plamda nechta tomon va nechta burchak borligini sanang.",
    'Посчитай в каждом наборе число сторон и число углов.',
    'Count the sides and the angles in each set.'),
};

export default function D42_07(props) { return <Zones data={DATA} {...props} />; }
