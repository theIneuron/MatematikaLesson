// Dars36 · Amaliyot 05 — Ikki nuqtadan formula · 🟡 · sort · tag: graph_zones
// Mexanika: kit.jsx -> Zones. Raskladka: 5-o'rin `sort`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): k manfiy va kasr bo'ladi,
// savol ikki qadamli -- PODXOD_7SINF.md 13-band.
// (0; 3) va (1; 5) -> y = 2x + 3; (0; 3) va (1; 1) -> y = −2x + 3; (0; −3) va (1; −1) -> y = 2x − 3.
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'graph_zones',
  level: '🟡',
  eyebrow: L(
    'Uch juftlik',
    'Три пары',
    'Three pairs'),
  setup: L(
    "Har juftlik bitta formulaga to'g'ri keladi. b ni birinchi nuqta beradi, k esa ikkinchi nuqtaga o'tishdagi o'zgarish.",
    'Каждая пара отвечает одной формуле. b даёт первая точка, а k это изменение при переходе ко второй.',
    'Each pair matches one formula. The first point gives b, the step to the second gives k.'),
  itemSize: 17,
  zoneLbl: 108,
  zones: [
    {
      id: 'z1',
      label: L(
        'y = 2x + 3',
        'y = 2x + 3',
        'y = 2x + 3'),
    },
    {
      id: 'z2',
      label: L(
        'y = −2x + 3',
        'y = −2x + 3',
        'y = −2x + 3'),
    },
    {
      id: 'z3',
      label: L(
        'y = 2x − 3',
        'y = 2x − 3',
        'y = 2x − 3'),
    },
  ],
  items: [
    { id: 'i1', tokens: ['(0; 3), (1; 5)'], zone: 'z1' },
    { id: 'i2', tokens: ['(0; 3), (1; 1)'], zone: 'z2' },
    { id: 'i3', tokens: ['(0; −3), (1; −1)'], zone: 'z3' },
  ],
  bank: L(
    'Juftliklar',
    'Пары',
    'Pairs'),
  ask: L(
    'Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  correctText: L(
    "To'g'ri. Birinchi juftlikda qiymat 2 ga o'sdi, ikkinchisida 2 ga kamaydi, uchinchisida b manfiy.",
    'Верно. В первой паре значение выросло на 2, во второй убыло на 2, в третьей b отрицательный.',
    'Correct. The first pair grows by 2, the second falls by 2, the third has a negative b.'),
  wrongs: [
    {
      when: (s) => s.bad.indexOf('i2') !== -1,
      text: L(
        "3 dan 1 ga -- qiymat KAMAYDI, ya'ni k manfiy.",
        'От 3 к 1 значение УБЫЛО, значит k отрицательный.',
        'From 3 to 1 the value FALLS, so k is negative.'),
    },
    {
      when: (s) => s.bad.indexOf('i3') !== -1,
      text: L(
        'Bu juftlikda b = −3: x = 0 dagi qiymat manfiy.',
        'В этой паре b = −3: значение при x = 0 отрицательное.',
        'This pair has b = −3: the value at x = 0 is negative.'),
    },
    {
      when: (s) => s.bad.indexOf('i1') !== -1,
      text: L(
        "3 dan 5 ga -- o'sish 2 ga, b = 3.",
        'От 3 к 5 рост на 2, b = 3.',
        'From 3 to 5 the growth is 2, with b = 3.'),
    },
  ],
  wrongText: L(
    'x = 0 dagi qiymat b ni beradi, keyingi qadam k ni.',
    'Значение при x = 0 даёт b, следующий шаг даёт k.',
    'The value at x = 0 gives b, the next step gives k.'),
};

export default function D36_05(props) { return <Zones data={DATA} {...props} />; }
