// Dars18 · Amaliyot 07 — Kod · 🟡 · tag: code_D_values
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §6 (18-dars, 7-pozitsiya)
//
// UCH HOL BIR KODDA: manfiy, nol, musbat. 17-darsning 05-topshirig'i ham
// shunday tuzilgan edi, lekin tenglamalar boshqa — bu yerda `x² + 4x + 9`,
// `x² − 6x + 9` va `x² − 3x − 10`. Ikkinchi va uchinchi tenglamada ozod had
// bir xil ko'rinadi (to'qqiz va minus o'n), lekin ishorasi hammasini o'zgartiradi.
//
// Bankdagi tuzoqlar:
//   −4 — birinchi tenglamada to'rtga ko'paytirish tashlab ketildi (16 − 20);
//   9  — ozod hadning o'zi, hisoblanmagan;
//   58 — uchinchi tenglamada minus to'rt a c ni QO'SHISH o'rniga to'qqiz bilan
//        chalkashtirish (9 + 49).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'code_D_values', level: '🟡',
  expr: ['x² + 4x + 9', ';', 'x² − 6x + 9', ';', 'x² − 3x − 10'], exprSize: 15,
  cards: ['−20', '−4', '0', '9', '49', '58'],
  answer: ['−20', '0', '49'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Xonada seyf turadi, kodi uch xonali. Uch uchhadning diskriminanti uch xil chiqadi: manfiy, nol va musbat.",
    'В комнате сейф, код трёхзначный. Дискриминанты трёх трёхчленов выйдут разными: отрицательный, нуль и положительный.',
    'There is a safe in the room and its code has three places. The discriminants of the three trinomials come out different: negative, zero and positive.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Uch diskriminantni hisoblang va kodga o'sish tartibida yozing.",
    'Посчитай три дискриминанта и запиши их в код по возрастанию.',
    'Compute the three discriminants and write them into the code in increasing order.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Birinchisi: to'rtning kvadrati o'n olti, minus to'rt karra to'qqiz minus o'ttiz olti, o'n olti minus o'ttiz olti minus yigirma. Ikkinchisi: minus oltining kvadrati o'ttiz olti, minus o'ttiz olti — nol. Uchinchisi: minus uchning kvadrati to'qqiz, minus to'rt karra minus o'n ARTI qirq, to'qqiz qo'shuv qirq qirq to'qqiz. O'sish tartibida: minus yigirma, nol, qirq to'qqiz. Ikkinchi va uchinchi tenglamada ozod had bir xil ko'rinadi, lekin ishorasi natijani almashtiradi.",
    'Верно. Первый: четыре в квадрате шестнадцать, минус четыре на девять минус тридцать шесть, шестнадцать минус тридцать шесть минус двадцать. Второй: минус шесть в квадрате тридцать шесть, минус тридцать шесть — нуль. Третий: минус три в квадрате девять, минус четыре на минус десять ПЛЮС сорок, девять плюс сорок сорок девять. По возрастанию: минус двадцать, нуль, сорок девять. Во втором и третьем свободный член похож, но знак меняет результат.',
    'Correct. First: four squared is sixteen, minus four times nine is minus thirty six, sixteen minus thirty six is minus twenty. Second: minus six squared is thirty six, minus thirty six — zero. Third: minus three squared is nine, minus four times minus ten is PLUS forty, nine plus forty is forty nine. In increasing order: minus twenty, zero, forty nine. The constant terms of the second and third look alike, but the sign changes the result.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('−4') !== -1, text: L(
      "Minus to'rt — bu o'n olti minus yigirma, ya'ni to'rtga ko'paytirish tashlab ketilgan. Formulada minus TO'RT a c turadi: minus to'rt karra bir karra to'qqiz minus o'ttiz olti, o'n olti minus o'ttiz olti minus yigirma.",
      'Минус четыре — это шестнадцать минус двадцать, то есть пропущено умножение на четыре. В формуле стоит минус ЧЕТЫРЕ a c: минус четыре на один на девять минус тридцать шесть, шестнадцать минус тридцать шесть минус двадцать.',
      'Minus four is sixteen minus twenty, meaning the multiplication by four was skipped. The formula holds minus FOUR a c: minus four times one times nine is minus thirty six, and sixteen minus thirty six is minus twenty.') },
    { when: (s) => s.slots.indexOf('9') !== -1, text: L(
      "To'qqiz — birinchi ikki uchhadning OZOD HADI, diskriminant emas. D ikki qo'shiluvchidan yig'iladi: b kvadrati va minus to'rt a c. Ikkinchi uchhadda o'ttiz olti minus o'ttiz olti nol chiqadi.",
      'Девять — это СВОБОДНЫЙ ЧЛЕН первых двух трёхчленов, а не дискриминант. D складывается из двух частей: b в квадрате и минус четыре a c. Во втором трёхчлене выйдет тридцать шесть минус тридцать шесть, то есть нуль.',
      'Nine is the CONSTANT TERM of the first two trinomials, not the discriminant. D is built from two parts: b squared and minus four a c. In the second trinomial thirty six minus thirty six is zero.') },
    { when: (s) => s.slots.indexOf('58') !== -1, text: L(
      "Ellik sakkiz — to'qqiz qo'shuv qirq to'qqiz, ya'ni uchinchi tenglamaning javobi yana bir marta qo'shilgan. To'g'ri hisob: to'qqiz qo'shuv qirq qirq to'qqiz. Minus to'rt karra bir karra minus o'n arti qirq, qirq to'qqiz emas.",
      'Пятьдесят восемь — это девять плюс сорок девять, то есть ответ третьего уравнения прибавлен ещё раз. Верный счёт: девять плюс сорок сорок девять. Минус четыре на один на минус десять плюс сорок, а не сорок девять.',
      'Fifty eight is nine plus forty nine, meaning the answer of the third equation was added once more. The right computation: nine plus forty is forty nine. Minus four times one times minus ten is plus forty, not forty nine.') },
    { when: (s) => s.set, text: L(
      "Sonlar to'g'ri topilgan, tartib esa buzilgan. Manfiy son noldan kichik, nol esa musbatdan: minus yigirma, nol, qirq to'qqiz.",
      'Числа найдены верно, а порядок нет. Отрицательное меньше нуля, нуль меньше положительного: минус двадцать, нуль, сорок девять.',
      'The numbers are right, the order is not. A negative is below zero, and zero is below a positive: minus twenty, zero, forty nine.') },
    { when: (s) => s.slots.indexOf('49') === -1, text: L(
      "Kodda qirq to'qqiz yo'q. Uchinchi uchhadda ozod had MANFIY, shuning uchun minus to'rt a c musbat chiqadi: to'qqiz qo'shuv qirq qirq to'qqiz.",
      'В коде нет сорока девяти. В третьем трёхчлене свободный член ОТРИЦАТЕЛЬНЫЙ, поэтому минус четыре a c выходит положительным: девять плюс сорок сорок девять.',
      'The code has no forty nine. In the third trinomial the constant term is NEGATIVE, so minus four a c comes out positive: nine plus forty is forty nine.') },
  ],
  wrongText: L(
    "Har uchhadda b kvadratini va minus to'rt a c ni alohida hisoblang. Ozod had manfiy bo'lsa ikkinchi qo'shiluvchi musbat chiqadi va D kattalashadi.",
    'В каждом трёхчлене посчитай b в квадрате и минус четыре a c по отдельности. Если свободный член отрицателен, второе слагаемое выходит положительным и D растёт.',
    'In each trinomial compute b squared and minus four a c separately. When the constant term is negative the second part comes out positive and D grows.'),
};

export default function D18_07(props) { return <CodeLock data={DATA} {...props} />; }
