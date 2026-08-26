// Dars06 · Amaliyot 03 — Ha yoki yo'q · 🟢 · tag: transform_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Kontent: src/books/grade8/DARS06_AMALIYOT_KONTENT_V2.md §03
//
// Ilgari bu o'rinda `MatchPairs` turgan (u endi 07 da). Metodist qarori
// 2026-08-24: mexanikalar 1-darsdan, ketma-ketlik esa har darsda boshqacha.
//
// IKKI tenglik faqat QAVS bilan farq qiladi, javob esa ikkalasida bir xil
// ko'rsatilgan. Metodist qarori 2026-08-25 bo'yicha javob naqshi bo'lmasligi
// kerak, shuning uchun bu darsda YOLG'ON tenglik BIRINCHI turadi:
//   s1 — qavs yo'q: avval ko'paytirish, natija bir bo'linadi n ga qo'shuv bir
//        va u ikkiga teng emas                                       (YO'Q)
//   s2 — qavs bor: avval qo'shish, keyin ko'paytirish, natija ikki   (HA)
// Shu sababli «qavssiz ham qavsdek hisoblash» adashishi darsning boshida
// tutiladi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'transform_claims', level: '🟢',
  itemSize: 14,
  items: [
    { id: 's1', tokens: [{ n: '1', d: 'n' }, '+', { n: '1', d: 'n' }, '·', 'n', '=', '2'], yes: false,
      claim: L("to'g'ri", 'верно', 'right') },
    { id: 's2', tokens: ['(', { n: '1', d: 'n' }, '+', { n: '1', d: 'n' }, ')', '·', 'n', '=', '2'], yes: true,
      claim: L("to'g'ri", 'верно', 'right') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "Ikki tenglik. Yozuvlar faqat QAVS bilan farq qiladi, javob esa ikkalasida bir xil.",
    'Два равенства. Записи отличаются только СКОБКОЙ, а ответ в обоих один.',
    'Two equalities. The records differ only by a BRACKET, and the answer shown is the same in both.'),
  ask: L(
    "Tenglik to'g'ri bo'lsa «Ha» ni, noto'g'ri bo'lsa «Yo'q» ni bosing.",
    'Если равенство верно — нажми «Да», если неверно — «Нет».',
    'Tap «Yes» if the equality is right, «No» if it is wrong.'),
  correctText: L(
    "To'g'ri. Qavs bo'lmasa avval ko'paytirish bajariladi: bir bo'linadi n ga karra n bir beradi, natija bir bo'linadi n ga qo'shuv bir — bu ikkiga teng emas. Qavs bo'lsa esa avval qo'shish: bir bo'linadi n ga qo'shuv bir bo'linadi n ga ikki bo'linadi n ga teng, uni n ga ko'paytirsak ikki chiqadi. n ni ikkiga teng qo'ying: birinchi tenglikda bir yarim, ikkinchisida ikki.",
    'Верно. Без скобки сначала умножение: один делить на n на n даёт единицу, остаётся один делить на n плюс один — и это не два. Со скобкой сначала сложение: один делить на n плюс один делить на n это два делить на n, и умножение на n даёт два. Подставь n равное двум: в первом равенстве полтора, во втором два.',
    'Correct. Without a bracket the multiplication comes first: one over n times n is one, so the result is one over n plus one — and that is not two. With a bracket the addition comes first: one over n plus one over n is two over n, and multiplying by n gives two. Put n equal to two: the first equality gives one and a half, the second gives two.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Bu yerda qavs yo'q, demak avval KO'PAYTIRISH bajariladi: bir bo'linadi n ga karra n bir beradi. Natija bir bo'linadi n ga qo'shuv bir, va u ikkiga teng emas. n ni ikkiga teng qo'ying: bir yarim chiqadi.",
      'Здесь скобки нет, значит сначала УМНОЖЕНИЕ: один делить на n на n даёт единицу. Остаётся один делить на n плюс один, и это не два. Подставь n равное двум: выйдет полтора.',
      'There is no bracket here, so the MULTIPLICATION comes first: one over n times n is one. What is left is one over n plus one, and that is not two. Put n equal to two: you get one and a half.') },
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Qavs bor, va u avval bajariladi: bir bo'linadi n ga qo'shuv bir bo'linadi n ga ikki bo'linadi n ga teng. Uni n ga ko'paytirsangiz, n qisqaradi va ikki qoladi.",
      'Скобка есть, и она выполняется первой: один делить на n плюс один делить на n — это два делить на n. Умножь на n, n сократится и останется два.',
      'The bracket is there and it comes first: one over n plus one over n is two over n. Multiply by n, the n cancels and two is left.') },
  ],
  wrongText: L(
    "Avval qavsga qarang: u bo'lsa, ichidagi amal birinchi bajariladi. Qavs bo'lmasa — ko'paytirish oldin.",
    'Сначала смотри на скобку: если она есть, действие внутри выполняется первым. Если скобки нет — умножение раньше.',
    'Look at the bracket first: if it is there, the action inside comes first. If not, the multiplication comes first.'),
};

export default function D06_03(props) { return <TrueFalse data={DATA} {...props} />; }
