// Dars30 · Amaliyot 07 — Uch yozuv · 🟡 · sort · tag: whole_zones
// Mexanika: kit.jsx -> Zones. Raskladka: 7-o'rin.
// 3(x + 2) − (x − 4) = 2x + 10
// 3(x + 2) + (x + 4) = 4x + 10
// 3(x + 2) − (x + 8) = 2x − 2
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'whole_zones', level: '🟡', itemSize: 18, zoneLbl: 84,
  eyebrow: L('Uch natija', 'Три результата', 'Three results'),
  setup: L(
    "Birinchi qavs uchtasida ham bir xil. Farq ikkinchi qavsda: ishorasida va ichidagi sonda.",
    'Первая скобка у всех трёх одинаковая. Разница во второй: в её знаке и в числе внутри.',
    'The first bracket is the same in all three. The second differs in sign and in the number inside.'),
  zones: [
    { id: 'z1', label: L('2x + 10', '2x + 10', '2x + 10') },
    { id: 'z2', label: L('4x + 10', '4x + 10', '4x + 10') },
    { id: 'z3', label: L('2x − 2', '2x − 2', '2x − 2') },
  ],
  items: [
    { id: 'i1', tokens: ['3(x', '+', '2)', '−', '(x', '−', '4)'], zone: 'z1' },
    { id: 'i2', tokens: ['3(x', '+', '2)', '+', '(x', '+', '4)'], zone: 'z2' },
    { id: 'i3', tokens: ['3(x', '+', '2)', '−', '(x', '+', '8)'], zone: 'z3' },
  ],
  ask: L('Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  bank: L('Yozuvlar', 'Записи', 'Records'),
  correctText: L(
    "To'g'ri. Minusli qavsda x ayiriladi (2x qoladi), plyusli qavsda esa qo'shiladi (4x). Sonlar ham shunga qarab o'zgaradi.",
    'Верно. При минусе x вычитается (остаётся 2x), при плюсе прибавляется (4x). Числа меняются так же.',
    'Correct. With a minus the x is subtracted (2x remains), with a plus it is added (4x). The numbers follow.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('i1') !== -1, text: L(
      "3x + 6 − x + 4: x lar 2x, sonlar 10. Ikkinchi qavsdagi −4 ag'darilib +4 bo'ldi.",
      '3x + 6 − x + 4: иксы дают 2x, числа 10. −4 второй скобки перевернулось в +4.',
      '3x + 6 − x + 4: the x give 2x and the numbers 10. The −4 flipped to +4.') },
    { when: (s) => s.bad.indexOf('i2') !== -1, text: L(
      "Plyusli qavsda ishoralar o'zgarmaydi: 3x + 6 + x + 4 = 4x + 10.",
      'При плюсе знаки не меняются: 3x + 6 + x + 4 = 4x + 10.',
      'With a plus nothing flips: 3x + 6 + x + 4 = 4x + 10.') },
    { when: (s) => s.bad.indexOf('i3') !== -1, text: L(
      "3x + 6 − x − 8: sonlar 6 − 8 = −2, ya'ni 2x − 2.",
      '3x + 6 − x − 8: числа 6 − 8 = −2, значит 2x − 2.',
      '3x + 6 − x − 8: the numbers give 6 − 8 = −2, so 2x − 2.') },
  ],
  wrongText: L(
    "Har yozuvda ikkinchi qavsni oching, ishoraga qarang, keyin o'xshashlarni yig'ing.",
    'В каждой записи раскрой вторую скобку, посмотри на знак и приведи подобные.',
    'Open the second bracket in each, watch the sign, then collect like terms.'),
};

export default function D30_07(props) { return <Zones data={DATA} {...props} />; }
