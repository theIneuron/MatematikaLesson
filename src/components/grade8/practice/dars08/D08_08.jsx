// Dars08 · Amaliyot 08 — So'zlar · 🔴 · tag: rule_words
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> ClozeBank.
// Skelet: DARS07_11_AMALIYOT_SKELET.md §6 (8-dars, 8-pozitsiya)
//
// Darsning ikki tasdig'i bitta gapda: arifmetik ildizning ta'rifi va kasr
// ko'rsatkichning tuzilishi. Bankda uch tuzoq:
//   «musbat»    — nolni chetlab o'tadi, ildiz nol ham bo'ladi;
//   «ikki son»  — З29;
//   surat va maxrajning o'rni almashishi (ikkalasi ham bankda turadi).
//
// MUHIM: bu yerda kartalar SO'Z, ya'ni `L()` ICHIDA. `parts` uch tilda BIR
// XIL shaklda: matn, uya, matn, uya, matn, uya, matn.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ClozeBank, L } from '../kit.jsx';

const DATA = {
  tag: 'rule_words', level: '🔴',
  parts: [
    { text: L(
      'Arifmetik ildiz —',
      'Арифметический корень это',
      'An arithmetic root is a') },
    { slot: 0 },
    { text: L(
      "son, uning n-darajasi ildiz ostidagi ifodaga teng. Kasr ko'rsatkichda esa",
      'число, чья n-я степень равна подкоренному. А в дробном показателе',
      'number whose n-th power equals the radicand. In a fractional exponent the') },
    { slot: 1 },
    { text: L(
      'ildizning darajasini beradi,',
      'задаёт степень корня, а',
      'gives the degree of the root, and the') },
    { slot: 2 },
    { text: L(
      'esa ildiz ostidagi darajani.',
      'задаёт степень подкоренного.',
      'gives the power of the radicand.') },
  ],
  cards: [
    { id: 'w1', label: L('nomanfiy', 'неотрицательное', 'non-negative') },
    { id: 'w2', label: L('maxraj', 'знаменатель', 'denominator') },
    { id: 'w3', label: L('surat', 'числитель', 'numerator') },
    { id: 'w4', label: L('musbat', 'положительное', 'positive') },
    { id: 'w5', label: L('ikki son', 'два числа', 'two numbers') },
  ],
  answer: ['w1', 'w2', 'w3'],
  eyebrow: L("So'zlar", 'Слова', 'Words'),
  setup: L(
    "Darsning qoidasi yozilgan, lekin uchta so'z tushib qolgan. Ularni pastdagi kartalardan qo'ying.",
    'Правило урока записано, но три слова выпали. Поставь их из карточек снизу.',
    'The rule of the lesson is written down, but three words fell out. Put them back from the cards below.'),
  ask: L("Kartani bosing, keyin bo'sh kartochkani bosing.", 'Нажми карточку, потом пустую клетку.', 'Tap a card, then tap an empty cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Ta'rifda ikki shart bor: daraja ildiz ostiga teng bo'lsin va son NOMANFIY bo'lsin. Nomanfiy degani nol ham mumkin: nol karra nol nol, ya'ni noldan ildiz nolga teng. Kasr ko'rsatkichda maxraj ildizning darajasini, surat esa ildiz ostidagi darajani beradi. Oltmish to'rtning ikki uchdan bir ko'rsatkichli darajasi bilan tekshiring: maxraj uch — kub ildiz, surat ikki — kvadrat, javob o'n olti.",
    'Верно. В определении два условия: степень равна подкоренному и число НЕОТРИЦАТЕЛЬНО. Неотрицательное значит и нуль подходит: нуль на нуль нуль, то есть корень из нуля равен нулю. В дробном показателе знаменатель задаёт степень корня, числитель степень подкоренного. Проверь на шестидесяти четырёх в степени две третьих: знаменатель три — кубический корень, числитель два — квадрат, ответ шестнадцать.',
    'Correct. The definition has two conditions: the power equals the radicand and the number is NON-NEGATIVE. Non-negative includes zero: zero times zero is zero, so the root of zero is zero. In a fractional exponent the denominator gives the degree of the root and the numerator the power of the radicand. Check it on sixty four to the power two thirds: the denominator three gives the cube root, the numerator two the square, and the answer is sixteen.'),
  wrongs: [
    { when: (s) => s.slots[0] === 'w4', text: L(
      "Musbat so'zi nolni chetlab o'tadi, nol esa ildizning haqiqiy qiymati: noldan kvadrat ildiz nolga teng, chunki nol karra nol nol. Ta'rifda shuning uchun nomanfiy deyiladi.",
      'Слово положительное отбрасывает нуль, а нуль настоящее значение корня: квадратный корень из нуля равен нулю, ведь нуль на нуль нуль. Поэтому в определении сказано неотрицательное.',
      'The word positive throws away zero, and zero is a genuine value of a root: the square root of zero is zero, since zero times zero is zero. That is why the definition says non-negative.') },
    { when: (s) => s.slots[0] === 'w5', text: L(
      "Ikki son — bu tenglamaning javobi, ildizning emas. x kvadrati o'ttiz oltiga teng tenglamada ikki yechim bor, ildiz belgisi esa bitta son beradi. Aks holda ildizlarni qo'shib bo'lmas edi.",
      'Два числа — ответ уравнения, а не корня. У уравнения x в квадрате равно тридцати шести два решения, а знак корня даёт одно число. Иначе корни нельзя было бы складывать.',
      'Two numbers answer an equation, not a root. The equation x squared equals thirty six has two solutions, while the root sign gives one number. Otherwise roots could not be added.') },
    { when: (s) => s.slots[1] === 'w3' && s.slots[2] === 'w2', text: L(
      "Surat bilan maxraj o'rin almashdi. Oltmish to'rtning ikki uchdan bir darajasini ikki yo'l bilan sanab solishtiring: kub ildizdan keyin kvadrat o'n olti beradi, kvadrat ildizdan keyin kub esa besh yuz o'n ikkini. To'g'risi o'n olti.",
      'Числитель и знаменатель поменялись местами. Посчитай шестьдесят четыре в степени две третьих двумя путями: кубический корень, потом квадрат даёт шестнадцать, а квадратный корень, потом куб даёт пятьсот двенадцать. Верно шестнадцать.',
      'The numerator and the denominator swapped places. Compute sixty four to the power two thirds both ways: the cube root then the square gives sixteen, the square root then the cube gives five hundred twelve. Sixteen is right.') },
    { when: (s) => s.slots.indexOf('w4') !== -1 || s.slots.indexOf('w5') !== -1, text: L(
      "Bankda ikki tuzoq bor va ikkalasi ham ta'rifning birinchi bo'shlig'iga mos kelib turadi. Ularni son bilan tekshiring: noldan ildiz bormi va ildiz belgisi nechta son beradi.",
      'В банке две ловушки, и обе просятся в первую клетку определения. Проверь их числом: есть ли корень из нуля и сколько чисел даёт знак корня.',
      'The bank holds two traps and both fit the first gap of the definition. Test them with numbers: does zero have a root, and how many numbers does the root sign give.') },
  ],
  wrongText: L(
    "Qoidani oltmish to'rtning ikki uchdan bir ko'rsatkichli darajasida tekshiring: qaysi son ildizning darajasini beradi va qaysi biri ildiz ostidagi darajani.",
    'Проверь правило на шестидесяти четырёх в степени две третьих: какое число задаёт степень корня, а какое степень подкоренного.',
    'Test the rule on sixty four to the power two thirds: which number gives the degree of the root and which the power of the radicand.'),
};

export default function D08_08(props) { return <ClozeBank data={DATA} {...props} />; }
