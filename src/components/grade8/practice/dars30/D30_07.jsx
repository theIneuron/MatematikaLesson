// Dars30 · Amaliyot 07 — Pazl · 🟡 · tag: record_to_lower
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §12 (30-dars, 7-pozitsiya)
//
// UCH YOZUVDA TAQRIBIY QIYMAT BIR XIL — besh, — farq esa faqat CHEGARADA.
// Javob quyi chegara, ya'ni a minus h. Chegara qanchalik katta bo'lsa,
// quyi chegara shunchalik pastda turadi: nol butun bir, nol butun ikki,
// nol butun besh.
//
// Bu 06-topshiriqning davomi, lekin u yerda uchta son so'ralgan edi, bu
// yerda esa bittasi — va uni uch marta hisoblash kerak.
// Kartalarda yozuv bo'shliqsiz (skelet §0a.3).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'record_to_lower', level: '🟡',
  faceSize: 13, faceSizePhone: 11,
  cards: [
    { id: 'f1', side: 0, tokens: ['5±0,1'] },
    { id: 'f2', side: 0, tokens: ['5±0,2'] },
    { id: 'f3', side: 0, tokens: ['5±0,5'] },
    { id: 'v1', side: 1, v: '4,9' },
    { id: 'v2', side: 1, v: '4,8' },
    { id: 'v3', side: 1, v: '4,5' },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "Uch yozuvda taqribiy qiymat bir xil — besh, farq esa chegarada. Har biri uchun ENG KICHIK mumkin bo'lgan qiymatni topish kerak.",
    'В трёх записях приближённое значение одинаково — пять, а различие в границе. Для каждой надо найти НАИМЕНЬШЕЕ возможное значение.',
    'The three records share the approximation — five — and differ in the bound. For each, the SMALLEST possible value must be found.'),
  ask: L(
    'Yozuvni bosing, keyin uyani bosing.',
    'Нажми запись, потом ячейку.',
    'Tap a record, then a slot.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Eng kichik qiymat — taqribiy qiymat minus chegara: to'rt butun to'qqiz, to'rt butun sakkiz, to'rt butun besh. Chegara qanchalik katta bo'lsa, quyi chegara shunchalik pastda — ya'ni aniqlik kamroq.",
    'Верно. Наименьшее значение — это приближённое минус граница: четыре целых девять, четыре целых восемь, четыре целых пять. Чем больше граница, тем ниже нижний предел — то есть точность меньше.',
    'Correct. The smallest value is the approximation minus the bound: four point nine, four point eight, four point five. The larger the bound, the lower the lower limit — that is, the less the precision.'),
  wrongs: [
    { when: (s) => s.mate.f3 !== 'v3', text: L(
      "Bu yozuvda chegara eng KATTA — nol butun besh. Demak quyi chegara ham eng pastda bo'ladi: besh minus nol butun besh to'rt butun besh. Uch yozuvda taqribiy qiymat bir xil, ya'ni javobni faqat chegara hal qiladi.",
      'В этой записи граница самая БОЛЬШАЯ — ноль целых пять. Значит и нижний предел будет самым низким: пять минус ноль целых пять это четыре целых пять. Приближённое значение во всех трёх записях одно, значит ответ решает только граница.',
      'In this record the bound is the LARGEST — zero point five. So the lower limit is the lowest too: five minus zero point five is four point five. All three records share the approximation, so only the bound decides the answer.') },
    { when: (s) => s.mate.f1 !== 'v1', text: L(
      "Bu yozuvda chegara eng KICHIK — nol butun bir. Kichik chegara degani aniqroq o'lchov, ya'ni quyi chegara beshga eng yaqin turadi: besh minus nol butun bir to'rt butun to'qqiz. Verguldan keyingi xonaga diqqat qiling.",
      'В этой записи граница самая МАЛЕНЬКАЯ — ноль целых один. Малая граница значит более точное измерение, то есть нижний предел стоит ближе всего к пяти: пять минус ноль целых один это четыре целых девять. Следи за разрядом после запятой.',
      'In this record the bound is the SMALLEST — zero point one. A small bound means a more accurate measurement, so the lower limit stands nearest five: five minus zero point one is four point nine. Watch the place after the comma.') },
    { when: (s) => s.mate.f2 !== 'v2', text: L(
      "Bu yozuvda chegara nol butun ikki: besh minus nol butun ikki to'rt butun sakkiz. Ayirishda o'ndan bir xonasiga qarang — beshdan ikki o'ndan bir ayirilsa, to'rt butun sakkiz qoladi.",
      'В этой записи граница ноль целых два: пять минус ноль целых два это четыре целых восемь. При вычитании смотри на разряд десятых — из пяти вычитаются две десятых, остаётся четыре целых восемь.',
      'In this record the bound is zero point two: five minus zero point two is four point eight. When subtracting, watch the tenths place — take two tenths from five and four point eight remains.') },
  ],
  wrongText: L(
    "Eng kichik qiymat — taqribiy qiymat minus chegara. Uch yozuvda taqribiy qiymat bir xil, ya'ni javobni faqat chegara hal qiladi.",
    'Наименьшее значение — это приближённое минус граница. Приближённое во всех трёх записях одно, значит ответ решает только граница.',
    'The smallest value is the approximation minus the bound. All three records share the approximation, so only the bound decides the answer.'),
};

export default function D30_07(props) { return <PairSlots data={DATA} {...props} />; }
