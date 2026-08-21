// Dars34 · Amaliyot 09 — Harfli argument · 🔴 · build · tag: fn_letter_arg
// Mexanika: kit.jsx -> BuildLine. Raskladka: 9-o'rin.
// f(x) = 2x + 3, f(a + 1) = 2(a + 1) + 3 = 2a + 5.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'fn_letter_arg', level: '🔴',
  eyebrow: L('Harfli argument', 'Буквенный аргумент', 'A letter argument'),
  setup: L(
    "x o'rniga son emas, ifoda qo'yiladi: a + 1. Uni butunligi bilan qavsda qo'yish kerak.",
    'Вместо x подставляется не число, а выражение: a + 1. Его надо подставить целиком, в скобках.',
    'Instead of a number, an expression goes in: a + 1. It must be substituted whole, in brackets.'),
  given: [['f(x)', '=', '2x', '+', '3']],
  givenLabel: L('Formula:', 'Формула:', 'The rule:'),
  cards: [
    { id: 'a', label: '2a' },
    { id: 'b', label: '+5' },
    { id: 'c', label: '2a + 3' },
    { id: 'd', label: '+4' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("f(a + 1) ni yozing", 'Запиши f(a + 1)', 'Write f(a + 1)'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 2(a + 1) + 3 = 2a + 2 + 3 = 2a + 5.",
    'Верно. 2(a + 1) + 3 = 2a + 2 + 3 = 2a + 5.',
    'Correct. 2(a + 1) + 3 = 2a + 2 + 3 = 2a + 5.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "2a + 3 da bir ko'paytirilmagan: 2 · 1 = 2, ya'ni yana +2 qo'shiladi.",
      'В 2a + 3 единица не умножена: 2 · 1 = 2, значит добавляется ещё +2.',
      'In 2a + 3 the one was not multiplied: 2 · 1 = 2, so another +2 joins.') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "+4 chiqishi uchun 3 ga 1 qo'shilgan. To'g'ri yo'l: 2 · 1 = 2, keyin 2 + 3 = 5.",
      'Чтобы вышло +4, к 3 прибавили 1. Верный путь: 2 · 1 = 2, потом 2 + 3 = 5.',
      'To get +4 the 1 was added to 3. The right way: 2 · 1 = 2, then 2 + 3 = 5.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Javobda ikki had bo'ladi: a li had va son.",
      'В ответе два члена: с a и число.',
      'The answer has two terms: the a term and a number.') },
  ],
  wrongText: L(
    "x o'rniga (a + 1) ni qo'ying va qavsni oching: 2 ni ikki hadga ham ko'paytiring.",
    'Подставь вместо x (a + 1) и раскрой скобку: умножь 2 на оба члена.',
    'Put (a + 1) in place of x and open the bracket: multiply 2 by both terms.'),
};

export default function D34_09(props) { return <BuildLine data={DATA} {...props} />; }
