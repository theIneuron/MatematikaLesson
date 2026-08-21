// Dars08 · Amaliyot 02 — Bir qadamli tenglama · 🟢 · tag: one_step
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
//
// DARAJA KO'TARILDI (PODXOD_7SINF.md §13): sonlar uch xonali, o'ng tomon
// esa manfiy.
//
// x − 850 = −300. Bir qadam: 850 ni o'ng tomonga ko'chiramiz, ishorasi
// o'zgaradi:
//   x = −300 + 850 = 550
// Tekshirish: 550 − 850 = −300.
// Eng ko'p uchraydigan xato: −1150 (850 ni ayirgan) va −300 (hech narsa
// qilmagan).
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'one_step', level: '🟢', allowNeg: true, target: 550,
  eyebrow: L('Bir qadam', 'Один шаг', 'One step'),
  setup: L(
    "Hadni tenglamaning bir tomonidan ikkinchisiga ko'chirsa, uning ishorasi o'zgaradi. Bitta ko'chirishdan keyin ildiz ko'rinadi.",
    'Если перенести слагаемое из одной части уравнения в другую, его знак меняется. После одного переноса корень виден.',
    'Moving a term from one side of the equation to the other flips its sign. After one move the root is visible.'),
  expr: ['x', '−', '850', '=', '−300'], exprSize: 30,
  label: L('Ildizni yozing:', 'Запиши корень:', 'Write the root:'),
  correctText: L(
    "To'g'ri. 850 ni o'ng tomonga ko'chirdik va u qo'shiluvchiga aylandi: x = −300 + 850 = 550. Tekshirish: 550 − 850 = −300.",
    'Верно. Перенесли 850 в правую часть, и она стала прибавляться: x = −300 + 850 = 550. Проверка: 550 − 850 = −300.',
    'Correct. The 850 moved to the right side and became an addition: x = −300 + 850 = 550. Check: 550 − 850 = −300.'),
  wrongs: [
    { when: (s) => s.value === -1150, text: L(
      "Ko'chirishda ishora o'zgaradi: chap tomonda 850 AYIRILGAN edi, o'ng tomonda esa QO'SHILADI. x = −300 + 850.",
      'При переносе знак меняется: слева 850 ВЫЧИТАЛАСЬ, значит справа она ПРИБАВЛЯЕТСЯ. x = −300 + 850.',
      'Moving flips the sign: on the left the 850 was SUBTRACTED, so on the right it is ADDED. x = −300 + 850.') },
    { when: (s) => s.value === -300, text: L(
      "−300 bu tenglamaning o'ng tomoni, ildiz emas: chap tomonda x dan tashqari 850 ham turibdi.",
      '−300 это правая часть уравнения, а не корень: слева кроме x стоит ещё 850.',
      '−300 is the right side of the equation, not the root: besides x there is also an 850 on the left.') },
    { when: (s) => s.value === 1150, text: L(
      "Ishoralarni tekshiring: −300 va 850 ni qo'shsak 550 chiqadi, 1150 emas.",
      'Проверь знаки: −300 и 850 в сумме дают 550, а не 1150.',
      'Check the signs: −300 and 850 add up to 550, not 1150.') },
  ],
  wrongText: L(
    "Topilgan sonni tenglamaga qo'yib ko'ring: undan 850 ayirilganda −300 chiqishi kerak.",
    'Подставь найденное число в уравнение: при вычитании 850 из него должно получиться −300.',
    'Put your number into the equation: taking 850 from it must give −300.'),
};

export default function D08_02(props) { return <TypeValue data={DATA} {...props} />; }
