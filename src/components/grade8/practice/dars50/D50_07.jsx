// Dars50 · Amaliyot 07 — Juftlash · 🟡 · tag: cases_to_result
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §12 (50-dars, 7-pozitsiya)
//
// UCH HOLAT BIR AYLANADA (R = 10), va to'rtinchi juftlik boshqa aylanada:
//   d=6  -> AB = 16   (kesuvchi, vatarning uzunligi hisoblanadi)
//   d=10 -> bitta umumiy nuqta (urinma)
//   d=12 -> umumiy nuqta yo'q
//   R=13, d=5 -> AB = 24
// Trixotomiya bir ustunda ko'rinadi: faqat `d` o'zgaradi, natija esa
// butunlay boshqa turga o'tadi. Ikki natija SO'Z bilan, ikkitasi belgi
// bilan — `MatchPairs` ikkisini ham qabul qiladi (skelet §0a.4).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const DATA = {
  tag: 'cases_to_result', level: '🟡',
  connect: true,
  targetSize: 17, itemSize: 16,
  items: [
    { id: 'm1', tokens: ['R=10, d=6'] },
    { id: 'm2', tokens: ['R=10, d=10'] },
    { id: 'm3', tokens: ['R=10, d=12'] },
    { id: 'm4', tokens: ['R=13, d=5'] },
  ],
  targets: [
    { id: 't1', tokens: ['AB = 16'] },
    { id: 't2', label: L('bitta umumiy nuqta', 'одна общая точка', 'one common point') },
    { id: 't3', label: L("umumiy nuqta yo'q", 'общих точек нет', 'no common point') },
    { id: 't4', tokens: ['AB = 24'] },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Juftlash', 'Сопоставление', 'Matching'),
  setup: L(
    "To'rt holat. Birinchi uchtasida aylana bir xil (radiusi o'n), faqat masofa o'zgaradi. To'rtinchisi boshqa aylanada. Chiziq aylanani kesib o'tsa, vatarning uzunligini hisoblash mumkin.",
    'Четыре случая. В первых трёх окружность одна и та же (радиус десять), меняется только расстояние. Четвёртый в другой окружности. Если прямая пересекает окружность, можно посчитать длину хорды.',
    'Four cases. In the first three the circle is the same (radius ten) and only the distance changes. The fourth is in another circle. If the line crosses the circle, the length of the chord can be computed.'),
  ask: L(
    "Chapdan holatni bosing, keyin o'ngdan natijani bosing.",
    'Нажми случай слева, потом результат справа.',
    'Tap a case on the left, then the result on the right.'),
  correctText: L(
    "To'g'ri. Bir aylanada masofa o'zgarganda natija sakrab o'zgaradi. Masofa oltida chiziq aylananing ichiga kiradi: yuz minus o'ttiz olti oltmish to'rt, ildizi sakkiz — bu yarim vatar, to'liq vatar esa o'n olti. Masofa o'nda chiziq aylanaga tegadi: vatar nolga aylanadi, umumiy nuqta bitta. Masofa o'n ikkida chiziq aylanaga yetib bormaydi: umumiy nuqta yo'q. To'rtinchi holat boshqa aylanada: bir yuz oltmish to'qqiz minus yigirma besh bir yuz qirq to'rt, ildizi o'n ikki, vatar yigirma to'rt. Diqqat qiladigan joy: masofa oltidan o'n ikkigacha o'sganda javob «o'n olti» dan «bitta nuqta» ga, keyin «nuqta yo'q» ga o'tadi — bu son emas, TURNING o'zgarishi.",
    'Верно. В одной окружности при изменении расстояния результат меняется скачком. При расстоянии шесть прямая заходит внутрь окружности: сто минус тридцать шесть — шестьдесят четыре, корень восемь, это половина хорды, а вся хорда шестнадцать. При расстоянии десять прямая касается окружности: хорда обращается в нуль, общая точка одна. При расстоянии двенадцать прямая до окружности не доходит: общих точек нет. Четвёртый случай в другой окружности: сто шестьдесят девять минус двадцать пять — сто сорок четыре, корень двенадцать, хорда двадцать четыре. На что стоит обратить внимание: когда расстояние растёт с шести до двенадцати, ответ переходит от «шестнадцати» к «одной точке», а потом к «точек нет» — меняется не число, а ТИП.',
    'Correct. In one circle, as the distance changes the result changes by jumps. At distance six the line enters the circle: one hundred minus thirty six is sixty four, the root eight, which is half the chord, so the whole chord is sixteen. At distance ten the line touches the circle: the chord shrinks to zero and there is one common point. At distance twelve the line never reaches the circle: no common point. The fourth case is in another circle: one hundred sixty nine minus twenty five is one hundred forty four, the root twelve, the chord twenty four. Worth noticing: as the distance grows from six to twelve the answer moves from sixteen to one point and then to none — it is not the number that changes but the KIND.'),
  wrongs: [
    { when: (s) => s.pair.m2 === 't3' || s.pair.m3 === 't2', text: L(
      "Bu ikki natija almashib ketdi. Masofa radiusga TENG bo'lganda (o'n va o'n) chiziq aylanaga tegadi — umumiy nuqta BITTA. Masofa radiusdan KATTA bo'lganda (o'n ikki va o'n) chiziq aylanaga yetib bormaydi — umumiy nuqta YO'Q. Tenglik va kattalik bir xil narsa emas.",
      'Эти два результата поменялись местами. Когда расстояние РАВНО радиусу (десять и десять), прямая касается окружности — общая точка ОДНА. Когда расстояние БОЛЬШЕ радиуса (двенадцать и десять), прямая до окружности не доходит — общих точек НЕТ. Равенство и превышение — не одно и то же.',
      'These two results swapped places. When the distance EQUALS the radius (ten and ten) the line touches the circle — ONE common point. When the distance EXCEEDS the radius (twelve and ten) the line never reaches it — NO common point. Equality and excess are not the same.') },
    { when: (s) => s.pair.m1 === 't4' || s.pair.m4 === 't1', text: L(
      "Bu ikki juftlik almashib ketdi. Ikkalasida ham vatar hisoblanadi, lekin sonlar boshqa: birinchisida yuz minus o'ttiz olti oltmish to'rt (yarim vatar sakkiz, vatar o'n olti), to'rtinchisida bir yuz oltmish to'qqiz minus yigirma besh bir yuz qirq to'rt (yarim vatar o'n ikki, vatar yigirma to'rt). Radius kattaroq bo'lgani va masofa kichikroq bo'lgani uchun ikkinchi vatar uzunroq.",
      'Эти две пары поменялись местами. В обеих считается хорда, но числа разные: в первой сто минус тридцать шесть — шестьдесят четыре (половина хорды восемь, хорда шестнадцать), в четвёртой сто шестьдесят девять минус двадцать пять — сто сорок четыре (половина двенадцать, хорда двадцать четыре). Радиус больше, а расстояние меньше, поэтому вторая хорда длиннее.',
      'These two pairs were swapped. Both compute a chord, but with different numbers: the first has one hundred minus thirty six is sixty four (half the chord eight, the chord sixteen), the fourth has one hundred sixty nine minus twenty five is one hundred forty four (half twelve, chord twenty four). With a larger radius and a smaller distance the second chord is longer.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har holatda avval masofani radius bilan SOLISHTIRING — bu javobning turini beradi: kichik bo'lsa vatar hisoblanadi, teng bo'lsa bitta nuqta, katta bo'lsa umumiy nuqta yo'q. Hisob faqat birinchi holatda kerak bo'ladi.",
      'В каждом случае сначала СРАВНИ расстояние с радиусом — это задаёт тип ответа: меньше — считается хорда, равно — одна точка, больше — общих точек нет. Счёт нужен только в первом случае.',
      'In every case first COMPARE the distance with the radius — that sets the kind of answer: less means a chord is computed, equal means one point, greater means no common point. Only the first case needs arithmetic.') },
  ],
  wrongText: L(
    "Avval masofani radius bilan solishtiring, keyingina hisoblang. Uch holat — uch xil turdagi javob.",
    'Сначала сравни расстояние с радиусом, и только потом считай. Три случая — три разных типа ответа.',
    'First compare the distance with the radius, only then compute. Three cases mean three kinds of answer.'),
};

export default function D50_07(props) { return <MatchPairs data={DATA} {...props} />; }
