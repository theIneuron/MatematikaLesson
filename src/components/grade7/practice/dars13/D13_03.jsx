// Dars13 · Amaliyot 03 — 2⁶ ga teng yozuvlar · 🟡 · tag: same_as_64
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
//
// 2⁶ = 64. Tekshirilgan:
//   2·2·2·2·2·2 = 64   HA (darajaning ta'rifi)
//   4³ = 64            HA (4 = 2², ya'ni 4³ = 2⁶)
//   8² = 64            HA (8 = 2³)
//   6² = 36            yo'q (asos va ko'rsatkich almashgan)
//   2 · 6 = 12         yo'q
//   2⁴ · 2 = 32        yo'q (bir ko'paytuvchi kam)
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'same_as_64', level: '🟡', col: 155, itemSize: 24,
  eyebrow: L('Bir xil qiymat', 'То же значение', 'The same value'),
  setup: L(
    "Bitta sonni har xil daraja ko'rinishida yozish mumkin. Har yozuvni hisoblab, 2⁶ bilan solishtiring.",
    'Одно число можно записать разными степенями. Посчитай каждую запись и сравни с 2⁶.',
    'The same number can be written as different powers. Work each record out and compare with 2⁶.'),
  ask: L('2⁶ ga TENG hamma yozuvni belgilang.', 'Отметь все записи, равные 2⁶.', 'Mark every record equal to 2⁶.'),
  note: L("Bir nechta bo'lishi mumkin.", 'Их может быть несколько.', 'There can be several.'),
  items: [
    { id: 'p1', tokens: ['2', '·', '2', '·', '2', '·', '2', '·', '2', '·', '2'], hit: true },
    { id: 'n1', tokens: ['6²'], hit: false },
    { id: 'p2', tokens: ['4³'], hit: true },
    { id: 'n2', tokens: ['2', '·', '6'], hit: false },
    { id: 'p3', tokens: ['8²'], hit: true },
    { id: 'n3', tokens: ['2⁴', '·', '2'], hit: false },
  ],
  correctText: L(
    "To'g'ri. 2⁶ = 64. Oltita ikkilik ham, 4³ ham (4 = 2·2), 8² ham (8 = 2·2·2) 64 beradi.",
    'Верно. 2⁶ = 64. И шесть двоек, и 4³ (4 = 2·2), и 8² (8 = 2·2·2) дают 64.',
    'Correct. 2⁶ = 64. Six twos, 4³ (4 = 2·2) and 8² (8 = 2·2·2) all give 64.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('n1') !== -1, text: L(
      "6² = 36: asos va ko'rsatkich almashgan. 2⁶ da ko'paytuvchi 2, oltita.",
      '6² = 36: основание и показатель перепутаны. В 2⁶ множитель это 2, и его шесть.',
      '6² = 36: the base and the exponent got swapped. In 2⁶ the factor is 2, six times.') },
    { when: (s) => s.extra.indexOf('n3') !== -1, text: L(
      "2⁴ · 2 da beshta ikkilik bor: 16 · 2 = 32. Bizga esa oltitasi kerak.",
      'В 2⁴ · 2 всего пять двоек: 16 · 2 = 32. А нужно шесть.',
      '2⁴ · 2 has five twos: 16 · 2 = 32. We need six.') },
    { when: (s) => s.extra.indexOf('n2') !== -1, text: L(
      "2 · 6 = 12 -- bu daraja emas, oddiy ko'paytirish.",
      '2 · 6 = 12 — это не степень, а обычное умножение.',
      '2 · 6 = 12 — that is not a power but an ordinary multiplication.') },
    { when: (s) => s.miss.indexOf('p3') !== -1, text: L(
      "8² ni tekshirmadingiz: 8 · 8 = 64, ya'ni u ham mos.",
      'Ты не проверил 8²: 8 · 8 = 64, значит подходит и оно.',
      'You did not check 8²: 8 · 8 = 64, so it fits too.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Bittasi belgilanmadi: har yozuvni hisoblab 64 bilan solishtiring.",
      'Одну пропустил: посчитай каждую запись и сравни с 64.',
      'One is missing: work each record out and compare with 64.') },
  ],
  wrongText: L(
    "2⁶ ni hisoblang: 64. Keyin har yozuvning qiymatini topib solishtiring.",
    'Посчитай 2⁶: это 64. Потом найди значение каждой записи и сравни.',
    'Work out 2⁶: it is 64. Then find the value of each record and compare.'),
};

export default function D13_03(props) { return <MarkAll data={DATA} {...props} />; }
