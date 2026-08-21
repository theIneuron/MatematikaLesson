// Dars33 · Amaliyot 05 — y o'qiga nisbatan · 🟡 · build · tag: point_mirror_y
// Mexanika: kit.jsx -> BuildLine. Raskladka: 5-o'rin.
// (−5; 2) ning y o'qiga nisbatan simmetrigi (5; 2): abssissa ishorasi
// almashadi, ordinata o'zgarmaydi.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'point_mirror_y', level: '🟡',
  eyebrow: L("y o'qiga nisbatan", 'Относительно оси y', 'Across the y axis'),
  setup: L(
    "y o'qi ko'zgu kabi ishlaydi: nuqta o'ngdan chapga o'tadi, balandligi esa o'zgarmaydi.",
    'Ось y работает как зеркало: точка переходит справа налево, а высота остаётся.',
    'The y axis acts as a mirror: the point moves left to right while its height stays.'),
  given: [['(−5;', '2)']],
  givenLabel: L('Nuqta:', 'Точка:', 'The point:'),
  cards: [
    { id: 'a', label: '(5;' },
    { id: 'b', label: '2)' },
    { id: 'c', label: '(−5;' },
    { id: 'd', label: '−2)' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Simmetrik nuqtani tuzing", 'Составь симметричную точку', 'Build the mirrored point'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. (5; 2): abssissa ishorasi almashdi, ordinata esa o'sha qoldi.",
    'Верно. (5; 2): знак абсциссы поменялся, а ордината осталась.',
    'Correct. (5; 2): the abscissa flipped and the ordinate stayed.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "Ordinata o'zgarmaydi: y o'qiga nisbatan simmetriya balandlikni saqlaydi.",
      'Ордината не меняется: симметрия относительно оси y сохраняет высоту.',
      'The ordinate does not change: reflecting in the y axis keeps the height.') },
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "Abssissa ishorasini almashtirish kerak: −5 dan 5 ga.",
      'Знак абсциссы надо поменять: из −5 в 5.',
      'The abscissa must flip: from −5 to 5.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Yozuv ikki bo'lakdan iborat.",
      'Запись состоит из двух частей.',
      'The record has two parts.') },
  ],
  wrongText: L(
    "Ko'zgu y o'qi bo'lsa, nuqta qaysi tomonga o'tadi va nimasi o'zgaradi?",
    'Если зеркало это ось y, куда переходит точка и что у неё меняется?',
    'If the mirror is the y axis, where does the point go and what changes?'),
};

export default function D33_05(props) { return <BuildLine data={DATA} {...props} />; }
