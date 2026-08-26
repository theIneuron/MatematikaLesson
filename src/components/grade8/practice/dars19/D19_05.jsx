// Dars19 · Amaliyot 05 — Kod · 🟡 · tag: code_small_roots
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §7 (19-dars, 5-pozitsiya)
//
// TANLASH USULI UCH MARTA. Har tenglamada q ning ko'paytuvchilarini izlab,
// yig'indisi minus p ga teng bo'lgan juftlik tanlanadi:
//   olti = 2 · 3, yig'indi besh — ildizlar 2 va 3, kichigi 2;
//   o'n besh = 3 · 5, yig'indi sakkiz — ildizlar 3 va 5, kichigi 3;
//   o'n olti = 4 · 4, yig'indi sakkiz — ildizlar TENG, ikkisi ham 4.
//
// UCHINCHI TENGLAMA T3 NI TEKSHIRADI: D nolga teng (o'ttiz olti minus o'ttiz
// olti... aniqrog'i oltmish to'rt minus oltmish to'rt), ildizlar teng, va
// Viyet u yerda ham ishlaydi: to'rt qo'shuv to'rt sakkiz, to'rt karra to'rt
// o'n olti.
// Bankdagi tuzoqlar: 5, 6, 15 — kattaroq ildizlar va q qiymatlari.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'code_small_roots', level: '🟡',
  expr: ['x² − 5x + 6 = 0', ';', 'x² − 8x + 15 = 0', ';', 'x² − 8x + 16 = 0'], exprSize: 14,
  cards: ['2', '3', '4', '5', '6', '15'],
  answer: ['2', '3', '4'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Xonada seyf turadi, kodi uch xonali. Uch tenglamaning ildizlari tanlash usuli bilan topiladi: ko'paytmasi ozod hadga, yig'indisi esa ikkinchi koeffitsiyentning teskarisiga teng juftlik.",
    'В комнате сейф, код трёхзначный. Корни трёх уравнений находятся способом подбора: пара, чьё произведение равно свободному члену, а сумма — второму коэффициенту с обратным знаком.',
    'There is a safe in the room and its code has three places. The roots of the three equations are found by selection: the pair whose product is the constant term and whose sum is the second coefficient with the opposite sign.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Har tenglamaning KICHIK ildizini toping va kodga o'sish tartibida yozing.",
    'Найди МЕНЬШИЙ корень каждого уравнения и запиши их в код по возрастанию.',
    'Find the SMALLER root of each equation and write them into the code in increasing order.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Birinchisida ko'paytma olti, yig'indi besh: ikki va uch — kichigi ikki. Ikkinchisida ko'paytma o'n besh, yig'indi sakkiz: uch va besh — kichigi uch. Uchinchisida ko'paytma o'n olti, yig'indi sakkiz: to'rt va to'rt, ya'ni ildizlar TENG — kichigi ham to'rt. Uchinchi tenglamada diskriminant nolga teng, lekin Viyet u yerda ham ishlaydi: to'rt qo'shuv to'rt sakkiz, to'rt karra to'rt o'n olti.",
    'Верно. В первом произведение шесть, сумма пять: два и три — меньший два. Во втором произведение пятнадцать, сумма восемь: три и пять — меньший три. В третьем произведение шестнадцать, сумма восемь: четыре и четыре, то есть корни РАВНЫ — меньший тоже четыре. В третьем дискриминант равен нулю, но Виет работает и там: четыре плюс четыре восемь, четыре на четыре шестнадцать.',
    'Correct. In the first the product is six and the sum five: two and three — the smaller is two. In the second the product is fifteen and the sum eight: three and five — the smaller is three. In the third the product is sixteen and the sum eight: four and four, so the roots are EQUAL — the smaller is four as well. There the discriminant is zero, yet Vieta still holds: four plus four is eight, four times four is sixteen.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('6') !== -1, text: L(
      "Olti — birinchi tenglamaning OZOD HADI, ildizi emas. U ildizlarning ko'paytmasini beradi: olti bu ikki karra uch. Kichik ildiz ikki. Oltini tenglamaga qo'yib tekshiring: o'ttiz olti minus o'ttiz qo'shuv olti o'n ikki chiqadi, nol emas.",
      'Шесть — это СВОБОДНЫЙ ЧЛЕН первого уравнения, а не корень. Он даёт произведение корней: шесть это два на три. Меньший корень два. Подставь шесть и проверь: тридцать шесть минус тридцать плюс шесть даёт двенадцать, а не нуль.',
      'Six is the CONSTANT TERM of the first equation, not a root. It gives the product of the roots: six is two times three. The smaller root is two. Substitute six and check: thirty six minus thirty plus six gives twelve, not zero.') },
    { when: (s) => s.slots.indexOf('15') !== -1, text: L(
      "O'n besh — ikkinchi tenglamaning ozod hadi, ya'ni ildizlarning KO'PAYTMASI. Uni ko'paytuvchilarga ajratish kerak: o'n besh bu uch karra besh, va ularning yig'indisi sakkiz — to'g'ri keladi. Kichik ildiz uch.",
      'Пятнадцать — свободный член второго уравнения, то есть ПРОИЗВЕДЕНИЕ корней. Его надо разложить на множители: пятнадцать это три на пять, и их сумма восемь — совпадает. Меньший корень три.',
      'Fifteen is the constant term of the second equation, that is the PRODUCT of the roots. It must be factored: fifteen is three times five, and their sum is eight — a match. The smaller root is three.') },
    { when: (s) => s.slots.indexOf('5') !== -1, text: L(
      "Besh — birinchi tenglamada ildizlarning YIG'INDISI, ikkinchisida esa katta ildiz. Kod kichik ildizlarni so'raydi: birinchisida ikki, ikkinchisida uch.",
      'Пять — в первом уравнении это СУММА корней, а во втором больший корень. Код просит меньшие корни: в первом два, во втором три.',
      'Five is the SUM of the roots in the first equation and the larger root in the second. The code asks for the smaller roots: two in the first, three in the second.') },
    { when: (s) => s.set, text: L(
      "Sonlar to'g'ri topilgan, tartib esa buzilgan. O'sish eng kichigidan boshlanadi: ikki, uch, to'rt.",
      'Числа найдены верно, а порядок нет. Возрастание начинается с наименьшего: два, три, четыре.',
      'The numbers are right, the order is not. Increasing starts from the smallest: two, three, four.') },
    { when: (s) => s.slots.indexOf('4') === -1, text: L(
      "Kodda to'rt yo'q. Uchinchi tenglamada ildizlar TENG: o'n oltini ikki ko'paytuvchiga ajratganda yig'indisi sakkiz bo'ladigan juftlik — to'rt va to'rt. Kichik ildiz ham to'rt.",
      'В коде нет четвёрки. В третьем уравнении корни РАВНЫ: пара множителей шестнадцати с суммой восемь — это четыре и четыре. Меньший корень тоже четыре.',
      'The code has no four. In the third equation the roots are EQUAL: the pair of factors of sixteen whose sum is eight is four and four. The smaller root is four as well.') },
  ],
  wrongText: L(
    "Har tenglamada ozod hadni ko'paytuvchilarga ajratib, yig'indisi ikkinchi koeffitsiyentning teskarisiga teng juftlikni tanlang. Keyin kichigini oling.",
    'В каждом уравнении разложи свободный член на множители и выбери пару, чья сумма равна второму коэффициенту с обратным знаком. Потом возьми меньший.',
    'In each equation factor the constant term and pick the pair whose sum is the second coefficient with the opposite sign. Then take the smaller one.'),
};

export default function D19_05(props) { return <CodeLock data={DATA} {...props} />; }
