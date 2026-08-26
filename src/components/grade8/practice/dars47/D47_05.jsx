// Dars47 · Amaliyot 05 — Tartib · 🟡 · tag: letter_steps
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Skelet: DARS41_50_AMALIYOT_SKELET.md §9 (47-dars, 5-pozitsiya)
//
// DARSLIKNING TESTI (106-bet): katet o'n ikki, gipotenuza ikkinchi katetdan
// olti birlik uzun. Yechish tartibi:
//   x            noma'lum katetni harf bilan belgilaymiz
//   x + 6        gipotenuzani SHU harf bilan yozamiz (З99: olti noto'g'ri
//                tomonga yozilsa, tenglama boshqa javob beradi)
//   12x = 108    Pifagor tengligidan chiqadi: 144 + x² = x² + 12x + 36
//   x = 9        yechim; gipotenuza esa o'n besh
// Boshlang'ich tartib QAT'IY (`start`).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'letter_steps', level: '🟡',
  expr: ['a = 12'], exprSize: 24,
  itemSize: 13,
  cards: [
    { id: 'l1', tokens: ['x'], label: L("noma'lum katetni belgilaymiz", 'обозначаем неизвестный катет', 'label the unknown leg') },
    { id: 'l2', tokens: ['x + 6'], label: L('gipotenuzani shu harf bilan yozamiz', 'записываем гипотенузу через ту же букву', 'write the hypotenuse with the same letter') },
    { id: 'l3', tokens: ['12x = 108'], label: L('Pifagor tengligidan tenglama', 'уравнение из равенства Пифагора', 'the equation from the Pythagorean equality') },
    { id: 'l4', tokens: ['x = 9'], label: L('tenglamani yechamiz', 'решаем уравнение', 'solve the equation') },
  ],
  start: ['l3', 'l1', 'l4', 'l2'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "To'g'ri burchakli uchburchakning bir kateti o'n ikki, gipotenuzasi esa ikkinchi katetdan olti birlik uzun. Ikkinchi katetni topishning to'rt qadami aralashib ketgan.",
    'Один катет прямоугольного треугольника равен двенадцати, а гипотенуза на шесть единиц длиннее второго катета. Четыре шага поиска второго катета перепутаны.',
    'One leg of a right triangle is twelve, and the hypotenuse is six units longer than the other leg. The four steps for finding that other leg are mixed up.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Birinchi qadam — noma'lumni tanlash: biz ikkinchi katetni x deb belgilaymiz. Ikkinchi qadam eng muhimi: shartda gipotenuza ikkinchi katetdan olti birlik UZUN deyilgan, ya'ni gipotenuza x qo'shuv olti bo'ladi. Oltini boshqa tomonga yozib bo'lmaydi: gipotenuza katetdan har doim uzun. Uchinchi qadam — Pifagor tengligini yozib soddalashtirish: bir yuz qirq to'rt qo'shuv x kvadrat teng x qo'shuv olti ning kvadrati, ya'ni x kvadrat qo'shuv o'n ikki x qo'shuv o'ttiz olti; x kvadratlar qisqaradi va o'n ikki x teng bir yuz sakkiz qoladi. To'rtinchi qadam — yechim: x teng to'qqiz. Demak katetlar to'qqiz va o'n ikki, gipotenuza esa o'n besh.",
    'Верно. Первый шаг — выбрать неизвестное: второй катет обозначаем через x. Второй шаг самый важный: в условии сказано, что гипотенуза на шесть единиц ДЛИННЕЕ второго катета, значит гипотенуза равна x плюс шесть. Приписать шесть к другой стороне нельзя: гипотенуза всегда длиннее катета. Третий шаг — записать равенство Пифагора и упростить: сто сорок четыре плюс x в квадрате равно квадрату x плюс шесть, то есть x в квадрате плюс двенадцать x плюс тридцать шесть; x в квадрате сокращается, остаётся двенадцать x равно сто восемь. Четвёртый шаг — решение: x равен девяти. Значит катеты девять и двенадцать, а гипотенуза пятнадцать.',
    'Correct. The first step is choosing the unknown: we label the other leg x. The second step matters most: the condition says the hypotenuse is six units LONGER than that leg, so the hypotenuse is x plus six. The six cannot be attached to the other side: the hypotenuse is always longer than a leg. The third step writes the Pythagorean equality and simplifies: one hundred forty four plus x squared equals the square of x plus six, that is x squared plus twelve x plus thirty six; the x squared cancels and twelve x equals one hundred eight remains. The fourth step is the solution: x equals nine. So the legs are nine and twelve and the hypotenuse fifteen.'),
  wrongs: [
    { when: (s) => s.pos.l2 < s.pos.l1, text: L(
      "Gipotenuzani harf tanlanmasdan yozib bo'lmaydi: x qo'shuv olti degan yozuv x nima ekanini bilishni talab qiladi. Birinchi qadam — noma'lumni belgilash, ikkinchisi — shartni shu harf bilan yozish.",
      'Гипотенузу не записать, пока не выбрана буква: запись x плюс шесть требует знать, что такое x. Первый шаг — обозначить неизвестное, второй — записать условие через эту букву.',
      'The hypotenuse cannot be written before the letter is chosen: the record x plus six needs x to mean something. The first step is labelling the unknown, the second writing the condition with that letter.') },
    { when: (s) => s.pos.l3 < s.pos.l2, text: L(
      "Tenglamani shart yozilmasdan chiqarib bo'lmaydi: o'n ikki x teng bir yuz sakkiz degan tenglik gipotenuza x qo'shuv olti ekanidan CHIQADI. Agar oltini noto'g'ri tomonga yozsangiz, tenglama boshqa bo'ladi va javob ham boshqa chiqadi.",
      'Уравнение не вывести, пока не записано условие: равенство двенадцать x равно ста восьми ВЫХОДИТ из того, что гипотенуза равна x плюс шесть. Если приписать шесть не туда, уравнение будет другим и ответ тоже.',
      'The equation cannot be derived before the condition is written: twelve x equals one hundred eight FOLLOWS from the hypotenuse being x plus six. Attach the six to the wrong side and the equation, and the answer, change.') },
    { when: (s) => s.seq[0] === 'l4' || s.pos.l4 < s.pos.l3, text: L(
      "Javobni tenglamadan oldin qo'yib bo'lmaydi: x teng to'qqiz degan natija tenglamani yechishdan CHIQADI. Oxirgi qadam — natija, birinchisi esa noma'lumni belgilash.",
      'Ответ нельзя ставить раньше уравнения: результат x равен девяти ВЫХОДИТ из решения уравнения. Последний шаг — результат, а первый — обозначение неизвестного.',
      'The answer cannot come before the equation: x equals nine FOLLOWS from solving it. The last step is the result; the first is labelling the unknown.') },
    { when: (s) => s.seq[0] === 'l3' || s.seq[0] === 'l2', text: L(
      "Yechish har doim noma'lumni belgilashdan boshlanadi. Shundan keyingina shartni harf bilan yozish va tenglama tuzish mumkin bo'ladi.",
      'Решение всегда начинается с обозначения неизвестного. Только после этого можно записать условие через букву и составить уравнение.',
      'A solution always starts by labelling the unknown. Only then can the condition be written with the letter and an equation formed.') },
  ],
  wrongText: L(
    "Har qadamdan bitta savol so'rang: buni yozish uchun nima allaqachon belgilangan bo'lishi kerak?",
    'Спроси у каждого шага: что должно быть уже обозначено, чтобы его записать?',
    'Ask every step: what must already be labelled to write it down?'),
};

export default function D47_05(props) { return <SwapOrder data={DATA} {...props} />; }
