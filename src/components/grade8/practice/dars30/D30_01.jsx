// Dars30 · Amaliyot 01 — Ha yoki yo'q · 🟢 · tag: error_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §12 (30-dars, 1-pozitsiya)
//
// T1 NING TA'RIFIDA MODUL BOR, VA U HAMMASINI HAL QILADI: absolut xatolik
// manfiy bo'lmaydi, va qaysi qiymatdan qaysinisi ayirilishi ahamiyatsiz —
// modul ikki tartibni tenglashtiradi.
//
// Bu 29-darsning davomi: u yerda modul o'rganilgan, bu yerda esa u ISHGA
// tushadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'error_claims', level: '🟢',
  itemSize: 14,
  items: [
    { id: 's1', yes: true,
      tokens: ['x = 3,1416', ';', 'a = 3,14'],
      claim: L('absolut xatolik: 0,0016', 'абсолютная погрешность: 0,0016', 'absolute error: 0,0016') },
    { id: 's2', yes: false,
      tokens: ['|x − a|'],
      claim: L("manfiy bo'lishi mumkin", 'может быть отрицательной', 'can be negative') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "Absolut xatolik — aniq va taqribiy qiymatlar ayirmasining MODULI. Ta'rifda modul turgani bejiz emas.",
    'Абсолютная погрешность — это МОДУЛЬ разности точного и приближённого значений. Модуль стоит в определении не случайно.',
    'The absolute error is the ABSOLUTE VALUE of the difference between the exact and the approximate values. The bars stand in the definition for a reason.'),
  ask: L(
    "Da'vo rost bo'lsa «Ha», yolg'on bo'lsa «Yo'q».",
    'Если утверждение верно — «Да», если ложно — «Нет».',
    'If the claim is true, «Yes»; if false, «No».'),
  correctText: L(
    "To'g'ri. Birinchisida ayirma nol butun nol nol o'n olti, uning moduli esa o'sha son. Ikkinchi da'vo yolg'on: ta'rifda MODUL turibdi, ya'ni xatolik manfiy bo'lmaydi va ayirmaning tartibi ahamiyatsiz.",
    'Верно. В первом разность ноль целых шестнадцать десятитысячных, а её модуль — то же число. Второе утверждение ложно: в определении стоит МОДУЛЬ, значит погрешность отрицательной не бывает и порядок разности не важен.',
    'Correct. In the first the difference is zero point zero zero one six, and its absolute value is the same number. The second claim is false: the definition contains the BARS, so an error is never negative and the order of the difference does not matter.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
        "Absolut xatolik MANFIY BO'LMAYDI: ta'rifda ayirmaning MODULI turibdi. Modul ikki ish qiladi — natijani manfiy bo'lishdan saqlaydi va ayirmaning tartibini ahamiyatsiz qiladi.",
        'Абсолютная погрешность ОТРИЦАТЕЛЬНОЙ НЕ БЫВАЕТ: в определении стоит МОДУЛЬ разности. Модуль делает две вещи — не даёт результату стать отрицательным и делает порядок разности неважным.',
        'An absolute error is NEVER negative: the definition contains the ABSOLUTE VALUE of the difference. The bars do two things — they keep the result from turning negative and make the order irrelevant.') },
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Birinchi da'vo rost. Absolut xatolik ikki qiymatning ayirmasi bilan o'lchanadi: uch butun bir mingu to'rt yuz o'n olti minus uch butun o'n to'rt. Vergul ostida hisoblang: o'n olti o'n mingdan, ya'ni nol butun nol nol o'n olti. Modul bu sonni o'zgartirmaydi, chunki u allaqachon musbat.",
      'Первое утверждение верно. Абсолютная погрешность измеряется разностью двух значений: три целых одна тысяча четыреста шестнадцать минус три целых четырнадцать. Посчитай по разрядам: шестнадцать десятитысячных, то есть ноль целых шестнадцать десятитысячных. Модуль это число не меняет, оно и так положительно.',
      'The first claim is true. The absolute error is measured by the difference of the two values: three point one four one six minus three point one four. Compute by places: sixteen ten-thousandths, that is zero point zero zero one six. The bars do not change this number, it is positive already.') },
  ],
  wrongText: L(
    "Ta'rifga qarang: absolut xatolik ayirmaning MODULI. Modul natijani manfiy bo'lishdan saqlaydi va ayirmaning tartibini ahamiyatsiz qiladi.",
    'Смотри на определение: абсолютная погрешность — это МОДУЛЬ разности. Модуль не даёт результату стать отрицательным и делает порядок разности неважным.',
    'Look at the definition: the absolute error is the ABSOLUTE VALUE of the difference. The bars keep the result from turning negative and make the order of the difference irrelevant.'),
};

export default function D30_01(props) { return <TrueFalse data={DATA} {...props} />; }
