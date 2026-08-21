// Dars33 · Amaliyot 06 — Abssissa bo'yicha tartib · 🟡 · order · tag: point_order
// Mexanika: kit.jsx -> BuildLine (tartib muhim). Raskladka: 6-o'rin.
// Abssissa o'sish tartibida: (−3; 1), (0; 4), (2; −5).
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'point_order', level: '🟡',
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Nuqtalarni abssissa o'sishi bo'yicha joylashtirish kerak, ya'ni chapdan o'ngga. Ordinata bu tartibga ta'sir qilmaydi.",
    'Точки надо расставить по возрастанию абсциссы, то есть слева направо. Ордината на этот порядок не влияет.',
    'Order the points by increasing abscissa, that is left to right. The ordinate does not matter here.'),
  cards: [
    { id: 'a', label: '(−3; 1)' },
    { id: 'b', label: '(0; 4)' },
    { id: 'c', label: '(2; −5)' },
  ],
  answerSeq: ['a', 'b', 'c'],
  useAll: true,
  empty: L("Chapdan o'ngga joylashtiring", 'Расставь слева направо', 'Place them left to right'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Nuqtalar', 'Точки', 'Points'),
  correctText: L(
    "To'g'ri. −3 < 0 < 2, ya'ni (−3; 1) eng chapda, (2; −5) eng o'ngda. Ordinata −5 bo'lsa ham u eng o'ngda turadi.",
    'Верно. −3 < 0 < 2, значит (−3; 1) левее всех, а (2; −5) правее. Даже с ординатой −5 она стоит справа.',
    'Correct. −3 < 0 < 2, so (−3; 1) is leftmost and (2; −5) rightmost, even with ordinate −5.'),
  wrongs: [
    { when: (s) => s.seq[0] === 'c', text: L(
      "(2; −5) eng chapda emas: uning abssissasi eng katta. Ordinatasi kichik bo'lsa ham u o'ngda turadi.",
      '(2; −5) не левее всех: её абсцисса наибольшая. Малая ордината не сдвигает точку влево.',
      '(2; −5) is not leftmost: its abscissa is the largest. A small ordinate does not move it left.') },
    { when: (s) => s.seq.length === 3, text: L(
      "Tartibni tekshiring: faqat birinchi sonlarni solishtirish kerak.",
      'Проверь порядок: сравнивать надо только первые числа.',
      'Check the order: compare only the first numbers.') },
    { when: (s) => s.seq.length < 3, text: L(
      "Uchta nuqtani ham qo'yish kerak.",
      'Надо поставить все три точки.',
      'All three points must be placed.') },
  ],
  wrongText: L(
    "Faqat birinchi sonlarga qarang: −3, 0 va 2 dan qaysi biri kichik?",
    'Смотри только на первые числа: какое из −3, 0 и 2 меньше?',
    'Look only at the first numbers: which of −3, 0 and 2 is smallest?'),
};

export default function D33_06(props) { return <BuildLine data={DATA} {...props} />; }
