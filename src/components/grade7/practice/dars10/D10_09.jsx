// Dars10 · Amaliyot 09 — Musbat ildizni topish · 🔴 · tag: mod_positive_root
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
//
// |x + 6| = 10. Ikki holat:
//   x + 6 = 10   -> x = 4    (musbat ildiz)
//   x + 6 = −10  -> x = −16
// So'raladigan javob -- MUSBAT ildiz, ya'ni 4. Ikkinchi ildizni ham topib
// ko'rish kerak, aks holda «qaysi biri musbat» degan savol ma'nosini
// yo'qotadi.
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'mod_positive_root', level: '🔴', allowNeg: true, target: 4,
  eyebrow: L('Musbat ildiz', 'Положительный корень', 'The positive root'),
  setup: L(
    "Bu tenglamaning ikki ildizi bor. Ikkovini ham toping, keyin MUSBAT bo'lganini yozing.",
    'У этого уравнения два корня. Найди оба, а запиши ПОЛОЖИТЕЛЬНЫЙ.',
    'This equation has two roots. Find both and write down the POSITIVE one.'),
  expr: ['|x', '+', '6|', '=', '10'], exprSize: 32,
  label: L('Musbat ildizni yozing:', 'Запиши положительный корень:', 'Write the positive root:'),
  correctText: L(
    "To'g'ri. x + 6 = 10 dan x = 4. Ikkinchi holat x + 6 = −10 dan x = −16 beradi, u manfiy.",
    'Верно. Из x + 6 = 10 выходит x = 4. Второй случай x + 6 = −10 даёт x = −16, он отрицательный.',
    'Correct. From x + 6 = 10 you get x = 4. The second case x + 6 = −10 gives x = −16, which is negative.'),
  wrongs: [
    { when: (s) => s.value === -16, text: L(
      "−16 ham ildiz, lekin u MANFIY. Ikkinchi holatdan chiqqan musbat ildizni yozish kerak: x = 4.",
      '−16 тоже корень, но он ОТРИЦАТЕЛЬНЫЙ. Нужно записать положительный: x = 4.',
      '−16 is a root too, but it is NEGATIVE. The positive one is needed: x = 4.') },
    { when: (s) => s.value === 16, text: L(
      "Ishorani tekshiring: x + 6 = 10 dan x = 10 − 6 = 4. 16 chiqishi uchun 6 qo'shilgan.",
      'Проверь знак: из x + 6 = 10 выходит x = 10 − 6 = 4. Чтобы вышло 16, шестёрку прибавили.',
      'Check the sign: from x + 6 = 10 you get x = 10 − 6 = 4. To get 16 the six was added.') },
    { when: (s) => s.value === 10, text: L(
      "10 bu o'ng tomon, ildiz emas: modul ichida x dan tashqari 6 ham turibdi.",
      '10 это правая часть, а не корень: под модулем кроме x стоит ещё 6.',
      '10 is the right side, not the root: besides x there is also a 6 under the modulus.') },
  ],
  wrongText: L(
    "Ikki holatni yozing: x + 6 = 10 va x + 6 = −10. Birinchisi musbat ildiz beradi.",
    'Запиши два случая: x + 6 = 10 и x + 6 = −10. Первый даёт положительный корень.',
    'Write the two cases: x + 6 = 10 and x + 6 = −10. The first gives the positive root.'),
};

export default function D10_09(props) { return <TypeValue data={DATA} {...props} />; }
