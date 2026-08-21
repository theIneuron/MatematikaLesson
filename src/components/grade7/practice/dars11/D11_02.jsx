// Dars11 · Amaliyot 02 — Javobni topish · 🟢 · tag: solve_and_answer
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
//
// DARAJA KO'TARILDI (PODXOD_7SINF.md §13): 01-topshiriq bilan bir xil shart,
// sonlar uch va to'rt xonali.
//
// x + 140 = 1250 -> x = 1110. Masalaning JAVOBI ham 1110: «boshida 1110
// o'quvchi bor edi». Tenglamaning ildizi va masalaning javobi bu yerda
// ustma-ust tushadi, lekin har doim shunday bo'lmaydi.
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'solve_and_answer', level: '🟢', allowNeg: false, target: 1110,
  eyebrow: L('Masalaning javobi', 'Ответ задачи', "The problem's answer"),
  setup: L(
    "Maktabda x nafar o'quvchi bor edi, yana 140 nafari keldi va 1250 nafar bo'ldi. Tenglama tuzildi: x + 140 = 1250.",
    'В школе было x учеников, пришли ещё 140, и стало 1250. Уравнение составлено: x + 140 = 1250.',
    'A school had x pupils, another 140 came and there were 1250. The equation is set up: x + 140 = 1250.'),
  expr: ['x', '+', '140', '=', '1250'], exprSize: 30,
  label: L("Boshida nechta o'quvchi bor edi?", 'Сколько учеников было сначала?', 'How many pupils were there at first?'),
  correctText: L(
    "To'g'ri. x = 1250 − 140 = 1110. Tekshirish: 1110 + 140 = 1250, ya'ni masala sharti bajarildi.",
    'Верно. x = 1250 − 140 = 1110. Проверка: 1110 + 140 = 1250, условие задачи выполнено.',
    'Correct. x = 1250 − 140 = 1110. Check: 1110 + 140 = 1250, the problem holds.'),
  wrongs: [
    { when: (s) => s.value === 1390, text: L(
      "1390 chiqishi uchun 140 qo'shilgan. Tenglamada esa 140 allaqachon qo'shilgan, ya'ni uni AYIRISH kerak.",
      'Чтобы вышло 1390, 140 прибавили. А в уравнении они уже прибавлены, значит их надо ВЫЧЕСТЬ.',
      'To get 1390 the 140 was added. In the equation it is already added, so it must be TAKEN AWAY.') },
    { when: (s) => s.value === 1250, text: L(
      "1250 bu OXIRIDA bo'lgan son. Savol esa boshida nechta bo'lgani haqida.",
      '1250 это число В КОНЦЕ. А вопрос про то, сколько было сначала.',
      '1250 is the number AT THE END. The question asks how many there were at first.') },
  ],
  wrongText: L(
    "Tenglamadan x ni toping: 140 ni o'ng tomonga ko'chirsa u ayiriladi.",
    'Найди x из уравнения: при переносе 140 в правую часть они вычитаются.',
    'Find x from the equation: moving the 140 to the right subtracts it.'),
};

export default function D11_02(props) { return <TypeValue data={DATA} {...props} />; }
