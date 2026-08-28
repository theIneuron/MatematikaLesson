// Dars13 · Amaliyot 04 — Javobni kiritish · 🟡 · teg: nomuvofiq-yechimni-qabul-qilish
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> TypeSet.
//
// MATEMATIKA: x − y = 4, xy = 45. y ni ifodalasak, y(y + 4) = 45, ya'ni
// y² + 4y − 45 = 0, ildizlari y = 5 va y = −9. Birinchisi (5; 9) juftligini
// beradi, ikkinchisi (−5; −9) ni. Masala NATURAL sonlarni so'ragan,
// shuning uchun ikkinchi nomzod rad etiladi — darsning uchinchi tasdig'i.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { TypeSet } from '../asboblar9.jsx';

const DATA = {
  tag: 'nomuvofiq-yechimni-qabul-qilish', level: '🟡',
  eyebrow: L('Sonlar', 'Числа', 'Numbers'),
  setup: L(
    "Bir NATURAL son ikkinchisidan to'rtga katta, ularning ko'paytmasi qirq besh.",
    'Одно НАТУРАЛЬНОЕ число на четыре больше другого, их произведение сорок пять.',
    'One NATURAL number is four greater than another, and their product is forty-five.'),
  ask: L(
    "Ikkala sonni ham yozing.",
    'Запиши оба числа.',
    'Write down both numbers.'),
  hint: L(
    "Ikkitasini nuqta-vergul bilan ajrating.",
    'Раздели их точкой с запятой.',
    'Separate them with a semicolon.'),
  placeholder: '0; 0',
  givenLabel: L('Sistema', 'Система', 'System'),
  given: [['x − y = 4'], ['xy = 45']],
  answer: [5, 9],
  correctText: L(
    "To'g'ri: besh va to'qqiz. Igrekni ifodalab qo'ysak, igrek karra igrek qo'shuv to'rt qirq beshga teng bo'ladi, ya'ni igrek kvadrat qo'shuv to'rt igrek minus qirq besh nolga teng: ildizlari besh va minus to'qqiz. Ikkinchi ildiz minus besh bilan minus to'qqiz juftligini beradi — matematik jihatdan to'g'ri, chunki ularning ko'paytmasi ham qirq besh. Lekin masala NATURAL sonlarni so'ragan, shuning uchun bu nomzod rad etiladi.",
    'Верно: пять и девять. Выразив игрек и подставив, получим игрек на игрек плюс четыре равно сорока пяти, то есть игрек в квадрате плюс четыре игрека минус сорок пять равно нулю: корни пять и минус девять. Второй корень даёт пару минус пять и минус девять — математически верную, ведь их произведение тоже сорок пять. Но задача просила НАТУРАЛЬНЫЕ числа, поэтому этот кандидат отбрасывается.',
    'Correct: five and nine. Expressing y and substituting gives y times y plus four equals forty-five, that is y squared plus four y minus forty-five equals zero, with roots five and minus nine. The second root gives the pair minus five and minus nine — mathematically correct, since their product is forty-five too. But the problem asked for NATURAL numbers, so that candidate is rejected.'),
  wrongs: [
    { when: (s) => s.has(-9) || s.has(-5), text: L(
      "Manfiy juftlik tenglamalarni qanoatlantiradi, lekin masalaning shartini yo'q: natural sonlar manfiy bo'lmaydi. Matematik to'g'ri chiqqan yechim ham shartga zid bo'lsa rad etiladi.",
      'Отрицательная пара удовлетворяет уравнениям, но не условию задачи: натуральные числа не бывают отрицательными. Даже математически верное решение отбрасывается, если противоречит условию.',
      'The negative pair satisfies the equations but not the statement: natural numbers are never negative. Even a mathematically correct solution is rejected when it contradicts the statement.') },
    { when: (s) => s.size === 1, text: L(
      "Bitta son yozildi. Masala IKKITA son haqida, ularning biri ikkinchisidan to'rtga katta.",
      'Записано одно число. Задача про ДВА числа, одно из которых на четыре больше другого.',
      'One number was written. The problem is about TWO numbers, one four greater than the other.') },
    { when: (s) => s.has(45), text: L(
      "Qirq besh — bu KO'PAYTMA, javobning o'zi emas. Ko'paytmasi qirq besh, ayirmasi to'rt bo'lgan ikkita sonni toping.",
      'Сорок пять — это ПРОИЗВЕДЕНИЕ, а не сам ответ. Найди два числа с произведением сорок пять и разностью четыре.',
      'Forty-five is the PRODUCT, not the answer itself. Find the two numbers with product forty-five and difference four.') },
    { when: (s) => s.has(4), text: L(
      "To'rt — bu AYIRMA, u shartda allaqachon berilgan. Ayirma bilan ko'paytmadan sonlarning o'zini topish kerak.",
      'Четыре — это РАЗНОСТЬ, она уже дана в условии. По разности и произведению нужно найти сами числа.',
      'Four is the DIFFERENCE and it was given in the statement. From the difference and the product you must find the numbers themselves.') },
    { when: (s) => s.has(3) && s.has(15), text: L(
      "Uch karra o'n besh qirq besh, lekin ularning ayirmasi o'n ikki, to'rt emas. Ikkala shart ham bir vaqtda bajarilishi kerak.",
      'Три на пятнадцать — сорок пять, но их разность двенадцать, а не четыре. Оба условия должны выполняться одновременно.',
      'Three times fifteen is forty-five, but their difference is twelve, not four. Both conditions must hold at once.') },
  ],
  wrongText: L(
    "Birinchi tenglamadan bitta sonni ifodalab, ikkinchisiga qo'ying va kvadrat tenglamani yeching. Ikkita nomzod chiqadi — ularning qaysi biri NATURAL sonlar beradi?",
    'Вырази одно число из первого уравнения, подставь во второе и реши квадратное уравнение. Выйдут два кандидата — какой из них даёт НАТУРАЛЬНЫЕ числа?',
    'Express one number from the first equation, substitute into the second and solve the quadratic. Two candidates appear — which of them gives NATURAL numbers?'),
};

export default function D13_04(props) { return <TypeSet data={DATA} {...props} />; }
