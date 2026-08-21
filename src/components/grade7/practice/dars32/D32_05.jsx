// Dars32 · Amaliyot 05 — Uch qadam · 🟡 · order · tag: frac_order
// Mexanika: kit.jsx -> BuildLine (tartib muhim). Raskladka: 5-o'rin.
// (a² − 9) : (a + 3) = (a − 3)(a + 3) : (a + 3) = a − 3.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'frac_order', level: '🟡',
  eyebrow: L('Uch qadam', 'Три шага', 'Three steps'),
  setup: L(
    "Bo'linuvchi ko'paytuvchilarga ajratiladi, keyin bir xil ko'paytuvchi qisqaradi. Uch qadamni tartib bilan qo'ying.",
    'Делимое разлагается на множители, потом одинаковый множитель сокращается. Расставь три шага по порядку.',
    'The dividend is factorised, then the matching factor cancels. Place the three steps in order.'),
  expr: ['(a²', '−', '9)', ':', '(a', '+', '3)'], exprSize: 26,
  cards: [
    { id: 'a', label: '(a − 3)(a + 3) : (a + 3)' },
    { id: 'b', label: 'a − 3' },
    { id: 'c', label: '(a − 3)² : (a + 3)' },
    { id: 'd', label: 'a + 3' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Qadamlarni tartib bilan qo'ying", 'Поставь шаги по порядку', 'Place the steps in order'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. a² − 9 = (a − 3)(a + 3), keyin (a + 3) qisqaradi va a − 3 qoladi.",
    'Верно. a² − 9 = (a − 3)(a + 3), потом (a + 3) сокращается и остаётся a − 3.',
    'Correct. a² − 9 = (a − 3)(a + 3), then (a + 3) cancels and a − 3 remains.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "(a − 3)² noto'g'ri: a² − 9 kvadratlar ayirmasi, ya'ni (a − 3)(a + 3).",
      '(a − 3)² неверно: a² − 9 это разность квадратов, значит (a − 3)(a + 3).',
      '(a − 3)² is wrong: a² − 9 is a difference of squares, so (a − 3)(a + 3).') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "Qisqargandan keyin (a − 3) qoladi: (a + 3) esa bo'luvchi bilan birga ketdi.",
      'После сокращения остаётся (a − 3): скобка (a + 3) ушла вместе с делителем.',
      'After cancelling (a − 3) remains: the (a + 3) left with the divisor.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Ikki qadam kerak: ajratish va qisqartirish.",
      'Нужны два шага: разложение и сокращение.',
      'Two steps are needed: factorising and cancelling.') },
  ],
  wrongText: L(
    "a² − 9 qanday ajraladi? Qaysi ko'paytuvchi bo'luvchi bilan bir xil?",
    'Как разлагается a² − 9? Какой множитель совпадает с делителем?',
    'How does a² − 9 split? Which factor matches the divisor?'),
};

export default function D32_05(props) { return <BuildLine data={DATA} {...props} />; }
