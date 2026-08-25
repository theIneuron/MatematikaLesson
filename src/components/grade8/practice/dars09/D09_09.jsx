// Dars09 · Amaliyot 09 — Kod · 🔴 · tag: code_roots
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Skelet: DARS07_11_AMALIYOT_SKELET.md §7 (9-dars, 9-pozitsiya)
//
// Uch to'liq kvadrat, uch butun ildiz: 3, 8, 15. O'sish tartibi shu bilan
// mos tushadi, ya'ni asosiy ish — ildizni to'g'ri hisoblash.
// Bankdagi uch tuzoq bitta adashishning uch ko'rinishi: ildiz ostini IKKIGA
// BO'LISH (to'rt butun besh o'ndan bir, o'ttiz ikki, bir yuz o'n ikki butun
// besh o'ndan bir). Har birini kvadratga oshirib rad etish oson.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'code_roots', level: '🔴',
  expr: [{ r: '9' }, ',', { r: '64' }, ',', { r: '225' }], exprSize: 26,
  cards: ['3', '4,5', '8', '15', '32', '112,5'],
  answer: ['3', '8', '15'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Seyfning kodi uch xonali. Uni uchta ildiz beradi, uchtasi ham butun chiqadi.",
    'Код сейфа трёхзначный. Его дают три корня, и все три выходят целыми.',
    'The safe code has three places. Three roots give it, and all three come out whole.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Uch ildizning qiymatini hisoblang va kodga o'sish tartibida yozing.",
    'Посчитай значения трёх корней и запиши их в код по возрастанию.',
    'Compute the values of the three roots and write them into the code in increasing order.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Uch karra uch to'qqiz, sakkiz karra sakkiz oltmish to'rt, o'n besh karra o'n besh ikki yuz yigirma besh. O'sish tartibida: uch, sakkiz, o'n besh. Uchtasi ham to'liq kvadrat, shuning uchun ildizlar butun chiqdi.",
    'Верно. Три на три девять, восемь на восемь шестьдесят четыре, пятнадцать на пятнадцать двести двадцать пять. По возрастанию: три, восемь, пятнадцать. Все три полные квадраты, поэтому корни вышли целыми.',
    'Correct. Three times three is nine, eight times eight is sixty four, fifteen times fifteen is two hundred twenty five. In increasing order: three, eight, fifteen. All three are perfect squares, so the roots came out whole.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('4,5') !== -1, text: L(
      "To'rt butun besh o'ndan bir — to'qqizning yarmi, ildiz esa bo'lish emas. Kvadratga oshirib ko'ring: to'rt butun besh o'ndan birning kvadrati yigirma butun yigirma besh yuzdan bir, to'qqiz emas.",
      'Четыре с половиной — половина девяти, а корень это не деление. Возведи в квадрат: четыре с половиной в квадрате это двадцать целых двадцать пять сотых, а не девять.',
      'Four and a half is half of nine, and a root is not division. Square it: four and a half squared is twenty point two five, not nine.') },
    { when: (s) => s.slots.indexOf('32') !== -1, text: L(
      "O'ttiz ikki — oltmish to'rtning yarmi. Kvadratga oshiring: o'ttiz ikki karra o'ttiz ikki bir ming yigirma to'rt, oltmish to'rt emas. Kvadrati oltmish to'rtga teng son — sakkiz.",
      'Тридцать два — половина шестидесяти четырёх. Возведи в квадрат: тридцать два на тридцать два тысяча двадцать четыре, а не шестьдесят четыре. Число, чей квадрат шестьдесят четыре, это восемь.',
      'Thirty two is half of sixty four. Square it: thirty two times thirty two is one thousand twenty four, not sixty four. The number whose square is sixty four is eight.') },
    { when: (s) => s.slots.indexOf('112,5') !== -1, text: L(
      "Bu ikki yuz yigirma beshning yarmi. Ildizni izlaganda esa kvadrati ikki yuz yigirma beshga teng sonni topish kerak. O'n besh karra o'n beshni sanab ko'ring.",
      'Это половина двухсот двадцати пяти. А при поиске корня нужно число, чей квадрат равен двумстам двадцати пяти. Посчитай пятнадцать на пятнадцать.',
      'That is half of two hundred twenty five. But finding a root means finding the number whose square is two hundred twenty five. Count fifteen times fifteen.') },
    { when: (s) => s.set, text: L(
      "Sonlar to'g'ri topilgan, tartib esa buzilgan. O'sish eng kichigidan boshlanadi: uch, sakkiz, o'n besh.",
      'Числа найдены верно, а порядок нет. Возрастание начинается с наименьшего: три, восемь, пятнадцать.',
      'The numbers are right, the order is not. Increasing starts from the smallest: three, eight, fifteen.') },
    { when: (s) => s.slots.indexOf('15') === -1, text: L(
      "Uchinchi ildiz tushib qolgan: kvadrati ikki yuz yigirma beshga teng son o'n besh. O'n olti karra o'n olti ikki yuz ellik olti, ya'ni ko'p.",
      'Третий корень потерялся: число, чей квадрат двести двадцать пять, это пятнадцать. Шестнадцать на шестнадцать двести пятьдесят шесть, это много.',
      'The third root is missing: the number whose square is two hundred twenty five is fifteen. Sixteen times sixteen is two hundred fifty six, which is too much.') },
  ],
  wrongText: L(
    "Har ildizni teskari amal bilan tekshiring: javobni o'ziga ko'paytirsangiz ildiz ostidagi son chiqishi kerak.",
    'Проверяй каждый корень обратным действием: ответ, умноженный на себя, должен дать подкоренное число.',
    'Check every root with the reverse action: the answer multiplied by itself must give the radicand.'),
};

export default function D09_09(props) { return <CodeLock data={DATA} {...props} />; }
