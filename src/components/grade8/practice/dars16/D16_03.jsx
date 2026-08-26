// Dars16 · Amaliyot 03 — Chala · 🟢 · tag: incomplete_marked
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §4 (16-dars, 3-pozitsiya)
//
// З43: chala tenglamani tanishda QAYSI koeffitsiyent yo'qligini payqash kerak.
// Uch belgilanadigan karta uch ko'rinishni beradi (`Dars16.jsx`, T1):
//   3y² − 12 = 0  — ikkinchi koeffitsiyent yo'q (b nol);
//   y² + 5y = 0   — ozod had yo'q (c nol);
//   7y² = 0       — ikkalasi ham yo'q.
// Uch xato karta: ikkitasi TO'LIQ tenglama (uch koeffitsiyent ham bor),
// bittasi esa umuman kvadrat emas — bosh koeffitsiyent yo'q, ya'ni tenglama
// chiziqli va chala kvadrat ham bo'lolmaydi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'incomplete_marked', level: '🟢',
  col: 164, itemSize: 16,
  items: [
    { id: 'i1', tokens: ['3y² − 12 = 0'], hit: true },
    { id: 'i2', tokens: ['y² − 3y + 2 = 0'] },
    { id: 'i3', tokens: ['y² + 5y = 0'], hit: true },
    { id: 'i4', tokens: ['y² − y − 1 = 0'] },
    { id: 'i5', tokens: ['7y² = 0'], hit: true },
    { id: 'i6', tokens: ['2y + 6 = 0'] },
  ],
  eyebrow: L('Chala', 'Неполные', 'Incomplete'),
  setup: L(
    "Tenglama chala kvadrat deyiladi, agar b yoki c koeffitsiyentlardan kamida bittasi nolga teng bo'lsa. Bosh koeffitsiyent esa har doim noldan farqli bo'lishi kerak.",
    'Уравнение называется неполным квадратным, если хотя бы один из коэффициентов b или c равен нулю. А старший коэффициент всегда должен быть не нулевым.',
    'An equation is called an incomplete quadratic if at least one of the coefficients b or c is zero. The leading coefficient must always be non-zero.'),
  ask: L(
    'Chala kvadrat tenglama bo\'lgan 3 tasini belgilang.',
    'Отметь 3 уравнения, которые являются неполными квадратными.',
    'Mark the 3 equations that are incomplete quadratics.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Uchtasi uch xil ko'rinishni beradi: birinchisida ikkinchi koeffitsiyent yo'q, ikkinchisida ozod had yo'q, uchinchisida ikkalasi ham yo'q. Uchalasida ham bosh koeffitsiyent bor — uch, bir va yetti.",
    'Верно. Три карточки дают три вида: в первой нет второго коэффициента, во второй нет свободного члена, в третьей нет ни того, ни другого. И везде есть старший коэффициент — три, один и семь.',
    'Correct. The three cards give the three forms: the first has no second coefficient, the second has no constant term, the third has neither. All three have a leading coefficient — three, one and seven.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('i6') !== -1, text: L(
      "Bu yozuvda kvadrat had UMUMAN yo'q, ya'ni bosh koeffitsiyent nolga teng. Chala kvadrat tenglamada b yoki c yo'q bo'lishi mumkin, lekin a har doim qoladi — aks holda tenglama kvadrat bo'lmay qoladi.",
      'В этой записи квадратного слагаемого НЕТ вовсе, то есть старший коэффициент равен нулю. У неполного квадратного могут отсутствовать b или c, но a остаётся всегда — иначе уравнение перестаёт быть квадратным.',
      'This record has NO squared term at all, so the leading coefficient is zero. An incomplete quadratic may lack b or c, but a always stays — otherwise the equation stops being quadratic. Two y plus six equals zero is linear, with one root: minus three.') },
    { when: (s) => s.extra.indexOf('i2') !== -1 || s.extra.indexOf('i4') !== -1, text: L(
      "Bu tenglamada uchta koeffitsiyent ham bor va hech biri nolga teng emas: kvadrat had, x li had va harfsiz son. Bunday tenglama TO'LIQ deyiladi. Chala bo'lishi uchun b yoki c yo'q bo'lishi kerak.",
      'В этом уравнении есть все три коэффициента и ни один не равен нулю: квадратное слагаемое, слагаемое с иксом и число без буквы. Такое уравнение называется ПОЛНЫМ. Для неполного нужно, чтобы b или c отсутствовал.',
      'This equation has all three coefficients and none of them is zero: the squared term, the x term and the number without a letter. Such an equation is called COMPLETE. To be incomplete, b or c must be missing.') },
    { when: (s) => s.miss.indexOf('i5') !== -1, text: L(
      "Yetti y kvadrat chetlab o'tildi. Bu ham chala tenglama, hatto eng oddiy ko'rinishi: b ham, c ham nolga teng. Uning bitta ildizi bor — nol, chunki yetti karra y kvadrat faqat nolda nolga aylanadi.",
      'Семь y квадрат осталось в стороне. Это тоже неполное уравнение, причём самый простой вид: и b, и c равны нулю. У него один корень — нуль, ведь семь на y квадрат обращается в нуль только при нуле.',
      'Seven y squared was left out. It is an incomplete equation too, and the simplest form at that: both b and c are zero. It has one root — zero, since seven times y squared is zero only at zero.') },
    { when: (s) => s.marked.length !== 3, text: L(
      "Aynan uchta tenglama kerak. Har birida uch koeffitsiyentni sanang: kvadrat had bormi, x li had bormi, harfsiz son bormi. Kvadrat had har doim bo'lishi shart, qolgan ikkisidan biri yo'q bo'lsa — tenglama chala.",
      'Нужно ровно три уравнения. В каждом пересчитай три коэффициента: есть ли квадратное слагаемое, слагаемое с иксом, число без буквы. Квадратное обязательно, а если из остальных двух одного нет — уравнение неполное.',
      'Exactly three equations are needed. Count the three coefficients in each: is there a squared term, an x term, a number without a letter. The squared term is compulsory, and if one of the other two is missing the equation is incomplete.') },
  ],
  wrongText: L(
    "Har tenglamada uch o'rinni tekshiring: kvadrat had, x li had, harfsiz son. Kvadrat had bo'lmasa tenglama kvadrat emas; b yoki c bo'lmasa — chala.",
    'В каждом уравнении проверь три места: квадратное слагаемое, слагаемое с иксом, число без буквы. Нет квадратного — уравнение не квадратное; нет b или c — неполное.',
    'Check three places in every equation: the squared term, the x term, the number without a letter. No squared term means not quadratic; no b or no c means incomplete.'),
};

export default function D16_03(props) { return <MarkAll data={DATA} {...props} />; }
