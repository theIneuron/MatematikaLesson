// Dars15 · Amaliyot 06 — Standart ko'rinish · 🟡 · tag: standard_form
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> BuildLine (answerSeq).
//
// 4a · 3ab. Standart ko'rinishga keltirish:
//   koeffitsiyentlar: 4 · 3 = 12
//   a lar: a · a = a²
//   b: bir marta, o'zgarmaydi
//   javob: 12a²b
// Kartalar orasida 7 (koeffitsiyentlarni qo'shgan) va a (ko'rsatkichlarni
// qo'shmagan) turadi -- ular ISHLATILMAYDI.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const CARDS = [
  { id: 'c12', label: '12' },
  { id: 'a2', label: 'a²' },
  { id: 'b', label: 'b' },
  { id: 'c7', label: '7' },
  { id: 'a1', label: 'a' },
];

const DATA = {
  tag: 'standard_form', level: '🟡',
  answerSeq: ['c12', 'a2', 'b'],
  cards: CARDS,
  eyebrow: L('Standart ko\'rinish', 'Стандартный вид', 'The standard form'),
  setup: L(
    "Standart ko'rinishda avval koeffitsiyent, keyin harflar yoziladi. 4a · 3ab ko'paytmasini shunday yozish kerak.",
    'В стандартном виде сначала пишут коэффициент, потом буквы. Произведение 4a · 3ab надо записать именно так.',
    'In the standard form the coefficient comes first, then the letters. The product 4a · 3ab must be written that way.'),
  empty: L("Kerakli kartalarni bosib yozuv yig'ing", 'Собери запись, нажимая нужные карточки', 'Build the record by tapping the cards you need'),
  ask: L("Ko'paytmaning standart ko'rinishini yig'ing. Hamma karta kerak emas.",
    'Собери стандартный вид произведения. Нужны не все карточки.',
    'Build the standard form of the product. Not every card is needed.'),
  undo: L('Bitta orqaga', 'Шаг назад', 'One back'),
  valueLabel: L('Qiymat:', 'Значение:', 'Value:'),
  correctText: L(
    "To'g'ri. 4 · 3 = 12, a · a = a², b esa bir marta uchraydi: 12a²b.",
    'Верно. 4 · 3 = 12, a · a = a², а b встречается один раз: 12a²b.',
    'Correct. 4 · 3 = 12, a · a = a², and b appears once: 12a²b.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c7') !== -1, text: L(
      "7 bu 4 + 3. Koeffitsiyentlar ko'paytiriladi: 4 · 3 = 12.",
      '7 это 4 + 3. Коэффициенты перемножаются: 4 · 3 = 12.',
      '7 is 4 + 3. The coefficients multiply: 4 · 3 = 12.') },
    { when: (s) => s.seq.indexOf('a1') !== -1, text: L(
      "a ikki marta uchraydi: 4a da bitta va 3ab da bitta. Ularning ko'rsatkichlari qo'shiladi: a².",
      'Буква a встречается дважды: одна в 4a и одна в 3ab. Их показатели складываются: a².',
      'The letter a appears twice: once in 4a and once in 3ab. Their exponents add: a².') },
    { when: (s) => s.seq.indexOf('b') === -1, text: L(
      "b ni tashlab ketmang: u 3ab da turgan va yo'qolmaydi.",
      'Не теряй b: она есть в 3ab и никуда не исчезает.',
      'Do not drop the b: it is in 3ab and does not vanish.') },
    { when: (s) => s.seq[0] !== 'c12', text: L(
      "Standart ko'rinishda koeffitsiyent BIRINCHI turadi, keyin harflar.",
      'В стандартном виде коэффициент стоит ПЕРВЫМ, потом буквы.',
      'In the standard form the coefficient comes FIRST, then the letters.') },
  ],
  wrongText: L(
    "Koeffitsiyentlarni ko'paytiring, bir xil harflarning ko'rsatkichlarini qo'shing va tartib bilan yozing.",
    'Перемножь коэффициенты, сложи показатели одинаковых букв и запиши по порядку.',
    'Multiply the coefficients, add the exponents of the same letters and write them in order.'),
};

export default function D15_06(props) { return <BuildLine data={DATA} {...props} />; }
