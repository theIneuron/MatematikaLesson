// Dars04 · Amaliyot 10 — Pazl · 🔴 · tag: extra_factor
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Kontent: src/books/grade8/DARS04_AMALIYOT_KONTENT_V2.md §10
//
// Metodist qarori 2026-08-24: o'nta mexanika 1-darsdan olinadi. Skeletda bu
// o'ringa «yig'indi ↔ shart» juftligi rejalashtirilgan edi, lekin pazl
// kartasi telefonda 54px — ikki kasrning yig'indisi u yerga sig'maydi
// (o'lchov 2026-08-24). Shuning uchun savol keltirishning ICHIGA olindi:
// bu ham 4-darsning o'z ko'nikmasi va 08 dagi «umumiy maxrajni top» qadamini
// bevosita davom ettiradi.
//
// Uchala kasr BITTA umumiy maxrajga — f² − 4 ga keltirilyapti:
//   3/(f−2)   -> qo'shimcha ko'paytuvchi (f+2)
//   5/(f+2)   -> qo'shimcha ko'paytuvchi (f−2)
//   7/(f²−4)  -> allaqachon o'sha maxrajda, ko'paytuvchi 1
// Uchinchisi tuzoq: «har kasrga albatta biror qavs kerak» degan fikr shu
// yerda o'ladi. Ikkinchi tuzoq — ishora: (f+2) va (f−2) ni almashtirish.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'extra_factor', level: '🔴',
  given: [['f² − 4']],
  givenLabel: L('Umumiy maxraj:', 'Общий знаменатель:', 'Common denominator:'),
  cards: [
    { id: 'f1', tokens: [{ n: '3', d: 'f−2' }] },
    { id: 'f2', tokens: [{ n: '5', d: 'f+2' }] },
    { id: 'f3', tokens: [{ n: '7', d: 'f²−4' }] },
    { id: 'v1', v: 'f+2' },
    { id: 'v2', v: 'f−2' },
    { id: 'v3', v: '1' },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "Uchala kasr bitta umumiy maxrajga keltirilyapti. Har biriga o'z qo'shimcha ko'paytuvchisi kerak.",
    'Все три дроби приводят к одному общему знаменателю. Каждой нужен свой дополнительный множитель.',
    'All three fractions are brought to one common denominator. Each needs its own extra factor.'),
  ask: L(
    "Har kasrga qo'shimcha ko'paytuvchini toping: kartani bosing, keyin uyani bosing.",
    'Найди дополнительный множитель для каждой дроби: нажми карточку, потом ячейку.',
    'Find the extra factor for each fraction: tap a card, then a slot.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Umumiy maxraj f kvadrat minus to'rt — bu f minus ikki karra f qo'shuv ikki. Birinchi kasrning maxrajida f minus ikki bor, yetishmaydigani f qo'shuv ikki. Ikkinchisida teskarisi. Uchinchisining maxraji esa allaqachon o'sha ko'paytma, shuning uchun uni birga ko'paytiramiz, ya'ni tegmaymiz. Ko'paytuvchini topgach, SURATNI ham xuddi shunga ko'paytirish kerak.",
    'Верно. Общий знаменатель f в квадрате минус четыре — это f минус два на f плюс два. У первой дроби в знаменателе есть f минус два, не хватает f плюс два. У второй наоборот. А знаменатель третьей уже равен этому произведению, поэтому её умножают на единицу, то есть не трогают. Найдя множитель, на него же надо умножить и ЧИСЛИТЕЛЬ.',
    'Correct. The common denominator f squared minus four is f minus two times f plus two. The first fraction already has f minus two below, so f plus two is missing. The second is the other way round. The third already has that product, so it is multiplied by one, that is left alone. Once the factor is found, the NUMERATOR must be multiplied by it too.'),
  wrongs: [
    { when: (s) => s.mate.f1 === 'v2' || s.mate.f2 === 'v1', text: L(
      "Ko'paytuvchilar almashib ketdi: maxrajda TURGAN qavsni emas, YETISHMAYDIGANINI qo'yish kerak. f minus ikkiga f qo'shuv ikki yetishmaydi, f qo'shuv ikkiga esa f minus ikki.",
      'Множители перепутались: ставить надо не ту скобку, которая УЖЕ есть в знаменателе, а ту, которой НЕ ХВАТАЕТ. К f минус два не хватает f плюс два, а к f плюс два — f минус два.',
      'The factors got swapped: what goes in is not the bracket already in the denominator but the one that is MISSING. f minus two lacks f plus two, and f plus two lacks f minus two.') },
    { when: (s) => s.mate.f3 && s.mate.f3 !== 'v3', text: L(
      "Uchinchi kasrning maxraji allaqachon f kvadrat minus to'rt, ya'ni umumiy maxrajning o'zi. Unga hech narsa qo'shish kerak emas: ko'paytuvchi bir. Har kasrga albatta qavs kerak degan qoida yo'q.",
      'Знаменатель третьей дроби уже равен f в квадрате минус четыре, то есть самому общему знаменателю. Добавлять к нему нечего: множитель — единица. Правила «каждой дроби обязательно нужна скобка» не существует.',
      'The denominator of the third fraction is already f squared minus four, the common denominator itself. Nothing needs to be added: the factor is one. There is no rule that every fraction must get a bracket.') },
    { when: (s) => s.mate.f1 === 'v3' || s.mate.f2 === 'v3', text: L(
      "Ko'paytuvchi bir faqat maxraj allaqachon umumiy maxrajga teng bo'lganda bo'ladi. Bu kasrning maxrajida esa bitta qavs turibdi, ikkinchisi yetishmaydi.",
      'Множитель единица бывает только тогда, когда знаменатель уже равен общему. А в знаменателе этой дроби стоит одна скобка, второй не хватает.',
      'The factor is one only when the denominator already equals the common one. This fraction has just one bracket below; the second is missing.') },
  ],
  wrongText: L(
    "Umumiy maxrajni ko'paytuvchilarga ajrating: f minus ikki karra f qo'shuv ikki. Keyin har maxrajga qarab, unda NIMA YETISHMAYOTGANINI toping.",
    'Разложи общий знаменатель на множители: f минус два на f плюс два. Потом посмотри на каждый знаменатель и найди, чего в нём НЕ ХВАТАЕТ.',
    'Factor the common denominator: f minus two times f plus two. Then look at each denominator and find what is MISSING in it.'),
};

export default function D04_10(props) { return <PairSlots data={DATA} {...props} />; }
