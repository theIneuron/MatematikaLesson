// Dars01 · Amaliyot 03 — Ha yoki yo'q · 🟢 · tag: true_or_false
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse (yangi, 22-tip).
// Kontent: src/books/grade8/DARS01_AMALIYOT_KONTENT.md §03
//
// IKKI mulohaza, ikki qaror (metodist, 2026-08-22: ilgari to'rtta edi).
// Qolgan ikkitasi darsning eng qimmat ikki adashishiga tegadi:
//   s1 — З19: chiziq tagida SON turganda taqiq yo'q, javob «Yo'q»;
//   s2 — З18: surat noli qiymatni yo'q qilmaydi, javob «Ha».
// Olib tashlangan ikkitasi qoplovsiz qolmadi: a/(a−6) turidagi taqiq
// 04, 05, 07 va 09 da, «kvadratli maxrajda albatta nol bor» degan fikr esa
// 06 va 10 da tekshiriladi.
// `at` — matematika (tekshiriladigan qiymat), `claim` — so'z.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'true_or_false', level: '🟢',
  itemSize: 17,
  items: [
    { id: 's1', tokens: [{ n: 'a − 4', d: '5' }], at: 'a = 5', yes: false,
      claim: L("ma'noga ega emas", 'не имеет смысла', 'has no value') },
    { id: 's2', tokens: [{ n: '0', d: 'a − 2' }], at: 'a = 0', yes: true,
      claim: L('qiymati nolga teng', 'значение равно нулю', 'its value is zero') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "Ikki mulohaza. Har birida kasr, tekshiriladigan qiymat va da'vo turadi.",
    'Два утверждения. В каждом дробь, проверяемое значение и само утверждение.',
    'Two claims. Each shows a fraction, the value to test and the claim itself.'),
  ask: L(
    "Mulohaza rost bo'lsa «Ha» ni, yolg'on bo'lsa «Yo'q» ni bosing.",
    'Если утверждение верно — нажми «Да», если ложно — «Нет».',
    'Tap «Yes» if the claim is true, «No» if it is false.'),
  correctText: L(
    "To'g'ri. Birinchisida chiziq tagida SON turadi: besh nolga aylanmaydi, demak beshda ham kasr hisoblanadi — bir bo'linadi beshga. Ikkinchisida esa nol chiziqning USTIDA: nolni minus ikkiga bo'lsangiz nol chiqadi, ya'ni qiymat bor va u nolga teng.",
    'Верно. В первом под чертой стоит ЧИСЛО: пять в нуль не обращается, и при пяти дробь считается — один делить на пять. Во втором нуль стоит НАД чертой: нуль разделить на минус два — нуль, значение есть и равно нулю.',
    'Correct. In the first a NUMBER stands below the bar: five never becomes zero, so at five the fraction is computed — one divided by five. In the second the zero is ABOVE the bar: zero over minus two is zero, so the value exists and equals zero.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Birinchi mulohazada chiziq tagida SON turadi. Besh hech qachon nolga aylanmaydi, a esa faqat suratda: beshni qo'ysangiz bir bo'linadi beshga, qiymat bor.",
      'В первом утверждении под чертой стоит ЧИСЛО. Пять в нуль не обращается никогда, а a осталась только в числителе: подставь пять — получится один делить на пять, значение есть.',
      'In the first claim a NUMBER stands below the bar. Five never becomes zero, and a stays only in the numerator: substitute five and you get one divided by five, a real value.') },
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Ikkinchi mulohazada nol chiziqning USTIDA. Nolni ikkiga, minus ikkiga, yuzga bo'lsangiz — har doim nol. Qiymat yo'qoladigan joy faqat chiziq tagi.",
      'Во втором утверждении нуль стоит НАД чертой. Нуль, делённый на два, на минус два, на сто — всегда нуль. Значение исчезает только под чертой.',
      'In the second claim the zero is ABOVE the bar. Zero divided by two, by minus two, by a hundred is always zero. The value disappears only below the bar.') },
  ],
  wrongText: L(
    "Har mulohazada bitta ish qiling: qiymatni chiziq tagiga qo'ying va maxraj nol bo'ladimi deb qarang.",
    'В каждом утверждении делай одно: подставь значение под черту и посмотри, стал ли знаменатель нулём.',
    'Do one thing in each claim: put the value below the bar and check whether the denominator became zero.'),
};

export default function D01_03(props) { return <TrueFalse data={DATA} {...props} />; }
