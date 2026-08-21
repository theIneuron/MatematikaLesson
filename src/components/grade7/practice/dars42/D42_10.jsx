// Dars42 · Amaliyot 10 — Nisbat bilan · 🔴 · order · tag: tri_ratio
// Mexanika: kit.jsx -> BuildLine (tartib muhim). Raskladka: 10-o'rin.
// Burchaklar 1 : 2 : 3 -> x + 2x + 3x = 180 -> x = 30 -> 30°, 60°, 90°.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'tri_ratio', level: '🔴',
  eyebrow: L('Nisbat', 'Отношение', 'A ratio'),
  setup: L(
    "Burchaklar nisbati 1 : 2 : 3. Jami olti qism 180 gradusni beradi, ya'ni bitta qism 30 gradus.",
    'Отношение углов 1 : 2 : 3. Всего шесть долей дают 180 градусов, значит одна доля 30.',
    'The angles are as 1 : 2 : 3. Six shares make 180, so one share is 30.'),
  given: [['1', ':', '2', ':', '3']],
  givenLabel: L('Nisbat:', 'Отношение:', 'Ratio:'),
  cards: [
    { id: 'a', label: 'x + 2x + 3x = 180°' },
    { id: 'b', label: 'x = 30°' },
    { id: 'c', label: '30°, 60°, 90°' },
    { id: 'd', label: 'x = 60°' },
    { id: 'e', label: '60°, 120°, 180°' },
  ],
  answerSeq: ['a', 'b', 'c'],
  empty: L("Uch qadamni tartib bilan qo'ying", 'Поставь три шага по порядку', 'Place the three steps in order'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 6x = 180 -> x = 30, burchaklar 30°, 60°, 90°: bu to'g'ri burchakli uchburchak.",
    'Верно. 6x = 180 → x = 30, углы 30°, 60°, 90°: это прямоугольный треугольник.',
    'Correct. 6x = 180 → x = 30, giving 30°, 60°, 90° — a right triangle.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('d') !== -1 || s.seq.indexOf('e') !== -1, text: L(
      "x = 60 bo'lsa burchaklar yig'indisi 360 chiqadi. Qismlar soni olti: 1 + 2 + 3.",
      'При x = 60 сумма углов выйдет 360. А долей шесть: 1 + 2 + 3.',
      'With x = 60 the sum becomes 360. There are six shares: 1 + 2 + 3.') },
    { when: (s) => s.seq.length === 3, text: L(
      "Qadamlar to'g'ri, tartibi boshqa: tenglama, qism, burchaklar.",
      'Шаги верные, но порядок другой: уравнение, доля, углы.',
      'The steps are right but the order is not: equation, share, angles.') },
    { when: (s) => s.seq.length < 3, text: L(
      "Uch qadam bo'lishi kerak.",
      'Должно быть три шага.',
      'There must be three steps.') },
  ],
  wrongText: L(
    "Jami nechta qism bor? 180 ni shu songa bo'ling.",
    'Сколько всего долей? Раздели 180 на это число.',
    'How many shares in total? Divide 180 by that.'),
};

export default function D42_10(props) { return <BuildLine data={DATA} {...props} />; }
