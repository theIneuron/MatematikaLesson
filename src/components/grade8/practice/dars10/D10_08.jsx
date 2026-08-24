// Dars10 · Amaliyot 08 — Moslashtirish · 🔴 · tag: record_to_domain
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
// Skelet: DARS07_11_AMALIYOT_SKELET.md §8 (10-dars, 8-pozitsiya)
//
// To'rt yozuv — to'rt XIL soha, va ular bir-biriga juda o'xshaydi:
//   √(p²)      har qanday p da (kvadrat nomanfiy);
//   √p         faqat p nomanfiy bo'lganda;
//   √(−p²)     FAQAT BITTA qiymatda: p nolga teng bo'lganda ildiz osti nol;
//   √(−p²−1)   hech qanday qiymatda (eng kattasi minus bir).
// Uchinchisi eng qimmat joy: «minus bor, demak yo'q» degan tez xulosa uni
// tashlab yuboradi, nolda esa yozuv ma'noga ega (З32).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const DATA = {
  tag: 'record_to_domain', level: '🔴',
  connect: true,
  targetSize: 18,
  items: [
    { id: 'm1', label: L('har qanday p da', 'при любом p', 'for every p') },
    { id: 'm2', label: L('faqat p ≥ 0 da', 'только при p ≥ 0', 'only for p ≥ 0') },
    { id: 'm3', label: L('faqat bitta qiymatda', 'только при одном значении', 'for exactly one value') },
    { id: 'm4', label: L('hech qanday qiymatda', 'ни при каком значении', 'for no value at all') },
  ],
  targets: [
    { id: 't1', tokens: [{ r: 'p²' }] },
    { id: 't2', tokens: [{ r: 'p' }] },
    { id: 't3', tokens: [{ r: '−p²' }] },
    { id: 't4', tokens: [{ r: '−p² − 1' }] },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Moslashtirish', 'Соответствие', 'Match'),
  setup: L(
    "To'rt yozuv bir-biriga o'xshaydi, lekin har biri boshqa joyda ma'noga ega. Chapda har biri haqida bitta ma'lumot turadi.",
    'Четыре записи похожи друг на друга, но каждая имеет смысл в своём месте. Слева про каждую сказано одно.',
    'The four records look alike, but each has a value in its own place. On the left, one fact is stated about each.'),
  ask: L(
    "Chapdan ma'lumotni bosing, keyin o'ngdan unga mos yozuvni bosing.",
    'Нажми сведение слева, потом подходящую запись справа.',
    'Tap a fact on the left, then tap the matching record on the right.'),
  correctText: L(
    "To'g'ri. Kvadrat hech qachon manfiy emas, shuning uchun birinchi yozuv har doim ishlaydi. Ikkinchisida ildiz ostida p ning o'zi turadi, ya'ni u nomanfiy bo'lishi kerak. Uchinchisida minus kvadratga tegishli: p nolda ildiz osti nolga teng va ildiz bor, boshqa hamma joyda esa manfiy — demak aynan bitta qiymat. To'rtinchisida yana bir minus bir qo'shildi, va u nolni ham yo'q qiladi: eng katta qiymat minus bir.",
    'Верно. Квадрат никогда не отрицателен, поэтому первая запись работает всегда. Во второй под корнем само p, значит оно обязано быть неотрицательным. В третьей минус относится к квадрату: при p равном нулю подкоренное равно нулю и корень есть, а во всех остальных местах отрицательно — то есть ровно одно значение. В четвёртой добавлено ещё минус один, и он убивает даже нуль: наибольшее значение минус один.',
    'Correct. A square is never negative, so the first record always works. In the second p itself stands under the root, so it must be non-negative. In the third the minus belongs to the square: at p equal to zero the radicand is zero and the root exists, everywhere else it is negative — exactly one value. In the fourth another minus one was added, and it kills even zero: the largest value is minus one.'),
  wrongs: [
    { when: (s) => s.pair.m3 === 't4' || s.pair.m4 === 't3', text: L(
      "Ikki yozuvning farqi bitta qo'shiluvchida. Nolni ikkalasiga qo'ying: minus nol kvadrat nolga teng — ildiz bor; minus nol kvadrat minus bir esa minus bir — ildiz yo'q. Bitta birlik butun sohani yo'q qiladi.",
      'Разница двух записей в одном слагаемом. Подставь нуль в обе: минус нуль в квадрате равно нулю — корень есть; а минус нуль в квадрате минус один равно минус одному — корня нет. Одна единица убивает всю область.',
      'The two records differ by one term. Substitute zero into both: minus zero squared is zero — the root exists; minus zero squared minus one is minus one — no root. A single unit destroys the whole domain.') },
    { when: (s) => s.pair.m1 === 't2' || s.pair.m2 === 't1', text: L(
      "Kvadratning bor-yo'qligini ko'ring. Birinchi yozuvda ildiz ostida kvadrat turadi va u manfiy bo'lmaydi. Ikkinchisida esa p ning o'zi: p ni minus to'rtga qo'ysangiz ildiz osti minus to'rt bo'ladi va qiymat yo'qoladi.",
      'Смотри, есть ли квадрат. В первой записи под корнем квадрат, и он не бывает отрицательным. Во второй само p: подставь минус четыре — подкоренное станет минус четыре, и значение исчезнет.',
      'Look for the square. In the first record a square stands under the root and it is never negative. In the second p itself stands there: substitute minus four and the radicand becomes minus four, so the value disappears.') },
    { when: (s) => s.pair.m3 === 't1' || s.pair.m1 === 't3', text: L(
      "Minusning qayerda turganiga qarang. Kvadratning oldida minus bo'lsa, natija nomanfiy emas, MANFIY bo'ladi: p ni ikkiga qo'ying — minus to'rt chiqadi. Faqat nolda ildiz osti nolga teng.",
      'Смотри, где стоит минус. Если он перед квадратом, результат не неотрицателен, а ОТРИЦАТЕЛЕН: подставь p равное двум — выйдет минус четыре. Только при нуле подкоренное равно нулю.',
      'Look at where the minus stands. In front of the square the result is not non-negative but NEGATIVE: put p equal to two and minus four comes out. Only at zero is the radicand zero.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har yozuvda bitta ish qiling: p ga uch qiymat qo'ying — minus ikki, nol va ikki. Ildiz osti qaysi qiymatlarda nomanfiy chiqdi, soha ham shu.",
      'С каждой записью делай одно: подставь p равное минус двум, нулю и двум. При каких значениях подкоренное неотрицательно — там и область.',
      'Do one thing with every record: put p equal to minus two, zero and two. Wherever the radicand comes out non-negative, that is the domain.') },
  ],
  wrongText: L(
    "Har yozuvga uch qiymat qo'yib ko'ring: minus ikki, nol va ikki. Ildiz osti nomanfiy bo'lgan joylarni sanang.",
    'Подставь в каждую запись три значения: минус два, нуль и два. Посчитай, где подкоренное неотрицательно.',
    'Substitute three values into each record: minus two, zero and two. Count where the radicand is non-negative.'),
};

export default function D10_08(props) { return <MatchPairs data={DATA} {...props} />; }
