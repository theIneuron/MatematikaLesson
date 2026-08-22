// Dars46 · Amaliyot 01 — Eng katta tomon · 🟢 · choice · tag: rt_hypotenuse
// Mexanika: kit.jsx -> Choice. Raskladka: 1-o'rin `choice`.
// To'g'ri burchakli uchburchakda eng katta burchak 90°, ya'ni eng katta tomon uning qarshisidagi gipotenuza. PIFAGOR TEOREMASI YO'Q -- u 8-sinfda.
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'rt_hypotenuse',
  level: '🟢',
  eyebrow: L(
    "To'g'ri burchakli uchburchak",
    'Прямоугольный треугольник',
    'Right triangle'),
  setup: L(
    "To'g'ri burchakli uchburchakda 90 gradusli burchak eng katta. Katta burchak qarshisida katta tomon yotadi -- shu tomonning nomi bor.",
    'В прямоугольном треугольнике угол 90 градусов наибольший. Против большего угла лежит большая сторона — у неё есть имя.',
    'In a right triangle the 90 degree angle is the largest. The largest angle faces the largest side, and that side has a name.'),
  ask: L(
    'Eng katta tomon qaysi?',
    'Какая сторона наибольшая?',
    'Which side is the largest?'),
  opts: [
    {
      label: L(
        'Gipotenuza',
        'Гипотенуза',
        'The hypotenuse'),
    },
    {
      label: L(
        'Katet',
        'Катет',
        'A leg'),
    },
    {
      label: L(
        'Ikki katet teng',
        'Оба катета равны',
        'Both legs are equal'),
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
    "To'g'ri. Gipotenuza to'g'ri burchak qarshisida yotadi, ya'ni eng katta tomon.",
    'Верно. Гипотенуза лежит против прямого угла, значит она наибольшая сторона.',
    'Correct. The hypotenuse faces the right angle, so it is the largest side.'),
  wrongs: [
    {
      when: (s) => s.picked === 1,
      text: L(
        "Katet o'tkir burchak qarshisida yotadi, o'tkir burchak esa 90 dan kichik.",
        'Катет лежит против острого угла, а острый угол меньше 90.',
        'A leg faces an acute angle, and an acute angle is below 90.'),
    },
    {
      when: (s) => s.picked === 2,
      text: L(
        "Katetlar teng bo'lishi mumkin, lekin savol eng KATTA tomon haqida.",
        'Катеты могут быть равны, но спрашивают о НАИБОЛЬШЕЙ стороне.',
        'The legs may be equal, yet the question asks for the LARGEST side.'),
    },
    {
      when: (s) => s.picked === 3,
      text: L(
        "Aniqlash mumkin: 90 gradus har doim eng katta burchak, chunki ikkinchi 90 bo'lolmaydi.",
        'Определить можно: 90 градусов всегда наибольший угол, второго такого быть не может.',
        'It can be decided: 90 degrees is always the largest, as a second one is impossible.'),
    },
  ],
  wrongText: L(
    "Burchaklarni solishtiring: 90 va ikki o'tkir burchak. Eng katta burchak qarshisida nima turadi?",
    'Сравни углы: 90 и два острых. Что лежит против наибольшего угла?',
    'Compare the angles: 90 and two acute ones. What faces the largest?'),
};

export default function D46_01(props) { return <Choice data={DATA} {...props} />; }
