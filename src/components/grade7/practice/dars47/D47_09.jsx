// Dars47 · Amaliyot 09 — Teskari teorema · 🔴 · build · tag: pyth_inverse
// Mexanika: kit.jsx -> BuildLine. Raskladka: 9-o'rin.
// 9, 40, 41: 81 + 1600 = 1681 va 41² = 1681 -> uchburchak to'g'ri burchakli.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'pyth_inverse', level: '🔴',
  eyebrow: L('Teskari teorema', 'Обратная теорема', 'The converse'),
  setup: L(
    "Agar ikki kichik tomon kvadratlarining yig'indisi eng katta tomon kvadratiga teng bo'lsa, uchburchak to'g'ri burchakli bo'ladi.",
    'Если сумма квадратов двух меньших сторон равна квадрату наибольшей, треугольник прямоугольный.',
    'If the squares of the two shorter sides sum to the square of the longest, the triangle is right-angled.'),
  given: [['9,', '40,', '41']],
  givenLabel: L('Tomonlar:', 'Стороны:', 'Sides:'),
  cards: [
    { id: 'a', label: '81 + 1600' },
    { id: 'b', label: '1681' },
    { id: 'c', label: '41² = 1681' },
    { id: 'd', label: '9 + 40 = 49' },
    { id: 'e', label: '49 > 41' },
  ],
  answerSeq: ['a', 'b', 'c'],
  empty: L("Uch qadamni tartib bilan qo'ying", 'Поставь три шага по порядку', 'Place the three steps in order'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. 81 + 1600 = 1681 va 41² = 1681: yig'indi mos keldi, ya'ni uchburchak to'g'ri burchakli.",
    'Верно. 81 + 1600 = 1681 и 41² = 1681: суммы совпали, значит треугольник прямоугольный.',
    'Correct. 81 + 1600 = 1681 and 41² = 1681: they match, so the triangle is right-angled.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('d') !== -1 || s.seq.indexOf('e') !== -1, text: L(
      "Bu uchburchak tengsizligini tekshirish. Teskari teorema uchun KVADRATLARNI solishtirish kerak.",
      'Это проверка неравенства треугольника. Для обратной теоремы надо сравнивать КВАДРАТЫ.',
      'That checks the triangle inequality. The converse compares the SQUARES.') },
    { when: (s) => s.seq.length === 3, text: L(
      "Qadamlar to'g'ri, tartibi boshqa: yig'indi, natija, eng katta tomon kvadrati bilan solishtirish.",
      'Шаги верные, но порядок другой: сумма, результат, сравнение с квадратом наибольшей.',
      'The steps are right but the order is not: sum, result, comparison with the largest square.') },
    { when: (s) => s.seq.length < 3, text: L(
      "Uch qadam bo'lishi kerak.",
      'Должно быть три шага.',
      'There must be three steps.') },
  ],
  wrongText: L(
    "Ikki kichik tomon kvadratlarini qo'shing va eng katta tomon kvadrati bilan solishtiring.",
    'Сложи квадраты двух меньших сторон и сравни с квадратом наибольшей.',
    'Add the squares of the two shorter sides and compare with the largest square.'),
};

export default function D47_09(props) { return <BuildLine data={DATA} {...props} />; }
