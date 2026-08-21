// Dars39 · Amaliyot 01 — Ko'paytirish qoidasi · 🟢 · slots · tag: comb_slots
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 39-dars, 1-o'rin.
// 3 ko'ylak va 4 shim: 3 · 4 = 12 variant.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'comb_slots', level: '🟢',
  eyebrow: L("Variantlar soni", 'Число вариантов', 'Number of options'),
  setup: L(
    "Har ko'ylakka har shim mos keladi. Shuning uchun variantlar soni ko'paytirish bilan topiladi, qo'shish bilan emas.",
    'К каждой рубашке подходят любые брюки. Поэтому число вариантов находят умножением, а не сложением.',
    'Each shirt pairs with any trousers, so the count comes from multiplying, not adding.'),
  rows: [
    [{ t: ['3', '·', '4', '='] }, { slot: 0 }],
  ],
  cards: ['12', '7', '34', '1'],
  answer: ['12'],
  ask: L('Kartani bosing, keyin uyani bosing.', 'Нажми карточку, затем клетку.', 'Tap a card, then tap a cell.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Har uch ko'ylakka to'rt shim: 3 · 4 = 12 variant.",
    'Верно. К каждой из трёх рубашек четыре брюк: 3 · 4 = 12 вариантов.',
    'Correct. Each of the three shirts meets four trousers: 3 · 4 = 12 options.'),
  wrongs: [
    { when: (s) => s.slots[0] === '7', text: L(
      "7 bu 3 + 4. Qo'shish faqat «yoki» holatida bo'ladi. Bu yerda esa har juftlik alohida variant.",
      '7 это 3 + 4. Сложение бывает при «или». А здесь каждая пара это отдельный вариант.',
      '7 is 3 + 4. Adding fits an "or" case. Here every pair is a separate option.') },
    { when: (s) => s.slots[0] === '34', text: L(
      "Sonlarni yonma-yon yozib bo'lmaydi: ular ko'paytiriladi.",
      'Числа нельзя писать рядом: их перемножают.',
      'The numbers cannot be stuck together: they are multiplied.') },
    { when: (s) => s.slots[0] === '1', text: L(
      "Bitta variant emas: ko'ylakni almashtirsa yangi kiyim chiqadi.",
      'Не один вариант: сменив рубашку, получаем новый комплект.',
      'Not one option: changing the shirt gives a new outfit.') },
  ],
  wrongText: L(
    "Bitta ko'ylakka nechta variant bor? Uchta ko'ylakka-chi?",
    'Сколько вариантов у одной рубашки? А у трёх?',
    'How many options for one shirt? And for three?'),
};

export default function D39_01(props) { return <SlotsBank data={DATA} {...props} />; }
