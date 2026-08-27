// Dars29 · Amaliyot 06 — Ikki qadam · 🟡 · chain · tag: fact_chain
// Mexanika: kit.jsx -> SlotsBank (ikki qator). Raskladka: 6-o'rin.
// 1-qator: 2x² + 12x + 18 = 2(x² + 6x + 9)
// 2-qator: qavs ichi to'liq kvadrat -> 2(x + 3)²
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'fact_chain', level: '🟡',
  eyebrow: L('Ikki qadam', 'Два шага', 'Two steps'),
  setup: L(
    "Avval umumiy ko'paytuvchi 2 chiqariladi, keyin qavs ichi to'liq kvadrat bo'lib chiqadi.",
    'Сначала выносится общий множитель 2, потом внутри скобки оказывается полный квадрат.',
    'First the common factor 2 comes out, then the bracket turns out to be a perfect square.'),
  rows: [
    [{ t: ['2x²', '+', '12x', '+', '18', '='] }, { slot: 0 }, { slot: 1 }],
    [{ t: ['='] }, { slot: 2 }, { slot: 3 }],
  ],
  cards: ['2', '(x² + 6x + 9)', '2', '(x + 3)²', '2x', '(x + 9)²'],
  answer: ['2', '(x² + 6x + 9)', '2', '(x + 3)²'],
  ask: L("Kartani bosing, keyin bo'sh katakni bosing.", 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 2 chiqarildi, qavs ichida x² + 6x + 9 qoldi. Bu to'liq kvadrat: 9 = 3² va 2 · x · 3 = 6x.",
    'Верно. Вынесли 2, в скобке осталось x² + 6x + 9. Это полный квадрат: 9 = 3² и 2 · x · 3 = 6x.',
    'Correct. The 2 came out and x² + 6x + 9 stayed. That is a perfect square: 9 = 3² and 2 · x · 3 = 6x.'),
  wrongs: [
    { when: (s) => s.slots[0] === '2x' || s.slots[2] === '2x', text: L(
      "2x ni chiqarib bo'lmaydi: 18 da x yo'q. Umumiy ko'paytuvchi 2.",
      '2x вынести нельзя: в 18 нет x. Общий множитель это 2.',
      '2x cannot come out: 18 has no x. The common factor is 2.') },
    { when: (s) => s.slots[3] === '(x + 9)²', text: L(
      "(x + 9)² da oxirgi had 81 bo'lardi. Qavsda 9 turibdi, ya'ni asos 3.",
      'В (x + 9)² последний член был бы 81. В скобке 9, значит основание 3.',
      'In (x + 9)² the last term would be 81. The bracket holds 9, so the base is 3.') },
  ],
  wrongText: L(
    "Uch hadda nima umumiy? Qavs ichidagi uch had to'liq kvadratmi?",
    'Что общего у трёх членов? Является ли выражение в скобке полным квадратом?',
    'What do the three terms share? Is the bracket a perfect square?'),
};

export default function D29_06(props) { return <SlotsBank data={DATA} {...props} />; }
