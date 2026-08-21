// Dars17 · Amaliyot 08 — Manfiy asos, ikki harf · 🔴 · build · tag: neg_power_build
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> BuildLine.
// Mexanika RASKLADKADAN: 17-dars, 8-o'rin `build`.
//
// (−3p²q³)³ = −27p⁶q⁹.
//   (−3)³ = −27 (uchta minus, toq)     p: 2 · 3 = 6     q: 3 · 3 = 9
// Ortiqcha kartalar: 27 (ishorasiz), p⁵ (2 + 3), q⁶ (3 + 3).
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'neg_power_build', level: '🔴',
  eyebrow: L('Minus qavs ichida', 'Минус внутри скобки', 'Minus inside the bracket'),
  setup: L(
    "Minus qavs ichida turgani uchun u ham darajaga ko'tariladi. Ko'rsatkich toq bo'lsa javob manfiy qoladi.",
    'Минус стоит внутри скобки, значит он тоже возводится в степень. При нечётном показателе ответ остаётся отрицательным.',
    'The minus is inside the bracket, so it is raised to the power too. With an odd exponent the answer stays negative.'),
  expr: ['(−3p²q³)³'], exprSize: 36,
  cards: [
    { id: 'm27', label: '−27' },
    { id: 'p6', label: 'p⁶' },
    { id: 'q9', label: 'q⁹' },
    { id: 'c27', label: '27' },
    { id: 'p5', label: 'p⁵' },
    { id: 'q6', label: 'q⁶' },
  ],
  answerSeq: ['m27', 'p6', 'q9'],
  empty: L("Kartalarni bosib javobni tuzing", 'Нажимай карточки и собери ответ', 'Tap the cards to build the answer'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. (−3)³ = −27, chunki minuslar soni uchta -- toq. p da 2 · 3 = 6, q da 3 · 3 = 9.",
    'Верно. (−3)³ = −27, потому что минусов три — нечётное число. У p 2 · 3 = 6, у q 3 · 3 = 9.',
    'Correct. (−3)³ = −27, because there are three minuses — an odd number. For p 2 · 3 = 6, for q 3 · 3 = 9.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c27') !== -1, text: L(
      "Ishora yo'qoldi: ko'rsatkich UCH, ya'ni toq. Toq sondagi minus musbat bermaydi.",
      'Потерялся знак: показатель ТРИ, то есть нечётный. Нечётное число минусов не даёт плюс.',
      'The sign got lost: the exponent is THREE, an odd number. An odd number of minuses does not give a plus.') },
    { when: (s) => s.seq.indexOf('p5') !== -1 || s.seq.indexOf('q6') !== -1, text: L(
      "p⁵ va q⁶ ko'rsatkichlarni qo'shishdan chiqadi: 2 + 3, 3 + 3. Darajaga ko'tarishda ular ko'paytiriladi.",
      'p⁵ и q⁶ выходят из сложения показателей: 2 + 3, 3 + 3. При возведении в степень они умножаются.',
      'p⁵ and q⁶ come from adding the exponents: 2 + 3, 3 + 3. Raising to a power multiplies them.') },
    { when: (s) => s.seq.length < 3, text: L(
      "Javob uch bo'lakdan iborat: son, p va q. Bittasi qo'yilmadi.",
      'Ответ состоит из трёх частей: число, p и q. Одну не поставил.',
      'The answer has three parts: the number, p and q. One is missing.') },
  ],
  wrongText: L(
    "Uch narsani hisoblang: minuslar soni toqmi, sonning darajasi qancha, ko'rsatkichlar ko'paytmasi nechchi.",
    'Посчитай три вещи: нечётное ли число минусов, чему равна степень числа, что дают произведения показателей.',
    'Work out three things: is the number of minuses odd, what the power of the number is, what the exponents multiply to.'),
};

export default function D17_08(props) { return <BuildLine data={DATA} {...props} />; }
