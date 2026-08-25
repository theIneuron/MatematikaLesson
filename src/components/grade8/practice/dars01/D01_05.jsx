// Dars01 · Amaliyot 05 — Eng katta · 🟡 · tag: largest_ban
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Kontent: src/books/grade8/DARS01_AMALIYOT_KONTENT.md §05
//
// 8a − 2a² = 2a(4 − a): nollari 0 va 4, eng kattasi 4. Topshiriq aynan
// IKKINCHI nolni ko'rishga majbur qiladi — З2 shu yerda tutiladi.
// Razborlar har xato javobni SON bilan rad etadi (З16).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'largest_ban', level: '🟡',
  target: 4, allowNeg: true,
  expr: [{ n: 'a + 3', d: '8a − 2a²' }], exprSize: 30,
  eyebrow: L('Eng katta', 'Наибольшее', 'Largest'),
  setup: L(
    "Maxrajda ikkita had turadi va ularning umumiy ko'paytuvchisi bor. Umumiy ko'paytuvchini qavsdan chiqaring — nol qayerda paydo bo'lishi ko'rinadi.",
    'В знаменателе два слагаемых, и у них есть общий множитель. Вынеси его за скобку — станет видно, где появляется нуль.',
    'The denominator has two terms with a common factor. Take it out of the bracket and you will see where the zero appears.'),
  label: L("a ning eng katta qiymati", 'наибольшее значение a', 'the largest value of a'),
  ask: L(
    "a ning qanday eng katta qiymatida kasr qiymatga ega emas?",
    'При каком наибольшем значении a дробь не имеет значения?',
    'At which largest value of a does the fraction have no value?'),
  correctText: L(
    "To'g'ri. Sakkiz a minus ikki a kvadrat — bu ikki a karra to'rt minus a. Ko'paytma nolga ikki joyda aylanadi: a nolda va a to'rtda. Kattasi to'rt. Tekshiring: to'rtda maxraj o'ttiz ikki minus o'ttiz ikki, ya'ni nol.",
    'Верно. Восемь a минус два a в квадрате — это два a на четыре минус a. Произведение обращается в нуль в двух местах: при a равном нулю и при a равном четырём. Наибольшее — четыре. Проверь: при четырёх знаменатель тридцать два минус тридцать два, то есть нуль.',
    'Correct. Eight a minus two a squared is two a times four minus a. The product becomes zero in two places: at a equal to zero and at a equal to four. The larger is four. Check: at four the denominator is thirty two minus thirty two, that is zero.'),
  wrongs: [
    { when: (s) => s.value === 0, text: L(
      "Nol ham taqiqlangan, lekin savol eng KATTAsini so'radi. Ikkinchi ko'paytuvchini nolga tenglang: to'rt minus a qachon nolga aylanadi?",
      'Нуль тоже запрещён, но спрошено НАИБОЛЬШЕЕ. Приравняй к нулю второй множитель: когда четыре минус a обращается в нуль?',
      'Zero is banned too, but the question asked for the LARGEST. Set the second factor to zero: when does four minus a become zero?') },
    { when: (s) => s.value === 8, text: L(
      "Sakkiz — yozuvdagi son, ildiz emas. Qo'yib ko'ring: sakkiz karra sakkiz oltmish to'rt, ikki karra oltmish to'rt bir yuz yigirma sakkiz, ayirmasi minus oltmish to'rt — nol emas.",
      'Восемь — число из записи, а не корень. Подставь: восемь на восемь — шестьдесят четыре, два на шестьдесят четыре — сто двадцать восемь, разность минус шестьдесят четыре, а не нуль.',
      'Eight is a number from the record, not a root. Substitute: eight times eight is sixty four, two times sixty four is one hundred twenty eight, the difference is minus sixty four, not zero.') },
    { when: (s) => s.value === 2, text: L(
      "Ikki — qavsdan chiqarilgan son, ildiz emas. Ikki a nolga a nolda aylanadi. Ikkida maxraj o'n olti minus sakkiz, ya'ni sakkiz.",
      'Два — вынесенное число, а не корень. Два a обращается в нуль при a равном нулю. При двух знаменатель шестнадцать минус восемь, то есть восемь.',
      'Two is the factor taken out, not a root. Two a becomes zero at a equal to zero. At two the denominator is sixteen minus eight, that is eight.') },
    { when: (s) => s.value === -4, text: L(
      "Ishora teskari: to'rt minus a nolga ARTI to'rtda aylanadi. Minus to'rtda maxraj minus o'ttiz ikki minus o'ttiz ikki, ya'ni minus oltmish to'rt.",
      'Знак наоборот: четыре минус a обращается в нуль при ПЛЮС четырёх. При минус четырёх знаменатель минус тридцать два минус тридцать два, то есть минус шестьдесят четыре.',
      'The sign is reversed: four minus a becomes zero at PLUS four. At minus four the denominator is minus thirty two minus thirty two, that is minus sixty four.') },
    { when: (s) => s.value === -3, text: L(
      "Minus uch — suratning noli. U yerda kasrning qiymati nolga teng bo'ladi, lekin qiymat BOR. Savol chiziqning tagi haqida.",
      'Минус три — нуль числителя. Там значение дроби равно нулю, но оно ЕСТЬ. Вопрос про то, что под чертой.',
      'Minus three is the zero of the numerator. There the value of the fraction is zero, but it EXISTS. The question is about what is below the bar.') },
  ],
  wrongText: L(
    "Maxrajni ko'paytuvchilarga ajratib nolga tenglang: ikki a karra to'rt minus a. Ikkita nol chiqadi, kattasini yozing.",
    'Разложи знаменатель на множители и приравняй к нулю: два a на четыре минус a. Выйдут два нуля — запиши больший.',
    'Factor the denominator and set it to zero: two a times four minus a. Two zeros come out — write the larger one.'),
};

export default function D01_05(props) { return <TypeValue data={DATA} {...props} />; }
