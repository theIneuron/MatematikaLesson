// Dars19 · Amaliyot 02 — Minusli qavsni ochish · 🟢 · choice · tag: minus_open
// Faqat MA'LUMOT. Mexanika: kit.jsx -> Choice. Raskladka: 2-o'rin (isinish).
//
// (4a + 9) − (a − 6) = 4a + 9 − a + 6. Minus qavs ichidagi HAR hadning
// ishorasini ag'daradi: a manfiy bo'ladi, −6 esa +6.
// Xato variantlar: 4a + 9 − a − 6 (ikkinchi ishora o'zgarmagan),
// 4a + 9 + a − 6 (hech narsa o'zgarmagan).
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'minus_open', level: '🟢',
  eyebrow: L('Qavs oldida minus', 'Минус перед скобкой', 'Minus before the bracket'),
  setup: L(
    "Qavs oldidagi minus qavsni shunchaki o'chirmaydi: u ichidagi har bir hadning ishorasini ag'daradi. Ikki had bo'lsa, ikkovi ham o'zgaradi.",
    'Минус перед скобкой не просто стирает её: он переворачивает знак каждого члена внутри. Если членов два, меняются оба.',
    'A minus before a bracket does not just erase it: it flips the sign of every term inside. Two terms mean two changes.'),
  expr: ['(4a', '+', '9)', '−', '(a', '−', '6)'], exprSize: 28,
  ask: L("Qavslar ochilgandan keyin qaysi yozuv to'g'ri?", 'Какая запись верна после раскрытия скобок?', 'Which record is right after the brackets are opened?'),
  opts: [
    { label: ['4a', '+', '9', '−', 'a', '+', '6'] },
    { label: ['4a', '+', '9', '−', 'a', '−', '6'] },
    { label: ['4a', '+', '9', '+', 'a', '−', '6'] },
  ],
  correct: 0,
  correctText: L(
    "To'g'ri. Ikki had ham ishorasini o'zgartirdi: a manfiy bo'ldi, −6 esa +6. Ixchamlansa 3a + 15 chiqadi.",
    'Верно. Оба члена поменяли знак: a стал отрицательным, а −6 стало +6. После приведения выйдет 3a + 15.',
    'Correct. Both terms flipped: a became negative and −6 became +6. Collecting gives 3a + 15.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Faqat birinchi had o'zgardi. Minus qavs ichidagi HAMMASIGA tegishli: −6 ham ishorasini almashtiradi va +6 bo'ladi.",
      'Поменялся только первый член. Минус относится ко ВСЕМУ внутри скобки: −6 тоже меняет знак и становится +6.',
      'Only the first term changed. The minus applies to EVERYTHING inside: −6 also flips and becomes +6.') },
    { when: (s) => s.picked === 2, text: L(
      "Bu yerda ishoralar umuman o'zgarmagan -- qavs plyus bilan ochilgan. Oldida esa minus turgan.",
      'Здесь знаки вообще не поменялись — скобку раскрыли как с плюсом. А перед ней стоит минус.',
      'Here nothing flipped — the bracket was opened as if it had a plus. But it has a minus.') },
  ],
  wrongText: L(
    "Ikkinchi qavsdagi har hadni alohida ko'ring: a qanday ishora oladi, −6 qanday?",
    'Посмотри на каждый член второй скобки: какой знак получит a и какой −6?',
    'Look at each term of the second bracket: what sign does a get and what does −6 get?'),
};

export default function D19_02(props) { return <Choice data={DATA} {...props} />; }
