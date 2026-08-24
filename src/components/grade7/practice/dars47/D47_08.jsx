// Dars47 · Amaliyot 08 — Uchburchak yasash tartibi · 🔴 · order · tag: comp_order
// Mexanika: kit.jsx -> BuildLine. Raskladka: 8-o'rin `order`.
// Uch tomoni bo'yicha uchburchak yasash: asosni chizish, ikki yoy, kesishgan nuqtani ulash.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'comp_order',
  level: '🔴',
  eyebrow: L(
    'Yasash tartibi',
    'Порядок построения',
    'Order of construction'),
  setup: L(
    "Uch tomoni bo'yicha uchburchak yasaladi. Qadamlarni tartib bilan qo'ying: har qadam keyingisiga zamin bo'ladi.",
    'Треугольник строят по трём сторонам. Поставь шаги по порядку: каждый готовит следующий.',
    'A triangle is built from three sides. Place the steps in order: each prepares the next.'),
  given: [['a, b, c']],
  givenLabel: L(
    'Tomonlar:',
    'Стороны:',
    'Sides:'),
  cards: [
    { id: 'a', label: 'a tomonini chizish' },
    { id: 'b', label: 'uchlardan b va c yoylari' },
    { id: 'c', label: 'kesishgan nuqtani ulash' },
    { id: 'd', label: "burchakni transportir bilan qo'yish" },
    { id: 'e', label: 'perimetrni hisoblash' },
  ],
  answerSeq: ['a', 'b', 'c'],
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
    "To'g'ri. Avval bir tomon chiziladi, keyin uchlaridan qolgan ikki tomonning yoylari, oxirida kesishgan nuqta ulanadi.",
    'Верно. Сначала чертят одну сторону, потом из её концов дуги двух других сторон, в конце соединяют точку пересечения.',
    'Correct. Draw one side, then arcs of the other two from its ends, then join the crossing point.'),
  wrongs: [
    {
      when: (s) => s.seq.indexOf('d') !== -1,
      text: L(
        "Transportir bu yasashda ishlatilmaydi: faqat sirkul va chizg'ich.",
        'Транспортир в этом построении не нужен: только циркуль и линейка.',
        'No protractor here: compass and ruler only.'),
    },
    {
      when: (s) => s.seq.indexOf('e') !== -1,
      text: L(
        'Perimetr hisobi yasashning qadami emas.',
        'Подсчёт периметра не шаг построения.',
        'Computing the perimeter is not a construction step.'),
    },
    {
      when: (s) => s.seq.length < 3,
      text: L(
        'Uch karta kerak.',
        'Нужны три карточки.',
        'Three cards are needed.'),
    },
  ],
  wrongText: L(
    "Sirkul yoyni qayerdan chizadi? Avval nima chizilgan bo'lishi kerak?",
    'Откуда циркуль чертит дугу? Что должно быть начерчено раньше?',
    'Where does the compass draw from? What must exist first?'),
};

export default function D47_08(props) { return <BuildLine data={DATA} {...props} />; }
