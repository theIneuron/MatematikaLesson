// Dars14 · Amaliyot 06 — Guruhlar · 🟡 · tag: rational_or_irrational
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Skelet: DARS12_14_AMALIYOT_SKELET.md §5 (14-dars, 6-pozitsiya)
//
// UCHTA ADASHISH BITTA TOPSHIRIQDA — ratsional guruhning uch kartasi ataylab
// irratsionalga o'xshab turadi:
//   √100  — ildiz belgisi bor, qiymati esa o'n (З36);
//   0,(12) — yozuvi cheksiz, lekin davriy (З35);
//   22/7  — pi ning eng mashhur yaqinlashishi, lekin O'ZI oddiy kasr (З37).
// Irratsional guruhda uch ildiz va bitta ochiq yozuv: nol butun bir nol bir
// nol nol bir — nollarning soni har qadamda ortadi, ya'ni takrorlanuvchi
// bo'lak paydo bo'lmaydi.
// Zona sarlavhasi qisqa SO'Z: telefonda ustun keni 74px (kit.jsx, Zones).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'rational_or_irrational', level: '🟡',
  zoneSize: 15, itemSize: 15,
  zones: [
    { id: 'z1', label: L('RATSIONAL', 'РАЦИОНАЛЬНЫЕ', 'RATIONAL') },
    { id: 'z2', label: L('IRRATSIONAL', 'ИРРАЦИОНАЛЬНЫЕ', 'IRRATIONAL') },
  ],
  items: [
    { id: 'i1', tokens: [{ r: '100' }], zone: 'z1' },
    { id: 'i2', tokens: [{ r: '3' }], zone: 'z2' },
    { id: 'i3', tokens: ['0,75'], zone: 'z1' },
    { id: 'i4', tokens: [{ r: '20' }], zone: 'z2' },
    { id: 'i5', tokens: [{ n: '22', d: '7' }], zone: 'z1' },
    { id: 'i6', tokens: [{ r: '12' }], zone: 'z2' },
    { id: 'i7', tokens: ['0,(12)'], zone: 'z1' },
    { id: 'i8', tokens: ['0,101001000…'], zone: 'z2' },
  ],
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Sakkiz son. Ba'zilari birinchi qarashda boshqa guruhga o'xshab turadi: ildiz belgisi ham, cheksiz yozuv ham hech narsani hal qilmaydi.",
    'Восемь чисел. Некоторые на первый взгляд похожи на другую группу: ни знак корня, ни бесконечная запись ничего не решают.',
    'Eight numbers. Some look at first glance like the other group: neither a root sign nor an endless record decides anything.'),
  ask: L(
    "Sonni bosing, keyin guruhini bosing. Bu sonni kasr ko'rinishida yozish mumkinmi?",
    'Нажми число, потом его группу. Можно ли записать это число дробью?',
    'Tap a number, then its group. Can this number be written as a fraction?'),
  bank: L('Sonlar', 'Числа', 'Numbers'),
  correctText: L(
    "To'g'ri. Birinchi guruhda to'rttasi ham kasr ko'rinishida yoziladi: yuzdan ildiz o'nga teng, nol butun yetmish besh bu uch bo'lingan to'rt, yigirma ikki bo'lingan yetti allaqachon kasr, nol butun o'n ikki davriy esa o'n ikki bo'lingan to'qson to'qqiz. Ikkinchi guruhda uch, yigirma va o'n ikki to'liq kvadrat emas, oxirgi yozuvda esa nollar soni har qadamda ortadi — takrorlanuvchi bo'lak hech qachon paydo bo'lmaydi.",
    'Верно. В первой группе все четыре записываются дробью: корень из ста равен десяти, нуль целых семьдесят пять сотых это три четвёртых, двадцать два седьмых уже дробь, а нуль целых двенадцать в периоде это двенадцать девяносто девятых. Во второй группе три, двадцать и двенадцать не полные квадраты, а в последней записи число нулей растёт с каждым шагом — повторяющаяся часть не появится никогда.',
    'Correct. In the first group all four can be written as fractions: the root of one hundred is ten, zero point seven five is three quarters, twenty two sevenths is already a fraction, and zero point one two repeating is twelve ninety ninths. In the second group three, twenty and twelve are not perfect squares, and in the last record the number of zeros grows at every step — a repeating block will never appear.'),
  wrongs: [
    { when: (s) => s.place.i1 === 'z2', text: L(
      "Yuzdan ildiz ikkinchi guruhga tushdi. Uning qiymatini hisoblang: o'n karra o'n yuz, demak ildiz o'nga teng. O'n esa butun son. Ildiz belgisi sonni irratsional qilmaydi — ildiz ostidagi son to'liq kvadrat bo'lsa, ildiz ratsional.",
      'Корень из ста попал во вторую группу. Посчитай его значение: десять на десять сто, значит корень равен десяти. А десять — целое число. Знак корня иррациональным не делает: если подкоренное полный квадрат, корень рационален.',
      'The root of one hundred went into the second group. Compute its value: ten times ten is one hundred, so the root is ten. And ten is a whole number. A root sign does not make a number irrational: if the radicand is a perfect square the root is rational.') },
    { when: (s) => s.place.i7 === 'z2', text: L(
      "Nol butun o'n ikki davriy ikkinchi guruhga tushdi, chunki yozuvi cheksiz. Lekin cheksizlikning o'zi belgi emas: o'n ikki bo'lagi AYLANIB turadi, va shunday sonni har doim kasr qilib yozish mumkin — bu holda o'n ikki bo'lingan to'qson to'qqiz. Bo'lib tekshiring.",
      'Нуль целых двенадцать в периоде попал во вторую группу из-за бесконечной записи. Но бесконечность сама по себе не признак: часть двенадцать идёт ПО КРУГУ, а такое число всегда записывается дробью — здесь двенадцать девяносто девятых. Проверь делением.',
      'Zero point one two repeating went into the second group because of its endless record. But endlessness alone is not the mark: the block one two goes ROUND, and such a number can always be written as a fraction — here twelve ninety ninths. Check by dividing.') },
    { when: (s) => s.place.i5 === 'z2', text: L(
      "Yigirma ikki bo'lingan yetti ikkinchi guruhga tushdi. Bu son pi ga juda yaqin — uch butun o'n to'rt ikki sakkiz besh yetti — va shu sababli uni pi bilan aralashtirish oson. Lekin yaqinlashish sonning o'zi emas: yigirma ikki bo'lingan yetti oddiy kasr, ya'ni ratsional, va uning onli yozuvi davriy.",
      'Двадцать два седьмых попало во вторую группу. Это число очень близко к пи — три целых сто сорок две тысячи восемьсот пятьдесят семь — и потому их легко спутать. Но приближение — не само число: двадцать два седьмых обычная дробь, значит рациональна, и её десятичная запись периодична.',
      'Twenty two sevenths went into the second group. This number is very close to pi — three point one four two eight five seven — so the two are easy to confuse. But an approximation is not the number itself: twenty two sevenths is an ordinary fraction, hence rational, and its decimal record is periodic.') },
    { when: (s) => s.place.i2 === 'z1' || s.place.i4 === 'z1' || s.place.i6 === 'z1', text: L(
      "Birinchi guruhga to'liq kvadrat bo'lmagan ildiz tushdi. Tekshiring: birning kvadrati bir, ikkining kvadrati to'rt — uch ular orasida; to'rtning kvadrati o'n olti, beshning kvadrati yigirma besh — yigirma ular orasida; uchning kvadrati to'qqiz, to'rtning kvadrati o'n olti — o'n ikki ular orasida. Butun chiqmasa, kasr ham chiqmaydi.",
      'В первую группу попал корень, подкоренное которого не полный квадрат. Проверь: один в квадрате один, два в квадрате четыре — три между ними; четыре в квадрате шестнадцать, пять в квадрате двадцать пять — двадцать между ними; три в квадрате девять, четыре в квадрате шестнадцать — двенадцать между ними. Не вышло целого — не выйдет и дроби.',
      'A root whose radicand is not a perfect square went into the first group. Check: one squared is one, two squared is four — three lies between; four squared is sixteen, five squared is twenty five — twenty lies between; three squared is nine, four squared is sixteen — twelve lies between. No whole value means no fraction either.') },
    { when: (s) => s.place.i8 === 'z1', text: L(
      "Oxirgi yozuv birinchi guruhga tushdi. Unga diqqat bilan qarang: bir, keyin bitta nol, keyin ikkita nol, keyin uchta nol — nollarning soni O'SIB boradi. Ya'ni aylanib turgan bo'lak yo'q, va yozuv hech qachon takrorlanmaydi.",
      'Последняя запись попала в первую группу. Посмотри внимательно: единица, потом один нуль, потом два нуля, потом три — количество нулей РАСТЁТ. То есть повторяющейся части нет, и запись никогда не повторится.',
      'The last record went into the first group. Look closely: a one, then one zero, then two zeros, then three — the count of zeros GROWS. So there is no repeating block, and the record will never repeat.') },
  ],
  wrongText: L(
    "Har sonda bitta savol: uni kasr ko'rinishida yozish mumkinmi. Ildizda ildiz ostidagi sonni to'liq kvadratga tekshiring, onli yozuvda esa takrorlanuvchi bo'lakni izlang.",
    'В каждом числе один вопрос: можно ли записать его дробью. У корня проверь подкоренное на полный квадрат, а в десятичной записи ищи повторяющуюся часть.',
    'One question for every number: can it be written as a fraction. For a root, test the radicand for being a perfect square; in a decimal record, look for a repeating block.'),
};

export default function D14_06(props) { return <Zones data={DATA} {...props} />; }
