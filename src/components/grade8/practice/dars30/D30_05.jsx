// Dars30 · Amaliyot 05 — Guruhlar · 🟡 · tag: absolute_or_relative
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §12 (30-dars, 5-pozitsiya)
//
// З60 NING ENG SODDA TEKSHIRUVI: farqni BO'LISH ochib beradi. Absolut
// xatolik — ayirma yoki uning moduli; nisbiy xatolik — o'sha ayirmaning
// taqribiy qiymatga BO'LINGANI.
//
// SKELETDAN OG'ISH VA SABABI: skeletda kartalarda o'lchov birliklari
// turardi (`0,02 sm`, `1 kg`). `Zones` karta matnini tarjima qilmaydi, va
// «sm» ruschada «см» bo'lishi kerak edi. Shuning uchun kartalar faqat
// YOZUV shakli bilan ajratildi — bu hamma tilda bir xil ko'rinadi va
// ta'rifning o'ziga yaqinroq turadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'absolute_or_relative', level: '🟡',
  zoneSize: 13, itemSize: 14, zoneLbl: 122,
  zones: [
    { id: 'z1', label: L('ABSOLUT XATOLIK', 'АБСОЛЮТНАЯ', 'ABSOLUTE ERROR') },
    { id: 'z2', label: L('NISBIY XATOLIK', 'ОТНОСИТЕЛЬНАЯ', 'RELATIVE ERROR') },
  ],
  items: [
    { id: 'i1', tokens: ['|x − a|'], zone: 'z1' },
    { id: 'i2', tokens: ['|x − a| : |a|'], zone: 'z2' },
    { id: 'i3', tokens: ['|20 − 19,8|'], zone: 'z1' },
    { id: 'i4', tokens: ['0,2 : 20'], zone: 'z2' },
    { id: 'i5', tokens: ['|7,2 − 7|'], zone: 'z1' },
    { id: 'i6', tokens: ['0,2 : 7'], zone: 'z2' },
    { id: 'i7', tokens: ['|3,14 − 3,1|'], zone: 'z1' },
    { id: 'i8', tokens: ['0,04 : 3,1'], zone: 'z2' },
  ],
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Sakkiz yozuv ikki xatolikka tegishli. Farqni bitta amal ochib beradi: nisbiy xatolikda BO'LISH bor, absolut xatolikda esa yo'q.",
    'Восемь записей относятся к двум погрешностям. Различие открывает одно действие: в относительной погрешности есть ДЕЛЕНИЕ, а в абсолютной нет.',
    'Eight records belong to two kinds of error. One operation reveals the difference: the relative error involves DIVISION, the absolute one does not.'),
  ask: L(
    'Yozuvni bosing, keyin guruhini bosing.',
    'Нажми запись, потом её группу.',
    'Tap a record, then its group.'),
  bank: L('Yozuvlar', 'Записи', 'Records'),
  correctText: L(
    "To'g'ri. Absolut xatolik — ayirmaning moduli, nisbiy xatolik esa uning taqribiy qiymatga BO'LINGANI. Bo'lish belgisi bor bo'lsa — nisbiy, yo'q bo'lsa — absolut.",
    'Верно. Абсолютная погрешность — модуль разности, а относительная — она же, РАЗДЕЛЁННАЯ на приближённое значение. Есть знак деления — относительная, нет — абсолютная.',
    'Correct. The absolute error is the absolute value of the difference; the relative error is that same error DIVIDED by the approximation. Division sign present — relative; absent — absolute.'),
  wrongs: [
    { when: (s) => s.place.i2 === 'z1' || s.place.i4 === 'z1' || s.place.i6 === 'z1' || s.place.i8 === 'z1', text: L(
      "Bu yozuvda BO'LISH bor, ya'ni u nisbiy xatolik. Ta'rifni eslang: nisbiy xatolik — absolut xatolikning taqribiy qiymat moduliga NISBATI. Bo'lish belgisi shu nisbatning o'zi. Bo'linmasdan turgan ayirma esa absolut xatolik bo'lib qolaveradi.",
      'В этой записи есть ДЕЛЕНИЕ, значит это относительная погрешность. Вспомни определение: относительная погрешность — это ОТНОШЕНИЕ абсолютной к модулю приближённого значения. Знак деления и есть это отношение. А разность без деления остаётся абсолютной погрешностью.',
      'This record contains DIVISION, so it is a relative error. Recall the definition: the relative error is the RATIO of the absolute error to the absolute value of the approximation. The division sign is that ratio. A difference without division stays an absolute error.') },
    { when: (s) => s.place.i1 === 'z2' || s.place.i3 === 'z2' || s.place.i5 === 'z2' || s.place.i7 === 'z2', text: L(
        "Bu yozuvda faqat AYIRMA bor, bo'lish yo'q — demak u absolut xatolik. Nisbiy xatolikka aylanishi uchun uni taqribiy qiymatning moduliga bo'lish kerak.",
        'В этой записи есть только РАЗНОСТЬ, деления нет — значит это абсолютная погрешность. Чтобы стать относительной, её надо разделить на модуль приближённого значения.',
        'This record holds only a DIFFERENCE, with no division — so it is an absolute error. To become relative it must be divided by the absolute value of the approximation.') },
    { when: (s) => s.bad.length >= 4, text: L(
      "Har yozuvda bitta belgini izlang: bo'lish bormi. Bo'lish bo'lsa — nisbiy xatolik, bo'lmasa — absolut. Ta'rifning o'zi shu farqni beradi, boshqa hech narsani tekshirish kerak emas.",
      'В каждой записи ищи один знак: есть ли деление. Есть — относительная погрешность, нет — абсолютная. Само определение и даёт это различие, проверять больше нечего.',
      'Look for one sign in every record: is there a division. With it — a relative error; without it — an absolute one. The definition itself gives the difference, nothing else needs checking.') },
  ],
  wrongText: L(
    "Bo'lish belgisini izlang: nisbiy xatolik — bu NISBAT, ya'ni absolut xatolikning taqribiy qiymatga bo'lingani. Bo'linmagan ayirma esa absolut xatolik.",
    'Ищи знак деления: относительная погрешность — это ОТНОШЕНИЕ, то есть абсолютная, делённая на приближённое значение. А разность без деления — абсолютная погрешность.',
    'Look for the division sign: the relative error is a RATIO, the absolute error divided by the approximation. A difference without division is an absolute error.'),
};

export default function D30_05(props) { return <Zones data={DATA} {...props} />; }
