// Dars14 · Amaliyot 04 — Kod · 🟡 · tag: code_rational_roots
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Skelet: DARS12_14_AMALIYOT_SKELET.md §5 (14-dars, 4-pozitsiya)
//
// З36 NI TO'G'RIDAN-TO'G'RI TEKSHIRADI: bankda oltita son, uchtasidan ildiz
// ratsional (25, 144, 169), uchtasidan yo'q (18, 27, 50). Ya'ni «har qanday
// ildiz irratsional» degan qarash bu topshiriqni yechishga imkon bermaydi —
// har sonni to'liq kvadratga tekshirish kerak.
//
// Uch tuzoq ataylab to'liq kvadratga O'XSHAB turadi: o'n sakkiz (to'qqiz karra
// ikki), yigirma yetti (uchning kubi), ellik (yigirma besh karra ikki) —
// hammasida to'liq kvadrat BOR, lekin ko'paytuvchi bo'lib, sonning o'zi emas.
// Bu 9-darsning to'liq kvadrat belgisini qaytaradi (oldingi blokdan).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'code_rational_roots', level: '🟡',
  cards: ['18', '25', '27', '50', '144', '169'],
  answer: ['25', '144', '169'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Xonada seyf turadi, kodi uch xonali. Bankdagi oltita sondan uchtasining ildizi ratsional, uchtasining esa yo'q.",
    'В комнате сейф, код трёхзначный. Из шести чисел в банке у трёх корень рационален, у трёх нет.',
    'There is a safe in the room and its code has three places. Of the six numbers in the bank, three have a rational root and three do not.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Ildizi RATSIONAL bo'lgan uch sonni toping va kodga o'sish tartibida yozing.",
    'Найди три числа, у которых корень РАЦИОНАЛЕН, и запиши их в код по возрастанию.',
    'Find the three numbers whose root is RATIONAL and write them into the code in increasing order.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Uchtasi to'liq kvadrat: yigirma besh bu besh karra besh, yuz qirq to'rt bu o'n ikki karra o'n ikki, yuz oltmish to'qqiz bu o'n uch karra o'n uch. Ildizlari besh, o'n ikki va o'n uch — hammasi butun son, ya'ni ratsional. Qolgan uchtasi to'liq kvadrat emas: o'n sakkiz to'rt va besh orasida, yigirma yetti besh va olti orasida, ellik yetti va sakkiz orasida turadi. Kodda sonlarning o'zi yoziladi, o'sish tartibida: yigirma besh, yuz qirq to'rt, yuz oltmish to'qqiz.",
    'Верно. Три из них полные квадраты: двадцать пять это пять на пять, сто сорок четыре это двенадцать на двенадцать, сто шестьдесят девять это тринадцать на тринадцать. Корни пять, двенадцать и тринадцать — все целые, значит рациональные. Остальные три не полные квадраты: восемнадцать между четырьмя и пятью, двадцать семь между пятью и шестью, пятьдесят между семью и восемью. В код пишутся сами числа, по возрастанию: двадцать пять, сто сорок четыре, сто шестьдесят девять.',
    'Correct. Three of them are perfect squares: twenty five is five times five, one hundred forty four is twelve times twelve, one hundred sixty nine is thirteen times thirteen. Their roots are five, twelve and thirteen — all whole, so rational. The other three are not perfect squares: eighteen lies between four and five, twenty seven between five and six, fifty between seven and eight. The code holds the numbers themselves, in increasing order: twenty five, one hundred forty four, one hundred sixty nine.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('18') !== -1, text: L(
      "O'n sakkizning ichida to'liq kvadrat bor — to'qqiz, lekin u ko'paytuvchi: o'n sakkiz bu to'qqiz karra ikki. Sonning O'ZI to'liq kvadrat bo'lishi kerak. Tekshiring: to'rtning kvadrati o'n olti, beshning kvadrati yigirma besh, ya'ni o'n sakkizdan ildiz to'rt va besh orasida va butun emas.",
      'Внутри восемнадцати полный квадрат есть — девять, но он множитель: восемнадцать это девять на два. Полным квадратом должно быть САМО число. Проверь: четыре в квадрате шестнадцать, пять в квадрате двадцать пять, значит корень из восемнадцати между четырьмя и пятью и не целый.',
      'Eighteen holds a perfect square inside — nine — but as a factor: eighteen is nine times two. The number ITSELF must be a perfect square. Check: four squared is sixteen, five squared is twenty five, so the root of eighteen lies between four and five and is not whole.') },
    { when: (s) => s.slots.indexOf('27') !== -1, text: L(
      "Yigirma yetti uchning kubi, kvadrati emas: uch karra uch karra uch. Kvadrat bo'lishi uchun bir sonning O'ZIGA ko'paytmasi kerak. Tekshiring: beshning kvadrati yigirma besh, oltining kvadrati o'ttiz olti — yigirma yetti ular orasida qoladi.",
      'Двадцать семь — куб трёх, а не квадрат: три на три на три. Квадрат — это произведение числа на САМО СЕБЯ. Проверь: пять в квадрате двадцать пять, шесть в квадрате тридцать шесть — двадцать семь остаётся между ними.',
      'Twenty seven is three cubed, not squared: three times three times three. A square is a number times ITSELF. Check: five squared is twenty five, six squared is thirty six — twenty seven stays between them.') },
    { when: (s) => s.slots.indexOf('50') !== -1, text: L(
      "Ellikda ham to'liq kvadrat ko'paytuvchi bor — yigirma besh, lekin ellikning o'zi kvadrat emas. Tekshiring: yettining kvadrati qirq to'qqiz, sakkizning kvadrati oltmish to'rt. Ellik qirq to'qqizdan katta va oltmish to'rtdan kichik, ya'ni uning ildizi yetti va sakkiz orasida.",
      'В пятидесяти тоже есть множитель — полный квадрат двадцать пять, но само пятьдесят квадратом не является. Проверь: семь в квадрате сорок девять, восемь в квадрате шестьдесят четыре. Пятьдесят больше сорока девяти и меньше шестидесяти четырёх, значит корень между семью и восемью.',
      'Fifty holds a perfect square factor too — twenty five — but fifty itself is not a square. Check: seven squared is forty nine, eight squared is sixty four. Fifty is above forty nine and below sixty four, so its root lies between seven and eight.') },
    { when: (s) => s.set, text: L(
      "Sonlar to'g'ri topilgan, tartib esa buzilgan. O'sish eng kichigidan boshlanadi: yigirma besh, yuz qirq to'rt, yuz oltmish to'qqiz.",
      'Числа найдены верно, а порядок нет. Возрастание начинается с наименьшего: двадцать пять, сто сорок четыре, сто шестьдесят девять.',
      'The numbers are right, the order is not. Increasing starts from the smallest: twenty five, one hundred forty four, one hundred sixty nine.') },
    { when: (s) => s.slots.indexOf('169') === -1, text: L(
      "Uch sonning biri tushib qolgan: yuz oltmish to'qqiz bu o'n uch karra o'n uch, demak uning ildizi o'n uch. Bankdagi har sonni ketma-ket tekshiring.",
      'Одно из трёх чисел потерялось: сто шестьдесят девять это тринадцать на тринадцать, значит корень тринадцать. Проверь каждое число в банке по порядку.',
      'One of the three numbers is missing: one hundred sixty nine is thirteen times thirteen, so its root is thirteen. Check every number in the bank in turn.') },
  ],
  wrongText: L(
    "Har sonni bitta savol bilan tekshiring: qaysi sonning kvadrati shu songa teng? Yaqin kvadratlarni sanang — yigirma besh, o'ttiz olti, qirq to'qqiz, oltmish to'rt, yuz qirq to'rt, yuz oltmish to'qqiz.",
    'Проверяй каждое число одним вопросом: квадрат какого числа ему равен? Перечисли близкие квадраты — двадцать пять, тридцать шесть, сорок девять, шестьдесят четыре, сто сорок четыре, сто шестьдесят девять.',
    'Check every number with one question: which number squared equals it? List the nearby squares — twenty five, thirty six, forty nine, sixty four, one hundred forty four, one hundred sixty nine.'),
};

export default function D14_04(props) { return <CodeLock data={DATA} {...props} />; }
