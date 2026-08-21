// Dars44 · Amaliyot 02 — Tenglikni yozish · 🟢 · bracket · tag: iso_bracket
// Mexanika: kit.jsx -> BuildLine (qavs kartalari). Raskladka: 2-o'rin.
// Asosi AC bo'lgan teng yonli uchburchakda: ∠A = ∠C.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'iso_bracket', level: '🟢',
  eyebrow: L('Tenglikni yozish', 'Записать равенство', 'Write the equality'),
  setup: L(
    "Asosi AC bo'lsa, asosdagi burchaklar ∠A va ∠C bo'ladi. Uchidagi burchak ∠B ular bilan teng emas.",
    'Если основание AC, то углы при основании это ∠A и ∠C. Угол при вершине ∠B им не равен.',
    'With base AC the base angles are ∠A and ∠C. The apex angle ∠B is not among them.'),
  given: [['asos', '=', 'AC']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  cards: [
    { id: 'a', label: '∠A' },
    { id: 'b', label: '= ∠C' },
    { id: 'c', label: '= ∠B' },
    { id: 'd', label: '∠B' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Tenglikni tuzing", 'Составь равенство', 'Build the equality'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. ∠A = ∠C: ikkovi ham asosda yotadi.",
    'Верно. ∠A = ∠C: оба лежат при основании.',
    'Correct. ∠A = ∠C: both sit at the base.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1 || s.seq.indexOf('d') !== -1, text: L(
      "∠B uchidagi burchak: u asos burchaklariga teng bo'lishi shart emas.",
      '∠B это угол при вершине: он не обязан быть равен углам при основании.',
      '∠B is the apex angle: it need not equal the base angles.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Tenglik ikki bo'lakdan iborat.",
      'Равенство состоит из двух частей.',
      'The equality has two parts.') },
  ],
  wrongText: L(
    "Asos AC bo'lsa, qaysi ikki burchak asosda yotadi?",
    'Если основание AC, какие два угла лежат при основании?',
    'With base AC, which two angles sit at the base?'),
};

export default function D44_02(props) { return <BuildLine data={DATA} {...props} />; }
