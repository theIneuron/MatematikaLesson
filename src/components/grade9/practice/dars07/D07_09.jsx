// Dars07 · Amaliyot 09 — Xato qator · 🔴 · teg: qavs-ochish-ishorasi
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> AuditLines.
//
// Xato ikkinchi qatorda: qavs oldidagi minus faqat BIRINCHI hadga
// tushirilgan, ikkinchisi esa o'z ishorasida qolgan. Uchinchi qator
// ikkinchisidan to'g'ri chiqadi — shuning uchun u xato emas, natija.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { AuditLines } from '../asboblar9.jsx';

const DATA = {
  tag: 'qavs-ochish-ishorasi', level: '🔴',
  eyebrow: L('Xato qator', 'Ошибочная строка', 'Wrong line'),
  setup: L(
    "Yechim tayyor, lekin javob noto'g'ri. Har bir qator to'g'riday ko'rinadi.",
    'Решение готово, но ответ неверный. Каждая строка выглядит правильной.',
    'The solution is finished, but the answer is wrong. Every line looks right.'),
  ask: L('Birinchi xato qatorni bosing.', 'Нажми первую ошибочную строку.', 'Tap the first wrong line.'),
  givenLabel: L('Yeching', 'Решить', 'Solve'),
  given: [['7 − (x − 3) = 2x']],
  exprSize: 17,
  rows: [
    { id: 'r1', label: L('Qavsni ochamiz', 'Раскрываем скобку', 'Open the bracket') },
    { id: 'r2', tokens: ['7 − x − 3 = 2x'] },
    { id: 'r3', tokens: ['4 = 3x'] },
    { id: 'r4', tokens: ['x = 4/3'] },
  ],
  answerId: 'r2',
  correctText: L(
    "To'g'ri, xato ikkinchi qatorda. Qavs oldidagi minus IKKALA hadga tushishi kerak edi: minus iks va QO'SHUV uch. Demak chap tomonda yetti minus iks qo'shuv uch, ya'ni o'n minus iks bo'lishi kerak. Uchinchi qator esa ikkinchisidan to'g'ri chiqqan — u xato emas, faqat noto'g'ri qatorning natijasi.",
    'Верно, ошибка во второй строке. Минус перед скобкой должен был попасть на ОБА слагаемых: минус икс и ПЛЮС три. Значит слева должно быть семь минус икс плюс три, то есть десять минус икс. А третья строка из второй выходит верно — она не ошибка, а следствие ошибочной строки.',
    'Correct, the error is in the second line. The minus in front of the bracket had to reach BOTH terms: minus x and PLUS three. So the left side should be seven minus x plus three, that is ten minus x. The third line follows correctly from the second — it is not an error but a consequence of the wrong line.'),
  wrongs: [
    { when: (s) => s.picked === 'r1', text: L(
      "Bu qator hali hech narsa hisoblamaydi, u faqat keyingi qadamni e'lon qiladi. Xatoni hisobning o'zida qidiring.",
      'Эта строка ещё ничего не считает, она лишь объявляет следующий шаг. Ищи ошибку в самом вычислении.',
      'This line computes nothing yet, it only announces the next step. Look for the error in the computation itself.') },
    { when: (s) => s.picked === 'r3', text: L(
      "Bu qator ikkinchisidan to'g'ri chiqqan: yetti minus uch to'rt, iks lar bir tomonga yig'ilgan. Xato undan yuqorida.",
      'Эта строка выходит из второй верно: семь минус три — четыре, иксы собраны в одну сторону. Ошибка выше.',
      'This line follows from the second correctly: seven minus three is four, and the x terms are gathered. The error is above it.') },
    { when: (s) => s.picked === 'r4', text: L(
      "To'rtinchi qator uchinchisidan chiqadi. Bizga BIRINCHI xato kerak, oxirgisi emas.",
      'Четвёртая строка выходит из третьей. Нам нужна ПЕРВАЯ ошибка, а не последняя.',
      'The fourth line follows from the third. We need the FIRST error, not the last one.') },
  ],
  wrongText: L(
    "Qavs oldidagi minusni minus bir deb yozing va qavsni unga ko'paytiring. Qavs ichida nechta had bor va ularning nechtasi ishorasini almashtirishi kerak?",
    'Запиши минус перед скобкой как минус один и умножь на него скобку. Сколько слагаемых в скобке и сколько из них должны поменять знак?',
    'Write the minus in front of the bracket as minus one and multiply the bracket by it. How many terms are inside, and how many of them must change sign?'),
};

export default function D07_09(props) { return <AuditLines data={DATA} {...props} />; }
