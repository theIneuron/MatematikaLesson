// Dars53 · Amaliyot 07 — Uzunlik · 🟡 🖼 · tag: sum_length
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Skelet: DARS51_55_AMALIYOT_SKELET.md §5 (53-dars, 7-pozitsiya)
//
// OLDINGI BLOKDAN: 44-darsning Pifagor teoremasi. Uchburchak qoidasi
// AC diagonalini beradi, uning uzunligi esa 6-8-10 uchligi bilan
// topiladi. Asosiy tuzoq — 14: uzunliklarni QO'SHISH.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'sum_length', level: '🟡',
  target: 10, allowNeg: false,
  expr: [{
    fig: 'vec', w: 100, h: 68,
    arrows: [
      { from: [10, 56], to: [82, 56], ref: true, name: 'AB' },
      // 72:54 = 4:3 = 8:6 — chizmaning nisbati shartdagi sonlarga mos
      // (2026-08-26 QA: ilgari 72:46 edi, ya'ni chizma shartni yolg'onlardi)
      { from: [82, 56], to: [82, 2], ref: true, name: 'BC' },
      { from: [10, 56], to: [82, 2], name: 'AC' },
    ],
  }],
  given: [['AB = 8'], ['BC = 6']],
  givenLabel: L('Berilgan', 'Дано', 'Given'),
  eyebrow: L('Uzunlik', 'Длина', 'Length'),
  setup: L(
    "ABCD to'g'ri to'rtburchakda AB sakkiz santimetr, BC olti santimetr, va B dagi burchak to'g'ri. Chizmada AB va BC vektorlari ketma-ket qo'yilgan, ularning yig'indisi esa uchinchi strelka. Shu yig'indining UZUNLIGINI topish kerak.",
    'В прямоугольнике ABCD сторона AB восемь сантиметров, BC шесть сантиметров, а угол при B прямой. На рисунке векторы AB и BC поставлены друг за другом, а их сумма это третья стрелка. Надо найти ДЛИНУ этой суммы.',
    'In the rectangle ABCD the side AB is eight centimetres, BC is six centimetres, and the angle at B is right. In the drawing the vectors AB and BC are placed one after another, and their sum is the third arrow. Find the LENGTH of that sum.'),
  label: L('Uzunlik, sm', 'Длина, см', 'The length, cm'),
  ask: L(
    "AB va BC yig'indisining uzunligi nechaga teng?",
    'Чему равна длина суммы AB и BC?',
    'What is the length of the sum of AB and BC?'),
  correctText: L(
    "To'g'ri. Ikki qadam. Avval uchburchak qoidasi: AB qo'shuv BC teng AC, ya'ni yig'indi A dan C ga qaragan diagonal. Keyin uning uzunligi: B dagi burchak to'g'ri, demak Pifagor teoremasi ishlaydi. Sakkiz kvadrat oltmish to'rt, olti kvadrat o'ttiz olti, yig'indisi bir yuz, uning ildizi o'n. Bu tanish uchlik: olti, sakkiz, o'n.",
    'Верно. Два шага. Сначала правило треугольника: AB плюс BC равно AC, то есть сумма это диагональ из A в C. Потом её длина: угол при B прямой, значит работает теорема Пифагора. Восемь в квадрате шестьдесят четыре, шесть в квадрате тридцать шесть, вместе сто, корень из ста десять. Это знакомая тройка: шесть, восемь, десять.',
    'Correct. Two steps. First the triangle rule: AB plus BC equals AC, so the sum is the diagonal from A to C. Then its length: the angle at B is right, so the Pythagorean theorem applies. Eight squared is sixty-four, six squared is thirty-six, together a hundred, and the root of a hundred is ten. This is the familiar triple: six, eight, ten.'),
  wrongs: [
    { when: (s) => s.value === 14, text: L(
      "Siz uzunliklarni qo'shdingiz, lekin vektorlar yig'indisining uzunligi uzunliklarning yig'indisiga TENG EMAS. O'n to'rt faqat bitta holatda chiqardi: agar ikki vektor bir yo'nalishda bo'lsa. Bu yerda esa ular to'g'ri burchak ostida turibdi, shuning uchun diagonal to'g'ridan-to'g'ri boradi va qisqaroq chiqadi.",
      'Ты сложил длины, но длина суммы векторов НЕ РАВНА сумме длин. Четырнадцать вышло бы лишь в одном случае: если бы векторы были сонаправлены. А здесь они стоят под прямым углом, поэтому диагональ идёт напрямик и оказывается короче.',
      'You added the lengths, but the length of a sum of vectors is NOT the sum of the lengths. Fourteen would come out in one case only: if the two vectors pointed the same way. Here they stand at a right angle, so the diagonal goes straight across and turns out shorter.') },
    { when: (s) => s.value === 48, text: L(
      "Bu tomonlarning ko'paytmasi, ya'ni to'g'ri to'rtburchakning YUZI. Bu yerda esa uzunlik so'ralmoqda, yuza emas. Diagonalning uzunligi Pifagor teoremasi bilan topiladi: katetlarning kvadratlari qo'shiladi, keyin ildiz olinadi.",
      'Это произведение сторон, то есть ПЛОЩАДЬ прямоугольника. А здесь спрашивают длину, а не площадь. Длина диагонали находится по теореме Пифагора: складываются квадраты катетов, потом берётся корень.',
      'This is the product of the sides, that is, the AREA of the rectangle. But the question asks for a length, not an area. The length of the diagonal is found by the Pythagorean theorem: the squares of the legs are added and then the root is taken.') },
    { when: (s) => s.value === 2, text: L(
      "Siz uzunliklarni ayirdingiz. Ayirish ikki vektor QARAMA-QARSHI yo'nalganda ma'noga ega bo'lardi. Bu yerda ular to'g'ri burchak ostida, va javob ikki uzunlikning orasida yotishi kerak: sakkizdan katta, o'n to'rtdan kichik.",
      'Ты вычел длины. Вычитание имело бы смысл, если бы векторы были направлены НАВСТРЕЧУ. Здесь они под прямым углом, и ответ должен лежать между двумя длинами: больше восьми и меньше четырнадцати.',
      'You subtracted the lengths. Subtraction would make sense if the vectors pointed AGAINST each other. Here they are at a right angle, and the answer must lie between the two lengths: more than eight and less than fourteen.') },
  ],
  wrongText: L(
    "Yig'indi AC diagonali. Uning uzunligi Pifagor teoremasi bilan topiladi.",
    'Сумма это диагональ AC. Её длина находится по теореме Пифагора.',
    'The sum is the diagonal AC. Its length is found by the Pythagorean theorem.'),
};

export default function D53_07(props) { return <TypeValue data={DATA} {...props} />; }
