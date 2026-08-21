// Dars47 · Amaliyot 05 — Katetlarni qo'shib yuborgan · 🟡 · fix · tag: pyth_fix
// Mexanika: kit.jsx -> TapTerms. Raskladka: 5-o'rin.
// Katetlar 5 va 12: c² = 25 + 144 = 169, c = 13. Chuqur javob 17 -- katetlar
// qo'shilgan.
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'pyth_fix', level: '🟡',
  eyebrow: L('Xato bo\'lak', 'Неверная часть', 'The wrong part'),
  setup: L(
    "Boshqa o'quvchi kvadratlarni to'g'ri hisobladi, lekin gipotenuzani noto'g'ri yozdi.",
    'Другой ученик верно посчитал квадраты, но неверно записал гипотенузу.',
    'Another pupil got the squares right but wrote the hypotenuse wrong.'),
  given: [['katetlar', '5', 'va', '12']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  ask: L("NOTO'G'RI bo'lakni belgilang.", 'Отметь НЕВЕРНУЮ часть.', 'Mark the WRONG part.'),
  note: L('Bitta bo\'lak.', 'Одна часть.', 'One part.'),
  parts: [
    { k: 'term', id: 't1', v: '25 + 144' },
    { k: 'sign', v: '=' },
    { k: 'term', id: 't2', v: '169' },
    { k: 'sign', v: '→' },
    { k: 'term', id: 't3', v: 'c = 17' },
  ],
  want: ['t3'],
  correctText: L(
    "To'g'ri. 169 dan ildiz 13, 17 emas: 17² = 289. Javob c = 13.",
    'Верно. Корень из 169 это 13, а не 17: 17² = 289. Ответ c = 13.',
    'Correct. The root of 169 is 13, not 17: 17² = 289. The answer is c = 13.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('t1') !== -1, text: L(
      "25 + 144 to'g'ri: 5² = 25 va 12² = 144.",
      '25 + 144 верно: 5² = 25 и 12² = 144.',
      '25 + 144 is right: 5² = 25 and 12² = 144.') },
    { when: (s) => s.extra.indexOf('t2') !== -1, text: L(
      "169 ham to'g'ri: 25 + 144 = 169.",
      '169 тоже верно: 25 + 144 = 169.',
      '169 is right too: 25 + 144 = 169.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Oxirgi qadamni tekshiring: 17² nechchi? U 169 ga tengmi?",
      'Проверь последний шаг: чему равно 17²? Совпадает ли с 169?',
      'Check the last step: what is 17²? Does it match 169?') },
  ],
  wrongText: L(
    "Qanday son o'ziga ko'paytirilganda 169 beradi?",
    'Какое число при умножении само на себя даёт 169?',
    'Which number times itself gives 169?'),
};

export default function D47_05(props) { return <TapTerms data={DATA} {...props} />; }
