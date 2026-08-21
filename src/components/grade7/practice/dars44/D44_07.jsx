// Dars44 · Amaliyot 07 — Uch holat · 🟡 · sort · tag: iso_zones
// Mexanika: kit.jsx -> Zones. Raskladka: 7-o'rin.
// Uchi 40° -> asos burchagi 70°; uchi 80° -> asos burchagi 50°;
// uchi 60° -> teng tomonli, hamma burchak 60°.
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'iso_zones', level: '🟡', itemSize: 21, zoneLbl: 106,
  eyebrow: L('Uch holat', 'Три случая', 'Three cases'),
  setup: L(
    "Uchidagi burchak har xil. Har holatda asos burchagi boshqa chiqadi, oxirgi holat esa maxsus.",
    'Угол при вершине разный. В каждом случае угол при основании свой, а последний случай особый.',
    'The apex differs each time, so each base angle differs; the last case is special.'),
  zones: [
    { id: 'z70', label: L('asos = 70°', 'основание = 70°', 'base = 70°') },
    { id: 'z50', label: L('asos = 50°', 'основание = 50°', 'base = 50°') },
    { id: 'z60', label: L('teng tomonli', 'равносторонний', 'equilateral') },
  ],
  items: [
    { id: 'i1', tokens: ['uchi', '=', '40°'], zone: 'z70' },
    { id: 'i2', tokens: ['uchi', '=', '80°'], zone: 'z50' },
    { id: 'i3', tokens: ['uchi', '=', '60°'], zone: 'z60' },
  ],
  ask: L('Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  bank: L('Holatlar', 'Случаи', 'Cases'),
  correctText: L(
    "To'g'ri. (180 − 40) : 2 = 70, (180 − 80) : 2 = 50, (180 − 60) : 2 = 60 -- oxirgisida hamma burchak teng.",
    'Верно. (180 − 40) : 2 = 70, (180 − 80) : 2 = 50, (180 − 60) : 2 = 60 — в последнем все углы равны.',
    'Correct. (180 − 40) : 2 = 70, (180 − 80) : 2 = 50, (180 − 60) : 2 = 60 — the last has all angles equal.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('i3') !== -1, text: L(
      "Uchi 60° bo'lsa asos burchaklari ham 60° chiqadi: uchburchak teng tomonli bo'ladi.",
      'Если угол при вершине 60°, углы при основании тоже 60°: треугольник равносторонний.',
      'With a 60° apex the base angles are 60° too: the triangle is equilateral.') },
    { when: (s) => s.bad.indexOf('i1') !== -1, text: L(
      "(180 − 40) : 2 = 70: uchi kichik bo'lsa asos burchaklari katta bo'ladi.",
      '(180 − 40) : 2 = 70: чем меньше угол при вершине, тем больше углы при основании.',
      '(180 − 40) : 2 = 70: a smaller apex gives larger base angles.') },
    { when: (s) => s.bad.indexOf('i2') !== -1, text: L(
      "(180 − 80) : 2 = 50.",
      '(180 − 80) : 2 = 50.',
      '(180 − 80) : 2 = 50.') },
  ],
  wrongText: L(
    "Har holatda 180 dan uchini ayirib, qolganini ikkiga bo'ling.",
    'В каждом случае вычти угол при вершине из 180 и раздели остаток на два.',
    'In each case subtract the apex from 180 and halve the rest.'),
};

export default function D44_07(props) { return <Zones data={DATA} {...props} />; }
