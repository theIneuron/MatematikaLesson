// Dars13 · Amaliyot 01 — Daraja nimani bildiradi · 🟢 · tag: power_meaning
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
//
// 2⁵ -- ikkining beshinchi darajasi: 2 ni O'ZIGA besh marta ko'paytirish.
//   2 · 2 · 2 · 2 · 2 = 32
// Xato variantlar: 2 · 5 = 10 (darajani ko'paytiruvchi deb o'qigan) va
// 5 · 5 · 5 · 5 · 5 (asos va ko'rsatkichni almashtirgan).
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'power_meaning', level: '🟢',
  eyebrow: L('Daraja', 'Степень', 'A power'),
  setup: L(
    "Darajada ikki son bor: pastda ASOS, tepada KO'RSATKICH. Ko'rsatkich asos necha marta ko'paytuvchi bo'lganini aytadi.",
    'В степени два числа: внизу ОСНОВАНИЕ, сверху ПОКАЗАТЕЛЬ. Показатель говорит, сколько раз основание взято множителем.',
    'A power has two numbers: the BASE below and the EXPONENT above. The exponent says how many times the base is a factor.'),
  expr: ['2⁵'], exprSize: 40,
  ask: L('Bu yozuv nimani bildiradi?', 'Что означает эта запись?', 'What does this record mean?'),
  opts: [
    { label: ['2', '·', '2', '·', '2', '·', '2', '·', '2'] },
    { label: ['2', '·', '5'] },
    { label: ['5', '·', '5', '·', '5', '·', '5', '·', '5'] },
  ],
  correct: 0,
  correctText: L(
    "To'g'ri. Asos 2, ko'rsatkich 5: ikki besh marta ko'paytuvchi bo'ladi. 2 · 2 · 2 · 2 · 2 = 32.",
    'Верно. Основание 2, показатель 5: двойка берётся множителем пять раз. 2 · 2 · 2 · 2 · 2 = 32.',
    'Correct. The base is 2 and the exponent 5: the two is a factor five times. 2 · 2 · 2 · 2 · 2 = 32.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "2 · 5 bu oddiy ko'paytirish, u 10 beradi. Daraja esa asosni O'ZIGA ko'paytirishni bildiradi.",
      '2 · 5 это обычное умножение, оно даёт 10. А степень означает умножение основания САМО НА СЕБЯ.',
      '2 · 5 is an ordinary multiplication giving 10. A power means multiplying the base BY ITSELF.') },
    { when: (s) => s.picked === 2, text: L(
      "Asos va ko'rsatkich joyi almashgan: pastda 2 turibdi, ya'ni ko'paytuvchi 2 bo'ladi, 5 emas.",
      'Основание и показатель перепутаны: внизу стоит 2, значит множитель это 2, а не 5.',
      'The base and the exponent got swapped: the 2 is below, so the factor is 2, not 5.') },
  ],
  wrongText: L(
    "Pastdagi son -- ko'paytuvchi, tepadagi son -- u necha marta yozilgani.",
    'Число внизу — множитель, число сверху — сколько раз он написан.',
    'The number below is the factor, the number above is how many times it is written.'),
};

export default function D13_01(props) { return <Choice data={DATA} {...props} />; }
