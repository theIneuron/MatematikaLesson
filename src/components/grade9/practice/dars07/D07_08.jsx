// Dars07 · Amaliyot 08 — Tartib · 🔴 · teg: tekshirish-otkazib-yuborish
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> OrderLines.
//
// Oxirgi qadam — TEKSHIRUV, va u zanjirning bir qismi: darsning uchinchi
// tasdig'i aynan shu («yechim tekshirilgandagina yakunlangan hisoblanadi»).
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L, OrderLines } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'tekshirish-otkazib-yuborish', level: '🔴',
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    'Beshta qadam aralashtirilgan. Ular bitta yechim zanjirini hosil qiladi.',
    'Пять шагов перемешаны. Вместе они составляют одну цепочку решения.',
    'Five steps are shuffled. Together they make one chain of solution.'),
  ask: L('Qadamlarni to\'g\'ri tartibga soling.', 'Расставь шаги по порядку.', 'Put the steps in the right order.'),
  empty: L('Kartochkalarni tartib bilan bosing', 'Нажимай карточки по порядку', 'Tap the cards in order'),
  itemSize: 16,
  givenLabel: L('Yeching', 'Решить', 'Solve'),
  given: [['3(x − 2) = x + 6']],
  lines: [
    { id: 'c1', label: L('Qavsni ochamiz', 'Раскрываем скобку', 'Open the bracket') },
    { id: 'c2', tokens: ['3x − 6 = x + 6'] },
    { id: 'c3', label: L('Hadlarni ko\'chiramiz:', 'Переносим слагаемые:', 'Move the terms:'), tokens: ['2x = 12'] },
    { id: 'c4', tokens: ['x = 6'] },
    { id: 'c5', label: L('Tekshirish:', 'Проверка:', 'Check:'), tokens: ['3 · 4 = 12', ',', '6 + 6 = 12'] },
  ],
  answer: ['c1', 'c2', 'c3', 'c4', 'c5'],
  correctText: L(
    "To'g'ri. Zanjir qavsni ochishdan boshlanadi, keyin hadlar to'planadi, keyin ildiz topiladi va oxirida ASL tenglamaga qo'yib tekshiriladi. Tekshiruv qo'shimcha emas: darsning qoidasi bo'yicha yechim faqat shundan keyin yakunlangan hisoblanadi.",
    'Верно. Цепочка начинается с раскрытия скобки, потом собираются слагаемые, потом находится корень, и в конце он проверяется подстановкой в ИСХОДНОЕ уравнение. Проверка — не добавка: по правилу урока решение считается завершённым только после неё.',
    'Correct. The chain starts by opening the bracket, then the terms are gathered, then the root is found, and at the end it is checked in the ORIGINAL equation. The check is not an extra: by the rule of the lesson the solution counts as finished only after it.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c2') < s.seq.indexOf('c1'), text: L(
      "Bu qator qavs ochilishining natijasi. Qavs hali ochilmagan bo'lsa, uch iks minus olti qayerdan chiqadi?",
      'Эта строка — результат раскрытия скобки. Если скобка ещё не раскрыта, откуда возьмётся три икс минус шесть?',
      'This line is the result of opening the bracket. If the bracket is not opened yet, where would three x minus six come from?') },
    { when: (s) => s.seq.indexOf('c4') < s.seq.indexOf('c3'), text: L(
      "Ildiz hadlar to'plangandan keyin chiqadi. Ikki iks o'n ikkiga teng bo'lmasa, iks oltiga teng deb qayerdan aytasiz?",
      'Корень получается после того, как собраны слагаемые. Если ещё нет два икс равно двенадцати, откуда взять икс равно шести?',
      'The root appears once the terms are gathered. Without two x equals twelve, where does x equals six come from?') },
    { when: (s) => s.seq[s.seq.length - 1] !== 'c5', text: L(
      "Tekshirish topilgan ildizni tekshiradi. Ildiz hali topilmagan bo'lsa, nimani qo'yasiz?",
      'Проверка проверяет найденный корень. Если корень ещё не найден, что подставлять?',
      'The check tests the root that was found. If the root is not found yet, what would you substitute?') },
    { when: (s) => s.seq[0] !== 'c1', text: L(
      "Yechim nimadan boshlanadi? Qavs turgan ekan, avval u ochiladi, keyin qolgan hamma narsa.",
      'С чего начинается решение? Раз есть скобка, сначала раскрывают её, а потом всё остальное.',
      'Where does the solution start? Since there is a bracket, it is opened first, and everything else follows.') },
  ],
  wrongText: L(
    "Zanjirni yuqoridan pastga o'qing: har qator o'zidan oldingisidan kelib chiqadimi?",
    'Прочитай цепочку сверху вниз: следует ли каждая строка из предыдущей?',
    'Read the chain from top to bottom: does every line follow from the one above it?'),
};

export default function D07_08(props) { return <OrderLines data={DATA} {...props} />; }
