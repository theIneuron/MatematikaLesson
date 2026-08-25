// Dars14 · Amaliyot 10 — Juftlash · 🔴 · tag: fact_to_number
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
// Skelet: DARS12_14_AMALIYOT_SKELET.md §5 (14-dars, 10-pozitsiya)
//
// DARSNING HAMMA HOLATI TO'RT KATAKDA:
//   3/8   — yozuvi tugaydi (maxrajda faqat ikkilar);
//   5/6   — yozuvi cheksiz, lekin takrorlanadi (maxrajda uch bor);
//   √6    — yozuvi na tugaydi, na takrorlanadi;
//   √196  — ildiz belgisi bor, lekin qiymati o'n to'rt, ya'ni BUTUN son.
// Birinchi ikkitasini ajratish 6-sinf belgisini talab qiladi, oxirgi ikkitasi
// esa З36 ni tekshiradi: ildizning o'zi hech narsani aytmaydi.
//
// Chapda SO'Z (`items[].label`), o'ngda YOZUV (`targets[].tokens`), tanlangan
// juftlik egri chiziq bilan birlashtiriladi (`connect: true`).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const DATA = {
  tag: 'fact_to_number', level: '🔴',
  connect: true,
  targetSize: 15,
  items: [
    { id: 'm1', label: L('onli yozuvi tugaydi', 'десятичная запись заканчивается', 'the decimal record ends') },
    { id: 'm2', label: L('cheksiz, lekin takrorlanadi', 'бесконечна, но повторяется', 'endless but repeating') },
    { id: 'm3', label: L('tugamaydi va takrorlanmaydi', 'не заканчивается и не повторяется', 'neither ends nor repeats') },
    { id: 'm4', label: L('butun son', 'целое число', 'a whole number') },
  ],
  targets: [
    { id: 't1', tokens: [{ n: '3', d: '8' }] },
    { id: 't2', tokens: [{ n: '5', d: '6' }] },
    { id: 't3', tokens: [{ r: '6' }] },
    { id: 't4', tokens: [{ r: '196' }] },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Juftlash', 'Пары', 'Pairs'),
  setup: L(
    "To'rt son va to'rt ma'lumot. Ikki kasrni maxraji ajratadi, ikki ildizni esa ildiz ostidagi son — belgining o'zi hech narsani aytmaydi.",
    'Четыре числа и четыре описания. Две дроби различает знаменатель, два корня — подкоренное число; сам знак ничего не говорит.',
    'Four numbers and four descriptions. The two fractions are told apart by the denominator, the two roots by the radicand; the sign itself says nothing.'),
  ask: L(
    "Chapdan ma'lumotni bosing, keyin o'ngdan uning sonini bosing.",
    'Нажми описание слева, потом его число справа.',
    'Tap a description on the left, then its number on the right.'),
  // RAZBOR QISQA: o'lchov 2026-08-24 (grade8-practice-panel.mjs) — telefonda RU
  // matni 65px panel ostida qolardi, ya'ni to'rt qatori ko'rinmasdi.
  correctText: L(
    "To'g'ri. Uch bo'lingan sakkizning maxrajida faqat ikkilar — yozuv tugaydi. Besh bo'lingan oltida uch bor — yozuv takrorlanadi. Olti to'liq kvadrat emas: ildizi na tugaydi, na takrorlanadi. Yuz to'qsan oltidan ildiz esa o'n to'rt — butun son.",
    'Верно. У трёх восьмых в знаменателе только двойки — запись заканчивается. У пяти шестых есть три — запись повторяется. Шесть не полный квадрат: корень ни заканчивается, ни повторяется. А корень из ста девяноста шести равен четырнадцати — целое число.',
    'Correct. Three eighths holds only twos in its denominator — the record ends. Five sixths holds a three — the record repeats. Six is not a perfect square: its root neither ends nor repeats. And the root of one hundred ninety six is fourteen — a whole number.'),
  wrongs: [
    { when: (s) => s.pair.m1 === 't2' || s.pair.m2 === 't1', text: L(
      "Ikki kasr o'rin almashdi. Maxrajlarni ko'paytuvchilarga ajratib ko'ring: sakkiz bu ikki karra ikki karra ikki — faqat ikkilar, demak yozuv tugaydi. Olti bu ikki karra uch — uch bor, demak yozuv takrorlanadi. Bo'lib tekshiring: uch bo'lingan sakkiz nol butun uch yetti besh, besh bo'lingan olti esa nol butun sakkiz uch uch uch.",
      'Две дроби поменялись местами. Разложи знаменатели: восемь это два на два на два — только двойки, значит запись заканчивается. Шесть это два на три — есть тройка, запись повторяется. Проверь делением: три восьмых это нуль целых триста семьдесят пять.',
      'The two fractions swapped places. Factor the denominators: eight is two times two times two — only twos, so the record ends. Six is two times three — a three is there, so the record repeats. Check by dividing: three eighths is zero point three seven five, five sixths is zero point eight three three three.') },
    { when: (s) => s.pair.m3 === 't4' || s.pair.m4 === 't3', text: L(
      "Ikki ildiz o'rin almashdi, va ildiz belgisi bu yerda yordam bermaydi. Ildiz OSTIDAGI sonni tekshiring: yuz to'qsan olti to'liq kvadrat, chunki o'n to'rt karra o'n to'rt yuz to'qsan olti; olti esa emas — u to'rt va to'qqiz orasida turadi, ya'ni ildizi ikki va uch orasida va butun emas.",
      'Два корня поменялись местами, и знак корня здесь не помощник. Проверь число ПОД корнем: сто девяносто шесть полный квадрат, ведь четырнадцать на четырнадцать сто девяносто шесть; а шесть нет — оно между четырьмя и девятью, значит корень между двумя и тремя и не целый.',
      'The two roots swapped places, and the root sign is no help here. Check the number UNDER the root: one hundred ninety six is a perfect square, since fourteen times fourteen is one hundred ninety six; six is not — it lies between four and nine, so its root is between two and three and not whole.') },
    { when: (s) => s.pair.m4 === 't1' || s.pair.m4 === 't2', text: L(
      "Butun son kasrlar orasidan izlandi. Uch bo'lingan sakkiz va besh bo'lingan olti birdan kichik, ya'ni ular butun bo'lolmaydi. Butun son ildiz ostida yashiringan: yuz to'qsan oltidan ildiz o'n to'rtga teng.",
      'Целое число искали среди дробей. Три восьмых и пять шестых меньше единицы, значит целыми быть не могут. Целое спряталось под корнем: корень из ста девяноста шести равен четырнадцати.',
      'The whole number was looked for among the fractions. Three eighths and five sixths are less than one, so they cannot be whole. The whole number is hidden under a root: the root of one hundred ninety six is fourteen.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har sonni ikki qadamda tekshiring. Kasrda: maxrajni ko'paytuvchilarga ajratib, uch yoki boshqa ko'paytuvchi bor-yo'qligini ko'ring. Ildizda: ildiz ostidagi son to'liq kvadratmi. Ildiz belgisining o'zi guruhni belgilamaydi.",
      'Проверяй каждое число в два шага. У дроби: разложи знаменатель и посмотри, есть ли там тройка или другой множитель. У корня: полный ли квадрат под корнем. Сам знак корня группу не определяет.',
      'Check every number in two steps. For a fraction: factor the denominator and see whether a three or another factor is there. For a root: is the radicand a perfect square. The root sign alone does not decide the group.') },
  ],
  wrongText: L(
    "Ikki savol yetadi: kasrning maxrajida faqat ikki va besh bormi, va ildiz ostidagi son to'liq kvadratmi. Shubha bo'lsa kasrni bo'lib, ildizni esa kvadratga oshirib tekshiring.",
    'Хватает двух вопросов: только ли двойки и пятёрки в знаменателе дроби, и полный ли квадрат под корнем. При сомнении дробь раздели, а корень проверь возведением в квадрат.',
    'Two questions are enough: does the fraction hold only twos and fives in its denominator, and is the radicand a perfect square. When in doubt divide the fraction and square the root.'),
};

export default function D14_10(props) { return <MatchPairs data={DATA} {...props} />; }
