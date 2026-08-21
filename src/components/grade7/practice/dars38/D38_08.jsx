// Dars38 · Amaliyot 08 — Yig'indi va ayirma · 🔴 · build · tag: sys_sum_diff
// Mexanika: kit.jsx -> BuildLine. Raskladka: 8-o'rin.
// x + y = 10 va x − y = 2 -> x = 6, y = 4.
// Tekshirish: 6 + 4 = 10, 6 − 4 = 2.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'sys_sum_diff', level: '🔴',
  eyebrow: L("Yig'indi va ayirma", 'Сумма и разность', 'Sum and difference'),
  setup: L(
    "Ikki son yig'indisi 10, ayirmasi 2. Kattasi yig'indi va ayirmaning yarim yig'indisi bo'ladi.",
    'Сумма двух чисел 10, разность 2. Большее это полусумма суммы и разности.',
    'Two numbers sum to 10 and differ by 2. The larger is half the sum plus half the difference.'),
  given: [['x', '+', 'y', '=', '10'], ['x', '−', 'y', '=', '2']],
  givenLabel: L('Sistema:', 'Система:', 'The system:'),
  cards: [
    { id: 'a', label: 'x = 6' },
    { id: 'b', label: 'y = 4' },
    { id: 'c', label: 'x = 5' },
    { id: 'd', label: 'y = 5' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Yechimni yozing", 'Запиши решение', 'Write the solution'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. x = 6, y = 4: 6 + 4 = 10 va 6 − 4 = 2. Ikki tenglama ham bajarildi.",
    'Верно. x = 6, y = 4: 6 + 4 = 10 и 6 − 4 = 2. Оба уравнения выполнены.',
    'Correct. x = 6, y = 4: 6 + 4 = 10 and 6 − 4 = 2. Both equations hold.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1 || s.seq.indexOf('d') !== -1, text: L(
      "5 va 5 birinchi tenglamani bajaradi, lekin ayirma nol chiqadi -- ikkiga teng emas.",
      '5 и 5 подходят первому уравнению, но разность выходит нуль — не два.',
      '5 and 5 fit the first equation, but their difference is zero, not two.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Javobda ikki son bo'ladi: x va y.",
      'В ответе два числа: x и y.',
      'The answer has two numbers: x and y.') },
  ],
  wrongText: L(
    "Ikki shartni birga tekshiring: yig'indi 10 va ayirma 2 bo'lishi kerak.",
    'Проверь оба условия сразу: сумма 10 и разность 2.',
    'Check both conditions at once: sum 10 and difference 2.'),
};

export default function D38_08(props) { return <BuildLine data={DATA} {...props} />; }
