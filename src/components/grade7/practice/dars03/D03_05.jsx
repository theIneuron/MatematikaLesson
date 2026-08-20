// Dars03 · Amaliyot 05 — Yarim yo'lda qolgan taqsimot · 🟡 · tag: fix_distribute
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> BuildLine (answerSeq).
//
// Chet yechim: 9 · 23 = 9 · 20 + 3. Bu ENG KO'P UCHRAYDIGAN xato: ko'paytiruvchi
// qavs ichidagi birinchi songa tarqatilgan, ikkinchisiga esa yetmagan.
// To'g'ri qator: 9 · 20 + 9 · 3 (= 180 + 27 = 207, va 9 · 23 = 207).
// Kartalar orasida IKKITA to'qqiz bor -- to'qqiz ikki joyda turishi kerak,
// aynan shu narsa tekshiriladi.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const CARDS = [
  { id: 'n9a', label: '9' },
  { id: 'mul1', label: '·' },
  { id: 'n20', label: '20' },
  { id: 'plus', label: '+' },
  { id: 'n9b', label: '9' },
  { id: 'mul2', label: '·' },
  { id: 'n3', label: '3' },
];

const DATA = {
  tag: 'fix_distribute', level: '🟡', useAll: true,
  answerSeq: ['n9a', 'mul1', 'n20', 'plus', 'n9b', 'mul2', 'n3'],
  cards: CARDS,
  eyebrow: L('Xatoni tuzatish', 'Исправь ошибку', 'Fix the mistake'),
  setup: L(
    "Boshqa o'quvchi 9 · 23 ni bo'lib hisoblamoqchi bo'ldi va shunday yozdi: 9 · 20 + 3. Bu qator xato.",
    'Другой ученик решил посчитать 9 · 23 по частям и написал так: 9 · 20 + 3. Эта строка неверна.',
    'Another student decided to work out 9 · 23 in parts and wrote: 9 · 20 + 3. That line is wrong.'),
  empty: L("Kartalarni bosib qator yig'ing", 'Собери строку, нажимая карточки', 'Build the line by tapping cards'),
  ask: L("To'g'ri qatorni yig'ing. Kursorni ko'chirish uchun yozuvdagi belgini bosing.",
    'Собери верную строку. Чтобы передвинуть курсор, нажми знак в записи.',
    'Build the correct line. To move the cursor, tap a sign in the record.'),
  undo: L('Bitta orqaga', 'Шаг назад', 'One back'),
  valueLabel: L('Qiymat:', 'Значение:', 'Value:'),
  correctText: L(
    "To'g'ri. To'qqiz IKKI songa ham ko'paytiriladi: 9 · 20 + 9 · 3 = 180 + 27 = 207. Va 9 · 23 = 207.",
    'Верно. Девять умножается на ОБА числа: 9 · 20 + 9 · 3 = 180 + 27 = 207. И 9 · 23 = 207.',
    'Correct. The nine multiplies BOTH numbers: 9 · 20 + 9 · 3 = 180 + 27 = 207. And 9 · 23 = 207.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('n9b') > s.seq.indexOf('n3'), text: L(
      "Ikkinchi to'qqiz uchdan OLDIN turadi: qator 9 · 3 bo'lishi kerak, 3 · 9 emas -- yozuv birinchi bo'lagiga o'xshab tursin.",
      'Вторая девятка стоит ПЕРЕД тройкой: строка должна быть 9 · 3, чтобы вторая часть выглядела как первая.',
      'The second nine goes BEFORE the three: the line should read 9 · 3 so the second part matches the first.') },
    { when: (s) => s.seq.indexOf('plus') < s.seq.indexOf('n20'), text: L(
      "Qo'shish 20 dan KEYIN turadi: avval birinchi ko'paytirish tugaydi, keyin ikkinchisi qo'shiladi.",
      'Плюс стоит ПОСЛЕ 20: сначала заканчивается первое умножение, потом прибавляется второе.',
      'The plus goes AFTER the 20: the first multiplication finishes, then the second one is added.') },
  ],
  wrongText: L(
    "Ikki bo'lak bir xil ko'rinishda bo'ladi: 9 · 20 va 9 · 3. Ular orasida qo'shish turadi.",
    'Обе части выглядят одинаково: 9 · 20 и 9 · 3. Между ними стоит плюс.',
    'Both parts look the same: 9 · 20 and 9 · 3. A plus stands between them.'),
};

export default function D03_05(props) { return <BuildLine data={DATA} {...props} />; }
