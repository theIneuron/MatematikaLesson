// Dars07 · Amaliyot 05 — Nuqta va formula · 🟡 · tag: point_to_formula · CHIZMALI
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
// Skelet: DARS07_11_AMALIYOT_SKELET.md §5 (7-dars, 5-pozitsiya), §4a
//
// O'NG USTUNDA CHIZMA (metodist qarori 2026-08-24), lekin EGRI CHIZIQ YO'Q:
// faqat o'qlar va bitta belgilangan nuqta. Bu ataylab shunday — giperbola
// chizilsa, o'quvchi tarmoqning shakliga qarab taniy olardi va k ni
// hisoblamas edi. Endi chizmadan KOORDINATA o'qiladi, keyin k = x·y sanaladi.
//
// To'rt nuqtada ikki juft: kattaligi bir xil, ishorasi boshqa (З28).
// O'ng ustun har ochilganda aralashtiriladi (MatchPairs ichida).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const FIG = { fig: 'pts', w: 104, h: 54, R: 7 };

const DATA = {
  tag: 'point_to_formula', level: '🟡',
  connect: true,
  itemSize: 18, targetSize: 12,
  items: [
    { id: 'm1', tokens: ['y', '=', { n: '12', d: 'x' }] },
    { id: 'm2', tokens: ['y', '=', { n: '−12', d: 'x' }] },
    { id: 'm3', tokens: ['y', '=', { n: '20', d: 'x' }] },
    { id: 'm4', tokens: ['y', '=', { n: '−20', d: 'x' }] },
  ],
  targets: [
    { id: 't1', tokens: [{ ...FIG, pt: { x: 2, y: 6, label: '(2; 6)' } }] },
    { id: 't2', tokens: [{ ...FIG, pt: { x: -2, y: 6, label: '(−2; 6)' } }] },
    { id: 't3', tokens: [{ ...FIG, pt: { x: 4, y: 5, label: '(4; 5)' } }] },
    { id: 't4', tokens: [{ ...FIG, pt: { x: -4, y: 5, label: '(−4; 5)' } }] },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Nuqta va formula', 'Точка и формула', 'Point and formula'),
  setup: L(
    "O'ngdagi har chizmada bitta nuqta belgilangan — grafik shu nuqtadan o'tadi. Egri chiziq chizilmagan, uni shakli bo'yicha tanib bo'lmaydi.",
    'На каждом чертеже справа отмечена одна точка — через неё проходит график. Кривая не нарисована, узнать её по форме нельзя.',
    'Each plot on the right has one marked point — the graph passes through it. The curve is not drawn, so it cannot be recognised by shape.'),
  ask: L(
    "Chapdan formulani bosing, keyin o'ngdan uning nuqtasini bosing.",
    'Нажми формулу слева, потом её точку справа.',
    'Tap a formula on the left, then its point on the right.'),
  correctText: L(
    "To'g'ri. Har nuqtada koordinatalarni ko'paytirdingiz: ikki karra olti o'n ikki, minus ikki karra olti minus o'n ikki, to'rt karra besh yigirma, minus to'rt karra besh minus yigirma. Ko'paytma k ga teng, shuning uchun bitta nuqta butun formulani beradi.",
    'Верно. В каждой точке ты перемножил координаты: два на шесть двенадцать, минус два на шесть минус двенадцать, четыре на пять двадцать, минус четыре на пять минус двадцать. Произведение равно k, поэтому одна точка задаёт всю формулу.',
    'Correct. At every point you multiplied the coordinates: two times six is twelve, minus two times six is minus twelve, four times five is twenty, minus four times five is minus twenty. The product equals k, so a single point gives the whole formula.'),
  wrongs: [
    { when: (s) => s.pair.m1 === 't2' || s.pair.m2 === 't1', text: L(
      "Kattalik bir xil, ishora boshqa. Nuqtaning x i manfiy bo'lsa, ko'paytma ham manfiy chiqadi: minus ikki karra olti minus o'n ikki. Ikki nuqtaning ham x ini ko'paytirib solishtiring.",
      'Величина одна, а знак разный. Если x точки отрицателен, произведение тоже отрицательно: минус два на шесть — минус двенадцать. Перемножь координаты обеих точек и сравни.',
      'The size is the same but the sign differs. If the x of the point is negative, the product is negative too: minus two times six is minus twelve. Multiply the coordinates of both points and compare.') },
    { when: (s) => s.pair.m3 === 't4' || s.pair.m4 === 't3', text: L(
      "Bu ikki nuqtada ham faqat ishora farq qiladi. To'rt karra besh yigirma, minus to'rt karra besh esa minus yigirma. Formulaning suratidagi minusni nuqtaning chap tomonda turishi beradi.",
      'В этих двух точках тоже различается только знак. Четыре на пять двадцать, минус четыре на пять минус двадцать. Минус в числителе формулы даёт то, что точка стоит слева.',
      'These two points also differ only in sign. Four times five is twenty, minus four times five is minus twenty. The minus in the numerator of the formula comes from the point standing on the left.') },
    { when: (s) => s.pair.m1 === 't3' || s.pair.m3 === 't1', text: L(
      "Ikki nuqta ham birinchi chorakda, lekin ko'paytmalari boshqa: ikki karra olti o'n ikki, to'rt karra besh esa yigirma. Chorakni emas, KO'PAYTMANI solishtirish kerak.",
      'Обе точки в первой четверти, но произведения разные: два на шесть двенадцать, а четыре на пять двадцать. Сравнивать надо не четверть, а ПРОИЗВЕДЕНИЕ.',
      'Both points are in the first quadrant, but the products differ: two times six is twelve, four times five is twenty. What must be compared is the PRODUCT, not the quadrant.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har chizmada bitta ish qiling: nuqtaning ikki koordinatasini o'qing va ko'paytiring. Chiqqan son formulaning suratida turishi kerak.",
      'С каждым чертежом делай одно: считай две координаты точки и перемножь их. Полученное число и стоит в числителе формулы.',
      'Do one thing with every plot: read the two coordinates of the point and multiply them. The number you get is what stands in the numerator of the formula.') },
  ],
  wrongText: L(
    "Nuqtaning koordinatalarini ko'paytirsangiz k chiqadi. Ishorani ham qo'shib hisoblang.",
    'Перемножь координаты точки — получишь k. Знак считай вместе с числом.',
    'Multiply the coordinates of the point and you get k. Count the sign along with the number.'),
};

export default function D07_05(props) { return <MatchPairs data={DATA} {...props} />; }
