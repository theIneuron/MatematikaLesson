// Dars08 · Amaliyot 06 — Noma'lum ikki tomonda · 🟡 · tag: unknown_both_sides
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
//
// 4x + 9 = 3x − 2.
//   ko'chirish: 4x − 3x = −2 − 9
//   yig'ish:    x = −11
// Koeffitsiyent 1 chiqdi, ya'ni bo'lish shart emas -- shu sababli bu misol
// «ko'chirish» ko'nikmasini toza tekshiradi.
// Tekshirish: 4 · (−11) + 9 = −35 va 3 · (−11) − 2 = −35.
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'unknown_both_sides', level: '🟡', allowNeg: true, target: -11,
  eyebrow: L("Noma'lum ikki tomonda", 'Неизвестное в двух частях', 'The unknown on both sides'),
  setup: L(
    "Noma'lum ikki tomonda ham bor. Uni bir tomonga to'plash kerak, sonlarni esa ikkinchisiga.",
    'Неизвестное есть в обеих частях. Его надо собрать в одну часть, а числа в другую.',
    'The unknown is on both sides. It has to be gathered on one side and the numbers on the other.'),
  expr: ['4x', '+', '9', '=', '3x', '−', '2'], exprSize: 30,
  label: L('Ildizni yozing:', 'Запиши корень:', 'Write the root:'),
  correctText: L(
    "To'g'ri. 4x − 3x = −2 − 9, ya'ni x = −11. Koeffitsiyent 1 chiqdi, bo'lish kerak emas. Tekshirish: ikki tomon ham −35.",
    'Верно. 4x − 3x = −2 − 9, то есть x = −11. Коэффициент вышел 1, делить не нужно. Проверка: обе части дают −35.',
    'Correct. 4x − 3x = −2 − 9, so x = −11. The coefficient came out as 1, no division needed. Check: both sides give −35.'),
  wrongs: [
    { when: (s) => s.value === 7 || s.value === -7, text: L(
      "Sonlarni ishorasi bilan yig'ing: −2 − 9 = −11. 9 ko'chganda ayiriladi.",
      'Собирай числа со знаками: −2 − 9 = −11. Девятка при переносе вычитается.',
      'Collect the numbers with their signs: −2 − 9 = −11. The nine is subtracted when it moves.') },
    { when: (s) => s.value === 11, text: L(
      "Ishorani tekshiring: o'ng tomonda ikki son ham manfiy bo'lib qoldi, ya'ni ildiz manfiy.",
      'Проверь знак: справа оба числа оказались отрицательными, значит корень отрицательный.',
      'Check the sign: both numbers on the right came out negative, so the root is negative.') },
    { when: (s) => s.value === -1 || s.value === 1, text: L(
      "4x − 3x = x, lekin bu javob emas: o'ng tomonni ham hisoblash kerak.",
      '4x − 3x = x, но это не ответ: правую часть тоже надо посчитать.',
      '4x − 3x = x, but that is not the answer: the right side has to be worked out too.') },
  ],
  wrongText: L(
    "Noma'lumlarni chapga, sonlarni o'ngga ko'chiring va ishoralarni o'zgartirishni yodda tuting.",
    'Перенеси неизвестные влево, числа вправо и не забудь поменять знаки.',
    'Move the unknowns left and the numbers right, and remember to flip the signs.'),
};

export default function D08_06(props) { return <TypeValue data={DATA} {...props} />; }
