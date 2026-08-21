// Dars27 · Amaliyot 06 — Uch yozuv · 🟡 · sort · tag: cube_zones
// Mexanika: kit.jsx -> Zones. Raskladka: 6-o'rin.
// x³ + 9x² + 27x + 27 = (x + 3)³
// x³ − 9x² + 27x − 27 = (x − 3)³   (ishoralar navbatlashadi)
// x² + 6x + 9         = (x + 3)²
import React from 'react';
import { Zones, L } from '../kit.jsx';

const DATA = {
  tag: 'cube_zones', level: '🟡', itemSize: 18, zoneLbl: 84,
  eyebrow: L('Qaysi yozuv', 'Какая запись', 'Which record'),
  setup: L(
    "Uch yozuv berilgan: ikkitasi kub, bittasi kvadrat. Kubda to'rt had, kvadratda uch had bo'ladi.",
    'Даны три записи: две это кубы, одна квадрат. В кубе четыре члена, в квадрате три.',
    'Three records: two cubes and one square. A cube has four terms, a square three.'),
  zones: [
    { id: 'zp', label: L('(x + 3)³', '(x + 3)³', '(x + 3)³') },
    { id: 'zm', label: L('(x − 3)³', '(x − 3)³', '(x − 3)³') },
    { id: 'zs', label: L('(x + 3)²', '(x + 3)²', '(x + 3)²') },
  ],
  items: [
    { id: 'i1', tokens: ['x³', '+', '9x²', '+', '27x', '+', '27'], zone: 'zp' },
    { id: 'i2', tokens: ['x³', '−', '9x²', '+', '27x', '−', '27'], zone: 'zm' },
    { id: 'i3', tokens: ['x²', '+', '6x', '+', '9'], zone: 'zs' },
  ],
  ask: L('Kartani bosing, keyin zonani bosing. Zonadagi kartani bosish uni qaytarib oladi.',
    'Нажми карточку, затем зону. Нажатие на карточку в зоне возвращает её обратно.',
    'Tap a card, then tap a zone. Tapping a card inside a zone takes it back.'),
  bank: L('Yozuvlar', 'Записи', 'Records'),
  correctText: L(
    "To'g'ri. Ayirmaning kubida ishoralar navbatlashadi: plyus, minus, plyus, minus. Uch hadli yozuv esa kvadrat.",
    'Верно. В кубе разности знаки чередуются: плюс, минус, плюс, минус. А запись из трёх членов это квадрат.',
    'Correct. In the cube of a difference the signs alternate: plus, minus, plus, minus. The three-term record is a square.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('i2') !== -1, text: L(
      "Ishoralari navbatlashgan yozuv AYIRMANING kubi: (x − 3)³ = x³ − 9x² + 27x − 27.",
      'Запись с чередующимися знаками это куб РАЗНОСТИ: (x − 3)³ = x³ − 9x² + 27x − 27.',
      'The record with alternating signs is the cube of a DIFFERENCE: (x − 3)³.') },
    { when: (s) => s.bad.indexOf('i3') !== -1, text: L(
      "Uch hadli yozuv kub bo'lolmaydi: kubda to'rt had bo'ladi. Bu (x + 3)².",
      'Запись из трёх членов не может быть кубом: в кубе четыре члена. Это (x + 3)².',
      'A three-term record cannot be a cube: a cube has four terms. This is (x + 3)².') },
    { when: (s) => s.bad.indexOf('i1') !== -1, text: L(
      "Hamma ishorasi plyus bo'lgan to'rt hadli yozuv -- yig'indining kubi.",
      'Запись из четырёх членов со всеми плюсами это куб суммы.',
      'A four-term record with all pluses is the cube of a sum.') },
  ],
  wrongText: L(
    "Har yozuvda hadlar sonini va ishoralarni sanang.",
    'В каждой записи посчитай число членов и посмотри на знаки.',
    'Count the terms in each record and look at the signs.'),
};

export default function D27_06(props) { return <Zones data={DATA} {...props} />; }
