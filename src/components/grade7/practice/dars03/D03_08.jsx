// Dars03 · Amaliyot 08 — Yozuvni o'zi yig'ish · 🔴 · tag: build_distributed
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> BuildLine (target).
//
// DARAJA KO'TARILDI (metodist qarori 2026-08-21): kartalarda O'NLI KASR bor
// va qavs qiymatni hal qiladi.
//
// Kartalar: 12,5 80 40 · + ( ). Qiymati 1500 bo'lishi kerak.
//   12,5 · (80 + 40) = 12,5 · 120 = 1500   -- javob
//   (80 + 40) · 12,5 ham 1500 beradi       -- tekshiruv QIYMAT bo'yicha
// QAVSSIZ: 12,5 · 80 + 40 = 1040. Ya'ni qavs shu yerda ishlaydi, bezak emas.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const CARDS = [
  { id: 'd125', label: '12,5', kind: 'num', value: 12.5 },
  { id: 'mul', label: '·', kind: 'op' },
  { id: 'op', label: '(', kind: 'open' },
  { id: 'n8', label: '80', kind: 'num', value: 80 },
  { id: 'plus', label: '+', kind: 'op' },
  { id: 'n4', label: '40', kind: 'num', value: 40 },
  { id: 'cl', label: ')', kind: 'close' },
];

const DATA = {
  tag: 'build_distributed', level: '🔴', useAll: true, target: 1500,
  cards: CARDS,
  eyebrow: L("Yozuvni yig'ish", 'Собери запись', 'Build the record'),
  setup: L(
    "Hamma kartadan foydalanib, qiymati 1500 ga teng yozuv yig'ing. Qavs qayerda turishi natijani hal qiladi.",
    'Используя все карточки, собери запись со значением 1500. Где стоит скобка — то и решает результат.',
    'Using every card, build a record whose value is 1500. Where the bracket stands decides the result.'),
  empty: L("Kartalarni bosib yozuv yig'ing", 'Собери запись, нажимая карточки', 'Build the record by tapping cards'),
  ask: L("Kartani bosing. Kursorni ko'chirish uchun yozuvdagi belgini bosing.",
    'Нажми карточку. Чтобы передвинуть курсор, нажми знак в записи.',
    'Tap a card. To move the cursor, tap a sign in the record.'),
  undo: L('Bitta orqaga', 'Шаг назад', 'One back'),
  valueLabel: L('Qiymat:', 'Значение:', 'Value:'),
  correctText: L(
    "To'g'ri. Qavs qo'shishni birinchi qildi: 80 + 40 = 120, keyin 12,5 · 120 = 1500. Kasrni butun songa ko'paytirish oson bo'ldi.",
    'Верно. Скобка сделала сложение первым: 80 + 40 = 120, затем 12,5 · 120 = 1500. Умножать дробь на целое стало легко.',
    'Correct. The bracket made the addition first: 80 + 40 = 120, then 12,5 · 120 = 1500. Multiplying the decimal by a whole number became easy.'),
  wrongs: [
    { when: (s) => s.value === 1040, text: L(
      "1040 bu 12,5 · 80 + 40: qavs qo'shishni o'z ichiga olmagan. Qavs 80 va 40 ni birga ushlashi kerak.",
      '1040 это 12,5 · 80 + 40: скобка не взяла сложение внутрь. Скобка должна держать вместе 80 и 40.',
      '1040 is 12,5 · 80 + 40: the bracket did not take the addition inside. It must hold the 80 and the 40 together.') },
    { when: (s) => s.value === 620 || s.value === 665, text: L(
      "Qavs ichiga boshqa juftlik tushdi. 1500 ni olish uchun 12,5 ni 120 ga ko'paytirish kerak, ya'ni qavsda 80 + 40 turishi lozim.",
      'В скобку попала другая пара. Чтобы получить 1500, надо умножить 12,5 на 120, то есть в скобке должно быть 80 + 40.',
      'The wrong pair got into the bracket. To reach 1500 you multiply 12,5 by 120, so the bracket must hold 80 + 40.') },
    { when: (s) => s.value === null, text: L(
      "Yozuv tugallanmagan: qavs ochilib yopilishi, son va belgi navbatlashib kelishi kerak.",
      'Запись не закончена: скобка должна открыться и закрыться, а число и знак идти по очереди.',
      'The record is unfinished: the bracket must open and close, and numbers and signs must alternate.') },
  ],
  wrongText: L(
    "1500 ni olish uchun 12,5 ni 120 ga ko'paytirish kerak. Bir yuz yigirmani kartalardan yig'ing: 80 + 40, va uni qavsga oling.",
    'Чтобы получить 1500, надо умножить 12,5 на 120. Сто двадцать собери из карточек: 80 + 40, и возьми в скобку.',
    'To get 1500 you multiply 12,5 by 120. Build the hundred and twenty from the cards: 80 + 40, and put it in the bracket.'),
};

export default function D03_08(props) { return <BuildLine data={DATA} {...props} />; }
