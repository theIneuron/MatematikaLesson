// Dars20 · Amaliyot 04 — Kod · 🟡 · tag: code_forbidden
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §8 (20-dars, 4-pozitsiya)
//
// UCH TENGLAMA, UCH TAQIQ. Uchinchisida maxrajni avval ko'paytuvchilarga
// ajratish kerak: ikki x minus olti bu ikki karra x minus uch, ya'ni taqiq
// uchda, oltida emas.
//
// Bankdagi tuzoqlar:
//   −5 va 1 — ishora almashtirilgan (x − 5 ning noli beshda, x + 1 ning noli
//             minus birda);
//   6       — uchinchi maxrajdagi son, koeffitsiyent hisobga olinmagan.
// Kod O'SISH tartibida yoziladi, va manfiy son boshda turadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'code_forbidden', level: '🟡',
  expr: [{ n: '1', d: 'x − 5' }, '= 2', ';', { n: '3', d: 'x + 1' }, '= x', ';', { n: '4', d: '2x − 6' }, '= 1'],
  exprSize: 15,
  cards: ['−5', '−1', '1', '3', '5', '6'],
  answer: ['−1', '3', '5'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Xonada seyf turadi, kodi uch xonali. Uch tenglamaning har birida bitta taqiqlangan qiymat bor. Uchinchisida maxrajni avval ko'paytuvchilarga ajratish kerak.",
    'В комнате сейф, код трёхзначный. В каждом из трёх уравнений есть одно запрещённое значение. В третьем знаменатель надо сначала разложить на множители.',
    'There is a safe in the room and its code has three places. Each of the three equations has one forbidden value. In the third the denominator must be factored first.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Uch taqiqlangan qiymatni toping va kodga o'sish tartibida yozing.",
    'Найди три запрещённых значения и запиши их в код по возрастанию.',
    'Find the three forbidden values and write them into the code in increasing order.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Birinchisida x minus besh nolga teng, demak x beshga teng. Ikkinchisida x qo'shuv bir nolga teng, demak x minus birga teng — ishora almashadi. Uchinchisida ikki x minus olti nolga teng: ikkini qavsdan chiqarsangiz ikki karra x minus uch chiqadi, ya'ni x uchga teng. O'sish tartibida: minus bir, uch, besh. Diqqat: o'ng tomonda nima turgani ahamiyatsiz — taqiqni faqat maxraj beradi.",
    'Верно. В первом x минус пять равно нулю, значит x равен пяти. Во втором x плюс один равно нулю, значит x равен минус одному — знак меняется. В третьем два x минус шесть равно нулю: вынеси двойку и выйдет два на скобку x минус три, то есть x равен трём. По возрастанию: минус один, три, пять. Обрати внимание: что стоит справа, неважно — запрет даёт только знаменатель.',
    'Correct. In the first, x minus five is zero, so x is five. In the second, x plus one is zero, so x is minus one — the sign flips. In the third, two x minus six is zero: factor out the two and you get two times the bracket x minus three, so x is three. In increasing order: minus one, three, five. Note: what stands on the right does not matter — only the denominator bans values.'),
  wrongs: [
    { when: (s) => s.slots.indexOf('1') !== -1, text: L(
      "Ikkinchi tenglamada taqiq MINUS birda. Maxrajni nolga tenglang: x qo'shuv bir nolga teng bo'lsa x minus birga teng. Birni qo'yib tekshiring: bir qo'shuv bir ikki, ya'ni maxraj noldan farqli — bir ruxsat etilgan qiymat.",
      'Во втором уравнении запрет в МИНУС единице. Приравняй знаменатель к нулю: если x плюс один равно нулю, то x равен минус одному. Подставь единицу и проверь: один плюс один два, знаменатель не нуль — единица допустима.',
      'In the second equation the ban is at MINUS one. Set the denominator to zero: if x plus one is zero then x is minus one. Substitute one and check: one plus one is two, the denominator is non-zero — one is admissible.') },
    { when: (s) => s.slots.indexOf('−5') !== -1, text: L(
      "Birinchi tenglamada taqiq ARTI beshda. x minus besh nolga teng bo'lsa x beshga teng. Minus beshni qo'ying: minus besh minus besh minus o'n, maxraj noldan farqli.",
      'В первом уравнении запрет в ПЛЮС пяти. Если x минус пять равно нулю, то x равен пяти. Подставь минус пять: минус пять минус пять минус десять, знаменатель не нуль.',
      'In the first equation the ban is at PLUS five. If x minus five is zero then x is five. Substitute minus five: minus five minus five is minus ten, the denominator is non-zero.') },
    { when: (s) => s.slots.indexOf('6') !== -1, text: L(
      "Olti — uchinchi maxrajdagi son, lekin taqiq u yerda emas. Ikki x minus oltini nolga tenglang: ikki x oltiga teng, demak x uchga teng. Oltini qo'yib tekshiring: ikki karra olti minus olti olti, maxraj noldan farqli.",
      'Шесть — число из третьего знаменателя, но запрет не там. Приравняй два x минус шесть к нулю: два x равно шести, значит x равен трём. Подставь шесть и проверь: два на шесть минус шесть шесть, знаменатель не нуль.',
      'Six is a number from the third denominator, but the ban is not there. Set two x minus six to zero: two x is six, so x is three. Substitute six and check: two times six minus six is six, the denominator is non-zero.') },
    { when: (s) => s.set, text: L(
      "Sonlar to'g'ri topilgan, tartib esa buzilgan. O'sish eng kichigidan boshlanadi, va manfiy son har qanday musbat sondan kichik: minus bir, uch, besh.",
      'Числа найдены верно, а порядок нет. Возрастание начинается с наименьшего, а отрицательное меньше любого положительного: минус один, три, пять.',
      'The numbers are right, the order is not. Increasing starts from the smallest, and a negative is below any positive: minus one, three, five.') },
    { when: (s) => s.slots.indexOf('3') === -1, text: L(
      "Kodda uch yo'q. Uchinchi tenglamada maxrajni ko'paytuvchilarga ajratish kerak: ikki x minus olti bu ikki karra x minus uch. Ikki hech qachon nolga aylanmaydi, demak taqiqni x minus uch beradi — uchda.",
      'В коде нет тройки. В третьем уравнении знаменатель надо разложить: два x минус шесть это два на скобку x минус три. Двойка в нуль не обращается, значит запрет даёт x минус три — в трёх.',
      'The code has no three. In the third equation the denominator must be factored: two x minus six is two times the bracket x minus three. The two never vanishes, so the ban comes from x minus three — at three.') },
  ],
  wrongText: L(
    "Har tenglamada FAQAT maxrajni nolga tenglab yeching. Ko'paytuvchi qavsdan chiqadigan maxrajni ajratib ko'ring, va o'ng tomonga qaramang.",
    'В каждом уравнении приравнивай к нулю ТОЛЬКО знаменатель и решай. Где выносится множитель — разложи, а на правую часть не смотри.',
    'In every equation set ONLY the denominator to zero and solve. Factor the denominators that allow it, and ignore the right side.'),
};

export default function D20_04(props) { return <CodeLock data={DATA} {...props} />; }
