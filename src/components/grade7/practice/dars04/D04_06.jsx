// Dars04 · Amaliyot 06 — Xato o'zgartirish · 🟡 · fix · tag: id_fix
// Mexanika: kit.jsx -> TapTerms. Raskladka: 6-o'rin.
// Uch yozuvdan biri har doim teng emas: 5(a − 2) = 5a − 2 (ikkinchi had
// ko'paytirilmagan; to'g'risi 5a − 10).
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'id_fix', level: '🟡',
  eyebrow: L('Xato o\'zgartirish', 'Неверное преобразование', 'The wrong transformation'),
  setup: L(
    "Uch o'zgartirishdan biri har doim teng emas. Har birini son bilan tekshirish mumkin: a = 3 qo'yib ko'ring.",
    'Одно из трёх преобразований не тождественное. Каждое можно проверить числом: подставь a = 3.',
    'One of the three is not an identity. Each can be checked with a = 3.'),
  ask: L("AYNIY BO'LMAGAN o'zgartirishni belgilang.", 'Отметь НЕ тождественное преобразование.', 'Mark the one that is NOT an identity.'),
  note: L('Bitta yozuv.', 'Одна запись.', 'One record.'),
  parts: [
    { k: 'term', id: 't1', v: '3(a + 4) = 3a + 12' },
    { k: 'sign', v: ' ' },
    { k: 'term', id: 't2', v: '5(a − 2) = 5a − 2' },
    { k: 'sign', v: ' ' },
    { k: 'term', id: 't3', v: '2a + 2b = 2(a + b)' },
  ],
  want: ['t2'],
  correctText: L(
    "To'g'ri. 5(a − 2) = 5a − 10, chunki 5 ikkinchi hadga ham ko'paytiriladi. a = 3 da chap tomon 5, o'ng tomon esa 13.",
    'Верно. 5(a − 2) = 5a − 10, ведь 5 умножается и на второй член. При a = 3 слева 5, а справа 13.',
    'Correct. 5(a − 2) = 5a − 10, since the 5 meets the second term too. At a = 3 the left gives 5 and the right 13.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('t1') !== -1, text: L(
      "3(a + 4) = 3a + 12 to'g'ri: 3 ikki hadga ham ko'paytirilgan.",
      '3(a + 4) = 3a + 12 верно: 3 умножено на оба члена.',
      '3(a + 4) = 3a + 12 is right: the 3 met both terms.') },
    { when: (s) => s.extra.indexOf('t3') !== -1, text: L(
      "2a + 2b = 2(a + b) ham to'g'ri: bu qavsga olish, teskari yo'nalish.",
      '2a + 2b = 2(a + b) тоже верно: это вынесение множителя, обратное направление.',
      '2a + 2b = 2(a + b) is right too: taking the factor out, the reverse direction.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Har yozuvda ko'paytuvchi qavs ichidagi hamma hadga tegdimi -- shuni tekshiring.",
      'Проверь в каждой записи: множитель дошёл до всех членов скобки?',
      'Check each record: did the factor reach every term?') },
  ],
  wrongText: L(
    "a = 3 ni har yozuvning ikki tomoniga qo'ying va natijalarni solishtiring.",
    'Подставь a = 3 в обе части каждой записи и сравни результаты.',
    'Put a = 3 into both sides of each record and compare.'),
};

export default function D04_06(props) { return <TapTerms data={DATA} {...props} />; }
