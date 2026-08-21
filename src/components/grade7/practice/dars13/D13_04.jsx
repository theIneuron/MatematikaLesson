// Dars13 · Amaliyot 04 — Manfiy asos · 🟡 · tag: negative_base
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
//
// (−2)⁵ = −32. Manfiy asos BESH marta ko'paytiriladi, ya'ni minuslar soni
// beshta -- toq son. Toq sondagi minus musbatga aylanmaydi:
//   (−2)(−2) = 4, · (−2) = −8, · (−2) = 16, · (−2) = −32
// Xato javob: 32 (ishorani hisobga olmagan) va −10 (2 · 5).
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'negative_base', level: '🟡', allowNeg: true, target: -32,
  eyebrow: L('Manfiy asos', 'Отрицательное основание', 'A negative base'),
  setup: L(
    "Qavs ichidagi manfiy son butunligi bilan ko'paytuvchi bo'ladi. Minuslar soni juft bo'lsa natija musbat, toq bo'lsa manfiy.",
    'Отрицательное число в скобках целиком становится множителем. Если минусов чётное число — результат положительный, если нечётное — отрицательный.',
    'The negative number in brackets becomes the factor as a whole. An even number of minuses gives a positive result, an odd number a negative one.'),
  expr: ['(−2)⁵'], exprSize: 38,
  label: L('Qiymatni yozing:', 'Запиши значение:', 'Write the value:'),
  correctText: L(
    "To'g'ri. Beshta ko'paytuvchi, ya'ni beshta minus -- toq son. 2⁵ = 32, ishora manfiy: −32.",
    'Верно. Пять множителей, значит пять минусов — число нечётное. 2⁵ = 32, знак отрицательный: −32.',
    'Correct. Five factors mean five minuses — an odd number. 2⁵ = 32 and the sign is negative: −32.'),
  wrongs: [
    { when: (s) => s.value === 32, text: L(
      "Ishorani tekshiring: minuslar soni beshta, ya'ni TOQ. Toq sondagi minus musbat bermaydi.",
      'Проверь знак: минусов пять, то есть НЕЧЁТНОЕ число. Нечётное число минусов не даёт плюс.',
      'Check the sign: there are five minuses, an ODD number. An odd number of minuses does not give a plus.') },
    { when: (s) => s.value === -10 || s.value === 10, text: L(
      "Ko'rsatkich ko'paytuvchi emas: (−2)⁵ bu minus ikkini besh marta ko'paytirish, −2 · 5 emas.",
      'Показатель не множитель: (−2)⁵ это минус два, умноженное само на себя пять раз, а не −2 · 5.',
      'The exponent is not a factor: (−2)⁵ means minus two multiplied by itself five times, not −2 · 5.') },
    { when: (s) => s.value === -16 || s.value === 16, text: L(
      "Ko'paytuvchilarni sanang: beshta bo'lishi kerak. 16 esa to'rttasidan chiqadi.",
      'Посчитай множители: их должно быть пять. А 16 выходит из четырёх.',
      'Count the factors: there must be five. The 16 comes from four.') },
  ],
  wrongText: L(
    "Avval 2⁵ ni hisoblang, keyin ishorani qo'ying: minuslar soni toq bo'lsa javob manfiy.",
    'Сначала посчитай 2⁵, потом поставь знак: при нечётном числе минусов ответ отрицательный.',
    'First work out 2⁵, then set the sign: an odd number of minuses makes the answer negative.'),
};

export default function D13_04(props) { return <TypeValue data={DATA} {...props} />; }
