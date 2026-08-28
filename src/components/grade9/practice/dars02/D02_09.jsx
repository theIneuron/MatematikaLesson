// Dars02 · Amaliyot 09 — Isbot · 🔴 · teg: bitta-nuqtada-xulosa
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> OrderLines.
// Kontent: src/books/grade9/DARS02_AMALIYOT_KONTENT.md §09
//
// Isbot bitta songa qo'yishdan BOSHLANMAYDI. Birinchi qadam — aniqlanish
// sohasi, chunki minus iks umuman sohaga tushishi kerak; usiz y(−x)
// yozuvining o'zi ma'nosiz. Zanjirda birorta ham aniq son yo'q — aynan
// shu narsa uni isbot qiladi, tekshiruv emas.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L, OrderLines } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'bitta-nuqtada-xulosa', level: '🔴',
  eyebrow: L('Isbot', 'Доказательство', 'Proof'),
  setup: L(
    "Beshta qadam aralashtirilgan. Ular bitta isbot zanjirini hosil qiladi.",
    'Пять шагов перемешаны. Вместе они составляют одну цепочку доказательства.',
    'Five steps are shuffled. Together they make one chain of proof.'),
  ask: L('Qadamlarni to\'g\'ri tartibga soling.', 'Расставь шаги по порядку.', 'Put the steps in the right order.'),
  empty: L('Kartochkalarni tartib bilan bosing', 'Нажимай карточки по порядку', 'Tap the cards in order'),
  itemSize: 16,
  givenLabel: L('Isbotlang', 'Доказать', 'Prove'),
  given: [['y = 4 − x²']],
  lines: [
    { id: 'c1', label: L(
      "Aniqlanish sohasi butun sonlar o'qi, u nolga nisbatan simmetrik",
      'Область определения — вся числовая ось, она симметрична относительно нуля',
      'The domain is the whole number line, and it is symmetric about zero') },
    { id: 'c2', tokens: ['y(−x) = 4 − (−x)²'] },
    { id: 'c3', tokens: ['(−x)² = x²', '→', 'y(−x) = 4 − x²'] },
    { id: 'c4', tokens: ['y(−x) = y(x)'] },
    { id: 'c5', label: L('Javob: funksiya juft', 'Ответ: функция чётная', 'Answer: the function is even') },
  ],
  answer: ['c1', 'c2', 'c3', 'c4', 'c5'],
  correctText: L(
    "To'g'ri. Isbot sohadan boshlanadi: minus iks umuman sohaga tushishi kerak, aks holda igrek minus iks ni yozib ham bo'lmaydi. Keyin minus iks formulaga qo'yiladi, soddalashtiriladi, natija asl formula bilan solishtiriladi va shundan keyingina xulosa yoziladi. Bironta joyda aniq son ishlatilmadi — shuning uchun bu isbot, tekshiruv emas.",
    'Верно. Доказательство начинается с области: минус икс вообще должен попадать в неё, иначе запись игрек от минус икс не имеет смысла. Потом минус икс подставляют в формулу, упрощают, сравнивают с исходной и только затем пишут вывод. Ни в одном месте не понадобилось конкретное число — поэтому это доказательство, а не проверка.',
    'Correct. The proof starts from the domain: minus x must belong to it at all, otherwise writing y of minus x makes no sense. Then minus x goes into the formula, it is simplified, compared with the original, and only after that the conclusion is written. No particular number was needed anywhere — that is what makes this a proof and not a check.'),
  wrongs: [
    { when: (s) => s.seq[0] !== 'c1', text: L(
      "Isbot nimadan boshlanadi? Minus iks sohaga tushmasa, igrek minus iks degan yozuvning o'zi ma'nosiz bo'lardi.",
      'С чего начинается доказательство? Если минус икс не попадает в область, сама запись игрек от минус икс была бы бессмысленной.',
      'Where does a proof start? If minus x is not in the domain, the very expression y of minus x would be meaningless.') },
    { when: (s) => s.seq.indexOf('c4') < s.seq.indexOf('c3'), text: L(
      "Ikki yozuvni solishtirish uchun avval ikkinchisini soddalashtirish kerak. Qavs ichidagi minusdan qanday qutulindi?",
      'Чтобы сравнить две записи, вторую сначала надо упростить. Как избавились от минуса в скобке?',
      'To compare two records, the second one must first be simplified. How was the minus inside the brackets dealt with?') },
    { when: (s) => s.seq[s.seq.length - 1] !== 'c5', text: L(
      "Xulosa zanjirning oxirida turadi. Undan keyin isbotlanadigan narsa qolmaydi.",
      'Вывод стоит в конце цепочки. После него доказывать уже нечего.',
      'The conclusion stands at the end of the chain. After it there is nothing left to prove.') },
    { when: (s) => s.seq.indexOf('c2') < s.seq.indexOf('c1'), text: L(
      "Avval soha, keyin almashtirish. Tartib teskari bo'lsa, hali mavjudligi tekshirilmagan yozuv bilan ishlashga to'g'ri keladi.",
      'Сначала область, потом подстановка. При обратном порядке пришлось бы работать с записью, существование которой ещё не проверено.',
      'Domain first, substitution second. In the other order you would work with a record whose existence has not been checked.') },
  ],
  wrongText: L(
    "Zanjirni yuqoridan pastga o'qing. Har qator o'zidan oldingisidan kelib chiqadimi?",
    'Прочитай цепочку сверху вниз. Следует ли каждая строка из предыдущей?',
    'Read the chain from top to bottom. Does every line follow from the one above it?'),
};

export default function D02_09(props) { return <OrderLines data={DATA} {...props} />; }
