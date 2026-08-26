// Dars10 · Amaliyot 10 — Pazl · 🔴 · tag: record_pairs
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Skelet: DARS07_11_AMALIYOT_SKELET.md §8 (10-dars, 10-pozitsiya)
//
// Uch yozuv, uch javob, va uchtasi ham modul haqida boshqacha gapiradi:
//   √(x²)  = |x|   modul KERAK, chunki x manfiy bo'lishi mumkin;
//   √(x⁴)  = x²    modul kerak EMAS: x kvadrat allaqachon nomanfiy;
//   (√x)²  = x     modul yo'q, lekin SHART bor: x nomanfiy bo'lishi kerak,
//                  aks holda yozuvning o'zi ma'nosiz.
// Ikki tomon ham matematika, shuning uchun kartalarda `side` ochiq berilgan.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'record_pairs', level: '🔴',
  cardSize: 86, faceSize: 19, cardSizePhone: 62, faceSizePhone: 14,
  cards: [
    { id: 'f1', side: 0, tokens: [{ r: 'x²' }] },
    { id: 'f2', side: 0, tokens: [{ r: 'x⁴' }] },
    { id: 'f3', side: 0, tokens: ['(', { r: 'x' }, ')²'] },
    { id: 'v1', side: 1, tokens: ['|x|'] },
    { id: 'v2', side: 1, tokens: ['x²'] },
    { id: 'v3', side: 1, tokens: ['x'] },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "Uch yozuv bir-biriga o'xshaydi, lekin natijalari boshqa. Bittasida modul kerak, bittasida kerak emas, bittasida esa yozuvning o'zi shart talab qiladi.",
    'Три записи похожи, но результаты разные. В одной модуль нужен, в другой не нужен, а третья сама требует условия.',
    'The three records look alike but their results differ. One needs the modulus, one does not, and the third demands a condition of its own.'),
  ask: L(
    "Yozuvni bosing, keyin uyani bosing.",
    'Нажми запись, потом ячейку.',
    'Tap a record, then a slot.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Birinchisida x manfiy bo'lishi mumkin, ildiz esa nomanfiy chiqishi shart — shuning uchun modul. Minus uchni qo'ying: kvadrati to'qqiz, ildizi uch, ya'ni modul. Ikkinchisida ildiz ostida to'rtinchi daraja, natija esa x kvadrat — u allaqachon nomanfiy, modul qo'yishning hojati yo'q. Uchinchisida ildiz TASHQARIDAN kvadratga oshirilgan: bunday yozuv faqat x nomanfiy bo'lganda mavjud, va natija x ning o'zi.",
    'Верно. В первой x может быть отрицательным, а корень обязан выйти неотрицательным — отсюда модуль. Подставь минус три: квадрат девять, корень три, то есть модуль. Во второй под корнем четвёртая степень, а результат x в квадрате — он уже неотрицателен, модуль ставить не надо. В третьей корень возведён в квадрат СНАРУЖИ: такая запись существует только при неотрицательном x, и результат сам x.',
    'Correct. In the first x may be negative while the root must come out non-negative — hence the modulus. Substitute minus three: the square is nine, the root is three, that is the modulus. In the second a fourth power stands under the root and the result is x squared — already non-negative, so no modulus is needed. In the third the root is squared from OUTSIDE: such a record exists only for non-negative x, and the result is x itself.'),
  wrongs: [
    { when: (s) => s.mate.f2 === 'v1' || s.mate.f1 === 'v2', text: L(
      "Ikki yozuvning natijasini solishtiring. x kvadrat manfiy bo'lmaydi, shuning uchun unga modul qo'yish keraksiz. x ning o'zi esa manfiy bo'lishi mumkin — mana shu joyda modul kerak.",
      'Сравни результаты двух записей. x в квадрате не бывает отрицательным, поэтому модуль ему не нужен. А само x может быть отрицательным — вот тут модуль и нужен.',
      'Compare the results of the two records. x squared is never negative, so it needs no modulus. But x itself may be negative — that is where the modulus is needed.') },
    { when: (s) => s.mate.f3 === 'v1' || s.mate.f1 === 'v3', text: L(
      "Ikki yozuvning FARQI kvadrat qayerda turganida. Bir yerda kvadrat ildiz ostida, boshqa yerda ildizdan tashqarida. Minus uchni ikkalasiga qo'yib ko'ring: birinchisi uch beradi, ikkinchisi esa umuman ma'noga ega bo'lmaydi.",
      'РАЗНИЦА двух записей в том, где стоит квадрат. В одной он под корнем, в другой снаружи. Подставь минус три в обе: первая даст три, а вторая вообще не будет иметь смысла.',
      'The DIFFERENCE between the two records is where the square stands. In one it is under the root, in the other outside it. Substitute minus three into both: the first gives three, the second has no value at all.') },
    { when: (s) => s.mate.f3 === 'v2' || s.mate.f2 === 'v3', text: L(
      "Darajalarni solishtiring: to'rtinchi darajaning ildizi kvadratni beradi, ildizning kvadrati esa ildiz ostidagi ifodaning o'zini. To'rtni qo'yib ikkalasini hisoblang.",
      'Сравни степени: корень из четвёртой степени даёт квадрат, а квадрат корня даёт само подкоренное. Подставь четыре и посчитай оба.',
      'Compare the powers: the root of a fourth power gives the square, while the square of a root gives the radicand itself. Substitute four and compute both.') },
  ],
  wrongText: L(
    "Har yozuvga minus uchni va uchni qo'yib ko'ring. Natija manfiy chiqishi mumkinmi — mana shu savol modul kerakligini aytadi.",
    'Подставь в каждую запись минус три и три. Может ли результат выйти отрицательным — этот вопрос и говорит, нужен ли модуль.',
    'Substitute minus three and three into each record. Can the result come out negative — that question tells you whether the modulus is needed.'),
};

export default function D10_10(props) { return <PairSlots data={DATA} {...props} />; }
