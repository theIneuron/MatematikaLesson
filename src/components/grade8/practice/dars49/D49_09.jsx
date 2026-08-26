// Dars49 · Amaliyot 09 — Juftlash · 🔴 · tag: same_radius
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §11 (49-dars, 9-pozitsiya)
//
// TO'RT JUFTLIK, IKKITA BIR XIL RADIUSDA:
//   R=5,  d=3  -> AB = 8    (yarim vatar 4)
//   R=5,  d=4  -> AB = 6    (yarim vatar 3)
//   R=13, d=12 -> AB = 10   (yarim vatar 5)
//   R=13, d=5  -> AB = 24   (yarim vatar 12)
// BIR AYLANADA MASOFA O'SGANDA VATAR QISQARADI, va buni ikki juftlik
// yonma-yon ko'rsatadi. Aralashtirish oson: `R=13, d=12` va `R=13, d=5`
// ning javoblari juda boshqa (o'n va yigirma to'rt), lekin ular bitta
// uchlikning ikki yarmi — besh, o'n ikki, o'n uch.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const DATA = {
  tag: 'same_radius', level: '🔴',
  connect: true,
  targetSize: 18, itemSize: 16,
  items: [
    { id: 'm1', tokens: ['R=5, d=3'] },
    { id: 'm2', tokens: ['R=5, d=4'] },
    { id: 'm3', tokens: ['R=13, d=12'] },
    { id: 'm4', tokens: ['R=13, d=5'] },
  ],
  targets: [
    { id: 't1', tokens: ['AB = 8'] },
    { id: 't2', tokens: ['AB = 6'] },
    { id: 't3', tokens: ['AB = 10'] },
    { id: 't4', tokens: ['AB = 24'] },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Juftlash', 'Сопоставление', 'Matching'),
  setup: L(
    "To'rt shart: har birida aylananing radiusi va markazdan vatargacha masofa berilgan, vatarning uzunligi izlanadi. Ikki juftlikda radius bir xil — ular bitta aylanadagi ikki vatar.",
    'Четыре условия: в каждом даны радиус окружности и расстояние от центра до хорды, ищется длина хорды. В двух парах радиус одинаковый — это две хорды одной окружности.',
    'Four conditions: each gives the radius of a circle and the distance from the centre to a chord, and asks for the length of the chord. Two pairs share a radius — they are two chords of one circle.'),
  ask: L(
    "Chapdan shartni bosing, keyin o'ngdan vatarni bosing.",
    'Нажми условие слева, потом хорду справа.',
    'Tap a condition on the left, then the chord on the right.'),
  correctText: L(
    "To'g'ri. Har javob ikki qadamda topiladi: kvadratlarni ayirib yarim vatarni chiqarish, keyin uni ikkilantirish. Yigirma besh minus to'qqiz o'n olti, ildizi to'rt, vatar sakkiz. Yigirma besh minus o'n olti to'qqiz, ildizi uch, vatar olti. Bir yuz oltmish to'qqiz minus bir yuz qirq to'rt yigirma besh, ildizi besh, vatar o'n. Bir yuz oltmish to'qqiz minus yigirma besh bir yuz qirq to'rt, ildizi o'n ikki, vatar yigirma to'rt. Endi eng muhim joyi: birinchi ikki juftlik BIR aylanada, va masofa uchdan to'rtga o'sganda vatar sakkizdan oltiga qisqaradi. Ikkinchi ikkitasi ham bir aylanada, va farq yanada aniq: masofa besh bo'lganda vatar yigirma to'rt, masofa o'n ikki bo'lganda esa faqat o'n. Vatar markazdan uzoqlashgani sari qisqaradi.",
    'Верно. Каждый ответ находится в два шага: вычесть квадраты и получить половину хорды, потом её удвоить. Двадцать пять минус девять — шестнадцать, корень четыре, хорда восемь. Двадцать пять минус шестнадцать — девять, корень три, хорда шесть. Сто шестьдесят девять минус сто сорок четыре — двадцать пять, корень пять, хорда десять. Сто шестьдесят девять минус двадцать пять — сто сорок четыре, корень двенадцать, хорда двадцать четыре. И самое важное: первые две пары в ОДНОЙ окружности, и когда расстояние растёт с трёх до четырёх, хорда убывает с восьми до шести. Вторые две тоже в одной окружности, и различие ещё заметнее: при расстоянии пять хорда двадцать четыре, а при расстоянии двенадцать всего десять. Чем дальше хорда от центра, тем она короче.',
    'Correct. Every answer comes in two steps: subtract the squares to get half the chord, then double it. Twenty five minus nine is sixteen, the root four, the chord eight. Twenty five minus sixteen is nine, the root three, the chord six. One hundred sixty nine minus one hundred forty four is twenty five, the root five, the chord ten. One hundred sixty nine minus twenty five is one hundred forty four, the root twelve, the chord twenty four. And the main point: the first two pairs are in ONE circle, and as the distance grows from three to four the chord shrinks from eight to six. The second two share a circle as well, and the difference is starker: at distance five the chord is twenty four, at distance twelve only ten. The farther a chord sits from the centre, the shorter it is.'),
  wrongs: [
    { when: (s) => s.pair.m3 === 't4' || s.pair.m4 === 't3', text: L(
      "Bu ikki juftlik almashib ketdi, va ular bitta aylanada: radius o'n uch. Masofa KATTA bo'lganda vatar QISQA bo'ladi — o'n ikki masofada vatar o'n, besh masofada esa yigirma to'rt. Har birini hisoblang: bir yuz oltmish to'qqiz minus bir yuz qirq to'rt yigirma besh (ildizi besh, vatar o'n); bir yuz oltmish to'qqiz minus yigirma besh bir yuz qirq to'rt (ildizi o'n ikki, vatar yigirma to'rt). Besh va o'n ikki bu yerda o'rin almashadi — bu tanish uchlikning ikki yarmi.",
      'Эти две пары поменялись местами, а они в одной окружности: радиус тринадцать. При БОЛЬШЕМ расстоянии хорда КОРОЧЕ — при расстоянии двенадцать хорда десять, при пяти двадцать четыре. Посчитай каждую: сто шестьдесят девять минус сто сорок четыре — двадцать пять (корень пять, хорда десять); сто шестьдесят девять минус двадцать пять — сто сорок четыре (корень двенадцать, хорда двадцать четыре). Пять и двенадцать здесь меняются ролями — это две половины знакомой тройки.',
      'These two pairs were swapped, and they belong to one circle: radius thirteen. A LARGER distance means a SHORTER chord — at distance twelve the chord is ten, at five it is twenty four. Compute each: one hundred sixty nine minus one hundred forty four is twenty five (root five, chord ten); one hundred sixty nine minus twenty five is one hundred forty four (root twelve, chord twenty four). Five and twelve swap roles here — the two halves of the familiar triple.') },
    { when: (s) => s.pair.m1 === 't2' || s.pair.m2 === 't1', text: L(
      "Bu ikki juftlik ham bitta aylanada: radius besh. Masofa uch bo'lsa yarim vatar to'rt (yigirma besh minus to'qqiz o'n olti), vatar sakkiz; masofa to'rt bo'lsa yarim vatar uch, vatar olti. Uch, to'rt, besh uchligi ikki tomonga aylanadi — lekin sonlarning o'rni muhim: masofa katta bo'lgan vatar qisqaroq.",
      'Эти две пары тоже в одной окружности: радиус пять. При расстоянии три половина хорды четыре (двадцать пять минус девять — шестнадцать), хорда восемь; при расстоянии четыре половина три, хорда шесть. Тройка три, четыре, пять поворачивается в обе стороны, но роли чисел важны: у хорды с большим расстоянием длина меньше.',
      'These two pairs also share a circle: radius five. At distance three half the chord is four (twenty five minus nine is sixteen), the chord eight; at distance four the half is three, the chord six. The triple three, four, five turns both ways, but the roles matter: the chord with the larger distance is the shorter one.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har shartda ikki qadam bor va ikkinchisini tashlab ketib bo'lmaydi: kvadratlarni ayirib ildiz chiqarasiz — bu YARIM vatar, — keyin ikkilantirasiz. Ikkilantirishni tashlab ketsangiz, to'rt, uch, besh va o'n ikki chiqadi — o'ng ustunda bunday son yo'q.",
      'В каждом условии два шага, и второй пропустить нельзя: вычитаешь квадраты и извлекаешь корень — это ПОЛОВИНА хорды, — потом удваиваешь. Пропустив удвоение, получишь четыре, три, пять и двенадцать — таких чисел в правом столбце нет.',
      'Two steps in every condition and the second cannot be skipped: subtract the squares and take the root — that is HALF the chord — then double. Skip the doubling and you get four, three, five and twelve — no such numbers in the right column.') },
  ],
  wrongText: L(
    "Kvadratlarni ayirib ildiz chiqaring, keyin IKKILANTIRING. Bir aylanada masofa o'ssa vatar qisqaradi.",
    'Вычти квадраты, извлеки корень, потом УДВОЙ. В одной окружности с ростом расстояния хорда убывает.',
    'Subtract the squares, take the root, then DOUBLE. In one circle a growing distance means a shrinking chord.'),
};

export default function D49_09(props) { return <MatchPairs data={DATA} {...props} />; }
