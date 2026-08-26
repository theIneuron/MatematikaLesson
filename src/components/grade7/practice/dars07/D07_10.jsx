// Dars07 · Amaliyot 10 — Nechta ildiz · 🔴 · tag: how_many_roots
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
//
// Uchta tenglama, uch xil holat -- darsning yakuni:
//   2x = 8          faqat x = 4                    BITTA ILDIZ
//   x + 1 = x + 2   hech qanday son                ILDIZI YO'Q
//   x + 5 = 5 + x   har qanday son (o'rin almashtirish)  HAR QANDAY SON
// Uchtasi ham bir xil ko'rinishda: ikki tomonda x va son. Farqni faqat
// hisoblab ko'rish mumkin.
// TARTIB SAQLANADI (`noShuffle`): razbor yozuvlarga TARTIB bilan murojaat
// qiladi («ikkinchi tenglamada...»), aralashtirilsa izoh ekrandagiga mos
// kelmay qoladi.
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'how_many_roots', level: '🔴', noShuffle: true, itemSize: 19, zoneLbl: 126,
  eyebrow: L('Nechta ildiz', 'Сколько корней', 'How many roots'),
  setup: L(
    "Tenglamaning bitta ildizi bo'lishi mumkin, umuman bo'lmasligi ham, yoki har qanday son ildiz bo'lishi ham mumkin.",
    'У уравнения может быть один корень, может не быть ни одного, а может корнем оказаться любое число.',
    'An equation can have one root, none at all, or any number can be a root.'),
  zones: [
    { id: 'zone1', label: L('BITTA ILDIZ', 'ОДИН КОРЕНЬ', 'ONE ROOT') },
    { id: 'znone', label: L("ILDIZI YO'Q", 'КОРНЕЙ НЕТ', 'NO ROOTS') },
    { id: 'zany', label: L('HAR QANDAY SON', 'ЛЮБОЕ ЧИСЛО', 'ANY NUMBER') },
  ],
  items: [
    { id: 'i1', tokens: ['2x', '=', '8'], zone: 'zone1' },
    { id: 'i2', tokens: ['x', '+', '1', '=', 'x', '+', '2'], zone: 'znone' },
    { id: 'i3', tokens: ['x', '+', '5', '=', '5', '+', 'x'], zone: 'zany' },
  ],
  ask: L('Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  bank: L('Tenglamalar', 'Уравнения', 'Equations'),
  correctText: L(
    "To'g'ri. 2x = 8 faqat x = 4 da bajariladi. x + 1 = x + 2 da chap tomon doim bir kichik, ya'ni ildiz yo'q. x + 5 = 5 + x esa o'rin almashtirish, u har qanday sonda to'g'ri.",
    'Верно. 2x = 8 выполняется только при x = 4. В x + 1 = x + 2 левая часть всегда на один меньше, корней нет. А x + 5 = 5 + x это перестановка, она верна при любом числе.',
    'Correct. 2x = 8 holds only for x = 4. In x + 1 = x + 2 the left side is always one less, so no roots. And x + 5 = 5 + x is a swap, true for any number.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('i3') !== -1, text: L(
      "Uchinchi tenglamaga diqqat bilan qarang: ikki tomonda AYNAN bir xil qo'shiluvchilar, faqat joyi almashgan. Bu har qanday sonda to'g'ri.",
      'Посмотри внимательно на третье уравнение: в двух частях ТЕ ЖЕ слагаемые, только переставлены. Это верно при любом числе.',
      'Look closely at the third equation: both sides have the SAME terms, just swapped. That is true for any number.') },
    { when: (s) => s.bad.indexOf('i2') !== -1, text: L(
      "Ikkinchi tenglamada x ikki tomonda ham bitta, lekin sonlar boshqa: chap tomon doim 1 ga kichik qoladi. Hech qanday son yordam bermaydi.",
      'Во втором уравнении x по одному в каждой части, но числа разные: левая часть всегда на 1 меньше. Никакое число не поможет.',
      'In the second equation there is one x on each side but the numbers differ: the left side is always 1 less. No number can fix that.') },
    { when: (s) => s.bad.indexOf('i1') !== -1, text: L(
      "Birinchi tenglamada noma'lum faqat bir tomonda va koeffitsiyenti 2: 8 ni 2 ga bo'lib bitta ildiz chiqadi.",
      'В первом уравнении неизвестное только в одной части и коэффициент 2: 8 разделить на 2 даёт один корень.',
      'In the first equation the unknown is on one side only with coefficient 2: 8 divided by 2 gives one root.') },
  ],
  wrongText: L(
    "Har tenglamada ikki tomonni solishtiring: tomonlar bir xilmi, farqi o'zgarmasmi yoki noma'lum bitta tomondami?",
    'Сравни в каждом уравнении две части: они одинаковы, разница постоянна или неизвестное только в одной части?',
    'Compare the two sides in each equation: are they identical, is the gap constant, or is the unknown only on one side?'),
};

export default function D07_10(props) { return <Zones data={DATA} {...props} />; }
