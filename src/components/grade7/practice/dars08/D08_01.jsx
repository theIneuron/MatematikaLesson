// Dars08 · Amaliyot 01 — Qaysi tenglama chiziqli · 🟢 · tag: is_linear
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
//
// Chiziqli tenglamada noma'lum FAQAT birinchi darajada va bo'luvchida
// bo'lmaydi:
//   3x − 5 = 7   chiziqli
//   x · x = 9    noma'lum o'zi bilan ko'paytirilgan -- chiziqli emas
//   6 : x = 2    noma'lum bo'luvchida -- chiziqli emas
// Bu darsning birinchi savoli: tenglamani YECHISHDAN oldin uning TURINI
// aniqlash kerak.
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'is_linear', level: '🟢',
  eyebrow: L('Chiziqli tenglama', 'Линейное уравнение', 'A linear equation'),
  setup: L(
    "Chiziqli tenglamada noma'lum faqat birinchi darajada uchraydi: u o'zi bilan ko'paytirilmaydi va bo'luvchida turmaydi.",
    'В линейном уравнении неизвестное встречается только в первой степени: оно не умножается само на себя и не стоит в делителе.',
    'In a linear equation the unknown appears only to the first power: it is not multiplied by itself and it is not the divisor.'),
  ask: L('Qaysi tenglama chiziqli?', 'Какое уравнение линейное?', 'Which equation is linear?'),
  opts: [
    { label: ['3x', '−', '5', '=', '7'] },
    { label: ['x', '·', 'x', '=', '9'] },
    { label: ['6', ':', 'x', '=', '2'] },
  ],
  correct: 0,
  correctText: L(
    "To'g'ri. 3x − 5 = 7 da noma'lum bir marta va birinchi darajada: uni ko'paytiruvchiga bo'lib yechish mumkin.",
    'Верно. В 3x − 5 = 7 неизвестное один раз и в первой степени: такое уравнение решается делением на коэффициент.',
    'Correct. In 3x − 5 = 7 the unknown appears once and to the first power: such an equation is solved by dividing by the coefficient.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "x · x da noma'lum o'zi bilan ko'paytirilgan, ya'ni ikkinchi daraja. Bunday tenglama chiziqli emas.",
      'В x · x неизвестное умножено само на себя, это вторая степень. Такое уравнение не линейное.',
      'In x · x the unknown is multiplied by itself, that is the second power. Such an equation is not linear.') },
    { when: (s) => s.picked === 2, text: L(
      "6 : x da noma'lum BO'LUVCHIDA turadi. Bunday tenglama ham chiziqli emas.",
      'В 6 : x неизвестное стоит В ДЕЛИТЕЛЕ. Такое уравнение тоже не линейное.',
      'In 6 : x the unknown is the DIVISOR. That equation is not linear either.') },
  ],
  wrongText: L(
    "Noma'lum qanday qatnashganiga qarang: u ko'paytiruvchi bo'lishi kerak, bo'luvchi emas, va o'zi bilan ko'paytirilmasligi kerak.",
    'Смотри, как участвует неизвестное: оно должно быть множителем, а не делителем, и не умножаться само на себя.',
    'Look at how the unknown takes part: it must be a factor, not a divisor, and must not multiply itself.'),
};

export default function D08_01(props) { return <Choice data={DATA} {...props} />; }
