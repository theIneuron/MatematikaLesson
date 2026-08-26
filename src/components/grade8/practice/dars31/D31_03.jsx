// Dars31 · Amaliyot 03 — Ha yoki yo'q · 🟢 · tag: power_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §3 (31-dars, 3-pozitsiya)
//
// IKKALA DA'VO HAM ROST (skelet §0a.3). 21-28 darslarda javob har safar
// «Ha, Yo'q» edi, ya'ni mexanikani mazmunsiz yengish mumkin edi. Bu yerda
// naqsh sinadi, va sinishi bilan birga xato ham ochiladi: o'quvchi «bittasi
// yolg'on bo'lishi kerak» deb kutadi va manfiy asos yoki manfiy ko'rsatkich
// ko'ringan da'voni ataylab rad etadi.
//
// Ikki da'vo ikki tasdiqni tekshiradi: birinchisi T1 (nolinchi daraja),
// ikkinchisi T2 (manfiy ko'rsatkich). Razbor har birini SON bilan tekshiradi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'power_claims', level: '🟢',
  itemSize: 18,
  items: [
    { id: 's1', yes: true, tokens: ['(−4)⁰ = 1'],
      claim: L("bu tenglik rost", 'это равенство верно', 'this equality is true') },
    { id: 's2', yes: true, tokens: ['3⁻² =', { n: '1', d: '9' }],
      claim: L("bu tenglik rost", 'это равенство верно', 'this equality is true') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "Ikki tenglik. Birinchisida asos manfiy, ikkinchisida ko'rsatkich manfiy. Har birini alohida tekshirish kerak: bittasining javobi ikkinchisiga hech narsa demaydi.",
    'Два равенства. В первом отрицательное основание, во втором отрицательный показатель. Каждое надо проверять отдельно: ответ одного ничего не говорит о другом.',
    'Two equalities. The first has a negative base, the second a negative exponent. Each must be checked on its own: the answer to one says nothing about the other.'),
  ask: L(
    "Tenglik rost bo'lsa «Ha», yolg'on bo'lsa «Yo'q».",
    'Если равенство верно — «Да», если ложно — «Нет».',
    'If the equality is true, «Yes»; if false, «No».'),
  correctText: L(
    "To'g'ri, ikkalasi ham rost. Birinchisida asos manfiy, lekin qoida asosning ISHORASIGA emas, uning noldan farqli ekaniga qaraydi: minus to'rt noldan farqli, demak uning nolinchi darajasi bir. Buni bo'lish bilan tekshiring — minus to'rtning kvadratini o'ziga bo'lsangiz bir chiqadi. Ikkinchisida ko'rsatkich manfiy, va u teskari songa o'tishni bildiradi: uchning minus ikkinchi darajasi bir bo'lingan uchning kvadrati, ya'ni bir to'qqizdan. Ishora almashmadi, son AG'DARILDI.",
    'Верно, оба утверждения истинны. В первом основание отрицательное, но правило смотрит не на ЗНАК основания, а на то, что оно отлично от нуля: минус четыре отлично от нуля, значит его нулевая степень равна единице. Проверь делением — минус четыре в квадрате, делённое само на себя, даёт единицу. Во втором показатель отрицательный, и он означает переход к обратному числу: три в минус второй это единица делить на три в квадрате, то есть одна девятая. Знак не поменялся, число ПЕРЕВЕРНУЛОСЬ.',
    'Correct, both are true. In the first the base is negative, but the rule looks not at the SIGN of the base, only at its being different from zero: minus four is not zero, so its zero power is one. Check by division — minus four squared divided by itself gives one. In the second the exponent is negative, and that means moving to the reciprocal: three to the minus two is one divided by three squared, that is one ninth. The sign did not change, the number was TURNED OVER.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s1') !== -1 && s.bad.indexOf('s2') !== -1, text: L(
      "Ikkala tenglik ham rost edi, va ikkalasi ham rad etildi. Har birini alohida son bilan tekshiring. Minus to'rtning nolinchi darajasi: minus to'rtning kvadrati o'n olti, uni o'zi bilan bo'ling — bir chiqadi, ko'rsatkichlar esa ayirilib nol qoladi. Uchning minus ikkinchi darajasi: bir bo'lingan to'qqiz. Ikkala hisob ham yozilganini tasdiqlaydi.",
      'Оба равенства были верны, и оба отвергнуты. Проверь каждое отдельно числом. Минус четыре в нулевой: минус четыре в квадрате шестнадцать, раздели его само на себя — получится единица, а показатели вычтутся в нуль. Три в минус второй: единица делить на девять. Оба вычисления подтверждают написанное.',
      'Both equalities were true, and both were rejected. Check each with a number on its own. Minus four to the zero: minus four squared is sixteen, divide it by itself — you get one, while the exponents subtract to zero. Three to the minus two: one divided by nine. Both computations confirm what is written.') },
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Birinchi tenglik rost. Manfiy asos qoidani buzmaydi: nolinchi daraja asos NOLDAN FARQLI bo'lsa birga teng, ishora esa ahamiyatsiz. Tekshiring: minus to'rtning kvadrati o'n olti, minus to'rtning kubi minus oltmish to'rt — ikkalasi ham noldan farqli, ya'ni ularni bo'lish mumkin. Bir xil darajani o'ziga bo'lsangiz bir chiqadi, va bu yettining nolinchi darajasida ham, minus to'rtnikida ham bir xil ishlaydi.",
      'Первое равенство верно. Отрицательное основание правила не нарушает: нулевая степень равна единице, если основание ОТЛИЧНО ОТ НУЛЯ, а знак не важен. Проверь: минус четыре в квадрате шестнадцать, минус четыре в кубе минус шестьдесят четыре — оба отличны от нуля, значит делить их можно. Одинаковая степень, делённая сама на себя, даёт единицу, и это одинаково работает и для семёрки, и для минус четырёх.',
      'The first equality is true. A negative base does not break the rule: the zero power equals one whenever the base is NOT ZERO, and the sign is irrelevant. Check: minus four squared is sixteen, minus four cubed is minus sixty-four — both differ from zero, so they can be divided. A power divided by itself gives one, and that works the same for seven as for minus four.') },
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Ikkinchi tenglik rost. Manfiy ko'rsatkich ISHORANI almashtirmaydi — u sonni ag'daradi. Uchning minus ikkinchi darajasi minus to'qqiz emas: minus to'qqiz bo'lganda javob manfiy chiqardi, lekin uchdan qanday ko'paytirsangiz ham manfiy son chiqmaydi. To'g'ri o'qish: bir bo'lingan uchning kvadrati, ya'ni bir to'qqizdan. Bu son musbat va birdan kichik.",
      'Второе равенство верно. Отрицательный показатель не меняет ЗНАК — он переворачивает число. Три в минус второй это не минус девять: при минус девяти ответ был бы отрицательным, но из троек умножением отрицательное число не получить. Правильное чтение: единица делить на три в квадрате, то есть одна девятая. Это число положительное и меньше единицы.',
      'The second equality is true. A negative exponent does not change the SIGN — it turns the number over. Three to the minus two is not minus nine: with minus nine the answer would be negative, yet no product of threes is negative. The right reading: one divided by three squared, that is one ninth. This number is positive and less than one.') },
  ],
  wrongText: L(
    "Har tenglikni alohida son bilan tekshiring. Nolinchi daraja asos noldan farqli bo'lsa birga teng, manfiy ko'rsatkich esa sonni ag'daradi — ishorani emas.",
    'Проверяй каждое равенство отдельно числом. Нулевая степень равна единице при основании, отличном от нуля, а отрицательный показатель переворачивает число, а не знак.',
    'Check each equality with a number on its own. The zero power equals one when the base is not zero, and a negative exponent turns the number over, not its sign.'),
};

export default function D31_03(props) { return <TrueFalse data={DATA} {...props} />; }
