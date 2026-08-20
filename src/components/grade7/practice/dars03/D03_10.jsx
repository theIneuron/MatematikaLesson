// Dars03 · Amaliyot 10 — Qaysi xossa ishlatilgan · 🔴 · tag: name_property
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
//
// Uchta o'zgartirish, uchta xossa. O'quvchi natijani hisoblamaydi -- u
// NIMA QILINGANINI aniqlaydi. Bu darsning yakuni: uch xossaning har biri
// yozuvda o'z izini qoldiradi.
//   17 + 25 + 83 -> 17 + 83 + 25      qo'shiluvchilar o'rni almashdi
//   4 · (25 · 17) -> (4 · 25) · 17    qavs ko'chdi, tartib o'sha
//   12 · (30 + 5) -> 12 · 30 + 12 · 5 ko'paytiruvchi har songa tarqaldi
// ATAMALAR darsning o'zidan olingan: o'rin almashtirish, guruhlash, taqsimlash.
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'name_property', level: '🔴', itemSize: 15, zoneLbl: 128,
  eyebrow: L('Qaysi xossa', 'Какое свойство', 'Which property'),
  setup: L(
    "Har yozuv o'zgartirildi, qiymat esa o'zgarmadi. Qaysi xossa ishlatilganini aniqlang.",
    'Каждую запись изменили, а значение осталось тем же. Определи, какое свойство применили.',
    'Each record was changed while the value stayed the same. Work out which property was used.'),
  zones: [
    { id: 'zswap', label: L("O'RIN ALMASHTIRISH", 'ПЕРЕСТАНОВКА', 'SWAPPING') },
    { id: 'zgroup', label: L('GURUHLASH', 'ГРУППИРОВКА', 'GROUPING') },
    { id: 'zdist', label: L('TAQSIMLASH', 'РАСПРЕДЕЛЕНИЕ', 'DISTRIBUTING') },
  ],
  items: [
    { id: 'i1', tokens: ['17', '+', '25', '+', '83', '→', '17', '+', '83', '+', '25'], zone: 'zswap' },
    { id: 'i2', tokens: ['4', '·', '(', '25', '·', '17', ')', '→', '(', '4', '·', '25', ')', '·', '17'], zone: 'zgroup' },
    { id: 'i3', tokens: ['12', '·', '(', '30', '+', '5', ')', '→', '12', '·', '30', '+', '12', '·', '5'], zone: 'zdist' },
  ],
  ask: L('Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  bank: L("O'zgartirishlar", 'Изменения', 'Changes'),
  correctText: L(
    "To'g'ri. Birinchisida sonlar joyini almashdi, ikkinchisida faqat qavs ko'chdi, uchinchisida ko'paytiruvchi qavs ichidagi har songa tarqaldi.",
    'Верно. В первой числа поменялись местами, во второй только переехала скобка, в третьей множитель раздался каждому числу в скобке.',
    'Correct. In the first the numbers swapped places, in the second only the bracket moved, in the third the factor was handed to each number in the bracket.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('i2') !== -1, text: L(
      "Ikkinchi yozuvga qarang: sonlar TARTIBI o'zgarmadi, faqat qavs boshqa juftlikni oldi. Bu guruhlash.",
      'Посмотри на вторую запись: ПОРЯДОК чисел не изменился, скобка лишь взяла другую пару. Это группировка.',
      'Look at the second record: the ORDER of the numbers did not change, the bracket just took a different pair. That is grouping.') },
    { when: (s) => s.bad.indexOf('i3') !== -1, text: L(
      "Uchinchi yozuvda qavs YO'QOLDI va ko'paytiruvchi ikki marta yozildi. Faqat taqsimlash shunday qiladi.",
      'В третьей записи скобка ИСЧЕЗЛА, а множитель написан дважды. Так делает только распределение.',
      'In the third record the bracket DISAPPEARED and the factor is written twice. Only distributing does that.') },
    { when: (s) => s.bad.indexOf('i1') !== -1, text: L(
      "Birinchi yozuvda qavs ham yo'q, ko'paytirish ham yo'q -- shunchaki qo'shiluvchilar joyini almashdi.",
      'В первой записи нет ни скобок, ни умножения — просто слагаемые поменялись местами.',
      'The first record has no brackets and no multiplication — the terms simply swapped places.') },
  ],
  wrongText: L(
    "Ikki tomonni solishtiring: sonlar joyi o'zgardimi, qavs ko'chdimi yoki ko'paytiruvchi ikki marta yozildimi?",
    'Сравни две стороны: числа поменялись местами, скобка переехала или множитель написан дважды?',
    'Compare the two sides: did the numbers swap, did the bracket move, or is the factor written twice?'),
};

export default function D03_10(props) { return <Zones data={DATA} {...props} />; }
