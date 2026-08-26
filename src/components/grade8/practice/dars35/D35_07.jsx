// Dars35 · Amaliyot 07 — Tartib · 🟡 · tag: median_steps
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §7 (35-dars, 7-pozitsiya)
//
// TO'RT QADAM: tartiblash -> sanash -> o'rtadagi ikkitasini ajratish ->
// o'rtachasini olish.
//
// TARTIBLASH BIRINCHI BO'LGANI SHART. Asl qator 9, 4, 7, 4, 6, 8 ning
// o'rtasida yetti va to'rt turibdi, ya'ni tartiblamasdan olingan «mediana»
// besh butun besh o'ndan bo'lardi — javob esa olti butun besh o'ndan.
// Ya'ni xato tartib boshqa SONNI beradi, shunchaki noqulaylik emas.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'median_steps', level: '🟡',
  expr: ['9, 4, 7, 4, 6, 8'], exprSize: 26,
  itemSize: 12,
  cards: [
    { id: 'l1', tokens: ['4,4,6,7,8,9'],
      label: L("o'sish tartibida yozamiz", 'записываем по возрастанию', 'write in increasing order') },
    { id: 'l2', tokens: ['6 ta, juft'],
      label: L('nechtaligini sanaymiz', 'считаем, сколько чисел', 'count how many there are') },
    { id: 'l3', tokens: ['6 va 7'],
      label: L("o'rtadagi ikki sonni ajratamiz", 'выделяем два срединных числа', 'pick out the two middle numbers') },
    { id: 'l4', tokens: ['6,5'],
      label: L("ularning o'rtachasini olamiz", 'берём их среднее', 'take their mean') },
  ],
  start: ['l2', 'l3', 'l4', 'l1'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Qator tartibsiz berilgan, va uning medianasini topish kerak. Ish to'rt qadamda boradi, lekin qadamlar aralashib ketgan.",
    'Ряд дан неупорядоченным, и надо найти его медиану. Работа идёт в четыре шага, но шаги перепутаны.',
    'The series is given unordered, and its median must be found. The work takes four steps, but the steps are mixed up.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Avval qatorni o'sish tartibida yozamiz — bu eng muhim qadam, chunki mediana O'RINGA qaraydi, va o'rin faqat tartiblangan qatorda ma'noga ega. Keyin nechta son borligini sanaymiz: oltita, ya'ni juft. Juft bo'lgani uchun bitta o'rta yo'q — o'rtadagi ikki sonni ajratamiz, ular uchinchi va to'rtinchi o'rinlarda turibdi: olti va yetti. Va oxirida ularning o'rtachasini olamiz: o'n uch bo'lingan ikki olti butun besh o'ndan. Tartiblamasdan qilinganda javob boshqa chiqardi: asl qatorning o'rtasida yetti va to'rt turibdi, ularning o'rtachasi esa besh butun besh o'ndan.",
    'Верно. Сначала записываем ряд по возрастанию — это самый важный шаг, ведь медиана смотрит на МЕСТО, а место имеет смысл только в упорядоченном ряду. Потом считаем, сколько чисел: шесть, количество чётное. Раз чётное, единого центра нет — выделяем два срединных числа, они стоят на третьем и четвёртом местах: шесть и семь. И в конце берём их среднее: тринадцать делить на два шесть целых пять десятых. Без упорядочивания ответ вышел бы другим: в середине исходного ряда стоят семь и четыре, а их среднее пять целых пять десятых.',
    'Correct. First we write the series in increasing order — the most important step, since the median looks at POSITION, and position means something only in an ordered series. Then we count how many numbers there are: six, an even count. Being even, there is no single centre — we pick out the two middle numbers, standing third and fourth: six and seven. And at the end we take their mean: thirteen divided by two is six point five. Without ordering the answer would differ: the middle of the original series holds seven and four, whose mean is five point five.'),
  wrongs: [
    { when: (s) => s.pos.l1 !== 1, text: L(
      "Tartiblash BIRINCHI qadam bo'lishi kerak. Bu shunchaki qulaylik emas: mediana o'rtadagi o'rindan olinadi, va tartiblanmagan qatorda o'rta tasodifiy son bo'lib qoladi. Tekshiring — asl qatorning o'rtasida yetti va to'rt turibdi, ularning o'rtachasi besh butun besh o'ndan, to'g'ri javob esa olti butun besh o'ndan. Ya'ni tartib buzilsa javob ham buziladi.",
      'Упорядочивание должно быть ПЕРВЫМ шагом. Это не просто удобство: медиана берётся со срединного места, а в неупорядоченном ряду в середине оказывается случайное число. Проверь — в середине исходного ряда стоят семь и четыре, их среднее пять целых пять десятых, а верный ответ шесть целых пять десятых. То есть нарушенный порядок портит и ответ.',
      'Ordering must be the FIRST step. This is not mere convenience: the median is taken from the middle position, and in an unordered series the middle is an accidental number. Check — the middle of the original series holds seven and four, whose mean is five point five, while the right answer is six point five. A broken order breaks the answer.') },
    { when: (s) => s.pos.l3 < s.pos.l2, text: L(
      "O'rtadagi sonlarni ajratish SANOQDAN keyin bo'ladi: nechta son borligini bilmasdan, bitta o'rta izlash kerakmi yoki ikkitasi — buni aytib bo'lmaydi. Toq qatorda bitta o'rta bo'lardi va oxirgi qadam umuman kerak bo'lmasdi. Sanoq shu sababli alohida qadam.",
      'Выделение срединных чисел идёт ПОСЛЕ подсчёта: не зная, сколько чисел, нельзя сказать, искать одну середину или две. При нечётном количестве середина была бы одна, и последний шаг не понадобился бы вовсе. Поэтому подсчёт — отдельный шаг.',
      'Picking out the middle numbers comes AFTER the counting: without knowing how many numbers there are, you cannot say whether to look for one middle or two. With an odd count there would be a single middle and the last step would not be needed at all. That is why counting is a step of its own.') },
    { when: (s) => s.pos.l4 < s.pos.l3, text: L(
      "O'rtachani olish ENG OXIRGI qadam: o'rtachasi olinadigan ikki son hali ajratilmagan. Bu qadam yangi qaror qabul qilmaydi — u tayyor ikki sonni qo'shib ikkiga bo'ladi.",
      'Взятие среднего — САМЫЙ ПОСЛЕДНИЙ шаг: два числа, среднее которых берут, ещё не выделены. Этот шаг нового решения не принимает — он складывает два готовых числа и делит на два.',
      'Taking the mean is the VERY LAST step: the two numbers whose mean is taken have not been picked out yet. This step makes no new decision — it adds two ready numbers and halves them.') },
    { when: (s) => s.seq[0] === 'l4', text: L(
      "Tayyor javobdan boshlab bo'lmaydi — u ishning natijasi. Birinchi qadam qatorni tartiblash, va u qolgan hamma qadamni mumkin qiladi.",
      'Начинать с готового ответа нельзя — он результат работы. Первый шаг — упорядочить ряд, и он делает возможными все остальные.',
      'You cannot start with the finished answer — it is the result of the work. The first step is to order the series, and it makes every other step possible.') },
  ],
  wrongText: L(
    "Tartiblash birinchi, o'rtacha oxirgi. Tartiblanmagan qatorda o'rtadagi son tasodifiy bo'ladi va javob boshqa chiqadi.",
    'Упорядочивание первым, среднее последним. В неупорядоченном ряду срединное число случайно, и ответ выходит другой.',
    'Ordering comes first, the mean last. In an unordered series the middle number is accidental and the answer comes out different.'),
};

export default function D35_07(props) { return <SwapOrder data={DATA} {...props} />; }
