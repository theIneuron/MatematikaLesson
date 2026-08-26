// Dars45 · Amaliyot 08 — Pazl · 🔴 · tag: verdict_pairs
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §7 (45-dars, 8-pozitsiya)
//
// JAVOB HISOBNING O'ZI, ya'ni «ha yoki yo'q» deb qutulib bo'lmaydi: har
// uchlik uchun ikki sonni chiqarish kerak.
//   5, 11, 12  -> 146 ≠ 144   (chegaraga yaqin)
//   8, 15, 17  -> 289 = 289
//   4, 6, 7    -> 52 ≠ 49     (chegaraga juda yaqin)
// Ko'z bilan «shunga o'xshaydi» deb hukm qilish ishlamaydi: uchinchi
// uchlikda farq faqat uchta.
// Kartalarda yozuv bo'shliqsiz (telefonda karta 54px, skelet §14).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'verdict_pairs', level: '🔴',
  faceSize: 13, faceSizePhone: 11,
  cards: [
    { id: 'f1', side: 0, tokens: ['5, 11, 12'] },
    { id: 'f2', side: 0, tokens: ['8, 15, 17'] },
    { id: 'f3', side: 0, tokens: ['4, 6, 7'] },
    { id: 'v1', side: 1, v: '146 ≠ 144' },
    { id: 'v2', side: 1, v: '289 = 289' },
    { id: 'v3', side: 1, v: '52 ≠ 49' },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "Uchta uchlik va uchta hisob. Har hisobda ikki son turadi: qolgan ikki tomon kvadratlarining yig'indisi va eng katta tomonning kvadrati. Uchlikni o'z hisobiga qo'ying.",
    'Три тройки и три вычисления. В каждом вычислении два числа: сумма квадратов двух других сторон и квадрат наибольшей стороны. Поставь тройку к своему вычислению.',
    'Three triples and three computations. Each computation holds two numbers: the sum of the squares of the other two sides and the square of the largest side. Put each triple with its computation.'),
  ask: L(
    'Uchlikni bosing, keyin uyani bosing.',
    'Нажми тройку, потом ячейку.',
    'Tap a triple, then a slot.'),
  bank: L('Uchliklar', 'Тройки', 'Triples'),
  correctText: L(
    "To'g'ri. Har uchlikda eng katta tomon oxirida turadi, ya'ni tanlash oson, lekin hisob ikkita. Besh, o'n bir, o'n ikki: yigirma besh qo'shuv bir yuz yigirma bir bir yuz qirq olti, o'n ikki kvadrat esa bir yuz qirq to'rt — teng emas, farq ikkita. Sakkiz, o'n besh, o'n yetti: oltmish to'rt qo'shuv ikki yuz yigirma besh ikki yuz sakson to'qqiz, o'n yetti kvadrat ham shu — teng. To'rt, olti, yetti: o'n olti qo'shuv o'ttiz olti ellik ikki, yetti kvadrat esa qirq to'qqiz — teng emas, farq uchta. Ikki holatda farq juda kichik, lekin xulosa aynan shu farqqa tayanadi: tenglik yo bor, yo yo'q.",
    'Верно. В каждой тройке наибольшая сторона стоит последней, то есть выбрать её легко, но вычислений два. Пять, одиннадцать, двенадцать: двадцать пять плюс сто двадцать один — сто сорок шесть, а двенадцать в квадрате сто сорок четыре — не равно, разница два. Восемь, пятнадцать, семнадцать: шестьдесят четыре плюс двести двадцать пять — двести восемьдесят девять, и семнадцать в квадрате столько же — равно. Четыре, шесть, семь: шестнадцать плюс тридцать шесть — пятьдесят два, а семь в квадрате сорок девять — не равно, разница три. В двух случаях разница совсем мала, но вывод опирается именно на неё: равенство либо есть, либо нет.',
    'Correct. In every triple the largest side stands last, so choosing it is easy, but there are two computations. Five, eleven, twelve: twenty five plus one hundred twenty one is one hundred forty six while twelve squared is one hundred forty four — not equal, a gap of two. Eight, fifteen, seventeen: sixty four plus two hundred twenty five is two hundred eighty nine and seventeen squared is the same — equal. Four, six, seven: sixteen plus thirty six is fifty two while seven squared is forty nine — not equal, a gap of three. In two cases the gap is tiny, yet the conclusion rests precisely on it: the equality either holds or it does not.'),
  wrongs: [
    { when: (s) => s.mate.f2 && s.mate.f2 !== 'v2', text: L(
      "Ikkinchi uchlikda tenglik BAJARILADI, ya'ni uning hisobida ikki son teng bo'lishi kerak. Oltmish to'rt qo'shuv ikki yuz yigirma besh ikki yuz sakson to'qqiz, va o'n yetti kvadrat ham ikki yuz sakson to'qqiz. Sakkiz, o'n besh, o'n yetti — darslikda keltirilgan Pifagor uchligi.",
      'Во второй тройке равенство ВЫПОЛНЯЕТСЯ, значит в её вычислении два числа должны быть равны. Шестьдесят четыре плюс двести двадцать пять — двести восемьдесят девять, и семнадцать в квадрате тоже двести восемьдесят девять. Восемь, пятнадцать, семнадцать — пифагорова тройка из учебника.',
      'In the second triple the equality DOES hold, so its computation must show two equal numbers. Sixty four plus two hundred twenty five is two hundred eighty nine, and seventeen squared is two hundred eighty nine too. Eight, fifteen, seventeen — a Pythagorean triple from the textbook.') },
    { when: (s) => s.mate.f1 === 'v3' || s.mate.f3 === 'v1', text: L(
      "Bu ikki natija almashib ketdi. Ikkalasida ham tenglik yo'q, lekin SONLAR boshqa: besh, o'n bir, o'n ikki uchligida yigirma besh qo'shuv bir yuz yigirma bir bir yuz qirq olti; to'rt, olti, yetti uchligida o'n olti qo'shuv o'ttiz olti ellik ikki. Hisobning o'zi qaysi uchlik ekanini aytadi.",
      'Эти два результата поменялись местами. В обоих равенства нет, но ЧИСЛА разные: у тройки пять, одиннадцать, двенадцать — двадцать пять плюс сто двадцать один — сто сорок шесть; у тройки четыре, шесть, семь — шестнадцать плюс тридцать шесть — пятьдесят два. Само вычисление и говорит, какая это тройка.',
      'These two results swapped places. Neither has equality, but the NUMBERS differ: for five, eleven, twelve it is twenty five plus one hundred twenty one, one hundred forty six; for four, six, seven it is sixteen plus thirty six, fifty two. The computation itself says which triple it belongs to.') },
    { when: (s) => s.bad.length >= 2, text: L(
      "Har uchlikda ikki sonni chiqaring: kichik ikkitasining kvadratlari yig'indisi, va eng kattasining kvadrati. Ikki son hisobda qanday yozilganiga qarang — ular tartibda turadi: avval yig'indi, keyin kvadrat.",
      'В каждой тройке вычисли два числа: сумму квадратов двух меньших и квадрат наибольшего. Смотри, как эти два числа записаны в вычислении — они стоят по порядку: сначала сумма, потом квадрат.',
      'Compute two numbers for every triple: the sum of the squares of the two smaller ones and the square of the largest. Look at how those two numbers appear in the computation — they stand in order: the sum first, then the square.') },
  ],
  wrongText: L(
    "Har uchlik uchun ikki sonni chiqaring. Farq kichik bo'lsa ham, tenglik yo bor, yo yo'q.",
    'Для каждой тройки вычисли два числа. Даже при малой разнице равенство либо есть, либо нет.',
    'Compute two numbers for every triple. Even with a small gap, the equality either holds or it does not.'),
};

export default function D45_08(props) { return <PairSlots data={DATA} {...props} />; }
