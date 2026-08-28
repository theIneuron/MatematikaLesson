// Dars08 · Amaliyot 08 — Xato qator · 🔴 · teg: begona-ildizni-qabul-qilish
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> AuditLines.
//
// Yechimning boshi to'g'ri: ODZ ham yozilgan, surat ham to'g'ri
// tenglashtirilgan. Xato uchinchi qatorda — topilgan IKKI ildizning biri
// aynan ODZ dan chiqarilgan son, lekin u qabul qilingan.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { AuditLines } from '../asboblar9.jsx';

const DATA = {
  tag: 'begona-ildizni-qabul-qilish', level: '🔴',
  eyebrow: L('Xato qator', 'Ошибочная строка', 'Wrong line'),
  setup: L(
    "Yechim tayyor, lekin javob noto'g'ri. Har bir qator to'g'riday ko'rinadi.",
    'Решение готово, но ответ неверный. Каждая строка выглядит правильной.',
    'The solution is finished, but the answer is wrong. Every line looks right.'),
  ask: L('Birinchi xato qatorni bosing.', 'Нажми первую ошибочную строку.', 'Tap the first wrong line.'),
  givenLabel: L('Yeching', 'Решить', 'Solve'),
  given: [[{ n: 'x² − 4', d: 'x − 2' }, '= 0']],
  exprSize: 16,
  rows: [
    { id: 'r1', text: L('ODZ:', 'ОДЗ:', 'Domain:'), tokens: ['x ≠ 2'] },
    { id: 'r2', text: L('Surat nolga teng:', 'Числитель равен нулю:', 'The numerator is zero:'), tokens: ['x² − 4 = 0'] },
    { id: 'r3', text: L(
      "x = 2 va x = −2, ikkalasi ham ildiz",
      'x = 2 и x = −2, оба корня подходят',
      'x = 2 and x = −2, both are roots') },
    { id: 'r4', text: L('Javob:', 'Ответ:', 'Answer:'), tokens: ['x = 2', ';', 'x = −2'] },
  ],
  answerId: 'r3',
  correctText: L(
    "To'g'ri, xato uchinchi qatorda. Ikki va minus ikki suratni nolga aylantiradi, lekin ikki BIRINCHI QATORDA allaqachon chiqarib tashlangan: u yerda maxraj ham nolga aylanadi. Demak ikki begona ildiz, va javobda faqat minus ikki qoladi. Yechim o'z shartini o'zi unutgan.",
    'Верно, ошибка в третьей строке. Двойка и минус двойка обращают числитель в нуль, но двойка ИСКЛЮЧЕНА ЕЩЁ В ПЕРВОЙ СТРОКЕ: там знаменатель тоже обращается в нуль. Значит двойка — посторонний корень, и в ответе остаётся только минус два. Решение забыло собственное условие.',
    'Correct, the error is in the third line. Two and minus two make the numerator zero, but two was ALREADY EXCLUDED IN THE FIRST LINE: the denominator becomes zero there as well. So two is an extraneous root and only minus two remains in the answer. The solution forgot its own condition.'),
  wrongs: [
    { when: (s) => s.picked === 'r1', text: L(
      "Bu qator to'g'ri: maxraj ikkida nolga aylanadi, demak ikki ODZ dan chiqariladi. Xatoni undan pastda qidiring — ayni shu shart keyinroq unutilgan.",
      'Эта строка верна: знаменатель обращается в нуль при двух, значит двойка исключается из ОДЗ. Ищи ошибку ниже — именно это условие потом и забыли.',
      'This line is right: the denominator becomes zero at two, so two is excluded. Look for the error below — that very condition is forgotten later.') },
    { when: (s) => s.picked === 'r2', text: L(
      "Bu ham to'g'ri: kasr nolga teng bo'lishi uchun uning surati nolga teng bo'lishi kerak. Keyingi qadamga qarang.",
      'Эта тоже верна: чтобы дробь равнялась нулю, её числитель должен быть нулём. Посмотри на следующий шаг.',
      'This one is right too: for a fraction to be zero its numerator must be zero. Look at the next step.') },
    { when: (s) => s.picked === 'r4', text: L(
      "To'rtinchi qator uchinchisining natijasini ko'chirgan. Bizga BIRINCHI xato kerak, oxirgisi emas.",
      'Четвёртая строка переписала результат третьей. Нам нужна ПЕРВАЯ ошибка, а не последняя.',
      'The fourth line copied the result of the third. We need the FIRST error, not the last one.') },
  ],
  wrongText: L(
    "Birinchi qatorni va uchinchi qatorni yonma-yon qo'ying. Birinchisida qaysi son taqiqlangan, uchinchisida esa qaysi sonlar qabul qilingan?",
    'Положи рядом первую и третью строки. Какое число запрещено в первой и какие числа приняты в третьей?',
    'Put the first and third lines side by side. Which number is banned in the first, and which numbers are accepted in the third?'),
};

export default function D08_08(props) { return <AuditLines data={DATA} {...props} />; }
