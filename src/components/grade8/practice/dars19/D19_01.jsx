// Dars19 · Amaliyot 01 — Keltirilgan · 🟢 · tag: reduced_marked
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §7 (19-dars, 1-pozitsiya)
//
// T1: KELTIRILGAN TENGLAMA — bosh koeffitsiyenti BIRGA teng tenglama. Viyet
// teoremasi faqat shunday tenglamada to'g'ridan-to'g'ri ishlaydi.
//
// OXIRGI KARTA ENG QIMMAT TUZOQ: `−y² + 4y − 3 = 0` da bosh koeffitsiyent
// minus bir, ya'ni birga teng EMAS. Uni keltirilgan qilish uchun ikki tomonni
// minus birga ko'paytirish kerak.
// OLDINGI BLOKDAN (TIPLAR §6): `y² − 9 = 0` — chala kvadrat tenglama
// (16-dars), va u ham keltirilgan; Viyet u yerda ham ishlaydi (yig'indi nol,
// ko'paytma minus to'qqiz).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'reduced_marked', level: '🟢',
  col: 164, itemSize: 15,
  items: [
    { id: 'i1', tokens: ['y² − 4y + 3 = 0'], hit: true },
    { id: 'i2', tokens: ['2y² − 5y + 6 = 0'] },
    { id: 'i3', tokens: ['y² + 3y − 10 = 0'], hit: true },
    { id: 'i4', tokens: ['3y² + y − 2 = 0'] },
    { id: 'i5', tokens: ['y² − 9 = 0'], hit: true },
    { id: 'i6', tokens: ['−y² + 4y − 3 = 0'] },
  ],
  eyebrow: L('Keltirilgan', 'Приведённое', 'Reduced'),
  setup: L(
    "Keltirilgan kvadrat tenglama — bosh koeffitsiyenti birga teng tenglama. Viyet teoremasi aynan shunday tenglamada to'g'ridan-to'g'ri ishlaydi.",
    'Приведённое квадратное уравнение — то, у которого старший коэффициент равен единице. Теорема Виета работает напрямую именно с таким.',
    'A reduced quadratic equation is one whose leading coefficient equals one. Vieta\'s theorem works directly with exactly that kind.'),
  ask: L(
    'Keltirilgan bo\'lgan 3 ta tenglamani belgilang.',
    'Отметь 3 уравнения, которые являются приведёнными.',
    'Mark the 3 equations that are reduced.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Uchtasida x kvadratning oldida hech narsa yo'q, ya'ni koeffitsiyent birga teng — shu ham keltirilgan tenglama. Uchinchisida ikkinchi koeffitsiyent yo'q, lekin bu ahamiyatsiz: shart faqat bosh koeffitsiyent haqida.",
    'Верно. В трёх перед y квадрат ничего не стоит, то есть коэффициент равен единице — это и есть приведённое уравнение. В третьем нет второго коэффициента, но это неважно: условие только про старший.',
    'Correct. In three of them nothing stands in front of y squared, so the coefficient is one — that is a reduced equation. The third lacks a second coefficient, but that does not matter: the condition concerns only the leading one.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('i6') !== -1, text: L(
      "Bu tenglamada bosh koeffitsiyent MINUS BIR, birga teng emas. Minus bir ham «bir» degan so'zga o'xshaydi, lekin son boshqa. Uni keltirilgan qilish uchun ikki tomonni minus birga ko'paytirish kerak: y kvadrat minus to'rt y qo'shuv uch nolga teng.",
      'В этом уравнении старший коэффициент МИНУС ОДИН, а не единица. Минус один похож на слово «один», но это другое число. Чтобы сделать уравнение приведённым, надо умножить обе части на минус один: y квадрат минус четыре y плюс три равно нулю.',
      'In this equation the leading coefficient is MINUS ONE, not one. Minus one resembles the word «one», but it is a different number. To make it reduced, multiply both sides by minus one: y squared minus four y plus three equals zero.') },
    { when: (s) => s.extra.indexOf('i2') !== -1 || s.extra.indexOf('i4') !== -1, text: L(
      "Bu tenglamada x kvadratning oldida son turadi — ikki yoki uch. Keltirilgan tenglamada esa u birga teng bo'lishi kerak. Ikki tomonni shu songa bo'lsangiz keltirilgan tenglama chiqadi, lekin koeffitsiyentlar kasr bo'lib qolishi mumkin.",
      'В этом уравнении перед y квадрат стоит число — два или три. А в приведённом оно должно быть единицей. Если разделить обе части на это число, выйдет приведённое уравнение, но коэффициенты могут стать дробными.',
      'In this equation a number stands in front of y squared — two or three. In a reduced equation it must be one. Dividing both sides by that number gives a reduced equation, though the coefficients may turn into fractions.') },
    { when: (s) => s.miss.indexOf('i5') !== -1, text: L(
      "y kvadrat minus to'qqiz chetlab o'tildi. Bu chala kvadrat tenglama (16-dars), lekin bosh koeffitsiyent birga teng — demak u keltirilgan. Viyet teoremasi u yerda ham ishlaydi: ildizlari uch va minus uch, yig'indi nol, ko'paytma minus to'qqiz.",
      'y квадрат минус девять осталось в стороне. Это неполное квадратное уравнение (урок 16), но старший коэффициент равен единице — значит оно приведённое. Теорема Виета работает и там: корни три и минус три, сумма нуль, произведение минус девять.',
      'y squared minus nine was left out. It is an incomplete quadratic (lesson 16), but its leading coefficient is one — so it is reduced. Vieta\'s theorem works there too: the roots are three and minus three, their sum is zero and their product minus nine.') },
    { when: (s) => s.marked.length !== 3, text: L(
      "Aynan uchta tenglama kerak. Har birida bitta joyga qarang: y kvadratning oldidagi son. Hech narsa yo'q bo'lsa u birga teng.",
      'Нужно ровно три уравнения. В каждом смотри в одно место: число перед y квадрат. Если там ничего нет, оно равно единице.',
      'Exactly three equations are needed. Look at one place in each: the number in front of y squared. If nothing is there, it equals one.') },
  ],
  wrongText: L(
    "Faqat bosh koeffitsiyentga qarang. Ko'rinmasa u birga teng; minus turgan bo'lsa esa minus birga teng — bu keltirilgan emas.",
    'Смотри только на старший коэффициент. Не виден — равен единице; стоит минус — равен минус одному, и это не приведённое.',
    'Look only at the leading coefficient. Invisible means one; a minus in front means minus one, and that is not reduced.'),
};

export default function D19_01(props) { return <MarkAll data={DATA} {...props} />; }
