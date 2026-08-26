// Dars35 · Amaliyot 04 — Belgilash · 🟡 · tag: median_five_marked
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §7 (35-dars, 4-pozitsiya)
//
// OLTI QATOR, UCHTASINING MEDIANASI BESH:
//   3, 5, 9        — toq, o'rtadagi son
//   2, 4, 6, 8     — JUFT, mediana qatorda YO'Q son (T3, З72)
//   1, 5, 5, 5, 9  — toq, moda va mediana bir joyga tushdi
// Rad etilganlar: 3,4,9 (mediana to'rt), 2,4,8,10 (juft, mediana olti),
// 5,6,7 (mediana olti — beshlik qatorda BOR, lekin o'rtada emas).
//
// Oxirgisi eng qimmat: beshlik ko'rinib turibdi, lekin u birinchi o'rinda.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'median_five_marked', level: '🟡',
  col: 128, itemSize: 15,
  items: [
    { id: 'i1', tokens: ['3, 5, 9'], hit: true },
    { id: 'i2', tokens: ['3, 4, 9'] },
    { id: 'i3', tokens: ['2, 4, 6, 8'], hit: true },
    { id: 'i4', tokens: ['2, 4, 8, 10'] },
    { id: 'i5', tokens: ['1, 5, 5, 5, 9'], hit: true },
    { id: 'i6', tokens: ['5, 6, 7'] },
  ],
  eyebrow: L('Belgilash', 'Отметь', 'Mark'),
  setup: L(
    "Olti qator, hammasi o'sish tartibida yozilgan. Uchtasining medianasi beshga teng. Qatorlarda sonlar soni har xil: uchta, to'rtta va beshta.",
    'Шесть рядов, все записаны по возрастанию. У трёх из них медиана равна пяти. Количество чисел в рядах разное: три, четыре и пять.',
    'Six series, all written in increasing order. Three of them have a median equal to five. The count of numbers differs: three, four and five.'),
  ask: L(
    "Medianasi 5 ga teng bo'lgan 3 ta qatorni belgilang.",
    'Отметь 3 ряда, медиана которых равна пяти.',
    'Mark the 3 series whose median equals five.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Mediana o'rindan topiladi, qiymatdan emas. Birinchi qatorda uchta son, o'rtadagisi besh. Uchinchisida to'rtta son, ya'ni bitta o'rta yo'q: to'rt va oltining o'rtachasi besh — beshlik u yerda umuman uchramaydi. Beshinchisida beshta son, o'rtadagisi yana besh. Birinchi qadam har doim bitta: nechta son borligini sanash.",
    'Верно. Медиана берётся из места, а не из значения. В первом ряду три числа, срединное пять. В третьем четыре, значит единого центра нет: среднее четырёх и шести пять — самой пятёрки там нет. В пятом пять чисел, срединное снова пять. Первый шаг всегда один: сосчитать, сколько чисел.',
    'Correct. The median comes from a position, not from a value. The first series has three numbers and the middle one is five. The third has four, so there is no single centre: the mean of four and six is five — no five appears there at all. The fifth has five numbers and the middle one is five again. The first step is always the same: count how many numbers there are.'),
  wrongs: [
    { when: (s) => s.miss.indexOf('i3') !== -1, text: L(
      "Bu qator chetlab o'tildi, chunki unda beshlik YO'Q. Lekin mediana qatorning soni bo'lishi shart emas: bu yerda to'rtta son bor, ya'ni bitta o'rta yo'q. O'rtadagi ikki son — to'rt va olti, — va mediana ularning o'rtachasi: o'n bo'lingan ikki besh. Juft qatorda mediana ko'pincha qatorda umuman uchramaydi.",
      'Этот ряд пропущен, потому что пятёрки в нём НЕТ. Но медиана не обязана быть числом ряда: здесь четыре числа, значит единого центра нет. Срединные два — четыре и шесть, — и медиана их среднее: десять делить на два пять. В чётном ряду медиана часто в самом ряду не встречается.',
      'This series was skipped because there is NO five in it. But the median need not be a number of the series: here there are four numbers, so there is no single centre. The middle two are four and six, and the median is their mean: ten divided by two is five. In an even series the median often does not appear in the series at all.') },
    { when: (s) => s.extra.indexOf('i6') !== -1, text: L(
      "Bu qatorda beshlik BOR, lekin u o'rtada emas — birinchi o'rinda turibdi. Mediana ORINGA qaraydi: uchta son bor, o'rtadagisi ikkinchi o'rinda, ya'ni olti. Qiymatning qatorda bo'lgani hech narsani hal qilmaydi; muhimi — u qayerda turgani.",
      'В этом ряду пятёрка ЕСТЬ, но она не в середине — она на первом месте. Медиана смотрит на МЕСТО: чисел три, срединное на втором месте, то есть шесть. То, что значение есть в ряду, ничего не решает; важно, где оно стоит.',
      'This series DOES contain a five, but not in the middle — it stands first. The median looks at POSITION: there are three numbers, the middle one stands second, that is six. A value being present in the series decides nothing; what matters is where it stands.') },
    { when: (s) => s.extra.indexOf('i4') !== -1, text: L(
      "Bu qatorda ham to'rtta son bor, ya'ni mediana o'rtadagi ikkitasining o'rtachasi: to'rt va sakkiz, ularning o'rtachasi olti. Qo'shni karta bilan solishtiring — u yerda ham to'rtta son, lekin uchinchisi olti, va mediana besh chiqadi. Bitta sonning o'zgarishi medianani ham o'zgartiradi.",
      'В этом ряду тоже четыре числа, значит медиана — среднее двух срединных: четыре и восемь, их среднее шесть. Сравни с соседней карточкой — там тоже четыре числа, но третье шесть, и медиана выходит пять. Изменение одного числа меняет и медиану.',
      'This series also has four numbers, so the median is the mean of the middle two: four and eight, whose mean is six. Compare with the neighbouring card — four numbers there too, but the third is six and the median comes to five. Changing one number changes the median.') },
    { when: (s) => s.extra.indexOf('i2') !== -1, text: L(
      "Bu qatorda uchta son bor va o'rtadagisi to'rt, besh emas. Qo'shni karta bilan solishtiring: u yerda o'sha uchlik va to'qqizlik turibdi, faqat o'rtadagi son boshqa. Mediana aynan o'sha o'rtadagi sondan olinadi, chetdagilar esa unga ta'sir qilmaydi — ular qanchalik katta yoki kichik bo'lishidan qat'i nazar.",
      'В этом ряду три числа, и срединное четыре, а не пять. Сравни с соседней карточкой: там те же тройка и девятка, отличается лишь срединное число. Медиана берётся именно из него, а крайние на неё не влияют — какими бы большими или маленькими они ни были.',
      'This series has three numbers and the middle one is four, not five. Compare with the neighbouring card: the same three and nine there, only the middle number differs. The median is taken from that middle number, and the outer ones do not affect it — however large or small they may be.') },
    { when: (s) => s.marked.length !== 3, text: L(
      "Aynan uchta qator kerak. Har qatorda avval SONLARNI SANANG: toq bo'lsa o'rtadagisini oling, juft bo'lsa o'rtadagi ikkitasining o'rtachasini hisoblang.",
      'Нужно ровно три ряда. В каждом сначала СОСЧИТАЙ ЧИСЛА: если их нечётное количество, бери срединное, если чётное — считай среднее двух срединных.',
      'Exactly three series are needed. In each, first COUNT THE NUMBERS: with an odd count take the middle one, with an even count compute the mean of the middle two.') },
  ],
  wrongText: L(
    "Avval nechta son borligini sanang. Toq bo'lsa mediana o'rtadagi son, juft bo'lsa o'rtadagi ikki sonning o'rtachasi.",
    'Сначала сосчитай, сколько чисел. Нечётное количество — медиана срединное число, чётное — среднее двух срединных.',
    'First count how many numbers there are. An odd count means the median is the middle number, an even count means the mean of the middle two.'),
};

export default function D35_04(props) { return <MarkAll data={DATA} {...props} />; }
