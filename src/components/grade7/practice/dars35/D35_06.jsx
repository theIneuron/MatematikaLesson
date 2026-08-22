// Dars35 · Amaliyot 06 — Uch qadam · 🟡 · order · tag: lin_order
// Mexanika: kit.jsx -> BuildLine. Raskladka: 6-o'rin `order`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): k manfiy va kasr bo'ladi,
// savol ikki qadamli -- PODXOD_7SINF.md 13-band.
// y = −3x + 4, x = −6: −3 · (−6) = 18 -> 18 + 4 = 22.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'lin_order',
  level: '🟡',
  eyebrow: L(
    'Uch qadam',
    'Три шага',
    'Three steps'),
  setup: L(
    "Manfiy x bilan hisoblashni uch qadamga bo'ling: ko'paytirish, qo'shish, javob.",
    'Раздели вычисление с отрицательным x на три шага: умножение, сложение, ответ.',
    'Split the computation into three steps: multiply, add, answer.'),
  given: [['y = −3x + 4', ',', 'x = −6']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [
    { id: 'a', label: '−3 · (−6) = 18' },
    { id: 'b', label: '18 + 4 = 22' },
    { id: 'c', label: 'y = 22' },
    { id: 'd', label: '−3 · 6 = −18' },
    { id: 'e', label: 'y = −14' },
  ],
  answerSeq: ['a', 'b', 'c'],
  ask: L(
    "Kartani bosish uni chiziqqa qo'yadi.",
    'Нажатие на карточку ставит её в строку.',
    'Tapping a card puts it in the line.'),
  empty: L(
    'Kartalarni bosib javobni tuzing',
    'Нажимай карточки и собери ответ',
    'Tap the cards to build the answer'),
  bank: L(
    'Kartalar',
    'Карточки',
    'Cards'),
  correctText: L(
    "To'g'ri. Ikki minus plyus berdi: 18, keyin 18 + 4 = 22.",
    'Верно. Два минуса дали плюс: 18, затем 18 + 4 = 22.',
    'Correct. Two minuses gave a plus: 18, then 18 + 4 = 22.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('d') !== -1 || s.seq.indexOf('e') !== -1,
      text: L(
        "x = −6, ya'ni ko'paytma −3 · (−6) = +18. Minus tashlab ketilgan.",
        'x = −6, значит произведение −3 · (−6) = +18. Минус потеряли.',
        'x = −6, so the product is −3 · (−6) = +18. The minus was dropped.'),
    },
    {
      when: (s) => s.seq.length < 3,
      text: L(
        'Uch karta kerak.',
        'Нужны три карточки.',
        'Three cards are needed.'),
    },
  ],
  wrongText: L(
    "Ikki manfiy sonning ko'paytmasi musbat bo'ladi.",
    'Произведение двух отрицательных чисел положительно.',
    'A product of two negatives is positive.'),
};

export default function D35_06(props) { return <BuildLine data={DATA} {...props} />; }
