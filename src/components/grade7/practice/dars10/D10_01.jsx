// Dars10 · Amaliyot 01 — Nechta ildiz · 🟢 · tag: mod_two_roots
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
//
// DARAJA KO'TARILDI (PODXOD_7SINF.md §13): uch xonali masofa.
//
// |x| = 450. Modul -- masofa, u ishorani hisobga olmaydi. Noldan 450 masofada
// IKKI son turadi: 450 va −450. Shuning uchun ildiz ikkita.
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'mod_two_roots', level: '🟢', optCols: 3,
  eyebrow: L('Modulli tenglama', 'Уравнение с модулем', 'An equation with a modulus'),
  setup: L(
    "Sonning moduli -- uning noldan masofasi. Masofa ishorani hisobga olmaydi: 450 ham, −450 ham noldan bir xil uzoqlikda.",
    'Модуль числа — это его расстояние от нуля. Расстояние не различает знак: и 450, и −450 стоят на одном удалении от нуля.',
    'The modulus of a number is its distance from zero. Distance ignores the sign: both 450 and −450 are the same distance from zero.'),
  expr: ['|x|', '=', '450'], exprSize: 34,
  ask: L('Bu tenglamaning nechta ildizi bor?', 'Сколько корней у этого уравнения?', 'How many roots does this equation have?'),
  opts: [
    { label: L('Ikkita', 'Два', 'Two') },
    { label: L('Bitta', 'Один', 'One') },
    { label: L("Ildizi yo'q", 'Ни одного', 'None') },
  ],
  correct: 0,
  correctText: L(
    "To'g'ri. Ikkita: x = 450 va x = −450. Ikkovining ham moduli 450 ga teng.",
    'Верно. Два: x = 450 и x = −450. У обоих модуль равен 450.',
    'Correct. Two: x = 450 and x = −450. Both have modulus 450.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Bitta emas: modul ishorani hisobga olmaydi, shuning uchun manfiy son ham javob bo'ladi. |−450| = 450.",
      'Не один: модуль не различает знак, поэтому отрицательное число тоже подходит. |−450| = 450.',
      'Not one: the modulus ignores the sign, so a negative number fits too. |−450| = 450.') },
    { when: (s) => s.picked === 2, text: L(
      "Ildiz bor: o'ng tomonda musbat son turibdi. Ildizi yo'q bo'lishi uchun o'ng tomonda manfiy son bo'lishi kerak edi.",
      'Корни есть: справа стоит положительное число. Корней не было бы, если справа стояло отрицательное.',
      'There are roots: the right side is positive. There would be none if the right side were negative.') },
  ],
  wrongText: L(
    "Son o'qini o'ylab ko'ring: noldan 450 uzoqlikda nechta nuqta bor?",
    'Представь числовую прямую: сколько точек стоит на удалении 450 от нуля?',
    'Picture the number line: how many points are 450 away from zero?'),
};

export default function D10_01(props) { return <Choice data={DATA} {...props} />; }
