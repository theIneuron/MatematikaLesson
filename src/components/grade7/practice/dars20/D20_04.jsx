// Dars20 · Amaliyot 04 — Uch hadli qavs · 🟡 · build · tag: mul_three_terms
// Faqat MA'LUMOT. Mexanika: kit.jsx -> BuildLine. Raskladka: 4-o'rin.
//
// 3m(2m² − 5m + 4) = 6m³ − 15m² + 12m. Uch had -> uch ko'paytma.
// Ortiqcha kartalar: +12 (uchinchi hadda harf qo'shilmagan), 6m² va −15m
// (ko'rsatkich bir kam).
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'mul_three_terms', level: '🟡',
  eyebrow: L('Uch had', 'Три члена', 'Three terms'),
  setup: L(
    "Qavsda uch had bor, ya'ni uch ko'paytma chiqadi. Har ko'paytmada harf ham ko'paytiriladi: ko'rsatkichlar qo'shiladi.",
    'В скобке три члена, значит выйдет три произведения. В каждом умножается и буква: показатели складываются.',
    'The bracket has three terms, so three products come out. The letter is multiplied too: the exponents add.'),
  expr: ['3m', '(2m²', '−', '5m', '+', '4)'], exprSize: 28,
  cards: [
    { id: 'm3', label: '6m³' },
    { id: 'm2', label: '−15m²' },
    { id: 'm1', label: '+12m' },
    { id: 'c12', label: '+12' },
    { id: 'w2', label: '6m²' },
    { id: 'w1', label: '−15m' },
  ],
  answerSeq: ['m3', 'm2', 'm1'],
  empty: L("Kartalarni bosib javobni tuzing", 'Нажимай карточки и собери ответ', 'Tap the cards to build the answer'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 3m · 2m² = 6m³, 3m · 5m = 15m², 3m · 4 = 12m. Ikkinchi ko'paytmada minus qoladi.",
    'Верно. 3m · 2m² = 6m³, 3m · 5m = 15m², 3m · 4 = 12m. У второго произведения остаётся минус.',
    'Correct. 3m · 2m² = 6m³, 3m · 5m = 15m², 3m · 4 = 12m. The second product keeps the minus.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c12') !== -1, text: L(
      "+12 da harf yo'qolgan: 3m · 4 = 12m. Qavs oldidagi hadda m bor, u ham ko'paytmaga tushadi.",
      'В +12 потерялась буква: 3m · 4 = 12m. В одночлене перед скобкой есть m, она тоже попадает в произведение.',
      'The +12 lost its letter: 3m · 4 = 12m. The monomial in front has an m, which goes into the product.') },
    { when: (s) => s.seq.indexOf('w2') !== -1, text: L(
      "6m² da ko'rsatkich bir kam: m · m² = m³, chunki ko'rsatkichlar qo'shiladi (1 + 2).",
      'В 6m² показатель на один меньше: m · m² = m³, ведь показатели складываются (1 + 2).',
      'In 6m² the exponent is one short: m · m² = m³, since the exponents add (1 + 2).') },
    { when: (s) => s.seq.indexOf('w1') !== -1, text: L(
      "−15m da harf ko'paytirilmagan: m · m = m², ya'ni −15m².",
      'В −15m буква не умножена: m · m = m², значит −15m².',
      'In −15m the letter was not multiplied: m · m = m², so −15m².') },
    { when: (s) => s.seq.length < 3, text: L(
      "Qavsda uch had bor, javobda ham uch ko'paytma bo'lishi kerak.",
      'В скобке три члена, значит и в ответе три произведения.',
      'The bracket holds three terms, so the answer needs three products.') },
  ],
  wrongText: L(
    "Uch ko'paytmani alohida yozing va har birida ham sonni, ham harfni ko'paytiring.",
    'Запиши три произведения по отдельности и в каждом умножь и число, и букву.',
    'Write the three products separately and in each multiply both the number and the letter.'),
};

export default function D20_04(props) { return <BuildLine data={DATA} {...props} />; }
