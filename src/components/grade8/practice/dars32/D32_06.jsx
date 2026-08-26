// Dars32 · Amaliyot 06 — Juftlash · 🟡 · tag: expr_to_power
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §4 (32-dars, 6-pozitsiya)
//
// TO'RT YOZUVDA O'SHA IKKI SON — BESH VA IKKI, — VA IKKALASI HAM MANFIY
// KO'RSATKICH BILAN O'YNAYDI:
//   a⁵·a⁻²   -> 5 + (−2) = 3
//   a⁵:a⁻²   -> 5 − (−2) = 7     <- eng qimmat joy
//   (a⁵)⁻²   -> 5 · (−2) = −10
//   a⁻⁵·a⁻²  -> −5 + (−2) = −7
// Ikkinchisi qimmat, chunki AYIRISH natijani KATTALASHTIRDI: manfiy sonni
// ayirish uni qo'shishga aylantiradi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const DATA = {
  tag: 'expr_to_power', level: '🟡',
  connect: true,
  targetSize: 19, itemSize: 18,
  items: [
    { id: 'm1', tokens: ['a⁵ · a⁻²'] },
    { id: 'm2', tokens: ['a⁵ : a⁻²'] },
    { id: 'm3', tokens: ['(a⁵)⁻²'] },
    { id: 'm4', tokens: ['a⁻⁵ · a⁻²'] },
  ],
  targets: [
    { id: 't1', tokens: ['a³'] },
    { id: 't2', tokens: ['a⁷'] },
    { id: 't3', tokens: ['a⁻¹⁰'] },
    { id: 't4', tokens: ['a⁻⁷'] },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Juftlash', 'Сопоставление', 'Matching'),
  setup: L(
    "To'rt ifodada bir xil ikki son turibdi — besh va ikki. Farq amalda va minusning o'rnida, natijalar esa butunlay boshqa chiqadi.",
    'В четырёх выражениях стоят одни и те же два числа — пять и два. Различие в действии и в том, где стоит минус, а результаты выходят совсем разными.',
    'The four expressions hold the same two numbers — five and two. They differ in the operation and in where the minus stands, and the results come out entirely different.'),
  ask: L(
    "Chapdan ifodani bosing, keyin o'ngdan uning natijasini bosing.",
    'Нажми выражение слева, потом его результат справа.',
    'Tap an expression on the left, then its result on the right.'),
  correctText: L(
    "To'g'ri. Birinchisida ko'paytirish: besh qo'shuv minus ikki uch. Ikkinchisida bo'lish: besh minus minus ikki, ya'ni besh qo'shuv ikki — yetti. Bu eng qimmat joy: BO'LISH natijani kattalashtirdi, chunki manfiy ko'rsatkich ayirilyapti. Uchinchisida daraja darajaga ko'tarilgan: besh karra minus ikki minus o'n. To'rtinchisida ikkala ko'rsatkich ham manfiy va ular qo'shiladi: minus besh qo'shuv minus ikki minus yetti. Bir xil sonlardan uch, yetti, minus o'n va minus yetti chiqdi.",
    'Верно. В первом умножение: пять плюс минус два три. Во втором деление: пять минус минус два, то есть пять плюс два — семь. Это самое дорогое место: ДЕЛЕНИЕ увеличило результат, потому что вычитается отрицательный показатель. В третьем степень возведена в степень: пятью минус два минус десять. В четвёртом оба показателя отрицательны и складываются: минус пять плюс минус два минус семь. Из одних и тех же чисел вышли три, семь, минус десять и минус семь.',
    'Correct. In the first, multiplication: five plus minus two is three. In the second, division: five minus minus two, that is five plus two — seven. This is the costliest spot: DIVISION made the result larger, because a negative exponent is being subtracted. In the third a power is raised to a power: five times minus two is minus ten. In the fourth both exponents are negative and they add: minus five plus minus two is minus seven. The same numbers gave three, seven, minus ten and minus seven.'),
  wrongs: [
    { when: (s) => s.pair.m2 !== 't2', text: L(
      "Ikkinchi ifodada bo'lish turibdi, ya'ni ko'rsatkichlar ayiriladi: besh minus minus ikki. Manfiy sonni ayirish uni QO'SHISHGA aylantiradi, ya'ni besh qo'shuv ikki — yetti. Natija dastlabkisidan katta chiqdi, va bu g'alati emas: maxrajda manfiy ko'rsatkichli daraja turibdi, u esa aslida kasr, kasrga bo'lish esa sonni kattalashtiradi.",
      'Во втором выражении деление, значит показатели вычитаются: пять минус минус два. Вычитание отрицательного превращается в СЛОЖЕНИЕ, то есть пять плюс два — семь. Результат оказался больше исходного, и это не странно: в знаменателе стоит степень с отрицательным показателем, то есть дробь, а деление на дробь число увеличивает.',
      'The second expression is a division, so the exponents subtract: five minus minus two. Subtracting a negative turns into ADDING, that is five plus two — seven. The result came out larger than the original, and that is no surprise: the denominator holds a power with a negative exponent, that is a fraction, and dividing by a fraction makes a number larger.') },
    { when: (s) => s.pair.m3 !== 't3', text: L(
      "Uchinchi ifodada QAVS turibdi, ya'ni daraja darajaga ko'tarilgan va ko'rsatkichlar ko'paytiriladi: besh karra minus ikki minus o'n. Qo'shganda uch chiqardi, lekin uch birinchi ifodaning javobi. Qavsning bor-yo'qligi butun qoidani almashtiradi.",
      'В третьем выражении стоит СКОБКА, значит степень возведена в степень и показатели перемножаются: пятью минус два минус десять. При сложении вышло бы три, но три — ответ первого выражения. Наличие скобки меняет всё правило.',
      'The third expression has a BRACKET, so a power is raised to a power and the exponents multiply: five times minus two is minus ten. Adding would give three, but three is the answer to the first expression. The presence of a bracket changes the whole rule.') },
    { when: (s) => s.pair.m1 === 't4' || s.pair.m4 === 't1', text: L(
      "Bu ikki ifoda faqat BIRINCHI ko'rsatkichning ishorasida farq qiladi. Birinchisida besh musbat: besh qo'shuv minus ikki uch. To'rtinchisida esa minus besh: minus besh qo'shuv minus ikki minus yetti. Ikki manfiy sonni qo'shsangiz manfiy son chiqadi va uning moduli ortadi.",
      'Эти два выражения отличаются только знаком ПЕРВОГО показателя. В первом пять положительно: пять плюс минус два три. В четвёртом минус пять: минус пять плюс минус два минус семь. Сложение двух отрицательных даёт отрицательное число, и модуль его растёт.',
      'These two expressions differ only in the sign of the FIRST exponent. In the first, five is positive: five plus minus two is three. In the fourth it is minus five: minus five plus minus two is minus seven. Adding two negatives gives a negative whose size grows.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har ifodaga ikki savol bering: amal qaysi (nuqta, ikki nuqta yoki qavs) va ko'rsatkichlarning ishorasi qanday. Amal qoidani beradi, ishora esa hisobni; ikkalasini birga qo'llash kerak.",
      'К каждому выражению задай два вопроса: какое действие (точка, двоеточие или скобка) и каковы знаки показателей. Действие даёт правило, знаки — счёт; применять надо оба сразу.',
      'Ask two questions of every expression: which operation (dot, colon or bracket) and what the signs of the exponents are. The operation gives the rule, the signs give the arithmetic; both must be applied together.') },
  ],
  wrongText: L(
    "Amalni aniqlang, keyin ishoralarga qarang. Manfiy ko'rsatkichni AYIRISH uni qo'shishga aylantiradi va natijani kattalashtiradi.",
    'Определи действие, потом смотри на знаки. ВЫЧИТАНИЕ отрицательного показателя превращается в сложение и увеличивает результат.',
    'Identify the operation, then look at the signs. SUBTRACTING a negative exponent turns into adding and makes the result larger.'),
};

export default function D32_06(props) { return <MatchPairs data={DATA} {...props} />; }
