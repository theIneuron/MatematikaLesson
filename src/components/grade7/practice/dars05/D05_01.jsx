// Dars05 · Amaliyot 01 — Minusli qavsni o'qish · 🟢 · tag: read_minus_bracket
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
//
// DARAJA KO'TARILDI (PODXOD_7SINF.md §13): uch xonali hadlar.
//
// 450 − (170 − 30). Qavs oldida MINUS turadi, ya'ni qavs ochilganda ichidagi
// HAMMA hadning ishorasi o'zgaradi: 450 − 170 + 30 = 310.
// Tekshirish: 170 − 30 = 140, 450 − 140 = 310.
// Xato variantlar tanib olinadigan: 450 − 170 − 30 = 250 (ikkinchi ishora
// o'zgarmagan), 450 + 170 − 30 = 590 (birinchisi o'zgarib, minus yo'qolgan).
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'read_minus_bracket', level: '🟢',
  eyebrow: L('Qavsni ochish', 'Раскрытие скобок', 'Opening brackets'),
  setup: L(
    "Qavs oldidagi minus qavsni shunchaki o'chirmaydi. U ichidagi har bir hadning ishorasini ag'daradi.",
    'Минус перед скобкой не просто стирает скобку. Он переворачивает знак каждого слагаемого внутри.',
    'A minus before a bracket does not just erase it. It flips the sign of every term inside.'),
  expr: ['450', '−', '(', '170', '−', '30', ')'], exprSize: 30,
  ask: L("Qavs ochilgandan keyin qaysi yozuv to'g'ri?", 'Какая запись верна после раскрытия скобок?', 'Which record is right after the brackets are opened?'),
  opts: [
    { label: ['450', '−', '170', '+', '30'] },
    { label: ['450', '−', '170', '−', '30'] },
    { label: ['450', '+', '170', '−', '30'] },
  ],
  correct: 0,
  correctText: L(
    "To'g'ri. Ikki had ham ishorasini o'zgartirdi: 450 − 170 + 30 = 310. Qavs ichini hisoblab ham 450 − 140 = 310 chiqadi.",
    'Верно. Оба слагаемых поменяли знак: 450 − 170 + 30 = 310. Если посчитать скобку, тоже выйдет 450 − 140 = 310.',
    'Correct. Both terms flipped their sign: 450 − 170 + 30 = 310. Working out the bracket also gives 450 − 140 = 310.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Bu yerda faqat birinchi had o'zgardi, ikkinchisi o'sha holda qoldi: 450 − 170 − 30 = 250. Minus qavs ichidagi HAMMASIGA tegishli.",
      'Здесь поменялось только первое слагаемое, второе осталось прежним: 450 − 170 − 30 = 250. Минус относится ко ВСЕМУ внутри скобки.',
      'Here only the first term changed, the second stayed: 450 − 170 − 30 = 250. The minus applies to EVERYTHING inside.') },
    { when: (s) => s.picked === 2, text: L(
      "Ishoralar teskari almashdi: 450 + 170 − 30 = 590. Qavs oldida minus turgan, ya'ni 170 ayiriladi, qo'shilmaydi.",
      'Знаки переставлены наоборот: 450 + 170 − 30 = 590. Перед скобкой был минус, значит 170 вычитается, а не прибавляется.',
      'The signs are swapped the wrong way: 450 + 170 − 30 = 590. The bracket had a minus, so 170 is subtracted, not added.') },
  ],
  wrongText: L(
    "Qavs ichidagi har hadga qarang va ishorasini ag'daring: 170 ayiriladi, 30 esa qo'shiladi.",
    'Посмотри на каждое слагаемое в скобке и переверни его знак: 170 вычитается, а 30 прибавляется.',
    'Look at each term in the bracket and flip its sign: 170 is subtracted, 30 is added.'),
};

export default function D05_01(props) { return <Choice data={DATA} {...props} />; }
