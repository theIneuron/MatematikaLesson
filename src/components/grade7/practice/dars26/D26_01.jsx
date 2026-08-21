// Dars26 · Amaliyot 01 — Kvadratlar ayirmasi · 🟢 · choice · tag: diff_sq_choice
// Mexanika: kit.jsx -> Choice. Raskladka: 26-dars, 1-o'rin (isinish).
// (n − 9)(n + 9) = n² − 81. O'rta hadlar bir-birini yo'qotadi: −9n + 9n = 0.
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'diff_sq_choice', level: '🟢', optCols: 3,
  eyebrow: L('Kvadratlar ayirmasi', 'Разность квадратов', 'Difference of squares'),
  setup: L(
    "Bir xil hadlar, lekin ishoralari qarama-qarshi. To'rt ko'paytmadan o'rtadagi ikkitasi bir-birini yo'qotadi.",
    'Одинаковые члены, но с противоположными знаками. Из четырёх произведений два средних уничтожают друг друга.',
    'The same terms with opposite signs. Of the four products the two middle ones cancel.'),
  expr: ['(n', '−', '9)', '(n', '+', '9)'], exprSize: 30,
  ask: L("Ko'paytma qanday yoziladi?", 'Как записывается произведение?', 'How is the product written?'),
  opts: [{ label: ['n²', '−', '81'] }, { label: ['n²', '+', '81'] }, { label: ['n²', '−', '18n', '−', '81'] }],
  correct: 0,
  correctText: L(
    "To'g'ri. +9n − 9n = 0, ya'ni o'rta had yo'qoladi. Qoladi n² − 81.",
    'Верно. +9n − 9n = 0, средний член исчезает. Остаётся n² − 81.',
    'Correct. +9n − 9n = 0, so the middle term vanishes. What remains is n² − 81.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Ozod had (−9) · (+9) = −81, ya'ni manfiy. Bir minus bor.",
      'Свободный член (−9) · (+9) = −81, то есть отрицательный. Минус один.',
      'The free term is (−9) · (+9) = −81, negative. There is one minus.') },
    { when: (s) => s.picked === 2, text: L(
      "O'rta had qolmaydi: +9n va −9n qo'shilib nol beradi.",
      'Средний член не остаётся: +9n и −9n в сумме дают нуль.',
      'No middle term remains: +9n and −9n add to zero.') },
  ],
  wrongText: L(
    "To'rt ko'paytmani yozing: n·n, n·9, −9·n, −9·9. O'rtadagi ikkitasi bilan nima bo'ladi?",
    'Запиши четыре произведения: n·n, n·9, −9·n, −9·9. Что происходит с двумя средними?',
    'Write the four products: n·n, n·9, −9·n, −9·9. What happens to the middle two?'),
};

export default function D26_01(props) { return <Choice data={DATA} {...props} />; }
