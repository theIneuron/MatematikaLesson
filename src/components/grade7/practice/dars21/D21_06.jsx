// Dars21 · Amaliyot 06 — To'rt ko'paytma tartib bilan · 🟡 · order · tag: four_products
// Mexanika: kit.jsx -> BuildLine (tartib muhim). Raskladka: 6-o'rin.
// (2a + 3)(a + 4): 2a·a = 2a², 2a·4 = 8a, 3·a = 3a, 3·4 = 12.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'four_products', level: '🟡',
  eyebrow: L("To'rt ko'paytma", 'Четыре произведения', 'Four products'),
  setup: L(
    "Tartib qat'iy: birinchi hadni ikkinchi qavsning ikki hadiga, keyin ikkinchi hadni ham ikkitasiga. Shu tartibda hech biri tashlab ketilmaydi.",
    'Порядок строгий: первый член на оба члена второй скобки, потом второй член на оба. При таком порядке ничего не теряется.',
    'The order is strict: the first term against both terms of the second bracket, then the second term against both. Nothing gets lost this way.'),
  expr: ['(2a', '+', '3)', '(a', '+', '4)'], exprSize: 30,
  cards: [
    { id: 'a', label: '2a²' },
    { id: 'b', label: '+8a' },
    { id: 'c', label: '+3a' },
    { id: 'd', label: '+12' },
    { id: 'e', label: '+6a' },
    { id: 'f', label: '+7' },
  ],
  answerSeq: ['a', 'b', 'c', 'd'],
  empty: L("To'rt ko'paytmani tartib bilan qo'ying", 'Поставь четыре произведения по порядку', 'Place the four products in order'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 2a · a = 2a², 2a · 4 = 8a, 3 · a = 3a, 3 · 4 = 12. Ixchamlansa 2a² + 11a + 12.",
    'Верно. 2a · a = 2a², 2a · 4 = 8a, 3 · a = 3a, 3 · 4 = 12. После приведения 2a² + 11a + 12.',
    'Correct. 2a · a = 2a², 2a · 4 = 8a, 3 · a = 3a, 3 · 4 = 12. Collecting gives 2a² + 11a + 12.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('e') !== -1, text: L(
      "+6a chiqishi uchun 2 va 3 ko'paytirilgan. Bu ikki had bir xil qavsda turadi, ular bir-biriga ko'paytirilmaydi.",
      'Чтобы вышло +6a, перемножили 2 и 3. Эти два члена стоят в одной скобке, друг на друга они не умножаются.',
      'To get +6a the 2 and 3 were multiplied. Those two terms sit in the same bracket and never multiply each other.') },
    { when: (s) => s.seq.indexOf('f') !== -1, text: L(
      "+7 bu 3 + 4. Ozod hadlar ko'paytiriladi: 3 · 4 = 12.",
      '+7 это 3 + 4. Свободные члены перемножаются: 3 · 4 = 12.',
      '+7 is 3 + 4. The free terms are multiplied: 3 · 4 = 12.') },
    { when: (s) => s.seq.length === 4, text: L(
      "Ko'paytmalar to'g'ri, tartibi boshqa: avval 2a ning ikki ko'paytmasi, keyin 3 ning ikkitasi.",
      'Произведения верные, но порядок другой: сначала два произведения с 2a, потом два с 3.',
      'The products are right but the order is not: first the two with 2a, then the two with 3.') },
    { when: (s) => s.seq.length < 4, text: L(
      "To'rt ko'paytma bo'lishi kerak: 2 · 2 = 4. Bittasi qo'yilmadi.",
      'Должно быть четыре произведения: 2 · 2 = 4. Одно не поставил.',
      'There must be four products: 2 · 2 = 4. One is missing.') },
  ],
  wrongText: L(
    "Birinchi qavsning har hadini ikkinchisining har hadiga ko'paytiring, tartibni buzmang.",
    'Умножь каждый член первой скобки на каждый член второй, не нарушая порядка.',
    'Multiply each term of the first bracket by each of the second, keeping the order.'),
};

export default function D21_06(props) { return <BuildLine data={DATA} {...props} />; }
