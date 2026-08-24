// Dars12 · Amaliyot 09 — Shart · 🔴 · tag: which_condition
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Skelet: DARS12_14_AMALIYOT_SKELET.md §3 (12-dars, 9-pozitsiya)
//
// DARSNING ENG QIMMAT SAVOLI: xossa QAYSI SHARTDA ishlaydi. Uchta xato
// variant uchta aniq adashish, va ularning eng xatarlisi ikkinchisi —
// «ko'paytma nomanfiy bo'lsa yetadi». Bu aynan 03-topshiriqdagi holat:
// ko'paytma musbat, ildiz bor, lekin yozuvni ikki ildizga ajratib bo'lmaydi.
//
// To'rtinchi variant teskari tomondan xato: shart juda TOR: musbat degan so'z
// nolni chiqarib tashlaydi, holbuki nolda xossa ishlaydi.
// Variantlar aralashtiriladi (Choice ichida), razbor shartlari esa ASL
// raqamda qoladi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'which_condition', level: '🔴',
  correct: 0, optCols: 1,
  expr: [{ r: 'x · y' }, '=', { r: 'x' }, '·', { r: 'y' }], exprSize: 26,
  eyebrow: L('Shart', 'Условие', 'Condition'),
  setup: L(
    "Bu tenglik har doim bajarilmaydi. To'rt javobdan bittasi shartni aynan aytadi, uchtasi esa shartni yo ochib yuboradi, yo ortiqcha toraytiradi.",
    'Это равенство выполняется не всегда. Один из четырёх ответов называет условие точно, три либо ослабляют его, либо сужают лишнее.',
    'This equality does not always hold. One of the four answers states the condition exactly; three either loosen it or narrow it too far.'),
  ask: L('Tenglik qaysi holda to\'g\'ri?', 'В каком случае равенство верно?', 'In which case is the equality true?'),
  opts: [
    { label: L('x va y ning ikkalasi ham nomanfiy bo\'lganda', 'когда оба, x и y, неотрицательны', 'when both x and y are non-negative') },
    { label: L('x · y ko\'paytmasi nomanfiy bo\'lganda', 'когда произведение x на y неотрицательно', 'when the product of x and y is non-negative') },
    { label: L('har qanday x va y da', 'при любых x и y', 'for any x and y') },
    { label: L('x va y ning ikkalasi ham musbat bo\'lganda', 'когда оба, x и y, положительны', 'when both x and y are positive') },
  ],
  // RAZBOR QISQA: o'lchov 2026-08-24 (grade8-practice-panel.mjs) — to'rt so'zli
  // variant balandligi ustiga uzun razbor kelib, telefonda 26px panel ostida
  // qolardi. Nol misoli qisqartirildi, tafsilot `wrongs` da qoldi.
  correctText: L(
    "To'g'ri. Shart ko'paytuvchilarning O'ZIGA qo'yiladi: har biridan ildiz olinishi kerak, ya'ni ikkalasi ham noldan kichik bo'lmasligi shart. Nol ham yaraydi: nol karra to'qqizdan ildiz nol, va nolning ildizi karra uch ham nol. Ikkalasi manfiy bo'lganda esa ko'paytma musbat, ildiz bor, lekin uni ikki ildizga yozib bo'lmaydi.",
    'Верно. Условие ставится на САМИ множители: из каждого должен извлекаться корень, то есть оба не меньше нуля. Нуль годится: корень из нуля на девять нуль, и корень из нуля на три тоже нуль. А когда оба отрицательны, произведение положительно и корень есть, но записать его через два корня нельзя.',
    'Correct. The condition applies to the FACTORS themselves: each must have a root, so neither may be less than zero. Zero qualifies: the root of zero times nine is zero, and the root of zero times three is zero as well. When both are negative the product is positive and the root exists, but it cannot be written as two roots.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Ko'paytmaning nomanfiyligi YETMAYDI, va buni son ko'rsatadi. x ni minus to'qqiz, y ni minus to'rt deb oling: ko'paytma o'ttiz olti, nomanfiy, chap tomon olti. O'ng tomonda esa minus to'qqizdan ildiz kerak, kvadrati minus to'qqizga teng son esa yo'q. Chap tomonda olti, o'ng tomonda hech narsa — tenglik buzildi.",
      'Неотрицательности произведения НЕ ХВАТАЕТ, и это видно на числах. Возьми x равным минус девяти, y равным минус четырём: произведение тридцать шесть, левая часть шесть. А справа нужен корень из минус девяти, числа с таким квадратом нет. Слева шесть, справа ничего.',
      'Non-negativity of the product is NOT ENOUGH, and numbers show it. Take x as minus nine and y as minus four: the product is thirty six, non-negative, and the left side is six. But the right side needs the root of minus nine, and no number has that square. Six on the left, nothing on the right — the equality broke.') },
    { when: (s) => s.picked === 2, text: L(
      "«Har qanday» juda ko'p: manfiy sonlar ham shu ta'rifga tushadi. x ni minus ikki, y ni minus ellik deb oling. Chap tomon: yuzdan ildiz, ya'ni o'n. O'ng tomon: minus ikkidan ildiz karra minus ellikdan ildiz — ikkalasining ham qiymati yo'q. Bitta qarshi misol tenglikni «har doim» dan chiqarib tashlaydi.",
      '«При любых» — это слишком много: под такое описание попадают и отрицательные числа. Возьми x равным минус двум, y равным минус пятидесяти. Слева: корень из ста, то есть десять. Справа: корень из минус двух на корень из минус пятидесяти — ни у одного значения нет. Одного контрпримера хватает, чтобы вычеркнуть слово «всегда».',
      '«For any» is too much: negative numbers fall under that description too. Take x as minus two and y as minus fifty. Left side: the root of one hundred, that is ten. Right side: the root of minus two times the root of minus fifty — neither has a value. One counterexample is enough to strike out the word «always».') },
    { when: (s) => s.picked === 3, text: L(
      "Bu shart to'g'ri, lekin ORTIQCHA tor: u nolni chiqarib tashlaydi, holbuki nolda tenglik bajariladi. x ni nol, y ni yigirma besh deb oling: chap tomon noldan ildiz, ya'ni nol; o'ng tomon nol karra besh, ya'ni ham nol. Nolda ishlaydigan qoidadan nolni olib tashlash kerak emas — shuning uchun ta'rifda nomanfiy deyiladi.",
      'Это условие верное, но ЛИШНЕ узкое: оно выбрасывает нуль, а в нуле равенство выполняется. Возьми x равным нулю, y равным двадцати пяти: слева корень из нуля, то есть нуль; справа нуль на пять, тоже нуль. Убирать нуль из правила, которое в нуле работает, не нужно — поэтому в определении стоит неотрицательны.',
      'That condition is true but NEEDLESSLY narrow: it excludes zero, yet at zero the equality holds. Take x as zero and y as twenty five: the left side is the root of zero, that is zero; the right side is zero times five, zero as well. There is no reason to cut zero out of a rule that works at zero — that is why the definition says non-negative.') },
  ],
  wrongText: L(
    "Shart ko'paytmaga emas, KO'PAYTUVCHILARGA qo'yiladi. Har javobni ikki son bilan sinab ko'ring: minus to'qqiz va minus to'rt, keyin nol va yigirma besh.",
    'Условие ставится не на произведение, а на МНОЖИТЕЛИ. Проверь каждый ответ двумя парами чисел: минус девять и минус четыре, потом нуль и двадцать пять.',
    'The condition applies not to the product but to the FACTORS. Test each answer with two pairs of numbers: minus nine and minus four, then zero and twenty five.'),
};

export default function D12_09(props) { return <Choice data={DATA} {...props} />; }
