// Dars13 · Amaliyot 08 — Tartib · 🔴 · teg: javobni-masala-tiliga-qaytarmaslik
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> OrderLines.
//
// MASALA: ikki xonali sonning raqamlari yig'indisi 12; raqamlar o'rni
// almashtirilsa, son 18 ga kamayadi.
//   (10x + y) − (10y + x) = 18  ->  9(x − y) = 18  ->  x − y = 2
//   x + y = 12 bilan birga: x = 7, y = 5, son 75.
// Tekshiruv: 75 − 57 = 18.
//
// Zanjirning oxirgi qadami ataylab «son 75» — topilgan raqamlar hali
// masalaning javobi emas, javob masala tilida yozilishi kerak.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L, OrderLines } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'javobni-masala-tiliga-qaytarmaslik', level: '🔴',
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Masala: ikki xonali sonning raqamlari yig'indisi o'n ikki; raqamlar o'rni almashtirilsa, son o'n sakkizga kamayadi. Beshta qadam aralashtirilgan.",
    'Задача: сумма цифр двузначного числа двенадцать; если цифры переставить, число уменьшится на восемнадцать. Пять шагов перемешаны.',
    'Problem: the digits of a two-digit number add to twelve; swapping the digits decreases the number by eighteen. Five steps are shuffled.'),
  ask: L('Qadamlarni to\'g\'ri tartibga soling.', 'Расставь шаги по порядку.', 'Put the steps in the right order.'),
  empty: L('Kartochkalarni tartib bilan bosing', 'Нажимай карточки по порядку', 'Tap the cards in order'),
  itemSize: 14,
  lines: [
    { id: 'c1', label: L(
      "Noma'lumlarni belgilaymiz: iks — o'nlar raqami, igrek — birlar raqami",
      'Обозначаем неизвестные: икс — цифра десятков, игрек — цифра единиц',
      'Name the unknowns: x is the tens digit, y the units digit') },
    { id: 'c2', label: L(
      'Har bir shartni tenglamaga aylantiramiz:',
      'Превращаем каждое условие в уравнение:',
      'Turn each condition into an equation:'), tokens: ['x + y = 12', ',', '9(x − y) = 18'] },
    { id: 'c3', label: L(
      'Sistemani yechamiz:',
      'Решаем систему:',
      'Solve the system:'), tokens: ['x = 7', ',', 'y = 5'] },
    { id: 'c4', label: L(
      "Topilgan raqamlarni masala shartiga qo'yib tekshiramiz:",
      'Проверяем найденные цифры по условию задачи:',
      'Check the digits found against the statement:'), tokens: ['75 − 57 = 18'] },
    { id: 'c5', label: L('Javob — izlangan son:', 'Ответ — искомое число:', 'Answer — the number sought:'), tokens: ['75'] },
  ],
  answer: ['c1', 'c2', 'c3', 'c4', 'c5'],
  correctText: L(
    "To'g'ri. Zanjir belgilashdan boshlanadi va SON bilan tugaydi, raqamlar bilan emas: iks yetti va igrek besh — bu hali javob emas, masala son haqida so'ragan. Ikkinchi shart tenglamaga aylanganda to'qqizga qisqaradi: o'n iks qo'shuv igrekdan o'n igrek qo'shuv iksni ayirsak, to'qqiz karra iks minus igrek chiqadi, ya'ni iks minus igrek ikkiga teng. Tekshiruv javobdan oldin turadi: yetmish beshdan ellik yettini ayirsak, haqiqatan o'n sakkiz.",
    'Верно. Цепочка начинается с обозначений и заканчивается ЧИСЛОМ, а не цифрами: икс семь и игрек пять — это ещё не ответ, задача спрашивала про число. Второе условие при переводе в уравнение сокращается на девять: из десять икс плюс игрек вычитаем десять игрек плюс икс и получаем девять на икс минус игрек, то есть икс минус игрек равно двум. Проверка стоит перед ответом: из семидесяти пяти вычесть пятьдесят семь — действительно восемнадцать.',
    'Correct. The chain starts with naming and ends with the NUMBER, not the digits: x is seven and y is five — that is not the answer yet, the problem asked about the number. The second condition reduces by nine when turned into an equation: subtracting ten y plus x from ten x plus y gives nine times x minus y, so x minus y is two. The check comes before the answer: seventy-five minus fifty-seven is indeed eighteen.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c2') < s.seq.indexOf('c1'), text: L(
      "Tenglamada iks va igrek turibdi, lekin ular nimani bildirishi hali aytilmagan. Belgilash birinchi qadam.",
      'В уравнении стоят икс и игрек, но ещё не сказано, что они означают. Обозначение — первый шаг.',
      'The equation uses x and y, but it has not been said what they mean. Naming is the first step.') },
    { when: (s) => s.seq.indexOf('c5') < s.seq.indexOf('c4'), text: L(
      "Javob tekshiruvdan oldin turibdi. Masalada har doim shunday xavf bor: sistema to'g'ri yechilgan bo'lsa ham, natija masala shartiga zid bo'lishi mumkin.",
      'Ответ стоит раньше проверки. В задаче всегда есть такая опасность: даже при верно решённой системе результат может противоречить условию.',
      'The answer stands before the check. In a word problem there is always this danger: even with the system solved correctly, the result may contradict the statement.') },
    { when: (s) => s.seq.indexOf('c3') < s.seq.indexOf('c2'), text: L(
      "Sistemani yechish uchun uning o'zi kerak. Shartlar tenglamaga aylanmaguncha, yechadigan narsa yo'q.",
      'Чтобы решить систему, она должна быть. Пока условия не превращены в уравнения, решать нечего.',
      'To solve a system you must have one. Until the conditions become equations there is nothing to solve.') },
    { when: (s) => s.seq.indexOf('c4') < s.seq.indexOf('c3'), text: L(
      "Tekshirish nimani tekshiradi? Avval raqamlar topilishi kerak, keyin ular shartga qo'yiladi.",
      'Что проверяет проверка? Сначала надо найти цифры, и только потом подставлять их в условие.',
      'What does the check test? The digits must be found first, and only then put into the statement.') },
  ],
  wrongText: L(
    "Zanjirni yuqoridan pastga o'qing: har qadam o'zidan oldingisining natijasidan foydalanadimi? Va oxirida masalaning savoliga javob berilganmi?",
    'Прочитай цепочку сверху вниз: пользуется ли каждый шаг результатом предыдущего? И отвечает ли последний на вопрос задачи?',
    'Read the chain from top to bottom: does every step use the result of the one before it? And does the last one answer the question asked?'),
};

export default function D13_08(props) { return <OrderLines data={DATA} {...props} />; }
