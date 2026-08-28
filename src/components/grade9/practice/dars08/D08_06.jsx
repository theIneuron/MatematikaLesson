// Dars08 · Amaliyot 06 — Taqiq · 🟡 · teg: maxraj-nolga-teng
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> DomainAxis,
// `point` rejimida.
//
// Nuqta BO'SH: ODZ dan chiqarib tashlangan son javobga kirmaydi. Bu
// 07-darsdagi `point` topshirig'iga qarama-qarshi — u yerda ildiz edi va
// nuqta bo'yalgan edi. Ikki holatning farqi razborda aytiladi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { DomainAxis } from '../asboblar9.jsx';

const DATA = {
  tag: 'maxraj-nolga-teng', level: '🟡',
  eyebrow: L('Taqiq', 'Запрет', 'Ban'),
  setup: L(
    "Kasr-ratsional tenglamani yechishdan oldin ODZ yoziladi.",
    'Перед решением дробно-рационального уравнения выписывают ОДЗ.',
    'Before solving a fractional equation the domain is written down.'),
  ask: L(
    "ODZ dan chiqarib tashlangan sonni o'qda belgilang.",
    'Отметь на оси число, исключённое из ОДЗ.',
    'Mark on the axis the number excluded from the domain.'),
  expr: [{ n: '5', d: 'x − 4' }, '= 1'],
  mode: 'point',
  axis: { from: -2, to: 9 },
  answer: { at: 4, closed: false },
  closedLabel: L('Bo\'yalgan', 'Закрашенная', 'Filled'),
  openLabel: L('Bo\'sh', 'Пустая', 'Hollow'),
  correctText: L(
    "To'g'ri. Maxraj to'rtda nolga aylanadi, shuning uchun to'rt ODZ dan chiqariladi va nuqta BO'SH qoladi. E'tibor bering: ildizni belgilaganda nuqta bo'yalgan bo'lardi — u javobga kiradi. Bu yerda esa aksincha, chiqarib tashlangan son so'ralyapti.",
    'Верно. Знаменатель обращается в нуль при четырёх, поэтому четвёрка исключается из ОДЗ и точка остаётся ПУСТОЙ. Обрати внимание: если бы отмечали корень, точка была бы закрашена — он в ответ входит. А здесь наоборот, спрашивают исключённое число.',
    'Correct. The denominator becomes zero at four, so four is excluded from the domain and the point stays HOLLOW. Note the contrast: marking a root, the point would be filled — a root belongs to the answer. Here the excluded number is asked for instead.'),
  wrongs: [
    { when: (s) => s.atOk && !s.closedOk, text: L(
      "Chegara topildi, lekin nuqta bo'yaldi. Bo'yalgan nuqta «bu son javobga kiradi» degani. Bu yerda esa son ODZ dan CHIQARILGAN.",
      'Граница найдена, но точка закрашена. Закрашенная точка означает «это число входит в ответ». А здесь число из ОДЗ ИСКЛЮЧЕНО.',
      'The boundary is found, but the point was filled. A filled point means "this number belongs". Here the number is EXCLUDED from the domain.') },
    { when: (s) => s.at === 5, text: L(
      "Besh — suratdagi son, u ODZ ga ta'sir qilmaydi. Taqiq faqat maxrajdan chiqadi.",
      'Пятёрка — число из числителя, на ОДЗ она не влияет. Запрет берётся только из знаменателя.',
      'Five is the number from the numerator; it does not affect the domain. The ban comes from the denominator only.') },
    { when: (s) => s.at === 9, text: L(
      "To'qqiz — tenglamaning ildizi, taqiq emas. Savol ODZ dan chiqarilgan son haqida.",
      'Девятка — корень уравнения, а не запрет. Спрашивают число, исключённое из ОДЗ.',
      'Nine is the root of the equation, not the ban. The question is about the number excluded from the domain.') },
    { when: (s) => !s.atOk, text: L(
      "Maxrajni nolga tenglashtiring: iks minus to'rt nolga teng bo'lsa, iks nimaga teng?",
      'Приравняй знаменатель к нулю: если икс минус четыре равно нулю, чему равен икс?',
      'Set the denominator to zero: if x minus four is zero, what does x equal?') },
  ],
  wrongText: L(
    "Ikki savol: maxraj qaysi sonda nolga aylanadi, va o'sha son javobga kiradimi yoki chiqariladimi?",
    'Два вопроса: при каком числе знаменатель обращается в нуль и входит ли это число в ответ или исключается?',
    'Two questions: at which number does the denominator become zero, and does that number belong to the answer or is it excluded?'),
};

export default function D08_06(props) { return <DomainAxis data={DATA} {...props} />; }
