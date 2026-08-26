// Dars50 · Amaliyot 10 — Pazl · 🔴 · tag: three_cases
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §12 (50-dars, 10-pozitsiya)
//
// UCH HOLAT BIR AYLANADA (R = 5) — darsning butun trixotomiyasi bir
// topshiriqda:
//   d = 3 -> AB = 8   (kesuvchi: ildiz ostida 25 − 9 = 16, yarim vatar 4)
//   d = 5 -> n = 1    (urinma)
//   d = 7 -> n = 0    (umumiy nuqta yo'q; ildiz ostida manfiy son)
// `n` — umumiy nuqtalar soni (setup aytadi). O'quvchi avval `d` ni `R` bilan
// SOLISHTIRISHI, keyingina hisoblashi kerak: uchinchi holatda hisob umuman
// bajarilmaydi, va ildiz ostidagi manfiy son «hisoblab bo'lmaydi» degani
// emas, «kesishmaydi» degani.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'three_cases', level: '🔴',
  faceSize: 13, faceSizePhone: 11,
  cards: [
    { id: 'f1', side: 0, tokens: ['d = 3'] },
    { id: 'f2', side: 0, tokens: ['d = 5'] },
    { id: 'f3', side: 0, tokens: ['d = 7'] },
    { id: 'v1', side: 1, v: 'AB = 8' },
    { id: 'v2', side: 1, v: 'n = 1' },
    { id: 'v3', side: 1, v: 'n = 0' },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "Aylananing radiusi besh. Uch to'g'ri chiziq markazdan turli masofada turadi: uch, besh va yetti. Natija esa uch xil: vatarning uzunligi, yoki umumiy nuqtalarning soni. n harfi umumiy nuqtalarning sonini bildiradi.",
    'Радиус окружности пять. Три прямые стоят от центра на разных расстояниях: три, пять и семь. А результат трёх видов: длина хорды или число общих точек. Буква n обозначает число общих точек.',
    'The radius of a circle is five. Three lines stand at different distances from the centre: three, five and seven. The results are of three kinds: the length of a chord, or the number of common points. The letter n stands for the number of common points.'),
  ask: L(
    'Masofani bosing, keyin uyani bosing.',
    'Нажми расстояние, потом ячейку.',
    'Tap a distance, then a slot.'),
  bank: L('Masofalar', 'Расстояния', 'Distances'),
  correctText: L(
    "To'g'ri. Uchala holat bitta aylanada, va farqni faqat masofa beradi. Uch beshdan kichik: chiziq aylananing ichiga kiradi, yigirma besh minus to'qqiz o'n olti, ildizi to'rt — bu yarim vatar, to'liq vatar sakkiz. Besh beshga teng: chiziq aylanaga tegadi, umumiy nuqta bitta, va vatar nolga aylanadi. Yetti beshdan katta: chiziq aylanaga yetib bormaydi, umumiy nuqta yo'q. Uchinchi holatda formulani qo'llashga urinsangiz, yigirma besh minus qirq to'qqiz, ya'ni minus yigirma to'rt chiqadi — ildiz ostida manfiy son. Bu «hisoblab bo'lmaydi» degani emas: bu chiziq va aylananing kesishmasligining ALGEBRAIK belgisi.",
    'Верно. Все три случая в одной окружности, и различие даёт только расстояние. Три меньше пяти: прямая заходит внутрь окружности, двадцать пять минус девять — шестнадцать, корень четыре, это половина хорды, вся хорда восемь. Пять равно пяти: прямая касается окружности, общая точка одна, а хорда обращается в нуль. Семь больше пяти: прямая до окружности не доходит, общих точек нет. Если в третьем случае попытаться применить формулу, выйдет двадцать пять минус сорок девять, то есть минус двадцать четыре — под корнем отрицательное число. Это не значит «посчитать нельзя»: это АЛГЕБРАИЧЕСКИЙ признак того, что прямая и окружность не пересекаются.',
    'Correct. All three cases are in one circle and only the distance makes the difference. Three is less than five: the line enters the circle, twenty five minus nine is sixteen, the root four, which is half the chord, so the whole chord is eight. Five equals five: the line touches the circle, there is one common point and the chord shrinks to zero. Seven is greater than five: the line never reaches the circle and there is no common point. Try the formula in the third case and you get twenty five minus forty nine, that is minus twenty four — a negative under the root. That does not mean it cannot be computed: it is the ALGEBRAIC sign that the line and the circle do not meet.'),
  wrongs: [
    { when: (s) => s.mate.f2 === 'v3' || s.mate.f3 === 'v2', text: L(
      "Bu ikki natija almashib ketdi. Masofa radiusga TENG bo'lganda (besh va besh) chiziq aylanaga tegadi, ya'ni umumiy nuqta BITTA. Masofa radiusdan KATTA bo'lganda (yetti va besh) chiziq aylanaga yetib bormaydi, ya'ni umumiy nuqta NOLTA. Tenglik va kattalik ikki boshqa holat.",
      'Эти два результата поменялись местами. Когда расстояние РАВНО радиусу (пять и пять), прямая касается окружности, значит общая точка ОДНА. Когда расстояние БОЛЬШЕ радиуса (семь и пять), прямая до окружности не доходит, значит общих точек НОЛЬ. Равенство и превышение — два разных случая.',
      'These two results swapped places. When the distance EQUALS the radius (five and five) the line touches the circle, so there is ONE common point. When the distance EXCEEDS the radius (seven and five) the line never reaches it, so there are NONE. Equality and excess are two different cases.') },
    { when: (s) => s.mate.f1 && s.mate.f1 !== 'v1', text: L(
      "Birinchi holatda masofa radiusdan kichik, ya'ni chiziq aylanani KESIB o'tadi va vatar paydo bo'ladi. Uning uzunligini hisoblash kerak: yigirma besh minus to'qqiz o'n olti, ildizi to'rt, va bu yarim vatar — to'liq vatar sakkiz. Bu holatda javob nuqtalarning soni emas, UZUNLIK.",
      'В первом случае расстояние меньше радиуса, значит прямая ПЕРЕСЕКАЕТ окружность и появляется хорда. Её длину надо посчитать: двадцать пять минус девять — шестнадцать, корень четыре, и это половина хорды, вся хорда восемь. В этом случае ответ не число точек, а ДЛИНА.',
      'In the first case the distance is less than the radius, so the line CROSSES the circle and a chord appears. Its length must be computed: twenty five minus nine is sixteen, the root four, and that is half the chord, so the whole chord is eight. Here the answer is not a count of points but a LENGTH.') },
    { when: (s) => s.bad.length >= 2, text: L(
      "Har kartada birinchi ish — masofani radius bilan solishtirish, va faqat undan keyin hisoblash. Kichik bo'lsa vatar hisoblanadi, teng bo'lsa bitta nuqta, katta bo'lsa nolta nuqta. Uchinchi holatda hisob umuman kerak emas.",
      'В каждой карточке первое дело — сравнить расстояние с радиусом, и только потом считать. Меньше — считается хорда, равно — одна точка, больше — ноль точек. В третьем случае счёт вообще не нужен.',
      'The first job in every card is comparing the distance with the radius, and only then computing. Less means a chord is computed, equal means one point, greater means none. In the third case no computation is needed at all.') },
  ],
  wrongText: L(
    "Avval solishtiring: d < R, d = R yoki d > R. Uch holat uch xil javob beradi.",
    'Сначала сравни: d < R, d = R или d > R. Три случая дают три разных ответа.',
    'Compare first: d < R, d = R or d > R. The three cases give three different answers.'),
};

export default function D50_10(props) { return <PairSlots data={DATA} {...props} />; }
