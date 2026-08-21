// Dars19 · Amaliyot 04 — Bitta ishora hammasini o'zgartiradi · 🟡 · sort · tag: sign_zones
// Faqat MA'LUMOT. Mexanika: kit.jsx -> Zones. Raskladka: 4-o'rin.
//
// (8b − 3) − (5b − 3) = 3b        (−3 + 3 = 0)
// (8b − 3) − (5b + 3) = 3b − 6    (−3 − 3)
// (8b + 3) − (5b − 3) = 3b + 6    (+3 + 3)
// Uch yozuv faqat BITTA ishora bilan farq qiladi -- shuning uchun ko'z bilan
// ajratib bo'lmaydi, har birini hisoblash kerak.
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'sign_zones', level: '🟡', itemSize: 19, zoneLbl: 84,
  eyebrow: L('Bitta ishora farqi', 'Разница в одном знаке', 'One sign apart'),
  setup: L(
    "Uch ayirmada b oldidagi sonlar bir xil, faqat ozod hadlarning ishorasi boshqa. Har birini oxirigacha hisoblang.",
    'В трёх разностях числа перед b одинаковые, различаются только знаки свободных членов. Посчитай каждую до конца.',
    'In the three differences the numbers before b are the same; only the signs of the free terms differ. Work each one out.'),
  zones: [
    { id: 'z0', label: L('3b', '3b', '3b') },
    { id: 'zm', label: L('3b − 6', '3b − 6', '3b − 6') },
    { id: 'zp', label: L('3b + 6', '3b + 6', '3b + 6') },
  ],
  items: [
    { id: 'i1', tokens: ['(8b', '−', '3)', '−', '(5b', '−', '3)'], zone: 'z0' },
    { id: 'i2', tokens: ['(8b', '−', '3)', '−', '(5b', '+', '3)'], zone: 'zm' },
    { id: 'i3', tokens: ['(8b', '+', '3)', '−', '(5b', '−', '3)'], zone: 'zp' },
  ],
  ask: L('Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  bank: L('Ayirmalar', 'Разности', 'Differences'),
  correctText: L(
    "To'g'ri. Birinchisida −3 + 3 = 0, ikkinchisida −3 − 3 = −6, uchinchisida +3 + 3 = +6. b li had uchtasida ham 3b.",
    'Верно. В первой −3 + 3 = 0, во второй −3 − 3 = −6, в третьей +3 + 3 = +6. Член с b во всех трёх это 3b.',
    'Correct. The first gives −3 + 3 = 0, the second −3 − 3 = −6, the third +3 + 3 = +6. The b term is 3b in all three.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('i1') !== -1, text: L(
      "Birinchi ayirmada ikkinchi qavsning −3 si ag'darilib +3 bo'ladi: −3 + 3 = 0, ozod had qolmaydi.",
      'В первой разности −3 второй скобки переворачивается в +3: −3 + 3 = 0, свободного члена не остаётся.',
      'In the first difference the −3 of the second bracket flips to +3: −3 + 3 = 0, no free term remains.') },
    { when: (s) => s.bad.indexOf('i2') !== -1, text: L(
      "Ikkinchi ayirmada +3 ag'darilib −3 bo'ladi: −3 − 3 = −6.",
      'Во второй разности +3 переворачивается в −3: −3 − 3 = −6.',
      'In the second difference the +3 flips to −3: −3 − 3 = −6.') },
    { when: (s) => s.bad.indexOf('i3') !== -1, text: L(
      "Uchinchi ayirmada birinchi qavsda +3 turgan, ikkinchisining −3 si esa +3 bo'ladi: +6.",
      'В третьей разности в первой скобке +3, а −3 второй превращается в +3: выходит +6.',
      'In the third difference the first bracket has +3, and the second bracket −3 flips to +3: that makes +6.') },
  ],
  wrongText: L(
    "Har ayirmada ikkinchi qavsning ozod hadini ag'daring, keyin ikki ozod hadni qo'shing.",
    'В каждой разности переверни свободный член второй скобки, потом сложи два свободных члена.',
    'In each difference flip the free term of the second bracket, then add the two free terms.'),
};

export default function D19_04(props) { return <Zones data={DATA} {...props} />; }
