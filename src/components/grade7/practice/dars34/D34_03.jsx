// Dars34 · Amaliyot 03 — Qiymatni yozish · 🟢 · bracket · tag: fn_substitute
// Mexanika: kit.jsx -> BuildLine (qavs kartalari). Raskladka: 3-o'rin.
// f(x) = 3x + 1, f(2) = 3 · 2 + 1 = 7. Son x ning O'RNIGA qo'yiladi.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'fn_substitute', level: '🟢',
  eyebrow: L('Qiymatni topish', 'Найти значение', 'Find the value'),
  setup: L(
    "f(2) yozuvi «x o'rniga 2 qo'y» degani. Formuladagi har x o'rniga shu son qo'yiladi.",
    'Запись f(2) означает «подставь вместо x двойку». Каждый x в формуле заменяется этим числом.',
    'f(2) means "put 2 in place of x". Every x in the rule is replaced.'),
  given: [['f(x)', '=', '3x', '+', '1']],
  givenLabel: L('Formula:', 'Формула:', 'The rule:'),
  cards: [
    { id: 'a', label: '3 · 2 + 1' },
    { id: 'b', label: '7' },
    { id: 'c', label: '3 + 2 + 1' },
    { id: 'd', label: '6' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("f(2) ni hisoblab yozing", 'Запиши вычисление f(2)', 'Write out f(2)'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. f(2) = 3 · 2 + 1 = 7.",
    'Верно. f(2) = 3 · 2 + 1 = 7.',
    'Correct. f(2) = 3 · 2 + 1 = 7.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "3x bu 3 · x, 3 + x emas. Ko'paytirish yozilmaydi, lekin u bor.",
      '3x это 3 · x, а не 3 + x. Умножение не пишется, но оно есть.',
      '3x means 3 · x, not 3 + x. The multiplication is hidden but real.') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "6 bu faqat 3 · 2. Formulada yana +1 turibdi.",
      '6 это только 3 · 2. В формуле есть ещё +1.',
      '6 is only 3 · 2. The rule also has +1.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Ikki bo'lak kerak: hisoblash va natija.",
      'Нужны две части: вычисление и результат.',
      'Two parts are needed: the working and the result.') },
  ],
  wrongText: L(
    "x o'rniga 2 qo'ying, keyin amallar tartibi bilan hisoblang.",
    'Подставь вместо x двойку и посчитай по порядку действий.',
    'Put 2 in place of x, then follow the order of operations.'),
};

export default function D34_03(props) { return <BuildLine data={DATA} {...props} />; }
