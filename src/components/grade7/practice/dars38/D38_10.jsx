// Dars38 · Amaliyot 10 — Bitta tekshirish yetmadi · 🔴 · fix · tag: sys_fix
// Mexanika: kit.jsx -> TapTerms. Raskladka: 10-o'rin `fix`.
// (2; 2) juftligi: x + y = 4 TO'G'RI, lekin 2x − y = 5 uchun 4 − 2 = 2 ≠ 5. Xato qadam -- "juftlik mos keladi".
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'sys_fix',
  level: '🔴',
  eyebrow: L(
    'Xato xulosa',
    'Неверный вывод',
    'The wrong claim'),
  setup: L(
    "Uch qadamdan biri noto'g'ri. Juftlik IKKI tenglamani ham bajarishi kerak, bittasi yetmaydi.",
    'Один из трёх шагов неверный. Пара должна выполнять ОБА уравнения, одного мало.',
    'One of the three steps is wrong. The pair must satisfy BOTH equations.'),
  given: [['x + y = 4', ';', '2x − y = 5', ';', '(2; 2)']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  ask: L(
    "NOTO'G'RI qadamni belgilang.",
    'Отметь НЕВЕРНЫЙ шаг.',
    'Mark the WRONG step.'),
  note: L(
    'Bitta qadam.',
    'Один шаг.',
    'One step.'),
  parts: [
    { k: 'term', id: 't1', v: '2 + 2 = 4' },
    { k: 'sign', v: ' ' },
    { k: 'term', id: 't2', v: '4 − 2 = 2' },
    { k: 'sign', v: ' ' },
    { k: 'term', id: 't3', v: L('juftlik mos keladi', 'пара подходит', 'the pair fits') },
  ],
  want: ['t3'],
  correctText: L(
    "To'g'ri. Ikkinchi tenglamada 2 chiqdi, kerak esa 5. Juftlik mos KELMAYDI.",
    'Верно. Во втором уравнении вышло 2, а нужно 5. Пара НЕ подходит.',
    'Correct. The second equation gives 2 instead of 5, so the pair does NOT fit.'),
  wrongs: [
    {
      when: (s) => s.extra.indexOf('t1') !== -1,
      text: L(
        "2 + 2 = 4 -- birinchi tenglama bajarildi, bu qadam to'g'ri.",
        '2 + 2 = 4 — первое уравнение выполнено, шаг верный.',
        '2 + 2 = 4 satisfies the first equation, so the step is right.'),
    },
    {
      when: (s) => s.extra.indexOf('t2') !== -1,
      text: L(
        "4 − 2 = 2 hisobi to'g'ri. Xato -- shu natijadan chiqarilgan XULOSADA.",
        'Вычисление 4 − 2 = 2 верно. Ошибка в ВЫВОДЕ из этого результата.',
        'The arithmetic 4 − 2 = 2 is right. The flaw is in the CONCLUSION.'),
    },
    {
      when: (s) => s.miss.length > 0,
      text: L(
        'Ikkinchi tenglamada kerakli son 5 edi. Chiqqan son bilan solishtiring.',
        'Во втором уравнении требовалось 5. Сравни с полученным числом.',
        'The second equation needed 5. Compare with what came out.'),
    },
  ],
  wrongText: L(
    "Ikkinchi tenglamaning o'ng tomoni bilan chiqqan sonni solishtiring.",
    'Сравни правую часть второго уравнения с полученным числом.',
    'Compare the right side of the second equation with the result.'),
};

export default function D38_10(props) { return <TapTerms data={DATA} {...props} />; }
