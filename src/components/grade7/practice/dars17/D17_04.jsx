// Dars17 · Amaliyot 04 — Xato qayerda · 🟡 · fix · tag: find_wrong_step
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TapTerms.
// Mexanika RASKLADKADAN: 17-dars, 4-o'rin `fix`.
//
// Boshqa o'quvchining yechimi:
//   (−2m³)⁵ = (−2)⁵ · m¹⁵ = 32m¹⁵
// Ikkinchi qadam TO'G'RI: (−2)⁵ ni ajratish va m¹⁵ ni yozish o'rinli.
// Uchinchi qadam NOTO'G'RI: (−2)⁵ = −32, ya'ni javob −32m¹⁵.
// Yaqin tuzoq: m¹⁵ ham, (−2)⁵ ham to'g'ri, ularni belgilash oson xato.
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'find_wrong_step', level: '🟡',
  eyebrow: L('Xato qadam', 'Неверный шаг', 'The wrong step'),
  setup: L(
    "Boshqa o'quvchi yechdi, lekin bitta qadam noto'g'ri. Har qadamni alohida tekshiring: ko'rsatkich toq bo'lsa manfiy asos manfiy qoladi.",
    'Другой ученик решил, но один шаг неверный. Проверь каждый шаг по отдельности: при нечётном показателе отрицательное основание остаётся отрицательным.',
    "Another pupil solved it, but one step is wrong. Check each step: with an odd exponent a negative base stays negative."),
  ask: L("NOTO'G'RI qadamni belgilang.", 'Отметь НЕВЕРНЫЙ шаг.', 'Mark the WRONG step.'),
  note: L("Bitta qadam.", 'Один шаг.', 'One step.'),
  parts: [
    { k: 'sign', v: '(−2m³)⁵' },
    { k: 'sign', v: '=' },
    { k: 'term', id: 't1', v: '(−2)⁵' },
    { k: 'sign', v: '·' },
    { k: 'term', id: 't2', v: 'm¹⁵' },
    { k: 'sign', v: '=' },
    { k: 'term', id: 't3', v: '32m¹⁵' },
  ],
  want: ['t3'],
  correctText: L(
    "To'g'ri. (−2)⁵ da beshta minus ko'paytiriladi -- toq son, ya'ni −32. Oxirgi qadamda ishora yo'qolgan: javob −32m¹⁵.",
    'Верно. В (−2)⁵ перемножаются пять минусов — число нечётное, значит −32. На последнем шаге знак потерялся: ответ −32m¹⁵.',
    'Correct. In (−2)⁵ five minuses multiply — an odd number, so −32. The last step lost the sign: the answer is −32m¹⁵.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('t1') !== -1, text: L(
      "(−2)⁵ qadami to'g'ri: minus qavs ichida turgani uchun u ham darajaga ko'tariladi. Xato keyinroq.",
      'Шаг (−2)⁵ верный: минус стоит внутри скобки, значит он тоже возводится в степень. Ошибка дальше.',
      'The step (−2)⁵ is right: the minus is inside the bracket, so it is raised to the power too. The error is later.') },
    { when: (s) => s.extra.indexOf('t2') !== -1, text: L(
      "m¹⁵ ham to'g'ri: 3 · 5 = 15. Xato sonda, harfda emas.",
      'm¹⁵ тоже верно: 3 · 5 = 15. Ошибка в числе, а не в букве.',
      'm¹⁵ is right too: 3 · 5 = 15. The error is in the number, not the letter.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Oxirgi qadamni tekshiring: (−2)⁵ ni hisoblang va ishorasiga qarang.",
      'Проверь последний шаг: посчитай (−2)⁵ и посмотри на знак.',
      'Check the last step: work out (−2)⁵ and look at the sign.') },
  ],
  wrongText: L(
    "Har qadamni alohida hisoblang. Qaysi biri o'zidan oldingisiga mos kelmayapti?",
    'Посчитай каждый шаг по отдельности. Какой из них не сходится с предыдущим?',
    'Work out each step separately. Which one does not follow from the one before?'),
};

export default function D17_04(props) { return <TapTerms data={DATA} {...props} />; }
