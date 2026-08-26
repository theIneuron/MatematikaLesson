// Dars53 · Amaliyot 06 — Pazl · 🟡 · tag: chain_to_vector
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Skelet: DARS51_55_AMALIYOT_SKELET.md §5 (53-dars, 6-pozitsiya)
//
// 04 dan farqli: bu yerda ZANJIR uzunroq va oxirgi qatorda ayirmani
// qo'shishga aylantirish kerak.
//   AB + BC + CD = AD    uchburchak qoidasi ikki marta
//   AB + BA = 0          qarama-qarshi vektorlar
//   AB − CB = AC         −CB = BC, demak AB + BC = AC
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'chain_to_vector', level: '🟡',
  faceSize: 14, faceSizePhone: 12,
  cards: [
    { id: 'f1', side: 0, tokens: ['AB + BC + CD'] },
    { id: 'f2', side: 0, tokens: ['AB + BA'] },
    { id: 'f3', side: 0, tokens: ['AB − CB'] },
    { id: 'v1', side: 1, v: 'AD' },
    { id: 'v2', side: 1, v: '0' },
    { id: 'v3', side: 1, v: 'AC' },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "Uch ifoda. Birinchisida zanjir uzun: uchburchak qoidasi ketma-ket ikki marta ishlaydi. Ikkinchisi qarama-qarshi vektorlar haqida. Uchinchisida esa ayirma turibdi, va uni avval qo'shishga aylantirish kerak.",
    'Три выражения. В первом длинная цепочка: правило треугольника срабатывает подряд дважды. Второе о противоположных векторах. А в третьем стоит разность, и её сначала надо превратить в сложение.',
    'Three expressions. In the first the chain is long: the triangle rule works twice in a row. The second is about opposite vectors. In the third there is a difference, and it must first be turned into an addition.'),
  ask: L(
    'Ifodani bosing, keyin uyani bosing.',
    'Нажми выражение, потом ячейку.',
    'Tap an expression, then a slot.'),
  bank: L('Ifodalar', 'Выражения', 'Expressions'),
  correctText: L(
    "To'g'ri. Birinchi zanjirda o'rtadagi harflar ketma-ket tushib qoladi: AB qo'shuv BC AC beradi, keyin AC qo'shuv CD AD beradi. Zanjir qancha uzun bo'lsa ham, qoida o'sha: boshi birinchisining boshi, oxiri oxirgisining oxiri. Ikkinchisida A dan chiqib A ga qaytdik, ya'ni nol vektor. Uchinchisida esa avval minus CB ni BC ga aylantirdik — ayirish qarama-qarshi vektorni qo'shish bilan bir xil — keyin AB qo'shuv BC dan AC chiqdi.",
    'Верно. В первой цепочке средние буквы выпадают одна за другой: AB плюс BC даёт AC, потом AC плюс CD даёт AD. Какой бы длинной ни была цепочка, правило то же: начало у первого, конец у последнего. Во втором из A вышли и в A вернулись, то есть нулевой вектор. А в третьем сначала превратили минус CB в BC — вычитание это то же, что прибавление противоположного — и из AB плюс BC вышло AC.',
    'Correct. In the first chain the middle letters drop out one after another: AB plus BC gives AC, then AC plus CD gives AD. However long the chain, the rule is the same: the start of the first, the end of the last. In the second we left A and came back to A, so the zero vector. In the third we first turned minus CB into BC — subtracting is the same as adding the opposite — and AB plus BC gave AC.'),
  wrongs: [
    { when: (s) => s.mate.f3 !== 'v3', text: L(
      "Uchinchi ifoda eng qiyini, chunki unda zanjir darrov ko'rinmaydi. AB ayirmoq CB da ikkinchi vektor C dan B ga qaraydi, ya'ni noto'g'ri tomonga. Uni burang: minus CB bu BC. Endi AB qo'shuv BC bo'ldi, o'rtadagi B tushadi va AC qoladi.",
      'Третье выражение самое трудное, ведь цепочка в нём не видна сразу. В AB минус CB второй вектор смотрит из C в B, то есть не в ту сторону. Разверни его: минус CB это BC. Теперь стало AB плюс BC, средняя B выпадает и остаётся AC.',
      'The third expression is the hardest, since the chain is not visible at once. In AB minus CB the second vector points from C to B, that is, the wrong way. Turn it around: minus CB is BC. Now it reads AB plus BC, the middle B drops out and AC remains.') },
    { when: (s) => s.mate.f1 !== 'v1', text: L(
      "Uzun zanjirda ham qoida o'sha. AB qo'shuv BC qo'shuv CD ni ikki qadamda yig'ing: avval birinchi ikkitasi AC beradi, keyin AC va CD birga AD beradi. Natija zanjirning boshidan oxirigacha boradi, o'rtadagi B va C esa yo'qoladi.",
      'В длинной цепочке правило то же. Собери AB плюс BC плюс CD в два шага: сначала первые два дают AC, потом AC и CD вместе дают AD. Результат идёт от начала цепочки до её конца, а средние B и C исчезают.',
      'The rule holds for a long chain too. Assemble AB plus BC plus CD in two steps: the first two give AC, then AC and CD together give AD. The result runs from the start of the chain to its end, while the middle B and C disappear.') },
    { when: () => true, text: L(
      "Har ifodada zanjirni kuzating: qayerdan chiqdingiz va qayerga keldingiz. Ayirma bo'lsa, avval uni qarama-qarshi vektorni qo'shishga aylantiring.",
      'В каждом выражении следи за цепочкой: откуда вышел и куда пришёл. Если стоит разность, сначала преврати её в прибавление противоположного вектора.',
      'In each expression follow the chain: where you left from and where you arrived. If there is a difference, first turn it into adding the opposite vector.') },
  ],
  wrongText: L(
    "Zanjirning boshi va oxiri javobni beradi. Ayirmani avval qo'shishga aylantiring.",
    'Начало и конец цепочки дают ответ. Разность сначала преврати в сложение.',
    'The start and end of the chain give the answer. Turn a difference into an addition first.'),
};

export default function D53_06(props) { return <PairSlots data={DATA} {...props} />; }
