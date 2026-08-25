// Dars06 · Amaliyot 02 — Qaysi amal birinchi · 🟢 · tag: which_first
//
// KETMA-KETLIK O'ZGARDI (metodist, 2026-08-24): bu topshiriq ilgari 1-o'rinda
// turgan, endi 2-o'rinda. Mexanikasi va matematikasi o'sha — 2-6 darslar
// 1-darsning o'nta mexanikasidan har xil tartibda foydalanadi
// (`DARS02_06_AMALIYOT_SKELET.md` §2).
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Taqsimot: `scripts/grade8-practice-layout.mjs` (6-dars, 1-pozitsiya).
//
// 1/c + 2/c · 3. Qavs yo'q, demak ko'paytirish birinchi bajariladi:
//   2/c · 3 = 6/c,  keyin 1/c + 6/c = 7/c
// Chapdan o'ngga o'qilsa 9/c chiqadi — bu З15, darsning asosiy adashishi.
// Variantlar SON bilan berilgan, so'z bilan emas: o'quvchi tartibni
// aytmaydi, uni HISOBGA aylantiradi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'which_first', level: '🟢',
  correct: 0, optCols: 2, optSize: 20,
  eyebrow: L('Test', 'Тест', 'Test'),
  setup: L(
    "Yozuvda qavs yo'q. Amallar tartibi sonlardagidek: avval ko'paytirish va bo'lish, keyin qo'shish va ayirish.",
    'В записи нет скобок. Порядок действий как у чисел: сначала умножение и деление, потом сложение и вычитание.',
    'There are no brackets. The order of operations is as with numbers: multiplication and division first, then addition and subtraction.'),
  expr: [{ n: '1', d: 'c' }, '+', { n: '2', d: 'c' }, '·', '3'], exprSize: 26,
  ask: L('Qiymati qanday?', 'Чему равно?', 'What does it equal?'),
  opts: [
    { label: [{ n: '7', d: 'c' }] },
    { label: [{ n: '9', d: 'c' }] },
    { label: [{ n: '6', d: 'c²' }] },
    { label: [{ n: '3', d: 'c' }] },
  ],
  correctText: L(
    "To'g'ri. Avval ko'paytirish: ikki bo'lingan c karra uch bu olti bo'lingan c. Keyin qo'shish: bir bo'lingan c qo'shuv olti bo'lingan c bu yetti bo'lingan c. C ni ikkiga teng qo'ying: yarim qo'shuv uch bu uch yarim, va yetti ikkidan ham uch yarim.",
    'Верно. Сначала умножение: два делить на c на три — шесть делить на c. Потом сложение: один делить на c плюс шесть делить на c — семь делить на c. Подставь c равное двум: половина плюс три — три с половиной, и семь вторых тоже.',
    'Correct. Multiplication first: two over c times three is six over c. Then addition: one over c plus six over c is seven over c. Put c equal to two: a half plus three is three and a half, and seven halves is the same.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Siz chapdan o'ngga hisobladingiz: avval qo'shdingiz, keyin ko'paytirdingiz. Qavs yo'q bo'lsa, ko'paytirish HAR DOIM oldin bajariladi. Qo'shish birinchi bo'lishi uchun qavs yozilishi kerak edi.",
      'Ты считал слева направо: сначала сложил, потом умножил. Без скобок умножение выполняется ВСЕГДА раньше. Чтобы сложение было первым, нужны скобки.',
      'You went left to right: added first, then multiplied. Without brackets, multiplication always comes first. For the addition to come first, brackets would have to be written.') },
    { when: (s) => s.picked === 2, text: L(
      "Maxraj kvadratga aylanib qolgan. Kasrni SONGA ko'paytirganda son suratga tegishli: ikki bo'lingan c karra uch bu olti bo'lingan c, olti bo'lingan c kvadrat emas.",
      'Знаменатель возведён в квадрат. При умножении дроби на ЧИСЛО оно относится к числителю: два делить на c на три — шесть делить на c, а не шесть делить на c в квадрате.',
      'The denominator got squared. When a fraction is multiplied by a NUMBER, the number affects the numerator: two over c times three is six over c, not six over c squared.') },
    { when: (s) => s.picked === 3, text: L(
      "Ko'paytirish umuman bajarilmagan: bu shunchaki bir bo'lingan c qo'shuv ikki bo'lingan c. Uchlik yo'qolib qolgan.",
      'Умножение вообще не сделано: это просто один делить на c плюс два делить на c. Тройка пропала.',
      'The multiplication was not done at all: this is just one over c plus two over c. The three disappeared.') },
  ],
  wrongText: L(
    "Avval ko'paytirishni bajaring, keyin qo'shishni. Javobni c ning istalgan qiymatida tekshiring.",
    'Сначала выполни умножение, потом сложение. Проверь ответ при любом значении c.',
    'Do the multiplication first, then the addition. Check the answer at any value of c.'),
};

export default function D06_02(props) { return <Choice data={DATA} {...props} />; }
