// Dars04 · Amaliyot 05 — Kod · 🟡 · tag: bans_three_denoms
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Kontent: src/books/grade8/DARS04_AMALIYOT_KONTENT_V2.md §05
//
// Metodist qarori 2026-08-24: o'nta mexanika 1-darsdan olinadi. Ilgari bu
// o'rinda `OrderLines` turgan (u endi 08 da), taqiqlar esa `NumberLine` da
// so'ralardi (u endi shu yerda, kod bo'lib).
//
// UCH qo'shiluvchi — uch maxraj — uch taqiq. Yig'indi faqat uchala
// qo'shiluvchi ham mavjud bo'lgan joyda mavjud, shuning uchun bitta maxrajni
// unutish javobni buzadi. O'sish tartibida: −5, 0, 3.
// Bankdagi uch tuzoq: −3 va 5 (ishora), 2 (yozuvdagi son).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'bans_three_denoms', level: '🟡',
  expr: [{ n: '1', d: 'w' }, '+', { n: '2', d: 'w − 3' }, '−', { n: '5', d: 'w + 5' }], exprSize: 20,
  cards: ['−5', '−3', '0', '2', '3', '5'],
  answer: ['−5', '0', '3'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Xonada seyf turadi, kodi uch xonali. Ifodada uchta kasr bor, va har birining o'z maxraji.",
    'В комнате сейф, код трёхзначный. В выражении три дроби, и у каждой свой знаменатель.',
    'There is a safe in the room and its code has three places. The expression has three fractions, each with its own denominator.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Ifoda ma'noga ega bo'lmagan qiymatlarni toping va kodga o'sish tartibida yozing.",
    'Найди значения, при которых выражение не имеет смысла, и запиши их в код по возрастанию.',
    'Find the values at which the expression has no value and write them into the code in increasing order.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Yig'indi va ayirma faqat hamma qo'shiluvchi mavjud bo'lgan joyda mavjud, shuning uchun har maxraj alohida nolga tenglanadi: w nolda, w minus uch uchda, w qo'shuv besh minus beshda. O'sish tartibida minus besh, nol, uch. Uchtasidan bittasini unutsangiz, javob o'sha nuqtada yolg'on bo'ladi.",
    'Верно. Сумма и разность существуют только там, где существуют все слагаемые, поэтому каждый знаменатель приравнивают к нулю по отдельности: w — при нуле, w минус три — при трёх, w плюс пять — при минус пяти. По возрастанию: минус пять, нуль, три. Забудешь одно из трёх — и в этой точке ответ станет ложным.',
    'Correct. A sum or difference exists only where every summand exists, so each denominator is set to zero on its own: w at zero, w minus three at three, w plus five at minus five. In increasing order: minus five, zero, three. Forget one of the three and the answer becomes false at that point.'),
  wrongs: [
    { when: (s) => s.set, text: L(
      "Sonlar to'g'ri, tartib esa yo'q. Kod O'SISH tartibida yoziladi: minus besh noldan kichik, nol esa uchdan kichik.",
      'Числа верные, а порядок нет. Код пишется по ВОЗРАСТАНИЮ: минус пять меньше нуля, нуль меньше трёх.',
      'The numbers are right, the order is not. The code is written in INCREASING order: minus five is less than zero, zero is less than three.') },
    { when: (s) => s.slots.indexOf('5') !== -1 || s.slots.indexOf('−3') !== -1, text: L(
      "Ishorani tekshiring: w qo'shuv besh nolga MINUS beshda aylanadi, w minus uch esa ARTI uchda. Ikkalasini qo'yib ko'ring.",
      'Проверь знак: w плюс пять обращается в нуль при МИНУС пяти, а w минус три — при ПЛЮС трёх. Подставь оба.',
      'Check the sign: w plus five becomes zero at MINUS five, and w minus three at PLUS three. Substitute both.') },
    { when: (s) => s.slots.indexOf('2') !== -1, text: L(
      "Ikki — suratdagi son, maxraj emas. Chiziq USTIDAGI son taqiq bermaydi: faqat chiziq TAGI nolga aylanganda kasr yo'qoladi.",
      'Двойка — это числитель, а не знаменатель. Число НАД чертой запрета не даёт: дробь исчезает только там, где обращается в нуль то, что ПОД чертой.',
      'Two is a numerator, not a denominator. A number ABOVE the bar gives no ban: a fraction disappears only where what is BELOW the bar becomes zero.') },
    { when: (s) => s.slots.indexOf('0') === -1, text: L(
      "Birinchi kasrning maxraji — w ning o'zi, va u nolda nolga aylanadi. Yalang'och harf ham maxraj: uni ham hisobga oling.",
      'Знаменатель первой дроби — сама w, и она обращается в нуль при нуле. Одинокая буква — тоже знаменатель: её тоже надо учесть.',
      'The denominator of the first fraction is w itself, and it becomes zero at zero. A bare letter is a denominator too: count it as well.') },
  ],
  wrongText: L(
    "Har qo'shiluvchining maxrajini alohida nolga tenglang: uchta maxraj — uchta taqiq. Keyin sonlarni o'sish tartibida yozing.",
    'Приравняй к нулю знаменатель каждого слагаемого по отдельности: три знаменателя — три запрета. Потом запиши числа по возрастанию.',
    'Set the denominator of each summand to zero separately: three denominators mean three bans. Then write the numbers in increasing order.'),
};

export default function D04_05(props) { return <CodeLock data={DATA} {...props} />; }
