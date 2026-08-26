// Dars02 · Amaliyot 10 — Har qanday son bo'lavermaydi · 🔴 · tag: zones_value_x
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
//
// Darsning 9-ekrani chegaraviy holat haqida: nolga bo'lish mumkin emas,
// ya'ni ba'zi son uchun yozuvning QIYMATI YO'Q. Bu yerda u boshqa ikki
// holat bilan yonma-yon turadi, ya'ni o'quvchi uchtasini ham hisoblaydi.
//
// x = 4 da (tekshirilgan):
//   12 : (x − 4)  ->  x − 4 = 0, nolga bo'linmaydi   QIYMATI YO'Q
//   x − 9         ->  4 − 9 = −5                     MANFIY
//   2x − 3        ->  8 − 3 = 5                      MUSBAT
// TARTIB SAQLANADI (`noShuffle`): razbor yozuvlarga TARTIB bilan murojaat
// qiladi («ikkinchi tenglamada...»), aralashtirilsa izoh ekrandagiga mos
// kelmay qoladi.
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'zones_value_x', level: '🔴', noShuffle: true, itemSize: 18, zoneLbl: 112,
  eyebrow: L("Har qanday son bo'lavermaydi", 'Не всякое число подходит', 'Not every number fits'),
  setup: L(
    "Uchta yozuvga bir xil son qo'yiladi, natijalar esa har xil. Bittasida qiymat umuman chiqmaydi.",
    'В три записи ставится одно и то же число, а результаты разные. В одной записи значения не будет вовсе.',
    'The same number goes into three records, yet the results differ. One record has no value at all.'),
  given: [['x', '=', '4']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  zones: [
    { id: 'znone', label: L("QIYMATI YO'Q", 'ЗНАЧЕНИЯ НЕТ', 'NO VALUE') },
    { id: 'zneg', label: L('MANFIY', 'ОТРИЦАТЕЛЬНОЕ', 'NEGATIVE') },
    { id: 'zpos', label: L('MUSBAT', 'ПОЛОЖИТЕЛЬНОЕ', 'POSITIVE') },
  ],
  items: [
    { id: 'i1', tokens: ['12', ':', '(', 'x', '−', '4', ')'], zone: 'znone' },
    { id: 'i2', tokens: ['x', '−', '9'], zone: 'zneg' },
    { id: 'i3', tokens: ['2x', '−', '3'], zone: 'zpos' },
  ],
  ask: L('Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  bank: L('Yozuvlar', 'Записи', 'Records'),
  correctText: L(
    "To'g'ri. Qavs ichida 4 − 4 = 0 chiqadi, nolga bo'lish esa yo'q amal. Qolganlari: 4 − 9 = −5 va 2 · 4 − 3 = 5.",
    'Верно. В скобке получается 4 − 4 = 0, а деления на нуль не существует. Остальные: 4 − 9 = −5 и 2 · 4 − 3 = 5.',
    'Correct. The bracket gives 4 − 4 = 0, and division by zero does not exist. The others: 4 − 9 = −5 and 2 · 4 − 3 = 5.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('i1') !== -1, text: L(
      "Birinchi yozuvda qavs ichini hisoblang: 4 − 4 = 0. Nolga bo'lish amali yo'q, shuning uchun qiymat ham yo'q.",
      'В первой записи посчитай скобку: 4 − 4 = 0. Деления на нуль не существует, поэтому и значения нет.',
      'Work out the bracket in the first record: 4 − 4 = 0. There is no division by zero, so there is no value.') },
    { when: (s) => s.bad.indexOf('i3') !== -1, text: L(
      "2x bu 2 · x, ya'ni 8. Sakkizdan uch ayirilsa musbat son qoladi.",
      '2x это 2 · x, то есть 8. Если из восьми вычесть три, останется положительное число.',
      '2x is 2 · x, that is 8. Taking three from eight leaves a positive number.') },
    { when: (s) => s.bad.indexOf('i2') !== -1, text: L(
      "To'rtdan to'qqizni ayirib bo'lmaydi deb o'ylamang: natija manfiy son bo'ladi, −5.",
      'Не думай, что из четырёх нельзя вычесть девять: результат будет отрицательным, −5.',
      'Do not think nine cannot be taken from four: the result is a negative number, −5.') },
  ],
  wrongText: L(
    "Har yozuvni oxirigacha hisoblang. Bo'linuvchi nolga aylansa -- qiymat yo'q; qolganlarda ishorani solishtiring.",
    'Досчитай каждую запись до конца. Если делитель обратился в нуль — значения нет; в остальных сравни знак.',
    'Work each record out to the end. If the divisor turns into zero there is no value; for the others compare the sign.'),
};

export default function D02_10(props) { return <Zones data={DATA} {...props} />; }
