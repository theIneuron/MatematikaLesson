// Dars20 · Amaliyot 08 — Ishora hammasini hal qiladi · 🔴 · sort · tag: mul_sign_zones
// Faqat MA'LUMOT. Mexanika: kit.jsx -> Zones. Raskladka: 8-o'rin.
//
// 2a(3a − 4)  = 6a² − 8a
// 2a(3a + 4)  = 6a² + 8a
// −2a(3a − 4) = −6a² + 8a
// Uch yozuvda sonlar bir xil, faqat ishoralar boshqa. Uchinchisi eng nozik:
// ikki minus musbat beradi, shuning uchun ikkinchi had +8a.
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'mul_sign_zones', level: '🔴', itemSize: 21, zoneLbl: 96,
  eyebrow: L('Ishora hal qiladi', 'Решает знак', 'The sign decides'),
  setup: L(
    "Uch ko'paytmada sonlar bir xil, faqat ishoralar farq qiladi. Har birini oxirigacha hisoblang: minuslar sonini sanash kifoya.",
    'В трёх произведениях числа одинаковые, различаются только знаки. Посчитай каждое до конца: достаточно посчитать минусы.',
    'The three products share the same numbers and differ only in signs. Work each out: counting the minuses is enough.'),
  zones: [
    { id: 'zm', label: L('6a² − 8a', '6a² − 8a', '6a² − 8a') },
    { id: 'zp', label: L('6a² + 8a', '6a² + 8a', '6a² + 8a') },
    { id: 'zn', label: L('−6a² + 8a', '−6a² + 8a', '−6a² + 8a') },
  ],
  items: [
    { id: 'i1', tokens: ['2a', '(3a', '−', '4)'], zone: 'zm' },
    { id: 'i2', tokens: ['2a', '(3a', '+', '4)'], zone: 'zp' },
    { id: 'i3', tokens: ['−2a', '(3a', '−', '4)'], zone: 'zn' },
  ],
  ask: L('Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  bank: L("Ko'paytmalar", 'Произведения', 'Products'),
  correctText: L(
    "To'g'ri. Uchinchisida qavs oldida ham, ichida ham minus bor: birinchi had manfiy, ikkinchisi esa ikki minusdan musbat chiqadi.",
    'Верно. В третьем минус и перед скобкой, и внутри: первый член отрицательный, а второй из двух минусов выходит положительным.',
    'Correct. The third has a minus in front and inside: the first term is negative, the second comes out positive from two minuses.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('i3') !== -1, text: L(
      "−2a(3a − 4) da ikkinchi ko'paytma −2a · (−4) = +8a. Ikki minus musbat beradi, shuning uchun javob −6a² + 8a.",
      'В −2a(3a − 4) второе произведение −2a · (−4) = +8a. Два минуса дают плюс, поэтому ответ −6a² + 8a.',
      'In −2a(3a − 4) the second product is −2a · (−4) = +8a. Two minuses give a plus, so the answer is −6a² + 8a.') },
    { when: (s) => s.bad.indexOf('i1') !== -1, text: L(
      "2a(3a − 4) da qavs oldida musbat had: 2a · (−4) = −8a, ya'ni 6a² − 8a.",
      'В 2a(3a − 4) перед скобкой положительный одночлен: 2a · (−4) = −8a, то есть 6a² − 8a.',
      'In 2a(3a − 4) the monomial in front is positive: 2a · (−4) = −8a, so 6a² − 8a.') },
    { when: (s) => s.bad.indexOf('i2') !== -1, text: L(
      "2a(3a + 4) da minus umuman yo'q: ikki ko'paytma ham musbat, 6a² + 8a.",
      'В 2a(3a + 4) минуса нет вовсе: оба произведения положительные, 6a² + 8a.',
      'In 2a(3a + 4) there is no minus at all: both products are positive, 6a² + 8a.') },
  ],
  wrongText: L(
    "Har ko'paytmada minuslarni sanang: bitta minus manfiy beradi, ikkita minus musbat.",
    'В каждом произведении посчитай минусы: один минус даёт отрицательное, два — положительное.',
    'Count the minuses in each product: one gives a negative, two give a positive.'),
};

export default function D20_08(props) { return <Zones data={DATA} {...props} />; }
