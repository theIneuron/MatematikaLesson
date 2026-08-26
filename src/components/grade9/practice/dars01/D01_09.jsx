// Dars01 · Amaliyot 09 — Xato qator · 🔴 · teg: first_wrong_line
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> AuditLines.
// Kontent: src/books/grade9/DARS01_AMALIYOT_KONTENT.md §09
//
// METODIST QARORI 2026-08-26 (ikkinchi): pastdagi «qaysi sonda buziladi»
// maydoni OLIB TASHLANDI, faqat to'rt qatorli ketma-ketlik qoladi.
// Tushuntirish — minus to'rtning yo'qolgani — javobdan keyin `correctText`
// da beriladi. Shu sababli mexanika ham boshqa: umumiy qatlamdagi
// `AuditRows` ikkita shartni talab qiladi, bu esa sinfning o'z mexanikasi.
//
// XATO UCHINCHI QATORDA: `x² ≠ 16` dan `x ≠ 4` chiqmaydi, chunki kvadrati
// o'n oltiga teng bo'lgan son ikkita. To'rtinchi qator uchinchisining
// natijasi, ya'ni u ham noto'g'ri — lekin BIRINCHI xato uchinchisida.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { AuditLines } from '../asboblar9.jsx';

const DATA = {
  tag: 'first_wrong_line', level: '🔴',
  eyebrow: L('Xato qator', 'Ошибочная строка', 'Wrong line'),
  setup: L(
    "Yechim tayyor, lekin javob noto'g'ri. Har bir qator to'g'riday ko'rinadi.",
    'Решение готово, но ответ неверный. Каждая строка выглядит правильной.',
    'The solution is finished, but the answer is wrong. Every line looks right.'),
  ask: L(
    "Birinchi xato qatorni bosing.",
    'Нажми первую ошибочную строку.',
    'Tap the first wrong line.'),
  givenLabel: L('Toping', 'Найти', 'Find'),
  given: [['y =', { n: '1', d: 'x² − 16' }]],
  exprSize: 18,
  rows: [
    { id: 'r1', text: L(
      "Maxraj nolga teng bo'lmasligi kerak:",
      'Знаменатель не должен обращаться в нуль:',
      'The denominator must not become zero:'), tokens: ['x² − 16 ≠ 0'] },
    { id: 'r2', tokens: ['x² ≠ 16'] },
    { id: 'r3', tokens: ['x ≠ 4'] },
    { id: 'r4', text: L('Javob:', 'Ответ:', 'Answer:'), tokens: ['x ≠ 4'] },
  ],
  answerId: 'r3',
  correctText: L(
    "To'g'ri, xato uchinchi qatorda. Kvadrati o'n oltiga teng bo'lgan son bitta emas, IKKITA: to'rt va minus to'rt. Uchinchi qatorda ulardan faqat bittasi yozilgan, ikkinchisi yo'qolgan. Minus to'rtni maxrajga qo'ying: minus to'rtning kvadrati o'n olti, o'n olti minus o'n olti nolga teng — demak minus to'rtda ham qiymat yo'q va uni ham chiqarib tashlash kerak edi. To'rtinchi qator shunchaki uchinchisini takrorlaydi, shuning uchun birinchi xato aynan uchinchisida.",
    'Верно, ошибка в третьей строке. Чисел, квадрат которых равен шестнадцати, не одно, а ДВА: четыре и минус четыре. В третьей строке записано только одно из них, второе потерялось. Подставь минус четыре в знаменатель: квадрат минус четырёх — шестнадцать, шестнадцать минус шестнадцать равно нулю, значит при минус четырёх значения тоже нет и его тоже нужно было исключить. Четвёртая строка просто повторяет третью, поэтому первая ошибка именно в третьей.',
    'Correct, the error is in the third line. There is not one but TWO numbers whose square is sixteen: four and minus four. The third line writes down only one of them, the other was lost. Put minus four into the denominator: minus four squared is sixteen, sixteen minus sixteen is zero, so at minus four there is no value either and it had to be excluded as well. The fourth line simply repeats the third, so the first error is exactly in the third.'),
  wrongs: [
    { when: (s) => s.picked === 'r1', text: L(
      "Bu qator to'g'ri: maxraj haqiqatan ham nolga aylanmasligi kerak. Xatoni undan pastda qidiring.",
      'Эта строка верна: знаменатель действительно не должен обращаться в нуль. Ищи ошибку ниже.',
      'This line is right: the denominator really must not become zero. Look for the error below it.') },
    { when: (s) => s.picked === 'r2', text: L(
      "Bu ham to'g'ri: o'n oltini o'ng tomonga o'tkazish xato emas. Keyingi qadamga qarang — kvadratdan qanday qutulindi va shunda nechta son chiqishi kerak edi?",
      'Эта тоже верна: перенести шестнадцать вправо — не ошибка. Посмотри на следующий шаг: как избавились от квадрата и сколько чисел при этом должно было получиться?',
      'This one is right too: moving sixteen to the other side is not an error. Look at the next step — how was the square removed, and how many numbers should have appeared?') },
    { when: (s) => s.picked === 'r4', text: L(
      "To'rtinchi qator uchinchisini takrorlaydi, ya'ni u xatoni faqat ko'chirib yozgan. Bizga BIRINCHI xato kerak, oxirgisi emas.",
      'Четвёртая строка повторяет третью, то есть она лишь переписала ошибку. Нам нужна ПЕРВАЯ ошибка, а не последняя.',
      'The fourth line repeats the third, so it merely copied the error. We need the FIRST error, not the last one.') },
  ],
  wrongText: L(
    "Har qatorni oldingisidan chiqarib ko'ring. Iks kvadrat o'n oltiga teng emas degan yozuvdan iks to'rtga teng emas degan yozuv chiqadimi? Kvadrati o'n oltiga teng bo'ladigan sonlarni sanang.",
    'Выведи каждую строку из предыдущей. Следует ли из записи «икс в квадрате не равен шестнадцати» запись «икс не равен четырём»? Перечисли числа, квадрат которых равен шестнадцати.',
    'Derive each line from the one above it. Does "x squared is not sixteen" give "x is not four"? Count the numbers whose square is sixteen.'),
};

export default function D01_09(props) { return <AuditLines data={DATA} {...props} />; }
