// Dars29 · Amaliyot 03 — Uch yozuv, uch formula · 🟢 · sort · tag: fact_zones
// Mexanika: kit.jsx -> Zones. Raskladka: 3-o'rin.
// m² − 64        -> (m − 8)(m + 8)
// m² − 16m + 64  -> (m − 8)²
// m² + 16m + 64  -> (m + 8)²
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'fact_zones', level: '🟢', itemSize: 19, zoneLbl: 108,
  eyebrow: L('Uch yozuv', 'Три записи', 'Three records'),
  setup: L(
    "Uch yozuvda 64 turadi, ya'ni asos 8. Formulani o'rta hadning bor-yo'qligi va ishorasi belgilaydi.",
    'В трёх записях есть 64, значит основание 8. Формулу определяют наличие среднего члена и его знак.',
    'All three hold 64, so the base is 8. The presence and sign of the middle term pick the formula.'),
  zones: [
    { id: 'zd', label: L('(m − 8)(m + 8)', '(m − 8)(m + 8)', '(m − 8)(m + 8)') },
    { id: 'zm', label: L('(m − 8)²', '(m − 8)²', '(m − 8)²') },
    { id: 'zp', label: L('(m + 8)²', '(m + 8)²', '(m + 8)²') },
  ],
  items: [
    { id: 'i1', tokens: ['m²', '−', '64'], zone: 'zd' },
    { id: 'i2', tokens: ['m²', '−', '16m', '+', '64'], zone: 'zm' },
    { id: 'i3', tokens: ['m²', '+', '16m', '+', '64'], zone: 'zp' },
  ],
  ask: L('Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  bank: L('Yozuvlar', 'Записи', 'Records'),
  correctText: L(
    "To'g'ri. O'rta had yo'q bo'lsa -- kvadratlar ayirmasi. Bor bo'lsa, ishorasi kvadratning ichidagi ishorani beradi.",
    'Верно. Нет среднего члена — разность квадратов. Есть — его знак и даёт знак внутри квадрата.',
    'Correct. No middle term means a difference of squares. If there is one, its sign is the sign inside the square.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('i1') !== -1, text: L(
      "m² − 64 da o'rta had yo'q va son manfiy: bu kvadratlar ayirmasi.",
      'В m² − 64 среднего члена нет и число отрицательное: это разность квадратов.',
      'In m² − 64 there is no middle term and the number is negative: a difference of squares.') },
    { when: (s) => s.bad.indexOf('i2') !== -1, text: L(
      "m² − 16m + 64 da o'rta had manfiy: (m − 8)².",
      'В m² − 16m + 64 средний член отрицательный: (m − 8)².',
      'In m² − 16m + 64 the middle term is negative: (m − 8)².') },
    { when: (s) => s.bad.indexOf('i3') !== -1, text: L(
      "m² + 16m + 64 da hammasi musbat: (m + 8)².",
      'В m² + 16m + 64 всё положительное: (m + 8)².',
      'In m² + 16m + 64 everything is positive: (m + 8)².') },
  ],
  wrongText: L(
    "Har yozuvda o'rta hadga qarang: bormi, va ishorasi qanday?",
    'Смотри в каждой записи на средний член: есть ли он и какой знак?',
    'Look at the middle term in each: is it there and with which sign?'),
};

export default function D29_03(props) { return <Zones data={DATA} {...props} />; }
