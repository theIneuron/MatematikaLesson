// Dars31 · Amaliyot 07 — Uch qadam · 🟡 · order · tag: cube_order_steps
// Mexanika: kit.jsx -> BuildLine (tartib muhim). Raskladka: 7-o'rin.
// 64a³ − 1 = (4a)³ − 1³ = (4a − 1)(16a² + 4a + 1).
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'cube_order_steps', level: '🟡',
  eyebrow: L('Uch qadam', 'Три шага', 'Three steps'),
  setup: L(
    "Avval kublar ko'rinishida yozish, keyin formulani qo'llash. Uch qadamni tartib bilan qo'ying.",
    'Сначала записать в виде кубов, потом применить формулу. Расставь три шага по порядку.',
    'First write it as cubes, then apply the formula. Place the three steps in order.'),
  expr: ['64a³', '−', '1'], exprSize: 34,
  cards: [
    { id: 'a', label: '(4a)³ − 1³' },
    { id: 'b', label: '(4a − 1)(16a² + 4a + 1)' },
    { id: 'c', label: '(4a)³ + 1³' },
    { id: 'd', label: '(4a − 1)(16a² − 4a + 1)' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Qadamlarni tartib bilan qo'ying", 'Поставь шаги по порядку', 'Place the steps in order'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 64a³ = (4a)³ va 1 = 1³. Ayirma uchun to'liqsiz kvadratda plyus: 16a² + 4a + 1.",
    'Верно. 64a³ = (4a)³ и 1 = 1³. Для разности в неполном квадрате плюс: 16a² + 4a + 1.',
    'Correct. 64a³ = (4a)³ and 1 = 1³. For a difference the incomplete square takes a plus.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "Yozuvda ayirma turibdi: (4a)³ − 1³.",
      'В записи разность: (4a)³ − 1³.',
      'The record is a difference: (4a)³ − 1³.') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "To'liqsiz kvadratda ishora TESKARI: birinchi qavsda minus, ikkinchisida plyus.",
      'В неполном квадрате знак ПРОТИВОПОЛОЖНЫЙ: в первой скобке минус, во второй плюс.',
      'The incomplete square takes the OPPOSITE sign: minus first, plus inside.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Ikki qadam kerak: kublar ko'rinishi va ko'paytuvchilar.",
      'Нужны два шага: вид кубов и множители.',
      'Two steps are needed: the cubes form and the factors.') },
  ],
  wrongText: L(
    "64a³ nimaning kubi? Ishoralar ikki qavsda qanday joylashadi?",
    'Куб чего такое 64a³? Как расставляются знаки в двух скобках?',
    '64a³ is the cube of what? How do the signs sit in the two brackets?'),
};

export default function D31_07(props) { return <BuildLine data={DATA} {...props} />; }
