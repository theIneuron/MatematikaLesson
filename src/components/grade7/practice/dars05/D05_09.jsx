// Dars05 · Amaliyot 09 — Qavs qiymatni saqlaydi · 🔴 · tag: build_bracket_value
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> BuildLine (target).
//
// Kartalar: 40 15 6 − − ( ). Qiymati 31 bo'lishi kerak.
//   40 − (15 − 6) = 40 − 9 = 31    -- javob
// Qavssiz: 40 − 15 − 6 = 19. Ya'ni qavs qiymatni O'ZGARTIRADI va aynan
// shuning uchun kerak. Boshqa joylashuv: (40 − 15) − 6 = 19 -- bu ham 31
// bermaydi, chunki qavs bu yerda ortiqcha.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const CARDS = [
  { id: 'n40', label: '40', kind: 'num', value: 40 },
  { id: 'm1', label: '−', kind: 'op' },
  { id: 'op', label: '(', kind: 'open' },
  { id: 'n15', label: '15', kind: 'num', value: 15 },
  { id: 'm2', label: '−', kind: 'op' },
  { id: 'n6', label: '6', kind: 'num', value: 6 },
  { id: 'cl', label: ')', kind: 'close' },
];

const DATA = {
  tag: 'build_bracket_value', level: '🔴', useAll: true, target: 31,
  cards: CARDS,
  eyebrow: L("Yozuvni yig'ish", 'Собери запись', 'Build the record'),
  setup: L(
    "Hamma kartadan foydalanib, qiymati 31 ga teng yozuv yig'ing. Qavssiz bu son chiqmaydi.",
    'Используя все карточки, собери запись со значением 31. Без скобки это число не получится.',
    'Using every card, build a record whose value is 31. Without the bracket that number cannot come out.'),
  empty: L("Kartalarni bosib yozuv yig'ing", 'Собери запись, нажимая карточки', 'Build the record by tapping cards'),
  ask: L("Kartani bosing. Kursorni ko'chirish uchun yozuvdagi belgini bosing.",
    'Нажми карточку. Чтобы передвинуть курсор, нажми знак в записи.',
    'Tap a card. To move the cursor, tap a sign in the record.'),
  undo: L('Bitta orqaga', 'Шаг назад', 'One back'),
  valueLabel: L('Qiymat:', 'Значение:', 'Value:'),
  correctText: L(
    "To'g'ri. 40 − (15 − 6) = 40 − 9 = 31. Qavs ikkinchi ayirishni birinchi qildi, shuning uchun 6 aslida QO'SHILDI.",
    'Верно. 40 − (15 − 6) = 40 − 9 = 31. Скобка сделала второе вычитание первым, поэтому 6 на самом деле ПРИБАВИЛОСЬ.',
    'Correct. 40 − (15 − 6) = 40 − 9 = 31. The bracket made the second subtraction first, so the 6 was actually ADDED.'),
  wrongs: [
    { when: (s) => s.value === 19, text: L(
      "19 bu 40 − 15 − 6: qavs bor, lekin u hech narsani o'zgartirmaydigan joyda turibdi. Qavs IKKINCHI ayirishni o'z ichiga olishi kerak.",
      '19 это 40 − 15 − 6: скобка есть, но стоит там, где ничего не меняет. Скобка должна взять внутрь ВТОРОЕ вычитание.',
      '19 is 40 − 15 − 6: the bracket is there but where it changes nothing. It must take the SECOND subtraction inside.') },
    { when: (s) => s.value === 49, text: L(
      "49 chiqishi uchun 6 ikki marta qo'shilgan. Qavs ichida 15 − 6 = 9 bo'lishi kerak, keyin 40 − 9.",
      'Чтобы вышло 49, шестёрку прибавили дважды. В скобке должно быть 15 − 6 = 9, потом 40 − 9.',
      'To get 49 the six was added twice. The bracket must give 15 − 6 = 9, then 40 − 9.') },
    { when: (s) => s.value === null, text: L(
      "Yozuv tugallanmagan: qavs ochilib yopilishi, son va belgi navbatlashib kelishi kerak.",
      'Запись не закончена: скобка должна открыться и закрыться, а число и знак идти по очереди.',
      'The record is unfinished: the bracket must open and close, and numbers and signs must alternate.') },
  ],
  wrongText: L(
    "31 ni olish uchun 40 dan 9 ni ayirish kerak. To'qqizni kartalardan yig'ing: 15 − 6, va uni qavsga oling.",
    'Чтобы получить 31, надо вычесть из 40 девять. Девятку собери из карточек: 15 − 6, и возьми её в скобку.',
    'To get 31 you take nine from 40. Build the nine from the cards: 15 − 6, and put it in the bracket.'),
};

export default function D05_09(props) { return <BuildLine data={DATA} {...props} />; }
