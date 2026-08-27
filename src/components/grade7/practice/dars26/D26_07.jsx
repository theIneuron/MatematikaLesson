// Dars26 · Amaliyot 07 — Ikki harf · 🟡 · slots · tag: diff_sq_two_letters
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 7-o'rin.
// (3x + 8y)(3x − 8y) = 9x² − 64y². Har ikki koeffitsiyent kvadratga
// ko'tariladi: 3² = 9, 8² = 64.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'diff_sq_two_letters', level: '🟡',
  eyebrow: L('Ikki harf', 'Две буквы', 'Two letters'),
  setup: L(
    "Ikki harf bo'lganda ham javobda ikki had qoladi: har ikki hadning kvadrati, orasida minus.",
    'И с двумя буквами в ответе остаются два члена: квадраты обоих, между ними минус.',
    'With two letters the answer still has two terms: both squares with a minus between.'),
  rows: [
    [{ t: ['(3x', '+', '8y)', '(3x', '−', '8y)', '='] }, { slot: 0 }, { slot: 1 }],
  ],
  cards: ['9x²', '−64y²', '+64y²', '9x', '−16xy', '−8y²'],
  answer: ['9x²', '−64y²'],
  ask: L("Kartani bosing, keyin bo'sh katakni bosing.", 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. (3x)² = 9x², (8y)² = 64y², orasida minus: 9x² − 64y².",
    'Верно. (3x)² = 9x², (8y)² = 64y², между ними минус: 9x² − 64y².',
    'Correct. (3x)² = 9x², (8y)² = 64y², with a minus between: 9x² − 64y².'),
  wrongs: [
    { when: (s) => s.slots[1] === '+64y²', text: L(
      "Ikkinchi had manfiy: (+8y)(−8y) = −64y².",
      'Второй член отрицательный: (+8y)(−8y) = −64y².',
      'The second term is negative: (+8y)(−8y) = −64y².') },
    { when: (s) => s.slots[1] === '−8y²', text: L(
      "Koeffitsiyent ham kvadratga ko'tariladi: 8² = 64, ya'ni −64y².",
      'Коэффициент тоже возводится в квадрат: 8² = 64, значит −64y².',
      'The coefficient is squared too: 8² = 64, giving −64y².') },
    { when: (s) => s.slots[0] === '9x', text: L(
      "(3x)² da harf ham kvadratga ko'tariladi: 9x².",
      'В (3x)² буква тоже возводится в квадрат: 9x².',
      'In (3x)² the letter is squared too: 9x².') },
    { when: (s) => s.slots[0] === '−16xy' || s.slots[1] === '−16xy', text: L(
      "O'rta had qolmaydi: −24xy + 24xy = 0.",
      'Средний член не остаётся: −24xy + 24xy = 0.',
      'No middle term remains: −24xy + 24xy = 0.') },
  ],
  wrongText: L(
    "Ikki kvadratni hisoblang: (3x)² va (8y)². Ular orasidagi ishora qanday?",
    'Посчитай два квадрата: (3x)² и (8y)². Какой знак между ними?',
    'Work out the two squares: (3x)² and (8y)². Which sign goes between?'),
};

export default function D26_07(props) { return <SlotsBank data={DATA} {...props} />; }
