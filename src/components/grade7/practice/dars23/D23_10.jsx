// Dars23 · Amaliyot 10 — Oxirgi qadamda xato · 🔴 · fix · tag: group_fix
// Mexanika: kit.jsx -> TapTerms. Raskladka: 10-o'rin.
// Chuqur yechim: x³ + x² + 4x + 4 = x²(x + 1) + 4(x + 1) = (x + 1)(x² − 4)
//   x²(x + 1) TO'G'RI, 4(x + 1) TO'G'RI, (x + 1)(x² − 4) NOTO'G'RI:
//   qavs oldidagi hadlar x² va +4, ya'ni (x² + 4).
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'group_fix', level: '🔴',
  eyebrow: L('Xato qadam', 'Неверный шаг', 'The wrong step'),
  setup: L(
    "Boshqa o'quvchi guruhlab yechdi. Ikki qadam to'g'ri, uchinchisida ishora almashib ketgan -- ikkinchi qavsga qavs oldidagi hadlar tushishi kerak.",
    'Другой ученик решил группировкой. Два шага верные, на третьем перепутан знак — во вторую скобку попадают члены, стоявшие перед скобками.',
    'Another pupil used grouping. Two steps are right; the third has a sign wrong — the second bracket takes the front terms.'),
  given: [['x³', '+', 'x²', '+', '4x', '+', '4']],
  givenLabel: L('Masala:', 'Задание:', 'The task:'),
  ask: L("NOTO'G'RI qadamni belgilang.", 'Отметь НЕВЕРНЫЙ шаг.', 'Mark the WRONG step.'),
  note: L('Bitta qadam.', 'Один шаг.', 'One step.'),
  parts: [
    { k: 'term', id: 't1', v: 'x²(x + 1)' },
    { k: 'sign', v: '+' },
    { k: 'term', id: 't2', v: '4(x + 1)' },
    { k: 'sign', v: '=' },
    { k: 'term', id: 't3', v: '(x + 1)(x² − 4)' },
  ],
  want: ['t3'],
  correctText: L(
    "To'g'ri. Qavs oldida x² va +4 turgan, ya'ni ikkinchi ko'paytuvchi (x² + 4). Javob (x + 1)(x² + 4).",
    'Верно. Перед скобками стояли x² и +4, значит второй множитель (x² + 4). Ответ (x + 1)(x² + 4).',
    'Correct. The front terms were x² and +4, so the second factor is (x² + 4). The answer is (x + 1)(x² + 4).'),
  wrongs: [
    { when: (s) => s.extra.indexOf('t1') !== -1, text: L(
      "x²(x + 1) to'g'ri: x³ + x² dan x² chiqsa (x + 1) qoladi.",
      'x²(x + 1) верно: при выносе x² из x³ + x² остаётся (x + 1).',
      'x²(x + 1) is right: taking x² out of x³ + x² leaves (x + 1).') },
    { when: (s) => s.extra.indexOf('t2') !== -1, text: L(
      "4(x + 1) ham to'g'ri: 4x + 4 dan 4 chiqsa (x + 1) qoladi. Ikki qavs bir xil, ya'ni guruhlash ishladi.",
      '4(x + 1) тоже верно: при выносе 4 из 4x + 4 остаётся (x + 1). Скобки совпали, группировка сработала.',
      '4(x + 1) is right too: taking 4 out of 4x + 4 leaves (x + 1). The brackets match, so grouping worked.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Oxirgi qadamni tekshiring: qavs oldida qanday ishora bilan hadlar turgan?",
      'Проверь последний шаг: с какими знаками стояли члены перед скобками?',
      'Check the last step: with which signs did the front terms stand?') },
  ],
  wrongText: L(
    "Har qadamni asl yozuv bilan solishtiring: qaysi biri undan chiqmaydi?",
    'Сверь каждый шаг с исходной записью: какой из них из неё не следует?',
    'Compare each step with the original: which one does not follow from it?'),
};

export default function D23_10(props) { return <TapTerms data={DATA} {...props} />; }
