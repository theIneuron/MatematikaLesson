// Dars25 · Amaliyot 02 — O'rta had · 🟢 · choice · tag: sq_middle
// Mexanika: kit.jsx -> Choice. Raskladka: 2-o'rin (isinish).
// (m + 6)² ning o'rta hadi 2 · m · 6 = 12m. Xato: 6m (ikki karrani
// hisobga olmagan), 36m (kvadratni harfga yopishtirgan).
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'sq_middle', level: '🟢', optCols: 3,
  eyebrow: L("O'rta had", 'Средний член', 'The middle term'),
  setup: L(
    "Kvadratning o'rta hadi ikki karra ko'paytma bo'ladi, chunki ikki qavsdagi hadlar bir-biriga IKKI marta uchraydi.",
    'Средний член квадрата это двойное произведение, потому что члены двух скобок встречаются ДВАЖДЫ.',
    'The middle term is twice the product, because the terms of the two brackets meet TWICE.'),
  expr: ['(m', '+', '6)²'], exprSize: 34,
  ask: L("O'rta had qanday bo'ladi?", 'Каким будет средний член?', 'What is the middle term?'),
  opts: [{ label: ['12m'] }, { label: ['6m'] }, { label: ['36m'] }],
  correct: 0,
  correctText: L(
    "To'g'ri. 2 · m · 6 = 12m. To'liq javob m² + 12m + 36.",
    'Верно. 2 · m · 6 = 12m. Полный ответ m² + 12m + 36.',
    'Correct. 2 · m · 6 = 12m. The full answer is m² + 12m + 36.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "6m da ikki karra yo'q: (m + 6)(m + 6) da m · 6 va 6 · m -- ikkita bir xil had, ya'ni 12m.",
      'В 6m нет двойки: в (m + 6)(m + 6) есть m · 6 и 6 · m — два одинаковых члена, то есть 12m.',
      '6m misses the doubling: (m + 6)(m + 6) gives m · 6 and 6 · m — two alike terms, so 12m.') },
    { when: (s) => s.picked === 2, text: L(
      "36 bu 6², ya'ni OXIRGI had. O'rta had esa 2 · m · 6.",
      '36 это 6², то есть ПОСЛЕДНИЙ член. А средний это 2 · m · 6.',
      '36 is 6², the LAST term. The middle one is 2 · m · 6.') },
  ],
  wrongText: L(
    "Ikki qavsni yozib chiqing: m 6 ga necha marta ko'paytiriladi?",
    'Распиши две скобки: сколько раз m умножается на 6?',
    'Write the two brackets out: how many times does m meet 6?'),
};

export default function D25_02(props) { return <Choice data={DATA} {...props} />; }
