// Dars05 · Amaliyot 10 — Kod · 🔴 · tag: three_bans
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Kontent: src/books/grade8/DARS05_AMALIYOT_KONTENT_V2.md §10
//
// Ilgari bu savol `NumberLine` da turgan (o'qdagi nuqtalar). Metodist qarori
// 2026-08-24: o'nta mexanika 1-darsdan olinadi, shuning uchun taqiqlar KOD
// bo'lib yoziladi va TARTIB ham talab qilinadi. Matematika o'zgarmadi.
//
// v/(v − 2) : (v + 6)/(v − 8). Bo'lishda taqiq UCH joydan keladi:
//   v ≠ 2    bo'linuvchining maxrajidan
//   v ≠ −6   BO'LUVCHINING SURATIDAN — nolga bo'lib bo'lmaydi (З26)
//   v ≠ 8    bo'luvchining maxrajidan
// Javob v(v − 8) / ((v − 2)(v + 6)) bo'ladi, va unda SAKKIZ umuman
// ko'rinmaydi: u yerda javob shunchaki nolga teng. Ya'ni sakkiz — javobdan
// topib bo'lmaydigan taqiq (З2). Bu darsning eng qiyin joyi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'three_bans', level: '🔴',
  cards: ['−8', '−6', '−2', '2', '6', '8'],
  answer: ['−6', '2', '8'],
  expr: [{ n: 'v', d: 'v − 2' }, ':', { n: 'v + 6', d: 'v − 8' }], exprSize: 19,
  eyebrow: L('Kod', 'Код', 'Code'),
  slotLabel: L('Kod', 'Код', 'Code'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  setup: L(
    "Xonada seyf turadi, kodi uch xonali. Bo'lish berilgan: taqiqlar uch xil joydan keladi, va ularning bittasi javobda umuman ko'rinmaydi.",
    'В комнате сейф, код трёхзначный. Дано деление: запреты приходят из трёх разных мест, и один из них в ответе вообще не виден.',
    'There is a safe in the room and its code has three places. A division is given: the bans come from three different places, and one of them is invisible in the answer.'),
  ask: L(
    "Ifoda qiymatga ega bo'lmagan qiymatlarni o'sish tartibida kodga yozing.",
    'Запиши в код по возрастанию значения, при которых выражение не имеет значения.',
    'Write into the code, in increasing order, the values at which the expression has no value.'),
  correctText: L(
    "To'g'ri. Ikkida bo'linuvchining maxraji nolga aylanadi. Sakkizda bo'luvchining maxraji nolga aylanadi, ya'ni bo'luvchining O'ZI mavjud emas. Minus oltida esa bo'luvchining SURATI nol bo'ladi — bo'luvchi nolga teng, nolga bo'lish esa mumkin emas. Javobda faqat ikki va minus olti ko'rinadi, sakkiz esa yo'qoladi: u yerda javob shunchaki nol beradi.",
    'Верно. При двух обращается в нуль знаменатель делимого. При восьми обращается в нуль знаменатель делителя, то есть САМОГО делителя не существует. А при минус шести нулём становится ЧИСЛИТЕЛЬ делителя — делитель равен нулю, а на нуль делить нельзя. В ответе видны только два и минус шесть, восьмёрка исчезает: там ответ просто равен нулю.',
    "Correct. At two the dividend's denominator vanishes. At eight the divisor's denominator vanishes, so the divisor itself does not exist. At minus six the divisor's NUMERATOR becomes zero — the divisor equals zero, and dividing by zero is impossible. In the answer only two and minus six are visible; the eight disappears because the answer there is simply zero."),
  wrongs: [
    { when: (s) => s.set, text: L(
      "Sonlar to'g'ri, tartib esa yo'q. Kod O'SISH tartibida yoziladi: minus olti ikkidan kichik, ikki esa sakkizdan kichik.",
      'Числа верные, а порядок нет. Код пишется по ВОЗРАСТАНИЮ: минус шесть меньше двух, два меньше восьми.',
      'The numbers are right, the order is not. The code is written in INCREASING order: minus six is less than two, two is less than eight.') },
    { when: (s) => s.slots.indexOf('8') === -1, text: L(
      "Sakkiz yetishmayapti. U javobda ko'rinmaydi, chunki u yerda javob nolga teng — lekin DASTLABKI yozuvda sakkiz bo'luvchining maxrajini nolga aylantiradi, ya'ni bo'luvchi umuman yo'q.",
      'Не хватает восьмёрки. В ответе её не видно, потому что там ответ равен нулю — но в ИСХОДНОЙ записи восемь обращает в нуль знаменатель делителя, то есть делителя просто нет.',
      "Eight is missing. It is invisible in the answer because the answer there is zero — but in the ORIGINAL record eight makes the divisor's denominator zero, so the divisor does not exist.") },
    { when: (s) => s.slots.indexOf('−6') === -1, text: L(
      "Minus olti yetishmayapti. U bo'luvchining SURATIDAN keladi: minus oltida bo'luvchi nolga teng bo'ladi, nolga bo'lish esa mumkin emas. Bu darsning uchinchi sharti.",
      'Не хватает минус шести. Он приходит из ЧИСЛИТЕЛЯ делителя: при минус шести делитель равен нулю, а на нуль делить нельзя. Это третье условие урока.',
      "Minus six is missing. It comes from the divisor's NUMERATOR: at minus six the divisor equals zero, and dividing by zero is impossible. That is the lesson's third condition.") },
    { when: (s) => s.slots.indexOf('2') === -1, text: L(
      "Ikki yetishmayapti — bu eng ochiq taqiq: bo'linuvchining maxraji v minus ikki.",
      'Не хватает двойки — это самый явный запрет: знаменатель делимого v минус два.',
      "Two is missing — the most obvious ban: the dividend's denominator is v minus two.") },
    { when: (s) => s.slots.indexOf('6') !== -1 || s.slots.indexOf('−2') !== -1 || s.slots.indexOf('−8') !== -1, text: L(
      "Ishoralarni tekshiring: v minus ikki nolga ARTI ikkida, v qo'shuv olti MINUS oltida, v minus sakkiz esa ARTI sakkizda aylanadi.",
      'Проверь знаки: v минус два обращается в нуль при ПЛЮС двух, v плюс шесть при МИНУС шести, а v минус восемь при ПЛЮС восьми.',
      'Check the signs: v minus two is zero at PLUS two, v plus six at MINUS six, and v minus eight at PLUS eight.') },
  ],
  wrongText: L(
    "Uch joyni alohida nolga tenglang: bo'linuvchining maxraji, bo'luvchining maxraji va bo'luvchining SURATI. Uchtasi ham taqiq beradi.",
    'Приравняй к нулю три места по отдельности: знаменатель делимого, знаменатель делителя и ЧИСЛИТЕЛЬ делителя. Все три дают запрет.',
    "Set three places to zero separately: the dividend's denominator, the divisor's denominator and the divisor's NUMERATOR. All three give a ban."),
};

export default function D05_10(props) { return <CodeLock data={DATA} {...props} />; }
