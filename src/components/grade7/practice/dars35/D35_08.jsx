// Dars35 · Amaliyot 08 — Uch formula · 🔴 · sort · tag: k_zones
// Mexanika: kit.jsx -> Zones. Raskladka: 8-o'rin `sort`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): k manfiy va kasr bo'ladi,
// savol ikki qadamli -- PODXOD_7SINF.md 13-band.
// y = 8 − x -> k < 0; y = 0,5x -> k > 0; y = −6 -> k = 0.
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'k_zones',
  level: '🔴',
  eyebrow: L(
    'Uch formula',
    'Три формулы',
    'Three formulas'),
  setup: L(
    "Har formulada k ni topib ishorasiga ko'ra joylashtiring. Yozuvlar ataylab chalg'ituvchi: minus ozod hadga ham tegishli bo'lishi mumkin.",
    'В каждой формуле найди k и размести по знаку. Записи специально путающие: минус может относиться и к свободному члену.',
    'Find k in each formula and sort by sign. The records mislead on purpose: a minus may belong to the constant.'),
  itemSize: 20,
  zoneLbl: 100,
  zones: [
    {
      id: 'zp',
      label: L(
        'k > 0',
        'k > 0',
        'k > 0'),
    },
    {
      id: 'zn',
      label: L(
        'k < 0',
        'k < 0',
        'k < 0'),
    },
    {
      id: 'z0',
      label: L(
        'k = 0',
        'k = 0',
        'k = 0'),
    },
  ],
  items: [
    { id: 'i1', tokens: ['y = 0,5x'], zone: 'zp' },
    { id: 'i2', tokens: ['y = 8 − x'], zone: 'zn' },
    { id: 'i3', tokens: ['y = −6'], zone: 'z0' },
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
    "To'g'ri. 0,5 musbat; 8 − x da k = −1; y = −6 da x umuman yo'q, ya'ni k = 0.",
    'Верно. 0,5 положительный; в 8 − x k = −1; в y = −6 иксa нет вовсе, значит k = 0.',
    'Correct. 0.5 is positive; in 8 − x we get k = −1; y = −6 has no x at all, so k = 0.'),
  wrongs: [
    {
      when: (s) => s.bad.indexOf('i2') !== -1,
      text: L(
        '8 − x ni y = −x + 8 deb yozing: k = −1, manfiy.',
        'Запиши 8 − x как y = −x + 8: k = −1, отрицательный.',
        'Rewrite 8 − x as y = −x + 8: k = −1, negative.'),
    },
    {
      when: (s) => s.bad.indexOf('i3') !== -1,
      text: L(
        "y = −6 da x yo'q, ya'ni k = 0. Minus b ga tegishli.",
        'В y = −6 нет x, значит k = 0. Минус относится к b.',
        'y = −6 has no x, so k = 0. The minus belongs to b.'),
    },
    {
      when: (s) => s.bad.indexOf('i1') !== -1,
      text: L(
        "0,5 musbat son, kasr bo'lsa ham.",
        '0,5 положительное число, хоть и дробное.',
        '0.5 is positive, fraction or not.'),
    },
  ],
  wrongText: L(
    'Har formulada x ning oldida qanday son turganini qarang.',
    'Смотри, какое число стоит перед x в каждой формуле.',
    'Look at the number in front of x in each formula.'),
};

export default function D35_08(props) { return <Zones data={DATA} {...props} />; }
