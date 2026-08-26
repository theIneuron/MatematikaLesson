// Dars23 · Amaliyot 02 — Qaysi katta · 🟢 · tag: which_greater
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §5 (23-dars, 2-pozitsiya)
//
// DARSNING O'Z SAHNASI (Dars23.jsx xuki): to'rt beshdan va uch to'rtdan.
// Ayirma bir yigirmadan, ya'ni musbat — birinchisi katta.
//
// Uch xato variant uch xil qarash:
//   3/4 — maxraji kichik, «demak kasr kattaroq» (З51 ning ko'rinishi);
//   teng — surat ham, maxraj ham bir birlik farq qiladi degan qarash;
//   aniqlab bo'lmaydi — darsning butun mag'zini rad etish: ayirma orqali
//   HAR DOIM aniqlanadi.
// Variantlar aralashtiriladi (Choice ichida), razbor shartlari ASL raqamda.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'which_greater', level: '🟢',
  correct: 0, optCols: 2, optSize: 20,
  expr: [{ n: '4', d: '5' }, 'va', { n: '3', d: '4' }], exprSize: 28,
  eyebrow: L('Qaysi katta', 'Что больше', 'Which is greater'),
  setup: L(
    "Ikki kasr berilgan. Ularni taqqoslash uchun ayirmani hisoblash kerak: ayirma musbat chiqsa birinchisi katta, manfiy chiqsa ikkinchisi.",
    'Даны две дроби. Чтобы сравнить их, надо вычислить разность: выйдет положительная — больше первая, отрицательная — вторая.',
    'Two fractions are given. To compare them, compute the difference: if it comes out positive the first is greater, if negative the second.'),
  ask: L(
    'Qaysi kasr katta?',
    'Какая дробь больше?',
    'Which fraction is greater?'),
  opts: [
    { label: [{ n: '4', d: '5' }] },
    { label: [{ n: '3', d: '4' }] },
    { label: L('ular teng', 'они равны', 'they are equal') },
    { label: L("aniqlab bo'lmaydi", 'определить нельзя', 'it cannot be determined') },
  ],
  correctText: L(
    "To'g'ri. Umumiy maxraj yigirma: o'n olti yigirmadan minus o'n besh yigirmadan bir yigirmadan — musbat, demak birinchi kasr katta. Surat yoki maxrajga alohida qarab xulosa chiqarib bo'lmaydi: bir uchdan bir to'rtdandan katta, garchi maxraji kichik bo'lsa ham.",
    'Верно. Общий знаменатель двадцать: шестнадцать двадцатых минус пятнадцать двадцатых это одна двадцатая — положительна, значит первая дробь больше. По числителю или знаменателю отдельно вывод не сделать: одна третья больше одной четвёртой, хотя знаменатель меньше.',
    'Correct. The common denominator is twenty: sixteen twentieths minus fifteen twentieths is one twentieth — positive, so the first fraction is greater. Neither numerator nor denominator alone decides: one third exceeds one quarter although its denominator is smaller.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
        "Maxraji kichik kasr har doim katta emas: bu qoida faqat SURATLAR TENG bo'lganda ishlaydi. Bu yerda suratlar boshqa — to'rt va uch. Ayirmani hisoblang: o'n olti yigirmadan minus o'n besh yigirmadan, bir yigirmadan — musbat.",
        'Дробь с меньшим знаменателем не всегда больше: это правило работает только при РАВНЫХ ЧИСЛИТЕЛЯХ. Здесь числители разные — четыре и три. Посчитай разность: шестнадцать двадцатых минус пятнадцать двадцатых, одна двадцатая — положительна.',
        'A fraction with a smaller denominator is not always greater: that rule works only when the NUMERATORS ARE EQUAL. Here they differ — four and three. Compute the difference: sixteen twentieths minus fifteen twentieths is one twentieth — positive.') },
    { when: (s) => s.picked === 2, text: L(
      "Kasrlar teng emas. Surat ham, maxraj ham bir birlik bilan farq qiladi, lekin bu tenglikni bermaydi: kasrning qiymatini surat bilan maxrajning NISBATI hal qiladi, ularning ayirmasi emas. Umumiy maxrajga keltiring: o'n olti yigirmadan va o'n besh yigirmadan — bitta bo'linma farq bor.",
      'Дроби не равны. И числитель, и знаменатель отличаются на единицу, но равенства это не даёт: значение дроби решает ОТНОШЕНИЕ числителя к знаменателю, а не их разность. Приведи к общему знаменателю: шестнадцать двадцатых и пятнадцать двадцатых — разница в одну долю.',
      'The fractions are not equal. Both the numerator and the denominator differ by one, but that does not make them equal: the value of a fraction is decided by the RATIO of numerator to denominator, not by their difference. Bring them to a common denominator: sixteen twentieths and fifteen twentieths — one part apart.') },
    { when: (s) => s.picked === 3, text: L(
      "Aniqlash mumkin, va aynan shu darsning ishi. Ikki sonni taqqoslash uchun ularning ayirmasini hisoblash kifoya: musbat chiqsa birinchisi katta, manfiy chiqsa ikkinchisi, nol chiqsa esa teng. Bu yerda ayirma bir yigirmadan.",
      'Определить можно, и это как раз работа урока. Чтобы сравнить два числа, достаточно вычислить их разность: положительна — больше первое, отрицательна — второе, нуль — равны. Здесь разность одна двадцатая.',
      'It can be determined, and that is exactly the work of this lesson. To compare two numbers it is enough to compute their difference: positive means the first is greater, negative the second, zero means equal. Here the difference is one twentieth.') },
  ],
  wrongText: L(
    "Ayirmani hisoblang: umumiy maxrajga keltiring va ishorasiga qarang. Surat yoki maxrajga alohida qarab xulosa chiqarib bo'lmaydi.",
    'Посчитай разность: приведи к общему знаменателю и посмотри на знак. По числителю или знаменателю по отдельности вывод не сделать.',
    'Compute the difference: bring the fractions to a common denominator and look at the sign. The numerator or the denominator alone decides nothing.'),
};

export default function D23_02(props) { return <Choice data={DATA} {...props} />; }
