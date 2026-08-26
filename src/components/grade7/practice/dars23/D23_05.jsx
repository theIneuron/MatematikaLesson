// Dars23 · Amaliyot 05 — Uch yozuv, uch ko'paytma · 🟡 · sort · tag: group_zones
// Mexanika: kit.jsx -> Zones. Raskladka: 5-o'rin.
// xy + 5x + 2y + 10 = (x + 2)(y + 5)
// xy + 2x + 5y + 10 = (x + 5)(y + 2)
// xy + 5x − 2y − 10 = (x − 2)(y + 5)
// TARTIB SAQLANADI (`noShuffle`): razbor yozuvlarga TARTIB bilan murojaat
// qiladi («ikkinchi tenglamada...»), aralashtirilsa izoh ekrandagiga mos
// kelmay qoladi.
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'group_zones', level: '🟡', noShuffle: true, itemSize: 19, zoneLbl: 104,
  eyebrow: L('Uch ko\'paytma', 'Три произведения', 'Three products'),
  setup: L(
    "Uch yozuvda bir xil sonlar: 2, 5 va 10. Guruhlash natijasi esa har xil chiqadi -- kim qaysi qavsga tushishiga qarab.",
    'В трёх записях одни и те же числа: 2, 5 и 10. А результат группировки разный — зависит от того, что в какую скобку попадёт.',
    'The three records share the numbers 2, 5 and 10. The grouping result differs by which term lands in which bracket.'),
  zones: [
    { id: 'z1', label: L('(x + 2)(y + 5)', '(x + 2)(y + 5)', '(x + 2)(y + 5)') },
    { id: 'z2', label: L('(x + 5)(y + 2)', '(x + 5)(y + 2)', '(x + 5)(y + 2)') },
    { id: 'z3', label: L('(x − 2)(y + 5)', '(x − 2)(y + 5)', '(x − 2)(y + 5)') },
  ],
  items: [
    { id: 'i1', tokens: ['xy', '+', '5x', '+', '2y', '+', '10'], zone: 'z1' },
    { id: 'i2', tokens: ['xy', '+', '2x', '+', '5y', '+', '10'], zone: 'z2' },
    { id: 'i3', tokens: ['xy', '+', '5x', '−', '2y', '−', '10'], zone: 'z3' },
  ],
  ask: L('Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  bank: L('Yozuvlar', 'Записи', 'Records'),
  correctText: L(
    "To'g'ri. Birinchisi: x(y + 5) + 2(y + 5). Ikkinchisi: x(y + 2) + 5(y + 2). Uchinchisida ikkinchi guruhdan −2 chiqadi.",
    'Верно. Первая: x(y + 5) + 2(y + 5). Вторая: x(y + 2) + 5(y + 2). В третьей из второй группы выносится −2.',
    'Correct. First: x(y + 5) + 2(y + 5). Second: x(y + 2) + 5(y + 2). In the third the second group gives −2.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('i3') !== -1, text: L(
      "Uchinchi yozuvda ikkinchi guruh −2y − 10, ya'ni −2(y + 5). Shuning uchun ikkinchi ko'paytuvchi (x − 2).",
      'В третьей записи вторая группа −2y − 10, то есть −2(y + 5). Поэтому второй множитель (x − 2).',
      'In the third record the second group is −2y − 10, that is −2(y + 5). So the factor is (x − 2).') },
    { when: (s) => s.bad.indexOf('i2') !== -1, text: L(
      "Ikkinchi yozuvda x oldida 2 turibdi: x(y + 2) + 5(y + 2), ya'ni (x + 5)(y + 2).",
      'Во второй записи при x стоит 2: x(y + 2) + 5(y + 2), то есть (x + 5)(y + 2).',
      'In the second record x pairs with 2: x(y + 2) + 5(y + 2), giving (x + 5)(y + 2).') },
    { when: (s) => s.bad.indexOf('i1') !== -1, text: L(
      "Birinchi yozuvda x oldida 5 turibdi: x(y + 5) + 2(y + 5), ya'ni (x + 2)(y + 5).",
      'В первой записи при x стоит 5: x(y + 5) + 2(y + 5), то есть (x + 2)(y + 5).',
      'In the first record x pairs with 5: x(y + 5) + 2(y + 5), giving (x + 2)(y + 5).') },
  ],
  wrongText: L(
    "Har yozuvni guruhlab ko'ring: x bilan qaysi son turibdi, qavsda esa nima qoladi?",
    'Сгруппируй каждую запись: какое число стоит при x и что остаётся в скобке?',
    'Group each record: which number sits with x and what stays in the bracket?'),
};

export default function D23_05(props) { return <Zones data={DATA} {...props} />; }
