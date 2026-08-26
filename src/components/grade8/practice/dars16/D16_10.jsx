// Dars16 · Amaliyot 10 — Juftlash · 🔴 · tag: equation_to_roots
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §4 (16-dars, 10-pozitsiya)
//
// CHALA TENGLAMANING UCH KO'RINISHI VA TO'RTINCHI HOL BIR JOYDA (T1):
//   2x² − 10x = 0 — umumiy ko'paytuvchi, ildizlardan biri nol;
//   x² − 49 = 0   — ikki ildiz, ishoralari qarama-qarshi;
//   6x² = 0       — bitta ildiz, nol;
//   x² + 9 = 0    — ildiz yo'q.
// Oxirgi ikkitasi eng qimmat juftlik: «bitta ildiz» va «ildiz yo'q» ni
// aralashtirish oson, holbuki birinchisida ildiz BOR va u nolga teng.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const DATA = {
  tag: 'equation_to_roots', level: '🔴',
  connect: true,
  targetSize: 15,
  items: [
    { id: 'm1', label: L('ildizlari 0 va 5', 'корни 0 и 5', 'roots 0 and 5') },
    { id: 'm2', label: L('ildizlari −7 va 7', 'корни −7 и 7', 'roots −7 and 7') },
    { id: 'm3', label: L("bitta ildiz — nol", 'один корень — нуль', 'one root — zero') },
    { id: 'm4', label: L("ildiz yo'q", 'корней нет', 'no roots') },
  ],
  targets: [
    { id: 't1', tokens: ['2x² − 10x = 0'] },
    { id: 't2', tokens: ['x² − 49 = 0'] },
    { id: 't3', tokens: ['6x² = 0'] },
    { id: 't4', tokens: ['x² + 9 = 0'] },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Juftlash', 'Пары', 'Pairs'),
  setup: L(
    "To'rt chala tenglama, to'rt xil natija: ikki ildiz nol bilan, ikki ildiz qarama-qarshi ishorada, bitta ildiz, va ildizning yo'qligi.",
    'Четыре неполных уравнения и четыре разных исхода: два корня с нулём, два корня с противоположными знаками, один корень и отсутствие корней.',
    'Four incomplete equations and four different outcomes: two roots with a zero, two roots of opposite signs, one root, and no roots at all.'),
  ask: L(
    "Chapdan natijani bosing, keyin o'ngdan uning tenglamasini bosing.",
    'Нажми результат слева, потом его уравнение справа.',
    'Tap a result on the left, then its equation on the right.'),
  correctText: L(
    "To'g'ri. Birinchisida umumiy ko'paytuvchi bor: ikki x karra qavs ichida x minus besh — ildizlar nol va besh. Ikkinchisida x kvadrat qirq to'qqizga teng, ildizlar minus yetti va yetti. Uchinchisida x kvadrat nolga teng, va nolga teng kvadratni faqat nol beradi — bitta ildiz. To'rtinchisida x kvadrat minus to'qqizga teng bo'lishi kerak, bu esa mumkin emas.",
    'Верно. В первом есть общий множитель: два x на скобку x минус пять — корни нуль и пять. Во втором x квадрат равно сорока девяти, корни минус семь и семь. В третьем x квадрат равно нулю, а нулевой квадрат даёт только нуль — один корень. В четвёртом x квадрат должен равняться минус девяти, а это невозможно.',
    'Correct. The first has a common factor: two x times the bracket x minus five — roots zero and five. In the second x squared equals forty nine, roots minus seven and seven. In the third x squared equals zero, and only zero squares to zero — one root. In the fourth x squared would have to equal minus nine, which is impossible.'),
  wrongs: [
    { when: (s) => s.pair.m3 === 't4' || s.pair.m4 === 't3', text: L(
      "Bu ikki natija almashdi, va bu darsning eng qimmat farqi. Olti x kvadrat nolga teng tenglamada ildiz BOR: x kvadrat nolga teng, demak x nolga teng. x kvadrat qo'shuv to'qqiz nolga teng tenglamada esa ildiz umuman yo'q: x kvadrat minus to'qqizga teng bo'lolmaydi. «Ildizi nol» va «ildizi yo'q» boshqa-boshqa javob.",
      'Эти два результата поменялись местами, и это самое дорогое различие урока. В уравнении шесть x квадрат равно нулю корень ЕСТЬ: x квадрат нуль, значит x нуль. А в уравнении x квадрат плюс девять равно нулю корней нет вовсе: x квадрат не может равняться минус девяти. «Корень нуль» и «корней нет» — разные ответы.',
      'These two results swapped, and this is the most valuable distinction of the lesson. In six x squared equals zero a root EXISTS: x squared is zero, so x is zero. In x squared plus nine equals zero there are no roots at all: x squared cannot equal minus nine. «The root is zero» and «there are no roots» are different answers.') },
    { when: (s) => s.pair.m1 === 't2' || s.pair.m2 === 't1', text: L(
      "Bu ikki tenglama ham ikki ildizli, lekin ildizlar boshqa. Birinchisida umumiy ko'paytuvchi x bor, demak ildizlardan biri albatta NOL. Ikkinchisida x li had yo'q, faqat kvadrat va son — u yerda ildizlar kattaligi bir xil, ishorasi qarama-qarshi.",
      'У этих двух уравнений тоже по два корня, но корни разные. В первом есть общий множитель x, значит один из корней обязательно НУЛЬ. Во втором нет слагаемого с x, только квадрат и число — там корни одинаковой величины и противоположных знаков.',
      'Both these equations have two roots, but the roots differ. The first has x as a common factor, so one of its roots is necessarily ZERO. The second has no x term, only a square and a number — there the roots share their size and differ in sign.') },
    { when: (s) => s.pair.m2 !== 't2', text: L(
      "Minus yetti va yetti juftligi x kvadrat qirq to'qqizga teng bo'lgan tenglamadan chiqadi: yetti karra yetti qirq to'qqiz, minus yetti karra minus yetti ham qirq to'qqiz. Qirq to'qqiz o'ng tomonga o'tganda ishorasi almashadi, ya'ni yozuvda minus qirq to'qqiz turishi kerak.",
      'Пара минус семь и семь выходит из уравнения, где x квадрат равно сорока девяти: семь на семь сорок девять, минус семь на минус семь тоже сорок девять. При переносе сорок девять меняет знак, значит в записи должно стоять минус сорок девять.',
      'The pair minus seven and seven comes from the equation where x squared equals forty nine: seven times seven is forty nine, minus seven times minus seven is forty nine too. Moving forty nine flips its sign, so the record must show minus forty nine.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har tenglamada bitta savol bering: x li had bormi? Bo'lsa — umumiy ko'paytuvchi chiqariladi va nol ildiz paydo bo'ladi. Bo'lmasa — x kvadratni yolg'iz qoldirib o'ng tomonning ishorasiga qarang.",
      'В каждом уравнении задай один вопрос: есть ли слагаемое с x? Есть — выносится общий множитель и появляется корень нуль. Нет — оставь x квадрат в одиночестве и смотри на знак справа.',
      'Ask one question of every equation: is there an x term? If yes, a common factor comes out and a zero root appears. If no, leave x squared alone and look at the sign on the right.') },
  ],
  wrongText: L(
    "Ikki yo'l bor: x li had bo'lsa ko'paytuvchilarga ajratish, bo'lmasa x kvadratni yolg'iz qoldirish. Har javobni tenglamaga qo'yib tekshiring.",
    'Два пути: если есть слагаемое с x — вынести множитель, если нет — оставить x квадрат в одиночестве. Каждый ответ проверь подстановкой.',
    'Two routes: with an x term, factor it out; without one, leave x squared alone. Check every answer by substituting it back.'),
};

export default function D16_10(props) { return <MatchPairs data={DATA} {...props} />; }
