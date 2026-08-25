// Dars04 · Amaliyot 06 — Teshik · 🟡 · tag: zero_but_banned
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Kontent: src/books/grade8/DARS04_AMALIYOT_KONTENT_V2.md §06
//
// Ilgari bu topshiriq 10-o'rinda va `HoleSlider` da turgan. Metodist qarori
// 2026-08-24: o'nta mexanika 1-darsdan olinadi, shuning uchun o'sha son endi
// KLAVIATURADAN yoziladi. Savol o'zgarmadi.
//
// Bir xil ikki kasrning ayirmasi hamma joyda nolga teng — DEYARLI. To'rtda
// ikkala qo'shiluvchining maxraji nolga aylanadi, ya'ni qo'shiluvchilarning
// O'ZI mavjud emas, demak ayirma ham yo'q. «Javob nol, demak shart kerak
// emas» degan fikr shu yerda o'ladi.
// Tuzoqlar: 0 (hech narsa buzilmaydi), −4 (ishora), 3 (suratdagi son).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'zero_but_banned', level: '🟡',
  target: 4, allowNeg: true,
  expr: [{ n: '3', d: 'u − 4' }, '−', { n: '3', d: 'u − 4' }], exprSize: 26,
  eyebrow: L('Teshik', 'Дырка', 'The hole'),
  setup: L(
    "Bir xil ikki kasrning ayirmasi. U hamma joyda nolga teng — deyarli: bitta nuqtada ayirmaning o'zi mavjud emas.",
    'Разность двух одинаковых дробей. Она всюду равна нулю — почти: в одной точке самой разности не существует.',
    'The difference of two identical fractions. It equals zero everywhere — almost: at one point the difference itself does not exist.'),
  label: L("u ning qiymati", 'значение u', 'the value of u'),
  ask: L(
    "Qanday u da bu ayirmani hisoblab bo'lmaydi?",
    'При каком u эту разность посчитать нельзя?',
    'At which u can this difference not be worked out?'),
  correctText: L(
    "To'g'ri. To'rtda ikkala qo'shiluvchining ham maxraji nolga aylanadi, ya'ni ularning O'ZI mavjud emas. Mavjud bo'lmagan narsadan mavjud bo'lmagan narsani ayirib bo'lmaydi: ayirma ham yo'q. Javob nolga teng, LEKIN faqat u to'rtga teng bo'lmagan joyda — shuning uchun javobga shart yoziladi.",
    'Верно. При четырёх знаменатель обоих слагаемых обращается в нуль, то есть их САМИХ не существует. Из несуществующего нельзя вычесть несуществующее: разности тоже нет. Ответ равен нулю, НО только там, где u не равно четырём — поэтому к ответу и пишут условие.',
    'Correct. At four the denominator of both summands becomes zero, so the summands themselves do not exist. You cannot subtract the non-existent from the non-existent: the difference does not exist either. The answer is zero, BUT only where u is not four — which is why the answer carries a condition.'),
  wrongs: [
    { when: (s) => s.value === 0, text: L(
      "Nolda ikkala kasr ham hisoblanadi: minus uch to'rtdan, va ularning ayirmasi nol. Bu yerda hech narsa buzilmaydi.",
      'При нуле обе дроби считаются: минус три четвёртых, и их разность равна нулю. Здесь ничего не ломается.',
      'At zero both fractions compute: minus three quarters, and their difference is zero. Nothing breaks here.') },
    { when: (s) => s.value === -4, text: L(
      "Minus to'rtda maxraj minus sakkizga teng — nol emas. Kasrlar hisoblanadi. Maxraj u MINUS to'rt, u qo'shuv to'rt emas.",
      'При минус четырёх знаменатель равен минус восьми — не нулю. Дроби считаются. Знаменатель u МИНУС четыре, а не u плюс четыре.',
      'At minus four the denominator is minus eight, not zero. The fractions compute. The denominator is u MINUS four, not u plus four.') },
    { when: (s) => s.value === 3, text: L(
      "Uch — surat, maxraj emas. Uchda maxraj minus birga teng, va ayirma bemalol hisoblanadi.",
      'Тройка — это числитель, а не знаменатель. При трёх знаменатель равен минус одному, и разность спокойно считается.',
      'Three is a numerator, not a denominator. At three the denominator equals minus one and the difference computes fine.') },
  ],
  wrongText: L(
    "Ayirma nolga teng bo'lsa ham, u faqat QO'SHILUVCHILAR mavjud bo'lgan joyda mavjud. Maxrajni nolga tenglang.",
    'Даже если разность равна нулю, она существует только там, где существуют СЛАГАЕМЫЕ. Приравняй знаменатель к нулю.',
    'Even if the difference equals zero, it exists only where the SUMMANDS exist. Set the denominator to zero.'),
};

export default function D04_06(props) { return <TypeValue data={DATA} {...props} />; }
