// Dars10 · Amaliyot 01 — Nechta ildiz · 🟢 · tag: mod_two_roots
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
//
// |x| = 6. Modul -- masofa, u ishorani hisobga olmaydi. Noldan 6 masofada
// IKKI son turadi: 6 va −6. Shuning uchun ildiz ikkita.
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'mod_two_roots', level: '🟢', optCols: 3,
  eyebrow: L('Modulli tenglama', 'Уравнение с модулем', 'An equation with a modulus'),
  setup: L(
    "Sonning moduli -- uning noldan masofasi. Masofa ishorani hisobga olmaydi: 6 ham, −6 ham noldan olti qadam uzoqda.",
    'Модуль числа — это его расстояние от нуля. Расстояние не различает знак: и 6, и −6 стоят в шести шагах от нуля.',
    'The modulus of a number is its distance from zero. Distance ignores the sign: both 6 and −6 are six steps from zero.'),
  expr: ['|x|', '=', '6'], exprSize: 34,
  ask: L('Bu tenglamaning nechta ildizi bor?', 'Сколько корней у этого уравнения?', 'How many roots does this equation have?'),
  opts: [
    { label: L('Ikkita', 'Два', 'Two') },
    { label: L('Bitta', 'Один', 'One') },
    { label: L("Ildizi yo'q", 'Ни одного', 'None') },
  ],
  correct: 0,
  correctText: L(
    "To'g'ri. Ikkita: x = 6 va x = −6. Ikkovining ham moduli 6 ga teng.",
    'Верно. Два: x = 6 и x = −6. У обоих модуль равен 6.',
    'Correct. Two: x = 6 and x = −6. Both have modulus 6.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Bitta emas: modul ishorani hisobga olmaydi, shuning uchun manfiy son ham javob bo'ladi. |−6| = 6.",
      'Не один: модуль не различает знак, поэтому отрицательное число тоже подходит. |−6| = 6.',
      'Not one: the modulus ignores the sign, so a negative number fits too. |−6| = 6.') },
    { when: (s) => s.picked === 2, text: L(
      "Ildiz bor: o'ng tomonda musbat son turibdi. Ildizi yo'q bo'lishi uchun o'ng tomonda manfiy son bo'lishi kerak edi.",
      'Корни есть: справа стоит положительное число. Корней не было бы, если справа стояло отрицательное.',
      'There are roots: the right side is positive. There would be none if the right side were negative.') },
  ],
  wrongText: L(
    "Son o'qini o'ylab ko'ring: noldan 6 qadam uzoqda nechta nuqta bor?",
    'Представь числовую прямую: сколько точек стоит в шести шагах от нуля?',
    'Picture the number line: how many points are six steps from zero?'),
};

export default function D10_01(props) { return <Choice data={DATA} {...props} />; }
