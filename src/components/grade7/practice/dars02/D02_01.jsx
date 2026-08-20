// Dars02 · Amaliyot 01 — Ko'rinmaydigan belgi · 🟢 · tag: invisible_sign
// Faqat MA'LUMOT. Mexanika umumiy qatlamda: `practice/kit.jsx`.
//
// 12a, a = 7. Darsning 4-ekrani aynan shu haqda: son va harf yonma-yon
// tursa, ular orasida KO'PAYTIRISH bor, u yozilmaydi.
// 12 · 7 = 84. Xato javoblar tanib olinadigan: 19 bu 12 + 7 (belgini
// qo'shish deb o'qigan), 127 bu 12 va 7 ni yonma-yon yozib qo'ygan.
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'invisible_sign', level: '🟢',
  eyebrow: L("Ko'rinmaydigan belgi", 'Невидимый знак', 'The invisible sign'),
  setup: L(
    "Son bilan harf yonma-yon tursa, ular orasidagi belgi yozilmaydi. Lekin belgi bor.",
    'Между числом и буквой знак не пишут. Но он есть.',
    'The sign between a number and a letter is not written. But it is there.'),
  expr: ['12a'], exprSize: 32,
  given: [['a', '=', '7']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  ask: L('Yozuvning qiymati qancha?', 'Чему равно значение записи?', 'What is the value of the record?'),
  opts: [{ label: '84' }, { label: '19' }, { label: '127' }],
  correct: 0,
  correctText: L(
    "To'g'ri. 12a bu 12 · a, ya'ni 12 · 7 = 84.",
    'Верно. 12a это 12 · a, то есть 12 · 7 = 84.',
    'Correct. 12a means 12 · a, that is 12 · 7 = 84.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "19 bu 12 + 7. Yozuvda qo'shish yo'q: son va harf orasidagi yashiringan belgi -- ko'paytirish.",
      '19 это 12 + 7. Сложения в записи нет: спрятанный знак между числом и буквой — умножение.',
      '19 is 12 + 7. There is no addition in the record: the hidden sign between a number and a letter is multiplication.') },
    { when: (s) => s.picked === 2, text: L(
      "127 bu 12 va 7 ni yonma-yon yozish. Sonlar bir-biriga yopishtirilmaydi, ular ko'paytiriladi.",
      '127 это 12 и 7, написанные рядом. Числа не приписываются друг к другу, они умножаются.',
      '127 is 12 and 7 written next to each other. Numbers are not stuck together, they are multiplied.') },
  ],
  wrongText: L(
    "12a bu 12 · a. Harf o'rniga 7 qo'yiladi va ko'paytiriladi.",
    '12a это 12 · a. Вместо буквы ставится 7 и выполняется умножение.',
    '12a means 12 · a. Put 7 in place of the letter and multiply.'),
};

export default function D02_01(props) { return <Choice data={DATA} {...props} />; }
