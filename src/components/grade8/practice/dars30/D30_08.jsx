// Dars30 · Amaliyot 08 — Juftlash · 🔴 · tag: measure_to_relative
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §12 (30-dars, 8-pozitsiya)
//
// TO'RT O'LCHOVDA ABSOLUT XATOLIK BIR XIL — BITTA. Nisbiy xatolik esa
// to'rt xil, chunki u o'lchanayotgan kattalikka bog'liq:
//   10 ± 1  -> 1 : 10  = 10%
//   50 ± 1  -> 1 : 50  = 2%
//   100 ± 1 -> 1 : 100 = 1%
//   200 ± 1 -> 1 : 200 = 0,5%
//
// Bu З60 ning eng aniq ko'rinishi: absolut xatolik bir xil bo'lsa ham,
// aniqlik butunlay boshqa. Kattalik qanchalik katta bo'lsa, o'sha bitta
// xatolik shunchalik kichik ko'rinadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const DATA = {
  tag: 'measure_to_relative', level: '🔴',
  connect: true,
  targetSize: 17, itemSize: 17,
  items: [
    { id: 'm1', tokens: ['10%'] },
    { id: 'm2', tokens: ['2%'] },
    { id: 'm3', tokens: ['1%'] },
    { id: 'm4', tokens: ['0,5%'] },
  ],
  targets: [
    { id: 't1', tokens: ['10 ± 1'] },
    { id: 't2', tokens: ['50 ± 1'] },
    { id: 't3', tokens: ['100 ± 1'] },
    { id: 't4', tokens: ['200 ± 1'] },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Juftlash', 'Пары', 'Pairs'),
  setup: L(
    "To'rt o'lchovda absolut xatolik bir xil — bitta. Nisbiy xatolik esa to'rt xil chiqadi: uni topish uchun xatolikni o'lchangan qiymatga bo'lish kerak.",
    'В четырёх измерениях абсолютная погрешность одинакова — единица. А относительная выходит четырёх разных значений: чтобы её найти, погрешность делят на измеренное значение.',
    'In the four measurements the absolute error is the same — one. But the relative error comes out four different ways: to find it, the error is divided by the measured value.'),
  ask: L(
    "Chapdan nisbiy xatolikni bosing, keyin o'ngdan uning o'lchovini bosing.",
    'Нажми относительную погрешность слева, потом её измерение справа.',
    'Tap a relative error on the left, then its measurement on the right.'),
  correctText: L(
    "To'g'ri. Har juftlikda bir birlikni o'lchangan qiymatga bo'lamiz: o'n foiz, ikki foiz, bir foiz, yarim foiz. Absolut xatolik to'rt joyda ham bitta, aniqlik esa yigirma barobar farq qiladi.",
    'Верно. В каждой паре делим единицу на измеренное значение: десять процентов, два процента, один процент, полпроцента. Абсолютная погрешность во всех четырёх одна, а точность различается в двадцать раз.',
    'Correct. In every pair we divide one by the measured value: ten percent, two percent, one percent, half a percent. The absolute error is the same in all four, yet the precision differs twentyfold.'),
  wrongs: [
    { when: (s) => s.pair.m1 !== 't1', text: L(
      "Eng KATTA nisbiy xatolik eng KICHIK o'lchovga tegishli. O'n foiz — bu o'ndan bir, ya'ni bir birlik xatolik o'lchangan kattalikning o'ndan biri. Bunday nisbat faqat o'lchov o'zi kichik bo'lganda chiqadi: bir bo'lingan o'n. Yuz yoki ikki yuzda bir birlik ancha kichik ulush bo'ladi.",
      'Самая БОЛЬШАЯ относительная погрешность относится к самому МАЛЕНЬКОМУ измерению. Десять процентов — это одна десятая, то есть единица погрешности составляет десятую часть измеренной величины. Такое отношение выходит только при малом измерении: один делить на десять. При ста или двухстах единица составляет куда меньшую долю.',
      'The LARGEST relative error belongs to the SMALLEST measurement. Ten percent is one tenth, so one unit of error makes a tenth of the measured quantity. Such a ratio appears only when the measurement itself is small: one over ten. At one hundred or two hundred, one unit is a far smaller share.') },
    { when: (s) => s.pair.m4 !== 't4', text: L(
      "Eng KICHIK nisbiy xatolik eng KATTA o'lchovga tegishli. Yarim foiz — bu ikki yuzdan bir, ya'ni bir birlik xatolik ikki yuzning ikki yuzdan bir qismi. O'lchanayotgan kattalik qanchalik katta bo'lsa, bir birlik xatolik shunchalik sezilmas bo'ladi — bu o'lchov eng aniqi.",
      'Самая МАЛЕНЬКАЯ относительная погрешность относится к самому БОЛЬШОМУ измерению. Полпроцента — это одна двухсотая, то есть единица погрешности составляет двухсотую часть от двухсот. Чем больше измеряемая величина, тем незаметнее единица погрешности — это измерение самое точное.',
      'The SMALLEST relative error belongs to the LARGEST measurement. Half a percent is one two-hundredth, so one unit of error makes a two-hundredth of two hundred. The larger the measured quantity, the less noticeable one unit of error — this measurement is the most accurate.') },
    { when: (s) => s.pair.m2 === 't3' || s.pair.m3 === 't2', text: L(
      "Bu ikki juftlikni hisob ajratadi. Bir bo'lingan ellik nol butun nol ikki — bu ikki foiz. Bir bo'lingan yuz esa nol butun nol bir — bu bir foiz. Ellik yuzdan ikki barobar kichik, shuning uchun undagi nisbiy xatolik ikki barobar KATTA.",
      'Эти две пары разделяет вычисление. Один делить на пятьдесят это ноль целых ноль два — два процента. А один делить на сто это ноль целых ноль один — один процент. Пятьдесят вдвое меньше ста, поэтому относительная погрешность у него вдвое БОЛЬШЕ.',
      'Computation separates these two pairs. One over fifty is zero point zero two — two percent. One over one hundred is zero point zero one — one percent. Fifty is half of one hundred, so its relative error is twice as LARGE.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har o'lchovda bir xil ish qiling: bir birlikni o'lchangan qiymatga bo'ling va natijani foizga aylantiring. Kattalik qanchalik katta bo'lsa, nisbiy xatolik shunchalik kichik — bu qoidani yodda tutsangiz, juftlash tartibi darrov ko'rinadi.",
      'В каждом измерении делай одно и то же: раздели единицу на измеренное значение и переведи результат в проценты. Чем больше величина, тем меньше относительная погрешность — держи это правило в голове, и порядок пар станет виден сразу.',
      'Do the same in every measurement: divide one by the measured value and turn the result into a percentage. The larger the quantity, the smaller the relative error — keep that rule in mind and the pairing becomes obvious.') },
  ],
  wrongText: L(
    "Har o'lchovda bir birlikni o'lchangan qiymatga bo'ling. Absolut xatolik to'rt joyda ham bitta, nisbiysi esa kattalik ortgan sari kichrayadi.",
    'В каждом измерении раздели единицу на измеренное значение. Абсолютная погрешность во всех четырёх одна, а относительная тем меньше, чем больше величина.',
    'In every measurement divide one by the measured value. The absolute error is the same in all four; the relative one shrinks as the quantity grows.'),
};

export default function D30_08(props) { return <MatchPairs data={DATA} {...props} />; }
