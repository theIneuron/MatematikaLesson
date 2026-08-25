// Dars05 · Amaliyot 09 — Teshik · 🔴 · tag: lost_ban_division
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Kontent: src/books/grade8/DARS05_AMALIYOT_KONTENT_V2.md §09
//
// Ilgari bu topshiriq 07-o'rinda va `HoleSlider` da turgan. Metodist qarori
// 2026-08-24: o'nta mexanika 1-darsdan olinadi, shuning uchun o'sha son endi
// KLAVIATURADAN yoziladi.
//
// (2/(s+1)) : (6/(s+1)) ni ag'darib ko'paytirsak, s qo'shuv bir QISQARADI va
// javob bir uchdan bo'ladi — sonli kasr, unda harf umuman yo'q. Javobga
// qarab shart topib bo'lmaydi: minus birda ikkala kasrning ham maxraji nolga
// aylanadi, ya'ni bo'lish umuman boshlanmaydi.
// Tuzoqlar: 1 (yozuvdagi son), 0, 6 (bo'luvchining surati — u nolga
// aylanmaydi, chunki olti o'zgarmas son).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'lost_ban_division', level: '🔴',
  target: -1, allowNeg: true,
  expr: [{ n: '2', d: 's + 1' }, ':', { n: '6', d: 's + 1' }], exprSize: 24,
  eyebrow: L('Teshik', 'Дырка', 'The hole'),
  setup: L(
    "Ag'darib ko'paytirsangiz, s qo'shuv bir qisqaradi va javob bir uchdan bo'ladi — unda harf umuman qolmaydi.",
    'Если перевернуть и умножить, s плюс один сократится и ответом станет одна третья — буквы в нём не останется вовсе.',
    'Flip and multiply, and s plus one cancels: the answer becomes one third, with no letter left in it at all.'),
  label: L("taqiqlangan qiymat", 'запрещённое значение', 'the forbidden value'),
  ask: L(
    "Javobda ko'rinmaydigan taqiq qanday s da paydo bo'ladi?",
    'При каком s появляется запрет, которого в ответе не видно?',
    'At which s does the ban appear that is invisible in the answer?'),
  correctText: L(
    "To'g'ri. Minus birda ikkala kasrning ham maxraji nolga aylanadi: birinchi kasr ham, bo'luvchi ham mavjud emas, demak bo'lish umuman boshlanmaydi. Javobda esa s qo'shuv bir qisqarib ketgan va bir uchdan qolgan — u minus birda ham bemalol hisoblanadi. Shuning uchun shartni JAVOBdan emas, dastlabki yozuvdan olish kerak.",
    'Верно. При минус одном знаменатель обеих дробей обращается в нуль: нет ни первой дроби, ни делителя, значит деление не начинается вовсе. А в ответе s плюс один сократилось и осталась одна третья — она при минус одном спокойно считается. Поэтому условие берут не из ОТВЕТА, а из исходной записи.',
    'Correct. At minus one the denominator of both fractions becomes zero: neither the first fraction nor the divisor exists, so the division never starts. In the answer s plus one has cancelled and one third is left — that computes fine at minus one. This is why the condition is taken from the original record, not from the ANSWER.'),
  wrongs: [
    { when: (s) => s.value === 1, text: L(
      "Bir — yozuvdagi son, ildiz emas. Maxraj s QO'SHUV bir: birda u ikkiga teng, nol emas. Maxrajni nolga tenglang.",
      'Единица — число из записи, а не корень. Знаменатель s ПЛЮС один: при единице он равен двум, а не нулю. Приравняй знаменатель к нулю.',
      'One is a number from the record, not a root. The denominator is s PLUS one: at one it equals two, not zero. Set the denominator to zero.') },
    { when: (s) => s.value === 6, text: L(
      "Olti — bo'luvchining surati, va u o'zgarmas son: hech qanday s da nolga aylanmaydi. Bo'luvchi nolga aylanadigan holat bu yerda yo'q, taqiq esa MAXRAJdan keladi.",
      'Шесть — числитель делителя, и это постоянное число: ни при каком s он в нуль не обращается. Случая «делитель равен нулю» здесь нет, а запрет приходит от ЗНАМЕНАТЕЛЯ.',
      'Six is the numerator of the divisor and it is a constant: it never becomes zero for any s. There is no "divisor equals zero" case here, and the ban comes from the DENOMINATOR.') },
    { when: (s) => s.value === 0, text: L(
      "Nolda maxraj birga teng va ikkala kasr ham hisoblanadi: ikki bo'linadi oltiga, ya'ni bir uchdan. Bu yerda hech narsa buzilmaydi.",
      'При нуле знаменатель равен единице и обе дроби считаются: два делить на шесть, то есть одна третья. Здесь ничего не ломается.',
      'At zero the denominator is one and both fractions compute: two over six, that is one third. Nothing breaks here.') },
    { when: (s) => s.value === 1 / 3, text: L(
      "Bu javobning qiymati, taqiq emas. Taqiq har doim HARFning qiymati bo'ladi: maxrajni nolga tenglang.",
      'Это значение ответа, а не запрет. Запрет — всегда значение БУКВЫ: приравняй знаменатель к нулю.',
      'That is the value of the answer, not a ban. A ban is always a value of the LETTER: set the denominator to zero.') },
  ],
  wrongText: L(
    "Shartni tayyor javobdan yig'ib bo'lmaydi: qisqargan ko'paytuvchi javobda ko'rinmaydi. DASTLABKI yozuvdagi har maxrajni nolga tenglang.",
    'Условие нельзя собрать по готовому ответу: сокращённый множитель в нём не виден. Приравняй к нулю каждый знаменатель ИСХОДНОЙ записи.',
    'The condition cannot be collected from the finished answer: a cancelled factor is invisible there. Set every denominator of the ORIGINAL record to zero.'),
};

export default function D05_09(props) { return <TypeValue data={DATA} {...props} />; }
