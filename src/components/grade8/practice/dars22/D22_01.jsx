// Dars22 · Amaliyot 01 — Ko'paytuvchilar · 🟢 · tag: factored_form
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §4 (22-dars, 1-pozitsiya)
//
// T1 ENG SODDA HOLDA: bosh koeffitsiyent birga teng, ya'ni qavslar oldida
// hech narsa turmaydi va ish faqat ILDIZLARDA.
//
// Uch xato variant uch xil yo'l:
//   (x + 2)(x + 3) — ikkala ishora almashdi (ildizlar minus ikki va minus uch);
//   (x − 2)(x + 3) — bittasi almashdi;
//   (x − 5)(x − 6) — koeffitsiyentlarni ildiz deb o'qish (З46): besh va olti
//                    ildiz emas, ular ildizlarning YIG'INDISI va KO'PAYTMASI.
// Variantlar aralashtiriladi (Choice ichida), razbor shartlari ASL raqamda.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'factored_form', level: '🟢',
  correct: 0, optCols: 2, optSize: 18,
  expr: ['x² − 5x + 6'], exprSize: 28,
  eyebrow: L("Ko'paytuvchilar", 'Множители', 'Factors'),
  setup: L(
    "Kvadrat uchhad ikki qavsning ko'paytmasi shaklida yoziladi. Qavslarning ichida uchhadning ILDIZLARI turadi, ularning oldida esa minus.",
    'Квадратный трёхчлен записывается в виде произведения двух скобок. Внутри скобок стоят КОРНИ трёхчлена, а перед ними минус.',
    'A quadratic trinomial is written as a product of two brackets. Inside the brackets stand the ROOTS of the trinomial, each with a minus before it.'),
  ask: L(
    "Bu uchhad qanday ko'paytuvchilarga ajraladi?",
    'На какие множители раскладывается этот трёхчлен?',
    'Into which factors does this trinomial split?'),
  opts: [
    { label: ['(x − 2)(x − 3)'] },
    { label: ['(x + 2)(x + 3)'] },
    { label: ['(x − 2)(x + 3)'] },
    { label: ['(x − 5)(x − 6)'] },
  ],
  correctText: L(
    "To'g'ri. Uchhadning ildizlari ikki va uch, va qavsda ildizning oldida MINUS turadi — musbat ildiz ayirish bilan yoziladi. Qavslarni ochib tekshiring: x kvadrat minus besh x qo'shuv olti.",
    'Верно. Корни трёхчлена два и три, а в скобке перед корнем стоит МИНУС — положительный корень даёт вычитание. Проверь раскрытием: x квадрат минус пять x плюс шесть.',
    'Correct. The roots of the trinomial are two and three, and a MINUS stands before each root in the bracket — a positive root appears as a subtraction. Check by expanding: x squared minus five x plus six.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Ikkala ishora almashgan. Bu yozuvning ildizlari minus ikki va minus uch, ya'ni qavslarni ochsangiz x kvadrat QO'SHUV besh x qo'shuv olti chiqadi. Berilgan uchhadda esa besh x ning oldida minus turibdi. Ildizni tekshirib ko'ring: minus ikkida to'rt qo'shuv o'n qo'shuv olti yigirma, nol emas.",
      'Оба знака заменены. У этой записи корни минус два и минус три, то есть раскрыв скобки, получишь x квадрат ПЛЮС пять x плюс шесть. А в данном трёхчлене перед пятью x стоит минус. Проверь корень: при минус двух четыре плюс десять плюс шесть двадцать, а не нуль.',
      'Both signs are flipped. This record has roots minus two and minus three, so expanding gives x squared PLUS five x plus six. But in the given trinomial there is a minus before five x. Check the root: at minus two, four plus ten plus six is twenty, not zero.') },
    { when: (s) => s.picked === 2, text: L(
      "Bitta ishora almashgan: bu yozuvning ildizlari ikki va MINUS uch. Ularning ko'paytmasi minus olti, uchhadda esa ozod had arti olti. Qavslarni oching: x kvadrat qo'shuv uch x minus ikki x minus olti, ya'ni x kvadrat qo'shuv x minus olti — boshqa uchhad.",
      'Заменён один знак: у этой записи корни два и МИНУС три. Их произведение минус шесть, а в трёхчлене свободный член плюс шесть. Раскрой скобки: x квадрат плюс три x минус два x минус шесть, то есть x квадрат плюс x минус шесть — другой трёхчлен.',
      'One sign is flipped: this record has roots two and MINUS three. Their product is minus six, while the trinomial has a free term of plus six. Expand: x squared plus three x minus two x minus six, that is x squared plus x minus six — a different trinomial.') },
    { when: (s) => s.picked === 3, text: L(
      "Besh va olti — bu ildizlar EMAS, ular koeffitsiyentlar. Beshni qo'yib ko'ring: yigirma besh minus yigirma besh qo'shuv olti olti, nol emas. Aslida besh — ildizlarning YIG'INDISI (ikki qo'shuv uch), olti esa ularning KO'PAYTMASI (ikki karra uch). Qavsga koeffitsiyent emas, ildiz yoziladi.",
      'Пять и шесть — это НЕ корни, это коэффициенты. Подставь пять: двадцать пять минус двадцать пять плюс шесть шесть, а не нуль. На самом деле пять — это СУММА корней (два плюс три), а шесть — их ПРОИЗВЕДЕНИЕ (два на три). В скобку пишут корень, а не коэффициент.',
      'Five and six are NOT roots, they are coefficients. Substitute five: twenty five minus twenty five plus six is six, not zero. In fact five is the SUM of the roots (two plus three) and six is their PRODUCT (two times three). A bracket holds a root, not a coefficient.') },
  ],
  wrongText: L(
    "Avval ildizlarni toping va ularni tenglamaga qo'yib tekshiring. Keyin har ildizni qavsga MINUS bilan yozing. Oxirida qavslarni ochib, dastlabki uchhad chiqishini ko'ring.",
    'Сначала найди корни и проверь их подстановкой. Потом запиши каждый корень в скобку с МИНУСОМ. В конце раскрой скобки и убедись, что выходит исходный трёхчлен.',
    'First find the roots and check them by substitution. Then write each root into a bracket with a MINUS. Finally expand the brackets and see that the original trinomial comes back.'),
};

export default function D22_01(props) { return <Choice data={DATA} {...props} />; }
