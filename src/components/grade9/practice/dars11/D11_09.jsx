// Dars11 · Amaliyot 09 — So'zlar · 🔴 · teg: manfiy-kvadrat-holati
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> ClozeBank.
//
// Qoida darsning ikkita ishini bir gapga yig'adi: ifoda QAYSI tenglamaga
// yuboriladi, va kvadrat manfiy chiqqanda nima bo'ladi. Bankdagi uch
// tuzoq — darsning uch aniq adashishiga tegadi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'manfiy-kvadrat-holati', level: '🔴',
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Darsning qoidasi yozilgan, lekin uchta so'z tushib qolgan. Ularni pastdagi kartalardan qo'ying.",
    'Правило урока записано, но три слова выпали. Поставь их из карточек снизу.',
    'The rule of the lesson is written down, but three words fell out. Put them back from the cards below.'),
  ask: L(
    "Kartani bosing, keyin bo'sh kartochkani bosing.",
    'Нажми карточку, потом пустую клетку.',
    'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  parts: [
    { text: L(
      "O'rniga qo'yish usulida o'zgaruvchi yoki uning",
      'В способе подстановки переменная или её',
      'In the substitution method a variable or its') },
    { slot: 0 },
    { text: L(
      "bir tenglamadan ifodalanib,",
      'выражается из одного уравнения и подставляется во',
      'is expressed from one equation and substituted into') },
    { slot: 1 },
    { text: L(
      "tenglamaga qo'yiladi. Kvadrati manfiy songa teng chiqsa, bunday iks uchun",
      "уравнение. Если квадрат оказался равен отрицательному числу, для такого икса",
      'equation. If the square equals a negative number, for such an x there') },
    { slot: 2 },
    { text: L('.', '.', '.') },
  ],
  cards: [
    { id: 'w1', label: L('darajasi', 'степень', 'power') },
    { id: 'w2', label: L('ikkinchi', 'второе', 'the second') },
    { id: 'w3', label: L("haqiqiy yechim yo'q", 'действительного решения нет', 'is no real solution') },
    { id: 'w4', label: L('ozod hadi', 'свободный член', 'constant term') },
    { id: 'w5', label: L("o'sha", 'то же', 'the same') },
    { id: 'w6', label: L('ikkita yechim bor', 'есть два решения', 'are two solutions') },
  ],
  answer: ['w1', 'w2', 'w3'],
  correctText: L(
    "To'g'ri, uchala so'z ham joyida. Qoida darsning uchala ishini bir gapga yig'adi: ifodalanadigan narsa o'zgaruvchining o'zi ham, uning darajasi ham bo'lishi mumkin; ifoda IKKINCHI tenglamaga yuboriladi, o'zinikiga emas; va kvadrat manfiy chiqsa, bu iks uchun haqiqiy yechim yo'q — bu ham to'liq javob, xato emas.",
    'Верно, все три слова на месте. Правило собирает в одно предложение три дела урока: выражать можно и саму переменную, и её степень; выражение отправляется во ВТОРОЕ уравнение, а не в своё; и если квадрат вышел отрицательным, для этого икса действительного решения нет — это тоже полноценный ответ, а не ошибка.',
    'Correct, all three words are in place. The rule gathers the three jobs of the lesson into one sentence: what gets expressed can be the variable itself or its power; the expression is sent into the SECOND equation, not its own; and if the square comes out negative, there is no real solution for that x — which is a complete answer, not a mistake.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w4', text: L(
      "Ozod had — bu harfsiz son, uni ifodalashning ma'nosi yo'q. Ifodalanadigan narsa iks yoki igrek, yoki ularning kvadrati.",
      'Свободный член — это число без буквы, выражать его незачем. Выражают икс или игрек, или их квадрат.',
      'A constant term is a number without a letter; there is nothing to express there. What gets expressed is x or y, or their square.') },
    { when: (s) => s.slots[1] === 'w5', text: L(
      "Ifodani o'z tenglamasiga qaytarsangiz, ikkala tomonda bir xil narsa turadi va o'zgaruvchi qisqarib ketadi. Yangi ma'lumot faqat ikkinchi tenglamada.",
      'Если вернуть выражение в его же уравнение, в обеих частях окажется одно и то же и переменная сократится. Новая информация только во втором уравнении.',
      'Returning the expression to its own equation leaves the same thing on both sides and the variable cancels. The new information is only in the second equation.') },
    { when: (s) => s.slots[2] === 'w6', text: L(
      "Manfiy songa teng kvadratdan ikkita yechim ham chiqmaydi, bittasi ham. Hech qanday haqiqiy sonning kvadrati manfiy bo'lmaydi.",
      'Из квадрата, равного отрицательному числу, не выходит ни двух решений, ни одного. Квадрат никакого действительного числа не бывает отрицательным.',
      'A square equal to a negative number yields neither two solutions nor one. No real number has a negative square.') },
  ],
  wrongText: L(
    "Har bo'shliqni gapning o'zi bilan tekshiring: birinchisi nima ifodalanishi haqida, ikkinchisi ifoda qaysi tenglamaga borishi haqida, uchinchisi esa kvadrat manfiy chiqqanda nima bo'lishi haqida.",
    'Проверяй каждую клетку самим предложением: первая про то, что выражают, вторая про то, в какое уравнение идёт выражение, третья про то, что будет при отрицательном квадрате.',
    'Check each blank against the sentence itself: the first is about what gets expressed, the second about which equation it goes into, the third about what happens when the square is negative.'),
};

export default function D11_09(props) { return <ClozeBank data={DATA} {...props} />; }
