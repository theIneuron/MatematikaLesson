// Dars15 · Amaliyot 02 — Ozod had · 🟢 · tag: no_constant_marked
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §3 (15-dars, 2-pozitsiya)
//
// T2 ning eng oddiy ko'rinishi: c ni O'QISH. Ozod had — chiziqsiz, harfsiz
// son; u yozuvda KO'RINMASA, nolga teng. Uchta belgilanadigan yozuvda ozod
// had umuman yo'q, uchtasida esa bor.
//
// OXIRGI KARTA IKKI ISH QILADI (oldingi blokdan, TIPLAR §6): `√5y² + 2y − 1`
// da ozod had minus bir, ya'ni karta belgilanmaydi; va bir vaqtda u bosh
// koeffitsiyent IRRATSIONAL son bo'lishi mumkinligini ko'rsatadi — 14-darsning
// ishi. Irratsional son ham son, va u nolga teng emas.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'no_constant_marked', level: '🟢',
  col: 168, itemSize: 16,
  items: [
    { id: 'i1', tokens: ['2y² − 7y = 0'], hit: true },
    { id: 'i2', tokens: ['y² − 9 = 0'] },
    { id: 'i3', tokens: ['y² + 5y = 0'], hit: true },
    { id: 'i4', tokens: ['4y² + y − 1 = 0'] },
    { id: 'i5', tokens: ['3y² = 0'], hit: true },
    { id: 'i6', tokens: [{ r: '5' }, 'y² + 2y − 1 = 0'] },
  ],
  eyebrow: L('Ozod had', 'Свободный член', 'Constant term'),
  setup: L(
    "Ozod had — yozuvdagi harfsiz son, ya'ni c. Agar u yozuvda umuman ko'rinmasa, ozod had nolga teng.",
    'Свободный член — это число в записи без буквы, то есть c. Если его в записи нет вовсе, свободный член равен нулю.',
    'The constant term is the number in the record with no letter, that is c. If it does not appear at all, the constant term is zero.'),
  ask: L(
    'Ozod hadi NOLGA teng 3 ta tenglamani belgilang.',
    'Отметь 3 уравнения, у которых свободный член равен нулю.',
    'Mark the 3 equations whose constant term is zero.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Uchtasida ham harfsiz son yo'q, demak c nolga teng. Qolgan uchtasida ozod had bor: minus to'qqiz, minus bir va minus bir. Oxirgisida bosh koeffitsiyent beshdan ildiz: irratsional, lekin u ham son va noldan farqli.",
    'Верно. У всех трёх нет числа без буквы, значит c равно нулю. У остальных трёх свободный член есть: минус девять, минус один и минус один. В последней старший коэффициент корень из пяти: иррациональное, но это число и не нуль.',
    'Correct. None of the three has a number without a letter, so c is zero. The other three do have a constant term: minus nine, minus one and minus one. In the last one the leading coefficient is the root of five: irrational, but a number all the same, and not zero.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('i2') !== -1, text: L(
      "Bu tenglamada harfsiz son BOR: minus to'qqiz. Ikkinchi koeffitsiyent yo'q, ya'ni b nolga teng, lekin savol c haqida edi. Y ni nolga teng qo'yib ko'ring: yozuvdan minus to'qqiz qoladi — ozod had aynan shu.",
      'В этом уравнении число без буквы ЕСТЬ: минус девять. Второго коэффициента нет, то есть b равно нулю, но вопрос был про c. Подставь y равным нулю: от записи останется минус девять — это и есть свободный член.',
      'This equation does have a number without a letter: minus nine. The second coefficient is missing, so b is zero, but the question was about c. Put y equal to zero: minus nine is what remains — that is the constant term.') },
    { when: (s) => s.extra.indexOf('i4') !== -1 || s.extra.indexOf('i6') !== -1, text: L(
      "Bu tenglamalarning oxirida minus bir turadi — bu ozod had, va u nolga teng emas. Tekshirish oson: y ni nolga teng qo'ying, harfli hadlarning hammasi yo'qoladi va faqat ozod had qoladi.",
      'В конце этих уравнений стоит минус один — это свободный член, и он не равен нулю. Проверить легко: подставь y равным нулю, все слагаемые с буквой исчезнут и останется только свободный член.',
      'These equations end with minus one — that is the constant term, and it is not zero. The check is easy: put y equal to zero, every term with a letter vanishes and only the constant term remains.') },
    { when: (s) => s.miss.indexOf('i5') !== -1, text: L(
      "Uch y kvadrat chetlab o'tildi. Bu yozuvda ikkinchi koeffitsiyent ham, ozod had ham yo'q: b nolga teng, c ham nolga teng. Savol faqat c haqida, va u nol — demak karta belgilanadi.",
      'Три y квадрат осталось в стороне. В этой записи нет ни второго коэффициента, ни свободного члена: b равно нулю и c равно нулю. Вопрос только про c, и он нуль — значит карточку надо отметить.',
      'Three y squared was left out. This record has neither a second coefficient nor a constant term: b is zero and c is zero. The question is only about c, and it is zero — so the card belongs.') },
    { when: (s) => s.marked.length !== 3, text: L(
      "Aynan uchta tenglama kerak. Har birida bitta ish qiling: y ni nolga teng qo'yib ko'ring. Nol chiqsa — ozod had nolga teng.",
      'Нужно ровно три уравнения. С каждым делай одно: подставь y равным нулю. Вышел нуль — свободный член равен нулю.',
      'Exactly three equations are needed. Do one thing with each: put y equal to zero. If zero comes out, the constant term is zero.'),
    },
  ],
  wrongText: L(
    "Har tenglamada harfsiz sonni izlang. U bo'lmasa — ozod had nolga teng. Tekshirish uchun y ni nolga teng qo'ying: qolgan son ozod haddir.",
    'В каждом уравнении ищи число без буквы. Его нет — свободный член равен нулю. Для проверки подставь y равным нулю: оставшееся число и есть свободный член.',
    'Look for the number without a letter in each equation. If there is none, the constant term is zero. To check, put y equal to zero: the number left over is the constant term.'),
};

export default function D15_02(props) { return <MarkAll data={DATA} {...props} />; }
