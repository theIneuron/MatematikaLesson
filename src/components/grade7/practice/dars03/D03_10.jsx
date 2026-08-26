// Dars03 · Amaliyot 10 — Qaysi xossa ishlatilgan · 🔴 · tag: name_property
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
//
// DARAJA KO'TARILDI (metodist qarori 2026-08-21): uch o'zgartirishda ham
// MANFIY son bor. Ya'ni o'quvchi ishoraga qarab chalkashmasligi va faqat
// o'zgarishning TURINI ko'rishi kerak.
//
//   −1700 + 2500 + 1700 -> −1700 + 1700 + 2500   o'rin almashdi
//   −4 · (250 · 17) -> (−4 · 250) · 17        qavs ko'chdi
//   −12 · (300 + 5) -> −12 · 300 − 12 · 5     ko'paytuvchi tarqaldi
// ATAMALAR darsning o'zidan: o'rin almashtirish, guruhlash, taqsimlash.
// TARTIB SAQLANADI (`noShuffle`): razbor yozuvlarga TARTIB bilan murojaat
// qiladi («ikkinchi tenglamada...»), aralashtirilsa izoh ekrandagiga mos
// kelmay qoladi.
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'name_property', level: '🔴', noShuffle: true, itemSize: 15, zoneLbl: 128,
  eyebrow: L('Qaysi xossa', 'Какое свойство', 'Which property'),
  setup: L(
    "Har yozuv o'zgartirildi, qiymat esa o'zgarmadi. Manfiy sonlar chalkashtirmasin: qaysi xossa ishlatilganini aniqlang.",
    'Каждую запись изменили, а значение осталось тем же. Пусть отрицательные числа не сбивают: определи, какое свойство применили.',
    'Each record was changed while the value stayed the same. Do not let the negatives distract you: work out which property was used.'),
  zones: [
    { id: 'zswap', label: L("O'RIN ALMASHTIRISH", 'ПЕРЕСТАНОВКА', 'SWAPPING') },
    { id: 'zgroup', label: L('GURUHLASH', 'ГРУППИРОВКА', 'GROUPING') },
    { id: 'zdist', label: L('TAQSIMLASH', 'РАСПРЕДЕЛЕНИЕ', 'DISTRIBUTING') },
  ],
  items: [
    { id: 'i1', tokens: ['−1700', '+', '2500', '+', '1700', '→', '−1700', '+', '1700', '+', '2500'], zone: 'zswap' },
    { id: 'i2', tokens: ['−4', '·', '(', '250', '·', '17', ')', '→', '(', '−4', '·', '250', ')', '·', '17'], zone: 'zgroup' },
    { id: 'i3', tokens: ['−12', '·', '(', '300', '+', '5', ')', '→', '−12', '·', '300', '−', '12', '·', '5'], zone: 'zdist' },
  ],
  ask: L('Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  bank: L("O'zgartirishlar", 'Изменения', 'Changes'),
  correctText: L(
    "To'g'ri. Birinchisida sonlar joyini almashdi (qarama-qarshi juftlik yonma-yon keldi), ikkinchisida faqat qavs ko'chdi, uchinchisida ko'paytuvchi qavs ichidagi har songa tarqaldi.",
    'Верно. В первой числа поменялись местами (противоположная пара встала рядом), во второй лишь переехала скобка, в третьей множитель раздался каждому числу в скобке.',
    'Correct. In the first the numbers swapped (the opposite pair came together), in the second only the bracket moved, in the third the factor was handed to each number in the bracket.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('i2') !== -1, text: L(
      "Ikkinchi yozuvda sonlar TARTIBI o'zgarmadi -- faqat qavs boshqa juftlikni oldi. Bu guruhlash.",
      'Во второй записи ПОРЯДОК чисел не изменился — скобка лишь взяла другую пару. Это группировка.',
      'In the second record the ORDER did not change — the bracket just took a different pair. That is grouping.') },
    { when: (s) => s.bad.indexOf('i3') !== -1, text: L(
      "Uchinchi yozuvda qavs YO'QOLDI va ko'paytuvchi ikki marta yozildi. Faqat taqsimlash shunday qiladi.",
      'В третьей записи скобка ИСЧЕЗЛА, а множитель написан дважды. Так делает только распределение.',
      'In the third record the bracket DISAPPEARED and the factor is written twice. Only distributing does that.') },
    { when: (s) => s.bad.indexOf('i1') !== -1, text: L(
      "Birinchi yozuvda qavs ham yo'q, ko'paytirish ham yo'q -- qo'shiluvchilar joyini almashdi, xolos.",
      'В первой записи нет ни скобок, ни умножения — слагаемые просто поменялись местами.',
      'The first record has no brackets and no multiplication — the terms simply swapped places.') },
  ],
  wrongText: L(
    "Ikki tomonni solishtiring: sonlar joyi o'zgardimi, qavs ko'chdimi yoki ko'paytuvchi ikki marta yozildimi?",
    'Сравни две стороны: числа поменялись местами, скобка переехала или множитель написан дважды?',
    'Compare the two sides: did the numbers swap, did the bracket move, or is the factor written twice?'),
};

export default function D03_10(props) { return <Zones data={DATA} {...props} />; }
