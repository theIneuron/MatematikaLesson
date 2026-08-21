// Dars07 · Amaliyot 02 — Ildizni topish · 🟢 · tag: find_root_simple
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
//
// x + 12 = 5. Ildiz manfiy: x = 5 − 12 = −7.
// Tekshirish: −7 + 12 = 5.
// Eng ko'p uchraydigan xato: 17 (12 ni qo'shib yuborgan) va 7 (ishorani
// tashlab ketgan).
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'find_root_simple', level: '🟢', allowNeg: true, target: -7,
  eyebrow: L('Ildizni topish', 'Найти корень', 'Find the root'),
  setup: L(
    "Qo'shiluvchi noma'lum. Uni topish uchun yig'indidan ma'lum qo'shiluvchini ayirish kerak.",
    'Неизвестно слагаемое. Чтобы его найти, из суммы вычитают известное слагаемое.',
    'A term is unknown. To find it, take the known term away from the sum.'),
  expr: ['x', '+', '12', '=', '5'], exprSize: 32,
  label: L('Ildizni yozing:', 'Запиши корень:', 'Write the root:'),
  correctText: L(
    "To'g'ri. x = 5 − 12 = −7. Tekshiramiz: −7 + 12 = 5, tenglik chiqdi.",
    'Верно. x = 5 − 12 = −7. Проверяем: −7 + 12 = 5, равенство получилось.',
    'Correct. x = 5 − 12 = −7. Check: −7 + 12 = 5, the equality holds.'),
  wrongs: [
    { when: (s) => s.value === 17, text: L(
      "17 chiqishi uchun 12 qo'shilgan. Lekin 12 tenglamada allaqachon QO'SHILGAN, ya'ni uni ayirish kerak.",
      'Чтобы вышло 17, двенадцать прибавили. Но в уравнении 12 уже ПРИБАВЛЕНО, значит его надо вычесть.',
      'To get 17 the twelve was added. But in the equation the 12 is already ADDED, so it must be taken away.') },
    { when: (s) => s.value === 7, text: L(
      "Ishora yo'qoldi: 5 dan 12 ni ayirsa manfiy son chiqadi. 7 + 12 esa 19 beradi, 5 emas.",
      'Потерялся знак: если из 5 вычесть 12, выйдет отрицательное число. А 7 + 12 даёт 19, а не 5.',
      'The sign got lost: taking 12 from 5 gives a negative number. And 7 + 12 is 19, not 5.') },
  ],
  wrongText: L(
    "Topilgan sonni tenglamaga qo'yib tekshiring: u 12 bilan qo'shilganda 5 berishi kerak.",
    'Подставь найденное число в уравнение: вместе с 12 оно должно дать 5.',
    'Put your number back into the equation: together with 12 it must give 5.'),
};

export default function D07_02(props) { return <TypeValue data={DATA} {...props} />; }
