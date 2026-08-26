// Dars25 · Amaliyot 05 — Kod · 🟡 · tag: code_boundaries
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §7 (25-dars, 5-pozitsiya)
//
// UCH TENGSIZLIK, UCH XIL QADAM:
//   2x < −6    -> musbat songa bo'lish, chegara −3
//   x + 4 ≥ 4  -> hadni ko'chirish (T3), chegara 0
//   −x > −5    -> manfiy songa ko'paytirish, chegara 5
//
// Savol ATAYLAB chegara haqida, yechim haqida emas: chegara sonini topish
// uchun tengsizlikni yechish kerak, lekin ishorani burish yoki burmaslik
// javobga ta'sir qilmaydi. Shu sababli topshiriq HISOBNI ajratib oladi.
// Bankdagi tuzoqlar: 3 va −5 — ishora almashgan chegaralar, 4 — ko'chirilmagan had.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'code_boundaries', level: '🟡',
  expr: ['2x < −6', '   ', 'x + 4 ≥ 4', '   ', '−x > −5'], exprSize: 16,
  cards: ['−5', '−3', '0', '3', '4', '5'],
  answer: ['−3', '0', '5'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Xonada seyf turadi, kodi uch xonali. Uch tengsizlikning har birida bitta chegara soni bor — x shu sondan katta yoki kichik bo'ladi.",
    'В комнате сейф, код трёхзначный. В каждом из трёх неравенств есть одно граничное число — x будет больше или меньше него.',
    'There is a safe in the room and its code has three places. Each of the three inequalities has one boundary number — x will be greater or smaller than it.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Uch chegara sonini toping va kodga o'sish tartibida yozing.",
    'Найди три граничных числа и запиши их в код по возрастанию.',
    'Find the three boundary numbers and write them into the code in increasing order.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Chegaralar: minus uch, nol va besh. Ishora burildimi yoki yo'qmi — chegara SONI o'zgarmaydi, faqat yo'nalish o'zgaradi. Uchinchisida ikkala tomon minus birga ko'paytiriladi, ikkinchisida had ko'chiriladi va ishorasini almashtiradi.",
    'Верно. Границы: минус три, нуль и пять. Перевернулся знак или нет — само граничное ЧИСЛО не меняется, меняется лишь направление. В третьем обе части умножаются на минус один, во втором член переносится и меняет знак.',
    'Correct. The boundaries: minus three, zero and five. Whether or not the sign flipped, the boundary NUMBER stays the same — only the direction changes. In the third both sides are multiplied by minus one; in the second a term moves and changes sign.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('3') !== -1, text: L(
      "Birinchi tengsizlikda chegara MINUS uch. Ikkala qismni ikkiga bo'ling: chapda x qoladi, o'ngda esa minus olti bo'lingan ikki, ya'ni minus uch. Musbat songa bo'lish sonning ishorasini o'zgartirmaydi — minus olti manfiy edi, minus uch ham manfiy.",
      'В первом неравенстве граница МИНУС три. Раздели обе части на два: слева останется x, справа минус шесть делить на два, то есть минус три. Деление на положительное знак числа не меняет — минус шесть было отрицательным, минус три тоже.',
      'In the first inequality the boundary is MINUS three. Divide both sides by two: x remains on the left, and minus six over two on the right, that is minus three. Dividing by a positive does not change the sign of the number — minus six was negative and minus three is negative too.') },
    { when: (s) => s.slots.indexOf('−5') !== -1, text: L(
      "Uchinchi tengsizlikda chegara ARTI besh. Ikkala qismni minus birga ko'paytiring: chapda minus x dan x, o'ngda minus beshdan besh chiqadi, va ishora buriladi — x beshdan kichik. Ko'paytirish ikkala tomonga ham tegishli: o'ng tomondagi son ham ishorasini almashtiradi.",
      'В третьем неравенстве граница ПЛЮС пять. Умножь обе части на минус один: слева из минус x выйдет x, справа из минус пяти — пять, и знак перевернётся — x меньше пяти. Умножение относится к обеим частям: число справа тоже меняет знак.',
      'In the third inequality the boundary is PLUS five. Multiply both sides by minus one: minus x becomes x on the left, minus five becomes five on the right, and the sign flips — x is less than five. The multiplication applies to both sides: the number on the right changes sign too.') },
    { when: (s) => s.slots.indexOf('4') !== -1, text: L(
      "To'rt — ikkinchi tengsizlikdagi son, lekin chegara u emas. To'rtni o'ng tomonga ko'chiring, u ishorasini almashtiradi: x to'rt minus to'rtdan katta yoki teng, ya'ni x noldan katta yoki teng. Chegara nol.",
      'Четыре — число из второго неравенства, но граница не оно. Перенеси четвёрку в правую часть, она поменяет знак: x больше или равен четырём минус четыре, то есть нулю. Граница — нуль.',
      'Four is a number from the second inequality, but it is not the boundary. Move the four to the right side and it changes sign: x is greater than or equal to four minus four, that is zero. The boundary is zero.') },
    { when: (s) => s.set, text: L(
      "Uch son to'g'ri topilgan, tartib esa buzilgan. Kod o'sish tartibida yoziladi: minus uch, nol, besh. Manfiy son noldan kichik, nol esa har qanday musbat sondan kichik.",
      'Три числа найдены верно, а порядок нарушен. Код пишется по возрастанию: минус три, нуль, пять. Отрицательное меньше нуля, а нуль меньше любого положительного.',
      'The three numbers are right, the order is not. The code goes in increasing order: minus three, zero, five. A negative is below zero, and zero is below any positive.') },
  ],
  wrongText: L(
    "Har tengsizlikni yeching va x qaysi sondan katta yoki kichik ekanini toping. Hadni ko'chirganda ishorasi o'zgaradi, manfiy songa ko'paytirganda esa ikkala tomon ham o'zgaradi.",
    'Реши каждое неравенство и найди, какого числа x больше или меньше. При переносе члена его знак меняется, а при умножении на отрицательное меняются обе части.',
    'Solve each inequality and find which number x is greater or smaller than. Moving a term changes its sign, and multiplying by a negative changes both sides.'),
};

export default function D25_05(props) { return <CodeLock data={DATA} {...props} />; }
