// Dars24 · Amaliyot 05 — Uch had, bittasi birga aylanadi · 🟡 · build · tag: div_build
// Mexanika: kit.jsx -> BuildLine. Raskladka: 5-o'rin.
// (45c⁶ + 27c⁴ − 9c²) : 9c² = 5c⁴ + 3c² − 1.
// Uchinchi hadda 9c² : 9c² = 1 -- eng ko'p tashlab ketiladigan joy.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'div_build', level: '🟡',
  eyebrow: L('Uch had', 'Три члена', 'Three terms'),
  setup: L(
    "Uch had bo'linadi. Oxirgisi bo'luvchi bilan bir xil, ya'ni bo'linma bir bo'ladi -- va u yozuvda YOZILADI, tashlab ketilmaydi.",
    'Делятся три члена. Последний совпадает с делителем, значит частное равно единице — и её ПИШУТ, не выбрасывают.',
    'Three terms are divided. The last matches the divisor, so its quotient is one — and that one IS written, not dropped.'),
  expr: ['(45c⁶', '+', '27c⁴', '−', '9c²)', ':', '9c²'], exprSize: 26,
  cards: [
    { id: 'a', label: '5c⁴' },
    { id: 'b', label: '+3c²' },
    { id: 'c', label: '−1' },
    { id: 'd', label: '−9' },
    { id: 'e', label: '+3c⁴' },
    { id: 'f', label: '5c³' },
  ],
  answerSeq: ['a', 'b', 'c'],
  empty: L("Kartalarni bosib javobni tuzing", 'Нажимай карточки и собери ответ', 'Tap the cards to build the answer'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 45 : 9 = 5 va 6 − 2 = 4; 27 : 9 = 3 va 4 − 2 = 2; 9 : 9 = 1 va 2 − 2 = 0, ya'ni −1.",
    'Верно. 45 : 9 = 5 и 6 − 2 = 4; 27 : 9 = 3 и 4 − 2 = 2; 9 : 9 = 1 и 2 − 2 = 0, значит −1.',
    'Correct. 45 : 9 = 5 and 6 − 2 = 4; 27 : 9 = 3 and 4 − 2 = 2; 9 : 9 = 1 and 2 − 2 = 0, giving −1.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "−9 chiqishi uchun bo'lish bajarilmagan: 9c² : 9c² = 1, 9 emas.",
      'Чтобы вышло −9, деление не выполнили: 9c² : 9c² = 1, а не 9.',
      'To get −9 the division was skipped: 9c² : 9c² = 1, not 9.') },
    { when: (s) => s.seq.indexOf('e') !== -1, text: L(
      "27c⁴ : 9c² da ko'rsatkichlar ayiriladi: 4 − 2 = 2, ya'ni 3c².",
      'В 27c⁴ : 9c² показатели вычитаются: 4 − 2 = 2, значит 3c².',
      'In 27c⁴ : 9c² the exponents subtract: 4 − 2 = 2, giving 3c².') },
    { when: (s) => s.seq.indexOf('f') !== -1, text: L(
      "45c⁶ : 9c² da 6 − 2 = 4, ya'ni 5c⁴.",
      'В 45c⁶ : 9c² выходит 6 − 2 = 4, значит 5c⁴.',
      'In 45c⁶ : 9c² we get 6 − 2 = 4, so 5c⁴.') },
    { when: (s) => s.seq.length < 3, text: L(
      "Javobda uch had bo'ladi: bo'linuvchida ham uchta. Oxirgisi bir, lekin u ham yoziladi.",
      'В ответе три члена: в делимом их тоже три. Последний равен единице, но её тоже пишут.',
      'The answer has three terms, like the dividend. The last is one, and it is written too.') },
  ],
  wrongText: L(
    "Uch hadni alohida bo'ling. Oxirgi had bo'luvchi bilan bir xil -- bo'linma nechchi?",
    'Раздели три члена по отдельности. Последний совпадает с делителем — чему равно частное?',
    'Divide the three terms separately. The last matches the divisor — what is that quotient?'),
};

export default function D24_05(props) { return <BuildLine data={DATA} {...props} />; }
