// Dars53 · Amaliyot 03 — Yozuvlar · 🟢 🖼 · tag: triangle_rule_marked
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Skelet: DARS51_55_AMALIYOT_SKELET.md §5 (53-dars, 3-pozitsiya)
//
// UCHBURCHAK QOIDASI HARFLAR BILAN TEKSHIRILADI: o'rtadagi harf ikki
// marta uchraydi va natijada TUSHIB QOLADI. Uch to'g'ri yozuvda shu
// naqsh bor, uch xatoda esa yo'q.
//   AB + BC = AC   ha       AB + BC = CA   yo'q (natija teskari)
//   MN + NP = MP   ha       AB + CB = AC   yo'q (ikkinchisi teskari)
//   OA + AB = OB   ha       AB + BC = AB   yo'q
// `given` da chizma: uchburchak qoidasining o'zi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'triangle_rule_marked', level: '🟢',
  col: 96, itemSize: 14,
  given: [[{
    fig: 'vec', w: 104, h: 72,
    arrows: [
      { from: [10, 60], to: [46, 12], ref: true, name: 'AB' },
      { from: [46, 12], to: [92, 46], ref: true, name: 'BC' },
      { from: [10, 60], to: [92, 46], name: 'AC' },
    ],
  }]],
  givenLabel: L('Chizma', 'Рисунок', 'The drawing'),
  items: [
    { id: 'i1', hit: true, tokens: ['AB + BC = AC'] },
    { id: 'i2', tokens: ['AB + BC = CA'] },
    { id: 'i3', hit: true, tokens: ['MN + NP = MP'] },
    { id: 'i4', tokens: ['AB + CB = AC'] },
    { id: 'i5', hit: true, tokens: ['OA + AB = OB'] },
    { id: 'i6', tokens: ['AB + BC = AB'] },
  ],
  eyebrow: L('Yozuvlar', 'Записи', 'Records'),
  setup: L(
    "Chizmada uchburchak qoidasi: A dan B ga, keyin B dan C ga borsak, natija A dan C ga qaragan vektor bo'ladi. Yozuvda buni ko'rish oson — o'rtadagi harf ikki marta uchraydi va tushib qoladi. Quyida oltita yozuv.",
    'На рисунке правило треугольника: если пройти от A к B, а потом от B к C, результатом будет вектор от A к C. В записи это видно легко — средняя буква встречается дважды и выпадает. Ниже шесть записей.',
    'The drawing shows the triangle rule: going from A to B and then from B to C, the result is the vector from A to C. In writing this is easy to see — the middle letter appears twice and drops out. Six records are given below.'),
  ask: L(
    "To'g'ri yozilgan 3 ta yozuvni belgilang.",
    'Отметь 3 верно записанных равенства.',
    'Mark the 3 records written correctly.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Uchala to'g'ri yozuvda bir xil naqsh: birinchi vektor tugagan harf ikkinchi vektor boshlangan harf bilan bir xil, va o'sha harf natijada yo'qoladi. AB qo'shuv BC da B ikki marta, qoladi AC. MN qo'shuv NP da N ikki marta, qoladi MP. OA qo'shuv AB da A ikki marta, qoladi OB. Harflar boshqa bo'lishi mumkin, naqsh esa o'sha.",
    'Верно. Во всех трёх верных записях один узор: буква, на которой кончается первый вектор, совпадает с буквой, с которой начинается второй, и эта буква в результате исчезает. В AB плюс BC буква B дважды, остаётся AC. В MN плюс NP буква N дважды, остаётся MP. В OA плюс AB буква A дважды, остаётся OB. Буквы могут быть разные, узор тот же.',
    'Correct. All three correct records share one pattern: the letter the first vector ends on is the letter the second begins with, and that letter disappears in the result. In AB plus BC the letter B appears twice and AC remains. In MN plus NP the letter N appears twice and MP remains. In OA plus AB the letter A appears twice and OB remains. The letters may differ, the pattern is the same.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('i2') !== -1, text: L(
      "AB qo'shuv BC teng CA — bu yozuvda natija TESKARI. Zanjir A dan boshlanadi va C da tugaydi, demak natija A dan C ga qaraydi, ya'ni AC. CA esa qarama-qarshi vektor. Chizmaga qarang: uchinchi strelka A dan chiqib C ga boradi, teskarisiga emas.",
      'AB плюс BC равно CA — в этой записи результат ОБРАТНЫЙ. Цепочка начинается в A и кончается в C, значит результат смотрит из A в C, то есть AC. А CA это противоположный вектор. Посмотри на рисунок: третья стрелка выходит из A и идёт в C, а не наоборот.',
      'AB plus BC equals CA — this record has the result REVERSED. The chain starts at A and ends at C, so the result points from A to C, that is, AC. CA is the opposite vector. Look at the drawing: the third arrow leaves A and goes to C, not the other way.') },
    { when: (s) => s.extra.indexOf('i4') !== -1, text: L(
      "AB qo'shuv CB da zanjir uzilgan: birinchi vektor B da tugaydi, ikkinchisi esa C dan boshlanadi. Uchburchak qoidasi ishlashi uchun ikkinchi vektor aynan B dan boshlanishi kerak edi. CB ni BC ga aylantirsangiz, ya'ni yo'nalishini o'zgartirsangiz, yozuv to'g'ri bo'lardi.",
      'В AB плюс CB цепочка разорвана: первый вектор кончается в B, а второй начинается в C. Чтобы правило треугольника сработало, второй вектор должен был начинаться именно в B. Если развернуть CB в BC, то есть поменять направление, запись стала бы верной.',
      'In AB plus CB the chain is broken: the first vector ends at B while the second starts at C. For the triangle rule to work the second vector had to begin at B. Turning CB into BC, that is, reversing its direction, would make the record correct.') },
    { when: (s) => s.extra.length > 0 || s.miss.length > 0, text: L(
      "Har yozuvni bitta savol bilan tekshiring: birinchi vektor qayerda tugaydi va ikkinchisi qayerdan boshlanadi. Ular bir xil harf bo'lsa, zanjir ulanadi va natija birinchining boshidan ikkinchisining oxirigacha bo'ladi.",
      'Проверяй каждую запись одним вопросом: где кончается первый вектор и откуда начинается второй. Если это одна и та же буква, цепочка смыкается, и результат идёт от начала первого до конца второго.',
      'Check each record with one question: where does the first vector end and where does the second begin. If it is the same letter, the chain closes and the result runs from the start of the first to the end of the second.') },
  ],
  wrongText: L(
    "O'rtadagi harf ikki marta uchrashi kerak, va u natijada yo'qoladi.",
    'Средняя буква должна встретиться дважды, и в результате она исчезает.',
    'The middle letter must appear twice, and it disappears in the result.'),
};

export default function D53_03(props) { return <MarkAll data={DATA} {...props} />; }
