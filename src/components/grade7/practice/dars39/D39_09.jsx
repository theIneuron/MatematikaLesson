// Dars39 · Amaliyot 09 — Uch masala · 🔴 · sort · tag: comb_zones
// Mexanika: kit.jsx -> Zones. Raskladka: 9-o'rin `sort`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): manfiy va kasr koeffitsiyent,
// ikki qadamli savol, yaqin tuzoq -- PODXOD_7SINF.md 13-band.
// 4 · 3 = 12 (takrorsiz); 4 · 4 = 16 (takrorli); 4 + 3 = 7 («yoki»). Sonlar yaqin, farqi shartda.
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'comb_zones',
  level: '🔴',
  eyebrow: L(
    'Uch masala',
    'Три задачи',
    'Three tasks'),
  setup: L(
    'Uch masalada sonlar bir xil, shart esa boshqa: takrorlash mumkinmi, tanlov ketma-ketmi yoki «yoki»mi.',
    'В трёх задачах числа одни и те же, а условие разное: можно ли повторять, идут выборы подряд или это «или».',
    'The three tasks share numbers but differ in the condition: repeats allowed, choices in sequence, or an "or".'),
  itemSize: 16,
  zoneLbl: 100,
  zones: [
    {
      id: 'z1',
      label: L(
        '12',
        '12',
        '12'),
    },
    {
      id: 'z2',
      label: L(
        '16',
        '16',
        '16'),
    },
    {
      id: 'z3',
      label: L(
        '7',
        '7',
        '7'),
    },
  ],
  items: [
    { id: 'i1', tokens: [L('4 va 3, ketma-ket', '4 и 3, подряд', '4 and 3, in sequence')], zone: 'z1' },
    { id: 'i2', tokens: [L('4 raqam, takror mumkin', '4 цифры, повтор можно', '4 digits, repeats allowed')], zone: 'z2' },
    { id: 'i3', tokens: [L("4 yoki 3 ta yo'l", '4 или 3 пути', '4 or 3 ways')], zone: 'z3' },
  ],
  bank: L(
    'Masalalar',
    'Задачи',
    'Tasks'),
  ask: L(
    'Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  correctText: L(
    "To'g'ri. Ketma-ket tanlov 4 · 3 = 12; takrorli ikki o'rin 4 · 4 = 16; «yoki» esa 4 + 3 = 7.",
    'Верно. Подряд 4 · 3 = 12; с повторением два места 4 · 4 = 16; «или» это 4 + 3 = 7.',
    'Correct. In sequence 4 · 3 = 12; two places with repeats 4 · 4 = 16; "or" gives 4 + 3 = 7.'),
  wrongs: [
    {
      when: (s) => s.bad.indexOf('i3') !== -1,
      text: L(
        "«Yoki» -- bitta yo'l tanlanadi, ya'ni qo'shiladi: 4 + 3 = 7.",
        '«Или» значит выбирается один путь, поэтому складываем: 4 + 3 = 7.',
        '"Or" picks one path, so add: 4 + 3 = 7.'),
    },
    {
      when: (s) => s.bad.indexOf('i2') !== -1,
      text: L(
        "Takrorlash mumkin bo'lsa ikkinchi o'rinda ham 4 variant: 16.",
        'Если повторять можно, на втором месте тоже 4 варианта: 16.',
        'With repeats the second place keeps 4 options: 16.'),
    },
    {
      when: (s) => s.bad.indexOf('i1') !== -1,
      text: L(
        'Ketma-ket ikki bosqich: 4 · 3 = 12.',
        'Два этапа подряд: 4 · 3 = 12.',
        'Two stages in sequence: 4 · 3 = 12.'),
    },
  ],
  wrongText: L(
    "Har masalada so'rang: takrorlash bormi, «va»mi yoki «yoki»mi.",
    'Спроси о каждой задаче: есть ли повторения, это «и» или «или».',
    'Ask of each task: repeats or not, "and" or "or".'),
};

export default function D39_09(props) { return <Zones data={DATA} {...props} />; }
