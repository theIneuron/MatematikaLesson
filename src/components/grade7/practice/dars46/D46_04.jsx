// Dars46 · Amaliyot 04 — Uchburchak tengsizligi · 🟡 · build · tag: tri_ineq
// Mexanika: kit.jsx -> BuildLine. Raskladka: 4-o'rin.
// 3, 4 va 8: 3 + 4 = 7, 7 < 8 -- bunday uchburchak mavjud emas.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'tri_ineq', level: '🟡',
  eyebrow: L('Uchburchak tengsizligi', 'Неравенство треугольника', 'The triangle inequality'),
  setup: L(
    "Uchburchak bo'lishi uchun ikki tomonning yig'indisi uchinchisidan KATTA bo'lishi kerak. Aks holda tomonlar tutashmaydi.",
    'Чтобы треугольник существовал, сумма двух сторон должна быть БОЛЬШЕ третьей. Иначе стороны не сомкнутся.',
    'For a triangle the sum of two sides must EXCEED the third. Otherwise the sides never meet.'),
  given: [['3,', '4,', '8']],
  givenLabel: L('Tomonlar:', 'Стороны:', 'Sides:'),
  cards: [
    { id: 'a', label: '3 + 4 = 7' },
    { id: 'b', label: '7 < 8' },
    { id: 'c', label: '3 + 8 = 11' },
    { id: 'd', label: '11 > 4' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Tekshirishni yozing", 'Запиши проверку', 'Write the check'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 3 + 4 = 7, bu 8 dan KICHIK -- ya'ni bunday uchburchak yo'q. Eng kichik ikki tomonni tekshirish kifoya.",
    'Верно. 3 + 4 = 7, это МЕНЬШЕ 8 — значит такого треугольника нет. Достаточно проверить две меньшие стороны.',
    'Correct. 3 + 4 = 7, LESS than 8 — no such triangle. Checking the two shorter sides is enough.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1 || s.seq.indexOf('d') !== -1, text: L(
      "Bu tekshirish hech narsani hal qilmaydi: eng katta tomon bilan solishtirish kerak, ya'ni ikki KICHIK tomonni qo'shish.",
      'Эта проверка ничего не решает: сравнивать надо с наибольшей стороной, то есть складывать две МЕНЬШИЕ.',
      'That check decides nothing: compare against the longest side by adding the two SHORTER ones.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Ikki bo'lak kerak: yig'indi va solishtirish.",
      'Нужны две части: сумма и сравнение.',
      'Two parts are needed: the sum and the comparison.') },
  ],
  wrongText: L(
    "Qaysi ikki tomonni qo'shish kerak, va natijani nima bilan solishtirish kerak?",
    'Какие две стороны сложить и с чем сравнить результат?',
    'Which two sides should be added, and compared with what?'),
};

export default function D46_04(props) { return <BuildLine data={DATA} {...props} />; }
