// Dars19 · Amaliyot 06 — Uch qavs · 🟡 · chain · tag: three_brackets
// Faqat MA'LUMOT. Mexanika: kit.jsx -> SlotsBank (ikki qator). Raskladka: 6-o'rin.
//
// (3x² + x) + (x² − 4x) − (2x² − x)
// 1-qator: uchinchi qavs ochiladi -> −2x² + x
// 2-qator: hammasi ixchamlanadi   -> 2x² − 2x
//   x²: 3 + 1 − 2 = 2       x: 1 − 4 + 1 = −2
// Kartalar orasida +2x² (uchinchi qavsni qo'shgan) va −x turadi.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'three_brackets', level: '🟡',
  eyebrow: L('Uch qavs', 'Три скобки', 'Three brackets'),
  setup: L(
    "Uch qavsdan ikkitasi plyus bilan, uchinchisi minus bilan qo'shilgan. Faqat minusli qavsning hadlari ishorasini o'zgartiradi.",
    'Из трёх скобок две присоединены плюсом, третья минусом. Знаки меняют только члены скобки с минусом.',
    'Of the three brackets two are joined by a plus and one by a minus. Only the minus bracket flips its terms.'),
  rows: [
    [{ t: ['−', '(2x²', '−', 'x)', '='] }, { slot: 0 }, { slot: 1 }],
    [{ t: ['(3x²', '+', 'x)', '+', '(x²', '−', '4x)', '...', '='] }, { slot: 2 }, { slot: 3 }],
  ],
  cards: ['−2x²', '+x', '2x²', '−2x', '+2x²', '−x'],
  answer: ['−2x²', '+x', '2x²', '−2x'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Uchinchi qavs ochilib −2x² + x berdi. Keyin x²: 3 + 1 − 2 = 2, x: 1 − 4 + 1 = −2. Javob 2x² − 2x.",
    'Верно. Третья скобка раскрылась как −2x² + x. Потом x²: 3 + 1 − 2 = 2, x: 1 − 4 + 1 = −2. Ответ 2x² − 2x.',
    'Correct. The third bracket opened as −2x² + x. Then x²: 3 + 1 − 2 = 2, x: 1 − 4 + 1 = −2. The answer is 2x² − 2x.'),
  wrongs: [
    { when: (s) => s.slots[0] === '+2x²', text: L(
      "Uchinchi qavs oldida minus turibdi: 2x² manfiy bo'ladi. Uni qo'shsak x² lar soni to'rt chiqib ketadi.",
      'Перед третьей скобкой стоит минус: 2x² становится отрицательным. Если прибавить, x² выйдет четыре.',
      'The third bracket has a minus: 2x² becomes negative. Adding it would give four x².') },
    { when: (s) => s.slots[1] === '−x', text: L(
      "Qavs ichidagi had −x edi, minus uni ag'daradi va +x bo'ladi.",
      'В скобке член был −x, минус его переворачивает и получается +x.',
      'Inside the bracket the term was −x; the minus flips it into +x.') },
    { when: (s) => s.slots[2] === '−2x²' || s.slots[3] === '+x', text: L(
      "Qatorlar almashib ketdi: birinchi qatorda uchinchi qavs ochiladi, ikkinchisida butun yozuv ixchamlanadi.",
      'Строки перепутались: в первой раскрывается третья скобка, во второй приводится вся запись.',
      'The rows got swapped: the first opens the third bracket, the second collects the whole record.') },
  ],
  wrongText: L(
    "Avval minusli qavsni ochib oling, keyin uch qavsning x² larini va x larini alohida qo'shing.",
    'Сначала раскрой скобку с минусом, потом сложи x² и x всех трёх скобок по отдельности.',
    'Open the minus bracket first, then add the x² terms and the x terms of all three separately.'),
};

export default function D19_06(props) { return <SlotsBank data={DATA} {...props} />; }
