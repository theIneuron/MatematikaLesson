// Dars22 · Amaliyot 03 — Nechta · 🟢 · tag: count_roots
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §4 (22-dars, 3-pozitsiya)
//
// T2 va З40 BIRGA. Belgilashdan keyin kvadrat tenglama ikki t beradi, va
// har MUSBAT t dan ikkita x chiqadi: plyus va minus. Ya'ni to'rtta.
//
// Eng ko'p uchraydigan javob — ikki: t ning ildizlari sanaladi va x ga
// qaytish qadami tashlab ketiladi. Ikkinchi xato — plyus-minusni unutish
// (З40): o'shanda har t dan bitta x qoladi va yana ikki chiqadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'count_roots', level: '🟢',
  target: 4, allowNeg: false,
  expr: ['x⁴ − 13x² + 36 = 0'], exprSize: 26,
  eyebrow: L('Nechta', 'Сколько', 'How many'),
  setup: L(
    "Bikvadrat tenglama. x² = t belgilash bilan u kvadrat tenglamaga keladi: t² − 13t + 36 = 0. Undan t topiladi, keyin har t dan x qaytariladi.",
    'Биквадратное уравнение. Заменой x² = t оно сводится к квадратному: t² − 13t + 36 = 0. Из него находят t, а потом из каждого t возвращают x.',
    'A biquadratic equation. The substitution x² = t reduces it to a quadratic: t² − 13t + 36 = 0. From it t is found, and then x is recovered from each t.'),
  label: L("Ildizlar soni", 'Число корней', 'The number of roots'),
  ask: L('Tenglamaning nechta ildizi bor?', 'Сколько корней у уравнения?', 'How many roots does the equation have?'),
  correctText: L(
    "To'g'ri. Belgilashdan keyin t kvadrat minus o'n uch t qo'shuv o'ttiz olti nolga teng, ildizlari to'rt va to'qqiz. Har musbat t ikki x beradi: plyus-minus ikki va plyus-minus uch — jami to'rtta. Tekshirish: uchning to'rtinchi darajasi sakson bir, sakson bir minus bir yuz o'n yetti qo'shuv o'ttiz olti nol.",
    'Верно. После замены выходит t квадрат минус тринадцать t плюс тридцать шесть равно нулю, корни четыре и девять. Каждое положительное t даёт два x: плюс-минус два и плюс-минус три — всего четыре. Проверка: три в четвёртой восемьдесят один, восемьдесят один минус сто семнадцать плюс тридцать шесть нуль.',
    'Correct. After the substitution t squared minus thirteen t plus thirty six equals zero, with roots four and nine. Each positive t gives two values of x: plus or minus two and plus or minus three — four in all. Check: three to the fourth is eighty one, and eighty one minus one hundred seventeen plus thirty six is zero.'),
  wrongs: [
    { when: (s) => s.value === 2, text: L(
      "Ikkita — bu t ning ildizlari soni, x ning emas. To'rt va to'qqiz topildi, lekin ular JAVOB emas: belgilash x kvadrat t ga teng degan edi, ya'ni har t dan x ni qaytarish kerak. To'rtdan ikki va minus ikki chiqadi, to'qqizdan uch va minus uch. Belgilash kiritilgan joyga qaytish — bikvadrat tenglamaning eng oxirgi qadami.",
      'Два — это число корней t, а не x. Четыре и девять найдены, но они не ОТВЕТ: замена гласила x квадрат равно t, значит из каждого t надо вернуть x. Из четырёх выходят два и минус два, из девяти три и минус три. Возврат к замене — самый последний шаг биквадратного уравнения.',
      'Two is the number of roots of t, not of x. Four and nine were found, but they are not the ANSWER: the substitution said x squared equals t, so x must be recovered from each t. Four gives two and minus two, nine gives three and minus three. Returning to the substitution is the very last step of a biquadratic equation.') },
    { when: (s) => s.value === 3, text: L(
      "Uchta chiqishi uchun t larning biri nol bo'lishi kerak edi — o'shanda undan bitta x chiqardi. Bu yerda esa t ning ikkala ildizi ham musbat: to'rt va to'qqiz. Musbat t har doim IKKI x beradi, plyus va minus, ya'ni jami to'rtta.",
      'Три вышло бы, если бы одно из t было нулём — тогда из него получился бы один x. А здесь оба корня t положительны: четыре и девять. Положительное t всегда даёт ДВА x, плюс и минус, то есть всего четыре.',
      'Three would come out if one of the t values were zero — then it would give a single x. But here both roots of t are positive: four and nine. A positive t always gives TWO values of x, plus and minus, so four in all.') },
    { when: (s) => s.value === 0 || s.value === 1, text: L(
      "Ildiz yo'q yoki bitta bo'lishi uchun t manfiy yoki nol chiqishi kerak edi. Belgilashdan keyingi tenglamani yeching: t kvadrat minus o'n uch t qo'shuv o'ttiz olti nolga teng, diskriminanti bir yuz oltmish to'qqiz minus bir yuz qirq to'rt, ya'ni yigirma besh. Ildizlari to'rt va to'qqiz, ikkalasi ham musbat.",
      'Чтобы корней не было или был один, t должно выйти отрицательным или нулём. Реши уравнение после замены: t квадрат минус тринадцать t плюс тридцать шесть равно нулю, дискриминант сто шестьдесят девять минус сто сорок четыре, то есть двадцать пять. Корни четыре и девять, оба положительные.',
      'For there to be no roots or only one, t would have to come out negative or zero. Solve the equation after the substitution: t squared minus thirteen t plus thirty six equals zero, discriminant one hundred sixty nine minus one hundred forty four, that is twenty five. The roots are four and nine, both positive.') },
  ],
  wrongText: L(
    "Avval t ni toping, keyin har t dan x ni qaytaring. Musbat t ikki x beradi (plyus va minus), nol bitta, manfiy esa umuman bermaydi.",
    'Сначала найди t, потом из каждого t верни x. Положительное t даёт два x (плюс и минус), нуль один, а отрицательное не даёт вовсе.',
    'First find t, then recover x from each t. A positive t gives two values of x (plus and minus), zero gives one, and a negative gives none.'),
};

export default function D22_03(props) { return <TypeValue data={DATA} {...props} />; }
