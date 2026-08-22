// Dars35 · Amaliyot 02 — Kasr k ning ishorasi · 🟢 · choice · tag: k_sign
// Mexanika: kit.jsx -> Choice. Raskladka: 2-o'rin `choice`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): k manfiy va kasr bo'ladi,
// savol ikki qadamli -- PODXOD_7SINF.md 13-band.
// y = −0,5x + 7: k = −0,5 < 0, ya'ni funksiya kamayadi.
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'k_sign',
  level: '🟢',
  eyebrow: L(
    'k ning ishorasi',
    'Знак k',
    'The sign of k'),
  setup: L(
    "k funksiyaning yo'nalishini beradi: k musbat bo'lsa qiymat o'sadi, manfiy bo'lsa kamayadi. k kasr ham bo'lishi mumkin.",
    'k задаёт направление: при положительном k значение растёт, при отрицательном убывает. k может быть дробным.',
    'k sets the direction: a positive k makes values grow, a negative one makes them fall. k may be a fraction.'),
  given: [['y = −0,5x + 7']],
  givenLabel: L(
    'Berilgan:',
    'Дано:',
    'Given:'),
  ask: L(
    "Funksiya qanday o'zgaradi?",
    'Как меняется функция?',
    'How does the function change?'),
  opts: [
    {
      label: L(
        'Kamayadi',
        'Убывает',
        'It falls'),
    },
    {
      label: L(
        "O'sadi",
        'Растёт',
        'It grows'),
    },
    {
      label: L(
        "O'zgarmaydi",
        'Не меняется',
        'It stays put'),
    },
    {
      label: L(
        "k kasr bo'lgani uchun aniqlanmaydi",
        'Из-за дробного k нельзя сказать',
        'A fractional k gives no answer'),
    },
  ],
  correct: 0,
  optCols: 1,
  correctText: L(
    "To'g'ri. k = −0,5 manfiy, ya'ni x o'sganda y kamayadi. Kasr bo'lishi hech narsani o'zgartirmaydi.",
    'Верно. k = −0,5 отрицательный, значит с ростом x значение y убывает. Дробность ничего не меняет.',
    'Correct. k = −0.5 is negative, so y falls as x grows. Being a fraction changes nothing.'),
  wrongs: [
    {
      when: (s) => s.picked === 1,
      text: L(
        "O'sish uchun k musbat bo'lishi kerak. Bu yerda k oldida minus turibdi.",
        'Для роста k должен быть положительным. Здесь перед k стоит минус.',
        'Growth needs a positive k. Here k carries a minus.'),
    },
    {
      when: (s) => s.picked === 2,
      text: L(
        "Qiymat o'zgarmasligi uchun k nol bo'lishi kerak. −0,5 esa nol emas.",
        'Чтобы значение не менялось, k должен быть нулём. А −0,5 не ноль.',
        'A constant value needs k to be zero, and −0.5 is not.'),
    },
    {
      when: (s) => s.picked === 3,
      text: L(
        'Kasr k ham ishoraga ega: −0,5 manfiy son.',
        'Дробный k тоже имеет знак: −0,5 отрицательное число.',
        'A fractional k still has a sign: −0.5 is negative.'),
    },
  ],
  wrongText: L(
    'k oldida qanday ishora turibdi?',
    'Какой знак стоит перед k?',
    'What sign sits in front of k?'),
};

export default function D35_02(props) { return <Choice data={DATA} {...props} />; }
