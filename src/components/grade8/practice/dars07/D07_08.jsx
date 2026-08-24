// Dars07 · Amaliyot 08 — Kod · 🔴 · tag: table_code
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Skelet: DARS07_11_AMALIYOT_SKELET.md §5 (7-dars, 8-pozitsiya)
//
// Uchta x berilgan, uchta y hisoblanadi va O'SISH tartibida yoziladi, ya'ni
// javob KETMA-KETLIK: −9, 6, 12. Bitta manfiy qiymat ataylab bor — o'sish
// tartibi manfiy sondan boshlanadi (З28 va o'sish tartibi bir joyda).
// Bankdagi uch tuzoq: 9 (minus tushdi), −6 (ishora o'rin almashdi),
// 18 (o'ttiz oltini ikkiga bo'lish — yozuvda yo'q amal).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'table_code', level: '🔴',
  expr: ['y', '=', { n: '36', d: 'x' }], exprSize: 24,
  cards: ['−9', '−6', '6', '9', '12', '18'],
  answer: ['−9', '6', '12'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Xonada seyf turadi, kodi uch xonali. Kodni funksiyaning o'zi beradi: x ga minus to'rt, uch va olti qo'yiladi.",
    'В комнате сейф, код трёхзначный. Код даёт сама функция: в x подставляются минус четыре, три и шесть.',
    'There is a safe in the room and its code has three places. The function itself gives the code: minus four, three and six are put into x.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "x = −4, x = 3 va x = 6 dagi qiymatlarni hisoblang va kodga o'sish tartibida yozing.",
    'Посчитай значения при x = −4, x = 3 и x = 6 и запиши их в код по возрастанию.',
    'Compute the values at x = −4, x = 3 and x = 6 and write them into the code in increasing order.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. O'ttiz oltini minus to'rtga bo'lsangiz minus to'qqiz, uchga bo'lsangiz o'n ikki, oltiga bo'lsangiz olti. O'sish tartibida: minus to'qqiz, olti, o'n ikki. Manfiy son har qanday musbat sondan kichik, shuning uchun u boshda turadi. Ko'paytmani tekshiring: minus to'rt karra minus to'qqiz o'ttiz olti.",
    'Верно. Тридцать шесть разделить на минус четыре — минус девять, на три — двенадцать, на шесть — шесть. По возрастанию: минус девять, шесть, двенадцать. Отрицательное число меньше любого положительного, поэтому оно первое. Проверь произведение: минус четыре на минус девять — тридцать шесть.',
    'Correct. Thirty six over minus four is minus nine, over three is twelve, over six is six. In increasing order: minus nine, six, twelve. A negative number is smaller than any positive one, so it comes first. Check the product: minus four times minus nine is thirty six.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('9') !== -1, text: L(
      "O'ttiz oltini minus to'rtga bo'lsangiz javob MANFIY chiqadi: musbat sonni manfiyga bo'lish manfiy beradi. Tekshiring: minus to'rt karra to'qqiz minus o'ttiz olti, o'ttiz olti emas.",
      'Тридцать шесть, делённое на минус четыре, даёт ОТРИЦАТЕЛЬНОЕ число: положительное на отрицательное даёт минус. Проверь: минус четыре на девять — минус тридцать шесть, а не тридцать шесть.',
      'Thirty six divided by minus four gives a NEGATIVE number: a positive divided by a negative is negative. Check: minus four times nine is minus thirty six, not thirty six.') },
    { when: (s) => s.slots.indexOf('−6') !== -1, text: L(
      "Oltiga bo'lishda ikki son ham musbat, demak javob ham musbat: o'ttiz olti bo'lingan olti arti olti. Minus olti chiqishi uchun x minus oltiga teng bo'lishi kerak edi, bunday x esa berilmagan.",
      'При делении на шесть оба числа положительные, значит и ответ положительный: тридцать шесть делить на шесть — плюс шесть. Минус шесть вышло бы при x равном минус шести, а такого x не дано.',
      'When dividing by six both numbers are positive, so the answer is positive: thirty six over six is plus six. Minus six would come from x equal to minus six, and no such x was given.') },
    { when: (s) => s.slots.indexOf('18') !== -1, text: L(
      "O'n sakkiz — o'ttiz oltining yarmi, lekin yozuvda ikkiga bo'lish yo'q. Berilgan uch qiymatni qo'yib ko'ring: minus to'rt, uch va olti. Ularning hech biri o'n sakkiz bermaydi.",
      'Восемнадцать — половина тридцати шести, но деления на два в записи нет. Подставь три данных значения: минус четыре, три и шесть. Ни одно из них не даёт восемнадцати.',
      'Eighteen is half of thirty six, but there is no division by two in the record. Substitute the three given values: minus four, three and six. None of them gives eighteen.') },
    { when: (s) => s.set, text: L(
      "Sonlar to'g'ri topilgan, tartib esa buzilgan. O'sish eng kichigidan boshlanadi, manfiy son esa har qanday musbat sondan kichik.",
      'Числа найдены верно, а порядок нет. Возрастание начинается с наименьшего, и отрицательное число меньше любого положительного.',
      'The numbers are right, the order is not. Increasing starts from the smallest, and a negative number is smaller than any positive one.') },
    { when: (s) => s.slots.indexOf('12') === -1, text: L(
      "Uchta qiymatning biri tushib qolgan: o'ttiz oltini uchga bo'lsangiz o'n ikki chiqadi. Uchala x ni ham qo'yib hisoblang.",
      'Одно из трёх значений потерялось: тридцать шесть разделить на три равно двенадцати. Подставь все три x.',
      'One of the three values is missing: thirty six over three is twelve. Substitute all three values of x.') },
  ],
  wrongText: L(
    "Uchta qiymatni alohida hisoblang, keyin ularni kichikdan kattaga qarab tartiblang. Har javobni ko'paytirib tekshiring: x karra y o'ttiz olti bo'lishi kerak.",
    'Посчитай три значения по отдельности, потом расставь их от меньшего к большему. Каждый ответ проверь умножением: x на y должно дать тридцать шесть.',
    'Compute the three values separately, then order them from smallest to largest. Check each answer by multiplying: x times y must give thirty six.'),
};

export default function D07_08(props) { return <CodeLock data={DATA} {...props} />; }
