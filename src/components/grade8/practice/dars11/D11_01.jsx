// Dars11 · Amaliyot 01 — Ha yoki yo'q · 🟢 · tag: compare_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS07_11_AMALIYOT_SKELET.md §9 (11-dars, 1-pozitsiya)
//
// Darsning uchinchi xossasi: ildiz osti katta bo'lsa ildiz ham katta. Ikki
// tengsizlik ataylab bir xil ko'rinadi va IKKALASI HAM YOLG'ON (metodist
// qarori 2026-08-25: ha-yo'q topshiriqlarida javob naqshi bo'lmasin —
// DARS07_11_AMALIYOT_SKELET.md §10 p. 9):
//   17 > 16 = 4²  → ildiz to'rtdan KATTA, ya'ni «kichik» degan yozuv yolg'on;
//   30 < 36 = 6²  → ildiz oltidan KICHIK, ya'ni «katta» degan yozuv yolg'on.
// Ikki tengsizlikning belgisi qarama-qarshi, javob esa bir xil — «ildiz osti
// kattaroq ko'rinadi» degan tuyg'u shu yerda ishdan chiqadi: butun sonni
// KVADRATGA oshirib solishtirish kerak (З33).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'compare_claims', level: '🟢',
  itemSize: 18,
  items: [
    { id: 's1', tokens: [{ r: '17' }, '< 4'], yes: false,
      claim: L("tengsizlik to'g'ri", 'неравенство верно', 'the inequality is true') },
    { id: 's2', tokens: [{ r: '30' }, '> 6'], yes: false,
      claim: L("tengsizlik to'g'ri", 'неравенство верно', 'the inequality is true') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "Ikki tengsizlik. Ildizni hisoblash shart emas: butun sonni kvadratga oshirib solishtirish yetadi.",
    'Два неравенства. Считать корень не нужно: достаточно возвести целое число в квадрат и сравнить.',
    'Two inequalities. There is no need to compute the roots: squaring the whole number and comparing is enough.'),
  ask: L(
    "Tengsizlik to'g'ri bo'lsa «Ha» ni, noto'g'ri bo'lsa «Yo'q» ni bosing.",
    'Если неравенство верно — нажми «Да», если нет — «Нет».',
    'Tap «Yes» if the inequality is true, «No» if it is not.'),
  correctText: L(
    "To'g'ri. Ikkalasi ham yolg'on, va ikkalasida ham butun sonni kvadratga oshirdingiz. To'rtning kvadrati o'n olti, o'n olti esa o'n yettidan kichik — ildiz osti katta bo'lsa ildiz ham katta, demak o'n yettidan ildiz to'rtdan KATTA, kichik emas. Oltining kvadrati o'ttiz olti, o'ttiz olti esa o'ttizdan katta — demak o'ttizdan ildiz oltidan KICHIK, katta emas. Belgilar qarama-qarshi, javob esa bir xil.",
    'Верно. Оба ложны, и в обоих ты возвёл целое число в квадрат. Квадрат четырёх шестнадцать, а шестнадцать меньше семнадцати — больше подкоренное, больше корень, значит корень из семнадцати БОЛЬШЕ четырёх, а не меньше. Квадрат шести тридцать шесть, а тридцать шесть больше тридцати — значит корень из тридцати МЕНЬШЕ шести, а не больше. Знаки противоположны, а ответ один и тот же.',
    'Correct. Both are false, and in both you squared the whole number. Four squared is sixteen, and sixteen is less than seventeen — a bigger radicand means a bigger root, so the root of seventeen is MORE than four, not less. Six squared is thirty six, and thirty six is more than thirty — so the root of thirty is LESS than six, not more. The signs are opposite while the answer is the same.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Ikkinchi tengsizlikni kvadratlar bilan tekshiring: oltining kvadrati o'ttiz olti. O'ttiz o'ttiz oltidan kichik, demak o'ttizdan ildiz oltidan ham kichik — yozuvda esa katta deb turadi.",
      'Проверь второе неравенство квадратами: квадрат шести тридцать шесть. Тридцать меньше тридцати шести, значит корень из тридцати меньше шести — а в записи стоит больше.',
      'Check the second inequality with squares: six squared is thirty six. Thirty is less than thirty six, so the root of thirty is less than six — yet the record claims it is more.') },
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Birinchi tengsizlikni kvadratlar bilan tekshiring: to'rtning kvadrati o'n olti. O'n yetti o'n oltidan KATTA, demak o'n yettidan ildiz to'rtdan katta — yozuvda esa kichik deb turadi. Xossa shunday: ildiz osti katta bo'lsa ildiz ham katta.",
      'Проверь первое неравенство квадратами: квадрат четырёх шестнадцать. Семнадцать БОЛЬШЕ шестнадцати, значит корень из семнадцати больше четырёх — а в записи стоит меньше. Свойство такое: больше подкоренное — больше корень.',
      'Check the first inequality with squares: four squared is sixteen. Seventeen is MORE than sixteen, so the root of seventeen is more than four — yet the record claims it is less. The property says: a bigger radicand means a bigger root.') },
  ],
  wrongText: L(
    "Har tengsizlikda butun sonni kvadratga oshiring va ildiz ostidagi son bilan solishtiring. Katta ildiz osti katta ildiz beradi.",
    'В каждом неравенстве возведи целое число в квадрат и сравни с подкоренным. Большее подкоренное даёт больший корень.',
    'In each inequality square the whole number and compare it with the radicand. A bigger radicand gives a bigger root.'),
};

export default function D11_01(props) { return <TrueFalse data={DATA} {...props} />; }
