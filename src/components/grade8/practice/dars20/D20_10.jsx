// Dars20 · Amaliyot 10 — Guruhlar · 🔴 · tag: banned_at_two
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §8 (20-dars, 10-pozitsiya)
//
// 03-TOPSHIRIQDAN FARQI — AJRATISH. U yerda maxrajlar ochiq turgan edi, bu
// yerda esa taqiqni ko'rish uchun ko'paytuvchilarga ajratish kerak:
//   x² − 4  = (x − 2)(x + 2)   — taqiq ikkida ham, minus ikkida ham;
//   2x − 4  = 2(x − 2)         — koeffitsiyent taqiqni siljitmaydi;
//   x² − 2x = x(x − 2)         — taqiq nolda ham, ikkida ham.
// Ruxsat etilgan ustunda esa har juftlikning ishorasi almashgan: x + 2,
// x² + 4 (hech qachon nolga aylanmaydi), 2x + 4, x² + 2x = x(x + 2).
// Tekshirilayotgan qiymat `given` qatorida turadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'banned_at_two', level: '🔴',
  zoneSize: 13, itemSize: 13,
  given: [['x = 2']],
  givenLabel: L('Tekshirilayotgan qiymat', 'Проверяемое значение', 'The value tested'),
  zones: [
    { id: 'z1', label: L('TAQIQLANGAN', 'ЗАПРЕЩЕНО', 'BANNED') },
    { id: 'z2', label: L('RUXSAT ETILGAN', 'ДОПУСТИМО', 'ALLOWED') },
  ],
  items: [
    { id: 'i1', tokens: [{ n: '1', d: 'x − 2' }], zone: 'z1' },
    { id: 'i2', tokens: [{ n: '1', d: 'x + 2' }], zone: 'z2' },
    { id: 'i3', tokens: [{ n: '3', d: 'x² − 4' }], zone: 'z1' },
    { id: 'i4', tokens: [{ n: '3', d: 'x² + 4' }], zone: 'z2' },
    { id: 'i5', tokens: [{ n: '5', d: '2x − 4' }], zone: 'z1' },
    { id: 'i6', tokens: [{ n: '5', d: '2x + 4' }], zone: 'z2' },
    { id: 'i7', tokens: [{ n: 'x', d: 'x² − 2x' }], zone: 'z1' },
    { id: 'i8', tokens: [{ n: 'x', d: 'x² + 2x' }], zone: 'z2' },
  ],
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Sakkiz kasr, va hammasida bitta qiymat tekshiriladi: x teng ikki. Kartalar juft-juft, faqat ishora farq qiladi — lekin ba'zi maxrajni avval ko'paytuvchilarga ajratish kerak.",
    'Восемь дробей, и во всех проверяется одно значение: x равно двум. Карточки идут парами, различается только знак — но некоторые знаменатели надо сначала разложить на множители.',
    'Eight fractions, and one value is tested in all of them: x equals two. The cards come in pairs differing only in sign — but some denominators must be factored first.'),
  ask: L(
    "Kasrni bosing, keyin guruhini bosing.",
    'Нажми дробь, потом её группу.',
    'Tap a fraction, then its group.'),
  bank: L('Kasrlar', 'Дроби', 'Fractions'),
  correctText: L(
    "To'g'ri. Taqiqlangan to'rttada ikkida maxraj nolga aylanadi, ruxsat etilgan to'rttada esa yo'q.",
    'Верно. У четырёх запрещённых знаменатель при двух обращается в нуль, а у четырёх допустимых нет.',
    'Correct. In the four banned ones the denominator vanishes at two, and in the four allowed ones it does not.'),
  wrongs: [
    { when: (s) => s.place.i3 === 'z2' || s.place.i7 === 'z2', text: L(
      "Bu maxrajda taqiq YASHIRIN, uni ajratish ochadi. x kvadrat minus to'rt bu x minus ikki karra x qo'shuv ikki; x kvadrat minus ikki x esa x karra x minus ikki.",
      'В этом знаменателе запрет СПРЯТАН, его открывает разложение. x квадрат минус четыре это x минус два на x плюс два; x квадрат минус два x это x на скобку x минус два.',
      'In this denominator the ban is HIDDEN and factoring reveals it. x squared minus four is x minus two times x plus two; x squared minus two x is x times the bracket x minus two.') },
    { when: (s) => s.place.i5 === 'z2', text: L(
      "Koeffitsiyent taqiqni siljitmaydi: ikki x minus to'rt bu ikki karra x minus ikki. Ikki hech qachon nolga aylanmaydi, demak taqiqni x minus ikki beradi — ikkida. Tekshiring: ikki karra ikki minus to'rt nol.",
      'Коэффициент запрет не сдвигает: два x минус четыре это два на скобку x минус два. Двойка в нуль не обращается, значит запрет даёт x минус два — в двух. Проверь: два на два минус четыре нуль.',
      'A coefficient does not move the ban: two x minus four is two times the bracket x minus two. The two never vanishes, so the ban comes from x minus two — at two. Check: two times two minus four is zero.') },
    { when: (s) => s.place.i4 === 'z1', text: L(
      "Bu maxraj HECH QACHON nolga aylanmaydi: x kvadrat nomanfiy, unga to'rt qo'shilsa hech bo'lmasa to'rt chiqadi. Ikkida sakkiz. Demak bu kasrda taqiq umuman yo'q — na ikkida, na boshqa joyda.",
      'Этот знаменатель НИКОГДА не обращается в нуль: x квадрат неотрицателен, прибавь четыре — выйдет не меньше четырёх. При двух восемь. Значит запретов у этой дроби нет вовсе — ни в двух, ни где-либо ещё.',
      'This denominator NEVER vanishes: x squared is non-negative, and adding four keeps it at least four. At two it is eight. So this fraction has no ban at all — not at two, not anywhere.') },
    { when: (s) => s.place.i2 === 'z1' || s.place.i6 === 'z1' || s.place.i8 === 'z1', text: L(
      "Bu maxrajlarda QO'SHISH turadi, ya'ni ularning noli manfiy tomonda: x qo'shuv ikki minus ikkida, ikki x qo'shuv to'rt ham minus ikkida, x kvadrat qo'shuv ikki x esa nolda va minus ikkida. Ikkida ularning hech biri nolga aylanmaydi.",
      'В этих знаменателях СЛОЖЕНИЕ, то есть их нули в отрицательной части: x плюс два в минус двух, два x плюс четыре тоже в минус двух, а x квадрат плюс два x в нуле и минус двух. При двух ни один из них в нуль не обращается.',
      'These denominators use ADDITION, so their zeros lie on the negative side: x plus two at minus two, two x plus four also at minus two, and x squared plus two x at zero and minus two. At two none of them vanishes.') },
    { when: (s) => s.bad.length >= 4, text: L(
      "Har kasrda ikki yo'l bor: ikkini maxrajga qo'yib hisoblash, yoki maxrajni ko'paytuvchilarga ajratib x minus ikki bor-yo'qligini ko'rish. Ikkisi ham bir javobni beradi.",
      'В каждой дроби два пути: подставить два в знаменатель и посчитать, или разложить знаменатель и посмотреть, есть ли в нём x минус два. Оба дают один ответ.',
      'Two routes per fraction: substitute two into the denominator and compute, or factor the denominator and see whether x minus two is there. Both give the same answer.') },
  ],
  wrongText: L(
    "Ikkini har maxrajga qo'yib hisoblang, yoki maxrajni ko'paytuvchilarga ajratib x minus ikkini izlang. Koeffitsiyent taqiqni siljitmaydi, qo'shish esa uni manfiy tomonga suradi.",
    'Подставь два в каждый знаменатель и посчитай, или разложи знаменатель и ищи x минус два. Коэффициент запрет не сдвигает, а сложение уводит его в отрицательную сторону.',
    'Substitute two into every denominator and compute, or factor the denominator and look for x minus two. A coefficient does not move the ban; addition pushes it to the negative side.'),
};

export default function D20_10(props) { return <Zones data={DATA} {...props} />; }
