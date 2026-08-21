// Dars23 · Amaliyot 06 — Minusli guruh · 🟡 · build · tag: group_minus
// Mexanika: kit.jsx -> BuildLine. Raskladka: 6-o'rin.
// mn − 3m + 4n − 12 = m(n − 3) + 4(n − 3) = (n − 3)(m + 4).
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'group_minus', level: '🟡',
  eyebrow: L('Minusli guruh', 'Группа с минусом', 'A group with a minus'),
  setup: L(
    "Birinchi guruhda m umumiy: m(n − 3). Ikkinchi guruhda 4 umumiy: 4(n − 3). Ikki qavs bir xil chiqdi.",
    'В первой группе общий m: m(n − 3). Во второй общий 4: 4(n − 3). Скобки вышли одинаковыми.',
    'The first group shares m: m(n − 3). The second shares 4: 4(n − 3). Both brackets match.'),
  expr: ['mn', '−', '3m', '+', '4n', '−', '12'], exprSize: 28,
  cards: [
    { id: 'a', label: '(n − 3)' },
    { id: 'b', label: '(m + 4)' },
    { id: 'c', label: '(n + 3)' },
    { id: 'd', label: '(m − 4)' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Ikki ko'paytuvchini qo'ying", 'Поставь два множителя', 'Place the two factors'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Tekshirish: (n − 3)(m + 4) = mn + 4n − 3m − 12, ya'ni asl yozuv.",
    'Верно. Проверка: (n − 3)(m + 4) = mn + 4n − 3m − 12, это исходная запись.',
    'Correct. Check: (n − 3)(m + 4) = mn + 4n − 3m − 12, the original record.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "Birinchi guruhda −3m turibdi, ya'ni m ni chiqarsak qavsda (n − 3) qoladi, minus bilan.",
      'В первой группе стоит −3m, значит при выносе m в скобке остаётся (n − 3), с минусом.',
      'The first group has −3m, so taking out m leaves (n − 3) with a minus.') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "Qavs oldidagi hadlar m va +4: 4n − 12 dan 4 chiqadi, minus emas.",
      'Перед скобками стоят m и +4: из 4n − 12 выносится 4, а не минус.',
      'The front terms are m and +4: 4n − 12 gives 4, not a minus.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Javob ikki qavsdan iborat.",
      'Ответ состоит из двух скобок.',
      'The answer has two brackets.') },
  ],
  wrongText: L(
    "Ikki guruhga bo'ling: mn − 3m va 4n − 12. Har biridan umumiy ko'paytuvchini chiqaring.",
    'Раздели на две группы: mn − 3m и 4n − 12. Из каждой вынеси общий множитель.',
    'Split into two groups: mn − 3m and 4n − 12. Take the common factor out of each.'),
};

export default function D23_06(props) { return <BuildLine data={DATA} {...props} />; }
