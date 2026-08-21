// Dars45 · Amaliyot 02 — Ichki almashinuvchi · 🟢 · choice · tag: par_alternate
// Mexanika: kit.jsx -> Choice. Raskladka: 2-o'rin (isinish).
// Parallel chiziqlarda ichki almashinuvchi burchaklar TENG.
import React from 'react';
import { Choice, L } from '../kit.jsx';

const DATA = {
  tag: 'par_alternate', level: '🟢',
  eyebrow: L('Ichki almashinuvchi', 'Накрест лежащие', 'Alternate angles'),
  setup: L(
    "Kesuvchi parallel chiziqlarni kesganda bir necha juft burchak paydo bo'ladi. Har juftning o'z xossasi bor.",
    'Секущая, пересекая параллельные, создаёт несколько пар углов. У каждой пары своё свойство.',
    'A transversal across parallels makes several angle pairs, each with its own property.'),
  ask: L('Ichki almashinuvchi burchaklar qanday?', 'Каковы накрест лежащие углы?', 'What about alternate angles?'),
  opts: [
    { label: L('Teng', 'Равны', 'Equal') },
    { label: L("Yig'indisi 180°", 'В сумме 180°', 'They add to 180°') },
    { label: L("Bog'liq emas", 'Не связаны', 'Unrelated') },
  ],
  correct: 0,
  correctText: L(
    "To'g'ri. Ichki almashinuvchi burchaklar teng. 180 ga to'ldiradigan juft esa ichki bir tomonli burchaklar.",
    'Верно. Накрест лежащие углы равны. А до 180 дополняют односторонние углы.',
    'Correct. Alternate angles are equal. The pair adding to 180 is the same-side one.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "180 gradus ichki BIR TOMONLI burchaklar uchun. Almashinuvchilar esa teng.",
      '180 градусов для ОДНОСТОРОННИХ углов. А накрест лежащие равны.',
      '180 belongs to SAME-SIDE angles. Alternate ones are equal.') },
    { when: (s) => s.picked === 2, text: L(
      "Bog'liq: chiziqlar parallel bo'lgani uchun burchaklar orasida qat'iy munosabat bor.",
      'Связаны: раз прямые параллельны, между углами есть строгая связь.',
      'They are related: parallel lines force a strict relation.') },
  ],
  wrongText: L(
    "Qaysi juft teng, qaysi biri 180 ga to'ldiradi -- ikkovini ajratish kerak.",
    'Какая пара равна, а какая дополняет до 180 — их надо различать.',
    'Which pair is equal and which adds to 180 — keep them apart.'),
};

export default function D45_02(props) { return <Choice data={DATA} {...props} />; }
