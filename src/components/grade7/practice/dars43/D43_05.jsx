// Dars43 · Amaliyot 05 — Uch burchak yetarli emas · 🟡 · fix · tag: eq_angles_fix
// Mexanika: kit.jsx -> TapTerms. Raskladka: 5-o'rin.
// Uch burchakning tengligi uchburchaklar tengligini bermaydi: o'lcham
// har xil bo'lishi mumkin.
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'eq_angles_fix', level: '🟡',
  eyebrow: L('Xato xulosa', 'Неверный вывод', 'The wrong conclusion'),
  setup: L(
    "Uch xulosadan biri noto'g'ri. Uchburchak tengligi uchun kamida bitta TOMON kerak.",
    'Один из трёх выводов неверный. Для равенства треугольников нужна хотя бы одна СТОРОНА.',
    'One of the three conclusions is wrong. Equal triangles need at least one SIDE.'),
  ask: L("NOTO'G'RI xulosani belgilang.", 'Отметь НЕВЕРНЫЙ вывод.', 'Mark the WRONG conclusion.'),
  note: L('Bitta xulosa.', 'Один вывод.', 'One conclusion.'),
  parts: [
    { k: 'term', id: 't1', v: '3, 4, 5 = 3, 4, 5' },
    { k: 'sign', v: ' ' },
    { k: 'term', id: 't2', v: '40°, 60°, 80° = 40°, 60°, 80°' },
    { k: 'sign', v: ' ' },
    { k: 'term', id: 't3', v: '5, 7, 40° = 5, 7, 40°' },
  ],
  want: ['t2'],
  correctText: L(
    "To'g'ri. Faqat burchaklar teng bo'lsa uchburchaklar shakli bir xil, lekin o'lchami har xil bo'lishi mumkin -- ular teng emas.",
    'Верно. Если равны только углы, форма одинаковая, но размер может отличаться — треугольники не равны.',
    'Correct. Equal angles alone give the same shape but possibly different size — not equal triangles.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('t1') !== -1, text: L(
      "Uch tomon tengligi uchburchaklarni teng qiladi: bu uchinchi belgi.",
      'Равенство трёх сторон делает треугольники равными: это третий признак.',
      'Three equal sides make the triangles equal: the third criterion.') },
    { when: (s) => s.extra.indexOf('t3') !== -1, text: L(
      "Ikki tomon va ular orasidagi burchak ham yetadi: bu birinchi belgi.",
      'Двух сторон и угла между ними тоже достаточно: это первый признак.',
      'Two sides and the included angle suffice: the first criterion.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Har xulosada tomon bormi -- shuni tekshiring.",
      'Проверь в каждом выводе: есть ли там сторона?',
      'Check each conclusion: is a side involved?') },
  ],
  wrongText: L(
    "Qaysi to'plamda birorta tomon yo'q? O'lchamni nima belgilaydi?",
    'В каком наборе нет ни одной стороны? Что задаёт размер?',
    'Which set has no side at all? What fixes the size?'),
};

export default function D43_05(props) { return <TapTerms data={DATA} {...props} />; }
