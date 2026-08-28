// Dars13 · Amaliyot 07 — Sonlar o'qi · 🟡 · teg: nomuvofiq-yechimni-qabul-qilish
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> DomainAxis,
// `point` rejimida.
//
// MATEMATIKA: s² = 7s -> s² − 7s = 0 -> s(s − 7) = 0, ildizlari 0 va 7.
// Nol matematik jihatdan to'g'ri ildiz, lekin ikki xonali sonning
// raqamlari yig'indisi nol bo'lolmaydi — u holda ikkala raqam ham nol,
// ya'ni son umuman yo'q. Darsning uchinchi tasdig'i.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { DomainAxis } from '../asboblar9.jsx';

const DATA = {
  tag: 'nomuvofiq-yechimni-qabul-qilish', level: '🟡',
  eyebrow: L('Sonlar o\'qi', 'Числовая ось', 'The number line'),
  setup: L(
    "Ikki xonali son masalasidan shu tenglama chiqdi; bu yerda s — raqamlar yig'indisi. Uning ikkita ildizi bor, lekin ikkalasi ham masalaga mos kelmaydi.",
    'Из задачи про двузначное число вышло это уравнение; здесь s — сумма цифр. У него два корня, но не оба подходят задаче.',
    'This equation came out of a problem about a two-digit number; here s is the digit sum. It has two roots, but not both fit the problem.'),
  ask: L(
    "Masalaning shartiga MOS keladigan ildizni o'qda belgilang.",
    'Отметь на оси корень, ПОДХОДЯЩИЙ условию задачи.',
    'Mark on the axis the root that FITS the problem.'),
  givenLabel: L('Tenglama', 'Уравнение', 'Equation'),
  given: [['s² = 7s']],
  mode: 'point',
  axis: { from: -2, to: 9 },
  answer: { at: 7, closed: true },
  closedLabel: L('Bo\'yalgan', 'Закрашенная', 'Filled'),
  openLabel: L('Bo\'sh', 'Пустая', 'Hollow'),
  correctText: L(
    "To'g'ri. Hamma hadni chapga o'tkazsak, s kvadrat minus yetti s nolga teng, ya'ni s karra s minus yetti nolga teng: ildizlari nol va yetti. Nol matematik jihatdan mukammal ildiz, lekin ikki xonali sonning raqamlari yig'indisi nol bo'lolmaydi — buning uchun ikkala raqam ham nol bo'lishi kerak, o'nlar raqami esa noldan boshlanmaydi. Shuning uchun javob yetti. Bu darsning eng muhim odati: har bir ildizni masalaning SHARTIGA qaytarib tekshirish.",
    'Верно. Перенеся всё влево, получим s в квадрате минус семь s равно нулю, то есть s на s минус семь равно нулю: корни нуль и семь. Нуль — математически безупречный корень, но сумма цифр двузначного числа нулём быть не может: для этого обе цифры должны быть нулями, а цифра десятков с нуля не начинается. Поэтому ответ семь. Это главная привычка урока: возвращать каждый корень в УСЛОВИЕ задачи.',
    'Correct. Moving everything left gives s squared minus seven s equals zero, that is s times s minus seven equals zero, with roots zero and seven. Zero is a perfectly good root mathematically, but the digit sum of a two-digit number cannot be zero: that would need both digits to be zero, and a tens digit does not start at zero. Hence the answer is seven. This is the key habit of the lesson: take every root back to the STATEMENT of the problem.'),
  wrongs: [
    { when: (s) => s.at === 0, text: L(
      "Nol tenglamani qanoatlantiradi, lekin masalani yo'q. Raqamlar yig'indisi nol bo'lsa, ikkala raqam ham nol bo'ladi va ikki xonali son qolmaydi.",
      'Нуль удовлетворяет уравнению, но не задаче. Если сумма цифр нуль, то обе цифры нули, и двузначного числа не остаётся.',
      'Zero satisfies the equation but not the problem. If the digit sum is zero, both digits are zero, and no two-digit number is left.') },
    { when: (s) => s.at === -7, text: L(
      "Ishora almashdi. Hadni chapga o'tkazganda s kvadrat minus yetti s chiqadi, ildizlari esa nol va MUSBAT yetti. Raqamlar yig'indisi manfiy bo'lishi ham mumkin emas.",
      'Сбился знак. При переносе слагаемого влево выходит s в квадрате минус семь s, а корни — нуль и ПОЛОЖИТЕЛЬНЫЕ семь. Сумма цифр к тому же не бывает отрицательной.',
      'A sign slipped. Moving the term left gives s squared minus seven s, and the roots are zero and POSITIVE seven. A digit sum cannot be negative either.') },
    { when: (s) => s.at === 1, text: L(
      "Bir bu tenglamaning ildizi emas: bir kvadrat bir, yetti karra bir esa yetti. Tenglamani ko'paytuvchilarga ajratib ildizlarini toping.",
      'Единица не корень этого уравнения: один в квадрате — один, а семью один — семь. Разложи уравнение на множители и найди корни.',
      'One is not a root of this equation: one squared is one, while seven times one is seven. Factor the equation and find its roots.') },
    { when: (s) => s.atOk && !s.closedOk, text: L(
      "Bu ildiz masalaning javobiga kiradi, demak nuqta bo'yalgan bo'lishi kerak. Bo'sh nuqta chiqarib tashlangan sonni bildiradi — bu yerda chiqarib tashlangani nol.",
      'Этот корень входит в ответ задачи, значит точка должна быть закрашена. Пустая точка означает исключённое число — здесь исключён нуль.',
      'This root belongs to the answer of the problem, so the point must be filled. A hollow point means an excluded number — and here the excluded one is zero.') },
    { when: (s) => !s.atOk, text: L(
      "Avval tenglamani yechib ikkita ildizni toping, keyin har birini masalaning shartiga qo'yib ko'ring: raqamlar yig'indisi shunday bo'lishi mumkinmi?",
      'Сначала реши уравнение и найди два корня, потом проверь каждый по условию задачи: может ли сумма цифр быть такой?',
      'First solve the equation and find both roots, then test each against the statement: can a digit sum be like that?'),
    },
  ],
  wrongText: L(
    "Tenglamani nolga keltiring va ko'paytuvchilarga ajratib ildizlarini toping. Keyin har bir ildizni masalaning shartiga qaytarib tekshiring.",
    'Приведи уравнение к нулю, разложи на множители и найди корни. Потом верни каждый корень в условие задачи и проверь.',
    'Bring the equation to zero, factor it and find the roots. Then take each root back to the statement and test it.'),
};

export default function D13_07(props) { return <DomainAxis data={DATA} {...props} />; }
