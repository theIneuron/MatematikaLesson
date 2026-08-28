// Dars09 · Amaliyot 09 — Tartib · 🔴 · teg: vieta-teskari-notogri
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> OrderLines.
//
// Zanjirning oxirgi ikki qadami muhim: javobda IKKALA juftlik ham
// yoziladi, keyin ikkalasi tekshiriladi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L, OrderLines } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'vieta-teskari-notogri', level: '🔴',
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    'Beshta qadam aralashtirilgan. Ular bitta yechim zanjirini hosil qiladi.',
    'Пять шагов перемешаны. Вместе они составляют одну цепочку решения.',
    'Five steps are shuffled. Together they make one chain of solution.'),
  ask: L('Qadamlarni to\'g\'ri tartibga soling.', 'Расставь шаги по порядку.', 'Put the steps in the right order.'),
  empty: L('Kartochkalarni tartib bilan bosing', 'Нажимай карточки по порядку', 'Tap the cards in order'),
  itemSize: 15,
  givenLabel: L('Yeching', 'Решить', 'Solve'),
  given: [['x + y = 8'], ['xy = 15']],
  lines: [
    { id: 'c1', label: L(
      "Yig'indi va ko'paytma ma'lum",
      'Известны сумма и произведение',
      'The sum and the product are known') },
    { id: 'c2', label: L('Tenglama tuzamiz:', 'Составляем уравнение:', 'Build the equation:'), tokens: ['z² − 8z + 15 = 0'] },
    { id: 'c3', tokens: ['z₁ = 3', ',', 'z₂ = 5'] },
    { id: 'c4', label: L('Javob:', 'Ответ:', 'Answer:'), tokens: ['(3; 5)', 'va', '(5; 3)'] },
    { id: 'c5', label: L('Tekshirish:', 'Проверка:', 'Check:'), tokens: ['3 + 5 = 8', ',', '3 · 5 = 15'] },
  ],
  answer: ['c1', 'c2', 'c3', 'c4', 'c5'],
  correctText: L(
    "To'g'ri. Yig'indi va ko'paytmadan kvadrat tenglama tuziladi, uning ildizlari topiladi, keyin javob yoziladi — va javobda IKKALA juftlik ham turadi, chunki ildizlar orasida tartib yo'q, juftlikda esa bor. Oxirida ikkala shart ham son bilan tekshiriladi.",
    'Верно. По сумме и произведению составляют квадратное уравнение, находят его корни, потом записывают ответ — и в ответе стоят ОБЕ пары, ведь у корней порядка нет, а у пары есть. В конце оба условия проверяют числами.',
    'Correct. The sum and the product give a quadratic equation, its roots are found, then the answer is written — and BOTH pairs stand in it, since roots have no order while a pair does. At the end both conditions are checked with numbers.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c3') < s.seq.indexOf('c2'), text: L(
      "Ildizlar tenglamadan chiqadi. Tenglama hali tuzilmagan bo'lsa, uch va beshni qayerdan olasiz?",
      'Корни берутся из уравнения. Если уравнение ещё не составлено, откуда взять тройку и пятёрку?',
      'The roots come from the equation. If the equation is not built yet, where do three and five come from?') },
    { when: (s) => s.seq.indexOf('c2') < s.seq.indexOf('c1'), text: L(
      "Tenglama nimadan tuziladi? Avval yig'indi bilan ko'paytma ma'lumligi aytiladi, keyin ular tenglamaga kiritiladi.",
      'Из чего составляется уравнение? Сначала говорят, что известны сумма и произведение, и только потом вносят их в уравнение.',
      'What is the equation built from? First it is said that the sum and the product are known, and only then they go into the equation.') },
    { when: (s) => s.seq[s.seq.length - 1] !== 'c5', text: L(
      "Tekshirish tayyor javobni tekshiradi. Javob hali yozilmagan bo'lsa, nimani solishtirasiz?",
      'Проверка проверяет готовый ответ. Если ответ ещё не записан, что сравнивать?',
      'The check tests the finished answer. If the answer is not written yet, what would you compare?') },
    { when: (s) => s.seq.indexOf('c4') < s.seq.indexOf('c3'), text: L(
      "Javobda juftliklar turadi, juftliklar esa ildizlardan yig'iladi. Ildizlarni oldin toping.",
      'В ответе стоят пары, а пары собираются из корней. Сначала найди корни.',
      'The answer holds pairs, and pairs are assembled from the roots. Find the roots first.') },
  ],
  wrongText: L(
    "Zanjirni yuqoridan pastga o'qing: har qadam o'zidan oldingisining natijasidan foydalanadimi?",
    'Прочитай цепочку сверху вниз: пользуется ли каждый шаг результатом предыдущего?',
    'Read the chain from top to bottom: does every step use the result of the one before it?'),
};

export default function D09_09(props) { return <OrderLines data={DATA} {...props} />; }
