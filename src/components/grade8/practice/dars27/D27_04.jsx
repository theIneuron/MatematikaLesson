// Dars27 · Amaliyot 04 — Pazl · 🟡 · tag: notation_to_inequality
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §9 (27-dars, 4-pozitsiya)
//
// SKELETDAN FARQ: skeletda juftlik «yozuv ↔ qaysi chegara kiradi» edi, va
// javob kartalarida SO'Z turishi kerak bo'lardi. `PairSlots` esa karta
// matnini tarjima qilmaydi (u `L()` ni qabul qilmaydi), ya'ni ruscha va
// inglizcha versiyada o'zbekcha so'z qolib ketardi. Shuning uchun javoblar
// TENGSIZLIK bilan yozildi: mazmun o'sha — qaysi chegara kiradi, — lekin
// hamma tilda bir xil ko'rinadi.
//
// Uch yozuvda o'sha ikki son turibdi, farq faqat qavslarda (З56).
// Kartalarda yozuv bo'shliqsiz (skelet §0a.3).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'notation_to_inequality', level: '🟡',
  faceSize: 12, faceSizePhone: 10,
  cards: [
    { id: 'f1', side: 0, tokens: ['[2;5]'] },
    { id: 'f2', side: 0, tokens: ['(2;5)'] },
    { id: 'f3', side: 0, tokens: ['[2;5)'] },
    { id: 'v1', side: 1, v: '2≤x≤5' },
    { id: 'v2', side: 1, v: '2<x<5' },
    { id: 'v3', side: 1, v: '2≤x<5' },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "Uch yozuvda o'sha ikki son turibdi, farq esa faqat qavslarda. Har yozuvni tengsizlik bilan yozish kerak: kvadrat qavs chegarani kiritadi, dumaloq qavs chiqarib tashlaydi.",
    'В трёх записях стоят одни и те же два числа, а различие только в скобках. Каждую запись надо записать неравенством: квадратная скобка границу включает, круглая исключает.',
    'The three records hold the same two numbers and differ only in the brackets. Each must be written as an inequality: a square bracket includes the boundary, a round one excludes it.'),
  ask: L(
    'Yozuvni bosing, keyin uyani bosing.',
    'Нажми запись, потом ячейку.',
    'Tap a record, then a slot.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Kvadrat qavs chiziqli belgini beradi, dumaloq qavs esa qat'iy belgini. Har qavs O'Z chegarasiga javob beradi: shuning uchun ikki xil qavs ikki xil belgini beradi.",
    'Верно. Квадратная скобка даёт знак с чертой, круглая — строгий. Каждая скобка отвечает за СВОЮ границу: поэтому разные скобки дают разные знаки.',
    'Correct. A square bracket gives the sign with a line, a round one the strict sign. Each bracket answers for ITS OWN boundary: that is why different brackets give different signs.'),
  wrongs: [
    { when: (s) => s.mate.f3 !== 'v3', text: L(
      "Uchinchi yozuvda ikki qavs IKKI XIL: chapda kvadrat, o'ngda dumaloq. Demak tengsizlikda ham ikki belgi turli bo'ladi: chapda chiziqli, o'ngda qat'iy. Ikkining o'zi kiradi, beshning o'zi esa yo'q. Bunday to'plam yarim-interval deyiladi.",
      'В третьей записи скобки РАЗНЫЕ: слева квадратная, справа круглая. Значит и в неравенстве знаки будут разными: слева с чертой, справа строгий. Сама двойка входит, а сама пятёрка нет. Такое множество называется полуинтервалом.',
      'In the third record the two brackets DIFFER: square on the left, round on the right. So the inequality signs differ too: with a line on the left, strict on the right. Two itself is in, five itself is not. Such a set is called a half-interval.') },
    { when: (s) => s.mate.f1 !== 'v1', text: L(
      "Birinchi yozuvda ikkala qavs ham KVADRAT, ya'ni ikkala chegara ham kiradi. Tengsizlikda ikkala belgining ostida ham chiziq bo'ladi. Bu to'plam kesma deyiladi: uning ikkala cheti ham o'ziga tegishli.",
      'В первой записи обе скобки КВАДРАТНЫЕ, значит входят обе границы. В неравенстве под обоими знаками будет черта. Такое множество называется отрезком: оба его конца принадлежат ему самому.',
      'In the first record both brackets are SQUARE, so both boundaries are in. In the inequality both signs carry a line. This set is called a segment: both of its endpoints belong to it.') },
    { when: (s) => s.mate.f2 !== 'v2', text: L(
      "Ikkinchi yozuvda ikkala qavs ham DUMALOQ, ya'ni ikkala chegara ham chiqarib tashlanadi. Tengsizlikda ikkala belgi ham qat'iy bo'ladi, chiziqsiz. Bu to'plam interval deyiladi.",
      'Во второй записи обе скобки КРУГЛЫЕ, значит обе границы исключаются. В неравенстве оба знака будут строгими, без черты. Такое множество называется интервалом.',
      'In the second record both brackets are ROUND, so both boundaries are excluded. In the inequality both signs are strict, without a line. This set is called an interval.') },
  ],
  wrongText: L(
    "Har qavsga alohida qarang: kvadrat qavs chiziqli belgini beradi, dumaloq qavs qat'iy belgini. Ikki qavs turli bo'lsa, ikki belgi ham turli bo'ladi.",
    'Смотри на каждую скобку отдельно: квадратная даёт знак с чертой, круглая — строгий. Разные скобки — разные знаки.',
    'Look at each bracket separately: a square one gives the sign with a line, a round one the strict sign. Different brackets mean different signs.'),
};

export default function D27_04(props) { return <PairSlots data={DATA} {...props} />; }
