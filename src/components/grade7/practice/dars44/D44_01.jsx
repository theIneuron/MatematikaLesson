// Dars44 · Amaliyot 01 — Asos burchaklari · 🟢 · choice · tag: iso_base
// Mexanika: kit.jsx -> Choice. Raskladka: 44-dars, 1-o'rin (isinish).
// Teng yonli uchburchakda asosdagi burchaklar TENG.
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'iso_base', level: '🟢',
  eyebrow: L('Asos burchaklari', 'Углы при основании', 'The base angles'),
  setup: L(
    "Teng yonli uchburchakda ikki yon tomon teng. Shundan asosdagi burchaklar haqidagi xossa chiqadi.",
    'В равнобедренном треугольнике две боковые стороны равны. Отсюда следует свойство углов при основании.',
    'An isosceles triangle has two equal legs, which gives a property of the base angles.'),
  ask: L('Asosdagi burchaklar qanday?', 'Каковы углы при основании?', 'What about the base angles?'),
  opts: [
    { label: L('Teng', 'Равны', 'Equal') },
    { label: L('Har xil', 'Разные', 'Different') },
    { label: L('Har biri 90°', 'Каждый 90°', 'Each 90°') },
  ],
  correct: 0,
  correctText: L(
    "To'g'ri. Teng tomonlar qarshisida teng burchaklar yotadi, ya'ni asos burchaklari teng.",
    'Верно. Против равных сторон лежат равные углы, значит углы при основании равны.',
    'Correct. Equal sides face equal angles, so the base angles match.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Har xil emas: yon tomonlar teng, ya'ni ular qarshisidagi burchaklar ham teng.",
      'Не разные: боковые стороны равны, значит и углы против них равны.',
      'Not different: the legs are equal, so the angles facing them are equal.') },
    { when: (s) => s.picked === 2, text: L(
      "Ikki burchak 90 gradus bo'lolmaydi: unda yig'indi 180 dan oshib ketadi, uchinchi burchakka joy qolmaydi.",
      'Два угла по 90 градусов невозможны: тогда сумма превысит 180 и третьему углу не останется места.',
      'Two 90-degree angles are impossible: the sum would exceed 180 with no room for the third.') },
  ],
  wrongText: L(
    "Teng tomonlar qarshisida qanday burchaklar yotadi?",
    'Какие углы лежат против равных сторон?',
    'What angles lie opposite equal sides?'),
};

export default function D44_01(props) { return <Choice data={DATA} {...props} />; }
