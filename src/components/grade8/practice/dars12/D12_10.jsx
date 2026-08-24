// Dars12 · Amaliyot 10 — Kod · 🔴 · tag: code_products
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Skelet: DARS12_14_AMALIYOT_SKELET.md §3 (12-dars, 10-pozitsiya)
//
// Uch yozuv, uch qiymat, javob esa KETMA-KETLIK: o'sish tartibida 6, 8, 30.
// Uchala ko'paytmada ham ko'paytuvchilarning o'zi to'liq kvadrat emas
// (12 va 3, 2 va 32, 20 va 45), ya'ni xossa teskari tomonga ishlatiladi —
// avval ko'paytirish, keyin ildiz.
//
// Bankdagi uch tuzoq uchta aniq yo'l:
//   36 — o'n ikki karra uch, ildiz olinmadi;
//   15 — o'n ikki qo'shuv uch, amal almashdi (З4 ning sonli ko'rinishi);
//   65 — yigirma qo'shuv qirq besh, o'sha xato katta sonlarda.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'code_products', level: '🔴',
  // UCH YOZUV NUQTALI VERGUL BILAN AJRATILADI: kadr o'lchovi 2026-08-24
  // ko'rsatdi — bo'sh joy tokeni HTML da yiqiladi va uchta ildiz bitta uzun
  // yozuvdek ko'rinib qolgan edi. Vergul emas, nuqtali vergul: vergul bu
  // yerda onli kasrning belgisi (0,25) va yana bir ma'noni olib kelardi.
  expr: [{ r: '12 · 3' }, ';', { r: '2 · 32' }, ';', { r: '20 · 45' }], exprSize: 20,
  cards: ['6', '8', '15', '30', '36', '65'],
  answer: ['6', '8', '30'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Xonada seyf turadi, kodi uch xonali. Kodni yuqoridagi uch yozuv beradi: har birining qiymatini hisoblash kerak.",
    'В комнате сейф, код трёхзначный. Код дают три записи сверху: надо посчитать значение каждой.',
    'There is a safe in the room and its code has three places. The three records above give the code: compute the value of each.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Uch yozuvning qiymatini hisoblang va kodga o'sish tartibida yozing.",
    'Посчитай значения трёх записей и запиши их в код по возрастанию.',
    'Compute the values of the three records and write them into the code in increasing order.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Uchala yozuvda ham ko'paytuvchilarning o'zi to'liq kvadrat emas, shuning uchun avval ko'paytirdingiz: o'n ikki karra uch o'ttiz olti, ildizi olti; ikki karra o'ttiz ikki oltmish to'rt, ildizi sakkiz; yigirma karra qirq besh to'qqiz yuz, ildizi o'ttiz. O'sish tartibida olti, sakkiz, o'ttiz. Har javobni kvadratga oshirib tekshirish mumkin: oltmish to'rt, o'ttiz olti va to'qqiz yuz.",
    'Верно. Во всех трёх записях сами множители не полные квадраты, поэтому ты сначала перемножил: двенадцать на три тридцать шесть, корень шесть; два на тридцать два шестьдесят четыре, корень восемь; двадцать на сорок пять девятьсот, корень тридцать. По возрастанию: шесть, восемь, тридцать. Каждый ответ можно проверить возведением в квадрат.',
    'Correct. In all three records the factors themselves are not perfect squares, so you multiplied first: twelve times three is thirty six, root six; two times thirty two is sixty four, root eight; twenty times forty five is nine hundred, root thirty. In increasing order: six, eight, thirty. Every answer can be checked by squaring.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('36') !== -1, text: L(
      "O'ttiz olti — bu o'n ikki karra uchning o'zi, ildizi hali olinmagan. O'ttiz oltidan ildiz olti. Tekshiring: o'ttiz oltini kvadratga oshirsangiz bir ming ikki yuz to'qsan olti chiqadi, ildiz ostida esa o'ttiz olti turadi.",
      'Тридцать шесть — это само двенадцать на три, корень ещё не взят. Корень из тридцати шести шесть. Проверь: тридцать шесть в квадрате тысяча двести девяносто шесть, а под корнем стоит тридцать шесть.',
      'Thirty six is twelve times three itself; the root has not been taken. The root of thirty six is six. Check: thirty six squared is one thousand two hundred ninety six, while under the root stands thirty six.') },
    { when: (s) => s.slots.indexOf('15') !== -1, text: L(
      "O'n besh — bu o'n ikki QO'SHUV uch. Ildiz ostida esa qo'shish emas, ko'paytirish turadi: o'n ikki karra uch o'ttiz olti, ildizi olti. Tekshiring: o'n beshni kvadratga oshirsangiz ikki yuz yigirma besh chiqadi, o'ttiz olti emas.",
      'Пятнадцать — это двенадцать ПЛЮС три. А под корнем не сложение, а умножение: двенадцать на три тридцать шесть, корень шесть. Проверь: пятнадцать в квадрате двести двадцать пять, а не тридцать шесть.',
      'Fifteen is twelve PLUS three. But under the root there is a product, not a sum: twelve times three is thirty six, root six. Check: fifteen squared is two hundred twenty five, not thirty six.') },
    { when: (s) => s.slots.indexOf('65') !== -1, text: L(
      "Oltmish besh — bu yigirma qo'shuv qirq besh, ya'ni o'sha qo'shish xatosi katta sonlarda. Ko'paytiring: yigirma karra qirq besh to'qqiz yuz, ildizi o'ttiz. Tekshiring: oltmish beshni kvadratga oshirsangiz to'rt ming ikki yuz yigirma besh chiqadi.",
      'Шестьдесят пять — это двадцать плюс сорок пять, та же ошибка со сложением, но на больших числах. Перемножь: двадцать на сорок пять девятьсот, корень тридцать. Проверь: шестьдесят пять в квадрате четыре тысячи двести двадцать пять.',
      'Sixty five is twenty plus forty five, the same addition mistake on bigger numbers. Multiply: twenty times forty five is nine hundred, root thirty. Check: sixty five squared is four thousand two hundred twenty five.') },
    { when: (s) => s.set, text: L(
      "Sonlar to'g'ri topilgan, tartib esa buzilgan. O'sish eng kichigidan boshlanadi: olti, sakkiz, o'ttiz.",
      'Числа найдены верно, а порядок нет. Возрастание начинается с наименьшего: шесть, восемь, тридцать.',
      'The numbers are right, the order is not. Increasing starts from the smallest: six, eight, thirty.') },
    { when: (s) => s.slots.indexOf('8') === -1, text: L(
      "Uch qiymatning biri tushib qolgan: ikki karra o'ttiz ikki oltmish to'rt, oltmish to'rtdan ildiz sakkiz. Uchala yozuvni ham hisoblang.",
      'Одно из трёх значений потерялось: два на тридцать два шестьдесят четыре, корень из шестидесяти четырёх восемь. Посчитай все три записи.',
      'One of the three values is missing: two times thirty two is sixty four, and the root of sixty four is eight. Compute all three records.') },
  ],
  wrongText: L(
    "Har yozuvda avval ko'paytmani hisoblang, keyin ildizini oling: ko'paytuvchilarning o'zi to'liq kvadrat emas. Javoblarni kichikdan kattaga qarab tartiblang.",
    'В каждой записи сначала посчитай произведение, потом возьми корень: сами множители не полные квадраты. Ответы расставь от меньшего к большему.',
    'In each record compute the product first, then take the root: the factors themselves are not perfect squares. Order the answers from smallest to largest.'),
};

export default function D12_10(props) { return <CodeLock data={DATA} {...props} />; }
