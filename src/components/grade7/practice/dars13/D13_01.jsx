// Dars13 · Amaliyot 01 — Daraja nimani bildiradi · 🟢 · tag: power_meaning
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
//
// DARAJA KO'TARILDI (PODXOD_7SINF.md §13): ko'rsatkich oltiga chiqdi, ya'ni
// ko'paytuvchilarni sanash e'tibor talab qiladi.
//
// 3⁶ -- uchning oltinchi darajasi: 3 ni o'ziga olti marta ko'paytirish,
// natijasi 729. Xato variantlar: 3 · 6 = 18 (ko'rsatkichni ko'paytuvchi deb
// o'qigan) va 6 · 6 · 6 (asos bilan ko'rsatkichni almashtirgan).
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'power_meaning', level: '🟢',
  eyebrow: L('Daraja', 'Степень', 'A power'),
  setup: L(
    "Darajada ikki son bor: pastda ASOS, tepada KO'RSATKICH. Ko'rsatkich asos necha marta ko'paytuvchi bo'lganini aytadi.",
    'В степени два числа: внизу ОСНОВАНИЕ, сверху ПОКАЗАТЕЛЬ. Показатель говорит, сколько раз основание взято множителем.',
    'A power has two numbers: the BASE below and the EXPONENT above. The exponent says how many times the base is a factor.'),
  expr: ['3⁶'], exprSize: 40,
  ask: L('Bu yozuv nimani bildiradi?', 'Что означает эта запись?', 'What does this record mean?'),
  opts: [
    { label: ['3', '·', '3', '·', '3', '·', '3', '·', '3', '·', '3'] },
    { label: ['3', '·', '6'] },
    { label: ['6', '·', '6', '·', '6'] },
  ],
  correct: 0,
  correctText: L(
    "To'g'ri. Asos 3, ko'rsatkich 6: uchta emas, OLTITA uchlik ko'paytiriladi. Natijasi 729.",
    'Верно. Основание 3, показатель 6: перемножаются не три, а ШЕСТЬ тройек. Результат 729.',
    'Correct. The base is 3 and the exponent 6: not three but SIX threes are multiplied. The result is 729.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "3 · 6 bu oddiy ko'paytirish, u 18 beradi. Daraja esa asosni O'ZIGA ko'paytirishni bildiradi.",
      '3 · 6 это обычное умножение, оно даёт 18. А степень означает умножение основания САМО НА СЕБЯ.',
      '3 · 6 is an ordinary multiplication giving 18. A power means multiplying the base BY ITSELF.') },
    { when: (s) => s.picked === 2, text: L(
      "Asos va ko'rsatkich joyi almashgan: pastda 3 turibdi, ya'ni ko'paytuvchi 3, va u olti marta olinadi.",
      'Основание и показатель перепутаны: внизу стоит 3, значит множитель это 3, и он берётся шесть раз.',
      'The base and the exponent got swapped: the 3 is below, so the factor is 3, taken six times.') },
  ],
  wrongText: L(
    "Pastdagi son -- ko'paytuvchi, tepadagi son -- u necha marta yozilgani. Ko'paytuvchilarni sanang.",
    'Число внизу — множитель, число сверху — сколько раз он написан. Пересчитай множители.',
    'The number below is the factor, the number above is how many times it appears. Count the factors.'),
};

export default function D13_01(props) { return <Choice data={DATA} {...props} />; }
