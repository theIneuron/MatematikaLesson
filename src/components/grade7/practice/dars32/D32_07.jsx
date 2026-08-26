// Dars32 · Amaliyot 07 — Umumiy maxrajga keltirish · 🟡 · slots · tag: frac_to_common
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 7-o'rin `slots`.
// MAVZU TO'LDIRILDI (metodist qarori 2026-08-22): darsning mavzusi «qisqartirish VA
// umumiy maxraj», shuning uchun 4, 6, 7 va 10-topshiriqlar umumiy maxrajga bag'ishlandi.
// Maxraj `:` bilan yoziladi -- sinf amaliyotidagi yozuv.
// x : 3 + x : 6: umumiy maxraj 6, birinchi kasr 2x : 6 bo'ladi, yig'indi 3x : 6 = x : 2.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'frac_to_common',
  level: '🟡',
  eyebrow: L(
    'Keltirish',
    'Приведение',
    'Bringing to one denominator'),
  setup: L(
    "Maxrajlar boshqa: 3 ni 6 ga aylantirish uchun ikkiga ko'paytirish kerak, va SURAT ham shuncha marta ko'payadi. Keyin suratlar qo'shiladi.",
    'Знаменатели разные: чтобы 3 стало 6, умножаем на два, и ЧИСЛИТЕЛЬ увеличивается во столько же раз. Потом складываем числители.',
    'The denominators differ: turning 3 into 6 doubles it, and the NUMERATOR doubles too. Then the numerators add.'),
  given: [['x : 3', '+', 'x : 6']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  rows: [[{ t: [L('birinchi', 'первая', 'the first'), L('kasr', 'дробь', 'fraction'), '='] }, { slot: 0 }], [{ t: [L("yig'indi", 'сумма', 'the sum'), '='] }, { slot: 1 }]],
  cards: ['2x : 6', '3x : 6', 'x : 6', '2x : 9'],
  answer: ['2x : 6', '3x : 6'],
  ask: L(
    'Kartani bosing, keyin uyani bosing.',
    'Нажми карточку, затем клетку.',
    'Tap a card, then tap a cell.'),
  bank: L(
    'Kartalar',
    'Карточки',
    'Cards'),
  correctText: L(
    "To'g'ri. x : 3 = 2x : 6, keyin 2x + x = 3x, ya'ni 3x : 6. Bu qisqarib x : 2 bo'ladi.",
    'Верно. x : 3 = 2x : 6, затем 2x + x = 3x, то есть 3x : 6. Это сокращается до x : 2.',
    'Correct. x : 3 = 2x : 6, then 2x + x = 3x, i.e. 3x : 6, which reduces to x : 2.'),
  wrongs: [
    {
      when: (s) => s.slots[0] === 'x : 6',
      text: L(
        "Maxraj ikki barobar oshdi, ya'ni surat ham oshishi kerak: x : 3 = 2x : 6.",
        'Знаменатель вырос вдвое, значит и числитель должен вырасти: x : 3 = 2x : 6.',
        'The denominator doubled, so the numerator must too: x : 3 = 2x : 6.'),
    },
    {
      when: (s) => s.slots[0] === '2x : 9' || s.slots[1] === '2x : 9',
      text: L(
        "9 emas: 3 va 6 ning umumiy maxraji 6, chunki 6 ni 3 ga bo'lish mumkin.",
        'Не 9: общий знаменатель 3 и 6 это 6, ведь 6 делится на 3.',
        'Not 9: the common denominator of 3 and 6 is 6, since 6 divides by 3.'),
    },
    {
      when: (s) => s.slots.indexOf(null) !== -1,
      text: L(
        "Hamma uya to'ldirilishi kerak.",
        'Надо заполнить все клетки.',
        'Every cell must be filled.'),
    },
  ],
  wrongText: L(
    "3 ni nechchiga ko'paytirsak 6 chiqadi? Suratni ham shu songa ko'paytiring.",
    'На сколько умножить 3, чтобы вышло 6? Умножь на это же число числитель.',
    'What turns 3 into 6? Multiply the numerator by the same.'),
};

export default function D32_07(props) { return <SlotsBank data={DATA} {...props} />; }
