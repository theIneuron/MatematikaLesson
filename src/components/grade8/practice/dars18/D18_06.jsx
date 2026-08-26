// Dars18 · Amaliyot 06 — Test · 🟡 · tag: how_many_roots
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §6 (18-dars, 6-pozitsiya)
//
// KOEFFITSIYENTLAR KATTA, natija esa o'sha: D nolga teng. Bu ataylab —
// 03-topshiriqda a birga teng edi va nolni ko'rish oson bo'lgan; bu yerda
// yuz qirq to'rt minus yuz qirq to'rt hisoblanadi, ya'ni javob «shaklidan»
// ko'rinmaydi.
//
// Uchinchi variant — З9: nolni «ildiz yo'q» deb tushunish. To'rtinchisi esa
// kvadrat tenglamada uchta ildiz bo'lishi mumkin degan qarash — formulada
// plyus-minus faqat ikki javob beradi.
// Variantlar aralashtiriladi (Choice ichida), razbor shartlari ASL raqamda.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'how_many_roots', level: '🟡',
  correct: 0, optCols: 2, optSize: 17,
  expr: ['3x² − 12x + 12 = 0'], exprSize: 26,
  eyebrow: L('Test', 'Тест', 'Test'),
  setup: L(
    "Koeffitsiyentlar katta, lekin yo'l o'sha: diskriminantni hisoblab ishorasiga qarash kerak.",
    'Коэффициенты большие, но путь тот же: посчитать дискриминант и посмотреть на знак.',
    'The coefficients are big, but the route is the same: compute the discriminant and look at its sign.'),
  ask: L(
    "Tenglamaning nechta ildizi bor?",
    'Сколько корней у уравнения?',
    'How many roots does the equation have?'),
  opts: [
    { label: L('bitta', 'один', 'one') },
    { label: L('ikkita', 'два', 'two') },
    { label: L("ildiz yo'q", 'корней нет', 'none') },
    { label: L('uchta', 'три', 'three') },
  ],
  correctText: L(
    "To'g'ri. Diskriminant: minus o'n ikkining kvadrati yuz qirq to'rt, minus to'rt karra uch karra o'n ikki minus yuz qirq to'rt. Yuz qirq to'rt minus yuz qirq to'rt nol — demak ildiz bitta. Uni topish oson: uchga bo'lsangiz x kvadrat minus to'rt x qo'shuv to'rt chiqadi, bu x minus ikkining kvadrati, ildizi ikki. Tekshirish: o'n ikki minus yigirma to'rt qo'shuv o'n ikki nol.",
    'Верно. Дискриминант: минус двенадцать в квадрате сто сорок четыре, минус четыре на три на двенадцать минус сто сорок четыре. Сто сорок четыре минус сто сорок четыре нуль — значит корень один. Найти его легко: раздели на три и выйдет x квадрат минус четыре x плюс четыре, это квадрат x минус два, корень два. Проверка: двенадцать минус двадцать четыре плюс двенадцать нуль.',
    'Correct. The discriminant: minus twelve squared is one hundred forty four, minus four times three times twelve is minus one hundred forty four. One hundred forty four minus one hundred forty four is zero — so there is one root. Finding it is easy: divide by three and you get x squared minus four x plus four, which is x minus two squared, root two. Check: twelve minus twenty four plus twelve is zero.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Diskriminantni oxirigacha hisoblang: minus o'n ikkining kvadrati yuz qirq to'rt, va minus to'rt karra uch karra o'n ikki ham yuz qirq to'rt, faqat minus bilan. Ular bir-birini yo'q qiladi va nol qoladi. Nol bo'lganda plyus-minus hech narsani o'zgartirmaydi — ildiz bitta.",
      'Посчитай дискриминант до конца: минус двенадцать в квадрате сто сорок четыре, и минус четыре на три на двенадцать тоже сто сорок четыре, только с минусом. Они уничтожают друг друга и остаётся нуль. При нуле плюс-минус ничего не меняет — корень один.',
      'Compute the discriminant to the end: minus twelve squared is one hundred forty four, and minus four times three times twelve is one hundred forty four as well, with a minus. They cancel and zero remains. With zero the plus-or-minus changes nothing — one root.') },
    { when: (s) => s.picked === 2, text: L(
      "D nolga teng, va bu «ildiz yo'q» degani emas. Ikkini tenglamaga qo'yib ko'ring: uch karra to'rt o'n ikki, minus o'n ikki karra ikki minus yigirma to'rt, qo'shuv o'n ikki — nol chiqadi. Demak ikki ildiz. Ildiz yo'q bo'lishi uchun D MANFIY bo'lishi kerak.",
      'D равно нулю, а это не значит «корней нет». Подставь два: три на четыре двенадцать, минус двенадцать на два минус двадцать четыре, плюс двенадцать — выйдет нуль. Значит два является корнем. Для отсутствия корней D должно быть ОТРИЦАТЕЛЬНЫМ.',
      'D is zero, and that does not mean «no roots». Substitute two: three times four is twelve, minus twelve times two is minus twenty four, plus twelve — zero comes out. So two is a root. For no roots, D would have to be NEGATIVE.') },
    { when: (s) => s.picked === 3, text: L(
      "Kvadrat tenglamada uchta ildiz bo'lolmaydi. Formulaga qarang: plyus-minus faqat ikki hisobni beradi — biri qo'shish, ikkinchisi ayirish. Demak ko'pi bilan ikki ildiz bo'ladi, va D nolga teng bo'lganda ular bitta bo'lib qo'shiladi.",
      'У квадратного уравнения не может быть трёх корней. Посмотри на формулу: плюс-минус даёт только два вычисления — одно со сложением, другое с вычитанием. Значит корней не больше двух, а при D равном нулю они сливаются в один.',
      'A quadratic equation cannot have three roots. Look at the formula: the plus-or-minus yields only two computations — one adding, one subtracting. So there are at most two roots, and when D is zero they merge into one.') },
  ],
  wrongText: L(
    "D ni oxirigacha hisoblang, keyin ishorasiga qarang: musbat — ikkita, nol — bitta, manfiy — yo'q. Koeffitsiyentlarning kattaligi qoidani o'zgartirmaydi.",
    'Посчитай D до конца, потом смотри на знак: положительное — два, нуль — один, отрицательное — ни одного. Величина коэффициентов правило не меняет.',
    'Compute D to the end, then look at the sign: positive means two, zero means one, negative means none. The size of the coefficients does not change the rule.'),
};

export default function D18_06(props) { return <Choice data={DATA} {...props} />; }
