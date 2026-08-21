// Dars39 · Amaliyot 06 — Qo'shib yuborgan · 🟡 · fix · tag: comb_fix
// Mexanika: kit.jsx -> TapTerms. Raskladka: 6-o'rin.
// 4 ta kitobdan 3 tasini tanlash yo'llari: 4 · 3 = 12. Chuqur javob 7 --
// ko'paytirish o'rniga qo'shgan.
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'comb_fix', level: '🟡',
  eyebrow: L('Xato bo\'lak', 'Неверная часть', 'The wrong part'),
  setup: L(
    "Boshqa o'quvchi yozuvni to'g'ri tuzdi, lekin natijani xato hisobladi.",
    'Другой ученик верно составил запись, но неверно посчитал результат.',
    'Another pupil set the record up correctly but miscounted the result.'),
  given: [['4', 'kitob,', '2', "o'rin"]],
  givenLabel: L('Masala:', 'Задание:', 'The task:'),
  ask: L("NOTO'G'RI bo'lakni belgilang.", 'Отметь НЕВЕРНУЮ часть.', 'Mark the WRONG part.'),
  note: L('Bitta bo\'lak.', 'Одна часть.', 'One part.'),
  parts: [
    { k: 'term', id: 't1', v: '4 · 3' },
    { k: 'sign', v: '=' },
    { k: 'term', id: 't2', v: '7' },
  ],
  want: ['t2'],
  correctText: L(
    "To'g'ri. 4 · 3 = 12, 7 emas. Yetti bu 4 + 3, ya'ni qo'shish natijasi.",
    'Верно. 4 · 3 = 12, а не 7. Семь это 4 + 3, результат сложения.',
    'Correct. 4 · 3 = 12, not 7. Seven is 4 + 3, the result of adding.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('t1') !== -1, text: L(
      "4 · 3 to'g'ri tuzilgan: birinchi o'ringa to'rt kitob, ikkinchisiga qolgan uchtasi.",
      '4 · 3 составлено верно: на первое место четыре книги, на второе оставшиеся три.',
      '4 · 3 is set up right: four books for the first place, the remaining three for the second.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Natijani hisoblang: 4 · 3 nechchi?",
      'Посчитай результат: сколько 4 · 3?',
      'Work out the result: what is 4 · 3?') },
  ],
  wrongText: L(
    "Yozuvda ko'paytirish turibdi. 4 · 3 nechchi bo'ladi?",
    'В записи стоит умножение. Чему равно 4 · 3?',
    'The record shows a multiplication. What is 4 · 3?'),
};

export default function D39_06(props) { return <TapTerms data={DATA} {...props} />; }
