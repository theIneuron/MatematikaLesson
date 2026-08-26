// Dars29 · Amaliyot 09 — Ha yoki yo'q · 🔴 · tag: abs_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §11 (29-dars, 9-pozitsiya)
//
// BIRINCHI MULOHAZA — З59 NING AYNAN O'ZI: |x| ≥ a ning yechimi kesma
// EMAS, u kesmaning TASHQARISI — ikki nur. Kesma esa teskari tengsizlikning
// yechimi.
//
// Ikkinchi mulohaza chegara holi: moduli noldan katta bo'lmagan yagona son
// — nolning o'zi, chunki modul manfiy bo'lmaydi va faqat nolda nolga teng.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'abs_claims', level: '🔴',
  itemSize: 16,
  items: [
    { id: 's1', yes: false,
      tokens: ['|x| ≥ 2'],
      claim: L('yechimi: [−2; 2]', 'решение: [−2; 2]', 'solution: [−2; 2]') },
    { id: 's2', yes: true,
      tokens: ['|x| ≤ 0'],
      claim: L('yagona yechimi: x = 0', 'единственное решение: x = 0', 'the only solution: x = 0') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "Ikki modulli tengsizlik va ular haqida ikki da'vo. Har birini son qo'yib tekshirish mumkin — masalan nolni.",
    'Два неравенства с модулем и два утверждения о них. Каждое можно проверить подстановкой числа — например нуля.',
    'Two inequalities with absolute values and two claims about them. Each can be tested by substituting a number — zero, for instance.'),
  ask: L(
    "Da'vo rost bo'lsa «Ha», yolg'on bo'lsa «Yo'q».",
    'Если утверждение верно — «Да», если ложно — «Нет».',
    'If the claim is true, «Yes»; if false, «No».'),
  correctText: L(
    "To'g'ri. Birinchi da'vo yolg'on: modul ikkidan katta yoki teng degani noldan UZOQ turish, ya'ni javob kesma emas, ikki nur. Nolni qo'ying — u kesmaning o'rtasida, lekin yechim emas. Ikkinchisi rost: modul manfiy bo'lmaydi va faqat nolda nolga teng.",
    'Верно. Первое утверждение ложно: модуль больше или равен двум значит стоять ДАЛЬШЕ от нуля, то есть ответ не отрезок, а два луча. Подставь нуль — он в середине отрезка, но решением не является. Второе верно: модуль отрицательным не бывает и равен нулю только при нуле.',
    'Correct. The first claim is false: absolute value at least two means standing FURTHER from zero, so the answer is not a segment but two rays. Substitute zero — it sits mid-segment yet is no solution. The second is true: an absolute value is never negative and is zero only at zero.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Birinchi da'vo YOLG'ON. Kesma minus ikkidan ikkigacha bo'lgan sonlarni oladi, ya'ni nolga YAQIN turganlarni. Tengsizlik esa aksincha: modul ikkidan katta yoki teng, ya'ni son noldan UZOQ turishi kerak. Nolni tekshiring — u kesmaning o'rtasida turadi, lekin uning moduli nol, va nol ikkidan katta emas. To'g'ri javob ikki nur: kesmaning chap va o'ng tomonidagi sonlar.",
      'Первое утверждение ЛОЖНО. Отрезок берёт числа от минус двух до двух, то есть стоящие БЛИЖЕ к нулю. А неравенство наоборот: модуль больше или равен двум, значит число должно стоять ДАЛЬШЕ от нуля. Проверь нулём — он в середине отрезка, но его модуль нуль, а нуль не больше двух. Верный ответ — два луча: числа слева и справа от отрезка.',
      'The first claim is FALSE. The segment takes the numbers from minus two to two, the ones NEARER zero. The inequality does the opposite: absolute value greater than or equal to two means the number must stand FURTHER from zero. Check with zero — it sits in the middle of the segment, yet its absolute value is zero, and zero is not greater than two. The right answer is two rays: the numbers to the left and to the right of the segment.') },
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
        "Ikkinchi da'vo rost: modul manfiy bo'lmaydi, ya'ni noldan kichik bo'lolmaydi va faqat nolda nolga teng. Shuning uchun yagona yechim — nol.",
        'Второе утверждение верно: модуль отрицательным не бывает, значит меньше нуля быть не может и равен нулю только при нуле. Поэтому единственное решение — нуль.',
        'The second claim is true: an absolute value is never negative, so it cannot be below zero and equals zero only at zero. Hence the only solution is zero.') },
  ],
  wrongText: L(
    "Har da'voni nolni qo'yib tekshiring. «Modul katta yoki teng» noldan UZOQ sonlarni oladi, ya'ni javob kesma emas, ikki nur.",
    'Проверяй каждое утверждение подстановкой нуля. «Модуль больше или равен» берёт числа ДАЛЬШЕ от нуля, значит ответ не отрезок, а два луча.',
    'Test every claim by substituting zero. «Absolute value greater than or equal» takes the numbers FURTHER from zero, so the answer is not a segment but two rays.'),
};

export default function D29_09(props) { return <TrueFalse data={DATA} {...props} />; }
