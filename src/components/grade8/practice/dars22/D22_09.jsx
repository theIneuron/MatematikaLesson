// Dars22 · Amaliyot 09 — Juftlash · 🔴 · tag: biquad_to_roots
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §4 (22-dars, 9-pozitsiya)
//
// TO'RT TENGLAMA — BIR OILADAN. Hammasida uch soni ishtirok etadi, farq
// esa ISHORALARDA va ozod hadning bor-yo'qligida:
//   x⁴ − 10x² + 9 = 0 -> t = 1 va 9   -> ±1 va ±3
//   x⁴ − 5x² − 36 = 0 -> t = 9 va −4  -> ±3      (manfiy t rad etiladi)
//   x⁴ + 10x² + 9 = 0 -> t = −1 va −9 -> ildiz yo'q
//   x⁴ − 9x² = 0      -> t = 0 va 9   -> 0 va ±3 (chala, nol ildiz bor)
//
// Ya'ni bitta jadvalda T2, T3, З40, З48 va 16-darsning З42 si birga turadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const DATA = {
  tag: 'biquad_to_roots', level: '🔴',
  connect: true,
  targetSize: 14, itemSize: 14,
  items: [
    { id: 'm1', tokens: ['±1; ±3'] },
    { id: 'm2', tokens: ['±3'] },
    { id: 'm3', label: L("ildiz yo'q", 'корней нет', 'no roots') },
    { id: 'm4', tokens: ['0; ±3'] },
  ],
  targets: [
    { id: 't1', tokens: ['x⁴ − 10x² + 9 = 0'] },
    { id: 't2', tokens: ['x⁴ − 5x² − 36 = 0'] },
    { id: 't3', tokens: ['x⁴ + 10x² + 9 = 0'] },
    { id: 't4', tokens: ['x⁴ − 9x² = 0'] },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Juftlash', 'Пары', 'Pairs'),
  setup: L(
    "To'rt bikvadrat tenglama va to'rt javob. Hamma joyda uch soni ishtirok etadi, farq esa ishoralarda: har tenglamada belgilash qilib, t larni topish va manfiylarini rad etish kerak.",
    'Четыре биквадратных уравнения и четыре ответа. Везде участвует тройка, а различие в знаках: в каждом уравнении надо сделать замену, найти t и отбросить отрицательные.',
    'Four biquadratic equations and four answers. A three takes part everywhere; the difference lies in the signs: in each equation make the substitution, find the values of t and reject the negative ones.'),
  ask: L(
    "Chapdan javobni bosing, keyin o'ngdan uning tenglamasini bosing.",
    'Нажми ответ слева, потом его уравнение справа.',
    'Tap an answer on the left, then its equation on the right.'),
  correctText: L(
    "To'g'ri. Birinchisida t bir va to'qqiz — to'rt ildiz. Ikkinchisida to'qqiz va minus to'rt — minus to'rt rad etiladi. Uchinchisida ikkala t ham manfiy — ildiz yo'q. To'rtinchisi chala: t nol yoki to'qqiz, va nol ildizni yo'qotmaslik kerak.",
    'Верно. В первом t равно одному и девяти — четыре корня. Во втором девять и минус четыре — минус четыре отбрасывается. В третьем оба t отрицательны — корней нет. Четвёртое неполное: t равно нулю или девяти, и нулевой корень терять нельзя.',
    'Correct. In the first t is one and nine — four roots. In the second nine and minus four — minus four is rejected. In the third both values are negative — no roots. The fourth is incomplete: t is zero or nine, and the zero root must not be lost.'),
  wrongs: [
    { when: (s) => s.pair.m3 !== 't3', text: L(
      "«Ildiz yo'q» degan javob t larning IKKALASI ham manfiy bo'lgan tenglamaga tegishli. Koeffitsiyentlarga qarang: ikkinchi va ozod had ikkalasi ham musbat bo'lsa, t kvadrat qo'shuv o'n t qo'shuv to'qqiz nolga teng bo'ladi, ildizlari minus bir va minus to'qqiz. Manfiy t dan haqiqiy x chiqmaydi.",
      'Ответ «корней нет» относится к уравнению, у которого ОБА t отрицательны. Посмотри на коэффициенты: если и второй, и свободный член положительны, выйдет t квадрат плюс десять t плюс девять равно нулю, корни минус один и минус девять. Из отрицательного t действительный x не выходит.',
      'The answer «no roots» belongs to the equation where BOTH values of t are negative. Look at the coefficients: if both the second and the free term are positive, you get t squared plus ten t plus nine equals zero, with roots minus one and minus nine. A negative t yields no real x.') },
    { when: (s) => s.pair.m4 !== 't4', text: L(
      "«Nol va plyus-minus uch» javobi CHALA tenglamaga tegishli: ozod hadi yo'q, ya'ni x kvadratni qavsdan chiqarish mumkin. Belgilashdan keyin t kvadrat minus to'qqiz t nolga teng bo'ladi, ildizlari nol va to'qqiz. Nol t bitta ildiz beradi — x nolga teng, va u boshqa hech qaysi tenglamada yo'q.",
      'Ответ «нуль и плюс-минус три» относится к НЕПОЛНОМУ уравнению: свободного члена нет, значит x квадрат выносится за скобку. После замены выйдет t квадрат минус девять t равно нулю, корни нуль и девять. Нулевое t даёт один корень — x равен нулю, и его нет ни в одном другом уравнении.',
      'The answer «zero and plus or minus three» belongs to the INCOMPLETE equation: it has no free term, so x squared can be factored out. After the substitution you get t squared minus nine t equals zero, with roots zero and nine. The zero value of t gives one root — x equals zero, which appears in no other equation.') },
    { when: (s) => s.pair.m1 === 't2' || s.pair.m2 === 't1', text: L(
        "Bu ikki tenglamada t ning soni bir xil, lekin ISHORASI boshqa: birinchisida ikkalasi musbat (to'rt ildiz), ikkinchisida minus to'rt rad etiladi (ikki ildiz).",
        'У этих уравнений число t одинаково, но ЗНАКИ разные: в первом оба положительны (четыре корня), во втором минус четыре отбрасывается (два корня).',
        'These equations have the same count of t values but different SIGNS: in the first both are positive (four roots), in the second minus four is rejected (two roots).') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har tenglamada bir xil ish qiling: belgilash kiriting, kvadrat tenglamaning ikki ildizini toping, manfiylarini rad eting va qolganlaridan x ni oling. Ildizlarni tenglamaga qo'yib tekshiring.",
      'В каждом уравнении делай одно и то же: введи замену, найди два корня квадратного уравнения, отбрось отрицательные и из оставшихся возьми x. Проверь корни подстановкой.',
      'Do the same in every equation: introduce the substitution, find the two roots of the quadratic, reject the negative ones and take x from the rest. Check the roots by substitution.') },
  ],
  wrongText: L(
    "Belgilashdan keyin t larni toping va manfiylarini rad eting. Har musbat t ikki ildiz beradi, nol t esa bitta. Ozod hadi yo'q tenglamada nol ildizni yo'qotmang.",
    'После замены найди t и отбрось отрицательные. Каждое положительное t даёт два корня, а нулевое одно. В уравнении без свободного члена не потеряй нулевой корень.',
    'After the substitution find the values of t and reject the negative ones. Each positive t gives two roots, a zero t gives one. In the equation without a free term do not lose the zero root.'),
};

export default function D22_09(props) { return <MatchPairs data={DATA} {...props} />; }
