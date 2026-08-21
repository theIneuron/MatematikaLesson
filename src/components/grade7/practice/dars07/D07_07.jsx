// Dars07 · Amaliyot 07 — Manfiy ko'paytuvchi · 🔴 · tag: root_negative_coef
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
//
// −5x = 45. Noma'lum ko'paytuvchi: x = 45 : (−5) = −9.
// Tekshirish: −5 · (−9) = 45.
// Xato javoblar: 9 (ishorani hisobga olmagan, −5 · 9 = −45), −225 va 225
// (bo'lish o'rniga ko'paytirgan).
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'root_negative_coef', level: '🔴', allowNeg: true, target: -9,
  eyebrow: L("Manfiy ko'paytuvchi", 'Отрицательный множитель', 'A negative factor'),
  setup: L(
    "Noma'lum ko'paytuvchini topish uchun ko'paytmani ma'lum ko'paytuvchiga bo'lamiz. Ishorani ham hisobga olish kerak.",
    'Чтобы найти неизвестный множитель, произведение делят на известный множитель. Знак тоже надо учесть.',
    'To find an unknown factor, divide the product by the known factor. The sign counts too.'),
  expr: ['−5x', '=', '45'], exprSize: 34,
  label: L('Ildizni yozing:', 'Запиши корень:', 'Write the root:'),
  correctText: L(
    "To'g'ri. x = 45 : (−5) = −9. Tekshiramiz: −5 · (−9) = 45, ya'ni ikki manfiy son musbat ko'paytma berdi.",
    'Верно. x = 45 : (−5) = −9. Проверяем: −5 · (−9) = 45, два отрицательных дали положительное произведение.',
    'Correct. x = 45 : (−5) = −9. Check: −5 · (−9) = 45 — two negatives gave a positive product.'),
  wrongs: [
    { when: (s) => s.value === 9, text: L(
      "Tekshiring: −5 · 9 = −45, o'ng tomonda esa musbat 45. Ko'paytuvchi manfiy bo'lgani uchun ildiz ham manfiy.",
      'Проверь: −5 · 9 = −45, а справа положительное 45. Множитель отрицательный, значит и корень отрицательный.',
      'Check: −5 · 9 = −45, but the right side is positive 45. The factor is negative, so the root is negative too.') },
    { when: (s) => s.value === -225 || s.value === 225, text: L(
      "Ko'paytirish o'rniga BO'LISH kerak: noma'lum ko'paytuvchi ko'paytmani ma'lumiga bo'lib topiladi.",
      'Нужно ДЕЛЕНИЕ, а не умножение: неизвестный множитель находят делением произведения на известный.',
      'It needs a DIVISION, not a multiplication: an unknown factor is found by dividing the product by the known one.') },
    { when: (s) => s.value === -40 || s.value === 50, text: L(
      "−5x bu −5 · x, ya'ni ko'paytirish. Qo'shish yoki ayirish emas.",
      '−5x это −5 · x, то есть умножение. Не сложение и не вычитание.',
      '−5x means −5 · x, a multiplication. Not an addition or a subtraction.') },
  ],
  wrongText: L(
    "45 ni −5 ga bo'ling. Ikki son bir xil ishorada bo'lsa bo'linma musbat, har xil bo'lsa manfiy.",
    'Раздели 45 на −5. Если знаки одинаковые, частное положительное, если разные — отрицательное.',
    'Divide 45 by −5. Like signs give a positive quotient, unlike signs a negative one.'),
};

export default function D07_07(props) { return <TypeValue data={DATA} {...props} />; }
