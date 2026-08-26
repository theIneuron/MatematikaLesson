// Dars15 · Amaliyot 01 — Kvadratmi · 🟢 · tag: is_quadratic_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §3 (15-dars, 1-pozitsiya)
//
// З38 ENG OCHIQ KO'RINISHDA. Ikki yozuv bir xil ko'rinadi: ikkalasida ham
// kvadrat had YOZILGAN. Farqi bitta koeffitsiyentda — ikkinchisida a nolga
// teng, ya'ni kvadrat had yo'qoladi va tenglama chiziqli bo'lib qoladi.
// Ta'rifning «a nolga teng emas» qismi aynan shu yerda ishlaydi
// (`Dars15.jsx`, T1).
//
// Razbor son bilan tekshiradi: nol karra x kvadrat har qanday x da nol,
// demak yozuvdan qoladigan narsa to'rt x minus bir.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'is_quadratic_claims', level: '🟢',
  itemSize: 16,
  items: [
    { id: 's1', yes: false,
      tokens: ['0·x² + 4x − 1 = 0'],
      claim: L('kvadrat tenglama', 'квадратное уравнение', 'a quadratic equation') },
    { id: 's2', yes: true,
      tokens: ['3x² − 5x + 2 = 0'],
      claim: L('kvadrat tenglama', 'квадратное уравнение', 'a quadratic equation') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L('Kvadratmi', 'Квадратное ли', 'Is it quadratic'),
  setup: L(
    "Ikki yozuvda ham kvadrat had turadi. Kvadrat tenglamaning ta'rifida esa yana bir shart bor: bosh koeffitsiyent nolga teng bo'lmasligi kerak.",
    'В обеих записях есть квадратное слагаемое. Но в определении квадратного уравнения есть ещё условие: старший коэффициент не равен нулю.',
    'Both records contain a squared term. But the definition of a quadratic equation carries one more condition: the leading coefficient is not zero.'),
  ask: L(
    "Har yozuvni tekshiring: kvadrat tenglama bo'lsa «Ha», bo'lmasa «Yo'q».",
    'Проверь каждую запись: квадратное уравнение — «Да», нет — «Нет».',
    'Check each record: a quadratic equation means «Yes», otherwise «No».'),
  correctText: L(
    "To'g'ri. Birinchisida bosh koeffitsiyent nol, va nol karra x kvadrat har qanday x da nolga aylanadi. Kvadrat had yo'qoladi, yozuvdan to'rt x minus bir qoladi — bu chiziqli tenglama, uning bitta ildizi bor. Ikkinchisida esa bosh koeffitsiyent uchga teng, ya'ni noldan farqli — bu kvadrat tenglama, a uch, b minus besh, c ikki.",
    'Верно. В первой старший коэффициент нуль, и нуль на икс квадрат при любом иксе обращается в нуль. Квадратное слагаемое исчезает, от записи остаётся четыре икс минус один — это линейное уравнение с одним корнем. А во второй старший коэффициент равен трём, то есть не нулю — это квадратное уравнение: a три, b минус пять, c два.',
    'Correct. In the first the leading coefficient is zero, and zero times x squared vanishes for every x. The squared term disappears and what remains is four x minus one — a linear equation with a single root. In the second the leading coefficient is three, not zero — so it is a quadratic equation: a is three, b is minus five, c is two.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Birinchi yozuvda kvadrat had ko'rinib turadi, lekin uning oldida NOL turadi. Nolni har qanday songa ko'paytirsangiz nol chiqadi, demak x kvadratli qism butunlay yo'qoladi. Qolgani to'rt x minus bir — chiziqli tenglama. Ta'rifning sharti aynan shu holat uchun yozilgan: a nolga teng emas.",
      'В первой записи квадратное слагаемое видно, но перед ним стоит НУЛЬ. Нуль на любое число даёт нуль, значит часть с икс квадрат исчезает полностью. Остаётся четыре икс минус один — линейное уравнение. Условие определения написано именно для этого случая: a не равно нулю.',
      'In the first record the squared term is visible, but a ZERO stands in front of it. Zero times anything is zero, so the x squared part vanishes entirely. What remains is four x minus one — a linear equation. The condition in the definition is written for exactly this case: a is not zero.') },
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Ikkinchi yozuv kvadrat tenglama. Uch koeffitsiyentni o'qib ko'ring: a uch, b minus besh, c ikki. Bosh koeffitsiyent noldan farqli, ya'ni kvadrat had joyida qoladi — boshqa shart esa ta'rifda yo'q.",
      'Вторая запись — квадратное уравнение. Прочти три коэффициента: a три, b минус пять, c два. Старший коэффициент не нуль, значит квадратное слагаемое остаётся на месте — а других условий в определении нет.',
      'The second record is a quadratic equation. Read off the three coefficients: a is three, b is minus five, c is two. The leading coefficient is not zero, so the squared term stays — and the definition asks for nothing more.') },
  ],
  wrongText: L(
    "Har yozuvda bitta narsani tekshiring: x kvadratning oldidagi son nolga tengmi. Nol bo'lsa, kvadrat had yo'qoladi va tenglama kvadrat bo'lmay qoladi.",
    'В каждой записи проверяй одно: равен ли нулю коэффициент перед икс квадрат. Если нуль — квадратное слагаемое исчезает и уравнение перестаёт быть квадратным.',
    'Check one thing in each record: is the number in front of x squared zero. If it is, the squared term vanishes and the equation stops being quadratic.'),
};

export default function D15_01(props) { return <TrueFalse data={DATA} {...props} />; }
