// Dars07 · Amaliyot 07 — Ildizni yozish · 🟡 · teg: qavs-ochish-ishorasi
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> TypeSet.
//
// MATEMATIKA: 5 − 2(x − 4) = 3x + 8 → 5 − 2x + 8 = 3x + 8 →
// 13 − 2x = 3x + 8 → 5 = 5x → x = 1.
// Tuzoq −1: qavs oldidagi minus faqat birinchi hadga tushirilgan holat.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { TypeSet } from '../asboblar9.jsx';

const DATA = {
  tag: 'qavs-ochish-ishorasi', level: '🟡',
  eyebrow: L('Ildiz', 'Корень', 'Root'),
  setup: L(
    "Qavs oldida minus turibdi: uni ochishda har bir hadning ishorasiga qarang.",
    'Перед скобкой стоит минус: раскрывая её, следи за знаком каждого слагаемого.',
    'There is a minus in front of the bracket: watch the sign of every term while opening it.'),
  ask: L('Tenglamaning ildizini yozing.', 'Напиши корень уравнения.', 'Write the root of the equation.'),
  hint: L('Javob bitta son.', 'Ответ — одно число.', 'The answer is a single number.'),
  placeholder: '0',
  expr: ['5 − 2(x − 4) = 3x + 8'],
  answer: [1],
  correctText: L(
    "To'g'ri, bir. Qavs ochilganda minus ikki iks va QO'SHUV sakkiz chiqadi: minus ikki minus to'rtga ko'paytirilganda musbat bo'ladi. Chap tomonda o'n uch minus ikki iks qoladi, keyin hadlar to'planadi: besh teng besh iks, ya'ni iks birga teng.",
    'Верно, единица. При раскрытии скобки получается минус два икс и ПЛЮС восемь: минус два умножить на минус четыре даёт положительное. Слева остаётся тринадцать минус два икс, потом слагаемые собираются: пять равно пяти икс, то есть икс равен единице.',
    'Correct, one. Opening the bracket gives minus two x and PLUS eight: minus two times minus four is positive. The left side becomes thirteen minus two x, then the terms gather: five equals five x, so x is one.'),
  wrongs: [
    { when: (s) => s.has(-1), text: L(
      "Qavs ochilganda ikkinchi hadning ishorasi hisobga olinmadi. Minus ikkini minus to'rtga ko'paytiring: natija musbatmi yoki manfiy?",
      'При раскрытии скобки не учтён знак второго слагаемого. Умножь минус два на минус четыре: результат положительный или отрицательный?',
      'While opening the bracket the sign of the second term was ignored. Multiply minus two by minus four: is the result positive or negative?') },
    { when: (s) => s.has(3), text: L(
      "Hadlarni ko'chirishda ishora almashishini tekshiring: minus ikki iks o'ng tomonga o'tganda qanday bo'ladi?",
      'Проверь смену знака при переносе: каким становится минус два икс, переходя вправо?',
      'Check the sign change when moving terms: what does minus two x become on the right-hand side?') },
    { when: (s) => s.has(5), text: L(
      "Besh — bu tenglikning bir tomonidagi son, javob emas. Uni beshga bo'lish qadamini bajaring.",
      'Пятёрка — это число в одной части равенства, а не ответ. Выполни шаг деления на пять.',
      'Five is a number on one side of the equality, not the answer. Carry out the division by five.') },
  ],
  wrongText: L(
    "Qavsni to'liq oching, keyin iks li hadlarni bir tomonga, sonlarni ikkinchi tomonga yig'ing. Javobni ASL tenglamaga qo'yib tekshiring.",
    'Раскрой скобку полностью, потом собери слагаемые с икс в одну сторону, числа в другую. Проверь ответ подстановкой в ИСХОДНОЕ уравнение.',
    'Open the bracket fully, then gather the x terms on one side and the numbers on the other. Check the answer in the ORIGINAL equation.'),
};

export default function D07_07(props) { return <TypeSet data={DATA} {...props} />; }
