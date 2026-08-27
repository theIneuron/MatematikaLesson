// Dars05 · Amaliyot 07 — Uchta qavs · 🔴 · tag: three_brackets
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SlotsBank.
//
// (4x − 9) − (x − 3) − (2x + 1). Ikkinchi va uchinchi qavs oldida minus.
//   ochilgan holda: 4x − 9 − x + 3 − 2x − 1
//   harfli hadlar:  4x − x − 2x = x
//   sonlar:         −9 + 3 − 1 = −7
//   javob:          x − 7
// Kartalar orasida 7x (hamma koeffitsiyentni qo'shgan), 3x (uchinchi qavsni
// ayirmagan), −13 (uchta sonni ham ayirgan) va −5 (uchinchi sonni qo'shgan).
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'three_brackets', level: '🔴',
  eyebrow: L('Uchta qavs', 'Три скобки', 'Three brackets'),
  setup: L(
    "Ikkita qavs oldida minus turadi. Har birining ichidagi hamma had ishorasini o'zgartiradi, keyin o'xshashlar yig'iladi.",
    'Перед двумя скобками стоит минус. Все слагаемые внутри каждой из них меняют знак, потом собираются подобные.',
    'Two of the brackets have a minus before them. Every term inside each of those flips its sign, then like terms are collected.'),
  rows: [
    [{ t: ['(', '4x', '−', '9', ')', '−', '(', 'x', '−', '3', ')', '−', '(', '2x', '+', '1', ')'] }],
    [{ t: ['='] }, { slot: 0 }, { slot: 1 }],
  ],
  cards: ['x', '7x', '3x', '−7', '−13', '−5'],
  answer: ['x', '−7'],
  ask: L("Kartani bosing, keyin bo'sh katakni bosing.", 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Harfli hadlar: 4x − x − 2x = x. Sonlar: −9 + 3 − 1 = −7. Javob x − 7.",
    'Верно. Буквенные: 4x − x − 2x = x. Числа: −9 + 3 − 1 = −7. Ответ x − 7.',
    'Correct. Letter terms: 4x − x − 2x = x. Numbers: −9 + 3 − 1 = −7. The answer is x − 7.'),
  wrongs: [
    { when: (s) => s.slots[0] === '7x', text: L(
      "Koeffitsiyentlar qo'shilib ketdi. Ikkinchi va uchinchi qavs AYIRILADI: 4x − x − 2x = x.",
      'Коэффициенты сложились. Вторая и третья скобки ВЫЧИТАЮТСЯ: 4x − x − 2x = x.',
      'The coefficients got added up. The second and third brackets are SUBTRACTED: 4x − x − 2x = x.') },
    { when: (s) => s.slots[0] === '3x', text: L(
      "Uchinchi qavs ham ayiriladi: 4x − x = 3x, keyin yana 2x ayiriladi va x qoladi.",
      'Третья скобка тоже вычитается: 4x − x = 3x, потом вычитается ещё 2x и остаётся x.',
      'The third bracket is subtracted too: 4x − x = 3x, then another 2x is taken away leaving x.') },
    { when: (s) => s.slots[1] === '−13', text: L(
      "Ikkinchi qavsda −3 turgan edi: minus uni +3 ga aylantirdi. −9 + 3 − 1 = −7.",
      'Во второй скобке было −3: минус превратил его в +3. −9 + 3 − 1 = −7.',
      'The second bracket had −3: the minus turned it into +3. −9 + 3 − 1 = −7.') },
    { when: (s) => s.slots[1] === '−5', text: L(
      "Uchinchi qavsda +1 turgan edi, minus uni −1 ga aylantirdi: −9 + 3 − 1 = −7.",
      'В третьей скобке было +1, минус превратил его в −1: −9 + 3 − 1 = −7.',
      'The third bracket had +1 and the minus turned it into −1: −9 + 3 − 1 = −7.') },
  ],
  wrongText: L(
    "Uchta qavsni ochib to'liq yozib ko'ring: 4x − 9 − x + 3 − 2x − 1. Keyin harflilarni va sonlarni alohida yig'ing.",
    'Выпиши все три скобки раскрытыми: 4x − 9 − x + 3 − 2x − 1. Потом собери отдельно буквенные и отдельно числа.',
    'Write all three brackets out: 4x − 9 − x + 3 − 2x − 1. Then collect the letter terms and the numbers separately.'),
};

export default function D05_07(props) { return <SlotsBank data={DATA} {...props} />; }
