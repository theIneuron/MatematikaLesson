// Dars48 · Amaliyot 01 — Tashqi burchak va yig'indi · 🟢 · choice · tag: rev_ext_sum
// Mexanika: kit.jsx -> Choice. Raskladka: 1-o'rin `choice`.
// TAKRORLASH: ikki fakt bir masalada -- tashqi burchak va burchaklar yig'indisi. Tashqi 120° -> qolgan ikki ichki burchak yig'indisi 120°.
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'rev_ext_sum',
  level: '🟢',
  eyebrow: L(
    'Ikki fakt birga',
    'Два факта вместе',
    'Two facts at once'),
  setup: L(
    "Tashqi burchak ichki burchakning qo'shnisi, va u qolgan ikki ichki burchakning yig'indisiga teng. Shu ikki fakt bitta savolga javob beradi.",
    'Внешний угол смежен с внутренним и равен сумме двух остальных внутренних. Эти два факта отвечают на один вопрос.',
    'The exterior angle is adjacent to an interior one and equals the sum of the other two. Both facts answer one question.'),
  given: [['tashqi burchak = 120°']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  ask: L(
    "Qolgan ikki ichki burchakning yig'indisi qancha?",
    'Чему равна сумма двух остальных внутренних углов?',
    'What do the other two interior angles add to?'),
  opts: [{ label: '120°' }, { label: '60°' }, { label: '180°' }, { label: '240°' }],
  correct: 0,
  optCols: 2,
  correctText: L(
    "To'g'ri. Tashqi burchak qolgan ikki ichki burchakning yig'indisiga teng, ya'ni 120 gradus.",
    'Верно. Внешний угол равен сумме двух остальных внутренних, значит 120 градусов.',
    'Correct. The exterior angle equals the sum of the other two interior angles: 120 degrees.'),
  wrongs: [
    {
      when: (s) => s.picked === 1,
      text: L(
        "60° bu tashqi burchakning qo'shnisi, ya'ni uchinchi ICHKI burchak. Savol ikkitasining yig'indisi haqida.",
        '60° это смежный с внешним, то есть третий ВНУТРЕННИЙ угол. Спрашивают сумму двух других.',
        '60° is adjacent to the exterior, i.e. the third INTERIOR angle. The question asks for the other two.'),
    },
    {
      when: (s) => s.picked === 2,
      text: L(
        "180° -- uchta ichki burchakning yig'indisi. Bizga ikkitasi kerak.",
        '180° это сумма трёх внутренних углов. А нам нужны два.',
        '180° is the sum of all three interior angles. We need two of them.'),
    },
    {
      when: (s) => s.picked === 3,
      text: L(
        "240° bu 120 · 2. Tashqi burchak yig'indini KO'PAYTIRMAYDI, unga teng.",
        '240° это 120 · 2. Внешний угол не удваивает сумму, он ей равен.',
        '240° is 120 · 2. The exterior angle does not double the sum, it equals it.'),
    },
  ],
  wrongText: L(
    'Uchinchi ichki burchak 180 − 120 = 60. Qolgan ikkisi esa 180 − 60 ga teng.',
    'Третий внутренний угол 180 − 120 = 60. А два остальных дают 180 − 60.',
    'The third interior angle is 180 − 120 = 60, so the other two give 180 − 60.'),
};

export default function D48_01(props) { return <Choice data={DATA} {...props} />; }
