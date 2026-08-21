// Dars21 · Amaliyot 02 — Nechta ko'paytma · 🟢 · choice · tag: how_many_products
// Faqat MA'LUMOT. Mexanika: kit.jsx -> Choice. Raskladka: 2-o'rin (isinish).
//
// (a + 3)(a + 7) da to'rt ko'paytma bo'ladi: 2 · 2 = 4. Har had ikkinchi
// qavsning har hadiga ko'paytiriladi.
// Xato variantlar: 2 (faqat mos hadlarni ko'paytirgan), 3 (o'xshashlarni
// ixchamlagandan keyingi hadlar sonini aytgan).
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'how_many_products', level: '🟢', optCols: 3,
  eyebrow: L("Nechta ko'paytma", 'Сколько произведений', 'How many products'),
  setup: L(
    "Birinchi qavsning har hadi ikkinchi qavsning har hadiga ko'paytiriladi. Ko'paytmalar soni hadlar sonining ko'paytmasiga teng.",
    'Каждый член первой скобки умножается на каждый член второй. Число произведений равно произведению числа членов.',
    'Every term of the first bracket multiplies every term of the second. The number of products is the product of the counts.'),
  expr: ['(a', '+', '3)', '(a', '+', '7)'], exprSize: 30,
  ask: L("Ochilganda nechta ko'paytma hosil bo'ladi?", 'Сколько произведений получится при раскрытии?', 'How many products appear when it is opened?'),
  opts: [
    { label: L("To'rtta", 'Четыре', 'Four') },
    { label: L('Ikkita', 'Два', 'Two') },
    { label: L('Uchta', 'Три', 'Three') },
  ],
  correct: 0,
  correctText: L(
    "To'g'ri. 2 · 2 = 4: a · a, a · 7, 3 · a, 3 · 7. Keyin o'xshashlar ixchamlanib uch had qoladi.",
    'Верно. 2 · 2 = 4: a · a, a · 7, 3 · a, 3 · 7. Потом подобные приводятся и остаётся три члена.',
    'Correct. 2 · 2 = 4: a · a, a · 7, 3 · a, 3 · 7. Then like terms collect and three terms remain.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Ikkita bo'lsa, faqat a · a va 3 · 7 hisoblangan bo'lardi. Lekin a ni 7 ga va 3 ni a ga ham ko'paytirish kerak.",
      'Два было бы, если посчитать только a · a и 3 · 7. Но a надо умножить и на 7, а 3 — на a.',
      'Two would mean only a · a and 3 · 7. But a must also meet 7, and 3 must meet a.') },
    { when: (s) => s.picked === 2, text: L(
      "Uchta -- bu ixchamlashdan KEYINGI hadlar soni. So'ralgan narsa esa ko'paytmalar soni: to'rtta.",
      'Три — это число членов ПОСЛЕ приведения. А спрашивали число произведений: их четыре.',
      'Three is the number of terms AFTER collecting. The question is about products: there are four.') },
  ],
  wrongText: L(
    "Birinchi qavsda nechta had, ikkinchisida nechta? Ko'paytiring.",
    'Сколько членов в первой скобке и сколько во второй? Перемножь.',
    'How many terms in the first bracket and how many in the second? Multiply.'),
};

export default function D21_02(props) { return <Choice data={DATA} {...props} />; }
