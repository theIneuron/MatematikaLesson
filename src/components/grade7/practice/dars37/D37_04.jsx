// Dars37 · Amaliyot 04 — Uch formula · 🟡 · sort · tag: prop_zones
// Mexanika: kit.jsx -> Zones. Raskladka: 4-o'rin `sort`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): manfiy va kasr koeffitsiyent,
// ikki qadamli savol, yaqin tuzoq -- PODXOD_7SINF.md 13-band.
// y = −6x -> proporsionallik; y = 2x + 3 -> chiziqli, lekin proporsionallik emas; y = 6 : x -> chiziqli ham emas.
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'prop_zones',
  level: '🟡',
  eyebrow: L(
    'Uch formula',
    'Три формулы',
    'Three formulas'),
  setup: L(
    "Uch turni ajratish kerak: to'g'ri proporsionallik, ozod hadli chiziqli funksiya va umuman chiziqli bo'lmagan bog'lanish.",
    'Надо различить три типа: прямая пропорциональность, линейная со свободным членом и вовсе не линейная связь.',
    'Three kinds must be told apart: direct proportion, a linear function with a constant, and a non-linear relation.'),
  itemSize: 18,
  zoneLbl: 112,
  zones: [
    {
      id: 'z1',
      label: L(
        'Proporsionallik',
        'Пропорциональность',
        'Proportion'),
    },
    {
      id: 'z2',
      label: L(
        'Chiziqli, lekin emas',
        'Линейная, но нет',
        'Linear, but not'),
    },
    {
      id: 'z3',
      label: L(
        'Chiziqli emas',
        'Не линейная',
        'Not linear'),
    },
  ],
  items: [
    { id: 'i1', tokens: ['y = −6x'], zone: 'z1' },
    { id: 'i2', tokens: ['y = 2x + 3'], zone: 'z2' },
    { id: 'i3', tokens: ['y = 6 : x'], zone: 'z3' },
  ],
  bank: L(
    'Formulalar',
    'Формулы',
    'Formulas'),
  ask: L(
    'Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  correctText: L(
    "To'g'ri. y = kx -- proporsionallik; ozod had qo'shilsa faqat chiziqli qoladi; x maxrajda bo'lsa chiziqli ham emas.",
    'Верно. y = kx это пропорциональность; со свободным членом остаётся только линейная; при x в знаменателе не линейная вовсе.',
    'Correct. y = kx is proportion; a constant leaves it merely linear; x in the denominator is not linear at all.'),
  wrongs: [
    {
      when: (s) => s.bad.indexOf('i2') !== -1,
      text: L(
        "+3 bor, ya'ni grafik boshdan o'tmaydi: proporsionallik emas.",
        'Есть +3, значит график не проходит через начало: это не пропорциональность.',
        'The +3 keeps the graph off the origin: not proportion.'),
    },
    {
      when: (s) => s.bad.indexOf('i3') !== -1,
      text: L(
        "x maxrajda: grafik to'g'ri chiziq bo'lmaydi.",
        'x в знаменателе: график не будет прямой.',
        'x sits below: the graph is not a line.'),
    },
    {
      when: (s) => s.bad.indexOf('i1') !== -1,
      text: L(
        "y = −6x aynan y = kx ko'rinishida.",
        'y = −6x именно вида y = kx.',
        'y = −6x is exactly y = kx.'),
    },
  ],
  wrongText: L(
    'Ozod had bormi? x qayerda turibdi -- suratdami, maxrajdami?',
    'Есть ли свободный член? Где стоит x — в числителе или в знаменателе?',
    'Is there a constant? Where is x, above or below?'),
};

export default function D37_04(props) { return <Zones data={DATA} {...props} />; }
