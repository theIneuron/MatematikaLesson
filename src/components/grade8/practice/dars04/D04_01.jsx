// Dars04 · Amaliyot 01 — Test · 🟢 · tag: same_denominator
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Kontent: src/books/grade8/DARS04_AMALIYOT_KONTENT_V2.md §01
//
// Metodist qarori 2026-08-24: 2-6 darslar 1-darsning o'nta mexanikasida
// quriladi, har darsda boshqa ketma-ketlikda. Ilgari bu topshiriq `TypeExpr`
// edi — javob YOZILARDI; o'nlikda bunday tip yo'q, shuning uchun javob endi
// to'rt variantdan tanlanadi. Matematika o'sha.
//
// Uchta noto'g'ri variant — uchta adashish:
//   1  7b/(2b + 14)   maxrajlar ham qo'shildi
//   2  10b²/(b + 7)²  qo'shish ko'paytirishga aylandi
//   3  7b             maxraj umuman yo'qoldi
// Variantlar har ochilganda aralashtiriladi, razbor shartlari ASL raqamda.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'same_denominator', level: '🟢',
  correct: 0, optCols: 2, optSize: 20,
  eyebrow: L('Test', 'Тест', 'Test'),
  setup: L(
    "Ikki kasrning maxraji bir xil. Yig'indi ham kasr bo'lib qoladi.",
    'У двух дробей одинаковый знаменатель. Сумма тоже остаётся дробью.',
    'The two fractions share a denominator. The sum stays a fraction too.'),
  expr: [{ n: '5b', d: 'b + 7' }, '+', { n: '2b', d: 'b + 7' }], exprSize: 24,
  ask: L('Qaysi javob to\'g\'ri?', 'Какой ответ верный?', 'Which answer is right?'),
  opts: [
    { label: [{ n: '7b', d: 'b + 7' }] },
    { label: [{ n: '7b', d: '2b + 14' }] },
    { label: [{ n: '10b²', d: '(b + 7)²' }] },
    { label: ['7b'] },
  ],
  correctText: L(
    "To'g'ri. Maxrajlar bir xil bo'lsa, faqat suratlar qo'shiladi: besh b qo'shuv ikki b yetti b. Maxraj o'zgarmaydi — u bo'laklarning O'LCHAMI, va o'lcham qo'shilmaydi. b ni birga teng qo'ying: besh sakkizdan qo'shuv ikki sakkizdan yetti sakkizdan.",
    'Верно. Если знаменатели одинаковы, складываются только числители: пять b плюс два b — семь b. Знаменатель не меняется: он задаёт РАЗМЕР доли, а размеры не складывают. Подставь b равное одному: пять восьмых плюс две восьмых — семь восьмых.',
    'Correct. With equal denominators only the numerators add: five b plus two b is seven b. The denominator stays: it sets the SIZE of the parts, and sizes are not added. Put b equal to one: five eighths plus two eighths is seven eighths.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Maxrajlar qo'shilmaydi. b ni birga teng qo'ying: chapda besh sakkizdan qo'shuv ikki sakkizdan, ya'ni yetti sakkizdan, bu variant esa yetti o'n oltidan beradi — ikki barobar kichik.",
      'Знаменатели не складывают. Подставь b равное одному: слева пять восьмых плюс две восьмых, то есть семь восьмых, а этот вариант даёт семь шестнадцатых — вдвое меньше.',
      'Denominators are not added. Put b equal to one: on the left five eighths plus two eighths is seven eighths, while this option gives seven sixteenths — twice as small.') },
    { when: (s) => s.picked === 2, text: L(
      "Bu ko'paytirishning javobi, qo'shishniki emas. Qo'shishda maxraj tegilmaydi va suratlar ko'paytirilmaydi.",
      'Это ответ на умножение, а не на сложение. При сложении знаменатель не трогают, а числители не перемножают.',
      'That is the answer to a multiplication, not an addition. In addition the denominator is untouched and the numerators are not multiplied.') },
    { when: (s) => s.picked === 3, text: L(
      "Maxraj yo'qolib qoldi. Yetti b — bu butun ifoda, kasr emas: b ni birga teng qo'ying, chapda yetti sakkizdan chiqadi, bu variant esa yettini beradi.",
      'Знаменатель потерялся. Семь b — это целое выражение, а не дробь: подставь b равное одному, слева выйдет семь восьмых, а этот вариант даёт семь.',
      'The denominator was lost. Seven b is a whole expression, not a fraction: put b equal to one, the left gives seven eighths while this option gives seven.') },
  ],
  wrongText: L(
    "Maxrajlar teng bo'lsa, faqat suratlar qo'shiladi, maxraj esa o'zgarmaydi. Javobni b ning istalgan qiymatida tekshiring.",
    'При равных знаменателях складываются только числители, а знаменатель остаётся прежним. Проверь ответ при любом значении b.',
    'With equal denominators only the numerators add and the denominator stays. Check the answer at any value of b.'),
};

export default function D04_01(props) { return <Choice data={DATA} {...props} />; }
