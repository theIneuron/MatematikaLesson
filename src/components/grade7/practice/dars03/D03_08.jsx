// Dars03 · Amaliyot 08 — Yozuvni o'zi yig'ish · 🔴 · tag: build_distributed
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> BuildLine (target).
//
// 7-topshiriqda o'quvchi TAYYOR sxemaning uyalarini to'ldirgan edi. Bu yerda
// sxemani o'zi yig'adi: kartalar 50 2 37 − · ( ), qiymati 1776 bo'lishi kerak.
//   (50 − 2) · 37 = 48 · 37 = 1776   -- javob
//   37 · (50 − 2) ham 1776 beradi    -- ham to'g'ri, tekshiruv QIYMAT bo'yicha
// QAVSSIZ bunday qiymat CHIQMAYDI: 50 − 2 · 37 = 50 − 74 = −24. Ya'ni qavsni
// matematikaning o'zi talab qiladi, u ortiqcha bezak emas.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const CARDS = [
  { id: 'n50', label: '50', kind: 'num', value: 50 },
  { id: 'minus', label: '−', kind: 'op' },
  { id: 'n2', label: '2', kind: 'num', value: 2 },
  { id: 'n37', label: '37', kind: 'num', value: 37 },
  { id: 'mul', label: '·', kind: 'op' },
  { id: 'op', label: '(', kind: 'open' },
  { id: 'cl', label: ')', kind: 'close' },
];

const DATA = {
  tag: 'build_distributed', level: '🔴', useAll: true, target: 1776,
  cards: CARDS,
  eyebrow: L("Yozuvni yig'ish", 'Собери запись', 'Build the record'),
  setup: L(
    "Hamma kartadan foydalanib, qiymati 1776 ga teng yozuv yig'ing. Bu 48 · 37 ning qiymati.",
    'Используя все карточки, собери запись со значением 1776. Это значение 48 · 37.',
    'Using every card, build a record whose value is 1776. That is the value of 48 · 37.'),
  empty: L("Kartalarni bosib yozuv yig'ing", 'Собери запись, нажимая карточки', 'Build the record by tapping cards'),
  ask: L("Kartani bosing. Kursorni ko'chirish uchun yozuvdagi belgini bosing.",
    'Нажми карточку. Чтобы передвинуть курсор, нажми знак в записи.',
    'Tap a card. To move the cursor, tap a sign in the record.'),
  undo: L('Bitta orqaga', 'Шаг назад', 'One back'),
  valueLabel: L('Qiymat:', 'Значение:', 'Value:'),
  correctText: L(
    "To'g'ri. Qavs ayirishni birinchi qildi: 50 − 2 = 48, keyin 48 · 37 = 1776. Qavssiz avval ko'paytirish ketardi.",
    'Верно. Скобка сделала вычитание первым: 50 − 2 = 48, затем 48 · 37 = 1776. Без скобки первым шло бы умножение.',
    'Correct. The bracket made the subtraction first: 50 − 2 = 48, then 48 · 37 = 1776. Without it the multiplication would go first.'),
  wrongs: [
    { when: (s) => s.value === -24, text: L(
      "Qavs yozuvda bor, lekin kerakli joyda emas: 50 − 2 · 37 da avval 2 · 37 = 74 hisoblanadi va manfiy son chiqadi. Qavs ayirishni o'z ichiga olishi kerak.",
      'Скобка в записи есть, но не на нужном месте: в 50 − 2 · 37 сначала считается 2 · 37 = 74 и выходит отрицательное число. Скобка должна взять вычитание внутрь.',
      'The bracket is there but in the wrong place: in 50 − 2 · 37 the 2 · 37 = 74 goes first and the result is negative. The bracket must take the subtraction inside.') },
    { when: (s) => s.value === 1750, text: L(
      "Qavs ichiga boshqa juftlik tushdi. 48 ni olish uchun 50 dan 2 ayirilishi kerak, 37 esa qavs tashqarisida qoladi.",
      'В скобку попала другая пара. Чтобы получить 48, из 50 нужно вычесть 2, а 37 остаётся за скобкой.',
      'The wrong pair got into the bracket. To get 48 you take 2 from 50, and the 37 stays outside.') },
    { when: (s) => s.value === null, text: L(
      "Yozuv tugallanmagan: qavs ochilib yopilishi, sonlar va belgilar navbatlashib kelishi kerak.",
      'Запись не закончена: скобка должна открыться и закрыться, а числа и знаки идти по очереди.',
      'The record is unfinished: the bracket must open and close, and numbers and signs must alternate.') },
  ],
  wrongText: L(
    "1776 bu 48 · 37. 48 ni kartalardan olish kerak: 50 − 2. Ayirish esa ko'paytirishdan OLDIN bajarilishi shart.",
    '1776 это 48 · 37. Сорок восемь надо получить из карточек: 50 − 2. И вычитание должно выполниться РАНЬШЕ умножения.',
    '1776 is 48 · 37. The 48 has to come from the cards: 50 − 2. And the subtraction must run BEFORE the multiplication.'),
};

export default function D03_08(props) { return <BuildLine data={DATA} {...props} />; }
