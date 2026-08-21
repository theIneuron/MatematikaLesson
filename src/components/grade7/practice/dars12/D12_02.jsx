// Dars12 · Amaliyot 02 — Tezlikni topish · 🟢 · tag: find_speed
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
//
// DARAJA KO'TARILDI (PODXOD_7SINF.md §13): 01-topshiriq bilan bir xil shart,
// yo'l uch xonali.
//
// 4x = 340 -> x = 85. Javob: tezlik 85 km/soat.
// Xato javoblar: 1360 (ko'paytirgan), 344 va 336 (qo'shgan yoki ayirgan).
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'find_speed', level: '🟢', allowNeg: false, target: 85,
  eyebrow: L('Tezlikni topish', 'Найти скорость', 'Find the speed'),
  setup: L(
    "Avtobus 4 soat yurib 340 km bosdi. Tenglama tuzildi: 4x = 340.",
    'Автобус за 4 часа прошёл 340 км. Уравнение составлено: 4x = 340.',
    'The bus covered 340 km in 4 hours. The equation is set up: 4x = 340.'),
  expr: ['4x', '=', '340'], exprSize: 32,
  label: L("Tezlik qancha (km/soat)?", 'Какова скорость (км/ч)?', 'What is the speed (km/h)?'),
  correctText: L(
    "To'g'ri. x = 340 : 4 = 85. Tekshirish: 4 soat · 85 km/soat = 340 km.",
    'Верно. x = 340 : 4 = 85. Проверка: 4 часа · 85 км/ч = 340 км.',
    'Correct. x = 340 : 4 = 85. Check: 4 hours · 85 km/h = 340 km.'),
  wrongs: [
    { when: (s) => s.value === 1360, text: L(
      "1360 chiqishi uchun 340 ni 4 ga ko'paytirgansiz. Noma'lum ko'paytuvchini topish uchun esa BO'LISH kerak.",
      'Чтобы вышло 1360, 340 умножили на 4. А неизвестный множитель находят ДЕЛЕНИЕМ.',
      'To get 1360 the 340 was multiplied by 4. An unknown factor is found by DIVIDING.') },
    { when: (s) => s.value === 344 || s.value === 336, text: L(
      "Bu yerda qo'shish yoki ayirish yo'q: 4x bu 4 · x, ya'ni ko'paytirish.",
      'Здесь нет сложения и вычитания: 4x это 4 · x, то есть умножение.',
      'There is no addition or subtraction here: 4x means 4 · x, a multiplication.') },
  ],
  wrongText: L(
    "340 ni 4 ga bo'ling: bir soatda qancha km bosilgani chiqadi.",
    'Раздели 340 на 4: выйдет, сколько километров пройдено за один час.',
    'Divide 340 by 4: that gives the kilometres covered in one hour.'),
};

export default function D12_02(props) { return <TypeValue data={DATA} {...props} />; }
