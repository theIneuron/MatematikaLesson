// Dars10 · Amaliyot 02 — Qaysi sonlar mos · 🟢 · tag: mod_which_numbers
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
//
// DARAJA KO'TARILDI (PODXOD_7SINF.md §13): uch xonali sonlar.
//
// |x| = 120 ni bajaradigan sonlar: 120 va −120. Qolganlari:
//   0    -> |0| = 0     yo'q
//   240  -> 240         yo'q
//   −240 -> 240         yo'q
//   60   -> 60          yo'q
// Ikkita to'g'ri javob bor -- «bitta son» degan odat aynan shu yerda buziladi.
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'mod_which_numbers', level: '🟢', col: 130, itemSize: 24,
  eyebrow: L('Qaysi sonlar', 'Какие числа', 'Which numbers'),
  setup: L(
    "Modul ishorani hisobga olmaydi, shuning uchun ba'zi tenglamalarda javob bittadan ko'p bo'ladi.",
    'Модуль не различает знак, поэтому в некоторых уравнениях ответов больше одного.',
    'The modulus ignores the sign, so some equations have more than one answer.'),
  given: [['|x|', '=', '120']],
  givenLabel: L('Tenglama:', 'Уравнение:', 'The equation:'),
  ask: L("Tenglamani bajaradigan HAMMA sonni belgilang.", 'Отметь ВСЕ числа, которые подходят.', 'Mark EVERY number that fits.'),
  note: L("Bittadan ko'p bo'lishi mumkin.", 'Их может быть больше одного.', 'There can be more than one.'),
  items: [
    { id: 'p1', tokens: ['120'], hit: true },
    { id: 'n1', tokens: ['0'], hit: false },
    { id: 'p2', tokens: ['−120'], hit: true },
    { id: 'n2', tokens: ['240'], hit: false },
    { id: 'n3', tokens: ['−240'], hit: false },
    { id: 'n4', tokens: ['60'], hit: false },
  ],
  correctText: L(
    "To'g'ri. |120| = 120 va |−120| = 120. Modul ikki sonni ham bir xil qiymatga aylantiradi.",
    'Верно. |120| = 120 и |−120| = 120. Модуль превращает оба числа в одно и то же.',
    'Correct. |120| = 120 and |−120| = 120. The modulus turns both numbers into the same value.'),
  wrongs: [
    { when: (s) => s.miss.indexOf('p2') !== -1, text: L(
      "Manfiy sonni tekshirmadingiz: |−120| ham 120 ga teng, ya'ni −120 ham ildiz.",
      'Ты не проверил отрицательное число: |−120| тоже равно 120, значит −120 тоже корень.',
      'You did not check the negative number: |−120| is also 120, so −120 is a root too.') },
    { when: (s) => s.extra.indexOf('n2') !== -1 || s.extra.indexOf('n3') !== -1, text: L(
      "240 noldan 240 uzoqlikda: |240| = 240, |−240| = 240. Bizga esa moduli 120 bo'lgan sonlar kerak.",
      '240 стоит на удалении 240 от нуля: |240| = 240, |−240| = 240. А нам нужны числа с модулем 120.',
      '240 is 240 away from zero: |240| = 240, |−240| = 240. We need numbers whose modulus is 120.') },
    { when: (s) => s.extra.indexOf('n1') !== -1, text: L(
      "|0| = 0, ya'ni nol o'zining joyida turadi va 120 bermaydi.",
      '|0| = 0, то есть нуль остаётся на месте и 120 не даёт.',
      '|0| = 0, so zero stays where it is and does not give 120.') },
  ],
  wrongText: L(
    "Har sonning modulini hisoblang: u 120 ga tengmi?",
    'Посчитай модуль каждого числа: он равен 120?',
    'Work out the modulus of each number: is it 120?'),
};

export default function D10_02(props) { return <MarkAll data={DATA} {...props} />; }
