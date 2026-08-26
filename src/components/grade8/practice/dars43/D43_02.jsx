// Dars43 · Amaliyot 02 — Test · 🟢 · tag: thales_condition
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §5 (43-dars, 2-pozitsiya)
//
// З89: Falyes teoremasi PARALLELLIKKA tayanadi, va bu shart tekshirilmasa
// teorema qo'llanmaydi. Uch xato variant uch xil chalkashlik: chiziqlarning
// uzunligi, KESUVCHILARNING parallelligi (aslida parallel bo'lishi kerak
// bo'lgan narsa boshqa), perpendikulyarlik.
// `Choice` ning variantlari SO'Z, ya'ni `tr()` dan o'tadi (skelet §0a.4).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'thales_condition', level: '🟢',
  correct: 0, optCols: 1, optSize: 13,
  eyebrow: L('Test', 'Тест', 'Test'),
  setup: L(
    "Falyes teoremasi ikki kesuvchi va ularni kesib o'tuvchi chiziqlar haqida. Teorema bir kesuvchidagi teng kesmalardan ikkinchi kesuvchidagi teng kesmalarga o'tish imkonini beradi, lekin buning uchun bitta shart bajarilishi kerak.",
    'Теорема Фалеса о двух секущих и пересекающих их прямых. Теорема позволяет перейти от равных отрезков на одной секущей к равным отрезкам на другой, но для этого должно выполняться одно условие.',
    'The Thales theorem is about two transversals and the lines that cross them. It lets you pass from equal segments on one transversal to equal segments on the other, but one condition must hold for that.'),
  ask: L(
    "Falyes teoremasini qo'llash uchun nima shart?",
    'Что требуется, чтобы применить теорему Фалеса?',
    'What is required to apply the Thales theorem?'),
  opts: [
    { label: L("chiziqlar parallel bo'lishi",
      'чтобы прямые были параллельны друг другу', 'that the lines be parallel') },
    { label: L("chiziqlar teng uzunlikda bo'lishi",
      'чтобы прямые были равной длины', 'that the lines be of equal length') },
    { label: L("kesuvchilar parallel bo'lishi",
      'чтобы секущие были параллельны', 'that the transversals be parallel') },
    { label: L("kesuvchilar perpendikulyar bo'lishi",
      'чтобы секущие были перпендикулярны', 'that the transversals be perpendicular') },
  ],
  correctText: L(
    "To'g'ri. Teoremaning ishlashi PARALLELLIKKA tayanadi: teng kesmalar bir kesuvchidan ikkinchisiga o'tishi uchun ularni ajratayotgan chiziqlar parallel bo'lishi kerak. Parallellik buzilishi bilan xulosa ham buziladi — chiziqlar bir-biriga qiyalasa, ikkinchi kesuvchida kesmalar turli uzunlikda chiqadi. Kesuvchilarning o'zi esa istalgan yo'nalishda bo'lishi mumkin: teorema ular haqida hech narsa talab qilmaydi, faqat ularni kesib o'tuvchi chiziqlar haqida.",
    'Верно. Работа теоремы опирается на ПАРАЛЛЕЛЬНОСТЬ: чтобы равные отрезки перешли с одной секущей на другую, отсекающие их прямые должны быть параллельны. Стоит параллельности нарушиться — нарушается и вывод: если прямые наклонены друг к другу, на второй секущей отрезки выйдут разной длины. А сами секущие могут идти в любом направлении: о них теорема ничего не требует, только о пересекающих их прямых.',
    'Correct. The theorem rests on PARALLELISM: for equal segments to pass from one transversal to the other, the lines cutting them off must be parallel. Break the parallelism and the conclusion breaks: if the lines lean towards each other, the segments on the second transversal come out unequal. The transversals themselves may run in any direction: the theorem demands nothing of them, only of the lines crossing them.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Chiziqlarning uzunligi hech narsani hal qilmaydi: to'g'ri chiziq ikki tomonga cheksiz davom etadi, ya'ni uning «uzunligi» degan narsa yo'q. Teoremada ahamiyatli narsa faqat yo'nalish — chiziqlar bir-biriga parallel bo'lishi.",
      'Длина прямых ничего не решает: прямая продолжается в обе стороны без конца, то есть никакой «длины» у неё нет. В теореме важно только направление — чтобы прямые были параллельны друг другу.',
      'The length of the lines settles nothing: a line runs on without end in both directions, so it has no length at all. Only direction matters in the theorem — that the lines be parallel to each other.') },
    { when: (s) => s.picked === 2, text: L(
      "Bu yerda parallel bo'lishi kerak bo'lgan narsa almashib ketdi. Kesuvchilar teoremaning ISHIDA emas, ular shunchaki ikki yo'l: birinchisida teng kesmalar berilgan, ikkinchisida ular izlanadi. Kesuvchilar parallel bo'lsa, ular umuman kesishmasdi va teoremaning sahnasi buzilardi. Parallel bo'lishi kerak — ularni KESIB O'TUVCHI chiziqlar.",
      'Здесь перепутано, что именно должно быть параллельным. Секущие не участвуют в работе теоремы, они просто два пути: на первом равные отрезки даны, на втором их ищут. Будь секущие параллельны, они бы вовсе не пересекались, и сцена теоремы рассыпалась бы. Параллельными должны быть ПЕРЕСЕКАЮЩИЕ их прямые.',
      'Here it is mixed up what has to be parallel. The transversals do not take part in the work of the theorem; they are simply two paths: on the first the equal segments are given, on the second they are sought. Were the transversals parallel they would never meet, and the setting of the theorem would fall apart. What must be parallel are the lines CROSSING them.') },
    { when: (s) => s.picked === 3, text: L(
      "Perpendikulyarlik shart emas: kesuvchilar istalgan burchak ostida kesishishi mumkin, xulosa esa o'zgarmaydi. Teoremaning yagona sharti — kesib o'tuvchi chiziqlarning parallelligi.",
      'Перпендикулярность не требуется: секущие могут пересекаться под любым углом, а вывод не изменится. Единственное условие теоремы — параллельность пересекающих прямых.',
      'Perpendicularity is not required: the transversals may meet at any angle and the conclusion stays. The theorem has one condition only — that the crossing lines be parallel.') },
  ],
  wrongText: L(
    "Teoremada NIMA parallel bo'lishi kerakligini aniqlang: kesuvchilar emas, ularni kesib o'tuvchi chiziqlar.",
    'Определи, ЧТО именно должно быть параллельным: не секущие, а пересекающие их прямые.',
    'Work out WHAT has to be parallel: not the transversals but the lines crossing them.'),
};

export default function D43_02(props) { return <Choice data={DATA} {...props} />; }
