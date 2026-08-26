// Dars01 · Amaliyot 08 — Tartib · 🔴 · teg: order_domain
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> OrderLines.
// Kontent: src/books/grade9/DARS01_AMALIYOT_KONTENT.md §08
//
// TEKSHIRISH — ZANJIRNING QADAMI, qo'shimcha emas. `tekshirilmagan`
// adashishi aynan shu yerda o'ladi: javob yozilgach ish tugamaydi.
//
// Tartib YAGONA: shart avval so'z bilan aytiladi, keyin tengsizlik bo'lib
// yoziladi, keyin yechiladi, keyin javob, oxirida tekshiruv. Ikki xil
// to'g'ri tartib bo'ladigan zanjir bu mexanikaga berilmaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L, OrderLines } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'order_domain', level: '🔴',
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Beshta qadam aralashtirilgan. Ular bitta zanjir hosil qiladi.",
    'Пять шагов перемешаны. Вместе они составляют одну цепочку.',
    'Five steps are shuffled. Together they make one chain.'),
  ask: L('Qadamlarni to\'g\'ri tartibga soling.', 'Расставь шаги по порядку.', 'Put the steps in the right order.'),
  empty: L(
    'Kartochkalarni tartib bilan bosing',
    'Нажимай карточки по порядку',
    'Tap the cards in order'),
  itemSize: 16,
  givenLabel: L('Berilgan', 'Дано', 'Given'),
  given: [['y =', { r: '12 − x' }]],
  lines: [
    { id: 'c1', label: L(
      "Ildiz ostida manfiy son bo'lmaydi",
      'Под корнем не бывает отрицательного числа',
      'A negative number cannot stand under a root') },
    { id: 'c2', tokens: ['12 − x ≥ 0'] },
    { id: 'c3', tokens: ['x ≤ 12'] },
    { id: 'c4', label: L('Javob:', 'Ответ:', 'Answer:'), tokens: ['x ≤ 12'] },
    { id: 'c5', label: L('Tekshirish:', 'Проверка:', 'Check:'), tokens: ['x = 15', '→', '12 − 15 = −3'] },
  ],
  answer: ['c1', 'c2', 'c3', 'c4', 'c5'],
  correctText: L(
    "To'g'ri. Zanjir shunday yuradi: avval shart so'z bilan aytiladi, keyin tengsizlik bo'lib yoziladi, keyin yechiladi, keyin javob yoziladi va oxirida javob son bilan tekshiriladi. Tekshirish — qadamning o'zi, qo'shimcha emas.",
    'Верно. Цепочка идёт так: сначала условие проговаривается словами, потом записывается неравенством, потом решается, потом пишется ответ, и в конце ответ проверяется числом. Проверка — сам шаг, а не добавка.',
    'Correct. The chain runs like this: the condition is first said in words, then written as an inequality, then solved, then the answer is written, and at the end the answer is checked with a number. The check is a step itself, not an extra.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c5') < s.seq.indexOf('c4'), text: L(
      "Tekshirish nimani tekshiradi? Javob hali yozilmagan bo'lsa, solishtiradigan narsa yo'q.",
      'Что проверяет проверка? Если ответ ещё не записан, сравнивать не с чем.',
      'What does the check check? If the answer is not written yet, there is nothing to compare with.') },
    { when: (s) => s.seq.indexOf('c3') < s.seq.indexOf('c2'), text: L(
      "Bu qator tengsizlikni yechish natijasi. Yechilmagan tengsizlikdan natija chiqmaydi.",
      'Эта строка — результат решения неравенства. Из нерешённого неравенства результат не появится.',
      'This line is the result of solving the inequality. An unsolved inequality gives no result.') },
    { when: (s) => s.seq[0] !== 'c1', text: L(
      "Nega umuman tengsizlik yozildi? Shu savolning javobi zanjirning boshida turishi kerak.",
      'Почему вообще было записано неравенство? Ответ на этот вопрос должен стоять в начале цепочки.',
      'Why was an inequality written at all? The answer to that stands at the head of the chain.') },
    { when: (s) => s.seq[s.seq.length - 1] === 'c4', text: L(
      "Javob yozilgandan keyin ham bitta ish qoladi: uni son bilan tekshirish.",
      'После того как ответ записан, остаётся ещё одно дело: проверить его числом.',
      'Once the answer is written, one job remains: to check it with a number.') },
  ],
  wrongText: L(
    "Zanjirni yuqoridan pastga o'qing. Har bir qator o'zidan oldingisidan kelib chiqadimi?",
    'Прочитай цепочку сверху вниз. Следует ли каждая строка из предыдущей?',
    'Read the chain from top to bottom. Does every line follow from the one above it?'),
};

export default function D01_08(props) { return <OrderLines data={DATA} {...props} />; }
