// Dars06 · Amaliyot 09 — Xato qator · 🔴 · teg: javob-doim-tashqi-oraliq
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> AuditLines.
// Kontent: src/books/grade9/DARS06_AMALIYOT_KONTENT.md §09
//
// Birinchi ikki qator to'g'ri: nollar ham, tarmoqlarning yo'nalishi ham.
// Xato uchinchi qatorda — ishoradan javobning shakli noto'g'ri chiqarilgan.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { AuditLines } from '../asboblar9.jsx';

const DATA = {
  tag: 'javob-doim-tashqi-oraliq', level: '🔴',
  eyebrow: L('Xato qator', 'Ошибочная строка', 'Wrong line'),
  setup: L(
    "Yechim tayyor, lekin javob noto'g'ri. Har bir qator to'g'riday ko'rinadi.",
    'Решение готово, но ответ неверный. Каждая строка выглядит правильной.',
    'The solution is finished, but the answer is wrong. Every line looks right.'),
  ask: L('Birinchi xato qatorni bosing.', 'Нажми первую ошибочную строку.', 'Tap the first wrong line.'),
  givenLabel: L('Yeching', 'Решить', 'Solve'),
  given: [['(x − 2)(x − 6) < 0']],
  exprSize: 16,
  rows: [
    { id: 'r1', text: L('Nollar:', 'Нули:', 'Zeros:'), tokens: ['x = 2', ',', 'x = 6'] },
    { id: 'r2', text: L(
      'Tarmoqlar yuqoriga qaragan', 'Ветви направлены вверх', 'The branches point up') },
    { id: 'r3', text: L(
      "Tengsizlik < 0, demak javob nollardan TASHQARIDA",
      'Неравенство < 0, значит ответ ВНЕ нулей',
      'The inequality is < 0, so the answer is OUTSIDE the zeros') },
    { id: 'r4', text: L('Javob:', 'Ответ:', 'Answer:'), tokens: ['x < 2', 'yoki', 'x > 6'] },
  ],
  answerId: 'r3',
  correctText: L(
    "To'g'ri, xato uchinchi qatorda. Tarmoqlar yuqoriga qaragan parabola nollardan TASHQARIDA Ox dan yuqorida turadi, ya'ni u yerda ko'paytma musbat. Manfiy esa nollar ORASIDA. Uchni qo'yib ko'ring: bir ko'paytiruv minus uch, ya'ni manfiy — uch esa ikki bilan olti orasida.",
    'Верно, ошибка в третьей строке. Парабола с ветвями вверх ВНЕ нулей лежит выше Ox, то есть там произведение положительно. А отрицательно оно МЕЖДУ нулями. Подставь тройку: один умножить на минус три, отрицательно — а тройка стоит между двойкой и шестёркой.',
    'Correct, the error is in the third line. A parabola with branches up lies above Ox OUTSIDE the zeros, so the product is positive there. It is negative BETWEEN the zeros. Try three: one times minus three, which is negative — and three lies between two and six.'),
  wrongs: [
    { when: (s) => s.picked === 'r1', text: L(
      "Bu qator to'g'ri: qavslarni nolga tenglashtirsak, aynan ikki va olti chiqadi. Xatoni undan pastda qidiring.",
      'Эта строка верна: приравняв скобки к нулю, получим как раз два и шесть. Ищи ошибку ниже.',
      'This line is right: setting the brackets to zero gives exactly two and six. Look for the error below.') },
    { when: (s) => s.picked === 'r2', text: L(
      "Bu ham to'g'ri: qavslarni ochsak, iks kvadrat oldida bir turadi, ya'ni musbat. Keyingi qadamga qarang.",
      'Эта тоже верна: раскрыв скобки, перед икс в квадрате получим единицу, то есть положительное число. Посмотри на следующий шаг.',
      'This one is right too: expanding the brackets gives one in front of x squared, a positive number. Look at the next step.') },
    { when: (s) => s.picked === 'r4', text: L(
      "To'rtinchi qator uchinchisining natijasini yozib qo'ygan. Bizga BIRINCHI xato kerak, oxirgisi emas.",
      'Четвёртая строка лишь записала результат третьей. Нам нужна ПЕРВАЯ ошибка, а не последняя.',
      'The fourth line merely wrote down the result of the third. We need the FIRST error, not the last one.') },
  ],
  wrongText: L(
    "Nollar orasidan bitta son oling va ko'paytmaning ishorasini hisoblang. Tengsizlikda esa qaysi ishora so'ralgan?",
    'Возьми число между нулями и посчитай знак произведения. А какой знак спрашивают в неравенстве?',
    'Take a number between the zeros and compute the sign of the product. And which sign does the inequality ask for?'),
};

export default function D06_09(props) { return <AuditLines data={DATA} {...props} />; }
