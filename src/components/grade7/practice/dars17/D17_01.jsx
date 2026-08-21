// Dars17 · Amaliyot 01 — Javobni yig'ish · 🟢 · build · tag: power_build
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> BuildLine.
// Mexanika RASKLADKADAN: grade7-practice-layout.mjs, 17-dars, 1-o'rin `build`.
//
// (4x³)² = 16x⁶. Son darajaga ko'tariladi (4² = 16), harf ko'rsatkichi
// ko'paytiriladi (3 · 2 = 6).
// Ortiqcha kartalar: 8 (4 · 2) va x⁵ (3 + 2).
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'power_build', level: '🟢',
  eyebrow: L('Bir hadning darajasi', 'Степень одночлена', 'Power of a monomial'),
  setup: L(
    "Qavs ustidagi daraja qavs ichidagi har bo'lakka tegishli. Javobni o'zingiz yig'asiz: avval son, keyin harf.",
    'Степень над скобкой относится к каждой части внутри. Ответ собираешь сам: сначала число, потом буква.',
    'The power over the bracket applies to every part inside. You build the answer yourself: the number first, then the letter.'),
  expr: ['(4x³)²'], exprSize: 38,
  cards: [
    { id: 'c16', label: '16' },
    { id: 'x6', label: 'x⁶' },
    { id: 'c8', label: '8' },
    { id: 'x5', label: 'x⁵' },
  ],
  answerSeq: ['c16', 'x6'],
  empty: L("Kartalarni bosib javobni tuzing", 'Нажимай карточки и собери ответ', 'Tap the cards to build the answer'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 4² = 16, ko'rsatkich esa 3 · 2 = 6. Javob 16x⁶.",
    'Верно. 4² = 16, а показатель 3 · 2 = 6. Ответ 16x⁶.',
    'Correct. 4² = 16, and the exponent 3 · 2 = 6. The answer is 16x⁶.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c8') !== -1, text: L(
      "8 bu 4 · 2. Son ham darajaga ko'tariladi: 4² = 4 · 4 = 16.",
      '8 это 4 · 2. Число тоже возводится в степень: 4² = 4 · 4 = 16.',
      '8 is 4 · 2. The number is raised to the power too: 4² = 4 · 4 = 16.') },
    { when: (s) => s.seq.indexOf('x5') !== -1, text: L(
      "x⁵ chiqishi uchun ko'rsatkichlar qo'shilgan: 3 + 2. Darajaga ko'tarishda ular ko'paytiriladi: 3 · 2 = 6.",
      'Чтобы вышло x⁵, показатели сложили: 3 + 2. При возведении в степень они умножаются: 3 · 2 = 6.',
      'To get x⁵ the exponents were added: 3 + 2. Raising to a power multiplies them: 3 · 2 = 6.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Javob ikki bo'lakdan iborat: son va harf. Bittasi qo'yilmadi.",
      'Ответ состоит из двух частей: число и буква. Одну не поставил.',
      'The answer has two parts: the number and the letter. One is missing.') },
  ],
  wrongText: L(
    "Qavsni yozib chiqing: (4x³) · (4x³). Sonlar nima beradi, x lar nechta bo'ladi?",
    'Распиши скобку: (4x³) · (4x³). Что дают числа и сколько выходит иксов?',
    'Write the bracket out: (4x³) · (4x³). What do the numbers give and how many x are there?'),
};

export default function D17_01(props) { return <BuildLine data={DATA} {...props} />; }
