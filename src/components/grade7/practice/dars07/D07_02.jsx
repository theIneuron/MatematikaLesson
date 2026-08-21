// Dars07 · Amaliyot 02 — Ildizni topish · 🟢 · tag: find_root_simple
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
//
// DARAJA KO'TARILDI (PODXOD_7SINF.md §13): sonlar uch va to'rt xonali,
// ildiz esa manfiy qoladi.
//
// x + 1200 = 500. Ildiz manfiy: x = 500 − 1200 = −700.
// Tekshirish: −700 + 1200 = 500.
// Eng ko'p uchraydigan xato: 1700 (1200 ni qo'shib yuborgan) va 700
// (ishorani tashlab ketgan).
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'find_root_simple', level: '🟢', allowNeg: true, target: -700,
  eyebrow: L('Ildizni topish', 'Найти корень', 'Find the root'),
  setup: L(
    "Qo'shiluvchi noma'lum. Uni topish uchun yig'indidan ma'lum qo'shiluvchini ayirish kerak.",
    'Неизвестно слагаемое. Чтобы его найти, из суммы вычитают известное слагаемое.',
    'A term is unknown. To find it, take the known term away from the sum.'),
  expr: ['x', '+', '1200', '=', '500'], exprSize: 30,
  label: L('Ildizni yozing:', 'Запиши корень:', 'Write the root:'),
  correctText: L(
    "To'g'ri. x = 500 − 1200 = −700. Tekshiramiz: −700 + 1200 = 500, tenglik chiqdi.",
    'Верно. x = 500 − 1200 = −700. Проверяем: −700 + 1200 = 500, равенство получилось.',
    'Correct. x = 500 − 1200 = −700. Check: −700 + 1200 = 500, the equality holds.'),
  wrongs: [
    { when: (s) => s.value === 1700, text: L(
      "1700 chiqishi uchun 1200 qo'shilgan. Lekin 1200 tenglamada allaqachon QO'SHILGAN, ya'ni uni ayirish kerak.",
      'Чтобы вышло 1700, тысяча двести прибавили. Но в уравнении 1200 уже ПРИБАВЛЕНО, значит его надо вычесть.',
      'To get 1700 the 1200 was added. But in the equation the 1200 is already ADDED, so it must be taken away.') },
    { when: (s) => s.value === 700, text: L(
      "Ishora yo'qoldi: 500 dan 1200 ni ayirsa manfiy son chiqadi. 700 + 1200 esa 1900 beradi, 500 emas.",
      'Потерялся знак: если из 500 вычесть 1200, выйдет отрицательное число. А 700 + 1200 даёт 1900, а не 500.',
      'The sign got lost: taking 1200 from 500 gives a negative number. And 700 + 1200 is 1900, not 500.') },
  ],
  wrongText: L(
    "Topilgan sonni tenglamaga qo'yib tekshiring: u 1200 bilan qo'shilganda 500 berishi kerak.",
    'Подставь найденное число в уравнение: вместе с 1200 оно должно дать 500.',
    'Put your number back into the equation: together with 1200 it must give 500.'),
};

export default function D07_02(props) { return <TypeValue data={DATA} {...props} />; }
