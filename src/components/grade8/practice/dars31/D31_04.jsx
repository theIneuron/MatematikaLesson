// Dars31 · Amaliyot 04 — Juftlash · 🟡 · tag: power_to_value
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §3 (31-dars, 4-pozitsiya)
//
// TO'RT YOZUVDA O'SHA IKKILIK. Farq faqat ikki joyda: ko'rsatkichda va
// minusning O'RNIDA. Minus qavs ICHIDA bo'lsa u asosga tegishli va javob
// manfiy; ko'rsatkichda bo'lsa u faqat ag'darishni buyuradi va javob
// musbat kasr. З63 aynan shu ikkovini chalkashtiradi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const DATA = {
  tag: 'power_to_value', level: '🟡',
  connect: true,
  targetSize: 20, itemSize: 19,
  items: [
    { id: 'm1', tokens: ['2⁻¹'] },
    { id: 'm2', tokens: ['2⁻²'] },
    { id: 'm3', tokens: ['2⁰'] },
    { id: 'm4', tokens: ['(−2)⁻¹'] },
  ],
  targets: [
    { id: 't1', tokens: [{ n: '1', d: '2' }] },
    { id: 't2', tokens: [{ n: '1', d: '4' }] },
    { id: 't3', tokens: ['1'] },
    { id: 't4', tokens: ['−', { n: '1', d: '2' }] },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Juftlash', 'Сопоставление', 'Matching'),
  setup: L(
    "To'rt yozuvda bitta asos — ikki. Farq ikki joyda: ko'rsatkichning qiymatida va minusning o'rnida. Minus qavs ichida ham, ko'rsatkichda ham tura oladi, va bu ikki narsa bir xil emas.",
    'В четырёх записях одно основание — двойка. Различие в двух местах: в значении показателя и в том, где стоит минус. Минус может стоять и внутри скобки, и в показателе, и это не одно и то же.',
    'The four records share one base — two. They differ in two places: in the value of the exponent and in where the minus sits. A minus can stand inside the bracket or in the exponent, and these are not the same thing.'),
  ask: L(
    "Chapdan yozuvni bosing, keyin o'ngdan uning qiymatini bosing.",
    'Нажми запись слева, потом её значение справа.',
    'Tap a record on the left, then its value on the right.'),
  correctText: L(
    "To'g'ri. Ikkining minus birinchi darajasi bir bo'lingan ikki, minus ikkinchi darajasi bir bo'lingan to'rt: ko'rsatkich qanchalik kichik bo'lsa, kasr ham shunchalik kichik. Nolinchi daraja bir — u shu qatorning o'rtasida turadi. Oxirgisida minus QAVS ICHIDA, ya'ni asosning o'zi manfiy: minus ikkining teskarisi minus bir ikkidan. Uch yozuvda javob musbat, bittasida manfiy, va farqni faqat qavs hal qildi.",
    'Верно. Два в минус первой это одна вторая, в минус второй — одна четвёртая: чем меньше показатель, тем меньше дробь. Нулевая степень равна единице — она стоит в середине этого ряда. В последней записи минус стоит ВНУТРИ СКОБКИ, то есть отрицательно само основание: обратное к минус двум это минус одна вторая. В трёх записях ответ положительный, в одной отрицательный, и разницу решила только скобка.',
    'Correct. Two to the minus one is one half, to the minus two is one quarter: the smaller the exponent, the smaller the fraction. The zero power is one — it sits in the middle of that row. In the last record the minus is INSIDE THE BRACKET, so the base itself is negative: the reciprocal of minus two is minus one half. Three records give a positive answer and one a negative, and only the bracket decided the difference.'),
  wrongs: [
    { when: (s) => s.pair.m4 !== 't4', text: L(
      "Oxirgi yozuvda minus QAVS ICHIDA turibdi, ya'ni u asosga tegishli. Asos minus ikki, ko'rsatkich minus bir. Manfiy ko'rsatkich teskari songa o'tishni buyuradi, teskari son esa asosning ishorasini saqlaydi: minus ikkining teskarisi minus bir ikkidan. Tekshiring — minus bir ikkidan ni minus ikkiga ko'paytiring, bir chiqadi.",
      'В последней записи минус стоит ВНУТРИ СКОБКИ, значит он относится к основанию. Основание минус два, показатель минус один. Отрицательный показатель велит перейти к обратному числу, а обратное число сохраняет знак основания: обратное к минус двум это минус одна вторая. Проверь — умножь минус одну вторую на минус два, получится единица.',
      'In the last record the minus stands INSIDE THE BRACKET, so it belongs to the base. The base is minus two, the exponent minus one. A negative exponent orders a move to the reciprocal, and the reciprocal keeps the sign of the base: the reciprocal of minus two is minus one half. Check — multiply minus one half by minus two and you get one.') },
    { when: (s) => s.pair.m1 === 't2' || s.pair.m2 === 't1', text: L(
      "Bu ikki yozuv almashib ketdi. Ko'rsatkichni sanang: minus birinchi daraja BITTA ikkini maxrajga tushiradi, minus ikkinchisi esa IKKITA ikkini, ya'ni to'rtni. Yozuvni ochib yozing: ikkining minus ikkinchi darajasi bir bo'lingan ikki karra ikki. Ko'rsatkichning moduli maxrajdagi ko'paytuvchilar sonini beradi.",
      'Эти две записи поменялись местами. Сосчитай показатель: минус первая степень уводит в знаменатель ОДНУ двойку, минус вторая — ДВЕ двойки, то есть четыре. Раскрой запись: два в минус второй это единица делить на два умножить на два. Модуль показателя даёт число множителей в знаменателе.',
      'These two records were swapped. Count the exponent: the minus first power sends ONE two into the denominator, the minus second sends TWO twos, that is four. Unfold the record: two to the minus two is one divided by two times two. The size of the exponent gives the number of factors in the denominator.') },
    { when: (s) => s.pair.m3 !== 't3', text: L(
      "Nolinchi daraja birga teng, va u shu qatorda alohida joyda turadi: minus birinchi daraja bir ikkidan, nolinchi bir, birinchi ikki — har qadamda ikkiga ko'paytiriladi. Nol na musbat, na manfiy ko'rsatkich, shuning uchun kasr ham, ko'paytma ham hosil bo'lmaydi; qoladigan narsa bitta — bir.",
      'Нулевая степень равна единице, и в этом ряду у неё особое место: минус первая одна вторая, нулевая единица, первая два — на каждом шаге умножение на два. Нуль не положительный и не отрицательный показатель, поэтому не возникает ни дроби, ни произведения; остаётся одно — единица.',
      'The zero power equals one, and in this row it has its own place: minus one gives one half, zero gives one, one gives two — each step multiplies by two. Zero is neither a positive nor a negative exponent, so neither a fraction nor a product arises; one thing remains — one.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har yozuvga ikki savol bering: minus qayerda turibdi va ko'rsatkichning moduli qancha. Minus qavs ichida bo'lsa javob manfiy, ko'rsatkichda bo'lsa javob musbat kasr; modul esa maxrajdagi ko'paytuvchilar sonini beradi.",
      'К каждой записи задай два вопроса: где стоит минус и каков модуль показателя. Минус внутри скобки — ответ отрицательный, минус в показателе — ответ положительная дробь; а модуль даёт число множителей в знаменателе.',
      'Ask two questions of every record: where the minus stands and how large the exponent is. A minus inside the bracket makes the answer negative, a minus in the exponent makes it a positive fraction; and the size gives the number of factors in the denominator.') },
  ],
  wrongText: L(
    "Minusning o'rniga qarang: qavs ichida bo'lsa u asosga tegishli va javob manfiy; ko'rsatkichda bo'lsa u faqat ag'darishni buyuradi.",
    'Смотри, где стоит минус: внутри скобки он относится к основанию и ответ отрицательный; в показателе он лишь велит перевернуть число.',
    'Look at where the minus stands: inside the bracket it belongs to the base and the answer is negative; in the exponent it only orders the number to be turned over.'),
};

export default function D31_04(props) { return <MatchPairs data={DATA} {...props} />; }
