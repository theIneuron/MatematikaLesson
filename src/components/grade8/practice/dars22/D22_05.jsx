// Dars22 · Amaliyot 05 — Bikvadrat · 🟡 · tag: biquadratic_marked
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §4 (22-dars, 5-pozitsiya)
//
// T2 NING TA'RIFI: bikvadrat tenglamada faqat TO'RTINCHI va IKKINCHI daraja
// va ozod had bo'ladi. Toq daraja paydo bo'lishi bilan x² = t belgilash
// ishlamay qoladi — x uchinchi darajani t orqali yozib bo'lmaydi.
//
// Uch tuzoq uch xil:
//   x⁴ − 5x³ + 4 = 0 — uchinchi daraja, belgilash o'tmaydi;
//   x³ − 5x + 4 = 0  — umuman toq darajali tenglama;
//   x⁴ + 2x + 1 = 0  — birinchi daraja bor.
// `x⁴ − 16 = 0` da b nolga teng: chala bikvadrat, 16-darsga qaytish.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'biquadratic_marked', level: '🟡',
  col: 164, itemSize: 15,
  items: [
    { id: 'i1', tokens: ['x⁴ − 5x² + 4 = 0'], hit: true },
    { id: 'i2', tokens: ['x⁴ − 5x³ + 4 = 0'] },
    { id: 'i3', tokens: ['2x⁴ + 3x² − 5 = 0'], hit: true },
    { id: 'i4', tokens: ['x³ − 5x + 4 = 0'] },
    { id: 'i5', tokens: ['x⁴ − 16 = 0'], hit: true },
    { id: 'i6', tokens: ['x⁴ + 2x + 1 = 0'] },
  ],
  eyebrow: L('Bikvadrat', 'Биквадратные', 'Biquadratic'),
  setup: L(
    "Bikvadrat tenglamada faqat to'rtinchi daraja, ikkinchi daraja va ozod had bo'ladi. Aynan shunday tenglamada x² = t belgilash ishlaydi.",
    'В биквадратном уравнении есть только четвёртая степень, вторая и свободный член. Именно в таком работает замена x² = t.',
    'A biquadratic equation holds only a fourth power, a second power and a free term. The substitution x² = t works exactly there.'),
  ask: L(
    'Bikvadrat bo\'lgan 3 ta tenglamani belgilang.',
    'Отметь 3 уравнения, которые являются биквадратными.',
    'Mark the 3 equations that are biquadratic.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Uchalasida ham darajalar JUFT, ya'ni belgilash o'tadi: x to'rtinchi daraja t kvadratga, x kvadrat esa t ga aylanadi. Uchinchisida ikkinchi daraja yo'q — b nolga teng, ya'ni chala bikvadrat.",
    'Верно. У всех трёх степени ЧЁТНЫЕ, значит замена проходит: x в четвёртой станет t квадрат, а x квадрат станет t. У третьего второй степени нет — b равно нулю, то есть это неполное биквадратное.',
    'Correct. All three have EVEN powers, so the substitution works: x to the fourth becomes t squared and x squared becomes t. The third has no second power — b is zero, an incomplete biquadratic.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('i2') !== -1, text: L(
        "Bu tenglamada UCHINCHI daraja bor. Belgilash o'tmaydi: x uchinchi darajani t orqali yozib bo'lmaydi.",
        'Здесь есть ТРЕТЬЯ степень. Замена не проходит: x в кубе через t не записать.',
        'There is a THIRD power here. The substitution fails: x cubed cannot be written through t.') },
    { when: (s) => s.extra.indexOf('i6') !== -1, text: L(
      "Bu tenglamada BIRINCHI daraja bor: ikki x. U ham toq daraja, ya'ni belgilash o'tmaydi. To'rtinchi daraja t kvadrat bo'ladi, lekin x ning o'zini t orqali yozib bo'lmaydi. Bikvadrat tenglamada faqat juft darajalar turadi.",
      'В этом уравнении есть ПЕРВАЯ степень: два x. Она тоже нечётная, значит замена не проходит. Четвёртая степень станет t квадрат, а сам x через t не записать. В биквадратном уравнении стоят только чётные степени.',
      'This equation has a FIRST power: two x. That is odd as well, so the substitution does not go through. The fourth power becomes t squared, but x itself cannot be written through t. A biquadratic equation holds only even powers.') },
    { when: (s) => s.extra.indexOf('i4') !== -1, text: L(
      "Bu tenglamada eng katta daraja UCHINCHI, to'rtinchi daraja umuman yo'q. Bikvadrat tenglamaning yozuvi a x to'rtinchi daraja qo'shuv b x kvadrat qo'shuv c nolga teng — bu yerda esa boshqa ko'rinish.",
      'В этом уравнении старшая степень ТРЕТЬЯ, четвёртой нет вовсе. Запись биквадратного уравнения это a x в четвёртой плюс b x квадрат плюс c равно нулю — а здесь другой вид.',
      'In this equation the highest power is the THIRD, and there is no fourth power at all. The record of a biquadratic equation is a x to the fourth plus b x squared plus c equals zero — this has a different shape.') },
    { when: (s) => s.miss.indexOf('i5') !== -1, text: L(
      "Bu tenglama chetlab o'tildi, chunki unda ikkinchi daraja ko'rinmaydi. Lekin ko'rinmaslik yo'q degani emas: koeffitsiyent b nolga teng, ya'ni tenglama chala bikvadrat. Yozib ko'ring: x to'rtinchi daraja qo'shuv nol karra x kvadrat minus o'n olti nolga teng. Belgilash bemalol o'tadi.",
      'Это уравнение осталось в стороне, потому что второй степени в нём не видно. Но не видно не значит нет: коэффициент b равен нулю, то есть уравнение неполное биквадратное. Запиши: x в четвёртой плюс нуль на x квадрат минус шестнадцать равно нулю. Замена проходит спокойно.',
      'This equation was left out because no second power is visible. But not visible does not mean absent: the coefficient b is zero, so the equation is an incomplete biquadratic. Write it out: x to the fourth plus zero times x squared minus sixteen equals zero. The substitution goes through fine.') },
    { when: (s) => s.marked.length !== 3, text: L(
      "Aynan uchta tenglama kerak. Har biri bilan bitta ish qiling: darajalarga qarang. Faqat to'rtinchi va ikkinchi (yoki ulardan biri) bo'lsa — bikvadrat; birinchi yoki uchinchi daraja bo'lsa — yo'q.",
      'Нужно ровно три уравнения. С каждым делай одно: смотри на степени. Только четвёртая и вторая (или одна из них) — биквадратное; появилась первая или третья — нет.',
      'Exactly three equations are needed. Do one thing with each: look at the powers. Only the fourth and the second (or one of them) — biquadratic; a first or third power appears — not.') },
  ],
  wrongText: L(
    "Darajalarga qarang: bikvadrat tenglamada faqat juft darajalar bo'ladi. Toq daraja bo'lsa, x² = t belgilash ishlamaydi. Ikkinchi darajaning ko'rinmasligi esa uni yo'q qilmaydi.",
    'Смотри на степени: в биквадратном уравнении только чётные. Появилась нечётная — замена x² = t не работает. А то, что второй степени не видно, её не отменяет.',
    'Look at the powers: a biquadratic equation has only even ones. If an odd power appears, the substitution x² = t does not work. And the second power being invisible does not remove it.'),
};

export default function D22_05(props) { return <MarkAll data={DATA} {...props} />; }
