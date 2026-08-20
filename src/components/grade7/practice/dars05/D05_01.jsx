// Dars05 · Amaliyot 01 — Minusli qavsni o'qish · 🟢 · tag: read_minus_bracket
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
//
// 20 − (7 − 3). Qavs oldida MINUS turadi, ya'ni qavs ochilganda ichidagi
// HAMMA hadning ishorasi o'zgaradi: 20 − 7 + 3 = 16.
// Tekshirish: 20 − 4 = 16.
// Xato variantlar tanib olinadigan: 20 − 7 − 3 = 10 (ikkinchi ishora
// o'zgarmagan), 20 + 7 − 3 = 24 (birinchisi o'zgarib, minus yo'qolgan).
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'read_minus_bracket', level: '🟢',
  eyebrow: L('Qavsni ochish', 'Раскрытие скобок', 'Opening brackets'),
  setup: L(
    "Qavs oldidagi minus qavsni shunchaki o'chirmaydi. U ichidagi har bir hadning ishorasini ag'daradi.",
    'Минус перед скобкой не просто стирает скобку. Он переворачивает знак каждого слагаемого внутри.',
    'A minus before a bracket does not just erase it. It flips the sign of every term inside.'),
  expr: ['20', '−', '(', '7', '−', '3', ')'], exprSize: 32,
  ask: L("Qavs ochilgandan keyin qaysi yozuv to'g'ri?", 'Какая запись верна после раскрытия скобок?', 'Which record is right after the brackets are opened?'),
  opts: [
    { label: ['20', '−', '7', '+', '3'] },
    { label: ['20', '−', '7', '−', '3'] },
    { label: ['20', '+', '7', '−', '3'] },
  ],
  correct: 0,
  correctText: L(
    "To'g'ri. Ikki had ham ishorasini o'zgartirdi: 20 − 7 + 3 = 16. Qavs ichini hisoblab ham 20 − 4 = 16 chiqadi.",
    'Верно. Оба слагаемых поменяли знак: 20 − 7 + 3 = 16. Если посчитать скобку, тоже выйдет 20 − 4 = 16.',
    'Correct. Both terms flipped their sign: 20 − 7 + 3 = 16. Working out the bracket also gives 20 − 4 = 16.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Bu yerda faqat birinchi had o'zgardi, ikkinchisi o'sha holda qoldi: 20 − 7 − 3 = 10. Minus qavs ichidagi HAMMASIGA tegishli.",
      'Здесь поменялось только первое слагаемое, второе осталось прежним: 20 − 7 − 3 = 10. Минус относится ко ВСЕМУ внутри скобки.',
      'Here only the first term changed, the second stayed: 20 − 7 − 3 = 10. The minus applies to EVERYTHING inside.') },
    { when: (s) => s.picked === 2, text: L(
      "Ishoralar teskari almashdi: 20 + 7 − 3 = 24. Qavs oldida minus turgan, ya'ni 7 ayiriladi, qo'shilmaydi.",
      'Знаки переставлены наоборот: 20 + 7 − 3 = 24. Перед скобкой был минус, значит 7 вычитается, а не прибавляется.',
      'The signs are swapped the wrong way: 20 + 7 − 3 = 24. The bracket had a minus, so 7 is subtracted, not added.') },
  ],
  wrongText: L(
    "Qavs ichidagi har hadga qarang va ishorasini ag'daring: 7 ayiriladi, 3 esa qo'shiladi.",
    'Посмотри на каждое слагаемое в скобке и переверни его знак: 7 вычитается, а 3 прибавляется.',
    'Look at each term in the bracket and flip its sign: 7 is subtracted, 3 is added.'),
};

export default function D05_01(props) { return <Choice data={DATA} {...props} />; }
