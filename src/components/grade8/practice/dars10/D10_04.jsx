// Dars10 · Amaliyot 04 — Kod · 🟡 · tag: code_modulus
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Skelet: DARS07_11_AMALIYOT_SKELET.md §8 (10-dars, 4-pozitsiya)
//
// Bitta yozuv, uch qiymat: a manfiy, nol va musbat. Javoblar nol, besh va
// sakkiz — hammasi NOMANFIY, chunki kvadratdan olingan ildiz modulni beradi.
// Bankdagi tuzoqlar:
//   −5, −8 — З31, modul tushib qoldi;
//   25     — kvadrat qoldi, ildiz olinmadi.
// O'sish tartibi bu yerda qo'shimcha ish emas: javoblar allaqachon nomanfiy,
// demak asosiy ish — minusni to'g'ri yo'qotish.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'code_modulus', level: '🟡',
  expr: [{ r: 'a²' }], exprSize: 34,
  cards: ['−8', '−5', '0', '5', '8', '25'],
  answer: ['0', '5', '8'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Seyfning kodi uch xonali. Bitta yozuvga uch qiymat qo'yiladi: a = −5, a = 0 va a = 8.",
    'Код сейфа трёхзначный. В одну запись подставляются три значения: a = −5, a = 0 и a = 8.',
    'The safe code has three places. Three values go into one record: a = −5, a = 0 and a = 8.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Uch qiymatni hisoblang va kodga o'sish tartibida yozing.",
    'Посчитай три значения и запиши их в код по возрастанию.',
    'Compute the three values and write them into the code in increasing order.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Uchtasida ham ikki amal ketma-ket bajarildi. Minus beshda: kvadrati yigirma besh, ildizi besh. Nolda: kvadrati nol, ildizi nol. Sakkizda: kvadrati oltmish to'rt, ildizi sakkiz. Uch javob ham nomanfiy — kvadratdan olingan ildiz modulni beradi, shuning uchun manfiy son kirib chiqib musbat bo'lib qaytadi. O'sish tartibida: nol, besh, sakkiz.",
    'Верно. Везде выполнены два действия подряд. При минус пяти: квадрат двадцать пять, корень пять. При нуле: квадрат нуль, корень нуль. При восьми: квадрат шестьдесят четыре, корень восемь. Все три ответа неотрицательны — корень из квадрата даёт модуль, поэтому отрицательное число входит и выходит положительным. По возрастанию: нуль, пять, восемь.',
    'Correct. In all three the two actions ran in order. At minus five: the square is twenty five and the root is five. At zero: the square is zero and the root is zero. At eight: the square is sixty four and the root is eight. All three answers are non-negative — the root of a square gives the modulus, so a negative number goes in and comes out positive. In increasing order: zero, five, eight.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('−5') !== -1 || s.slots.indexOf('−8') !== -1, text: L(
      "Minus javobga o'tib ketdi, lekin uni kvadrat yo'q qiladi. Minus beshni qo'ying: kvadrati yigirma besh, va yigirma besh musbat. Musbat sondan olingan arifmetik ildiz manfiy bo'lmaydi.",
      'Минус перешёл в ответ, а его убивает квадрат. Подставь минус пять: квадрат двадцать пять, и двадцать пять положительно. Арифметический корень из положительного числа не бывает отрицательным.',
      'The minus slipped into the answer, but the square destroys it. Substitute minus five: the square is twenty five, and twenty five is positive. An arithmetic root of a positive number is never negative.') },
    { when: (s) => s.slots.indexOf('25') !== -1, text: L(
      "Yigirma besh — kvadratning natijasi, ildiz esa hali olinmadi. Yigirma beshdan ildiz besh: besh karra besh yigirma besh.",
      'Двадцать пять — результат квадрата, а корень ещё не взят. Корень из двадцати пяти пять: пять на пять двадцать пять.',
      'Twenty five is the result of the square, and the root has not been taken yet. The root of twenty five is five: five times five is twenty five.') },
    { when: (s) => s.set, text: L(
      "Sonlar to'g'ri topilgan, tartib esa buzilgan. O'sish eng kichigidan boshlanadi: nol, besh, sakkiz.",
      'Числа найдены верно, а порядок нет. Возрастание начинается с наименьшего: нуль, пять, восемь.',
      'The numbers are right, the order is not. Increasing starts from the smallest: zero, five, eight.') },
    { when: (s) => s.slots.indexOf('0') === -1, text: L(
      "Nol tushib qolgan. Nolni qo'ying: kvadrati nol, noldan ildiz esa nolga teng. Nol nomanfiy son, ya'ni ildizi bor.",
      'Нуль потерялся. Подставь нуль: квадрат нуль, а корень из нуля равен нулю. Нуль неотрицательное число, значит корень у него есть.',
      'Zero was lost. Substitute zero: the square is zero and the root of zero is zero. Zero is a non-negative number, so it does have a root.') },
  ],
  wrongText: L(
    "Har qiymatda ikki amalni bajaring: avval kvadrat, keyin ildiz. Javob har doim nomanfiy chiqadi.",
    'При каждом значении выполни два действия: сначала квадрат, потом корень. Ответ всегда выходит неотрицательным.',
    'For every value do the two actions: the square first, then the root. The answer always comes out non-negative.'),
};

export default function D10_04(props) { return <CodeLock data={DATA} {...props} />; }
