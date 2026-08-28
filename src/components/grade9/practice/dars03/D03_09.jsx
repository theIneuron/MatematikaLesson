// Dars03 · Amaliyot 09 — Tartib · 🔴 · teg: tenglama-vs-funksiya
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> OrderLines.
// Kontent: src/books/grade9/DARS03_AMALIYOT_KONTENT.md §09
//
// Zanjirning ikkinchi qadamida TENGLAMA paydo bo'ladi — oldin emas.
// Funksiya berilgan edi, tenglama esa uning nollarini qidirish uchun
// yozildi. `tenglama-vs-funksiya` aynan shu qadamda tugaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L, OrderLines } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'tenglama-vs-funksiya', level: '🔴',
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    'Beshta qadam aralashtirilgan. Ular bitta zanjir hosil qiladi.',
    'Пять шагов перемешаны. Вместе они составляют одну цепочку.',
    'Five steps are shuffled. Together they make one chain.'),
  ask: L('Qadamlarni to\'g\'ri tartibga soling.', 'Расставь шаги по порядку.', 'Put the steps in the right order.'),
  empty: L('Kartochkalarni tartib bilan bosing', 'Нажимай карточки по порядку', 'Tap the cards in order'),
  itemSize: 16,
  givenLabel: L('Toping', 'Найти', 'Find'),
  given: [['y = x² + 2x − 8']],
  lines: [
    { id: 'c1', label: L(
      'Funksiyaning noli — y nolga aylanadigan x',
      'Нуль функции — это x, при котором y обращается в нуль',
      'A zero of a function is an x at which y becomes zero') },
    { id: 'c2', tokens: ['x² + 2x − 8 = 0'] },
    { id: 'c3', tokens: ['x₁ = −4', ',', 'x₂ = 2'] },
    { id: 'c4', label: L('Javob: nollar', 'Ответ: нули', 'Answer: the zeros'), tokens: ['−4', 'va', '2'] },
    { id: 'c5', label: L('Tekshirish:', 'Проверка:', 'Check:'), tokens: ['x = 2', '→', '4 + 4 − 8 = 0'] },
  ],
  answer: ['c1', 'c2', 'c3', 'c4', 'c5'],
  correctText: L(
    "To'g'ri. Zanjirning ikkinchi qadamiga e'tibor bering: tenglama shu yerda paydo bo'ldi, oldin emas. Funksiya berilgan edi, tenglama esa uning nollarini qidirish uchun yozildi. Oxirida javob son bilan tekshiriladi — bu ham qadamning o'zi.",
    'Верно. Обрати внимание на второй шаг: уравнение появилось именно здесь, а не раньше. Дана была функция, а уравнение записали, чтобы найти её нули. В конце ответ проверяется числом — это тоже сам шаг.',
    'Correct. Look at the second step: the equation appeared exactly there, not earlier. A function was given, and the equation was written in order to find its zeros. At the end the answer is checked with a number — that is a step too.'),
  wrongs: [
    { when: (s) => s.seq[0] === 'c2', text: L(
      "Tenglama qayerdan paydo bo'ldi? Avval nima izlanayotganini aytish kerak, tenglama shundan keyin yoziladi.",
      'Откуда взялось уравнение? Сначала надо сказать, что ищется, и только потом записывать уравнение.',
      'Where did the equation come from? First you say what is being looked for, and only then write the equation.') },
    { when: (s) => s.seq.indexOf('c3') < s.seq.indexOf('c2'), text: L(
      "Bu qator tenglamani yechish natijasi. Yechilmagan tenglamadan ildiz chiqmaydi.",
      'Эта строка — результат решения уравнения. Из нерешённого уравнения корни не появятся.',
      'This line is the result of solving the equation. An unsolved equation gives no roots.') },
    { when: (s) => s.seq.indexOf('c5') < s.seq.indexOf('c4'), text: L(
      "Tekshirish nimani tekshiradi? Javob hali yozilmagan bo'lsa, solishtiradigan narsa yo'q.",
      'Что проверяет проверка? Если ответ ещё не записан, сравнивать не с чем.',
      'What does the check check? If the answer is not written yet, there is nothing to compare with.') },
    { when: (s) => s.seq[s.seq.length - 1] === 'c4', text: L(
      "Javob yozilgandan keyin ham bitta ish qoladi: uni son bilan tekshirish.",
      'После того как ответ записан, остаётся ещё одно дело: проверить его числом.',
      'Once the answer is written, one job remains: to check it with a number.') },
  ],
  wrongText: L(
    "Zanjirni yuqoridan pastga o'qing. Har qator o'zidan oldingisidan kelib chiqadimi?",
    'Прочитай цепочку сверху вниз. Следует ли каждая строка из предыдущей?',
    'Read the chain from top to bottom. Does every line follow from the one above it?'),
};

export default function D03_09(props) { return <OrderLines data={DATA} {...props} />; }
