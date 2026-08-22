// Dars34 · Amaliyot 02 — Uch qiymat · 🟢 · sort · tag: fn_values_zones
// Mexanika: kit.jsx -> Zones. Raskladka: 2-o'rin `sort`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): sonlar ikki xonali va manfiy,
// qadamlar soni ikkitadan boshlanadi -- PODXOD_7SINF.md 13-band.
// f(x) = x² − 9: f(3) = 0, f(4) = 7, f(2) = −5. Zonalar ishora bo'yicha.
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'fn_values_zones',
  level: '🟢',
  eyebrow: L(
    'Uch qiymat',
    'Три значения',
    'Three values'),
  setup: L(
    "f(x) = x² − 9 uchun uch qiymat hisoblanadi va ishorasiga ko'ra joylashtiriladi. Kvadrat 9 dan katta bo'lsa natija musbat.",
    'Для f(x) = x² − 9 считаем три значения и раскладываем по знаку. Если квадрат больше 9, результат положительный.',
    'For f(x) = x² − 9 compute three values and sort by sign. A square above 9 gives a positive result.'),
  given: [['f(x) = x² − 9']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  itemSize: 20,
  zoneLbl: 104,
  zones: [
    {
      id: 'zp',
      label: L(
        'Musbat',
        'Положительное',
        'Positive'),
    },
    {
      id: 'z0',
      label: L(
        'Nol',
        'Ноль',
        'Zero'),
    },
    {
      id: 'zn',
      label: L(
        'Manfiy',
        'Отрицательное',
        'Negative'),
    },
  ],
  items: [
    { id: 'i1', tokens: ['f(4)'], zone: 'zp' },
    { id: 'i2', tokens: ['f(3)'], zone: 'z0' },
    { id: 'i3', tokens: ['f(2)'], zone: 'zn' },
  ],
  bank: L(
    'Qiymatlar',
    'Значения',
    'Values'),
  ask: L(
    'Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  correctText: L(
    "To'g'ri. f(4) = 16 − 9 = 7, f(3) = 9 − 9 = 0, f(2) = 4 − 9 = −5.",
    'Верно. f(4) = 16 − 9 = 7, f(3) = 9 − 9 = 0, f(2) = 4 − 9 = −5.',
    'Correct. f(4) = 16 − 9 = 7, f(3) = 9 − 9 = 0, f(2) = 4 − 9 = −5.'),
  wrongs: [
    {
      when: (s) => s.bad.indexOf('i2') !== -1,
      text: L(
        'f(3) = 3² − 9 = 0: kvadrat aynan 9 ga teng.',
        'f(3) = 3² − 9 = 0: квадрат ровно равен 9.',
        'f(3) = 3² − 9 = 0: the square equals 9 exactly.'),
    },
    {
      when: (s) => s.bad.indexOf('i3') !== -1,
      text: L(
        "f(2) = 4 − 9 = −5: kvadrat 9 dan kichik, ya'ni natija manfiy.",
        'f(2) = 4 − 9 = −5: квадрат меньше 9, значит результат отрицательный.',
        'f(2) = 4 − 9 = −5: the square is below 9, so the result is negative.'),
    },
    {
      when: (s) => s.bad.indexOf('i1') !== -1,
      text: L(
        'f(4) = 16 − 9 = 7: musbat.',
        'f(4) = 16 − 9 = 7: положительное.',
        'f(4) = 16 − 9 = 7: positive.'),
    },
  ],
  wrongText: L(
    "Har x ni kvadratga ko'tarib 9 ni ayiring.",
    'Возведи каждый x в квадрат и вычти 9.',
    'Square each x and subtract 9.'),
};

export default function D34_02(props) { return <Zones data={DATA} {...props} />; }
