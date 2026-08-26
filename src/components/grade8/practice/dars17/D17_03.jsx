// Dars17 · Amaliyot 03 — Diskriminant · 🟢 · tag: find_D
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §5 (17-dars, 3-pozitsiya)
//
// C MANFIY BO'LGANDA «MINUS TO'RT A C» MUSBAT CHIQADI — bu darsning eng ko'p
// uchraydigan hisob xatosi. Minus to'rt karra ikki karra minus uch arti
// yigirma to'rt, ya'ni D yigirma besh qo'shuv yigirma to'rt qirq to'qqiz.
//
// Uchta xato javob uchta yo'l:
//   1  — yigirma besh minus yigirma to'rt: ikki minusning biri hisobga
//        olinmadi;
//   13 — yigirma besh minus o'n ikki: to'rtga ko'paytirish tashlab ketildi;
//   34 — yigirma besh qo'shuv to'qqiz: c ning o'zi qo'shildi, ko'paytma emas.
// `TypeValue` faqat butun son oladi, javob esa butun — 49.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'find_D', level: '🟢',
  target: 49, allowNeg: true,
  expr: ['2z² + 5z − 3 = 0'], exprSize: 28,
  given: [['D = b² − 4ac']],
  givenLabel: L('Formula', 'Формула', 'Formula'),
  eyebrow: L('Diskriminant', 'Дискриминант', 'Discriminant'),
  setup: L(
    "Diskriminant uch koeffitsiyentdan hisoblanadi. Bu tenglamada ozod had MANFIY — shuning uchun ikkinchi qo'shiluvchining ishorasiga alohida qarash kerak.",
    'Дискриминант считается по трём коэффициентам. В этом уравнении свободный член ОТРИЦАТЕЛЬНЫЙ — поэтому на знак второго слагаемого надо смотреть особо.',
    'The discriminant is computed from the three coefficients. In this equation the constant term is NEGATIVE — so the sign of the second part needs special care.'),
  label: L('D ning qiymati', 'значение D', 'the value of D'),
  ask: L('D nimaga teng?', 'Чему равно D?', 'What does D equal?'),
  correctText: L(
    "To'g'ri. Koeffitsiyentlar: a ikki, b besh, c minus uch. b kvadrati yigirma besh. Minus to'rt karra a karra c: minus to'rt karra ikki minus sakkiz, minus sakkiz karra minus uch ARTI yigirma to'rt — ikki minus arti beradi. Yigirma besh qo'shuv yigirma to'rt qirq to'qqiz.",
    'Верно. Коэффициенты: a два, b пять, c минус три. b в квадрате двадцать пять. Минус четыре на a на c: минус четыре на два минус восемь, минус восемь на минус три ПЛЮС двадцать четыре — два минуса дают плюс. Двадцать пять плюс двадцать четыре сорок девять.',
    'Correct. The coefficients: a is two, b is five, c is minus three. b squared is twenty five. Minus four times a times c: minus four times two is minus eight, minus eight times minus three is PLUS twenty four — two minuses give a plus. Twenty five plus twenty four is forty nine.'),
  wrongs: [
    { when: (s) => s.value === 1, text: L(
      "Ishora tushib qolgan. Minus to'rt karra a karra c ni hisoblang: bu yerda c ning o'zi MANFIY, demak ikki minus uchrashadi va natija MUSBAT bo'ladi. Minus sakkiz karra minus uch arti yigirma to'rt, yigirma besh qo'shuv yigirma to'rt qirq to'qqiz.",
      'Потерян знак. Посчитай минус четыре на a на c: здесь само c ОТРИЦАТЕЛЬНО, значит встречаются два минуса и результат ПОЛОЖИТЕЛЕН. Минус восемь на минус три плюс двадцать четыре, двадцать пять плюс двадцать четыре сорок девять.',
      'A sign was lost. Compute minus four times a times c: here c itself is NEGATIVE, so two minuses meet and the result is POSITIVE. Minus eight times minus three is plus twenty four, and twenty five plus twenty four is forty nine.') },
    { when: (s) => s.value === 13, text: L(
      "To'rtga ko'paytirish tashlab ketilgan. Formulada minus TO'RT a c turadi: minus to'rt karra ikki karra minus uch. Avval minus to'rt karra ikki minus sakkiz, keyin minus sakkiz karra minus uch arti yigirma to'rt — o'n ikki emas.",
      'Пропущено умножение на четыре. В формуле стоит минус ЧЕТЫРЕ a c: минус четыре на два на минус три. Сначала минус четыре на два минус восемь, потом минус восемь на минус три плюс двадцать четыре — а не двенадцать.',
      'The multiplication by four was skipped. The formula holds minus FOUR a c: minus four times two times minus three. First minus four times two is minus eight, then minus eight times minus three is plus twenty four — not twelve.') },
    { when: (s) => s.value === 34, text: L(
      "Bu yigirma besh qo'shuv to'qqiz, ya'ni c ning KVADRATI qo'shilgan. Formulada esa faqat b kvadratga oshadi; c to'rtga va a ga ko'paytiriladi. Minus to'rt karra ikki karra minus uch arti yigirma to'rt.",
      'Это двадцать пять плюс девять, то есть прибавлен КВАДРАТ c. А в формуле в квадрат возводится только b; c умножается на четыре и на a. Минус четыре на два на минус три плюс двадцать четыре.',
      'That is twenty five plus nine, meaning the SQUARE of c was added. In the formula only b is squared; c is multiplied by four and by a. Minus four times two times minus three is plus twenty four.') },
    { when: (s) => s.value === 25 || s.value === 24, text: L(
      "Bu formulaning bir bo'lagi, butun D emas. D ikki qo'shiluvchidan yig'iladi: b kvadrati va minus to'rt a c. Yigirma besh qo'shuv yigirma to'rt qirq to'qqiz.",
      'Это часть формулы, а не всё D. D складывается из двух частей: b в квадрате и минус четыре a c. Двадцать пять плюс двадцать четыре сорок девять.',
      'That is a piece of the formula, not the whole D. D is built from two parts: b squared and minus four a c. Twenty five plus twenty four is forty nine.') },
  ],
  wrongText: L(
    "Uch koeffitsiyentni ishorasi bilan yozib oling, keyin ikki qo'shiluvchini alohida hisoblang. c manfiy bo'lsa, minus to'rt a c musbat chiqadi.",
    'Выпиши три коэффициента вместе со знаками, потом посчитай два слагаемых по отдельности. Если c отрицательно, минус четыре a c выходит положительным.',
    'Write out the three coefficients with their signs, then compute the two parts separately. When c is negative, minus four a c comes out positive.'),
};

export default function D17_03(props) { return <TypeValue data={DATA} {...props} />; }
