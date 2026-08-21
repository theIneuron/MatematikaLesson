// Dars22 · Amaliyot 04 — Uch uya · 🟡 · slots · tag: factor_slots
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 4-o'rin.
// 24m⁵ − 16m³ = 8m³(3m² − 2). Sonlar: 24 va 16 ning umumiy bo'luvchisi 8.
// Harf: eng kichik daraja m³. Qoldiqlar: 3m² va 2.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'factor_slots', level: '🟡',
  eyebrow: L("Uch bo'lak", 'Три части', 'Three parts'),
  setup: L(
    "Uch uyani to'ldirish kerak: qavs oldidagi umumiy ko'paytuvchi va qavs ichidagi ikki qoldiq. Qoldiqlar bo'lish orqali topiladi.",
    'Надо заполнить три клетки: общий множитель перед скобкой и два частных внутри. Частные находятся делением.',
    'Three cells to fill: the common factor in front and the two quotients inside. The quotients come from dividing.'),
  rows: [
    [{ t: ['24m⁵', '−', '16m³', '='] }, { slot: 0 }, { t: ['('] }, { slot: 1 }, { slot: 2 }, { t: [')'] }],
  ],
  cards: ['8m³', '3m²', '−2', '8m²', '3m³', '+2'],
  answer: ['8m³', '3m²', '−2'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 24 va 16 ning umumiy bo'luvchisi 8, eng kichik daraja m³. 24m⁵ : 8m³ = 3m², 16m³ : 8m³ = 2.",
    'Верно. Общий делитель 24 и 16 это 8, наименьшая степень m³. 24m⁵ : 8m³ = 3m², 16m³ : 8m³ = 2.',
    'Correct. The common divisor of 24 and 16 is 8, the lowest power m³. 24m⁵ : 8m³ = 3m², 16m³ : 8m³ = 2.'),
  wrongs: [
    { when: (s) => s.slots[0] === '8m²', text: L(
      "8m² ni chiqarish kam: ikkinchi hadda m³ bor, ya'ni m³ ni ham chiqarish mumkin.",
      'Вынести 8m² мало: во втором члене есть m³, значит m³ тоже можно вынести.',
      'Taking out 8m² is not enough: the second term has m³, so m³ can go too.') },
    { when: (s) => s.slots[1] === '3m³', text: L(
      "24m⁵ : 8m³ da ko'rsatkichlar AYIRILADI: 5 − 3 = 2, ya'ni 3m².",
      'В 24m⁵ : 8m³ показатели ВЫЧИТАЮТСЯ: 5 − 3 = 2, значит 3m².',
      'In 24m⁵ : 8m³ the exponents SUBTRACT: 5 − 3 = 2, giving 3m².') },
    { when: (s) => s.slots[2] === '+2', text: L(
      "Asl yozuvda ayirma turibdi, ya'ni qavs ichida ham minus qoladi.",
      'В исходной записи разность, значит и в скобке остаётся минус.',
      'The original is a difference, so the minus stays inside the bracket.') },
  ],
  wrongText: L(
    "Har hadni umumiy ko'paytuvchiga bo'ling: sonni bo'ling, ko'rsatkichlarni ayiring.",
    'Раздели каждый член на общий множитель: числа делятся, показатели вычитаются.',
    'Divide each term by the common factor: divide the numbers, subtract the exponents.'),
};

export default function D22_04(props) { return <SlotsBank data={DATA} {...props} />; }
