// Dars20 · Amaliyot 09 — Juftlash · 🔴 · tag: equation_to_answer
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §8 (20-dars, 9-pozitsiya)
//
// TO'RT TENGLAMADA SURAT IKKI MARTA TAKRORLANADI: `x² − 1` ikki marta,
// `x² − 4` ikki marta. Ya'ni ildizlar ham bir xil — plyus-minus bir va
// plyus-minus ikki. Javobni MAXRAJ hal qiladi: qaysi ildiz taqiqqa tushib
// begona bo'lib chiqadi (З3, T3).
//   (x² − 1)/(x − 1): ildizlar 1 va −1, taqiq 1 → javob −1;
//   (x² − 1)/(x + 1): taqiq −1 → javob 1;
//   (x² − 4)/(x − 2): taqiq 2 → javob −2;
//   (x² − 4)/(x + 2): taqiq −2 → javob 2.
// Bu to'rtlik darsning butun mazmunini bitta jadvalga sig'diradi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const DATA = {
  tag: 'equation_to_answer', level: '🔴',
  connect: true,
  targetSize: 15,
  items: [
    { id: 'm1', label: L('x = −1', 'x = −1', 'x = −1') },
    { id: 'm2', label: L('x = 1', 'x = 1', 'x = 1') },
    { id: 'm3', label: L('x = −2', 'x = −2', 'x = −2') },
    { id: 'm4', label: L('x = 2', 'x = 2', 'x = 2') },
  ],
  targets: [
    { id: 't1', tokens: [{ n: 'x² − 1', d: 'x − 1' }, '= 0'] },
    { id: 't2', tokens: [{ n: 'x² − 1', d: 'x + 1' }, '= 0'] },
    { id: 't3', tokens: [{ n: 'x² − 4', d: 'x − 2' }, '= 0'] },
    { id: 't4', tokens: [{ n: 'x² − 4', d: 'x + 2' }, '= 0'] },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Juftlash', 'Пары', 'Pairs'),
  setup: L(
    "To'rt tenglamada surat ikki marta takrorlanadi, ya'ni ildizlar ham bir xil. Javobni maxraj hal qiladi: qaysi ildiz taqiqqa tushadi.",
    'В четырёх уравнениях числитель повторяется дважды, то есть корни одни и те же. Ответ решает знаменатель: какой корень попадёт под запрет.',
    'The numerator repeats twice among the four equations, so the roots are the same. The denominator decides the answer: which root falls under the ban.'),
  ask: L(
    "Chapdan javobni bosing, keyin o'ngdan uning tenglamasini bosing.",
    'Нажми ответ слева, потом его уравнение справа.',
    'Tap an answer on the left, then its equation on the right.'),
  correctText: L(
    "To'g'ri. Har tenglamada surat nolga aylanadigan ikki qiymat bor, lekin maxraj bittasini rad etadi. Birinchisida taqiq birda, demak javob minus bir; ikkinchisida taqiq minus birda, javob bir. Uchinchisida taqiq ikkida, javob minus ikki; to'rtinchisida taqiq minus ikkida, javob ikki. Maxrajdagi bitta ishora javobni butunlay almashtiradi.",
    'Верно. В каждом уравнении числитель обращается в нуль при двух значениях, но знаменатель одно из них отбрасывает. В первом запрет в единице, значит ответ минус один; во втором запрет в минус единице, ответ один. В третьем запрет в двух, ответ минус два; в четвёртом запрет в минус двух, ответ два. Один знак в знаменателе полностью меняет ответ.',
    'Correct. In each equation the numerator vanishes at two values, but the denominator rejects one of them. In the first the ban is at one, so the answer is minus one; in the second the ban is at minus one, so the answer is one. In the third the ban is at two, the answer minus two; in the fourth the ban is at minus two, the answer two. A single sign in the denominator flips the answer entirely.'),
  wrongs: [
    { when: (s) => s.pair.m1 === 't2' || s.pair.m2 === 't1', text: L(
      "Bu ikki tenglamada surat bir xil, farqi faqat maxrajdagi ishorada. Birinchisida maxraj x minus bir, ya'ni taqiq BIRDA — demak bir begona ildiz, javob minus bir. Ikkinchisida maxraj x qo'shuv bir, taqiq minus birda, javob bir.",
      'У этих двух уравнений числитель одинаков, различается только знак в знаменателе. В первом знаменатель x минус один, то есть запрет в ЕДИНИЦЕ — значит единица посторонний корень, ответ минус один. Во втором знаменатель x плюс один, запрет в минус единице, ответ один.',
      'These two equations share a numerator and differ only in the sign of the denominator. In the first the denominator is x minus one, so the ban is at ONE — one is the extraneous root and the answer is minus one. In the second the denominator is x plus one, the ban is at minus one, and the answer is one.') },
    { when: (s) => s.pair.m3 === 't4' || s.pair.m4 === 't3', text: L(
      "Bu ikki tenglamada ham surat bir xil: x kvadrat minus to'rt, ildizlari ikki va minus ikki. Maxrajga qarang: x minus ikki bo'lsa taqiq ikkida — javob minus ikki. x qo'shuv ikki bo'lsa taqiq minus ikkida — javob ikki.",
      'У этих двух уравнений числитель тоже одинаков: x квадрат минус четыре, корни два и минус два. Смотри на знаменатель: x минус два — запрет в двух, ответ минус два. x плюс два — запрет в минус двух, ответ два.',
      'These two equations also share a numerator: x squared minus four, with roots two and minus two. Look at the denominator: x minus two bans two, so the answer is minus two. x plus two bans minus two, so the answer is two.') },
    { when: (s) => s.pair.m1 === 't3' || s.pair.m1 === 't4' || s.pair.m2 === 't3' || s.pair.m2 === 't4', text: L(
      "Avval SURATGA qarang: u ildizlarni beradi. x kvadrat minus bir nolga aylanadigan qiymatlar — bir va minus bir; x kvadrat minus to'rt uchun esa ikki va minus ikki. Demak birinchi ikki tenglama faqat birlik javoblarga, oxirgi ikkitasi esa ikkilik javoblarga tegishli.",
      'Сначала смотри на ЧИСЛИТЕЛЬ: он даёт корни. x квадрат минус один обращается в нуль при одном и минус одном; x квадрат минус четыре — при двух и минус двух. Значит первые два уравнения относятся только к ответам с единицей, а последние два — к ответам с двойкой.',
      'Look at the NUMERATOR first: it gives the roots. x squared minus one vanishes at one and minus one; x squared minus four at two and minus two. So the first two equations belong to the answers with a one, the last two to the answers with a two.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har tenglamada ikki qadam: surat nolga aylanadigan ikki qiymatni toping, keyin maxraj taqiqlagan bittasini rad eting. Qolgan bittasi javob.",
      'В каждом уравнении два шага: найди два значения, при которых числитель нуль, потом отбрось то, которое запрещено знаменателем. Оставшееся и есть ответ.',
      'Two steps per equation: find the two values where the numerator vanishes, then reject the one banned by the denominator. What remains is the answer.') },
  ],
  wrongText: L(
    "Surat ildizlarni beradi, maxraj esa bittasini rad etadi. Javobni asl tenglamaga qo'yib tekshiring: maxraj nolga aylanmasligi kerak.",
    'Числитель даёт корни, а знаменатель один из них отбрасывает. Проверь ответ подстановкой в исходное уравнение: знаменатель не должен обратиться в нуль.',
    'The numerator gives the roots, the denominator rejects one of them. Check your answer in the original equation: the denominator must not vanish.'),
};

export default function D20_09(props) { return <MatchPairs data={DATA} {...props} />; }
