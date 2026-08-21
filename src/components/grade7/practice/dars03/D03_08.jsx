// Dars03 · Amaliyot 08 — Yozuvni o'zi yig'ish · 🔴 · tag: build_distributed
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> BuildLine (target).
//
// DARAJA KO'TARILDI (metodist qarori 2026-08-21): kartalarda O'NLI KASR bor
// va qavs qiymatni hal qiladi.
//
// Kartalar: 12,5 8 4 · + ( ). Qiymati 150 bo'lishi kerak.
//   12,5 · (8 + 4) = 12,5 · 12 = 150      -- javob
//   (8 + 4) · 12,5 ham 150 beradi          -- tekshiruv QIYMAT bo'yicha
// QAVSSIZ: 12,5 · 8 + 4 = 104. Ya'ni qavs shu yerda ishlaydi, bezak emas.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const CARDS = [
  { id: 'd125', label: '12,5', kind: 'num', value: 12.5 },
  { id: 'mul', label: '·', kind: 'op' },
  { id: 'op', label: '(', kind: 'open' },
  { id: 'n8', label: '8', kind: 'num', value: 8 },
  { id: 'plus', label: '+', kind: 'op' },
  { id: 'n4', label: '4', kind: 'num', value: 4 },
  { id: 'cl', label: ')', kind: 'close' },
];

const DATA = {
  tag: 'build_distributed', level: '🔴', useAll: true, target: 150,
  cards: CARDS,
  eyebrow: L("Yozuvni yig'ish", 'Собери запись', 'Build the record'),
  setup: L(
    "Hamma kartadan foydalanib, qiymati 150 ga teng yozuv yig'ing. Qavs qayerda turishi natijani hal qiladi.",
    'Используя все карточки, собери запись со значением 150. Где стоит скобка — то и решает результат.',
    'Using every card, build a record whose value is 150. Where the bracket stands decides the result.'),
  empty: L("Kartalarni bosib yozuv yig'ing", 'Собери запись, нажимая карточки', 'Build the record by tapping cards'),
  ask: L("Kartani bosing. Kursorni ko'chirish uchun yozuvdagi belgini bosing.",
    'Нажми карточку. Чтобы передвинуть курсор, нажми знак в записи.',
    'Tap a card. To move the cursor, tap a sign in the record.'),
  undo: L('Bitta orqaga', 'Шаг назад', 'One back'),
  valueLabel: L('Qiymat:', 'Значение:', 'Value:'),
  correctText: L(
    "To'g'ri. Qavs qo'shishni birinchi qildi: 8 + 4 = 12, keyin 12,5 · 12 = 150. Kasrni butun songa ko'paytirish oson bo'ldi.",
    'Верно. Скобка сделала сложение первым: 8 + 4 = 12, затем 12,5 · 12 = 150. Умножать дробь на целое стало легко.',
    'Correct. The bracket made the addition first: 8 + 4 = 12, then 12,5 · 12 = 150. Multiplying the decimal by a whole number became easy.'),
  wrongs: [
    { when: (s) => s.value === 104, text: L(
      "104 bu 12,5 · 8 + 4: qavs qo'shishni o'z ichiga olmagan. Qavs 8 va 4 ni birga ushlashi kerak.",
      '104 это 12,5 · 8 + 4: скобка не взяла сложение внутрь. Скобка должна держать вместе 8 и 4.',
      '104 is 12,5 · 8 + 4: the bracket did not take the addition inside. It must hold the 8 and the 4 together.') },
    { when: (s) => s.value === 62.5 || s.value === 66.5, text: L(
      "Qavs ichiga boshqa juftlik tushdi. 150 ni olish uchun 12,5 ni 12 ga ko'paytirish kerak, ya'ni qavsda 8 + 4 turishi lozim.",
      'В скобку попала другая пара. Чтобы получить 150, надо умножить 12,5 на 12, то есть в скобке должно быть 8 + 4.',
      'The wrong pair got into the bracket. To reach 150 you multiply 12,5 by 12, so the bracket must hold 8 + 4.') },
    { when: (s) => s.value === null, text: L(
      "Yozuv tugallanmagan: qavs ochilib yopilishi, son va belgi navbatlashib kelishi kerak.",
      'Запись не закончена: скобка должна открыться и закрыться, а число и знак идти по очереди.',
      'The record is unfinished: the bracket must open and close, and numbers and signs must alternate.') },
  ],
  wrongText: L(
    "150 ni olish uchun 12,5 ni 12 ga ko'paytirish kerak. O'n ikkini kartalardan yig'ing: 8 + 4, va uni qavsga oling.",
    'Чтобы получить 150, надо умножить 12,5 на 12. Двенадцать собери из карточек: 8 + 4, и возьми в скобку.',
    'To get 150 you multiply 12,5 by 12. Build the twelve from the cards: 8 + 4, and put it in the bracket.'),
};

export default function D03_08(props) { return <BuildLine data={DATA} {...props} />; }
