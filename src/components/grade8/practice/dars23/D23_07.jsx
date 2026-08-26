// Dars23 · Amaliyot 07 — Kod · 🟡 · tag: code_differences
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §5 (23-dars, 7-pozitsiya)
//
// UCH AYIRMA, UCH XIL SON:
//   0,5 − 0,3 = 0,2    musbat
//   −1 − 2    = −3     manfiy, ikkinchi qo'shiluvchi musbat
//   4 − 4,5   = −0,5   manfiy, o'nli kasr
//
// Bankdagi uch tuzoq — AYNAN o'sha uch ayirmaning teskarisi (З49):
// 3, 0,5 va −0,2. Ya'ni xato tanlov tasodifiy emas, u bitta yo'ldan keladi.
//
// Kod o'sish tartibida, va manfiy sonlarni tartiblash ham tekshiriladi:
// −3 −0,5 dan kichik.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'code_differences', level: '🟡',
  expr: ['0,5 − 0,3', '   ', '−1 − 2', '   ', '4 − 4,5'], exprSize: 17,
  cards: ['−3', '−0,5', '−0,2', '0,2', '0,5', '3'],
  answer: ['−3', '−0,5', '0,2'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Xonada seyf turadi, kodi uch xonali. Uchta ayirma berilgan: har birini hisoblab, natijani kodga yozish kerak.",
    'В комнате сейф, код трёхзначный. Даны три разности: каждую надо вычислить и записать результат в код.',
    'There is a safe in the room and its code has three places. Three differences are given: compute each and write the result into the code.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Uch ayirmani hisoblang va kodga o'sish tartibida yozing.",
    'Вычисли три разности и запиши их в код по возрастанию.',
    'Compute the three differences and write them into the code in increasing order.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Nol butun besh minus nol butun uch nol butun ikki — musbat. Minus bir minus ikki minus uch — manfiy. To'rt minus to'rt butun besh minus nol butun besh — manfiy. Manfiy sonlarni tartiblashda son o'qiga qarang: minus uch minus nol butun beshdan kichik.",
    'Верно. Ноль целых пять минус ноль целых три это ноль целых два — положительна. Минус один минус два это минус три — отрицательна. Четыре минус четыре целых пять это минус ноль целых пять — отрицательна. При упорядочивании отрицательных смотри на прямую: минус три меньше минус ноля целых пяти.',
    'Correct. Zero point five minus zero point three is zero point two — positive. Minus one minus two is minus three — negative. Four minus four point five is minus zero point five — negative. To order the negatives look at the line: minus three is below minus zero point five.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('3') !== -1 || s.slots.indexOf('0,5') !== -1 || s.slots.indexOf('−0,2') !== -1, text: L(
      "Bu son AYIRMA TESKARI olinganda chiqadi. Ikkinchi ayirmada minus bir birinchi turibdi: minus bir minus ikki, ya'ni minus uch — uch emas. Uchinchisida to'rt birinchi: to'rt minus to'rt butun besh minus nol butun besh. Birinchisida nol butun besh birinchi: nol butun ikki, minus nol butun ikki emas. Ayirmadagi tartib natijaning ishorasini hal qiladi.",
      'Это число выходит, если взять разность НАОБОРОТ. Во второй разности минус один стоит первым: минус один минус два, то есть минус три, а не три. В третьей первым стоит четыре: четыре минус четыре целых пять это минус ноль целых пять. В первой первым стоит ноль целых пять: ноль целых два, а не минус ноль целых два. Порядок в разности решает знак результата.',
      'That number comes from taking the difference the WRONG WAY ROUND. In the second difference minus one comes first: minus one minus two is minus three, not three. In the third, four comes first: four minus four point five is minus zero point five. In the first, zero point five comes first: zero point two, not minus zero point two. The order in a difference decides the sign of the result.') },
    { when: (s) => s.set, text: L(
      "Uch son to'g'ri hisoblangan, tartib esa buzilgan. Manfiy sonlarni tartiblashda son o'qiga qarang: minus uch minus nol butun beshdan CHAPDA turadi, ya'ni kichikroq. Moduli katta manfiy son kichikroq bo'ladi.",
      'Три числа вычислены верно, а порядок нарушен. При упорядочивании отрицательных смотри на числовую прямую: минус три ЛЕВЕЕ минус ноля целых пяти, то есть меньше. Отрицательное число с большим модулем меньше.',
      'The three numbers are computed correctly, the order is not. When ordering negatives, look at the number line: minus three lies to the LEFT of minus zero point five, so it is smaller. A negative number with a larger magnitude is smaller.') },
    { when: (s) => s.slots.indexOf('−3') === -1, text: L(
      "Kodda minus uch yo'q. Ikkinchi ayirmaga qarang: minus bir minus ikki. Manfiy sondan musbat sonni ayirsangiz, natija yanada kichikroq bo'ladi: minus bir dan ikki qadam chapga — minus uch.",
      'В коде нет минус трёх. Посмотри на вторую разность: минус один минус два. Если из отрицательного числа вычесть положительное, результат станет ещё меньше: от минус одного два шага влево — минус три.',
      'The code has no minus three. Look at the second difference: minus one minus two. Subtracting a positive from a negative makes the result even smaller: two steps left from minus one gives minus three.') },
  ],
  wrongText: L(
    "Har ayirmani yozilgan TARTIBDA hisoblang. Keyin uch natijani o'sish tartibida joylashtiring: manfiy sonlar son o'qida chapda turadi.",
    'Вычисляй каждую разность в том ПОРЯДКЕ, как она записана. Потом расставь три результата по возрастанию: отрицательные стоят левее на числовой прямой.',
    'Compute each difference in the ORDER it is written. Then arrange the three results in increasing order: negatives lie further left on the number line.'),
};

export default function D23_07(props) { return <CodeLock data={DATA} {...props} />; }
