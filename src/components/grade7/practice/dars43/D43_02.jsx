// Dars43 · Amaliyot 02 — Teskari xossa · 🟢 · choice · tag: iso_converse
// Mexanika: kit.jsx -> Choice. Raskladka: 2-o'rin `choice`.
// Teskarisi ham to'g'ri: ikki burchagi teng bo'lsa uchburchak teng yonli.
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'iso_converse',
  level: '🟢',
  eyebrow: L(
    'Teskari tomon',
    'Обратное свойство',
    'The converse'),
  setup: L(
    'Xossa ikki tomonga ishlaydi. Ikki burchagi teng uchburchak haqida nima aytish mumkin?',
    'Свойство работает в обе стороны. Что можно сказать о треугольнике с двумя равными углами?',
    'The property works both ways. What can be said about a triangle with two equal angles?'),
  given: [['65°', L('va', 'и', 'and'), '65°']],
  givenLabel: L(
    'Ikki burchak:',
    'Два угла:',
    'Two angles:'),
  ask: L(
    'Bu uchburchak qanday?',
    'Какой это треугольник?',
    'What kind of triangle is it?'),
  opts: [
    {
      label: L(
        'Teng yonli',
        'Равнобедренный',
        'Isosceles'),
    },
    {
      label: L(
        'Teng tomonli',
        'Равносторонний',
        'Equilateral'),
    },
    {
      label: L(
        "To'g'ri burchakli",
        'Прямоугольный',
        'Right-angled'),
    },
    {
      label: L(
        "Aniqlab bo'lmaydi",
        'Определить нельзя',
        'Cannot be decided'),
    },
  ],
  correct: 0,
  optCols: 2,
  correctText: L(
    "To'g'ri. Teng burchaklar qarshisida teng tomonlar yotadi, ya'ni uchburchak teng yonli.",
    'Верно. Против равных углов лежат равные стороны, значит треугольник равнобедренный.',
    'Correct. Equal angles face equal sides, so the triangle is isosceles.'),
  wrongs: [
    {
      when: (s) => s.picked === 1,
      text: L(
        "Teng tomonli bo'lishi uchun UCH burchak ham teng bo'lishi kerak. Bizga ikkitasi berilgan.",
        'Для равностороннего нужны ТРИ равных угла. Нам даны только два.',
        'An equilateral needs THREE equal angles. Only two are given.'),
    },
    {
      when: (s) => s.picked === 2,
      text: L(
        "To'g'ri burchak 90 gradus. Bu yerda 65 gradusli burchaklar bor.",
        'Прямой угол это 90 градусов. Здесь углы по 65.',
        'A right angle is 90 degrees. Here the angles are 65.'),
    },
    {
      when: (s) => s.picked === 3,
      text: L(
        'Ikki teng burchak yetadi: teskari xossa aynan shu haqda.',
        'Двух равных углов достаточно: обратное свойство именно об этом.',
        'Two equal angles suffice: that is what the converse says.'),
    },
  ],
  wrongText: L(
    "Xossani teskari o'qing: teng burchaklardan teng tomonlarga.",
    'Прочитай свойство обратно: от равных углов к равным сторонам.',
    'Read the property backwards: from equal angles to equal sides.'),
};

export default function D43_02(props) { return <Choice data={DATA} {...props} />; }
