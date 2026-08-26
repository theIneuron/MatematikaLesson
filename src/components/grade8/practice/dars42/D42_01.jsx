// Dars42 · Amaliyot 01 — Test · 🟢 · tag: which_formula
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §4 (42-dars, 1-pozitsiya)
//
// `Choice` NING VARIANTI SO'Z: `label` massiv bo'lmasa `tr()` dan o'tadi,
// ya'ni uch tilda to'g'ri chiqadi (skelet §0a.4).
//
// Uch xato variant — uch adashish: З87 (asoslar ko'paytirildi), yarim
// unutildi, З88 (balandlik o'rniga yon tomon). Razbor har birini
// a=7, b=5, h=4 da SON bilan rad etadi: to'g'ri javob yigirma to'rt.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'which_formula', level: '🟢',
  correct: 0, optCols: 1, optSize: 15,
  given: [['a = 7, b = 5'], ['h = 4']],
  givenLabel: L('Asoslar va balandlik', 'Основания и высота', 'The bases and the height'),
  eyebrow: L('Test', 'Тест', 'Test'),
  setup: L(
    "Trapetsiyaning ikki asosi va balandligi berilgan. To'rt yo'ldan faqat bittasi uning yuzini beradi.",
    'Даны два основания трапеции и высота. Из четырёх путей только один даёт её площадь.',
    'The two bases of a trapezoid and its height are given. Of the four routes only one gives its area.'),
  ask: L(
    "Trapetsiyaning yuzi qanday topiladi?",
    'Как находится площадь трапеции?',
    'How is the area of a trapezoid found?'),
  opts: [
    { label: L("asoslar yig'indisining yarmi balandlikka ko'paytiriladi",
      'половина суммы оснований умножается на высоту', 'half the sum of the bases is multiplied by the height') },
    { label: L("asoslarning ko'paytmasi balandlikka ko'paytiriladi",
      'произведение оснований умножается на высоту', 'the product of the bases is multiplied by the height') },
    { label: L("asoslar yig'indisi balandlikka ko'paytiriladi",
      'сумма оснований умножается на высоту', 'the sum of the bases is multiplied by the height') },
    { label: L("asoslar yig'indisining yarmi yon tomonga ko'paytiriladi",
      'половина суммы оснований умножается на боковую сторону', 'half the sum of the bases is multiplied by the leg') },
  ],
  correctText: L(
    "To'g'ri. Yetti qo'shuv besh o'n ikki, yarmi olti, olti karra to'rt yigirma to'rt. Nima uchun aynan yig'indining yarmi: trapetsiyani ikkilantirib, asosi asoslar yig'indisiga teng bo'lgan parallelogramm yasash mumkin, va yuzani keyin ikkiga bo'lish kerak bo'ladi. Yig'indining yarmi esa boshqa nom bilan ham ataladi — bu O'RTA CHIZIQ, ya'ni formulani qisqa yozish mumkin: o'rta chiziq karra balandlik.",
    'Верно. Семь плюс пять — двенадцать, половина шесть, шесть на четыре — двадцать четыре. Почему именно половина суммы: трапецию можно удвоить и сложить параллелограмм с основанием, равным сумме оснований, а потом площадь придётся разделить надвое. У половины суммы есть и другое имя — это СРЕДНЯЯ ЛИНИЯ, то есть формулу можно записать коротко: средняя линия на высоту.',
    'Correct. Seven plus five is twelve, half is six, six times four is twenty four. Why half the sum: a trapezoid can be doubled into a parallelogram whose base is the sum of the bases, and then the area has to be halved. Half the sum also has another name — it is the MIDLINE, so the formula can be written short: midline times height.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Asoslarni KO'PAYTIRISH boshqa figuraning yuzasini beradi. Bu yerda yetti karra besh o'ttiz besh, uni to'rtga ko'paytirsangiz bir yuz qirq chiqadi — haqiqiy yuzadan olti barobar katta. Trapetsiya ikki asosning O'RTASIDA turadi, ya'ni ular QO'SHILADI.",
      'УМНОЖЕНИЕ оснований даёт площадь другой фигуры. Здесь семь на пять — тридцать пять, умножить на четыре — сто сорок, это в шесть раз больше настоящей площади. Трапеция лежит МЕЖДУ двумя основаниями, значит они СКЛАДЫВАЮТСЯ.',
      'MULTIPLYING the bases gives the area of a different figure. Here seven times five is thirty five, times four is one hundred forty — six times the true area. A trapezoid lies BETWEEN its two bases, so they are ADDED.') },
    { when: (s) => s.picked === 2, text: L(
      "Yig'indi to'g'ri topilgan, lekin uning YARMI olinmagan: o'n ikki karra to'rt qirq sakkiz, ya'ni javob ikki barobar katta. Qirq sakkiz — bu asosi o'n ikki bo'lgan parallelogrammning yuzi, trapetsiya esa uning yarmi.",
      'Сумма найдена верно, но не взята её ПОЛОВИНА: двенадцать на четыре — сорок восемь, то есть ответ вдвое больше. Сорок восемь — это площадь параллелограмма с основанием двенадцать, а трапеция его половина.',
      'The sum is right, but its HALF was not taken: twelve times four is forty eight, twice the true answer. Forty eight is the area of a parallelogram with base twelve, and the trapezoid is half of it.') },
    { when: (s) => s.picked === 3, text: L(
      "Yon tomon balandlikning o'rnini bosolmaydi. Balandlik ikki asos orasidagi PERPENDIKULYAR masofa, yon tomon esa qiya turadi va u har doim balandlikdan uzun bo'ladi (faqat to'g'ri burchakli trapetsiyada teng bo'lishi mumkin). Qiya tomonni olsangiz, yuza kattalashib ketadi.",
      'Боковая сторона высоту не заменяет. Высота — ПЕРПЕНДИКУЛЯРНОЕ расстояние между основаниями, а боковая сторона наклонена и всегда длиннее высоты (равной она может быть только в прямоугольной трапеции). Взяв наклонную сторону, получишь завышенную площадь.',
      'A leg cannot stand in for the height. The height is the PERPENDICULAR distance between the bases, while a leg is slanted and always longer than the height (they can be equal only in a right trapezoid). Take the slanted side and the area comes out too large.') },
  ],
  wrongText: L(
    "Asoslar qo'shiladi, yig'indining yarmi olinadi va u BALANDLIKKA ko'paytiriladi.",
    'Основания складываются, берётся половина суммы и умножается на ВЫСОТУ.',
    'The bases are added, half the sum is taken and multiplied by the HEIGHT.'),
};

export default function D42_01(props) { return <Choice data={DATA} {...props} />; }
