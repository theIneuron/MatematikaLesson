// Dars08 · Amaliyot 05 — Ha yoki yo'q · 🟡 · tag: root_claims · CHIZMALI
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS07_11_AMALIYOT_SKELET.md §6 (8-dars, 5-pozitsiya), §4a
//
// Ikki mulohaza — ikki adashish:
//   s1  З4: ildiz hadlarga bo'lib chiqarildi (to'qqiz qo'shuv o'n olti);
//   s2  З5: kvadratdan modul chiqadi, sonning o'zi emas.
//
// YOZUV USTIDA CHIZMA (metodist qarori 2026-08-24): son o'qida minus yetti
// va yetti noldan BIR XIL masofada turadi. Modul — aynan shu masofa, va
// ikkinchi mulohaza shu chizma bilan tekshiriladi. Chizma javobni aytmaydi:
// birinchi mulohaza umuman boshqa narsa haqida.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'root_claims', level: '🟡',
  itemSize: 17,
  given: [[{
    fig: 'axis', from: -8, to: 8, step: 2, w: 300, h: 48,
    marks: [{ at: -7, label: '−7' }, { at: 7, label: '7' }],
  }]],
  givenLabel: L('Noldan masofa', 'Расстояние от нуля', 'Distance from zero'),
  items: [
    { id: 's1', tokens: [{ r: '9 + 16' }, '=', '3 + 4'], yes: false,
      claim: L("tenglik to'g'ri", 'равенство верно', 'the equality is true') },
    { id: 's2', tokens: [{ r: '(−7)²' }, '=', '7'], yes: true,
      claim: L("tenglik to'g'ri", 'равенство верно', 'the equality is true') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "Ikki tenglik. Ildizning ustki chizig'i qaysi ifoda ildiz ostida turganini ko'rsatadi.",
    'Два равенства. Черта над корнем показывает, какое выражение стоит под корнем.',
    'Two equalities. The bar over the root shows which expression stands under it.'),
  ask: L(
    "Tenglik to'g'ri bo'lsa «Ha» ni, noto'g'ri bo'lsa «Yo'q» ni bosing.",
    'Если равенство верно — нажми «Да», если нет — «Нет».',
    'Tap «Yes» if the equality is true, «No» if it is not.'),
  correctText: L(
    "To'g'ri. Birinchisida chiziq ostida YIG'INDI turadi: avval to'qqiz qo'shuv o'n olti yigirma besh, keyin ildiz — besh. O'ng tomonda esa yetti. Besh yettiga teng emas, demak ildizni hadlarga bo'lib chiqarib bo'lmaydi. Ikkinchisida ildiz ostida minus yettining kvadrati, ya'ni qirq to'qqiz, uning ildizi esa yetti — chizmada ko'rinib turgani ham shu: minus yetti noldan yetti qadam uzoqda.",
    'Верно. В первом под чертой стоит СУММА: сначала девять плюс шестнадцать двадцать пять, потом корень — пять. Справа же семь. Пять не равно семи, значит корень нельзя раздать по слагаемым. Во втором под корнем квадрат минус семи, то есть сорок девять, а его корень семь — это и видно на чертеже: минус семь стоит в семи шагах от нуля.',
    'Correct. In the first a SUM stands under the bar: nine plus sixteen is twenty five, then the root is five. On the right stands seven. Five is not seven, so a root cannot be distributed over the terms. In the second the square of minus seven is under the root, that is forty nine, whose root is seven — exactly what the plot shows: minus seven stands seven steps from zero.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Birinchi tenglikda ustki chiziq YIG'INDINING ustida turadi, ya'ni avval qo'shish bajariladi. To'qqiz qo'shuv o'n olti yigirma besh, ildizi besh. Uch qo'shuv to'rt esa yetti. Ildizni hadlarga bo'lib chiqarish har doim boshqa son beradi.",
      'В первом равенстве черта стоит над СУММОЙ, то есть сначала выполняется сложение. Девять плюс шестнадцать двадцать пять, корень пять. А три плюс четыре семь. Раздать корень по слагаемым всегда даёт другое число.',
      'In the first equality the bar stands over the SUM, so the addition comes first. Nine plus sixteen is twenty five and its root is five. Three plus four is seven. Distributing a root over the terms always gives a different number.') },
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Ikkinchi tenglikda ildiz ostida KVADRAT turadi: minus yetti karra minus yetti qirq to'qqiz, va qirq to'qqizning ildizi yetti. Arifmetik ildiz manfiy bo'lmaydi, shuning uchun javob minus yetti emas. Chizmaga qarang: ikki son ham noldan bir xil masofada, ildiz esa shu masofani beradi.",
      'Во втором равенстве под корнем КВАДРАТ: минус семь на минус семь сорок девять, а корень сорока девяти семь. Арифметический корень не бывает отрицательным, поэтому ответ не минус семь. Посмотри на чертёж: оба числа на одном расстоянии от нуля, и корень даёт именно это расстояние.',
      'In the second equality a SQUARE stands under the root: minus seven times minus seven is forty nine, and the root of forty nine is seven. An arithmetic root is never negative, so the answer is not minus seven. Look at the plot: both numbers are the same distance from zero, and the root gives that distance.') },
  ],
  wrongText: L(
    "Har tenglikda avval ustki chiziq ostidagi ifodani hisoblang, keyin ildiz oling. Tartibni buzmaslik kerak.",
    'В каждом равенстве сначала посчитай то, что под чертой, потом бери корень. Порядок менять нельзя.',
    'In each equality first compute what is under the bar, then take the root. The order must not be changed.'),
};

export default function D08_05(props) { return <TrueFalse data={DATA} {...props} />; }
