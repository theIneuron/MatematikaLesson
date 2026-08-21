// Dars32 · Amaliyot 01 — Qisqartirish mumkinmi · 🟢 · choice · tag: frac_can_cancel
// Mexanika: kit.jsx -> Choice. Raskladka: 32-dars, 1-o'rin (isinish).
// (x + 3) : 3 ni 3 ga qisqartirib bo'lmaydi: x qo'shiluvchi, ko'paytuvchi emas.
// Qisqartirish faqat KO'PAYTUVCHI bo'yicha ishlaydi.
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'frac_can_cancel', level: '🟢',
  eyebrow: L('Qisqartirish', 'Сокращение', 'Cancelling'),
  setup: L(
    "Qisqartirish faqat ko'paytuvchi bo'yicha ishlaydi. Yig'indining bir hadini qisqartirish -- eng ko'p uchraydigan xato.",
    'Сокращать можно только на множитель. Сократить одно слагаемое суммы — самая частая ошибка.',
    'Cancelling works only on a factor. Cancelling one term of a sum is the most common mistake.'),
  expr: ['(x', '+', '3)', ':', '3'], exprSize: 30,
  ask: L('Bu yozuvni 3 ga qisqartirish mumkinmi?', 'Можно ли сократить эту запись на 3?', 'Can this record be cancelled by 3?'),
  opts: [
    { label: L("Yo'q, 3 ko'paytuvchi emas", 'Нет, 3 не множитель', 'No, 3 is not a factor') },
    { label: L('Ha, x + 1 chiqadi', 'Да, выйдет x + 1', 'Yes, it gives x + 1') },
    { label: L('Ha, x chiqadi', 'Да, выйдет x', 'Yes, it gives x') },
  ],
  correct: 0,
  correctText: L(
    "To'g'ri. x + 3 yig'indi: 3 unda ko'paytuvchi emas. Tekshirish: x = 3 bo'lsa (3 + 3) : 3 = 2, x + 1 esa 4 beradi.",
    'Верно. x + 3 это сумма: тройка в ней не множитель. Проверка: при x = 3 выходит (3 + 3) : 3 = 2, а x + 1 даёт 4.',
    'Correct. x + 3 is a sum: the 3 is not a factor. Check: at x = 3 we get (3 + 3) : 3 = 2, while x + 1 gives 4.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "x + 1 noto'g'ri: x = 3 qo'ysak asl yozuv 2 beradi, x + 1 esa 4. Bitta had qisqartirilgan.",
      'x + 1 неверно: при x = 3 исходная запись даёт 2, а x + 1 даёт 4. Сократили одно слагаемое.',
      'x + 1 is wrong: at x = 3 the original gives 2 but x + 1 gives 4. One term was cancelled.') },
    { when: (s) => s.picked === 2, text: L(
      "x ham noto'g'ri: uchlikni shunchaki o'chirib bo'lmaydi. x = 3 bo'lsa asl yozuv 2, x esa 3.",
      'x тоже неверно: тройку нельзя просто убрать. При x = 3 исходная запись даёт 2, а x даёт 3.',
      'x is wrong too: the 3 cannot simply be dropped. At x = 3 the original gives 2 but x gives 3.') },
  ],
  wrongText: L(
    "Son qo'yib tekshiring: x = 3 bo'lsa asl yozuv nima beradi?",
    'Проверь числом: что даёт исходная запись при x = 3?',
    'Check with a number: what does the original give at x = 3?'),
};

export default function D32_01(props) { return <Choice data={DATA} {...props} />; }
