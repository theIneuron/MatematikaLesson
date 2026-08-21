// Dars39 · Amaliyot 02 — Qo'shish yoki ko'paytirish · 🟢 · choice · tag: comb_choice
// Mexanika: kit.jsx -> Choice. Raskladka: 2-o'rin (isinish).
// 4 xil sho'rva va 3 xil ikkinchi taom: tushlik variantlari 4 · 3 = 12.
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'comb_choice', level: '🟢', optCols: 3,
  eyebrow: L('Qanday amal', 'Какое действие', 'Which operation'),
  setup: L(
    "Tushlikda sho'rva HAM, ikkinchi taom HAM tanlanadi. Ikki tanlov birga bo'lsa, variantlar ko'paytiriladi.",
    'В обед выбирают И суп, И второе. Когда два выбора вместе, варианты умножаются.',
    'Lunch takes a soup AND a main. Two choices together mean the counts multiply.'),
  given: [["sho'rva", ':', '4'], ['ikkinchi', ':', '3']],
  givenLabel: L('Berilgan:', 'Дано:', 'Given:'),
  ask: L('Nechta tushlik varianti bor?', 'Сколько вариантов обеда?', 'How many lunch options?'),
  opts: [{ label: ['12'] }, { label: ['7'] }, { label: ['4'] }],
  correct: 0,
  correctText: L(
    "To'g'ri. Har sho'rvaga uch ikkinchi taom: 4 · 3 = 12.",
    'Верно. К каждому супу три вторых блюда: 4 · 3 = 12.',
    'Correct. Each soup meets three mains: 4 · 3 = 12.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "7 bu 4 + 3. Qo'shish faqat «sho'rva YOKI ikkinchi» bo'lganda to'g'ri bo'lardi.",
      '7 это 4 + 3. Сложение было бы верным, если бы выбирали «суп ИЛИ второе».',
      '7 is 4 + 3. Adding would fit "soup OR main", not both.') },
    { when: (s) => s.picked === 2, text: L(
      "4 bu faqat sho'rvalar soni. Ikkinchi taom tanlovi ham hisobga olinishi kerak.",
      '4 это только число супов. Выбор второго блюда тоже надо учесть.',
      '4 counts only the soups. The choice of main must count too.') },
  ],
  wrongText: L(
    "Bitta sho'rvani tanlab, nechta tushlik yig'ish mumkin? Keyin sho'rvalar sonini hisobga oling.",
    'Выбрав один суп, сколько обедов можно составить? Потом учти число супов.',
    'With one soup fixed, how many lunches are there? Then count the soups.'),
};

export default function D39_02(props) { return <Choice data={DATA} {...props} />; }
