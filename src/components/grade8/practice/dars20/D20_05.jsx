// Dars20 · Amaliyot 05 — Pazl · 🟡 · tag: frac_to_ban
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §8 (20-dars, 5-pozitsiya)
//
// OLDINGI BLOKDAN (TIPLAR §6): kasrning taqiqini topish — Б1 ning ishi
// (1-6 dars), va bu yerda u tenglamaning bir qadami bo'lib qaytadi.
//
// Uch juftlik uch xil maxraj beradi:
//   m − 9  — taqiq to'g'ridan-to'g'ri, to'qqizda;
//   m + 4  — ishora almashadi: taqiq MINUS to'rtda;
//   m²     — kvadratning noli faqat nolda, va u BITTA (kvadrat ikki
//            ko'paytuvchi bo'lsa ham, ildiz o'sha bitta son).
// Kartalar qisqa: kasr ham, taqiq ham kvadrat kartaga sig'adi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'frac_to_ban', level: '🟡',
  faceSize: 13,
  cards: [
    { id: 'f1', side: 0, tokens: [{ n: '2', d: 'm − 9' }] },
    { id: 'f2', side: 0, tokens: [{ n: '5', d: 'm + 4' }] },
    { id: 'f3', side: 0, tokens: [{ n: '8', d: 'm²' }] },
    { id: 'v1', side: 1, v: 'm = 9' },
    { id: 'v2', side: 1, v: 'm = −4' },
    { id: 'v3', side: 1, v: 'm = 0' },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "Uch kasr, uch taqiq. Har kasrning taqiqi maxrajni nolga tenglashdan topiladi — bu ish 1-6 darslardan tanish.",
    'Три дроби, три запрета. Запрет каждой находится приравниванием знаменателя к нулю — эта работа знакома с уроков 1-6.',
    'Three fractions, three bans. Each ban is found by setting the denominator to zero — the same work as in lessons 1 to 6.'),
  ask: L(
    "Kasrni bosing, keyin uyani bosing.",
    'Нажми дробь, потом ячейку.',
    'Tap a fraction, then a slot.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Birinchisida m minus to'qqiz nolga teng, demak m to'qqizga teng. Ikkinchisida m qo'shuv to'rt nolga teng, demak m MINUS to'rtga teng — qo'shish taqiqni manfiy tomonga suradi. Uchinchisida m kvadrat nolga teng, va kvadrati nol bo'lgan yolg'iz son nol. Suratdagi sonlar hech narsani hal qilmaydi.",
    'Верно. В первой m минус девять равно нулю, значит m равен девяти. Во второй m плюс четыре равно нулю, значит m равен МИНУС четырём — сложение сдвигает запрет в отрицательную сторону. В третьей m квадрат равно нулю, а число с нулевым квадратом единственное — нуль. Числа в числителях ничего не решают.',
    'Correct. In the first, m minus nine is zero, so m is nine. In the second, m plus four is zero, so m is MINUS four — addition pushes the ban to the negative side. In the third, m squared is zero, and only one number squares to zero — zero itself. The numerators decide nothing.'),
  wrongs: [
    { when: (s) => s.mate.f2 !== 'v2', text: L(
      "Ikkinchi kasrda maxraj QO'SHISH bilan yozilgan, shuning uchun taqiq manfiy tomonda. m qo'shuv to'rt nolga teng bo'lsa m minus to'rtga teng. To'rtni qo'yib tekshiring: to'rt qo'shuv to'rt sakkiz, maxraj noldan farqli.",
      'Во второй дроби знаменатель записан со СЛОЖЕНИЕМ, поэтому запрет в отрицательной части. Если m плюс четыре равно нулю, то m равен минус четырём. Подставь четыре и проверь: четыре плюс четыре восемь, знаменатель не нуль.',
      'In the second fraction the denominator uses ADDITION, so the ban lies on the negative side. If m plus four is zero then m is minus four. Substitute four and check: four plus four is eight, the denominator is non-zero.') },
    { when: (s) => s.mate.f1 !== 'v1', text: L(
      "Birinchi kasrda maxraj ayirish bilan yozilgan: m minus to'qqiz. Uni nolga tenglang — m to'qqizga teng, ya'ni taqiq MUSBAT tomonda. Minus to'qqizni qo'ysangiz minus o'n sakkiz chiqadi.",
      'В первой дроби знаменатель записан с вычитанием: m минус девять. Приравняй его к нулю — m равен девяти, то есть запрет в положительной части. При минус девяти выйдет минус восемнадцать.',
      'In the first fraction the denominator uses subtraction: m minus nine. Set it to zero — m is nine, so the ban is on the positive side. Minus nine would give minus eighteen.') },
    { when: (s) => s.mate.f3 !== 'v3', text: L(
      "Uchinchi kasrda maxraj m KVADRAT. Kvadrat faqat nolda nolga aylanadi, ya'ni taqiq bitta — nol. Sakkizni yoki boshqa sonni qo'ysangiz maxraj musbat chiqadi va bo'lish bajariladi.",
      'В третьей дроби знаменатель — m КВАДРАТ. Квадрат обращается в нуль только при нуле, то есть запрет один — нуль. Подставь восемь или любое другое число: знаменатель выйдет положительным и деление выполнится.',
      'In the third fraction the denominator is m SQUARED. A square vanishes only at zero, so there is one ban — zero. Substitute eight or any other number and the denominator comes out positive, so the division works.') },
  ],
  wrongText: L(
    "Har kasrda maxrajni nolga tenglab tenglamani yeching. Qo'shish turgan maxrajda taqiq manfiy tomonga suriladi, kvadratli maxrajda esa taqiq faqat nolda.",
    'В каждой дроби приравняй знаменатель к нулю и решь. Со сложением запрет сдвигается в отрицательную сторону, а у квадрата запрет только в нуле.',
    'In each fraction set the denominator to zero and solve. With addition the ban moves to the negative side; with a square the ban sits only at zero.'),
};

export default function D20_05(props) { return <PairSlots data={DATA} {...props} />; }
