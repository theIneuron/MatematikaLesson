// Dars10 · Amaliyot 05 — Ikkinchi holatni yozish · 🟡 · tag: mod_second_case
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> BuildLine (answerSeq).
//
// |x + 4| = 9. Birinchi holat oson yoziladi: x + 4 = 9. Ikkinchi holat
// esa aynan shu joyda yo'qoladi: x + 4 = −9.
// Kartalar aynan beshta, ish tartibda: qaysi son manfiy bo'ladi.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const CARDS = [
  { id: 'x', label: 'x' },
  { id: 'plus', label: '+' },
  { id: 'n4', label: '4' },
  { id: 'eq', label: '=' },
  { id: 'nm9', label: '−9' },
];

const DATA = {
  tag: 'mod_second_case', level: '🟡', useAll: true,
  answerSeq: ['x', 'plus', 'n4', 'eq', 'nm9'],
  cards: CARDS,
  eyebrow: L('Ikkinchi holat', 'Второй случай', 'The second case'),
  setup: L(
    "|x + 4| = 9 tenglamasining birinchi holati yozildi: x + 4 = 9. Ikkinchi holat esa yozilmagan.",
    'Первый случай уравнения |x + 4| = 9 записан: x + 4 = 9. А второй случай не записан.',
    'The first case of |x + 4| = 9 is written: x + 4 = 9. The second case is not.'),
  empty: L("Kartalarni bosib qator yig'ing", 'Собери строку, нажимая карточки', 'Build the line by tapping cards'),
  ask: L("Ikkinchi holatni yig'ing. Hamma karta ishlatiladi.",
    'Собери второй случай. Используются все карточки.',
    'Build the second case. Every card is used.'),
  undo: L('Bitta orqaga', 'Шаг назад', 'One back'),
  valueLabel: L('Qiymat:', 'Значение:', 'Value:'),
  correctText: L(
    "To'g'ri. Modul ichidagi ifoda −9 ga ham teng bo'lishi mumkin: x + 4 = −9, bundan x = −13. Birinchi holatdan esa x = 5.",
    'Верно. Выражение под модулем может быть равно и −9: x + 4 = −9, отсюда x = −13. А из первого случая x = 5.',
    'Correct. The expression under the modulus can also equal −9: x + 4 = −9, giving x = −13. The first case gives x = 5.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('nm9') < s.seq.indexOf('eq'), text: L(
      "−9 tenglik belgisidan KEYIN turadi: chap tomon modul ichidagi ifoda, o'ng tomon esa son.",
      '−9 стоит ПОСЛЕ знака равенства: слева выражение из-под модуля, справа число.',
      'The −9 goes AFTER the equals sign: the expression from under the modulus on the left, the number on the right.') },
    { when: (s) => s.seq[0] !== 'x', text: L(
      "Qator x dan boshlanadi: modul ichidagi ifoda o'sha holda ko'chadi, faqat o'ng tomon o'zgaradi.",
      'Строка начинается с x: выражение из-под модуля переписывается как есть, меняется только правая часть.',
      'The line starts with x: the expression from under the modulus is copied as it is; only the right side changes.') },
  ],
  wrongText: L(
    "Ikkinchi holatda modul ichidagi ifoda son bilan QARAMA-QARSHI songa tenglashtiriladi: x + 4 = −9.",
    'Во втором случае выражение под модулем приравнивают к ПРОТИВОПОЛОЖНОМУ числу: x + 4 = −9.',
    'In the second case the expression under the modulus is set equal to the OPPOSITE number: x + 4 = −9.'),
};

export default function D10_05(props) { return <BuildLine data={DATA} {...props} />; }
