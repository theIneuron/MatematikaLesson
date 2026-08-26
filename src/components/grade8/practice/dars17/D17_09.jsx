// Dars17 · Amaliyot 09 — Pazl · 🔴 · tag: D_pairs
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §5 (17-dars, 9-pozitsiya)
//
// KARTALARDA KOEFFITSIYENTLARNING UCHLIGI TURADI, tenglama emas: kvadrat
// kartaga (telefonda 54px) «x² + 2x − 8 = 0» sig'maydi, «1; 2; −8» esa
// sig'adi. Formula `given` qatorida.
//
// Uch juftlik uch narsani ko'rsatadi:
//   1; 2; −8  → 4 + 32 = 36  — c MANFIY bo'lganda D KATTALASHADI;
//   1; −2; 5  → 4 − 20 = −16 — b manfiy, lekin kvadrati musbat: ishora D ga
//                              ta'sir qilmaydi;
//   1; 4; 4   → 16 − 16 = 0  — to'la kvadrat, D nolga teng.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'D_pairs', level: '🔴',
  faceSize: 13,
  given: [['D = b² − 4ac']],
  givenLabel: L('Formula', 'Формула', 'Formula'),
  cards: [
    { id: 'f1', side: 0, v: '1; 2; −8' },
    { id: 'f2', side: 0, v: '1; −2; 5' },
    { id: 'f3', side: 0, v: '1; 4; 4' },
    { id: 'v1', side: 1, v: '36' },
    { id: 'v2', side: 1, v: '−16' },
    { id: 'v3', side: 1, v: '0' },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "Kartalarda koeffitsiyentlar uchligi turadi: a, b, c shu tartibda. Har uchlikning diskriminanti hisoblanadi va o'z qiymati bilan juftlanadi.",
    'На карточках стоят тройки коэффициентов: a, b, c в этом порядке. Для каждой тройки считается дискриминант и находится своя пара.',
    'The cards hold triples of coefficients: a, b, c in that order. Compute the discriminant of each triple and pair it with its value.'),
  ask: L(
    "Uchlikni bosing, keyin uyani bosing.",
    'Нажми тройку, потом ячейку.',
    'Tap a triple, then a slot.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Birinchisi: ikkining kvadrati to'rt, minus to'rt karra bir karra minus sakkiz ARTI o'ttiz ikki — c manfiy bo'lganda D kattalashadi; to'rt qo'shuv o'ttiz ikki o'ttiz olti. Ikkinchisi: minus ikkining kvadrati ham to'rt — b ning ishorasi D ga ta'sir qilmaydi, chunki u kvadratga oshadi; to'rt minus yigirma minus o'n olti. Uchinchisi: o'n olti minus o'n olti nol, ya'ni uchhad to'la kvadrat — x qo'shuv ikkining kvadrati.",
    'Верно. Первая: два в квадрате четыре, минус четыре на один на минус восемь ПЛЮС тридцать два — при отрицательном c дискриминант растёт; четыре плюс тридцать два тридцать шесть. Вторая: минус два в квадрате тоже четыре — знак b на D не влияет, ведь он возводится в квадрат; четыре минус двадцать минус шестнадцать. Третья: шестнадцать минус шестнадцать нуль, то есть трёхчлен полный квадрат — квадрат x плюс два.',
    'Correct. First: two squared is four, minus four times one times minus eight is PLUS thirty two — a negative c makes D bigger; four plus thirty two is thirty six. Second: minus two squared is four as well — the sign of b does not affect D, since b is squared; four minus twenty is minus sixteen. Third: sixteen minus sixteen is zero, so the trinomial is a perfect square — x plus two squared.'),
  wrongs: [
    { when: (s) => s.mate.f1 !== 'v1', text: L(
      "Birinchi uchlikda c MANFIY, va shu sababli minus to'rt a c ARTI chiqadi: minus to'rt karra bir minus to'rt, minus to'rt karra minus sakkiz arti o'ttiz ikki. To'rt qo'shuv o'ttiz ikki o'ttiz olti — bu uchta qiymatning eng kattasi. Manfiy ozod had diskriminantni har doim kattalashtiradi.",
      'В первой тройке c ОТРИЦАТЕЛЬНО, и поэтому минус четыре a c выходит ПЛЮСОМ: минус четыре на один минус четыре, минус четыре на минус восемь плюс тридцать два. Четыре плюс тридцать два тридцать шесть — самое большое из трёх значений. Отрицательный свободный член всегда увеличивает дискриминант.',
      'In the first triple c is NEGATIVE, so minus four a c comes out PLUS: minus four times one is minus four, minus four times minus eight is plus thirty two. Four plus thirty two is thirty six — the largest of the three values. A negative constant term always increases the discriminant.') },
    { when: (s) => s.mate.f2 !== 'v2', text: L(
      "Ikkinchi uchlikda b manfiy, lekin bu D ni manfiy qilmaydi: b KVADRATGA oshadi, va minus ikkining kvadrati arti to'rt. Manfiy natijani ozod had beradi: minus to'rt karra bir karra besh minus yigirma. To'rt minus yigirma minus o'n olti.",
      'Во второй тройке b отрицательно, но не это делает D отрицательным: b ВОЗВОДИТСЯ В КВАДРАТ, и минус два в квадрате плюс четыре. Отрицательный результат даёт свободный член: минус четыре на один на пять минус двадцать. Четыре минус двадцать минус шестнадцать.',
      'In the second triple b is negative, but that is not what makes D negative: b is SQUARED, and minus two squared is plus four. The negative result comes from the constant term: minus four times one times five is minus twenty. Four minus twenty is minus sixteen.') },
    { when: (s) => s.mate.f3 !== 'v3', text: L(
      "Uchinchi uchlikda ikki qo'shiluvchi bir-birini yo'q qiladi: to'rtning kvadrati o'n olti, minus to'rt karra bir karra to'rt minus o'n olti. O'n olti minus o'n olti nol. Bu tasodif emas — bunday uchhad to'la kvadrat bo'ladi, va uning bitta ildizi bor.",
      'В третьей тройке два слагаемых уничтожают друг друга: четыре в квадрате шестнадцать, минус четыре на один на четыре минус шестнадцать. Шестнадцать минус шестнадцать нуль. Это не случайность — такой трёхчлен является полным квадратом, и у него один корень.',
      'In the third triple the two parts cancel: four squared is sixteen, minus four times one times four is minus sixteen. Sixteen minus sixteen is zero. That is no accident — such a trinomial is a perfect square, and it has one root.') },
  ],
  wrongText: L(
    "Har uchlikda ikki qo'shiluvchini alohida hisoblang: b kvadrati va minus to'rt a c. b ning ishorasi D ga ta'sir qilmaydi, c ning ishorasi esa qiladi.",
    'В каждой тройке посчитай два слагаемых по отдельности: b в квадрате и минус четыре a c. Знак b на D не влияет, а знак c влияет.',
    'Compute the two parts separately for each triple: b squared and minus four a c. The sign of b does not affect D, the sign of c does.'),
};

export default function D17_09(props) { return <PairSlots data={DATA} {...props} />; }
