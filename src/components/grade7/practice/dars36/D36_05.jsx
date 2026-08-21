// Dars36 · Amaliyot 05 — Ikki nuqta va formula · 🟡 · sort · tag: graph_zones
// Mexanika: kit.jsx -> Zones. Raskladka: 5-o'rin.
// (0; 2) va (1; 3) -> y = x + 2;  (0; −2) va (1; −1) -> y = x − 2;
// (0; 2) va (1; 1) -> y = −x + 2.
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'graph_zones', level: '🟡', itemSize: 18, zoneLbl: 92,
  eyebrow: L('Qaysi formula', 'Какая формула', 'Which rule'),
  setup: L(
    "Har juftlikda birinchi nuqta x = 0 da turadi -- u b ni beradi. Ikkinchi nuqta y qanday o'zgarganini ko'rsatadi.",
    'В каждой паре первая точка при x = 0 — она даёт b. Вторая показывает, как изменился y.',
    'In each pair the first point sits at x = 0 and gives b. The second shows how y changed.'),
  zones: [
    { id: 'z1', label: L('y = x + 2', 'y = x + 2', 'y = x + 2') },
    { id: 'z2', label: L('y = x − 2', 'y = x − 2', 'y = x − 2') },
    { id: 'z3', label: L('y = −x + 2', 'y = −x + 2', 'y = −x + 2') },
  ],
  items: [
    { id: 'i1', tokens: ['(0;', '2)', 'va', '(1;', '3)'], zone: 'z1' },
    { id: 'i2', tokens: ['(0;', '−2)', 'va', '(1;', '−1)'], zone: 'z2' },
    { id: 'i3', tokens: ['(0;', '2)', 'va', '(1;', '1)'], zone: 'z3' },
  ],
  ask: L('Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  bank: L('Nuqta juftlari', 'Пары точек', 'Point pairs'),
  correctText: L(
    "To'g'ri. Birinchi va uchinchi juftlikda b = 2, lekin biri o'sadi, ikkinchisi kamayadi. Ikkinchisida esa b = −2.",
    'Верно. В первой и третьей паре b = 2, но одна растёт, другая убывает. А во второй b = −2.',
    'Correct. The first and third pairs share b = 2 but one grows and the other falls. The second has b = −2.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('i3') !== -1, text: L(
      "(0; 2) dan (1; 1) ga y KAMAYDI, ya'ni k manfiy: y = −x + 2.",
      'От (0; 2) к (1; 1) значение y УБЫЛО, значит k отрицательный: y = −x + 2.',
      'From (0; 2) to (1; 1) the y FELL, so k is negative: y = −x + 2.') },
    { when: (s) => s.bad.indexOf('i2') !== -1, text: L(
      "Bu juftlikda b = −2: birinchi nuqta noldan pastda.",
      'В этой паре b = −2: первая точка ниже нуля.',
      'This pair has b = −2: the first point sits below zero.') },
    { when: (s) => s.bad.indexOf('i1') !== -1, text: L(
      "(0; 2) dan (1; 3) ga y bittaga oshdi: k = 1, b = 2.",
      'От (0; 2) к (1; 3) значение выросло на один: k = 1, b = 2.',
      'From (0; 2) to (1; 3) y grew by one: k = 1, b = 2.') },
  ],
  wrongText: L(
    "Har juftlikda ikki savolga javob bering: b nechchi, va y oshdimi yoki kamaydi?",
    'В каждой паре ответь на два вопроса: чему равен b и вырос ли y?',
    'For each pair answer two questions: what is b, and did y grow or fall?'),
};

export default function D36_05(props) { return <Zones data={DATA} {...props} />; }
