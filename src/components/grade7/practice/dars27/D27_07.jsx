// Dars27 · Amaliyot 07 — Ayirmaning kubi · 🟡 · build · tag: cube_diff
// Mexanika: kit.jsx -> BuildLine. Raskladka: 7-o'rin.
// (n − 3)³ = n³ − 9n² + 27n − 27. Ishoralar navbatlashadi.
import React from 'react';
import { BuildLine, L } from '../kit.jsx';

const DATA = {
  tag: 'cube_diff', level: '🟡',
  eyebrow: L('Ayirmaning kubi', 'Куб разности', 'Cube of a difference'),
  setup: L(
    "Ayirma kubga ko'tarilganda ishoralar navbatlashadi: plyus, minus, plyus, minus. Oxirgi had manfiy, chunki (−3)³ = −27.",
    'При возведении разности в куб знаки чередуются: плюс, минус, плюс, минус. Последний член отрицательный, ведь (−3)³ = −27.',
    'Cubing a difference alternates the signs: plus, minus, plus, minus. The last term is negative since (−3)³ = −27.'),
  expr: ['(n', '−', '3)³'], exprSize: 34,
  cards: [
    { id: 'a', label: 'n³' },
    { id: 'b', label: '−9n²' },
    { id: 'c', label: '+27n' },
    { id: 'd', label: '−27' },
    { id: 'e', label: '+9n²' },
    { id: 'f', label: '+27' },
  ],
  answerSeq: ['a', 'b', 'c', 'd'],
  empty: L("Kartalarni bosib javobni tuzing", 'Нажимай карточки и собери ответ', 'Tap the cards to build the answer'),
  ask: L('Kartani bosish uni chiziqqa qo\'yadi.', 'Нажатие на карточку ставит её в строку.', 'Tapping a card puts it in the line.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. n³ − 9n² + 27n − 27: uchinchi had musbat, chunki (−3)² = +9 ga ko'paytiriladi.",
    'Верно. n³ − 9n² + 27n − 27: третий член положительный, ведь умножается на (−3)² = +9.',
    'Correct. n³ − 9n² + 27n − 27: the third term is positive because (−3)² = +9.'),
  wrongs: [
    { when: (s) => s.seq.indexOf('e') !== -1, text: L(
      "Ikkinchi had manfiy: 3 · n² · (−3) = −9n².",
      'Второй член отрицательный: 3 · n² · (−3) = −9n².',
      'The second term is negative: 3 · n² · (−3) = −9n².') },
    { when: (s) => s.seq.indexOf('f') !== -1, text: L(
      "Oxirgi had manfiy: (−3)³ = −27, chunki toq daraja ishorani saqlaydi.",
      'Последний член отрицательный: (−3)³ = −27, ведь нечётная степень сохраняет знак.',
      'The last term is negative: (−3)³ = −27, since an odd power keeps the sign.') },
    { when: (s) => s.seq.length < 4, text: L(
      "Kubda to'rt had bo'ladi.",
      'В кубе четыре члена.',
      'A cube has four terms.') },
  ],
  wrongText: L(
    "Har hadda (−3) ning darajasi ortadi: 0, 1, 2, 3. Toq darajada ishora manfiy, juftda musbat.",
    'В каждом члене степень (−3) растёт: 0, 1, 2, 3. При нечётной знак минус, при чётной плюс.',
    'The power of (−3) grows: 0, 1, 2, 3. Odd powers are negative, even ones positive.'),
};

export default function D27_07(props) { return <BuildLine data={DATA} {...props} />; }
