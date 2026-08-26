// Dars27 · Amaliyot 02 — Nechta · 🟢 · tag: count_integers_in
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §9 (27-dars, 2-pozitsiya)
//
// KESMA (T1): ikkala qavs ham kvadrat, ya'ni IKKALA chegara ham sanaladi.
// Minus bir, nol, bir, ikki, uch — beshta.
//
// Eng ko'p uchraydigan xato — uch: chegaralarni tashlab ketish (26-darsning
// qat'iy oralig'i bilan chalkashtirish). Nolni ham tashlab ketish oson.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'count_integers_in', level: '🟢',
  target: 5, allowNeg: false,
  expr: ['[−1; 3]'], exprSize: 30,
  eyebrow: L('Nechta', 'Сколько', 'How many'),
  setup: L(
    "Kesma kvadrat qavslar bilan yoziladi, ya'ni ikkala chegara ham to'plamga kiradi. Uning ichida nechta butun son borligini sanash kerak.",
    'Отрезок записывается квадратными скобками, то есть обе границы входят в множество. Надо сосчитать, сколько внутри целых чисел.',
    'A segment is written with square brackets, so both boundaries belong to the set. Count how many whole numbers lie inside.'),
  label: L('Butun sonlar soni', 'Число целых чисел', 'The count of whole numbers'),
  ask: L('Bu kesmada nechta butun son bor?', 'Сколько целых чисел на этом отрезке?', 'How many whole numbers lie on this segment?'),
  correctText: L(
    "To'g'ri. Ikkala qavs ham kvadrat, ya'ni chegaralar to'plamga kiradi: minus bir ham, uch ham sanaladi. Sanaymiz: minus bir, nol, bir, ikki, uch — beshta. Nolni tashlab ketmaslik kerak, u ham butun son. Tengsizlik bilan yozsangiz ko'rinadi: minus bir x dan kichik yoki teng, x esa uchdan kichik yoki teng.",
    'Верно. Обе скобки квадратные, то есть границы входят в множество: считаются и минус один, и три. Считаем: минус один, нуль, один, два, три — пять. Нуль пропускать нельзя, он тоже целое число. Если записать неравенством, это видно: минус один меньше или равно x, а x меньше или равно трём.',
    'Correct. Both brackets are square, so the boundaries belong to the set: minus one and three both count. Count: minus one, zero, one, two, three — five. Zero must not be skipped, it is a whole number too. Writing it as an inequality makes it plain: minus one is less than or equal to x, and x is less than or equal to three.'),
  wrongs: [
    { when: (s) => s.value === 3, text: L(
      "Chegaralar tashlab ketilgan. Qavslarga qarang — ikkalasi ham KVADRAT, ya'ni minus bir ham, uch ham to'plamga kiradi. Ular chiqib ketishi uchun qavslar dumaloq bo'lishi kerak edi. Sanang: minus bir, nol, bir, ikki, uch.",
      'Границы отброшены. Посмотри на скобки — обе КВАДРАТНЫЕ, значит и минус один, и три входят в множество. Чтобы они выпадали, скобки должны были быть круглыми. Считай: минус один, нуль, один, два, три.',
      'The boundaries were dropped. Look at the brackets — both are SQUARE, so minus one and three both belong to the set. For them to fall out the brackets would have to be round. Count: minus one, zero, one, two, three.') },
    { when: (s) => s.value === 4, text: L(
      "Bitta son sanalmay qolgan. Ko'pincha bu NOL bo'ladi: u manfiy ham, musbat ham emas, lekin butun son va kesmaga kiradi. Yoki chegaralarning biri tashlab ketilgan. Sanang: minus bir, nol, bir, ikki, uch — beshta.",
      'Одно число не сосчитано. Чаще всего это НУЛЬ: он не отрицательный и не положительный, но целое число и на отрезок входит. Или отброшена одна из границ. Считай: минус один, нуль, один, два, три — пять.',
      'One number was not counted. Most often it is ZERO: neither negative nor positive, yet a whole number and part of the segment. Or one boundary was dropped. Count: minus one, zero, one, two, three — five.') },
    { when: (s) => s.value === 6 || s.value === 2, text: L(
      "Sanashda xato bor. Eng ishonchli yo'l: chegaralarni yozib, ular orasidagi hamma butun sonni ketma-ket aytish. Minus birdan uchgacha: minus bir, nol, bir, ikki, uch. Chegaralar kvadrat qavs ichida, demak ular ham sanaladi.",
      'В счёте ошибка. Самый надёжный путь: выписать границы и назвать подряд все целые между ними. От минус одного до трёх: минус один, нуль, один, два, три. Границы в квадратных скобках, значит считаются и они.',
      'There is a slip in the count. The safest way: write out the boundaries and name every whole number between them in order. From minus one to three: minus one, zero, one, two, three. The boundaries are in square brackets, so they count too.') },
  ],
  wrongText: L(
    "Qavslarning turiga qarang, keyin chegaralardan boshlab ketma-ket sanang. Kvadrat qavs chegarani sanoqqa kiritadi, nolni esa tashlab ketmang.",
    'Посмотри на тип скобок, потом считай подряд, начиная с границ. Квадратная скобка включает границу в счёт, а нуль не пропускай.',
    'Look at the type of brackets, then count in order starting from the boundaries. A square bracket puts the boundary into the count, and do not skip zero.'),
};

export default function D27_02(props) { return <TypeValue data={DATA} {...props} />; }
