// Dars09 · Amaliyot 06 — Noma'lum o'ngda ko'proq · 🟡 · tag: unknown_right
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
//
// 7 − 2x = 3x + 22. Noma'lumning katta qismi o'ng tomonda, shuning uchun
// noma'lumlarni O'NGGA to'plash qulay -- shunda koeffitsiyent musbat qoladi:
//   7 − 22 = 3x + 2x  ->  −15 = 5x  ->  x = −3
// Chapga to'plash ham to'g'ri: −2x − 3x = 22 − 7 -> −5x = 15 -> x = −3.
// Tekshirish: 7 − 2 · (−3) = 13 va 3 · (−3) + 22 = 13.
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'unknown_right', level: '🟡', allowNeg: true, target: -3,
  eyebrow: L("Noma'lum qaysi tomonda", 'В какой части неизвестное', 'Which side the unknown goes'),
  setup: L(
    "Noma'lumni istalgan tomonga to'plash mumkin. Ko'pi turgan tomonga to'plash qulay: koeffitsiyent musbat bo'lib qoladi.",
    'Неизвестное можно собрать в любой части. Удобнее там, где его больше: коэффициент останется положительным.',
    'The unknown can be gathered on either side. It is handier where there is more of it: the coefficient stays positive.'),
  expr: ['7', '−', '2x', '=', '3x', '+', '22'], exprSize: 30,
  label: L('Ildizni yozing:', 'Запиши корень:', 'Write the root:'),
  correctText: L(
    "To'g'ri. 7 − 22 = 3x + 2x, ya'ni −15 = 5x va x = −3. Tekshirish: ikki tomon ham 13 beradi.",
    'Верно. 7 − 22 = 3x + 2x, то есть −15 = 5x и x = −3. Проверка: обе части дают 13.',
    'Correct. 7 − 22 = 3x + 2x, that is −15 = 5x and x = −3. Check: both sides give 13.'),
  wrongs: [
    { when: (s) => s.value === 3, text: L(
      "Ishorani tekshiring: chap tomonda 7 − 22 = −15 chiqadi, ya'ni ildiz manfiy.",
      'Проверь знак: слева выходит 7 − 22 = −15, значит корень отрицательный.',
      'Check the sign: the left side gives 7 − 22 = −15, so the root is negative.') },
    { when: (s) => s.value === -15 || s.value === 15, text: L(
      "−15 bu hali ildiz emas: o'ng tomonda 5x turibdi, ya'ni yana 5 ga bo'lish kerak.",
      '−15 это ещё не корень: справа стоит 5x, значит надо ещё разделить на 5.',
      '−15 is not the root yet: the right side is 5x, so it still has to be divided by 5.') },
    { when: (s) => s.value === -29 || s.value === 29, text: L(
      "Noma'lumli hadlarni bir tomonga, sonlarni ikkinchi tomonga to'plang: −2x va 3x birga, 7 va 22 birga.",
      'Собери слагаемые с неизвестным в одну часть, числа в другую: −2x и 3x вместе, 7 и 22 вместе.',
      'Gather the unknown terms on one side and the numbers on the other: −2x with 3x, 7 with 22.') },
  ],
  wrongText: L(
    "Noma'lumlarni o'ngga, sonlarni chapga ko'chiring. Ko'chirilgan hadning ishorasi o'zgaradi.",
    'Перенеси неизвестные вправо, числа влево. У перенесённого слагаемого знак меняется.',
    'Move the unknowns right and the numbers left. A moved term flips its sign.'),
};

export default function D09_06(props) { return <TypeValue data={DATA} {...props} />; }
