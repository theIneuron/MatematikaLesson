// Dars11 · Amaliyot 09 — Guruhlar · 🔴 · tag: always_or_sometimes
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Skelet: DARS07_11_AMALIYOT_SKELET.md §9 (11-dars, 9-pozitsiya)
//
// Sakkiz tenglik ikki guruhga bo'linadi: har qanday g da to'g'ri va faqat
// ba'zi g da to'g'ri. Ikkinchi guruhning to'rttasi to'rt xil sababdan
// cheklangan:
//   √(g²) = g      faqat g nomanfiy bo'lganda (З31);
//   (√g)² = g      chap tomon faqat g nomanfiy bo'lganda mavjud;
//   √(g²+9) = g+3  faqat g nolda (З4);
//   √(g²) = −g     faqat g nomusbat bo'lganda — «minus, demak yolg'on»
//                  degan tez xulosa aynan shu yerda yiqiladi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'always_or_sometimes', level: '🔴',
  zoneLbl: 104, itemSize: 16,
  zones: [
    { id: 'always', label: L('har qanday g da', 'при любом g', 'for every g') },
    { id: 'some', label: L("faqat ba'zi g da", 'только при некоторых g', 'only for some g') },
  ],
  items: [
    { id: 'i1', tokens: [{ r: 'g²' }, '= |g|'], zone: 'always' },
    { id: 'i2', tokens: [{ r: 'g⁴' }, '= g²'], zone: 'always' },
    { id: 'i3', tokens: [{ r: '36g²' }, '= 6|g|'], zone: 'always' },
    { id: 'i4', tokens: [{ r: '(g − 4)²' }, '= |g − 4|'], zone: 'always' },
    { id: 'i5', tokens: [{ r: 'g²' }, '= g'], zone: 'some' },
    { id: 'i6', tokens: ['(', { r: 'g' }, ')² = g'], zone: 'some' },
    { id: 'i7', tokens: [{ r: 'g² + 9' }, '= g + 3'], zone: 'some' },
    { id: 'i8', tokens: [{ r: 'g²' }, '= −g'], zone: 'some' },
  ],
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Sakkiz tenglik. Ba'zilari g ning har qanday qiymatida to'g'ri, ba'zilari esa faqat ayrim qiymatlarda — hatto bittasida.",
    'Восемь равенств. Одни верны при любом значении g, другие только при некоторых — иногда даже при одном.',
    'Eight equalities. Some hold for every value of g, others only for some — sometimes for just one.'),
  ask: L('Tenglikni bosing, keyin uning guruhini bosing.', 'Нажми равенство, потом его группу.', 'Tap an equality, then tap its group.'),
  bank: L('Tengliklar', 'Равенства', 'Equalities'),
  correctText: L(
    "To'g'ri. Birinchi guruhda o'ng tomonda modul yoki kvadrat turadi, ya'ni natija hech qachon manfiy bo'lmaydi — g ni minus beshga ham, beshga ham qo'yib tekshirish mumkin. Ikkinchi guruhda esa har biri o'z chegarasiga ega: birinchisi g nomanfiy bo'lganda, ikkinchisining chap tomoni manfiy g da umuman yo'q, uchinchisi faqat g nolda (uchdan uchga teng), to'rtinchisi esa g nomusbat bo'lganda — minus g o'sha yerda musbat bo'ladi.",
    'Верно. В первой группе справа стоит модуль или квадрат, то есть результат никогда не отрицателен — можно проверить и при минус пяти, и при пяти. А во второй у каждого своя граница: первое при неотрицательном g, у второго левая часть при отрицательном g вовсе не существует, третье только при g равном нулю (три равно трём), а четвёртое при неположительном g — там минус g как раз положительно.',
    'Correct. In the first group the right side holds a modulus or a square, so the result is never negative — it can be checked at minus five and at five alike. In the second group each has its own limit: the first for non-negative g, the second has no left side at all for negative g, the third only at g equal to zero (three equals three), and the fourth for non-positive g — there minus g is the positive one.'),
  wrongs: [
    { when: (s) => s.place.i8 === 'always', text: L(
      "Bu tenglik minus bilan yozilgan, lekin yolg'on emas. g ni minus to'rtga qo'ying: kvadrati o'n olti, ildizi to'rt, minus g ham to'rt — tenglik bajarildi. Beshni qo'ying: ildiz besh, minus g esa minus besh — bajarilmaydi. Ya'ni faqat ba'zi qiymatlarda.",
      'Это равенство записано с минусом, но оно не ложно. Подставь g равное минус четырём: квадрат шестнадцать, корень четыре, минус g тоже четыре — равенство выполнено. Подставь пять: корень пять, а минус g минус пять — не выполнено. Значит только при некоторых значениях.',
      'This equality is written with a minus, yet it is not false. Put g equal to minus four: the square is sixteen, the root is four, and minus g is four too — it holds. Put five: the root is five while minus g is minus five — it fails. So only for some values.') },
    { when: (s) => s.place.i7 === 'always', text: L(
      "Ildiz hadlarga bo'linmaydi. g ni to'rtga qo'ying: chap tomonda o'n olti qo'shuv to'qqiz yigirma besh, ildizi besh; o'ng tomonda esa yetti. Nolda esa ikkalasi ham uchga teng — shuning uchun tenglik faqat bitta qiymatda ishlaydi.",
      'Корень не раздаётся по слагаемым. Подставь g равное четырём: слева шестнадцать плюс девять двадцать пять, корень пять; справа семь. А при нуле обе части равны трём — поэтому равенство работает лишь при одном значении.',
      'A root does not distribute over terms. Put g equal to four: on the left sixteen plus nine is twenty five and the root is five; on the right it is seven. At zero both sides are three — so the equality works at a single value only.') },
    { when: (s) => s.place.i5 === 'always' || s.place.i6 === 'always', text: L(
      "Ikkalasini MANFIY qiymatda tekshiring. Birinchisida g ni minus uchga qo'ysangiz chap tomon uch, o'ng tomon minus uch. Ikkinchisida esa chap tomonning o'zi yo'q: manfiy sondan ildiz olinmaydi.",
      'Проверь оба при ОТРИЦАТЕЛЬНОМ значении. В первом при g равном минус трём слева три, справа минус три. А во втором левой части просто нет: из отрицательного корень не извлекается.',
      'Check both at a NEGATIVE value. In the first, at g equal to minus three the left side is three and the right is minus three. In the second the left side does not exist at all: a root cannot be taken of a negative number.') },
    { when: (s) => s.place.i3 === 'some' || s.place.i4 === 'some' || s.place.i2 === 'some', text: L(
      "Bu tengliklarda o'ng tomonda modul yoki kvadrat turadi, ya'ni ular manfiy bo'lmaydi. g ni minus beshga qo'yib ikki tomonni sanang — bir xil chiqadi.",
      'В этих равенствах справа стоит модуль или квадрат, то есть они не бывают отрицательными. Подставь g равное минус пяти и посчитай обе части — выйдет одинаково.',
      'In these equalities the right side holds a modulus or a square, so they are never negative. Put g equal to minus five and compute both sides — they come out the same.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har tenglikni ikki qiymatda tekshiring: minus to'rt va to'rt. Ikkalasida ham bajarilsa — birinchi guruh; bittasida buzilsa — ikkinchisi.",
      'Проверяй каждое равенство при двух значениях: минус четыре и четыре. Выполнено в обоих — первая группа, нарушено в одном — вторая.',
      'Test every equality at two values: minus four and four. Holding at both means the first group; failing at one means the second.') },
  ],
  wrongText: L(
    "Har tenglikni minus to'rtda va to'rtda tekshiring. Manfiy qiymat aynan shu joyda hamma farqni ko'rsatadi.",
    'Проверяй каждое равенство при минус четырёх и при четырёх. Отрицательное значение и показывает всю разницу.',
    'Test every equality at minus four and at four. The negative value is what shows the whole difference.'),
};

export default function D11_09(props) { return <Zones data={DATA} {...props} />; }
