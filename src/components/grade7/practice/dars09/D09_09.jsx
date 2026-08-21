// Dars09 · Amaliyot 09 — Ildizni tekshirish · 🔴 · tag: build_root_check
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> BuildLine (target).
//
// 8-topshiriqda x = 5 topilgan. Yechim TEKSHIRILMAGUNCHA tugagan hisoblanmaydi:
// kartalardan 4(x − 1) ning x = 5 dagi qiymatini yig'ish kerak, ya'ni 16.
//   (5 − 1) · 4 yoki 4 · (5 − 1) -- ikkisi ham 16 beradi, tekshiruv QIYMAT
//   bo'yicha ketadi.
// QAVSSIZ 16 chiqmaydi: 4 · 5 − 1 = 19. Ya'ni qavs matematikaning talabi.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const CARDS = [
  { id: 'n4', label: '4', kind: 'num', value: 4 },
  { id: 'mul', label: '·', kind: 'op' },
  { id: 'op', label: '(', kind: 'open' },
  { id: 'n5', label: '5', kind: 'num', value: 5 },
  { id: 'minus', label: '−', kind: 'op' },
  { id: 'n1', label: '1', kind: 'num', value: 1 },
  { id: 'cl', label: ')', kind: 'close' },
];

const DATA = {
  tag: 'build_root_check', level: '🔴', useAll: true, target: 16,
  cards: CARDS,
  eyebrow: L('Ildizni tekshirish', 'Проверка корня', 'Checking the root'),
  setup: L(
    "4(x − 1) = 2(x + 3) tenglamasining ildizi x = 5 deb topildi. Chap tomonning qiymatini hisoblab tekshiramiz: u 16 chiqishi kerak.",
    'Для уравнения 4(x − 1) = 2(x + 3) нашли корень x = 5. Проверяем, посчитав левую часть: должно выйти 16.',
    'For the equation 4(x − 1) = 2(x + 3) the root x = 5 was found. We check by working out the left side: it must give 16.'),
  empty: L("Kartalarni bosib yozuv yig'ing", 'Собери запись, нажимая карточки', 'Build the record by tapping cards'),
  ask: L("Chap tomonning tekshirish yozuvini yig'ing. Hamma karta ishlatiladi.",
    'Собери запись проверки для левой части. Используются все карточки.',
    'Build the check record for the left side. Every card is used.'),
  undo: L('Bitta orqaga', 'Шаг назад', 'One back'),
  valueLabel: L('Qiymat:', 'Значение:', 'Value:'),
  correctText: L(
    "To'g'ri. 4 · (5 − 1) = 4 · 4 = 16. O'ng tomon ham 2 · (5 + 3) = 16, ya'ni x = 5 haqiqatan ildiz.",
    'Верно. 4 · (5 − 1) = 4 · 4 = 16. Правая часть тоже 2 · (5 + 3) = 16, значит x = 5 действительно корень.',
    'Correct. 4 · (5 − 1) = 4 · 4 = 16. The right side is 2 · (5 + 3) = 16 too, so x = 5 really is a root.'),
  wrongs: [
    { when: (s) => s.value === 19, text: L(
      "19 bu 4 · 5 − 1: qavs kerakli joyda emas. Avval qavs ichidagi ayirish, keyin ko'paytirish bajarilishi kerak.",
      '19 это 4 · 5 − 1: скобка не на нужном месте. Сначала вычитание в скобке, потом умножение.',
      '19 is 4 · 5 − 1: the bracket is in the wrong place. The subtraction inside comes first, then the multiplication.') },
    { when: (s) => s.value === 11, text: L(
      "11 chiqishi uchun qavs ichiga 4 va 1 tushgan. x o'rniga 5 qo'yiladi, ya'ni qavs ichida 5 − 1 turishi kerak.",
      'Чтобы вышло 11, в скобку попали 4 и 1. Вместо x ставится 5, значит в скобке должно быть 5 − 1.',
      'To get 11 the bracket took the 4 and the 1. The 5 replaces x, so the bracket must hold 5 − 1.') },
    { when: (s) => s.value === null, text: L(
      "Yozuv tugallanmagan: qavs ochilib yopilishi, son va belgi navbatlashib kelishi kerak.",
      'Запись не закончена: скобка должна открыться и закрыться, а число и знак идти по очереди.',
      'The record is unfinished: the bracket must open and close, and numbers and signs must alternate.') },
  ],
  wrongText: L(
    "x o'rniga 5 qo'ying: qavs ichida 5 − 1 = 4 chiqadi, keyin 4 ga ko'paytiriladi.",
    'Подставь 5 вместо x: в скобке выйдет 5 − 1 = 4, потом умножается на 4.',
    'Put 5 in place of x: the bracket gives 5 − 1 = 4, then it is multiplied by 4.'),
};

export default function D09_09(props) { return <BuildLine data={DATA} {...props} />; }
