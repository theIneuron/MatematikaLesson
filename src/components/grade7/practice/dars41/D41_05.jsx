// Dars41 · Amaliyot 05 — Uch to'plam · 🟡 · sort · tag: kind_zones
// Mexanika: kit.jsx -> Zones. Raskladka: 5-o'rin `sort`.
// 30/60/90 -> to'g'ri; 20/40/120 -> o'tmas; 50/60/70 -> o'tkir. Turini KATTA burchak hal qiladi.
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'kind_zones',
  level: '🟡',
  eyebrow: L(
    "Uch to'plam",
    'Три набора',
    'Three sets'),
  setup: L(
    "Turini eng KATTA burchak hal qiladi: u 90 dan kichik, teng yoki katta bo'lishi mumkin. Qolgan burchaklarga qarash shart emas.",
    'Вид решает самый БОЛЬШОЙ угол: он либо меньше 90, либо равен, либо больше. На остальные смотреть не надо.',
    'The LARGEST angle decides: below 90, equal to it, or above. The other angles do not matter.'),
  itemSize: 20,
  zoneLbl: 108,
  zones: [
    {
      id: 'za',
      label: L(
        "O'tkir burchakli",
        'Остроугольный',
        'Acute'),
    },
    {
      id: 'zr',
      label: L(
        "To'g'ri burchakli",
        'Прямоугольный',
        'Right'),
    },
    {
      id: 'zo',
      label: L(
        "O'tmas burchakli",
        'Тупоугольный',
        'Obtuse'),
    },
  ],
  items: [
    { id: 'i1', tokens: ['30°, 60°, 90°'], zone: 'zr' },
    { id: 'i2', tokens: ['20°, 40°, 120°'], zone: 'zo' },
    { id: 'i3', tokens: ['50°, 60°, 70°'], zone: 'za' },
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
    "To'g'ri. Katta burchak 90 -- to'g'ri burchakli; 120 -- o'tmas; 70 -- o'tkir.",
    'Верно. Больший угол 90 — прямоугольный; 120 — тупоугольный; 70 — остроугольный.',
    'Correct. Largest angle 90 gives right; 120 gives obtuse; 70 gives acute.'),
  wrongs: [
    {
      when: (s) => s.bad.indexOf('i1') !== -1,
      text: L(
        "90 gradusli burchak bor, ya'ni uchburchak to'g'ri burchakli.",
        'Есть угол 90 градусов, значит треугольник прямоугольный.',
        'A 90 degree angle is present, so the triangle is right-angled.'),
    },
    {
      when: (s) => s.bad.indexOf('i2') !== -1,
      text: L(
        "120 > 90: bu o'tmas burchak.",
        '120 > 90: это тупой угол.',
        '120 > 90: that is an obtuse angle.'),
    },
    {
      when: (s) => s.bad.indexOf('i3') !== -1,
      text: L(
        "70 < 90, ya'ni hamma burchak o'tkir.",
        '70 < 90, значит все углы острые.',
        '70 < 90, so every angle is acute.'),
    },
  ],
  wrongText: L(
    "Har to'plamdan eng katta sonni oling va 90 bilan solishtiring.",
    'Возьми из каждого набора наибольшее число и сравни с 90.',
    'Take the largest number in each set and compare it with 90.'),
};

export default function D41_05(props) { return <Zones data={DATA} {...props} />; }
