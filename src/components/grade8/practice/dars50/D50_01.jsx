// Dars50 · Amaliyot 01 — Test · 🟢 · tag: what_is_tangent
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §12 (50-dars, 1-pozitsiya)
//
// TA'RIF NUQTALAR SONI BILAN BERILADI. Uch xato variant: «kesib
// o'tmaydigan» (bu ta'rif kengroq — aylanadan tashqarida o'tgan chiziq ham
// kesib o'tmaydi), «markazdan o'tuvchi» (aksincha, urinma markazdan
// o'tmaydi), «radiusga parallel».
// `Choice` ning variantlari SO'Z (skelet §0a.4).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'what_is_tangent', level: '🟢',
  correct: 0, optCols: 1, optSize: 15,
  eyebrow: L('Test', 'Тест', 'Test'),
  setup: L(
    "To'g'ri chiziq aylana bilan uch xil joylashishi mumkin: umuman uchrashmasligi, bitta nuqtada uchrashishi yoki ikki nuqtada uchrashishi. Urinma shu uchtadan bittasi.",
    'Прямая может располагаться с окружностью тремя способами: не встречаться вовсе, встречаться в одной точке или в двух. Касательная — один из этих трёх случаев.',
    'A line can lie in three ways with respect to a circle: not meet it at all, meet it at one point, or meet it at two. A tangent is one of those three cases.'),
  ask: L(
    "Urinma qanday to'g'ri chiziq?",
    'Какая прямая называется касательной?',
    'Which line is called a tangent?'),
  opts: [
    { label: L("aylana bilan faqat bitta umumiy nuqtasi bor",
      'имеющая с окружностью только одну общую точку', 'having exactly one point in common with the circle') },
    { label: L("aylanani kesib o'tmaydigan",
      'не пересекающая окружность', 'not crossing the circle') },
    { label: L("markazdan o'tuvchi", 'проходящая через центр', 'passing through the centre') },
    { label: L("radiusga parallel", 'параллельная радиусу', 'parallel to a radius') },
  ],
  correctText: L(
    "To'g'ri. Ta'rif nuqtalar SONI bilan beriladi: aynan bitta umumiy nuqta. Bu son masofa bilan bog'langan — markazdan chiziqqacha masofa radiusga TENG bo'lganda shunday bo'ladi. Masofa radiusdan katta bo'lsa umumiy nuqta yo'q, kichik bo'lsa ikkita. Ya'ni urinma ikki holat orasidagi chegara, va u faqat bitta aniq masofada paydo bo'ladi.",
    'Верно. Определение даётся через ЧИСЛО точек: ровно одна общая точка. Это число связано с расстоянием — так бывает, когда расстояние от центра до прямой РАВНО радиусу. Если расстояние больше радиуса, общих точек нет, если меньше — их две. То есть касательная это граница между двумя случаями, и появляется она лишь при одном точном расстоянии.',
    'Correct. The definition is given by the NUMBER of points: exactly one common point. That number is tied to a distance — it happens when the distance from the centre to the line EQUALS the radius. If the distance exceeds the radius there is no common point; if it is less, there are two. So a tangent is the boundary between two cases and appears at one exact distance only.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Bu ta'rif kengroq va shu bilan xato: aylanadan ANCHA nariroqda o'tgan chiziq ham uni kesib o'tmaydi, lekin u urinma emas — u aylanaga tegmaydi ham. Urinma aylanaga TEGADI, ya'ni bitta umumiy nuqtasi bor. Farqni masofa beradi: urinma uchun masofa radiusga teng, tegmaydigan chiziq uchun esa katta.",
      'Это определение шире и потому неверно: прямая, прошедшая ЗАМЕТНО в стороне от окружности, тоже её не пересекает, но касательной не является — она окружности и не касается. Касательная КАСАЕТСЯ, то есть имеет одну общую точку. Различие даёт расстояние: у касательной оно равно радиусу, у не касающейся прямой больше.',
      'This definition is wider and therefore wrong: a line passing well away from the circle does not cross it either, yet it is no tangent — it does not touch the circle at all. A tangent TOUCHES, that is, has one common point. The distance tells them apart: for a tangent it equals the radius, for a non-touching line it is greater.') },
    { when: (s) => s.picked === 2, text: L(
      "Aksincha: markazdan o'tuvchi chiziq aylanani IKKI nuqtada kesadi, va u yerda kesuvchi eng uzun vatarni — diametrni — beradi. Markazdan chiziqqacha masofa nolga teng bo'ladi, ya'ni u radiusdan kichik. Urinma esa markazdan aynan radius qadar nariroqda turadi.",
      'Наоборот: прямая через центр пересекает окружность в ДВУХ точках, и там секущая даёт самую длинную хорду — диаметр. Расстояние от центра до такой прямой равно нулю, то есть меньше радиуса. А касательная стоит от центра ровно на расстоянии радиуса.',
      'The opposite: a line through the centre crosses the circle at TWO points, and there the secant gives the longest chord — the diameter. The distance from the centre to such a line is zero, less than the radius. A tangent stands exactly one radius away from the centre.') },
    { when: (s) => s.picked === 3, text: L(
      "Radiusga parallellik urinmani aniqlamaydi: aylanada cheksiz ko'p radius bor, va ularning yo'nalishi har xil. Urinma esa aynan URINISH NUQTASIGA o'tkazilgan radiusga PERPENDIKULYAR bo'ladi — bu darsning teoremasi. Parallellik boshqa radiuslar bilan tasodifan chiqishi mumkin, lekin u ta'rif emas.",
      'Параллельность радиусу касательную не определяет: радиусов в окружности бесконечно много, и направления у них разные. А касательная ПЕРПЕНДИКУЛЯРНА радиусу, проведённому именно в точку касания — это теорема урока. Параллельность каким-то другим радиусам может выйти случайно, но определением она не является.',
      'Being parallel to a radius does not define a tangent: a circle has infinitely many radii running in all directions. A tangent is PERPENDICULAR to the radius drawn to the point of tangency — that is the theorem of the lesson. Parallelism with some other radius may happen by chance, but it is no definition.') },
  ],
  wrongText: L(
    "Ta'rif umumiy nuqtalar SONI bilan beriladi. Uch holatni sanang: nol, bitta, ikkita.",
    'Определение даётся через ЧИСЛО общих точек. Перечисли три случая: ноль, одна, две.',
    'The definition goes by the NUMBER of common points. Count the three cases: none, one, two.'),
};

export default function D50_01(props) { return <Choice data={DATA} {...props} />; }
