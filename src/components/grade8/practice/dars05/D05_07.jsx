// Dars05 · Amaliyot 07 — Pazl · 🟡 · tag: divisor_zero
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Kontent: src/books/grade8/DARS05_AMALIYOT_KONTENT_V2.md §07
//
// Metodist qarori 2026-08-24: o'nta mexanika 1-darsdan olinadi. Skeletda bu
// o'ringa «bo'lish ↔ ag'dargani» juftligi yozilgan edi, lekin pazl kartasi
// telefonda 54px — ikki kasrli yozuv ham, ag'dargan kasr ham u yerga
// sig'maydi (o'lchov 2026-08-24). Shuning uchun savol darsning UCHINCHI
// shartiga qaratildi: bo'luvchining O'ZI nolga aylanadigan qiymat.
//
// Uch kasr BO'LUVCHI bo'lib turibdi. Kasr nolga uning SURATI nolga
// aylanganda aylanadi, va o'sha qiymatda bo'lish umuman mumkin emas:
//   (f − 4)/f  -> 4      surat nolga aylanadi
//   (f + 4)/f  -> −4     ishora tuzog'i
//   f/(f − 4)  -> 0      surat f ning o'zi
// Bu shart javobda deyarli hech qachon ko'rinmaydi — 05 va 10 shuni davom
// ettiradi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'divisor_zero', level: '🟡',
  cards: [
    { id: 'f1', tokens: [{ n: 'f−4', d: 'f' }] },
    { id: 'f2', tokens: [{ n: 'f+4', d: 'f' }] },
    { id: 'f3', tokens: [{ n: 'f', d: 'f−4' }] },
    { id: 'v1', v: '4' },
    { id: 'v2', v: '−4' },
    { id: 'v3', v: '0' },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "Uchala kasr BO'LUVCHI bo'lib turibdi. Bo'luvchi nolga aylansa, bo'lishning o'zi mumkin emas.",
    'Все три дроби стоят ДЕЛИТЕЛЕМ. Если делитель обращается в нуль, деление становится невозможным.',
    'All three fractions stand as the DIVISOR. If the divisor becomes zero, the division is impossible.'),
  ask: L(
    "Har kasr qanday f da nolga aylanishini toping: kartani bosing, keyin uyani bosing.",
    'Найди, при каком f каждая дробь обращается в нуль: нажми карточку, потом ячейку.',
    'Find at which f each fraction becomes zero: tap a card, then a slot.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Kasr nolga faqat uning SURATI nolga aylanganda aylanadi — maxraj bunga aloqasi yo'q. f minus to'rt to'rtda, f qo'shuv to'rt minus to'rtda, uchinchisida esa surat f ning o'zi, ya'ni nolda. Har uchala qiymatda bo'luvchi nolga teng bo'ladi, va nolga bo'lish mumkin emas — shuning uchun javobda ko'rinmasa ham, bu shart yoziladi.",
    'Верно. Дробь обращается в нуль только тогда, когда в нуль обращается её ЧИСЛИТЕЛЬ — знаменатель тут ни при чём. f минус четыре — при четырёх, f плюс четыре — при минус четырёх, а в третьей числитель это сама f, то есть при нуле. Во всех трёх случаях делитель равен нулю, а на нуль делить нельзя — поэтому условие пишут, даже если в ответе его не видно.',
    'Correct. A fraction becomes zero only when its NUMERATOR does — the denominator has nothing to do with it. f minus four at four, f plus four at minus four, and in the third the numerator is f itself, so at zero. In all three the divisor equals zero, and division by zero is impossible — that is why the condition is written even when it is invisible in the answer.'),
  wrongs: [
    { when: (s) => s.mate.f1 === 'v2' || s.mate.f2 === 'v1', text: L(
      "Ishorani tekshiring: f minus to'rt nolga ARTI to'rtda aylanadi, f qo'shuv to'rt esa MINUS to'rtda. Ikkalasini qo'yib ko'ring.",
      'Проверь знак: f минус четыре обращается в нуль при ПЛЮС четырёх, а f плюс четыре — при МИНУС четырёх. Подставь оба.',
      'Check the sign: f minus four becomes zero at PLUS four, and f plus four at MINUS four. Substitute both.') },
    { when: (s) => s.mate.f3 && s.mate.f3 !== 'v3', text: L(
      "Uchinchi kasrning surati — f ning o'zi, va u nolda nolga aylanadi. Maxrajga qaramang: maxraj kasrni nolga aylantirmaydi, u faqat kasrni YO'Q qilishi mumkin.",
      'Числитель третьей дроби — сама f, и она обращается в нуль при нуле. Не смотри на знаменатель: знаменатель не обращает дробь в нуль, он может только УНИЧТОЖИТЬ её.',
      'The numerator of the third fraction is f itself, and it becomes zero at zero. Do not look at the denominator: a denominator does not make a fraction zero, it can only DESTROY it.') },
    { when: (s) => s.mate.f1 === 'v3' || s.mate.f2 === 'v3', text: L(
      "Nolda bu kasrning surati nolga aylanmaydi: f minus to'rt nolda minus to'rtga teng, f qo'shuv to'rt esa to'rtga. Suratni nolga tenglang va yeching.",
      'При нуле числитель этой дроби в нуль не обращается: f минус четыре при нуле равно минус четырём, а f плюс четыре — четырём. Приравняй числитель к нулю и реши.',
      'At zero the numerator of this fraction is not zero: f minus four is minus four there, and f plus four is four. Set the numerator to zero and solve.') },
  ],
  wrongText: L(
    "Kasr nolga aylanishi uchun uning SURATI nolga aylanishi kerak. Har suratni alohida nolga tenglang.",
    'Чтобы дробь обратилась в нуль, в нуль должен обратиться её ЧИСЛИТЕЛЬ. Приравняй к нулю каждый числитель по отдельности.',
    'For a fraction to become zero its NUMERATOR must become zero. Set each numerator to zero separately.'),
};

export default function D05_07(props) { return <PairSlots data={DATA} {...props} />; }
