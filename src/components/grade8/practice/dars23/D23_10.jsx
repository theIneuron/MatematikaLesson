// Dars23 · Amaliyot 10 — Juftlash · 🔴 · tag: pair_to_difference
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §5 (23-dars, 10-pozitsiya)
//
// TO'RT AYIRMANING SURATI BIR. Hamma juftlikda birinchi kasr kattaroq va
// ayirma musbat, ya'ni ISHORA hech narsani ajratmaydi — juftlashni faqat
// HISOB hal qiladi (T3, З50):
//   4/5 − 3/4 = 16/20 − 15/20 = 1/20
//   5/6 − 4/5 = 25/30 − 24/30 = 1/30
//   3/4 − 2/3 = 9/12 − 8/12   = 1/12
//   2/3 − 3/5 = 10/15 − 9/15  = 1/15
//
// Naqsh ham ko'rinadi: ketma-ket ikki kasrning ayirmasi maxrajlarning
// ko'paytmasiga teng bo'lgan bir bo'lakni beradi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const DATA = {
  tag: 'pair_to_difference', level: '🔴',
  connect: true,
  targetSize: 15, itemSize: 15,
  items: [
    { id: 'm1', tokens: [{ n: '1', d: '20' }] },
    { id: 'm2', tokens: [{ n: '1', d: '30' }] },
    { id: 'm3', tokens: [{ n: '1', d: '12' }] },
    { id: 'm4', tokens: [{ n: '1', d: '15' }] },
  ],
  targets: [
    { id: 't1', tokens: [{ n: '4', d: '5' }, '−', { n: '3', d: '4' }] },
    { id: 't2', tokens: [{ n: '5', d: '6' }, '−', { n: '4', d: '5' }] },
    { id: 't3', tokens: [{ n: '3', d: '4' }, '−', { n: '2', d: '3' }] },
    { id: 't4', tokens: [{ n: '2', d: '3' }, '−', { n: '3', d: '5' }] },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Juftlash', 'Пары', 'Pairs'),
  setup: L(
    "To'rt ayirma va to'rt natija. Hammasi musbat, ya'ni ishoraga qarab juftlab bo'lmaydi — har birini hisoblash kerak.",
    'Четыре разности и четыре результата. Все положительны, значит по знаку пары не составишь — каждую надо вычислить.',
    'Four differences and four results. All of them are positive, so matching by sign is impossible — each must be computed.'),
  ask: L(
    "Chapdan natijani bosing, keyin o'ngdan uning ayirmasini bosing.",
    'Нажми результат слева, потом его разность справа.',
    'Tap a result on the left, then its difference on the right.'),
  correctText: L(
    "To'g'ri. Umumiy maxraj maxrajlarning ko'paytmasi bo'ladi: yigirma, o'ttiz, o'n ikki, o'n besh. Suratlar esa bir birlikka farq qiladi, shuning uchun har natijaning surati bir. Hammasi musbat — demak har juftlikda birinchi kasr kattaroq.",
    'Верно. Общий знаменатель — это произведение знаменателей: двадцать, тридцать, двенадцать, пятнадцать. А числители отличаются на единицу, поэтому у каждого результата числитель равен одному. Все положительны — значит в каждой паре первая дробь больше.',
    'Correct. The common denominator is the product of the denominators: twenty, thirty, twelve, fifteen. The numerators differ by one, so every result has numerator one. All are positive — so in every pair the first fraction is greater.'),
  wrongs: [
    { when: (s) => s.pair.m1 === 't2' || s.pair.m2 === 't1', text: L(
      "Bu ikki ayirmada to'rt beshdan ishtirok etadi, lekin ular boshqa natija beradi. Umumiy maxrajni ko'ring: birinchisida besh va to'rt — yigirma; ikkinchisida olti va besh — o'ttiz. Maxrajlar qanchalik katta bo'lsa, ular orasidagi bo'lak shunchalik kichik: bir o'ttizdan bir yigirmadandan kichik.",
      'В этих двух разностях участвуют четыре пятых, но результаты у них разные. Посмотри на общий знаменатель: в первой пять и четыре — двадцать; во второй шесть и пять — тридцать. Чем больше знаменатели, тем мельче доля между ними: одна тридцатая меньше одной двадцатой.',
      'These two differences both involve four fifths, yet they give different results. Look at the common denominator: in the first, five and four — twenty; in the second, six and five — thirty. The larger the denominators, the finer the gap between them: one thirtieth is smaller than one twentieth.') },
    { when: (s) => s.pair.m3 === 't4' || s.pair.m4 === 't3', text: L(
      "Bu ikki ayirmani ham umumiy maxraj ajratadi: uch to'rtdan minus ikki uchdanda maxrajlar to'rt va uch — o'n ikki; ikki uchdan minus uch beshdanda uch va besh — o'n besh. Suratlar ikkalasida ham bir birlikka farq qiladi, natijaning surati esa bir.",
      'Эти две разности тоже разделяет общий знаменатель: у трёх четвёртых минус две трети знаменатели четыре и три — двенадцать; у двух третей минус три пятых три и пять — пятнадцать. Числители в обоих случаях отличаются на единицу, а числитель результата равен одному.',
      'These two differences are separated by the common denominator as well: for three quarters minus two thirds the denominators are four and three — twelve; for two thirds minus three fifths they are three and five — fifteen. In both cases the numerators differ by one, and the numerator of the result is one.') },
    { when: (s) => s.pair.m1 === 't3' || s.pair.m1 === 't4' || s.pair.m2 === 't3' || s.pair.m2 === 't4', text: L(
      "Natijaning MAXRAJIGA qarang — u ayirmaning maxrajlaridan yasaladi. Yigirma faqat besh va to'rtdan chiqadi, o'ttiz faqat olti va beshdan, o'n ikki to'rt va uchdan, o'n besh esa uch va beshdan. Shu bitta belgi to'rt juftlikni ham ajratib beradi.",
      'Смотри на ЗНАМЕНАТЕЛЬ результата — он собирается из знаменателей разности. Двадцать выходит только из пяти и четырёх, тридцать из шести и пяти, двенадцать из четырёх и трёх, а пятнадцать из трёх и пяти. Один этот признак и разводит все четыре пары.',
      'Look at the DENOMINATOR of the result — it is built from the denominators of the difference. Twenty comes only from five and four, thirty from six and five, twelve from four and three, and fifteen from three and five. That single feature separates all four pairs.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har ayirmada bir xil ish qiling: umumiy maxrajga keltiring, suratlarni ayiring va natijani yozing. Umumiy maxraj — maxrajlarning ko'paytmasi.",
      'В каждой разности делай одно и то же: приведи к общему знаменателю, вычти числители и запиши результат. Общий знаменатель — произведение знаменателей.',
      'Do the same in every difference: bring it to a common denominator, subtract the numerators and write the result. The common denominator is the product of the denominators.') },
  ],
  wrongText: L(
    "Har ayirmani hisoblang: umumiy maxraj maxrajlarning ko'paytmasi bo'ladi. Natijaning maxraji qaysi ayirmadan chiqqanini darrov ko'rsatadi.",
    'Вычисли каждую разность: общий знаменатель это произведение знаменателей. Знаменатель результата сразу показывает, из какой разности он вышел.',
    'Compute each difference: the common denominator is the product of the denominators. The denominator of the result immediately shows which difference it came from.'),
};

export default function D23_10(props) { return <MatchPairs data={DATA} {...props} />; }
