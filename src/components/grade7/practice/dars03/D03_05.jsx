// Dars03 · Amaliyot 05 — Yarim yo'lda qolgan taqsimot · 🟡 · tag: fix_distribute
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> BuildLine (answerSeq).
//
// DARAJA KO'TARILDI (metodist qarori 2026-08-21): sonlar uch-to'rt xonali.
//
// Chet yechim: (−9) · 230 = −9 · 200 + 30.
// To'g'ri qator: −9 · 200 − 9 · 30 (= −1800 − 270 = −2070, va −9 · 230 = −2070).
// Kartalar orasida IKKITA to'qqiz: manfiy va musbat. Ikkinchi bo'lakda
// ayirish turadi, shuning uchun ikkinchi to'qqiz musbat yoziladi.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const CARDS = [
  { id: 'nm9', label: '−9' },
  { id: 'mul1', label: '·' },
  { id: 'n200', label: '200' },
  { id: 'minus', label: '−' },
  { id: 'n9', label: '9' },
  { id: 'mul2', label: '·' },
  { id: 'n30', label: '30' },
];

const DATA = {
  tag: 'fix_distribute', level: '🟡', useAll: true,
  answerSeq: ['nm9', 'mul1', 'n200', 'minus', 'n9', 'mul2', 'n30'],
  cards: CARDS,
  eyebrow: L('Xatoni tuzatish', 'Исправь ошибку', 'Fix the mistake'),
  setup: L(
    "Boshqa o'quvchi (−9) · 230 ni bo'lib hisoblamoqchi bo'ldi va shunday yozdi: −9 · 200 + 30. Bu qator xato.",
    'Другой ученик решил посчитать (−9) · 230 по частям и написал так: −9 · 200 + 30. Эта строка неверна.',
    'Another student decided to work out (−9) · 230 in parts and wrote: −9 · 200 + 30. That line is wrong.'),
  empty: L("Kartalarni bosib qator yig'ing", 'Собери строку, нажимая карточки', 'Build the line by tapping cards'),
  ask: L("To'g'ri qatorni yig'ing. Kursorni ko'chirish uchun yozuvdagi belgini bosing.",
    'Собери верную строку. Чтобы передвинуть курсор, нажми знак в записи.',
    'Build the correct line. To move the cursor, tap a sign in the record.'),
  undo: L('Bitta orqaga', 'Шаг назад', 'One back'),
  valueLabel: L('Qiymat:', 'Значение:', 'Value:'),
  correctText: L(
    "To'g'ri. −9 IKKI songa ham ko'paytiriladi: −9 · 200 − 9 · 30 = −1800 − 270 = −2070. Va (−9) · 230 = −2070.",
    'Верно. −9 умножается на ОБА числа: −9 · 200 − 9 · 30 = −1800 − 270 = −2070. И (−9) · 230 = −2070.',
    'Correct. The −9 multiplies BOTH numbers: −9 · 200 − 9 · 30 = −1800 − 270 = −2070. And (−9) · 230 = −2070.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('minus') > s.seq.indexOf('n9'), text: L(
      "Ikkinchi bo'lak AYIRILADI: 230 = 200 + 30 bo'lgani uchun ikkinchi ko'paytma ham manfiy, ya'ni oldida minus turadi.",
      'Вторая часть ВЫЧИТАЕТСЯ: так как 230 = 200 + 30, второе произведение тоже отрицательное, значит перед ним минус.',
      'The second part is SUBTRACTED: since 230 = 200 + 30 the second product is negative too, so a minus stands before it.') },
    { when: (s) => s.seq[0] !== 'nm9', text: L(
      "Qator manfiy to'qqizdan boshlanadi: ko'paytuvchi (−9) va u birinchi bo'lakka kiradi.",
      'Строка начинается с минус девяти: множитель это (−9), и он входит в первую часть.',
      'The line starts with minus nine: the factor is (−9) and it goes into the first part.') },
  ],
  wrongText: L(
    "Ikki bo'lak bir xil ko'rinishda: −9 · 200 va 9 · 30. Ular orasida minus turadi, chunki ikkinchi ko'paytma ham manfiy.",
    'Обе части выглядят одинаково: −9 · 200 и 9 · 30. Между ними минус, потому что второе произведение тоже отрицательное.',
    'Both parts look alike: −9 · 200 and 9 · 30. A minus joins them because the second product is negative too.'),
};

export default function D03_05(props) { return <BuildLine data={DATA} {...props} />; }
