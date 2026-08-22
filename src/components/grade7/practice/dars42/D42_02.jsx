// Dars42 · Amaliyot 02 — Moslikni yozish · 🟢 · bracket · tag: eq_bracket
// Mexanika: kit.jsx -> BuildLine. Raskladka: 2-o'rin `bracket`.
// Teng uchburchaklarda MOS tomonlar teng: AB = A₁B₁. Tuzoq: AB = B₁C₁.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'eq_bracket',
  level: '🟢',
  eyebrow: L(
    'Moslik',
    'Соответствие',
    'Correspondence'),
  setup: L(
    "Teng uchburchaklarda mos tomonlar teng. Moslik harflar TARTIBI bilan beriladi: A ga A₁, B ga B₁ to'g'ri keladi.",
    'В равных треугольниках соответственные стороны равны. Соответствие задано ПОРЯДКОМ букв: A отвечает A₁, B отвечает B₁.',
    'In equal triangles matching sides are equal. The match comes from the ORDER of letters: A goes with A₁, B with B₁.'),
  given: [['ABC = A₁B₁C₁']],
  givenLabel: L(
    'Teng uchburchaklar:',
    'Равные треугольники:',
    'Equal triangles:'),
  cards: [
    { id: 'a', label: 'AB' },
    { id: 'b', label: '= A₁B₁' },
    { id: 'c', label: '= B₁C₁' },
    { id: 'd', label: '= A₁C₁' },
  ],
  answerSeq: ['a', 'b'],
  fieldH: 44,
  ask: L(
    "Kartani bosish uni chiziqqa qo'yadi.",
    'Нажатие на карточку ставит её в строку.',
    'Tapping a card puts it in the line.'),
  empty: L(
    'Kartalarni bosib javobni tuzing',
    'Нажимай карточки и собери ответ',
    'Tap the cards to build the answer'),
  bank: L(
    'Kartalar',
    'Карточки',
    'Cards'),
  correctText: L(
    "To'g'ri. AB ga A₁B₁ mos keladi, chunki A -- A₁ va B -- B₁.",
    'Верно. AB соответствует A₁B₁, потому что A — A₁ и B — B₁.',
    'Correct. AB matches A₁B₁ because A pairs with A₁ and B with B₁.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        'B₁C₁ ga BC mos keladi, AB emas. Harflar tartibiga qarang.',
        'B₁C₁ соответствует BC, а не AB. Смотри на порядок букв.',
        'B₁C₁ matches BC, not AB. Follow the letter order.'),
    },
    {
      when: (s) => s.seq.indexOf('d') !== -1,
      text: L(
        'A₁C₁ ga AC mos keladi. Bizga AB ning jufti kerak.',
        'A₁C₁ соответствует AC. А нам нужна пара для AB.',
        'A₁C₁ matches AC. We need the partner of AB.'),
    },
    {
      when: (s) => s.seq.length < 2,
      text: L(
        'Ikki karta kerak.',
        'Нужны две карточки.',
        'Two cards are needed.'),
    },
  ],
  wrongText: L(
    "Tenglik yozuvidagi harflar o'rniga qarang: birinchi harf birinchisiga, ikkinchisi ikkinchisiga.",
    'Смотри на места букв в записи равенства: первая к первой, вторая ко второй.',
    'Match the letters by position: first to first, second to second.'),
};

export default function D42_02(props) { return <BuildLine data={DATA} {...props} />; }
