// Dars18 · Amaliyot 03 — Nechta · 🟢 · tag: count_roots
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §6 (18-dars, 3-pozitsiya)
//
// JAVOB — ILDIZLARNING SONI, ildizning o'zi emas. Tenglama to'la kvadrat:
// x kvadrat minus olti x qo'shuv to'qqiz bu x minus uchning kvadrati, D nolga
// teng, ya'ni ildiz bitta — uch.
//
// Uchta xato javob uchta yo'l:
//   0 — З9: D nolga teng bo'lgani «ildiz yo'q» deb tushunildi;
//   2 — kvadrat tenglamada har doim ikki ildiz bor deb o'ylash;
//   3 — ildizning O'ZI yozildi, soni emas.
// `TypeValue` faqat butun son oladi, javob esa butun — 1.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'count_roots', level: '🟢',
  target: 1, allowNeg: false,
  expr: ['x² − 6x + 9 = 0'], exprSize: 28,
  eyebrow: L('Nechta', 'Сколько', 'How many'),
  setup: L(
    "Javob ildizning o'zi emas, ularning SONI. Buni topish uchun tenglamani yechish shart emas: diskriminant yetadi.",
    'Ответ — не сам корень, а их ЧИСЛО. Чтобы его найти, решать уравнение не обязательно: достаточно дискриминанта.',
    'The answer is not the root itself but their COUNT. Finding it needs no solving: the discriminant is enough.'),
  label: L('ildizlar soni', 'число корней', 'the number of roots'),
  ask: L(
    "Tenglamaning nechta ildizi bor?",
    'Сколько корней у уравнения?',
    'How many roots does the equation have?'),
  correctText: L(
    "To'g'ri. Diskriminant: minus oltining kvadrati o'ttiz olti, minus to'rt karra bir karra to'qqiz minus o'ttiz olti, o'ttiz olti minus o'ttiz olti nol. D nolga teng, demak ildiz BITTA. U uchga teng, va tekshirish oson: to'qqiz minus o'n sakkiz qo'shuv to'qqiz nol. Bu tenglama to'la kvadrat — x minus uchning kvadrati, shuning uchun ikki ildiz bitta bo'lib qo'shilgan.",
    'Верно. Дискриминант: минус шесть в квадрате тридцать шесть, минус четыре на один на девять минус тридцать шесть, тридцать шесть минус тридцать шесть нуль. D равно нулю, значит корень ОДИН. Он равен трём, и проверка проста: девять минус восемнадцать плюс девять нуль. Это уравнение — полный квадрат, квадрат x минус три, поэтому два корня слились в один.',
    'Correct. The discriminant: minus six squared is thirty six, minus four times one times nine is minus thirty six, thirty six minus thirty six is zero. D is zero, so there is ONE root. It equals three, and the check is easy: nine minus eighteen plus nine is zero. This equation is a perfect square, x minus three squared, which is why the two roots merged into one.'),
  wrongs: [
    { when: (s) => s.value === 0, text: L(
      "D nolga teng, lekin bu «ildiz yo'q» degani emas. Uchni tenglamaga qo'yib ko'ring: to'qqiz minus o'n sakkiz qo'shuv to'qqiz nol — demak uch ildiz. Ildiz yo'q bo'ladigan hol boshqa: D MANFIY chiqishi kerak.",
      'D равно нулю, но это не значит «корней нет». Подставь три: девять минус восемнадцать плюс девять нуль — значит три является корнем. Корней нет в другом случае: когда D ОТРИЦАТЕЛЬНО.',
      'D is zero, but that does not mean «no roots». Substitute three: nine minus eighteen plus nine is zero — so three is a root. No roots is a different case: it needs a NEGATIVE D.') },
    { when: (s) => s.value === 2, text: L(
      "Kvadrat tenglamada har doim ikki ildiz bo'lmaydi. Diskriminantni hisoblang: o'ttiz olti minus o'ttiz olti nol. Nol bo'lganda plyus-minus hech narsani o'zgartirmaydi, ikki hisob bir xil javobni beradi — ildiz bitta. Ikki ildiz D musbat bo'lganda bo'ladi.",
      'У квадратного уравнения не всегда два корня. Посчитай дискриминант: тридцать шесть минус тридцать шесть нуль. При нуле плюс-минус ничего не меняет, оба вычисления дают один ответ — корень один. Два корня бывает при положительном D.',
      'A quadratic equation does not always have two roots. Compute the discriminant: thirty six minus thirty six is zero. With zero the plus-or-minus changes nothing and both computations give the same answer — one root. Two roots need a positive D.') },
    { when: (s) => s.value === 3, text: L(
      "Uch — bu ildizning O'ZI, uning soni emas. Savol nechta ildiz borligini so'radi. Ildiz bitta, va u uchga teng.",
      'Три — это САМ корень, а не их число. Вопрос был о том, сколько корней. Корень один, и он равен трём.',
      'Three is the ROOT itself, not the count. The question asked how many roots there are. There is one root, and it equals three.') },
  ],
  wrongText: L(
    "Diskriminantni hisoblang va uning ishorasiga qarang: musbat — ikki ildiz, nol — bitta, manfiy — yo'q. Javob son sifatida yoziladi.",
    'Посчитай дискриминант и посмотри на его знак: положительный — два корня, нуль — один, отрицательный — ни одного. Ответ пишется числом.',
    'Compute the discriminant and look at its sign: positive means two roots, zero means one, negative means none. The answer is written as a number.'),
};

export default function D18_03(props) { return <TypeValue data={DATA} {...props} />; }
