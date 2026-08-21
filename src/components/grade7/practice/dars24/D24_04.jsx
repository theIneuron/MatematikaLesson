// Dars24 · Amaliyot 04 — Ikki bo'linma tartib bilan · 🟡 · order · tag: div_order
// Mexanika: kit.jsx -> BuildLine (tartib muhim). Raskladka: 4-o'rin.
// (28p⁵ − 21p³) : 7p² = 4p³ − 3p. Ortiqcha kartalar: 4p⁷ va −3p⁵
// (ko'rsatkichlarni qo'shgan).
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'div_order', level: '🟡',
  eyebrow: L("Ikki bo'linma", 'Два частных', 'Two quotients'),
  setup: L(
    "Har had bo'luvchiga bo'linadi va tartib saqlanadi. Ko'rsatkichlar ayirilganda daraja kamayadi, ortmaydi.",
    'Каждый член делится на делитель, порядок сохраняется. При вычитании показателей степень уменьшается, а не растёт.',
    'Each term is divided and the order is kept. Subtracting exponents lowers the power, never raises it.'),
  expr: ['(28p⁵', '−', '21p³)', ':', '7p²'], exprSize: 28,
  cards: [
    { id: 'a', label: '4p³' },
    { id: 'b', label: '−3p' },
    { id: 'c', label: '4p⁷' },
    { id: 'd', label: '−3p⁵' },
    { id: 'e', label: '+3p' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Ikki bo'linmani tartib bilan qo'ying", 'Поставь два частных по порядку', 'Place the two quotients in order'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 28 : 7 = 4 va 5 − 2 = 3, ya'ni 4p³. Keyin 21 : 7 = 3 va 3 − 2 = 1, minus bilan −3p.",
    'Верно. 28 : 7 = 4 и 5 − 2 = 3, значит 4p³. Потом 21 : 7 = 3 и 3 − 2 = 1, с минусом −3p.',
    'Correct. 28 : 7 = 4 and 5 − 2 = 3, giving 4p³. Then 21 : 7 = 3 and 3 − 2 = 1, with the minus: −3p.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1 || s.seq.indexOf('d') !== -1, text: L(
      "Ko'rsatkichlar qo'shilgan: 5 + 2 va 3 + 2. Bo'lishda ular ayiriladi, daraja kamayadi.",
      'Показатели сложили: 5 + 2 и 3 + 2. При делении они вычитаются, степень уменьшается.',
      'The exponents were added: 5 + 2 and 3 + 2. Division subtracts them and the power drops.') },
    { when: (s) => s.seq.indexOf('e') !== -1, text: L(
      "Ishora yo'qoldi: bo'linuvchida ayirma turgan, ya'ni ikkinchi bo'linma manfiy.",
      'Потерялся знак: в делимом стоит разность, значит второе частное отрицательное.',
      'The sign got lost: the dividend is a difference, so the second quotient is negative.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Javobda ikki had bo'ladi: bo'linuvchida ham ikki had turibdi.",
      'В ответе два члена: в делимом тоже два члена.',
      'The answer has two terms: the dividend has two as well.') },
  ],
  wrongText: L(
    "Har hadni 7p² ga bo'ling: sonni bo'ling, ko'rsatkichni ayiring.",
    'Раздели каждый член на 7p²: число раздели, показатель вычти.',
    'Divide each term by 7p²: divide the number, subtract the exponent.'),
};

export default function D24_04(props) { return <BuildLine data={DATA} {...props} />; }
