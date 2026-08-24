// Dars11 · Amaliyot 04 — Moslashtirish · 🟡 · tag: record_to_condition
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
// Skelet: DARS07_11_AMALIYOT_SKELET.md §9 (11-dars, 4-pozitsiya)
//
// Darsning ikkinchi xossasi: √(d²) va (√d)² — bir xil ko'rinadi, sohasi esa
// boshqa. To'rt yozuv to'rt xil shart beradi:
//   √(d²)   har qanday d da  — ildiz osti kvadrat, u manfiy bo'lmaydi;
//   (√d)²   faqat d ≥ 0 da   — ildiz TASHQARIDAN kvadratga oshirilgan;
//   √(−d)   faqat d ≤ 0 da   — minus ildiz ostida, ya'ni d manfiy bo'lsin;
//   √(d−2)  faqat d ≥ 2 da   — chegara ikkiga surilgan.
// Uchinchisi eng qimmat: «minus bor, demak ma'nosiz» degan xulosa uni
// tashlab yuboradi, aslida shart TESKARI tomonga qaraydi (З32).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const DATA = {
  tag: 'record_to_condition', level: '🟡',
  connect: true,
  targetSize: 18,
  items: [
    { id: 'm1', label: L('har qanday d da', 'при любом d', 'for every d') },
    { id: 'm2', label: L('faqat d ≥ 0 da', 'только при d ≥ 0', 'only for d ≥ 0') },
    { id: 'm3', label: L('faqat d ≤ 0 da', 'только при d ≤ 0', 'only for d ≤ 0') },
    { id: 'm4', label: L('faqat d ≥ 2 da', 'только при d ≥ 2', 'only for d ≥ 2') },
  ],
  targets: [
    { id: 't1', tokens: [{ r: 'd²' }] },
    { id: 't2', tokens: ['(', { r: 'd' }, ')²'] },
    { id: 't3', tokens: [{ r: '−d' }] },
    { id: 't4', tokens: [{ r: 'd − 2' }] },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Moslashtirish', 'Соответствие', 'Match'),
  setup: L(
    "To'rt yozuv o'xshash ko'rinadi, lekin har biri boshqa joyda ma'noga ega. Ildizning ustki chizig'i qaysi ifoda ildiz ostida turganini ko'rsatadi.",
    'Четыре записи выглядят похоже, но каждая имеет смысл в своём месте. Черта над корнем показывает, какое выражение стоит под ним.',
    'The four records look alike, but each has a value in its own place. The bar over the root shows which expression stands under it.'),
  ask: L(
    "Chapdan shartni bosing, keyin o'ngdan unga mos yozuvni bosing.",
    'Нажми условие слева, потом подходящую запись справа.',
    'Tap a condition on the left, then tap the matching record on the right.'),
  correctText: L(
    "To'g'ri. Birinchi yozuvda ildiz ostida kvadrat turadi, kvadrat esa hech qachon manfiy emas — shart yo'q. Ikkinchisida kvadrat ildizdan TASHQARIDA, ya'ni avval ildiz olinadi: buning uchun d nomanfiy bo'lishi kerak. Uchinchisida ildiz ostida minus d turadi: u nomanfiy bo'lishi uchun d ning o'zi nomanfiy BO'LMASLIGI kerak, ya'ni d noldan katta emas. To'rtinchisida d minus ikki nomanfiy bo'lsin, demak d kamida ikki.",
    'Верно. В первой записи под корнем квадрат, а квадрат никогда не отрицателен — условия нет. Во второй квадрат СНАРУЖИ корня, то есть сначала берётся корень: для этого d обязано быть неотрицательным. В третьей под корнем минус d: чтобы оно было неотрицательным, само d не должно быть положительным, то есть d не больше нуля. В четвёртой d минус два должно быть неотрицательным, значит d не меньше двух.',
    'Correct. In the first record a square stands under the root, and a square is never negative — no condition. In the second the square is OUTSIDE the root, so the root comes first: for that d must be non-negative. In the third minus d stands under the root: for it to be non-negative, d itself must not be positive, that is d is not more than zero. In the fourth d minus two must be non-negative, so d is at least two.'),
  wrongs: [
    { when: (s) => s.pair.m2 === 't1' || s.pair.m1 === 't2', text: L(
      "Kvadrat qayerda turganiga qarang. Bir yozuvda u ildiz OSTIDA — o'sha yerda ildiz osti hech qachon manfiy bo'lmaydi. Boshqasida esa kvadrat ildizdan tashqarida, ya'ni ildiz oldin olinadi. d ni minus to'rtga qo'yib ikkalasini tekshiring.",
      'Смотри, где стоит квадрат. В одной записи он ПОД корнем — там подкоренное никогда не отрицательно. В другой квадрат снаружи, то есть корень берётся первым. Подставь d равное минус четырём и проверь обе.',
      'Look at where the square stands. In one record it is UNDER the root — there the radicand is never negative. In the other the square is outside, so the root comes first. Substitute d equal to minus four and check both.') },
    { when: (s) => s.pair.m3 === 't4' || s.pair.m4 === 't3', text: L(
      "Ikki shartni chalkashtirmang. Minus d nomanfiy bo'lishi uchun d MANFIY tomonda bo'lishi kerak: d ni minus beshga qo'ying — ildiz osti besh, ya'ni ma'noga ega. d minus ikkida esa teskari: d ni minus beshga qo'ysangiz minus yetti chiqadi.",
      'Не путай два условия. Чтобы минус d было неотрицательным, d должно быть в ОТРИЦАТЕЛЬНОЙ стороне: подставь минус пять — подкоренное станет пять, запись имеет смысл. А в d минус два наоборот: при минус пяти выйдет минус семь.',
      'Do not mix the two conditions. For minus d to be non-negative, d must be on the NEGATIVE side: substitute minus five and the radicand becomes five, so the record has a value. In d minus two it is the other way: at minus five you get minus seven.') },
    { when: (s) => s.pair.m1 === 't3' || s.pair.m3 === 't1', text: L(
      "Minus va kvadratni solishtiring. Kvadrat ildiz ostini nomanfiy qiladi, oldidagi minus esa uni d ning ishorasiga bog'laydi. d ni uchga qo'ying: birinchisida to'qqiz, ikkinchisida minus uch.",
      'Сравни минус и квадрат. Квадрат делает подкоренное неотрицательным, а минус перед d привязывает его к знаку d. Подставь d равное трём: в первой девять, во второй минус три.',
      'Compare the minus and the square. A square makes the radicand non-negative, while a minus in front of d ties it to the sign of d. Substitute d equal to three: the first gives nine, the second minus three.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har yozuvga uch qiymat qo'ying: minus besh, nol va besh. Ildiz osti nomanfiy chiqqan joylar sohani beradi.",
      'Подставь в каждую запись три значения: минус пять, нуль и пять. Там, где подкоренное неотрицательно, и есть область.',
      'Substitute three values into each record: minus five, zero and five. Where the radicand comes out non-negative, that is the domain.') },
  ],
  wrongText: L(
    "Har yozuvda ildiz ostini nomanfiy deb yozing va tengsizlikni yechib ko'ring. Kvadrat ildizdan tashqarida bo'lsa, shart ildiz ostidan keladi.",
    'В каждой записи запиши подкоренное как неотрицательное и реши неравенство. Если квадрат снаружи корня, условие приходит от подкоренного.',
    'In each record write the radicand as non-negative and solve the inequality. When the square is outside the root, the condition comes from the radicand.'),
};

export default function D11_04(props) { return <MatchPairs data={DATA} {...props} />; }
