// Dars10 · Amaliyot 07 — Tartib · 🟡 · tag: modulus_steps · CHIZMALI
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Skelet: DARS07_11_AMALIYOT_SKELET.md §8 (10-dars, 7-pozitsiya), §4a
//
// Modulni ochish IKKI QADAM: avval ildiz modulga aylanadi, keyin ISHORA
// aniqlanadi va shundan keyingina qavs ochiladi. Ishorani aniqlamasdan
// ochilgan modul aynan З31 ni beradi.
//
// CHIZMA (metodist qarori 2026-08-24): son o'qida yetti belgilangan, chapda
// esa «?» — t shu tomonda turadi. Chizma shartni ko'rsatadi (t yettidan
// kichik), qadamlarning tartibi esa javob bo'lib qoladi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'modulus_steps', level: '🟡',
  expr: [{ fig: 'axis', from: 3, to: 9, w: 280, h: 50, marks: [{ at: 7, label: '7' }, { at: 4.6, q: true }] }],
  itemSize: 14,
  cards: [
    { id: 'l1', tokens: [{ r: '(t − 7)²' }],
      label: L('yozuv', 'запись', 'the record') },
    { id: 'l2', tokens: ['|t − 7|'],
      label: L("modulga o'tamiz", 'переходим к модулю', 'move to the modulus') },
    { id: 'l3', tokens: ['t − 7 < 0'],
      label: L('ishorani aniqlaymiz', 'определяем знак', 'find the sign') },
    { id: 'l4', tokens: ['7 − t'],
      label: L('modulni ochamiz', 'раскрываем модуль', 'open the modulus') },
  ],
  start: ['l3', 'l1', 'l4', 'l2'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "t yettidan kichik — chizmada u yettining chap tomonida turadi. Yozuvni soddalashtirishning to'rt qadami bir qatorda, lekin tartibi buzilgan.",
    't меньше семи — на чертеже он стоит левее семи. Четыре шага упрощения записи стоят в одну строку, но порядок нарушен.',
    't is less than seven — on the plot it stands to the left of seven. The four steps of simplifying the record stand in one row, but their order is broken.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Kvadratdan olingan ildiz modulni beradi, shuning uchun ikkinchi qadam — modul. Keyin ishora aniqlanadi: t yettidan kichik bo'lgani uchun t minus yetti manfiy. Manfiy ifodaning moduli uni teskari ishora bilan beradi, ya'ni yetti minus t. Tekshiring: t ni to'rtga teng olsangiz to'rt minus yetti minus uch, kvadrati to'qqiz, ildizi uch — va yetti minus to'rt ham uch.",
    'Верно. Корень из квадрата даёт модуль, поэтому второй шаг — модуль. Потом определяется знак: раз t меньше семи, t минус семь отрицательно. Модуль отрицательного выражения даёт его с обратным знаком, то есть семь минус t. Проверь: при t равном четырём четыре минус семь это минус три, квадрат девять, корень три — и семь минус четыре тоже три.',
    'Correct. The root of a square gives the modulus, so the second step is the modulus. Then the sign is determined: since t is less than seven, t minus seven is negative. The modulus of a negative expression gives it with the opposite sign, that is seven minus t. Check: at t equal to four, four minus seven is minus three, its square is nine, the root is three — and seven minus four is three as well.'),
  wrongs: [
    { when: (s) => s.seq[0] === 'l4', text: L(
      "Javobdan boshlab bo'lmaydi: yetti minus t qaydan chiqdi? U modulni ochgandan keyin paydo bo'ladi, ochish uchun esa ishora kerak.",
      'Начинать с ответа нельзя: откуда взялось семь минус t? Оно появляется после раскрытия модуля, а для раскрытия нужен знак.',
      'You cannot start from the answer: where did seven minus t come from? It appears after the modulus is opened, and opening it needs the sign.') },
    { when: (s) => s.pos.l4 < s.pos.l3, text: L(
      "Modulni ishorani aniqlamasdan ochib bo'lmaydi. Agar t yettidan katta bo'lganda javob t minus yetti bo'lardi, kichik bo'lganda esa yetti minus t. Ishora qaysi javobni tanlashni aytadi.",
      'Модуль не раскрыть, не определив знак. Если бы t было больше семи, ответ был бы t минус семь, а если меньше — семь минус t. Знак и говорит, какой ответ выбрать.',
      'The modulus cannot be opened without the sign. Had t been more than seven the answer would be t minus seven; being less, it is seven minus t. The sign says which answer to take.') },
    { when: (s) => s.pos.l2 < s.pos.l1 || s.seq[0] === 'l2', text: L(
      "Modul birinchi qadam emas: u ildizdan CHIQADI. Birinchi navbatda yozuvning o'zi turadi — ildiz ostida kvadrat.",
      'Модуль не первый шаг: он ВЫХОДИТ из корня. Сначала стоит сама запись — квадрат под корнем.',
      'The modulus is not the first step: it COMES OUT of the root. The record itself comes first — a square under the root.') },
    { when: (s) => s.pos.l3 < s.pos.l2, text: L(
      "Ishorani aniqlash modul paydo bo'lgandan keyin ma'no kasb etadi: modul ichidagi ifodaning ishorasi so'raladi. Undan oldin modul yozilishi kerak.",
      'Определять знак имеет смысл после того, как модуль появился: спрашивается знак выражения ВНУТРИ модуля. До этого модуль надо записать.',
      'Determining the sign makes sense once the modulus has appeared: what is asked is the sign of the expression INSIDE it. The modulus must be written first.') },
  ],
  wrongText: L(
    "Har qadamdan bitta savol so'rang: buni bajarish uchun nima allaqachon yozilgan bo'lishi kerak?",
    'Спроси у каждого шага: что должно быть уже записано, чтобы его сделать?',
    'Ask every step: what must already be written to do it?'),
};

export default function D10_07(props) { return <SwapOrder data={DATA} {...props} />; }
