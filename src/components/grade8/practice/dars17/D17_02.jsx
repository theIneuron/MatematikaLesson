// Dars17 · Amaliyot 02 — Ildizlar · 🟢 · tag: roots_by_formula
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §5 (17-dars, 2-pozitsiya)
//
// FORMULA BOSHDAN OXIRIGACHA, lekin sonlar qulay: D o'n oltiga teng, ildizi
// to'rt, maxraj ikki. Shuning uchun bu 🟢 pozitsiyada tura oladi.
//
// Birinchi xato variant — З44: minus b ni b deb olish. b minus oltiga teng,
// demak minus b arti olti; b ni to'g'ridan-to'g'ri qo'ygan o'quvchi minus olti
// oladi va ildizlari minus bir bilan minus besh chiqadi.
// Qolgan ikki variant arifmetika: maxrajga bo'lishni tashlab ketish.
// Variantlar aralashtiriladi (Choice ichida), razbor shartlari ASL raqamda.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'roots_by_formula', level: '🟢',
  correct: 0, optCols: 2, optSize: 19,
  expr: ['x² − 6x + 5 = 0'], exprSize: 28,
  eyebrow: L('Ildizlar', 'Корни', 'Roots'),
  setup: L(
    "Formula bo'yicha yechish uch qadam: diskriminantni hisoblash, undan ildiz olish, keyin minus b bilan qo'shib maxrajga bo'lish.",
    'Решение по формуле — три шага: посчитать дискриминант, извлечь из него корень, потом сложить с минус b и разделить на знаменатель.',
    'Solving by the formula takes three steps: compute the discriminant, take its root, then combine with minus b and divide by the denominator.'),
  ask: L('Tenglamaning ildizlari qanday?', 'Каковы корни уравнения?', 'What are the roots of the equation?'),
  opts: [
    { label: ['x = 1', ';', 'x = 5'] },
    { label: ['x = −1', ';', 'x = −5'] },
    { label: ['x = 1', ';', 'x = 6'] },
    { label: ['x = 5', ';', 'x = 6'] },
  ],
  correctText: L(
    "To'g'ri. Diskriminant: minus oltining kvadrati o'ttiz olti, minus to'rt karra bir karra besh minus yigirma — o'ttiz olti minus yigirma o'n olti. O'n oltidan ildiz to'rt. b minus oltiga teng, demak minus b arti olti. Olti minus to'rt ikki, ikki bo'lingan ikki bir; olti qo'shuv to'rt o'n, o'n bo'lingan ikki besh.",
    'Верно. Дискриминант: минус шесть в квадрате тридцать шесть, минус четыре на один на пять минус двадцать — тридцать шесть минус двадцать шестнадцать. Корень из шестнадцати четыре. b равно минус шести, значит минус b плюс шесть.',
    'Correct. The discriminant: minus six squared is thirty six, minus four times one times five is minus twenty — thirty six minus twenty is sixteen. The root of sixteen is four. b is minus six, so minus b is plus six. Six minus four is two, two over two is one; six plus four is ten, ten over two is five.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Ishora teskari bo'lib qolgan. Formulaning suratida MINUS b turadi, b esa minus oltiga teng — demak minus b arti olti, manfiy emas. Minus birni tenglamaga qo'yib tekshiring: bir qo'shuv olti qo'shuv besh o'n ikki chiqadi, nol emas.",
      'Знак вышел наоборот. В числителе формулы стоит МИНУС b, а b равно минус шести — значит минус b это плюс шесть, а не отрицательное. Подставь минус один и проверь: один плюс шесть плюс пять даёт двенадцать, а не нуль.',
      'The sign came out reversed. The numerator holds MINUS b, and b is minus six — so minus b is plus six, not negative. Substitute minus one and check: one plus six plus five gives twelve, not zero.') },
    { when: (s) => s.picked === 2, text: L(
      "Bitta ildiz to'g'ri, ikkinchisi esa maxrajga bo'linmagan: olti qo'shuv to'rt o'n, va o'nni IKKIGA bo'lish kerak — besh chiqadi. Oltini qo'yib tekshiring: o'ttiz olti minus o'ttiz olti qo'shuv besh besh chiqadi, nol emas.",
      'Один корень верный, а второй не разделён на знаменатель: шесть плюс четыре десять, и десять надо разделить НА ДВА — выйдет пять. Подставь шесть и проверь: тридцать шесть минус тридцать шесть плюс пять даёт пять, а не нуль.',
      'One root is right, the other was not divided by the denominator: six plus four is ten, and ten must be divided BY TWO — giving five. Substitute six and check: thirty six minus thirty six plus five gives five, not zero.') },
    { when: (s) => s.picked === 3, text: L(
      "Bu ikki son yozuvdan ko'chirilgan, formula bilan hisoblanmagan. Beshi to'g'ri chiqadi, oltisi esa yo'q: olti qo'shuv to'rtni ikkiga bo'lsangiz besh chiqadi, oltini qo'ysangiz esa o'ttiz olti minus o'ttiz olti qo'shuv besh besh bo'ladi, nol emas.",
      'Эти два числа перенесены из записи, а не посчитаны по формуле. Пятёрка выходит верно, а шестёрка нет: шесть плюс четыре, делённое на два, даёт пять; а при подстановке шести выйдет тридцать шесть минус тридцать шесть плюс пять, то есть пять, а не нуль.',
      'These two numbers were carried over from the record instead of being computed. Five is right, six is not: six plus four over two gives five, while substituting six gives thirty six minus thirty six plus five, that is five, not zero.') },
  ],
  wrongText: L(
    "Formulani to'liq bajaring: diskriminant, undan ildiz, minus b bilan qo'shish yoki ayirish, keyin maxrajga bo'lish. Har javobni tenglamaga qo'yib tekshiring.",
    'Пройди формулу до конца: дискриминант, корень из него, сложение или вычитание с минус b, потом деление на знаменатель. Каждый ответ проверь подстановкой.',
    'Run the formula to the end: the discriminant, its root, the sum or difference with minus b, then the division by the denominator. Check every answer by substitution.'),
};

export default function D17_02(props) { return <Choice data={DATA} {...props} />; }
