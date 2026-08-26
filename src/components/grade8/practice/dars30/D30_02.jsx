// Dars30 · Amaliyot 02 — Mumkin · 🟢 · tag: in_range_marked
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §12 (30-dars, 2-pozitsiya)
//
// T2 NING TA'RIFI: `x = a ± h` yozuvi qo'sh tengsizlikni bildiradi —
// a minus h dan a qo'shuv h gacha. Ya'ni bu 26 va 27-darslarning ishi,
// faqat boshqa yozuvda.
//
// `20,5` — CHEGARA, va u KIRADI: `±` yozuvi qat'iy bo'lmagan tengsizlik
// beradi (|x − a| ≤ h). Bu karta topshiriqning o'zagi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'in_range_marked', level: '🟢',
  col: 130, itemSize: 18,
  given: [['x = 20 ± 0,5']],
  givenLabel: L('Yozuv', 'Запись', 'The record'),
  items: [
    { id: 'i1', tokens: ['19,6'], hit: true },
    { id: 'i2', tokens: ['19,4'] },
    { id: 'i3', tokens: ['20'], hit: true },
    { id: 'i4', tokens: ['21'] },
    { id: 'i5', tokens: ['20,5'], hit: true },
    { id: 'i6', tokens: ['20,6'] },
  ],
  eyebrow: L('Mumkin', 'Возможно', 'Possible'),
  setup: L(
    'Bu yozuv aniq qiymat qayerda yotishini aytadi: taqribiy qiymatdan chegara qadar ikki tomonga.',
    'Эта запись говорит, где лежит точное значение: на величину границы в обе стороны от приближённого.',
    "This record says where the exact value lies: the bound's distance to either side of the approximation."),
  ask: L(
    "x qabul qila oladigan 3 ta qiymatni belgilang.",
    'Отметь 3 значения, которые может принимать x.',
    'Mark the 3 values that x can take.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Chegaralar: o'n to'qqiz butun besh va yigirma butun besh. Yigirma butun beshning o'zi ham kiradi — plyus-minus qat'iy bo'lmagan tengsizlik beradi.",
    'Верно. Границы: девятнадцать целых пять и двадцать целых пять. Само двадцать целых пять тоже входит — плюс-минус даёт нестрогое неравенство.',
    'Correct. The bounds: nineteen point five and twenty point five. Twenty point five itself is included too — plus-minus gives a non-strict inequality.'),
  wrongs: [
    { when: (s) => s.miss.indexOf('i5') !== -1, text: L(
        "Yigirma butun besh KIRADI: plyus-minus «chegaradan uzoq emas» degani, ya'ni tenglik ham mumkin.",
        'Двадцать целых пять ВХОДИТ: плюс-минус означает «не дальше границы», то есть равенство разрешено.',
        'Twenty point five IS included: plus-minus means «no further than the bound», so equality is allowed.') },
    { when: (s) => s.extra.indexOf('i6') !== -1 || s.extra.indexOf('i4') !== -1, text: L(
      "Bu son oraliqning O'NG chetidan chiqib ketgan. Yuqori chegarani hisoblang: yigirma qo'shuv nol butun besh yigirma butun besh. Yigirma butun olti undan katta, yigirma bir esa ancha katta. Chegaradan chiqqan qiymat bu yozuvga mos kelmaydi.",
      'Это число вышло за ПРАВЫЙ край промежутка. Посчитай верхнюю границу: двадцать плюс ноль целых пять это двадцать целых пять. Двадцать целых шесть больше неё, а двадцать один намного больше. Значение за границей этой записи не соответствует.',
      'That number lies beyond the RIGHT edge of the range. Compute the upper bound: twenty plus zero point five is twenty point five. Twenty point six is above it, and twenty one is far above. A value beyond the bound does not fit this record.') },
    { when: (s) => s.extra.indexOf('i2') !== -1, text: L(
      "Bu son oraliqning CHAP chetidan chiqib ketgan. Quyi chegarani hisoblang: yigirma minus nol butun besh o'n to'qqiz butun besh. O'n to'qqiz butun to'rt undan kichik, ya'ni yozuvga mos kelmaydi. Chegara ikki tomonda ham bir xil masofada turadi — bu plyus-minus yozuvining ma'nosi.",
      'Это число вышло за ЛЕВЫЙ край промежутка. Посчитай нижнюю границу: двадцать минус ноль целых пять это девятнадцать целых пять. Девятнадцать целых четыре меньше неё, значит записи не соответствует. Граница отстоит одинаково в обе стороны — в этом и смысл записи с плюс-минусом.',
      'That number lies beyond the LEFT edge of the range. Compute the lower bound: twenty minus zero point five is nineteen point five. Nineteen point four is below it, so it does not fit the record. The bound stands at the same distance on both sides — that is what the plus-minus record means.') },
    { when: (s) => s.marked.length !== 3, text: L(
      "Aynan uchta qiymat kerak. Avval ikki chegarani hisoblang: yigirma minus nol butun besh va yigirma qo'shuv nol butun besh. Keyin har sonni shu ikki chegara bilan solishtiring, chegaralarning o'zini ham kiritib.",
      'Нужно ровно три значения. Сначала посчитай две границы: двадцать минус ноль целых пять и двадцать плюс ноль целых пять. Потом сравни каждое число с этими границами, включая и сами границы.',
      'Exactly three values are needed. First compute the two bounds: twenty minus zero point five and twenty plus zero point five. Then compare every number with them, the bounds themselves included.') },
  ],
  wrongText: L(
    "Yozuvni ikki chegaraga oching: taqribiy qiymatdan chegara qadar chapga va o'ngga. Chegaralarning o'zi ham oraliqqa kiradi.",
    'Раскрой запись в две границы: на величину границы влево и вправо от приближённого значения. Сами границы в промежуток тоже входят.',
    'Unfold the record into two bounds: the bound\'s distance to the left and to the right of the approximation. The bounds themselves belong to the range too.'),
};

export default function D30_02(props) { return <MarkAll data={DATA} {...props} />; }
