// Dars18 · Amaliyot 10 — Turi ixchamlashdan KEYIN · 🔴 · sort · tag: poly_kind_zones
// Faqat MA'LUMOT. Mexanika: kit.jsx -> Zones. Raskladka: 10-o'rin.
//
// Tur standart shakldagi hadlar soniga qarab aytiladi, ya'ni AVVAL ixchamlash:
//   2x² + 5x − 2x²  -> 5x            bir had   (uch hadga o'xshab turadi)
//   4a³ − a + 2a    -> 4a³ + a       ikki had
//   y² + 3y − 7     -> o'zgarmaydi   uch had
// Birinchisi ataylab: ko'z bilan uch had, hisoblab bir had.
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'poly_kind_zones', level: '🔴', itemSize: 20, zoneLbl: 104,
  eyebrow: L('Turi qanday', 'Какой вид', 'Which kind'),
  setup: L(
    "Tur hadlar soniga qarab aytiladi, lekin avval o'xshash hadlar ixchamlanadi. Yozuvning ko'rinishi aldashi mumkin.",
    'Вид называют по числу членов, но сначала приводят подобные. Внешний вид записи может обмануть.',
    'The kind is named by the number of terms, but like terms are collected first. The look of a record can mislead.'),
  zones: [
    { id: 'z1', label: L('Bir had', 'Одночлен', 'Monomial') },
    { id: 'z2', label: L('Ikki had', 'Двучлен', 'Binomial') },
    { id: 'z3', label: L('Uch had', 'Трёхчлен', 'Trinomial') },
  ],
  items: [
    { id: 'i1', tokens: ['2x²', '+', '5x', '−', '2x²'], zone: 'z1' },
    { id: 'i2', tokens: ['4a³', '−', 'a', '+', '2a'], zone: 'z2' },
    { id: 'i3', tokens: ['y²', '+', '3y', '−', '7'], zone: 'z3' },
  ],
  ask: L('Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  bank: L('Yozuvlar', 'Записи', 'Records'),
  correctText: L(
    "To'g'ri. Birinchisida 2x² va −2x² yo'qoladi, 5x qoladi -- bir had. Ikkinchisida −a + 2a = a, ya'ni ikki had. Uchinchisida ixchamlanadigan had yo'q.",
    'Верно. В первой 2x² и −2x² уничтожаются, остаётся 5x — одночлен. Во второй −a + 2a = a, значит двучлен. В третьей приводить нечего.',
    'Correct. In the first, 2x² and −2x² cancel and 5x remains — a monomial. In the second, −a + 2a = a, so a binomial. The third has nothing to collect.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('i1') !== -1, text: L(
      "Birinchi yozuvda 2x² va −2x² bir-birini yo'qotadi: 2 − 2 = 0. Faqat 5x qoladi, ya'ni bir had.",
      'В первой записи 2x² и −2x² уничтожают друг друга: 2 − 2 = 0. Остаётся только 5x, то есть одночлен.',
      'In the first record 2x² and −2x² cancel: 2 − 2 = 0. Only 5x remains, a monomial.') },
    { when: (s) => s.bad.indexOf('i2') !== -1, text: L(
      "Ikkinchi yozuvda −a va 2a o'xshash: −1 + 2 = 1, ya'ni a. Qoladi 4a³ + a -- ikki had.",
      'Во второй записи −a и 2a подобны: −1 + 2 = 1, то есть a. Остаётся 4a³ + a — двучлен.',
      'In the second record −a and 2a are alike: −1 + 2 = 1, that is a. What remains is 4a³ + a — a binomial.') },
    { when: (s) => s.bad.indexOf('i3') !== -1, text: L(
      "Uchinchi yozuvda o'xshash had yo'q: y², 3y va 7 -- uchtasi ham boshqa. Ya'ni uch had.",
      'В третьей записи подобных нет: y², 3y и 7 — все разные. Значит трёхчлен.',
      'The third record has no like terms: y², 3y and 7 are all different. So a trinomial.') },
  ],
  wrongText: L(
    "Har yozuvni avval ixchamlang, keyin qolgan hadlarni sanang.",
    'Сначала приведи каждую запись, потом посчитай оставшиеся члены.',
    'Collect like terms in each record first, then count what is left.'),
};

export default function D18_10(props) { return <Zones data={DATA} {...props} />; }
