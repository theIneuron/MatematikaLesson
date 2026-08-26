// Dars20 · Amaliyot 01 — Taqiq · 🟢 · tag: which_forbidden
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §8 (20-dars, 1-pozitsiya)
//
// T1: TENGLAMANI YECHISHDAN OLDIN RUHSAT ETILGAN QIYMATLAR TOPILADI. Bu
// 1-6 darslarning ishi (Б1), endi u tenglamaning birinchi qadami bo'lib
// qaytadi.
//
// Uch xato variant uch xil yo'l: minus to'rt (ishora), uch (suratdagi son),
// nol (kasrda nol har doim taqiqlangan degan qarash — bu yerda maxraj nolda
// minus to'rtga teng, ya'ni nolga aylanmaydi).
// TERMIN: `ODZ` yozilmaydi, `ruhsat etilgan qiymatlar` yoziladi
// (`ETALON_8SINF.md` §9.1).
// Variantlar aralashtiriladi (Choice ichida), razbor shartlari ASL raqamda.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'which_forbidden', level: '🟢',
  correct: 0, optCols: 2, optSize: 20,
  expr: [{ n: '3', d: 'x − 4' }, '= 1'], exprSize: 28,
  eyebrow: L('Taqiq', 'Запрет', 'Ban'),
  setup: L(
    "Kasr-ratsional tenglamani yechishdan oldin ruhsat etilgan qiymatlar topiladi: maxrajni nolga aylantiradigan son chiqarib tashlanadi.",
    'Прежде чем решать дробно-рациональное уравнение, находят допустимые значения: число, обращающее знаменатель в нуль, исключается.',
    'Before solving a fractional rational equation you find the admissible values: the number that makes the denominator zero is excluded.'),
  ask: L(
    "x qanday qiymatni qabul qila olmaydi?",
    'Какое значение x принимать не может?',
    'Which value can x not take?'),
  opts: [
    { label: ['x = 4'] },
    { label: ['x = −4'] },
    { label: ['x = 3'] },
    { label: ['x = 0'] },
  ],
  correctText: L(
    "To'g'ri. Taqiqni MAXRAJ beradi: x minus to'rt nolga aylanadigan qiymatni topamiz — x minus to'rt nolga teng bo'lsa x to'rtga teng. To'rtda maxraj nol bo'ladi, va nolga bo'lish degan amal yo'q. Qolgan hamma son yaraydi: masalan nolda maxraj minus to'rt, kasrning qiymati minus uch chorak.",
    'Верно. Запрет даёт ЗНАМЕНАТЕЛЬ: ищем значение, при котором x минус четыре обращается в нуль — если x минус четыре равно нулю, то x равен четырём. При четырёх знаменатель нуль, а деления на нуль не существует. Все остальные числа годятся: например при нуле знаменатель минус четыре, значение дроби минус три четвёртых.',
    'Correct. The DENOMINATOR gives the ban: find the value where x minus four becomes zero — if x minus four is zero then x is four. At four the denominator is zero, and division by zero is not an operation. Every other number is fine: at zero, for instance, the denominator is minus four and the fraction equals minus three quarters.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Ishora almashtirilgan. Maxrajni nolga tenglang: x minus to'rt nolga teng, demak x arti to'rtga teng. Minus to'rtni qo'yib ko'ring: minus to'rt minus to'rt minus sakkiz, ya'ni maxraj nolga aylanmaydi — kasrning qiymati bor.",
      'Знак изменён. Приравняй знаменатель к нулю: x минус четыре равно нулю, значит x равен плюс четырём. Подставь минус четыре: минус четыре минус четыре минус восемь, то есть знаменатель в нуль не обращается — у дроби есть значение.',
      'The sign was flipped. Set the denominator to zero: x minus four equals zero, so x is plus four. Substitute minus four: minus four minus four is minus eight, so the denominator does not vanish — the fraction has a value.') },
    { when: (s) => s.picked === 2, text: L(
      "Uch — SURATDAGI son, u taqiqqa aloqasi yo'q. Taqiqni faqat maxraj beradi. Uchni qo'yib ko'ring: maxraj uch minus to'rt minus bir, kasr esa uch bo'lingan minus bir, ya'ni minus uch — qiymat bor.",
      'Три — число из ЧИСЛИТЕЛЯ, к запрету оно не относится. Запрет даёт только знаменатель. Подставь три: знаменатель три минус четыре минус один, дробь три делить на минус один, то есть минус три — значение есть.',
      'Three is the number in the NUMERATOR and has nothing to do with the ban. Only the denominator bans values. Substitute three: the denominator is three minus four, minus one, and the fraction is three over minus one, that is minus three — a value exists.') },
    { when: (s) => s.picked === 3, text: L(
      "Nol har doim taqiqlanmaydi. Taqiq nolga aylanadigan MAXRAJDA paydo bo'ladi, x ning o'zi nol bo'lganda emas. Nolni qo'ying: maxraj minus to'rt, ya'ni noldan farqli — bo'lish bajariladi.",
      'Нуль запрещён не всегда. Запрет возникает там, где в нуль обращается ЗНАМЕНАТЕЛЬ, а не там, где сам x равен нулю. Подставь нуль: знаменатель минус четыре, то есть не нуль — деление выполняется.',
      'Zero is not always banned. A ban appears where the DENOMINATOR becomes zero, not where x itself is zero. Substitute zero: the denominator is minus four, non-zero — the division goes through.') },
  ],
  wrongText: L(
    "Maxrajni nolga tenglab tenglamani yeching — javob taqiqlangan qiymat bo'ladi. Surat esa hech narsani taqiqlamaydi.",
    'Приравняй знаменатель к нулю и решь уравнение — ответ и будет запрещённым значением. А числитель ничего не запрещает.',
    'Set the denominator to zero and solve — the answer is the forbidden value. The numerator bans nothing.'),
};

export default function D20_01(props) { return <Choice data={DATA} {...props} />; }
