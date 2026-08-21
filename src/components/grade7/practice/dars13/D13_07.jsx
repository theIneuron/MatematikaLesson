// Dars13 · Amaliyot 07 — To'g'ri tengliklar · 🔴 · tag: power_true_eq
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
//
// DARAJA KO'TARILDI (PODXOD_7SINF.md §13): qiymatlar uch, to'rt va besh
// xonali, asoslari esa yumaloq -- og'zaki hisoblab tekshirish mumkin.
//
// Tekshirilgan:
//   12² = 144     HA
//   20³ = 8000    HA  (yumaloq asos: 2 · 2 · 2 = 8 va uchta nol)
//   10⁴ = 10000   HA  (o'nning ko'rsatkichi nollar sonini beradi)
//   2⁷ = 14       yo'q (2 · 7 deb hisoblagan, aslida 128)
//   5³ = 15       yo'q (5 · 3 deb hisoblagan, aslida 125)
//   9¹ = 1        yo'q (birinchi daraja sonning O'ZI, ya'ni 9)
// 9¹ = 1 xatosi ATAYLAB: «bir» ko'rsatkichi ko'pincha «bir chiqadi» deb
// tushuniladi.
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'power_true_eq', level: '🔴', col: 172, itemSize: 22,
  eyebrow: L('Tengliklar', 'Равенства', 'Equalities'),
  setup: L(
    "Har tenglikni tekshiring: chap tomondagi darajani hisoblab, o'ng tomondagi son bilan solishtiring.",
    'Проверь каждое равенство: посчитай степень слева и сравни с числом справа.',
    'Check each equality: work out the power on the left and compare with the number on the right.'),
  ask: L("TO'G'RI hamma tenglikni belgilang.", 'Отметь все ВЕРНЫЕ равенства.', 'Mark every TRUE equality.'),
  note: L("Bir nechta bo'lishi mumkin.", 'Их может быть несколько.', 'There can be several.'),
  items: [
    { id: 'p1', tokens: ['12²', '=', '144'], hit: true },
    { id: 'n1', tokens: ['2⁷', '=', '14'], hit: false },
    { id: 'p2', tokens: ['20³', '=', '8000'], hit: true },
    { id: 'n2', tokens: ['5³', '=', '15'], hit: false },
    { id: 'p3', tokens: ['10⁴', '=', '10000'], hit: true },
    { id: 'n3', tokens: ['9¹', '=', '1'], hit: false },
  ],
  correctText: L(
    "To'g'ri. 12 · 12 = 144; 20 · 20 · 20 da 8 va uchta nol, ya'ni 8000; o'nning ko'rsatkichi esa nollar sonini beradi: 10⁴ = 10000.",
    'Верно. 12 · 12 = 144; в 20 · 20 · 20 выходит 8 и три нуля, то есть 8000; а показатель десятки даёт число нулей: 10⁴ = 10000.',
    'Correct. 12 · 12 = 144; 20 · 20 · 20 gives 8 and three zeros, that is 8000; and the exponent of ten gives the number of zeros: 10⁴ = 10000.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('n3') !== -1, text: L(
      "9¹ bu sonning O'ZI, ya'ni 9. Birinchi daraja sonni o'zgartirmaydi -- u bir marta ko'paytuvchi bo'ldi.",
      '9¹ это САМО число, то есть 9. Первая степень число не меняет — оно взято множителем один раз.',
      '9¹ is the number ITSELF, that is 9. The first power leaves the number as it is — it is a factor once.') },
    { when: (s) => s.extra.indexOf('n1') !== -1 || s.extra.indexOf('n2') !== -1, text: L(
      "Belgilanganlar orasida asos va ko'rsatkich KO'PAYTIRILGAN yozuv bor: 2⁷ = 128, 5³ = 125, 14 va 15 emas.",
      'Среди отмеченных есть запись, где основание и показатель ПЕРЕМНОЖИЛИ: 2⁷ = 128, 5³ = 125, а не 14 и 15.',
      'Among the marked ones the base and exponent were MULTIPLIED: 2⁷ = 128, 5³ = 125, not 14 and 15.') },
    { when: (s) => s.miss.indexOf('p2') !== -1 || s.miss.indexOf('p3') !== -1, text: L(
      "Yumaloq asoslarni tekshirmadingiz: 20³ da sakkiz va uchta nol, 10⁴ da esa to'rtta nol.",
      'Ты не проверил круглые основания: в 20³ выходит восемь и три нуля, а в 10⁴ — четыре нуля.',
      'You did not check the round bases: 20³ gives eight and three zeros, and 10⁴ gives four zeros.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Bittasi belgilanmadi: har darajani ko'paytirish orqali yozib hisoblang.",
      'Одно пропустил: распиши каждую степень через умножение и посчитай.',
      'One is missing: write each power out as a multiplication and work it out.') },
  ],
  wrongText: L(
    "Har darajani ko'paytirish ko'rinishida yozib chiqing, keyin solishtiring.",
    'Распиши каждую степень как умножение, потом сравни.',
    'Write each power out as a multiplication, then compare.'),
};

export default function D13_07(props) { return <MarkAll data={DATA} {...props} />; }
