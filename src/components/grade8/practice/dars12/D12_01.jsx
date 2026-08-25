// Dars12 · Amaliyot 01 — Teng yoki teng emas · 🟢 · tag: product_or_sum
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS12_14_AMALIYOT_SKELET.md §3 (12-dars, 1-pozitsiya)
//
// DARSNING BUTUN OG'IRLIGI BIRINCHI TOPSHIRIQDA TURADI: ikki tenglik ustma-ust
// qo'yilgan va ular BIR XIL ko'rinadi. Farqi bitta belgida — birinchisida
// ko'paytirish, ikkinchisida qo'shish. Ko'paytmada tenglik bajariladi,
// yig'indida esa yo'q (З4, `Dars12.jsx` ning ikkinchi tasdig'i).
//
// Sonlar ATAYLAB to'liq kvadrat: o'quvchi ikki tomonni ham hisoblab, farqni
// SON bilan ko'radi — 10 va 10, keyin 5 va 7. Bu «qoidani eslash» emas,
// tekshirish.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'product_or_sum', level: '🟢',
  itemSize: 14,
  items: [
    { id: 's1', yes: true,
      tokens: [{ r: '4 · 25' }, '=', { r: '4' }, '·', { r: '25' }],
      claim: L("to'g'ri", 'верно', 'true') },
    { id: 's2', yes: false,
      tokens: [{ r: '9 + 16' }, '=', { r: '9' }, '+', { r: '16' }],
      claim: L("to'g'ri", 'верно', 'true') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L('Teng yoki teng emas', 'Равны или нет', 'Equal or not'),
  setup: L(
    "Ikki tenglik bir xil ko'rinadi. Farqi bitta belgida: birinchisida ildiz ostida ko'paytirish, ikkinchisida qo'shish turadi.",
    'Два равенства выглядят одинаково. Разница в одном знаке: под корнем в первом умножение, во втором сложение.',
    'Two equalities look the same. The difference is one sign: under the root the first has a product, the second a sum.'),
  ask: L(
    "Har tenglikni ikki tomonini hisoblab tekshiring: rost bo'lsa «Ha», yolg'on bo'lsa «Yo'q».",
    'Проверь каждое равенство, посчитав обе части: верно — «Да», ложно — «Нет».',
    'Check each equality by computing both sides: true means «Yes», false means «No».'),
  correctText: L(
    "To'g'ri. Birinchisida chap tomon to'rt karra yigirma besh, ya'ni yuzdan ildiz — o'n. O'ng tomon ikki karra besh — ham o'n. Ikkinchisida chap tomon to'qqiz qo'shuv o'n olti, ya'ni yigirma beshdan ildiz — besh. O'ng tomon esa uch qo'shuv to'rt — yetti. Besh va yetti teng emas. Ildiz KO'PAYTUVCHILARGA bo'linadi, hadlarga esa bo'linmaydi.",
    'Верно. В первом левая часть — четыре на двадцать пять, то есть корень из ста, это десять. Правая — два на пять, тоже десять. Во втором левая часть — девять плюс шестнадцать, то есть корень из двадцати пяти, это пять. А правая — три плюс четыре, семь. Пять и семь не равны. Корень раздаётся по МНОЖИТЕЛЯМ, а по слагаемым нет.',
    'Correct. In the first, the left side is four times twenty five, that is the root of a hundred, which is ten. The right side is two times five, also ten. In the second, the left side is nine plus sixteen, that is the root of twenty five, which is five. The right side is three plus four, seven. Five and seven are not equal. A root distributes over FACTORS, not over terms.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Ikkinchi tenglikni son bilan tekshiring. To'qqiz qo'shuv o'n olti yigirma besh, yigirma beshdan ildiz besh. O'ng tomonda esa uch qo'shuv to'rt, ya'ni yetti. Besh yettidan kichik, demak tenglik yolg'on: ildiz yig'indi bo'ylab tarqalmaydi.",
      'Проверь второе равенство числом. Девять плюс шестнадцать — двадцать пять, корень из двадцати пяти — пять. А справа три плюс четыре, то есть семь. Пять меньше семи, значит равенство ложно: по слагаемым корень не раздаётся.',
      'Check the second equality with numbers. Nine plus sixteen is twenty five, and the root of twenty five is five. On the right, three plus four is seven. Five is less than seven, so the equality is false: a root does not spread over terms.') },
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Birinchi tenglik rost, uni ham son bilan ko'ring. To'rt karra yigirma besh yuz, yuzdan ildiz o'n. Ikkidan ildiz emas — to'rtdan ildiz ikki, yigirma beshdan ildiz besh, ikki karra besh o'n. Ikki tomon ham o'n chiqdi.",
      'Первое равенство верно, посмотри и на него числом. Четыре на двадцать пять — сто, корень из ста — десять. Корень из четырёх два, корень из двадцати пяти пять, два на пять — десять. Обе части дали десять.',
      'The first equality is true, so check it with numbers as well. Four times twenty five is a hundred, and the root of a hundred is ten. The root of four is two, the root of twenty five is five, two times five is ten. Both sides gave ten.') },
  ],
  wrongText: L(
    "Har tenglikda ikki tomonni alohida hisoblang va sonlarni solishtiring. Ildiz ostidagi belgi ko'paytirish bo'lsa tenglik bajariladi, qo'shish bo'lsa yo'q.",
    'В каждом равенстве посчитай обе части по отдельности и сравни числа. Если под корнем умножение — равенство выполняется, если сложение — нет.',
    'In each equality compute both sides separately and compare the numbers. If the sign under the root is a product the equality holds, if it is a sum it does not.'),
};

export default function D12_01(props) { return <TrueFalse data={DATA} {...props} />; }
