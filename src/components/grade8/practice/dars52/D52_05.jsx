// Dars52 · Amaliyot 05 — Markaz · 🟡 🖼 · tag: which_centre
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Skelet: DARS51_55_AMALIYOT_SKELET.md §4 (52-dars, 5-pozitsiya)
//
// З110 TO'G'RIDAN-TO'G'RI: ichki aylananing markazi BISSEKTRISALAR
// kesishgan nuqta, o'rta perpendikulyarlar emas (ular tashqi aylananiki).
// Chizmada punktir chiziqlar uchdan markazga boradi, lekin ular NIMA
// ekanini chizma aytmaydi — javobni o'quvchi ta'rifdan chiqaradi.
// Variantlar SO'Z bilan: `Choice` ning kartalari tarjima qilinadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'which_centre', level: '🟡',
  correct: 0, optCols: 2,
  expr: [{
    fig: 'circ', w: 108, h: 100, r: 18, cx: 54, cy: 50,
    // TURLI TOMONLI ataylab: teng tomonli uchburchakda bissektrisa,
    // mediana, balandlik va o'rta perpendikulyar ustma-ust tushadi, ya'ni
    // chizma to'rt variantning hech birini rad eta olmasdi.
    tang: [80, 190, 320], vnames: ['A', 'B', 'C'], cev: true,
  }],
  eyebrow: L('Markaz', 'Центр', 'The centre'),
  setup: L(
    "Chizmada ABC uchburchakka ichki aylana chizilgan: u uch tomonga ham urinadi. Uchta punktir chiziq uchlardan markazga boradi. Savol shu chiziqlar nima ekani haqida.",
    'На рисунке в треугольник ABC вписана окружность: она касается всех трёх сторон. Три пунктирные линии идут от вершин к центру. Вопрос в том, что это за линии.',
    'The drawing shows a circle inscribed in the triangle ABC: it touches all three sides. Three dashed lines run from the vertices to the centre. The question is what those lines are.'),
  ask: L(
    'Ichki aylananing markazi qaysi chiziqlar kesishgan nuqta?',
    'Точкой пересечения каких линий является центр вписанной окружности?',
    'The centre of the inscribed circle is where which lines meet?'),
  opts: [
    { label: L('bissektrisalar', 'биссектрис', 'the angle bisectors') },
    { label: L("o'rta perpendikulyarlar", 'серединных перпендикуляров', 'the perpendicular bisectors') },
    { label: L('balandliklar', 'высот', 'the altitudes') },
    { label: L('medianalar', 'медиан', 'the medians') },
  ],
  correctText: L(
    "To'g'ri. Sababi masofada. Bissektrisada yotgan nuqta burchakning ikki TOMONIDAN teng uzoqlikda turadi — bu bissektrisaning asosiy xossasi. Uch bissektrisa kesishgan nuqta esa uchala tomondan ham teng uzoqlikda bo'ladi, va o'sha masofa ichki aylananing radiusi. Aylana har tomonga aynan shu sababdan urinadi.",
    'Верно. Причина в расстоянии. Точка на биссектрисе равноудалена от двух СТОРОН угла — это её главное свойство. А точка пересечения трёх биссектрис равноудалена от всех трёх сторон, и это расстояние и есть радиус вписанной окружности. Именно поэтому окружность касается каждой стороны.',
    'Correct. The reason lies in distance. A point on a bisector is equidistant from the two SIDES of the angle — that is its main property. The point where three bisectors meet is then equidistant from all three sides, and that distance is the radius of the inscribed circle. This is exactly why the circle touches every side.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Bu TASHQI aylananing markazi. Farq bitta so'zda, lekin u hamma narsani hal qiladi: o'rta perpendikulyardagi nuqta ikki UCHDAN teng uzoqlikda turadi, bissektrisadagi nuqta esa ikki TOMONDAN. Ichki aylana tomonlarga urinishi kerak, demak unga tomonlargacha bo'lgan masofa kerak — ya'ni bissektrisa. Bu darsning eng qimmat chalkashligi.",
      'Это центр ОПИСАННОЙ окружности. Разница в одном слове, но она решает всё: точка на серединном перпендикуляре равноудалена от двух ВЕРШИН, а точка на биссектрисе — от двух СТОРОН. Вписанная окружность должна касаться сторон, значит нужно расстояние до сторон, то есть биссектриса. Это самая дорогая путаница урока.',
      'This is the centre of the CIRCUMSCRIBED circle. The difference is one word, but it decides everything: a point on a perpendicular bisector is equidistant from two VERTICES, a point on an angle bisector from two SIDES. The inscribed circle must touch the sides, so distance to the sides is what matters — that is, the bisector. This is the costliest confusion of the lesson.') },
    { when: (s) => s.picked === 2, text: L(
      "Balandliklar ham bitta nuqtada kesishadi, lekin u nuqta hech qanday aylananing markazi emas. Balandlik tomonga perpendikulyar tushadi, ya'ni u BITTA tomongacha bo'lgan masofani o'lchaydi. Aylananing markazi uchun esa uchala tomondan bir vaqtda teng uzoqlikda turish kerak.",
      'Высоты тоже пересекаются в одной точке, но эта точка не является центром никакой окружности. Высота опускается перпендикулярно стороне, то есть измеряет расстояние до ОДНОЙ стороны. А центру окружности нужно быть равноудалённым сразу от всех трёх.',
      'The altitudes also meet at one point, but that point is not the centre of any circle. An altitude drops perpendicular to a side, that is, it measures the distance to ONE side. The centre of the circle must be equidistant from all three at once.') },
    { when: (s) => s.picked === 3, text: L(
      "Medianalar bitta nuqtada kesishadi va o'sha nuqta uchburchakning og'irlik markazi bo'ladi, lekin u tomonlardan teng uzoqlikda emas. Mediana tomonning O'RTASIGA boradi, bissektrisa esa burchakni teng ikkiga bo'ladi — bu ikki boshqa ish.",
      'Медианы пересекаются в одной точке, и она является центром тяжести треугольника, но от сторон она не равноудалена. Медиана идёт к СЕРЕДИНЕ стороны, а биссектриса делит угол пополам — это два разных дела.',
      'The medians meet at one point, the centroid of the triangle, but it is not equidistant from the sides. A median runs to the MIDPOINT of a side while a bisector splits the angle in half — two different things.') },
  ],
  wrongText: L(
    "Ichki aylana TOMONLARGA urinadi, demak markaz tomonlardan teng uzoqlikda bo'lishi kerak.",
    'Вписанная окружность касается СТОРОН, значит центр должен быть равноудалён от сторон.',
    'The inscribed circle touches the SIDES, so the centre must be equidistant from the sides.'),
};

export default function D52_05(props) { return <Choice data={DATA} {...props} />; }
