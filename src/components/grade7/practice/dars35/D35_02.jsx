// Dars35 · Amaliyot 02 — k ning ishorasi · 🟢 · choice · tag: k_sign
// Mexanika: kit.jsx -> Choice. Raskladka: 2-o'rin (isinish).
// y = −4x + 1: k manfiy, ya'ni funksiya KAMAYADI -- grafik pastga qarab
// ketadi.
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'k_sign', level: '🟢',
  eyebrow: L('k ning ishorasi', 'Знак k', 'The sign of k'),
  setup: L(
    "x oldidagi son funksiyaning yo'nalishini beradi: musbat bo'lsa qiymat o'sadi, manfiy bo'lsa kamayadi.",
    'Число перед x задаёт направление: если оно положительное, значение растёт, если отрицательное — убывает.',
    'The number before x sets the direction: positive means growing, negative means falling.'),
  expr: ['y', '=', '−4x', '+', '1'], exprSize: 30,
  ask: L('Funksiya qanday o\'zgaradi?', 'Как меняется функция?', 'How does the function change?'),
  opts: [
    { label: L('Kamayadi', 'Убывает', 'It falls') },
    { label: L("O'sadi", 'Возрастает', 'It grows') },
    { label: L("O'zgarmaydi", 'Не меняется', 'It stays') },
  ],
  correct: 0,
  correctText: L(
    "To'g'ri. k = −4, ya'ni manfiy: x oshgan sari y kamayadi. Tekshirish: x = 0 da y = 1, x = 1 da y = −3.",
    'Верно. k = −4, то есть отрицательное: с ростом x значение y падает. Проверка: при x = 0 выходит y = 1, при x = 1 выходит y = −3.',
    'Correct. k = −4 is negative: as x grows y falls. Check: at x = 0, y = 1; at x = 1, y = −3.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "O'sish uchun k musbat bo'lishi kerak. Bizda −4, ya'ni manfiy.",
      'Для роста k должно быть положительным. У нас −4, то есть отрицательное.',
      'Growing needs a positive k. Ours is −4, negative.') },
    { when: (s) => s.picked === 2, text: L(
      "O'zgarmaslik uchun x butunlay bo'lmasligi kerak edi: y = 1 kabi.",
      'Чтобы функция не менялась, x вообще не должен встречаться: как в y = 1.',
      'For no change there must be no x at all, as in y = 1.') },
  ],
  wrongText: L(
    "Ikki son qo'yib ko'ring: x = 0 va x = 1. y oshdimi yoki kamaydimi?",
    'Подставь два числа: x = 0 и x = 1. Значение выросло или упало?',
    'Try two numbers: x = 0 and x = 1. Did y grow or fall?'),
};

export default function D35_02(props) { return <Choice data={DATA} {...props} />; }
