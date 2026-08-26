// Dars41 · Amaliyot 07 — Juftlash · 🟡 · tag: base_height_to_area
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §3 (41-dars, 7-pozitsiya)
//
// TO'RT UCHBURCHAK, OXIRGISI BOSHQA YO'LDAN. Uchtasida asos va balandlik
// berilgan, to'rtinchisida esa KATETLAR (T2) — shu sababli u yerda `h` emas,
// `b` yozilgan. Yozuvning shakli qaysi yo'l ekanini aytadi.
//
// З85 darhol ko'rinadi: ikkiga bo'lmagan o'quvchi yigirma to'rt, o'ttiz,
// o'ttiz olti va qirq ikkini oladi — o'ng ustunda bunday son yo'q.
// O'ng ustun har ochilganda aralashtiriladi (MatchPairs ichida).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const DATA = {
  tag: 'base_height_to_area', level: '🟡',
  connect: true,
  targetSize: 18, itemSize: 16,
  items: [
    { id: 'm1', tokens: ['a=8, h=3'] },
    { id: 'm2', tokens: ['a=5, h=6'] },
    { id: 'm3', tokens: ['a=9, h=4'] },
    { id: 'm4', tokens: ['a=6, b=7'] },
  ],
  targets: [
    { id: 't1', tokens: ['12'] },
    { id: 't2', tokens: ['15'] },
    { id: 't3', tokens: ['18'] },
    { id: 't4', tokens: ['21'] },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Juftlash', 'Сопоставление', 'Matching'),
  setup: L(
    "To'rt uchburchak berilgan. Uchtasida asos va balandlik yozilgan, to'rtinchisi esa to'g'ri burchakli va unda ikki KATET yozilgan.",
    'Даны четыре треугольника. В трёх записаны основание и высота, а четвёртый прямоугольный, и в нём записаны два КАТЕТА.',
    'Four triangles are given. Three record a base and a height; the fourth is right-angled and records its two LEGS.'),
  ask: L(
    "Chapdan uchburchakni bosing, keyin o'ngdan uning yuzasini bosing.",
    'Нажми треугольник слева, потом его площадь справа.',
    'Tap a triangle on the left, then its area on the right.'),
  correctText: L(
    "To'g'ri. Har juftlikda bitta ish bajariladi: ikki uzunlikni ko'paytirib ikkiga bo'lish. Sakkiz karra uch yigirma to'rt, yarmi o'n ikki; besh karra olti o'ttiz, yarmi o'n besh; to'qqiz karra to'rt o'ttiz olti, yarmi o'n sakkiz. Oxirgi uchburchakda balandlik alohida berilmagan, chunki u kerak emas: katetlar bir-biriga perpendikulyar, ya'ni biri asos, ikkinchisi balandlik. Olti karra yetti qirq ikki, yarmi yigirma bir.",
    'Верно. В каждой паре делается одно: перемножить две длины и разделить надвое. Восемь на три — двадцать четыре, половина двенадцать; пять на шесть — тридцать, половина пятнадцать; девять на четыре — тридцать шесть, половина восемнадцать. У последнего треугольника высота отдельно не дана, потому что она не нужна: катеты перпендикулярны друг другу, то есть один основание, второй высота. Шесть на семь — сорок два, половина двадцать один.',
    'Correct. One thing is done in every pair: multiply two lengths and halve. Eight times three is twenty four, half is twelve; five times six is thirty, half is fifteen; nine times four is thirty six, half is eighteen. The last triangle gives no separate height because none is needed: the legs are perpendicular to each other, so one is the base and the other the height. Six times seven is forty two, half is twenty one.'),
  wrongs: [
    { when: (s) => s.pair.m1 === 't3' || s.pair.m3 === 't1', text: L(
      "Bu ikki juftlik almashib ketdi. Har birini alohida hisoblang: sakkiz karra uch yigirma to'rt, yarmi o'n ikki; to'qqiz karra to'rt o'ttiz olti, yarmi o'n sakkiz. Sonlar o'xshash ko'rinadi, ko'paytmalari esa boshqa.",
      'Эти две пары поменялись местами. Посчитай каждую отдельно: восемь на три — двадцать четыре, половина двенадцать; девять на четыре — тридцать шесть, половина восемнадцать. Числа похожи, а произведения разные.',
      'These two pairs were swapped. Compute each on its own: eight times three is twenty four, half is twelve; nine times four is thirty six, half is eighteen. The numbers look alike, the products do not.') },
    { when: (s) => s.pair.m4 && s.pair.m4 !== 't4', text: L(
      "Oxirgi uchburchakda ikki KATET yozilgan, ya'ni balandlikni izlash kerak emas. Katetlar to'g'ri burchakni tashkil qiladi, demak biri asos, ikkinchisi unga mos balandlik: olti karra yetti ning yarmi yigirma bir.",
      'У последнего треугольника записаны два КАТЕТА, значит высоту искать не нужно. Катеты образуют прямой угол, то есть один основание, второй соответствующая высота: половина от шести на семь — двадцать один.',
      'The last triangle records two LEGS, so no height needs finding. The legs form the right angle, so one is the base and the other the matching height: half of six times seven is twenty one.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Ko'paytmaning O'ZI javob emas. Har juftlikda ikki sonni ko'paytirgandan keyin natijani ikkiga bo'ling: yigirma to'rt, o'ttiz, o'ttiz olti va qirq ikki emas, ularning yarmi kerak.",
      'САМО произведение — не ответ. В каждой паре после умножения раздели результат на два: нужны не двадцать четыре, тридцать, тридцать шесть и сорок два, а их половины.',
      'The product ITSELF is not the answer. In every pair halve the result after multiplying: not twenty four, thirty, thirty six and forty two, but their halves.') },
  ],
  wrongText: L(
    "Ikki uzunlikni ko'paytirib ikkiga bo'ling. Oxirgi uchburchakda balandlik o'rnida ikkinchi katet turadi.",
    'Перемножь две длины и раздели на два. У последнего треугольника вместо высоты стоит второй катет.',
    'Multiply the two lengths and halve. In the last triangle the second leg stands in for the height.'),
};

export default function D41_07(props) { return <MatchPairs data={DATA} {...props} />; }
