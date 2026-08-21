// Dars15 · Amaliyot 08 — 6x³ ga teng yozuvlar · 🔴 · tag: same_as_6x3
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
//
// Tekshirilgan:
//   2x · 3x²    -> 2 · 3 = 6, x¹⁺² = x³    HA
//   6 · x³      -> o'sha yozuv               HA
//   3x³ + 3x³   -> o'xshash hadlar, 6x³     HA
//   2x³ · 3x³   -> 6x⁶                      yo'q
//   3x · 2x     -> 6x²                      yo'q
//   6x³ · x     -> 6x⁴                      yo'q
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'same_as_6x3', level: '🔴', col: 150, itemSize: 22,
  eyebrow: L('Bir xil bir had', 'Тот же одночлен', 'The same monomial'),
  setup: L(
    "6x³ ni har xil ko'rinishda yozish mumkin. Har yozuvni standart ko'rinishga keltirib solishtiring.",
    'Одночлен 6x³ можно записать по-разному. Приведи каждую запись к стандартному виду и сравни.',
    'The monomial 6x³ can be written in different ways. Bring each record to the standard form and compare.'),
  ask: L('6x³ ga TENG hamma yozuvni belgilang.', 'Отметь все записи, равные 6x³.', 'Mark every record equal to 6x³.'),
  note: L("Bir nechta bo'lishi mumkin.", 'Их может быть несколько.', 'There can be several.'),
  items: [
    { id: 'p1', tokens: ['2x', '·', '3x²'], hit: true },
    { id: 'n1', tokens: ['2x³', '·', '3x³'], hit: false },
    { id: 'p2', tokens: ['6', '·', 'x³'], hit: true },
    { id: 'n2', tokens: ['3x', '·', '2x'], hit: false },
    { id: 'p3', tokens: ['3x³', '+', '3x³'], hit: true },
    { id: 'n3', tokens: ['6x³', '·', 'x'], hit: false },
  ],
  correctText: L(
    "To'g'ri. 2x · 3x² = 6x³; 6 · x³ o'sha yozuv; 3x³ + 3x³ esa o'xshash hadlar, koeffitsiyentlari qo'shiladi va 6x³ chiqadi.",
    'Верно. 2x · 3x² = 6x³; 6 · x³ это та же запись; а 3x³ + 3x³ подобные, коэффициенты складываются и выходит 6x³.',
    'Correct. 2x · 3x² = 6x³; 6 · x³ is the same record; and 3x³ + 3x³ are like terms whose coefficients add to 6x³.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('n1') !== -1, text: L(
      "2x³ · 3x³ da ko'rsatkichlar qo'shiladi: 3 + 3 = 6, ya'ni 6x⁶.",
      'В 2x³ · 3x³ показатели складываются: 3 + 3 = 6, то есть 6x⁶.',
      'In 2x³ · 3x³ the exponents add: 3 + 3 = 6, that is 6x⁶.') },
    { when: (s) => s.extra.indexOf('n2') !== -1, text: L(
      "3x · 2x da har harfning ko'rsatkichi 1: 1 + 1 = 2, ya'ni 6x².",
      'В 3x · 2x у каждой буквы показатель 1: 1 + 1 = 2, то есть 6x².',
      'In 3x · 2x each letter has exponent 1: 1 + 1 = 2, that is 6x².') },
    { when: (s) => s.extra.indexOf('n3') !== -1, text: L(
      "6x³ · x da yana bitta x qo'shildi: 3 + 1 = 4, ya'ni 6x⁴.",
      'В 6x³ · x добавился ещё один x: 3 + 1 = 4, то есть 6x⁴.',
      'In 6x³ · x one more x joined: 3 + 1 = 4, that is 6x⁴.') },
    { when: (s) => s.miss.indexOf('p3') !== -1, text: L(
      "3x³ + 3x³ ni tekshirmadingiz: bu o'xshash hadlar, koeffitsiyentlari qo'shiladi va 6x³ chiqadi.",
      'Ты не проверил 3x³ + 3x³: это подобные, коэффициенты складываются и выходит 6x³.',
      'You did not check 3x³ + 3x³: they are like terms whose coefficients add to 6x³.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Bittasi belgilanmadi: har yozuvni standart ko'rinishga keltirib 6x³ bilan solishtiring.",
      'Одну пропустил: приведи каждую запись к стандартному виду и сравни с 6x³.',
      'One is missing: bring each record to the standard form and compare with 6x³.') },
  ],
  wrongText: L(
    "Har yozuvda koeffitsiyentni va x ning ko'rsatkichini hisoblang, keyin 6 va 3 bilan solishtiring.",
    'В каждой записи посчитай коэффициент и показатель x, потом сравни с 6 и 3.',
    'In each record work out the coefficient and the exponent of x, then compare with 6 and 3.'),
};

export default function D15_08(props) { return <MarkAll data={DATA} {...props} />; }
