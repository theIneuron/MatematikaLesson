// Dars14 · Amaliyot 08 — a⁶ ga teng yozuvlar · 🔴 · tag: same_as_a6
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
//
// Tekshirilgan:
//   a² · a⁴   -> 2 + 4 = 6    HA
//   (a²)³     -> 2 · 3 = 6    HA
//   a⁸ : a²   -> 8 − 2 = 6    HA
//   a³ · a³ · a³ -> 9         yo'q
//   a² · a³   -> 5            yo'q
//   (a³)³     -> 9            yo'q
// Uch xossa uchtasi ham bir xil natijaga olib kelishi mumkin -- shuni
// ko'rish darsning maqsadi.
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'same_as_a6', level: '🔴', col: 150, itemSize: 23,
  eyebrow: L('Bir xil natija', 'Тот же результат', 'The same result'),
  setup: L(
    "Turli amallar bir xil natijaga olib kelishi mumkin. Har yozuvning ko'rsatkichini hisoblab, 6 bilan solishtiring.",
    'Разные действия могут привести к одному результату. Посчитай показатель каждой записи и сравни с 6.',
    'Different operations can lead to the same result. Work out each exponent and compare it with 6.'),
  ask: L('a⁶ ga TENG hamma yozuvni belgilang.', 'Отметь все записи, равные a⁶.', 'Mark every record equal to a⁶.'),
  note: L("Bir nechta bo'lishi mumkin.", 'Их может быть несколько.', 'There can be several.'),
  items: [
    { id: 'p1', tokens: ['a²', '·', 'a⁴'], hit: true },
    { id: 'n1', tokens: ['a²', '·', 'a³'], hit: false },
    { id: 'p2', tokens: ['(a²)³'], hit: true },
    { id: 'n2', tokens: ['(a³)³'], hit: false },
    { id: 'p3', tokens: ['a⁸', ':', 'a²'], hit: true },
    { id: 'n3', tokens: ['a³', '·', 'a³', '·', 'a³'], hit: false },
  ],
  correctText: L(
    "To'g'ri. 2 + 4 = 6; 2 · 3 = 6; 8 − 2 = 6. Uch xil amal, bir xil natija.",
    'Верно. 2 + 4 = 6; 2 · 3 = 6; 8 − 2 = 6. Три разных действия, один результат.',
    'Correct. 2 + 4 = 6; 2 · 3 = 6; 8 − 2 = 6. Three different operations, one result.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('n3') !== -1, text: L(
      "a³ · a³ · a³ da uchta uchlik qo'shiladi: 3 + 3 + 3 = 9, ya'ni a⁹.",
      'В a³ · a³ · a³ складываются три тройки: 3 + 3 + 3 = 9, то есть a⁹.',
      'In a³ · a³ · a³ three threes add: 3 + 3 + 3 = 9, that is a⁹.') },
    { when: (s) => s.extra.indexOf('n2') !== -1, text: L(
      "(a³)³ da ko'rsatkichlar ko'paytiriladi: 3 · 3 = 9, ya'ni a⁹.",
      'В (a³)³ показатели перемножаются: 3 · 3 = 9, то есть a⁹.',
      'In (a³)³ the exponents multiply: 3 · 3 = 9, that is a⁹.') },
    { when: (s) => s.extra.indexOf('n1') !== -1, text: L(
      "a² · a³ da 2 + 3 = 5 chiqadi, olti emas.",
      'В a² · a³ выходит 2 + 3 = 5, а не шесть.',
      'In a² · a³ you get 2 + 3 = 5, not six.') },
    { when: (s) => s.miss.indexOf('p3') !== -1, text: L(
      "a⁸ : a² ni tekshirmadingiz: bo'lishda ayiriladi, 8 − 2 = 6.",
      'Ты не проверил a⁸ : a²: при делении вычитается, 8 − 2 = 6.',
      'You did not check a⁸ : a²: division subtracts, 8 − 2 = 6.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Bittasi belgilanmadi: har yozuvda amalga qarab ko'rsatkichni hisoblang.",
      'Одну пропустил: в каждой записи считай показатель по действию.',
      'One is missing: in each record work out the exponent according to the operation.') },
  ],
  wrongText: L(
    "Har yozuvning ko'rsatkichini hisoblang: qo'shishmi, ayirishmi yoki ko'paytirishmi?",
    'Посчитай показатель каждой записи: складывать, вычитать или перемножать?',
    'Work out each exponent: add, subtract or multiply?'),
};

export default function D14_08(props) { return <MarkAll data={DATA} {...props} />; }
