// Dars08 · Amaliyot 10 — Kod · 🔴 · tag: code_powers
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Skelet: DARS07_11_AMALIYOT_SKELET.md §6 (8-dars, 10-pozitsiya)
//
// Uch daraja, uch qiymat, o'sish tartibida: 4, 9, 27. Bankdagi uch tuzoq
// uch xil to'xtash joyi:
//   3  — sakson birdan to'rtinchi darajali ildiz olindi, kub qoldi;
//   8  — o'n oltini ikkiga bo'lish;
//   18 — yigirma yettini ikki uchdan birga KO'PAYTIRISH.
// Uchta javob ham butun son, ya'ni tekshirish teskari amal bilan boradi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'code_powers', level: '🔴',
  expr: [
    { b: '16', e: { n: '1', d: '2' } }, ',',
    { b: '27', e: { n: '2', d: '3' } }, ',',
    { b: '81', e: { n: '3', d: '4' } },
  ],
  exprSize: 26,
  cards: ['3', '4', '8', '9', '18', '27'],
  answer: ['4', '9', '27'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Seyfning kodi uch xonali. Uni uchta daraja beradi: har birining qiymati kodning bitta raqami.",
    'Код сейфа трёхзначный. Его дают три степени: значение каждой это одно число кода.',
    'The safe code has three places. Three powers give it: the value of each is one number of the code.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Uch darajaning qiymatini hisoblang va kodga o'sish tartibida yozing.",
    'Посчитай значения трёх степеней и запиши их в код по возрастанию.',
    'Compute the values of the three powers and write them into the code in increasing order.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Birinchisida maxraj ikki, surat bir: o'n oltidan kvadrat ildiz to'rt. Ikkinchisida maxraj uch — yigirma yettidan kub ildiz uch, surat ikki — uchning kvadrati to'qqiz. Uchinchisida maxraj to'rt — sakson birdan to'rtinchi darajali ildiz uch, surat uch — uchning kubi yigirma yetti. O'sish tartibida: to'rt, to'qqiz, yigirma yetti.",
    'Верно. В первой знаменатель два, числитель один: квадратный корень из шестнадцати четыре. Во второй знаменатель три — кубический корень из двадцати семи три, числитель два — три в квадрате девять. В третьей знаменатель четыре — корень четвёртой степени из восьмидесяти одного три, числитель три — куб трёх двадцать семь. По возрастанию: четыре, девять, двадцать семь.',
    'Correct. In the first the denominator is two and the numerator one: the square root of sixteen is four. In the second the denominator three gives the cube root of twenty seven, that is three, and the numerator two squares it to nine. In the third the denominator four gives the fourth root of eighty one, that is three, and the numerator three cubes it to twenty seven. In increasing order: four, nine, twenty seven.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('3') !== -1, text: L(
      "Uch — ildizning javobi, darajaning esa yo'q. Sakson birdan to'rtinchi darajali ildiz haqiqatan uch, lekin ko'rsatkichning surati uch, ya'ni natijani kubga oshirish kerak: uch karra uch karra uch.",
      'Три — ответ корня, но не степени. Корень четвёртой степени из восьмидесяти одного действительно три, но числитель показателя три, значит результат надо возвести в куб: три на три на три.',
      'Three is the answer of the root, not of the power. The fourth root of eighty one really is three, but the numerator of the exponent is three, so the result must be cubed: three times three times three.') },
    { when: (s) => s.slots.indexOf('8') !== -1, text: L(
      "Sakkiz — o'n oltining yarmi, ildiz esa bo'lish emas. Tekshiring: sakkiz karra sakkiz oltmish to'rt, o'n olti emas. Kvadrati o'n oltiga teng son — to'rt.",
      'Восемь — половина шестнадцати, а корень это не деление. Проверь: восемь на восемь шестьдесят четыре, а не шестнадцать. Число, чей квадрат шестнадцать, это четыре.',
      'Eight is half of sixteen, and a root is not division. Check: eight times eight is sixty four, not sixteen. The number whose square is sixteen is four.') },
    { when: (s) => s.slots.indexOf('18') !== -1, text: L(
      "O'n sakkiz yigirma yettini ikki uchdan birga ko'paytirishdan chiqadi, ko'rsatkich esa ko'paytuvchi emas. Avval kub ildiz oling — uch chiqadi, keyin kvadratga oshiring — to'qqiz.",
      'Восемнадцать выходит из умножения двадцати семи на две третьих, а показатель не множитель. Сначала возьми кубический корень — выйдет три, потом возведи в квадрат — девять.',
      'Eighteen comes from multiplying twenty seven by two thirds, but an exponent is not a multiplier. First take the cube root to get three, then square it to get nine.') },
    { when: (s) => s.set, text: L(
      "Sonlar to'g'ri topilgan, tartib esa buzilgan. O'sish eng kichigidan boshlanadi: to'rt to'qqizdan kichik, to'qqiz yigirma yettidan kichik.",
      'Числа найдены верно, а порядок нет. Возрастание начинается с наименьшего: четыре меньше девяти, девять меньше двадцати семи.',
      'The numbers are right, the order is not. Increasing starts from the smallest: four is less than nine, nine is less than twenty seven.') },
    { when: (s) => s.slots.indexOf('27') === -1, text: L(
      "Uchinchi darajaning javobi tushib qolgan: sakson birdan to'rtinchi darajali ildiz uch, uning kubi esa yigirma yetti.",
      'Ответ третьей степени потерялся: корень четвёртой степени из восьмидесяти одного три, а его куб двадцать семь.',
      'The answer of the third power is missing: the fourth root of eighty one is three and its cube is twenty seven.') },
  ],
  wrongText: L(
    "Har darajada ikki qadam bor: maxraj aytgan ildiz va surat aytgan daraja. Ikkinchi qadamni tashlab ketmang.",
    'В каждой степени два шага: корень, который назвал знаменатель, и степень, которую назвал числитель. Не пропускай второй шаг.',
    'Every power has two steps: the root the denominator names and the power the numerator names. Do not skip the second.'),
};

export default function D08_10(props) { return <CodeLock data={DATA} {...props} />; }
