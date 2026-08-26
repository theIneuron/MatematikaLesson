// Dars18 · Amaliyot 09 — Pazl · 🔴 · tag: count_pairs
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §6 (18-dars, 9-pozitsiya)
//
// UCH UCHLIKDA a VA b BIR XIL, faqat c o'zgaradi: o'n olti, yetti, yigirma.
// Shuning uchun uchala D ni ham bitta yozuv beradi — oltmish to'rt minus to'rt
// karra c. Bitta son ildizlar sonini hal qiladi:
//   c = 16 → 64 − 64 = 0   → bitta ildiz (З9);
//   c = 7  → 64 − 28 = 36  → ikkita;
//   c = 20 → 64 − 80 = −16 → yo'q (З41).
// Kartalarda uchlik turadi, tenglama emas: kvadrat kartaga (telefonda 54px)
// uchlik sig'adi, tenglama esa yo'q. Formula `given` qatorida.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'count_pairs', level: '🔴',
  faceSize: 13,
  given: [['D = b² − 4ac']],
  givenLabel: L('Formula', 'Формула', 'Formula'),
  cards: [
    { id: 'f1', side: 0, v: '1; −8; 16' },
    { id: 'f2', side: 0, v: '1; −8; 7' },
    { id: 'f3', side: 0, v: '1; −8; 20' },
    { id: 'v1', side: 1, v: 'bitta' },
    { id: 'v2', side: 1, v: 'ikkita' },
    { id: 'v3', side: 1, v: "yo'q" },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "Uch uchlikda a va b bir xil, faqat ozod had o'zgaradi. Ya'ni ildizlar sonini bitta son hal qiladi.",
    'В трёх тройках a и b одинаковы, меняется только свободный член. То есть число корней решает одно число.',
    'In the three triples a and b are the same; only the constant term changes. So the number of roots is decided by a single number.'),
  ask: L(
    "Uchlikni bosing, keyin uyani bosing.",
    'Нажми тройку, потом ячейку.',
    'Tap a triple, then a slot.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Uchala uchlikda ham b kvadrati oltmish to'rt. Farq ikkinchi qo'shiluvchida: minus to'rt karra o'n olti minus oltmish to'rt, ya'ni D nol — bitta ildiz; minus to'rt karra yetti minus yigirma sakkiz, oltmish to'rt minus yigirma sakkiz o'ttiz olti — ikkita; minus to'rt karra yigirma minus sakson, oltmish to'rt minus sakson minus o'n olti — ildiz yo'q. Ozod had o'sgani sari D kamayadi.",
    'Верно. Во всех трёх тройках b в квадрате шестьдесят четыре. Разница во втором слагаемом: минус четыре на шестнадцать минус шестьдесят четыре, то есть D нуль — один корень; минус четыре на семь минус двадцать восемь, шестьдесят четыре минус двадцать восемь тридцать шесть — два; минус четыре на двадцать минус восемьдесят, шестьдесят четыре минус восемьдесят минус шестнадцать — корней нет. Чем больше свободный член, тем меньше D.',
    'Correct. In all three triples b squared is sixty four. The difference is in the second part: minus four times sixteen is minus sixty four, so D is zero — one root; minus four times seven is minus twenty eight, sixty four minus twenty eight is thirty six — two; minus four times twenty is minus eighty, sixty four minus eighty is minus sixteen — no roots. The bigger the constant term, the smaller D.'),
  wrongs: [
    { when: (s) => s.mate.f1 !== 'v1', text: L(
      "Birinchi uchlikda ikki qo'shiluvchi bir-birini yo'q qiladi: oltmish to'rt minus oltmish to'rt nol. Nol bo'lganda ildiz BOR va u bitta — bu «yo'q» degani emas. Tenglama x kvadrat minus sakkiz x qo'shuv o'n olti, ya'ni x minus to'rtning kvadrati, ildizi to'rt.",
      'В первой тройке два слагаемых уничтожают друг друга: шестьдесят четыре минус шестьдесят четыре нуль. При нуле корень ЕСТЬ и он один — это не «нет». Уравнение x квадрат минус восемь x плюс шестнадцать, то есть квадрат x минус четыре, корень четыре.',
      'In the first triple the two parts cancel: sixty four minus sixty four is zero. With zero a root EXISTS and there is one — that is not «none». The equation is x squared minus eight x plus sixteen, that is x minus four squared, root four.') },
    { when: (s) => s.mate.f3 !== 'v3', text: L(
      "Uchinchi uchlikda ozod had eng katta, va shu sababli minus to'rt a c eng katta manfiy son beradi: minus sakson. Oltmish to'rt minus sakson minus o'n olti — manfiy, demak ildiz yo'q. Ozod had o'sgani sari D kamayadi.",
      'В третьей тройке свободный член самый большой, и поэтому минус четыре a c даёт самое большое отрицательное: минус восемьдесят. Шестьдесят четыре минус восемьдесят минус шестнадцать — отрицательное, значит корней нет. Чем больше свободный член, тем меньше D.',
      'In the third triple the constant term is the largest, so minus four a c gives the largest negative: minus eighty. Sixty four minus eighty is minus sixteen — negative, so no roots. The bigger the constant term, the smaller D.') },
    { when: (s) => s.mate.f2 !== 'v2', text: L(
      "Ikkinchi uchlikda ozod had eng kichik — yetti, demak ayiriladigan son ham kichik: yigirma sakkiz. Oltmish to'rt minus yigirma sakkiz o'ttiz olti, musbat — ikki ildiz. Ular butun: to'rt plyus-minus uch, ya'ni bir va yetti.",
      'Во второй тройке свободный член самый маленький — семь, значит и вычитаемое небольшое: двадцать восемь. Шестьдесят четыре минус двадцать восемь тридцать шесть, положительное — два корня. Они целые: четыре плюс-минус три, то есть один и семь.',
      'In the second triple the constant term is the smallest — seven — so the amount subtracted is small: twenty eight. Sixty four minus twenty eight is thirty six, positive — two roots. They are whole: four plus or minus three, that is one and seven.') },
  ],
  wrongText: L(
    "Uchala uchlikda b kvadrati bir xil — oltmish to'rt. Faqat minus to'rt a c ni hisoblang va yig'indining ishorasiga qarang.",
    'Во всех трёх тройках b в квадрате одинаково — шестьдесят четыре. Посчитай только минус четыре a c и посмотри на знак суммы.',
    'In all three triples b squared is the same — sixty four. Compute only minus four a c and look at the sign of the sum.'),
};

export default function D18_09(props) { return <PairSlots data={DATA} {...props} />; }
