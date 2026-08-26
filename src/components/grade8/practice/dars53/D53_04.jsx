// Dars53 · Amaliyot 04 — Juftlash · 🟡 · tag: expr_to_vector
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
// Skelet: DARS51_55_AMALIYOT_SKELET.md §5 (53-dars, 4-pozitsiya)
//
// З113 NING ENG ANIQ JOYI: ikkinchi va uchinchi qator yonma-yon turadi va
// faqat TARTIB bilan farq qiladi.
//   OA − OB = BA        OB − OA = AB
// To'rtinchisi nol vektor: qarama-qarshi vektorlarning yig'indisi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const DATA = {
  tag: 'expr_to_vector', level: '🟡',
  connect: true,
  targetSize: 20, itemSize: 15,
  items: [
    { id: 'm1', tokens: ['AB + BC'] },
    { id: 'm2', tokens: ['OA − OB'] },
    { id: 'm3', tokens: ['OB − OA'] },
    { id: 'm4', tokens: ['AB + BA'] },
  ],
  targets: [
    { id: 't1', tokens: ['AC'] },
    { id: 't2', tokens: ['BA'] },
    { id: 't3', tokens: ['AB'] },
    { id: 't4', tokens: ['0'] },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Juftlash', 'Сопоставление', 'Matching'),
  setup: L(
    "To'rt ifoda. Birinchisida uchburchak qoidasi, keyingi ikkitasida bitta nuqtadan chiqqan ikki vektorning ayirmasi, oxirgisida esa qarama-qarshi vektorlarning yig'indisi. Diqqat: o'rtadagi ikki ifoda faqat TARTIB bilan farq qiladi.",
    'Четыре выражения. В первом правило треугольника, в следующих двух разность двух векторов из одной точки, в последнем сумма противоположных векторов. Внимание: два средних выражения различаются только ПОРЯДКОМ.',
    'Four expressions. The first is the triangle rule, the next two are the difference of two vectors from one point, and the last is the sum of opposite vectors. Note: the two middle expressions differ only in ORDER.'),
  ask: L(
    "Chapdan ifodani bosing, keyin o'ngdan natijani bosing.",
    'Нажми выражение слева, потом результат справа.',
    'Tap an expression on the left, then the result on the right.'),
  correctText: L(
    "To'g'ri. Ayirma uchun qoida qisqa: OA ayirmoq OB — bu IKKINCHISINING uchidan BIRINCHISINING uchiga qaragan vektor, ya'ni B dan A ga, ya'ni BA. Tartibni almashtirsangiz yo'nalish ham teskarilanadi: OB ayirmoq OA AB beradi. Oxirgi qator esa qarama-qarshi vektorlar haqida: AB va BA bir xil kesmada, lekin qarama-qarshi yo'nalgan, ularning yig'indisi nol vektor.",
    'Верно. Правило для разности короткое: OA минус OB это вектор от конца ВТОРОГО к концу ПЕРВОГО, то есть от B к A, то есть BA. Поменяй порядок — развернётся и направление: OB минус OA даёт AB. А последняя строка о противоположных векторах: AB и BA лежат на одном отрезке, но направлены навстречу, их сумма нулевой вектор.',
    'Correct. The rule for a difference is short: OA minus OB is the vector from the end of the SECOND to the end of the FIRST, that is, from B to A, that is, BA. Swap the order and the direction reverses too: OB minus OA gives AB. The last row is about opposite vectors: AB and BA lie on the same segment but point against each other, and their sum is the zero vector.'),
  wrongs: [
    { when: (s) => s.pair.m2 === 't3' || s.pair.m3 === 't2', text: L(
      "Ikki ayirma o'rin almashdi, va bu darsning eng qimmat xatosi. Qoida yodda tursin: ayirmaning strelkasi AYIRILAYOTGAN vektorning uchidan boshlanadi. OA ayirmoq OB da ayirilayotgani OB, uning uchi B — demak strelka B dan chiqadi va A da tugaydi, ya'ni BA. Harflarni teskari yozish oson, lekin bu boshqa vektor.",
      'Две разности поменялись местами, и это самая дорогая ошибка урока. Запомни правило: стрелка разности начинается в конце ВЫЧИТАЕМОГО вектора. В OA минус OB вычитается OB, его конец B — значит стрелка выходит из B и кончается в A, то есть BA. Написать буквы наоборот легко, но это другой вектор.',
      'The two differences swapped places, and this is the costliest error of the lesson. Remember the rule: the arrow of a difference starts at the end of the vector being SUBTRACTED. In OA minus OB the subtracted one is OB, whose end is B — so the arrow leaves B and ends at A, that is, BA. Writing the letters the other way round is easy, but it is a different vector.') },
    { when: (s) => s.pair.m4 !== 't4', text: L(
      "AB qo'shuv BA nol vektor beradi. Zanjirni kuzating: A dan B ga bordik, keyin B dan A ga qaytdik — boshlangan joyimizga keldik, ya'ni surilish yo'q. Uchburchak qoidasi ham buni beradi: o'rtadagi B tushib qoladi va AA qoladi, bu esa nol vektor.",
      'AB плюс BA даёт нулевой вектор. Проследи цепочку: из A пришли в B, потом из B вернулись в A — оказались там, откуда вышли, то есть перемещения нет. Правило треугольника даёт то же: средняя B выпадает и остаётся AA, а это нулевой вектор.',
      'AB plus BA gives the zero vector. Follow the chain: from A we went to B, then from B back to A — we ended where we started, so there is no displacement. The triangle rule gives the same: the middle B drops out leaving AA, which is the zero vector.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Uchtadan ko'p qator o'z juftini topmadi. Qo'shishda zanjir ulanadi va o'rtadagi harf tushadi. Ayirishda esa strelka ayirilayotgan vektorning uchidan boshlanadi. Ikki qoidani alohida qo'llang.",
      'Больше трёх строк не нашли пару. При сложении цепочка смыкается и средняя буква выпадает. При вычитании стрелка начинается в конце вычитаемого вектора. Применяй два правила по отдельности.',
      'More than three rows failed to find their pair. In addition the chain closes and the middle letter drops out. In subtraction the arrow starts at the end of the vector being subtracted. Apply the two rules separately.') },
    { when: () => true, text: L(
      "Bitta qator o'z juftini topmadi. Ayirmalarda tartibga diqqat qiling: birinchi vektorning uchi natijaning OXIRI bo'ladi.",
      'Одна строка не нашла свою пару. В разностях следи за порядком: конец первого вектора становится КОНЦОМ результата.',
      'One row failed to find its pair. In the differences watch the order: the end of the first vector becomes the END of the result.') },
  ],
  wrongText: L(
    "Ayirmaning strelkasi ayirilayotgan vektorning uchidan boshlanadi.",
    'Стрелка разности начинается в конце вычитаемого вектора.',
    'The arrow of a difference starts at the end of the vector being subtracted.'),
};

export default function D53_04(props) { return <MatchPairs data={DATA} {...props} />; }
