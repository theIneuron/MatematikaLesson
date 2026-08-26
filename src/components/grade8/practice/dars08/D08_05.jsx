// Dars08 · Amaliyot 05 — Ha yoki yo'q · 🟡 · tag: root_claims · CHIZMALI
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS07_11_AMALIYOT_SKELET.md §6 (8-dars, 5-pozitsiya), §4a
//
// Ikki mulohaza — ikki adashish, IKKALA JAVOB HAM «HA» (metodist qarori
// 2026-08-25: ha-yo'q topshiriqlarida javob naqshi bo'lmasin, kombinatsiya
// darsdan darsga o'zgaradi — DARS07_11_AMALIYOT_SKELET.md §10 p. 9):
//   s1  З4: tenglik TO'G'RI, lekin ildizni hadlarga bo'lib chiqargan o'quvchi
//       uch qo'shuv to'rt, ya'ni yettini oladi va «yo'q» deb bosadi;
//   s2  З5: kvadratdan modul chiqadi, sonning o'zi emas — tenglik ham to'g'ri.
// Ya'ni ikki adashish ham «yo'q» javobiga olib boradi, to'g'ri yo'l esa
// ikki marta «ha» ga.
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
    { id: 's1', tokens: [{ r: '9 + 16' }, '= 5'], yes: true,
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
    "To'g'ri. Ikki tenglik ham rost. Birinchisida ustki chiziq YIG'INDINING ustida turadi: avval to'qqiz qo'shuv o'n olti yigirma besh, keyin ildiz — besh. Ildizni hadlarga bo'lib chiqarganda esa uch qo'shuv to'rt, ya'ni yetti chiqardi — boshqa son, va aynan shu joyda ko'p adashadi. Ikkinchisida ildiz ostida minus yettining kvadrati, ya'ni qirq to'qqiz, uning ildizi yetti — chizmada ko'rinib turgani ham shu: minus yetti noldan yetti qadam uzoqda.",
    'Верно. Оба равенства верны. В первом черта стоит над СУММОЙ: сначала девять плюс шестнадцать двадцать пять, потом корень — пять. А если раздать корень по слагаемым, выйдет три плюс четыре, то есть семь — другое число, и именно здесь чаще всего ошибаются. Во втором под корнем квадрат минус семи, то есть сорок девять, а его корень семь — это и видно на чертеже: минус семь стоит в семи шагах от нуля.',
    'Correct. Both equalities are true. In the first the bar stands over the SUM: nine plus sixteen is twenty five, then the root is five. Distributing the root over the terms would give three plus four, that is seven — a different number, and that is where most mistakes happen. In the second the square of minus seven is under the root, that is forty nine, whose root is seven — exactly what the plot shows: minus seven stands seven steps from zero.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Birinchi tenglik rost. Ustki chiziq YIG'INDINING ustida turadi, ya'ni avval qo'shish bajariladi: to'qqiz qo'shuv o'n olti yigirma besh, yigirma beshning ildizi besh. Agar ildizni har hadga alohida bergan bo'lsangiz, uch qo'shuv to'rt, ya'ni yetti chiqadi — ildiz hadlarga bo'linmaydi.",
      'Первое равенство верно. Черта стоит над СУММОЙ, значит сначала выполняется сложение: девять плюс шестнадцать двадцать пять, корень из двадцати пяти пять. Если же ты дал корень каждому слагаемому по отдельности, выйдет три плюс четыре, то есть семь — корень по слагаемым не раздаётся.',
      'The first equality is true. The bar stands over the SUM, so the addition comes first: nine plus sixteen is twenty five and the root of twenty five is five. If you gave the root to each term separately you got three plus four, that is seven — a root does not distribute over terms.') },
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
