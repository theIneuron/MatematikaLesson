// Dars17 · Amaliyot 05 — Sonlar o'qi · 🟡 · teg: maxraj-nolini-javobga-kiritish
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> DomainAxis,
// `interval` rejimida.
//
// MATEMATIKA: (x + 1)/(x − 4) ≤ 0. Nol nuqtalar: −1 (surat) va 4 (maxraj).
// Ishoralar: x > 4 musbat (masalan 5: 6/1), −1 < x < 4 manfiy (0: 1/−4),
// x < −1 musbat (−2: −1/−6). Javob: −1 ≤ x < 4.
//
// Darsning butun gapi shu bitta javobda: chap chegara YOPIQ (surat noli,
// belgi qat'iy emas), o'ng chegara OCHIQ (maxraj noli, har doim ochiq).
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { DomainAxis } from '../asboblar9.jsx';

const DATA = {
  tag: 'maxraj-nolini-javobga-kiritish', level: '🟡',
  eyebrow: L('Sonlar o\'qi', 'Числовая ось', 'The number line'),
  setup: L(
    "Kasrning ikkita nol nuqtasi bor: minus bir suratdan, to'rt maxrajdan. Belgi qat'iy emas.",
    'У дроби две нулевые точки: минус один от числителя, четыре от знаменателя. Знак нестрогий.',
    'The fraction has two zero points: minus one from the numerator, four from the denominator. The sign is non-strict.'),
  ask: L(
    "Tengsizlikning javobini o'qda ko'rsating.",
    'Покажи на оси ответ неравенства.',
    'Show the answer of the inequality on the axis.'),
  givenLabel: L('Tengsizlik', 'Неравенство', 'Inequality'),
  given: [['(x + 1)/(x − 4) ≤ 0']],
  mode: 'interval',
  axis: { from: -3, to: 6 },
  answer: { a: { at: -1, closed: true }, b: { at: 4, closed: false } },
  closedLabel: L('Bo\'yalgan', 'Закрашенная', 'Filled'),
  openLabel: L('Bo\'sh', 'Пустая', 'Hollow'),
  correctText: L(
    "To'g'ri: minus birdan to'rtgacha, chap chegara bo'yalgan, o'ng chegara bo'sh. Ishorani tekshirish oson: nolda bir bo'lingan minus to'rt — manfiy, demak bu oraliq javobga kiradi. Chegaralarning turi esa ikki xil qoidadan chiqadi. Minus bir — SURAT noli: u yerda kasr nolga teng, belgi qat'iy emas, demak kiradi. To'rt — MAXRAJ noli: u yerda kasrning qiymati umuman yo'q, demak hech qanday belgida kirmaydi.",
    'Верно: от минус одного до четырёх, левая граница закрашена, правая пустая. Знак проверить легко: в нуле один делить на минус четыре — отрицательно, значит этот промежуток входит в ответ. А типы границ выходят из двух разных правил. Минус один — нуль ЧИСЛИТЕЛЯ: там дробь равна нулю, знак нестрогий, значит входит. Четыре — нуль ЗНАМЕНАТЕЛЯ: там у дроби нет значения вовсе, значит не входит ни при каком знаке.',
    'Correct: from minus one to four, the left boundary filled, the right hollow. The sign is easy to check: at zero, one over minus four is negative, so this interval belongs to the answer. And the boundary kinds come from two different rules. Minus one is the NUMERATOR zero: the fraction equals zero there, the sign is non-strict, so it is included. Four is the DENOMINATOR zero: the fraction has no value there at all, so it is excluded under any sign.'),
  wrongs: [
    { when: (s) => s.atOk && s.a && s.b && s.a.closed === true && s.b.closed === true, text: L(
      "O'ng chegara ham bo'yalgan. To'rt — maxrajning noli: u yerda kasrning qiymati yo'q, nolga bo'lish mumkin emas. Belgi qat'iy emas bo'lsa ham, bu nuqta javobga kirmaydi.",
      'Правая граница тоже закрашена. Четыре — нуль знаменателя: там у дроби нет значения, на нуль делить нельзя. Даже при нестрогом знаке эта точка в ответ не входит.',
      'The right boundary was filled too. Four is the zero of the denominator: the fraction has no value there, division by zero is impossible. Even with a non-strict sign that point is out.') },
    { when: (s) => s.atOk && s.a && s.b && s.a.closed === false && s.b.closed === false, text: L(
      "Chap chegara ham bo'sh qo'yilgan. Minus bir — suratning noli: u yerda kasr nolga teng, belgi esa «kichik YOKI TENG» — demak nol qiymat javobga kiradi.",
      'Левая граница тоже поставлена пустой. Минус один — нуль числителя: там дробь равна нулю, а знак «меньше ИЛИ РАВНО» — значит нулевое значение входит.',
      'The left boundary was left hollow too. Minus one is the zero of the numerator: the fraction equals zero there, and the sign is "less than OR EQUAL" — so the zero value is included.') },
    { when: (s) => s.atOk && !s.closedOk, text: L(
      "Chegaralarning turi almashib ketdi. Surat noli qat'iy emas belgida javobga KIRADI, maxraj noli esa hech qachon kirmaydi — chap tomonda surat noli turibdi.",
      'Типы границ перепутаны. Нуль числителя при нестрогом знаке ВХОДИТ в ответ, а нуль знаменателя не входит никогда — слева стоит нуль числителя.',
      'The boundary kinds got swapped. The numerator zero IS included under a non-strict sign, while the denominator zero never is — and it is the numerator zero that stands on the left.') },
    { when: (s) => s.has(1) || s.has(-4), text: L(
      "Nol nuqtalar noto'g'ri o'qilgan. Iks qo'shuv bir minus birda nolga aylanadi, iks minus to'rt esa to'rtda.",
      'Нулевые точки прочитаны неверно. Икс плюс один обращается в нуль при минус одном, а икс минус четыре — при четырёх.',
      'The zero points were read wrongly. x plus one becomes zero at minus one, and x minus four at four.') },
    { when: (s) => !s.atOk, text: L(
      "Ikkala nol nuqtani o'qqa qo'ying: minus bir va to'rt. Keyin oraliqqa son qo'yib ishorasini tekshiring — nolda kasr manfiy chiqadi.",
      'Нанеси обе нулевые точки на ось: минус один и четыре. Потом подставь число в промежуток и проверь знак — в нуле дробь отрицательна.',
      'Put both zero points on the axis: minus one and four. Then substitute a number into the interval and check the sign — at zero the fraction is negative.') },
  ],
  wrongText: L(
    "Nol nuqtalarni o'qqa qo'ying, oraliqning ishorasini son qo'yib tekshiring, va har chegaraning turini O'Z manbasidan oling: surat nolimi yoki maxraj noli?",
    'Нанеси нулевые точки на ось, проверь знак промежутка подстановкой числа и тип каждой границы возьми из ЕЁ источника: это нуль числителя или знаменателя?',
    'Put the zero points on the axis, check the sign of the interval by substituting a number, and take each boundary kind from ITS OWN source: is it a numerator zero or a denominator zero?'),
};

export default function D17_05(props) { return <DomainAxis data={DATA} {...props} />; }
