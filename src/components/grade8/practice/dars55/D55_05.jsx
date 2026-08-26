// Dars55 · Amaliyot 05 — Pazl · 🟡 🖼 · tag: op_to_coords
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Skelet: DARS51_55_AMALIYOT_SKELET.md §7 (55-dars, 5-pozitsiya)
//
// T2: amal HAR koordinata ustida alohida bajariladi.
//   a(2;3), b(3;4):  a+b = (5;7),  a−b = (−1;−1),  2a = (4;6)
// Ayirmada ikkala koordinata ham manfiy chiqadi, va bu tasodif emas:
// b ning ikkala koordinatasi ham a nikidan katta.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'op_to_coords', level: '🟡',
  faceSize: 15, faceSizePhone: 13,
  given: [[{
    fig: 'vec', w: 60, h: 56,
    grid: { x: [-1, 5], y: [-1, 5] },
    arrows: [
      { from: [0, 0], to: [2, 3], name: 'a' },
      { from: [0, 0], to: [3, 4], ref: true, name: 'b' },
    ],
  }]],
  givenLabel: L('Chizma', 'Рисунок', 'The drawing'),
  cards: [
    { id: 'f1', side: 0, tokens: ['a + b'] },
    { id: 'f2', side: 0, tokens: ['a − b'] },
    { id: 'f3', side: 0, tokens: ['2a'] },
    { id: 'v1', side: 1, v: '(5; 7)' },
    { id: 'v2', side: 1, v: '(−1; −1)' },
    { id: 'v3', side: 1, v: '(4; 6)' },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "a ning koordinatalari ikki va uch, b niki uch va to'rt; chizmada ikkalasi koordinata boshidan chiqqan. Har amal koordinatalar ustida ALOHIDA bajariladi: birinchisi birinchi bilan, ikkinchisi ikkinchi bilan.",
    'У a координаты два и три, у b три и четыре; на рисунке оба выходят из начала координат. Каждое действие выполняется над координатами ОТДЕЛЬНО: первая с первой, вторая со второй.',
    'a has coordinates two and three, b has three and four; in the drawing both leave the origin. Each operation is done on the coordinates SEPARATELY: the first with the first, the second with the second.'),
  ask: L(
    'Amalni bosing, keyin uyani bosing.',
    'Нажми действие, потом ячейку.',
    'Tap an operation, then a slot.'),
  bank: L('Amallar', 'Действия', 'Operations'),
  correctText: L(
    "To'g'ri. Uch amal ham koordinatalar ustida alohida bajarildi. Qo'shishda: ikki qo'shuv uch besh, uch qo'shuv to'rt yetti. Ayirishda: ikki ayirmoq uch minus bir, uch ayirmoq to'rt ham minus bir. Songa ko'paytirishda: ikki karra ikki to'rt, ikki karra uch olti. Ayirmada ikkala koordinata ham manfiy chiqdi, va bu tasodif emas: b ning ikkala koordinatasi ham a nikidan katta, ya'ni b uzoqroqqa boradi.",
    'Верно. Все три действия выполнены над координатами по отдельности. При сложении: два плюс три пять, три плюс четыре семь. При вычитании: два минус три минус один, три минус четыре тоже минус один. При умножении на число: два на два четыре, два на три шесть. В разности обе координаты вышли отрицательными, и это не случайность: обе координаты b больше, чем у a, то есть b уходит дальше.',
    'Correct. All three operations were done on the coordinates separately. In the addition: two plus three is five, three plus four is seven. In the subtraction: two minus three is minus one, three minus four is also minus one. In the multiplication: two times two is four, two times three is six. In the difference both coordinates came out negative, and that is no accident: both coordinates of b are larger than those of a, so b reaches further.'),
  wrongs: [
    { when: (s) => s.mate.f2 !== 'v2', text: L(
      "Ayirma mos kelmadi. Ayirishda tartibga diqqat qiling: a ayirmoq b degani a ning koordinatasidan b nikini ayirish. Ikki ayirmoq uch minus bir, uch ayirmoq to'rt minus bir. Agar teskari qilsangiz, ikkala son ham musbat chiqadi va bu b ayirmoq a bo'lardi.",
      'Разность не подошла. При вычитании следи за порядком: a минус b означает из координаты a вычесть координату b. Два минус три минус один, три минус четыре минус один. Если сделать наоборот, оба числа выйдут положительными, и это будет b минус a.',
      'The difference did not fit. In subtraction watch the order: a minus b means subtracting b coordinates from a coordinates. Two minus three is minus one, three minus four is minus one. Done the other way both numbers come out positive, and that would be b minus a.') },
    { when: (s) => s.mate.f3 !== 'v3', text: L(
      "Ikki karra a mos kelmadi. Songa ko'paytirganda koeffitsiyent IKKALA koordinataga ham tegadi: ikki karra ikki to'rt, ikki karra uch olti. Faqat birinchisini ko'paytirish tipik xato — sonlarda ham, vektorlarda ham.",
      'Два a не подошло. При умножении на число коэффициент достаётся ОБЕИМ координатам: два на два четыре, два на три шесть. Умножить только первую — типичная ошибка, и с числами, и с векторами.',
      'Two a did not fit. When multiplying by a number the coefficient reaches BOTH coordinates: two times two is four, two times three is six. Multiplying only the first is a typical error, with numbers as with vectors.') },
    { when: () => true, text: L(
      "Har amalni ikki marta bajaring: bir marta birinchi koordinatalar bilan, bir marta ikkinchilari bilan. Ikki natija juftlikni beradi.",
      'Каждое действие выполняй дважды: один раз с первыми координатами, один раз со вторыми. Два результата и дают пару.',
      'Do each operation twice: once with the first coordinates, once with the second. The two results make the pair.') },
  ],
  wrongText: L(
    "Amal har koordinata ustida alohida bajariladi: birinchi bilan birinchi, ikkinchi bilan ikkinchi.",
    'Действие выполняется над каждой координатой отдельно: первая с первой, вторая со второй.',
    'The operation is done on each coordinate separately: the first with the first, the second with the second.'),
};

export default function D55_05(props) { return <PairSlots data={DATA} {...props} />; }
