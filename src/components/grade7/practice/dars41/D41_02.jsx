// Dars41 · Amaliyot 02 — Burchak turi · 🟢 · choice · tag: ang_kind
// Mexanika: kit.jsx -> Choice. Raskladka: 2-o'rin (isinish).
// 95° -- o'tmas burchak: 90 dan katta, 180 dan kichik.
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'ang_kind', level: '🟢', optCols: 3,
  eyebrow: L('Burchak turi', 'Вид угла', 'Kind of angle'),
  setup: L(
    "Burchak turi o'lchoviga qarab aytiladi: 90 dan kichik o'tkir, 90 to'g'ri, 90 dan katta o'tmas.",
    'Вид угла определяется мерой: меньше 90 острый, 90 прямой, больше 90 тупой.',
    'The kind depends on the measure: under 90 acute, 90 right, over 90 obtuse.'),
  expr: ['95°'], exprSize: 36,
  ask: L('Bu qanday burchak?', 'Какой это угол?', 'What kind of angle is this?'),
  opts: [
    { label: L("O'tmas", 'Тупой', 'Obtuse') },
    { label: L("O'tkir", 'Острый', 'Acute') },
    { label: L("To'g'ri", 'Прямой', 'Right') },
  ],
  correct: 0,
  correctText: L(
    "To'g'ri. 95 > 90, ya'ni burchak o'tmas. Lekin u 180 dan kichik, ya'ni yoyilgan emas.",
    'Верно. 95 > 90, значит угол тупой. Но он меньше 180, значит не развёрнутый.',
    'Correct. 95 > 90, so the angle is obtuse. It is under 180, so not a straight angle.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "O'tkir burchak 90 dan KICHIK bo'ladi. 95 esa to'g'ri burchakdan katta.",
      'Острый угол МЕНЬШЕ 90. А 95 больше прямого.',
      'An acute angle is UNDER 90. But 95 exceeds a right angle.') },
    { when: (s) => s.picked === 2, text: L(
      "To'g'ri burchak aynan 90 daraja. Bizda 95, ya'ni beshga katta.",
      'Прямой угол это ровно 90 градусов. У нас 95, на пять больше.',
      'A right angle is exactly 90. Ours is 95, five more.') },
  ],
  wrongText: L(
    "95 ni 90 bilan solishtiring: kattami yoki kichik?",
    'Сравни 95 с 90: больше или меньше?',
    'Compare 95 with 90: bigger or smaller?'),
};

export default function D41_02(props) { return <Choice data={DATA} {...props} />; }
