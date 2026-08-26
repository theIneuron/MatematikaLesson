// Dars43 · Amaliyot 06 — Pazl · 🟡 · tag: midline_back
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §5 (43-dars, 6-pozitsiya)
//
// UCH JUFTLIK, UCH BOSHQA ISH:
//   AC=14   -> MN=7    (uchburchak, to'g'ri yo'l: yarmi)
//   MN=4    -> AC=8    (uchburchak, teskari yo'l: ikkilantirish)
//   a=6,b=10 -> m=8    (trapetsiya: yig'indining yarmi)
// Kartaning SHAKLI qaysi qoida ekanini aytadi: bitta uzunlik — uchburchak,
// ikki asos — trapetsiya. Bu ajratish 43-darsning asosiy ishi.
// Kartalarda yozuv bo'shliqsiz (telefonda karta 54px, skelet §14).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'midline_back', level: '🟡',
  faceSize: 13, faceSizePhone: 11,
  cards: [
    { id: 'f1', side: 0, tokens: ['AC=14'] },
    { id: 'f2', side: 0, tokens: ['MN=4'] },
    { id: 'f3', side: 0, tokens: ['a=6,b=10'] },
    { id: 'v1', side: 1, v: 'MN=7' },
    { id: 'v2', side: 1, v: 'AC=8' },
    { id: 'v3', side: 1, v: 'm=8' },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "Oltita karta: uchtasida shart, uchtasida natija. Ikki shart uchburchak haqida (uchinchi tomon AC va o'rta chiziq MN), bittasi trapetsiya haqida (asoslar a va b, o'rta chiziq m).",
    'Шесть карточек: в трёх условие, в трёх результат. Два условия про треугольник (третья сторона AC и средняя линия MN), одно про трапецию (основания a и b, средняя линия m).',
    'Six cards: three hold a condition, three a result. Two conditions are about a triangle (the third side AC and the midline MN), one about a trapezoid (the bases a and b and the midline m).'),
  ask: L(
    'Shartni bosing, keyin uyani bosing.',
    'Нажми условие, потом ячейку.',
    'Tap a condition, then a slot.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Uchta shart uch xil ish talab qiladi. Birinchisida uchinchi tomon berilgan, o'rta chiziq esa uning yarmi: o'n to'rtning yarmi yetti. Ikkinchisida yo'nalish teskari — o'rta chiziq berilgan, tomon esa uning ikki barobari: to'rt karra ikki sakkiz. Uchinchisi boshqa figurada: trapetsiyada o'rta chiziq ikki asosning yig'indisining yarmiga teng, ya'ni olti qo'shuv o'n o'n olti, yarmi sakkiz. Diqqat qiladigan joy: uchburchakda BITTA uzunlik bilan ishlaymiz, trapetsiyada IKKITA bilan — kartadagi harflar shuni aytadi.",
    'Верно. Три условия требуют трёх разных действий. В первом дана третья сторона, а средняя линия её половина: половина четырнадцати семь. Во втором направление обратное — дана средняя линия, а сторона вдвое больше: четыре на два — восемь. Третье в другой фигуре: в трапеции средняя линия равна половине суммы оснований, то есть шесть плюс десять — шестнадцать, половина восемь. На что стоит обратить внимание: в треугольнике мы работаем с ОДНОЙ длиной, в трапеции с ДВУМЯ — об этом и говорят буквы в карточке.',
    'Correct. The three conditions call for three different actions. The first gives the third side, and the midline is half of it: half of fourteen is seven. The second runs backwards — the midline is given and the side is twice as much: four times two is eight. The third is in another figure: in a trapezoid the midline equals half the sum of the bases, so six plus ten is sixteen, half is eight. Worth noticing: in a triangle we work with ONE length, in a trapezoid with TWO — the letters on the card say which.'),
  wrongs: [
    { when: (s) => s.mate.f1 === 'v2' || s.mate.f2 === 'v1', text: L(
      "Bu ikki shart bir-biriga teskari, va ular almashib ketdi. Kartadagi harfga qarang: AC berilgan bo'lsa, u UCHINCHI TOMON va javob uning yarmi bo'ladi; MN berilgan bo'lsa, u O'RTA CHIZIQ va javob ikki barobar bo'ladi. O'n to'rtning yarmi yetti, to'rtning ikki barobari sakkiz.",
      'Эти два условия обратны друг другу, и они поменялись местами. Смотри на букву в карточке: если дано AC, это ТРЕТЬЯ СТОРОНА и ответ её половина; если дано MN, это СРЕДНЯЯ ЛИНИЯ и ответ вдвое больше. Половина четырнадцати семь, двойное четыре — восемь.',
      'These two conditions are the reverse of each other, and they were swapped. Look at the letter on the card: if AC is given it is the THIRD SIDE and the answer is half of it; if MN is given it is the MIDLINE and the answer is twice as much. Half of fourteen is seven, twice four is eight.') },
    { when: (s) => s.mate.f3 && s.mate.f3 !== 'v3', text: L(
      "Uchinchi kartada IKKI uzunlik berilgan, ya'ni bu trapetsiya. U yerda o'rta chiziq bir tomonning yarmi emas, ikki ASOSNING yig'indisining yarmi: olti qo'shuv o'n ning yarmi sakkiz. Uchburchakning qoidasi bu yerda ishlamaydi.",
      'В третьей карточке даны ДВЕ длины, значит это трапеция. Там средняя линия не половина одной стороны, а половина суммы двух ОСНОВАНИЙ: половина от шести плюс десять — восемь. Правило треугольника здесь не работает.',
      'The third card gives TWO lengths, so it is a trapezoid. There the midline is not half of one side but half the sum of the two BASES: half of six plus ten is eight. The triangle rule does not work here.') },
    { when: (s) => s.bad.length >= 2, text: L(
      "Har kartada avval FIGURANI aniqlang, keyin YO'NALISHNI. Bitta uzunlik va AC harfi — uchburchak, to'g'ri yo'l. Bitta uzunlik va MN harfi — uchburchak, teskari yo'l. Ikki asos — trapetsiya.",
      'В каждой карточке сначала определи ФИГУРУ, потом НАПРАВЛЕНИЕ. Одна длина и буквы AC — треугольник, прямой путь. Одна длина и буквы MN — треугольник, обратный путь. Два основания — трапеция.',
      'In every card first identify the FIGURE, then the DIRECTION. One length with the letters AC is a triangle going forward. One length with MN is a triangle going backwards. Two bases mean a trapezoid.') },
  ],
  wrongText: L(
    "Kartadagi harflarni o'qing: AC — tomon, MN va m — o'rta chiziq, a va b — trapetsiyaning asoslari.",
    'Читай буквы в карточке: AC — сторона, MN и m — средняя линия, a и b — основания трапеции.',
    'Read the letters on the card: AC is a side, MN and m are midlines, a and b are the bases of a trapezoid.'),
};

export default function D43_06(props) { return <PairSlots data={DATA} {...props} />; }
