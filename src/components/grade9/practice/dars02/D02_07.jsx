// Dars02 · Amaliyot 07 — Qiymat · 🟡 · teg: bitta-nuqtada-xulosa
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> TypeSet.
// Kontent: src/books/grade9/DARS02_AMALIYOT_KONTENT.md §07
//
// Toqlik xossasi HISOBLASHNI almashtiradi: y(3) ma'lum bo'lsa, y(−3) ni
// qayta hisoblash shart emas. Razbor ham shuni ko'rsatadi — javob
// formuladan emas, XOSSADAN chiqadi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { TypeSet } from '../asboblar9.jsx';

const DATA = {
  tag: 'bitta-nuqtada-xulosa', level: '🟡',
  eyebrow: L('Qiymat', 'Значение', 'Value'),
  setup: L(
    "Funksiya toq ekani ma'lum, va bitta qiymati berilgan.",
    'Известно, что функция нечётная, и дано одно её значение.',
    'The function is known to be odd, and one of its values is given.'),
  ask: L('y(−3) ni yozing.', 'Напиши y(−3).', 'Write y(−3).'),
  hint: L(
    "Javob bitta son.",
    'Ответ — одно число.',
    'The answer is a single number.'),
  placeholder: '0',
  givenLabel: L('Berilgan', 'Дано', 'Given'),
  given: [['y = x³ − x'], ['y(3) = 24']],
  answer: [-24],
  correctText: L(
    "To'g'ri, minus yigirma to'rt. Buni hisoblash shart emas edi: toq funksiyada minus uch dagi qiymat uch dagi qiymatning qarama-qarshisi. Xossa hisobning o'rnini bosdi.",
    'Верно, минус двадцать четыре. Считать было не нужно: у нечётной функции значение при минус трёх противоположно значению при трёх. Свойство заменило вычисление.',
    'Correct, minus twenty-four. There was no need to compute: for an odd function the value at minus three is the opposite of the value at three. The property replaced the arithmetic.'),
  wrongs: [
    { when: (s) => s.has(24), text: L(
      "Bu juft funksiyaning javobi: u yerda qiymatlar teng bo'lardi. Toq funksiyada esa qarama-qarshi.",
      'Это ответ для чётной функции: там значения были бы равны. У нечётной они противоположны.',
      'That is the answer for an even function, where the values would be equal. For an odd one they are opposite.') },
    { when: (s) => s.has(0), text: L(
      "Nol faqat bitta nuqtada, iks nolga teng bo'lganda chiqadi. Bu yerda esa savol minus uch haqida.",
      'Нуль получается только в одной точке, при икс равном нулю. А вопрос про минус три.',
      'Zero appears at one point only, when x equals zero. The question is about minus three.') },
    { when: (s) => s.size >= 1, text: L(
      "Formulani qayta hisoblashning hojati yo'q. Toqlik sharti tayyor javobni beradi: minus uch dagi qiymat uch dagi qiymatga qarama-qarshi.",
      'Пересчитывать по формуле не нужно. Условие нечётности даёт готовый ответ: значение при минус трёх противоположно значению при трёх.',
      'There is no need to recompute from the formula. The oddness condition gives the answer straight away: the value at minus three is the opposite of the value at three.') },
  ],
  wrongText: L(
    "Toqlik sharti: minus iks dagi qiymat iks dagi qiymatning qarama-qarshisi. Yigirma to'rtning qarama-qarshisi qaysi son?",
    'Условие нечётности: значение при минус икс противоположно значению при икс. Какое число противоположно двадцати четырём?',
    'The oddness condition: the value at minus x is the opposite of the value at x. Which number is the opposite of twenty-four?'),
};

export default function D02_07(props) { return <TypeSet data={DATA} {...props} />; }
