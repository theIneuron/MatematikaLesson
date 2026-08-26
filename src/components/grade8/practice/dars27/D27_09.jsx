// Dars27 · Amaliyot 09 — Chizmalar · 🔴 🖼 · tag: interval_to_picture
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §9 (27-dars, 9-pozitsiya)
//
// TO'RT CHIZMADA O'SHA IKKI NUQTA — nol va uch, — va ular orasidagi
// to'plam ham chizilgan. Farq faqat DOIRACHANING ICHIDA: to'la doiracha
// chegara kirganini bildiradi, bo'sh doiracha kirmaganini.
//
// `spans` — `fig.jsx` ga metodist ruxsati bilan qo'shilgan maydon (skelet
// §0a.2): ikki doiracha to'plamni ANGLATMAYDI, oraliqning o'zi chizilishi
// kerak. Aynan shu sababli bu topshiriq chizma bilan ishlaydi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const AX = { fig: 'axis', from: -1, to: 4, step: 1, w: 142, h: 44 };

const DATA = {
  tag: 'interval_to_picture', level: '🔴',
  connect: true,
  targetSize: 15, itemSize: 17,
  items: [
    { id: 'm1', tokens: ['[0; 3]'] },
    { id: 'm2', tokens: ['(0; 3)'] },
    { id: 'm3', tokens: ['[0; 3)'] },
    { id: 'm4', tokens: ['(0; 3]'] },
  ],
  targets: [
    { id: 't1', tokens: [{ ...AX, spans: [{ from: 0, to: 3 }], marks: [{ at: 0 }, { at: 3 }] }] },
    { id: 't2', tokens: [{ ...AX, spans: [{ from: 0, to: 3 }], marks: [{ at: 0, open: true }, { at: 3, open: true }] }] },
    { id: 't3', tokens: [{ ...AX, spans: [{ from: 0, to: 3 }], marks: [{ at: 0 }, { at: 3, open: true }] }] },
    { id: 't4', tokens: [{ ...AX, spans: [{ from: 0, to: 3 }], marks: [{ at: 0, open: true }, { at: 3 }] }] },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Chizmalar', 'Рисунки', 'Pictures'),
  setup: L(
    "To'rt chizmada o'sha ikki nuqta — nol va uch. Farq faqat doirachaning ichida: to'la doiracha chegara kirganini bildiradi.",
    'На четырёх рисунках те же две точки — нуль и три. Различие только внутри кружка: закрашенный кружок значит, что граница входит.',
    'The four drawings hold the same two points — zero and three. The only difference is inside the dot: a filled dot means the boundary is included.'),
  ask: L(
    "Chapdan yozuvni bosing, keyin o'ngdan uning chizmasini bosing.",
    'Нажми запись слева, потом её рисунок справа.',
    'Tap a record on the left, then its drawing on the right.'),
  correctText: L(
    "To'g'ri. Kvadrat qavs — to'la doiracha, dumaloq qavs — bo'sh doiracha. Chap doiracha birinchi qavsga, o'ngdagisi ikkinchisiga mos keladi. Nuqtaning o'zi esa har doim chizmada ko'rinadi.",
    'Верно. Квадратная скобка — закрашенный кружок, круглая — пустой. Левый кружок соответствует первой скобке, правый второй. А сама точка на рисунке видна всегда.',
    'Correct. A square bracket is a filled dot, a round one an empty dot. The left dot matches the first bracket, the right the second. And the point itself is always drawn.'),
  wrongs: [
    { when: (s) => s.pair.m1 === 't2' || s.pair.m2 === 't1', text: L(
      "Bu ikki chizma bir-birining teskarisi. Kvadrat qavs — TO'LA doiracha: chegara to'plamga kiradi. Dumaloq qavs — BO'SH doiracha: chegara chetda. Ikkala chegara ham bir xil bo'lgan chizmalarda ular ikkalasi ham to'la yoki ikkalasi ham bo'sh bo'ladi.",
      'Эти два рисунка обратны друг другу. Квадратная скобка — ЗАКРАШЕННЫЙ кружок: граница входит в множество. Круглая — ПУСТОЙ: граница вне. На рисунках, где обе границы одинаковы, кружки либо оба закрашены, либо оба пусты.',
      'These two drawings are opposites. A square bracket is a FILLED dot: the boundary belongs to the set. A round bracket is an EMPTY dot: the boundary is outside. In drawings where both boundaries behave alike, the dots are either both filled or both empty.') },
    { when: (s) => s.pair.m3 === 't4' || s.pair.m4 === 't3', text: L(
      "Bu ikki chizmada bittadan to'la doiracha bor, lekin ular BOSHQA tomonda. Yozuvni chapdan o'ngga o'qing: birinchi qavs CHAP chegaraga tegishli, ikkinchisi o'ngdagisiga. Kvadrat qavs qaysi tomonda tursa, to'la doiracha ham o'sha tomonda bo'ladi.",
      'На этих двух рисунках по одному закрашенному кружку, но они с РАЗНЫХ сторон. Читай запись слева направо: первая скобка относится к ЛЕВОЙ границе, вторая к правой. С какой стороны стоит квадратная скобка, с той и закрашенный кружок.',
      'These two drawings each have one filled dot, but on DIFFERENT sides. Read the record left to right: the first bracket belongs to the LEFT boundary, the second to the right. Whichever side carries the square bracket carries the filled dot.') },
    { when: (s) => s.pair.m1 === 't3' || s.pair.m1 === 't4' || s.pair.m2 === 't3' || s.pair.m2 === 't4', text: L(
      "Avval doirachalarni SANANG: ikkalasi ham bir xilmi yoki turlimi. Ikkalasi bir xil bo'lsa — kesma yoki interval, ya'ni ikkala qavs ham bir xil. Turli bo'lsa — yarim-interval, va yozuvda ikki xil qavs turadi.",
      'Сначала СОСЧИТАЙ кружки: одинаковые они или разные. Одинаковые — отрезок или интервал, то есть обе скобки одного вида. Разные — полуинтервал, и в записи стоят разные скобки.',
      'First COUNT the dots: are they alike or different. Alike means a segment or an interval, so both brackets are the same kind. Different means a half-interval, and the record holds two different brackets.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har chizmada ikki savol bering: chap doiracha to'lami yoki bo'sh, va o'ngdagisi qanday. To'la doiracha kvadrat qavsga, bo'sh doiracha dumaloq qavsga mos keladi.",
      'В каждом рисунке задай два вопроса: левый кружок закрашен или пуст, и каков правый. Закрашенный кружок соответствует квадратной скобке, пустой — круглой.',
      'Ask two questions of every drawing: is the left dot filled or empty, and what about the right one. A filled dot matches a square bracket, an empty one a round bracket.') },
  ],
  wrongText: L(
    "To'la doiracha — kvadrat qavs, bo'sh doiracha — dumaloq qavs. Chap doiracha birinchi qavsga, o'ng doiracha ikkinchisiga mos keladi.",
    'Закрашенный кружок — квадратная скобка, пустой — круглая. Левый кружок соответствует первой скобке, правый — второй.',
    'A filled dot is a square bracket, an empty one a round bracket. The left dot matches the first bracket, the right dot the second.'),
};

export default function D27_09(props) { return <MatchPairs data={DATA} {...props} />; }
