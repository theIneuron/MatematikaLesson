// Dars03 · Amaliyot 06 — −12 · (7 − 3) ga teng yozuvlar · 🟡 · tag: same_as_distributed
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
//
// DARAJA KO'TARILDI (metodist qarori 2026-08-21): ko'paytuvchi manfiy, qavs
// ichida ayirish. Endi har variantda IKKI narsani tekshirish kerak: bo'lakka
// bo'lish to'g'rimi va ishora to'g'rimi.
//
// −120 · (7 − 3) = −120 · 4 = −480. Tekshirilgan:
//   −120 · 7 + 120 · 3 = −840 + 360 = −480   HA (taqsimot, ikkinchi ishora ag'darilgan)
//   −120 · 4           = −480              HA (qavs ichi hisoblangan)
//   120 · (3 − 7)      = 120 · (−4) = −480  HA (ikki ishora ham ag'darilgan)
//   −120 · 7 − 120 · 3 = −1200             yo'q (ikkinchi ishora o'zgarmagan)
//   −120 · 7 + 3       = −837              yo'q (ikkinchi songa yetmagan)
//   120 · 7 − 120 · 3  = 480               yo'q (ishora butunlay teskari)
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'same_as_distributed', level: '🟡', col: 180, itemSize: 20,
  eyebrow: L('Bir xil qiymat', 'То же значение', 'The same value'),
  setup: L(
    "−120 · (7 − 3) ning qiymati −480. Bunga bir necha yo'l bilan yetish mumkin, lekin har yozuv emas: ishora bitta joyda xato bo'lsa, natija boshqa chiqadi.",
    'Значение −120 · (7 − 3) равно −480. К нему можно прийти разными путями, но не любая запись годится: одна ошибка в знаке — и результат другой.',
    'The value of −120 · (7 − 3) is −480. Several paths lead there, but not any record: one wrong sign and the result differs.'),
  ask: L('−120 · (7 − 3) ga TENG hamma yozuvni belgilang.', 'Отметь все записи, равные −120 · (7 − 3).', 'Mark every record equal to −120 · (7 − 3).'),
  note: L("Bir nechta bo'lishi mumkin.", 'Их может быть несколько.', 'There can be several.'),
  items: [
    { id: 'p1', tokens: ['−120', '·', '7', '+', '120', '·', '3'], hit: true },
    { id: 'n1', tokens: ['−120', '·', '7', '−', '120', '·', '3'], hit: false },
    { id: 'p2', tokens: ['−120', '·', '4'], hit: true },
    { id: 'n2', tokens: ['−120', '·', '7', '+', '3'], hit: false },
    { id: 'p3', tokens: ['120', '·', '(', '3', '−', '7', ')'], hit: true },
    { id: 'n3', tokens: ['120', '·', '7', '−', '120', '·', '3'], hit: false },
  ],
  correctText: L(
    "To'g'ri. Qavs ichini hisoblash ham, taqsimlash ham, ikki ishorani birga ag'darish ham −480 beradi.",
    'Верно. И счёт в скобке, и распределение, и переворот обоих знаков сразу дают −480.',
    'Correct. Working out the bracket, distributing, and flipping both signs at once all give −480.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('n1') !== -1, text: L(
      "−120 · 7 − 120 · 3 = −1200. Qavs ichida AYIRISH turgan, ya'ni ikkinchi bo'lak ishorasini o'zgartiradi va qo'shiladi.",
      '−120 · 7 − 120 · 3 = −1200. В скобке было ВЫЧИТАНИЕ, значит вторая часть меняет знак и прибавляется.',
      '−120 · 7 − 120 · 3 = −1200. The bracket had a SUBTRACTION, so the second part flips sign and is added.') },
    { when: (s) => s.extra.indexOf('n3') !== -1, text: L(
      "120 · 7 − 120 · 3 = 480 -- moduli o'sha, lekin ishora teskari. Ko'paytuvchi manfiy edi.",
      '120 · 7 − 120 · 3 = 480 — по модулю то же, но знак обратный. Множитель был отрицательным.',
      '120 · 7 − 120 · 3 = 480 — the same size but the opposite sign. The factor was negative.') },
    { when: (s) => s.extra.indexOf('n2') !== -1, text: L(
      "−120 · 7 + 3 da ko'paytuvchi ikkinchi songa yetmagan: −840 + 3 = −837.",
      'В −120 · 7 + 3 множитель не дошёл до второго числа: −840 + 3 = −837.',
      'In −120 · 7 + 3 the factor did not reach the second number: −840 + 3 = −837.') },
    { when: (s) => s.miss.indexOf('p3') !== -1, text: L(
      "120 · (3 − 7) ni tekshirmadingiz: ikki ishora ham ag'darildi, qavs ichi −4 bo'ldi va 120 · (−4) = −480.",
      'Ты не проверил 120 · (3 − 7): оба знака перевернулись, в скобке вышло −4, и 120 · (−4) = −480.',
      'You did not check 120 · (3 − 7): both signs flipped, the bracket gave −4 and 120 · (−4) = −480.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Bittasi belgilanmadi: har yozuvni oxirigacha hisoblab −480 bilan solishtiring.",
      'Одну пропустил: досчитай каждую запись до конца и сравни с −480.',
      'One is missing: work each record out to the end and compare with −480.') },
  ],
  wrongText: L(
    "Har yozuvni oxirigacha hisoblang va −480 bilan solishtiring. Ishorani alohida tekshiring.",
    'Досчитай каждую запись до конца и сравни с −480. Знак проверяй отдельно.',
    'Work each record out to the end and compare with −480. Check the sign separately.'),
};

export default function D03_06(props) { return <MarkAll data={DATA} {...props} />; }
