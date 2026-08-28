// Dars05 · Amaliyot 08 — Xato qator · 🔴 · teg: ishora-teskari-siljish
// Faqat MA'LUMOT. Mexanika: `grade9/practice/asboblar9.jsx` -> AuditLines.
// Kontent: src/books/grade9/DARS05_AMALIYOT_KONTENT.md §08
//
// Birinchi qatorda formula TO'G'RI yozilgan (qavs ichida AYIRISH bilan),
// ikkinchi qatorda esa yozuvdagi QO'SHISH bilan solishtirilganda ishora
// hisobga olinmagan. Xato aynan shu solishtirishda.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { L } from '../../../grade8/practice/kit.jsx';
import { AuditLines } from '../asboblar9.jsx';

const DATA = {
  tag: 'ishora-teskari-siljish', level: '🔴',
  eyebrow: L('Xato qator', 'Ошибочная строка', 'Wrong line'),
  setup: L(
    "Yechim tayyor, lekin javob noto'g'ri. Har bir qator to'g'riday ko'rinadi.",
    'Решение готово, но ответ неверный. Каждая строка выглядит правильной.',
    'The solution is finished, but the answer is wrong. Every line looks right.'),
  ask: L('Birinchi xato qatorni bosing.', 'Нажми первую ошибочную строку.', 'Tap the first wrong line.'),
  givenLabel: L('Toping', 'Найти', 'Find'),
  given: [['y = (x + 4)² − 1', '→', 'uchi = ?']],
  exprSize: 17,
  rows: [
    { id: 'r1', text: L('Uchi formulasi:', 'Формула вершины:', 'The vertex formula:'), tokens: ['y = (x − x₀)² + y₀'] },
    { id: 'r2', text: L('Solishtiramiz:', 'Сравниваем:', 'Compare:'), tokens: ['x₀ = 4', ',', 'y₀ = −1'] },
    { id: 'r3', text: L('Uchi:', 'Вершина:', 'Vertex:'), tokens: ['(4; −1)'] },
    { id: 'r4', text: L('Javob:', 'Ответ:', 'Answer:'), tokens: ['(4; −1)'] },
  ],
  answerId: 'r2',
  correctText: L(
    "To'g'ri, xato ikkinchi qatorda. Formulada qavs ichida iks MINUS iks nol turibdi, yozuvda esa iks QO'SHUV to'rt. Ikkalasini solishtirsak, minus iks nol qo'shuv to'rtga teng, ya'ni iks nol minus to'rtga teng. Uchi minus to'rtda, to'rtda emas — parabola chapga siljigan.",
    'Верно, ошибка во второй строке. В формуле в скобке стоит икс МИНУС икс нулевое, а в записи икс ПЛЮС четыре. Сравнив их, получаем: минус икс нулевое равно плюс четырём, то есть икс нулевое равно минус четырём. Вершина в минус четырёх, а не в четырёх — парабола сдвинута влево.',
    'Correct, the error is in the second line. The formula has x MINUS x-nought inside the bracket, while the record has x PLUS four. Comparing them: minus x-nought equals plus four, so x-nought equals minus four. The vertex is at minus four, not at four — the parabola is shifted left.'),
  wrongs: [
    { when: (s) => s.picked === 'r1', text: L(
      "Bu qator to'g'ri: uchi formulasi aynan shunday yoziladi, qavs ichida ayirish bilan. Xatoni undan pastda qidiring.",
      'Эта строка верна: формула вершины так и записывается, со знаком минус в скобке. Ищи ошибку ниже.',
      'This line is right: the vertex formula is written exactly like that, with a minus inside the bracket. Look for the error below.') },
    { when: (s) => s.picked === 'r3', text: L(
      "Uchinchi qator ikkinchisining natijasi: agar iks nol haqiqatan to'rt bo'lganida, uchi shu yerda bo'lardi. Xato undan yuqorida.",
      'Третья строка — результат второй: если бы икс нулевое и правда равнялось четырём, вершина была бы там. Ошибка выше.',
      'The third line is the result of the second: if x-nought really were four, the vertex would be there. The error is above.') },
    { when: (s) => s.picked === 'r4', text: L(
      "To'rtinchi qator uchinchisini takrorlaydi. Bizga BIRINCHI xato kerak, oxirgisi emas.",
      'Четвёртая строка повторяет третью. Нам нужна ПЕРВАЯ ошибка, а не последняя.',
      'The fourth line repeats the third. We need the FIRST error, not the last one.') },
  ],
  wrongText: L(
    "Formuladagi qavs bilan yozuvdagi qavsni yonma-yon qo'ying. Formulada ayirish, yozuvda esa qo'shish — iks nol qanday chiqadi?",
    'Положи рядом скобку из формулы и скобку из записи. В формуле вычитание, в записи сложение — каким тогда получается икс нулевое?',
    'Put the bracket from the formula next to the bracket from the record. The formula subtracts, the record adds — what does x-nought come out as?'),
};

export default function D05_08(props) { return <AuditLines data={DATA} {...props} />; }
