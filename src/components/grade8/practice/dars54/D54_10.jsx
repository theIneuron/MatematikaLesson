// Dars54 · Amaliyot 10 — Chizmalar · 🔴 🖼 · tag: k_to_arrow
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
// Skelet: DARS51_55_AMALIYOT_SKELET.md §6 (54-dars, 10-pozitsiya)
//
// З114 KO'Z BILAN: manfiy koeffitsiyent strelkani teskari buradi.
// Har kadrda a⃗ SIYOH rangida (solishtirish uchun) va natija URG'U
// rangida, ular parallel va yonma-yon turadi — shu sababli uzunlikni
// ham, yo'nalishni ham to'g'ridan-to'g'ri solishtirish mumkin.
// −a va 0,5a yonma-yon turadi: bittasi yo'nalishni, ikkinchisi uzunlikni
// o'zgartiradi, va ularni chalkashtirish oson.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

// Boshlanish nuqtasi kadrning o'rtasida: manfiy koeffitsiyentli strelka
// ham kadrga sig'ishi kerak. a⃗ ning surilishi (24; −13).
// SOLISHTIRUVCHI a⃗ YONMA-YON SURILGAN (o'lchov 2026-08-25): u natija bilan
// bitta nuqtadan chiqsa, 0,5a ning strelkasi a⃗ ning tagida butunlay
// ko'rinmay qolardi — o'quvchi qisqarganini ko'rmasdi.
// KADR KICHRAYTIRILDI (o'lchov 2026-08-25): to'rt kadr ustma-ust turadi,
// va 104px li kadrda ular razbor bilan birga ellik sakkiz pikselgacha
// kadrdan chiqib ketardi. a⃗ ning surilishi (18; −9).
const O = [39, 24];
const F = { fig: 'vec', w: 78, h: 48 };
const REF = { from: [42, 29], to: [60, 20], ref: true, name: 'a' };

const DATA = {
  tag: 'k_to_arrow', level: '🔴',
  connect: true,
  targetSize: 14, itemSize: 16,
  items: [
    { id: 'm1', tokens: ['2a'] },
    { id: 'm2', tokens: ['−a'] },
    { id: 'm3', tokens: ['−2a'] },
    { id: 'm4', tokens: ['0,5a'] },
  ],
  targets: [
    { id: 't1', tokens: [{ ...F, arrows: [REF, { from: O, to: [75, 6] }] }] },
    { id: 't2', tokens: [{ ...F, arrows: [REF, { from: O, to: [21, 33] }] }] },
    { id: 't3', tokens: [{ ...F, arrows: [REF, { from: O, to: [3, 42] }] }] },
    { id: 't4', tokens: [{ ...F, arrows: [REF, { from: O, to: [48, 19.5] }] }] },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Chizmalar', 'Рисунки', 'Drawings'),
  setup: L(
    "To'rt chizma. Har birida a vektori siyoh rangida turibdi, natija esa to'q sariq rangida, va ular yonma-yon parallel chizilgan. Chapdagi to'rt yozuvni mos chizma bilan juftlang.",
    'Четыре рисунка. На каждом вектор a чернильного цвета, а результат оранжевого, и они начерчены рядом, параллельно. Сопоставь четыре записи слева с подходящим рисунком.',
    'Four drawings. In each, the vector a is in ink colour and the result in orange, drawn side by side and parallel. Match the four records on the left with the right drawing.'),
  ask: L(
    "Chapdan yozuvni bosing, keyin o'ngdan chizmani bosing.",
    'Нажми запись слева, потом рисунок справа.',
    'Tap a record on the left, then a drawing on the right.'),
  correctText: L(
    "To'g'ri. Har chizmani ikki savol bilan o'qish kerak edi. Birinchisi: strelka a bilan bir tomongami yoki teskarimi — bu koeffitsiyentning ishorasini beradi. Ikkinchisi: u a dan uzunmi yoki qisqami — bu koeffitsiyentning kattaligini beradi. Ikki karra a uzun va bir tomonda; minus a o'sha uzunlikda, lekin teskari; minus ikki karra a teskari va uzun; nol butun besh karra a esa bir tomonda, lekin qisqa.",
    'Верно. Каждый рисунок надо было прочитать двумя вопросами. Первый: стрелка в ту же сторону, что и a, или в обратную — это даёт знак коэффициента. Второй: она длиннее a или короче — это даёт величину. Два a длинный и в ту же сторону; минус a той же длины, но обратно; минус два a обратно и длинный; ноль целых пять a в ту же сторону, но короткий.',
    'Correct. Each drawing had to be read with two questions. First: does the arrow point the same way as a or the opposite — that gives the sign of the coefficient. Second: is it longer than a or shorter — that gives its size. Two a is long and the same way; minus a is the same length but reversed; minus two a is reversed and long; nought point five a is the same way but short.'),
  wrongs: [
    { when: (s) => s.pair.m2 === 't4' || s.pair.m4 === 't2', text: L(
      "Minus a va nol butun besh karra a o'rin almashdi, va bu ikki chizma ataylab yonma-yon qo'yilgan. Ular ikki BOSHQA narsani o'zgartiradi: minus a uzunlikni saqlaydi va yo'nalishni buradi, nol butun besh karra a esa yo'nalishni saqlaydi va uzunlikni yarimlaydi. Chizmaga qarang: birinchisida strelka a bilan teng, lekin qarshi tomonda; ikkinchisida a bilan bir tomonda, lekin qisqa.",
      'Минус a и ноль целых пять a поменялись местами, и эти два рисунка нарочно поставлены рядом. Они меняют РАЗНОЕ: минус a сохраняет длину и разворачивает направление, а ноль целых пять a сохраняет направление и вдвое укорачивает. Посмотри на рисунок: на первом стрелка равна a, но смотрит навстречу; на втором в ту же сторону, но короткая.',
      'Minus a and nought point five a swapped places, and these two drawings were put side by side on purpose. They change DIFFERENT things: minus a keeps the length and reverses the direction, while nought point five a keeps the direction and halves the length. Look at the drawing: in the first the arrow equals a but faces the other way; in the second it points the same way but is short.') },
    { when: (s) => s.pair.m1 === 't3' || s.pair.m3 === 't1', text: L(
      "Ikki karra a va minus ikki karra a o'rin almashdi. Ularning UZUNLIGI bir xil — ikkalasi ham a dan ikki barobar uzun — shuning uchun uzunlikka qarab ajratib bo'lmaydi. Farq faqat yo'nalishda: minusi borida strelka teskari buriladi.",
      'Два a и минус два a поменялись местами. ДЛИНА у них одинаковая — оба вдвое длиннее a — поэтому по длине их не различить. Различие только в направлении: у того, где минус, стрелка развёрнута.',
      'Two a and minus two a swapped places. Their LENGTH is the same — both are twice as long as a — so length cannot tell them apart. The only difference is direction: the one with the minus has its arrow reversed.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Uchtadan ko'p qator o'z juftini topmadi. Har chizmani ikki bosqichda o'qing: avval yo'nalishga qarang va ishorani aniqlang, keyin uzunlikka qarang va koeffitsiyentning kattaligini aniqlang. Ikkalasini birdaniga ko'rishga urinmang.",
      'Больше трёх строк не нашли пару. Читай каждый рисунок в два приёма: сначала посмотри на направление и определи знак, потом на длину и определи величину. Не пытайся увидеть оба сразу.',
      'More than three rows failed to find their pair. Read each drawing in two passes: first look at the direction and settle the sign, then look at the length and settle the size. Do not try to see both at once.') },
    { when: () => true, text: L(
      "Bitta qator o'z juftini topmadi. Yo'nalish ishorani beradi, uzunlik esa koeffitsiyentning kattaligini.",
      'Одна строка не нашла свою пару. Направление даёт знак, длина даёт величину коэффициента.',
      'One row failed to find its pair. Direction gives the sign, length gives the size of the coefficient.') },
  ],
  wrongText: L(
    "Yo'nalish ishorani beradi, uzunlik koeffitsiyentning kattaligini. Ikkisini alohida o'qing.",
    'Направление даёт знак, длина величину коэффициента. Читай их по отдельности.',
    'Direction gives the sign, length gives the size of the coefficient. Read them separately.'),
};

export default function D54_10(props) { return <MatchPairs data={DATA} {...props} />; }
