// Dars11 · Amaliyot 01 — Ha yoki yo'q · 🟢 · tag: compare_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS07_11_AMALIYOT_SKELET.md §9 (11-dars, 1-pozitsiya)
//
// Darsning uchinchi xossasi: ildiz osti katta bo'lsa ildiz ham katta. Ikki
// tengsizlik ataylab bir xil ko'rinadi, lekin javoblari qarama-qarshi:
//   17 > 16 = 4²  → ildiz to'rtdan katta, «Ha»;
//   30 < 36 = 6²  → ildiz oltidan KICHIK, «Yo'q».
// Ya'ni «ildiz osti kattaroq ko'rinadi» degan tuyg'u ishlamaydi: butun sonni
// KVADRATGA oshirib solishtirish kerak (З33).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'compare_claims', level: '🟢',
  itemSize: 18,
  items: [
    { id: 's1', tokens: [{ r: '17' }, '> 4'], yes: true,
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
    "To'g'ri. Ikkalasida ham butun sonni kvadratga oshirdingiz. To'rtning kvadrati o'n olti, va o'n olti o'n yettidan kichik — ildiz osti katta bo'lsa ildiz ham katta, demak birinchi tengsizlik rost. Oltining kvadrati o'ttiz olti, va o'ttiz olti o'ttizdan KATTA — demak oltidan ildiz o'ttizdan ildizdan katta, ikkinchi tengsizlik esa yolg'on.",
    'Верно. В обоих случаях ты возвёл целое число в квадрат. Квадрат четырёх шестнадцать, и шестнадцать меньше семнадцати — больше подкоренное, больше корень, значит первое неравенство верно. Квадрат шести тридцать шесть, и тридцать шесть БОЛЬШЕ тридцати — значит шесть больше корня из тридцати, и второе неравенство ложно.',
    'Correct. In both you squared the whole number. Four squared is sixteen, and sixteen is less than seventeen — a bigger radicand means a bigger root, so the first inequality holds. Six squared is thirty six, and thirty six is MORE than thirty — so six is bigger than the root of thirty, and the second inequality is false.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Ikkinchi tengsizlikni kvadratlar bilan tekshiring: oltining kvadrati o'ttiz olti. O'ttiz o'ttiz oltidan kichik, demak o'ttizdan ildiz oltidan ham kichik. Ildiz osti kichik — ildiz ham kichik.",
      'Проверь второе неравенство квадратами: квадрат шести тридцать шесть. Тридцать меньше тридцати шести, значит корень из тридцати меньше шести. Меньше подкоренное — меньше корень.',
      'Check the second inequality with squares: six squared is thirty six. Thirty is less than thirty six, so the root of thirty is less than six. A smaller radicand means a smaller root.') },
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Birinchi tengsizlikni kvadratlar bilan tekshiring: to'rtning kvadrati o'n olti. O'n yetti o'n oltidan katta, demak o'n yettidan ildiz to'rtdan katta. Xossa shunday: ildiz osti katta bo'lsa ildiz ham katta.",
      'Проверь первое неравенство квадратами: квадрат четырёх шестнадцать. Семнадцать больше шестнадцати, значит корень из семнадцати больше четырёх. Свойство такое: больше подкоренное — больше корень.',
      'Check the first inequality with squares: four squared is sixteen. Seventeen is more than sixteen, so the root of seventeen is more than four. The property says: a bigger radicand means a bigger root.') },
  ],
  wrongText: L(
    "Har tengsizlikda butun sonni kvadratga oshiring va ildiz ostidagi son bilan solishtiring. Katta ildiz osti katta ildiz beradi.",
    'В каждом неравенстве возведи целое число в квадрат и сравни с подкоренным. Большее подкоренное даёт больший корень.',
    'In each inequality square the whole number and compare it with the radicand. A bigger radicand gives a bigger root.'),
};

export default function D11_01(props) { return <TrueFalse data={DATA} {...props} />; }
