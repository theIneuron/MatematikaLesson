// Dars01 · Amaliyot 07 — Kod · 🟡 · tag: code_bans
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock (yangi, 24-tip).
// Kontent: src/books/grade8/DARS01_AMALIYOT_KONTENT.md §07
//
// Ko'paytma nolga aylanadi, agar bitta ko'paytuvchi nolga aylansa: uchta
// ko'paytuvchi — uchta taqiq. Kod O'SISH tartibida yoziladi, ya'ni javob
// KETMA-KETLIK: −2, 0, 4.
// Bankdagi uch tuzoq: 2 (2a + 4 ning ishorasi), −4 (12 − 3a ning ishorasi),
// 12 (yozuvdagi son). Syujet bir gap: 7-sinf qarori — sahna yozuvning o'zi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'code_bans', level: '🟡',
  expr: [{ n: '5', d: 'a(2a + 4)(12 − 3a)' }], exprSize: 22,
  cards: ['−4', '−2', '0', '2', '4', '12'],
  answer: ['−2', '0', '4'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Xonada seyf turadi, kodi uch xonali. Kodni yozuvning o'zi beradi: maxraj uchta ko'paytuvchidan yig'ilgan.",
    'В комнате сейф, код трёхзначный. Код даёт сама запись: знаменатель собран из трёх множителей.',
    'There is a safe in the room and its code has three places. The record itself gives the code: the denominator is built from three factors.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Kasr qaysi qiymatlarda ma'noga ega emasligini toping va kodga o'sha sonlarni o'sish tartibida yozing.",
    'Найди, при каких значениях дробь не имеет смысла, и запиши эти числа в код по возрастанию.',
    'Find the values at which the fraction has no value and write those numbers into the code in increasing order.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Ko'paytma nolga aylanishi uchun bitta ko'paytuvchining nolga aylanishi kifoya. a nolda, ikki a qo'shuv to'rt minus ikkida, o'n ikki minus uch a esa to'rtda. O'sish tartibida: minus ikki, nol, to'rt. Har birini qo'yib ko'ring — maxraj nolga aylanadi.",
    'Верно. Чтобы произведение обратилось в нуль, достаточно одного нулевого множителя. a — при нуле, два a плюс четыре — при минус двух, двенадцать минус три a — при четырёх. По возрастанию: минус два, нуль, четыре. Подставь каждое — знаменатель обращается в нуль.',
    'Correct. One zero factor is enough for the product to become zero. a at zero, two a plus four at minus two, twelve minus three a at four. In increasing order: minus two, zero, four. Substitute each and the denominator becomes zero.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('2') !== -1, text: L(
      "Ikki a qo'shuv to'rt nolga ikkida emas, MINUS ikkida aylanadi: ikkida u sakkizga teng. Tenglamani yechib ko'ring.",
      'Два a плюс четыре обращается в нуль не при двух, а при МИНУС двух: при двух он равен восьми. Реши уравнение.',
      'Two a plus four becomes zero not at two but at MINUS two: at two it equals eight. Solve the equation.') },
    { when: (s) => s.slots.indexOf('−4') !== -1, text: L(
      "O'n ikki minus uch a nolga ARTI to'rtda aylanadi: minus to'rtda u yigirma to'rtga teng. Ishorani qo'yib tekshiring.",
      'Двенадцать минус три a обращается в нуль при ПЛЮС четырёх: при минус четырёх он равен двадцати четырём. Проверь знак подстановкой.',
      'Twelve minus three a becomes zero at PLUS four: at minus four it equals twenty four. Check the sign by substituting.') },
    { when: (s) => s.slots.indexOf('12') !== -1, text: L(
      "O'n ikki — yozuvdagi son, ildiz emas. O'n ikkida bu ko'paytuvchi o'n ikki minus o'ttiz olti, ya'ni minus yigirma to'rt bo'ladi.",
      'Двенадцать — число из записи, а не корень. При двенадцати этот множитель равен двенадцать минус тридцать шесть, то есть минус двадцать четыре.',
      'Twelve is a number from the record, not a root. At twelve this factor is twelve minus thirty six, that is minus twenty four.') },
    { when: (s) => s.set, text: L(
      "Sonlar to'g'ri topilgan, tartib esa buzilgan. O'sish tartibi eng kichigidan boshlanadi, va manfiy son noldan kichik.",
      'Числа найдены верно, а порядок нет. Возрастание начинается с наименьшего, и отрицательное число меньше нуля.',
      'The numbers are right, the order is not. Increasing starts from the smallest, and a negative number is smaller than zero.') },
    { when: (s) => s.slots.indexOf('0') === -1, text: L(
      "Birinchi ko'paytuvchi — a ning o'zi. U nolda nolga aylanadi, ya'ni nol ham kodning bir raqami.",
      'Первый множитель — сама a. Она обращается в нуль при нуле, значит нуль тоже цифра кода.',
      'The first factor is a itself. It becomes zero at zero, so zero is one of the code digits too.') },
  ],
  wrongText: L(
    "Uch ko'paytuvchining har birini alohida nolga tenglang. Uch yechim chiqadi — ularni kichikdan kattaga qarab yozing.",
    'Приравняй к нулю каждый из трёх множителей по отдельности. Выйдут три решения — запиши их от меньшего к большему.',
    'Set each of the three factors to zero separately. Three solutions come out — write them from smallest to largest.'),
};

export default function D01_07(props) { return <CodeLock data={DATA} {...props} />; }
