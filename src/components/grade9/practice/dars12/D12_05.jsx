// Dars12 · Amaliyot 05 — Sonlar o'qi · 🟡 · teg: orniga-qoyishni-unutish
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> DomainAxis,
// `point` rejimida.
//
// MATEMATIKA: x + 2y = 9 va x − 2y = 1 qo'shilsa, 2x = 10, ya'ni x = 5.
// Lekin so'ralgan narsa IGREK: 2y = 9 − 5 = 4, demak y = 2.
// Tuzoqning butun kuchi shunda: qo'shish IKSni beradi, savol esa igrek
// haqida — ya'ni to'xtab qolganlar beshni belgilaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { DomainAxis } from '../asboblar9.jsx';

const DATA = {
  tag: 'orniga-qoyishni-unutish', level: '🟡',
  eyebrow: L('Sonlar o\'qi', 'Числовая ось', 'The number line'),
  setup: L(
    "Qo'shsangiz igrek yo'qoladi va iks topiladi. Savol esa igrek haqida.",
    'При сложении игрек исчезнет и найдётся икс. А вопрос — про игрек.',
    'Adding makes y vanish and gives x. But the question is about y.'),
  ask: L(
    "IGREKNI o'qda belgilang.",
    'Отметь на оси ИГРЕК.',
    'Mark Y on the axis.'),
  givenLabel: L('Sistema', 'Система', 'System'),
  given: [['x + 2y = 9'], ['x − 2y = 1']],
  mode: 'point',
  axis: { from: -2, to: 8 },
  answer: { at: 2, closed: true },
  closedLabel: L('Bo\'yalgan', 'Закрашенная', 'Filled'),
  openLabel: L('Bo\'sh', 'Пустая', 'Hollow'),
  correctText: L(
    "To'g'ri. Qo'shsak, ikki igrek bilan minus ikki igrek nol beradi: ikki iks o'nga teng, iks besh. Bu hali javob emas — savol igrek haqida. Beshni birinchi tenglamaga qo'yamiz: besh qo'shuv ikki igrek to'qqiz, ya'ni ikki igrek to'rt, igrek ikki. Nuqta bo'yalgan: bu aniq son, chiqarib tashlangan chegara emas.",
    'Верно. При сложении два игрека и минус два игрека дают нуль: два икса равны десяти, икс равен пяти. Это ещё не ответ — вопрос про игрек. Подставляем пять в первое уравнение: пять плюс два игрека — девять, значит два игрека — четыре, игрек — два. Точка закрашена: это конкретное число, а не исключённая граница.',
    'Correct. Adding makes two y and minus two y give zero: two x equals ten, so x is five. That is not the answer yet — the question is about y. Substitute five into the first equation: five plus two y is nine, so two y is four and y is two. The point is filled: this is a definite number, not an excluded boundary.'),
  wrongs: [
    { when: (s) => s.at === 5, text: L(
      "Besh — bu IKS, qo'shishdan chiqqan natija. Uni tenglamaga qaytarib qo'ying va igrekni toping: besh qo'shuv ikki igrek to'qqizga teng.",
      'Пять — это ИКС, результат сложения. Подставь его обратно в уравнение и найди игрек: пять плюс два игрека равно девяти.',
      'Five is X, the result of adding. Put it back into an equation and find y: five plus two y equals nine.') },
    { when: (s) => s.at === 4, text: L(
      "To'rt — bu IKKI igrek, igrekning o'zi emas. Ikkiga bo'lish qadami qoldi.",
      'Четыре — это ДВА игрека, а не сам игрек. Остался шаг деления на два.',
      'Four is TWO y, not y itself. The step of dividing by two is left.') },
    { when: (s) => s.at === 8 || s.at === 6, text: L(
      "Bu son ikkala tenglamadan ham chiqmaydi. Qo'shishdan ikki iks o'n chiqadi, undan iks besh; keyin igrekni tenglamadan toping.",
      'Это число не выходит ни из одного уравнения. Из сложения получается два икса — десять, отсюда икс пять; потом найди игрек из уравнения.',
      'This number comes from neither equation. Adding gives two x equals ten, hence x is five; then find y from an equation.') },
    { when: (s) => s.atOk && !s.closedOk, text: L(
      "Bu son sistemaning yechimiga kiradi, demak nuqta bo'yalgan bo'lishi kerak. Bo'sh nuqta chiqarib tashlangan sonni bildiradi.",
      'Это число входит в решение системы, значит точка должна быть закрашена. Пустая точка означает исключённое число.',
      'This number belongs to the solution of the system, so the point must be filled. A hollow point means an excluded number.') },
    { when: (s) => !s.atOk, text: L(
      "Ikki qadam kerak: qo'shish iksni beradi, keyin iks tenglamaga qaytariladi va igrek topiladi.",
      'Нужны два шага: сложение даёт икс, потом икс возвращается в уравнение и находится игрек.',
      'Two steps are needed: adding gives x, then x goes back into an equation and y is found.') },
  ],
  wrongText: L(
    "Qo'shishdan keyin to'xtamang. Topilgan iksni ixtiyoriy tenglamaga qo'ying, ikki igrekni toping va uni ikkiga bo'ling.",
    'Не останавливайся после сложения. Подставь найденный икс в любое уравнение, найди два игрека и раздели на два.',
    'Do not stop after adding. Put the x you found into either equation, find two y, and divide by two.'),
};

export default function D12_05(props) { return <DomainAxis data={DATA} {...props} />; }
