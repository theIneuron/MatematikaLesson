// Dars17 · Amaliyot 01 — Minus b · 🟢 · tag: minus_b_marked
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §5 (17-dars, 1-pozitsiya)
//
// З44 NING TAYANCHI. Formulaning suratida «minus b» turadi, va bu «manfiy
// son» degani emas: b ning O'ZI manfiy bo'lsa, minus b MUSBAT chiqadi.
// Uchta belgilanadigan kartada b manfiy, uchtasida musbat.
//
// Uchinchi karta ataylab qo'yilgan: `−x² − 4x + 1 = 0` da bosh koeffitsiyent
// ham manfiy, lekin savol faqat b haqida — a ning minusi hech narsani
// o'zgartirmaydi. Ikkinchi karta esa `x² − x − 5 = 0`: koeffitsiyent
// ko'rinmaydi, lekin u minus bir.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'minus_b_marked', level: '🟢',
  col: 168, itemSize: 15,
  items: [
    { id: 'i1', tokens: ['x² − 7x + 2 = 0'], hit: true },
    { id: 'i2', tokens: ['2x² + 3x − 1 = 0'] },
    { id: 'i3', tokens: ['x² − x − 5 = 0'], hit: true },
    { id: 'i4', tokens: ['3x² + 8x = 0'] },
    { id: 'i5', tokens: ['−x² − 4x + 1 = 0'], hit: true },
    { id: 'i6', tokens: ['x² + 6x + 9 = 0'] },
  ],
  eyebrow: L('Minus b', 'Минус b', 'Minus b'),
  setup: L(
    "Ildizlar formulasining suratida «minus b» turadi. Bu manfiy son degani emas: b ning o'zi manfiy bo'lsa, minus b musbat chiqadi.",
    'В числителе формулы корней стоит «минус b». Это не значит отрицательное число: если само b отрицательно, минус b выходит положительным.',
    'The numerator of the root formula holds «minus b». That does not mean a negative number: if b itself is negative, minus b comes out positive.'),
  ask: L(
    "«minus b» MUSBAT son beradigan 3 ta tenglamani belgilang.",
    'Отметь 3 уравнения, где «минус b» даёт положительное число.',
    'Mark the 3 equations where «minus b» gives a positive number.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Uchtasida b manfiy: minus yetti, minus bir va minus to'rt. Minus b esa ularning teskarisi — arti yetti, arti bir, arti to'rt.",
    'Верно. В трёх b отрицательно: минус семь, минус один и минус четыре. А минус b — их противоположные: плюс семь, плюс один, плюс четыре.',
    'Correct. In three of them b is negative: minus seven, minus one and minus four. Minus b is their opposite — plus seven, plus one, plus four.'),
  wrongs: [
    { when: (s) => s.miss.indexOf('i3') !== -1, text: L(
      "Minus x li karta chetlab o'tildi. Koeffitsiyent ko'rinmaydi, lekin u bor: minus x degani minus bir karra x, ya'ni b minus birga teng. Demak minus b arti bir — musbat son.",
      'Карточка с минус x осталась в стороне. Коэффициент не виден, но он есть: минус x это минус один на x, значит b равно минус одному. Тогда минус b это плюс один — положительное число.',
      'The card with minus x was left out. The coefficient is invisible but present: minus x is minus one times x, so b is minus one. Then minus b is plus one — a positive number.') },
    { when: (s) => s.miss.indexOf('i5') !== -1, text: L(
      "Bosh koeffitsiyenti manfiy bo'lgan karta chetlab o'tildi. Savol faqat b haqida: yozuvda minus to'rt x turadi, demak b minus to'rt va minus b arti to'rt.",
      'Карточка с отрицательным старшим коэффициентом осталась в стороне. Вопрос только про b: в записи стоит минус четыре x, значит b минус четыре, а минус b плюс четыре.',
      'The card with a negative leading coefficient was left out. The question is only about b: the record shows minus four x, so b is minus four and minus b is plus four.') },
    { when: (s) => s.extra.indexOf('i2') !== -1 || s.extra.indexOf('i4') !== -1 || s.extra.indexOf('i6') !== -1, text: L(
      "Belgilangan kartalardan birida b MUSBAT. Arti uch x, arti sakkiz x yoki arti olti x degan yozuvda b musbat, demak minus b manfiy bo'ladi — masalan minus uch. Savol esa minus b musbat chiqadigan tenglamalarni so'radi.",
      'На одной из отмеченных карточек b ПОЛОЖИТЕЛЬНО. В записи плюс три x, плюс восемь x или плюс шесть x коэффициент b положителен, значит минус b отрицательно — например минус три. А вопрос был про уравнения, где минус b положительно.',
      'One of the marked cards has a POSITIVE b. In plus three x, plus eight x or plus six x the coefficient b is positive, so minus b is negative — minus three, for instance. The question asked for equations where minus b is positive.') },
    { when: (s) => s.marked.length !== 3, text: L(
      "Aynan uchta tenglama kerak. Har birida x ning oldidagi belgiga qarang: minus bo'lsa minus b musbat chiqadi, arti bo'lsa manfiy.",
      'Нужно ровно три уравнения. В каждом смотри на знак перед иксом: минус — и минус b выйдет положительным, плюс — отрицательным.',
      'Exactly three equations are needed. Look at the sign in front of x in each: a minus makes minus b positive, a plus makes it negative.') },
  ],
  wrongText: L(
    "b ni ISHORASI bilan o'qing, keyin uning teskarisini oling. Bosh koeffitsiyentning minusi b ga o'tmaydi, ko'rinmagan koeffitsiyent esa birga teng.",
    'Читай b вместе со знаком, потом возьми противоположное. Минус старшего коэффициента на b не переходит, а невидимый коэффициент равен единице.',
    'Read b with its sign, then take the opposite. The minus of the leading coefficient does not carry over, and an invisible coefficient equals one.'),
};

export default function D17_01(props) { return <MarkAll data={DATA} {...props} />; }
