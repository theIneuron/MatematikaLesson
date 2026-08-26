// Dars05 · Amaliyot 01 — Ha yoki yo'q · 🟢 · tag: mul_div_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Kontent: src/books/grade8/DARS05_AMALIYOT_KONTENT_V2.md §01
//
// Metodist qarori 2026-08-24: 2-6 darslar 1-darsning o'nta mexanikasida
// quriladi, har darsda boshqa ketma-ketlikda. Ilgari bu o'rinda `TypeExpr`
// turgan (javobni yozish) — o'nlikda bunday tip yo'q.
//
// IKKI mulohaza bitta juftlikni yuzma-yuz qo'yadi: yozuvlar deyarli bir xil,
// farq faqat AMAL belgisida — va aynan shu sababli javoblar ham boshqacha
// ko'rsatilgan. IKKALA TENGLIK HAM TO'G'RI, ya'ni javob ikki marta «ha»
// (metodist qarori 2026-08-25: ha-yo'q topshiriqlarida javob naqshi
// bo'lmasin):
//   s1 — ko'paytirish: surat suratga, maxraj maxrajga → olti bo'lingan e kvadrat;
//   s2 — bo'lish: ikkinchi kasr AG'DARILADI → e qisqaradi va ikki uchdan qoladi.
// «Amal belgisiga qaramaslik» shu yerda tutiladi: bo'lishni ko'paytirish deb
// olgan o'quvchi ikkinchi tenglikni yolg'on deb belgilaydi.
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
    { id: 's2', tokens: [{ n: '2', d: 'e' }, ':', { n: '3', d: 'e' }, '=', { n: '2', d: '3' }], yes: true,
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
    "To'g'ri. Ikki tenglik ham rost, chunki amallar boshqa. Ko'paytirishda surat suratga, maxraj maxrajga: ikki karra uch olti, e karra e e kvadrat. Bo'lishda esa ikkinchi kasr AG'DARILADI: ikki bo'linadi e ga karra e bo'linadi uchga — e qisqaradi va ikki uchdan qoladi. e ni ikkiga teng qo'ying: birinchi tenglikda bir karra bir butun besh o'ndan bir, ya'ni bir butun besh o'ndan bir, va olti bo'lingan to'rt ham shu. Ikkinchisida bir bo'linadi bir butun besh o'ndan birga — ikki uchdan chiqadi.",
    'Верно. Оба равенства верны, потому что действия разные. При умножении числитель на числитель, знаменатель на знаменатель: два на три — шесть, e на e — e в квадрате. А при делении вторая дробь ПЕРЕВОРАЧИВАЕТСЯ: два делить на e умножить на e делить на три — e сокращается, остаются две третьих. Подставь e равное двум: в первом один на полтора это полтора, и шесть делить на четыре тоже полтора. Во втором один делить на полтора — две третьих.',
    'Correct. Both equalities are true because the actions differ. In multiplication numerator times numerator, denominator times denominator: two times three is six, e times e is e squared. In division the second fraction is FLIPPED: two over e times e over three — the e cancels and two thirds is left. Put e equal to two: in the first, one times one and a half is one and a half, and six over four is the same. In the second, one divided by one and a half is two thirds.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Bo'lish ko'paytirish emas: ikkinchi kasr AG'DARILADI. Ikki bo'linadi e ga karra e bo'linadi uchga — e qisqaradi va ikki uchdan qoladi, ya'ni yozuv to'g'ri. e ni ikkiga teng qo'ying: bir bo'linadi bir butun besh o'ndan birga, javob ikki uchdan.",
      'Деление это не умножение: вторая дробь ПЕРЕВОРАЧИВАЕТСЯ. Два делить на e умножить на e делить на три — e сокращается, остаются две третьих, то есть запись верна. Подставь e равное двум: один делить на полтора, ответ две третьих.',
      'Division is not multiplication: the second fraction is FLIPPED. Two over e times e over three — the e cancels and two thirds is left, so the record is right. Put e equal to two: one divided by one and a half gives two thirds.') },
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
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
