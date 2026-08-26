// Dars54 · Amaliyot 03 — Guruhlar · 🟢 · tag: same_or_opposite
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Skelet: DARS51_55_AMALIYOT_SKELET.md §6 (54-dars, 3-pozitsiya)
//
// З114 SOF SHAKLDA. Kartalar juft-juft turadi va faqat ISHORA bilan farq
// qiladi: 3a va −3a, 0,5a va −0,5a. Koeffitsiyentning KATTALIGI hech
// narsani hal qilmaydi — 0,5a ham, 7a ham bir xil yo'nalishda.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'same_or_opposite', level: '🟢',
  zoneSize: 12, itemSize: 16, zoneLbl: 124,
  given: [[{
    fig: 'vec', w: 58, h: 40,
    arrows: [{ from: [6, 30], to: [34, 12], name: 'a' }],
  }]],
  givenLabel: L('Vektor', 'Вектор', 'The vector'),
  zones: [
    { id: 'z1', label: L("a BILAN BIR XIL", 'СОНАПРАВЛЕНЫ с a', 'SAME WAY AS a') },
    { id: 'z2', label: L('TESKARI', 'ПРОТИВОПОЛОЖНЫ', 'OPPOSITE') },
  ],
  items: [
    { id: 'i1', tokens: ['3a'], zone: 'z1' },
    { id: 'i2', tokens: ['−3a'], zone: 'z2' },
    { id: 'i3', tokens: ['0,5a'], zone: 'z1' },
    { id: 'i4', tokens: ['−0,5a'], zone: 'z2' },
    { id: 'i5', tokens: ['7a'], zone: 'z1' },
    { id: 'i6', tokens: ['−1a'], zone: 'z2' },
    { id: 'i7', tokens: ['2,5a'], zone: 'z1' },
    { id: 'i8', tokens: ['−4a'], zone: 'z2' },
  ],
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Sakkiz vektor, hammasi a dan songa ko'paytirish orqali olingan. Ularni ikki guruhga ajratish kerak: a bilan bir xil yo'nalganlar va teskari yo'nalganlar. Diqqat: kartalar juft-juft turadi va faqat bitta belgi bilan farq qiladi.",
    'Восемь векторов, все получены из a умножением на число. Их надо разделить на две группы: сонаправленные с a и направленные противоположно. Внимание: карточки стоят парами и различаются лишь одним знаком.',
    'Eight vectors, all obtained from a by multiplying by a number. They must be split into two groups: those pointing the same way as a and those pointing the opposite way. Note: the cards come in pairs and differ by a single sign.'),
  ask: L('Vektorni bosing, keyin guruhini bosing.', 'Нажми вектор, потом его группу.', 'Tap a vector, then its group.'),
  bank: L('Vektorlar', 'Векторы', 'Vectors'),
  correctText: L(
    "To'g'ri. Yo'nalishni faqat bitta narsa hal qiladi: koeffitsiyentning ISHORASI. Musbat bo'lsa yo'nalish saqlanadi, manfiy bo'lsa teskarilanadi. Koeffitsiyentning kattaligi esa umuman hisobga olinmaydi: nol butun besh karra a a dan ikki barobar qisqa, lekin baribir o'sha tomonga qaraydi; yetti karra a esa uzun, lekin u ham o'sha tomonga.",
    'Верно. Направление решает одно: ЗНАК коэффициента. Положительный — направление сохраняется, отрицательный — разворачивается. А величина коэффициента вообще не учитывается: ноль целых пять a вдвое короче a, но смотрит в ту же сторону; семь a длинный, но тоже в ту же сторону.',
    'Correct. One thing decides the direction: the SIGN of the coefficient. Positive keeps the direction, negative reverses it. The size of the coefficient counts for nothing: nought point five a is half as long as a but still points the same way; seven a is long, and it points the same way too.'),
  wrongs: [
    { when: (s) => s.place.i3 === 'z2' || s.place.i7 === 'z2', text: L(
      "Kasr koeffitsiyentli vektor teskarilar guruhiga tushdi. Nol butun besh va ikki butun besh — musbat sonlar, demak yo'nalish saqlanadi. Ular vektorni qisqartiradi yoki cho'zadi, lekin burmaydi. Burish uchun MINUS kerak, kasr emas.",
      'Вектор с дробным коэффициентом попал в группу противоположных. Ноль целых пять и два целых пять — положительные числа, значит направление сохраняется. Они укорачивают или удлиняют вектор, но не разворачивают. Для разворота нужен МИНУС, а не дробь.',
      'A vector with a fractional coefficient landed in the opposite group. Nought point five and two point five are positive numbers, so the direction is kept. They shorten or lengthen the vector but do not reverse it. Reversal needs a MINUS, not a fraction.') },
    { when: (s) => s.place.i6 === 'z1', text: L(
      "Minus bir karra a bir xil yo'nalganlar guruhiga tushdi. Koeffitsiyent bir bo'lgani chalkashtirdi: uzunlik haqiqatan ham o'zgarmaydi, lekin MINUS bor, demak strelka teskari buriladi. Minus bir karra a — bu a ga qarama-qarshi vektor, u minus a deb ham yoziladi.",
      'Минус один a попал в группу сонаправленных. Смутил коэффициент один: длина действительно не меняется, но МИНУС есть, значит стрелка разворачивается. Минус один a это вектор, противоположный a, его записывают и как минус a.',
      'Minus one a landed in the same-way group. The coefficient of one is misleading: the length indeed stays the same, but the MINUS is there, so the arrow reverses. Minus one a is the vector opposite to a, also written as minus a.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Uchtadan ko'p karta boshqa guruhda. Har kartada faqat BITTA narsaga qarang: koeffitsiyentning oldida minus bormi. Sonning kattaligi, kasrligi yoki butunligi yo'nalishga umuman ta'sir qilmaydi.",
      'Больше трёх карточек стоят не в своей группе. В каждой смотри только на ОДНО: есть ли минус перед коэффициентом. Величина числа, дробное оно или целое, на направление не влияет вовсе.',
      'More than three cards are in the wrong group. In each look at ONE thing only: is there a minus in front of the coefficient. The size of the number, whether it is fractional or whole, has no effect on the direction at all.') },
    { when: () => true, text: L(
      "Bitta karta boshqa guruhda qoldi. Belgi bitta: minus bo'lsa teskari, bo'lmasa bir xil yo'nalishda.",
      'Одна карточка осталась не в своей группе. Признак один: есть минус — противоположно, нет — сонаправлено.',
      'One card stayed in the wrong group. There is one mark: a minus means opposite, no minus means the same way.'),
    },
  ],
  wrongText: L(
    "Faqat ISHORAGA qarang. Koeffitsiyentning kattaligi yo'nalishni o'zgartirmaydi.",
    'Смотри только на ЗНАК. Величина коэффициента направление не меняет.',
    'Look only at the SIGN. The size of the coefficient does not change the direction.'),
};

export default function D54_03(props) { return <Zones data={DATA} {...props} />; }
