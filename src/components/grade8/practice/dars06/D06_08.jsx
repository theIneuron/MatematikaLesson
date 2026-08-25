// Dars06 · Amaliyot 08 — Kod · 🔴 · tag: hidden_conditions
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Kontent: src/books/grade8/DARS06_AMALIYOT_KONTENT_V2.md §08
//
// Ilgari bu savol 07-o'rinda va `NumberLine` da turgan. Metodist qarori
// 2026-08-24: o'nta mexanika 1-darsdan olinadi, shuning uchun taqiqlar KOD
// bo'lib yoziladi va TARTIB ham talab qilinadi.
//
// 1/p + 1/(p − 5) : (2/(p + 1)). Taqiq UCH joydan keladi:
//   p ≠ 0    birinchi qo'shiluvchining maxrajidan
//   p ≠ 5    ikkinchi kasrning maxrajidan
//   p ≠ −1   BO'LUVCHINING maxrajidan — ag'dargandan keyin u yuqoriga
//            ko'chadi va javobda umuman ko'rinmaydi (З2)
// O'sish tartibida: −1, 0, 5. Bankdagi uch tuzoq: 1 va −5 (ishora),
// 2 (bo'luvchining surati, u o'zgarmas son).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'hidden_conditions', level: '🔴',
  expr: [{ n: '1', d: 'p' }, '+', { n: '1', d: 'p − 5' }, ':', { n: '2', d: 'p + 1' }], exprSize: 18,
  cards: ['−5', '−1', '0', '1', '2', '5'],
  answer: ['−1', '0', '5'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Xonada seyf turadi, kodi uch xonali. Ifodada qo'shish ham, bo'lish ham bor — demak maxrajlar bir nechta joyda turadi.",
    'В комнате сейф, код трёхзначный. В выражении есть и сложение, и деление — значит знаменатели стоят в нескольких местах.',
    'There is a safe in the room and its code has three places. The expression has both an addition and a division, so denominators stand in several places.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Ifoda ma'noga ega bo'lmagan qiymatlarni toping va kodga o'sish tartibida yozing.",
    'Найди значения, при которых выражение не имеет смысла, и запиши их в код по возрастанию.',
    'Find the values at which the expression has no value and write them into the code in increasing order.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Nol va besh ochiq turgan ikki maxrajdan keladi: p va p minus besh. Minus bir esa BO'LUVCHINING maxrajidan: dastlabki yozuvda p qo'shuv bir chiziq tagida turibdi, ya'ni minus birda bo'luvchining o'zi mavjud emas. Ag'dargandan keyin u yuqoriga ko'chadi va javobda ko'rinmay qoladi — lekin taqiq kuchida qolaveradi. O'sish tartibida: minus bir, nol, besh.",
    'Верно. Нуль и пять приходят из двух явных знаменателей: p и p минус пять. А минус один — из знаменателя ДЕЛИТЕЛЯ: в исходной записи p плюс один стоит под чертой, значит при минус одном самого делителя не существует. После переворота он уходит наверх и в ответе не виден — но запрет остаётся в силе. По возрастанию: минус один, нуль, пять.',
    'Correct. Zero and five come from the two visible denominators: p and p minus five. Minus one comes from the DIVISOR\'s denominator: in the original record p plus one stands below the bar, so at minus one the divisor itself does not exist. After flipping it moves up and becomes invisible in the answer — but the ban stays in force. In increasing order: minus one, zero, five.'),
  wrongs: [
    { when: (s) => s.set, text: L(
      "Sonlar to'g'ri, tartib esa yo'q. Kod O'SISH tartibida yoziladi: minus bir noldan kichik, nol esa beshdan kichik.",
      'Числа верные, а порядок нет. Код пишется по ВОЗРАСТАНИЮ: минус один меньше нуля, нуль меньше пяти.',
      'The numbers are right, the order is not. The code is written in INCREASING order: minus one is less than zero, zero is less than five.') },
    { when: (s) => s.slots.indexOf('−1') === -1, text: L(
      "Minus bir yetishmayapti. Uni javobdan topib bo'lmaydi: u yerda p qo'shuv bir SURATDA turadi. Taqiqni DASTLABKI yozuvdan izlang — u yerda p qo'shuv bir bo'luvchining maxraji.",
      'Не хватает минус одного. По ответу его не найти: там p плюс один стоит в ЧИСЛИТЕЛЕ. Ищи запрет в ИСХОДНОЙ записи — там p плюс один это знаменатель делителя.',
      'Minus one is missing. You cannot find it from the answer: there p plus one is in the NUMERATOR. Look for the ban in the ORIGINAL record — there p plus one is the divisor\'s denominator.') },
    { when: (s) => s.slots.indexOf('1') !== -1 || s.slots.indexOf('−5') !== -1, text: L(
      "Ishorani tekshiring: p qo'shuv bir nolga MINUS birda aylanadi, p minus besh esa ARTI beshda. Ikkalasini qo'yib ko'ring.",
      'Проверь знак: p плюс один обращается в нуль при МИНУС одном, а p минус пять — при ПЛЮС пяти. Подставь оба.',
      'Check the sign: p plus one becomes zero at MINUS one, and p minus five at PLUS five. Substitute both.') },
    { when: (s) => s.slots.indexOf('2') !== -1, text: L(
      "Ikki — bo'luvchining surati va u o'zgarmas son: hech qanday p da nolga aylanmaydi. Bu yerda «bo'luvchi nolga teng» degan holat yo'q.",
      'Двойка — числитель делителя, и это постоянное число: ни при каком p он в нуль не обращается. Случая «делитель равен нулю» здесь нет.',
      'Two is the numerator of the divisor and it is a constant: it never becomes zero for any p. There is no "divisor equals zero" case here.') },
  ],
  wrongText: L(
    "Yozuvdagi HAR BIR maxrajni sanang va har birini nolga tenglang. Shartni tayyor javobdan yig'ib bo'lmaydi: ba'zi taqiqlar u yerda ko'rinmaydi.",
    'Пересчитай КАЖДЫЙ знаменатель в записи и приравняй каждый к нулю. По готовому ответу условие не собрать: часть запретов там не видна.',
    'Count EVERY denominator in the record and set each to zero. The condition cannot be collected from the finished answer: some bans are invisible there.'),
};

export default function D06_08(props) { return <CodeLock data={DATA} {...props} />; }
