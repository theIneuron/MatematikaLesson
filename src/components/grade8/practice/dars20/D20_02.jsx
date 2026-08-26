// Dars20 · Amaliyot 02 — Ha yoki yo'q · 🟢 · tag: extraneous_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §8 (20-dars, 2-pozitsiya)
//
// З3 BIRINCHI QARASHDA. Birinchi mulohazada uch maxrajlarni nolga aylantiradi,
// ya'ni u ILDIZ BO'LOLMAYDI — hatto tenglikni tekshirib ham bo'lmaydi, chunki
// ikki tomonning ham qiymati yo'q. Maxrajlarga ko'paytirsangiz x teng uch
// chiqadi, lekin bu BEGONA ildiz (T3).
//
// Ikkinchi mulohaza oddiy holat: taqiq nolda, javob esa beshda — hech qanday
// ziddiyat yo'q, y teng besh haqiqiy ildiz.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'extraneous_claims', level: '🟢',
  itemSize: 15,
  items: [
    { id: 's1', yes: false,
      tokens: [{ n: 'x', d: 'x − 3' }, '=', { n: '3', d: 'x − 3' }],
      claim: L('x = 3 ildiz', 'x = 3 корень', 'x = 3 is a root') },
    { id: 's2', yes: true,
      tokens: [{ n: '1', d: 'y' }, '=', { n: '1', d: '5' }],
      claim: L('y = 5 ildiz', 'y = 5 корень', 'y = 5 is a root') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "Ikki tenglama va ikki da'vo. Har birida javobni ruhsat etilgan qiymatlar bilan solishtirish kerak.",
    'Два уравнения и два утверждения. В каждом ответ надо сверить с допустимыми значениями.',
    'Two equations and two claims. In each, the answer must be checked against the admissible values.'),
  ask: L(
    "Da'vo rost bo'lsa «Ha», yolg'on bo'lsa «Yo'q».",
    'Если утверждение верно — «Да», если ложно — «Нет».',
    'If the claim is true, «Yes»; if false, «No».'),
  correctText: L(
    "To'g'ri. Birinchi tenglamada ikki maxraj ham x minus uch, ya'ni uch taqiqlangan. Uchni qo'ysangiz ikki tomonda ham nolga bo'lish paydo bo'ladi — tenglikni tekshirish ham mumkin emas. Demak uch ildiz emas, u BEGONA ildiz: maxrajlarga ko'paytirilganda paydo bo'ladi, lekin asl tenglamaga to'g'ri kelmaydi. Ikkinchisida esa taqiq nolda, javob beshda — ziddiyat yo'q, va bir bo'lingan besh haqiqatan bir bo'lingan beshga teng.",
    'Верно. В первом уравнении оба знаменателя это x минус три, значит три запрещено. Подставь три — с обеих сторон возникнет деление на нуль, и равенство даже не проверить. Значит три не корень, а ПОСТОРОННИЙ: он появляется после умножения на знаменатели, но исходному уравнению не подходит. Во втором запрет в нуле, а ответ в пяти — противоречия нет, и одна пятая действительно равна одной пятой.',
    'Correct. In the first equation both denominators are x minus three, so three is banned. Substitute three and division by zero appears on both sides — the equality cannot even be tested. So three is not a root but an EXTRANEOUS one: it appears after multiplying by the denominators yet does not fit the original equation. In the second the ban is at zero while the answer is five — no conflict, and one fifth really equals one fifth.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Uch bu tenglamada ildiz bo'lolmaydi. Maxrajga qarang: x minus uch, va uchda u nolga aylanadi. Uchni qo'ysangiz uch bo'lingan nol degan yozuv chiqadi, bunday amal esa yo'q. Maxrajlarga ko'paytirib x teng uch olish mumkin, lekin bu javob ruhsat etilgan qiymatlardan CHETDA — u begona ildiz.",
      'Три не может быть корнем этого уравнения. Посмотри на знаменатель: x минус три, и в трёх он обращается в нуль. Подставь три — выйдет три делить на нуль, а такого действия нет. Умножив на знаменатели, можно получить x равно три, но этот ответ ВНЕ допустимых значений — он посторонний.',
      'Three cannot be a root of this equation. Look at the denominator: x minus three, which vanishes at three. Substitute three and you get three over zero, which is not an operation. Multiplying by the denominators can yield x equals three, but that answer lies OUTSIDE the admissible values — it is extraneous.') },
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Ikkinchi mulohaza rost. Bu tenglamada taqiq faqat nolda: y nolga teng bo'lsa maxraj nol bo'ladi. Javob esa besh, va u taqiqqa tegmaydi. Qo'yib tekshiring: bir bo'lingan besh bir bo'lingan beshga teng.",
      'Второе утверждение верно. В этом уравнении запрет только в нуле: при y равном нулю знаменатель нуль. А ответ пять, и запрета он не касается. Подставь и проверь: одна пятая равна одной пятой.',
      'The second claim is true. In this equation the ban is only at zero: at y equal to zero the denominator is zero. The answer is five, which does not touch the ban. Substitute and check: one fifth equals one fifth.') },
  ],
  wrongText: L(
    "Har tenglamada avval maxrajni nolga tenglab taqiqni toping, keyin javobni u bilan solishtiring. Taqiqqa tushgan javob ildiz emas.",
    'В каждом уравнении сначала найди запрет, приравняв знаменатель к нулю, потом сверь с ним ответ. Ответ, попавший под запрет, корнем не является.',
    'In each equation find the ban first by setting the denominator to zero, then compare the answer with it. An answer that falls under the ban is not a root.'),
};

export default function D20_02(props) { return <TrueFalse data={DATA} {...props} />; }
