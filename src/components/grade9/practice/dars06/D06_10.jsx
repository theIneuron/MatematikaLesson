// Dars06 · Amaliyot 10 — Tartib · 🔴 · teg: belgi-almashtirish-notogri
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> OrderLines.
// Kontent: src/books/grade9/DARS06_AMALIYOT_KONTENT.md §10
//
// Zanjir AJRATISHDAN boshlanadi: ko'paytuvchilarsiz nollarni topib
// bo'lmaydi. Nollar topilgach, tarmoqlarning yo'nalishi va tengsizlikning
// ishorasi birgalikda javobning shaklini beradi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L, OrderLines } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'belgi-almashtirish-notogri', level: '🔴',
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    'Beshta qadam aralashtirilgan. Ular bitta yechim zanjirini hosil qiladi.',
    'Пять шагов перемешаны. Вместе они составляют одну цепочку решения.',
    'Five steps are shuffled. Together they make one chain of solution.'),
  ask: L('Qadamlarni to\'g\'ri tartibga soling.', 'Расставь шаги по порядку.', 'Put the steps in the right order.'),
  empty: L('Kartochkalarni tartib bilan bosing', 'Нажимай карточки по порядку', 'Tap the cards in order'),
  itemSize: 15,
  givenLabel: L('Yeching', 'Решить', 'Solve'),
  given: [['x² − 2x − 15 > 0']],
  lines: [
    { id: 'c1', label: L(
      "Kvadrat uch hadni ko'paytuvchilarga ajratamiz",
      'Раскладываем квадратный трёхчлен на множители',
      'Factor the quadratic trinomial') },
    { id: 'c2', tokens: ['(x + 3)(x − 5) > 0'] },
    { id: 'c3', label: L('Nollar:', 'Нули:', 'Zeros:'), tokens: ['x = −3', ',', 'x = 5'] },
    { id: 'c4', label: L(
      "Tarmoqlar yuqoriga, > 0 → javob nollardan tashqarida",
      'Ветви вверх, > 0 → ответ вне нулей',
      'Branches up, > 0 → the answer is outside the zeros') },
    { id: 'c5', label: L('Javob:', 'Ответ:', 'Answer:'), tokens: ['x < −3', 'yoki', 'x > 5'] },
  ],
  answer: ['c1', 'c2', 'c3', 'c4', 'c5'],
  correctText: L(
    "To'g'ri. Zanjir ajratishdan boshlanadi: ko'paytuvchilarsiz nollarni topib bo'lmaydi. Nollar topilgach, tarmoqlarning yo'nalishi va tengsizlikning ishorasi birgalikda javobning shaklini beradi, va faqat shundan keyin javob yoziladi.",
    'Верно. Цепочка начинается с разложения: без множителей нули не найти. Когда нули найдены, направление ветвей и знак неравенства вместе дают вид ответа, и только после этого ответ записывают.',
    'Correct. The chain starts from factoring: without factors the zeros cannot be found. Once the zeros are there, the direction of the branches and the sign of the inequality together give the shape of the answer, and only then is the answer written.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c3') < s.seq.indexOf('c2'), text: L(
      "Nollar ko'paytuvchilardan chiqadi. Ajratilmagan uch haddan qavslar qayerdan olinadi?",
      'Нули берутся из множителей. Откуда взять скобки, если трёхчлен ещё не разложен?',
      'The zeros come from the factors. Where would the brackets come from if the trinomial is not factored yet?') },
    { when: (s) => s.seq.indexOf('c4') < s.seq.indexOf('c3'), text: L(
      "Bu qadam nollarga tayanadi: «tashqarida» yoki «orasida» degan so'z nollar bo'lmasa ma'nosiz.",
      'Этот шаг опирается на нули: слова «вне» или «между» без нулей бессмысленны.',
      'This step rests on the zeros: the words "outside" and "between" mean nothing without them.') },
    { when: (s) => s.seq[s.seq.length - 1] !== 'c5', text: L(
      "Javob zanjirning oxirida turadi, hamma qaror qabul qilingandan keyin.",
      'Ответ стоит в конце цепочки, после того как все решения приняты.',
      'The answer stands at the end of the chain, after every decision is made.') },
    { when: (s) => s.seq[0] !== 'c1', text: L(
      "Yechim nimadan boshlanadi? Uch had avval ko'paytmaga aylantiriladi, keyin qolgan hamma narsa shundan chiqadi.",
      'С чего начинается решение? Сначала трёхчлен превращают в произведение, а дальше всё выходит из него.',
      'Where does the solution start? The trinomial is turned into a product first, and everything else follows from it.') },
  ],
  wrongText: L(
    "Zanjirni yuqoridan pastga o'qing: har qadam o'zidan oldingisining natijasidan foydalanadimi?",
    'Прочитай цепочку сверху вниз: пользуется ли каждый шаг результатом предыдущего?',
    'Read the chain from top to bottom: does every step use the result of the one before it?'),
};

export default function D06_10(props) { return <OrderLines data={DATA} {...props} />; }
