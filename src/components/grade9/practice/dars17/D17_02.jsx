// Dars17 · Amaliyot 02 — Ha/yo'q · 🟢 · teg: maxraj-nolini-javobga-kiritish
// Faqat MA'LUMOT. Mexanika: `grade8/practice/kit.jsx` -> TrueFalse.
//
// Uchala hukm darsning uchala tasdig'iga tegadi: surat noli qat'iy emas
// tengsizlikda kiradi, maxraj noli hech qachon kirmaydi, va maxrajga
// ko'paytirish yo'li ATAYLAB ishlatilmaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L, TrueFalse } from '../../../grade8/practice/kit.jsx';

const DATA = {
  tag: 'maxraj-nolini-javobga-kiritish', level: '🟢',
  eyebrow: L('Ha yoki yo\'q', 'Да или нет', 'Yes or no'),
  setup: L(
    "Kasr tengsizlik berilgan, belgisi qat'iy emas. Surat to'rtda nolga aylanadi, maxraj esa minus ikkida.",
    'Дано дробное неравенство с нестрогим знаком. Числитель обращается в нуль при четырёх, а знаменатель при минус двух.',
    'A fractional inequality with a non-strict sign is given. The numerator becomes zero at four, the denominator at minus two.'),
  ask: L(
    "Har bir hukm uchun «Ha» yoki «Yo'q» ni tanlang.",
    'Для каждого суждения выбери «Да» или «Нет».',
    'Choose "Yes" or "No" for each claim.'),
  givenLabel: L('Tengsizlik', 'Неравенство', 'Inequality'),
  given: [['(x − 4)/(x + 2) ≥ 0']],
  itemSize: 15,
  items: [
    { id: 's1', tokens: ['x = 4'], yes: true, claim: L(
      "— javobga kiradi.",
      '— входит в ответ.',
      'belongs to the answer.') },
    { id: 's2', tokens: ['x = −2'], yes: false, claim: L(
      "— javobga kiradi.",
      '— входит в ответ.',
      'belongs to the answer.') },
    { id: 's3', tokens: ['x + 2'], yes: false, claim: L(
      "ga ko'paytirib, oddiy tengsizlikdek yechish mumkin.",
      '— на него можно умножить и решать как обычное неравенство.',
      'may be multiplied through to solve it like an ordinary inequality.') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L('Yo\'q', 'Нет', 'No'),
  correctText: L(
    "To'g'ri. To'rtda surat nolga aylanadi, ya'ni butun kasr nolga teng; belgi «katta yoki teng» bo'lgani uchun nol javobga kiradi. Minus ikkida esa maxraj nolga aylanadi va kasrning qiymati umuman yo'q — bunday nuqta hech qachon, hech qanday belgida javobga kirmaydi. Maxrajga ko'paytirish esa xavfli: iks qo'shuv ikkining ishorasi noma'lum, va manfiy songa ko'paytirilganda tengsizlik belgisi teskariga aylanadi.",
    'Верно. При четырёх числитель обращается в нуль, значит вся дробь равна нулю; знак «больше или равно», поэтому нуль в ответ входит. А при минус двух в нуль обращается знаменатель, и значения у дроби нет вовсе — такая точка не входит в ответ никогда и ни при каком знаке. Умножать же на знаменатель опасно: знак икс плюс два неизвестен, а при умножении на отрицательное число знак неравенства переворачивается.',
    'Correct. At four the numerator becomes zero, so the whole fraction equals zero; the sign is "greater than or equal", so zero belongs to the answer. At minus two the denominator becomes zero and the fraction has no value at all — such a point never belongs to the answer, under any sign. And multiplying by the denominator is dangerous: the sign of x plus two is unknown, and multiplying by a negative number flips the inequality.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s3') !== -1, text: L(
      "Iks qo'shuv ikki musbat ham, manfiy ham bo'lishi mumkin — bu iksga bog'liq. Manfiy songa ko'paytirilganda tengsizlik belgisi teskariga aylanadi, va qaysi hol ekanini bilmasdan ko'paytirib bo'lmaydi.",
      'Икс плюс два может быть и положительным, и отрицательным — это зависит от икса. При умножении на отрицательное число знак неравенства переворачивается, а не зная, какой случай, умножать нельзя.',
      'x plus two may be positive or negative — it depends on x. Multiplying by a negative number flips the inequality, and without knowing which case it is you cannot multiply.') },
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Minus ikkida maxraj nolga aylanadi, ya'ni kasrning qiymati yo'q. Qiymati bo'lmagan nuqta javobga kirmaydi — belgi qat'iy bo'ladimi yoki qat'iy emasmi, ahamiyati yo'q.",
      'При минус двух знаменатель обращается в нуль, то есть значения у дроби нет. Точка без значения в ответ не входит — неважно, строгий знак или нестрогий.',
      'At minus two the denominator becomes zero, so the fraction has no value. A point without a value is not in the answer — it makes no difference whether the sign is strict or not.') },
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "To'rtni kasrga qo'yib ko'ring: surat nol, maxraj olti, kasr nolga teng. Belgi «katta YOKI TENG», demak nol qiymat javobga kiradi.",
      'Подставь четыре в дробь: числитель нуль, знаменатель шесть, дробь равна нулю. Знак «больше ИЛИ РАВНО», значит нулевое значение в ответ входит.',
      'Put four into the fraction: the numerator is zero, the denominator six, and the fraction equals zero. The sign is "greater than OR EQUAL", so the zero value belongs to the answer.') },
  ],
  wrongText: L(
    "Har bir sonni kasrga alohida qo'yib ko'ring: surat nechchi, maxraj nechchi, va kasrning qiymati bormi? Maxraj nol bo'lsa, qiymat yo'q.",
    'Подставляй каждое число в дробь по отдельности: чему равен числитель, чему знаменатель, и есть ли у дроби значение? Если знаменатель нуль, значения нет.',
    'Put each number into the fraction separately: what is the numerator, what is the denominator, and does the fraction have a value at all? If the denominator is zero, there is none.'),
};

export default function D17_02(props) { return <TrueFalse data={DATA} {...props} />; }
