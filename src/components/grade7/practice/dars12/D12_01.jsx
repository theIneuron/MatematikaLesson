// Dars12 · Amaliyot 01 — Yo'l masalasi · 🟢 · tag: speed_equation
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
//
// DARAJA KO'TARILDI (PODXOD_7SINF.md §13): uch xonali yo'l, javob esa
// og'zaki chiqadi: 340 : 4 = 85.
//
// «Avtobus 4 soat yurdi va 340 km yo'l bosdi, tezligi x km/soat.»
// Yo'l = tezlik · vaqt, ya'ni 4x = 340.
// Xato variantlar: x : 4 = 340 (bo'lishni ko'paytirish o'rniga olgan) va
// x + 4 = 340 (soatni tezlikka qo'shgan).
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'speed_equation', level: '🟢', optCols: 3,
  eyebrow: L('Yo\'l masalasi', 'Задача на движение', 'A motion problem'),
  setup: L(
    "Avtobus 4 soat yurdi va 340 km yo'l bosdi. Uning tezligini x km/soat deb oldik.",
    'Автобус ехал 4 часа и прошёл 340 км. Его скорость обозначили x км/ч.',
    'A bus travelled for 4 hours and covered 340 km. Its speed is x km per hour.'),
  ask: L('Qaysi tenglama shu masalaga mos?', 'Какое уравнение соответствует задаче?', 'Which equation matches the problem?'),
  opts: [
    { label: ['4x', '=', '340'] },
    { label: ['x', ':', '4', '=', '340'] },
    { label: ['x', '+', '4', '=', '340'] },
  ],
  correct: 0,
  correctText: L(
    "To'g'ri. Yo'l tezlikni vaqtga ko'paytirib topiladi: 4 soatda 4x km bosiladi, va bu 340 km.",
    'Верно. Путь находят умножением скорости на время: за 4 часа проходится 4x км, и это 340 км.',
    'Correct. Distance is speed times time: in 4 hours the bus covers 4x km, and that is 340 km.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Bo'lish tezlikni TOPISH uchun kerak bo'ladi: x = 340 : 4. Tenglamada esa yo'l qanday hosil bo'lgani yoziladi.",
      'Деление нужно, чтобы НАЙТИ скорость: x = 340 : 4. А в уравнении записывают, как получился путь.',
      'Division is for FINDING the speed: x = 180 : 3. The equation records how the distance came about.') },
    { when: (s) => s.picked === 2, text: L(
      "Soat va km ni qo'shib bo'lmaydi: ular boshqa o'lchov. Vaqt tezlikka KO'PAYTIRILADI.",
      'Часы и километры складывать нельзя: это разные величины. Время УМНОЖАЕТСЯ на скорость.',
      'Hours and kilometres cannot be added: they are different quantities. Time is MULTIPLIED by speed.') },
  ],
  wrongText: L(
    "Yo'l, tezlik va vaqt bog'lanishini eslang: yo'l = tezlik · vaqt.",
    'Вспомни связь пути, скорости и времени: путь = скорость · время.',
    'Recall how distance, speed and time are linked: distance = speed · time.'),
};

export default function D12_01(props) { return <Choice data={DATA} {...props} />; }
