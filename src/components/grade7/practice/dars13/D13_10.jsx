// Dars13 · Amaliyot 10 — Uch yozuv, uch qiymat · 🔴 · tag: sign_power_zones
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
//
// Darsning yakuni. Uchta yozuvda ham beshlik va daraja bor, farqi qavs va
// ko'rsatkichda:
//   (−5)² = 25     juft ko'rsatkich, qavs bor -> musbat
//   −5²   = −25    qavs yo'q, minus tashqarida
//   (−5)³ = −125   toq ko'rsatkich, qavs bor -> manfiy
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'sign_power_zones', level: '🔴', itemSize: 24, zoneLbl: 96,
  eyebrow: L('Uch qiymat', 'Три значения', 'Three values'),
  setup: L(
    "Uch yozuvda ham beshlik va daraja bor. Qavs va ko'rsatkich qiymatni hal qiladi.",
    'Во всех трёх записях есть пятёрка и степень. Значение решают скобка и показатель.',
    'All three records have a five and a power. The bracket and the exponent decide the value.'),
  zones: [
    { id: 'z25', label: L('25', '25', '25') },
    { id: 'zm25', label: L('−25', '−25', '−25') },
    { id: 'zm125', label: L('−125', '−125', '−125') },
  ],
  items: [
    { id: 'i1', tokens: ['(−5)²'], zone: 'z25' },
    { id: 'i2', tokens: ['−5²'], zone: 'zm25' },
    { id: 'i3', tokens: ['(−5)³'], zone: 'zm125' },
  ],
  ask: L('Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  bank: L('Yozuvlar', 'Записи', 'Records'),
  correctText: L(
    "To'g'ri. (−5)² da ikki minus ko'paytiriladi -- musbat 25. −5² da minus tashqarida -- −25. (−5)³ da uch minus -- manfiy 125.",
    'Верно. В (−5)² перемножаются два минуса — положительное 25. В −5² минус снаружи — −25. В (−5)³ три минуса — отрицательное 125.',
    'Correct. In (−5)² two minuses multiply — positive 25. In −5² the minus is outside — −25. In (−5)³ three minuses — negative 125.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('i2') !== -1, text: L(
      "−5² da qavs YO'Q: avval 5² = 25 hisoblanadi, keyin minus qo'yiladi. Javob −25.",
      'В −5² скобки НЕТ: сначала считается 5² = 25, потом ставится минус. Ответ −25.',
      'In −5² there is NO bracket: 5² = 25 is worked out first, then the minus is applied. The answer is −25.') },
    { when: (s) => s.bad.indexOf('i3') !== -1, text: L(
      "(−5)³ da uchta minus ko'paytiriladi -- toq son, natija manfiy: −125.",
      'В (−5)³ перемножаются три минуса — число нечётное, результат отрицательный: −125.',
      'In (−5)³ three minuses multiply — an odd number, so the result is negative: −125.') },
    { when: (s) => s.bad.indexOf('i1') !== -1, text: L(
      "(−5)² da ikkita minus ko'paytiriladi -- juft son, natija musbat: 25.",
      'В (−5)² перемножаются два минуса — число чётное, результат положительный: 25.',
      'In (−5)² two minuses multiply — an even number, so the result is positive: 25.') },
  ],
  wrongText: L(
    "Ikki narsaga qarang: qavs bormi va ko'rsatkich juftmi. Qavs manfiy sonni asos qiladi, juft ko'rsatkich esa natijani musbat qiladi.",
    'Смотри на два признака: есть ли скобка и чётный ли показатель. Скобка делает основанием отрицательное число, а чётный показатель делает результат положительным.',
    'Look at two things: is there a bracket and is the exponent even. A bracket makes the negative number the base, and an even exponent makes the result positive.'),
};

export default function D13_10(props) { return <Zones data={DATA} {...props} />; }
