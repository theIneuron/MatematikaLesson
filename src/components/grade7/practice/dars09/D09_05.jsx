// Dars09 · Amaliyot 05 — Qavs yarim ochilgan · 🟡 · tag: fix_half_bracket
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> BuildLine (answerSeq).
//
// Chet yechim: 2(x + 5) = 3x − 4 dan 2x + 5 = 3x − 4 chiqargan. Ko'paytuvchi
// faqat BIRINCHI hadga yetgan: 5 ham 2 ga ko'paytirilishi kerak edi.
// To'g'ri qator: 2x + 10 = 3x − 4.
// Hamma karta ishlatiladi, tekshiruv ketma-ketlik bo'yicha.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const CARDS = [
  { id: 'x2', label: '2x' },
  { id: 'plus', label: '+' },
  { id: 'n10', label: '10' },
  { id: 'eq', label: '=' },
  { id: 'x3', label: '3x' },
  { id: 'minus', label: '−' },
  { id: 'n4', label: '4' },
];

const DATA = {
  tag: 'fix_half_bracket', level: '🟡', useAll: true,
  answerSeq: ['x2', 'plus', 'n10', 'eq', 'x3', 'minus', 'n4'],
  cards: CARDS,
  eyebrow: L('Xatoni tuzatish', 'Исправь ошибку', 'Fix the mistake'),
  setup: L(
    "Boshqa o'quvchi 2(x + 5) = 3x − 4 dagi qavsni ochdi va shunday yozdi: 2x + 5 = 3x − 4. Bu qator xato.",
    'Другой ученик раскрыл скобку в 2(x + 5) = 3x − 4 и написал так: 2x + 5 = 3x − 4. Эта строка неверна.',
    'Another student opened the bracket in 2(x + 5) = 3x − 4 and wrote: 2x + 5 = 3x − 4. That line is wrong.'),
  empty: L("Kartalarni bosib qator yig'ing", 'Собери строку, нажимая карточки', 'Build the line by tapping cards'),
  ask: L("To'g'ri qatorni yig'ing. Kursorni ko'chirish uchun yozuvdagi belgini bosing.",
    'Собери верную строку. Чтобы передвинуть курсор, нажми знак в записи.',
    'Build the correct line. To move the cursor, tap a sign in the record.'),
  undo: L('Bitta orqaga', 'Шаг назад', 'One back'),
  valueLabel: L('Qiymat:', 'Значение:', 'Value:'),
  correctText: L(
    "To'g'ri. Ko'paytuvchi ikki hadga ham yetadi: 2 · x = 2x va 2 · 5 = 10. O'ng tomon esa o'zgarmaydi.",
    'Верно. Множитель доходит до обоих слагаемых: 2 · x = 2x и 2 · 5 = 10. А правая часть не меняется.',
    'Correct. The factor reaches both terms: 2 · x = 2x and 2 · 5 = 10. The right side does not change.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('eq') < s.seq.indexOf('n10'), text: L(
      "10 tenglik belgisidan OLDIN turadi: u chap tomondagi qavsdan chiqqan.",
      'Десятка стоит ПЕРЕД знаком равенства: она вышла из скобки в левой части.',
      'The ten goes BEFORE the equals sign: it came out of the bracket on the left.') },
    { when: (s) => s.seq.indexOf('x3') < s.seq.indexOf('eq'), text: L(
      "3x o'ng tomonda qolgan: uni ko'chirish bu topshiriqning ishi emas, faqat qavsni ochish kerak.",
      '3x осталось справа: переносить его в этом задании не нужно, надо только раскрыть скобку.',
      'The 3x stays on the right: moving it is not this task — only the bracket has to be opened.') },
    { when: (s) => s.seq[0] !== 'x2', text: L(
      "Qator 2x dan boshlanadi: bu qavs ichidagi birinchi hadning 2 ga ko'paytmasi.",
      'Строка начинается с 2x: это первое слагаемое скобки, умноженное на 2.',
      'The line starts with 2x: the first term of the bracket times 2.') },
  ],
  wrongText: L(
    "Qavs ichidagi HAR hadni 2 ga ko'paytiring, o'ng tomonni esa o'zgarishsiz ko'chiring.",
    'Умножь на 2 КАЖДОЕ слагаемое в скобке, а правую часть перепиши без изменений.',
    'Multiply EVERY term in the bracket by 2 and copy the right side unchanged.'),
};

export default function D09_05(props) { return <BuildLine data={DATA} {...props} />; }
