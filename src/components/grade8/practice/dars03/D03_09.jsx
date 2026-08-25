// Dars03 · Amaliyot 09 — Kod · 🔴 · tag: bans_survive
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> CodeLock.
// Kontent: src/books/grade8/DARS03_AMALIYOT_KONTENT_V2.md §09
//
// Ilgari bu savol 06-o'rinda va `NumberLine` da turgan (ikki taqiq, o'qdagi
// nuqtalar). Metodist qarori 2026-08-24: o'nta mexanika 1-darsdan olinadi,
// shuning uchun taqiqlar KOD bo'lib yoziladi, uchinchi taqiq qo'shildi va
// TARTIB ham talab qilinadi.
//
// g(g + 4) / (g(g − 2)(g + 4)) qisqarganda 1/(g − 2) bo'ladi. Javobda bitta
// taqiq ko'rinadi, DASTLABKI yozuvda esa uchta:
//   g = 0    qisqaradi, ko'rinmay ketadi
//   g = −4   qisqaradi, ko'rinmay ketadi
//   g = 2    javobda ham ko'rinadi
// Darsning eng qimmat joyi shu: taqiqni QISQARGAN yozuvdan emas, dastlabkidan
// olish kerak. Bankdagi tuzoqlar: 4 va −2 (ishora), 1 (yozuvdagi son).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { CodeLock, L } from '../kit.jsx';

const DATA = {
  tag: 'bans_survive', level: '🔴',
  expr: [{ n: 'g(g + 4)', d: 'g(g − 2)(g + 4)' }], exprSize: 21,
  cards: ['−4', '−2', '0', '1', '2', '4'],
  answer: ['−4', '0', '2'],
  eyebrow: L('Kod', 'Код', 'Code'),
  setup: L(
    "Bu kasr qisqarganda 1/(g − 2) bo'ladi. Lekin savol qisqargani haqida emas — DASTLABKI yozuv haqida. Seyf kodi uch xonali.",
    'После сокращения эта дробь станет 1/(g − 2). Но вопрос не про сокращённую, а про ИСХОДНУЮ запись. Код сейфа трёхзначный.',
    'After cancelling this fraction becomes 1/(g − 2). But the question is not about the cancelled record — it is about the ORIGINAL one. The safe code has three places.'),
  slotLabel: L('Kod', 'Код', 'Code'),
  ask: L(
    "Dastlabki kasr qiymatga ega bo'lmagan qiymatlarni o'sish tartibida kodga yozing.",
    'Запиши в код по возрастанию значения, при которых ИСХОДНАЯ дробь не имеет значения.',
    'Write into the code, in increasing order, the values at which the ORIGINAL fraction has no value.'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Maxraj uch ko'paytuvchidan iborat va har biri o'z taqig'ini beradi: g nolda, g minus ikki ikkida, g qo'shuv to'rt minus to'rtda. O'sish tartibida minus to'rt, nol, ikki. Qisqartirishdan keyin g ham, g qo'shuv to'rt ham yozuvdan ketadi — lekin taqiq ketmaydi, uni dastlabki kasr belgilagan. Aynan shu joy uchinchi darsning eng qimmat joyi.",
    'Верно. Знаменатель состоит из трёх множителей, и каждый даёт свой запрет: g — при нуле, g минус два — при двух, g плюс четыре — при минус четырёх. По возрастанию: минус четыре, нуль, два. После сокращения и g, и g плюс четыре уходят из записи, а запрет не уходит — его задала исходная дробь. Это и есть самое дорогое место третьего урока.',
    'Correct. The denominator has three factors and each gives its own ban: g at zero, g minus two at two, g plus four at minus four. In increasing order: minus four, zero, two. After cancelling, both g and g plus four leave the record, but the bans do not — the original fraction set them. That is the most valuable point of lesson three.'),
  wrongs: [
    { when: (s) => s.set, text: L(
      "Sonlar to'g'ri, tartib esa yo'q. Kod O'SISH tartibida yoziladi: minus to'rt noldan kichik, nol esa ikkidan kichik.",
      'Числа верные, а порядок нет. Код пишется по ВОЗРАСТАНИЮ: минус четыре меньше нуля, нуль меньше двух.',
      'The numbers are right, the order is not. The code is written in INCREASING order: minus four is less than zero, zero is less than two.') },
    { when: (s) => s.slots.indexOf('4') !== -1 || s.slots.indexOf('−2') !== -1, text: L(
      "Ishorani tekshiring: g qo'shuv to'rt nolga MINUS to'rtda aylanadi, g minus ikki esa ARTI ikkida. Ikkalasini qo'yib ko'ring.",
      'Проверь знак: g плюс четыре обращается в нуль при МИНУС четырёх, а g минус два — при ПЛЮС двух. Подставь оба.',
      'Check the sign: g plus four becomes zero at MINUS four, and g minus two at PLUS two. Substitute both.') },
    { when: (s) => s.slots.indexOf('1') !== -1, text: L(
      "Bir — qisqargan kasrning suratidagi son, taqiq emas. Birda dastlabki maxraj bir karra minus bir karra besh, ya'ni minus besh — nol emas.",
      'Единица — это число из числителя сокращённой дроби, а не запрет. При единице исходный знаменатель равен одному на минус один на пять, то есть минус пяти, а не нулю.',
      'One is a number from the numerator of the cancelled fraction, not a ban. At one the original denominator is one times minus one times five, that is minus five, not zero.') },
    { when: (s) => s.slots.indexOf('2') !== -1 && s.slots.length < 3, text: L(
      "Ikki — bu QISQARGAN kasrning taqig'i. Dastlabki maxrajda yana ikkita ko'paytuvchi turibdi, va ular ham nolga aylanadi.",
      'Два — это запрет СОКРАЩЁННОЙ дроби. В исходном знаменателе стоят ещё два множителя, и они тоже обращаются в нуль.',
      'Two is the ban of the CANCELLED fraction. The original denominator has two more factors, and they become zero as well.') },
  ],
  wrongText: L(
    "Taqiqni qisqargan yozuvdan emas, DASTLABKI maxrajdan oling: uchta ko'paytuvchi — uchta taqiq. Keyin sonlarni o'sish tartibida yozing.",
    'Бери запрет не из сокращённой записи, а из ИСХОДНОГО знаменателя: три множителя — три запрета. Потом запиши числа по возрастанию.',
    'Take the bans not from the cancelled record but from the ORIGINAL denominator: three factors mean three bans. Then write the numbers in increasing order.'),
};

export default function D03_09(props) { return <CodeLock data={DATA} {...props} />; }
