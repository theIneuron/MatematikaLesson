// Dars34 · Amaliyot 08 — Hisoblash qadamlari · 🔴 · order · tag: fn_order
// Mexanika: kit.jsx -> BuildLine (tartib muhim). Raskladka: 8-o'rin.
// f(x) = 3x² + 1, f(−2): 3 · (−2)² + 1 -> 3 · 4 + 1 -> 13.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'fn_order', level: '🔴',
  eyebrow: L('Qadamlar tartibi', 'Порядок шагов', 'Order of steps'),
  setup: L(
    "Uch qadam: qo'yish, darajani hisoblash, qolgan amallar. Tartibni buzsa javob boshqa chiqadi.",
    'Три шага: подстановка, вычисление степени, остальные действия. При нарушении порядка ответ другой.',
    'Three steps: substitute, work out the power, then the rest. Breaking the order changes the answer.'),
  given: [['f(x)', '=', '3x²', '+', '1']],
  givenLabel: L('Formula:', 'Формула:', 'The rule:'),
  cards: [
    { id: 'a', label: '3 · (−2)² + 1' },
    { id: 'b', label: '3 · 4 + 1' },
    { id: 'c', label: '13' },
    { id: 'd', label: '3 · (−4) + 1' },
    { id: 'e', label: '−11' },
  ],
  answerSeq: ['a', 'b', 'c'],
  empty: L("Uch qadamni tartib bilan qo'ying", 'Поставь три шага по порядку', 'Place the three steps in order'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. (−2)² = 4, keyin 3 · 4 = 12 va 12 + 1 = 13.",
    'Верно. (−2)² = 4, потом 3 · 4 = 12 и 12 + 1 = 13.',
    'Correct. (−2)² = 4, then 3 · 4 = 12 and 12 + 1 = 13.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('d') !== -1 || s.seq.indexOf('e') !== -1, text: L(
      "(−2)² musbat: 4, manfiy emas. Juft daraja ishorani yo'qotadi.",
      '(−2)² положительно: 4, а не −4. Чётная степень убирает знак.',
      '(−2)² is positive: 4, not −4. An even power removes the sign.') },
    { when: (s) => s.seq.length === 3, text: L(
      "Qadamlar to'g'ri, tartibi boshqa: qo'yish, daraja, keyin qolgan amallar.",
      'Шаги верные, но порядок другой: подстановка, степень, потом остальное.',
      'The steps are right but the order is not: substitute, power, then the rest.') },
    { when: (s) => s.seq.length < 3, text: L(
      "Uch qadam bo'lishi kerak.",
      'Должно быть три шага.',
      'There must be three steps.') },
  ],
  wrongText: L(
    "Avval darajani hisoblang: (−2)² nechchi? Keyin ko'paytirish va qo'shish.",
    'Сначала посчитай степень: чему равно (−2)²? Потом умножение и сложение.',
    'Work out the power first: what is (−2)²? Then multiply and add.'),
};

export default function D34_08(props) { return <BuildLine data={DATA} {...props} />; }
