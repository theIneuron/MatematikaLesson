// Dars19 · Amaliyot 10 — Juftlash · 🔴 · tag: roots_to_equation
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §7 (19-dars, 10-pozitsiya)
//
// TESKARI TEOREMA: ildizlardan tenglama yasaladi. To'rt juftlikda bir xil
// sonlar — bir va olti, faqat ishoralari boshqa. Ikki qoida birga ishlaydi:
//   yig'indi p ni beradi (ishora ALMASHADI),
//   ko'paytma q ni beradi (ishora SAQLANADI).
//   1 va 6   → yig'indi 7,  ko'paytma 6  → x² − 7x + 6
//   −1 va −6 → yig'indi −7, ko'paytma 6  → x² + 7x + 6
//   −1 va 6  → yig'indi 5,  ko'paytma −6 → x² − 5x − 6
//   1 va −6  → yig'indi −5, ko'paytma −6 → x² + 5x − 6
// З45 va З46 bir topshiriqda: ishorani ham, juftlikni ham to'g'ri olish kerak.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const DATA = {
  tag: 'roots_to_equation', level: '🔴',
  connect: true,
  targetSize: 14,
  items: [
    { id: 'm1', label: L('1 va 6', '1 и 6', '1 and 6') },
    { id: 'm2', label: L('−1 va −6', '−1 и −6', '−1 and −6') },
    { id: 'm3', label: L('−1 va 6', '−1 и 6', '−1 and 6') },
    { id: 'm4', label: L('1 va −6', '1 и −6', '1 and −6') },
  ],
  targets: [
    { id: 't1', tokens: ['x² − 7x + 6 = 0'] },
    { id: 't2', tokens: ['x² + 7x + 6 = 0'] },
    { id: 't3', tokens: ['x² − 5x − 6 = 0'] },
    { id: 't4', tokens: ['x² + 5x − 6 = 0'] },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Juftlash', 'Пары', 'Pairs'),
  setup: L(
    "Teskari teorema: ildizlar berilgan, tenglamani yasash kerak. To'rt juftlikda bir xil sonlar, farqi faqat ishoralarda.",
    'Обратная теорема: корни даны, уравнение надо составить. В четырёх парах одни и те же числа, различаются только знаки.',
    'The converse theorem: the roots are given and the equation must be built. The four pairs hold the same numbers, differing only in signs.'),
  ask: L(
    "Chapdan ildizlarni bosing, keyin o'ngdan uning tenglamasini bosing.",
    'Нажми корни слева, потом его уравнение справа.',
    'Tap the roots on the left, then its equation on the right.'),
  correctText: L(
    "To'g'ri. Ikki qoida birga ishlaydi. Birinchisida yig'indi yetti, demak p minus yetti; ko'paytma olti, demak q arti olti. Ikkinchisida yig'indi minus yetti, p arti yetti; ko'paytma esa yana arti olti — ikki manfiy son ko'paytmasi musbat. Uchinchi va to'rtinchisida bitta ildiz manfiy, demak ko'paytma minus olti; yig'indilari besh va minus besh, ya'ni p minus besh va arti besh.",
    'Верно. Два правила работают вместе. В первой сумма семь, значит p минус семь; произведение шесть, значит q плюс шесть. Во второй сумма минус семь, p плюс семь; а произведение снова плюс шесть — произведение двух отрицательных положительно. В третьей и четвёртой один корень отрицателен, значит произведение минус шесть; суммы пять и минус пять, то есть p минус пять и плюс пять.',
    'Correct. The two rules work together. In the first the sum is seven, so p is minus seven; the product is six, so q is plus six. In the second the sum is minus seven and p is plus seven; the product is plus six again — two negatives multiply to a positive. In the third and fourth one root is negative, so the product is minus six; their sums are five and minus five, so p is minus five and plus five.'),
  wrongs: [
    { when: (s) => s.pair.m1 === 't2' || s.pair.m2 === 't1', text: L(
      "Bu ikki tenglamada q bir xil — arti olti, chunki ikki manfiy sonning ko'paytmasi ham musbat. Ajratadigan narsa p: birinchi juftlikda yig'indi arti yetti, demak p MINUS yetti; ikkinchisida yig'indi minus yetti, demak p ARTI yetti.",
      'У этих двух уравнений q одинаково — плюс шесть, ведь произведение двух отрицательных тоже положительно. Различает p: в первой паре сумма плюс семь, значит p МИНУС семь; во второй сумма минус семь, значит p ПЛЮС семь.',
      'These two equations share q — plus six, since two negatives also multiply to a positive. p tells them apart: in the first pair the sum is plus seven, so p is MINUS seven; in the second the sum is minus seven, so p is PLUS seven.') },
    { when: (s) => s.pair.m3 === 't4' || s.pair.m4 === 't3', text: L(
      "Bu ikki juftlikda ham ko'paytma minus olti, ya'ni q ularni ajratmaydi. Yig'indini hisoblang: minus bir qo'shuv olti ARTI besh, demak p minus besh; bir qo'shuv minus olti MINUS besh, demak p arti besh.",
      'У этих двух пар произведение тоже минус шесть, то есть q их не различает. Посчитай сумму: минус один плюс шесть ПЛЮС пять, значит p минус пять; один плюс минус шесть МИНУС пять, значит p плюс пять.',
      'Both these pairs have the product minus six, so q does not tell them apart. Compute the sum: minus one plus six is PLUS five, so p is minus five; one plus minus six is MINUS five, so p is plus five.') },
    { when: (s) => s.pair.m1 === 't3' || s.pair.m1 === 't4' || s.pair.m2 === 't3' || s.pair.m2 === 't4', text: L(
      "Avval ozod hadga qarang: u KO'PAYTMANI beradi va ishorasi almashmaydi. Bir karra olti arti olti, minus bir karra minus olti ham arti olti — demak bu ikki juftlik faqat arti oltili tenglamalarga tegishli. Minus oltili tenglamalarda bitta ildiz manfiy bo'lishi kerak.",
      'Сначала смотри на свободный член: он даёт ПРОИЗВЕДЕНИЕ и знак у него не меняется. Один на шесть плюс шесть, минус один на минус шесть тоже плюс шесть — значит эти две пары относятся только к уравнениям с плюс шесть. В уравнениях с минус шесть один корень должен быть отрицательным.',
      'Look at the constant term first: it gives the PRODUCT and keeps its sign. One times six is plus six, minus one times minus six is plus six too — so these two pairs belong only to the equations with plus six. Equations with minus six need one negative root.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har juftlikda ikki hisob qiling: ko'paytma q ni beradi (ishora saqlanadi), yig'indi esa p ni beradi (ishora almashadi). Ikkisi birga faqat bitta tenglamaga to'g'ri keladi.",
      'В каждой паре сделай два вычисления: произведение даёт q (знак сохраняется), сумма даёт p (знак меняется). Вместе они подходят только к одному уравнению.',
      'Do two computations for each pair: the product gives q (sign kept), the sum gives p (sign flipped). Together they fit exactly one equation.') },
  ],
  wrongText: L(
    "Ikki hisob: ko'paytma ozod hadni beradi, yig'indi esa ikkinchi koeffitsiyentni — lekin TESKARI ishora bilan. Javobni ildizlarni tenglamaga qo'yib tekshiring.",
    'Два вычисления: произведение даёт свободный член, сумма — второй коэффициент, но с ОБРАТНЫМ знаком. Ответ проверь подстановкой корней.',
    'Two computations: the product gives the constant term, the sum gives the second coefficient — but with the OPPOSITE sign. Check by substituting the roots.'),
};

export default function D19_10(props) { return <MatchPairs data={DATA} {...props} />; }
