// Dars09 · Amaliyot 10 — Uch tenglama, uch ildiz · 🔴 · tag: solve_zones
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
//
// Uchta tenglama, uchtasida ham qavs bor, lekin ildizlari har xil:
//   3(x − 1) = 9        -> x − 1 = 3   -> x = 4
//   2(x + 4) = 6        -> x + 4 = 3   -> x = −1
//   5(x − 2) = 0        -> x − 2 = 0   -> x = 2
// Uchinchisi ATAYLAB: o'ng tomonda nol turgani uchun qavs ichi nolga teng
// bo'lishi kerak. «Nolga bo'lish mumkin emas» qoidasi bilan aralashtirmaslik
// kerak: bu yerda nol BO'LINUVCHI, 0 : 5 = 0.
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'solve_zones', level: '🔴', itemSize: 18, zoneLbl: 96,
  eyebrow: L('Uch ildiz', 'Три корня', 'Three roots'),
  setup: L(
    "Uch tenglamada ham qavs bor va ko'rinishi bir xil. Har birini yechib, ildizini o'z zonasiga qo'ying.",
    'Во всех трёх уравнениях есть скобка, и вид у них одинаковый. Реши каждое и положи в зону своего корня.',
    'All three equations have a bracket and look the same. Solve each one and put it in the zone of its root.'),
  zones: [
    { id: 'z4', label: L('x = 4', 'x = 4', 'x = 4') },
    { id: 'zm1', label: L('x = −1', 'x = −1', 'x = −1') },
    { id: 'z2', label: L('x = 2', 'x = 2', 'x = 2') },
  ],
  items: [
    { id: 'i1', tokens: ['3', '·', '(', 'x', '−', '1', ')', '=', '9'], zone: 'z4' },
    { id: 'i2', tokens: ['2', '·', '(', 'x', '+', '4', ')', '=', '6'], zone: 'zm1' },
    { id: 'i3', tokens: ['5', '·', '(', 'x', '−', '2', ')', '=', '0'], zone: 'z2' },
  ],
  ask: L('Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  bank: L('Tenglamalar', 'Уравнения', 'Equations'),
  correctText: L(
    "To'g'ri. Ikki tomonni ko'paytuvchiga bo'lgach: x − 1 = 3 dan x = 4; x + 4 = 3 dan x = −1; x − 2 = 0 dan x = 2.",
    'Верно. После деления обеих частей на множитель: из x − 1 = 3 выходит x = 4; из x + 4 = 3 выходит x = −1; из x − 2 = 0 выходит x = 2.',
    'Correct. After dividing both sides by the factor: x − 1 = 3 gives x = 4; x + 4 = 3 gives x = −1; x − 2 = 0 gives x = 2.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('i3') !== -1, text: L(
      "Uchinchi tenglamada o'ng tomon NOL: 0 : 5 = 0, ya'ni qavs ichi nolga teng bo'lishi kerak. x − 2 = 0 dan x = 2.",
      'В третьем уравнении справа НУЛЬ: 0 : 5 = 0, значит скобка должна быть равна нулю. Из x − 2 = 0 выходит x = 2.',
      'In the third equation the right side is ZERO: 0 : 5 = 0, so the bracket must equal zero. From x − 2 = 0 you get x = 2.') },
    { when: (s) => s.bad.indexOf('i2') !== -1, text: L(
      "Ikkinchi tenglamada 6 : 2 = 3, ya'ni x + 4 = 3. Bundan x = 3 − 4 = −1, ildiz manfiy.",
      'Во втором уравнении 6 : 2 = 3, то есть x + 4 = 3. Отсюда x = 3 − 4 = −1, корень отрицательный.',
      'In the second equation 6 : 2 = 3, so x + 4 = 3. Hence x = 3 − 4 = −1, a negative root.') },
    { when: (s) => s.bad.indexOf('i1') !== -1, text: L(
      "Birinchi tenglamada 9 : 3 = 3, ya'ni x − 1 = 3 va x = 4.",
      'В первом уравнении 9 : 3 = 3, то есть x − 1 = 3 и x = 4.',
      'In the first equation 9 : 3 = 3, so x − 1 = 3 and x = 4.') },
  ],
  wrongText: L(
    "Har tenglamada ikki tomonni qavs oldidagi songa bo'ling, keyin qolgan bir qadamni bajaring.",
    'В каждом уравнении раздели обе части на число перед скобкой, потом сделай оставшийся шаг.',
    'In each equation divide both sides by the number before the bracket, then take the remaining step.'),
};

export default function D09_10(props) { return <Zones data={DATA} {...props} />; }
