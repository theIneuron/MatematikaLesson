// Dars44 · Amaliyot 09 — Perimetr formulasi · 🔴 · bracket · tag: iso_perimeter
// Mexanika: kit.jsx -> BuildLine (qavs kartalari). Raskladka: 9-o'rin.
// Teng yonli uchburchak perimetri: P = 2a + b, a -- yon tomon, b -- asos.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'iso_perimeter', level: '🔴',
  eyebrow: L('Perimetr formulasi', 'Формула периметра', 'The perimeter formula'),
  setup: L(
    "Teng yonli uchburchakda yon tomon ikki marta, asos bir marta olinadi. Shu formula bilan yoziladi.",
    'В равнобедренном треугольнике боковая сторона берётся дважды, основание один раз. Это и записывается формулой.',
    'The leg appears twice and the base once. That is the formula.'),
  given: [['a', '--', 'yon,', 'b', '--', 'asos']],
  givenLabel: L('Belgilash:', 'Обозначения:', 'Notation:'),
  cards: [
    { id: 'a', label: 'P' },
    { id: 'b', label: '= 2a + b' },
    { id: 'c', label: '= a + 2b' },
    { id: 'd', label: '= 3a' },
  ],
  answerSeq: ['a', 'b'],
  empty: L("Formulani tuzing", 'Составь формулу', 'Build the formula'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. P = 2a + b: ikki yon tomon va bitta asos.",
    'Верно. P = 2a + b: две боковые и одно основание.',
    'Correct. P = 2a + b: two legs and one base.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('c') !== -1, text: L(
      "a + 2b da asos ikki marta olingan. Teng bo'lgan narsa YON tomonlar.",
      'В a + 2b дважды взято основание. А равны БОКОВЫЕ стороны.',
      'a + 2b doubles the base. It is the LEGS that are equal.') },
    { when: (s) => s.seq.indexOf('d') !== -1, text: L(
      "3a faqat teng tomonli uchburchak uchun to'g'ri: unda hamma tomon teng.",
      '3a верно только для равностороннего треугольника: там все стороны равны.',
      '3a fits only an equilateral triangle, where all sides match.') },
    { when: (s) => s.seq.length < 2, text: L(
      "Formula ikki bo'lakdan iborat.",
      'Формула состоит из двух частей.',
      'The formula has two parts.') },
  ],
  wrongText: L(
    "Teng yonli uchburchakda qaysi tomon ikki marta uchraydi?",
    'Какая сторона встречается дважды в равнобедренном треугольнике?',
    'Which side appears twice in an isosceles triangle?'),
};

export default function D44_09(props) { return <BuildLine data={DATA} {...props} />; }
