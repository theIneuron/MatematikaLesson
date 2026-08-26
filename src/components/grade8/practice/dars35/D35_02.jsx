// Dars35 · Amaliyot 02 — O'rtacha · 🟢 · tag: mean_value
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TypeValue.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §7 (35-dars, 2-pozitsiya)
//
// QATOR ATAYLAB SHUNDAY TANLANGAN: 7, 9, 12, 12 — o'rtacha o'n, moda o'n
// ikki, mediana esa o'n butun besh o'ndan. Uch o'lchov uch xil son beradi,
// ya'ni har xato javob boshqa ATAMANI nomlaydi:
//   12 — moda aytildi (З71)
//   40 — yig'indi bo'linmadi
//   9  — tartiblangan qatorning o'rtasidan bittasi
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TypeValue, L } from '../kit.jsx';

const DATA = {
  tag: 'mean_value', level: '🟢',
  target: 10, allowNeg: false,
  expr: ['7, 9, 12, 12'], exprSize: 28,
  eyebrow: L("O'rtacha", 'Среднее', 'Mean'),
  setup: L(
    "To'rt sondan iborat qator berilgan. Uning o'rtacha qiymatini topish kerak: bu qatordagi hech bir sonni tanlash emas, hisoblash.",
    'Дан ряд из четырёх чисел. Надо найти его среднее значение: это не выбор одного из чисел ряда, а вычисление.',
    'A series of four numbers is given. Its mean must be found: this is not picking one of the numbers, it is a computation.'),
  label: L("O'rtacha qiymat", 'Среднее значение', 'The mean'),
  ask: L(
    "Bu qatorning o'rtacha qiymati nechaga teng?",
    'Чему равно среднее значение этого ряда?',
    'What is the mean of this series?'),
  correctText: L(
    "To'g'ri. O'rtacha qiymat ikki qadamda topiladi: avval hamma sonni qo'shamiz — yetti qo'shuv to'qqiz o'n olti, o'n olti qo'shuv o'n ikki yigirma sakkiz, yigirma sakkiz qo'shuv o'n ikki qirq. Keyin yig'indini sonlarning soniga bo'lamiz: qirq bo'lingan to'rt o'n. O'nlik qatorda YO'Q, va bu normal — o'rtacha qiymat tanlanmaydi, hisoblanadi. Tekshirish oson: o'rtacha eng kichik son bilan eng katta son orasida bo'lishi kerak, ya'ni yetti bilan o'n ikki orasida. O'n shu oraliqda.",
    'Верно. Среднее значение находится в два шага: сначала складываем все числа — семь плюс девять шестнадцать, шестнадцать плюс двенадцать двадцать восемь, двадцать восемь плюс двенадцать сорок. Потом делим сумму на количество чисел: сорок делить на четыре десять. Десятки в ряду НЕТ, и это нормально — среднее не выбирается, а вычисляется. Проверить легко: среднее обязано лежать между наименьшим и наибольшим числом, то есть между семью и двенадцатью. Десять в этом промежутке.',
    'Correct. The mean is found in two steps: first add all the numbers — seven plus nine is sixteen, sixteen plus twelve is twenty-eight, twenty-eight plus twelve is forty. Then divide the sum by how many numbers there are: forty divided by four is ten. There is NO ten in the series, and that is fine — the mean is not chosen, it is computed. An easy check: the mean must lie between the smallest and the largest number, that is between seven and twelve. Ten is in that range.'),
  wrongs: [
    { when: (s) => s.value === 12, text: L(
      "O'n ikki — bu MODA, ya'ni eng ko'p uchraydigan qiymat, o'rtacha emas. Ikki atamani ajrating: moda SANASH bilan topiladi (qaysi son ko'p marta turibdi), o'rtacha esa QO'SHISH va BO'LISH bilan. Bu qatorda ular teng emas: moda o'n ikki, o'rtacha esa o'n. Tekshiring — o'rtacha eng katta songa teng bo'lishi uchun hamma son o'n ikkiga teng bo'lishi kerak edi.",
      'Двенадцать — это МОДА, самое частое значение, а не среднее. Раздели два термина: мода находится ПОДСЧЁТОМ (какое число стоит чаще), а среднее СЛОЖЕНИЕМ и ДЕЛЕНИЕМ. В этом ряду они не совпадают: мода двенадцать, среднее десять. Проверь — чтобы среднее равнялось наибольшему числу, все числа должны были бы равняться двенадцати.',
      'Twelve is the MODE, the most frequent value, not the mean. Separate the two terms: the mode is found by COUNTING (which number stands most often), the mean by ADDING and DIVIDING. In this series they differ: the mode is twelve, the mean is ten. Check — for the mean to equal the largest number, every number would have to be twelve.') },
    { when: (s) => s.value === 40, text: L(
      "Bu YIG'INDI, o'rtacha emas: ikkinchi qadam qilinmagan. Yig'indini sonlarning soniga bo'lish kerak — qirq bo'lingan to'rt o'n. Tekshirish oson: o'rtacha hech qachon eng katta sondan katta bo'lolmaydi, qirq esa o'n ikkidan ancha katta. Bu tekshiruv har doim ishlaydi va u yarim sekundlik ish.",
      'Это СУММА, а не среднее: второй шаг не сделан. Сумму надо разделить на количество чисел — сорок делить на четыре десять. Проверить легко: среднее никогда не бывает больше наибольшего числа, а сорок намного больше двенадцати. Эта проверка работает всегда и занимает полсекунды.',
      'This is the SUM, not the mean: the second step was skipped. The sum must be divided by how many numbers there are — forty divided by four is ten. An easy check: the mean is never larger than the largest number, and forty is far above twelve. This check always works and takes half a second.') },
    { when: (s) => s.value === 9 || s.value === 11, text: L(
      "Bu MEDIANA yoki unga yaqin son: tartiblangan qatorning o'rtasi. Mediana ham, o'rtacha ham «o'rta» degan so'zni eslatadi, lekin ular boshqacha topiladi. Mediana o'rtadagi ORINNI oladi, o'rtacha esa hamma sonni HISOBGA oladi — shuning uchun o'n ikki ikki marta turgani o'rtachani yuqoriga tortadi. Qo'shing va bo'ling: qirq bo'lingan to'rt o'n.",
      'Это МЕДИАНА или близкое к ней число: середина упорядоченного ряда. И медиана, и среднее напоминают слово «средний», но находятся они по-разному. Медиана берёт срединное МЕСТО, а среднее учитывает ВСЕ числа — поэтому две двенадцатки тянут среднее вверх. Сложи и раздели: сорок делить на четыре десять.',
      'This is the MEDIAN or something near it: the middle of the ordered series. Both the median and the mean sound like «middle», but they are found differently. The median takes the middle POSITION, while the mean takes every number into ACCOUNT — that is why the two twelves pull the mean upward. Add and divide: forty divided by four is ten.') },
  ],
  wrongText: L(
    "Hamma sonni qo'shing, keyin sonlarning soniga bo'ling. Javobni tekshiring: o'rtacha eng kichik va eng katta son orasida bo'lishi kerak.",
    'Сложи все числа, потом раздели на их количество. Проверь ответ: среднее должно лежать между наименьшим и наибольшим числом.',
    'Add all the numbers, then divide by how many there are. Check the answer: the mean must lie between the smallest and the largest number.'),
};

export default function D35_02(props) { return <TypeValue data={DATA} {...props} />; }
