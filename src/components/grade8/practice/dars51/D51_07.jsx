// Dars51 · Amaliyot 07 — Tartib · 🟡 🖼 · tag: inscribed_steps
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> SwapOrder.
// Skelet: DARS51_55_AMALIYOT_SKELET.md §3 (51-dars, 7-pozitsiya)
//
// З108 AYNAN IKKINCHI QADAMDA yashiringan: tiralgan yoyni tanlash.
// Yarimlashni yoyni topishdan oldin qo'yish mumkin emas — yarimlanadigan
// narsa hali yo'q. Chizma `expr` da turadi: qadamlar shu chizmani
// o'qiydi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SwapOrder, L } from '../kit.jsx';

const DATA = {
  tag: 'inscribed_steps', level: '🟡',
  expr: [{
    fig: 'circ', w: 132, h: 104, r: 40, cx: 66, cy: 50,
    chords: [{ a: 150, b: 290, names: ['A', 'B'] }, { a: 70, b: 290, names: ['C', null] }],
    radii: [150, 70],
  }],
  itemSize: 12,
  cards: [
    { id: 'l1', tokens: ['B'],
      label: L("uch qayerda turganini aniqlaymiz", 'определяем, где стоит вершина', 'find where the vertex stands') },
    { id: 'l2', tokens: ['AC'],
      label: L("tiralgan yoyni topamiz, uchsiz tomondagini", 'находим дугу опоры, ту, что без вершины', 'find the subtended arc, the one without the vertex') },
    { id: 'l3', tokens: ['80°'],
      label: L("yoyning gradusini yozamiz", 'записываем градусы дуги', 'write down the degrees of the arc') },
    { id: 'l4', tokens: ['40°'],
      label: L('yarmini olamiz', 'берём половину', 'take the half') },
  ],
  start: ['l4', 'l1', 'l3', 'l2'],
  answer: ['l1', 'l2', 'l3', 'l4'],
  eyebrow: L('Tartib', 'Порядок', 'Order'),
  setup: L(
    "Chizmadagi ABC burchagini to'rt qadamda topamiz, lekin qadamlar aralashib ketgan. Ikkinchi qadam TANLOV: A va C nuqtalari aylanani ikki yoyga bo'ladi, va ulardan faqat bittasi kerak.",
    'Угол ABC на рисунке находим в четыре шага, но шаги перепутаны. Второй шаг — ВЫБОР: точки A и C делят окружность на две дуги, и нужна только одна из них.',
    'We find the angle ABC in the drawing in four steps, but the steps are mixed up. The second step is a CHOICE: the points A and C split the circle into two arcs, and only one of them is needed.'),
  ask: L(
    "To'g'ri ketma-ketlikda joylashtiring: almashtirish kerak bo'lgan ikkita kartani ketma-ket bosing.",
    'Расставь их в правильной последовательности: нажми подряд две карточки, которые надо поменять местами.',
    'Put them in the right sequence: tap two cards in a row to swap them.'),
  correctText: L(
    "To'g'ri. Tartib tasodifiy emas. Avval uch qayerdaligini ko'ramiz: u aylanada, demak burchak ichki chizilgan. Keyin tiralgan yoyni tanlaymiz, va bu yerda qoida qat'iy: yoy uchdan QARAMA-QARSHI tomonda yotadi. Faqat shundan keyin uning gradusini yozish mumkin, va oxirida yarmini olamiz. Ikkinchi qadamni tashlab ketsangiz, yarimlanadigan narsa noaniq bo'lib qoladi.",
    'Верно. Порядок не случаен. Сначала смотрим, где вершина: она на окружности, значит угол вписанный. Потом выбираем дугу опоры, и здесь правило строгое: дуга лежит ПРОТИВОПОЛОЖНО вершине. Только после этого можно записать её градусы, и в конце берём половину. Пропустишь второй шаг — станет непонятно, что именно делить пополам.',
    'Correct. The order is not accidental. First we see where the vertex is: on the circle, so the angle is inscribed. Then we choose the subtended arc, and here the rule is strict: the arc lies OPPOSITE the vertex. Only after that can its degrees be written down, and at the end we take the half. Skip the second step and it becomes unclear what exactly is being halved.'),
  wrongs: [
    { when: (s) => s.seq[0] === 'l4' || s.seq[0] === 'l3', text: L(
      "Birinchi qadamda son turibdi, lekin u qayerdan olinganini hali hech narsa aytmaydi. Ish uchdan boshlanadi: u aylanada yotibdimi yoki markazdami. Javob shu yerda hal bo'ladi, chunki markaziy burchakda yarimlash umuman kerak emas.",
      'На первом шаге стоит число, но откуда оно взято, пока ничто не говорит. Работа начинается с вершины: лежит она на окружности или в центре. Ответ решается здесь, ведь у центрального угла делить пополам вообще не нужно.',
      'The first step holds a number, but nothing yet says where it came from. The work starts with the vertex: does it lie on the circle or at the centre. The answer is settled here, since a central angle needs no halving at all.') },
    { when: (s) => s.seq.indexOf('l4') < s.seq.indexOf('l3'), text: L(
      "Yarimlash yoyning gradusidan OLDIN turibdi, ya'ni yarimlanadigan son hali yozilmagan. Qadamlar ketma-ket bog'langan: yoy tanlanadi, uning o'lchovi yoziladi, keyin o'sha o'lchov ikkiga bo'linadi.",
      'Деление пополам стоит ПЕРЕД градусами дуги, то есть число, которое делят, ещё не записано. Шаги связаны цепочкой: выбирается дуга, записывается её мера, и только потом эта мера делится на два.',
      'The halving stands BEFORE the degrees of the arc, so the number being halved has not been written yet. The steps are chained: the arc is chosen, its measure is written, and only then is that measure divided by two.') },
    { when: (s) => s.seq.indexOf('l2') > s.seq.indexOf('l3'), text: L(
      "Yoyning gradusi tanlovdan oldin yozilib qoldi. Lekin A va C ikki yoy hosil qiladi: sakson graduslik va ikki yuz sakson graduslik. Qaysi biri kerakligini aytmasdan son yozib bo'lmaydi, va aynan shu yerda eng ko'p adashiladi: uch turgan yoy olinadi, qarama-qarshisi o'rniga.",
      'Градусы дуги записаны раньше выбора. Но A и C образуют две дуги: в восемьдесят градусов и в двести восемьдесят. Не сказав, какая нужна, число записать нельзя, и именно здесь ошибаются чаще всего: берут дугу, где стоит вершина, вместо противоположной.',
      'The degrees of the arc were written before the choice. But A and C form two arcs: one of eighty degrees and one of two hundred and eighty. Without saying which one is needed, no number can be written, and this is exactly where mistakes happen most: the arc holding the vertex is taken instead of the opposite one.') },
  ],
  wrongText: L(
    "Uch qayerda, keyin qaysi yoy, keyin uning o'lchovi, oxirida yarmi.",
    'Где вершина, потом какая дуга, потом её мера, в конце половина.',
    'Where the vertex is, then which arc, then its measure, and the half at the end.'),
};

export default function D51_07(props) { return <SwapOrder data={DATA} {...props} />; }
