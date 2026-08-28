// Dars06 · Amaliyot 05 — O'q · 🟡 · teg: chegara-nuqta-kiritish
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> DomainAxis,
// `interval` REJIMIDA: ikki chegara, har birining o'z nuqta turi bilan.
// Kontent: src/books/grade9/DARS06_AMALIYOT_KONTENT.md §05
//
// Bu rejim aynan shu dars uchun qo'shildi: kvadrat tengsizlikning javobi
// nur emas, ORALIQ. Ikkala nuqta ham bo'yalgan, chunki tengsizlik qat'iy
// emas va nollarning o'zida ko'paytma nolga teng.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { DomainAxis } from '../asboblar9.jsx';

const DATA = {
  tag: 'chegara-nuqta-kiritish', level: '🟡',
  eyebrow: L('O\'q', 'Ось', 'Axis'),
  setup: L(
    "O'qda ikkita chegara qo'yiladi, keyin har biri uchun nuqta turi tanlanadi.",
    'На оси ставят две границы, потом для каждой выбирают тип точки.',
    'Two boundaries are placed on the axis, then a point type is chosen for each.'),
  ask: L(
    "Tengsizlikning javobini o'qda ko'rsating.",
    'Отметь на оси ответ неравенства.',
    'Mark the answer of the inequality on the axis.'),
  expr: ['(x + 1)(x − 5) ≤ 0'],
  mode: 'interval',
  axis: { from: -4, to: 8 },
  answer: { a: { at: -1, closed: true }, b: { at: 5, closed: true } },
  closedLabel: L('Bo\'yalgan', 'Закрашенная', 'Filled'),
  openLabel: L('Bo\'sh', 'Пустая', 'Hollow'),
  correctText: L(
    "To'g'ri. Nollar minus bir va besh, javob esa ular orasida: tarmoqlar yuqoriga qaragani uchun parabola aynan shu yerda Ox dan pastda. Tengsizlik qat'iy emas, shuning uchun ikkala nuqta ham bo'yalgan: nollarning o'zida ko'paytma nolga teng, nol esa «kichik yoki teng» ga to'g'ri keladi.",
    'Верно. Нули — минус один и пять, а ответ между ними: ветви направлены вверх, поэтому именно там парабола ниже Ox. Неравенство нестрогое, поэтому обе точки закрашены: в самих нулях произведение равно нулю, а нуль подходит под «меньше или равно».',
    'Correct. The zeros are minus one and five, and the answer lies between them: with branches up the parabola is below Ox exactly there. The inequality is not strict, so both points are filled: at the zeros the product is zero, and zero fits "less than or equal".'),
  wrongs: [
    { when: (s) => s.atOk && !s.closedOk, text: L(
      "Tengsizlikda «kichik yoki teng» turibdi. Minus birni qo'ying: ko'paytma nol chiqadi. Nol bu shartga to'g'ri keladimi?",
      'В неравенстве стоит «меньше или равно». Подставь минус единицу: произведение равно нулю. Подходит ли нуль под это условие?',
      'The inequality says "less than or equal". Put in minus one: the product is zero. Does zero fit that condition?') },
    { when: (s) => s.has(1) || s.has(-5), text: L(
      "Ikkala qavsni alohida nolga tenglashtiring: iks qo'shuv bir nolga teng bo'lsa iks minus bir, iks minus besh nolga teng bo'lsa iks besh.",
      'Приравняй каждую скобку к нулю отдельно: если икс плюс один равно нулю, то икс минус один; если икс минус пять равно нулю, то икс пять.',
      'Set each bracket to zero separately: if x plus one is zero then x is minus one; if x minus five is zero then x is five.') },
    { when: (s) => s.marks.length < 2, text: L(
      "Ikkita ko'paytuvchi bor, demak nollar ham ikkita. Ikkalasini ham o'qqa qo'ying.",
      'Множителей два, значит и нулей два. Поставь на ось оба.',
      'There are two factors, so there are two zeros. Put both on the axis.') },
  ],
  wrongText: L(
    "Avval ikkala qavsni nolga tenglashtirib chegaralarni toping, keyin tengsizlikning ishorasiga qarab nuqta turini tanlang.",
    'Сначала найди границы, приравняв обе скобки к нулю, потом по знаку неравенства выбери тип точек.',
    'First find the boundaries by setting both brackets to zero, then choose the point type from the sign of the inequality.'),
};

export default function D06_05(props) { return <DomainAxis data={DATA} {...props} />; }
