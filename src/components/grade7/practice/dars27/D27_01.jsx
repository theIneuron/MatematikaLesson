// Dars27 · Amaliyot 01 — To'rt had tartib bilan · 🟢 · order · tag: cube_order
// Mexanika: kit.jsx -> BuildLine (tartib muhim). Raskladka: 27-dars, 1-o'rin.
// (x + 4)³ = x³ + 12x² + 48x + 64. Koeffitsiyentlar 1, 3, 3, 1:
// 3 · x² · 4 = 12x², 3 · x · 16 = 48x, 4³ = 64.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'cube_order', level: '🟢',
  eyebrow: L("Yig'indining kubi", 'Куб суммы', 'Cube of a sum'),
  setup: L(
    "Kubda to'rt had bo'ladi va koeffitsiyentlar 1, 3, 3, 1 tartibida boradi. Daraja esa to'rtdan nolga qarab kamayadi.",
    'В кубе четыре члена, а коэффициенты идут 1, 3, 3, 1. Степень при этом убывает.',
    'A cube has four terms and the coefficients run 1, 3, 3, 1 while the power drops.'),
  expr: ['(x', '+', '4)³'], exprSize: 34,
  cards: [
    { id: 'a', label: 'x³' },
    { id: 'b', label: '+12x²' },
    { id: 'c', label: '+48x' },
    { id: 'd', label: '+64' },
    { id: 'e', label: '+4x²' },
    { id: 'f', label: '+16x' },
  ],
  answerSeq: ['a', 'b', 'c', 'd'],
  empty: L("To'rt hadni tartib bilan qo'ying", 'Поставь четыре члена по порядку', 'Place the four terms in order'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. x³, keyin 3 · x² · 4 = 12x², keyin 3 · x · 4² = 48x, oxirida 4³ = 64.",
    'Верно. x³, потом 3 · x² · 4 = 12x², затем 3 · x · 4² = 48x, в конце 4³ = 64.',
    'Correct. x³, then 3 · x² · 4 = 12x², then 3 · x · 4² = 48x, and 4³ = 64.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('e') !== -1, text: L(
      "+4x² da uchlik yo'q: ikkinchi hadning koeffitsiyenti 3, ya'ni 3 · 4 = 12.",
      'В +4x² нет тройки: у второго члена коэффициент 3, значит 3 · 4 = 12.',
      '+4x² misses the three: the second coefficient is 3, so 3 · 4 = 12.') },
    { when: (s) => s.seq.indexOf('f') !== -1, text: L(
      "+16x da uchlik yo'q: uchinchi had 3 · x · 16 = 48x.",
      'В +16x нет тройки: третий член 3 · x · 16 = 48x.',
      '+16x misses the three: the third term is 3 · x · 16 = 48x.') },
    { when: (s) => s.seq.length === 4, text: L(
      "Hadlar to'g'ri, tartibi boshqa: daraja kamayib borishi kerak.",
      'Члены верные, но порядок другой: степень должна убывать.',
      'The terms are right but the order is not: the power must decrease.') },
    { when: (s) => s.seq.length < 4, text: L(
      "Kubda to'rt had bo'ladi. Bittasi qo'yilmadi.",
      'В кубе четыре члена. Одного не поставил.',
      'A cube has four terms. One is missing.') },
  ],
  wrongText: L(
    "Koeffitsiyentlar 1, 3, 3, 1. Har hadda x ning darajasi va sonning darajasi qanday?",
    'Коэффициенты 1, 3, 3, 1. Какая степень x и какая степень числа в каждом члене?',
    'The coefficients are 1, 3, 3, 1. What power of x and of the number does each term carry?'),
};

export default function D27_01(props) { return <BuildLine data={DATA} {...props} />; }
