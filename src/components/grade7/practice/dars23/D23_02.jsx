// Dars23 · Amaliyot 02 — Qaysi guruhlash ishlaydi · 🟢 · choice · tag: which_grouping
// Mexanika: kit.jsx -> Choice. Raskladka: 2-o'rin (isinish).
// xy + 4x + 3y + 12. Ishlaydigan guruhlash: (xy + 4x) + (3y + 12) ->
// x(y + 4) + 3(y + 4). Ishlamaydigan: (xy + 12) + (4x + 3y) -- birinchi
// guruhda umumiy ko'paytuvchi yo'q.
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'which_grouping', level: '🟢',
  eyebrow: L('Qaysi guruhlash', 'Какая группировка', 'Which grouping'),
  setup: L(
    "Guruhlash faqat har guruhda umumiy ko'paytuvchi bo'lsa ishlaydi. Hadlarni istalgancha juftlash mumkin, lekin natija hammasida chiqmaydi.",
    'Группировка работает только если в каждой группе есть общий множитель. Пары можно составлять по-разному, но результат выйдет не у всех.',
    'Grouping works only when each group has a common factor. Terms can be paired in many ways, but not all of them lead anywhere.'),
  expr: ['xy', '+', '4x', '+', '3y', '+', '12'], exprSize: 28,
  ask: L('Qaysi guruhlash ishlaydi?', 'Какая группировка работает?', 'Which grouping works?'),
  opts: [
    { label: ['(xy', '+', '4x)', '+', '(3y', '+', '12)'] },
    { label: ['(xy', '+', '12)', '+', '(4x', '+', '3y)'] },
    { label: ['(xy)', '+', '(4x', '+', '3y', '+', '12)'] },
  ],
  correct: 0,
  correctText: L(
    "To'g'ri. Birinchi guruhda x umumiy, ikkinchisida 3: x(y + 4) + 3(y + 4). Ikki qavs bir xil, ya'ni (y + 4)(x + 3).",
    'Верно. В первой группе общий x, во второй 3: x(y + 4) + 3(y + 4). Скобки одинаковые, значит (y + 4)(x + 3).',
    'Correct. The first group shares x, the second 3: x(y + 4) + 3(y + 4). The brackets match, giving (y + 4)(x + 3).'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "xy va 12 da umumiy ko'paytuvchi yo'q: birinchisida harflar bor, ikkinchisi esa son. Bu guruhlash ilgari surmaydi.",
      'У xy и 12 нет общего множителя: в первом буквы, второе число. Такая группировка ничего не даёт.',
      'xy and 12 share no factor: one has letters, the other is a number. That grouping leads nowhere.') },
    { when: (s) => s.picked === 2, text: L(
      "Guruhlar teng bo'lishi kerak: to'rt haddan ikkita-ikkita. Bitta had bilan uchta had guruh bermaydi.",
      'Группы должны быть равными: из четырёх членов по два. Один член против трёх группы не даёт.',
      'The groups must be even: two and two. One term against three is not a grouping.') },
  ],
  wrongText: L(
    "Har variantda birinchi guruhga qarang: unda umumiy ko'paytuvchi bormi?",
    'В каждом варианте посмотри на первую группу: есть ли в ней общий множитель?',
    'In each option look at the first group: does it have a common factor?'),
};

export default function D23_02(props) { return <Choice data={DATA} {...props} />; }
