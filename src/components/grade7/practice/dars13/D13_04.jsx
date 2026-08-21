// Dars13 · Amaliyot 04 — Manfiy asos · 🟡 · tag: negative_base
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
//
// DARAJA KO'TARILDI (PODXOD_7SINF.md §13): javob to'rt xonali.
//
// (−4)⁵ = −1024. Manfiy asos BESH marta ko'paytiriladi, ya'ni minuslar soni
// beshta -- toq son. Toq sondagi minus musbatga aylanmaydi:
//   (−4)(−4) = 16, · (−4) = −64, · (−4) = 256, · (−4) = −1024
// Xato javob: 1024 (ishorasiz), −20 (4 · 5), −256 (bir ko'paytuvchi kam).
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'negative_base', level: '🟡', allowNeg: true, target: -1024,
  eyebrow: L('Manfiy asos', 'Отрицательное основание', 'A negative base'),
  setup: L(
    "Qavs ichidagi manfiy son butunligi bilan ko'paytuvchi bo'ladi. Minuslar soni juft bo'lsa natija musbat, toq bo'lsa manfiy.",
    'Отрицательное число в скобках целиком становится множителем. Если минусов чётное число — результат положительный, если нечётное — отрицательный.',
    'The negative number in brackets becomes the factor as a whole. An even number of minuses gives a positive result, an odd number a negative one.'),
  expr: ['(−4)⁵'], exprSize: 38,
  label: L('Qiymatni yozing:', 'Запиши значение:', 'Write the value:'),
  correctText: L(
    "To'g'ri. Beshta ko'paytuvchi, ya'ni beshta minus -- toq son. 4⁵ = 1024, ishora manfiy: −1024.",
    'Верно. Пять множителей, значит пять минусов — число нечётное. 4⁵ = 1024, знак отрицательный: −1024.',
    'Correct. Five factors mean five minuses — an odd number. 4⁵ = 1024 and the sign is negative: −1024.'),
  wrongs: [
    { when: (s) => s.value === 1024, text: L(
      "Ishorani tekshiring: minuslar soni beshta, ya'ni TOQ. Toq sondagi minus musbat bermaydi.",
      'Проверь знак: минусов пять, то есть НЕЧЁТНОЕ число. Нечётное число минусов не даёт плюс.',
      'Check the sign: there are five minuses, an ODD number. An odd number of minuses does not give a plus.') },
    { when: (s) => s.value === -20 || s.value === 20, text: L(
      "Ko'rsatkich ko'paytuvchi emas: (−4)⁵ bu minus to'rtni besh marta ko'paytirish, −4 · 5 emas.",
      'Показатель не множитель: (−4)⁵ это минус четыре, умноженное само на себя пять раз, а не −4 · 5.',
      'The exponent is not a factor: (−4)⁵ means minus four multiplied by itself five times, not −4 · 5.') },
    { when: (s) => s.value === -256 || s.value === 256, text: L(
      "Ko'paytuvchilarni sanang: beshta bo'lishi kerak. 256 esa to'rttasidan chiqadi.",
      'Посчитай множители: их должно быть пять. А 256 выходит из четырёх.',
      'Count the factors: there must be five. The 256 comes from four.') },
  ],
  wrongText: L(
    "Avval 4⁵ ni hisoblang, keyin ishorani qo'ying: minuslar soni toq bo'lsa javob manfiy.",
    'Сначала посчитай 4⁵, потом поставь знак: при нечётном числе минусов ответ отрицательный.',
    'First work out 4⁵, then set the sign: an odd number of minuses makes the answer negative.'),
};

export default function D13_04(props) { return <TypeValue data={DATA} {...props} />; }
