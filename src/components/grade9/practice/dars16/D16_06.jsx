// Dars16 · Amaliyot 06 — Sonlar o'qi · 🟡 · teg: chegara-turini-notogri-kochirish
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> DomainAxis,
// `interval` rejimida.
//
// Sistema: x ≥ 1 va x < 7. Umumiy qism — birdan yettigacha, lekin
// chegaralar HAR XIL turda: bir yopiq (birinchi belgi qat'iy emas),
// yetti ochiq (ikkinchi belgi qat'iy). Aynan shu narsa `interval`
// rejimining borligining sababi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { DomainAxis } from '../asboblar9.jsx';

const DATA = {
  tag: 'chegara-turini-notogri-kochirish', level: '🟡',
  eyebrow: L('Sonlar o\'qi', 'Числовая ось', 'The number line'),
  setup: L(
    "Har bir tengsizlik alohida yechilgan. Endi ikkalasini bitta o'qqa qo'yib, umumiy qismini olish kerak.",
    'Каждое неравенство уже решено. Теперь надо нанести оба на одну ось и взять общую часть.',
    'Each inequality is already solved. Now both must go on one axis and the common part taken.'),
  ask: L(
    "Sistemaning javobini o'qda ko'rsating.",
    'Покажи на оси ответ системы.',
    'Show the answer of the system on the axis.'),
  givenLabel: L('Sistema', 'Система', 'System'),
  given: [['x ≥ 1'], ['x < 7']],
  mode: 'interval',
  axis: { from: -1, to: 9 },
  answer: { a: { at: 1, closed: true }, b: { at: 7, closed: false } },
  closedLabel: L('Bo\'yalgan', 'Закрашенная', 'Filled'),
  openLabel: L('Bo\'sh', 'Пустая', 'Hollow'),
  correctText: L(
    "To'g'ri: birdan yettigacha, chap chegara bo'yalgan, o'ng chegara bo'sh. Chegaraning turi u QAYSI tengsizlikdan kelganiga qarab belgilanadi: bir birinchi tengsizlikdan keldi, u qat'iy emas, demak bir javobga kiradi; yetti ikkinchisidan keldi, u qat'iy, demak yetti kirmaydi. Ikkala nuqtani bir xil qilib qo'yish eng ko'p uchraydigan xato — chegaralar bir-biridan mustaqil.",
    'Верно: от единицы до семи, левая граница закрашена, правая пустая. Тип границы определяется тем, из КАКОГО неравенства она пришла: единица пришла из первого, а он нестрогий, значит единица входит; семь пришла из второго, а он строгий, значит семь не входит. Сделать обе точки одинаковыми — самая частая ошибка: границы независимы друг от друга.',
    'Correct: from one to seven, the left boundary filled, the right hollow. The kind of a boundary is decided by WHICH inequality it came from: one came from the first, which is non-strict, so one is included; seven came from the second, which is strict, so seven is out. Making both points the same is the most common mistake — the boundaries are independent of each other.'),
  wrongs: [
    { when: (s) => s.atOk && s.a && s.b && s.a.closed === false && s.b.closed === false, text: L(
      "Ikkala nuqta ham bo'sh qo'yilgan. Birinchi belgi «katta YOKI TENG», ya'ni bir javobga kiradi va uning nuqtasi bo'yalgan bo'lishi kerak.",
      'Обе точки поставлены пустыми. Первый знак «больше ИЛИ РАВНО», то есть единица входит, и её точка должна быть закрашена.',
      'Both points were left hollow. The first sign is "greater than OR EQUAL", so one is included and its point must be filled.') },
    { when: (s) => s.atOk && s.a && s.b && s.a.closed === true && s.b.closed === true, text: L(
      "Ikkala nuqta ham bo'yalgan. Ikkinchi belgi qat'iy: iks yettidan KICHIK, teng bo'lishi mumkin emas — yettining nuqtasi bo'sh bo'lishi kerak.",
      'Обе точки закрашены. Второй знак строгий: икс МЕНЬШЕ семи, равным быть не может — точка семи должна быть пустой.',
      'Both points were filled. The second sign is strict: x is LESS than seven, it cannot be equal — the point at seven must be hollow.') },
    { when: (s) => s.atOk && !s.closedOk, text: L(
      "Chegaralarning turi almashib ketdi. Bir qat'iy EMAS tengsizlikdan keldi — bo'yalgan; yetti QAT'IY tengsizlikdan keldi — bo'sh.",
      'Типы границ перепутаны. Единица пришла из НЕстрогого неравенства — закрашена; семь пришла из СТРОГОГО — пустая.',
      'The boundary kinds got swapped. One came from the NON-strict inequality — filled; seven came from the STRICT one — hollow.') },
    { when: (s) => s.has(-1) || s.has(9), text: L(
      "Chegaralar tengsizliklardan olinadi, o'qning chetidan emas. Bittasi bir, ikkinchisi yetti.",
      'Границы берут из неравенств, а не с краёв оси. Одна — единица, другая — семь.',
      'Boundaries come from the inequalities, not from the ends of the axis. One is one, the other seven.') },
    { when: (s) => !s.atOk, text: L(
      "Ikkala yechimni o'qda ustma-ust qo'ying: birinchisi birdan o'ngga, ikkinchisi yettidan chapga. Ular ustma-ust tushgan qism javob bo'ladi, va uning chegaralari bir bilan yetti.",
      'Наложи два решения на оси: первое — правее единицы, второе — левее семи. Часть, где они наложились, и есть ответ, а её границы — единица и семь.',
      'Lay the two solutions over each other on the axis: the first right of one, the second left of seven. Where they overlap is the answer, and its boundaries are one and seven.') },
  ],
  wrongText: L(
    "Ikkala tengsizlikning chegaralarini o'qqa qo'ying va har birining turini O'Z tengsizligidan oling: qat'iy belgi bo'sh nuqta, qat'iy emas belgi bo'yalgan nuqta beradi.",
    'Нанеси границы обоих неравенств на ось и тип каждой возьми из ЕГО неравенства: строгий знак даёт пустую точку, нестрогий — закрашенную.',
    'Put the boundaries of both inequalities on the axis and take each kind from ITS OWN inequality: a strict sign gives a hollow point, a non-strict one a filled point.'),
};

export default function D16_06(props) { return <DomainAxis data={DATA} {...props} />; }
