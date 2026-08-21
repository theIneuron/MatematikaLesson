// Dars45 · Amaliyot 01 — Ichki bir tomonli · 🟢 · order · tag: par_same_side
// Mexanika: kit.jsx -> BuildLine (tartib muhim). Raskladka: 45-dars, 1-o'rin.
// Parallel to'g'ri chiziqlarda ichki bir tomonli burchaklar yig'indisi 180°:
// biri 65° -> ikkinchisi 115°.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'par_same_side', level: '🟢',
  eyebrow: L('Ichki bir tomonli', 'Односторонние углы', 'Same-side angles'),
  setup: L(
    "Parallel to'g'ri chiziqlar kesuvchi bilan kesilganda ichki bir tomonli burchaklar yig'indisi 180 gradus bo'ladi.",
    'При пересечении параллельных прямых секущей сумма односторонних углов равна 180 градусам.',
    'When a transversal cuts parallel lines, same-side interior angles add to 180.'),
  given: [['∠1', '=', '65°']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  cards: [
    { id: 'a', label: '180° − 65°' },
    { id: 'b', label: '115°' },
    { id: 'c', label: '65°' },
    { id: 'd', label: '90° − 65°' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Hisoblab yozing", 'Запиши вычисление', 'Write the working'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 180 − 65 = 115. Ichki bir tomonli burchaklar teng emas, ular 180 ga to'ldiradi.",
    'Верно. 180 − 65 = 115. Односторонние углы не равны, они дополняют до 180.',
    'Correct. 180 − 65 = 115. Same-side angles are not equal; they complete 180.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "65° bu MOS yoki ichki almashinuvchi burchak bo'lardi. Bir tomonlilar esa 180 beradi.",
      '65° было бы для СООТВЕТСТВЕННЫХ или накрест лежащих углов. А односторонние дают 180.',
      '65° would fit corresponding or alternate angles. Same-side ones give 180.') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "90 gradus bu yerda ishlatilmaydi: bir tomonli burchaklar 180 gradusga to'ldiradi.",
      '90 градусов здесь не используется: односторонние углы дополняют до 180.',
      '90 has no role here: same-side angles complete 180.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Ikki bo'lak kerak: hisoblash va natija.",
      'Нужны две части: вычисление и результат.',
      'Two parts are needed: the working and the result.') },
  ],
  wrongText: L(
    "Ichki bir tomonli burchaklar teng bo'ladimi yoki 180 ga to'ldiradimi?",
    'Односторонние углы равны или дополняют до 180?',
    'Are same-side angles equal, or do they add to 180?'),
};

export default function D45_01(props) { return <BuildLine data={DATA} {...props} />; }
