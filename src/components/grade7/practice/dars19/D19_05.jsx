// Dars19 · Amaliyot 05 — Chuqur yechimdagi xato · 🟡 · fix · tag: diff_fix
// Faqat MA'LUMOT. Mexanika: kit.jsx -> TapTerms. Raskladka: 5-o'rin.
//
// Boshqa o'quvchi: (7m − 4) − (3m − 9) = 4m − 13
//   4m TO'G'RI (7 − 3)
//   −13 NOTO'G'RI: −9 ag'darilib +9 bo'lishi kerak, ya'ni −4 + 9 = +5.
// Yaqin tuzoq: birinchi had to'g'ri, uni belgilash oson xato.
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'diff_fix', level: '🟡',
  eyebrow: L('Xato had', 'Неверный член', 'The wrong term'),
  setup: L(
    "Boshqa o'quvchi ayirmani hisobladi, lekin bitta had noto'g'ri. Ikkinchi qavsning har hadi ishorasini o'zgartirishi kerakligini eslang.",
    'Другой ученик посчитал разность, но один член неверный. Помни: каждый член второй скобки меняет знак.',
    'Another pupil worked out the difference, but one term is wrong. Remember: every term of the second bracket flips its sign.'),
  given: [['(7m', '−', '4)', '−', '(3m', '−', '9)']],
  givenLabel: L('Masala:', 'Задание:', 'The task:'),
  ask: L("Javobdagi NOTO'G'RI hadni belgilang.", 'Отметь НЕВЕРНЫЙ член в ответе.', 'Mark the WRONG term in the answer.'),
  note: L('Bitta had.', 'Один член.', 'One term.'),
  parts: [
    { k: 'term', id: 't1', v: '4m' },
    { k: 'sign', v: '−' },
    { k: 'term', id: 't2', v: '13' },
  ],
  want: ['t2'],
  correctText: L(
    "To'g'ri. Ikkinchi qavsdagi −9 ag'darilib +9 bo'ladi: −4 + 9 = +5. Ya'ni javob 4m + 5, 4m − 13 emas.",
    'Верно. −9 из второй скобки переворачивается в +9: −4 + 9 = +5. Значит ответ 4m + 5, а не 4m − 13.',
    'Correct. The −9 in the second bracket flips to +9: −4 + 9 = +5. So the answer is 4m + 5, not 4m − 13.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('t1') !== -1, text: L(
      "4m to'g'ri: 7m − 3m = 4m. Xato ozod hadda, m li hadda emas.",
      '4m верно: 7m − 3m = 4m. Ошибка в свободном члене, а не в члене с m.',
      '4m is right: 7m − 3m = 4m. The error is in the free term, not the m term.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Ozod hadlarni tekshiring: −4 va (−9) ag'darilgandan keyin nima chiqadi?",
      'Проверь свободные члены: что выходит из −4 и перевёрнутого −9?',
      'Check the free terms: what do −4 and the flipped −9 give?') },
  ],
  wrongText: L(
    "Ikkinchi qavsni ochib ko'ring: −(3m − 9) qanday yoziladi?",
    'Раскрой вторую скобку: как записывается −(3m − 9)?',
    'Open the second bracket: how is −(3m − 9) written?'),
};

export default function D19_05(props) { return <TapTerms data={DATA} {...props} />; }
