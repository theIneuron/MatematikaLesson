// Dars10 · Amaliyot 08 — Tartib · 🔴 · teg: nuqta-taxmin-emas-tekshiruv
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> OrderLines.
//
// Grafik usulning to'liq zanjiri. Muhimi: TEKSHIRUV javobdan oldin turadi —
// grafikdan o'qilgan nuqta taxmin, uni tenglamalar tasdiqlaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L, OrderLines } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'nuqta-taxmin-emas-tekshiruv', level: '🔴',
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    'Grafik usulning beshta qadami aralashtirilgan.',
    'Пять шагов графического способа перемешаны.',
    'Five steps of the graphical method are shuffled.'),
  ask: L('Qadamlarni to\'g\'ri tartibga soling.', 'Расставь шаги по порядку.', 'Put the steps in the right order.'),
  empty: L('Kartochkalarni tartib bilan bosing', 'Нажимай карточки по порядку', 'Tap the cards in order'),
  itemSize: 14,
  givenLabel: L('Sistema', 'Система', 'System'),
  given: [['y = x + 1'], ['y = x² − 1']],
  lines: [
    { id: 'c1', label: L(
      "Har bir tenglamani igrek orqali yozamiz",
      'Записываем каждое уравнение через игрек',
      'Write each equation in terms of y') },
    { id: 'c2', label: L(
      'Ikkala grafikni bitta tekislikda chizamiz',
      'Строим оба графика на одной плоскости',
      'Draw both graphs on one plane') },
    { id: 'c3', label: L(
      "Kesishishlarning koordinatalarini o'qiymiz",
      'Считываем координаты пересечений',
      'Read off the coordinates of the crossings') },
    { id: 'c4', label: L(
      'Har bir nuqtani ikkala tenglamada tekshiramiz',
      'Проверяем каждую точку в обоих уравнениях',
      'Check each point in both equations') },
    { id: 'c5', label: L('Javob:', 'Ответ:', 'Answer:'), tokens: ['(−1; 0)', 'va', '(2; 3)'] },
  ],
  answer: ['c1', 'c2', 'c3', 'c4', 'c5'],
  correctText: L(
    "To'g'ri. Grafik usulda tekshiruv javobdan OLDIN turadi, va bu tasodif emas: grafikdan o'qilgan nuqta hali taxmin — to'r chizig'iga tushgan har qanday nuqta yechim bo'lavermaydi. Faqat ikkala tenglamaga qo'yib ko'rgandan keyin u javobga aylanadi.",
    'Верно. В графическом способе проверка стоит ПЕРЕД ответом, и это не случайность: точка, прочитанная с графика, пока лишь предположение — не всякая точка, попавшая на линию сетки, решение. Ответом она становится только после подстановки в оба уравнения.',
    'Correct. In the graphical method the check comes BEFORE the answer, and that is no accident: a point read off the graph is still a guess — not every point landing on a grid line is a solution. It becomes an answer only after substitution into both equations.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c5') < s.seq.indexOf('c4'), text: L(
      "Javob tekshiruvdan oldin turibdi. Grafikdan o'qilgan nuqta hali taxmin: uni tenglamalar tasdiqlagandan keyingina javob deb yozish mumkin.",
      'Ответ стоит раньше проверки. Точка, прочитанная с графика, — пока предположение: записать её ответом можно только после того, как её подтвердят уравнения.',
      'The answer stands before the check. A point read off the graph is still a guess: it may be written as an answer only after the equations confirm it.') },
    { when: (s) => s.seq.indexOf('c3') < s.seq.indexOf('c2'), text: L(
      "Koordinatalar chizmadan o'qiladi. Grafiklar hali chizilmagan bo'lsa, nimadan o'qiysiz?",
      'Координаты считывают с чертежа. Если графики ещё не построены, с чего считывать?',
      'Coordinates are read off a drawing. If the graphs are not built yet, what would you read from?') },
    { when: (s) => s.seq.indexOf('c2') < s.seq.indexOf('c1'), text: L(
      "Grafikni chizish uchun har bir tenglama igrek orqali yozilgan bo'lishi kerak: shundagina har iksga igrek qo'yiladi.",
      'Чтобы построить график, каждое уравнение должно быть записано через игрек: только тогда каждому иксу отвечает игрек.',
      'To draw a graph each equation must be written in terms of y: only then does every x get a y.') },
    { when: (s) => s.seq.indexOf('c4') < s.seq.indexOf('c3'), text: L(
      "Tekshirish nimani tekshiradi? Avval nuqtalar o'qilishi kerak, keyin ular tenglamalarga qo'yiladi.",
      'Что проверяет проверка? Сначала точки надо считать, и только потом подставлять их в уравнения.',
      'What does the check test? The points must be read first, and only then substituted into the equations.') },
  ],
  wrongText: L(
    "Zanjirni yuqoridan pastga o'qing: har qadam o'zidan oldingisining natijasidan foydalanadimi?",
    'Прочитай цепочку сверху вниз: пользуется ли каждый шаг результатом предыдущего?',
    'Read the chain from top to bottom: does every step use the result of the one before it?'),
};

export default function D10_08(props) { return <OrderLines data={DATA} {...props} />; }
