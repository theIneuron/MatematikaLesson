// Dars15 · Amaliyot 08 — c ni topish · 🔴 · tag: find_c
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §3 (15-dars, 8-pozitsiya)
//
// ILDIZNING TA'RIFI TESKARI TOMONGA ISHLAYDI (T3). Odatda tenglama berilib
// ildiz so'raladi; bu yerda ildiz berilgan va yozuvning bir bo'lagi so'raladi.
// Yechish yo'li ta'rifning o'zi: ildizni qo'ysak, tenglik TO'G'RI bo'lishi
// kerak — to'qqiz minus o'n besh qo'shuv c nolga teng, demak c oltiga teng.
//
// Uchta xato javob uchta yo'l:
//   −6 — ishora: c ni chap tomonga o'tkazishda belgi almashmadi;
//   15 — faqat o'rtadagi hadning qiymati yozildi, kvadrat had hisobga
//        olinmadi;
//   2  — uch minus bir, ya'ni ildiz bilan koeffitsiyent aralashtirildi.
// `TypeValue` faqat butun son oladi, javob esa butun — 6.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'find_c', level: '🔴',
  target: 6, allowNeg: true,
  expr: ['t² − 5t + c = 0'], exprSize: 28,
  given: [['t = 3']],
  givenLabel: L('Ildiz', 'Корень', 'Root'),
  eyebrow: L('c ni topish', 'Найти c', 'Find c'),
  setup: L(
    "Ildiz — tenglamani to'g'ri qiladigan son. Bu tenglamada ildiz berilgan, ozod had esa noma'lum: uni ildizning ta'rifidan topish mumkin.",
    'Корень — число, обращающее уравнение в верное равенство. Здесь корень дан, а свободный член неизвестен: его можно найти из самого определения корня.',
    'A root is a number that makes the equation true. Here the root is given and the constant term is unknown: the definition of a root is enough to find it.'),
  label: L('c ning qiymati', 'значение c', 'the value of c'),
  ask: L('c nimaga teng?', 'Чему равно c?', 'What does c equal?'),
  correctText: L(
    "To'g'ri. Uchni qo'yamiz: uchning kvadrati to'qqiz, minus besh karra uch minus o'n besh. To'qqiz minus o'n besh minus olti, va yig'indi nolga teng bo'lishi kerak — demak c oltiga teng. Tekshirish: to'qqiz minus o'n besh qo'shuv olti nol.",
    'Верно. Подставляем три: три в квадрате девять, минус пять на три — минус пятнадцать. Девять минус пятнадцать это минус шесть, а сумма должна быть нулём — значит c равно шести. Проверка: девять минус пятнадцать плюс шесть равно нулю.',
    'Correct. Substitute three: three squared is nine, minus five times three is minus fifteen. Nine minus fifteen is minus six, and the sum must be zero — so c is six. Check: nine minus fifteen plus six is zero.'),
  wrongs: [
    { when: (s) => s.value === -6, text: L(
      "Kattaligi to'g'ri, ishorasi yo'q. To'qqiz minus o'n besh minus oltiga teng, va shu minus oltini NOLGA aylantirish kerak — buning uchun arti olti qo'shiladi. Minus oltini qo'yib tekshiring: to'qqiz minus o'n besh minus olti minus o'n ikki chiqadi, nol emas.",
      'Величина верна, а знака нет. Девять минус пятнадцать равно минус шести, и это минус шесть надо обратить в НУЛЬ — для этого прибавляют плюс шесть. Подставь минус шесть и проверь: девять минус пятнадцать минус шесть даёт минус двенадцать, а не нуль.',
      'The size is right but the sign is missing. Nine minus fifteen is minus six, and that minus six must be turned into ZERO — which takes plus six. Substitute minus six and check: nine minus fifteen minus six gives minus twelve, not zero.') },
    { when: (s) => s.value === 15, text: L(
      "Bu o'rtadagi hadning qiymati, kvadrat had esa hisobga olinmagan. Uchni QAMMA hadga qo'yish kerak: to'qqiz, keyin minus o'n besh, keyin c. O'n beshni qo'yib tekshiring: to'qqiz minus o'n besh qo'shuv o'n besh to'qqiz chiqadi, nol emas.",
      'Это значение среднего слагаемого, а квадратное слагаемое не учтено. Три надо подставить ВО ВСЕ слагаемые: девять, потом минус пятнадцать, потом c. Подставь пятнадцать и проверь: девять минус пятнадцать плюс пятнадцать даёт девять, а не нуль.',
      'That is the value of the middle term, with the squared term left out. Three must be substituted into EVERY term: nine, then minus fifteen, then c. Substitute fifteen and check: nine minus fifteen plus fifteen gives nine, not zero.') },
    { when: (s) => s.value === 2, text: L(
      "Ikki — bu tenglamaning IKKINCHI ILDIZI, ozod had emas. Ildiz va koeffitsiyent boshqa-boshqa narsa: koeffitsiyent yozuvda turadi, ildiz esa qo'yiladi. Ikkini c ga qo'yib tekshiring: to'qqiz minus o'n besh qo'shuv ikki minus to'rt chiqadi.",
      'Два — это ВТОРОЙ КОРЕНЬ уравнения, а не свободный член. Корень и коэффициент — разные вещи: коэффициент стоит в записи, а корень подставляют. Подставь два вместо c и проверь: девять минус пятнадцать плюс два даёт минус четыре.',
      'Two is the SECOND ROOT of the equation, not the constant term. A root and a coefficient are different things: a coefficient stands in the record, a root is substituted. Put two in place of c and check: nine minus fifteen plus two gives minus four.') },
    { when: (s) => s.value === 0, text: L(
      "Nolni qo'ysangiz tenglama t kvadrat minus besh t bo'lib qoladi, va uning ildizlari nol bilan besh. Uch esa ildiz bo'lmaydi: to'qqiz minus o'n besh minus olti, nol emas.",
      'С нулём уравнение станет t квадрат минус пять t, и его корни нуль и пять. А три корнем не будет: девять минус пятнадцать это минус шесть, а не нуль.',
      'With zero the equation becomes t squared minus five t, whose roots are zero and five. Three would not be a root: nine minus fifteen is minus six, not zero.') },
  ],
  wrongText: L(
    "Uchni tenglamaning hamma hadiga qo'ying va yig'indini nolga tenglashtiring. Javobni qaytib qo'yib tekshiring: yig'indi nol chiqishi kerak.",
    'Подставь три во все слагаемые уравнения и приравняй сумму к нулю. Проверь ответ обратной подстановкой: сумма должна выйти нулём.',
    'Substitute three into every term of the equation and set the sum to zero. Check your answer by substituting back: the sum must come out zero.'),
};

export default function D15_08(props) { return <TypeValue data={DATA} {...props} />; }
