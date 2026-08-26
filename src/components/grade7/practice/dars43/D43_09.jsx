// Dars43 · Amaliyot 09 — Harf bilan burchak · 🔴 · chain · tag: iso_chain
// Mexanika: kit.jsx -> SlotsBank. Raskladka: 9-o'rin `chain`.
// Asosdagi burchaklar 3x va 75° teng -> x = 25; xulosa: uchburchak teng yonli.
import React from 'react';
import { SlotsBank, L } from '../kit.jsx';

const DATA = {
  tag: 'iso_chain',
  level: '🔴',
  eyebrow: L(
    'Ikki qadam',
    'Два шага',
    'Two steps'),
  setup: L(
    "Asosdagi burchaklar teng, ya'ni yozuvlarni tenglashtirish mumkin. Avval x, keyin xulosa.",
    'Углы при основании равны, значит записи можно приравнять. Сначала x, потом вывод.',
    'The base angles are equal, so the expressions can be set equal. First x, then the conclusion.'),
  given: [['3x', L('va', 'и', 'and'), '75°']],
  givenLabel: L(
    'Asosdagi burchaklar:',
    'Углы при основании:',
    'Base angles:'),
  rows: [[{ t: ['x', '='] }, { slot: 0 }], [{ t: [L('uchburchak', 'треугольник', 'triangle')] }, { slot: 1 }]],
  cards: ['25', L('teng yonli', 'равнобедренный', 'isosceles'), '225', L('har xil tomonli', 'разносторонний', 'scalene')],
  answer: ['25', 'teng yonli'],
  ask: L(
    'Kartani bosing, keyin uyani bosing.',
    'Нажми карточку, затем клетку.',
    'Tap a card, then tap a cell.'),
  bank: L(
    'Kartalar',
    'Карточки',
    'Cards'),
  correctText: L(
    "To'g'ri. 3x = 75 dan x = 25. Ikki burchak teng, ya'ni uchburchak teng yonli.",
    'Верно. Из 3x = 75 следует x = 25. Два угла равны, значит треугольник равнобедренный.',
    'Correct. 3x = 75 gives x = 25. Two equal angles make the triangle isosceles.'),
  wrongs: [
    {
      when: (s) => s.slots[0] === '225',
      text: L(
        "225 bu 75 · 3. Tenglamada bo'lish kerak: x = 75 : 3.",
        '225 это 75 · 3. В уравнении надо делить: x = 75 : 3.',
        '225 is 75 · 3. The equation needs division: x = 75 : 3.'),
    },
    {
      when: (s) => s.slots[1] === 'har xil tomonli',
      text: L(
        "Ikki burchak teng bo'lsa, teskari xossa bo'yicha uchburchak teng yonli.",
        'Если два угла равны, по обратному свойству треугольник равнобедренный.',
        'Two equal angles make it isosceles by the converse.'),
    },
    {
      when: (s) => s.slots.indexOf(null) !== -1,
      text: L(
        "Hamma uya to'ldirilishi kerak.",
        'Надо заполнить все клетки.',
        'Every cell must be filled.'),
    },
  ],
  wrongText: L(
    '3x ni 75 ga tenglashtiring, keyin teskari xossani eslang.',
    'Приравняй 3x к 75, потом вспомни обратное свойство.',
    'Set 3x equal to 75, then recall the converse.'),
};

export default function D43_09(props) { return <SlotsBank data={DATA} {...props} />; }
