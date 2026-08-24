// Dars09 · Amaliyot 03 — Belgilash · 🟢 · tag: has_value
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Skelet: DARS07_11_AMALIYOT_SKELET.md §7 (9-dars, 3-pozitsiya)
//
// Uch qiymatli yozuv uch xil sababdan qiymatli:
//   √0   — nol nomanfiy, ildizi nolga teng;
//   √7   — butun emas, lekin qiymat bor (З30 shu yerda o'ladi);
//   √169 — to'liq kvadrat.
// Uch qiymatsiz yozuvda ildiz osti manfiy: manfiy sonning kvadrat ildizi yo'q,
// chunki hech bir sonning kvadrati manfiy bo'lmaydi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'has_value', level: '🟢',
  col: 150, itemSize: 21,
  items: [
    { id: 'i1', tokens: [{ r: '0' }], hit: true },
    { id: 'i2', tokens: [{ r: '−4' }] },
    { id: 'i3', tokens: [{ r: '7' }], hit: true },
    { id: 'i4', tokens: [{ r: '−1' }] },
    { id: 'i5', tokens: [{ r: '169' }], hit: true },
    { id: 'i6', tokens: [{ r: '−100' }] },
  ],
  eyebrow: L('Belgilash', 'Отметить', 'Mark'),
  setup: L(
    "Oltita yozuv. Ba'zilarining qiymati bor, ba'zilarining yo'q. Qiymat butun bo'lishi shart emas.",
    'Шесть записей. У некоторых значение есть, у некоторых нет.',
    'Six records. Some have a value, some do not. The value does not have to be whole.'),
  ask: L(
    "Qiymati BOR bo'lgan 3 ta yozuvni belgilang.",
    'Отметь 3 записи, у которых значение ЕСТЬ.',
    'Mark the 3 records that DO have a value.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Noldan ildiz nolga teng, chunki nol karra nol nol. Yettidan ildiz butun emas, lekin bor: ikki karra ikki to'rt, uch karra uch to'qqiz, demak ildiz ikki bilan uch orasida. Bir yuz oltmish to'qqiz to'liq kvadrat: o'n uch karra o'n uch. Qolgan uchtasida ildiz osti manfiy, va hech bir sonning kvadrati manfiy bo'lmaydi — na musbat, na manfiy son bunday natija bermaydi.",
    'Верно. Корень из нуля равен нулю, ведь нуль на нуль нуль. Корень из семи не целый, но существует: два на два четыре, три на три девять, значит корень между двумя и тремя. Сто шестьдесят девять полный квадрат: тринадцать на тринадцать. В остальных трёх подкоренное отрицательно, а квадрат ни одного числа не бывает отрицательным.',
    'Correct. The root of zero is zero, since zero times zero is zero. The root of seven is not whole but it exists: two times two is four, three times three is nine, so the root lies between two and three. One hundred sixty nine is a perfect square: thirteen times thirteen. In the other three the radicand is negative, and no number has a negative square — neither a positive nor a negative one gives that.'),
  wrongs: [
    { when: (s) => s.miss.indexOf('i3') !== -1, text: L(
      "Yettini chetlab o'tdingiz, chunki ildizi butun emas. Lekin savol butunlik haqida emas, QIYMAT bor-yo'qligi haqida. Ikki karra ikki to'rt, uch karra uch to'qqiz — ildiz shu ikkisi orasida turadi va u bor.",
      'Семь осталось в стороне, потому что корень не целый. Но вопрос не о целости, а о том, ЕСТЬ ли значение. Два на два четыре, три на три девять — корень лежит между ними, и он есть.',
      'Seven was left out because its root is not whole. But the question is not about being whole, it is about whether a value EXISTS. Two times two is four, three times three is nine — the root lies between them and it does exist.') },
    { when: (s) => s.miss.indexOf('i1') !== -1, text: L(
      "Noldan ildiz ham bor: nol nomanfiy son, va nol karra nol nolga teng. Ta'rif nomanfiy deydi, musbat demaydi — shuning uchun nol ham hisobda.",
      'Корень из нуля тоже есть: нуль неотрицательное число, и нуль на нуль равно нулю. В определении сказано неотрицательное, а не положительное — значит нуль в счёт.',
      'Zero has a root too: zero is a non-negative number and zero times zero is zero. The definition says non-negative, not positive, so zero counts.') },
    { when: (s) => s.extra.indexOf('i2') !== -1 || s.extra.indexOf('i4') !== -1 || s.extra.indexOf('i6') !== -1, text: L(
      "Bu yozuvlarda ildiz osti manfiy. Kvadrati minus to'rtga teng sonni izlab ko'ring: ikkining kvadrati to'rt, minus ikkining kvadrati ham to'rt. Manfiy natija chiqmaydi, demak qiymat yo'q.",
      'В этих записях подкоренное отрицательно. Поищи число, чей квадрат равен минус четырём: квадрат двух четыре, квадрат минус двух тоже четыре. Отрицательный результат не выходит, значит значения нет.',
      'In these records the radicand is negative. Try to find a number whose square is minus four: two squared is four, minus two squared is also four. A negative result never comes out, so there is no value.') },
    { when: (s) => s.marked.length !== 3, text: L(
      "Aynan uchta yozuv kerak. Har birida bitta savol bering: ildiz osti manfiymi? Manfiy bo'lmasa, qiymat bor.",
      'Нужно ровно три записи. К каждой один вопрос: отрицательно ли подкоренное? Если нет — значение есть.',
      'Exactly three records are needed. Ask one question about each: is the radicand negative? If it is not, the value exists.') },
  ],
  wrongText: L(
    "Faqat bitta narsaga qarang: ildiz ostidagi son manfiymi. Butunlik bu savolga aloqasi yo'q.",
    'Смотри только на одно: отрицательно ли число под корнем. Целость к этому вопросу не относится.',
    'Look at one thing only: is the number under the root negative. Being whole has nothing to do with this question.'),
};

export default function D09_03(props) { return <MarkAll data={DATA} {...props} />; }
