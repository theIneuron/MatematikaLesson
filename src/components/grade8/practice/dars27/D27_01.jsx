// Dars27 · Amaliyot 01 — Ha yoki yo'q · 🟢 · tag: interval_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §9 (27-dars, 1-pozitsiya)
//
// З56 ENG QISQA SHAKLDA. Ikki yozuvda AYNAN o'sha ikki son turadi, farq
// esa faqat QAVSNING turida: kvadrat qavs chegarani kiritadi, dumaloq qavs
// kiritmaydi.
//
// Bu 25-darsning davomi: u yerda o'sha farq belgining ostidagi chiziq edi,
// bu yerda esa qavsning shakli. Ma'no bir xil.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'interval_claims', level: '🟢',
  itemSize: 18,
  items: [
    { id: 's1', yes: true,
      tokens: ['[2; 5]'],
      claim: L("2 bu to'plamga kiradi", '2 входит в это множество', '2 belongs to this set') },
    { id: 's2', yes: false,
      tokens: ['(2; 5)'],
      claim: L("2 bu to'plamga kiradi", '2 входит в это множество', '2 belongs to this set') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "Ikki yozuvda bir xil ikki son turibdi, farq esa faqat qavsning turida. Kvadrat qavs va dumaloq qavs bir xil narsani anglatmaydi.",
    'В двух записях стоят одни и те же два числа, а различие только в типе скобки. Квадратная и круглая скобки означают не одно и то же.',
    'The two records hold the same two numbers and differ only in the type of bracket. A square bracket and a round one do not mean the same thing.'),
  ask: L(
    "Da'vo rost bo'lsa «Ha», yolg'on bo'lsa «Yo'q».",
    'Если утверждение верно — «Да», если ложно — «Нет».',
    'If the claim is true, «Yes»; if false, «No».'),
  correctText: L(
    "To'g'ri. Kvadrat qavs chegarani kiritadi: bu KESMA. Dumaloq qavs esa chiqarib tashlaydi: bu INTERVAL. Sonlar bir xil, chegaralarning taqdiri esa boshqa.",
    'Верно. Квадратная скобка включает границу: это ОТРЕЗОК. А круглая исключает: это ИНТЕРВАЛ. Числа одни и те же, а судьба границ разная.',
    'Correct. A square bracket includes the boundary: this is a SEGMENT. A round one excludes it: this is an INTERVAL. The numbers are the same; the fate of the boundaries differs.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Ikkinchi yozuvda DUMALOQ qavs turibdi, va u chegarani chiqarib tashlaydi. Tengsizlik bilan yozing: ikki x dan qat'iy kichik. Ikkining o'zini qo'ying — ikki ikkidan qat'iy kichik emas, u unga teng. Demak ikki bu to'plamga kirmaydi, garchi u yozuvda ko'rinib tursa ham.",
      'Во второй записи стоит КРУГЛАЯ скобка, и она границу исключает. Запиши неравенством: два строго меньше x. Подставь саму двойку — два не строго меньше двух, оно ему равно. Значит два в это множество не входит, хотя в записи оно и стоит.',
      'The second record has a ROUND bracket, and it excludes the boundary. Write it as an inequality: two is strictly less than x. Substitute two itself — two is not strictly less than two, it equals it. So two does not belong to this set, even though it appears in the record.') },
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Birinchi da'vo rost. KVADRAT qavs chegarani kiritadi: ikki x dan kichik YOKI TENG. Ikkining o'zini qo'ying — ikki ikkiga teng, ya'ni shart bajarildi. Bunday to'plam kesma deyiladi va uning chetlari to'plamning o'ziga tegishli.",
      'Первое утверждение верно. КВАДРАТНАЯ скобка границу включает: два меньше x ИЛИ РАВНО ему. Подставь саму двойку — два равно двум, значит условие выполнено. Такое множество называется отрезком, и его концы принадлежат самому множеству.',
      'The first claim is true. A SQUARE bracket includes the boundary: two is less than x OR EQUAL to it. Substitute two itself — two equals two, so the condition holds. Such a set is called a segment, and its endpoints belong to the set itself.') },
  ],
  wrongText: L(
    "Qavsning turiga qarang: kvadrat qavs chegarani kiritadi, dumaloq qavs chiqarib tashlaydi. Tekshirish uchun yozuvni tengsizlik bilan yozing va chegara sonining o'zini qo'ying.",
    'Смотри на тип скобки: квадратная границу включает, круглая исключает. Для проверки запиши выражение неравенством и подставь само граничное число.',
    'Look at the type of bracket: a square one includes the boundary, a round one excludes it. To check, write the record as an inequality and substitute the boundary number itself.'),
};

export default function D27_01(props) { return <TrueFalse data={DATA} {...props} />; }
