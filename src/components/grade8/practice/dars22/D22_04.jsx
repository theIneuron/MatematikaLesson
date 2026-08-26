// Dars22 · Amaliyot 04 — Pazl · 🟡 · tag: t_to_x_count
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §4 (22-dars, 4-pozitsiya)
//
// UCH T — UCH XIL NATIJA. 02-topshiriqda savol «topiladimi» edi, bu yerda
// esa «nechta»: musbat t dan ikkita x, noldan bitta, manfiydan hech biri.
// Ya'ni З40 (plyus-minus) va З48 (manfiy t) bir juftlikda turadi.
//
// Uch t bir-biriga ataylab o'xshatilgan: o'n olti, nol, minus o'n olti —
// bir xil son, farqi ishorada. Kartalarda yozuv bo'shliqsiz (skelet §0a.3).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 't_to_x_count', level: '🟡',
  faceSize: 13, faceSizePhone: 11,
  cards: [
    { id: 'f1', side: 0, tokens: ['t=16'] },
    { id: 'f2', side: 0, tokens: ['t=0'] },
    { id: 'f3', side: 0, tokens: ['t=−16'] },
    { id: 'v1', side: 1, v: '2' },
    { id: 'v2', side: 1, v: '1' },
    { id: 'v3', side: 1, v: '0' },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "Uch bikvadrat tenglamada belgilash qilindi va t topildi. Har t dan nechta x chiqishini aniqlash kerak: x kvadrat t ga teng.",
    'В трёх биквадратных уравнениях сделана замена и найдено t. Надо определить, сколько x выходит из каждого t: x в квадрате равен t.',
    'In three biquadratic equations the substitution was made and t was found. It remains to say how many values of x each t yields: x squared equals t.'),
  ask: L(
    't ni bosing, keyin uyani bosing.',
    'Нажми t, потом ячейку.',
    'Tap a t, then a slot.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Musbat t da ikki x bor: kvadrati o'n oltiga teng ikki son — to'rt va minus to'rt. Nolda bitta: plyus va minus bir joyga tushadi. Manfiy t da esa hech biri — kvadrat manfiy bo'lmaydi.",
    'Верно. При положительном t есть два x: два числа с квадратом шестнадцать — четыре и минус четыре. При нуле один: плюс и минус сходятся в одну точку. А при отрицательном ни одного — квадрат отрицательным не бывает.',
    'Correct. A positive t gives two values of x: the two numbers squaring to sixteen — four and minus four. Zero gives one: plus and minus collapse into one point. A negative gives none — a square is never negative.'),
  wrongs: [
    { when: (s) => s.mate.f3 !== 'v3', text: L(
      "Bu t manfiy, ya'ni undan haqiqiy x umuman chiqmaydi. x kvadrat minus o'n oltiga teng degan tenglikni bajaradigan son yo'q: har qanday sonning kvadrati noldan kichik emas. Minus to'rtni qo'yib ko'ring — o'n olti chiqadi, minus o'n olti emas.",
      'Это t отрицательно, значит действительного x из него не выходит вовсе. Нет числа, обращающего в верное равенство x квадрат равно минус шестнадцати: квадрат любого числа не меньше нуля. Подставь минус четыре — выйдет шестнадцать, а не минус шестнадцать.',
      'This t is negative, so no real x comes from it at all. No number satisfies x squared equals minus sixteen: the square of any number is at least zero. Substitute minus four — you get sixteen, not minus sixteen.') },
    { when: (s) => s.mate.f2 !== 'v2', text: L(
      "Nolda ildiz BITTA. Musbat t da ikkita chiqadi, chunki plyus va minus bir-biridan farq qiladi; nolda esa ular ustma-ust tushadi — plyus nol bilan minus nol bir xil son. Ildizi umuman yo'q ham emas: nolning kvadrati nol, ya'ni tenglik bajariladi.",
      'При нуле корень ОДИН. При положительном t их два, потому что плюс и минус различаются; а при нуле они совпадают — плюс нуль и минус нуль это одно число. И не «нет вовсе»: квадрат нуля равен нулю, то есть равенство выполняется.',
      'At zero there is ONE root. For a positive t there are two, since plus and minus differ; at zero they coincide — plus zero and minus zero are the same number. And it is not «none» either: zero squared is zero, so the equality holds.') },
    { when: (s) => s.mate.f1 !== 'v1', text: L(
      "Bu t musbat, ya'ni undan IKKI x chiqadi. Kvadratga oshirish ishorani yo'qotadi: to'rtning kvadrati ham, minus to'rtning kvadrati ham o'n olti. Shuning uchun x kvadrat o'n oltiga teng bo'lsa, javob plyus-minus to'rt.",
      'Это t положительно, значит из него выходят ДВА x. Возведение в квадрат теряет знак: и квадрат четырёх, и квадрат минус четырёх равны шестнадцати. Поэтому если x квадрат равен шестнадцати, ответ плюс-минус четыре.',
      'This t is positive, so it yields TWO values of x. Squaring loses the sign: four squared and minus four squared are both sixteen. So if x squared is sixteen, the answer is plus or minus four.') },
  ],
  wrongText: L(
    "Har t bilan bir savol: kvadrati shu songa teng bo'lgan nechta son bor. Musbatda ikkita, nolda bitta, manfiyda esa yo'q.",
    'С каждым t один вопрос: сколько чисел, квадрат которых равен этому значению. У положительного два, у нуля одно, у отрицательного нет.',
    'One question for each t: how many numbers square to it. A positive has two, zero has one, a negative has none.'),
};

export default function D22_04(props) { return <PairSlots data={DATA} {...props} />; }
