// Dars34 · Amaliyot 01 — Funksiyami · 🟢 · choice · tag: is_function
// Mexanika: kit.jsx -> Choice. Raskladka: 1-o'rin `choice`.
// DARAJA KO'TARILDI (metodist qarori 2026-08-22): sonlar ikki xonali va manfiy,
// qadamlar soni ikkitadan boshlanadi -- PODXOD_7SINF.md 13-band.
// Jadval: x = 1, 2, 3 -> y = 4, 4, 5. Bu funksiya: har x ga BITTA y. y ning takrorlanishi buzmaydi.
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'is_function',
  level: '🟢',
  eyebrow: L(
    'Funksiyami',
    'Функция ли',
    'Is it a function'),
  setup: L(
    "Funksiyada har bir x ga faqat bitta y to'g'ri keladi. y qiymatlari takrorlanishi mumkin -- bu qoidani buzmaydi.",
    'В функции каждому x отвечает только один y. Значения y могут повторяться — правило это не нарушает.',
    'In a function each x has exactly one y. Repeated y values break no rule.'),
  given: [['x: 1, 2, 3'], ['y: 4, 4, 5']],
  givenLabel: L(
    'Jadval:',
    'Таблица:',
    'Table:'),
  ask: L(
    "Bu bog'lanish funksiyami?",
    'Является ли это функцией?',
    'Is this a function?'),
  opts: [
    {
      label: L(
        'Ha, har x ga bitta y',
        'Да, каждому x один y',
        'Yes, one y per x'),
    },
    {
      label: L(
        "Yo'q, y takrorlanadi",
        'Нет, y повторяется',
        'No, y repeats'),
    },
    {
      label: L(
        "Yo'q, x lar kam",
        'Нет, мало x',
        'No, too few x'),
    },
    {
      label: L(
        "Aniqlab bo'lmaydi",
        'Определить нельзя',
        'Cannot be decided'),
    },
  ],
  correct: 0,
  optCols: 1,
  correctText: L(
    "To'g'ri. Har x ga bitta y to'g'ri keladi, ya'ni bu funksiya. 4 ning ikki marta chiqishi muhim emas.",
    'Верно. Каждому x отвечает один y, значит это функция. Повтор 4 не важен.',
    'Correct. Each x has one y, so it is a function. The repeated 4 does not matter.'),
  wrongs: [
    {
      when: (s) => s.picked === 1,
      text: L(
        "Cheklov faqat x tomonda: bir x ga ikki y bo'lmasin. y takrorlanishi mumkin.",
        'Ограничение только со стороны x: одному x нельзя два y. А y повторяться может.',
        'The limit is on the x side: one x cannot have two y. y may repeat.'),
    },
    {
      when: (s) => s.picked === 2,
      text: L(
        "x larning soni ahamiyatsiz: uchta ham, uch yuzta ham bo'lishi mumkin.",
        'Количество x не важно: их может быть и три, и триста.',
        'The count of x does not matter: three or three hundred both work.'),
    },
    {
      when: (s) => s.picked === 3,
      text: L(
        "Jadval to'liq: har x uchun y ko'rsatilgan, ya'ni javob berish mumkin.",
        'Таблица полная: для каждого x указан y, значит ответить можно.',
        'The table is complete: every x has its y, so it can be decided.'),
    },
  ],
  wrongText: L(
    "Bitta x ga ikki xil y to'g'ri kelgan joy bormi?",
    'Есть ли x, которому отвечают два разных y?',
    'Is there an x with two different y?'),
};

export default function D34_01(props) { return <Choice data={DATA} {...props} />; }
