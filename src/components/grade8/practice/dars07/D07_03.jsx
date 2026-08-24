// Dars07 · Amaliyot 03 — Guruhlar · 🟢 · tag: which_quadrants · CHIZMALI
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Skelet: DARS07_11_AMALIYOT_SKELET.md §5 (7-dars, 3-pozitsiya), §4a
//
// GURUH SARLAVHASI — CHIZMA (metodist qarori 2026-08-24). Zonaning nomi
// «birinchi va uchinchi chorak» degan SO'Z emas: yuqorida ikki chizma turadi,
// birida tarmoqlar o'ngda-yuqorida va chapda-pastda, ikkinchisida teskari.
// O'quvchi formulani o'qib, uni CHIZMAGA yuboradi.
//
// Sakkiz kartadan ikkitasida ishora YASHIRIN: 4/(−x) da minus chiziq tagida,
// −(−3)/x da esa ikki minus. Aynan shu ikkitasi З28 ni tutadi.
// Zona sarlavhasining keni telefonda 74px (kit.jsx, Zones), shuning uchun
// chizma 70x52: kattaroq bo'lsa sarlavha ustunidan chiqib ketadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const FIG = { w: 70, h: 52, grid: false };

const DATA = {
  tag: 'which_quadrants', level: '🟢',
  zoneLbl: 74, zoneSize: 16, itemSize: 17,
  zones: [
    { id: 'z1', tokens: [{ fig: 'hyp', k: 6, ...FIG }] },
    { id: 'z2', tokens: [{ fig: 'hyp', k: -6, ...FIG }] },
  ],
  items: [
    { id: 'i1', tokens: [{ n: '6', d: 'x' }], zone: 'z1' },
    { id: 'i2', tokens: [{ n: '15', d: 'x' }], zone: 'z1' },
    { id: 'i3', tokens: [{ n: '4', d: '−x' }], zone: 'z2' },
    { id: 'i4', tokens: [{ n: '−9', d: 'x' }], zone: 'z2' },
    { id: 'i5', tokens: [{ n: '−1', d: 'x' }], zone: 'z2' },
    { id: 'i6', tokens: [{ n: '20', d: 'x' }], zone: 'z1' },
    { id: 'i7', tokens: [{ n: '−(−3)', d: 'x' }], zone: 'z1' },
    { id: 'i8', tokens: [{ n: '−12', d: 'x' }], zone: 'z2' },
  ],
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Yuqorida ikki chizma turadi: birida tarmoqlar birinchi va uchinchi chorakda, ikkinchisida ikkinchi va to'rtinchida. Pastdagi sakkiz formulaning har biri shu chizmalardan biriga tegishli.",
    'Сверху два чертежа: на одном ветви в первой и третьей четверти, на другом во второй и четвёртой. Каждая из восьми формул снизу относится к одному из них.',
    'Two plots are shown above: one has branches in the first and third quadrants, the other in the second and fourth. Each of the eight formulas below belongs to one of them.'),
  ask: L('Formulani bosing, keyin uning chizmasini bosing.', 'Нажми формулу, потом её чертёж.', 'Tap a formula, then tap its plot.'),
  bank: L('Formulalar', 'Формулы', 'Formulas'),
  correctText: L(
    "To'g'ri. Hammasi k ning ishorasiga bog'liq. k musbat bo'lsa x va y bir xil ishorada bo'ladi — demak tarmoqlar birinchi va uchinchi chorakda. k manfiy bo'lsa ishoralar qarama-qarshi va tarmoqlar ikkinchi va to'rtinchi chorakka o'tadi. Ikki yozuv ataylab berkitilgan: to'rt bo'lingan minus x da minus chiziqning tagida turadi, ya'ni k minus to'rtga teng; minus qavs ichida minus uch esa arti uchni beradi.",
    'Верно. Всё решает знак k. Если k положительное, x и y одного знака — значит ветви в первой и третьей четверти. Если k отрицательное, знаки противоположны и ветви уходят во вторую и четвёртую. Две записи спрятаны нарочно: в четыре делить на минус x минус стоит под чертой, то есть k равно минус четырём; а минус на минус три даёт плюс три.',
    'Correct. Everything is decided by the sign of k. If k is positive, x and y have the same sign, so the branches lie in the first and third quadrants. If k is negative the signs are opposite and the branches move to the second and fourth. Two records are hidden on purpose: in four over minus x the minus is below the bar, so k is minus four; and minus times minus three gives plus three.'),
  wrongs: [
    { when: (s) => s.place.i3 === 'z1', text: L(
      "To'rt bo'lingan minus x da minus chiziqning TAGIDA. x ni ikkiga teng qo'ying: maxraj minus ikki, qiymat minus ikki. x musbat, y manfiy — bu to'rtinchi chorak.",
      'В четыре делить на минус x минус стоит ПОД чертой. Подставь x равное двум: знаменатель минус два, значение минус два. x положителен, y отрицателен — это четвёртая четверть.',
      'In four over minus x the minus is BELOW the bar. Put x equal to two: the denominator is minus two and the value is minus two. x is positive, y is negative — that is the fourth quadrant.') },
    { when: (s) => s.place.i7 === 'z2', text: L(
      "Ikki minus arti beradi: minus qavs ichida minus uch bu arti uch. x ni birga qo'ying — qiymat arti uch. Ikkalasi ham musbat, demak birinchi chorak.",
      'Два минуса дают плюс: минус на минус три это плюс три. Подставь x равное одному — значение плюс три. Оба положительны, значит первая четверть.',
      'Two minuses give a plus: minus times minus three is plus three. Put x equal to one and the value is plus three. Both are positive, so the first quadrant.') },
    { when: (s) => s.place.i5 === 'z1' || s.place.i4 === 'z1' || s.place.i8 === 'z1', text: L(
      "Bu yozuvlarda suratda minus turadi, ya'ni k manfiy. x ni birga qo'ying: qiymat manfiy chiqadi. Musbat x va manfiy y — bu to'rtinchi chorak, ya'ni ikkinchi chizma.",
      'В этих записях минус в числителе, то есть k отрицательное. Подставь x равное одному: значение выйдет отрицательным. Положительный x и отрицательный y — это четвёртая четверть, второй чертёж.',
      'In these records the minus is in the numerator, so k is negative. Put x equal to one: the value comes out negative. A positive x with a negative y is the fourth quadrant, that is the second plot.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har formulada bitta ish qiling: x ni birga teng qo'yib y ni hisoblang. y musbat chiqsa birinchi chizma, manfiy chiqsa ikkinchisi.",
      'С каждой формулой делай одно: подставь x равное одному и посчитай y. Вышло положительное — первый чертёж, отрицательное — второй.',
      'Do one thing with every formula: put x equal to one and compute y. Positive means the first plot, negative means the second.') },
  ],
  wrongText: L(
    "k ning ishorasini toping: suratdagi va maxrajdagi minuslarni birga hisobga oling. Musbat k — birinchi chizma, manfiy k — ikkinchisi.",
    'Найди знак k: учти минусы и в числителе, и в знаменателе. Положительное k — первый чертёж, отрицательное — второй.',
    'Find the sign of k, counting the minuses both above and below the bar. Positive k is the first plot, negative k the second.'),
};

export default function D07_03(props) { return <Zones data={DATA} {...props} />; }
