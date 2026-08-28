// Dars17 · Amaliyot 10 — Tartib · 🔴 · teg: maxrajga-korpaytirib-yechish
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> OrderLines.
//
// MATEMATIKA: (x − 5)/(x + 1) > 0. Nol nuqtalar: 5 (surat), −1 (maxraj).
// Oltini qo'yamiz: bir bo'lingan yetti — musbat. Chapga qarab almashadi:
//   x > 5       musbat
//   −1 < x < 5  manfiy
//   x < −1      musbat
// Javob: x < −1 yoki x > 5. Ikkala chegara ham ochiq: biri qat'iy belgi
// sababli, ikkinchisi maxraj noli bo'lgani uchun.
//
// Zanjir maxrajga ko'paytirish YO'LINI umuman ishlatmaydi — bu darsning
// birinchi tasdig'i.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L, OrderLines } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'maxrajga-korpaytirib-yechish', level: '🔴',
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Kasr tengsizlikni yechishning beshta qadami aralashtirilgan. Maxrajga ko'paytirish qadami yo'q — u ataylab ishlatilmaydi.",
    'Пять шагов решения дробного неравенства перемешаны. Шага с умножением на знаменатель нет — он намеренно не используется.',
    'Five steps of solving a fractional inequality are shuffled. There is no step that multiplies by the denominator — it is deliberately not used.'),
  ask: L('Qadamlarni to\'g\'ri tartibga soling.', 'Расставь шаги по порядку.', 'Put the steps in the right order.'),
  empty: L('Kartochkalarni tartib bilan bosing', 'Нажимай карточки по порядку', 'Tap the cards in order'),
  itemSize: 14,
  givenLabel: L('Tengsizlik', 'Неравенство', 'Inequality'),
  given: [['(x − 5)/(x + 1) > 0']],
  lines: [
    { id: 'c1', label: L(
      'Surat va maxrajning nollarini topamiz:',
      'Находим нули числителя и знаменателя:',
      'Find the zeros of the numerator and denominator:'), tokens: ['5', ',', '−1'] },
    { id: 'c2', label: L(
      "Ikkala nolni ham o'qqa qo'yamiz: maxraj noli har doim ochiq",
      'Наносим оба нуля на ось: нуль знаменателя всегда пустой',
      'Put both zeros on the axis: the denominator zero is always hollow') },
    { id: 'c3', label: L(
      "Eng o'ng oraliqqa son qo'yamiz:",
      'Подставляем число в самый правый промежуток:',
      'Substitute a number into the rightmost interval:'), tokens: ['x = 6', ':', '1/7 > 0'] },
    { id: 'c4', label: L(
      "Chapga qarab har nuqtada ishorani almashtiramiz",
      'Влево в каждой точке меняем знак',
      'Alternate the sign leftwards at each point') },
    { id: 'c5', label: L('Javob:', 'Ответ:', 'Answer:'), tokens: ['x < −1', 'yoki', 'x > 5'] },
  ],
  answer: ['c1', 'c2', 'c3', 'c4', 'c5'],
  correctText: L(
    "To'g'ri. Zanjirda maxrajga ko'paytirish qadami umuman yo'q, va bu ataylab: maxrajning ishorasi noma'lum. Buning o'rniga ikkala nol nuqta o'qqa qo'yiladi, ishora bitta son bilan aniqlanadi va chapga qarab almashtiriladi. Javobdagi ikkala chegara ham ochiq, lekin sabablari boshqa: besh — surat noli, u qat'iy belgi sababli chiqarilgan; minus bir — maxraj noli, u har doim chiqariladi.",
    'Верно. В цепочке нет шага с умножением на знаменатель, и это намеренно: знак знаменателя неизвестен. Вместо этого обе нулевые точки наносят на ось, знак определяют одной подстановкой и чередуют влево. Обе границы в ответе пустые, но по разным причинам: пять — нуль числителя, исключён из-за строгого знака; минус один — нуль знаменателя, он исключается всегда.',
    'Correct. The chain has no step that multiplies by the denominator, and that is deliberate: the denominator\'s sign is unknown. Instead both zero points go on the axis, the sign is fixed by one substitution and alternated leftwards. Both boundaries in the answer are hollow, but for different reasons: five is a numerator zero, excluded because the sign is strict; minus one is a denominator zero, and that is always excluded.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c2') < s.seq.indexOf('c1'), text: L(
      "O'qqa nima qo'yiladi, agar nollar hali topilmagan bo'lsa? Avval surat va maxraj alohida nolga tenglashtiriladi.",
      'Что наносить на ось, если нули ещё не найдены? Сначала числитель и знаменатель по отдельности приравнивают к нулю.',
      'What would you put on the axis if the zeros are not found yet? The numerator and denominator are set to zero separately first.') },
    { when: (s) => s.seq.indexOf('c3') < s.seq.indexOf('c2'), text: L(
      "«Eng o'ng oraliq» degan gap o'qda nuqtalar turgandan keyin ma'noga ega bo'ladi: oraliqlarni aynan o'sha nuqtalar hosil qiladi.",
      'Слова «самый правый промежуток» обретают смысл только после того, как точки на оси: именно они и создают промежутки.',
      'The phrase "the rightmost interval" makes sense only once the points are on the axis: it is they that create the intervals.') },
    { when: (s) => s.seq.indexOf('c4') < s.seq.indexOf('c3'), text: L(
      "Nimani almashtiramiz, agar birorta oraliqning ishorasi hali ma'lum bo'lmasa? Almashtirish uchun boshlang'ich ishora kerak, u esa son qo'yishdan chiqadi.",
      'Что менять, если знак ни одного промежутка ещё не известен? Для чередования нужен начальный знак, а он выходит из подстановки числа.',
      'What would you alternate if no interval has a known sign yet? Alternating needs a starting sign, and that comes from substituting a number.') },
    { when: (s) => s.seq.indexOf('c5') < s.seq.indexOf('c4'), text: L(
      "Javob barcha oraliqlarning ishorasi ma'lum bo'lgandan keyin yoziladi. Bu yerda musbat oraliqlar ikkita, va ularning ikkalasi ham javobga kiradi.",
      'Ответ пишут после того, как знаки всех промежутков известны. Здесь положительных промежутков два, и оба входят в ответ.',
      'The answer is written once the signs of all intervals are known. Here there are two positive intervals, and both belong to the answer.') },
  ],
  wrongText: L(
    "Zanjirni yuqoridan pastga o'qing: har qadam o'zidan oldingisining natijasidan foydalanadimi?",
    'Прочитай цепочку сверху вниз: пользуется ли каждый шаг результатом предыдущего?',
    'Read the chain from top to bottom: does every step use the result of the one before it?'),
};

export default function D17_10(props) { return <OrderLines data={DATA} {...props} />; }
