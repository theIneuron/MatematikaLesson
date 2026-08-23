// Dars01 * Amaliyot 10 -- Taqiq bormi * 🔴 * tag: no_forbidden
// Faqat MA'LUMOT. Tip: kit.jsx -> Input (kind odz).
// mathcore.js parseOdz "hammasi" so'zini "taqiq yo'q" deb tan oladi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Input, L } from '../kit.jsx';

const DATA = {
  tag: 'no_forbidden', level: '🔴', kind: 'odz', varName: 'x',
  excluded: [],
  eyebrow: L('Taqiq bormi', 'Есть ли запрет', 'Is there a restriction'),
  expr: [{ n: '8', d: 'x · x + 16' }],
  exprSize: 26,
  ask: L('Qaysi qiymatlar taqiqlangan?', 'Какие значения запрещены?', 'Which values are forbidden?'),
  label: L('shart', 'условие', 'condition'),
  placeholder: L("taqiq yo'q bo'lsa: hammasi", 'если запрета нет: hammasi', 'if none: hammasi'),
  hints: {
    'x != -4': L(
      "Minus to'rtda maxraj 32 ga teng, nol emas. x · x hech qachon manfiy bo'lmaydi, ya'ni bu ifoda hech qachon nolga aylanmaydi.",
      'При минус четырёх знаменатель равен 32, не нулю. x · x никогда не бывает отрицательным, значит это выражение никогда не равно нулю.',
      'At minus four the denominator equals 32, not zero. x · x is never negative, so this expression is never zero.',
    ),
    'x != 4': L(
      "To'rtda maxraj 32 ga teng. Nolga aylanishi uchun x · x manfiy bo'lishi kerak edi, kvadrat esa manfiy bo'lmaydi.",
      'При четырёх знаменатель равен 32. Для нуля потребовалось бы отрицательное x · x, а квадрат отрицательным не бывает.',
      'At four the denominator equals 32. A zero would need a negative x · x, and a square is never negative.',
    ),
  },
  correctText: L(
    "To'g'ri. x · x manfiy bo'lmaydi, ya'ni x · x + 16 hech qachon nolga aylanmaydi. Ifoda kasr, lekin taqiq yo'q.",
    'Верно. x · x не бывает отрицательным, значит x · x + 16 никогда не обращается в нуль. Запись дробная, а запрета нет.',
    'Correct. x · x is never negative, so x · x + 16 is never zero. The record is fractional, yet there is no restriction.',
  ),
  wrongText: L(
    "Maxrajni nolga tenglashtirib ko'ring: x · x + 16 = 0 dan x · x = -16 chiqadi. Kvadrat manfiy bo'ladimi?",
    'Приравняй знаменатель к нулю: из x · x + 16 = 0 выходит x · x = -16. Бывает ли квадрат отрицательным?',
    'Set the denominator to zero: x · x + 16 = 0 gives x · x = -16. Can a square be negative?',
  ),
};

export default function D01_10(props) { return <Input data={DATA} {...props} />; }
