// Dars24 · Amaliyot 03 — Uch bo'linma · 🟢 · sort · tag: div_zones
// Mexanika: kit.jsx -> Zones. Raskladka: 3-o'rin.
// 9a⁴ : 3a² = 3a²      (4 − 2 = 2)
// 9a³ : 3a² = 3a       (3 − 2 = 1)
// 9a² : 3a² = 3        (2 − 2 = 0, harf yo'q)
// Bo'luvchi bir xil, faqat ko'rsatkich boshqa.
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'div_zones', level: '🟢', itemSize: 22, zoneLbl: 72,
  eyebrow: L("Ko'rsatkich ayiriladi", 'Показатель вычитается', 'The exponent subtracts'),
  setup: L(
    "Bo'luvchi uchtasida ham bir xil: 3a². Bo'linuvchining ko'rsatkichi esa boshqa, shuning uchun natijalar ham har xil.",
    'Делитель у всех трёх одинаковый: 3a². А показатель делимого разный, поэтому результаты тоже разные.',
    'The divisor is the same in all three: 3a². The dividend exponent differs, so the results differ too.'),
  zones: [
    { id: 'z2', label: L('3a²', '3a²', '3a²') },
    { id: 'z1', label: L('3a', '3a', '3a') },
    { id: 'z0', label: L('3', '3', '3') },
  ],
  items: [
    { id: 'i1', tokens: ['9a⁴', ':', '3a²'], zone: 'z2' },
    { id: 'i2', tokens: ['9a³', ':', '3a²'], zone: 'z1' },
    { id: 'i3', tokens: ['9a²', ':', '3a²'], zone: 'z0' },
  ],
  ask: L('Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  bank: L("Bo'linishlar", 'Деления', 'Divisions'),
  correctText: L(
    "To'g'ri. Sonlar hamma yerda 9 : 3 = 3. Ko'rsatkichlar esa 4 − 2 = 2, 3 − 2 = 1 va 2 − 2 = 0: oxirgisida harf yo'qoladi.",
    'Верно. Числа везде 9 : 3 = 3. А показатели 4 − 2 = 2, 3 − 2 = 1 и 2 − 2 = 0: в последнем буква исчезает.',
    'Correct. The numbers always give 9 : 3 = 3. The exponents give 2, 1 and 0: in the last one the letter vanishes.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('i3') !== -1, text: L(
      "9a² : 3a² da ko'rsatkichlar teng: 2 − 2 = 0, ya'ni harf qolmaydi. Javob shunchaki 3.",
      'В 9a² : 3a² показатели равны: 2 − 2 = 0, значит буквы не остаётся. Ответ просто 3.',
      'In 9a² : 3a² the exponents are equal: 2 − 2 = 0, so no letter remains. The answer is 3.') },
    { when: (s) => s.bad.indexOf('i2') !== -1, text: L(
      "9a³ : 3a² da 3 − 2 = 1, ya'ni a birinchi darajada: 3a.",
      'В 9a³ : 3a² выходит 3 − 2 = 1, значит a в первой степени: 3a.',
      'In 9a³ : 3a² we get 3 − 2 = 1, so a to the first power: 3a.') },
    { when: (s) => s.bad.indexOf('i1') !== -1, text: L(
      "9a⁴ : 3a² da 4 − 2 = 2, ya'ni 3a².",
      'В 9a⁴ : 3a² выходит 4 − 2 = 2, значит 3a².',
      'In 9a⁴ : 3a² we get 4 − 2 = 2, so 3a².') },
  ],
  wrongText: L(
    "Har bo'linishda ko'rsatkichlarni ayiring: nol chiqsa harf yo'qoladi.",
    'В каждом делении вычти показатели: если выйдет нуль, буква исчезает.',
    'Subtract the exponents in each division: a zero means the letter goes.'),
};

export default function D24_03(props) { return <Zones data={DATA} {...props} />; }
