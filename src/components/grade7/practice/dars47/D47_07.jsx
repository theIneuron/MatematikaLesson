// Dars47 · Amaliyot 07 — Kesmani ko'chirish · 🟡 · build · tag: comp_copy
// Mexanika: kit.jsx -> BuildLine. Raskladka: 7-o'rin `build`.
// AB = 7 kesmasi ko'chirilsa uzunlik saqlanadi: yangi kesma ham 7.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'comp_copy',
  level: '🟡',
  eyebrow: L(
    "Kesmani ko'chirish",
    'Перенос отрезка',
    'Copying a segment'),
  setup: L(
    "Sirkulning ochilishi AB ga teng qilib olindi va yangi joyga ko'chirildi. Ikki javob kerak: yangi kesmaning uzunligi va nima saqlanganini nomlash.",
    'Раствор циркуля взяли равным AB и перенесли на новое место. Нужны два ответа: длина нового отрезка и что при этом сохранилось.',
    'The compass opening was set to AB and carried elsewhere. Two answers: the new length and what was preserved.'),
  given: [['AB = 7']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  cards: [
    { id: 'a', label: '7' },
    { id: 'b', label: 'uzunlik saqlanadi' },
    { id: 'c', label: '14' },
    { id: 'd', label: 'burchak saqlanadi' },
  ],
  answerSeq: ['a', 'b'],
  fieldH: 44,
  ask: L(
    "Kartani bosish uni chiziqqa qo'yadi.",
    'Нажатие на карточку ставит её в строку.',
    'Tapping a card puts it in the line.'),
  empty: L(
    'Kartalarni bosib javobni tuzing',
    'Нажимай карточки и собери ответ',
    'Tap the cards to build the answer'),
  bank: L(
    'Kartalar',
    'Карточки',
    'Cards'),
  correctText: L(
    "To'g'ri. Sirkulning ochilishi o'zgarmadi, ya'ni yangi kesma ham 7: ko'chirishda uzunlik saqlanadi.",
    'Верно. Раствор циркуля не менялся, значит новый отрезок тоже 7: при переносе сохраняется длина.',
    'Correct. The opening never changed, so the new segment is 7: copying preserves length.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('c') !== -1,
      text: L(
        "14 bu 7 · 2. Ko'chirish kesmani kattalashtirmaydi.",
        '14 это 7 · 2. Перенос не увеличивает отрезок.',
        '14 is 7 · 2. Copying does not enlarge the segment.'),
    },
    {
      when: (s) => s.seq.indexOf('d') !== -1,
      text: L(
        "Bu yasashda burchak qatnashmaydi: sirkul masofani ko'chiradi.",
        'В этом построении угла нет: циркуль переносит расстояние.',
        'No angle takes part here: the compass carries a distance.'),
    },
    {
      when: (s) => s.seq.length < 2,
      text: L(
        'Ikki karta kerak.',
        'Нужны две карточки.',
        'Two cards are needed.'),
    },
  ],
  wrongText: L(
    "Sirkulning ochilishi o'zgardimi?",
    'Менялся ли раствор циркуля?',
    'Did the compass opening change?'),
};

export default function D47_07(props) { return <BuildLine data={DATA} {...props} />; }
