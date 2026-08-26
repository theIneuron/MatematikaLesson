// Dars24 · Amaliyot 05 — Pazl · 🟡 · tag: multiplier_to_result
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §6 (24-dars, 5-pozitsiya)
//
// UCHINCHI JUFTLIK — NOLGA KO'PAYTIRISH — ATAYLAB (skelet §0a.4).
// Darsning teoremalari musbat va manfiy son haqida, nol haqida hech narsa
// yo'q. Aynan shuning uchun u bu yerda turadi: «musbat yoki manfiy» degan
// ikkilik o'quvchida «uchinchisi yo'q» degan yolg'on to'liqlikni yaratadi.
// Nol na musbat, na manfiy — va u tengsizlikni TENGLIKKA aylantiradi.
//
// Kartalarda yozuv bo'shliqsiz (skelet §0a.3).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'multiplier_to_result', level: '🟡',
  faceSize: 13, faceSizePhone: 11,
  given: [['−3 < 5']],
  givenLabel: L('Berilgan', 'Дано', 'Given'),
  cards: [
    { id: 'f1', side: 0, tokens: ['×2'] },
    { id: 'f2', side: 0, tokens: ['×(−2)'] },
    { id: 'f3', side: 0, tokens: ['×0'] },
    { id: 'v1', side: 1, v: '−6<10' },
    { id: 'v2', side: 1, v: '6>−10' },
    { id: 'v3', side: 1, v: '0=0' },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "Bitta tengsizlik uch marta ko'paytirildi: musbat songa, manfiy songa va nolga. Har ko'paytuvchi o'z natijasini beradi.",
    'Одно неравенство умножили трижды: на положительное число, на отрицательное и на нуль. Каждый множитель даёт свой результат.',
    'One inequality was multiplied three times: by a positive number, by a negative one and by zero. Each multiplier gives its own result.'),
  ask: L(
    "Ko'paytuvchini bosing, keyin uyani bosing.",
    'Нажми множитель, потом ячейку.',
    'Tap a multiplier, then a slot.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Ikkiga ko'paytirilganda ishora saqlanadi, minus ikkiga ko'paytirilganda buriladi. Nolga ko'paytirilganda esa ikkala tomon nolga aylanadi va tengsizlik TENGLIKKA aylanadi: nol na musbat, na manfiy.",
    'Верно. При умножении на два знак сохраняется, при умножении на минус два переворачивается. А при умножении на нуль обе части обращаются в нуль и неравенство становится РАВЕНСТВОМ: нуль ни положителен, ни отрицателен.',
    'Correct. Multiplying by two keeps the sign, multiplying by minus two flips it. And multiplying by zero turns both sides into zero, so the inequality becomes an EQUALITY: zero is neither positive nor negative.'),
  wrongs: [
    { when: (s) => s.mate.f3 !== 'v3', text: L(
      "Nolga ko'paytirish alohida hol. Nolga ko'paytirilganda har qanday son nolga aylanadi, ya'ni chapda ham, o'ngda ham nol qoladi — va nol nolning na kattasi, na kichigi. Tengsizlik yo'qoladi, o'rniga tenglik qoladi. Nol na musbat, na manfiy, shuning uchun darsning ikki qoidasi ham bu yerda ishlamaydi.",
      'Умножение на нуль — отдельный случай. При умножении на нуль любое число обращается в нуль, то есть и слева, и справа остаётся нуль — а нуль нулю ни больше, ни меньше. Неравенство исчезает, вместо него остаётся равенство. Нуль ни положителен, ни отрицателен, поэтому оба правила урока здесь не работают.',
      'Multiplying by zero is a separate case. Multiplying by zero turns any number into zero, so zero remains on both the left and the right — and zero is neither greater nor smaller than zero. The inequality disappears and an equality remains. Zero is neither positive nor negative, so neither rule of the lesson works here.') },
    { when: (s) => s.mate.f2 !== 'v2', text: L(
      "Minus ikki — MANFIY son, ya'ni ishora buriladi. Hisoblang: minus uch karra minus ikki olti, besh karra minus ikki minus o'n. Olti minus o'ndan katta, shuning uchun natijada «katta» belgisi turadi. Boshlang'ich yozuvda esa «kichik» edi.",
      'Минус два — ОТРИЦАТЕЛЬНОЕ число, значит знак переворачивается. Посчитай: минус три на минус два шесть, пять на минус два минус десять. Шесть больше минус десяти, поэтому в результате стоит знак «больше». А в исходной записи было «меньше».',
      'Minus two is a NEGATIVE number, so the sign flips. Compute: minus three times minus two is six, five times minus two is minus ten. Six is greater than minus ten, so the result carries the «greater» sign. The original record carried «less».') },
    { when: (s) => s.mate.f1 !== 'v1', text: L(
      "Ikki — MUSBAT son, ya'ni ishora o'zgarmaydi. Hisoblang: minus uch karra ikki minus olti, besh karra ikki o'n. Minus olti o'ndan kichik — dastlabki yozuvdagi kabi «kichik» belgisi qoladi.",
      'Два — ПОЛОЖИТЕЛЬНОЕ число, значит знак не меняется. Посчитай: минус три на два минус шесть, пять на два десять. Минус шесть меньше десяти — знак «меньше» остаётся как в исходной записи.',
      'Two is a POSITIVE number, so the sign does not change. Compute: minus three times two is minus six, five times two is ten. Minus six is less than ten — the «less» sign stays as in the original record.') },
  ],
  wrongText: L(
    "Har ko'paytuvchi bilan ikkala sonni ham ko'paytiring va natijani solishtiring. Musbatda ishora saqlanadi, manfiyda buriladi, nolda esa tengsizlik tenglikka aylanadi.",
    'С каждым множителем умножь оба числа и сравни результаты. При положительном знак сохраняется, при отрицательном переворачивается, а при нуле неравенство превращается в равенство.',
    'Multiply both numbers by each multiplier and compare the results. With a positive the sign is kept, with a negative it flips, and with zero the inequality becomes an equality.'),
};

export default function D24_05(props) { return <PairSlots data={DATA} {...props} />; }
