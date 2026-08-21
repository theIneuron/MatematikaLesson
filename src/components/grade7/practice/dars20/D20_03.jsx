// Dars20 · Amaliyot 03 — Ikki ko'paytma tartib bilan · 🟢 · order · tag: mul_order
// Faqat MA'LUMOT. Mexanika: kit.jsx -> BuildLine (tartib muhim). Raskladka: 3-o'rin.
//
// 6y(y − 3) = 6y² − 18y. Tartib qavsdagi hadlar tartibiga mos keladi:
// avval 6y · y, keyin 6y · (−3).
// Ortiqcha kartalar: +18y (ishora), 6y (harfni ko'paytirmagan).
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'mul_order', level: '🟢',
  eyebrow: L('Ikki ko\'paytma', 'Два произведения', 'Two products'),
  setup: L(
    "Qavsdagi hadlar tartibi javobda ham saqlanadi: avval birinchi ko'paytma, keyin ikkinchisi. Ikkinchi hadning minusi javobga ko'chadi.",
    'Порядок членов скобки сохраняется и в ответе: сначала первое произведение, потом второе. Минус второго члена переходит в ответ.',
    'The order of the bracket carries into the answer: the first product, then the second. The minus of the second term moves along.'),
  expr: ['6y', '(y', '−', '3)'], exprSize: 34,
  cards: [
    { id: 'y2', label: '6y²' },
    { id: 'm18', label: '−18y' },
    { id: 'p18', label: '+18y' },
    { id: 'y1', label: '6y' },
    { id: 'm3', label: '−3y' },
  ],
  answerSeq: ['y2', 'm18'],
  empty: L("Ikki ko'paytmani tartib bilan qo'ying", 'Поставь два произведения по порядку', 'Place the two products in order'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 6y · y = 6y², keyin 6y · 3 = 18y va oldida minus qoladi.",
    'Верно. 6y · y = 6y², потом 6y · 3 = 18y, и перед ним остаётся минус.',
    'Correct. 6y · y = 6y², then 6y · 3 = 18y with the minus in front.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('p18') !== -1, text: L(
      "Ishora yo'qoldi: qavsda −3 turgan, ya'ni ko'paytma ham manfiy bo'ladi.",
      'Потерялся знак: в скобке стоит −3, значит и произведение отрицательное.',
      'The sign got lost: the bracket has −3, so the product is negative too.') },
    { when: (s) => s.seq.indexOf('y1') !== -1, text: L(
      "6y bu ko'paytma emas, qavs oldidagi hadning o'zi. 6y · y = 6y² bo'ladi.",
      '6y это не произведение, а сам одночлен перед скобкой. 6y · y = 6y².',
      '6y is not a product but the monomial itself. 6y · y = 6y².') },
    { when: (s) => s.seq.indexOf('m3') !== -1, text: L(
      "−3y da koeffitsiyent ko'paytirilmagan: 6 · 3 = 18, ya'ni −18y.",
      'В −3y не умножен коэффициент: 6 · 3 = 18, значит −18y.',
      'In −3y the coefficient was not multiplied: 6 · 3 = 18, so −18y.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Javobda ikki ko'paytma bo'ladi: qavsda ikki had turibdi.",
      'В ответе два произведения: в скобке два члена.',
      'The answer has two products: the bracket holds two terms.') },
  ],
  wrongText: L(
    "Har hadni alohida ko'paytiring va ishorasini saqlang: 6y · y, keyin 6y · (−3).",
    'Умножь каждый член по отдельности, сохраняя знак: 6y · y, потом 6y · (−3).',
    'Multiply each term separately and keep the sign: 6y · y, then 6y · (−3).'),
};

export default function D20_03(props) { return <BuildLine data={DATA} {...props} />; }
