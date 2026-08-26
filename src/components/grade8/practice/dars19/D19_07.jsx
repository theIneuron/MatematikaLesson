// Dars19 · Amaliyot 07 — Pazl · 🟡 · tag: pq_pairs
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §7 (19-dars, 7-pozitsiya)
//
// З45 TO'LIQ OCHILADI. Uch juftlikning ikkitasida ildizlarning KO'PAYTMASI
// bir xil — minus o'n (`−2 va 5` hamda `2 va −5`), demak q ni ajratib
// turmaydi. Faqat p ajratadi, va u yig'indining TESKARISI:
//   2 va 5   → yig'indi 7  → p = −7;
//   −2 va 5  → yig'indi 3  → p = −3;
//   2 va −5  → yig'indi −3 → p = 3.
// Kartalar qisqa: ildiz juftligi ham, p ning qiymati ham kvadrat kartaga
// sig'adi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'pq_pairs', level: '🟡',
  faceSize: 13,
  cards: [
    { id: 'f1', side: 0, v: '2 va 5' },
    { id: 'f2', side: 0, v: '−2 va 5' },
    { id: 'f3', side: 0, v: '2 va −5' },
    { id: 'v1', side: 1, v: 'p = −7' },
    { id: 'v2', side: 1, v: 'p = −3' },
    { id: 'v3', side: 1, v: 'p = 3' },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "Uch juft ildiz berilgan. Har juftlik uchun ikkinchi koeffitsiyentni topish kerak: yig'indi minus p ga teng, demak p yig'indining teskarisi.",
    'Даны три пары корней. Для каждой надо найти второй коэффициент: сумма равна минус p, значит p противоположно сумме.',
    'Three pairs of roots are given. For each you must find the second coefficient: the sum equals minus p, so p is the opposite of the sum.'),
  ask: L(
    "Juftlikni bosing, keyin uyani bosing.",
    'Нажми пару, потом ячейку.',
    'Tap a pair, then a slot.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Birinchisida yig'indi yetti, demak p minus yetti. Ikkinchisida minus ikki qo'shuv besh uch, demak p minus uch. Uchinchisida ikki qo'shuv minus besh minus uch, demak p arti uch. Diqqat qiling: oxirgi ikki juftlikda KO'PAYTMA bir xil — minus o'n, ya'ni ozod had ularni ajratib turmaydi. Faqat ikkinchi koeffitsiyent ajratadi.",
    'Верно. В первой сумма семь, значит p минус семь. Во второй минус два плюс пять три, значит p минус три. В третьей два плюс минус пять минус три, значит p плюс три. Обрати внимание: у последних двух пар ПРОИЗВЕДЕНИЕ одинаково — минус десять, то есть свободный член их не различает. Различает только второй коэффициент.',
    'Correct. In the first the sum is seven, so p is minus seven. In the second minus two plus five is three, so p is minus three. In the third two plus minus five is minus three, so p is plus three. Notice: the last two pairs share their PRODUCT — minus ten — so the constant term does not tell them apart. Only the second coefficient does.'),
  wrongs: [
    { when: (s) => s.mate.f2 === 'v3' || s.mate.f3 === 'v2', text: L(
      "Bu ikki juftlikni ajratadigan narsa faqat ishora. Yig'indini hisoblang: minus ikki qo'shuv besh ARTI uch, demak p minus uch. Ikki qo'shuv minus besh esa MINUS uch, demak p arti uch. Ikkalasining ko'paytmasi bir xil — minus o'n, shuning uchun ozod hadga qarash yordam bermaydi.",
      'Эти две пары различает только знак. Посчитай сумму: минус два плюс пять ПЛЮС три, значит p минус три. А два плюс минус пять это МИНУС три, значит p плюс три. Произведение у обеих одинаково — минус десять, поэтому свободный член не поможет.',
      'Only the sign tells these two pairs apart. Compute the sum: minus two plus five is PLUS three, so p is minus three. Two plus minus five is MINUS three, so p is plus three. Both share the product minus ten, so looking at the constant term does not help.') },
    { when: (s) => s.mate.f1 !== 'v1', text: L(
      "Birinchi juftlikda ikkala ildiz ham musbat, demak yig'indi ham musbat: ikki qo'shuv besh yetti. p esa yig'indining teskarisi — minus yetti. Musbat p faqat yig'indi manfiy bo'lganda chiqadi.",
      'В первой паре оба корня положительны, значит и сумма положительна: два плюс пять семь. А p противоположно сумме — минус семь. Положительное p выходит только при отрицательной сумме.',
      'In the first pair both roots are positive, so their sum is positive: two plus five is seven. And p is the opposite of the sum — minus seven. A positive p appears only when the sum is negative.') },
    { when: (s) => s.mate.f1 === 'v2' || s.mate.f1 === 'v3', text: L(
      "Yig'indini oxirigacha hisoblang: ikki qo'shuv besh yetti, uch emas. Uch degan yig'indi ikkinchi juftlikda chiqadi, u yerda bitta ildiz manfiy.",
      'Посчитай сумму до конца: два плюс пять семь, а не три. Сумма три выходит во второй паре, где один корень отрицателен.',
      'Compute the sum to the end: two plus five is seven, not three. A sum of three comes from the second pair, where one root is negative.') },
  ],
  wrongText: L(
    "Har juftlikda ildizlarni qo'shing, keyin natijaning TESKARISINI oling — bu p. Ko'paytma bu topshiriqda yordam bermaydi: ikki juftlikda u bir xil.",
    'В каждой паре сложи корни, потом возьми ПРОТИВОПОЛОЖНОЕ — это p. Произведение здесь не помощник: у двух пар оно одинаково.',
    'Add the roots in each pair, then take the OPPOSITE — that is p. The product is no help here: two of the pairs share it.'),
};

export default function D19_07(props) { return <PairSlots data={DATA} {...props} />; }
