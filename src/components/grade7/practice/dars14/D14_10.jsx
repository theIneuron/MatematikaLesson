// Dars14 · Amaliyot 10 — Uch amal, uch natija · 🔴 · tag: props_zones
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Zones.
//
// Darsning yakuni: bir xil asos va bir xil ko'rsatkichlar, lekin amal
// boshqa -- natija ham boshqa.
//   a⁵ · a³ = a⁸     qo'shildi
//   (a⁵)³  = a¹⁵     ko'paytirildi
//   a⁵ : a³ = a²     ayirildi
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'props_zones', level: '🔴', itemSize: 22, zoneLbl: 90,
  eyebrow: L('Uch natija', 'Три результата', 'Three results'),
  setup: L(
    "Uch yozuvda ham a asosi va o'sha ko'rsatkichlar turibdi. Farqi faqat AMALDA, natijalari esa butunlay boshqa.",
    'Во всех трёх записях основание a и те же показатели. Разница только в ДЕЙСТВИИ, а результаты совсем разные.',
    'All three records have base a and the same exponents. Only the OPERATION differs, and the results are quite different.'),
  zones: [
    { id: 'z8', label: L('a⁸', 'a⁸', 'a⁸') },
    { id: 'z15', label: L('a¹⁵', 'a¹⁵', 'a¹⁵') },
    { id: 'z2', label: L('a²', 'a²', 'a²') },
  ],
  items: [
    { id: 'i1', tokens: ['a⁵', '·', 'a³'], zone: 'z8' },
    { id: 'i2', tokens: ['(a⁵)³'], zone: 'z15' },
    { id: 'i3', tokens: ['a⁵', ':', 'a³'], zone: 'z2' },
  ],
  ask: L('Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  bank: L('Yozuvlar', 'Записи', 'Records'),
  correctText: L(
    "To'g'ri. Ko'paytirishda 5 + 3 = 8; darajaning darajasida 5 · 3 = 15; bo'lishda 5 − 3 = 2.",
    'Верно. При умножении 5 + 3 = 8; при возведении в степень 5 · 3 = 15; при делении 5 − 3 = 2.',
    'Correct. Multiplying gives 5 + 3 = 8; a power of a power gives 5 · 3 = 15; dividing gives 5 − 3 = 2.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('i2') !== -1, text: L(
      "(a⁵)³ da qavs bor: beshta a uch marta olinadi, ya'ni 5 · 3 = 15.",
      'В (a⁵)³ есть скобка: пять a берутся три раза, то есть 5 · 3 = 15.',
      'In (a⁵)³ there is a bracket: five a taken three times, that is 5 · 3 = 15.') },
    { when: (s) => s.bad.indexOf('i3') !== -1, text: L(
      "Bo'lishda ko'rsatkichlar ayiriladi: 5 − 3 = 2.",
      'При делении показатели вычитаются: 5 − 3 = 2.',
      'In a division the exponents subtract: 5 − 3 = 2.') },
    { when: (s) => s.bad.indexOf('i1') !== -1, text: L(
      "Ko'paytirishda ko'rsatkichlar qo'shiladi: 5 + 3 = 8.",
      'При умножении показатели складываются: 5 + 3 = 8.',
      'In a multiplication the exponents add: 5 + 3 = 8.') },
  ],
  wrongText: L(
    "Amalga qarang: nuqta -- qo'shish, qavs -- ko'paytirish, ikki nuqta -- ayirish.",
    'Смотри на действие: точка — сложить, скобка — перемножить, двоеточие — вычесть.',
    'Look at the operation: a dot means add, a bracket means multiply, a colon means subtract.'),
};

export default function D14_10(props) { return <Zones data={DATA} {...props} />; }
