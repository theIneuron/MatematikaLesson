// Dars47 · Amaliyot 10 — Guruhlar · 🔴 · tag: equation_groups
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §9 (47-dars, 10-pozitsiya)
//
// BITTA JADVALDA IKKI KO'RINISH: Pifagor tengligi va undan chiqqan CHIZIQLI
// tenglama (T2). Kvadratli yozuvda ildiz chiqariladi, chiziqlisida bo'lish
// bajariladi — bir xil harakat ishlamaydi.
//
// Ikki karta ATAYLAB katta sonlar bilan: x kvadrat qo'shuv qirq kvadrat teng
// qirq bir kvadrat (bu 9-40-41 uchligi) va x kvadrat qo'shuv o'ttiz besh
// kvadrat teng o'ttiz yetti kvadrat (12-35-37) — ularni yodlab bo'lmaydi,
// hisoblash kerak.
// Kartalarda faqat BELGI turadi (skelet §0a.4).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'equation_groups', level: '🔴',
  zoneLbl: 96, zoneSize: 18, itemSize: 14,
  zones: [
    { id: 'z1', tokens: ['x = 9'] },
    { id: 'z2', tokens: ['x = 12'] },
  ],
  items: [
    { id: 'i1', tokens: ['x² + 144 = 225'], zone: 'z1' },
    { id: 'i2', tokens: ['x² + 25 = 169'], zone: 'z2' },
    { id: 'i3', tokens: ['x² = 81'], zone: 'z1' },
    { id: 'i4', tokens: ['x² = 144'], zone: 'z2' },
    { id: 'i5', tokens: ['12x = 108'], zone: 'z1' },
    { id: 'i6', tokens: ['16x = 192'], zone: 'z2' },
    { id: 'i7', tokens: ['x² + 40² = 41²'], zone: 'z1' },
    { id: 'i8', tokens: ['x² + 35² = 37²'], zone: 'z2' },
  ],
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Sakkiz tenglama: bir qismi Pifagor tengligi, bir qismi undan chiqqan chiziqli tenglama. Bunday tenglamalar masalani harf bilan yechganda paydo bo'ladi. Har birining yechimi to'qqiz yoki o'n ikki.",
    'Восемь уравнений: часть — равенство Пифагора, часть — линейное уравнение из него. Такие уравнения появляются, когда задачу решают через букву. Решение каждого девять или двенадцать.',
    'Eight equations: some are Pythagorean equalities, some are linear equations that came out of one. Such equations appear when a problem is solved with a letter. Each solves to nine or twelve.'),
  ask: L('Tenglamani bosing, keyin uning guruhini bosing.', 'Нажми уравнение, потом его группу.', 'Tap an equation, then tap its group.'),
  bank: L('Tenglamalar', 'Уравнения', 'Equations'),
  correctText: L(
    "To'g'ri. Kvadratli tenglamalarda x ni ajratib, ildiz chiqarish kerak. Ikki yuz yigirma besh minus bir yuz qirq to'rt sakson bir, ildizi to'qqiz. Bir yuz oltmish to'qqiz minus yigirma besh bir yuz qirq to'rt, ildizi o'n ikki. Katta sonli ikki kartada ham xuddi shu: qirq bir kvadrat minus qirq kvadrat, ya'ni bir ming olti yuz sakson bir minus bir ming olti yuz sakson bir qoladi — sakson bir, ildizi to'qqiz; o'ttiz yetti kvadrat minus o'ttiz besh kvadrat bir ming uch yuz oltmish to'qqiz minus bir ming ikki yuz yigirma besh, ya'ni bir yuz qirq to'rt, ildizi o'n ikki. Chiziqli tenglamalarda esa ildiz kerak emas, bo'lish kifoya: bir yuz sakkizni o'n ikkiga bo'lsak to'qqiz, bir yuz to'qson ikkini o'n oltiga bo'lsak o'n ikki.",
    'Верно. В квадратных уравнениях надо выделить x и извлечь корень. Двести двадцать пять минус сто сорок четыре — восемьдесят один, корень девять. Сто шестьдесят девять минус двадцать пять — сто сорок четыре, корень двенадцать. В двух карточках с большими числами то же самое: сорок один в квадрате минус сорок в квадрате — тысяча шестьсот восемьдесят один минус тысяча шестьсот, то есть восемьдесят один, корень девять; тридцать семь в квадрате минус тридцать пять в квадрате — тысяча триста шестьдесят девять минус тысяча двести двадцать пять, то есть сто сорок четыре, корень двенадцать. А в линейных уравнениях корень не нужен, достаточно деления: сто восемь разделить на двенадцать — девять, сто девяносто два разделить на шестнадцать — двенадцать.',
    'Correct. In the quadratic equations x must be isolated and the root taken. Two hundred twenty five minus one hundred forty four is eighty one, the root nine. One hundred sixty nine minus twenty five is one hundred forty four, the root twelve. The two cards with large numbers work the same: forty one squared minus forty squared is one thousand six hundred eighty one minus one thousand six hundred, that is eighty one, the root nine; thirty seven squared minus thirty five squared is one thousand three hundred sixty nine minus one thousand two hundred twenty five, that is one hundred forty four, the root twelve. In the linear equations no root is needed, division is enough: one hundred eight divided by twelve is nine, one hundred ninety two divided by sixteen is twelve.'),
  wrongs: [
    { when: (s) => s.place.i5 === 'z2' || s.place.i6 === 'z1', text: L(
      "Bu ikki karta CHIZIQLI tenglama: x kvadrat yo'q, ya'ni ildiz chiqarish kerak emas. Ularni bo'lish bilan yechish kerak: bir yuz sakkizni o'n ikkiga bo'lsak to'qqiz, bir yuz to'qson ikkini o'n oltiga bo'lsak o'n ikki. Bunday tenglamalar masalani harf bilan yechganda paydo bo'ladi — 05-topshiriqda ko'rgan edingiz.",
      'Эти две карточки — ЛИНЕЙНЫЕ уравнения: квадрата x нет, значит корень извлекать не нужно. Их решают делением: сто восемь разделить на двенадцать — девять, сто девяносто два разделить на шестнадцать — двенадцать. Такие уравнения появляются при решении задачи через букву — ты видел это в задании 05.',
      'These two cards are LINEAR equations: there is no x squared, so no root is needed. They are solved by division: one hundred eight divided by twelve is nine, one hundred ninety two divided by sixteen is twelve. Such equations appear when a problem is solved with a letter — as seen in task 05.') },
    { when: (s) => s.place.i7 === 'z2' || s.place.i8 === 'z1', text: L(
      "Katta sonlar chalg'itmasin: ish o'sha. Kvadratlarni hisoblab ayirish kerak. Qirq bir kvadrat bir ming olti yuz sakson bir, qirq kvadrat bir ming olti yuz — ayirmasi sakson bir, ildizi to'qqiz. O'ttiz yetti kvadrat bir ming uch yuz oltmish to'qqiz, o'ttiz besh kvadrat bir ming ikki yuz yigirma besh — ayirmasi bir yuz qirq to'rt, ildizi o'n ikki. Bu ikki uchlik: to'qqiz, qirq, qirq bir va o'n ikki, o'ttiz besh, o'ttiz yetti.",
      'Пусть большие числа не сбивают: работа та же. Надо возвести в квадрат и вычесть. Сорок один в квадрате — тысяча шестьсот восемьдесят один, сорок в квадрате — тысяча шестьсот, разность восемьдесят один, корень девять. Тридцать семь в квадрате — тысяча триста шестьдесят девять, тридцать пять в квадрате — тысяча двести двадцать пять, разность сто сорок четыре, корень двенадцать. Это две тройки: девять, сорок, сорок один и двенадцать, тридцать пять, тридцать семь.',
      'Do not be put off by the large numbers: the work is the same. Square and subtract. Forty one squared is one thousand six hundred eighty one, forty squared is one thousand six hundred, the difference eighty one, the root nine. Thirty seven squared is one thousand three hundred sixty nine, thirty five squared is one thousand two hundred twenty five, the difference one hundred forty four, the root twelve. These are two triples: nine, forty, forty one and twelve, thirty five, thirty seven.') },
    { when: (s) => s.place.i1 === 'z2' || s.place.i2 === 'z1', text: L(
      "Bu ikki kartani alohida hisoblang: ikki yuz yigirma besh minus bir yuz qirq to'rt sakson bir (ildizi to'qqiz), bir yuz oltmish to'qqiz minus yigirma besh bir yuz qirq to'rt (ildizi o'n ikki). Sonlar bir-biriga o'xshaydi, natijalar esa boshqa.",
      'Посчитай эти две карточки отдельно: двести двадцать пять минус сто сорок четыре — восемьдесят один (корень девять), сто шестьдесят девять минус двадцать пять — сто сорок четыре (корень двенадцать). Числа похожи, а результаты разные.',
      'Compute these two cards separately: two hundred twenty five minus one hundred forty four is eighty one (root nine), one hundred sixty nine minus twenty five is one hundred forty four (root twelve). The numbers look alike, the results do not.') },
    { when: (s) => s.bad.length >= 4, text: L(
      "Har kartada avval TURINI aniqlang: x kvadrat bormi yoki yo'q. Kvadrat bo'lsa — sonlarni ayirib ildiz chiqaring; kvadrat bo'lmasa — shunchaki bo'ling. Bir yuz qirq to'rt soni jadvalda ikki xil rolda uchraydi: bir joyda ayiriladigan son, bir joyda esa x kvadratning o'zi.",
      'В каждой карточке сначала определи ТИП: есть квадрат x или нет. Есть квадрат — вычти числа и извлеки корень; нет квадрата — просто раздели. Число сто сорок четыре встречается в таблице в двух ролях: где-то это вычитаемое, где-то сам x в квадрате.',
      'In every card first identify the TYPE: is there an x squared or not. With a square, subtract the numbers and take the root; without one, simply divide. The number one hundred forty four appears in two roles: in one place a subtrahend, in another x squared itself.') },
  ],
  wrongText: L(
    "Kvadratli tenglamada ildiz chiqariladi, chiziqli tenglamada esa bo'lish bajariladi.",
    'В квадратном уравнении извлекают корень, в линейном выполняют деление.',
    'A quadratic equation needs a root; a linear one needs a division.'),
};

export default function D47_10(props) { return <Zones data={DATA} {...props} />; }
