// Dars05 · Amaliyot 01 — Ha yoki yo'q · 🟢 · tag: mul_div_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Kontent: src/books/grade8/DARS05_AMALIYOT_KONTENT_V2.md §01
//
// Metodist qarori 2026-08-24: 2-6 darslar 1-darsning o'nta mexanikasida
// quriladi, har darsda boshqa ketma-ketlikda. Ilgari bu o'rinda `TypeExpr`
// turgan (javobni yozish) — o'nlikda bunday tip yo'q.
//
// IKKI mulohaza bitta juftlikni yuzma-yuz qo'yadi: yozuvlar deyarli bir xil,
// farq faqat AMAL belgisida, javob esa ikkalasida ham bir xil ko'rsatilgan.
//   s1 — ko'paytirish: surat suratga, maxraj maxrajga     (HA)
//   s2 — bo'lish: ikkinchi kasr AG'DARILADI, javob boshqa (YO'Q)
// Shu sababli «amal belgisiga qaramaslik» adashishi birinchi topshiriqdayoq
// tutiladi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'mul_div_claims', level: '🟢',
  itemSize: 14,
  items: [
    { id: 's1', tokens: [{ n: '2', d: 'e' }, '·', { n: '3', d: 'e' }, '=', { n: '6', d: 'e²' }], yes: true,
      claim: L("to'g'ri", 'верно', 'right') },
    { id: 's2', tokens: [{ n: '2', d: 'e' }, ':', { n: '3', d: 'e' }, '=', { n: '6', d: 'e²' }], yes: false,
      claim: L("to'g'ri", 'верно', 'right') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "Ikki tenglik. Yozuvlar deyarli bir xil, farq faqat amal belgisida, javob esa ikkalasida bir xil.",
    'Два равенства. Записи почти одинаковы, разница только в знаке действия, а ответ в обоих один.',
    'Two equalities. The records are nearly identical, the difference is only the operation sign, and the answer shown is the same in both.'),
  ask: L(
    "Tenglik to'g'ri bo'lsa «Ha» ni, noto'g'ri bo'lsa «Yo'q» ni bosing.",
    'Если равенство верно — нажми «Да», если неверно — «Нет».',
    'Tap «Yes» if the equality is right, «No» if it is wrong.'),
  correctText: L(
    "To'g'ri. Ko'paytirishda surat suratga, maxraj maxrajga ko'paytiriladi: ikki karra uch olti, e karra e e kvadrat. Bo'lishda esa ikkinchi kasr AG'DARILADI: ikki bo'linadi e ga karra e bo'linadi uchga, ya'ni ikki uchdan. e ni ikkiga teng qo'ying: birinchisi bir yarimning yarmi, ya'ni bir yarim bo'lingan ikki — bir yarim; ikkinchisida bir bo'linadi bir yarimga, ya'ni ikki uchdan.",
    'Верно. При умножении числитель на числитель, знаменатель на знаменатель: два на три — шесть, e на e — e в квадрате. А при делении вторая дробь ПЕРЕВОРАЧИВАЕТСЯ: два делить на e умножить на e делить на три, то есть две третьих. Подставь e равное двум: в первом единица на полтора — ответ полтора вторых, во втором один делить на полтора — две третьих.',
    'Correct. In multiplication numerator times numerator, denominator times denominator: two times three is six, e times e is e squared. In division the second fraction is FLIPPED: two over e times e over three, that is two thirds. Put e equal to two: the first gives one times one and a half, the second gives two thirds.'),
  wrongs: [
    { when: (s) => s.ans.s2 === true, text: L(
      "Bo'lishda ikkinchi kasr ag'dariladi: ikki bo'linadi e ga karra e bo'linadi uchga. e qisqaradi va ikki uchdan qoladi — e kvadrat umuman paydo bo'lmaydi. e ni ikkiga teng qo'ying va ikkala tomonni solishtiring.",
      'При делении вторая дробь переворачивается: два делить на e умножить на e делить на три. e сокращается, остаётся две третьих — никакого e в квадрате не появляется. Подставь e равное двум и сравни обе части.',
      'In division the second fraction is flipped: two over e times e over three. The e cancels and two thirds is left — no e squared appears at all. Put e equal to two and compare both sides.') },
    { when: (s) => s.ans.s1 === false, text: L(
      "Ko'paytirishda hech narsa ag'darilmaydi: surat suratga, maxraj maxrajga. Ikki karra uch olti, e karra e e kvadrat — yozuv to'g'ri.",
      'При умножении ничего не переворачивают: числитель на числитель, знаменатель на знаменатель. Два на три — шесть, e на e — e в квадрате: запись верна.',
      'In multiplication nothing is flipped: numerator times numerator, denominator times denominator. Two times three is six, e times e is e squared — the record is right.') },
  ],
  wrongText: L(
    "Avval AMAL BELGISIGA qarang: ko'paytirishda kasrlar bor holicha ko'paytiriladi, bo'lishda esa ikkinchisi ag'dariladi. Shubha bo'lsa, e ga son qo'yib solishtiring.",
    'Сначала смотри на ЗНАК ДЕЙСТВИЯ: при умножении дроби перемножают как есть, при делении вторую переворачивают. Если сомневаешься, подставь число вместо e и сравни.',
    'Look at the OPERATION SIGN first: multiplication multiplies the fractions as they are, division flips the second one. If in doubt, substitute a number for e and compare.'),
};

export default function D05_01(props) { return <TrueFalse data={DATA} {...props} />; }
