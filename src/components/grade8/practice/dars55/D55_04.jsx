// Dars55 · Amaliyot 04 — Kod · 🟡 · tag: code_dot
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Skelet: DARS51_55_AMALIYOT_SKELET.md §7 (55-dars, 4-pozitsiya)
//
// Uch skalyar ko'paytma, o'sish tartibida:
//   (2;−1)·(3;5) = 6 − 5 = 1     manfiy koordinata natijani kichraytiradi
//   (1;2)·(3;4)  = 3 + 8 = 11
//   (0;4)·(2;3)  = 0 + 12 = 12   nol ko'paytuvchi bor, natija nol emas
// Bankdagi −1, 3, 5 — shartdagi sonlarning o'zi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'code_dot', level: '🟡',
  expr: ['(2;−1)·(3;5)', '   ', '(1;2)·(3;4)', '   ', '(0;4)·(2;3)'], exprSize: 14,
  cards: ['1', '3', '5', '11', '12', '−1'],
  answer: ['1', '11', '12'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Xonada seyf turadi, kodi uch xonali. Uch skalyar ko'paytma berilgan. Skalyar ko'paytmada mos koordinatalar ko'paytiriladi va ikki ko'paytma qo'shiladi. Diqqat: birinchisida manfiy koordinata bor, uchinchisida esa nol.",
    'В комнате сейф, код трёхзначный. Даны три скалярных произведения. В скалярном произведении соответствующие координаты перемножаются, а два произведения складываются. Внимание: в первом есть отрицательная координата, а в третьем ноль.',
    'There is a safe in the room and its code has three places. Three dot products are given. In a dot product the matching coordinates are multiplied and the two products are added. Note: the first has a negative coordinate and the third has a zero.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Uch natijani kodga o'sish tartibida yozing.",
    'Запиши три результата в код по возрастанию.',
    'Write the three results into the code in increasing order.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Birinchisi: ikki karra uch olti, minus bir karra besh minus besh, olti qo'shuv minus besh bir. Natija ikki katta sondan chiqqan bo'lsa ham kichkina — manfiy koordinata birinchi ko'paytmani deyarli yo'q qildi. Ikkinchisi: uch qo'shuv sakkiz o'n bir. Uchinchisi: nol karra ikki nol, to'rt karra uch o'n ikki, yig'indisi o'n ikki — nol ko'paytuvchi bor, lekin natija nol emas, chunki ikkinchi juftlik nolga teng emas.",
    'Верно. Первое: два на три шесть, минус один на пять минус пять, шесть плюс минус пять один. Результат вышел маленьким, хотя числа большие — отрицательная координата почти погасила первое произведение. Второе: три плюс восемь одиннадцать. Третье: ноль на два ноль, четыре на три двенадцать, вместе двенадцать — нулевой множитель есть, но результат не ноль, ведь вторая пара нулю не равна.',
    'Correct. The first: two times three is six, minus one times five is minus five, six plus minus five is one. The result came out small although the numbers are large — the negative coordinate all but cancelled the first product. The second: three plus eight is eleven. The third: zero times two is zero, four times three is twelve, together twelve — there is a zero factor, yet the result is not zero, since the second pair is not zero.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('−1') !== -1, text: L(
      "Kodga minus bir tushib qoldi. Minus bir — bu shartdagi KOORDINATA, javob emas. Birinchi ko'paytmani oxirigacha hisoblang: ikki karra uch olti, minus bir karra besh minus besh, ularni qo'shsak bir chiqadi.",
      'В код попало минус один. Минус один это КООРДИНАТА из условия, а не ответ. Досчитай первое произведение до конца: два на три шесть, минус один на пять минус пять, сложив их, получаем один.',
      'Minus one got into the code. Minus one is a COORDINATE from the conditions, not an answer. Finish computing the first product: two times three is six, minus one times five is minus five, and adding them gives one.') },
    { when: (s) => s.slots.indexOf('3') !== -1 || s.slots.indexOf('5') !== -1, text: L(
      "Kodga shartdagi sonning o'zi tushib qoldi. Uch va besh — koordinatalar, ular ko'paytirilishi va qo'shilishi kerak. Har skalyar ko'paytmada ikki ko'paytirish va bitta qo'shish bor, ya'ni uchta amal.",
      'В код попало само число из условия. Три и пять это координаты, их надо перемножить и сложить. В каждом скалярном произведении два умножения и одно сложение, то есть три действия.',
      'A number straight from the conditions got into the code. Three and five are coordinates; they must be multiplied and added. Each dot product has two multiplications and one addition, that is, three operations.') },
    { when: (s) => s.slots.indexOf('12') === -1, text: L(
      "O'n ikki tushib qoldi. Uchinchi ko'paytmada birinchi koordinata nol, va nol karra ikki nol beradi — lekin ikkinchi juftlik qoladi: to'rt karra uch o'n ikki. Nol butun natijani nolga aylantirmaydi, u faqat bitta qo'shiluvchini yo'q qiladi.",
      'Двенадцать выпало. В третьем произведении первая координата ноль, и ноль на два даёт ноль — но вторая пара остаётся: четыре на три двенадцать. Ноль не обращает весь результат в ноль, он гасит лишь одно слагаемое.',
      'Twelve is missing. In the third product the first coordinate is zero, and zero times two is zero — but the second pair remains: four times three is twelve. A zero does not turn the whole result into zero, it only cancels one summand.') },
  ],
  wrongText: L(
    "Har ko'paytmada ikki ko'paytirish va bitta qo'shish. Keyin uch sonni o'sish tartibida qo'ying.",
    'В каждом произведении два умножения и одно сложение. Потом поставь три числа по возрастанию.',
    'Each product has two multiplications and one addition. Then put the three numbers in increasing order.'),
};

export default function D55_04(props) { return <CodeLock data={DATA} {...props} />; }
