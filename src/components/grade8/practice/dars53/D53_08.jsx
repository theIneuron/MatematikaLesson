// Dars53 · Amaliyot 08 — Ha yoki yo'q · 🔴 · tag: vector_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS51_55_AMALIYOT_SKELET.md §5 (53-dars, 8-pozitsiya)
//
// JAVOB: YO'Q, HA (skelet §0a.1).
//   «Teng vektorlar bitta nuqtadan chiqishi kerak»  -> yolg'on (З112)
//   «AB + BC = AC»                                  -> rost (T2)
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'vector_claims', level: '🔴',
  itemSize: 15,
  items: [
    { id: 's1', yes: false, tokens: ['a = b'],
      claim: L(
        "faqat ular bitta nuqtadan chiqsa",
        'только если они выходят из одной точки',
        'only if they start from one point') },
    { id: 's2', yes: true, tokens: ['AB + BC = AC'],
      claim: L('bu yozuv rost', 'эта запись верна', 'this record is true') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "Ikki da'vo. Birinchisi teng vektorlarning sharti haqida: ular bitta nuqtadan chiqishi SHARTMI. Ikkinchisi uchburchak qoidasi haqida.",
    'Два утверждения. Первое об условии равенства векторов: ОБЯЗАНЫ ли они выходить из одной точки. Второе о правиле треугольника.',
    'Two statements. The first is about the condition for equal vectors: MUST they start from one point. The second is about the triangle rule.'),
  ask: L(
    "Da'vo rost bo'lsa «Ha», yolg'on bo'lsa «Yo'q».",
    'Если утверждение верно — «Да», если ложно — «Нет».',
    'If the statement is true, «Yes»; if false, «No».'),
  correctText: L(
    "To'g'ri. Birinchi da'vo yolg'on: teng vektorlar uchun bitta nuqtadan chiqish umuman talab qilinmaydi. Ikki strelkani sahifaning ikki chetiga qo'ying — agar uzunligi va yo'nalishi bir xil bo'lsa, ular baribir teng. Ikkinchi da'vo esa rost: bu uchburchak qoidasi, va uni zanjir sifatida o'qish oson — A dan B ga, keyin B dan C ga borsak, natijada A dan C ga borgan bo'lamiz.",
    'Верно. Первое утверждение ложно: выходить из одной точки равным векторам вовсе не требуется. Поставь две стрелки на разные края страницы — если длина и направление совпадают, они всё равно равны. А второе утверждение верно: это правило треугольника, и читается оно как цепочка — из A в B, потом из B в C, а в итоге из A в C.',
    'Correct. The first statement is false: equal vectors are not required to start from one point at all. Put two arrows at opposite edges of the page — if the length and direction match, they are still equal. The second statement is true: it is the triangle rule, and it reads as a chain — from A to B, then from B to C, and in the end from A to C.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Birinchi da'vo YOLG'ON, va bu darsning eng qimmat xatosi. Vektor ikki narsadan iborat: uzunlik va yo'nalish. Boshlanish nuqtasi ularning ichida yo'q. Shuning uchun vektorni parallel ko'chirish uni o'zgartirmaydi — ko'chirilgan strelka avvalgisiga TENG bo'lib qolaveradi. Aynan shu erkinlik vektorlarni qo'shishga imkon beradi: ikkinchi vektorni birinchisining uchiga ko'chirib qo'yamiz.",
      'Первое утверждение ЛОЖНО, и это самая дорогая ошибка урока. Вектор состоит из двух вещей: длины и направления. Точки начала среди них нет. Поэтому параллельный перенос вектор не меняет — перенесённая стрелка остаётся РАВНОЙ прежней. Именно эта свобода и позволяет складывать векторы: второй вектор переносят к концу первого.',
      'The first statement is FALSE, and this is the costliest error of the lesson. A vector consists of two things: length and direction. A starting point is not among them. That is why a parallel shift does not change a vector — the shifted arrow stays EQUAL to the original. It is exactly this freedom that makes adding vectors possible: the second vector is moved to the end of the first.') },
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Ikkinchi da'vo ROST — bu uchburchak qoidasi. Yozuvda o'rtadagi harf ikki marta uchraydi va tushib qoladi: AB qo'shuv BC da B ikki marta, natijada AC qoladi. Buni harakat sifatida o'qing: A dan B ga bordik, keyin B dan C ga — hammasi bo'lib A dan C ga surildik.",
      'Второе утверждение ВЕРНО — это правило треугольника. В записи средняя буква встречается дважды и выпадает: в AB плюс BC буква B дважды, в результате остаётся AC. Читай это как движение: из A пришли в B, потом из B в C — всего сместились из A в C.',
      'The second statement is TRUE — it is the triangle rule. In the record the middle letter appears twice and drops out: in AB plus BC the letter B is there twice and AC remains. Read it as movement: from A we went to B, then from B to C — in total we moved from A to C.') },
  ],
  wrongText: L(
    "Vektor ikki narsadan iborat: uzunlik va yo'nalish. Boshlanish nuqtasi ularning ichida yo'q.",
    'Вектор состоит из двух вещей: длины и направления. Точки начала среди них нет.',
    'A vector consists of two things: length and direction. A starting point is not among them.'),
};

export default function D53_08(props) { return <TrueFalse data={DATA} {...props} />; }
