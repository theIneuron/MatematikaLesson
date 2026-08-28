// Dars03 · Amaliyot 10 — Xato qator · 🔴 · teg: nol-koeff-a
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> AuditLines.
// Kontent: src/books/grade9/DARS03_AMALIYOT_KONTENT.md §10
//
// Yozuvda hadlar boshqa tartibda: avval ozod had, keyin iks kvadratli
// had. a — birinchi had emas, iks kvadrat OLDIDAGI son. Xato ikkinchi
// qatorda, uchinchi qator esa undan kelib chiqadi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { AuditLines } from '../asboblar9.jsx';

const DATA = {
  tag: 'nol-koeff-a', level: '🔴',
  eyebrow: L('Xato qator', 'Ошибочная строка', 'Wrong line'),
  setup: L(
    "Yechim tayyor, lekin javob noto'g'ri. Har bir qator to'g'riday ko'rinadi.",
    'Решение готово, но ответ неверный. Каждая строка выглядит правильной.',
    'The solution is finished, but the answer is wrong. Every line looks right.'),
  ask: L('Birinchi xato qatorni bosing.', 'Нажми первую ошибочную строку.', 'Tap the first wrong line.'),
  givenLabel: L('Toping', 'Найти', 'Find'),
  given: [['y = 5 − 2x²', '→', 'a = ?']],
  exprSize: 17,
  rows: [
    { id: 'r1', text: L(
      "Yozuvni y = ax² + bx + c ko'rinishiga solishtiramiz",
      'Сравниваем запись с видом y = ax² + bx + c',
      'Compare the record with the form y = ax² + bx + c') },
    { id: 'r2', text: L('Birinchi had besh, demak', 'Первое слагаемое — пять, значит', 'The first term is five, so'), tokens: ['a = 5'] },
    { id: 'r3', tokens: ['a = 5 ≠ 0'] },
    { id: 'r4', text: L('Javob:', 'Ответ:', 'Answer:'), tokens: ['a = 5'] },
  ],
  answerId: 'r2',
  correctText: L(
    "To'g'ri, xato ikkinchi qatorda. a — birinchi had emas, iks kvadrat OLDIDAGI son. Bu yozuvda hadlar boshqa tartibda turibdi: avval ozod had, keyin iks kvadratli had. Uni standart ko'rinishga keltirsak, minus ikki iks kvadrat qo'shuv besh chiqadi, ya'ni a minus ikkiga teng.",
    'Верно, ошибка во второй строке. a — не первое слагаемое, а число ПЕРЕД икс в квадрате. В этой записи слагаемые стоят в другом порядке: сначала свободный член, потом член с икс в квадрате. Если привести к стандартному виду, получится минус два икс в квадрате плюс пять, то есть a равно минус двум.',
    'Correct, the error is in the second line. a is not the first term but the number IN FRONT of x squared. In this record the terms stand in a different order: the constant first, then the x squared term. Put in standard form it reads minus two x squared plus five, so a equals minus two.'),
  wrongs: [
    { when: (s) => s.picked === 'r1', text: L(
      "Bu qator to'g'ri: yechim aynan shu solishtirishdan boshlanadi. Xatoni undan pastda qidiring.",
      'Эта строка верна: решение как раз с этого сравнения и начинается. Ищи ошибку ниже.',
      'This line is right: the solution does start from that comparison. Look for the error below.') },
    { when: (s) => s.picked === 'r3', text: L(
      "Bu qator ikkinchisidan kelib chiqadi: agar a beshga teng bo'lganida, u haqiqatan ham nolga teng bo'lmasdi. Xato undan yuqorida.",
      'Эта строка следует из второй: если бы a равнялось пяти, оно и правда не было бы нулём. Ошибка выше.',
      'This line follows from the second: if a were five, it really would not be zero. The error is above it.') },
    { when: (s) => s.picked === 'r4', text: L(
      "To'rtinchi qator ikkinchisining natijasini takrorlaydi. Bizga BIRINCHI xato kerak, oxirgisi emas.",
      'Четвёртая строка повторяет результат второй. Нам нужна ПЕРВАЯ ошибка, а не последняя.',
      'The fourth line repeats the result of the second. We need the FIRST error, not the last one.') },
  ],
  wrongText: L(
    "Yozuvdagi hadlarni standart tartibga soling: iks kvadratli had qayerda va uning oldida qaysi son turibdi?",
    'Расставь слагаемые записи в стандартном порядке: где член с икс в квадрате и какое число стоит перед ним?',
    'Put the terms of the record in standard order: where is the x squared term and which number stands in front of it?'),
};

export default function D03_10(props) { return <AuditLines data={DATA} {...props} />; }
