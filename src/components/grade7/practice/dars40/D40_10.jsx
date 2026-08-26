// Dars40 · Amaliyot 10 — Chuqur yechimdagi xato · 🔴 · fix · tag: ang_fix
// Mexanika: kit.jsx -> TapTerms. Raskladka: 10-o'rin `fix`.
// Vertikal burchaklar 3x va 2x + 30: 3x = 2x + 30 TO'G'RI, x = 30 TO'G'RI, burchak = 60 XATO (3 · 30 = 90).
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'ang_fix',
  level: '🔴',
  eyebrow: L(
    'Xato qadam',
    'Неверный шаг',
    'The wrong step'),
  setup: L(
    "Boshqa o'quvchining yechimi turibdi. Uchta qadamdan bittasi noto'g'ri: oxirida x ning qiymati kerakli yozuvga qo'yilmagan.",
    'Перед тобой решение другого ученика. Один из трёх шагов неверный: в конце значение x подставили не туда.',
    "Another pupil's solution is shown. One of the three steps is wrong: at the end x was put into the wrong expression."),
  given: [['3x', L('va', 'и', 'and'), '2x + 30']],
  givenLabel: L(
    'Vertikal burchaklar:',
    'Вертикальные углы:',
    'Vertical angles:'),
  ask: L(
    "NOTO'G'RI qadamni belgilang.",
    'Отметь НЕВЕРНЫЙ шаг.',
    'Mark the WRONG step.'),
  note: L(
    'Bitta qadam.',
    'Один шаг.',
    'One step.'),
  parts: [
    { k: 'term', id: 't1', v: '3x = 2x + 30' },
    { k: 'sign', v: ' ' },
    { k: 'term', id: 't2', v: 'x = 30' },
    { k: 'sign', v: ' ' },
    { k: 'term', id: 't3', v: L('burchak = 60°', 'угол = 60°', 'angle = 60°') },
  ],
  want: ['t3'],
  correctText: L(
    "To'g'ri. x = 30 ni 3x ga qo'yish kerak: 3 · 30 = 90. Burchak 90 gradus, 60 emas.",
    'Верно. x = 30 надо подставить в 3x: 3 · 30 = 90. Угол 90 градусов, а не 60.',
    'Correct. x = 30 goes into 3x: 3 · 30 = 90. The angle is 90 degrees, not 60.'),
  wrongs: [
    {
      when: (s) => s.extra.indexOf('t1') !== -1,
      text: L(
        "Vertikal burchaklar teng, ya'ni 3x = 2x + 30 -- bu qadam to'g'ri.",
        'Вертикальные углы равны, значит 3x = 2x + 30 — этот шаг верный.',
        'Vertical angles are equal, so 3x = 2x + 30 is a correct step.'),
    },
    {
      when: (s) => s.extra.indexOf('t2') !== -1,
      text: L(
        "3x − 2x = 30, ya'ni x = 30 -- bu ham to'g'ri.",
        '3x − 2x = 30, значит x = 30 — тоже верно.',
        '3x − 2x = 30, so x = 30 is correct as well.'),
    },
    {
      when: (s) => s.miss.length > 0,
      text: L(
        "x topilgandan keyin uni burchak yozuviga qo'yish kerak. Shu joyni tekshiring.",
        'После нахождения x его надо подставить в запись угла. Проверь это место.',
        'Once x is found it must go into the angle expression. Check that step.'),
    },
  ],
  wrongText: L(
    "x ni topgach, uni burchakning O'Z yozuviga qo'ying: 3x yoki 2x + 30, ikkovi ham bir xil son beradi.",
    'Найдя x, подставь его в САМУ запись угла: 3x или 2x + 30 дадут одно число.',
    'After finding x, put it into the angle expression itself: 3x and 2x + 30 give the same number.'),
};

export default function D40_10(props) { return <TapTerms data={DATA} {...props} />; }
