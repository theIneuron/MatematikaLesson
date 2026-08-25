// Dars11 · Amaliyot 06 — Pazl · 🟡 · tag: value_pairs
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Skelet: DARS07_11_AMALIYOT_SKELET.md §9 (11-dars, 6-pozitsiya)
//
// Uch yozuv, uch qiymat — va uchtasi ham darsning boshqa joyiga tegadi:
//   √(6² + 8²)  ildiz ostini AVVAL hisoblash kerak: yuz, ildizi o'n (З4);
//   (√11)²      kvadratga oshirish ildizni yechadi: o'n bir;
//   √((−9)²)    kvadratdan olingan ildiz modulni beradi: to'qqiz (З31).
// Ikki tomon ham matematika, shuning uchun kartalarda `side` ochiq berilgan.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'value_pairs', level: '🟡',
  cardSize: 92, faceSize: 19, cardSizePhone: 64, faceSizePhone: 13,
  cards: [
    { id: 'f1', side: 0, tokens: [{ r: '6² + 8²' }] },
    { id: 'f2', side: 0, tokens: ['(', { r: '11' }, ')²'] },
    { id: 'f3', side: 0, tokens: [{ r: '(−9)²' }] },
    { id: 'v1', side: 1, tokens: ['10'] },
    { id: 'v2', side: 1, tokens: ['11'] },
    { id: 'v3', side: 1, tokens: ['9'] },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "Uch yozuvning har biri boshqa yo'l bilan hisoblanadi: birida ildiz ostini yig'ish kerak, birida kvadrat ildizni yechadi, birida esa modul chiqadi.",
    'Каждая из трёх записей считается своим путём: в одной надо сложить подкоренное, в другой квадрат снимает корень, в третьей выходит модуль.',
    'Each of the three records is computed its own way: one needs the radicand added up, in another the square undoes the root, in the third a modulus comes out.'),
  ask: L(
    "Yozuvni bosing, keyin uyani bosing.",
    'Нажми запись, потом ячейку.',
    'Tap a record, then a slot.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Birinchisida ildiz ostini avval hisoblash kerak: o'ttiz olti qo'shuv oltmish to'rt yuz, yuzdan ildiz o'n. Ikkinchisida kvadrat ildizni yechadi va o'n bir qaytadi — hisoblash kerak emas, chunki o'n bir nomanfiy. Uchinchisida minus to'qqizning kvadrati sakson bir, ildizi to'qqiz: kvadratdan olingan ildiz modulni beradi.",
    'Верно. В первой сначала надо посчитать подкоренное: тридцать шесть плюс шестьдесят четыре сто, корень из ста десять. Во второй квадрат снимает корень и возвращается одиннадцать — считать не надо, ведь одиннадцать неотрицательно. В третьей квадрат минус девяти восемьдесят один, корень девять: корень из квадрата даёт модуль.',
    'Correct. In the first the radicand must be computed: thirty six plus sixty four is one hundred and the root of one hundred is ten. In the second the square undoes the root and eleven comes back — no computing needed, since eleven is non-negative. In the third the square of minus nine is eighty one and the root is nine: the root of a square gives the modulus.'),
  wrongs: [
    { when: (s) => s.mate.f1 === 'v3' || s.mate.f3 === 'v1', text: L(
      "Ikkalasini oxirigacha hisoblang. Birinchisida ildiz ostida yig'indi turadi: o'ttiz olti qo'shuv oltmish to'rt yuz, ildizi o'n. Olti qo'shuv sakkiz esa o'n to'rt — ildizni hadlarga bo'lib chiqarib bo'lmaydi. Uchinchisida sakson bir chiqadi, ildizi to'qqiz.",
      'Посчитай оба до конца. В первой под корнем сумма: тридцать шесть плюс шестьдесят четыре сто, корень десять. А шесть плюс восемь это четырнадцать — корень нельзя раздать по слагаемым. В третьей выходит восемьдесят один, корень девять.',
      'Compute both to the end. In the first a sum stands under the root: thirty six plus sixty four is one hundred and the root is ten. Six plus eight is fourteen — a root cannot be distributed over terms. In the third eighty one comes out and the root is nine.') },
    { when: (s) => s.mate.f2 && s.mate.f2 !== 'v2', text: L(
      "Ikkinchi yozuvda kvadrat ildizdan TASHQARIDA: u ildizni yechadi va ildiz ostidagi son qaytadi. Ya'ni javob o'n bir, va uni hisoblash kerak ham emas.",
      'Во второй записи квадрат стоит СНАРУЖИ корня: он снимает корень и возвращается подкоренное число. То есть ответ одиннадцать, и считать его не нужно.',
      'In the second record the square is OUTSIDE the root: it undoes the root and the radicand comes back. So the answer is eleven, and there is nothing to compute.') },
    { when: (s) => s.mate.f3 === 'v2' || s.mate.f2 === 'v3', text: L(
      "Uchinchi yozuvda kvadrat ildiz OSTIDA turadi, ikkinchisida esa tashqarida. Ustki chiziqqa qarang: u qaysi ifoda ildiz ostida ekanini aytadi.",
      'В третьей записи квадрат стоит ПОД корнем, а во второй снаружи. Смотри на черту: она говорит, какое выражение под корнем.',
      'In the third record the square stands UNDER the root, in the second outside it. Look at the bar: it tells you which expression is under the root.') },
  ],
  wrongText: L(
    "Har yozuvda avval ildiz ostini oxirigacha hisoblang, keyin ildizni oling. Kvadrat tashqarida bo'lsa, u ildizni yechadi.",
    'В каждой записи сначала посчитай подкоренное до конца, потом бери корень. Если квадрат снаружи, он снимает корень.',
    'In each record compute the radicand to the end first, then take the root. If the square is outside, it undoes the root.'),
};

export default function D11_06(props) { return <PairSlots data={DATA} {...props} />; }
