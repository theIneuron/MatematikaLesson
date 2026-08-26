// Dars35 · Amaliyot 10 — Juftlash · 🔴 · tag: median_odd_even
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §7 (35-dars, 10-pozitsiya)
//
// TO'RT QATORDA O'SHA IKKI RAQAM — BIR VA OLTI, — LEKIN MEDIANALAR BOSHQA:
//   1, 2, 6      -> toq, o'rtadagisi        -> 2
//   1, 2, 6, 8   -> juft, (2+6):2           -> 4
//   2, 6, 6      -> toq, o'rtadagisi        -> 6
//   1, 1, 6, 6   -> juft, (1+6):2           -> 3,5   <- KASR
// Oxirgisi З72 ning eng aniq joyi: mediana butun son ham, qatorning soni
// ham emas. Uni «bunday bo'lmaydi» deb rad etish odatiy xato.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const DATA = {
  tag: 'median_odd_even', level: '🔴',
  connect: true,
  targetSize: 19, itemSize: 16,
  items: [
    { id: 'm1', tokens: ['1, 2, 6'] },
    { id: 'm2', tokens: ['1, 2, 6, 8'] },
    { id: 'm3', tokens: ['2, 6, 6'] },
    { id: 'm4', tokens: ['1, 1, 6, 6'] },
  ],
  targets: [
    { id: 't1', tokens: ['2'] },
    { id: 't2', tokens: ['4'] },
    { id: 't3', tokens: ['6'] },
    { id: 't4', tokens: ['3,5'] },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Juftlash', 'Сопоставление', 'Matching'),
  setup: L(
    "To'rt qator o'sish tartibida yozilgan, va ularda deyarli o'sha sonlar turibdi. Ikkitasida uchta son, ikkitasida to'rtta — ya'ni ikkita toq va ikkita juft qator.",
    'Четыре ряда записаны по возрастанию, и числа в них почти одни и те же. В двух по три числа, в двух по четыре — то есть два нечётных ряда и два чётных.',
    'Four series are written in increasing order, and they hold nearly the same numbers. Two have three numbers, two have four — that is, two odd series and two even ones.'),
  ask: L(
    "Chapdan qatorni bosing, keyin o'ngdan uning medianasini bosing.",
    'Нажми ряд слева, потом его медиану справа.',
    'Tap a series on the left, then its median on the right.'),
  correctText: L(
    "To'g'ri. Birinchi qatorda uchta son, o'rtadagisi ikki. Ikkinchisida to'rtta son, o'rtadagi ikkitasi ikki va olti, ularning o'rtachasi to'rt. Uchinchisida yana uchta son, o'rtadagisi olti — takrorlangan qiymat medianaga xalaqit bermaydi. To'rtinchisida to'rtta son, o'rtadagilari bir va olti, ularning o'rtachasi uch butun besh o'ndan: mediana KASR bo'lib chiqdi, va u qatorning hech bir soniga teng emas. Bu xato emas — juft qatorda mediana ikki sonning o'rtachasi, va o'rtacha kasr bo'lishi mumkin. Bir xil sonlardan to'rt xil javob chiqdi, chunki javobni sonlar emas, ularning SONI va O'RNI hal qiladi.",
    'Верно. В первом ряду три числа, срединное два. Во втором четыре, срединные два и шесть, их среднее четыре. В третьем снова три, срединное шесть — повторяющееся значение медиане не мешает. В четвёртом четыре числа, срединные один и шесть, их среднее три целых пять десятых: медиана вышла ДРОБНОЙ и не равна ни одному числу ряда. Это не ошибка — в чётном ряду медиана есть среднее двух чисел, а среднее может быть дробным. Из одних и тех же чисел вышли четыре разных ответа, потому что решают не сами числа, а их КОЛИЧЕСТВО и МЕСТО.',
    'Correct. The first series has three numbers and the middle one is two. The second has four, the middle two being two and six, whose mean is four. The third has three again and the middle one is six — a repeated value does not trouble the median. The fourth has four numbers, the middle ones being one and six, whose mean is three point five: the median came out FRACTIONAL and equals no number of the series. That is no error — in an even series the median is the mean of two numbers, and a mean may be fractional. The same numbers gave four different answers, because what decides is not the numbers but their COUNT and POSITION.'),
  wrongs: [
    { when: (s) => s.pair.m4 !== 't4', text: L(
      "To'rtinchi qatorda to'rtta son bor, ya'ni mediana o'rtadagi ikkitasining o'rtachasi: bir va olti, yetti bo'lingan ikki uch butun besh o'ndan. Bu son qatorda umuman yo'q, va uni rad etish oson keladi. Lekin mediana qatorning soni bo'lishi SHART emas: u sonlarni ikki teng qismga ajratadigan chegara, va chegara sonlar orasida turishi mumkin.",
      'В четвёртом ряду четыре числа, значит медиана — среднее двух срединных: один и шесть, семь делить на два три целых пять десятых. Этого числа в ряду нет вовсе, и отвергнуть его легко. Но медиана НЕ ОБЯЗАНА быть числом ряда: это граница, делящая числа на две равные части, а граница может проходить между числами.',
      'The fourth series has four numbers, so the median is the mean of the middle two: one and six, seven divided by two is three point five. That number is not in the series at all, and it is easy to reject. But the median NEED NOT be a number of the series: it is the boundary splitting the numbers into two equal halves, and a boundary may fall between numbers.') },
    { when: (s) => s.pair.m2 !== 't2', text: L(
      "Ikkinchi qatorda to'rtta son bor — juft, ya'ni bitta o'rta yo'q. O'rtadagi ikki son ikkinchi va uchinchi o'rinlarda: ikki va olti. Ularning o'rtachasi sakkiz bo'lingan ikki to'rt. Birinchi qator bilan solishtiring: u yerda uchta son bor edi va mediana ikki edi; sakkizlik qo'shilishi qatorni juftga aylantirdi va javobni almashtirdi.",
      'Во втором ряду четыре числа — чётное количество, единого центра нет. Срединные два стоят на втором и третьем местах: два и шесть. Их среднее восемь делить на два четыре. Сравни с первым рядом: там было три числа и медиана два; добавление восьмёрки сделало ряд чётным и поменяло ответ.',
      'The second series has four numbers — an even count, so no single centre. The middle two stand second and third: two and six. Their mean is eight divided by two, that is four. Compare with the first series: three numbers there and a median of two; adding the eight made the count even and changed the answer.') },
    { when: (s) => s.pair.m3 !== 't3', text: L(
      "Uchinchi qatorda uchta son bor, o'rtadagisi olti. Oltilik ikki marta turgani hech narsani buzmaydi: mediana o'rinni oladi, va ikkinchi o'rinda oltilik turibdi. Bu qatorda mediana bilan moda bir xil son bo'lib chiqdi — bu tasodif, va u har doim shunday bo'lmaydi.",
      'В третьем ряду три числа, срединное шесть. То, что шестёрка стоит дважды, ничего не портит: медиана берёт место, а на втором месте стоит шестёрка. В этом ряду медиана и мода совпали — это совпадение, и так бывает не всегда.',
      'The third series has three numbers and the middle one is six. That the six stands twice spoils nothing: the median takes a position, and in the second position stands a six. In this series the median and the mode coincide — a coincidence, and not always the case.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har qatorda avval SONLARNI SANANG — bu birinchi va eng muhim savol. Toq bo'lsa o'rtadagi sonni oling; juft bo'lsa o'rtadagi ikkitasini qo'shib ikkiga bo'ling, va natija kasr chiqishidan qo'rqmang.",
      'В каждом ряду сначала СОСЧИТАЙ ЧИСЛА — это первый и самый важный вопрос. Нечётное количество — бери срединное; чётное — сложи два срединных и раздели на два, и не пугайся дробного результата.',
      'In every series COUNT THE NUMBERS first — the first and most important question. An odd count means take the middle one; an even count means add the middle two and halve, and do not be alarmed by a fractional result.') },
  ],
  wrongText: L(
    "Sonlarni sanang: toq bo'lsa mediana o'rtadagi son, juft bo'lsa o'rtadagi ikkitasining o'rtachasi. Mediana kasr bo'lishi mumkin.",
    'Сосчитай числа: нечётное количество — медиана срединное число, чётное — среднее двух срединных. Медиана может быть дробной.',
    'Count the numbers: an odd count makes the median the middle number, an even count the mean of the middle two. The median may be fractional.'),
};

export default function D35_10(props) { return <MatchPairs data={DATA} {...props} />; }
