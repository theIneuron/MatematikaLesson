// Dars25 · Amaliyot 09 — Ha yoki yo'q · 🔴 · tag: solution_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §7 (25-dars, 9-pozitsiya)
//
// BIRINCHI MULOHAZA — З52 NING TO'G'RI NAMUNASI: manfiy songa bo'lish
// bajarilgan VA ishora burilgan. Uni «xato» deb belgilash ham xato:
// o'quvchi «burilgan bo'lsa, demak noto'g'ri» degan naqshni yodlab
// qolmasligi kerak.
//
// Ikkinchi mulohazada ikki xato birga: yetti yechim emas (qat'iy
// tengsizlik, З54), va bunday tengsizlikning eng katta yechimi UMUMAN yo'q —
// har qanday sondan keyin yana kattarog'i topiladi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'solution_claims', level: '🔴',
  itemSize: 15,
  items: [
    { id: 's1', yes: true,
      tokens: ['−4x ≤ 12'],
      claim: L('yechimi: x ≥ −3', 'решение: x ≥ −3', 'solution: x ≥ −3') },
    { id: 's2', yes: true,
      tokens: ['x ≤ 7'],
      claim: L('eng katta yechimi: 7', 'наибольшее решение: 7', 'the largest solution: 7') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "Ikki tengsizlik va ular haqida ikki da'vo. Har birini son qo'yib tekshirish mumkin.",
    'Два неравенства и два утверждения о них. Каждое можно проверить подстановкой числа.',
    'Two inequalities and two claims about them. Each can be tested by substituting a number.'),
  ask: L(
    "Da'vo rost bo'lsa «Ha», yolg'on bo'lsa «Yo'q».",
    'Если утверждение верно — «Да», если ложно — «Нет».',
    'If the claim is true, «Yes»; if false, «No».'),
  correctText: L(
    "To'g'ri. Birinchisida minus to'rtga bo'lindi va ishora burildi — yozuv to'g'ri. Ikkinchisida belgi qat'iy emas, ya'ni yettining o'zi ham yechim va u eng kattasi. Belgi qat'iy bo'lganida eng katta yechim umuman bo'lmasdi.",
    'Верно. В первом поделили на минус четыре и перевернули знак — запись верна. Во втором знак нестрогий, значит сама семёрка тоже решение и она наибольшая. Будь знак строгим, наибольшего решения не было бы вовсе.',
    'Correct. In the first they divided by minus four and flipped the sign — the record is right. In the second the sign is not strict, so seven itself is a solution and it is the largest. Were the sign strict, there would be no largest solution at all.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
        "Birinchi yozuv TO'G'RI: bo'luvchi manfiy, ya'ni ishora burilishi shart edi — va u burilgan. Tekshiring: x nol bo'lsa nol o'n ikkidan kichik, va nol minus uchdan katta.",
        'Первая запись ВЕРНА: делитель отрицателен, значит знак обязан был перевернуться — и он перевёрнут. Проверь: при x равном нулю нуль меньше двенадцати, и нуль больше минус трёх.',
        'The first record is RIGHT: the divisor is negative, so the sign had to flip — and it did. Check: at x equal to zero, zero is less than twelve and zero is greater than minus three.') },
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
        "Ikkinchi da'vo rost: belgi qat'iy emas, ya'ni yetti ham yechim va u eng kattasi. Belgi qat'iy bo'lganida yetti yechim bo'lmasdi va eng katta yechim umuman topilmasdi.",
        'Второе утверждение верно: знак нестрогий, значит семь тоже решение и оно наибольшее. Будь знак строгим, семь решением бы не было, и наибольшего решения не нашлось бы вовсе.',
        'The second claim is true: the sign is not strict, so seven is a solution and it is the largest. Were the sign strict, seven would not be a solution and no largest solution would exist.') },
  ],
  wrongText: L(
    "Har da'voni son qo'yib tekshiring. Manfiy songa bo'lganda ishora burilishi SHART. Qat'iy tengsizlikda chegara yechim emas, va eng katta yechim ham bo'lmaydi.",
    'Проверяй каждое утверждение подстановкой. При делении на отрицательное знак ОБЯЗАН перевернуться. В строгом неравенстве граница решением не является, и наибольшего решения тоже нет.',
    'Test every claim by substitution. When dividing by a negative the sign MUST flip. In a strict inequality the boundary is not a solution, and there is no largest solution either.'),
};

export default function D25_09(props) { return <TrueFalse data={DATA} {...props} />; }
