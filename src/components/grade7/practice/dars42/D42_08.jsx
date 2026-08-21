// Dars42 · Amaliyot 08 — Harfli burchaklar · 🔴 · chain · tag: tri_letters
// Mexanika: kit.jsx -> SlotsBank (ikki qator). Raskladka: 8-o'rin.
// Burchaklar 3x, 2x va 100°: 5x + 100 = 180 -> x = 16. Burchaklar 48° va 32°.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'tri_letters', level: '🔴',
  eyebrow: L('Harfli burchaklar', 'Углы с буквой', 'Angles with a letter'),
  setup: L(
    "Ikki burchak harf bilan berilgan. Yig'indi tenglama beradi: uni yechib x topiladi, keyin burchaklar hisoblanadi.",
    'Два угла заданы буквой. Сумма даёт уравнение: решив его, находим x, потом сами углы.',
    'Two angles carry a letter. The sum gives an equation: solve for x, then the angles.'),
  given: [['3x,', '2x', 'va', '100°']],
  givenLabel: L('Burchaklar:', 'Углы:', 'Angles:'),
  rows: [
    [{ t: ['5x', '+', '100°', '=', '180°', '→', 'x', '='] }, { slot: 0 }],
    [{ t: ['burchaklar', '='] }, { slot: 1 }, { slot: 2 }],
  ],
  cards: ['16', '48°', '32°', '36', '54°', '18°'],
  answer: ['16', '48°', '32°'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 5x = 80 -> x = 16. Keyin 3x = 48 va 2x = 32. Tekshirish: 48 + 32 + 100 = 180.",
    'Верно. 5x = 80 → x = 16. Потом 3x = 48 и 2x = 32. Проверка: 48 + 32 + 100 = 180.',
    'Correct. 5x = 80 → x = 16. Then 3x = 48 and 2x = 32. Check: 48 + 32 + 100 = 180.'),
  wrongs: [
    { when: (s) => s.slots[0] === '36', text: L(
      "36 chiqishi uchun 180 ni beshga bo'lgan. Avval 100 ni ayirish kerak: 5x = 80.",
      'Чтобы вышло 36, разделили 180 на пять. Сначала надо вычесть 100: 5x = 80.',
      'To get 36 the 180 was divided by five. Subtract 100 first: 5x = 80.') },
    { when: (s) => s.slots[1] === '54°' || s.slots[2] === '18°', text: L(
      "Bu burchaklar x = 18 dan chiqadi. Bizda esa x = 16: 3 · 16 = 48 va 2 · 16 = 32.",
      'Эти углы выходят при x = 18. А у нас x = 16: 3 · 16 = 48 и 2 · 16 = 32.',
      'Those come from x = 18. Ours is x = 16: 3 · 16 = 48 and 2 · 16 = 32.') },
  ],
  wrongText: L(
    "Avval 100 ni o'ng tomonga ko'chiring, keyin beshga bo'ling.",
    'Сначала перенеси 100 вправо, потом раздели на пять.',
    'Move the 100 to the right first, then divide by five.'),
};

export default function D42_08(props) { return <SlotsBank data={DATA} {...props} />; }
