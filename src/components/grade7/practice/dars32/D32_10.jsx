// Dars32 · Amaliyot 10 — Uch juftlik, uch maxraj · 🔴 · sort · tag: frac_denom_zones
// Mexanika: kit.jsx -> Zones. Raskladka: 10-o'rin `sort`.
// MAVZU TO'LDIRILDI (metodist qarori 2026-08-22): darsning mavzusi «qisqartirish VA
// umumiy maxraj», shuning uchun 4, 6, 7 va 10-topshiriqlar umumiy maxrajga bag'ishlandi.
// Maxraj `:` bilan yoziladi -- sinf amaliyotidagi yozuv.
// (4; 6) -> 12; (3; 5) -> 15; (4; 10) -> 20. Ko'paytma har doim eng kichik maxraj bermaydi.
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'frac_denom_zones',
  level: '🔴',
  eyebrow: L(
    'Uch juftlik',
    'Три пары',
    'Three pairs'),
  setup: L(
    "Har juftlik uchun eng kichik umumiy maxrajni toping. Ba'zi juftlikda u ko'paytmaga teng, ba'zisida esa kichikroq.",
    'Для каждой пары найди наименьший общий знаменатель. У одних пар он равен произведению, у других меньше.',
    'Find the least common denominator for each pair. For some it equals the product, for others it is smaller.'),
  itemSize: 20,
  zoneLbl: 100,
  zones: [
    {
      id: 'z12',
      label: L(
        '12',
        '12',
        '12'),
    },
    {
      id: 'z15',
      label: L(
        '15',
        '15',
        '15'),
    },
    {
      id: 'z20',
      label: L(
        '20',
        '20',
        '20'),
    },
  ],
  items: [
    { id: 'i1', tokens: [L('4 va 6', '4 и 6', '4 and 6')], zone: 'z12' },
    { id: 'i2', tokens: [L('3 va 5', '3 и 5', '3 and 5')], zone: 'z15' },
    { id: 'i3', tokens: [L('4 va 10', '4 и 10', '4 and 10')], zone: 'z20' },
  ],
  bank: L(
    'Juftliklar',
    'Пары',
    'Pairs'),
  ask: L(
    'Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  correctText: L(
    "To'g'ri. 4 va 6 -> 12 (ko'paytma 24 dan kichik); 3 va 5 -> 15 (aynan ko'paytma); 4 va 10 -> 20 (ko'paytma 40 dan kichik).",
    'Верно. 4 и 6 → 12 (меньше произведения 24); 3 и 5 → 15 (ровно произведение); 4 и 10 → 20 (меньше произведения 40).',
    'Correct. 4 and 6 give 12 (below the product 24); 3 and 5 give 15 (the product itself); 4 and 10 give 20 (below 40).'),
  wrongs: [
    {
      when: (s) => s.bad.indexOf('i1') !== -1,
      text: L(
        "4 ning karralilari: 4, 8, 12. 12 oltiga ham bo'linadi.",
        'Кратные 4: 4, 8, 12. Двенадцать делится и на шесть.',
        'Multiples of 4: 4, 8, 12. Twelve divides by six too.'),
    },
    {
      when: (s) => s.bad.indexOf('i2') !== -1,
      text: L(
        "3 va 5 da umumiy bo'luvchi yo'q, ya'ni maxraj ko'paytmaga teng: 15.",
        'У 3 и 5 нет общего делителя, значит знаменатель равен произведению: 15.',
        '3 and 5 share no divisor, so the denominator is the product: 15.'),
    },
    {
      when: (s) => s.bad.indexOf('i3') !== -1,
      text: L(
        "4 va 10: 20 ikkoviga ham bo'linadi, 40 esa ortiqcha katta.",
        '4 и 10: двадцать делится на оба, а 40 избыточно велико.',
        '4 and 10: twenty divides by both, while 40 is needlessly large.'),
    },
  ],
  wrongText: L(
    "Katta maxrajning karralilarini sanab, kichigiga bo'linadiganini toping.",
    'Перебирай кратные большего знаменателя и найди делящееся на меньший.',
    'Run through multiples of the larger denominator and find one divisible by the smaller.'),
};

export default function D32_10(props) { return <Zones data={DATA} {...props} />; }
