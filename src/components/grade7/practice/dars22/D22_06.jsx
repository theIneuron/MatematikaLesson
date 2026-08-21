// Dars22 · Amaliyot 06 — Ikki harfli umumiy ko'paytuvchi · 🟡 · slots · tag: factor_two_letters
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 6-o'rin.
// 21x⁴y − 14x²y³ = 7x²y(3x² − 2y²).
// Umumiy: 7, x ning eng kichik darajasi 2, y ning eng kichik darajasi 1.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'factor_two_letters', level: '🟡',
  eyebrow: L('Ikki harf', 'Две буквы', 'Two letters'),
  setup: L(
    "Har harf uchun eng kichik daraja olinadi: x da ikki, y da bir. Son esa umumiy bo'luvchi.",
    'Для каждой буквы берётся наименьшая степень: у x вторая, у y первая. А число это общий делитель.',
    'For each letter take the lowest power: two for x, one for y. The number is the common divisor.'),
  rows: [
    [{ t: ['21x⁴y', '−', '14x²y³', '='] }, { slot: 0 }, { t: ['('] }, { slot: 1 }, { slot: 2 }, { t: [')'] }],
  ],
  cards: ['7x²y', '3x²', '−2y²', '7x²', '3x²y', '+2y²'],
  answer: ['7x²y', '3x²', '−2y²'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 21x⁴y : 7x²y = 3x², 14x²y³ : 7x²y = 2y². Umumiy ko'paytuvchi 7x²y.",
    'Верно. 21x⁴y : 7x²y = 3x², 14x²y³ : 7x²y = 2y². Общий множитель 7x²y.',
    'Correct. 21x⁴y : 7x²y = 3x², 14x²y³ : 7x²y = 2y². The common factor is 7x²y.'),
  wrongs: [
    { when: (s) => s.slots[0] === '7x²', text: L(
      "y ham umumiy: ikki hadda ham y bor, kamida bitta. Shuning uchun uni ham chiqarish kerak.",
      'y тоже общая: в обоих членах есть y, хотя бы одна. Значит её тоже надо вынести.',
      'y is common too: both terms have at least one y, so it must come out as well.') },
    { when: (s) => s.slots[1] === '3x²y', text: L(
      "21x⁴y ni 7x²y ga bo'lsak y qoladi emas: y : y = 1, ya'ni faqat 3x².",
      'При делении 21x⁴y на 7x²y буква y не остаётся: y : y = 1, значит только 3x².',
      'Dividing 21x⁴y by 7x²y leaves no y: y : y = 1, so just 3x².') },
    { when: (s) => s.slots[2] === '+2y²', text: L(
      "Asl yozuvda ayirma turibdi: qavs ichida minus qoladi.",
      'В исходной записи разность: в скобке остаётся минус.',
      'The original is a difference: the minus stays inside.') },
  ],
  wrongText: L(
    "Har harfni alohida ko'ring: x nechta kamida, y nechta kamida?",
    'Смотри на каждую букву отдельно: сколько x минимум и сколько y минимум?',
    'Look at each letter separately: the minimum number of x and of y.'),
};

export default function D22_06(props) { return <SlotsBank data={DATA} {...props} />; }
