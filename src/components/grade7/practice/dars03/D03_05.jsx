// Dars03 · Amaliyot 05 — Yarim yo'lda qolgan taqsimot · 🟡 · tag: fix_distribute
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> BuildLine (answerSeq).
//
// DARAJA KO'TARILDI (metodist qarori 2026-08-21): ko'paytuvchi MANFIY bo'ldi,
// ya'ni tuzatishda ikki narsa kerak -- ikkinchi bo'lakni yozish va ishorani
// to'g'ri qo'yish.
//
// Chet yechim: (−9) · 23 = −9 · 20 + 3.
// To'g'ri qator: −9 · 20 − 9 · 3  (= −180 − 27 = −207, va −9 · 23 = −207).
// Kartalar orasida IKKITA to'qqiz bor: manfiy va musbat. Ikkinchi bo'lakda
// AYIRISH turadi, shuning uchun ikkinchi to'qqiz musbat.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const CARDS = [
  { id: 'nm9', label: '−9' },
  { id: 'mul1', label: '·' },
  { id: 'n20', label: '20' },
  { id: 'minus', label: '−' },
  { id: 'n9', label: '9' },
  { id: 'mul2', label: '·' },
  { id: 'n3', label: '3' },
];

const DATA = {
  tag: 'fix_distribute', level: '🟡', useAll: true,
  answerSeq: ['nm9', 'mul1', 'n20', 'minus', 'n9', 'mul2', 'n3'],
  cards: CARDS,
  eyebrow: L('Xatoni tuzatish', 'Исправь ошибку', 'Fix the mistake'),
  setup: L(
    "Boshqa o'quvchi (−9) · 23 ni bo'lib hisoblamoqchi bo'ldi va shunday yozdi: −9 · 20 + 3. Bu qator xato.",
    'Другой ученик решил посчитать (−9) · 23 по частям и написал так: −9 · 20 + 3. Эта строка неверна.',
    'Another student decided to work out (−9) · 23 in parts and wrote: −9 · 20 + 3. That line is wrong.'),
  empty: L("Kartalarni bosib qator yig'ing", 'Собери строку, нажимая карточки', 'Build the line by tapping cards'),
  ask: L("To'g'ri qatorni yig'ing. Kursorni ko'chirish uchun yozuvdagi belgini bosing.",
    'Собери верную строку. Чтобы передвинуть курсор, нажми знак в записи.',
    'Build the correct line. To move the cursor, tap a sign in the record.'),
  undo: L('Bitta orqaga', 'Шаг назад', 'One back'),
  valueLabel: L('Qiymat:', 'Значение:', 'Value:'),
  correctText: L(
    "To'g'ri. −9 IKKI songa ham ko'paytiriladi: −9 · 20 − 9 · 3 = −180 − 27 = −207. Va (−9) · 23 = −207.",
    'Верно. −9 умножается на ОБА числа: −9 · 20 − 9 · 3 = −180 − 27 = −207. И (−9) · 23 = −207.',
    'Correct. The −9 multiplies BOTH numbers: −9 · 20 − 9 · 3 = −180 − 27 = −207. And (−9) · 23 = −207.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('minus') > s.seq.indexOf('n9'), text: L(
      "Ikkinchi bo'lak AYIRILADI: 23 = 20 + 3 bo'lgani uchun ikkinchi ko'paytma ham manfiy, ya'ni oldida minus turadi.",
      'Вторая часть ВЫЧИТАЕТСЯ: так как 23 = 20 + 3, второе произведение тоже отрицательное, значит перед ним минус.',
      'The second part is SUBTRACTED: since 23 = 20 + 3 the second product is negative too, so a minus stands before it.') },
    { when: (s) => s.seq[0] !== 'nm9', text: L(
      "Qator manfiy to'qqizdan boshlanadi: ko'paytuvchi (−9) va u birinchi bo'lakka kiradi.",
      'Строка начинается с минус девяти: множитель это (−9), и он входит в первую часть.',
      'The line starts with minus nine: the factor is (−9) and it goes into the first part.') },
  ],
  wrongText: L(
    "Ikki bo'lak bir xil ko'rinishda: −9 · 20 va 9 · 3. Ular orasida minus turadi, chunki ikkinchi ko'paytma ham manfiy.",
    'Обе части выглядят одинаково: −9 · 20 и 9 · 3. Между ними минус, потому что второе произведение тоже отрицательное.',
    'Both parts look alike: −9 · 20 and 9 · 3. A minus joins them because the second product is negative too.'),
};

export default function D03_05(props) { return <BuildLine data={DATA} {...props} />; }
