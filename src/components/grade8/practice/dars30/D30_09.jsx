// Dars30 · Amaliyot 09 — Tartib · 🔴 · tag: compare_precision_steps
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §12 (30-dars, 9-pozitsiya)
//
// З60 AYNAN BITTA QADAMDA TUG'ILADI: absolut xatoliklarni taqqoslab
// XULOSAGA o'tish. Bu yerda ikki o'lchovning absolut xatoligi bir xil
// emas — biri ikki barobar katta, — va shunga qaramay o'sha o'lchov
// ANIQROQ chiqadi.
//
// Misol: 200 ± 2 va 10 ± 1. Absolut xatolik ikki va bir, ya'ni ikkinchisi
// kichikroq; nisbiy xatolik esa bir foiz va o'n foiz — birinchisi ANIQROQ.
// Kartada SO'Z asosiy, matematika qisqa dalil, yozuv bo'shliqsiz.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'compare_precision_steps', level: '🔴',
  expr: ['200 ± 2', '   ', '10 ± 1'], exprSize: 22,
  itemSize: 11,
  cards: [
    { id: 'l1', tokens: ['2; 1'],
      label: L('absolut xatoliklarni yozamiz', 'выписываем абсолютные погрешности', 'write out the absolute errors') },
    { id: 'l2', tokens: ['2:200; 1:10'],
      label: L('nisbiy xatoliklarni hisoblaymiz', 'вычисляем относительные погрешности', 'compute the relative errors') },
    { id: 'l3', tokens: ['1%<10%'],
      label: L('nisbiy xatoliklarni taqqoslaymiz', 'сравниваем относительные погрешности', 'compare the relative errors') },
    { id: 'l4', tokens: ['200±2'],
      label: L("aniqrog'ini aytamiz", 'называем более точное', 'name the more accurate one') },
  ],
  start: ['l2', 'l1', 'l4', 'l3'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Ikki o'lchovdan qaysi biri aniqroq bajarilganini aniqlash kerak. Yechim to'rt qadamdan iborat, lekin qadamlar aralashib ketgan.",
    'Надо определить, какое из двух измерений выполнено точнее. Решение состоит из четырёх шагов, но шаги перепутаны.',
    'It must be decided which of the two measurements was made more accurately. The solution has four steps, but the steps are mixed up.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Absolut xatoliklar faqat boshlang'ich ma'lumot: ikki va bir. Keyin nisbiy xatoliklar hisoblanadi, taqqoslanadi, va faqat oxirida xulosa: ikki yuz plyus-minus ikki aniqroq — garchi uning absolut xatoligi ikki barobar KATTA bo'lsa ham.",
    'Верно. Абсолютные погрешности — только исходные данные: два и один. Потом считают относительные, сравнивают, и лишь в конце вывод: двести плюс-минус два точнее — хотя абсолютная погрешность у него вдвое БОЛЬШЕ.',
    'Correct. The absolute errors are only input data: two and one. Then the relative ones are computed and compared, and only at the end the conclusion: two hundred plus or minus two is more accurate — although its absolute error is twice as LARGE.'),
  wrongs: [
    { when: (s) => s.pos.l4 < s.pos.l2, text: L(
      "Xulosa NISBIY xatoliklardan keyin bo'ladi. Absolut xatoliklarga qarab xulosa chiqarish eng qimmat xato: bu yerda ikki bir dan katta, ya'ni birinchi o'lchov aniqroq emasdek tuyuladi — lekin nisbiy xatolik teskarisini ko'rsatadi. Ikki yuzdagi ikki birlik o'ndagi bir birlikdan ancha kichik ulush.",
      'Вывод идёт ПОСЛЕ относительных погрешностей. Делать вывод по абсолютным — самая дорогая ошибка: здесь два больше одного, и кажется, будто первое измерение точнее не является — а относительная погрешность показывает обратное. Две единицы в двухстах составляют куда меньшую долю, чем одна единица в десяти.',
      'The conclusion comes AFTER the relative errors. Drawing it from the absolute errors is the costliest mistake: here two is greater than one, so the first measurement seems the less accurate — yet the relative error shows the opposite. Two units in two hundred are a far smaller share than one unit in ten.') },
    { when: (s) => s.pos.l3 < s.pos.l2, text: L(
      "Taqqoslash HISOBDAN keyin bo'ladi: bir foiz va o'n foiz hali topilmagan. Avval har o'lchovning nisbiy xatoligini hisoblash kerak — xatolikni o'lchangan qiymatga bo'lish, — undan keyingina ikki natijani solishtirish mumkin.",
      'Сравнение идёт ПОСЛЕ вычисления: одного процента и десяти процентов ещё нет. Сначала надо вычислить относительную погрешность каждого измерения — разделить погрешность на измеренное значение, — и только потом сопоставлять два результата.',
      'The comparison comes AFTER the computation: one percent and ten percent have not been found yet. First the relative error of each measurement must be computed — the error divided by the measured value — and only then can the two results be set side by side.') },
    { when: (s) => s.seq[0] === 'l4' || s.seq[0] === 'l3', text: L(
      "Xulosadan yoki taqqoslashdan boshlab bo'lmaydi — ular ishning natijasi. Birinchi qadam eng sodda: yozuvlardan absolut xatoliklarni ko'chirib olish.",
      'Начинать с вывода или со сравнения нельзя — они результат работы. Первый шаг самый простой: выписать абсолютные погрешности из записей.',
      'You cannot start with the conclusion or the comparison — they are the result of the work. The first step is the simplest: copy the absolute errors out of the records.') },
    { when: (s) => s.pos.l2 < s.pos.l1, text: L(
      "Nisbiy xatolikni hisoblash uchun avval ABSOLUT xatolik kerak: u kasrning suratida turadi. Yozuvlardan ikki va bir olinadi, keyin ular ikki yuz va o'nga bo'linadi.",
      'Чтобы вычислить относительную погрешность, сначала нужна АБСОЛЮТНАЯ: она стоит в числителе дроби. Из записей берут два и один, а потом делят их на двести и на десять.',
      'To compute a relative error the ABSOLUTE one is needed first: it stands in the numerator. Two and one are taken from the records and then divided by two hundred and by ten.') },
  ],
  wrongText: L(
    "Absolut xatoliklar hech narsani hal qilmaydi — ular faqat boshlang'ich ma'lumot. Xulosa NISBIY xatoliklarni taqqoslashdan keyin chiqadi.",
    'Абсолютные погрешности ничего не решают — это только исходные данные. Вывод выходит после сравнения ОТНОСИТЕЛЬНЫХ погрешностей.',
    'The absolute errors decide nothing — they are merely the input data. The conclusion follows from comparing the RELATIVE errors.'),
};

export default function D30_09(props) { return <SwapOrder data={DATA} {...props} />; }
