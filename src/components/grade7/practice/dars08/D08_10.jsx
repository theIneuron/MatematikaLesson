// Dars08 · Amaliyot 10 — Uch tenglama, uch ildiz · 🔴 · tag: root_zones
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
//
// Uchta tenglama bir xil ko'rinishda (ax + b = c), lekin ildizlari har xil:
//   5x − 6 = 9    -> 5x = 15  -> x = 3
//   2x + 12 = 6   -> 2x = −6  -> x = −3
//   7x + 5 = 5    -> 7x = 0   -> x = 0
// Uchinchisi ATAYLAB shunday: o'ng va chap tomondagi sonlar bir xil, ya'ni
// 7x = 0 chiqadi. «Nolga bo'lish» bilan aralashtirmaslik kerak: bu yerda
// NOL nolga bo'linadi degan gap emas, 0 : 7 = 0.
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'root_zones', level: '🔴', itemSize: 19, zoneLbl: 96,
  eyebrow: L('Uch ildiz', 'Три корня', 'Three roots'),
  setup: L(
    "Uch tenglama bir xil ko'rinishda, lekin ildizlari boshqa. Har birini yechib, o'z zonasiga qo'ying.",
    'Три уравнения одного вида, но корни у них разные. Реши каждое и положи в свою зону.',
    'Three equations of the same form but with different roots. Solve each one and put it in its zone.'),
  zones: [
    { id: 'z3', label: L('x = 3', 'x = 3', 'x = 3') },
    { id: 'zm3', label: L('x = −3', 'x = −3', 'x = −3') },
    { id: 'z0', label: L('x = 0', 'x = 0', 'x = 0') },
  ],
  items: [
    { id: 'i1', tokens: ['5x', '−', '6', '=', '9'], zone: 'z3' },
    { id: 'i2', tokens: ['2x', '+', '12', '=', '6'], zone: 'zm3' },
    { id: 'i3', tokens: ['7x', '+', '5', '=', '5'], zone: 'z0' },
  ],
  ask: L('Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  bank: L('Tenglamalar', 'Уравнения', 'Equations'),
  correctText: L(
    "To'g'ri. 5x = 15 dan x = 3; 2x = −6 dan x = −3; 7x = 0 dan x = 0 -- nolni yettiga bo'lsa nol chiqadi.",
    'Верно. Из 5x = 15 выходит x = 3; из 2x = −6 выходит x = −3; из 7x = 0 выходит x = 0 — нуль разделить на семь это нуль.',
    'Correct. 5x = 15 gives x = 3; 2x = −6 gives x = −3; 7x = 0 gives x = 0 — zero divided by seven is zero.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('i3') !== -1, text: L(
      "Uchinchi tenglamada ikki tomondagi son bir xil: 5 ko'chgach 7x = 0 qoladi. Nolni 7 ga bo'lish mumkin, natija 0.",
      'В третьем уравнении числа в двух частях одинаковые: после переноса 5 остаётся 7x = 0. Нуль на 7 разделить можно, выйдет 0.',
      'In the third equation the numbers on both sides are the same: after moving the 5 you get 7x = 0. Zero can be divided by 7, giving 0.') },
    { when: (s) => s.bad.indexOf('i2') !== -1, text: L(
      "Ikkinchi tenglamada 12 ko'chganda ayiriladi: 2x = 6 − 12 = −6, ya'ni ildiz manfiy.",
      'Во втором уравнении 12 при переносе вычитается: 2x = 6 − 12 = −6, значит корень отрицательный.',
      'In the second equation the 12 is subtracted when it moves: 2x = 6 − 12 = −6, so the root is negative.') },
    { when: (s) => s.bad.indexOf('i1') !== -1, text: L(
      "Birinchi tenglamada 6 ko'chganda qo'shiladi: 5x = 9 + 6 = 15, keyin 15 : 5 = 3.",
      'В первом уравнении 6 при переносе прибавляется: 5x = 9 + 6 = 15, потом 15 : 5 = 3.',
      'In the first equation the 6 is added when it moves: 5x = 9 + 6 = 15, then 15 : 5 = 3.') },
  ],
  wrongText: L(
    "Har tenglamada avval sonni ko'chiring, keyin koeffitsiyentga bo'ling. Ishoraga alohida e'tibor bering.",
    'В каждом уравнении сначала перенеси число, потом раздели на коэффициент. Отдельно следи за знаком.',
    'In each equation move the number first, then divide by the coefficient. Watch the sign separately.'),
};

export default function D08_10(props) { return <Zones data={DATA} {...props} />; }
