// Dars05 · Amaliyot 06 — Yarim yo'lda qolgan minus · 🟡 · tag: fix_half_flip
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> BuildLine (answerSeq).
//
// Chet yechim: 12 − (x − 4) = 12 − x − 4. Bu darsning ASOSIY xatosi: minus
// birinchi hadga yetgan, ikkinchisiga yetmagan.
// To'g'ri qator: 12 − x + 4.
// Harf borligi uchun qiymatni hisoblab bo'lmaydi -- tekshiruv KETMA-KETLIK
// bo'yicha ketadi.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const CARDS = [
  { id: 'n12', label: '12' },
  { id: 'minus', label: '−' },
  { id: 'x', label: 'x' },
  { id: 'plus', label: '+' },
  { id: 'n4', label: '4' },
];

const DATA = {
  tag: 'fix_half_flip', level: '🟡', useAll: true,
  answerSeq: ['n12', 'minus', 'x', 'plus', 'n4'],
  cards: CARDS,
  eyebrow: L('Xatoni tuzatish', 'Исправь ошибку', 'Fix the mistake'),
  setup: L(
    "Boshqa o'quvchi qavsni ochdi va shunday yozdi: 12 − (x − 4) = 12 − x − 4. Bu qator xato.",
    'Другой ученик раскрыл скобку и написал так: 12 − (x − 4) = 12 − x − 4. Эта строка неверна.',
    'Another student opened the bracket and wrote: 12 − (x − 4) = 12 − x − 4. That line is wrong.'),
  empty: L("Kartalarni bosib qator yig'ing", 'Собери строку, нажимая карточки', 'Build the line by tapping cards'),
  ask: L("To'g'ri qatorni yig'ing. Kursorni ko'chirish uchun yozuvdagi belgini bosing.",
    'Собери верную строку. Чтобы передвинуть курсор, нажми знак в записи.',
    'Build the correct line. To move the cursor, tap a sign in the record.'),
  undo: L('Bitta orqaga', 'Шаг назад', 'One back'),
  valueLabel: L('Qiymat:', 'Значение:', 'Value:'),
  correctText: L(
    "To'g'ri. Minus ikki hadga ham tegishli: x ayiriladi, −4 esa +4 ga aylanadi. 12 − x + 4.",
    'Верно. Минус относится к обоим слагаемым: x вычитается, а −4 становится +4. 12 − x + 4.',
    'Correct. The minus applies to both terms: x is subtracted and −4 becomes +4. 12 − x + 4.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('plus') < s.seq.indexOf('x'), text: L(
      "Tartibga qarang: avval x ayiriladi, keyin 4 qo'shiladi. Qavs ichida x oldinda turgan edi.",
      'Посмотри на порядок: сначала вычитается x, потом прибавляется 4. В скобке x стоял первым.',
      'Look at the order: x is subtracted first, then 4 is added. In the bracket the x came first.') },
    { when: (s) => s.seq[0] !== 'n12', text: L(
      "Qator 12 dan boshlanadi: u qavsdan tashqarida turgan va o'zgarmagan.",
      'Строка начинается с 12: оно стояло вне скобки и не менялось.',
      'The line starts with 12: it stood outside the bracket and did not change.') },
  ],
  wrongText: L(
    "Qavs ichidagi ikki hadning ishorasini ag'daring: x minus bo'lib qoladi, 4 esa plyus bo'ladi.",
    'Переверни знак у обоих слагаемых в скобке: x останется с минусом, а 4 станет с плюсом.',
    'Flip the sign of both terms in the bracket: x keeps a minus, the 4 gets a plus.'),
};

export default function D05_06(props) { return <BuildLine data={DATA} {...props} />; }
