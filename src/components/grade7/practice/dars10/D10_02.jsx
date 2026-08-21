// Dars10 · Amaliyot 02 — Qaysi sonlar mos · 🟢 · tag: mod_which_numbers
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
//
// |x| = 4 ni bajaradigan sonlar: 4 va −4. Qolganlari:
//   0  -> |0| = 0    yo'q
//   8  -> 8          yo'q
//   −8 -> 8          yo'q
//   2  -> 2          yo'q
// Ikkita to'g'ri javob bor -- «bitta son» degan odat aynan shu yerda buziladi.
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'mod_which_numbers', level: '🟢', col: 120, itemSize: 24,
  eyebrow: L('Qaysi sonlar', 'Какие числа', 'Which numbers'),
  setup: L(
    "Modul ishorani hisobga olmaydi, shuning uchun ba'zi tenglamalarda javob bittadan ko'p bo'ladi.",
    'Модуль не различает знак, поэтому в некоторых уравнениях ответов больше одного.',
    'The modulus ignores the sign, so some equations have more than one answer.'),
  given: [['|x|', '=', '4']],
  givenLabel: L('Tenglama:', 'Уравнение:', 'The equation:'),
  ask: L("Tenglamani bajaradigan HAMMA sonni belgilang.", 'Отметь ВСЕ числа, которые подходят.', 'Mark EVERY number that fits.'),
  note: L("Bittadan ko'p bo'lishi mumkin.", 'Их может быть больше одного.', 'There can be more than one.'),
  items: [
    { id: 'p1', tokens: ['4'], hit: true },
    { id: 'n1', tokens: ['0'], hit: false },
    { id: 'p2', tokens: ['−4'], hit: true },
    { id: 'n2', tokens: ['8'], hit: false },
    { id: 'n3', tokens: ['−8'], hit: false },
    { id: 'n4', tokens: ['2'], hit: false },
  ],
  correctText: L(
    "To'g'ri. |4| = 4 va |−4| = 4. Modul ikki sonni ham to'rtga aylantiradi.",
    'Верно. |4| = 4 и |−4| = 4. Модуль превращает в четвёрку оба числа.',
    'Correct. |4| = 4 and |−4| = 4. The modulus turns both numbers into four.'),
  wrongs: [
    { when: (s) => s.miss.indexOf('p2') !== -1, text: L(
      "Manfiy sonni tekshirmadingiz: |−4| ham 4 ga teng, ya'ni −4 ham ildiz.",
      'Ты не проверил отрицательное число: |−4| тоже равно 4, значит −4 тоже корень.',
      'You did not check the negative number: |−4| is also 4, so −4 is a root too.') },
    { when: (s) => s.extra.indexOf('n2') !== -1 || s.extra.indexOf('n3') !== -1, text: L(
      "Sakkiz noldan sakkiz qadam uzoqda: |8| = 8, |−8| = 8. Bizga esa moduli 4 bo'lgan sonlar kerak.",
      'Восемь стоит в восьми шагах от нуля: |8| = 8, |−8| = 8. А нам нужны числа с модулем 4.',
      'Eight is eight steps from zero: |8| = 8, |−8| = 8. We need numbers whose modulus is 4.') },
    { when: (s) => s.extra.indexOf('n1') !== -1, text: L(
      "|0| = 0, ya'ni nol o'zining joyida turadi va 4 bermaydi.",
      '|0| = 0, то есть нуль остаётся на месте и четвёрку не даёт.',
      '|0| = 0, so zero stays where it is and does not give four.') },
  ],
  wrongText: L(
    "Har sonning modulini hisoblang: u 4 ga tengmi?",
    'Посчитай модуль каждого числа: он равен 4?',
    'Work out the modulus of each number: is it 4?'),
};

export default function D10_02(props) { return <MarkAll data={DATA} {...props} />; }
