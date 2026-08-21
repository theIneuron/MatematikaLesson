// Dars43 · Amaliyot 09 — Harf bilan perimetr · 🔴 · chain · tag: eq_chain
// Mexanika: kit.jsx -> SlotsBank (ikki qator). Raskladka: 9-o'rin.
// Tomonlar x, x va x + 3, P = 27: 3x + 3 = 27 -> x = 8, uchinchi tomon 11.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'eq_chain', level: '🔴',
  eyebrow: L('Harf bilan', 'С буквой', 'With a letter'),
  setup: L(
    "Ikki tomon x, uchinchisi x + 3. Perimetr tenglama beradi, keyin uchinchi tomon hisoblanadi.",
    'Две стороны x, третья x + 3. Периметр даёт уравнение, потом считается третья сторона.',
    'Two sides are x and the third x + 3. The perimeter gives an equation, then the third side.'),
  given: [['x,', 'x,', 'x + 3'], ['P', '=', '27']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  rows: [
    [{ t: ['3x', '+', '3', '=', '27', '→', 'x', '='] }, { slot: 0 }],
    [{ t: ['uchinchi', 'tomon', '='] }, { slot: 1 }],
  ],
  cards: ['8', '11', '9', '12'],
  answer: ['8', '11'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 3x = 24 -> x = 8, uchinchi tomon 8 + 3 = 11. Tekshirish: 8 + 8 + 11 = 27.",
    'Верно. 3x = 24 → x = 8, третья сторона 8 + 3 = 11. Проверка: 8 + 8 + 11 = 27.',
    'Correct. 3x = 24 → x = 8, the third side is 8 + 3 = 11. Check: 8 + 8 + 11 = 27.'),
  wrongs: [
    { when: (s) => s.slots[0] === '9', text: L(
      "9 chiqishi uchun 27 uchga bo'lingan. Avval 3 ni ayirish kerak: 3x = 24.",
      'Чтобы вышло 9, разделили 27 на три. Сначала надо вычесть 3: 3x = 24.',
      'To get 9 the 27 was divided by three. Subtract the 3 first: 3x = 24.') },
    { when: (s) => s.slots[1] === '12', text: L(
      "12 bu 9 + 3. x = 8 bo'lgani uchun uchinchi tomon 11.",
      '12 это 9 + 3. Так как x = 8, третья сторона равна 11.',
      '12 is 9 + 3. Since x = 8, the third side is 11.') },
  ],
  wrongText: L(
    "Avval 3 ni o'ng tomonga ko'chiring, keyin uchga bo'ling va x + 3 ni hisoblang.",
    'Сначала перенеси 3 вправо, потом раздели на три и посчитай x + 3.',
    'Move the 3 to the right, divide by three, then work out x + 3.'),
};

export default function D43_09(props) { return <SlotsBank data={DATA} {...props} />; }
