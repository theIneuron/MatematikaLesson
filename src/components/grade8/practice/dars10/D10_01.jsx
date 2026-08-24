// Dars10 · Amaliyot 01 — Belgilash · 🟢 · tag: defined_marked
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Skelet: DARS07_11_AMALIYOT_SKELET.md §8 (10-dars, 1-pozitsiya)
//
// Darsning ikkinchi tasdig'i: ildiz ildiz osti NOMANFIY bo'lgan joyda bor.
// Uch qiymatli yozuv uch xil ko'rinishda beriladi:
//   √((−6)²) — ildiz ostida minus turadi, lekin KVADRAT uni yo'q qiladi;
//   √0       — nol nomanfiy;
//   √(3²+4²) — hisoblash kerak: yigirma besh chiqadi.
// Uch qiymatsiz yozuvda ildiz osti manfiy, oxirgisida esa buni ayirish
// beradi: ikki minus to'qqiz minus yetti (З32).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'defined_marked', level: '🟢',
  col: 156, itemSize: 20,
  items: [
    { id: 'i1', tokens: [{ r: '(−6)²' }], hit: true },
    { id: 'i2', tokens: [{ r: '−16' }] },
    { id: 'i3', tokens: [{ r: '0' }], hit: true },
    { id: 'i4', tokens: [{ r: '−1' }] },
    { id: 'i5', tokens: [{ r: '3² + 4²' }], hit: true },
    { id: 'i6', tokens: [{ r: '2 − 9' }] },
  ],
  eyebrow: L('Belgilash', 'Отметить', 'Mark'),
  setup: L(
    "Oltita yozuv. Ildiz ostidagi ifodani avval hisoblash kerak: minus belgisi ko'rinib turishi hech narsani hal qilmaydi.",
    'Шесть записей. Подкоренное надо сначала посчитать: видимый минус ещё ничего не решает.',
    'Six records. The radicand must be computed first: a visible minus decides nothing yet.'),
  ask: L(
    "Qiymati BOR bo'lgan 3 ta yozuvni belgilang.",
    'Отметь 3 записи, у которых значение ЕСТЬ.',
    'Mark the 3 records that DO have a value.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Birinchisida minus kvadrat ostida: minus olti karra minus olti o'ttiz olti, ya'ni ildiz osti musbat va javob olti. Nol nomanfiy, uning ildizi nolga teng. Uchinchisida to'qqiz qo'shuv o'n olti yigirma besh, ildizi besh. Qolgan uchtasida ildiz osti manfiy: minus o'n olti, minus bir va ikki minus to'qqiz — ya'ni minus yetti.",
    'Верно. В первой минус стоит под квадратом: минус шесть на минус шесть тридцать шесть, значит подкоренное положительно и ответ шесть. Нуль неотрицателен, его корень равен нулю. В третьей девять плюс шестнадцать двадцать пять, корень пять. В остальных трёх подкоренное отрицательно: минус шестнадцать, минус один и два минус девять, то есть минус семь.',
    'Correct. In the first the minus sits under a square: minus six times minus six is thirty six, so the radicand is positive and the answer is six. Zero is non-negative and its root is zero. In the third nine plus sixteen is twenty five and the root is five. In the other three the radicand is negative: minus sixteen, minus one, and two minus nine, that is minus seven.'),
  wrongs: [
    { when: (s) => s.miss.indexOf('i1') !== -1, text: L(
      "Birinchi yozuvni chetlab o'tdingiz, chunki minus ko'rinib turadi. Lekin minus KVADRAT ostida: uni o'ziga ko'paytirsangiz musbat chiqadi. Minus olti karra minus olti o'ttiz olti.",
      'Первая запись осталась в стороне из-за видимого минуса. Но минус стоит под КВАДРАТОМ: умножь его на себя и выйдет положительное. Минус шесть на минус шесть тридцать шесть.',
      'The first record was left out because of the visible minus. But the minus is under a SQUARE: multiply it by itself and the result is positive. Minus six times minus six is thirty six.') },
    { when: (s) => s.extra.indexOf('i6') !== -1, text: L(
      "Oxirgi yozuvda ildiz ostida ayirma turadi. Uni hisoblang: ikki minus to'qqiz minus yetti. Manfiy sondan kvadrat ildiz olinmaydi.",
      'В последней записи под корнем стоит разность. Посчитай её: два минус девять — минус семь. Из отрицательного числа квадратный корень не извлекается.',
      'In the last record a difference stands under the root. Compute it: two minus nine is minus seven. A square root cannot be taken of a negative number.') },
    { when: (s) => s.extra.indexOf('i2') !== -1 || s.extra.indexOf('i4') !== -1, text: L(
      "Bu yozuvlarda minus ildiz ostidagi butun ifodaga tegishli, kvadrat ham yo'q. Kvadrati minus o'n oltiga teng son yo'q: musbatning kvadrati musbat, manfiyning kvadrati ham musbat.",
      'В этих записях минус относится ко всему подкоренному, и квадрата нет. Числа, чей квадрат равен минус шестнадцати, не существует: квадрат положительного положителен, квадрат отрицательного тоже.',
      'In these records the minus belongs to the whole radicand and there is no square. No number has a square of minus sixteen: the square of a positive is positive, and so is the square of a negative.') },
    { when: (s) => s.miss.indexOf('i5') !== -1, text: L(
      "Uchinchi yozuvda ildiz ostini hisoblash kerak: to'qqiz qo'shuv o'n olti yigirma besh. Yigirma besh nomanfiy, demak qiymat bor va u beshga teng.",
      'В третьей записи подкоренное надо посчитать: девять плюс шестнадцать двадцать пять. Двадцать пять неотрицательно, значит значение есть и равно пяти.',
      'In the third record the radicand must be computed: nine plus sixteen is twenty five. Twenty five is non-negative, so the value exists and equals five.') },
    { when: (s) => s.marked.length !== 3, text: L(
      "Aynan uchta yozuv kerak. Har birida bitta ish qiling: ildiz ostini oxirigacha hisoblang va ishorasiga qarang.",
      'Нужно ровно три записи. С каждой делай одно: посчитай подкоренное до конца и посмотри на его знак.',
      'Exactly three records are needed. Do one thing with each: compute the radicand to the end and look at its sign.') },
  ],
  wrongText: L(
    "Ildiz ostidagi ifodani oxirigacha hisoblang, keyin ishorasiga qarang. Ko'rinib turgan minus javob emas.",
    'Посчитай подкоренное до конца, потом посмотри на знак. Видимый минус это ещё не ответ.',
    'Compute the radicand to the end, then look at the sign. A visible minus is not the answer yet.'),
};

export default function D10_01(props) { return <MarkAll data={DATA} {...props} />; }
