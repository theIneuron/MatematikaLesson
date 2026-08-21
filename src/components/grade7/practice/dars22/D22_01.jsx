// Dars22 · Amaliyot 01 — Umumiy ko'paytuvchi qaysi · 🟢 · choice · tag: which_common
// Mexanika: kit.jsx -> Choice. Raskladka: 22-dars, 1-o'rin (isinish).
// 20y³ + 35y²: sonlarda umumiy bo'luvchi 5, harfda eng kichik daraja y².
// Ya'ni 5y². Xato variantlar: 5y (harfni to'liq olmagan), 20y² (20 ikkinchi
// hadda yo'q).
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'which_common', level: '🟢', optCols: 3,
  eyebrow: L("Umumiy ko'paytuvchi", 'Общий множитель', 'The common factor'),
  setup: L(
    "Umumiy ko'paytuvchi ikki narsadan yig'iladi: sonlarning umumiy bo'luvchisi va harfning eng KICHIK darajasi.",
    'Общий множитель складывается из двух вещей: общего делителя чисел и НАИМЕНЬШЕЙ степени буквы.',
    'The common factor has two parts: the common divisor of the numbers and the LOWEST power of the letter.'),
  expr: ['20y³', '+', '35y²'], exprSize: 32,
  ask: L("Eng katta umumiy ko'paytuvchi qaysi?", 'Какой наибольший общий множитель?', 'What is the greatest common factor?'),
  opts: [{ label: ['5y²'] }, { label: ['5y'] }, { label: ['20y²'] }],
  correct: 0,
  correctText: L(
    "To'g'ri. 20 va 35 ning umumiy bo'luvchisi 5, y ning eng kichik darajasi ikki. Ya'ni 5y², qavsda 4y + 7 qoladi.",
    'Верно. Общий делитель 20 и 35 это 5, наименьшая степень y вторая. Значит 5y², в скобке останется 4y + 7.',
    'Correct. The common divisor of 20 and 35 is 5, the lowest power of y is two. So 5y², leaving 4y + 7 inside.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "5y ham umumiy, lekin eng katta emas: ikki hadda ham y² bor, shuning uchun y² ni chiqarish mumkin.",
      '5y тоже общий, но не наибольший: в обоих членах есть y², поэтому можно вынести y².',
      '5y is common but not the greatest: both terms hold y², so y² can be taken out.') },
    { when: (s) => s.picked === 2, text: L(
      "20 ikkinchi hadga bo'linmaydi: 35 ni 20 ga bo'lib bo'lmaydi. Umumiy bo'luvchi 5.",
      '20 не делит второй член: 35 на 20 не делится. Общий делитель это 5.',
      '20 does not divide the second term: 35 is not divisible by 20. The common divisor is 5.') },
  ],
  wrongText: L(
    "Ikki savol: qanday son 20 ni ham, 35 ni ham bo'ladi? y ning eng kichik darajasi qanday?",
    'Два вопроса: какое число делит и 20, и 35? Какая наименьшая степень y?',
    'Two questions: which number divides both 20 and 35? What is the lowest power of y?'),
};

export default function D22_01(props) { return <Choice data={DATA} {...props} />; }
