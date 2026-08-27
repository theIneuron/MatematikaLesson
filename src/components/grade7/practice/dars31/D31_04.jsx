// Dars31 · Amaliyot 04 — Koeffitsiyentli kublar · 🟡 · slots · tag: cube_coef_slots
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 4-o'rin.
// 8k³ − 125 = (2k − 5)(4k² + 10k + 25).
//   8k³ = (2k)³, 125 = 5³; to'liqsiz kvadrat: (2k)² = 4k², 2k · 5 = 10k, 5² = 25.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'cube_coef_slots', level: '🟡',
  eyebrow: L('Koeffitsiyentli kub', 'Куб с коэффициентом', 'A cube with a coefficient'),
  setup: L(
    "Asoslar 2k va 5: 8k³ = (2k)³, 125 = 5³. To'liqsiz kvadrat shu asoslardan yig'iladi.",
    'Основания 2k и 5: 8k³ = (2k)³, 125 = 5³. Неполный квадрат собирается из этих оснований.',
    'The bases are 2k and 5: 8k³ = (2k)³, 125 = 5³. The incomplete square is built from them.'),
  rows: [
    [{ t: ['8k³', '−', '125', '='] }, { slot: 0 }, { slot: 1 }],
  ],
  cards: ['(2k − 5)', '(4k² + 10k + 25)', '(2k + 5)', '(4k² − 10k + 25)'],
  answer: ['(2k − 5)', '(4k² + 10k + 25)'],
  ask: L("Kartani bosing, keyin bo'sh katakni bosing.", 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Ayirma uchun (2k − 5), to'liqsiz kvadratda esa plyus: 4k² + 10k + 25.",
    'Верно. Для разности (2k − 5), а в неполном квадрате плюс: 4k² + 10k + 25.',
    'Correct. For the difference (2k − 5), and the incomplete square takes a plus: 4k² + 10k + 25.'),
  wrongs: [
    { when: (s) => s.slots[0] === '(2k + 5)', text: L(
      "Yozuvda ayirma turibdi: 8k³ − 125, ya'ni birinchi qavs (2k − 5).",
      'В записи разность: 8k³ − 125, значит первая скобка (2k − 5).',
      'The record is a difference: 8k³ − 125, so the first bracket is (2k − 5).') },
    { when: (s) => s.slots[1] === '(4k² − 10k + 25)', text: L(
      "Ishoralar qarama-qarshi: birinchi qavsda minus bo'lsa, to'liqsiz kvadratda plyus.",
      'Знаки противоположны: если в первой скобке минус, то в неполном квадрате плюс.',
      'The signs are opposite: a minus in the first bracket means a plus in the incomplete square.') },
  ],
  wrongText: L(
    "8k³ va 125 nimaning kubi? Ikki qavsning ishoralari qarama-qarshi bo'ladi.",
    'Куб чего такое 8k³ и 125? Знаки двух скобок противоположны.',
    '8k³ and 125 are cubes of what? The two brackets take opposite signs.'),
};

export default function D31_04(props) { return <SlotsBank data={DATA} {...props} />; }
