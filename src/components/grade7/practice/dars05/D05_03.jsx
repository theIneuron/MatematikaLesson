// Dars05 · Amaliyot 03 — Qaysi ishora o'zgaradi · 🟡 · tag: which_signs_flip
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TapTerms.
//
// (5a + 3) − (2a − 8). Birinchi qavs oldida PLYUS (yozilmagan, lekin bor),
// ikkinchisi oldida MINUS. Ya'ni ishorani faqat ikkinchi qavsning hadlari
// o'zgartiradi: 2a va −8.
// Xato: o'quvchi «qavs bor -- demak o'zgaradi» deb hammasini belgilaydi,
// yoki faqat birinchi hadni belgilaydi.
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'which_signs_flip', level: '🟡',
  eyebrow: L("Ishora qayerda o'zgaradi", 'Где меняется знак', 'Where the sign changes'),
  setup: L(
    "Ikki qavs bor. Birinchisining oldida plyus, ikkinchisining oldida minus turadi -- va bu farq hal qiladi.",
    'Скобок две. Перед первой плюс, перед второй минус — и эта разница решает всё.',
    'There are two brackets. A plus stands before the first, a minus before the second — and that difference decides everything.'),
  ask: L("Qavslar ochilganda ishorasi O'ZGARADIGAN hadlarni belgilang.", 'Отметь слагаемые, у которых знак МЕНЯЕТСЯ при раскрытии.', 'Mark the terms whose sign CHANGES when the brackets are opened.'),
  note: L("Hadni bosib belgilanadi. Bir nechta bo'lishi mumkin.", 'Слагаемое отмечается нажатием. Их может быть несколько.', 'Tap a term to mark it. There can be several.'),
  parts: [
    { k: 'txt', v: '(' },
    { k: 'term', id: 'a1', v: '5a' },
    { k: 'term', id: 'a2', v: '+ 3' },
    { k: 'txt', v: ')' },
    { k: 'op', v: '−' },
    { k: 'txt', v: '(' },
    { k: 'term', id: 'b1', v: '2a' },
    { k: 'term', id: 'b2', v: '− 8' },
    { k: 'txt', v: ')' },
  ],
  want: ['b1', 'b2'],
  correctText: L(
    "To'g'ri. Ikkinchi qavs oldida minus turgani uchun uning ikki hadi ham ishorasini o'zgartiradi: 5a + 3 − 2a + 8.",
    'Верно. Перед второй скобкой минус, поэтому оба её слагаемых меняют знак: 5a + 3 − 2a + 8.',
    'Correct. The second bracket has a minus before it, so both its terms change sign: 5a + 3 − 2a + 8.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('a1') !== -1 || s.extra.indexOf('a2') !== -1, text: L(
      "Birinchi qavs oldida plyus turadi: uning hadlari o'sha holda ko'chadi. Ishorani faqat minusdan keyingi qavs o'zgartiradi.",
      'Перед первой скобкой стоит плюс: её слагаемые переходят без изменений. Знак меняет только скобка после минуса.',
      'The first bracket has a plus before it: its terms move over unchanged. Only the bracket after a minus flips signs.') },
    { when: (s) => s.miss.length === 1, text: L(
      "Bittasi qoldi: minus qavs ichidagi BITTA hadga emas, hammasiga tegishli. Minus 8 nima bo'lib qoladi?",
      'Одно осталось: минус относится не к ОДНОМУ слагаемому в скобке, а ко всем. Во что превращается минус 8?',
      'One is left: the minus applies not to ONE term in the bracket but to all. What does minus 8 become?') },
  ],
  wrongText: L(
    "Har qavsning OLDIGA qarang: plyus bo'lsa hadlar o'zgarmaydi, minus bo'lsa hammasi ag'dariladi.",
    'Смотри, что стоит ПЕРЕД каждой скобкой: плюс — слагаемые не меняются, минус — переворачиваются все.',
    'Look at what stands BEFORE each bracket: a plus leaves the terms alone, a minus flips them all.'),
};

export default function D05_03(props) { return <TapTerms data={DATA} {...props} />; }
