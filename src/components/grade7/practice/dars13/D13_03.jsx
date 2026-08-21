// Dars13 · Amaliyot 03 — 2¹⁰ ga teng yozuvlar · 🟡 · tag: same_as_1024
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
//
// DARAJA KO'TARILDI (PODXOD_7SINF.md §13): qiymat to'rt xonali, variantlar
// esa bir-biriga yaqin.
//
// 2¹⁰ = 1024. Tekshirilgan:
//   4⁵       = 1024   HA  (4 = 2², ya'ni 4⁵ = 2¹⁰)
//   32²      = 1024   HA  (32 = 2⁵)
//   2⁵ · 2⁵  = 1024   HA  (beshta va yana beshta ikkilik)
//   2⁹       = 512    yo'q (bir ko'paytuvchi kam)
//   10²      = 100    yo'q (asos va ko'rsatkich almashgan)
//   2 · 10   = 20     yo'q
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'same_as_1024', level: '🟡', col: 155, itemSize: 23,
  eyebrow: L('Bir xil qiymat', 'То же значение', 'The same value'),
  setup: L(
    "Bitta sonni har xil daraja ko'rinishida yozish mumkin. Har yozuvni hisoblab, 2¹⁰ = 1024 bilan solishtiring.",
    'Одно число можно записать разными степенями. Посчитай каждую запись и сравни с 2¹⁰ = 1024.',
    'The same number can be written as different powers. Work each record out and compare with 2¹⁰ = 1024.'),
  ask: L('2¹⁰ ga TENG hamma yozuvni belgilang.', 'Отметь все записи, равные 2¹⁰.', 'Mark every record equal to 2¹⁰.'),
  note: L("Bir nechta bo'lishi mumkin.", 'Их может быть несколько.', 'There can be several.'),
  items: [
    { id: 'p1', tokens: ['4⁵'], hit: true },
    { id: 'n1', tokens: ['2⁹'], hit: false },
    { id: 'p2', tokens: ['32²'], hit: true },
    { id: 'n2', tokens: ['10²'], hit: false },
    { id: 'p3', tokens: ['2⁵', '·', '2⁵'], hit: true },
    { id: 'n3', tokens: ['2', '·', '10'], hit: false },
  ],
  correctText: L(
    "To'g'ri. 4⁵ da har to'rtlik ikki ikkilik (4 = 2 · 2), 32² da har o'ttiz ikki beshta ikkilik, 2⁵ · 2⁵ da esa besh qo'shuv besh. Uchtasi ham 1024.",
    'Верно. В 4⁵ каждая четвёрка это две двойки (4 = 2 · 2), в 32² каждое 32 это пять двоек, а в 2⁵ · 2⁵ пять плюс пять. Все три дают 1024.',
    'Correct. In 4⁵ each four is two twos (4 = 2 · 2), in 32² each 32 is five twos, and in 2⁵ · 2⁵ it is five plus five. All three give 1024.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('n1') !== -1, text: L(
      "2⁹ = 512: bitta ko'paytuvchi kam. 1024 ni olish uchun yana bir ikkilik kerak.",
      '2⁹ = 512: одного множителя не хватает. Чтобы вышло 1024, нужна ещё одна двойка.',
      '2⁹ = 512: one factor short. Another two is needed to reach 1024.') },
    { when: (s) => s.extra.indexOf('n2') !== -1, text: L(
      "10² = 100: asos va ko'rsatkich almashgan. 2¹⁰ da ko'paytuvchi 2, va u o'nta.",
      '10² = 100: основание и показатель перепутаны. В 2¹⁰ множитель это 2, и его десять.',
      '10² = 100: the base and the exponent got swapped. In 2¹⁰ the factor is 2, ten times.') },
    { when: (s) => s.extra.indexOf('n3') !== -1, text: L(
      "2 · 10 = 20 -- bu daraja emas, oddiy ko'paytirish.",
      '2 · 10 = 20 — это не степень, а обычное умножение.',
      '2 · 10 = 20 — that is not a power but an ordinary multiplication.') },
    { when: (s) => s.miss.indexOf('p2') !== -1, text: L(
      "32² ni tekshirmadingiz: 32 · 32 = 1024, ya'ni u ham mos.",
      'Ты не проверил 32²: 32 · 32 = 1024, значит подходит и оно.',
      'You did not check 32²: 32 · 32 = 1024, so it fits too.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Bittasi belgilanmadi: har asosni ikkilik ko'paytuvchilarga ajratib sanang.",
      'Одну пропустил: разложи каждое основание на двойки и посчитай.',
      'One is missing: split each base into twos and count.') },
  ],
  wrongText: L(
    "Har yozuvni ikkilik ko'paytuvchilarga ajratib ko'ring: 4 = 2², 32 = 2⁵. Nechta ikkilik chiqdi?",
    'Разложи каждую запись на двойки: 4 = 2², 32 = 2⁵. Сколько двоек получилось?',
    'Split each record into twos: 4 = 2², 32 = 2⁵. How many twos came out?'),
};

export default function D13_03(props) { return <MarkAll data={DATA} {...props} />; }
