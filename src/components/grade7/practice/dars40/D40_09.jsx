// Dars40 · Amaliyot 09 — Nisbat bilan · 🔴 · build · tag: seg_ratio
// Mexanika: kit.jsx -> BuildLine. Raskladka: 9-o'rin.
// AC : CB = 2 : 3, AB = 25 -> 2x + 3x = 25 -> x = 5 -> AC = 10.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'seg_ratio', level: '🔴',
  eyebrow: L('Nisbat', 'Отношение', 'A ratio'),
  setup: L(
    "Bo'laklar nisbati berilgan: biri ikki qism, ikkinchisi uch qism. Jami besh qism butun kesmani beradi.",
    'Дано отношение частей: одна две доли, другая три. Вместе пять долей дают весь отрезок.',
    'The parts are given as a ratio: two shares and three. Together five shares make the whole.'),
  given: [['AC', ':', 'CB', '=', '2', ':', '3'], ['AB', '=', '25']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  cards: [
    { id: 'a', label: '2x + 3x = 25' },
    { id: 'b', label: 'x = 5' },
    { id: 'c', label: 'AC = 10' },
    { id: 'd', label: 'x = 12,5' },
    { id: 'e', label: 'AC = 5' },
  ],
  answerSeq: ['a', 'b', 'c'],
  empty: L("Uch qadamni tartib bilan qo'ying", 'Поставь три шага по порядку', 'Place the three steps in order'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 5x = 25 -> x = 5, ya'ni AC = 2 · 5 = 10 va CB = 15. Tekshirish: 10 + 15 = 25.",
    'Верно. 5x = 25 → x = 5, значит AC = 2 · 5 = 10 и CB = 15. Проверка: 10 + 15 = 25.',
    'Correct. 5x = 25 → x = 5, so AC = 2 · 5 = 10 and CB = 15. Check: 10 + 15 = 25.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "12,5 chiqishi uchun ikkiga bo'lingan. Qismlar soni esa besh: 2 + 3.",
      'Чтобы вышло 12,5, разделили на два. А долей пять: 2 + 3.',
      'To get 12.5 it was halved. But there are five shares: 2 + 3.') },
    { when: (s) => s.seq.indexOf('e') !== -1, text: L(
      "5 bu bitta qism. AC esa IKKI qism: 2 · 5 = 10.",
      '5 это одна доля. А AC это ДВЕ доли: 2 · 5 = 10.',
      '5 is one share. AC is TWO shares: 2 · 5 = 10.') },
    { when: (s) => s.seq.length < 3, text: L(
      "Uch qadam bo'lishi kerak: tenglama, qism, javob.",
      'Должно быть три шага: уравнение, доля, ответ.',
      'Three steps: equation, share, answer.') },
  ],
  wrongText: L(
    "Jami nechta qism bor? Bitta qism nechchi? AC nechta qism oladi?",
    'Сколько всего долей? Чему равна одна? Сколько долей берёт AC?',
    'How many shares in total? What is one worth? How many does AC take?'),
};

export default function D40_09(props) { return <BuildLine data={DATA} {...props} />; }
