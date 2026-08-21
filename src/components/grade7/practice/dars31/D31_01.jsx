// Dars31 · Amaliyot 01 — Kublar yig'indisi · 🟢 · bracket · tag: cube_sum
// Mexanika: kit.jsx -> BuildLine (qavs kartalari). Raskladka: 31-dars, 1-o'rin.
// x³ + 27 = (x + 3)(x² − 3x + 9). Ikkinchi qavs -- TO'LIQSIZ kvadrat:
// o'rta hadda ikki karra YO'Q va ishorasi birinchi qavsga teskari.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'cube_sum', level: '🟢',
  eyebrow: L("Kublar yig'indisi", 'Сумма кубов', 'Sum of cubes'),
  setup: L(
    "Kublar yig'indisi ikki ko'paytuvchiga ajraladi: yig'indi va to'liqsiz kvadrat. To'liqsizda o'rta hadning ishorasi qavsdagiga teskari.",
    'Сумма кубов раскладывается на два множителя: сумму и неполный квадрат. В неполном знак среднего члена противоположен скобке.',
    'A sum of cubes splits into two factors: the sum and an incomplete square whose middle sign is opposite.'),
  expr: ['x³', '+', '27'], exprSize: 34,
  cards: [
    { id: 'a', label: '(x + 3)' },
    { id: 'b', label: '(x² − 3x + 9)' },
    { id: 'c', label: '(x − 3)' },
    { id: 'd', label: '(x² + 3x + 9)' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Ikki ko'paytuvchini qo'ying", 'Поставь два множителя', 'Place the two factors'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 27 = 3³, ya'ni (x + 3)(x² − 3x + 9). Birinchi qavsda plyus, to'liqsiz kvadratda esa minus.",
    'Верно. 27 = 3³, значит (x + 3)(x² − 3x + 9). В первой скобке плюс, а в неполном квадрате минус.',
    'Correct. 27 = 3³, so (x + 3)(x² − 3x + 9). The first bracket has a plus, the incomplete square a minus.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "Birinchi qavs yig'indi bo'lishi kerak: bizda x³ + 27, ya'ni (x + 3).",
      'Первая скобка должна быть суммой: у нас x³ + 27, значит (x + 3).',
      'The first bracket must be a sum: we have x³ + 27, so (x + 3).') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "To'liqsiz kvadratda o'rta had ishorasi TESKARI bo'ladi: yig'indi uchun −3x.",
      'В неполном квадрате знак среднего члена ПРОТИВОПОЛОЖНЫЙ: для суммы это −3x.',
      'In the incomplete square the middle sign is OPPOSITE: for a sum it is −3x.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Javob ikki qavsdan iborat: yig'indi va to'liqsiz kvadrat.",
      'Ответ состоит из двух скобок: сумма и неполный квадрат.',
      'The answer has two brackets: the sum and the incomplete square.') },
  ],
  wrongText: L(
    "27 nimaning kubi? To'liqsiz kvadratda o'rta hadning ishorasi qanday bo'ladi?",
    'Куб чего такое 27? Какой знак у среднего члена в неполном квадрате?',
    '27 is the cube of what? Which sign does the middle term of the incomplete square take?'),
};

export default function D31_01(props) { return <BuildLine data={DATA} {...props} />; }
