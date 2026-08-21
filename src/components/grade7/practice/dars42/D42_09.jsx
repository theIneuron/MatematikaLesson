// Dars42 · Amaliyot 09 — Tashqi burchak · 🔴 · build · tag: tri_exterior
// Mexanika: kit.jsx -> BuildLine. Raskladka: 9-o'rin.
// Tashqi burchak 130°, bir ichki burchak 60° -> ikkinchisi 130 − 60 = 70°.
// Tashqi burchak qo'shni bo'lmagan ikki ichki burchak YIG'INDISIGA teng.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'tri_exterior', level: '🔴',
  eyebrow: L('Tashqi burchak', 'Внешний угол', 'The exterior angle'),
  setup: L(
    "Tashqi burchak o'ziga qo'shni bo'lmagan ikki ichki burchak yig'indisiga teng. Bittasi ma'lum bo'lsa, ikkinchisi ayirish bilan topiladi.",
    'Внешний угол равен сумме двух не смежных с ним внутренних. Если один известен, второй находится вычитанием.',
    'An exterior angle equals the sum of the two non-adjacent interior angles. Knowing one gives the other.'),
  given: [['tashqi', '=', '130°'], ['ichki', '=', '60°']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  cards: [
    { id: 'a', label: '130° − 60°' },
    { id: 'b', label: '70°' },
    { id: 'c', label: '180° − 130°' },
    { id: 'd', label: '50°' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Hisoblab yozing", 'Запиши вычисление', 'Write the working'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 130 = 60 + x, ya'ni x = 130 − 60 = 70.",
    'Верно. 130 = 60 + x, значит x = 130 − 60 = 70.',
    'Correct. 130 = 60 + x, so x = 130 − 60 = 70.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1 || s.seq.indexOf('d') !== -1, text: L(
      "180 − 130 = 50 bu tashqi burchakka QO'SHNI ichki burchak. Savol esa boshqa ikkisi haqida.",
      '180 − 130 = 50 это внутренний угол, СМЕЖНЫЙ внешнему. А вопрос про два других.',
      '180 − 130 = 50 is the interior angle ADJACENT to the exterior one. The question asks about the other two.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Ikki bo'lak kerak: hisoblash va natija.",
      'Нужны две части: вычисление и результат.',
      'Two parts are needed: the working and the result.') },
  ],
  wrongText: L(
    "Tashqi burchak ikki ichki burchakning yig'indisiga teng. Bittasi ma'lum bo'lsa ikkinchisini qanday topadilar?",
    'Внешний угол равен сумме двух внутренних. Как найти второй, если первый известен?',
    'The exterior angle equals two interior ones. How do you find the second?'),
};

export default function D42_09(props) { return <BuildLine data={DATA} {...props} />; }
