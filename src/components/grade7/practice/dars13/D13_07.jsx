// Dars13 · Amaliyot 07 — To'g'ri tengliklar · 🔴 · tag: power_true_eq
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
//
// Tekshirilgan:
//   5² = 25   HA
//   1⁷ = 1    HA  (bir necha marta ko'paytirilsa ham bir qoladi)
//   0³ = 0    HA
//   2³ = 6    yo'q (2 · 3 deb hisoblagan)
//   3² = 6    yo'q (3 · 2 deb hisoblagan)
//   4¹ = 1    yo'q (birinchi daraja sonning O'ZI, ya'ni 4)
// 4¹ = 1 xatosi ATAYLAB: «bir» ko'rsatkichi ko'pincha «bir chiqadi» deb
// tushuniladi.
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'power_true_eq', level: '🔴', col: 130, itemSize: 24,
  eyebrow: L('Tengliklar', 'Равенства', 'Equalities'),
  setup: L(
    "Har tenglikni tekshiring: chap tomondagi darajani hisoblab, o'ng tomondagi son bilan solishtiring.",
    'Проверь каждое равенство: посчитай степень слева и сравни с числом справа.',
    'Check each equality: work out the power on the left and compare with the number on the right.'),
  ask: L("TO'G'RI hamma tenglikni belgilang.", 'Отметь все ВЕРНЫЕ равенства.', 'Mark every TRUE equality.'),
  note: L("Bir nechta bo'lishi mumkin.", 'Их может быть несколько.', 'There can be several.'),
  items: [
    { id: 'p1', tokens: ['5²', '=', '25'], hit: true },
    { id: 'n1', tokens: ['2³', '=', '6'], hit: false },
    { id: 'p2', tokens: ['1⁷', '=', '1'], hit: true },
    { id: 'n2', tokens: ['3²', '=', '6'], hit: false },
    { id: 'p3', tokens: ['0³', '=', '0'], hit: true },
    { id: 'n3', tokens: ['4¹', '=', '1'], hit: false },
  ],
  correctText: L(
    "To'g'ri. 5 · 5 = 25; bir necha marta ko'paytirilsa ham bir bir bo'lib qoladi; nolning har qanday darajasi nol.",
    'Верно. 5 · 5 = 25; единица, сколько бы раз её ни умножали, остаётся единицей; любая степень нуля равна нулю.',
    'Correct. 5 · 5 = 25; one stays one however many times it is multiplied; any power of zero is zero.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('n3') !== -1, text: L(
      "4¹ bu sonning O'ZI, ya'ni 4. Birinchi daraja sonni o'zgartirmaydi -- u bir marta ko'paytuvchi bo'ldi.",
      '4¹ это САМО число, то есть 4. Первая степень число не меняет — оно взято множителем один раз.',
      '4¹ is the number ITSELF, that is 4. The first power leaves the number as it is — it is a factor once.') },
    { when: (s) => s.extra.indexOf('n1') !== -1 || s.extra.indexOf('n2') !== -1, text: L(
      "Belgilanganlar orasida asos va ko'rsatkich KO'PAYTIRILGAN yozuv bor: 2³ = 8, 3² = 9, 6 emas.",
      'Среди отмеченных есть запись, где основание и показатель ПЕРЕМНОЖИЛИ: 2³ = 8, 3² = 9, а не 6.',
      'Among the marked ones the base and exponent were MULTIPLIED: 2³ = 8, 3² = 9, not 6.') },
    { when: (s) => s.miss.indexOf('p2') !== -1 || s.miss.indexOf('p3') !== -1, text: L(
      "Birning va nolning darajalarini tekshirmadingiz: 1 · 1 · ... = 1, 0 · 0 · 0 = 0.",
      'Ты не проверил степени единицы и нуля: 1 · 1 · ... = 1, 0 · 0 · 0 = 0.',
      'You did not check the powers of one and zero: 1 · 1 · ... = 1, 0 · 0 · 0 = 0.') },
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
