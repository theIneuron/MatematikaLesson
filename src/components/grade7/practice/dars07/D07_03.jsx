// Dars07 · Amaliyot 03 — Uchlik hamma joyda ildizmi · 🟡 · tag: root_for_which
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
//
// x = 3 ni oltita tenglamaga qo'yib tekshiramiz:
//   2x + 1 = 7    -> 6 + 1 = 7      HA
//   x − 5 = −2    -> 3 − 5 = −2     HA
//   4x = 12       -> 12 = 12        HA
//   x + 3 = 3     -> 6 va 3         yo'q
//   5x − 1 = 15   -> 14 va 15       yo'q  (bir birlik yetmadi -- ataylab)
//   x · x = 6     -> 9 va 6         yo'q  (x · x ni x + x deb o'qish xatosi)
// 5x − 1 = 15 ATAYLAB juda yaqin: «taxminan to'g'ri» degan javob bo'lmaydi,
// tenglik AYNAN bajarilishi kerak.
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'root_for_which', level: '🟡', col: 165, itemSize: 21,
  eyebrow: L('Ildiz qaysi tenglamada', 'Где корень', 'Where the root fits'),
  setup: L(
    "Bitta son bir tenglamaning ildizi bo'lib, boshqasining ildizi bo'lmasligi mumkin. Har birini alohida tekshirish kerak.",
    'Одно и то же число может быть корнем одного уравнения и не быть корнем другого. Каждое надо проверять отдельно.',
    'The same number can be a root of one equation and not of another. Each must be checked on its own.'),
  given: [['x', '=', '3']],
  givenLabel: L('Tekshirilayotgan son:', 'Проверяемое число:', 'The number to test:'),
  ask: L('x = 3 ILDIZ bo\'lgan hamma tenglamani belgilang.', 'Отметь все уравнения, для которых x = 3 является КОРНЕМ.', 'Mark every equation for which x = 3 is a ROOT.'),
  note: L("Bir nechta bo'lishi mumkin.", 'Их может быть несколько.', 'There can be several.'),
  items: [
    { id: 'p1', tokens: ['2x', '+', '1', '=', '7'], hit: true },
    { id: 'n1', tokens: ['x', '+', '3', '=', '3'], hit: false },
    { id: 'p2', tokens: ['x', '−', '5', '=', '−2'], hit: true },
    { id: 'n2', tokens: ['5x', '−', '1', '=', '15'], hit: false },
    { id: 'p3', tokens: ['4x', '=', '12'], hit: true },
    { id: 'n3', tokens: ['x', '·', 'x', '=', '6'], hit: false },
  ],
  correctText: L(
    "To'g'ri. Uchta tenglamada chap tomon o'ng tomonga aynan teng chiqdi: 7 = 7, −2 = −2, 12 = 12.",
    'Верно. В трёх уравнениях левая часть точно совпала с правой: 7 = 7, −2 = −2, 12 = 12.',
    'Correct. In three equations the left side matched the right exactly: 7 = 7, −2 = −2, 12 = 12.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('n2') !== -1, text: L(
      "5x − 1 = 15 da x = 3 bo'lsa 14 chiqadi, o'ng tomonda esa 15. Bir birlik farq ham tenglikni buzadi: «yaqin» degan javob yo'q.",
      'В 5x − 1 = 15 при x = 3 выходит 14, а справа 15. Даже разница в единицу ломает равенство: ответа «почти» не бывает.',
      'In 5x − 1 = 15 with x = 3 the left side is 14 while the right is 15. Even a difference of one breaks it: there is no "almost".') },
    { when: (s) => s.extra.indexOf('n3') !== -1, text: L(
      "x · x = 6 da x = 3 bo'lsa 3 · 3 = 9, 6 emas. Ko'paytirish qo'shish bilan aralashib ketgan.",
      'В x · x = 6 при x = 3 выходит 3 · 3 = 9, а не 6. Умножение спутано со сложением.',
      'In x · x = 6 with x = 3 you get 3 · 3 = 9, not 6. Multiplication got mixed up with addition.') },
    { when: (s) => s.extra.indexOf('n1') !== -1, text: L(
      "x + 3 = 3 da x = 3 bo'lsa 6 chiqadi. Bu tenglamaning ildizi 0 bo'ladi.",
      'В x + 3 = 3 при x = 3 выходит 6. У этого уравнения корень 0.',
      'In x + 3 = 3 with x = 3 you get 6. The root of that equation is 0.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Bittasi belgilanmadi: uchtasida tenglik aynan bajariladi, ularni qayta hisoblab ko'ring.",
      'Одно пропустил: в трёх уравнениях равенство выполняется точно, пересчитай их.',
      'One is missing: in three equations the equality holds exactly, work them out again.') },
  ],
  wrongText: L(
    "Har tenglamaga 3 ni qo'yib chap tomonni hisoblang va o'ng tomon bilan solishtiring.",
    'Подставь 3 в каждое уравнение, посчитай левую часть и сравни с правой.',
    'Put 3 into each equation, work out the left side and compare it with the right.'),
};

export default function D07_03(props) { return <MarkAll data={DATA} {...props} />; }
