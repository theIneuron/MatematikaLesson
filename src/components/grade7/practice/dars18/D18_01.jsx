// Dars18 · Amaliyot 01 — Hadlar soni · 🟢 · choice · tag: poly_kind
// Faqat MA'LUMOT. Mexanika: kit.jsx -> Choice. Raskladka: 18-dars, 1-o'rin.
//
// 5x² − 8x + 3 -- uch had. Ishora HADNING o'zi bilan ketadi: «−8x» bitta had,
// minus alohida had emas. Shuning uchun xato variant «to'rt had».
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'poly_kind', level: '🟢', optCols: 3,
  eyebrow: L("Ko'phadning turi", 'Вид многочлена', 'Kind of polynomial'),
  setup: L(
    "Ko'phad bir hadlarning yig'indisi. Turi standart shakldagi hadlar soniga qarab aytiladi, ishora esa hadning o'zi bilan ketadi.",
    'Многочлен — сумма одночленов. Вид называют по числу членов в стандартной форме, а знак идёт вместе со своим членом.',
    'A polynomial is a sum of monomials. Its kind is named by the number of terms in standard form, and each sign belongs to its term.'),
  expr: ['5x²', '−', '8x', '+', '3'], exprSize: 32,
  ask: L('Bu qanday ko\'phad?', 'Какой это многочлен?', 'What kind of polynomial is this?'),
  opts: [
    { label: L('Uch had', 'Трёхчлен', 'Trinomial') },
    { label: L("To'rt had", 'Четыре члена', 'Four terms') },
    { label: L('Ikki had', 'Двучлен', 'Binomial') },
  ],
  correct: 0,
  correctText: L(
    "To'g'ri. Uch had: 5x², −8x va 3. Minus ikkinchi hadning ishorasi, alohida had emas.",
    'Верно. Три члена: 5x², −8x и 3. Минус это знак второго члена, а не отдельный член.',
    'Correct. Three terms: 5x², −8x and 3. The minus is the sign of the second term, not a term of its own.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Minus alohida hisoblangan. Ishora hadning bir qismi: −8x bitta had, ya'ni hammasi uchta.",
      'Минус посчитали отдельно. Знак это часть члена: −8x один член, значит всего их три.',
      'The minus was counted separately. A sign is part of its term: −8x is one term, so there are three.') },
    { when: (s) => s.picked === 2, text: L(
      "Ikki emas: 5x², −8x va 3 -- uchta had. Ozod had 3 ham hisobga olinadi.",
      'Не два: 5x², −8x и 3 — три члена. Свободный член 3 тоже считается.',
      'Not two: 5x², −8x and 3 make three terms. The free term 3 counts too.') },
  ],
  wrongText: L(
    "Hadlarni ishorasi bilan birga sanang: har ishora o'z hadiga tegishli.",
    'Считай члены вместе со знаками: каждый знак относится к своему члену.',
    'Count the terms together with their signs: each sign belongs to its term.'),
};

export default function D18_01(props) { return <Choice data={DATA} {...props} />; }
