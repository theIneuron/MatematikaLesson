// Dars35 · Amaliyot 08 — Uch formula · 🔴 · sort · tag: k_zones
// Mexanika: kit.jsx -> Zones. Raskladka: 8-o'rin.
// y = 5x − 1 -> k > 0;  y = −2x + 6 -> k < 0;  y = 4 -> k = 0.
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'k_zones', level: '🔴', itemSize: 21, zoneLbl: 80,
  eyebrow: L('k qanday', 'Каков k', 'What k is'),
  setup: L(
    "Uch formulani k ning ishorasi bo'yicha ajratish kerak. Uchinchi holatda x umuman yo'q -- bu ham chiziqli funksiya.",
    'Три формулы надо разделить по знаку k. В третьем случае x нет вовсе — это тоже линейная функция.',
    'Split the three by the sign of k. In the third there is no x at all — still a linear function.'),
  zones: [
    { id: 'zp', label: L('k > 0', 'k > 0', 'k > 0') },
    { id: 'zm', label: L('k < 0', 'k < 0', 'k < 0') },
    { id: 'z0', label: L('k = 0', 'k = 0', 'k = 0') },
  ],
  items: [
    { id: 'i1', tokens: ['y', '=', '5x', '−', '1'], zone: 'zp' },
    { id: 'i2', tokens: ['y', '=', '−2x', '+', '6'], zone: 'zm' },
    { id: 'i3', tokens: ['y', '=', '4'], zone: 'z0' },
  ],
  ask: L('Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  bank: L('Formulalar', 'Формулы', 'Rules'),
  correctText: L(
    "To'g'ri. y = 4 da x yo'q, ya'ni k = 0: grafik gorizontal to'g'ri chiziq. Ozod hadning ishorasi k ga ta'sir qilmaydi.",
    'Верно. В y = 4 нет x, значит k = 0: график горизонтальная прямая. Знак свободного члена на k не влияет.',
    'Correct. y = 4 has no x, so k = 0: a horizontal line. The free term does not affect k.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('i3') !== -1, text: L(
      "y = 4 da x oldida hech narsa yo'q, ya'ni k = 0. Bu gorizontal chiziq.",
      'В y = 4 перед x ничего нет, значит k = 0. Это горизонтальная прямая.',
      'In y = 4 there is nothing before x, so k = 0. That is a horizontal line.') },
    { when: (s) => s.bad.indexOf('i1') !== -1, text: L(
      "y = 5x − 1 da k = 5, musbat. Ozod had manfiy bo'lsa ham k musbat qoladi.",
      'В y = 5x − 1 выходит k = 5, положительное. Отрицательный свободный член на k не влияет.',
      'In y = 5x − 1 we get k = 5, positive. A negative free term does not change k.') },
    { when: (s) => s.bad.indexOf('i2') !== -1, text: L(
      "y = −2x + 6 da k = −2, manfiy.",
      'В y = −2x + 6 выходит k = −2, отрицательное.',
      'In y = −2x + 6 we get k = −2, negative.') },
  ],
  wrongText: L(
    "Har formulada faqat x OLDIDAGI songa qarang, ozod hadga emas.",
    'В каждой формуле смотри только на число ПЕРЕД x, а не на свободный член.',
    'In each rule look only at the number BEFORE x, not the free term.'),
};

export default function D35_08(props) { return <Zones data={DATA} {...props} />; }
