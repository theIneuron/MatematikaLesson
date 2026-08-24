// Dars02 · Amaliyot 07 — Kod · 🟡 · tag: banned_points
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Kontent: src/books/grade8/DARS02_AMALIYOT_KONTENT_V2.md §07
//
// Ilgari bu savol `NumberLine` da turgan (o'qdagi nuqtalar, ikkita taqiq).
// Metodist qarori 2026-08-24: o'nta mexanika 1-darsdan olinadi, shuning uchun
// taqiqlar endi KOD bo'lib yoziladi va uchinchi taqiq qo'shildi — tartib ham
// talab qilinadi, ya'ni javob to'plam emas, KETMA-KETLIK.
//
// Kasr 5/(t(t − 6)) dan yasalgan: ikkala qavat t qo'shuv uchga ko'paytirilgan.
//   t = 0   ESKI taqiq (dastlabki maxrajdan)
//   t = 6   ESKI taqiq (dastlabki maxrajdan)
//   t = −3  YANGI taqiq (ko'paytuvchi olib keldi)
// O'sish tartibida: −3, 0, 6. Bankdagi uch tuzoq: 3 (t + 3 ning ishorasi),
// −6 (t − 6 ning ishorasi), 5 (suratdagi son).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'banned_points', level: '🟡',
  expr: [{ n: '5(t + 3)', d: 't(t + 3)(t − 6)' }], exprSize: 22,
  cards: ['−6', '−3', '0', '3', '5', '6'],
  answer: ['−3', '0', '6'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Xonada seyf turadi, kodi uch xonali. Bu kasr 5/(t(t − 6)) dan yasalgan: ikkala qavat t qo'shuv uchga ko'paytirilgan.",
    'В комнате сейф, код трёхзначный. Эта дробь сделана из 5/(t(t − 6)): оба этажа умножены на t плюс три.',
    'There is a safe in the room and its code has three places. This fraction is made from 5/(t(t − 6)): both floors are multiplied by t plus three.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Kasr ma'noga ega bo'lmagan qiymatlarni toping va kodga o'sish tartibida yozing.",
    'Найди значения, при которых дробь не имеет смысла, и запиши их в код по возрастанию.',
    'Find the values at which the fraction has no value and write them into the code in increasing order.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Maxraj uch ko'paytuvchidan yig'ilgan, va ko'paytma nolga aylanishi uchun bitta ko'paytuvchining nolga aylanishi kifoya: t nolda, t qo'shuv uch minus uchda, t minus olti oltida. O'sish tartibida minus uch, nol, olti. Minus uch — YANGI taqiq, uni ko'paytuvchi olib keldi; nol va olti esa dastlabki maxrajdan qolgan. Yozuvni qisqartirsangiz t qo'shuv uch ketadi, taqiq esa qolaveradi.",
    'Верно. Знаменатель собран из трёх множителей, и чтобы произведение обратилось в нуль, достаточно одного нулевого множителя: t — при нуле, t плюс три — при минус трёх, t минус шесть — при шести. По возрастанию: минус три, нуль, шесть. Минус три — НОВЫЙ запрет, его принёс множитель; нуль и шесть остались от исходного знаменателя. Если запись сократить, t плюс три уйдёт, а запрет останется.',
    'Correct. The denominator is built from three factors, and one zero factor is enough for the product to vanish: t at zero, t plus three at minus three, t minus six at six. In increasing order: minus three, zero, six. Minus three is the NEW ban brought by the factor; zero and six are left from the original denominator. Cancel the record and t plus three goes away, but the ban stays.'),
  wrongs: [
    { when: (s) => s.set, text: L(
      "Sonlar to'g'ri, tartib esa yo'q. Kod O'SISH tartibida yoziladi: minus uch noldan kichik, nol esa oltidan kichik.",
      'Числа верные, а порядок нет. Код пишется по ВОЗРАСТАНИЮ: минус три меньше нуля, нуль меньше шести.',
      'The numbers are right, the order is not. The code is written in INCREASING order: minus three is less than zero, zero is less than six.') },
    { when: (s) => s.slots.indexOf('3') !== -1, text: L(
      "t qo'shuv uch nolga uchda emas, MINUS uchda aylanadi: uchda u oltiga teng. Tenglamani yechib ko'ring.",
      't плюс три обращается в нуль не при трёх, а при МИНУС трёх: при трёх он равен шести. Реши уравнение.',
      't plus three becomes zero not at three but at MINUS three: at three it equals six. Solve the equation.') },
    { when: (s) => s.slots.indexOf('−6') !== -1, text: L(
      "t minus olti nolga ARTI oltida aylanadi: minus oltida u minus o'n ikkiga teng. Ishorani qo'yib tekshiring.",
      't минус шесть обращается в нуль при ПЛЮС шести: при минус шести он равен минус двенадцати. Проверь знак подстановкой.',
      't minus six becomes zero at PLUS six: at minus six it equals minus twelve. Check the sign by substituting.') },
    { when: (s) => s.slots.indexOf('5') !== -1, text: L(
      "Besh — surat, maxraj emas. Suratdagi son taqiq bermaydi: kasr faqat chiziq TAGI nolga aylanganda ma'noga ega bo'lmaydi.",
      'Пять — это числитель, а не знаменатель. Число сверху запрета не даёт: дробь не имеет смысла только там, где обращается в нуль то, что ПОД чертой.',
      'Five is the numerator, not the denominator. A number above the bar gives no ban: a fraction has no value only where what is BELOW the bar becomes zero.') },
  ],
  wrongText: L(
    "Maxrajga ko'paytuvchilar bo'yicha qarang: uchta ko'paytuvchi — uchta taqiq. Har birini alohida nolga tenglang, keyin sonlarni o'sish tartibida yozing.",
    'Смотри на знаменатель по множителям: три множителя — три запрета. Приравняй каждый к нулю по отдельности, потом запиши числа по возрастанию.',
    'Look at the denominator factor by factor: three factors mean three bans. Set each to zero separately, then write the numbers in increasing order.'),
};

export default function D02_07(props) { return <CodeLock data={DATA} {...props} />; }
