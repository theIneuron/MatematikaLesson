// Dars16 · Amaliyot 10 — Xato qator · 🔴 · teg: kesishma-yoq-holatni-tanimaslik
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> AuditLines.
//
// Sistema: x ≤ −1 va x > 2. Ikkita yechim bir-biriga TEGMAYDI: minus
// birdan chapda va ikkidan o'ngda. Umumiy qism yo'q, demak sistemaning
// yechimi yo'q.
//
// Xato UCHINCHI qatorda: umumiy qism o'rniga BIRLASHMA yozilgan.
// To'rtinchi qator uchinchisining natijasini ko'chiradi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { AuditLines } from '../asboblar9.jsx';

const DATA = {
  tag: 'kesishma-yoq-holatni-tanimaslik', level: '🔴',
  eyebrow: L('Xato qator', 'Ошибочная строка', 'Wrong line'),
  setup: L(
    "Sistema yechilgan. Har bir tengsizlik to'g'ri yechilgan, xato keyinroq.",
    'Система решена. Каждое неравенство решено верно, ошибка позже.',
    'The system was solved. Each inequality is solved correctly, the error comes later.'),
  ask: L('Birinchi xato qatorni bosing.', 'Нажми первую ошибочную строку.', 'Tap the first wrong line.'),
  givenLabel: L('Sistema', 'Система', 'System'),
  given: [['x ≤ −1'], ['x > 2']],
  exprSize: 15,
  rows: [
    { id: 'r1', text: L('Birinchi yechim:', 'Первое решение:', 'First solution:'), tokens: ['x ≤ −1'] },
    { id: 'r2', text: L('Ikkinchi yechim:', 'Второе решение:', 'Second solution:'), tokens: ['x > 2'] },
    { id: 'r3', text: L('Umumiy qism:', 'Общая часть:', 'Common part:'), tokens: ['x ≤ −1', 'yoki', 'x > 2'] },
    { id: 'r4', text: L('Javob:', 'Ответ:', 'Answer:'), tokens: ['x ≤ −1', 'yoki', 'x > 2'] },
  ],
  answerId: 'r3',
  correctText: L(
    "To'g'ri, xato uchinchi qatorda. U yerda umumiy qism o'rniga BIRLASHMA yozilgan: «yoki» ikkala qismni ham oladi, sistema esa «va» talab qiladi. Ikkala yechimni bitta o'qqa qo'yib ko'ring: bittasi minus birdan chapda, ikkinchisi ikkidan o'ngda — ular ustma-ust tushmaydi. Bir vaqtda minus birdan kichik va ikkidan katta bo'lgan son yo'q, demak sistemaning yechimi yo'q. Bu ham to'liq javob.",
    'Верно, ошибка в третьей строке. Там вместо общей части записано ОБЪЕДИНЕНИЕ: «или» берёт обе части, а система требует «и». Нанеси оба решения на одну ось: одно левее минус одного, другое правее двух — они не накладываются. Числа, которое одновременно меньше минус одного и больше двух, не существует, значит у системы нет решений. Это тоже полноценный ответ.',
    'Correct, the error is in the third line. A UNION was written there instead of the common part: "or" takes both pieces, while a system demands "and". Put both solutions on one axis: one lies left of minus one, the other right of two — they do not overlap. There is no number that is at once less than minus one and greater than two, so the system has no solution. That too is a complete answer.'),
  wrongs: [
    { when: (s) => s.picked === 'r1', text: L(
      "Bu qator to'g'ri: birinchi tengsizlik shundayligicha yozilgan, uni yechish ham kerak emas edi.",
      'Эта строка верна: первое неравенство переписано как есть, решать его и не требовалось.',
      'This line is right: the first inequality is written as it stands, it needed no solving.') },
    { when: (s) => s.picked === 'r2', text: L(
      "Bu ham to'g'ri: ikkinchi tengsizlik ham tayyor ko'rinishda berilgan. Keyingi qatorga qarang — ikkala yechimdan umumiy qism to'g'ri olinganmi?",
      'Эта тоже верна: второе неравенство тоже дано в готовом виде. Посмотри на следующую строку: верно ли взята общая часть?',
      'This one is right too: the second inequality is given ready-made as well. Look at the next line — was the common part taken correctly?') },
    { when: (s) => s.picked === 'r4', text: L(
      "To'rtinchi qator xato, lekin u BIRINCHI xato emas: u uchinchisining natijasini ko'chirgan. Xato umumiy qism olingan joyda paydo bo'lgan.",
      'Четвёртая строка неверна, но она не ПЕРВАЯ ошибка: она переписала результат третьей. Ошибка возникла там, где брали общую часть.',
      'The fourth line is wrong, but it is not the FIRST error: it copied the result of the third. The error arose where the common part was taken.') },
  ],
  wrongText: L(
    "Bitta son o'ylab ko'ring: u bir vaqtda minus birdan kichik va ikkidan katta bo'lishi mumkinmi? Agar bunday son topilmasa, yozuvdagi javob to'g'ri bo'lolmaydi.",
    'Придумай одно число: может ли оно быть одновременно меньше минус одного и больше двух? Если такого нет, ответ в записи верным быть не может.',
    'Think of one number: can it be at once less than minus one and greater than two? If no such number exists, the recorded answer cannot be right.'),
};

export default function D16_10(props) { return <AuditLines data={DATA} {...props} />; }
