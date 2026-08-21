// Dars12 · Amaliyot 02 — Tezlikni topish · 🟢 · tag: find_speed
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
//
// 3x = 180 -> x = 60. Javob: tezlik 60 km/soat.
// Xato javoblar: 540 (ko'paytirgan), 183 (qo'shgan).
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'find_speed', level: '🟢', allowNeg: false, target: 60,
  eyebrow: L('Tezlikni topish', 'Найти скорость', 'Find the speed'),
  setup: L(
    "Avtobus 3 soat yurib 180 km bosdi. Tenglama tuzildi: 3x = 180.",
    'Автобус за 3 часа прошёл 180 км. Уравнение составлено: 3x = 180.',
    'The bus covered 180 km in 3 hours. The equation is set up: 3x = 180.'),
  expr: ['3x', '=', '180'], exprSize: 32,
  label: L("Tezlik qancha (km/soat)?", 'Какова скорость (км/ч)?', 'What is the speed (km/h)?'),
  correctText: L(
    "To'g'ri. x = 180 : 3 = 60. Tekshirish: 3 soat · 60 km/soat = 180 km.",
    'Верно. x = 180 : 3 = 60. Проверка: 3 часа · 60 км/ч = 180 км.',
    'Correct. x = 180 : 3 = 60. Check: 3 hours · 60 km/h = 180 km.'),
  wrongs: [
    { when: (s) => s.value === 540, text: L(
      "540 chiqishi uchun 180 ni 3 ga ko'paytirgansiz. Noma'lum ko'paytuvchini topish uchun esa BO'LISH kerak.",
      'Чтобы вышло 540, 180 умножили на 3. А неизвестный множитель находят ДЕЛЕНИЕМ.',
      'To get 540 the 180 was multiplied by 3. An unknown factor is found by DIVIDING.') },
    { when: (s) => s.value === 183 || s.value === 177, text: L(
      "Bu yerda qo'shish yoki ayirish yo'q: 3x bu 3 · x, ya'ni ko'paytirish.",
      'Здесь нет сложения и вычитания: 3x это 3 · x, то есть умножение.',
      'There is no addition or subtraction here: 3x means 3 · x, a multiplication.') },
  ],
  wrongText: L(
    "180 ni 3 ga bo'ling: bir soatda qancha km bosilgani chiqadi.",
    'Раздели 180 на 3: выйдет, сколько километров пройдено за один час.',
    'Divide 180 by 3: that gives the kilometres covered in one hour.'),
};

export default function D12_02(props) { return <TypeValue data={DATA} {...props} />; }
