// Dars23 · Amaliyot 01 — Ha yoki yo'q · 🟢 · tag: difference_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §5 (23-dars, 1-pozitsiya)
//
// T1 va T2 ENG QISQA SHAKLDA. Ikki mulohazada bir xil son turadi — nol
// butun to'rt — va faqat ISHORASI farq qiladi. Ya'ni tekshiriladigan narsa
// sonning kattaligi emas, uning ishorasi: taqqoslashni ayirmaning ishorasi
// hal qiladi (T3).
//
// Sonlarning o'zi berilmagan va bu ATAYLAB: a va b qanday son ekani noma'lum,
// lekin xulosa baribir chiqadi. Darsning butun mag'zi shu yerda.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'difference_claims', level: '🟢',
  itemSize: 16,
  items: [
    { id: 's1', yes: true,
      tokens: ['a − b = 0,4'],
      claim: L('a > b', 'a > b', 'a > b') },
    { id: 's2', yes: false,
      tokens: ['a − b = −0,4'],
      claim: L('a > b', 'a > b', 'a > b') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "Ikki holatda a va b sonlarning ayirmasi berilgan. Sonlarning o'zi noma'lum, lekin ularni taqqoslash mumkin.",
    'В двух случаях дана разность чисел a и b. Сами числа неизвестны, но сравнить их можно.',
    'In two cases the difference of the numbers a and b is given. The numbers themselves are unknown, but they can still be compared.'),
  ask: L(
    "Xulosa rost bo'lsa «Ha», yolg'on bo'lsa «Yo'q».",
    'Если вывод верен — «Да», если ложен — «Нет».',
    'If the conclusion is true, «Yes»; if false, «No».'),
  correctText: L(
    "To'g'ri. Birinchisida ayirma musbat: a dan b ni ayirganda ortiqcha qoldi, demak a katta. Ikkinchisida ayirma manfiy: yetishmadi, demak a kichik. Sonlarning o'zi berilmagan bo'lsa ham xulosa aniq.",
    'Верно. В первом разность положительна: при вычитании b из a осталось лишнее, значит a больше. Во втором разность отрицательна: не хватило, значит a меньше. Хотя сами числа не даны, вывод однозначен.',
    'Correct. In the first the difference is positive: subtracting b from a left something over, so a is greater. In the second it is negative: something was missing, so a is smaller. Although the numbers are not given, the conclusion is definite.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Ikkinchisida ayirma MANFIY, ya'ni xulosa teskari: a b dan KICHIK. Sonni tekshirib ko'ring: a bir, b bir butun to'rt bo'lsa, ayirma minus nol butun to'rt chiqadi — va bir haqiqatan bir butun to'rtdan kichik. Ayirmaning kattaligi emas, ISHORASI hal qiladi.",
      'Во втором разность ОТРИЦАТЕЛЬНА, значит вывод обратный: a МЕНЬШЕ b. Проверь числами: если a равно одному, а b одной целой четырём, разность выйдет минус четыре десятых — и один действительно меньше одной целой четырёх. Решает не величина разности, а её ЗНАК.',
      'In the second the difference is NEGATIVE, so the conclusion is reversed: a is SMALLER than b. Check with numbers: if a is one and b is one point four, the difference is minus zero point four — and one really is smaller than one point four. It is not the size of the difference that decides but its SIGN.') },
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Birinchi xulosa rost. Ayirma musbat bo'lsa, birinchi son ikkinchisidan katta — bu darsning birinchi qoidasi. Nol butun to'rt noldan katta, demak a b dan katta. Sonlarning o'zini bilish shart emas.",
      'Первый вывод верен. Если разность положительна, первое число больше второго — это первое правило урока. Четыре десятых больше нуля, значит a больше b. Знать сами числа не обязательно.',
      'The first conclusion is true. If the difference is positive, the first number is greater than the second — that is the first rule of the lesson. Zero point four is greater than zero, so a is greater than b. Knowing the numbers themselves is not required.') },
  ],
  wrongText: L(
    "Ayirmaning ishorasiga qarang: musbat bo'lsa birinchi son katta, manfiy bo'lsa kichik. Sonlarning o'zi kerak emas.",
    'Смотри на знак разности: положительна — первое число больше, отрицательна — меньше. Сами числа не нужны.',
    'Look at the sign of the difference: positive means the first number is greater, negative means smaller. The numbers themselves are not needed.'),
};

export default function D23_01(props) { return <TrueFalse data={DATA} {...props} />; }
