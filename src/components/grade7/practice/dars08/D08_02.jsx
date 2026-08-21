// Dars08 · Amaliyot 02 — Bir qadamli tenglama · 🟢 · tag: one_step
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
//
// x − 8 = −3. Bir qadam: 8 ni o'ng tomonga ko'chiramiz, ishorasi o'zgaradi:
//   x = −3 + 8 = 5
// Tekshirish: 5 − 8 = −3.
// Eng ko'p uchraydigan xato: −11 (8 ni ayirgan) va −3 (hech narsa
// qilmagan).
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'one_step', level: '🟢', allowNeg: true, target: 5,
  eyebrow: L('Bir qadam', 'Один шаг', 'One step'),
  setup: L(
    "Hadni tenglamaning bir tomonidan ikkinchisiga ko'chirsa, uning ishorasi o'zgaradi. Bitta ko'chirishdan keyin ildiz ko'rinadi.",
    'Если перенести слагаемое из одной части уравнения в другую, его знак меняется. После одного переноса корень виден.',
    'Moving a term from one side of the equation to the other flips its sign. After one move the root is visible.'),
  expr: ['x', '−', '8', '=', '−3'], exprSize: 32,
  label: L('Ildizni yozing:', 'Запиши корень:', 'Write the root:'),
  correctText: L(
    "To'g'ri. 8 ni o'ng tomonga ko'chirdik va u qo'shiluvchiga aylandi: x = −3 + 8 = 5. Tekshirish: 5 − 8 = −3.",
    'Верно. Перенесли 8 в правую часть, и она стала прибавляться: x = −3 + 8 = 5. Проверка: 5 − 8 = −3.',
    'Correct. The 8 moved to the right side and became an addition: x = −3 + 8 = 5. Check: 5 − 8 = −3.'),
  wrongs: [
    { when: (s) => s.value === -11, text: L(
      "Ko'chirishda ishora o'zgaradi: chap tomonda 8 AYIRILGAN edi, o'ng tomonda esa QO'SHILADI. x = −3 + 8.",
      'При переносе знак меняется: слева 8 ВЫЧИТАЛАСЬ, значит справа она ПРИБАВЛЯЕТСЯ. x = −3 + 8.',
      'Moving flips the sign: on the left the 8 was SUBTRACTED, so on the right it is ADDED. x = −3 + 8.') },
    { when: (s) => s.value === -3, text: L(
      "−3 bu tenglamaning o'ng tomoni, ildiz emas: chap tomonda x dan tashqari 8 ham turibdi.",
      '−3 это правая часть уравнения, а не корень: слева кроме x стоит ещё 8.',
      '−3 is the right side of the equation, not the root: besides x there is also an 8 on the left.') },
    { when: (s) => s.value === 11, text: L(
      "Ishoralarni tekshiring: −3 va 8 ni qo'shsak 5 chiqadi, 11 emas.",
      'Проверь знаки: −3 и 8 в сумме дают 5, а не 11.',
      'Check the signs: −3 and 8 add up to 5, not 11.') },
  ],
  wrongText: L(
    "Topilgan sonni tenglamaga qo'yib ko'ring: undan 8 ayirilganda −3 chiqishi kerak.",
    'Подставь найденное число в уравнение: при вычитании 8 из него должно получиться −3.',
    'Put your number into the equation: taking 8 from it must give −3.'),
};

export default function D08_02(props) { return <TypeValue data={DATA} {...props} />; }
