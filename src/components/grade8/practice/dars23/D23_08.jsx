// Dars23 · Amaliyot 08 — Pazl · 🔴 · tag: pair_compare
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §5 (23-dars, 8-pozitsiya)
//
// T1, T2 VA UCHINCHI HOL. Uchinchi juftlik darsda ochiq aytilmagan, lekin
// birinchi ikkitasidan chiqadi: ayirma na musbat, na manfiy bo'lsa —
// sonlar teng. Ya'ni «ayirmaning ishorasi» degan qoida uch holni to'liq
// qoplaydi, ikkitasini emas.
//
// Uch kartada bir xil son turibdi — besh — va faqat ishorasi (yoki nolga
// aylangani) farq qiladi. Kartalarda yozuv bo'shliqsiz (skelet §0a.3).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'pair_compare', level: '🔴',
  faceSize: 13, faceSizePhone: 11,
  cards: [
    { id: 'f1', side: 0, tokens: ['a−b=5'] },
    { id: 'f2', side: 0, tokens: ['a−b=−5'] },
    { id: 'f3', side: 0, tokens: ['a−b=0'] },
    { id: 'v1', side: 1, v: 'a>b' },
    { id: 'v2', side: 1, v: 'a<b' },
    { id: 'v3', side: 1, v: 'a=b' },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "Uch holatda a va b sonlarining ayirmasi berilgan. Sonlarning o'zi noma'lum, lekin har holatda xulosa aniq chiqadi.",
    'В трёх случаях дана разность чисел a и b. Сами числа неизвестны, но в каждом случае вывод однозначен.',
    'In three cases the difference of the numbers a and b is given. The numbers themselves are unknown, yet in each case the conclusion is definite.'),
  ask: L(
    'Ayirmani bosing, keyin uyani bosing.',
    'Нажми разность, потом ячейку.',
    'Tap a difference, then a slot.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Musbat ayirma — a katta, manfiy — a kichik, nol — sonlar teng. Uch kartada bir xil son turibdi, xulosani esa faqat ishora hal qildi. Tekshiring: o'n ikki va yetti, yetti va o'n ikki, yetti va yetti.",
    'Верно. Положительная разность — a больше, отрицательная — a меньше, нуль — числа равны. На трёх карточках одно и то же число, а вывод решил только знак. Проверь: двенадцать и семь, семь и двенадцать, семь и семь.',
    'Correct. A positive difference means a is greater, a negative one that a is smaller, zero that they are equal. The three cards hold the same number and only the sign decided. Check: twelve and seven, seven and twelve, seven and seven.'),
  wrongs: [
    { when: (s) => s.mate.f3 !== 'v3', text: L(
      "Ayirma NOL bo'lgan holat alohida: na musbat, na manfiy. Bunday holda a dan b ni ayirganda hech narsa qolmaydi, ya'ni ular bir xil son. Misol: yetti minus yetti nol. Bu hol darsda alohida aytilmagan, lekin ikki qoidadan o'z-o'zidan chiqadi.",
      'Случай НУЛЕВОЙ разности особый: она ни положительна, ни отрицательна. Тогда при вычитании b из a не остаётся ничего, то есть это одно и то же число. Пример: семь минус семь нуль. Этот случай в уроке отдельно не назван, но сам собой следует из двух правил.',
      'The case of a ZERO difference stands apart: it is neither positive nor negative. Then subtracting b from a leaves nothing, so they are the same number. Example: seven minus seven is zero. This case is not stated separately in the lesson, but it follows from the two rules by itself.') },
    { when: (s) => s.mate.f1 !== 'v1', text: L(
      "Ayirma MUSBAT bo'lgan holatda birinchi son katta. Besh noldan katta, ya'ni a dan b ni ayirganda besh birlik ortiqcha qoldi. Sonlarda tekshiring: o'n ikki minus yetti besh, va o'n ikki yettidan katta.",
      'При ПОЛОЖИТЕЛЬНОЙ разности больше первое число. Пять больше нуля, то есть при вычитании b из a осталось лишних пять единиц. Проверь числами: двенадцать минус семь пять, и двенадцать больше семи.',
      'When the difference is POSITIVE the first number is greater. Five is greater than zero, so subtracting b from a left five units over. Check with numbers: twelve minus seven is five, and twelve is greater than seven.') },
    { when: (s) => s.mate.f2 !== 'v2', text: L(
      "Ayirma MANFIY bo'lgan holatda birinchi son kichik. Minus besh noldan kichik, ya'ni a dan b ni ayirishga besh birlik yetishmadi. Sonlarda tekshiring: yetti minus o'n ikki minus besh, va yetti o'n ikkidan kichik.",
      'При ОТРИЦАТЕЛЬНОЙ разности первое число меньше. Минус пять меньше нуля, то есть для вычитания b из a не хватило пяти единиц. Проверь числами: семь минус двенадцать минус пять, и семь меньше двенадцати.',
      'When the difference is NEGATIVE the first number is smaller. Minus five is less than zero, so subtracting b from a fell short by five units. Check with numbers: seven minus twelve is minus five, and seven is smaller than twelve.') },
  ],
  wrongText: L(
    "Faqat ishoraga qarang: musbat — birinchisi katta, manfiy — kichik, nol — teng. Har juftlikni sonlar bilan tekshiring.",
    'Смотри только на знак: положительна — первое больше, отрицательна — меньше, нуль — равны. Проверяй каждую пару числами.',
    'Look only at the sign: positive means the first is greater, negative smaller, zero equal. Check every pair with numbers.'),
};

export default function D23_08(props) { return <PairSlots data={DATA} {...props} />; }
