// Dars51 · Amaliyot 01 — Yarmi · 🟢 🖼 · tag: half_of_arc
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Skelet: DARS51_55_AMALIYOT_SKELET.md §3 (51-dars, 1-pozitsiya)
//
// CHIZMA IKKI BURCHAKNI BIR KADRDA KO'RSATADI: markazdan chiqqan ikki
// radius markaziy burchakni, B uchidan chiqqan ikki vatar esa ichki
// chizilgan burchakni beradi. Ikkalasi ham O'SHA AC yoyiga tiraladi, va
// aynan shu «yarmi» degan so'zni ko'rinadigan qiladi (skelet §0a.2).
// Radiuslar siyoh rangida, vatarlar urg'u rangida: so'ralayotgan burchak
// ajralib turadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

// A 150°, C 70° — orasidagi yoy 80°. B 290° da, ya'ni KATTA yoyda: shu
// sababli ∠ABC aynan 80 graduslik yoyga tiraladi.
const CIR = {
  fig: 'circ', w: 150, h: 116, r: 45, cx: 75, cy: 56,
  chords: [{ a: 150, b: 290, names: ['A', 'B'] }, { a: 70, b: 290, names: ['C', null] }],
  radii: [150, 70],
};

const DATA = {
  tag: 'half_of_arc', level: '🟢',
  correct: 0, optCols: 2, optSize: 18,
  expr: [CIR],
  eyebrow: L('Yarmi', 'Половина', 'A half'),
  setup: L(
    "Aylanada A, B va C nuqtalari belgilangan. Markazdan A va C ga radiuslar o'tkazilgan: ular hosil qilgan markaziy burchak sakson gradusga teng, ya'ni AC yoyi ham sakson gradus. B uchidan chiqqan ikki vatar esa ichki chizilgan burchakni beradi.",
    'На окружности отмечены точки A, B и C. Из центра к A и C проведены радиусы: образованный ими центральный угол равен восьмидесяти градусам, то есть дуга AC тоже восемьдесят градусов. А две хорды из вершины B дают вписанный угол.',
    'The points A, B and C are marked on a circle. Radii are drawn from the centre to A and C: the central angle they form is eighty degrees, so the arc AC is eighty degrees too. The two chords from the vertex B give the inscribed angle.'),
  ask: L(
    'Ichki chizilgan ABC burchagi necha gradus?',
    'Чему равен вписанный угол ABC?',
    'What is the inscribed angle ABC?'),
  opts: [
    { label: ['40°'] },
    { label: ['80°'] },
    { label: ['160°'] },
    { label: ['140°'] },
  ],
  correctText: L(
    "To'g'ri. Ichki chizilgan burchak o'zi tiralgan yoyning YARMI bilan o'lchanadi. Yoy sakson, demak burchak qirq. Chizmaga qarang: markaziy burchak keng ochilgan, B dagi burchak esa ikki barobar tor — ular bir xil yoyga tiralgan bo'lsa ham.",
    'Верно. Вписанный угол измеряется ПОЛОВИНОЙ дуги, на которую опирается. Дуга восемьдесят, значит угол сорок. Посмотри на рисунок: центральный угол раскрыт широко, а угол при B вдвое уже — хотя опираются они на одну дугу.',
    'Correct. An inscribed angle is measured by HALF the arc it subtends. The arc is eighty, so the angle is forty. Look at the drawing: the central angle opens wide while the angle at B is twice as narrow — though both subtend the same arc.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Bu yoyning O'ZI, burchak emas. Sakson gradus — bu MARKAZIY burchak, ya'ni chizmadagi ikki radius orasidagi burchak. B dagi burchak esa undan ikki barobar tor. Chizmada ikkalasi yonma-yon turibdi: markazdagi ochilish B dagidan sezilarli keng. Ikkovini tenglashtirish darsning eng qimmat xatosi.",
      'Это САМА дуга, а не угол. Восемьдесят градусов — это ЦЕНТРАЛЬНЫЙ угол, то есть угол между двумя радиусами на рисунке. А угол при B вдвое уже. На рисунке они рядом: раскрытие в центре заметно шире, чем при B. Приравнять их — самая дорогая ошибка урока.',
      'This is the arc ITSELF, not the angle. Eighty degrees is the CENTRAL angle, that is, the angle between the two radii in the drawing. The angle at B is twice as narrow. Both are side by side in the drawing: the opening at the centre is noticeably wider than at B. Equating them is the costliest error of the lesson.') },
    { when: (s) => s.picked === 2, text: L(
      "Bu yoyning ikkilangani. Amal teskari tomonga ketdi: burchak yoyning yarmi, yoy esa burchakning ikkilangani. Sakson gradusdan qirq chiqadi, bir yuz oltmish emas. Tekshirish oson: ichki chizilgan burchak bir yuz sakson gradusdan katta bo'lolmaydi, chunki hech qanday yoy uch yuz oltmishdan oshmaydi.",
      'Это дуга, умноженная на два. Действие пошло в обратную сторону: угол — половина дуги, а дуга — удвоенный угол. Из восьмидесяти получается сорок, а не сто шестьдесят. Проверить легко: вписанный угол не бывает больше ста восьмидесяти градусов, ведь никакая дуга не превосходит трёхсот шестидесяти.',
      'This is the arc doubled. The operation went the wrong way: the angle is half the arc, and the arc is the doubled angle. Eighty gives forty, not a hundred and sixty. An easy check: an inscribed angle is never more than a hundred and eighty degrees, since no arc exceeds three hundred and sixty.') },
    { when: (s) => s.picked === 3, text: L(
      "Bu ikkinchi yoyning yarmi. Aylanada AC ikki yoy hosil qiladi: kichigi sakson gradus, kattasi esa uch yuz oltmishdan sakson ayirilgani — ikki yuz sakson, uning yarmi bir yuz qirq. Lekin B nuqtasi aynan KATTA yoyda turibdi, ya'ni burchak KICHIK yoyga tiraladi. Tiralgan yoy — uchdan qarama-qarshi tomondagisi.",
      'Это половина второй дуги. Точки A и C делят окружность на две дуги: меньшая восемьдесят градусов, большая — триста шестьдесят минус восемьдесят, то есть двести восемьдесят, её половина сто сорок. Но точка B лежит как раз на БОЛЬШОЙ дуге, значит угол опирается на МЕНЬШУЮ. Дуга, на которую опираются, — противоположная вершине.',
      'This is half of the other arc. A and C split the circle into two arcs: the smaller is eighty degrees, the larger is three hundred and sixty minus eighty, that is two hundred and eighty, whose half is a hundred and forty. But the point B lies on the LARGER arc, so the angle subtends the SMALLER one. The subtended arc is the one opposite the vertex.') },
  ],
  wrongText: L(
    "Ichki chizilgan burchak yoyning yarmi. Chizmada markaziy burchak keng, B dagi burchak esa ikki barobar tor.",
    'Вписанный угол — половина дуги. На рисунке центральный угол широкий, а угол при B вдвое уже.',
    'An inscribed angle is half the arc. In the drawing the central angle is wide and the angle at B is twice as narrow.'),
};

export default function D51_01(props) { return <Choice data={DATA} {...props} />; }
