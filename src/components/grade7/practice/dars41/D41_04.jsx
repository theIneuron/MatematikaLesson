// Dars41 · Amaliyot 04 — Xato xulosa · 🟡 · fix · tag: kind_fix
// Mexanika: kit.jsx -> TapTerms. Raskladka: 4-o'rin `fix`.
// Uch xulosadan biri xato: to'g'ri burchakli uchburchak teng yonli BO'LISHI mumkin (45°, 45°, 90°).
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'kind_fix',
  level: '🟡',
  eyebrow: L(
    'Xato xulosa',
    'Неверный вывод',
    'The wrong claim'),
  setup: L(
    "Uch xulosadan biri noto'g'ri. Ikki bo'linish MUSTAQIL: tomonlar bo'yicha nom burchaklar bo'yicha nomni cheklamaydi.",
    'Один из трёх выводов неверный. Два деления НЕЗАВИСИМЫ: имя по сторонам не ограничивает имя по углам.',
    'One of the three claims is wrong. The two classifications are INDEPENDENT: the side name does not limit the angle name.'),
  ask: L(
    "NOTO'G'RI xulosani belgilang.",
    'Отметь НЕВЕРНЫЙ вывод.',
    'Mark the WRONG claim.'),
  note: L(
    'Bitta xulosa.',
    'Один вывод.',
    'One claim.'),
  parts: [
    { k: 'term', id: 't1', v: L('teng tomonli teng yonli hamdir', 'равносторонний это и равнобедренный', 'an equilateral is isosceles too') },
    { k: 'sign', v: ' ' },
    { k: 'term', id: 't2', v: L("to'g'ri burchakli teng yonli bo'lolmaydi", 'прямоугольный не может быть равнобедренным', 'a right triangle cannot be isosceles') },
    { k: 'sign', v: ' ' },
    { k: 'term', id: 't3', v: L("o'tmas burchak faqat bitta bo'ladi", 'тупой угол только один', 'only one angle can be obtuse') },
  ],
  want: ['t2'],
  correctText: L(
    "To'g'ri. 45, 45 va 90 gradusli uchburchak ham to'g'ri burchakli, ham teng yonli.",
    'Верно. Треугольник 45, 45 и 90 градусов и прямоугольный, и равнобедренный.',
    'Correct. A 45, 45, 90 triangle is both right-angled and isosceles.'),
  wrongs: [
    {
      when: (s) => s.extra.indexOf('t1') !== -1,
      text: L(
        "Teng tomonlida uch tomon teng, ya'ni ikki teng tomon ham bor -- xulosa to'g'ri.",
        'У равностороннего три равные стороны, значит есть и две равные — вывод верный.',
        'An equilateral has three equal sides, hence two as well — the claim holds.'),
    },
    {
      when: (s) => s.extra.indexOf('t3') !== -1,
      text: L(
        "Ikki o'tmas burchak birga 180 dan oshadi, ya'ni bittadan ko'p bo'lolmaydi -- xulosa to'g'ri.",
        'Два тупых угла вместе дают больше 180, значит больше одного быть не может — вывод верный.',
        'Two obtuse angles would exceed 180 together, so only one is possible — the claim holds.'),
    },
    {
      when: (s) => s.miss.length > 0,
      text: L(
        "Har xulosani misol bilan sinab ko'ring: 45, 45, 90 uchburchagini eslang.",
        'Проверь каждый вывод примером: вспомни треугольник 45, 45, 90.',
        'Test each claim with an example: recall the 45, 45, 90 triangle.'),
    },
  ],
  wrongText: L(
    "To'g'ri burchakli uchburchakning ikki kateti teng bo'lsa nima bo'ladi?",
    'Что будет, если у прямоугольного треугольника равны два катета?',
    'What if a right triangle has two equal legs?'),
};

export default function D41_04(props) { return <TapTerms data={DATA} {...props} />; }
