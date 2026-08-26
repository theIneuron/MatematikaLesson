// Dars40 · Amaliyot 10 — Chizmalar · 🔴 🖼 · tag: same_area_marked
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §12 (40-dars, 10-pozitsiya)
//
// OLTI PARALLELOGRAMM, HAR BIRIDA BALANDLIK PUNKTIR BILAN CHIZILGAN.
// Uchtasining yuzi teng: asos 60, balandlik 40, qiyalik esa har xil —
// ya'ni figuralar ko'zga BOSHQA ko'rinadi, yuza esa bir xil (T3).
//
// Rad etilganlar uch xil:
//   balandligi kichik (60 × 28)
//   asosi kichik      (40 × 40)
//   TOMONI o'sha, lekin qiyaligi kattaroq (60 × 30) — З83: tomonning
//     uzunligi o'zgarmagani yuzani saqlamaydi
// Oxirgisi eng qimmat, va u faqat CHIZMADA ko'rinadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

// Kadr kichraytirildi (o'lchov 2026-08-25): olti figura ikki qatorda turadi.
const F = { fig: 'poly', w: 84, h: 62 };
// Balandlik B uchidan asosga tushiriladi; oyog'ining x i B ning x i bilan
// bir xil, y esa asosning y i (64).
const H = (x) => [{ from: 1, to: [x, 51], dash: true }];

const DATA = {
  tag: 'same_area_marked', level: '🔴',
  col: 92, itemSize: 14,
  items: [
    // asos 60, balandlik 40 — qiyalik kichik
    { id: 'i1', hit: true, tokens: [{ ...F, pts: [[10, 51], [18, 19], [66, 19], [58, 51]], segs: H(18) }] },
    // asos 60, balandlik 28
    { id: 'i2', tokens: [{ ...F, pts: [[10, 51], [26, 29], [74, 29], [58, 51]], segs: H(26) }] },
    // asos 60, balandlik 40 — qiyalik o'rtacha
    { id: 'i3', hit: true, tokens: [{ ...F, pts: [[10, 51], [26, 19], [74, 19], [58, 51]], segs: H(26) }] },
    // asos 40, balandlik 40
    { id: 'i4', tokens: [{ ...F, pts: [[10, 51], [26, 19], [58, 19], [42, 51]], segs: H(26) }] },
    // asos 60, balandlik 40 — qiyalik katta
    { id: 'i5', hit: true, tokens: [{ ...F, pts: [[10, 51], [34, 19], [82, 19], [58, 51]], segs: H(34) }] },
    // yon TOMONI i1 nikidek, lekin qiyaligi kattaroq: balandlik 30
    { id: 'i6', tokens: [{ ...F, pts: [[10, 51], [32, 27], [80, 27], [58, 51]], segs: H(32) }] },
  ],
  eyebrow: L('Chizmalar', 'Рисунки', 'Drawings'),
  setup: L(
    "Olti parallelogramm chizilgan, har birida balandlik punktir bilan ko'rsatilgan. Uchtasining yuzi bir xil, garchi ular ko'zga boshqa ko'rinsa ham. Asosni pastki tomon deb oling.",
    'Начерчены шесть параллелограммов, в каждом высота показана пунктиром. У трёх площадь одинакова, хотя на вид они разные. За основание бери нижнюю сторону.',
    'Six parallelograms are drawn, each with its height shown by a dashed line. Three of them have the same area, though they look different. Take the bottom side as the base.'),
  ask: L(
    "Yuzi teng bo'lgan 3 ta figurani belgilang.",
    'Отметь 3 фигуры с одинаковой площадью.',
    'Mark the 3 figures with the same area.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Belgilangan uch figurada asos ham, balandlik ham bir xil — faqat qiyalik boshqa. Bir dasta kartani stol ustida yon tomondan surib qiyalating: dastaning balandligi va tagining kengligi o'zgarmaydi, demak yuza ham o'zgarmaydi. Rad etilganlarda yo balandlik, yo asos kichik; oxirgisida esa yon TOMON birinchisinikidek, lekin qiyalik kattaroq va balandlik kichik.",
    'Верно. У трёх отмеченных и основание, и высота одинаковы — различается только наклон. Положи колоду карт на стол и сдвинь её вбок: высота колоды и ширина основания не изменятся, значит не изменится и площадь. У отвергнутых меньше либо высота, либо основание; у последней боковая СТОРОНА как у первой, но наклон больше, и высота меньше.',
    'Correct. In the three marked figures both the base and the height are the same — only the tilt differs. Set a deck of cards on the table and push it sideways: the height of the deck and the width of its footprint do not change, so the area does not change. Of the rejected ones, either the height or the base is smaller; in the last the SIDE matches the first, but the tilt is greater and the height less.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('i6') !== -1, text: L(
      "Bu figuraning YON TOMONI birinchisiniki bilan deyarli bir xil, lekin uning qiyaligi kattaroq — punktir chiziqqa qarang, u qisqaroq. Yon tomonning uzunligi yuzani SAQLAMAYDI: figura yotqizilganda tomon o'zgarmaydi, balandlik esa kamayadi. Yuza faqat asos va balandlikka bog'liq, ya'ni bu figuraning yuzi kichikroq.",
      'У этой фигуры боковая СТОРОНА почти такая же, как у первой, но наклон больше — посмотри на пунктир, он короче. Длина боковой стороны площадь НЕ СОХРАНЯЕТ: при наклоне сторона не меняется, а высота уменьшается. Площадь зависит только от основания и высоты, значит у этой фигуры она меньше.',
      'This figure has almost the same SIDE as the first, but a greater tilt — look at the dashed line, it is shorter. The length of a side does NOT preserve the area: under tilting the side stays while the height falls. Area depends only on the base and the height, so this figure has the smaller area.') },
    { when: (s) => s.extra.indexOf('i2') !== -1, text: L(
      "Bu figuraning asosi to'g'ri, lekin BALANDLIGI kichikroq — punktir chiziqni belgilangan figuralarnikiga solishtiring. Yuza ikki o'lchamning ko'paytmasi, ya'ni bittasining kamayishi kifoya: bu figura yassiroq, va uning yuzi kichik.",
      'У этой фигуры основание верное, но ВЫСОТА меньше — сравни пунктир с пунктиром отмеченных фигур. Площадь — произведение двух размеров, и достаточно уменьшиться одному: эта фигура приплюснута, и площадь у неё меньше.',
      'This figure has the right base but a smaller HEIGHT — compare its dashed line with those of the marked figures. Area is the product of two measurements, and one falling is enough: this figure is flatter and its area is smaller.') },
    { when: (s) => s.extra.indexOf('i4') !== -1, text: L(
      "Bu figuraning balandligi to'g'ri, lekin ASOSI qisqaroq — pastki tomonni qo'shni figuralarniki bilan solishtiring. Yuza uchun ikkala o'lcham ham muhim: bittasi kichraysa, ko'paytma ham kichrayadi. Bu figura ingichkaroq, ya'ni uning yuzi kam.",
      'У этой фигуры высота верная, но ОСНОВАНИЕ короче — сравни нижнюю сторону с нижними сторонами соседних фигур. Для площади важны оба размера: если уменьшится один, уменьшится и произведение. Эта фигура уже, значит площадь у неё меньше.',
      'This figure has the right height but a shorter BASE — compare its bottom side with those of the neighbouring figures. Both measurements matter for the area: if one shrinks, so does the product. This figure is narrower, so its area is less.') },
    { when: (s) => s.miss.indexOf('i5') !== -1, text: L(
      "Bu figura chetlab o'tildi, chunki u eng kuchli yotqizilgan va boshqalardan farq qilib ko'rinadi. Lekin o'lchang: uning pastki tomoni ham, punktir chizig'i ham belgilangan figuralarniki bilan bir xil. Qiyalik yuzaga TA'SIR QILMAYDI — u faqat figuraning ko'rinishini o'zgartiradi.",
      'Эта фигура пропущена, потому что она сильнее всех завалена и кажется непохожей на остальные. Но измерь: и нижняя сторона, и пунктир у неё такие же, как у отмеченных. Наклон на площадь НЕ ВЛИЯЕТ — он меняет лишь внешний вид фигуры.',
      'This figure was skipped because it leans the most and looks unlike the others. But measure it: both its bottom side and its dashed line match those of the marked figures. Tilt does NOT affect the area — it only changes how the figure looks.') },
    { when: (s) => s.marked.length !== 3, text: L(
      "Aynan uchta figura kerak. Har figurada ikki narsani o'lchang: pastki tomonning uzunligi va punktir chiziqning uzunligi. Ular ko'paytiriladi, va qiyalik hisobga umuman kirmaydi.",
      'Нужно ровно три фигуры. В каждой измерь две вещи: длину нижней стороны и длину пунктира. Их перемножают, а наклон в счёт не входит вовсе.',
      'Exactly three figures are needed. Measure two things in each: the length of the bottom side and the length of the dashed line. They are multiplied, and the tilt does not enter the count at all.') },
  ],
  wrongText: L(
    "Faqat ikki narsani solishtiring: pastki tomon va punktir chiziq. Qiyalik va yon tomonning uzunligi yuzaga ta'sir qilmaydi.",
    'Сравнивай только две вещи: нижнюю сторону и пунктир. Наклон и длина боковой стороны на площадь не влияют.',
    'Compare two things only: the bottom side and the dashed line. Tilt and the length of a side do not affect the area.'),
};

export default function D40_10(props) { return <MarkAll data={DATA} {...props} />; }
