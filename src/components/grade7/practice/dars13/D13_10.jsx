// Dars13 · Amaliyot 10 — Uch yozuv, uch qiymat · 🔴 · tag: sign_power_zones
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
//
// DARAJA KO'TARILDI (PODXOD_7SINF.md §13): qiymatlar uch va to'rt xonali,
// zonalar esa faqat ishora bilan farq qiladi.
//
// Darsning yakuni. Uchta yozuvda ham yigirma va daraja bor, farqi qavs va
// ko'rsatkichda:
//   (−20)² = 400     juft ko'rsatkich, qavs bor -> musbat
//   −20²   = −400    qavs yo'q, minus tashqarida
//   (−20)³ = −8000   toq ko'rsatkich, qavs bor -> manfiy
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'sign_power_zones', level: '🔴', itemSize: 24, zoneLbl: 96,
  eyebrow: L('Uch qiymat', 'Три значения', 'Three values'),
  setup: L(
    "Uch yozuvda ham yigirma va daraja bor. Qavs va ko'rsatkich qiymatni hal qiladi.",
    'Во всех трёх записях есть двадцать и степень. Значение решают скобка и показатель.',
    'All three records have a twenty and a power. The bracket and the exponent decide the value.'),
  zones: [
    { id: 'z25', label: L('400', '400', '400') },
    { id: 'zm25', label: L('−400', '−400', '−400') },
    { id: 'zm125', label: L('−8000', '−8000', '−8000') },
  ],
  items: [
    { id: 'i1', tokens: ['(−20)²'], zone: 'z25' },
    { id: 'i2', tokens: ['−20²'], zone: 'zm25' },
    { id: 'i3', tokens: ['(−20)³'], zone: 'zm125' },
  ],
  ask: L('Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  bank: L('Yozuvlar', 'Записи', 'Records'),
  correctText: L(
    "To'g'ri. (−20)² da ikki minus ko'paytiriladi -- musbat 400. −20² da minus tashqarida -- −400. (−20)³ da uch minus -- manfiy 8000.",
    'Верно. В (−20)² перемножаются два минуса — положительное 400. В −20² минус снаружи — −400. В (−20)³ три минуса — отрицательное 8000.',
    'Correct. In (−20)² two minuses multiply — positive 400. In −20² the minus is outside — −400. In (−20)³ three minuses — negative 8000.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('i2') !== -1, text: L(
      "−20² da qavs YO'Q: avval 20² = 400 hisoblanadi, keyin minus qo'yiladi. Javob −400.",
      'В −20² скобки НЕТ: сначала считается 20² = 400, потом ставится минус. Ответ −400.',
      'In −20² there is NO bracket: 20² = 400 is worked out first, then the minus is applied. The answer is −400.') },
    { when: (s) => s.bad.indexOf('i3') !== -1, text: L(
      "(−20)³ da uchta minus ko'paytiriladi -- toq son, natija manfiy: −8000.",
      'В (−20)³ перемножаются три минуса — число нечётное, результат отрицательный: −8000.',
      'In (−20)³ three minuses multiply — an odd number, so the result is negative: −8000.') },
    { when: (s) => s.bad.indexOf('i1') !== -1, text: L(
      "(−20)² da ikkita minus ko'paytiriladi -- juft son, natija musbat: 400.",
      'В (−20)² перемножаются два минуса — число чётное, результат положительный: 400.',
      'In (−20)² two minuses multiply — an even number, so the result is positive: 400.') },
  ],
  wrongText: L(
    "Ikki narsaga qarang: qavs bormi va ko'rsatkich juftmi. Qavs manfiy sonni asos qiladi, juft ko'rsatkich esa natijani musbat qiladi.",
    'Смотри на два признака: есть ли скобка и чётный ли показатель. Скобка делает основанием отрицательное число, а чётный показатель делает результат положительным.',
    'Look at two things: is there a bracket and is the exponent even. A bracket makes the negative number the base, and an even exponent makes the result positive.'),
};

export default function D13_10(props) { return <Zones data={DATA} {...props} />; }
