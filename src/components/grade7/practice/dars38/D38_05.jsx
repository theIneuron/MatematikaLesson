// Dars38 · Amaliyot 05 — Nechta yechim · 🟡 · sort · tag: sys_zones
// Mexanika: kit.jsx -> Zones. Raskladka: 5-o'rin.
// y = 2x + 1 va y = 3x   -> kesishadi, bitta yechim
// y = 2x + 1 va y = 2x + 5 -> parallel, yechimi yo'q
// y = 2x + 1 va 2y = 4x + 2 -> bir xil chiziq, cheksiz ko'p yechim
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'sys_zones', level: '🟡', itemSize: 17, zoneLbl: 100,
  eyebrow: L('Nechta yechim', 'Сколько решений', 'How many solutions'),
  setup: L(
    "Ikki chiziq uch xil turishi mumkin: kesishadi, parallel bo'ladi yoki ustma-ust tushadi. Shu narsa yechimlar sonini beradi.",
    'Две прямые могут стоять трояко: пересекаться, быть параллельными или совпадать. Это и задаёт число решений.',
    'Two lines can cross, run parallel, or coincide. That decides the number of solutions.'),
  zones: [
    { id: 'z1', label: L('Bitta yechim', 'Одно решение', 'One solution') },
    { id: 'z0', label: L("Yechimi yo'q", 'Нет решений', 'No solution') },
    { id: 'zi', label: L("Cheksiz ko'p", 'Бесконечно много', 'Infinitely many') },
  ],
  items: [
    { id: 'i1', tokens: ['y = 2x + 1', 'va', 'y = 3x'], zone: 'z1' },
    { id: 'i2', tokens: ['y = 2x + 1', 'va', 'y = 2x + 5'], zone: 'z0' },
    { id: 'i3', tokens: ['y = 2x + 1', 'va', '2y = 4x + 2'], zone: 'zi' },
  ],
  ask: L('Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  bank: L('Sistemalar', 'Системы', 'Systems'),
  correctText: L(
    "To'g'ri. k lar boshqa bo'lsa chiziqlar kesishadi. k bir xil, b boshqa bo'lsa parallel. Ikkinchi tenglamani ikkiga bo'lsa birinchisi chiqsa -- bir xil chiziq.",
    'Верно. Разные k — прямые пересекаются. Одинаковые k и разные b — параллельны. Если второе уравнение делится на два и даёт первое — это одна прямая.',
    'Correct. Different k means crossing. Same k, different b means parallel. If dividing the second by two gives the first, it is the same line.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('i3') !== -1, text: L(
      "2y = 4x + 2 ni ikkiga bo'lsa y = 2x + 1 chiqadi: bu bir xil chiziq, ya'ni yechim cheksiz ko'p.",
      'Если 2y = 4x + 2 разделить на два, выйдет y = 2x + 1: это та же прямая, значит решений бесконечно много.',
      'Dividing 2y = 4x + 2 by two gives y = 2x + 1: the same line, so infinitely many solutions.') },
    { when: (s) => s.bad.indexOf('i2') !== -1, text: L(
      "k lar teng (ikki), b lar boshqa: chiziqlar parallel va kesishmaydi.",
      'k одинаковые (два), b разные: прямые параллельны и не пересекаются.',
      'The k match (two) but the b differ: parallel lines never cross.') },
    { when: (s) => s.bad.indexOf('i1') !== -1, text: L(
      "k lar boshqa (2 va 3): chiziqlar bir nuqtada kesishadi.",
      'k разные (2 и 3): прямые пересекаются в одной точке.',
      'The k differ (2 and 3): the lines cross at one point.') },
  ],
  wrongText: L(
    "Har juftlikda k larni va b larni solishtiring. Ikkinchi tenglamani soddalashtirish kerakmi?",
    'В каждой паре сравни k и b. Не нужно ли упростить второе уравнение?',
    'Compare the k and the b in each pair. Does the second equation need simplifying?'),
};

export default function D38_05(props) { return <Zones data={DATA} {...props} />; }
