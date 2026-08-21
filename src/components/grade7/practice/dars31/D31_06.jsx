// Dars31 · Amaliyot 06 — Uch yozuv · 🟡 · sort · tag: cube_zones_kind
// Mexanika: kit.jsx -> Zones. Raskladka: 6-o'rin.
// x³ + 8                 -> kublar yig'indisi
// x³ − 8                 -> kublar ayirmasi
// x³ + 6x² + 12x + 8     -> yig'indining kubi
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'cube_zones_kind', level: '🟡', itemSize: 18, zoneLbl: 116,
  eyebrow: L('Qaysi turi', 'Какой вид', 'Which kind'),
  setup: L(
    "Uch yozuvda sakkiz turadi, lekin ular boshqa formulalarga tegishli. Hadlar sonini va ishoralarni sanang.",
    'В трёх записях есть восьмёрка, но они относятся к разным формулам. Посчитай число членов и знаки.',
    'All three hold an eight but belong to different formulas. Count the terms and the signs.'),
  zones: [
    { id: 'zs', label: L("Kublar yig'indisi", 'Сумма кубов', 'Sum of cubes') },
    { id: 'zd', label: L('Kublar ayirmasi', 'Разность кубов', 'Difference of cubes') },
    { id: 'zc', label: L("Yig'indining kubi", 'Куб суммы', 'Cube of a sum') },
  ],
  items: [
    { id: 'i1', tokens: ['x³', '+', '8'], zone: 'zs' },
    { id: 'i2', tokens: ['x³', '−', '8'], zone: 'zd' },
    { id: 'i3', tokens: ['x³', '+', '6x²', '+', '12x', '+', '8'], zone: 'zc' },
  ],
  ask: L('Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  bank: L('Yozuvlar', 'Записи', 'Records'),
  correctText: L(
    "To'g'ri. Ikki hadli yozuv -- kublar yig'indisi yoki ayirmasi. To'rt hadli esa kubning o'zi: (x + 2)³.",
    'Верно. Запись из двух членов это сумма или разность кубов. А из четырёх это сам куб: (x + 2)³.',
    'Correct. Two terms mean a sum or difference of cubes. Four terms mean the cube itself: (x + 2)³.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('i3') !== -1, text: L(
      "To'rt hadli yozuv (x + 2)³ ni ochishdan chiqadi, ya'ni bu yig'indining kubi.",
      'Запись из четырёх членов получается при раскрытии (x + 2)³, значит это куб суммы.',
      'Four terms come from expanding (x + 2)³, so this is a cube of a sum.') },
    { when: (s) => s.bad.indexOf('i2') !== -1, text: L(
      "x³ − 8 ikki had va ayirma: bu kublar ayirmasi, (x − 2)(x² + 2x + 4).",
      'x³ − 8 это два члена и разность: разность кубов, (x − 2)(x² + 2x + 4).',
      'x³ − 8 is two terms and a difference: a difference of cubes, (x − 2)(x² + 2x + 4).') },
    { when: (s) => s.bad.indexOf('i1') !== -1, text: L(
      "x³ + 8 ikki had va yig'indi: kublar yig'indisi, (x + 2)(x² − 2x + 4).",
      'x³ + 8 это два члена и сумма: сумма кубов, (x + 2)(x² − 2x + 4).',
      'x³ + 8 is two terms and a sum: a sum of cubes, (x + 2)(x² − 2x + 4).') },
  ],
  wrongText: L(
    "Ikki had bo'lsa -- kublar yig'indisi yoki ayirmasi. To'rt had bo'lsa -- kubning o'zi.",
    'Два члена — сумма или разность кубов. Четыре члена — сам куб.',
    'Two terms mean a sum or difference of cubes. Four terms mean the cube itself.'),
};

export default function D31_06(props) { return <Zones data={DATA} {...props} />; }
