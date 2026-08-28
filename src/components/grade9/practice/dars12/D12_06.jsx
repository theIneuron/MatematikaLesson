// Dars12 · Amaliyot 06 — Javobni kiritish · 🟡 · teg: faqat-bitta-yechim-yozish
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> TypeSet.
//
// MATEMATIKA: x² + y = 10 va −x² + y = 2 qo'shilsa, iks kvadrat yo'qoladi:
// 2y = 12, ya'ni y = 6. Undan x² = 10 − 6 = 4, demak x = 2 VA x = −2.
// Asosiy tuzoq — bitta ildiz yozish; ikkinchisi — x² ni x deb olish.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { TypeSet } from '../asboblar9.jsx';

const DATA = {
  tag: 'faqat-bitta-yechim-yozish', level: '🟡',
  eyebrow: L('Qiymatlar', 'Значения', 'Values'),
  setup: L(
    "Bu yerda qarama-qarshi ishorada iks KVADRAT turibdi. Qo'shsangiz u yo'qoladi va igrek topiladi.",
    'Здесь с противоположными знаками стоит икс в КВАДРАТЕ. При сложении он исчезнет и найдётся игрек.',
    'Here it is x SQUARED that carries opposite signs. Adding makes it vanish and gives y.'),
  ask: L(
    "Iksning BARCHA qiymatlarini yozing.",
    'Запиши ВСЕ значения икса.',
    'Write down ALL values of x.'),
  hint: L(
    "Bir nechta bo'lsa, nuqta-vergul bilan ajrating.",
    'Если их несколько, раздели точкой с запятой.',
    'If there are several, separate them with a semicolon.'),
  placeholder: '0; 0',
  givenLabel: L('Sistema', 'Система', 'System'),
  given: [['x² + y = 10'], ['−x² + y = 2']],
  answer: [-2, 2],
  correctText: L(
    "To'g'ri: minus ikki va ikki. Qo'shsak, iks kvadrat bilan minus iks kvadrat nol beradi: ikki igrek o'n ikkiga teng, igrek olti. Uni birinchi tenglamaga qo'ysak, iks kvadrat to'rtga teng bo'ladi. Iks kvadrat to'rt bo'lsa, iks ikki xil bo'lishi mumkin: ikki va minus ikki, chunki ikkalasining kvadrati ham to'rt. Demak sistemaning ikkita yechimi bor: ikki-olti va minus ikki-olti.",
    'Верно: минус два и два. При сложении икс в квадрате и минус икс в квадрате дают нуль: два игрека равны двенадцати, игрек шесть. Подставив его в первое уравнение, получим икс в квадрате равен четырём. Если икс в квадрате четыре, икс бывает двух видов: два и минус два, ведь квадрат каждого из них четыре. Значит у системы два решения: два-шесть и минус два-шесть.',
    'Correct: minus two and two. Adding makes x squared and minus x squared give zero: two y equals twelve, so y is six. Substituting it into the first equation gives x squared equals four. If x squared is four, x comes in two kinds: two and minus two, since each has square four. So the system has two solutions: two-six and minus two-six.'),
  wrongs: [
    { when: (s) => s.size === 1 && s.has(2), text: L(
      "Bitta ildiz topildi, ikkinchisi tushib qoldi. Minus ikkining kvadrati ham to'rt, demak u ham sistemani qanoatlantiradi.",
      'Найден один корень, второй потерян. Квадрат минус двух тоже четыре, значит он тоже удовлетворяет системе.',
      'One root was found and the other lost. The square of minus two is four as well, so it satisfies the system too.') },
    { when: (s) => s.size === 1 && s.has(-2), text: L(
      "Bitta ildiz topildi, ikkinchisi tushib qoldi. Kvadrat to'rtga teng bo'lgan ikkinchi son ham bor: ikkining kvadrati ham to'rt.",
      'Найден один корень, второй потерян. Есть и второе число с квадратом четыре: квадрат двух тоже четыре.',
      'One root was found and the other lost. There is a second number with square four: the square of two is four as well.') },
    { when: (s) => s.has(4), text: L(
      "To'rt — bu iks KVADRAT, iksning o'zi emas. Kvadrati to'rtga teng bo'lgan sonlarni toping.",
      'Четыре — это икс в КВАДРАТЕ, а не сам икс. Найди числа, квадрат которых равен четырём.',
      'Four is x SQUARED, not x itself. Find the numbers whose square is four.') },
    { when: (s) => s.has(6) || s.has(12), text: L(
      "Bu igrekka tegishli son. Qo'shishdan ikki igrek o'n ikki chiqadi, igrek olti; savol esa iks haqida.",
      'Это число относится к игреку. Из сложения получается два игрека — двенадцать, игрек шесть; а вопрос про икс.',
      'That number belongs to y. Adding gives two y equals twelve, so y is six; but the question is about x.') },
    { when: (s) => s.has(8), text: L(
      "Qo'shishda igreklar ham qo'shilishini unutmang: igrek qo'shuv igrek ikki igrek, o'ng tomonda esa o'n qo'shuv ikki, ya'ni o'n ikki.",
      'Не забывай, что игреки при сложении тоже складываются: игрек плюс игрек — два игрека, а справа десять плюс два, то есть двенадцать.',
      'Remember the y-terms add up too: y plus y is two y, and on the right ten plus two, that is twelve.') },
  ],
  wrongText: L(
    "Ikkala tenglamani qo'shing, igrekni toping va uni birinchi tenglamaga qaytarib qo'ying. Iks kvadrat topilgach, kvadrati shu songa teng bo'lgan IKKITA sonni yozing.",
    'Сложи оба уравнения, найди игрек и подставь его обратно в первое уравнение. Найдя икс в квадрате, запиши ДВА числа с таким квадратом.',
    'Add both equations, find y, and put it back into the first equation. Once x squared is known, write the TWO numbers with that square.'),
};

export default function D12_06(props) { return <TypeSet data={DATA} {...props} />; }
