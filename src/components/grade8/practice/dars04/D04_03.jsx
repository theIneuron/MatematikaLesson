// Dars04 · Amaliyot 03 — Ha yoki yo'q · 🟢 · tag: bans_from_both
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Kontent: src/books/grade8/DARS04_AMALIYOT_KONTENT_V2.md §03
//
// Ilgari bu savol `NumberLine` da turgan (o'qdagi ikki nuqta). Metodist
// qarori 2026-08-24: o'nta mexanika 1-darsdan olinadi, shuning uchun savol
// ikki MULOHAZAga aylandi — ha va yo'q.
//
// Yig'indi ikkala qo'shiluvchi mavjud bo'lgan joydagina mavjud, ya'ni taqiq
// HAR IKKI maxrajdan keladi:
//   s1 — d = 2: birinchi maxraj nolga aylanadi, yig'indi yo'q     (HA)
//   s2 — d = 6: hech qaysi maxraj nolga aylanmaydi, yig'indi bor  (YO'Q)
// s2 dagi tuzoq — ishora: maxrajda olti turibdi, lekin u d QO'SHUV olti.
// Dastlabki yig'indi `given` qatorida turadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'bans_from_both', level: '🟢',
  itemSize: 16,
  given: [[{ n: '3', d: 'd − 2' }, '+', { n: '5', d: 'd + 6' }]],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  items: [
    { id: 's1', tokens: [{ n: '3', d: 'd − 2' }], at: 'd = 2', yes: true,
      claim: L("yig'indi ma'noga ega emas", 'сумма не имеет смысла', 'the sum has no value') },
    { id: 's2', tokens: [{ n: '5', d: 'd + 6' }], at: 'd = 6', yes: false,
      claim: L("yig'indi ma'noga ega emas", 'сумма не имеет смысла', 'the sum has no value') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "Yuqorida ikki kasrning yig'indisi. Har qatorda bitta qo'shiluvchi va tekshiriladigan qiymat turadi.",
    'Сверху сумма двух дробей. В каждой строке одно слагаемое и проверяемое значение.',
    'Above is the sum of two fractions. Each row shows one summand and the value to test.'),
  ask: L(
    "Mulohaza rost bo'lsa «Ha» ni, yolg'on bo'lsa «Yo'q» ni bosing.",
    'Если утверждение верно — нажми «Да», если ложно — «Нет».',
    'Tap «Yes» if the claim is true, «No» if it is false.'),
  correctText: L(
    "To'g'ri. Yig'indi faqat ikkala qo'shiluvchi ham mavjud bo'lgan joyda mavjud. Ikkida birinchi maxraj nolga aylanadi — birinchi qo'shiluvchi yo'q, demak yig'indi ham yo'q. Oltida esa hech narsa buzilmaydi: d qo'shuv olti o'n ikkiga teng, d minus ikki to'rtga. Yig'indi bemalol hisoblanadi.",
    'Верно. Сумма существует только там, где существуют оба слагаемых. При двух первый знаменатель обращается в нуль — первого слагаемого нет, значит нет и суммы. А при шести не ломается ничего: d плюс шесть равно двенадцати, d минус два — четырём. Сумма спокойно считается.',
    'Correct. A sum exists only where both summands exist. At two the first denominator becomes zero — the first summand is missing, so the sum is missing too. At six nothing breaks: d plus six is twelve and d minus two is four. The sum computes fine.'),
  wrongs: [
    { when: (s) => s.ans.s2 === true, text: L(
      "Ishorani tekshiring: d qo'shuv olti nolga MINUS oltida aylanadi, arti oltida esa u o'n ikkiga teng. Maxrajdagi son emas, uning NOLI muhim.",
      'Проверь знак: d плюс шесть обращается в нуль при МИНУС шести, а при плюс шести он равен двенадцати. Важно не число в знаменателе, а его НУЛЬ.',
      'Check the sign: d plus six becomes zero at MINUS six, while at plus six it equals twelve. What matters is not the number in the denominator but its ZERO.') },
    { when: (s) => s.ans.s1 === false, text: L(
      "Ikkida d minus ikki nolga aylanadi. Birinchi qo'shiluvchi o'sha yerda mavjud emas, va mavjud bo'lmagan narsani biror narsaga qo'shib bo'lmaydi — yig'indi ham yo'qoladi.",
      'При двух d минус два обращается в нуль. Первого слагаемого там нет, а к несуществующему ничего прибавить нельзя — исчезает и сумма.',
      'At two, d minus two becomes zero. The first summand does not exist there, and nothing can be added to what does not exist — the sum disappears too.') },
  ],
  wrongText: L(
    "Yig'indining sharti HAR IKKI maxrajdan yig'iladi: har birini alohida nolga tenglang. Maxrajdagi songa emas, uning noliga qarang.",
    'Условие суммы собирается из ОБОИХ знаменателей: приравняй каждый к нулю по отдельности. Смотри не на число в знаменателе, а на его нуль.',
    'The condition of a sum is collected from BOTH denominators: set each to zero separately. Look not at the number in the denominator but at its zero.'),
};

export default function D04_03(props) { return <TrueFalse data={DATA} {...props} />; }
