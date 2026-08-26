// Dars04 · Amaliyot 08 — Har doim tengmi yoki yo'q · 🔴 · sort · tag: id_zones
// Mexanika: kit.jsx -> Zones. Raskladka: 8-o'rin.
// 2(x + 3) va 2x + 6 -> har doim teng
// (x + 1)² va x² + 1 -> har doim teng emas (o'rta had yo'qolgan)
// x + x va 2x -> har doim teng
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'id_zones', level: '🔴', itemSize: 18, zoneLbl: 96,
  eyebrow: L('Har doim tengmi', 'Тождество ли', 'Always equal or not'),
  setup: L(
    "Har juftlikni tekshirish kerak: ular hamma son uchun tengmi? Bitta mos kelmagan son yetadi -- juftlik har doim teng emas.",
    'Каждую пару надо проверить: равны ли они при любом числе? Достаточно одного расхождения — и пара не тождество.',
    'Test each pair: do they agree for every number? One mismatch is enough to disqualify it.'),
  zones: [
    { id: 'zy', label: L('Har doim teng', 'Тождественно равны', 'Always equal') },
    { id: 'zn', label: L('Teng emas', 'Не тождество', 'Not an identity') },
    { id: 'zy2', label: L('Har doim teng (2)', 'Тождество (ещё)', 'Always equal (2)') },
  ],
  items: [
    { id: 'i1', tokens: ['2(x + 3)', L('va', 'и', 'and'), '2x + 6'], zone: 'zy' },
    { id: 'i2', tokens: ['(x + 1)²', L('va', 'и', 'and'), 'x² + 1'], zone: 'zn' },
    { id: 'i3', tokens: ['x + x', L('va', 'и', 'and'), '2x'], zone: 'zy2' },
  ],
  ask: L('Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  bank: L('Juftliklar', 'Пары', 'Pairs'),
  correctText: L(
    "To'g'ri. (x + 1)² = x² + 2x + 1, ya'ni o'rta had yo'qolgan: x = 2 da 9 va 5 chiqadi. Qolgan ikki juftlik esa har doim teng.",
    'Верно. (x + 1)² = x² + 2x + 1, средний член потерян: при x = 2 выходит 9 и 5. Остальные две пары тождественны.',
    'Correct. (x + 1)² = x² + 2x + 1 — the middle term is missing: at x = 2 we get 9 and 5. The other two pairs are identities.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('i2') !== -1, text: L(
      "(x + 1)² da o'rta had bor: x = 2 da chap tomon 9, o'ng tomon esa 5. Bu ayniyat emas.",
      'В (x + 1)² есть средний член: при x = 2 слева 9, справа 5. Это не тождество.',
      '(x + 1)² has a middle term: at x = 2 the left gives 9 and the right 5. Not an identity.') },
    { when: (s) => s.bad.indexOf('i1') !== -1, text: L(
      "2(x + 3) = 2x + 6 -- taqsimot xossasi, har doim teng.",
      '2(x + 3) = 2x + 6 — распределительное свойство, тождество.',
      '2(x + 3) = 2x + 6 — the distributive property, an identity.') },
    { when: (s) => s.bad.indexOf('i3') !== -1, text: L(
      "x + x = 2x -- o'xshash hadlarni ixchamlash, har doim teng.",
      'x + x = 2x — приведение подобных, тождество.',
      'x + x = 2x — collecting like terms, an identity.') },
  ],
  wrongText: L(
    "Har juftlikka x = 2 ni qo'ying va ikki qiymatni solishtiring.",
    'Подставь в каждую пару x = 2 и сравни значения.',
    'Put x = 2 into each pair and compare the values.'),
};

export default function D04_08(props) { return <Zones data={DATA} {...props} />; }
