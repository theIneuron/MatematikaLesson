// Dars32 · Amaliyot 10 — Qisqaradimi yoki yo'q · 🔴 · sort · tag: frac_zones
// Mexanika: kit.jsx -> Zones. Raskladka: 10-o'rin.
// (x² − 16) : (x − 4) = x + 4
// (x² − 16) : (x + 4) = x − 4
// (x² + 16) : (x + 4) -- qisqarmaydi: yig'indi ko'paytuvchilarga ajralmaydi.
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'frac_zones', level: '🔴', itemSize: 18, zoneLbl: 92,
  eyebrow: L('Qisqaradimi', 'Сокращается ли', 'Does it cancel'),
  setup: L(
    "Uch yozuvda 16 turadi. Ikkitasi qisqaradi, bittasi esa yo'q: kvadratlar YIG'INDISI ko'paytuvchilarga ajralmaydi.",
    'В трёх записях есть 16. Две сокращаются, а одна нет: СУММА квадратов на множители не разлагается.',
    'All three hold 16. Two cancel and one does not: a SUM of squares has no factorisation.'),
  zones: [
    { id: 'zp', label: L('x + 4', 'x + 4', 'x + 4') },
    { id: 'zm', label: L('x − 4', 'x − 4', 'x − 4') },
    { id: 'zn', label: L('Qisqarmaydi', 'Не сокращается', 'Does not cancel') },
  ],
  items: [
    { id: 'i1', tokens: ['(x²', '−', '16)', ':', '(x', '−', '4)'], zone: 'zp' },
    { id: 'i2', tokens: ['(x²', '−', '16)', ':', '(x', '+', '4)'], zone: 'zm' },
    { id: 'i3', tokens: ['(x²', '+', '16)', ':', '(x', '+', '4)'], zone: 'zn' },
  ],
  ask: L('Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  bank: L('Yozuvlar', 'Записи', 'Records'),
  correctText: L(
    "To'g'ri. x² − 16 = (x − 4)(x + 4), shuning uchun ikki holatda qisqaradi. x² + 16 esa ajralmaydi.",
    'Верно. x² − 16 = (x − 4)(x + 4), поэтому в двух случаях сокращается. А x² + 16 не разлагается.',
    'Correct. x² − 16 = (x − 4)(x + 4), so two of them cancel. But x² + 16 does not split.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('i3') !== -1, text: L(
      "x² + 16 kvadratlar YIG'INDISI: uni ko'paytuvchilarga ajratib bo'lmaydi, ya'ni qisqartirish ham yo'q.",
      'x² + 16 это СУММА квадратов: на множители она не разлагается, значит и сокращения нет.',
      'x² + 16 is a SUM of squares: it does not factorise, so there is nothing to cancel.') },
    { when: (s) => s.bad.indexOf('i1') !== -1, text: L(
      "(x − 4) qisqarsa (x + 4) qoladi.",
      'Если сокращается (x − 4), остаётся (x + 4).',
      'If (x − 4) cancels, (x + 4) remains.') },
    { when: (s) => s.bad.indexOf('i2') !== -1, text: L(
      "(x + 4) qisqarsa (x − 4) qoladi.",
      'Если сокращается (x + 4), остаётся (x − 4).',
      'If (x + 4) cancels, (x − 4) remains.') },
  ],
  wrongText: L(
    "Har bo'linuvchini ajratib ko'ring: ayirma ajraladi, yig'indi esa yo'q.",
    'Попробуй разложить каждое делимое: разность разлагается, а сумма нет.',
    'Try factorising each dividend: a difference splits, a sum does not.'),
};

export default function D32_10(props) { return <Zones data={DATA} {...props} />; }
