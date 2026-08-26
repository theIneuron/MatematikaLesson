// Dars46 · Amaliyot 01 — Belgilash · 🟢 · tag: semi_perimeter_marked
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §8 (46-dars, 1-pozitsiya)
//
// З97 BIR JADVALDA UCH MARTA: rad etilgan uchtasida `p` o'rniga to'liq
// PERIMETR yozilgan. Diqqat qiladigan joy — o'ttiz olti soni jadvalda IKKI
// marta uchraydi: bir joyda to'g'ri (35+29+8 ning yarmi), bir joyda xato
// (9+12+15 ning o'zi). Ya'ni songa qarab taniy olmaysiz, hisoblash kerak.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'semi_perimeter_marked', level: '🟢',
  col: 150, itemSize: 14,
  items: [
    { id: 'i1', hit: true, tokens: ['13, 14, 15 → p = 21'] },
    { id: 'i2', tokens: ['9, 12, 15 → p = 36'] },
    { id: 'i3', hit: true, tokens: ['35, 29, 8 → p = 36'] },
    { id: 'i4', tokens: ['39, 42, 45 → p = 126'] },
    { id: 'i5', hit: true, tokens: ['7, 15, 20 → p = 21'] },
    { id: 'i6', tokens: ['10, 17, 21 → p = 48'] },
  ],
  eyebrow: L('Belgilash', 'Отметить', 'Mark'),
  setup: L(
    "Olti yozuv: uchburchakning tomonlari va ular uchun hisoblangan yarim perimetr. Yarim perimetr uchala tomonning yig'indisining yarmiga teng.",
    'Шесть записей: стороны треугольника и посчитанный для них полупериметр. Полупериметр равен половине суммы всех трёх сторон.',
    'Six records: the sides of a triangle and the semi-perimeter computed for them. The semi-perimeter equals half the sum of all three sides.'),
  ask: L(
    "Yarim perimetr TO'G'RI hisoblangan 3 ta yozuvni belgilang.",
    'Отметь 3 записи, где полупериметр посчитан ВЕРНО.',
    'Mark the 3 records where the semi-perimeter is computed CORRECTLY.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Uch belgilangan yozuvda ikkiga bo'lish bajarilgan: o'n uch qo'shuv o'n to'rt qo'shuv o'n besh qirq ikki, yarmi yigirma bir; o'ttiz besh qo'shuv yigirma to'qqiz qo'shuv sakkiz yetmish ikki, yarmi o'ttiz olti; yetti qo'shuv o'n besh qo'shuv yigirma qirq ikki, yarmi yigirma bir. Rad etilgan uchtasida esa to'liq perimetr yozilgan: to'qqiz qo'shuv o'n ikki qo'shuv o'n besh o'ttiz olti (yarmi esa o'n sakkiz), o'ttiz to'qqiz qo'shuv qirq ikki qo'shuv qirq besh bir yuz yigirma olti (yarmi oltmish uch), o'n qo'shuv o'n yetti qo'shuv yigirma bir qirq sakkiz (yarmi yigirma to'rt). Diqqat: o'ttiz olti soni ikki joyda turadi va bir joyda to'g'ri, bir joyda xato.",
    'Верно. В трёх отмеченных записях деление на два выполнено: тринадцать плюс четырнадцать плюс пятнадцать — сорок два, половина двадцать один; тридцать пять плюс двадцать девять плюс восемь — семьдесят два, половина тридцать шесть; семь плюс пятнадцать плюс двадцать — сорок два, половина двадцать один. А в трёх отвергнутых записан весь периметр: девять плюс двенадцать плюс пятнадцать — тридцать шесть (а половина восемнадцать), тридцать девять плюс сорок два плюс сорок пять — сто двадцать шесть (половина шестьдесят три), десять плюс семнадцать плюс двадцать один — сорок восемь (половина двадцать четыре). Внимание: число тридцать шесть стоит в двух местах, и в одном оно верно, в другом ошибочно.',
    'Correct. In the three marked records the halving was done: thirteen plus fourteen plus fifteen is forty two, half is twenty one; thirty five plus twenty nine plus eight is seventy two, half is thirty six; seven plus fifteen plus twenty is forty two, half is twenty one. In the three rejected ones the whole perimeter is written: nine plus twelve plus fifteen is thirty six (half being eighteen), thirty nine plus forty two plus forty five is one hundred twenty six (half sixty three), ten plus seventeen plus twenty one is forty eight (half twenty four). Note: the number thirty six appears in two places, correct in one and wrong in the other.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('i2') !== -1, text: L(
      "Bu yozuvda o'ttiz olti — PERIMETRNING o'zi: to'qqiz qo'shuv o'n ikki qo'shuv o'n besh. Yarim perimetr uning yarmi, ya'ni o'n sakkiz. Boshqa yozuvda o'ttiz olti to'g'ri chiqqani sizni chalg'itmasin: u yerda tomonlar boshqa va yig'indi yetmish ikki.",
      'В этой записи тридцать шесть — САМ ПЕРИМЕТР: девять плюс двенадцать плюс пятнадцать. Полупериметр — его половина, то есть восемнадцать. Пусть не сбивает, что в другой записи тридцать шесть верно: там другие стороны и сумма семьдесят два.',
      'In this record thirty six is the PERIMETER itself: nine plus twelve plus fifteen. The semi-perimeter is half of it, eighteen. Do not be misled that thirty six is correct in another record: the sides there are different and their sum is seventy two.') },
    { when: (s) => s.extra.indexOf('i4') !== -1 || s.extra.indexOf('i6') !== -1, text: L(
      "Bu yozuvlarda ham perimetrning o'zi turadi: bir yuz yigirma olti va qirq sakkiz. Ikkiga bo'lish qolgan: yarim perimetr oltmish uch va yigirma to'rt bo'lishi kerak. Geron formulasi aynan YARIM perimetrni talab qiladi.",
      'В этих записях тоже стоит сам периметр: сто двадцать шесть и сорок восемь. Деление на два не сделано: полупериметр должен быть шестьдесят три и двадцать четыре. Формула Герона требует именно ПОЛУпериметра.',
      'These records also hold the perimeter itself: one hundred twenty six and forty eight. The halving is missing: the semi-perimeter should be sixty three and twenty four. Heron formula demands exactly the SEMI-perimeter.') },
    { when: (s) => s.miss.indexOf('i3') !== -1, text: L(
      "Bu yozuv to'g'ri: o'ttiz besh qo'shuv yigirma to'qqiz qo'shuv sakkiz yetmish ikki, yarmi o'ttiz olti. Uchburchak juda cho'zilgan (bir tomoni sakkiz, ikkitasi esa uzun), lekin bu hisobga xalaqit bermaydi — yarim perimetr har uchburchakda bir xil yo'l bilan topiladi.",
      'Эта запись верна: тридцать пять плюс двадцать девять плюс восемь — семьдесят два, половина тридцать шесть. Треугольник сильно вытянут (одна сторона восемь, две длинные), но счёту это не мешает — полупериметр во всяком треугольнике находится одинаково.',
      'This record is right: thirty five plus twenty nine plus eight is seventy two, half is thirty six. The triangle is very stretched (one side eight, two long ones), but that does not affect the arithmetic — the semi-perimeter is found the same way in every triangle.') },
    { when: (s) => s.marked.length !== 3, text: L(
      "Aynan uchta yozuv kerak. Har birida bir xil ish bajariladi: uchala tomonni qo'shib, natijani ikkiga bo'lish. Chiqqan son yozuvdagi son bilan mos kelsa — yozuv to'g'ri.",
      'Нужно ровно три записи. В каждой выполняется одно и то же: сложить все три стороны и разделить результат на два. Если полученное число совпало с числом в записи — запись верна.',
      'Exactly three records are needed. The same work is done in each: add all three sides and halve the result. If the number you get matches the one in the record, the record is right.') },
  ],
  wrongText: L(
    "Uchala tomonni qo'shib, yig'indini ikkiga bo'ling. Perimetrning o'zi yarim perimetr emas.",
    'Сложи все три стороны и раздели сумму на два. Сам периметр — не полупериметр.',
    'Add all three sides and halve the sum. The perimeter itself is not the semi-perimeter.'),
};

export default function D46_01(props) { return <MarkAll data={DATA} {...props} />; }
