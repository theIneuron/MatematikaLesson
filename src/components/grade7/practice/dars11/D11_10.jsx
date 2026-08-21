// Dars11 · Amaliyot 10 — Uch masala, uch javob · 🔴 · tag: answer_zones
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
//
// Uch masalaning tenglamasi turibdi, javoblari har xil (tekshirilgan):
//   x + 9 = 21   -> x = 12
//   3x = 45      -> x = 15
//   2x − 6 = 30  -> 2x = 36 -> x = 18
// Uchtasini yechib, javobiga qarab joylashtirish kerak. Bu darsning yakuni:
// masaladan tenglama, tenglamadan javob.
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'answer_zones', level: '🔴', itemSize: 20, zoneLbl: 96,
  eyebrow: L('Uch javob', 'Три ответа', 'Three answers'),
  setup: L(
    "Uchta masaladan uchta tenglama chiqdi. Har birini yechib, javobi bo'yicha zonaga qo'ying.",
    'Из трёх задач вышли три уравнения. Реши каждое и положи в зону своего ответа.',
    'Three problems gave three equations. Solve each one and put it in the zone of its answer.'),
  zones: [
    { id: 'z12', label: L('12', '12', '12') },
    { id: 'z15', label: L('15', '15', '15') },
    { id: 'z18', label: L('18', '18', '18') },
  ],
  items: [
    { id: 'i1', tokens: ['x', '+', '9', '=', '21'], zone: 'z12' },
    { id: 'i2', tokens: ['3x', '=', '45'], zone: 'z15' },
    { id: 'i3', tokens: ['2x', '−', '6', '=', '30'], zone: 'z18' },
  ],
  ask: L('Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  bank: L('Tenglamalar', 'Уравнения', 'Equations'),
  correctText: L(
    "To'g'ri. x = 21 − 9 = 12; x = 45 : 3 = 15; 2x = 36 va x = 18. Uch masala, uch xil javob.",
    'Верно. x = 21 − 9 = 12; x = 45 : 3 = 15; 2x = 36 и x = 18. Три задачи, три разных ответа.',
    'Correct. x = 21 − 9 = 12; x = 45 : 3 = 15; 2x = 36 and x = 18. Three problems, three answers.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('i3') !== -1, text: L(
      "Uchinchi tenglamada ikki qadam bor: avval 6 ni ko'chirib 2x = 36 ni oling, keyin ikkiga bo'ling.",
      'В третьем уравнении два шага: сначала перенеси 6 и получи 2x = 36, потом раздели на два.',
      'The third equation needs two steps: move the 6 to get 2x = 36, then halve it.') },
    { when: (s) => s.bad.indexOf('i2') !== -1, text: L(
      "Ikkinchi tenglamada ko'paytirish bor: 3x = 45 dan x = 45 : 3 = 15.",
      'Во втором уравнении умножение: из 3x = 45 выходит x = 45 : 3 = 15.',
      'The second equation has a multiplication: 3x = 45 gives x = 45 : 3 = 15.') },
    { when: (s) => s.bad.indexOf('i1') !== -1, text: L(
      "Birinchi tenglamada faqat bitta qadam: 9 ni ko'chirsa x = 21 − 9 = 12.",
      'В первом уравнении всего один шаг: перенеси 9 и получишь x = 21 − 9 = 12.',
      'The first equation takes one step: moving the 9 gives x = 21 − 9 = 12.') },
  ],
  wrongText: L(
    "Har tenglamani alohida yeching: qaysi birida bitta qadam, qaysi birida ikkita?",
    'Реши каждое уравнение отдельно: где нужен один шаг, а где два?',
    'Solve each equation separately: which needs one step and which needs two?'),
};

export default function D11_10(props) { return <Zones data={DATA} {...props} />; }
