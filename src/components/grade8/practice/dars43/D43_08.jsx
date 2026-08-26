// Dars43 · Amaliyot 08 — Guruhlar · 🔴 · tag: midline_groups
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §5 (43-dars, 8-pozitsiya)
//
// IKKI QOIDA BITTA JADVALDA. Kartada bitta uzunlik bo'lsa — uchburchak
// (o'rta chiziq tomonning yarmi), ikkita bo'lsa — trapetsiya (o'rta chiziq
// asoslar yig'indisining yarmi). O'quvchi avval QAYSI qoida ekanini
// aniqlashi, keyingina hisoblashi kerak.
//
// З90 shu yerda tutiladi: yarimni tashlab ketgan o'quvchi `AC=12` ni o'n ikki
// deb baholaydi va guruh izlaydi — bunday guruh yo'q.
// Kartalarda faqat BELGI turadi (skelet §0a.4).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'midline_groups', level: '🔴',
  zoneLbl: 104, zoneSize: 18, itemSize: 14,
  zones: [
    { id: 'z1', tokens: ['= 6'] },
    { id: 'z2', tokens: ['= 9'] },
  ],
  items: [
    { id: 'i1', tokens: ['AC=12'], zone: 'z1' },
    { id: 'i2', tokens: ['AC=18'], zone: 'z2' },
    { id: 'i3', tokens: ['a=5, b=7'], zone: 'z1' },
    { id: 'i4', tokens: ['a=6, b=12'], zone: 'z2' },
    { id: 'i5', tokens: ['a=1, b=11'], zone: 'z1' },
    { id: 'i6', tokens: ['a=8, b=10'], zone: 'z2' },
    { id: 'i7', tokens: ['a=4, b=8'], zone: 'z1' },
    { id: 'i8', tokens: ['a=3, b=15'], zone: 'z2' },
  ],
  eyebrow: L('Guruhlar', 'Группы', 'Groups'),
  setup: L(
    "Sakkiz karta, har birida o'rta chiziq izlanadi. Kartada bitta uzunlik bo'lsa, bu uchburchakning uchinchi tomoni; ikki uzunlik bo'lsa, bu trapetsiyaning asoslari. Ikki holatda qoida boshqa.",
    'Восемь карточек, в каждой ищется средняя линия. Если в карточке одна длина, это третья сторона треугольника; если две — это основания трапеции. В двух случаях правило разное.',
    'Eight cards, each asking for the midline. One length on a card means the third side of a triangle; two lengths mean the bases of a trapezoid. The rule differs in the two cases.'),
  ask: L('Kartani bosing, keyin uning guruhini bosing.', 'Нажми карточку, потом её группу.', 'Tap a card, then tap its group.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Ikki qoida ikki xil ko'rinadi, lekin ularning ichida bitta ish bor: YARMINI olish. Uchburchakda bitta tomonning yarmi olinadi — o'n ikkining yarmi olti, o'n sakkizning yarmi to'qqiz. Trapetsiyada esa avval ikki asos qo'shiladi, keyin yarmi olinadi — besh qo'shuv yetti o'n ikki, yarmi olti; sakkiz qo'shuv o'n o'n sakkiz, yarmi to'qqiz. Ya'ni uchburchakning uchinchi tomoni trapetsiyaning asoslar YIG'INDISI bilan bir xil rol o'ynaydi.",
    'Верно. Два правила выглядят по-разному, но внутри у них одно действие: взять ПОЛОВИНУ. В треугольнике берётся половина одной стороны — половина двенадцати шесть, половина восемнадцати девять. А в трапеции сначала складываются два основания, потом берётся половина — пять плюс семь двенадцать, половина шесть; восемь плюс десять восемнадцать, половина девять. То есть третья сторона треугольника играет ту же роль, что СУММА оснований трапеции.',
    'Correct. The two rules look different, but inside them is one action: take HALF. In a triangle you halve one side — half of twelve is six, half of eighteen is nine. In a trapezoid the two bases are added first and then halved — five plus seven is twelve, half is six; eight plus ten is eighteen, half is nine. So the third side of a triangle plays the same role as the SUM of the bases of a trapezoid.'),
  wrongs: [
    { when: (s) => s.place.i1 === 'z2' || s.place.i2 === 'z1', text: L(
      "Bu ikki kartada bitta uzunlik berilgan, ya'ni ular uchburchak haqida va javob yarmi bo'ladi: o'n ikkining yarmi olti, o'n sakkizning yarmi to'qqiz. Ikkalasi almashib ketdi.",
      'В этих двух карточках дана одна длина, значит они про треугольник и ответ — половина: половина двенадцати шесть, половина восемнадцати девять. Они поменялись местами.',
      'These two cards give one length, so they are about a triangle and the answer is the half: half of twelve is six, half of eighteen is nine. The two were swapped.') },
    { when: (s) => s.place.i3 === 'z2' || s.place.i5 === 'z2' || s.place.i7 === 'z2', text: L(
      "Bu kartalarda ikki asosning yig'indisi o'n ikki chiqadi, yarmi esa olti. Besh qo'shuv yetti, bir qo'shuv o'n bir, to'rt qo'shuv sakkiz — uchtasida ham o'n ikki. Asoslarning o'zi turlicha bo'lsa ham, o'rta chiziq bir xil.",
      'В этих карточках сумма двух оснований равна двенадцати, а половина шесть. Пять плюс семь, один плюс одиннадцать, четыре плюс восемь — везде двенадцать. Сами основания разные, а средняя линия одна.',
      'In these cards the sum of the two bases is twelve and half of it is six. Five plus seven, one plus eleven, four plus eight — twelve in each. The bases differ, yet the midline is the same.') },
    { when: (s) => s.place.i4 === 'z1' || s.place.i6 === 'z1' || s.place.i8 === 'z1', text: L(
      "Bu kartalarda yig'indi o'n sakkiz, yarmi to'qqiz. Olti qo'shuv o'n ikki, sakkiz qo'shuv o'n, uch qo'shuv o'n besh — uchtasida ham o'n sakkiz. Bitta asosga qarab hukm qilib bo'lmaydi: ikkisini ham qo'shish kerak.",
      'В этих карточках сумма восемнадцать, половина девять. Шесть плюс двенадцать, восемь плюс десять, три плюс пятнадцать — везде восемнадцать. По одному основанию судить нельзя: складывать надо оба.',
      'In these cards the sum is eighteen and half of it is nine. Six plus twelve, eight plus ten, three plus fifteen — eighteen in each. One base alone cannot decide: both must be added.') },
    { when: (s) => s.bad.length >= 4, text: L(
      "Har kartada ikki qadam: qaysi figura ekanini aniqlash, keyin hisoblash. Bitta uzunlik — yarmini oling. Ikki uzunlik — qo'shib, keyin yarmini oling. Ikki holatda ham javob YARIM bo'ladi, yig'indi yoki tomonning o'zi emas.",
      'В каждой карточке два шага: определить фигуру, потом посчитать. Одна длина — возьми половину. Две длины — сложи, потом возьми половину. В обоих случаях ответ — ПОЛОВИНА, а не сумма и не сама сторона.',
      'Two steps in every card: identify the figure, then compute. One length — take the half. Two lengths — add them, then take the half. In both cases the answer is the HALF, not the sum and not the side itself.') },
  ],
  wrongText: L(
    "Bitta uzunlik — uchburchak, ikkita — trapetsiya. Ikki holatda ham oxirida yarmi olinadi.",
    'Одна длина — треугольник, две — трапеция. В обоих случаях в конце берётся половина.',
    'One length means a triangle, two mean a trapezoid. In both cases the half is taken at the end.'),
};

export default function D43_08(props) { return <Zones data={DATA} {...props} />; }
