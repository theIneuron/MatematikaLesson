// Dars06 · Amaliyot 10 — Javob · 🔴 · tag: full_transform
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Kontent: src/books/grade8/DARS06_AMALIYOT_KONTENT_V2.md §10
//
// Ilgari bu topshiriq 09-o'rinda va `TypeExpr` da turgan (javob IFODA bo'lib
// yozilardi). Metodist qarori 2026-08-24: o'nta mexanika 1-darsdan olinadi,
// `TypeExpr` esa u yerda yo'q. Bu misolda javob SON bo'lgani uchun savol
// o'zgarmadi: u `TypeValue` ga to'liq tushadi.
//
// (1/u − 1/(u + 3)) · (u(u + 3)/3):
//   qavs ichida umumiy maxraj u(u + 3), surat esa u + 3 − u = 3
//   -> 3/(u(u + 3)) · u(u + 3)/3 = 1
// Javob SON, lekin shartlar qolaveradi: u ≠ 0 va u ≠ −3. Darsning oxirgi
// xulosasi shu — javobda harf bo'lmasa ham, shart yo'qolmaydi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'full_transform', level: '🔴',
  target: 1, allowNeg: true,
  expr: ['(', { n: '1', d: 'u' }, '−', { n: '1', d: 'u + 3' }, ')', '·', { n: 'u(u + 3)', d: '3' }], exprSize: 19,
  eyebrow: L('Javob', 'Ответ', 'Answer'),
  setup: L(
    "Avval qavs ichi bitta kasrga aylantiriladi, keyin ko'paytirish bajariladi. Javob kutilmagan bo'lishi mumkin.",
    'Сначала скобка превращается в одну дробь, потом выполняется умножение. Ответ может оказаться неожиданным.',
    'First the bracket becomes a single fraction, then the multiplication is done. The answer may be unexpected.'),
  label: L('Javob', 'Ответ', 'Answer'),
  ask: L('Ifodaning qiymatini yozing.', 'Запиши значение выражения.', 'Write the value of the expression.'),
  correctText: L(
    "To'g'ri. Qavs ichida umumiy maxraj u karra u qo'shuv uch, surat esa u qo'shuv uch minus u, ya'ni uch. Keyin uch bo'linadi u karra u qo'shuv uch ga ni u karra u qo'shuv uch bo'linadi uchga ko'paytiramiz — hammasi qisqaradi va bir qoladi. Diqqat: javob son bo'lsa ham, shartlar qolaveradi — u nolga va minus uchga teng bo'lmasligi kerak.",
    'Верно. В скобке общий знаменатель u на u плюс три, а числитель u плюс три минус u, то есть три. Потом три делить на u на u плюс три умножаем на u на u плюс три делить на три — всё сокращается и остаётся единица. Внимание: даже когда ответ число, условия остаются — u не равно нулю и минус трём.',
    'Correct. In the bracket the common denominator is u times u plus three, and the numerator is u plus three minus u, that is three. Then three over u times u plus three is multiplied by u times u plus three over three — everything cancels and one is left. Note: even when the answer is a number, the conditions stay — u is not zero and not minus three.'),
  wrongs: [
    { when: (s) => s.value === 0, text: L(
      "Qavs ichi nolga teng emas: bir bo'linadi u ga va bir bo'linadi u qo'shuv uch ga — turli kasrlar. Ularning ayirmasi faqat maxrajlar teng bo'lgandagina nol bo'lardi. u ni birga teng qo'ying va hisoblang.",
      'Скобка не равна нулю: один делить на u и один делить на u плюс три — разные дроби. Их разность была бы нулём, только если бы знаменатели совпадали. Подставь u равное одному и посчитай.',
      'The bracket is not zero: one over u and one over u plus three are different fractions. Their difference would be zero only if the denominators matched. Put u equal to one and work it out.') },
    { when: (s) => s.value === 3, text: L(
      "Uch — bu qavs ichining SURATI, javob emas. Uni maxraj u karra u qo'shuv uch ga bo'ling, keyin ikkinchi ko'paytuvchiga ko'paytiring.",
      'Тройка — это ЧИСЛИТЕЛЬ скобки, а не ответ. Раздели её на знаменатель u на u плюс три, потом умножь на второй множитель.',
      'Three is the NUMERATOR of the bracket, not the answer. Divide it by the denominator u times u plus three, then multiply by the second factor.') },
    { when: (s) => s.value === -3 || s.value === -1, text: L(
      "Bu taqiqlangan qiymat, javob emas: minus uch va nol — u ning mumkin bo'lmagan qiymatlari. Savol esa IFODANING qiymatini so'radi.",
      'Это запрещённое значение, а не ответ: минус три и нуль — недопустимые значения u. А спрошено значение ВЫРАЖЕНИЯ.',
      'That is a forbidden value, not the answer: minus three and zero are impossible values of u. The question asked for the value of the EXPRESSION.') },
  ],
  wrongText: L(
    "Avval qavs ichini bitta kasrga aylantiring, keyin ikkinchi kasrga ko'paytiring va qisqartiring. Javobni u ning istalgan ruxsat etilgan qiymatida tekshiring.",
    'Сначала преврати скобку в одну дробь, потом умножь на вторую и сократи. Проверь ответ при любом допустимом значении u.',
    'First turn the bracket into a single fraction, then multiply by the second one and cancel. Check the answer at any allowed value of u.'),
};

export default function D06_10(props) { return <TypeValue data={DATA} {...props} />; }
