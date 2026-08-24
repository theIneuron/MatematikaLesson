// Dars10 · Amaliyot 09 — Eng kichik · 🔴 · tag: smallest_x
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Skelet: DARS07_11_AMALIYOT_SKELET.md §8 (10-dars, 9-pozitsiya)
//
// Ildiz osti nomanfiy bo'lishi kerak: ikki x minus o'n nomanfiy, ya'ni x
// beshdan kichik bo'lmasin. Eng kichik qiymat — besh, va aynan beshda ildiz
// osti NOLGA teng: bu chegara nuqtasi kiritiladi (З32 ning nozik joyi).
// Xato javoblar: 10 (ko'paytuvchini unutish), 0 va −5 (shartni tekshirmaslik),
// 6 (chegarani chetlab o'tish).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'smallest_x', level: '🔴',
  target: 5, allowNeg: true,
  expr: [{ r: '2x − 10' }], exprSize: 32,
  eyebrow: L('Eng kichik', 'Наименьшее', 'Smallest'),
  setup: L(
    "Ildiz ma'noga ega bo'lishi uchun ildiz ostidagi ifoda nomanfiy bo'lishi kerak. Nol ham nomanfiy — bu chegarani hisobga oling.",
    'Чтобы корень имел смысл, подкоренное выражение должно быть неотрицательным. Нуль тоже неотрицателен — учти эту границу.',
    'For the root to have a value the radicand must be non-negative. Zero is non-negative too — keep that boundary in mind.'),
  label: L("x ning eng kichik butun qiymati", 'наименьшее целое значение x', 'the smallest whole value of x'),
  ask: L(
    "x ning qanday eng kichik qiymatida bu ildiz ma'noga ega?",
    'При каком наименьшем значении x этот корень имеет смысл?',
    'At which smallest value of x does this root have a value?'),
  correctText: L(
    "To'g'ri. Ildiz osti nomanfiy bo'lishi kerak: ikki x minus o'n noldan kichik bo'lmasin. Demak ikki x o'ndan kichik bo'lmaydi, ya'ni x beshdan kichik bo'lmaydi. Eng kichik qiymat — besh. Tekshiring: beshda ildiz osti o'n minus o'n, ya'ni nol, va noldan ildiz nolga teng — qiymat bor. To'rtda esa sakkiz minus o'n minus ikki bo'ladi va qiymat yo'qoladi.",
    'Верно. Подкоренное должно быть неотрицательным: два x минус десять не меньше нуля. Значит два x не меньше десяти, то есть x не меньше пяти. Наименьшее значение — пять. Проверь: при пяти подкоренное десять минус десять, то есть нуль, а корень из нуля равен нулю — значение есть. При четырёх же восемь минус десять это минус два, и значение исчезает.',
    'Correct. The radicand must be non-negative: two x minus ten is not less than zero. So two x is not less than ten, that is x is not less than five. The smallest value is five. Check: at five the radicand is ten minus ten, that is zero, and the root of zero is zero — the value exists. At four, eight minus ten is minus two and the value disappears.'),
  wrongs: [
    { when: (s) => s.value === 10, text: L(
      "Ikkiga ko'paytirish hisobga olinmadi: ildiz ostida ikki x turadi, x emas. O'nni qo'ying: yigirma minus o'n, ya'ni o'n — ildiz bor, lekin bu eng kichik qiymat emas. Beshni ham qo'yib ko'ring.",
      'Умножение на два не учтено: под корнем два x, а не x. Подставь десять: двадцать минус десять, то есть десять — корень есть, но это не наименьшее значение. Подставь ещё и пять.',
      'The multiplication by two was ignored: two x stands under the root, not x. Substitute ten: twenty minus ten is ten — the root exists, but this is not the smallest value. Try five as well.') },
    { when: (s) => s.value === 6, text: L(
      "Oltida ildiz haqiqatan bor: o'n ikki minus o'n ikki. Lekin savol eng KICHIK qiymat haqida — beshni ham tekshiring: o'n minus o'n nol, va noldan ildiz bor.",
      'При шести корень действительно есть: двенадцать минус десять два. Но вопрос о НАИМЕНЬШЕМ значении — проверь и пять: десять минус десять нуль, а корень из нуля есть.',
      'At six the root does exist: twelve minus ten is two. But the question asks for the SMALLEST value — check five too: ten minus ten is zero, and zero does have a root.') },
    { when: (s) => s.value === 0 || s.value === -5, text: L(
      "Bu qiymatda ildiz osti manfiy chiqadi. Nolni qo'ying: nol minus o'n, ya'ni minus o'n — manfiy sondan kvadrat ildiz olinmaydi. Shartni tengsizlik bilan yozib yechish kerak.",
      'При этом значении подкоренное отрицательно. Подставь нуль: нуль минус десять это минус десять — из отрицательного корень не извлекается. Условие надо записать неравенством и решить.',
      'At that value the radicand comes out negative. Substitute zero: zero minus ten is minus ten — a root cannot be taken of a negative number. The condition has to be written as an inequality and solved.') },
    { when: (s) => s.value === 4, text: L(
      "To'rtni qo'yib tekshiring: ikki karra to'rt sakkiz, sakkiz minus o'n minus ikki. Ildiz osti manfiy, demak qiymat yo'q. Chegara bittaga yuqorida.",
      'Проверь четыре подстановкой: два на четыре восемь, восемь минус десять минус два. Подкоренное отрицательно, значит значения нет. Граница на единицу выше.',
      'Check four by substituting: two times four is eight, eight minus ten is minus two. The radicand is negative, so there is no value. The boundary is one higher.') },
  ],
  wrongText: L(
    "Ildiz ostini nomanfiy deb yozing va tengsizlikni yechib ko'ring. Chegara qiymatini alohida tekshiring: u ham javobga kiradi.",
    'Запиши подкоренное как неотрицательное и реши неравенство. Границу проверь отдельно: она тоже входит в ответ.',
    'Write the radicand as non-negative and solve the inequality. Check the boundary value separately: it counts too.'),
};

export default function D10_09(props) { return <TypeValue data={DATA} {...props} />; }
