// Dars28 · Amaliyot 02 — Ha yoki yo'q · 🟢 · tag: answer_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §10 (28-dars, 2-pozitsiya)
//
// T3 IKKI HOLDA, va IKKALA JAVOB HAM «HA» (metodist qarori 2026-08-25:
// ha-yo'q topshiriqlarida javob naqshi bo'lmasin, qo'shni darslarda
// kombinatsiya takrorlanmaydi — DARS07_11_AMALIYOT_SKELET.md §10 p. 9):
//   s1 — oxirgi qadam bajarilgan: yechim kasr chiqqan, javob esa butun songa
//        keltirilgan — daftarning yarmi bo'lmaydi;
//   s2 — oxirgi qadam yana bajarilgan: tengsizlikning yechimidan masalaga zid
//        qiymatlar chiqarib tashlangan, javobda faqat musbat uzunlik qolgan.
// З57 (solishtirish umuman qilinmagani) shu yerda tutiladi: yechimni javob
// deb ko'chirib yozgan o'quvchi ikkinchi qatorga «yo'q» bosadi, chunki u
// yerda minus to'rt yo'q.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'answer_claims', level: '🟢',
  itemSize: 15,
  items: [
    { id: 's1', yes: true,
      tokens: ['x ≤ 6,6'],
      claim: L('daftarlar soni, javob: 6 ta', 'число тетрадей, ответ: 6', 'the count of notebooks, answer: 6') },
    { id: 's2', yes: true,
      tokens: ['x ≥ −4'],
      claim: L('tomon uzunligi, javob: x > 0', 'длина стороны, ответ: x > 0', 'a side length, answer: x > 0') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "Ikki masala yechilgan va tengsizlikning yechimi topilgan. Endi javobni masala shartiga solishtirish kerak: yechim hali javob emas.",
    'Две задачи решены, и решение неравенства найдено. Теперь ответ надо сверить с условием задачи: решение — ещё не ответ.',
    'Two problems were solved and the solution of the inequality was found. Now the answer must be checked against the condition: a solution is not yet an answer.'),
  ask: L(
    "Javob to'g'ri yozilgan bo'lsa «Ha», noto'g'ri bo'lsa «Yo'q».",
    'Если ответ записан верно — «Да», если неверно — «Нет».',
    'If the answer is written correctly, «Yes»; if not, «No».'),
  correctText: L(
    "To'g'ri. Ikkala qatorda ham oxirgi qadam bajarilgan. Birinchisida yechim kasr chiqqan, javob esa butun songa keltirilgan — daftarning yarmi bo'lmaydi. Ikkinchisida yechimdan masalaga zid qiymatlar chiqarib tashlangan: uzunlik manfiy bo'lmaydi.",
    'Верно. В обеих строках последний шаг сделан. В первой решение вышло дробным, а ответ приведён к целому — половины тетради не бывает. Во второй из решения исключены противоречащие условию значения: длина отрицательной не бывает.',
    'Correct. In both rows the last step is done. In the first the solution came out fractional and the answer was brought to a whole number — there is no half notebook. In the second the values contradicting the condition were excluded: a length is never negative.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Birinchi javob to'g'ri. Tengsizlikning yechimi olti butun oltidan o'ngacha bo'lgan hamma son, lekin masalada DAFTARLAR soni so'ralgan — u butun bo'lishi kerak. Oltidan katta va olti butun oltidan o'ndan kichik butun son yo'q, shuning uchun eng katta mumkin bo'lgan javob — olti.",
      'Первый ответ верен. Решение неравенства — все числа до шести целых шести десятых, но в задаче спрашивают число ТЕТРАДЕЙ, а оно должно быть целым. Целого числа между шестью и шестью целыми шестью десятыми нет, поэтому наибольший возможный ответ — шесть.',
      'The first answer is right. The solution of the inequality is every number up to six point six, but the problem asks for a count of NOTEBOOKS, which must be whole. There is no whole number between six and six point six, so the largest possible answer is six.') },
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
        "Ikkinchi javob to'g'ri: yechimda minus uch ham bor, lekin x tomon uzunligini bildiradi va manfiy bo'lolmaydi. Shuning uchun javobda faqat musbat sonlar qoldi — bu aynan bajarilishi kerak bo'lgan oxirgi qadam.",
        'Второй ответ верен: в решении есть и минус три, но x означает длину стороны и отрицательным быть не может. Поэтому в ответе остались только положительные числа — это и есть тот последний шаг, который надо сделать.',
        'The second answer is right: the solution includes minus three, but x is a side length and cannot be negative. So only positive numbers remained in the answer — exactly the last step that must be taken.') },
  ],
  wrongText: L(
    "Tengsizlikning yechimi hali javob emas. Yechimdan masala shartiga zid qiymatlarni chiqarib tashlang: sanoq butun bo'ladi, uzunlik esa musbat.",
    'Решение неравенства — ещё не ответ. Исключи из решения значения, противоречащие условию: количество бывает целым, а длина положительной.',
    'The solution of an inequality is not yet an answer. Exclude from it the values that contradict the problem: a count is whole, a length is positive.'),
};

export default function D28_02(props) { return <TrueFalse data={DATA} {...props} />; }
