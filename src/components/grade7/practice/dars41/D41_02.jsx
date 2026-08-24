// Dars41 · Amaliyot 02 — Teng tomonli qanday · 🟢 · choice · tag: kind_equilateral
// Mexanika: kit.jsx -> Choice. Raskladka: 2-o'rin `choice`.
// Teng tomonli uchburchakning hamma burchagi 60°, ya'ni u har doim o'tkir burchakli.
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'kind_equilateral',
  level: '🟢',
  eyebrow: L(
    "Burchaklar bo'yicha",
    'По углам',
    'By angles'),
  setup: L(
    "Teng tomonli uchburchakning hamma burchagi bir xil -- 60 gradus. Endi uni burchaklar bo'yicha atash kerak.",
    'У равностороннего треугольника все углы одинаковы — 60 градусов. Теперь его надо назвать по углам.',
    'An equilateral triangle has all angles the same — 60 degrees. Now name it by its angles.'),
  given: [['60°, 60°, 60°']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  ask: L(
    "Burchaklar bo'yicha bu qanday uchburchak?",
    'Какой это треугольник по углам?',
    'What kind is it by angles?'),
  opts: [
    {
      label: L(
        "O'tkir burchakli",
        'Остроугольный',
        'Acute'),
    },
    {
      label: L(
        "To'g'ri burchakli",
        'Прямоугольный',
        'Right'),
    },
    {
      label: L(
        "O'tmas burchakli",
        'Тупоугольный',
        'Obtuse'),
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
    "To'g'ri. 60 < 90, ya'ni uch burchak ham o'tkir. Teng tomonli uchburchak har doim o'tkir burchakli.",
    'Верно. 60 < 90, значит все три угла острые. Равносторонний треугольник всегда остроугольный.',
    'Correct. 60 < 90, so all three angles are acute. An equilateral triangle is always acute.'),
  wrongs: [
    {
      when: (s) => s.picked === 1,
      text: L(
        "To'g'ri burchakli uchburchakda 90 gradusli burchak bo'ladi. Bu yerda 90 yo'q.",
        'У прямоугольного есть угол 90 градусов. Здесь такого нет.',
        'A right triangle needs a 90 degree angle. There is none here.'),
    },
    {
      when: (s) => s.picked === 2,
      text: L(
        "O'tmas burchak 90 dan katta. 60 esa kichik.",
        'Тупой угол больше 90. А 60 меньше.',
        'An obtuse angle exceeds 90, while 60 is less.'),
    },
    {
      when: (s) => s.picked === 3,
      text: L(
        "Hamma burchak berilgan, ya'ni turini aniqlash mumkin: 60 < 90.",
        'Все углы даны, значит вид определить можно: 60 < 90.',
        'Every angle is given, so the kind can be decided: 60 < 90.'),
    },
  ],
  wrongText: L(
    'Uch burchakni 90 bilan solishtiring.',
    'Сравни каждый угол с 90.',
    'Compare each angle with 90.'),
};

export default function D41_02(props) { return <Choice data={DATA} {...props} />; }
