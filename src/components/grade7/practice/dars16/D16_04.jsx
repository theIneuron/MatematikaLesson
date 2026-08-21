// Dars16 · Amaliyot 04 — Ikki harf birga · 🟡 · tag: mul_two_letters
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
//
// 5c²d · 40cd³ = 200c³d⁴. Har harf ALOHIDA sanaladi:
//   c: 2 + 1 = 3     d: 1 + 3 = 4     son: 5 · 40 = 200
// Xato variantlar: 200c²d³ (ko'rsatkichlarni qo'shmagan, birinchisini
// ko'chirgan), 45c³d⁴ (sonlarni qo'shgan).
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'mul_two_letters', level: '🟡', optCols: 3,
  eyebrow: L('Ikki harf', 'Две буквы', 'Two letters'),
  setup: L(
    "Harf ikkita bo'lsa, qoida o'zgarmaydi: har harfning ko'rsatkichi o'zi bilan qo'shiladi. Yozilmagan ko'rsatkich bir deb olinadi.",
    'Если букв две, правило не меняется: показатель каждой буквы складывается со своим. Ненаписанный показатель считается единицей.',
    'With two letters the rule is the same: each letter adds its own exponents. A missing exponent counts as one.'),
  expr: ['5c²d', '·', '40cd³'], exprSize: 32,
  ask: L("Ko'paytma qanday yoziladi?", 'Как записывается произведение?', 'How is the product written?'),
  opts: [{ label: ['200c³d⁴'] }, { label: ['200c²d³'] }, { label: ['45c³d⁴'] }],
  correct: 0,
  correctText: L(
    "To'g'ri. Son: 5 · 40 = 200. c: 2 + 1 = 3. d: 1 + 3 = 4. Javob 200c³d⁴.",
    'Верно. Число: 5 · 40 = 200. c: 2 + 1 = 3. d: 1 + 3 = 4. Ответ 200c³d⁴.',
    'Correct. Number: 5 · 40 = 200. c: 2 + 1 = 3. d: 1 + 3 = 4. The answer is 200c³d⁴.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Ko'rsatkichlar birinchi haddan ko'chirilgan. Ikkinchi hadda ham c va d bor: c ga bir, d ga uch qo'shiladi.",
      'Показатели просто списаны с первого одночлена. Во втором тоже есть c и d: к c прибавляется один, к d три.',
      'The exponents were copied from the first monomial. The second has c and d too: one is added to c, three to d.') },
    { when: (s) => s.picked === 2, text: L(
      "Harflar to'g'ri, lekin sonlar qo'shilgan: 5 + 40 = 45. Sonlar ko'paytiriladi: 5 · 40 = 200.",
      'Буквы верные, но числа сложили: 5 + 40 = 45. Числа перемножаются: 5 · 40 = 200.',
      'The letters are right, but the numbers were added: 5 + 40 = 45. Numbers are multiplied: 5 · 40 = 200.') },
  ],
  wrongText: L(
    "Uch narsani alohida hisoblang: sonni, c ning ko'rsatkichini, d ning ko'rsatkichini.",
    'Посчитай три вещи по отдельности: число, показатель c, показатель d.',
    'Work out three things separately: the number, the exponent of c, the exponent of d.'),
};

export default function D16_04(props) { return <Choice data={DATA} {...props} />; }
