// Dars11 · Amaliyot 02 — Qiymat · 🟢 · tag: square_undo
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Skelet: DARS07_11_AMALIYOT_SKELET.md §9 (11-dars, 2-pozitsiya)
//
// Darsning birinchi xossasi: kvadratga oshirish ildizni YECHADI. O'n uch
// nomanfiy, shuning uchun xossa shu yerda to'liq ishlaydi va javob o'n uch.
// Xato javoblar:
//   169 — ildiz e'tiborga olinmadi, o'n uch kvadratga oshirildi;
//   26  — kvadrat ikkiga ko'paytirish deb olindi;
//   3   — ildiz «taxminan uch» deb yakunlandi (aniqlash kerak emas edi).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'square_undo', level: '🟢',
  target: 13, allowNeg: false,
  expr: ['(', { r: '13' }, ')²'], exprSize: 32,
  eyebrow: L('Qiymat', 'Значение', 'Value'),
  setup: L(
    "Ildiz kvadratga oshirilgan. O'n uch nomanfiy son, ya'ni ildiz osti shartni bajaradi.",
    'Корень возведён в квадрат. Тринадцать неотрицательное число, значит подкоренное условие выполняет.',
    'The root is squared. Thirteen is a non-negative number, so the radicand satisfies the condition.'),
  label: L('qiymati', 'значение', 'the value'),
  ask: L('Bu yozuv nimaga teng?', 'Чему равна эта запись?', 'What does this record equal?'),
  correctText: L(
    "To'g'ri. Ildizning ta'rifi shuni beradi: ildizning kvadrati ildiz ostidagi songa teng. Demak o'n uchdan ildizni kvadratga oshirsak, o'n uch qaytadi — ildizni hisoblash umuman kerak emas. Bu xossa faqat ildiz osti nomanfiy bo'lganda ishlaydi, o'n uch esa musbat.",
    'Верно. Это даёт само определение корня: квадрат корня равен подкоренному числу. Значит, возведя корень из тринадцати в квадрат, получаем тринадцать — считать корень вовсе не нужно. Свойство работает только при неотрицательном подкоренном, а тринадцать положительно.',
    'Correct. The definition of a root gives it: the square of a root equals the radicand. So squaring the root of thirteen returns thirteen — there is no need to compute the root at all. The property holds only when the radicand is non-negative, and thirteen is positive.'),
  wrongs: [
    { when: (s) => s.value === 169, text: L(
      "Ildiz e'tiborga olinmadi: o'n uchning o'zi kvadratga oshirildi. Yozuvda esa ildiz avval turadi, kvadrat esa uni yechadi. Yozuv o'n uchdan ildizning kvadrati.",
      'Корень не учтён: в квадрат возведено само тринадцать. А в записи корень стоит первым, и квадрат его снимает. Запись это квадрат корня из тринадцати.',
      'The root was ignored: thirteen itself was squared. But in the record the root comes first and the square undoes it. The record is the square of the root of thirteen.') },
    { when: (s) => s.value === 26, text: L(
      "Kvadratga oshirish ikkiga ko'paytirish emas: u sonni O'ZIGA ko'paytirish. Lekin bu yerda hisoblash umuman kerak emas — kvadrat ildizni yechadi va ildiz ostidagi son qaytadi.",
      'Возведение в квадрат это не умножение на два, а умножение числа НА СЕБЯ. Но здесь считать вовсе не надо: квадрат снимает корень и возвращается подкоренное.',
      'Squaring is not multiplying by two, it is multiplying a number BY ITSELF. But here no computing is needed at all: the square undoes the root and the radicand comes back.') },
    { when: (s) => s.value === 3 || s.value === 4, text: L(
      "Bu ildizning taxminiy qiymati, javob esa emas. O'n uchdan ildiz uch bilan to'rt orasida, lekin uni kvadratga oshirsak aynan o'n uch qaytadi. Taxminiy qiymatni kvadratga oshirib ko'ring: to'qqiz chiqadi, o'n uch emas.",
      'Это приблизительное значение корня, а не ответ. Корень из тринадцати между тремя и четырьмя, но при возведении в квадрат возвращается ровно тринадцать. Возведи приближение в квадрат: выйдет девять, а не тринадцать.',
      'That is an approximate value of the root, not the answer. The root of thirteen lies between three and four, but squaring it returns exactly thirteen. Square the approximation: nine comes out, not thirteen.') },
  ],
  wrongText: L(
    "Ildizning ta'rifini eslang: ildizning kvadrati ildiz ostidagi songa teng. Hisoblash kerak emas.",
    'Вспомни определение корня: квадрат корня равен подкоренному числу. Считать не нужно.',
    'Recall the definition of a root: the square of a root equals the radicand. No computing is needed.'),
};

export default function D11_02(props) { return <TypeValue data={DATA} {...props} />; }
