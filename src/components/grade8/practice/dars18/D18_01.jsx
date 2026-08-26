// Dars18 · Amaliyot 01 — Ha yoki yo'q · 🟢 · tag: D_zero_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §6 (18-dars, 1-pozitsiya)
//
// З9 BIRINCHI TOPSHIRIQDA. Darsning eng qimmat joyi shu: «D nolga teng»
// «ildiz yo'q» degani EMAS. Nolda plyus-minus ildiz nolga aylanadi, ya'ni
// ikki ildiz bitta bo'lib qo'shiladi — lekin u BOR.
//
// Ikki mulohaza bir xil so'z bilan tuzilgan («bitta ildiz bor»), farqi faqat
// D ning qiymatida: nol va minus to'rt. Shuning uchun javob so'zni tanishdan
// emas, ma'nosidan chiqadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'D_zero_claims', level: '🟢',
  itemSize: 18,
  items: [
    { id: 's1', yes: true,
      tokens: ['D = 0'],
      claim: L('bitta ildiz bor', 'есть один корень', 'there is one root') },
    { id: 's2', yes: false,
      tokens: ['D = −4'],
      claim: L('bitta ildiz bor', 'есть один корень', 'there is one root') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "Ikki mulohaza bir xil so'z bilan yozilgan, farqi faqat diskriminantning qiymatida. Nol bilan manfiy son bir xil emas.",
    'Два утверждения записаны одними и теми же словами, различается только значение дискриминанта. Нуль и отрицательное число — не одно и то же.',
    'Two claims are written in the same words; only the value of the discriminant differs. Zero and a negative number are not the same thing.'),
  ask: L(
    "Mulohaza rost bo'lsa «Ha», yolg'on bo'lsa «Yo'q».",
    'Если утверждение верно — «Да», если ложно — «Нет».',
    'If the claim is true, «Yes»; if false, «No».'),
  correctText: L(
    "To'g'ri. D nolga teng bo'lganda formulada nolning ildizi, ya'ni nol qo'shiladi va ayiriladi — ikki hisob bir xil javobni beradi. Demak ildiz BITTA, yo'q emas. D manfiy bo'lganda esa manfiy sondan ildiz olish kerak bo'ladi, bunday son yo'q — shuning uchun haqiqiy ildiz umuman yo'q. Nol va manfiy son ikki boshqa hol.",
    'Верно. Когда D равно нулю, в формуле прибавляется и вычитается корень из нуля, то есть нуль — оба вычисления дают один ответ. Значит корень ОДИН, а не отсутствует. А когда D отрицательно, пришлось бы извлекать корень из отрицательного числа, а такого числа нет — поэтому действительных корней нет вовсе. Нуль и отрицательное — два разных случая.',
    'Correct. When D is zero the formula adds and subtracts the root of zero, that is zero — both computations give the same answer. So there is ONE root, not none. When D is negative you would need the root of a negative number, and no such number exists — so there are no real roots at all. Zero and negative are two different cases.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Nol — bu «yo'q» degani emas. Formulaga qarang: D nolga teng bo'lsa, ildiz ostidan nol chiqadi, va plyus-minus nol hech narsani o'zgartirmaydi. Ikki hisob bir xil natijani beradi, ya'ni ildiz bitta. Misol: x kvadrat minus olti x qo'shuv to'qqiz nolga teng, D nol, ildiz uch — va u haqiqatan ildiz: to'qqiz minus o'n sakkiz qo'shuv to'qqiz nol.",
      'Нуль — это не «нет». Посмотри на формулу: если D равно нулю, из-под корня выходит нуль, и плюс-минус нуль ничего не меняет. Оба вычисления дают одно и то же, значит корень один. Пример: x квадрат минус шесть x плюс девять равно нулю, D нуль, корень три — и он действительно корень: девять минус восемнадцать плюс девять нуль.',
      'Zero does not mean «none». Look at the formula: when D is zero, zero comes out of the root, and plus-or-minus zero changes nothing. Both computations give the same result, so there is one root. Example: x squared minus six x plus nine equals zero, D is zero, the root is three — and it really is a root: nine minus eighteen plus nine is zero.') },
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "D minus to'rtga teng bo'lganda ildiz BITTA emas, umuman yo'q. Formulada minus to'rtdan ildiz olish kerak bo'ladi, kvadrati minus to'rtga teng son esa yo'q — 10-darsda ko'rilgan. Bitta ildiz faqat D nolga teng bo'lganda bo'ladi.",
      'При D равном минус четырём корень не ОДИН, а корней нет вовсе. В формуле пришлось бы извлечь корень из минус четырёх, а числа с квадратом минус четыре не существует — это было в десятом уроке. Один корень бывает только при D равном нулю.',
      'When D is minus four there is not ONE root but none at all. The formula would need the root of minus four, and no number squares to minus four — as seen in lesson ten. One root happens only when D is zero.') },
  ],
  wrongText: L(
    "Formulaga qarang: ildiz ostida D turadi. Nol bo'lsa plyus-minus hech narsani o'zgartirmaydi — bitta javob. Manfiy bo'lsa ildizni olib bo'lmaydi — javob yo'q.",
    'Посмотри на формулу: под корнем стоит D. Нуль — плюс-минус ничего не меняет, один ответ. Отрицательное — корень не извлекается, ответа нет.',
    'Look at the formula: D sits under the root. Zero means the plus-or-minus changes nothing — one answer. Negative means the root cannot be taken — no answer.'),
};

export default function D18_01(props) { return <TrueFalse data={DATA} {...props} />; }
