// Dars13 · Amaliyot 09 — Kiritish · 🔴 · tag: bring_in
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Skelet: DARS12_14_AMALIYOT_SKELET.md §4 (13-dars, 9-pozitsiya)
//
// TESKARI AMAL: koeffitsiyent ildiz ostiga KVADRATGA OSHIB kiradi.
// 03-topshiriqda bu bir marta ko'rilgan edi (4√2 = √32), bu yerda esa
// koeffitsiyent katta va ildiz osti to'liq kvadrat emas — yodlash yordam
// bermaydi, hisoblash kerak: beshning kvadrati yigirma besh, karra olti
// yuz ellik.
//
// Uchta xato javob uchta yo'l:
//   30  — koeffitsiyent kvadratga oshirilmadi, shunchaki ko'paytirildi;
//   900 — ildiz ostidagi son ham kvadratga oshirildi (25 · 36);
//   11  — qo'shildi.
// `TypeValue` faqat butun son oladi, javob esa butun — 150.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'bring_in', level: '🔴',
  target: 150, allowNeg: false,
  expr: ['5', { r: '6' }, '=', { r: 'n' }], exprSize: 30,
  eyebrow: L('Kiritish', 'Внесение', 'Bringing in'),
  setup: L(
    "Koeffitsiyent ildiz ostiga kiritiladi. Bu chiqarishning teskarisi: chiqishda son ildiz ostidan ildizi bilan chiqadi, kirishda esa kvadrati bilan kiradi.",
    'Коэффициент вносится под корень. Это обратное вынесению: при выходе число покидает корень своим корнем, при входе заходит своим квадратом.',
    'The coefficient is brought under the root. This is the reverse of taking out: on the way out a number leaves as its root, on the way in it enters as its square.'),
  label: L('n ning qiymati', 'значение n', 'the value of n'),
  ask: L("n nimaga teng?", 'Чему равно n?', 'What does n equal?'),
  correctText: L(
    "To'g'ri. Besh ildiz ostiga kirishi uchun kvadratga oshadi: beshning kvadrati yigirma besh. Yigirma besh karra olti yuz ellik, ya'ni besh oltidan ildiz bu yuz ellikdan ildiz. Tekshiring teskari tomondan: yuz ellik bu yigirma besh karra olti, yigirma beshdan ildiz besh — u ildiz ostidan chiqadi va besh oltidan ildiz qaytib keladi.",
    'Верно. Чтобы пять зашло под корень, оно возводится в квадрат: пять в квадрате двадцать пять. Двадцать пять на шесть сто пятьдесят, то есть пять корней из шести это корень из ста пятидесяти. Проверь в обратную сторону: сто пятьдесят это двадцать пять на шесть, корень из двадцати пяти пять — он выходит из-под корня, и пять корней из шести возвращается.',
    'Correct. For five to enter the root it is squared: five squared is twenty five. Twenty five times six is one hundred fifty, so five roots of six is the root of one hundred fifty. Check the other way: one hundred fifty is twenty five times six, the root of twenty five is five — it leaves the root and five roots of six comes back.'),
  wrongs: [
    { when: (s) => s.value === 30, text: L(
      "Bu besh karra olti, ya'ni koeffitsiyent kvadratga OSHIRILMADI. Tekshiring: o'ttizdan ildiz besh butun qirq beshga yaqin, besh oltidan ildiz esa besh karra ikki butun qirq besh, ya'ni o'n ikki butun ikkiga yaqin. Ikki son bir xil emas.",
      'Это пять на шесть, то есть коэффициент НЕ ВОЗВЕЛИ в квадрат. Проверь: корень из тридцати около пяти и сорока пяти, а пять корней из шести это пять на два и сорок пять, около двенадцати и двух. Это разные числа.',
      'That is five times six, so the coefficient was NOT squared. Check: the root of thirty is about five point four five, while five roots of six is five times two point four five, about twelve point two. Two different numbers.') },
    { when: (s) => s.value === 900, text: L(
      "Bu yigirma besh karra o'ttiz olti, ya'ni ildiz ostidagi son ham kvadratga oshirilgan. Kvadratga oshadigan narsa faqat KOEFFITSIYENT: ildiz osti allaqachon ildiz ostida turadi. Tekshiring: to'qqiz yuzdan ildiz o'ttiz, besh oltidan ildiz esa o'n ikki butun ikkiga yaqin.",
      'Это двадцать пять на тридцать шесть, то есть в квадрат возвели и подкоренное. В квадрат возводится только КОЭФФИЦИЕНТ: подкоренное уже стоит под корнем. Проверь: корень из девятисот тридцать, а пять корней из шести около двенадцати и двух.',
      'That is twenty five times thirty six, so the radicand was squared too. Only the COEFFICIENT is squared: the radicand already sits under the root. Check: the root of nine hundred is thirty, while five roots of six is about twelve point two.') },
    { when: (s) => s.value === 11, text: L(
      "Bu besh qo'shuv olti. Yozuvda esa qo'shish yo'q: besh oltidan ildizga KO'PAYTIRILGAN. Tekshiring: o'n birdan ildiz uch butunga yaqin, javob esa o'n ikki butundan katta bo'lishi kerak.",
      'Это пять плюс шесть. А в записи сложения нет: пять УМНОЖЕНО на корень из шести. Проверь: корень из одиннадцати около трёх, а ответ должен быть больше двенадцати.',
      'That is five plus six. But the record has no addition: five is MULTIPLIED by the root of six. Check: the root of eleven is about three, while the answer must exceed twelve.') },
    { when: (s) => s.value === 6 || s.value === 25, text: L(
      "Bu yozuvning bir bo'lagi, javobning o'zi emas. Kiritishda ikki narsa ko'paytiriladi: koeffitsiyentning kvadrati va ildiz ostidagi son. Yigirma besh karra olti yuz ellik.",
      'Это часть записи, а не сам ответ. При внесении перемножаются две вещи: квадрат коэффициента и подкоренное число. Двадцать пять на шесть сто пятьдесят.',
      'That is a piece of the record, not the answer. Bringing in multiplies two things: the coefficient squared and the radicand. Twenty five times six is one hundred fifty.') },
  ],
  wrongText: L(
    "Koeffitsiyentni kvadratga oshiring va ildiz ostidagi songa ko'paytiring. Javobni teskari tomondan tekshiring: n dan to'liq kvadratni chiqarsangiz besh oltidan ildiz qaytishi kerak.",
    'Возведи коэффициент в квадрат и умножь на подкоренное число. Проверь ответ в обратную сторону: вынеси из n полный квадрат — должно вернуться пять корней из шести.',
    'Square the coefficient and multiply by the radicand. Check backwards: take the perfect square out of n and five roots of six must come back.'),
};

export default function D13_09(props) { return <TypeValue data={DATA} {...props} />; }
