// Dars03 · Amaliyot 03 — Qisqargandan keyin ham · 🟢 · tag: hole_after_reduce
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Kontent: src/books/grade8/DARS03_AMALIYOT_KONTENT_V2.md §03
//
// Ilgari bu topshiriq `HoleSlider` da edi: surgichni «teshik» ustiga qo'yish.
// Metodist qarori 2026-08-24: o'nta mexanika 1-darsdan olinadi, shuning uchun
// o'sha son endi KLAVIATURADAN yoziladi. Savol o'zgarmadi.
//
// (d² − 25)/(d − 5) qisqarganda d qo'shuv besh bo'ladi, ya'ni javob hamma
// joyda hisoblanadi. Lekin DASTLABKI kasr beshda yo'q: u yerda nol bo'linadi
// nolga. Darsning eng qimmat joyi shu — qisqartirish taqiqni OLIB TASHLAMAYDI.
// Tuzoqlar: −5 (surat noli), 0 (hech narsa buzilmaydigan joy), 25 (yozuvdagi son).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'hole_after_reduce', level: '🟢',
  target: 5, allowNeg: true,
  expr: [{ n: 'd² − 25', d: 'd − 5' }], exprSize: 28,
  eyebrow: L('Teshik', 'Дырка', 'The hole'),
  setup: L(
    "Bu kasr qisqarganda d qo'shuv besh bo'ladi, va u har qanday d da hisoblanadi. Dastlabki kasr esa bitta nuqtada yo'q.",
    'После сокращения эта дробь становится d плюс пять, и она считается при любом d. А исходная дробь в одной точке не существует.',
    'After cancelling this fraction becomes d plus five, and that computes for every d. The original fraction, though, does not exist at one point.'),
  label: L("d ning qiymati", 'значение d', 'the value of d'),
  ask: L(
    "Qanday d da DASTLABKI kasrni hisoblab bo'lmaydi?",
    'При каком d ИСХОДНУЮ дробь посчитать нельзя?',
    'At which d can the ORIGINAL fraction not be worked out?'),
  correctText: L(
    "To'g'ri. Beshda maxraj nolga aylanadi, surat ham nolga aylanadi, nol bo'lingan nol esa qiymat emas. Qisqargan yozuv beshda o'nni beradi — hisoblanadi. Ya'ni qisqartirish taqiqni OLIB TASHLAMADI: uni dastlabki kasr belgilagan va u o'z kuchida qoladi. Shuning uchun javobga har doim shart yoziladi.",
    'Верно. При пяти знаменатель обращается в нуль, числитель тоже, а нуль делить на нуль — не значение. Сокращённая запись при пяти даёт десять, она считается. То есть сокращение НЕ СНЯЛО запрет: его задала исходная дробь, и он остаётся в силе. Поэтому к ответу всегда пишут условие.',
    'Correct. At five the denominator becomes zero, the numerator too, and zero over zero is not a value. The cancelled record at five gives ten, it computes. So cancelling did NOT lift the ban: the original fraction set it and it stays in force. That is why the answer always carries a condition.'),
  wrongs: [
    { when: (s) => s.value === -5, text: L(
      "Minus beshda surat nolga aylanadi, maxraj esa minus o'nga teng — nol emas. Kasr hisoblanadi va noldan iborat. Taqiq MAXRAJdan keladi, suratdan emas.",
      'При минус пяти числитель обращается в нуль, а знаменатель равен минус десяти — не нулю. Дробь считается и равна нулю. Запрет приходит от ЗНАМЕНАТЕЛЯ, а не от числителя.',
      'At minus five the numerator becomes zero, but the denominator is minus ten, not zero. The fraction computes and equals zero. The ban comes from the DENOMINATOR, not the numerator.') },
    { when: (s) => s.value === 0, text: L(
      "Nolda kasr minus yigirma besh bo'lingan minus besh, ya'ni besh. Bu yerda hech narsa buzilmaydi. Maxrajni nolga tenglang.",
      'При нуле дробь — минус двадцать пять делить на минус пять, то есть пять. Здесь ничего не ломается. Приравняй знаменатель к нулю.',
      'At zero the fraction is minus twenty five over minus five, that is five. Nothing breaks here. Set the denominator to zero.') },
    { when: (s) => s.value === 25, text: L(
      "Yigirma besh — yozuvdagi son, ildiz emas. Maxraj d minus besh, va u yigirma beshda yigirmaga teng — nol emas.",
      'Двадцать пять — число из записи, а не корень. Знаменатель d минус пять при двадцати пяти равен двадцати, а не нулю.',
      'Twenty five is a number from the record, not a root. The denominator d minus five at twenty five equals twenty, not zero.') },
  ],
  wrongText: L(
    "Maxrajni nolga tenglang: d minus besh nolga teng bo'lsa, d nechchiga teng? Aynan o'sha joyda dastlabki kasr yo'qoladi, qisqargani esa yo'qolmaydi.",
    'Приравняй знаменатель к нулю: если d минус пять равно нулю, чему равно d? Ровно там исходная дробь исчезает, а сокращённая нет.',
    'Set the denominator to zero: if d minus five is zero, what is d? Exactly there the original fraction disappears, while the cancelled one does not.'),
};

export default function D03_03(props) { return <TypeValue data={DATA} {...props} />; }
