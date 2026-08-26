// Dars49 · Amaliyot 08 — Pazl · 🔴 · tag: chord_pairs
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §11 (49-dars, 8-pozitsiya)
//
// UCH JUFTLIK, UCH XIL IZLANADIGAN NARSA:
//   R=17, AB=30 -> d = 8     (yarim vatar 15: 289 − 225 = 64)
//   R=10, d=6   -> AB = 16   (yarim vatar 8, keyin IKKILANTIRISH)
//   d=9, AB=24  -> R = 15    (yarim vatar 12: 81 + 144 = 225 — QO'SHISH)
// Uchinchi juftlik alohida: u yerda radius izlanadi, ya'ni Pifagor tengligi
// QO'SHISH tomonga ishlaydi. Ikkinchisida esa javob yarim vatar EMAS (З104).
// Kartalarda yozuv bo'shliqsiz (telefonda karta 54px, skelet §14).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'chord_pairs', level: '🔴',
  faceSize: 12, faceSizePhone: 10,
  cards: [
    { id: 'f1', side: 0, tokens: ['R=17,AB=30'] },
    { id: 'f2', side: 0, tokens: ['R=10,d=6'] },
    { id: 'f3', side: 0, tokens: ['d=9,AB=24'] },
    { id: 'v1', side: 1, v: 'd = 8' },
    { id: 'v2', side: 1, v: 'AB = 16' },
    { id: 'v3', side: 1, v: 'R = 15' },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "Uch shartda uch xil narsa izlanadi: markazdan vatargacha masofa, vatarning uzunligi va radius. Uchala holatda ham bitta uchburchak ishlaydi: gipotenuza — radius, katetlar — masofa va vatarning yarmi.",
    'В трёх условиях ищется разное: расстояние от центра до хорды, длина хорды и радиус. Во всех трёх работает один треугольник: гипотенуза — радиус, катеты — расстояние и половина хорды.',
    'The three conditions ask for different things: the distance from the centre to the chord, the length of the chord, and the radius. One triangle works in all three: the hypotenuse is the radius, the legs are the distance and half the chord.'),
  ask: L(
    'Shartni bosing, keyin uyani bosing.',
    'Нажми условие, потом ячейку.',
    'Tap a condition, then a slot.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Birinchisida yarim vatar o'n besh, gipotenuza o'n yetti: ikki yuz sakson to'qqiz minus ikki yuz yigirma besh oltmish to'rt, ildizi sakkiz. Ikkinchisida masofa va radius berilgan: yuz minus o'ttiz olti oltmish to'rt, ildizi sakkiz — lekin bu YARIM vatar, ya'ni javob o'n olti. Uchinchisida radius izlanadi, va bu yerda kvadratlar QO'SHILADI: yarim vatar o'n ikki, sakson bir qo'shuv bir yuz qirq to'rt ikki yuz yigirma besh, ildizi o'n besh. Uch shartning farqi bitta: izlanadigan narsa gipotenuzami (qo'shish) yoki katetmi (ayirish), va javob yarim vatarmi yoki to'liq vatarmi.",
    'Верно. В первом половина хорды пятнадцать, гипотенуза семнадцать: двести восемьдесят девять минус двести двадцать пять — шестьдесят четыре, корень восемь. Во втором даны расстояние и радиус: сто минус тридцать шесть — шестьдесят четыре, корень восемь, но это ПОЛОВИНА хорды, значит ответ шестнадцать. В третьем ищется радиус, и здесь квадраты СКЛАДЫВАЮТСЯ: половина хорды двенадцать, восемьдесят один плюс сто сорок четыре — двести двадцать пять, корень пятнадцать. Различие трёх условий в одном: гипотенузу ищем (сложение) или катет (вычитание), и ответ это половина хорды или вся хорда.',
    'Correct. In the first, half the chord is fifteen and the hypotenuse seventeen: two hundred eighty nine minus two hundred twenty five is sixty four, the root eight. In the second the distance and the radius are given: one hundred minus thirty six is sixty four, the root eight — but that is HALF the chord, so the answer is sixteen. In the third the radius is sought and here the squares are ADDED: half the chord is twelve, eighty one plus one hundred forty four is two hundred twenty five, the root fifteen. One thing separates the three conditions: whether a hypotenuse (addition) or a leg (subtraction) is sought, and whether the answer is half the chord or the whole one.'),
  wrongs: [
    { when: (s) => s.mate.f2 && s.mate.f2 !== 'v2', text: L(
      "Ikkinchi shartda ildiz sakkizni beradi, lekin bu javob EMAS: sakkiz — vatarning yarmi. Markazdan tushirilgan perpendikulyar vatarni teng ikkiga bo'ladi, ya'ni to'liq vatar o'n olti. Diqqat: birinchi shartda ham sakkiz chiqadi, lekin u yerda sakkiz MASOFA, ya'ni javobning o'zi. Bir xil son ikki xil rolda.",
      'Во втором условии корень даёт восемь, но это НЕ ответ: восемь — половина хорды. Перпендикуляр из центра делит хорду пополам, значит вся хорда шестнадцать. Внимание: в первом условии тоже выходит восемь, но там восемь — РАССТОЯНИЕ, то есть сам ответ. Одно число в двух разных ролях.',
      'In the second condition the root gives eight, but that is NOT the answer: eight is half the chord. The perpendicular from the centre halves the chord, so the whole chord is sixteen. Note: eight comes out in the first condition too, but there eight is the DISTANCE, the answer itself. The same number in two different roles.') },
    { when: (s) => s.mate.f3 && s.mate.f3 !== 'v3', text: L(
      "Uchinchi shartda RADIUS izlanadi, ya'ni gipotenuza. Gipotenuza izlanganda kvadratlar QO'SHILADI: yarim vatar o'n ikki, masofa to'qqiz, sakson bir qo'shuv bir yuz qirq to'rt ikki yuz yigirma besh, ildizi o'n besh. Ayirish faqat katet izlanganda bo'ladi.",
      'В третьем условии ищется РАДИУС, то есть гипотенуза. Когда ищут гипотенузу, квадраты СКЛАДЫВАЮТСЯ: половина хорды двенадцать, расстояние девять, восемьдесят один плюс сто сорок четыре — двести двадцать пять, корень пятнадцать. Вычитание бывает только при поиске катета.',
      'The third condition asks for the RADIUS, that is, the hypotenuse. When a hypotenuse is sought the squares are ADDED: half the chord is twelve, the distance nine, eighty one plus one hundred forty four is two hundred twenty five, the root fifteen. Subtraction is only for finding a leg.') },
    { when: (s) => s.bad.length >= 2, text: L(
      "Har kartada ikki savolga javob bering. Birinchisi: izlanadigan narsa radiusmi (gipotenuza, qo'shish) yoki masofa yoki vatarmi (katet, ayirish)? Ikkinchisi: javob yarim vatarmi yoki to'liq vatarmi? Javob kartalarining harflari ham shuni aytadi.",
      'В каждой карточке ответь на два вопроса. Первый: ищется радиус (гипотенуза, сложение) или расстояние и хорда (катет, вычитание)? Второй: ответ — половина хорды или вся хорда? Буквы на карточках ответов говорят о том же.',
      'Answer two questions in every card. First: is the radius sought (a hypotenuse, addition) or a distance or chord (a leg, subtraction)? Second: is the answer half the chord or the whole one? The letters on the answer cards say the same.') },
  ],
  wrongText: L(
    "Radius izlansa qo'shing, katet izlansa ayiring. Vatar izlansa oxirida ikkilantiring.",
    'Ищешь радиус — складывай, ищешь катет — вычитай. Ищешь хорду — в конце удвой.',
    'Seeking the radius, add; seeking a leg, subtract. Seeking the chord, double at the end.'),
};

export default function D49_08(props) { return <PairSlots data={DATA} {...props} />; }
