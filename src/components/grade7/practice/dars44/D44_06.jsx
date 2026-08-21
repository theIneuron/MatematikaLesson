// Dars44 · Amaliyot 06 — Uchidagi burchak · 🟡 · build · tag: iso_apex
// Mexanika: kit.jsx -> BuildLine. Raskladka: 6-o'rin.
// Asos burchagi 65° -> uchi 180 − 130 = 50°.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'iso_apex', level: '🟡',
  eyebrow: L('Uchidagi burchak', 'Угол при вершине', 'The apex angle'),
  setup: L(
    "Asosdagi ikki burchak teng va ma'lum. Uchidagi burchak 180 dan ikkovini ayirish bilan topiladi.",
    'Два угла при основании равны и известны. Угол при вершине это 180 минус оба.',
    'Both base angles are known and equal. The apex is 180 minus both.'),
  given: [['asos', 'burchagi', '=', '65°']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  cards: [
    { id: 'a', label: '180° − 130°' },
    { id: 'b', label: '50°' },
    { id: 'c', label: '180° − 65°' },
    { id: 'd', label: '115°' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Hisoblab yozing", 'Запиши вычисление', 'Write the working'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 65 + 65 = 130, keyin 180 − 130 = 50.",
    'Верно. 65 + 65 = 130, потом 180 − 130 = 50.',
    'Correct. 65 + 65 = 130, then 180 − 130 = 50.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1 || s.seq.indexOf('d') !== -1, text: L(
      "Bitta 65 ayirilgan. Asosda ikki burchak bor, ikkovi ham 65°.",
      'Вычли одну 65. При основании два угла, и оба по 65°.',
      'Only one 65 was subtracted. There are two base angles, both 65°.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Ikki bo'lak kerak: hisoblash va natija.",
      'Нужны две части: вычисление и результат.',
      'Two parts are needed: the working and the result.') },
  ],
  wrongText: L(
    "65 gradusli burchak nechta? Yig'indini 180 dan ayiring.",
    'Сколько углов по 65 градусов? Вычти их сумму из 180.',
    'How many 65-degree angles are there? Subtract their sum from 180.'),
};

export default function D44_06(props) { return <BuildLine data={DATA} {...props} />; }
