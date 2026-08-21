// Dars11 · Amaliyot 02 — Javobni topish · 🟢 · tag: solve_and_answer
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
//
// x + 4 = 27 -> x = 23. Masalaning JAVOBI ham 23: «boshida 23 o'quvchi bor
// edi». Tenglamaning ildizi va masalaning javobi bu yerda ustma-ust tushadi,
// lekin har doim shunday bo'lmaydi -- keyingi topshiriqlarda ko'rinadi.
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'solve_and_answer', level: '🟢', allowNeg: false, target: 23,
  eyebrow: L('Masalaning javobi', 'Ответ задачи', "The problem's answer"),
  setup: L(
    "Sinfda x nafar o'quvchi bor edi, yana 4 nafari keldi va 27 nafar bo'ldi. Tenglama tuzildi: x + 4 = 27.",
    'В классе было x учеников, пришли ещё 4, и стало 27. Уравнение составлено: x + 4 = 27.',
    'A class had x pupils, another 4 came and there were 27. The equation is set up: x + 4 = 27.'),
  expr: ['x', '+', '4', '=', '27'], exprSize: 30,
  label: L("Boshida nechta o'quvchi bor edi?", 'Сколько учеников было сначала?', 'How many pupils were there at first?'),
  correctText: L(
    "To'g'ri. x = 27 − 4 = 23. Tekshirish: 23 + 4 = 27, ya'ni masala sharti bajarildi.",
    'Верно. x = 27 − 4 = 23. Проверка: 23 + 4 = 27, условие задачи выполнено.',
    'Correct. x = 27 − 4 = 23. Check: 23 + 4 = 27, the problem holds.'),
  wrongs: [
    { when: (s) => s.value === 31, text: L(
      "31 chiqishi uchun 4 qo'shilgan. Tenglamada esa 4 allaqachon qo'shilgan, ya'ni uni AYIRISH kerak.",
      'Чтобы вышло 31, четвёрку прибавили. А в уравнении она уже прибавлена, значит её надо ВЫЧЕСТЬ.',
      'To get 31 the four was added. In the equation it is already added, so it must be TAKEN AWAY.') },
    { when: (s) => s.value === 27, text: L(
      "27 bu OXIRIDA bo'lgan son. Savol esa boshida nechta bo'lgani haqida.",
      '27 это число В КОНЦЕ. А вопрос про то, сколько было сначала.',
      '27 is the number AT THE END. The question asks how many there were at first.') },
  ],
  wrongText: L(
    "Tenglamadan x ni toping: 4 ni o'ng tomonga ko'chirsa u ayiriladi.",
    'Найди x из уравнения: при переносе 4 в правую часть она вычитается.',
    'Find x from the equation: moving the 4 to the right subtracts it.'),
};

export default function D11_02(props) { return <TypeValue data={DATA} {...props} />; }
