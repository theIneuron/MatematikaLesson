// Dars11 · Amaliyot 04 — Sonlar o'qi · 🟡 · teg: notogri-orniga-qoyish
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> DomainAxis,
// `point` rejimida.
//
// MATEMATIKA: y = 2x + 1 ni x² + y = 9 ga qo'ysak, x² + 2x + 1 = 9,
// ya'ni x² + 2x − 8 = 0 → x = −4 va x = 2. KICHIGI minus to'rt.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { DomainAxis } from '../asboblar9.jsx';

const DATA = {
  tag: 'notogri-orniga-qoyish', level: '🟡',
  eyebrow: L('Sonlar o\'qi', 'Числовая ось', 'The number line'),
  setup: L(
    "Birinchi tenglamadan igrek tayyor. Uni ikkinchisiga qo'ysangiz, kvadrat tenglama chiqadi.",
    'Из первого уравнения игрек уже готов. Подставь его во второе — получится квадратное уравнение.',
    'y is already given by the first equation. Substituting it into the second gives a quadratic.'),
  ask: L(
    "Ikkita ildizdan KICHIGINI o'qda belgilang.",
    'Отметь на оси МЕНЬШИЙ из двух корней.',
    'Mark the SMALLER of the two roots on the axis.'),
  givenLabel: L('Sistema', 'Система', 'System'),
  given: [['y = 2x + 1'], ['x² + y = 9']],
  mode: 'point',
  axis: { from: -6, to: 4 },
  answer: { at: -4, closed: true },
  closedLabel: L('Bo\'yalgan', 'Закрашенная', 'Filled'),
  openLabel: L('Bo\'sh', 'Пустая', 'Hollow'),
  correctText: L(
    "To'g'ri. Qo'ysak, iks kvadrat qo'shuv ikki iks qo'shuv bir to'qqizga teng bo'ladi, ya'ni iks kvadrat qo'shuv ikki iks minus sakkiz nolga teng. Ildizlari minus to'rt va ikki, kichigi minus to'rt. Nuqta bo'yalgan: bu ildiz haqiqiy, chunki uning kvadrati o'n olti — musbat son. Agar kvadrat manfiy chiqqanda edi, bunday iks uchun umuman haqiqiy yechim bo'lmasdi.",
    'Верно. После подстановки икс в квадрате плюс два икс плюс один равно девяти, то есть икс в квадрате плюс два икс минус восемь равно нулю. Корни — минус четыре и два, меньший минус четыре. Точка закрашена: этот корень настоящий, ведь его квадрат шестнадцать — положительное число. А если бы квадрат вышел отрицательным, для такого икса действительного решения не было бы вовсе.',
    'Correct. After substituting, x squared plus two x plus one equals nine, that is x squared plus two x minus eight equals zero. The roots are minus four and two, the smaller being minus four. The point is filled: this root is real, since its square is sixteen, a positive number. Had the square come out negative, there would be no real solution for such an x at all.'),
  wrongs: [
    { when: (s) => s.at === 2, text: L(
      "Ikkala ildiz ham to'g'ri, lekin savolda KICHIGI so'ralgan. Minus to'rt bilan ikkini o'qda solishtiring: manfiy son o'qning chap tomonida turadi.",
      'Оба корня верны, но в вопросе спрашивают МЕНЬШИЙ. Сравни минус четыре и два на оси: отрицательное число стоит левее.',
      'Both roots are right, but the question asks for the SMALLER one. Compare minus four and two on the axis: the negative number stands to the left.') },
    { when: (s) => s.at === -8 || s.at === 8, text: L(
      "Bu tenglamaning ozod hadi, ildizi emas. Iks kvadrat qo'shuv ikki iks minus sakkiz nolga teng tenglamani yeching: ko'paytmasi minus sakkiz, yig'indisi minus ikki bo'lgan ikkita son kerak.",
      'Это свободный член уравнения, а не корень. Реши уравнение икс в квадрате плюс два икс минус восемь равно нулю: нужны два числа с произведением минус восемь и суммой минус два.',
      'That is the constant term of the equation, not a root. Solve x squared plus two x minus eight equals zero: you need two numbers with product minus eight and sum minus two.') },
    { when: (s) => s.at === 1 || s.at === 9, text: L(
      "Bu sondagi ikkala tenglamadan ko'chirilgan. Avval ifodani ikkinchi tenglamaga qo'ying va hosil bo'lgan kvadrat tenglamani yeching.",
      'Это число просто переписано из уравнений. Сначала подставь выражение во второе уравнение и реши получившееся квадратное.',
      'That number was simply copied from the equations. Substitute the expression into the second equation first and solve the quadratic you get.') },
    { when: (s) => s.atOk && !s.closedOk, text: L(
      "Bu ildiz haqiqiy va javobga kiradi, demak nuqta bo'yalgan bo'lishi kerak. Bo'sh nuqta chiqarib tashlangan sonni bildiradi.",
      'Этот корень настоящий и входит в ответ, значит точка должна быть закрашена. Пустая точка означает исключённое число.',
      'This root is real and belongs to the answer, so the point must be filled. A hollow point means an excluded number.') },
    { when: (s) => !s.atOk, text: L(
      "Igrekni ikkinchi tenglamaga qo'ying, hamma hadni bir tomonga o'tkazing va kvadrat tenglamani yeching. Undan keyin ikki ildizdan kichigini tanlang.",
      'Подставь игрек во второе уравнение, перенеси все слагаемые в одну сторону и реши квадратное уравнение. Потом выбери меньший из двух корней.',
      'Substitute y into the second equation, move all terms to one side and solve the quadratic. Then pick the smaller of the two roots.') },
  ],
  wrongText: L(
    "Ikki iks qo'shuv birni to'qqizdan ayirmang — uni igrekning O'RNIGA qo'ying. Shunda faqat iks qoladi.",
    'Не вычитай два икс плюс один из девяти — подставь его ВМЕСТО игрека. Тогда останется только икс.',
    'Do not subtract two x plus one from nine — put it IN PLACE of y. Then only x is left.'),
};

export default function D11_04(props) { return <DomainAxis data={DATA} {...props} />; }
