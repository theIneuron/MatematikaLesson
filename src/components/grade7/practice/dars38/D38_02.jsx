// Dars38 · Amaliyot 02 — Tekshirish · 🟢 · build · tag: sys_check
// Mexanika: kit.jsx -> BuildLine. Raskladka: 2-o'rin.
// (2; 1) juftligi x + y = 3 va x − y = 1 sistemasini bajaradi:
// 2 + 1 = 3 va 2 − 1 = 1.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'sys_check', level: '🟢',
  eyebrow: L('Tekshirish', 'Проверка', 'Checking'),
  setup: L(
    "Juftlikni tekshirish uchun ikki tenglamaga ham qo'yish kerak. Ikki tekshirish ham to'g'ri chiqsa, bu yechim.",
    'Чтобы проверить пару, её подставляют в оба уравнения. Если обе проверки верны, это решение.',
    'Substitute the pair into both equations. If both check out, it is a solution.'),
  given: [['x', '+', 'y', '=', '3'], ['x', '−', 'y', '=', '1'], ['(2;', '1)']],
  givenLabel: L('Sistema va juftlik:', 'Система и пара:', 'System and pair:'),
  cards: [
    { id: 'a', label: '2 + 1 = 3' },
    { id: 'b', label: '2 − 1 = 1' },
    { id: 'c', label: '1 + 2 = 3' },
    { id: 'd', label: '1 − 2 = 1' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Ikki tekshirishni yozing", 'Запиши две проверки', 'Write both checks'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. x = 2, y = 1: 2 + 1 = 3 va 2 − 1 = 1. Ikkovi bajarildi, ya'ni (2; 1) yechim.",
    'Верно. x = 2, y = 1: 2 + 1 = 3 и 2 − 1 = 1. Оба выполнены, значит (2; 1) решение.',
    'Correct. x = 2, y = 1: 2 + 1 = 3 and 2 − 1 = 1. Both hold, so (2; 1) is a solution.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "1 − 2 = −1, birga teng emas. Juftlikda birinchi son x: x = 2, y = 1.",
      '1 − 2 = −1, а не единица. В паре первое число это x: x = 2, y = 1.',
      '1 − 2 = −1, not one. In the pair the first number is x: x = 2, y = 1.') },
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "Yig'indi uchun tartib muhim emas, lekin ayirma uchun muhim: x va y ni almashtirmaslik kerak.",
      'Для суммы порядок не важен, а для разности важен: x и y менять местами нельзя.',
      'Order does not matter for the sum but it does for the difference: do not swap x and y.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Ikki tekshirish kerak: har tenglama uchun bittasi.",
      'Нужны две проверки: по одной на каждое уравнение.',
      'Two checks are needed: one per equation.') },
  ],
  wrongText: L(
    "Juftlikda birinchi son x, ikkinchisi y. Ikki tenglamaga ham qo'ying.",
    'В паре первое число x, второе y. Подставь в оба уравнения.',
    'In the pair the first number is x, the second y. Substitute into both.'),
};

export default function D38_02(props) { return <BuildLine data={DATA} {...props} />; }
