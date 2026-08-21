// Dars16 · Amaliyot 07 — Javobni yig'ish · 🔴 · tag: build_product
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> BuildLine (answerSeq).
//
// 6m²n · 4m³n³ = 24m⁵n⁴.
//   son: 6 · 4 = 24     m: 2 + 3 = 5     n: 1 + 3 = 4
// Kartalar orasida 10 (6 + 4), m⁶ (2 · 3) va n³ (ko'chirilgan) turadi.
// answerSeq -- ya'ni tartib ham muhim: son, keyin m, keyin n.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'build_product', level: '🔴',
  eyebrow: L("Javobni yig'ish", 'Собрать ответ', 'Build the answer'),
  setup: L(
    "Javobni o'zingiz yig'asiz: avval son, keyin harflar. Ortiqcha kartalar bor -- hammasini ishlatish shart emas.",
    'Ответ собираешь сам: сначала число, потом буквы. Лишние карточки есть — использовать все не нужно.',
    'You build the answer yourself: the number first, then the letters. Some cards are extra — you need not use them all.'),
  expr: ['6m²n', '·', '4m³n³'], exprSize: 32,
  cards: [
    { id: 'c24', label: '24' },
    { id: 'm5', label: 'm⁵' },
    { id: 'n4', label: 'n⁴' },
    { id: 'c10', label: '10' },
    { id: 'm6', label: 'm⁶' },
    { id: 'n3', label: 'n³' },
  ],
  answerSeq: ['c24', 'm5', 'n4'],
  empty: L("Kartalarni bosib javobni tuzing", 'Нажимай карточки и собери ответ', 'Tap the cards to build the answer'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 6 · 4 = 24, m da 2 + 3 = 5, n da 1 + 3 = 4. Javob 24m⁵n⁴.",
    'Верно. 6 · 4 = 24, у m 2 + 3 = 5, у n 1 + 3 = 4. Ответ 24m⁵n⁴.',
    'Correct. 6 · 4 = 24, for m 2 + 3 = 5, for n 1 + 3 = 4. The answer is 24m⁵n⁴.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c10') !== -1, text: L(
      "10 bu 6 + 4. Koeffitsiyentlar ko'paytiriladi: 6 · 4 = 24.",
      '10 это 6 + 4. Коэффициенты перемножаются: 6 · 4 = 24.',
      '10 is 6 + 4. Coefficients are multiplied: 6 · 4 = 24.') },
    { when: (s) => s.seq.indexOf('m6') !== -1, text: L(
      "m⁶ chiqishi uchun ko'rsatkichlar ko'paytirilgan: 2 · 3. Ular qo'shiladi: 2 + 3 = 5.",
      'Чтобы вышло m⁶, показатели перемножили: 2 · 3. А они складываются: 2 + 3 = 5.',
      'To get m⁶ the exponents were multiplied: 2 · 3. They add: 2 + 3 = 5.') },
    { when: (s) => s.seq.indexOf('n3') !== -1, text: L(
      "n³ ikkinchi haddan ko'chirilgan. Birinchi hadda ham n bor, ko'rsatkichi bir: 1 + 3 = 4.",
      'n³ списано со второго одночлена. В первом тоже есть n, показатель у него один: 1 + 3 = 4.',
      'n³ was copied from the second monomial. The first has n too, with exponent one: 1 + 3 = 4.') },
    { when: (s) => s.seq.length < 3, text: L(
      "Javob uch bo'lakdan iborat: son, m va n. Bittasi qo'yilmadi.",
      'Ответ состоит из трёх частей: число, m и n. Одну не поставил.',
      'The answer has three parts: the number, m and n. One is missing.') },
  ],
  wrongText: L(
    "Uch bo'lakni tartib bilan qo'ying: son, keyin m, keyin n.",
    'Поставь три части по порядку: число, потом m, потом n.',
    'Put the three parts in order: the number, then m, then n.'),
};

export default function D16_07(props) { return <BuildLine data={DATA} {...props} />; }
