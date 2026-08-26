// Dars17 · Amaliyot 04 — To'la kvadrat · 🟡 · tag: perfect_square_zones
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §5 (17-dars, 4-pozitsiya)
//
// T1: FORMULA TO'LA KVADRATNI AJRATISHDAN CHIQADI (`Dars17.jsx`, 5-ekran
// `squarecut`). Bu topshiriq shu usulning tayanchini tekshiradi: qachon
// uchhad ikkihadning to'la kvadratiga aylanadi.
//
// Kartalar juft-juft: har juftlikda faqat OZOD HAD farq qiladi, va shart
// bitta — c ikkinchi koeffitsiyentning yarmining kvadratiga teng bo'lishi
// kerak. Sakkiz karta, to'rt juftlik: 9 va 8, 25 va 24, 4 va 5, 1 va 3.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'perfect_square_zones', level: '🟡',
  zoneSize: 15, itemSize: 15,
  zones: [
    { id: 'z1', label: L("TO'LA KVADRAT", 'ПОЛНЫЙ КВАДРАТ', 'PERFECT SQUARE') },
    { id: 'z2', label: L('BO\'LMAYDI', 'НЕ ЯВЛЯЕТСЯ', 'IS NOT') },
  ],
  items: [
    { id: 'i1', tokens: ['x² + 6x + 9'], zone: 'z1' },
    { id: 'i2', tokens: ['x² + 6x + 8'], zone: 'z2' },
    { id: 'i3', tokens: ['x² − 10x + 25'], zone: 'z1' },
    { id: 'i4', tokens: ['x² − 10x + 24'], zone: 'z2' },
    { id: 'i5', tokens: ['x² + 4x + 4'], zone: 'z1' },
    { id: 'i6', tokens: ['x² + 4x + 5'], zone: 'z2' },
    { id: 'i7', tokens: ['x² − 2x + 1'], zone: 'z1' },
    { id: 'i8', tokens: ['x² − 2x + 3'], zone: 'z2' },
  ],
  eyebrow: L("To'la kvadrat", 'Полный квадрат', 'Perfect square'),
  setup: L(
    "Formula to'la kvadratni ajratish usulidan chiqadi. Uchhad ikkihadning kvadratiga aylanadi, agar ozod had ikkinchi koeffitsiyentning yarmining kvadratiga teng bo'lsa.",
    'Формула выводится методом выделения полного квадрата. Трёхчлен становится квадратом двучлена, если свободный член равен квадрату половины второго коэффициента.',
    'The formula comes from completing the square. A trinomial becomes the square of a binomial when the constant term equals the square of half the second coefficient.'),
  ask: L(
    "Yozuvni bosing, keyin guruhini bosing.",
    'Нажми запись, потом её группу.',
    'Tap a record, then its group.'),
  bank: L('Yozuvlar', 'Записи', 'Records'),
  correctText: L(
    "To'g'ri. Shart bitta: ikkinchi koeffitsiyentning yarmini kvadratga oshiring va ozod had bilan solishtiring. Oltining yarmi uch, kvadrati to'qqiz — to'g'ri keladi, va yozuv x qo'shuv uchning kvadrati bo'ladi. Minus o'nning yarmi minus besh, kvadrati yigirma besh. To'rtning yarmi ikki, kvadrati to'rt.",
    'Верно. Условие одно: возведи половину второго коэффициента в квадрат и сравни со свободным членом. Половина шести три, квадрат девять — совпало, и запись равна квадрату x плюс три. Половина минус десяти минус пять, квадрат двадцать пять. Половина четырёх два, квадрат четыре. Половина минус двух минус один, квадрат один.',
    'Correct. One condition: square half of the second coefficient and compare with the constant term. Half of six is three, squared nine — a match, and the record equals x plus three squared. Half of minus ten is minus five, squared twenty five. Half of four is two, squared four. Half of minus two is minus one, squared one.'),
  wrongs: [
    { when: (s) => s.place.i2 === 'z1' || s.place.i4 === 'z1' || s.place.i6 === 'z1' || s.place.i8 === 'z1', text: L(
      "Bu yozuvda ozod had shartga TO'G'RI KELMAYDI. Ikkinchi koeffitsiyentning yarmini kvadratga oshiring: oltining yarmi uch, kvadrati to'qqiz — sakkiz emas. Sakkizni to'qqizga aylantirish uchun bittani qo'shish kerak bo'lardi, aynan shu usulning o'zi.",
      'В этой записи свободный член НЕ ПОДХОДИТ под условие. Возведи половину второго коэффициента в квадрат: половина шести три, квадрат девять — а не восемь. Чтобы восемь стало девятью, надо прибавить единицу, в этом и состоит сам метод.',
      'In this record the constant term does NOT match the condition. Square half the second coefficient: half of six is three, squared nine — not eight. Turning eight into nine would take adding one, and that is exactly what the method does.') },
    { when: (s) => s.place.i1 === 'z2' || s.place.i3 === 'z2' || s.place.i5 === 'z2' || s.place.i7 === 'z2', text: L(
      "Bu yozuv to'la kvadrat. Uni ochib tekshiring: x qo'shuv uchning kvadrati x kvadrat qo'shuv olti x qo'shuv to'qqiz beradi — aynan shu yozuv. Minus bilan ham xuddi shunday: x minus beshning kvadrati x kvadrat minus o'n x qo'shuv yigirma besh.",
      'Эта запись — полный квадрат. Проверь раскрытием: квадрат x плюс три даёт x квадрат плюс шесть x плюс девять — это и есть запись. С минусом так же: квадрат x минус пять даёт x квадрат минус десять x плюс двадцать пять.',
      'This record is a perfect square. Check by expanding: x plus three squared gives x squared plus six x plus nine — exactly this record. With a minus it works the same: x minus five squared gives x squared minus ten x plus twenty five.') },
    { when: (s) => s.bad.length >= 4, text: L(
      "Har yozuvda bir xil ish qiling: ikkinchi koeffitsiyentni ikkiga bo'ling, natijani kvadratga oshiring va ozod had bilan solishtiring. Teng bo'lsa — to'la kvadrat.",
      'С каждой записью делай одно и то же: раздели второй коэффициент на два, возведи результат в квадрат и сравни со свободным членом. Равны — полный квадрат.',
      'Do the same with every record: halve the second coefficient, square the result and compare with the constant term. Equal means a perfect square.') },
  ],
  wrongText: L(
    "Ikkinchi koeffitsiyentning yarmini kvadratga oshirib ozod had bilan solishtiring. Shubha bo'lsa qavsni ochib tekshiring.",
    'Возведи половину второго коэффициента в квадрат и сравни со свободным членом. При сомнении раскрой скобку и проверь.',
    'Square half the second coefficient and compare with the constant term. When in doubt, expand the bracket and check.'),
};

export default function D17_04(props) { return <Zones data={DATA} {...props} />; }
