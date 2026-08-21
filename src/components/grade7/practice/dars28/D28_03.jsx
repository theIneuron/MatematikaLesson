// Dars28 · Amaliyot 03 — 41² og'zaki · 🟢 · build · tag: formula_mental_41
// Mexanika: kit.jsx -> BuildLine. Raskladka: 3-o'rin.
// 41² = (40 + 1)² = 1600 + 80 + 1 = 1681.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'formula_mental_41', level: '🟢',
  eyebrow: L("Og'zaki kvadrat", 'Квадрат устно', 'A square in your head'),
  setup: L(
    "41 ni 40 + 1 deb yozsak, kvadrat formulasi og'zaki hisobga aylanadi. Uch hadni yig'ish qoladi.",
    'Если записать 41 как 40 + 1, формула квадрата превращается в устный счёт. Останется сложить три члена.',
    'Writing 41 as 40 + 1 turns the square formula into mental arithmetic: three terms to add.'),
  expr: ['41²'], exprSize: 36,
  cards: [
    { id: 'a', label: '1600' },
    { id: 'b', label: '+80' },
    { id: 'c', label: '+1' },
    { id: 'd', label: '+40' },
    { id: 'e', label: '+2' },
  ],
  answerSeq: ['a', 'b', 'c'],
  empty: L("Uch hadni qo'ying", 'Поставь три члена', 'Place the three terms'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 40² = 1600, 2 · 40 · 1 = 80, 1² = 1. Yig'indisi 1681.",
    'Верно. 40² = 1600, 2 · 40 · 1 = 80, 1² = 1. Сумма 1681.',
    'Correct. 40² = 1600, 2 · 40 · 1 = 80, 1² = 1. The sum is 1681.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "+40 da ikki karra yo'q: 2 · 40 · 1 = 80.",
      'В +40 нет двойки: 2 · 40 · 1 = 80.',
      '+40 misses the doubling: 2 · 40 · 1 = 80.') },
    { when: (s) => s.seq.indexOf('e') !== -1, text: L(
      "+2 bu 2 · 1. Oxirgi had kvadrat: 1² = 1.",
      '+2 это 2 · 1. Последний член это квадрат: 1² = 1.',
      '+2 is 2 · 1. The last term is a square: 1² = 1.') },
    { when: (s) => s.seq.length < 3, text: L(
      "Uch had bo'lishi kerak.",
      'Должно быть три члена.',
      'There must be three terms.') },
  ],
  wrongText: L(
    "40² nechchi, 2 · 40 · 1 nechchi, 1² nechchi?",
    'Чему равно 40², сколько 2 · 40 · 1 и сколько 1²?',
    'What is 40², what is 2 · 40 · 1, and what is 1²?'),
};

export default function D28_03(props) { return <BuildLine data={DATA} {...props} />; }
