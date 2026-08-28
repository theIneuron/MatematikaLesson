// Dars02 · Amaliyot 08 — Xato qator · 🔴 · teg: bitta-nuqtada-xulosa
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> AuditLines.
// Kontent: src/books/grade9/DARS02_AMALIYOT_KONTENT.md §08
//
// «Juft emas» degan xulosadan «toq» CHIQMAYDI. Uchinchi imkoniyat bor:
// na juft, na toq. Xato aynan shu sakrashda — uchinchi qatorda.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { AuditLines } from '../asboblar9.jsx';

const DATA = {
  tag: 'bitta-nuqtada-xulosa', level: '🔴',
  eyebrow: L('Xato qator', 'Ошибочная строка', 'Wrong line'),
  setup: L(
    "Yechim tayyor, lekin javob noto'g'ri. Har bir qator to'g'riday ko'rinadi.",
    'Решение готово, но ответ неверный. Каждая строка выглядит правильной.',
    'The solution is finished, but the answer is wrong. Every line looks right.'),
  ask: L('Birinchi xato qatorni bosing.', 'Нажми первую ошибочную строку.', 'Tap the first wrong line.'),
  givenLabel: L('Tekshiring', 'Проверить', 'Check'),
  given: [['y = x² + x']],
  exprSize: 17,
  rows: [
    { id: 'r1', tokens: ['y(1) = 1 + 1 = 2'] },
    { id: 'r2', tokens: ['y(−1) = 1 − 1 = 0'] },
    { id: 'r3', tokens: ['y(−1) ≠ y(1)'], text: L(
      "demak funksiya toq", 'значит функция нечётная', 'so the function is odd') },
    { id: 'r4', text: L('Javob: funksiya toq', 'Ответ: функция нечётная', 'Answer: the function is odd') },
  ],
  answerId: 'r3',
  correctText: L(
    "To'g'ri, xato uchinchi qatorda. Ikkinchi qatorgacha hammasi to'g'ri hisoblangan: qiymatlar teng emas, demak funksiya juft emas. Lekin bundan toqlik chiqmaydi — toqlik uchun qiymatlar qarama-qarshi bo'lishi kerak, ya'ni nol emas, minus ikki chiqishi kerak edi. Uchinchi imkoniyat esa unutilgan: funksiya na juft, na toq.",
    'Верно, ошибка в третьей строке. До второй строки всё посчитано правильно: значения не равны, значит функция не чётная. Но отсюда не следует нечётность — для неё значения должны быть противоположными, то есть должно было получиться минус два, а не нуль. А третья возможность забыта: функция ни чётная, ни нечётная.',
    'Correct, the error is in the third line. Everything up to the second line is computed right: the values are not equal, so the function is not even. But oddness does not follow from that — for oddness the values must be opposite, that is, minus two should have appeared, not zero. And a third possibility was forgotten: the function is neither even nor odd.'),
  wrongs: [
    { when: (s) => s.picked === 'r1', text: L(
      "Bu qator to'g'ri hisoblangan: birning kvadrati bir, ustiga bir qo'shiladi. Xatoni undan pastda qidiring.",
      'Эта строка посчитана верно: единица в квадрате — единица, к ней прибавляется единица. Ищи ошибку ниже.',
      'This line is computed correctly: one squared is one, and one is added to it. Look for the error below.') },
    { when: (s) => s.picked === 'r2', text: L(
      "Bu ham to'g'ri: minus birning kvadrati bir, ustiga minus bir qo'shiladi. Keyingi qadamga qarang — qiymatlardan qanday xulosa chiqarilgan?",
      'Эта тоже верна: минус единица в квадрате — единица, к ней прибавляется минус единица. Посмотри на следующий шаг: какой вывод сделан из значений?',
      'This one is right too: minus one squared is one, and minus one is added. Look at the next step — what conclusion was drawn from the values?') },
    { when: (s) => s.picked === 'r4', text: L(
      "To'rtinchi qator uchinchisini takrorlaydi, ya'ni u xatoni faqat ko'chirib yozgan. Bizga BIRINCHI xato kerak, oxirgisi emas.",
      'Четвёртая строка повторяет третью, то есть она лишь переписала ошибку. Нам нужна ПЕРВАЯ ошибка, а не последняя.',
      'The fourth line repeats the third, so it merely copied the error. We need the FIRST error, not the last one.') },
  ],
  wrongText: L(
    "Ikkinchi qatordan keyin nima ma'lum bo'ldi? Faqat shuki, funksiya juft emas. Bundan darrov toqlik chiqadimi?",
    'Что стало известно после второй строки? Только то, что функция не чётная. Следует ли отсюда сразу нечётность?',
    'What was known after the second line? Only that the function is not even. Does oddness follow from that at once?'),
};

export default function D02_08(props) { return <AuditLines data={DATA} {...props} />; }
