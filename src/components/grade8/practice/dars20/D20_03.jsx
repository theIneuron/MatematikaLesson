// Dars20 · Amaliyot 03 — Ruxsat · 🟢 · tag: allowed_marked
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §8 (20-dars, 3-pozitsiya)
//
// BITTA QIYMAT — UCHTA TEKSHIRUV. y teng uch qo'yiladi va maxraj nolga
// aylanadimi degan savol beriladi. Uch xato karta uch xil ko'rinishda nolga
// aylanadi:
//   y − 3     — to'g'ridan-to'g'ri;
//   y² − 9    — kvadratlar ayirmasi (uchda ham, minus uchda ham);
//   2y − 6    — qavsdan ikki chiqadi: ikki karra y minus uch.
// Belgilanadigan uchtasida esa uchda maxraj noldan farqli: minus to'rt, besh,
// va o'n (y kvadrat qo'shuv bir hech qachon nolga aylanmaydi).
// 10-topshiriqdan farqi: bu yerda maxrajlar OCHIQ, u yerda esa ajratish kerak.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'allowed_marked', level: '🟢',
  col: 150, itemSize: 17,
  items: [
    { id: 'i1', tokens: [{ n: '5', d: 'y − 7' }], hit: true },
    { id: 'i2', tokens: [{ n: '4', d: 'y − 3' }] },
    { id: 'i3', tokens: [{ n: '3', d: 'y + 2' }], hit: true },
    { id: 'i4', tokens: [{ n: '1', d: 'y² − 9' }] },
    { id: 'i5', tokens: [{ n: 'y', d: 'y² + 1' }], hit: true },
    { id: 'i6', tokens: [{ n: '6', d: '2y − 6' }] },
  ],
  eyebrow: L('Ruxsat', 'Разрешено', 'Allowed'),
  setup: L(
    "Oltita kasr, va hammasida bitta qiymat tekshiriladi: y teng uch. Uchtasida bu qiymat ruxsat etilgan, uchtasida esa maxrajni nolga aylantiradi.",
    'Шесть дробей, и во всех проверяется одно значение: y равно трём. В трёх оно допустимо, а в трёх обращает знаменатель в нуль.',
    'Six fractions, and one value is tested in all of them: y equals three. In three it is admissible, in three it makes the denominator zero.'),
  ask: L(
    'y = 3 RUXSAT etilgan 3 ta kasrni belgilang.',
    'Отметь 3 дроби, где y = 3 ДОПУСТИМО.',
    'Mark the 3 fractions where y = 3 is ALLOWED.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Uchni qo'yamiz: uch minus yetti minus to'rt, uch qo'shuv ikki besh, to'qqiz qo'shuv bir o'n — hammasi noldan farqli, demak uch ruxsat etilgan.",
    'Верно. Подставляем три: три минус семь минус четыре, три плюс два пять, девять плюс один десять — всё не нуль, значит три допустимо.',
    'Correct. Substitute three: three minus seven is minus four, three plus two is five, nine plus one is ten — all non-zero, so three is allowed.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('i4') !== -1, text: L(
      "Bu kasrda maxraj KVADRATLAR AYIRMASI: y kvadrat minus to'qqiz bu y minus uch karra y qo'shuv uch. Uchni qo'ysangiz to'qqiz minus to'qqiz nol chiqadi. Bunday maxrajda taqiq IKKITA: uch va minus uch.",
      'В этой дроби знаменатель — РАЗНОСТЬ КВАДРАТОВ: y квадрат минус девять это y минус три на y плюс три. Подставь три — выйдет девять минус девять, то есть нуль. У такого знаменателя ДВА запрета: три и минус три.',
      'In this fraction the denominator is a DIFFERENCE OF SQUARES: y squared minus nine is y minus three times y plus three. Substitute three and nine minus nine is zero. Such a denominator has TWO bans: three and minus three.') },
    { when: (s) => s.extra.indexOf('i6') !== -1, text: L(
      "Bu kasrda maxraj uchga o'xshamaydi, lekin ikkini qavsdan chiqarsangiz ko'rinadi: ikki y minus olti bu ikki karra y minus uch. Uchni qo'ying: ikki karra uch minus olti nol. Koeffitsiyent taqiqni siljitmaydi.",
      'В этой дроби знаменатель не похож на тройку, но вынеси двойку и станет видно: два y минус шесть это два на скобку y минус три. Подставь три: два на три минус шесть нуль. Коэффициент запрет не сдвигает.',
      'In this fraction the denominator does not look like a three, but factor out the two and it shows: two y minus six is two times the bracket y minus three. Substitute three: two times three minus six is zero. A coefficient does not move the ban.') },
    { when: (s) => s.extra.indexOf('i2') !== -1, text: L(
      "Bu eng ochiq holat: maxraj y minus uch, va uchda u nolga aylanadi. Uchni qo'ying: uch minus uch nol, to'rt bo'lingan nol degan amal esa yo'q.",
      'Это самый явный случай: знаменатель y минус три, и в трёх он обращается в нуль. Подставь три: три минус три нуль, а действия четыре делить на нуль не существует.',
      'This is the most obvious case: the denominator is y minus three and it vanishes at three. Substitute three: three minus three is zero, and four over zero is not an operation.') },
    { when: (s) => s.miss.indexOf('i5') !== -1, text: L(
      "Bu kasr chetlab o'tildi, lekin uning maxraji HECH QACHON nolga aylanmaydi: y kvadrat nomanfiy, unga bir qo'shilsa hech bo'lmasa bir chiqadi. Uchda o'n. Demak bu kasrda taqiq umuman yo'q.",
      'Эта дробь осталась в стороне, а её знаменатель НИКОГДА не обращается в нуль: y квадрат неотрицателен, прибавь единицу — выйдет не меньше единицы. В трёх десять. Значит запретов у этой дроби нет вовсе.',
      'This fraction was left out, yet its denominator NEVER vanishes: y squared is non-negative, and adding one keeps it at least one. At three it is ten. So this fraction has no bans at all.') },
    { when: (s) => s.marked.length !== 3, text: L(
      "Aynan uchta kasr kerak. Har birida bir xil ish qiling: uchni maxrajga qo'yib hisoblang. Nol chiqsa — taqiqlangan.",
      'Нужно ровно три дроби. С каждой делай одно: подставь три в знаменатель и посчитай. Вышел нуль — запрещено.',
      'Exactly three fractions are needed. Do one thing with each: substitute three into the denominator and compute. Zero means banned.') },
  ],
  wrongText: L(
    "Uchni har maxrajga qo'yib hisoblang. Nol chiqsa qiymat taqiqlangan. Ko'paytuvchi qavsdan chiqadigan maxrajni ham tekshiring.",
    'Подставь три в каждый знаменатель и посчитай. Вышел нуль — значение запрещено. Проверь и те знаменатели, где выносится множитель.',
    'Substitute three into every denominator and compute. Zero means the value is banned. Check the denominators with a factor to take out as well.'),
};

export default function D20_03(props) { return <MarkAll data={DATA} {...props} />; }
