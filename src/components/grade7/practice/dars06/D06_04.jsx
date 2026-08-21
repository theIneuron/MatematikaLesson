// Dars06 · Amaliyot 04 — 5y ga teng yozuvlar · 🟡 · tag: same_as_5y
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
//
// Tekshirilgan (y = 2 bilan, 5y = 10):
//   2y + 3y   -> 4 + 6 = 10    HA (koeffitsiyentlar qo'shildi)
//   y · 5     -> 2 · 5 = 10    HA (ko'paytiruvchilar o'rni almashdi)
//   8y − 3y   -> 16 − 6 = 10   HA (koeffitsiyentlar ayirildi)
//   5 + y     -> 5 + 2 = 7     yo'q (qo'shish, ko'paytirish emas)
//   y − 5     -> 2 − 5 = −3    yo'q
//   5y + y    -> 10 + 2 = 12   yo'q (bu 6y)
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'same_as_5y', level: '🟡', col: 165, itemSize: 22,
  eyebrow: L('Bir xil yozuv', 'То же выражение', 'The same expression'),
  setup: L(
    "5y ni har xil ko'rinishda yozish mumkin. Tekshirish uchun y o'rniga son qo'yib ko'ring.",
    'Выражение 5y можно записать по-разному. Для проверки подставь вместо y число.',
    'The expression 5y can be written in different ways. To check, put a number in place of y.'),
  ask: L('5y ga TENG hamma yozuvni belgilang.', 'Отметь все записи, равные 5y.', 'Mark every record equal to 5y.'),
  note: L("Bir nechta bo'lishi mumkin.", 'Их может быть несколько.', 'There can be several.'),
  items: [
    { id: 'p1', tokens: ['2y', '+', '3y'], hit: true },
    { id: 'p2', tokens: ['y', '·', '5'], hit: true },
    { id: 'p3', tokens: ['8y', '−', '3y'], hit: true },
    { id: 'n1', tokens: ['5', '+', 'y'], hit: false },
    { id: 'n2', tokens: ['y', '−', '5'], hit: false },
    { id: 'n3', tokens: ['5y', '+', 'y'], hit: false },
  ],
  correctText: L(
    "To'g'ri. Koeffitsiyentlarni qo'shish ham, ayirish ham, ko'paytiruvchilarning o'rnini almashtirish ham 5y beradi.",
    'Верно. И сложение коэффициентов, и вычитание, и перестановка множителей дают 5y.',
    'Correct. Adding coefficients, subtracting them, and swapping factors all give 5y.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('n3') !== -1, text: L(
      "5y + y bu 6y: oxirgi y ning koeffitsiyenti 1, u ham qo'shiladi.",
      '5y + y это 6y: у последнего y коэффициент 1, он тоже прибавляется.',
      '5y + y is 6y: the last y has coefficient 1, and it counts too.') },
    { when: (s) => s.extra.indexOf('n1') !== -1 || s.extra.indexOf('n2') !== -1, text: L(
      "5 va y orasida QO'SHISH yoki ayirish turgan yozuvlar 5y emas: 5y da ular ko'paytiriladi.",
      'Записи, где между 5 и y стоит СЛОЖЕНИЕ или вычитание, это не 5y: в 5y они умножаются.',
      'Records with an ADDITION or subtraction between 5 and y are not 5y: in 5y they are multiplied.') },
    { when: (s) => s.miss.indexOf('p3') !== -1, text: L(
      "8y − 3y ni tekshirmadingiz: 8 − 3 = 5, ya'ni 5y.",
      'Ты не проверил 8y − 3y: 8 − 3 = 5, то есть 5y.',
      'You did not check 8y − 3y: 8 − 3 = 5, so it is 5y.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Bittasi belgilanmadi: y o'rniga 2 qo'yib har yozuvni hisoblang, 5y esa 10 beradi.",
      'Одну пропустил: подставь вместо y двойку и посчитай каждую запись, а 5y даёт 10.',
      'One is missing: put 2 in place of y and work each record out; 5y gives 10.') },
  ],
  wrongText: L(
    "y o'rniga 2 qo'ying. 5y bu 10; qaysi yozuvlar 10 berdi?",
    'Подставь вместо y двойку. 5y это 10; какие записи дали 10?',
    'Put 2 in place of y. 5y is 10; which records gave 10?'),
};

export default function D06_04(props) { return <MarkAll data={DATA} {...props} />; }
