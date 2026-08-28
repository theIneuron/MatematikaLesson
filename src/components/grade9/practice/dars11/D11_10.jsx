// Dars11 · Amaliyot 10 — Tartib · 🔴 · teg: ozgaruvchini-ifodalash-xatosi
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> OrderLines.
//
// O'rniga qo'yish usulining to'liq zanjiri. Muhimi: IFODALASH qadami
// birinchi turadi (usulning boshlanishi shu), va IGREKNI TOPISH javobdan
// oldin — kvadrat tenglamaning ildizi hali yechim emas, yechim juftlik.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L, OrderLines } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'ozgaruvchini-ifodalash-xatosi', level: '🔴',
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "O'rniga qo'yish usulining beshta qadami aralashtirilgan.",
    'Пять шагов способа подстановки перемешаны.',
    'Five steps of the substitution method are shuffled.'),
  ask: L('Qadamlarni to\'g\'ri tartibga soling.', 'Расставь шаги по порядку.', 'Put the steps in the right order.'),
  empty: L('Kartochkalarni tartib bilan bosing', 'Нажимай карточки по порядку', 'Tap the cards in order'),
  itemSize: 14,
  givenLabel: L('Sistema', 'Система', 'System'),
  given: [['x − y = 1'], ['x² − y = 7']],
  lines: [
    { id: 'c1', label: L(
      "Birinchi tenglamadan igrekni ifodalaymiz:",
      'Выражаем игрек из первого уравнения:',
      'Express y from the first equation:'), tokens: ['y = x − 1'] },
    { id: 'c2', label: L(
      "Ifodani ikkinchi tenglamaga qo'yamiz:",
      'Подставляем выражение во второе уравнение:',
      'Substitute the expression into the second equation:'), tokens: ['x² − (x − 1) = 7'] },
    { id: 'c3', label: L(
      'Kvadrat tenglamani yechamiz:',
      'Решаем квадратное уравнение:',
      'Solve the quadratic:'), tokens: ['x² − x − 6 = 0', ',', 'x₁ = 3', ',', 'x₂ = −2'] },
    { id: 'c4', label: L(
      "Har bir iks uchun igrekni ifodadan topamiz va tekshiramiz",
      'Для каждого икса находим игрек по выражению и проверяем',
      'For each x, find y from the expression and check it') },
    { id: 'c5', label: L('Javob:', 'Ответ:', 'Answer:'), tokens: ['(3; 2)', 'va', '(−2; −3)'] },
  ],
  answer: ['c1', 'c2', 'c3', 'c4', 'c5'],
  correctText: L(
    "To'g'ri. Zanjir ifodalashdan boshlanadi va juftliklar bilan tugaydi. Ikkita qadam ataylab ajratilgan: kvadrat tenglamaning ildizi hali javob emas — u faqat IKS, va har bir iks uchun igrekni ham topish kerak. Tekshirish esa ikkala tenglamada bajariladi: uch minus ikki bir, to'qqiz minus ikki yetti; minus ikki minus minus uch ham bir, to'rt minus minus uch ham yetti.",
    'Верно. Цепочка начинается с выражения и заканчивается парами. Два шага разделены намеренно: корень квадратного уравнения — ещё не ответ, это только ИКС, и для каждого икса надо найти игрек. А проверка идёт по обоим уравнениям: три минус два — один, девять минус два — семь; минус два минус минус три — тоже один, четыре минус минус три — тоже семь.',
    'Correct. The chain starts with expressing and ends with pairs. Two steps are deliberately separated: a root of the quadratic is not yet an answer — it is only an X, and for each x a y must be found too. And the check runs in both equations: three minus two is one, nine minus two is seven; minus two minus minus three is one as well, four minus minus three is seven as well.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c2') < s.seq.indexOf('c1'), text: L(
      "Ikkinchi tenglamaga nima qo'yiladi, agar ifoda hali yozilmagan bo'lsa? Avval bitta o'zgaruvchi ifodalanadi, keyin u yuboriladi.",
      'Что подставлять во второе уравнение, если выражение ещё не записано? Сначала выражают одну переменную, потом её отправляют.',
      'What is there to substitute into the second equation if the expression is not written yet? First one variable is expressed, then it is sent.') },
    { when: (s) => s.seq.indexOf('c5') < s.seq.indexOf('c4'), text: L(
      "Javob juftliklardan iborat, kvadrat tenglamaning ildizi esa faqat iks. Igreklarni topmasdan javob yozib bo'lmaydi.",
      'Ответ состоит из пар, а корень квадратного уравнения — только икс. Не найдя игреки, ответ записать нельзя.',
      'The answer consists of pairs, while a root of the quadratic is only an x. Without finding the y-values the answer cannot be written.') },
    { when: (s) => s.seq.indexOf('c4') < s.seq.indexOf('c3'), text: L(
      "Igrekni nimadan topasiz, agar ikslar hali topilmagan bo'lsa? Avval kvadrat tenglama yechiladi.",
      'Из чего находить игрек, если иксы ещё не найдены? Сначала решается квадратное уравнение.',
      'From what would you find y if the x-values are not found yet? The quadratic is solved first.') },
    { when: (s) => s.seq.indexOf('c3') < s.seq.indexOf('c2'), text: L(
      "Kvadrat tenglama o'z-o'zidan paydo bo'lmaydi: u ifodani ikkinchi tenglamaga qo'yishdan hosil bo'ladi.",
      'Квадратное уравнение не появляется само: оно возникает после подстановки выражения во второе уравнение.',
      'The quadratic does not appear by itself: it arises from substituting the expression into the second equation.') },
  ],
  wrongText: L(
    "Zanjirni yuqoridan pastga o'qing: har qadam o'zidan oldingisining natijasidan foydalanadimi?",
    'Прочитай цепочку сверху вниз: пользуется ли каждый шаг результатом предыдущего?',
    'Read the chain from top to bottom: does every step use the result of the one before it?'),
};

export default function D11_10(props) { return <OrderLines data={DATA} {...props} />; }
