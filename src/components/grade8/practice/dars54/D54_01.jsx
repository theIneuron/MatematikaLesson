// Dars54 · Amaliyot 01 — Kollinear · 🟢 · tag: collinear_marked
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Skelet: DARS51_55_AMALIYOT_SKELET.md §6 (54-dars, 1-pozitsiya)
//
// T2 NING BIRINCHI YARMI: songa ko'paytirish yo'nalishni saqlaydi yoki
// teskari buradi, lekin YANGI yo'nalish yaratmaydi. Manfiy koeffitsiyent
// kollinearlikni buzmaydi — bu ataylab birinchi topshiriqda turibdi.
// Rad etilganlar: b⃗ va 2b⃗ boshqa vektordan, a⃗+b⃗ esa qo'shishdan chiqadi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'collinear_marked', level: '🟢',
  col: 84, itemSize: 16,
  given: [[{
    fig: 'vec', w: 76, h: 50,
    arrows: [
      { from: [8, 40], to: [34, 16], name: 'a' },
      { from: [44, 42], to: [70, 30], ref: true, name: 'b' },
    ],
  }]],
  givenLabel: L('Vektorlar', 'Векторы', 'The vectors'),
  items: [
    { id: 'i1', hit: true, tokens: ['3a'] },
    { id: 'i2', tokens: ['b'] },
    { id: 'i3', hit: true, tokens: ['−2a'] },
    { id: 'i4', tokens: ['a + b'] },
    { id: 'i5', hit: true, tokens: ['0,5a'] },
    { id: 'i6', tokens: ['2b'] },
  ],
  eyebrow: L('Kollinear', 'Коллинеарные', 'Collinear'),
  setup: L(
    "a va b — ikki turli yo'nalishdagi vektor. Oltita yozuvdan uchtasi a ga KOLLINEAR, ya'ni u bilan bir chiziqda yotadi. Songa ko'paytirish vektorni cho'zadi yoki qisqartiradi va kerak bo'lsa teskari buradi, lekin yo'nalishning chizig'ini o'zgartirmaydi.",
    'a и b — два вектора разного направления. Из шести записей три КОЛЛИНЕАРНЫ a, то есть лежат с ним на одной прямой. Умножение на число растягивает или сжимает вектор и при надобности разворачивает, но линию направления не меняет.',
    'a and b are two vectors of different directions. Of the six records three are COLLINEAR with a, that is, they lie along the same line as it. Multiplying by a number stretches or shrinks a vector and reverses it when needed, but it does not change the line of direction.'),
  ask: L(
    "a ga kollinear bo'lgan 3 ta yozuvni belgilang.",
    'Отметь 3 записи, коллинеарные a.',
    'Mark the 3 records collinear with a.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Uchala javobda ham a bitta songa ko'paytirilgan, va bu yetarli: k karra a har doim a ga kollinear, k qanday bo'lishidan qat'i nazar. Uch karra a uzunroq, nol butun besh karra a qisqaroq, minus ikki karra a esa teskari yo'nalgan — lekin uchalasi ham o'sha chiziqda yotadi. Manfiy koeffitsiyent kollinearlikni buzmaydi, u faqat strelkani buradi.",
    'Верно. Во всех трёх ответах a умножен на одно число, и этого достаточно: k умножить на a всегда коллинеарен a, каким бы ни было k. Три a длиннее, ноль целых пять a короче, минус два a направлен обратно — но все три лежат на той же прямой. Отрицательный коэффициент коллинеарность не нарушает, он лишь разворачивает стрелку.',
    'Correct. In all three answers a is multiplied by a single number, and that is enough: k times a is always collinear with a, whatever k may be. Three a is longer, nought point five a is shorter, minus two a points backwards — yet all three lie along the same line. A negative coefficient does not break collinearity, it only turns the arrow around.'),
  wrongs: [
    { when: (s) => s.miss.indexOf('i3') !== -1, text: L(
      "Minus ikki karra a belgilanmay qoldi. Manfiy koeffitsiyent strelkani teskari buradi, lekin uni O'SHA chiziqda qoldiradi — kollinearlik yo'nalishning chizig'i haqida, tomon haqida emas. Teskari yo'nalgan vektor ham kollinear bo'ladi.",
      'Минус два a осталось неотмеченным. Отрицательный коэффициент разворачивает стрелку, но оставляет её на ТОЙ ЖЕ прямой — коллинеарность о линии направления, а не о том, в какую сторону. Вектор, направленный обратно, тоже коллинеарен.',
      'Minus two a was left unmarked. A negative coefficient turns the arrow around but leaves it on the SAME line — collinearity is about the line of direction, not about which way along it. A vector pointing backwards is collinear too.') },
    { when: (s) => s.extra.indexOf('i4') !== -1, text: L(
      "a qo'shuv b kollinear emas. Bu ikki BOSHQA yo'nalishdagi vektorning yig'indisi, va uchburchak qoidasi bo'yicha u ikkalasidan ham chetga chiqadi — yangi yo'nalish paydo bo'ladi. Kollinearlik esa faqat BITTA vektorni songa ko'paytirganda saqlanadi.",
      'a плюс b не коллинеарен. Это сумма двух векторов РАЗНОГО направления, и по правилу треугольника она уходит в сторону от обоих — появляется новое направление. А коллинеарность сохраняется только при умножении ОДНОГО вектора на число.',
      'a plus b is not collinear. It is the sum of two vectors of DIFFERENT directions, and by the triangle rule it goes off to the side of both — a new direction appears. Collinearity is kept only when ONE vector is multiplied by a number.') },
    { when: (s) => s.extra.indexOf('i2') !== -1 || s.extra.indexOf('i6') !== -1, text: L(
      "b va ikki karra b a ga kollinear emas: ular boshqa vektordan chiqqan. Ikki karra b b ga kollinear, lekin a ga emas. Belgilashdan oldin bitta savol bering: yozuvda AYNAN a turibdimi.",
      'b и два b не коллинеарны a: они выходят из другого вектора. Два b коллинеарен b, но не a. Прежде чем отмечать, задай один вопрос: стоит ли в записи ИМЕННО a.',
      'b and two b are not collinear with a: they come from a different vector. Two b is collinear with b, but not with a. Before marking, ask one question: does the record contain a itself.') },
  ],
  wrongText: L(
    "Faqat a songa ko'paytirilgan yozuvlar kollinear. Koeffitsiyentning ishorasi ahamiyatsiz.",
    'Коллинеарны только записи, где a умножен на число. Знак коэффициента не важен.',
    'Only records where a is multiplied by a number are collinear. The sign of the coefficient does not matter.'),
};

export default function D54_01(props) { return <MarkAll data={DATA} {...props} />; }
