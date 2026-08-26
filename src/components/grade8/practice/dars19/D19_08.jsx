// Dars19 · Amaliyot 08 — Ikkinchi ildiz · 🔴 · tag: find_second_root
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §7 (19-dars, 8-pozitsiya)
//
// З46: IKKINCHI ILDIZ YIG'INDIDAN TOPILADI. Ozod had noma'lum, shuning uchun
// ko'paytma yo'li yopiq — faqat yig'indi qoladi. p minus uchga teng, demak
// yig'indi arti uch: besh qo'shuv ikkinchi ildiz uchga teng, ikkinchi ildiz
// minus ikki.
//
// Birinchi xato variant — З45: yig'indini minus uch deb olish, o'shanda
// ikkinchi ildiz minus sakkiz chiqadi. Qolgan ikkitasi ko'paytma yo'lini
// taxmin qilishdan chiqadi.
// Variantlar aralashtiriladi (Choice ichida), razbor shartlari ASL raqamda.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'find_second_root', level: '🔴',
  correct: 0, optCols: 2, optSize: 20,
  expr: ['x² − 3x + q = 0'], exprSize: 26,
  given: [['x₁ = 5']],
  givenLabel: L('Bir ildiz', 'Один корень', 'One root'),
  eyebrow: L('Ikkinchi ildiz', 'Второй корень', 'Second root'),
  setup: L(
    "Ozod had noma'lum, demak ko'paytma yo'li yopiq. Lekin ikkinchi koeffitsiyent ma'lum, va yig'indi undan topiladi.",
    'Свободный член неизвестен, значит путь через произведение закрыт. Зато известен второй коэффициент, и сумма находится по нему.',
    'The constant term is unknown, so the product route is closed. But the second coefficient is known, and the sum follows from it.'),
  ask: L('Ikkinchi ildiz nimaga teng?', 'Чему равен второй корень?', 'What does the second root equal?'),
  opts: [
    { label: ['x₂ = −2'] },
    { label: ['x₂ = 2'] },
    { label: ['x₂ = 8'] },
    { label: ['x₂ = −8'] },
  ],
  correctText: L(
    "To'g'ri. p minus uchga teng, demak ildizlar yig'indisi arti uch. Besh qo'shuv ikkinchi ildiz uchga teng, ya'ni ikkinchi ildiz uch minus besh — minus ikki. Tekshirish: ko'paytma minus o'n, demak q minus o'nga teng.",
    'Верно. p равно минус трём, значит сумма корней плюс три. Пять плюс второй корень равно трём, то есть второй корень три минус пять — минус два. Проверка: произведение минус десять, значит q равно минус десяти.',
    'Correct. p is minus three, so the sum of the roots is plus three. Five plus the second root equals three, so the second root is three minus five — minus two. Check: the product is minus ten, so q is minus ten.'),
  wrongs: [
    { when: (s) => s.picked === 3, text: L(
      "Yig'indi minus uch deb olingan. Teoremada yig'indi MINUS p ga teng, p esa minus uch — demak yig'indi arti uch. Minus sakkizni tekshiring: besh qo'shuv minus sakkiz minus uch, ya'ni yig'indi minus uch chiqadi, arti uch emas.",
      'Сумма взята как минус три. В теореме сумма равна МИНУС p, а p минус три — значит сумма плюс три. Проверь минус восемь: пять плюс минус восемь минус три, то есть сумма выходит минус три, а не плюс три.',
      'The sum was taken as minus three. In the theorem the sum equals MINUS p, and p is minus three — so the sum is plus three. Check minus eight: five plus minus eight is minus three, so the sum comes out minus three, not plus three.') },
    { when: (s) => s.picked === 1, text: L(
      "Ikki emas, minus ikki. Besh qo'shuv ikki yetti chiqadi, yig'indi esa uchga teng bo'lishi kerak. Uch minus besh minus ikki — ikkinchi ildiz manfiy, chunki besh yig'indidan katta.",
      'Не два, а минус два. Пять плюс два даёт семь, а сумма должна быть три. Три минус пять минус два — второй корень отрицателен, ведь пять больше суммы.',
      'Not two but minus two. Five plus two is seven, while the sum must be three. Three minus five is minus two — the second root is negative, since five exceeds the sum.') },
    { when: (s) => s.picked === 2, text: L(
      "Sakkiz — bu besh qo'shuv uch, ya'ni yig'indini ildizga QO'SHISH. Lekin besh va sakkiz ildiz bo'lsa, ularning yig'indisi o'n uch bo'lardi, uch emas. Ikkinchi ildizni topish uchun yig'indidan birinchi ildizni AYIRISH kerak.",
      'Восемь — это пять плюс три, то есть сумма ПРИБАВЛЕНА к корню. Но если бы корнями были пять и восемь, их сумма равнялась бы тринадцати, а не трём. Чтобы найти второй корень, из суммы надо ВЫЧЕСТЬ первый.',
      'Eight is five plus three, meaning the sum was ADDED to the root. But if five and eight were the roots their sum would be thirteen, not three. To find the second root you SUBTRACT the first from the sum.') },
  ],
  wrongText: L(
    "Yig'indi minus p ga teng — ishorani almashtiring. Keyin yig'indidan birinchi ildizni ayiring. Javobni tekshirish uchun ko'paytmani hisoblab q ni toping va ildizni tenglamaga qo'ying.",
    'Сумма равна минус p — поменяй знак. Потом вычти из суммы первый корень. Для проверки посчитай произведение, найди q и подставь корень в уравнение.',
    'The sum equals minus p — flip the sign. Then subtract the first root from the sum. To check, compute the product, find q and substitute the root into the equation.'),
};

export default function D19_08(props) { return <Choice data={DATA} {...props} />; }
