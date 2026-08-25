// Dars05 · Amaliyot 03 — Belgilash · 🟢 · tag: flip_marked
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Kontent: src/books/grade8/DARS05_AMALIYOT_KONTENT_V2.md §03
//
// Ilgari bu o'rinda `Zones` turgan (u endi 02 da). Metodist qarori
// 2026-08-24: mexanikalar 1-darsdan, ketma-ketlik esa har darsda boshqacha.
//
// Bu yerda javob HISOBLANMAYDI — faqat BIRINCHI QADAM tekshiriladi: bo'lish
// ko'paytirishga to'g'ri aylantirildimi. Uch noto'g'ri karta — uch adashish:
//   i2  BIRINCHI kasr ag'darilgan
//   i4  songa bo'lish songa ko'paytirishga aylangan
//   i6  bo'luvchi umuman ag'darilmagan
// Har juftlik yonma-yon turadi va faqat ag'darishda farq qiladi.
// `col` katta: qatorlar uzun, telefonda bitta ustun bo'lishi kerak.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'flip_marked', level: '🟢',
  col: 168, itemSize: 12,
  items: [
    { id: 'i1', tokens: [{ n: '3', d: 'n' }, ':', { n: '5', d: 'n' }, '=', { n: '3', d: 'n' }, '·', { n: 'n', d: '5' }], hit: true },
    { id: 'i2', tokens: [{ n: '3', d: 'n' }, ':', { n: '5', d: 'n' }, '=', { n: 'n', d: '3' }, '·', { n: '5', d: 'n' }] },
    { id: 'i3', tokens: [{ n: 'n', d: '4' }, ':', '2', '=', { n: 'n', d: '4' }, '·', { n: '1', d: '2' }], hit: true },
    { id: 'i4', tokens: [{ n: 'n', d: '4' }, ':', '2', '=', { n: 'n', d: '4' }, '·', '2'] },
    { id: 'i5', tokens: ['5', ':', { n: 'n', d: '6' }, '=', '5', '·', { n: '6', d: 'n' }], hit: true },
    { id: 'i6', tokens: ['5', ':', { n: 'n', d: '6' }, '=', '5', '·', { n: 'n', d: '6' }] },
  ],
  eyebrow: L('Belgilash', 'Отметить', 'Mark'),
  setup: L(
    "Oltita yozuvda bo'lish ko'paytirishga aylantirilgan. Javob hisoblanmagan.",
    'В шести записях деление превратили в умножение. Ответ не считали.',
    'In six records a division was turned into a multiplication. The answer is not worked out.'),
  ask: L(
    "Birinchi qadam TO'G'RI qilingan 3 yozuvni belgilang.",
    'Отметь 3 записи, где первый шаг сделан ВЕРНО.',
    'Mark the 3 records where the first step is done RIGHT.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Faqat IKKINCHI kasr ag'dariladi. Songa bo'lish ham shunday: ikkiga bo'lish — bir ikkidanga ko'paytirish.",
    'Верно. Переворачивается только ВТОРАЯ дробь. Деление на число — то же правило: разделить на два значит умножить на одну вторую.',
    'Correct. Only the SECOND fraction is flipped. Dividing by a number is the same rule: to divide by two is to multiply by one half.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('i2') !== -1, text: L(
      "Bu yerda BIRINCHI kasr ag'darilgan. Bo'lishda birinchi kasr tegilmaydi — faqat bo'luvchi ag'dariladi.",
      'Здесь перевернули ПЕРВУЮ дробь. При делении первую не трогают — переворачивается только делитель.',
      'Here the FIRST fraction was flipped. In division the first is untouched — only the divisor flips.') },
    { when: (s) => s.extra.indexOf('i4') !== -1, text: L(
      "Ikkiga bo'lish ikkiga ko'paytirish emas: ag'dargani bir ikkidan. n ni to'rtga teng qo'ying — yarim chiqadi, ikki emas.",
      'Разделить на два — не умножить на два: перевёрнутое это одна вторая. Подставь n равное четырём: выйдет половина, а не два.',
      'Dividing by two is not multiplying by two: flipped it is one half. Put n equal to four: you get a half, not two.') },
    { when: (s) => s.extra.indexOf('i6') !== -1, text: L(
      "Bu yerda umuman ag'darilmagan: belgi almashgan, kasr o'sha. n ni uchga teng qo'ying: o'n chiqadi, ikki yarim emas.",
      'Здесь не перевернули вовсе: знак сменили, дробь оставили. Подставь n равное трём: выйдет десять, а не два с половиной.',
      'Here nothing was flipped: the sign changed, the fraction stayed. Put n equal to three: you get ten, not two and a half.') },
    { when: (s) => s.miss.length >= 2, text: L(
      "Har yozuvga bitta savol: qaysi kasr ag'darilgan? Javob doim bitta — BO'LUVCHI.",
      'К каждой записи один вопрос: какая дробь перевёрнута? Ответ всегда один — ДЕЛИТЕЛЬ.',
      'One question per record: which fraction was flipped? The answer is always the same — the DIVISOR.') },
  ],
  wrongText: L(
    "Faqat bo'luvchi ag'dariladi. Son ham kasr: ikkining ag'dargani bir ikkidan.",
    'Переворачивается только делитель. Число — тоже дробь: перевёрнутая двойка это одна вторая.',
    'Only the divisor is flipped. A number is a fraction too: two flipped is one half.'),
};

export default function D05_03(props) { return <MarkAll data={DATA} {...props} />; }
