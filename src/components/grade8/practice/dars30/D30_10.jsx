// Dars30 · Amaliyot 10 — Nisbiy xatolik · 🔴 · tag: relative_percent
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §12 (30-dars, 10-pozitsiya)
//
// T3 OXIRIGACHA: nisbat topiladi VA foizga aylantiriladi. Nol butun besh
// bo'lingan yigirma besh nol butun nol ikki, ya'ni ikki foiz.
//
// Uch xato yo'l:
//   5  — nol butun beshni to'g'ridan-to'g'ri besh foiz deb o'qish;
//   50 — nisbatni teskari olish (yigirma besh bo'lingan nol butun besh);
//   25 — taqribiy qiymatning o'zini javob deb yozish.
// Javob FOIZDA so'raladi, ya'ni oxirgi qadam ham talab qilinadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'relative_percent', level: '🔴',
  target: 2, allowNeg: false,
  expr: ['a = 25', ';', '|x − a| = 0,5'], exprSize: 24,
  eyebrow: L('Nisbiy xatolik', 'Относительная', 'Relative error'),
  setup: L(
    "Taqribiy qiymat 25 ga teng, absolut xatolik esa 0,5. Nisbiy xatolik — absolut xatolikning taqribiy qiymat moduliga nisbati, va u foizda so'raladi.",
    'Приближённое значение равно 25, а абсолютная погрешность 0,5. Относительная погрешность — это отношение абсолютной к модулю приближённого значения, и спрашивают её в процентах.',
    'The approximation is 25 and the absolute error is 0,5. The relative error is the ratio of the absolute error to the absolute value of the approximation, and it is asked for as a percentage.'),
  label: L('Nisbiy xatolik, foizda', 'Относительная погрешность, %', 'The relative error, in percent'),
  ask: L('Nisbiy xatolik necha foiz?', 'Сколько процентов составляет относительная погрешность?', 'What percentage is the relative error?'),
  correctText: L(
    "To'g'ri. Nol butun beshni yigirma beshga bo'lamiz: nol butun nol ikki, ya'ni ikki foiz. Ma'nosini tekshiring: yigirma beshning ikki foizi yarimga teng. Bu son o'lchov qanchalik puxta bajarilganini aytadi.",
    'Верно. Делим ноль целых пять на двадцать пять: ноль целых ноль два, то есть два процента. Проверь по смыслу: два процента от двадцати пяти это половина. Это число говорит, насколько тщательно выполнено измерение.',
    'Correct. Divide zero point five by twenty five: zero point zero two, that is two percent. Check the meaning: two percent of twenty five is a half. This number tells how carefully the measurement was made.'),
  wrongs: [
    { when: (s) => s.value === 5, text: L(
      "Nol butun besh — bu ABSOLUT xatolik, foiz emas. Foizga aylantirish uchun avval NISBATNI hisoblash kerak: nol butun beshni yigirma beshga bo'lish, undan keyingina yuzga ko'paytirish. Aks holda javob taqribiy qiymatga umuman bog'liq bo'lmay qoladi — holbuki nisbiy xatolikning butun ma'nosi shu bog'liqlikda.",
      'Ноль целых пять — это АБСОЛЮТНАЯ погрешность, а не проценты. Чтобы перевести в проценты, сначала надо вычислить ОТНОШЕНИЕ: разделить ноль целых пять на двадцать пять, и только потом умножить на сто. Иначе ответ вовсе не будет зависеть от приближённого значения — а весь смысл относительной погрешности именно в этой зависимости.',
      'Zero point five is the ABSOLUTE error, not a percentage. To make it a percentage the RATIO must be computed first: divide zero point five by twenty five, and only then multiply by one hundred. Otherwise the answer would not depend on the approximation at all — while the whole point of the relative error is exactly that dependence.') },
    { when: (s) => s.value === 50, text: L(
      "Nisbat TESKARI olingan: yigirma besh nol butun beshga bo'lingan. Ta'rifda esa absolut xatolik SURATDA turadi, taqribiy qiymat esa maxrajda. Ma'nosini o'ylang: nisbiy xatolik xatolikning kattalikka nisbatan qanday ULUSHINI bildiradi, ulush esa birdan kichik chiqishi kerak — ellik esa ancha katta.",
      'Отношение взято НАОБОРОТ: двадцать пять разделено на ноль целых пять. А в определении абсолютная погрешность стоит в ЧИСЛИТЕЛЕ, приближённое значение в знаменателе. Подумай о смысле: относительная погрешность показывает, какую ДОЛЮ величины составляет ошибка, а доля должна выйти меньше единицы — пятьдесят же намного больше.',
      'The ratio was taken the WRONG WAY ROUND: twenty five divided by zero point five. In the definition the absolute error stands in the NUMERATOR and the approximation in the denominator. Think about the meaning: the relative error shows what SHARE of the quantity the error makes, and a share must come out below one — fifty is far larger.') },
    { when: (s) => s.value === 25 || s.value === 20, text: L(
      "Bu son yozuvdan ko'chirib olingan, hisoblanmagan. Yigirma besh — bu taqribiy qiymatning o'zi, ya'ni O'LCHANGAN kattalik. Nisbiy xatolikni topish uchun xatolikni shu kattalikka bo'lish kerak: nol butun besh bo'lingan yigirma besh nol butun nol ikki, ya'ni ikki foiz.",
      'Это число переписано из условия, а не вычислено. Двадцать пять — это само приближённое значение, то есть ИЗМЕРЕННАЯ величина. Чтобы найти относительную погрешность, надо разделить на неё погрешность: ноль целых пять делить на двадцать пять это ноль целых ноль два, то есть два процента.',
      'That number was copied from the record, not computed. Twenty five is the approximation itself, the MEASURED quantity. To find the relative error the error must be divided by it: zero point five over twenty five is zero point zero two, that is two percent.') },
  ],
  wrongText: L(
    "Absolut xatolikni taqribiy qiymatga bo'ling, keyin natijani yuzga ko'paytirib foizga aylantiring. Bo'lish suratda XATOLIK turgan holda bajariladi.",
    'Раздели абсолютную погрешность на приближённое значение, потом умножь результат на сто и переведи в проценты. В числителе при делении стоит ПОГРЕШНОСТЬ.',
    'Divide the absolute error by the approximation, then multiply the result by one hundred to get a percentage. In the division the ERROR stands in the numerator.'),
};

export default function D30_10(props) { return <TypeValue data={DATA} {...props} />; }
