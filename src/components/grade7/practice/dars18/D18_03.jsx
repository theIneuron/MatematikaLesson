// Dars18 · Amaliyot 03 — Xato had qaysi · 🟢 · fix · tag: poly_fix
// Faqat MA'LUMOT. Mexanika: kit.jsx -> TapTerms. Raskladka: 3-o'rin.
//
// Boshqa o'quvchining javobi: 7c³ − 4c + 2c³ − 9 = 9c³ − 4c + 9
//   9c³ TO'G'RI (7 + 2), −4c TO'G'RI (o'xshashi yo'q),
//   +9 NOTO'G'RI: ozod had −9 edi, ishorasi o'zgarmasligi kerak.
// Yaqin tuzoq: birinchi ikki had to'g'ri, ularni belgilash oson xato.
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'poly_fix', level: '🟢',
  eyebrow: L('Xato had', 'Неверный член', 'The wrong term'),
  setup: L(
    "Boshqa o'quvchi ixchamlab javob yozdi, lekin bitta had noto'g'ri. Har hadni asl yozuv bilan solishtiring: ishora hadning bir qismi.",
    'Другой ученик привёл подобные и записал ответ, но один член неверный. Сверь каждый член с исходной записью: знак это часть члена.',
    'Another pupil collected the terms and wrote an answer, but one term is wrong. Compare each term with the original: a sign is part of its term.'),
  given: [['7c³', '−', '4c', '+', '2c³', '−', '9']],
  givenLabel: L('Asl yozuv:', 'Исходная запись:', 'The original:'),
  ask: L("Javobdagi NOTO'G'RI hadni belgilang.", 'Отметь НЕВЕРНЫЙ член в ответе.', 'Mark the WRONG term in the answer.'),
  note: L('Bitta had.', 'Один член.', 'One term.'),
  parts: [
    { k: 'term', id: 't1', v: '9c³' },
    { k: 'sign', v: '−' },
    { k: 'term', id: 't2', v: '4c' },
    { k: 'sign', v: '+' },
    { k: 'term', id: 't3', v: '9' },
  ],
  want: ['t3'],
  correctText: L(
    "To'g'ri. Asl yozuvda ozod had −9, ya'ni javobda ham −9 bo'lishi kerak. Qolgan hadlar to'g'ri: 7 + 2 = 9 va −4c ning o'xshashi yo'q.",
    'Верно. В исходной записи свободный член −9, значит и в ответе должно быть −9. Остальные члены верны: 7 + 2 = 9, а у −4c подобных нет.',
    'Correct. The original free term is −9, so the answer needs −9 too. The other terms are right: 7 + 2 = 9, and −4c has no like term.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('t1') !== -1, text: L(
      "9c³ to'g'ri: 7c³ va 2c³ o'xshash, koeffitsiyentlari 7 + 2 = 9. Xato boshqa hadda.",
      '9c³ верно: 7c³ и 2c³ подобны, коэффициенты 7 + 2 = 9. Ошибка в другом члене.',
      '9c³ is right: 7c³ and 2c³ are alike, the coefficients give 7 + 2 = 9. The error is elsewhere.') },
    { when: (s) => s.extra.indexOf('t2') !== -1, text: L(
      "4c ham to'g'ri: unga o'xshash had yo'q, shuning uchun o'sha holda ko'chadi.",
      '4c тоже верно: подобного члена у него нет, поэтому он переходит как есть.',
      '4c is right too: it has no like term, so it carries over unchanged.') },
    { when: (s) => s.miss.length > 0, text: L(
      "Ozod hadni tekshiring: asl yozuvda u qanday ishora bilan turgan?",
      'Проверь свободный член: с каким знаком он стоит в исходной записи?',
      'Check the free term: what sign does it carry in the original?') },
  ],
  wrongText: L(
    "Javobning har hadini asl yozuvdagi hadi bilan solishtiring, ishorasiga ham qarang.",
    'Сверь каждый член ответа с членом исходной записи, посмотри и на знак.',
    'Compare each term of the answer with the original, sign included.'),
};

export default function D18_03(props) { return <TapTerms data={DATA} {...props} />; }
