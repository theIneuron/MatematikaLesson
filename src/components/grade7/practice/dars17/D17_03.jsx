// Dars17 · Amaliyot 03 — Uch bo'lakni ko'tarish · 🟢 · build · tag: power_three_parts
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> BuildLine.
// Mexanika RASKLADKADAN: 17-dars, 3-o'rin `build`.
//
// (3a²b)⁴ = 81a⁸b⁴. Uch bo'lak: 3⁴ = 81, a: 2 · 4 = 8, b: 1 · 4 = 4.
// Ortiqcha kartalar: 12 (3 · 4), a⁶ (2 + 4), b (ko'rsatkichni tashlab ketgan).
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'power_three_parts', level: '🟢',
  eyebrow: L('Uch bo\'lak', 'Три части', 'Three parts'),
  setup: L(
    "Qavs ichida uch bo'lak bor: son, a va b. Daraja uchtasiga ham tegishli, b ning yozilmagan ko'rsatkichi bir deb olinadi.",
    'В скобке три части: число, a и b. Степень относится ко всем трём, а ненаписанный показатель b считается единицей.',
    'The bracket has three parts: the number, a and b. The power applies to all three, and the missing exponent of b counts as one.'),
  expr: ['(3a²b)⁴'], exprSize: 38,
  cards: [
    { id: 'c81', label: '81' },
    { id: 'a8', label: 'a⁸' },
    { id: 'b4', label: 'b⁴' },
    { id: 'c12', label: '12' },
    { id: 'a6', label: 'a⁶' },
    { id: 'b1', label: 'b' },
  ],
  answerSeq: ['c81', 'a8', 'b4'],
  empty: L("Kartalarni bosib javobni tuzing", 'Нажимай карточки и собери ответ', 'Tap the cards to build the answer'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 3⁴ = 81, a da 2 · 4 = 8, b da 1 · 4 = 4. Javob 81a⁸b⁴.",
    'Верно. 3⁴ = 81, у a 2 · 4 = 8, у b 1 · 4 = 4. Ответ 81a⁸b⁴.',
    'Correct. 3⁴ = 81, for a 2 · 4 = 8, for b 1 · 4 = 4. The answer is 81a⁸b⁴.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c12') !== -1, text: L(
      "12 bu 3 · 4. Son darajaga ko'tariladi: 3 · 3 · 3 · 3 = 81.",
      '12 это 3 · 4. Число возводится в степень: 3 · 3 · 3 · 3 = 81.',
      '12 is 3 · 4. The number is raised to the power: 3 · 3 · 3 · 3 = 81.') },
    { when: (s) => s.seq.indexOf('a6') !== -1, text: L(
      "a⁶ chiqishi uchun ko'rsatkichlar qo'shilgan: 2 + 4. Ular ko'paytiriladi: 2 · 4 = 8.",
      'Чтобы вышло a⁶, показатели сложили: 2 + 4. А они умножаются: 2 · 4 = 8.',
      'To get a⁶ the exponents were added: 2 + 4. They are multiplied: 2 · 4 = 8.') },
    { when: (s) => s.seq.indexOf('b1') !== -1, text: L(
      "b ham darajaga ko'tariladi. Uning ko'rsatkichi bir, ya'ni 1 · 4 = 4: b⁴.",
      'b тоже возводится в степень. Её показатель один, значит 1 · 4 = 4: b⁴.',
      'b is raised to the power too. Its exponent is one, so 1 · 4 = 4: b⁴.') },
    { when: (s) => s.seq.length < 3, text: L(
      "Javob uch bo'lakdan iborat: son, a va b. Bittasi qo'yilmadi.",
      'Ответ состоит из трёх частей: число, a и b. Одну не поставил.',
      'The answer has three parts: the number, a and b. One is missing.') },
  ],
  wrongText: L(
    "Uch bo'lakni alohida ko'taring: sonni, a ni, b ni. Hech biri qavsdan chetda qolmaydi.",
    'Возведи три части по отдельности: число, a и b. Ни одна не остаётся вне скобки.',
    'Raise the three parts separately: the number, a and b. None of them stays outside.'),
};

export default function D17_03(props) { return <BuildLine data={DATA} {...props} />; }
