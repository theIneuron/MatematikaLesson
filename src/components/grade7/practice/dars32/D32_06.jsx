// Dars32 · Amaliyot 06 — Bir xil maxrajda qo'shish · 🟡 · build · tag: frac_add_same
// Mexanika: kit.jsx -> BuildLine. Raskladka: 6-o'rin `build`.
// MAVZU TO'LDIRILDI (metodist qarori 2026-08-22): darsning mavzusi «qisqartirish VA
// umumiy maxraj», shuning uchun 4, 6, 7 va 10-topshiriqlar umumiy maxrajga bag'ishlandi.
// Maxraj `:` bilan yoziladi -- sinf amaliyotidagi yozuv.
// a : 7 + 3a : 7 = 4a : 7. Maxraj o'zgarmaydi, suratlar qo'shiladi.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'frac_add_same',
  level: '🟡',
  eyebrow: L(
    'Bir xil maxraj',
    'Одинаковый знаменатель',
    'Same denominator'),
  setup: L(
    "Maxrajlar bir xil bo'lsa, faqat suratlar qo'shiladi. Maxraj o'zgarmaydi -- u bo'linadigan bo'laklar sonini bildiradi.",
    'Если знаменатели одинаковые, складываются только числители. Знаменатель не меняется — он говорит, на сколько частей делим.',
    'With equal denominators only the numerators add. The denominator stays: it says into how many parts we split.'),
  given: [['a : 7', '+', '3a : 7']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [{ id: 'a', label: '4a : 7' }, { id: 'b', label: '4a : 14' }, { id: 'c', label: '3a : 7' }],
  answerSeq: ['a'],
  fieldH: 44,
  ask: L(
    "Kartani bosish uni chiziqqa qo'yadi.",
    'Нажатие на карточку ставит её в строку.',
    'Tapping a card puts it in the line.'),
  empty: L(
    'Kartalarni bosib javobni tuzing',
    'Нажимай карточки и собери ответ',
    'Tap the cards to build the answer'),
  bank: L(
    'Kartalar',
    'Карточки',
    'Cards'),
  correctText: L(
    "To'g'ri. a + 3a = 4a, maxraj esa 7 bo'lib qoladi.",
    'Верно. a + 3a = 4a, а знаменатель остаётся 7.',
    'Correct. a + 3a = 4a, and the denominator stays 7.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('b') !== -1,
      text: L(
        "Maxrajlar qo'shilgan: 7 + 7 = 14. Bir xil maxrajda u O'ZGARMAYDI.",
        'Сложили знаменатели: 7 + 7 = 14. При одинаковом знаменателе он НЕ меняется.',
        'The denominators were added: 7 + 7 = 14. With equal denominators it stays.'),
    },
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        "3a bu ikkinchi qo'shiluvchi. Birinchisi ham qo'shiladi: a + 3a = 4a.",
        '3a это второе слагаемое. Первое тоже участвует: a + 3a = 4a.',
        '3a is the second term. The first joins in: a + 3a = 4a.'),
    },
    {
      when: (s) => s.seq.length < 1,
      text: L(
        'Bitta karta kerak.',
        'Нужна одна карточка.',
        'One card is needed.'),
    },
  ],
  wrongText: L(
    "Suratlarni qo'shing, maxrajga tegmang.",
    'Сложи числители, знаменатель не трогай.',
    'Add the numerators and leave the denominator.'),
};

export default function D32_06(props) { return <BuildLine data={DATA} {...props} />; }
