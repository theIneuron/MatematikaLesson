// Dars14 · Amaliyot 04 — Sonlar o'qi · 🟡 · teg: urinish-notogri-oqish
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> DomainAxis,
// `point` rejimida.
//
// MATEMATIKA: x² − 12x + 36 = (x − 6)². Kvadrat manfiy bo'lmaydi, shuning
// uchun «kichik yoki teng nol» faqat NOL bo'lgan joyda bajariladi: x = 6.
// Javob — bitta nuqta, va u BO'YALGAN, chunki belgi qat'iy emas.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { DomainAxis } from '../asboblar9.jsx';

const DATA = {
  tag: 'urinish-notogri-oqish', level: '🟡',
  eyebrow: L('Sonlar o\'qi', 'Числовая ось', 'The number line'),
  setup: L(
    "Chap tomonni to'liq kvadrat ko'rinishiga keltiring. Kvadrat esa hech qachon manfiy bo'lmaydi.",
    'Приведи левую часть к виду полного квадрата. А квадрат никогда не бывает отрицательным.',
    'Bring the left side to a perfect square. And a square is never negative.'),
  ask: L(
    "Tengsizlikning javobini o'qda ko'rsating.",
    'Покажи на оси ответ неравенства.',
    'Show the answer of the inequality on the axis.'),
  givenLabel: L('Tengsizlik', 'Неравенство', 'Inequality'),
  given: [['x² − 12x + 36 ≤ 0']],
  mode: 'point',
  axis: { from: 0, to: 12 },
  answer: { at: 6, closed: true },
  closedLabel: L('Bo\'yalgan', 'Закрашенная', 'Filled'),
  openLabel: L('Bo\'sh', 'Пустая', 'Hollow'),
  correctText: L(
    "To'g'ri. Chap tomon iks minus olti butunning kvadrati. Kvadrat manfiy bo'lmaydi, demak «kichik» qismi hech qachon bajarilmaydi va faqat «teng» qismi qoladi: iks minus olti nolga teng, ya'ni iks olti. Javob — YAGONA son, oraliq emas. Nuqta bo'yalgan: belgi qat'iy emas, shuning uchun nol qiymat javobga kiradi. Agar belgi qat'iy bo'lganda, javob umuman bo'lmasdi.",
    'Верно. Левая часть — это икс минус шесть в квадрате. Квадрат не бывает отрицательным, значит часть «меньше» не выполняется никогда и остаётся только часть «равно»: икс минус шесть равно нулю, то есть икс равен шести. Ответ — ЕДИНСТВЕННОЕ число, а не промежуток. Точка закрашена: знак нестрогий, поэтому нулевое значение входит в ответ. Будь знак строгим, ответа не было бы вовсе.',
    'Correct. The left side is x minus six, squared. A square is never negative, so the "less than" part never holds and only the "equals" part is left: x minus six equals zero, that is x is six. The answer is a SINGLE number, not an interval. The point is filled: the sign is non-strict, so the zero value belongs to the answer. Had the sign been strict, there would be no answer at all.'),
  wrongs: [
    { when: (s) => s.atOk && !s.closedOk, text: L(
      "Chegara turi noto'g'ri. Belgi «kichik YOKI TENG», ya'ni nol qiymat ham javobga kiradi — nuqta bo'yalgan bo'lishi kerak. Bo'sh nuqta qat'iy belgiga tegishli, va qat'iy belgida bu tengsizlikning javobi umuman bo'lmasdi.",
      'Тип границы неверен. Знак «меньше ИЛИ РАВНО», то есть нулевое значение тоже входит в ответ — точка должна быть закрашена. Пустая точка относится к строгому знаку, а при строгом знаке у этого неравенства ответа не было бы вовсе.',
      'The boundary type is wrong. The sign is "less than OR EQUAL", so the zero value belongs to the answer too — the point must be filled. A hollow point belongs to a strict sign, and with a strict sign this inequality would have no answer at all.') },
    { when: (s) => s.at === 12, text: L(
      "O'n ikki — bu iksning oldidagi koeffitsient, ildiz emas. To'liq kvadratni yozib ko'ring: iks minus olti butunning kvadrati.",
      'Двенадцать — это коэффициент перед иксом, а не корень. Выпиши полный квадрат: икс минус шесть в квадрате.',
      'Twelve is the coefficient in front of x, not a root. Write out the perfect square: x minus six, squared.') },
    { when: (s) => s.at === 0, text: L(
      "Nolda chap tomon o'ttiz oltiga teng, ya'ni musbat — tengsizlik bajarilmaydi. Ildizni izlash kerak: to'liq kvadratning ichi nol bo'lgan joyni.",
      'В нуле левая часть равна тридцати шести, то есть положительна — неравенство не выполняется. Нужно искать корень: место, где внутри полного квадрата нуль.',
      'At zero the left side is thirty-six, positive — the inequality fails. What is needed is the root: the place where the inside of the perfect square is zero.') },
    { when: (s) => s.at === 3 || s.at === 9, text: L(
      "Bu sonni tengsizlikka qo'yib ko'ring: chap tomon musbat chiqadi. Kvadrat faqat bitta joyda nolga aylanadi, va boshqa hamma joyda musbat.",
      'Подставь это число в неравенство: левая часть выйдет положительной. Квадрат обращается в нуль лишь в одном месте, а во всех остальных положителен.',
      'Substitute that number into the inequality: the left side comes out positive. A square becomes zero in only one place and is positive everywhere else.') },
    { when: (s) => !s.atOk, text: L(
      "Chap tomonni to'liq kvadrat ko'rinishida yozing va uning ichi nol bo'lgan iksni toping.",
      'Запиши левую часть как полный квадрат и найди икс, при котором его внутренняя часть равна нулю.',
      'Write the left side as a perfect square and find the x that makes its inside zero.') },
  ],
  wrongText: L(
    "Iks kvadrat minus o'n ikki iks qo'shuv o'ttiz olti — bu iks minus olti butunning kvadrati. Kvadrat manfiy bo'lmasa, tengsizlik qachon bajariladi?",
    'Икс в квадрате минус двенадцать икс плюс тридцать шесть — это икс минус шесть в квадрате. Если квадрат не бывает отрицательным, когда выполняется неравенство?',
    'x squared minus twelve x plus thirty-six is x minus six, squared. If a square is never negative, when does the inequality hold?'),
};

export default function D14_04(props) { return <DomainAxis data={DATA} {...props} />; }
