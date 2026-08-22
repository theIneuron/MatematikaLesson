// Dars47 · Amaliyot 06 — Nima yasaldi · 🟡 · sort · tag: comp_zones
// Mexanika: kit.jsx -> Zones. Raskladka: 6-o'rin `sort`.
// Uch qadam to'plami -> nima yasalgani: o'rta perpendikulyar, bissektrisa, teng kesma.
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'comp_zones',
  level: '🟡',
  eyebrow: L(
    'Nima yasaldi',
    'Что построено',
    'What was built'),
  setup: L(
    "Har to'plamda yasash qadamlari yozilgan. Qaysi qadamlar nimani beradi -- shuni joylashtiring.",
    'В каждом наборе записаны шаги построения. Размести, какие шаги что дают.',
    'Each set lists construction steps. Sort them by what they produce.'),
  itemSize: 16,
  zoneLbl: 116,
  zones: [
    {
      id: 'z1',
      label: L(
        "O'rta perpendikulyar",
        'Серединный перпендикуляр',
        'Perpendicular bisector'),
    },
    {
      id: 'z2',
      label: L(
        'Bissektrisa',
        'Биссектриса',
        'Bisector'),
    },
    {
      id: 'z3',
      label: L(
        'Teng kesma',
        'Равный отрезок',
        'Equal segment'),
    },
  ],
  items: [
    { id: 'i1', tokens: ['ikki uchdan teng yoy, ulash'], zone: 'z1' },
    { id: 'i2', tokens: ['uchdan yoy, tomonlarda teng yoy'], zone: 'z2' },
    { id: 'i3', tokens: ['AB ochilishi, yangi nuqtadan yoy'], zone: 'z3' },
  ],
  bank: L(
    'Qadamlar',
    'Шаги',
    'Steps'),
  ask: L(
    'Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  correctText: L(
    "To'g'ri. Kesma uchlaridan teng yoylar -- o'rta perpendikulyar; burchak uchidan va tomonlaridan yoylar -- bissektrisa; AB ochilishini ko'chirish -- teng kesma.",
    'Верно. Равные дуги из концов отрезка это серединный перпендикуляр; дуги из вершины и на сторонах это биссектриса; перенос раствора AB это равный отрезок.',
    'Correct. Equal arcs from the ends give the perpendicular bisector; arcs from the vertex and sides give the bisector; carrying the AB opening gives an equal segment.'),
  wrongs: [
    {
      when: (s) => s.bad.indexOf('i1') !== -1,
      text: L(
        'Ikki uchdan teng yoy chizilsa, kesishgan nuqtalar kesmaga perpendikulyar chiziq beradi.',
        'Равные дуги из двух концов дают точки, через которые идёт перпендикуляр к отрезку.',
        'Equal arcs from both ends give points forming a perpendicular to the segment.'),
    },
    {
      when: (s) => s.bad.indexOf('i2') !== -1,
      text: L(
        'Burchak uchidan yoy, keyin tomonlardagi nuqtalardan teng yoylar -- bu bissektrisa.',
        'Дуга из вершины угла, потом равные дуги от точек на сторонах это биссектриса.',
        'An arc from the vertex then equal arcs from the side points give the bisector.'),
    },
    {
      when: (s) => s.bad.indexOf('i3') !== -1,
      text: L(
        "Sirkul ochilishini o'zgartirmasdan ko'chirish -- teng kesma yasash.",
        'Перенос раствора циркуля без изменения это построение равного отрезка.',
        'Carrying the compass opening unchanged builds an equal segment.'),
    },
  ],
  wrongText: L(
    'Yoylar kesmaning uchlaridan chiqadimi yoki burchak uchidan?',
    'Дуги выходят из концов отрезка или из вершины угла?',
    'Do the arcs start at the segment ends or at the vertex?'),
};

export default function D47_06(props) { return <Zones data={DATA} {...props} />; }
