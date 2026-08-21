// Dars10 · Amaliyot 04 — Modul nolga teng · 🟡 · tag: mod_zero
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
//
// |x − 7| = 0. Modul faqat NOLNING moduli nol bo'lganda nolga teng, ya'ni
//   x − 7 = 0  ->  x = 7
// Bu yerda ildiz BITTA -- ikki holat ustma-ust tushadi, chunki 0 va −0 bir
// xil son. Darsning nozik joyi: «modul bo'lsa har doim ikki ildiz» degan
// odat shu misolda buziladi.
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'mod_zero', level: '🟡', allowNeg: true, target: 7,
  eyebrow: L('Modul nolga teng', 'Модуль равен нулю', 'The modulus is zero'),
  setup: L(
    "Modul faqat bitta holatda nolga teng: ichidagi ifodaning o'zi nol bo'lganda. Nolning qarama-qarshisi ham nol.",
    'Модуль равен нулю только в одном случае: когда само выражение под ним равно нулю. Противоположное нулю — тоже нуль.',
    'A modulus is zero only in one case: when the expression inside is itself zero. The opposite of zero is zero as well.'),
  expr: ['|x', '−', '7|', '=', '0'], exprSize: 32,
  label: L('Ildizni yozing:', 'Запиши корень:', 'Write the root:'),
  correctText: L(
    "To'g'ri. x − 7 = 0, ya'ni x = 7. Bu tenglamaning ildizi BITTA: ikki holat ustma-ust tushdi.",
    'Верно. x − 7 = 0, то есть x = 7. У этого уравнения ОДИН корень: два случая совпали.',
    'Correct. x − 7 = 0, so x = 7. This equation has ONE root: the two cases coincided.'),
  wrongs: [
    { when: (s) => s.value === -7, text: L(
      "Ishorani tekshiring: x − 7 = 0 dan x = 7 chiqadi. Manfiy son bu yerda ildiz emas: |−7 − 7| = 14.",
      'Проверь знак: из x − 7 = 0 выходит x = 7. Отрицательное число здесь не корень: |−7 − 7| = 14.',
      'Check the sign: x − 7 = 0 gives x = 7. The negative is not a root here: |−7 − 7| = 14.') },
    { when: (s) => s.value === 0, text: L(
      "0 ni qo'yib ko'ring: |0 − 7| = 7, nol emas. Modul ichidagi ifodaning O'ZI nolga aylanishi kerak.",
      'Подставь 0: |0 − 7| = 7, а не нуль. Нулём должно стать САМО выражение под модулем.',
      'Try 0: |0 − 7| = 7, not zero. The expression under the modulus itself must become zero.') },
  ],
  wrongText: L(
    "Modul ichidagi ifodani nolga tenglashtiring: x − 7 = 0.",
    'Приравняй выражение под модулем к нулю: x − 7 = 0.',
    'Set the expression under the modulus equal to zero: x − 7 = 0.'),
};

export default function D10_04(props) { return <TypeValue data={DATA} {...props} />; }
