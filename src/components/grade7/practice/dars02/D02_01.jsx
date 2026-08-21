// Dars02 · Amaliyot 01 — Ko'rinmaydigan belgi · 🟢 · tag: invisible_sign
// Faqat MA'LUMOT. Mexanika umumiy qatlamda: `practice/kit.jsx`.
//
// DARAJA KO'TARILDI (PODXOD_7SINF.md §13): a uch xonali, javob to'rt xonali.
//
// 12a, a = 250. Darsning 4-ekrani aynan shu haqda: son va harf yonma-yon
// tursa, ular orasida KO'PAYTIRISH bor, u yozilmaydi.
// 12 · 250 = 3000 (og'zaki: 12 · 25 = 300 va bitta nol). Xato javoblar
// tanib olinadigan: 262 bu 12 + 250 (belgini qo'shish deb o'qigan),
// 12250 bu 12 va 250 ni yonma-yon yozib qo'ygan.
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
  given: [['a', '=', '250']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  ask: L('Yozuvning qiymati qancha?', 'Чему равно значение записи?', 'What is the value of the record?'),
  opts: [{ label: '3000' }, { label: '262' }, { label: '12250' }],
  correct: 0,
  correctText: L(
    "To'g'ri. 12a bu 12 · a, ya'ni 12 · 250 = 3000. Og'zaki: 12 · 25 = 300, keyin bitta nol.",
    'Верно. 12a это 12 · a, то есть 12 · 250 = 3000. Устно: 12 · 25 = 300, потом один нуль.',
    'Correct. 12a means 12 · a, that is 12 · 250 = 3000. In your head: 12 · 25 = 300, then one zero.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "262 bu 12 + 250. Yozuvda qo'shish yo'q: son va harf orasidagi yashiringan belgi -- ko'paytirish.",
      '262 это 12 + 250. Сложения в записи нет: спрятанный знак между числом и буквой — умножение.',
      '262 is 12 + 250. There is no addition in the record: the hidden sign between a number and a letter is multiplication.') },
    { when: (s) => s.picked === 2, text: L(
      "12250 bu 12 va 250 ni yonma-yon yozish. Sonlar bir-biriga yopishtirilmaydi, ular ko'paytiriladi.",
      '12250 это 12 и 250, написанные рядом. Числа не приписываются друг к другу, они умножаются.',
      '12250 is 12 and 250 written next to each other. Numbers are not stuck together, they are multiplied.') },
  ],
  wrongText: L(
    "12a bu 12 · a. Harf o'rniga 250 qo'yiladi va ko'paytiriladi.",
    '12a это 12 · a. Вместо буквы ставится 250 и выполняется умножение.',
    '12a means 12 · a. Put 250 in place of the letter and multiply.'),
};

export default function D02_01(props) { return <Choice data={DATA} {...props} />; }
