// Dars21 · Amaliyot 05 — Pazl · 🟡 · tag: equation_to_side
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §3 (21-dars, 5-pozitsiya)
//
// UCH TENGLAMA, UCH MUSBAT ILDIZ. Har tenglamaning ikkinchi ildizi manfiy
// (−4, −3, −5) va u kartada UMUMAN yo'q: masala tomon uzunligini so'ragan,
// ya'ni manfiy ildiz allaqachon rad etilgan (T3).
//
// Tuzoq juftlashning o'zida: birinchi ikki tenglama faqat b ning ishorasi
// bilan farq qiladi, va ular musbat ildizni ALMASHTIRADI:
//   x² + x = 12  -> 3 va −4
//   x² − x = 12  -> 4 va −3
// Kartalarda yozuv bo'shliqsiz — skelet §0a.3 (telefonda karta 54px).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'equation_to_side', level: '🟡',
  faceSize: 13, faceSizePhone: 11,
  cards: [
    { id: 'f1', side: 0, tokens: ['x²+x=12'] },
    { id: 'f2', side: 0, tokens: ['x²−x=12'] },
    { id: 'f3', side: 0, tokens: ['x²+3x=10'] },
    { id: 'v1', side: 1, v: 'x=3' },
    { id: 'v2', side: 1, v: 'x=4' },
    { id: 'v3', side: 1, v: 'x=2' },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "Uch masaladan uch tenglama chiqdi, va har birida tomon uzunligi so'ralgan. Har tenglamaning ikki ildizi bor, lekin kartalarda faqat javobga kirgani — musbat ildiz turibdi.",
    'Из трёх задач вышли три уравнения, и в каждой спрашивали длину стороны. У каждого уравнения два корня, но на карточках стоит только тот, что вошёл в ответ, — положительный.',
    'Three problems gave three equations, and each asked for a side length. Every equation has two roots, but the cards show only the one that entered the answer — the positive root.'),
  ask: L(
    'Tenglamani bosing, keyin uyani bosing.',
    'Нажми уравнение, потом ячейку.',
    'Tap an equation, then a slot.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Birinchisining ildizlari uch va minus to'rt, ikkinchisiniki to'rt va minus uch — bitta ishora ularni o'rin almashtirdi. Uchinchisiniki ikki va minus besh. Tekshiring: uch karra to'rt o'n ikki, to'rt karra uch o'n ikki, ikki karra besh o'n.",
    'Верно. У первого корни три и минус четыре, у второго четыре и минус три — один знак поменял их местами. У третьего два и минус пять. Проверь: три на четыре двенадцать, четыре на три двенадцать, два на пять десять.',
    'Correct. The first has roots three and minus four, the second four and minus three — one sign swapped them. The third has two and minus five. Check: three times four is twelve, four times three is twelve, two times five is ten.'),
  wrongs: [
    { when: (s) => s.mate.f1 !== 'v1', text: L(
      "Birinchi tenglamada x ning oldida ARTI turibdi: x kvadrat qo'shuv x. Uchni qo'ying: to'qqiz qo'shuv uch o'n ikki — to'g'ri. To'rtni qo'ysangiz o'n olti qo'shuv to'rt yigirma chiqadi, ya'ni to'rt bu tenglamaning ildizi emas.",
      'В первом уравнении перед x стоит ПЛЮС: x квадрат плюс x. Подставь три: девять плюс три двенадцать — верно. А подставишь четыре — выйдет шестнадцать плюс четыре двадцать, значит четыре не корень этого уравнения.',
      'In the first equation there is a PLUS before x: x squared plus x. Substitute three: nine plus three is twelve — true. Substitute four and you get sixteen plus four, twenty, so four is not a root of this equation.') },
    { when: (s) => s.mate.f2 !== 'v2', text: L(
      "Ikkinchi tenglamada x ning oldida MINUS turibdi: x kvadrat minus x. To'rtni qo'ying: o'n olti minus to'rt o'n ikki — to'g'ri. Uchni qo'ysangiz to'qqiz minus uch olti chiqadi, o'n ikki emas. Bitta ishora javobni butunlay almashtiradi.",
      'Во втором уравнении перед x стоит МИНУС: x квадрат минус x. Подставь четыре: шестнадцать минус четыре двенадцать — верно. А подставишь три — выйдет девять минус три шесть, а не двенадцать. Один знак полностью меняет ответ.',
      'In the second equation there is a MINUS before x: x squared minus x. Substitute four: sixteen minus four is twelve — true. Substitute three and you get nine minus three, six, not twelve. A single sign flips the answer entirely.') },
    { when: (s) => s.mate.f3 !== 'v3', text: L(
      "Uchinchi tenglamaning o'ng tomonida o'n turibdi, o'n ikki emas, va x ning oldida uch bor. Ikkini qo'ying: to'rt qo'shuv olti o'n — to'g'ri. Boshqa kartalarning ildizlari bu yerga tushmaydi: uchda to'qqiz qo'shuv to'qqiz o'n sakkiz chiqadi.",
      'В третьем уравнении справа стоит десять, а не двенадцать, и перед x есть тройка. Подставь два: четыре плюс шесть десять — верно. Корни других карточек сюда не подходят: при трёх выйдет девять плюс девять восемнадцать.',
      'In the third equation the right side is ten, not twelve, and there is a three before x. Substitute two: four plus six is ten — true. The roots of the other cards do not fit here: at three you get nine plus nine, eighteen.') },
  ],
  wrongText: L(
    "Har juftlikni qo'yib tekshiring: sonni tenglamaga qo'ying va ikki tomon teng chiqdimi ko'ring. Birinchi ikki tenglama faqat bitta ishora bilan farq qiladi, javoblari esa boshqa.",
    'Проверяй каждую пару подстановкой: подставь число в уравнение и посмотри, сошлись ли обе части. Первые два уравнения отличаются одним знаком, а ответы у них разные.',
    'Check every pair by substitution: put the number into the equation and see whether both sides agree. The first two equations differ by one sign, yet their answers differ.'),
};

export default function D21_05(props) { return <PairSlots data={DATA} {...props} />; }
