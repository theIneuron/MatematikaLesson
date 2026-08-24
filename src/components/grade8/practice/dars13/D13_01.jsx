// Dars13 · Amaliyot 01 — Qisqaroq · 🟢 · tag: take_out
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Skelet: DARS12_14_AMALIYOT_SKELET.md §4 (13-dars, 1-pozitsiya)
//
// Darsning birinchi ishi: ildiz ostidan to'liq kvadratni CHIQARISH.
// Uch xato variant uch xil yo'l, va ularning hammasi bitta amal bilan
// rad etiladi — KVADRATGA OSHIRISH (darsning uchinchi tasdig'i, T3):
//   2√5   -> 4 · 5 = 20;
//   25√2  -> 625 · 2 = 1250;
//   5√10  -> 25 · 10 = 250.
// Faqat 5√2 da 25 · 2 = 50 chiqadi. Ya'ni tekshirish yo'li o'quvchida
// birinchi topshiriqdan boshlab qo'lida bo'ladi.
// Variantlar aralashtiriladi (Choice ichida), razbor shartlari esa ASL
// raqamda qoladi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'take_out', level: '🟢',
  correct: 0, optCols: 2, optSize: 22,
  expr: [{ r: '50' }], exprSize: 34,
  eyebrow: L('Qisqaroq', 'Короче', 'Shorter'),
  setup: L(
    "Ellik to'liq kvadrat emas, lekin uning ichida to'liq kvadrat bor: ellik bu yigirma besh karra ikki. O'sha kvadratni ildiz ostidan chiqarish mumkin.",
    'Пятьдесят не полный квадрат, но внутри него полный квадрат есть: пятьдесят это двадцать пять на два. Этот квадрат можно вынести из-под корня.',
    'Fifty is not a perfect square, but a perfect square sits inside it: fifty is twenty five times two. That square can be taken out from under the root.'),
  ask: L('Bu yozuv nimaga teng?', 'Чему равна эта запись?', 'What does this record equal?'),
  opts: [
    { label: ['5', { r: '2' }] },
    { label: ['2', { r: '5' }] },
    { label: ['25', { r: '2' }] },
    { label: ['5', { r: '10' }] },
  ],
  correctText: L(
    "To'g'ri. Ellik bu yigirma besh karra ikki, yigirma beshdan ildiz besh, va u ildiz ostidan chiqib ketadi: besh karra ikkidan ildiz. Tekshiring — javobni kvadratga oshirish kerak: beshning kvadrati yigirma besh, ikkidan ildizning kvadrati ikki, yigirma besh karra ikki ellik. Ildiz ostidagi son qaytib keldi, demak o'zgartirish to'g'ri.",
    'Верно. Пятьдесят это двадцать пять на два, корень из двадцати пяти пять, и он выходит из-под корня: пять на корень из двух. Проверь — надо возвести ответ в квадрат: пять в квадрате двадцать пять, корень из двух в квадрате два, двадцать пять на два пятьдесят. Подкоренное число вернулось, значит преобразование верное.',
    'Correct. Fifty is twenty five times two, the root of twenty five is five, and it steps out from under the root: five times the root of two. Check by squaring the answer: five squared is twenty five, the root of two squared is two, twenty five times two is fifty. The radicand came back, so the transformation is right.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Ko'paytuvchilar o'rin almashdi: ildiz ostidan chiqadigan son yigirma beshning ildizi, ya'ni besh, ildiz ostida esa ikki qoladi. Kvadratga oshirib tekshiring: ikkining kvadrati to'rt, beshdan ildizning kvadrati besh, to'rt karra besh yigirma. Yigirma ellikka teng emas.",
      'Множители поменялись местами: из-под корня выходит корень из двадцати пяти, то есть пять, а под корнем остаётся два. Проверь возведением в квадрат: два в квадрате четыре, корень из пяти в квадрате пять, четыре на пять двадцать. Двадцать не равно пятидесяти.',
      'The factors swapped places: what leaves the root is the root of twenty five, that is five, and two stays under the root. Check by squaring: two squared is four, the root of five squared is five, four times five is twenty. Twenty is not fifty.') },
    { when: (s) => s.picked === 2, text: L(
      "Yigirma besh ildiz ostidan ildiz OLINMASDAN chiqib ketdi. Chiqadigan narsa sonning o'zi emas, uning ildizi: yigirma beshdan ildiz besh. Kvadratga oshirib tekshiring: yigirma beshning kvadrati olti yuz yigirma besh, karra ikki bir ming ikki yuz ellik. Ellikdan yigirma besh barobar katta.",
      'Двадцать пять вышло из-под корня, но корень из него НЕ ВЗЯЛИ. Выходит не само число, а его корень: корень из двадцати пяти пять. Проверь возведением в квадрат: двадцать пять в квадрате шестьсот двадцать пять, на два тысяча двести пятьдесят. Это в двадцать пять раз больше пятидесяти.',
      'Twenty five left the root without its root being taken. What leaves is not the number itself but its root: the root of twenty five is five. Check by squaring: twenty five squared is six hundred twenty five, times two is one thousand two hundred fifty. That is twenty five times bigger than fifty.') },
    { when: (s) => s.picked === 3, text: L(
      "Ildiz ostida o'n qoldi, lekin ellikni yigirma besh karra IKKI deb ajratgan edik, o'n karra emas. Kvadratga oshirib tekshiring: beshning kvadrati yigirma besh, karra o'n ikki yuz ellik. Bu ellikdan besh barobar katta.",
      'Под корнем осталось десять, но пятьдесят мы разложили как двадцать пять на ДВА, а не на десять. Проверь возведением в квадрат: пять в квадрате двадцать пять, на десять двести пятьдесят. Это в пять раз больше пятидесяти.',
      'Ten stayed under the root, but we split fifty as twenty five times TWO, not times ten. Check by squaring: five squared is twenty five, times ten is two hundred fifty. That is five times bigger than fifty.') },
  ],
  wrongText: L(
    "Har variantni kvadratga oshiring: koeffitsiyentning kvadrati karra ildiz ostidagi son. Ellik chiqqan variant to'g'ri.",
    'Возведи каждый вариант в квадрат: квадрат коэффициента на подкоренное число. Верен тот, где вышло пятьдесят.',
    'Square each option: the coefficient squared times the radicand. The one that gives fifty is right.'),
};

export default function D13_01(props) { return <Choice data={DATA} {...props} />; }
