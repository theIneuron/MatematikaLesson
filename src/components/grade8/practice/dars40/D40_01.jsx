// Dars40 · Amaliyot 01 — Balandlik · 🟢 🖼 · tag: which_is_height
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Skelet: DARS31_40_AMALIYOT_SKELET.md §12 (40-dars, 1-pozitsiya)
//
// TO'RT VARIANT — TO'RT CHIZMA, va hammasida O'SHA parallelogramm turadi:
// farq faqat urg'u rangida chizilgan KESMADA. Balandlikni so'z bilan
// tanlash uni yodlatardi, chizmada tanlash esa ko'rsatadi (skelet §0a.2).
//
//   to'g'ri javob — B dan AD ga tushirilgan PERPENDIKULYAR
//   AB            — yon tomon, qiya (З83 ning o'zi)
//   AC            — diagonal
//   D dan tushgan kesma — perpendikulyar, lekin AB ga: bu ham balandlik,
//                   ammo BOSHQA asosga (2026-08-26 QA: ilgari bu yerda C dan
//                   AD ga tushgan perpendikulyar turardi, uning uzunligi ham
//                   34 edi — ya'ni ikkita to'g'ri javob bor edi)
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

// ABCD: A(14,64) B(38,18) C(94,18) D(70,64). AD — pastki tomon (asos).
// Kadr kichraytirildi (o'lchov 2026-08-25): to'rt variant ikki qatorda
// turadi, va katta kadr razbor bilan birga topshiriqni kadrdan chiqarardi.
const P = { fig: 'poly', w: 78, h: 54, pts: [[11, 47], [28, 13], [70, 13], [52, 47]], names: ['A', 'B', 'C', 'D'] };

const DATA = {
  tag: 'which_is_height', level: '🟢',
  correct: 0, optCols: 2, optSize: 13,
  eyebrow: L('Balandlik', 'Высота', 'Height'),
  setup: L(
    "ABCD parallelogrammda AD tomoni asos qilib olindi. To'rt chizmada bitta figura turibdi, va har birida bitta kesma ajratilgan. Ulardan faqat bittasi shu asosga mos balandlik.",
    'В параллелограмме ABCD за основание взята сторона AD. На четырёх рисунках одна и та же фигура, и в каждом выделен один отрезок. Лишь один из них — высота, соответствующая этому основанию.',
    'In the parallelogram ABCD the side AD is taken as the base. The four drawings show the same figure, each with one segment picked out. Only one of them is the height matching that base.'),
  ask: L(
    'AD asosiga mos balandlik qaysi chizmada?',
    'На каком рисунке высота, соответствующая основанию AD?',
    'Which drawing shows the height matching the base AD?'),
  opts: [
    // to'g'ri: B dan AD ga perpendikulyar, oyog'i (38, 64)
    { label: [{ ...P, segs: [{ from: 1, to: [28, 47], dash: true }] }] },
    // yon tomon AB
    { label: [{ ...P, segs: [{ from: 0, to: 1 }] }] },
    // diagonal AC
    { label: [{ ...P, segs: [{ from: 0, to: 2 }] }] },
    // D dan AB tomoniga perpendikulyar: balandlik, lekin AB asosiga
    { label: [{ ...P, segs: [{ from: 3, to: [19.2, 30.6], dash: true }] }] },
  ],
  correctText: L(
    "To'g'ri. Balandlik TANLANGAN asosga perpendikulyar bo'ladi. Birinchi chizmada kesma B uchidan chiqib, AD ga to'g'ri burchak ostida tushadi. Yon tomon AB esa balandlik emas: u qiya. Aynan shu chalkashlik yuzani ikki tomon ko'paytmasi deb hisoblashga olib keladi.",
    'Верно. Высота ПЕРПЕНДИКУЛЯРНА ВЫБРАННОМУ основанию. На первом рисунке отрезок выходит из вершины B и опускается на AD под прямым углом. А боковая сторона AB высотой не является: она наклонная. Именно эта путаница и приводит к тому, что площадь считают произведением двух сторон.',
    'Correct. A height is PERPENDICULAR to the CHOSEN base. In the first drawing the segment leaves the vertex B and drops onto AD at a right angle. The side AB is not a height: it is slanted. This very confusion is what leads to computing the area as the product of two sides.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Bu YON TOMON, balandlik emas. U asosga to'g'ri burchak ostida tushmaydi — u qiya, va shu sababli u asosdan uzoqlikni o'lchamaydi. Farqni ko'rish oson: parallelogrammni yotiqroq qilib buring — yon tomonning uzunligi o'zgarmaydi, balandlik esa kichrayadi. Demak yuza ham kichrayadi, va yon tomon uni ko'rsata olmaydi. Bu darsning eng qimmat chalkashligi.",
      'Это БОКОВАЯ СТОРОНА, а не высота. Она не опускается на основание под прямым углом — она наклонная, и потому не измеряет удалённость от основания. Различие увидеть легко: наклони параллелограмм сильнее — длина боковой стороны не изменится, а высота уменьшится. Значит уменьшится и площадь, а боковая сторона её показать не может. Это самая дорогая путаница урока.',
      'This is the SIDE, not the height. It does not meet the base at a right angle — it is slanted, and so it does not measure the distance from the base. The difference is easy to see: tilt the parallelogram further — the length of the side does not change while the height shrinks. So the area shrinks too, and the side cannot show it. This is the costliest confusion of the lesson.') },
    { when: (s) => s.picked === 2, text: L(
      "Bu DIAGONAL: u ikki qarama-qarshi uchni tutashtiradi va figurani ikki uchburchakka ajratadi. Balandlikka o'xshab ko'rinishi mumkin, chunki u ham figuraning ichidan o'tadi, lekin u asosga perpendikulyar emas. Balandlikning belgisi — asos bilan hosil qilgan TO'G'RI BURCHAK, va diagonalda u yo'q.",
      'Это ДИАГОНАЛЬ: она соединяет две противоположные вершины и делит фигуру на два треугольника. Похожей на высоту она может показаться потому, что тоже проходит внутри фигуры, но основанию она не перпендикулярна. Признак высоты — ПРЯМОЙ УГОЛ с основанием, а у диагонали его нет.',
      'This is the DIAGONAL: it joins two opposite vertices and splits the figure into two triangles. It may look like a height because it too runs inside the figure, but it is not perpendicular to the base. The mark of a height is the RIGHT ANGLE with the base, and the diagonal has none.') },
    { when: (s) => s.picked === 3, text: L(
      "Bu ham balandlik, lekin BOSHQA asosga. Kesma AB tomoniga perpendikulyar tushgan, ya'ni u AB asos qilib olinganda balandlik bo'ladi. Savol esa AD asosiga mos balandlikni so'radi. Yuza formulasida asos va balandlik JUFT bo'lib keladi: asosni almashtirsangiz, balandlikni ham almashtirish kerak, aks holda ko'paytma yuzani bermaydi.",
      'Это тоже высота, но к ДРУГОМУ основанию. Отрезок перпендикулярен стороне AB, то есть он будет высотой, если за основание взять AB. А спрашивают высоту к основанию AD. В формуле площади основание и высота идут ПАРОЙ: сменил основание — меняй и высоту, иначе произведение площади не даст.',
      'This is a height too, but to a DIFFERENT base. The segment is perpendicular to the side AB, so it is the height when AB is taken as the base. But the question asks for the height matching the base AD. In the area formula the base and the height come as a PAIR: change the base and you must change the height, or the product will not give the area.') },
  ],
  wrongText: L(
    "Balandlik TANLANGAN asosga perpendikulyar bo'ladi. Yon tomon qiya, diagonal esa perpendikulyar emas.",
    'Высота перпендикулярна ВЫБРАННОМУ основанию. Боковая сторона наклонная, а диагональ не перпендикулярна.',
    'A height is perpendicular to the CHOSEN base. A side is slanted and a diagonal is not perpendicular.'),
};

export default function D40_01(props) { return <Choice data={DATA} {...props} />; }
