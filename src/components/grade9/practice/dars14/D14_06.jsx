// Dars14 · Amaliyot 06 — Javobni kiritish · 🟡 · teg: ikkita-ildiz-deb-oylash
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> TypeSet.
//
// MATEMATIKA: x² + 14x + 49 = (x + 7)². Diskriminant nolga teng, ildiz
// BITTA: x = −7. Asosiy tuzoq — «kvadrat tenglamada har doim ikkita ildiz»
// deb, minus yetti bilan birga yettini ham yozish.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { TypeSet } from '../asboblar9.jsx';

const DATA = {
  tag: 'ikkita-ildiz-deb-oylash', level: '🟡',
  eyebrow: L('Ildizlar', 'Корни', 'Roots'),
  setup: L(
    "Bu tenglamaning chap tomoni to'liq kvadratga aylanadi.",
    'Левая часть этого уравнения складывается в полный квадрат.',
    'The left side of this equation folds into a perfect square.'),
  ask: L(
    "Tenglamaning BARCHA ildizlarini yozing.",
    'Запиши ВСЕ корни уравнения.',
    'Write down ALL roots of the equation.'),
  hint: L(
    "Bir nechta bo'lsa, nuqta-vergul bilan ajrating.",
    'Если их несколько, раздели точкой с запятой.',
    'If there are several, separate them with a semicolon.'),
  placeholder: '0',
  givenLabel: L('Tenglama', 'Уравнение', 'Equation'),
  given: [['x² + 14x + 49 = 0']],
  answer: [-7],
  correctText: L(
    "To'g'ri: bitta ildiz, minus yetti. Chap tomon iks qo'shuv yetti butunning kvadrati, va kvadrat nolga aylanishi uchun qavsning ichi nol bo'lishi kerak: iks qo'shuv yetti nolga teng. Diskriminant ham shuni beradi: o'n to'rtning kvadrati bir yuz to'qson olti, to'rt karra qirq to'qqiz ham bir yuz to'qson olti, ayirmasi nol. Kvadrat tenglamada har doim ikkita ildiz bo'lishi shart emas — bu darsning butun gapi.",
    'Верно: один корень, минус семь. Левая часть — икс плюс семь в квадрате, а чтобы квадрат обратился в нуль, внутри скобки должен быть нуль: икс плюс семь равно нулю. Дискриминант даёт то же: четырнадцать в квадрате — сто девяносто шесть, четырежды сорок девять — тоже сто девяносто шесть, разность нуль. У квадратного уравнения не обязательно два корня — в этом весь смысл урока.',
    'Correct: one root, minus seven. The left side is x plus seven, squared, and for a square to become zero the inside of the bracket must be zero: x plus seven equals zero. The discriminant says the same: fourteen squared is one hundred ninety-six, four times forty-nine is one hundred ninety-six as well, and the difference is zero. A quadratic need not have two roots — that is the whole point of the lesson.'),
  wrongs: [
    { when: (s) => s.has(7) && s.has(-7), text: L(
      "Ikkinchi ildiz o'ylab qo'shilgan. Yettini tenglamaga qo'yib ko'ring: qirq to'qqiz qo'shuv to'qson sakkiz qo'shuv qirq to'qqiz — bir yuz to'qson olti, nol emas. Diskriminant nolga teng bo'lgan tenglamada ildiz BITTA.",
      'Второй корень придуман. Подставь семь в уравнение: сорок девять плюс девяносто восемь плюс сорок девять — сто девяносто шесть, а не нуль. При дискриминанте, равном нулю, корень ОДИН.',
      'The second root was invented. Substitute seven into the equation: forty-nine plus ninety-eight plus forty-nine is one hundred ninety-six, not zero. When the discriminant is zero there is ONE root.') },
    { when: (s) => s.size === 1 && s.has(7), text: L(
      "Ishora almashdi. Qavsda iks QO'SHUV yetti turibdi, u nolga aylanishi uchun iks minus yettiga teng bo'lishi kerak.",
      'Сбился знак. В скобке икс ПЛЮС семь, и чтобы это обратилось в нуль, икс должен быть равен минус семи.',
      'A sign slipped. The bracket has x PLUS seven, and for it to become zero x must be minus seven.') },
    { when: (s) => s.has(49) || s.has(-49), text: L(
      "Qirq to'qqiz — bu ozod had, ildiz emas. Ildizni to'liq kvadratdan toping: qavsning ichi nol bo'lgan iksni izlang.",
      'Сорок девять — это свободный член, а не корень. Найди корень по полному квадрату: ищи икс, при котором внутри скобки нуль.',
      'Forty-nine is the constant term, not a root. Find the root from the perfect square: look for the x that makes the bracket zero.') },
    { when: (s) => s.has(14) || s.has(-14), text: L(
      "O'n to'rt — iksning oldidagi koeffitsient. To'liq kvadratda esa uning YARMI turadi: iks qo'shuv yetti butunning kvadrati.",
      'Четырнадцать — коэффициент перед иксом. А в полном квадрате стоит его ПОЛОВИНА: икс плюс семь в квадрате.',
      'Fourteen is the coefficient in front of x. In the perfect square it is HALF of it that appears: x plus seven, squared.') },
    { when: (s) => s.size >= 2, text: L(
      "Ildiz bittadan ortiq yozilgan. Diskriminantni hisoblang: u nolga teng chiqadi, ya'ni ildiz aynan bitta.",
      'Записано больше одного корня. Посчитай дискриминант: он выйдет равным нулю, значит корень ровно один.',
      'More than one root was written. Compute the discriminant: it comes out zero, so there is exactly one root.') },
  ],
  wrongText: L(
    "Chap tomonni to'liq kvadrat ko'rinishida yozing: iks qo'shuv yetti butunning kvadrati. Kvadrat nolga aylanishi uchun qavsning ichi nechchi bo'lishi kerak?",
    'Запиши левую часть как полный квадрат: икс плюс семь в квадрате. Чему должно быть равно выражение в скобке, чтобы квадрат обратился в нуль?',
    'Write the left side as a perfect square: x plus seven, squared. What must the bracket equal for the square to become zero?'),
};

export default function D14_06(props) { return <TypeSet data={DATA} {...props} />; }
