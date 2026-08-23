// Dars01 * Amaliyot 08 -- Ruhsat etilganmi, taqiqlanganmi * 🔴 * tag: sort_domain_values
// Faqat MA'LUMOT. Tip: kit.jsx -> Zones (5-6 qiymatni ikki korzinaga
// TAQSIMLASH: RUXSAT ETILGAN / TAQIQLANGAN).
//
// METODIST SO'ROVI 2026-08-22: 8-topshiriq endi TO'G'RI va NOTO'G'RI
// qiymatlarni o'quvchining O'ZI korzinalarga joylashtirishi kerak. Ilgari
// bu yerda Build turgan edi (maxrajni yig'ish); u endi 4-topshiriqdagi
// "bir xil ko'paytuvchi" g'oyasiga juda yaqin bo'lib qoldi, shuning uchun
// BUTUNLAY BOSHQA vazifaga o'tkazildi.
//
// Maxraj -- (x − 6)(x + 1), ildizlari 6 va −1. Besh nomzod: ikkitasi
// TAQIQLANGAN (ildizlarning o'zi), uchtasi RUXSAT ETILGAN -- ikkitasi
// ATAYLAB ishora tuzog'i (−6 va 1, ildizlarning ISHORASI teskarisi).
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'sort_domain_values', level: '🔴', varName: 'x',
  eyebrow: L('Ruhsat etilganmi', 'Разрешено или нет', 'Allowed or not'),
  setup: L(
    "Har qiymatni maxrajga qo'ying.",
    'Подставь каждое значение в знаменатель.',
    'Substitute each value into the denominator.',
  ),
  given: [[{ n: '6', d: '(x − 6)(x + 1)' }]],
  zones: [
    { id: 'ok', label: L('Ruhsat etilgan', 'Разрешено', 'Allowed') },
    { id: 'no', label: L('Taqiqlangan', 'Запрещено', 'Forbidden') },
  ],
  zoneLbl: 130,
  items: [
    { id: 'a', tokens: ['x', '=', '6'], zone: 'no' },
    { id: 'b', tokens: ['x', '=', '−1'], zone: 'no' },
    { id: 'c', tokens: ['x', '=', '−6'], zone: 'ok' },
    { id: 'd', tokens: ['x', '=', '1'], zone: 'ok' },
    { id: 'e', tokens: ['x', '=', '0'], zone: 'ok' },
  ],
  ask: L("Qiymatni bosing, keyin korzinani bosing.", 'Нажми значение, потом корзину.', 'Tap a value, then a basket.'),
  bank: L('Qiymatlar', 'Значения', 'Values'),
  wrongs: [
    {
      when: (s) => s.bad.indexOf('a') !== -1,
      text: L(
        "x = 6 da (x − 6) nolga aylanadi, ya'ni butun maxraj nolga aylanadi: bu qiymat TAQIQLANGAN.",
        'При x = 6 обращается в нуль (x − 6), значит и весь знаменатель: это значение ЗАПРЕЩЕНО.',
        'At x = 6, (x - 6) becomes zero, so the whole denominator does too: this value is FORBIDDEN.',
      ),
    },
    {
      when: (s) => s.bad.indexOf('b') !== -1,
      text: L(
        "x = −1 da (x + 1) nolga aylanadi: −1 + 1 = 0. Bu qiymat TAQIQLANGAN.",
        'При x = −1 обращается в нуль (x + 1): −1 + 1 = 0. Это значение ЗАПРЕЩЕНО.',
        'At x = -1, (x + 1) becomes zero: -1 + 1 = 0. This value is FORBIDDEN.',
      ),
    },
    {
      when: (s) => s.bad.indexOf('c') !== -1,
      text: L(
        "x = −6 da (x − 6) minus o'n ikkiga teng, nolga emas: −6 − 6 = −12. Ishorani almashtirmang -- taqiqlangan qiymat MUSBAT olti.",
        'При x = −6 (x − 6) равно минус двенадцати, а не нулю: −6 − 6 = −12. Не путай знак -- запрещённое значение это ПОЛОЖИТЕЛЬНАЯ шестёрка.',
        'At x = -6, (x - 6) equals minus twelve, not zero: -6 - 6 = -12. Do not flip the sign -- the forbidden value is POSITIVE six.',
      ),
    },
    {
      when: (s) => s.bad.indexOf('d') !== -1,
      text: L(
        "x = 1 da (x + 1) ikkiga teng, nolga emas: 1 + 1 = 2. Taqiqlangan qiymat MINUS bir, musbat bir emas.",
        'При x = 1 (x + 1) равно двум, а не нулю: 1 + 1 = 2. Запрещённое значение это МИНУС единица, а не плюс.',
        'At x = 1, (x + 1) equals two, not zero: 1 + 1 = 2. The forbidden value is MINUS one, not positive one.',
      ),
    },
    {
      when: (s) => s.bad.indexOf('e') !== -1,
      text: L(
        "x = 0 da maxraj (−6)(1) = −6, nolga emas: bu qiymat hisoblanadi.",
        'При x = 0 знаменатель равен (−6)(1) = −6, не нулю: это значение считается.',
        'At x = 0, the denominator is (-6)(1) = -6, not zero: this value computes.',
      ),
    },
  ],
  wrongText: L(
    "Har qiymatni ikkala qavsga alohida qo'ying va nolga aylanish-aylanmasligini tekshiring.",
    'Подставь каждое значение в обе скобки по отдельности и проверь, обращается ли что-то в нуль.',
    'Substitute each value into both brackets separately and check whether anything becomes zero.',
  ),
  correctText: L(
    "To'g'ri. Maxraj nolga faqat x = 6 va x = −1 da aylanadi -- boshqa hamma qiymatda kasr hisoblanadi.",
    'Верно. Знаменатель обращается в нуль только при x = 6 и x = −1 -- при всех остальных значениях дробь считается.',
    'Correct. The denominator becomes zero only at x = 6 and x = -1 -- at every other value the fraction computes.',
  ),
};

export default function D01_08(props) { return <Zones data={DATA} {...props} />; }
