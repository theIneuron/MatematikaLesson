// Dars03 · Amaliyot 07 — Test · 🟡 · tag: full_answer_choice
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> Choice.
// Kontent: src/books/grade8/DARS03_AMALIYOT_KONTENT_V2.md §07
//
// Ilgari bu o'rinda `RepairPart` turgan (javobdagi xato bo'lakni tuzatish).
// Metodist qarori 2026-08-24: o'nta mexanika 1-darsdan olinadi, shuning uchun
// xato yozuv endi VARIANT bo'lib keladi.
//
// TEST TAXMIN BILAN YECHILMASLIGI UCHUN uch variantda kasrning O'ZI bir xil,
// farq faqat SHARTDA — ya'ni shartni o'zi chiqarish kerak:
//   0  3/(h−3),  h ≠ 3, h ≠ −3   TO'G'RI
//   1  3/(h−3),  h ≠ 3           shart JAVOBdan olindi, qisqargani unutildi
//   2  3/(h−3),  shartsiz        qisqartirish taqiqni olib tashladi deb o'ylash
//   3  3/(h+3),  h ≠ 3, h ≠ −3   noto'g'ri qavs qoldirildi
// Variantlar har ochilganda aralashtiriladi, razbor shartlari ASL raqamda.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Choice, L } from '../kit.jsx';

const F = { n: '3', d: 'h − 3' };

const DATA = {
  tag: 'full_answer_choice', level: '🟡',
  correct: 0, optCols: 1, optSize: 17,
  eyebrow: L('Test', 'Тест', 'Test'),
  setup: L(
    "Kasr qisqartirildi. Javobda yozuvning o'zi ham, sharti ham to'g'ri bo'lishi kerak.",
    'Дробь сократили. В ответе должны быть верны и сама запись, и условие.',
    'The fraction was cancelled. In the answer both the record and the condition must be right.'),
  expr: [{ n: '3h + 9', d: 'h² − 9' }], exprSize: 24,
  ask: L("To'liq va to'g'ri javob qaysi?", 'Какой ответ полный и верный?', 'Which answer is complete and correct?'),
  opts: [
    { label: [F, ',', 'h ≠ 3,', 'h ≠ −3'] },
    { label: [F, ',', 'h ≠ 3'] },
    { label: [F] },
    { label: [{ n: '3', d: 'h + 3' }, ',', 'h ≠ 3,', 'h ≠ −3'] },
  ],
  correctText: L(
    "To'g'ri. Tepada uchtani qavsdan chiqaramiz: uch karra h qo'shuv uch. Pastda kvadratlar ayirmasi: h minus uch karra h qo'shuv uch. h qo'shuv uch qisqaradi va uch bo'linadi h minus uchga qoladi. Shart esa DASTLABKI maxrajdan olinadi, u ikki joyda nolga aylanadi — uchda va minus uchda. Minus uch javobda ko'rinmaydi, lekin taqiq bo'lib qolaveradi.",
    'Верно. Сверху выносим тройку: три на h плюс три. Снизу разность квадратов: h минус три на h плюс три. h плюс три сокращается, остаётся три делить на h минус три. Условие берут из ИСХОДНОГО знаменателя, а он обращается в нуль в двух местах — при трёх и при минус трёх. Минус три в ответе не видно, но запретом он остаётся.',
    'Correct. Above, a three is taken out: three times h plus three. Below, a difference of squares: h minus three times h plus three. h plus three cancels and three over h minus three is left. The condition comes from the ORIGINAL denominator, and that is zero in two places — at three and at minus three. Minus three is invisible in the answer, but it stays a ban.'),
  wrongs: [
    { when: (s) => s.picked === 1, text: L(
      "Shartni JAVOBdan oldingiz. Qisqargan yozuvda h qo'shuv uch yo'q, lekin dastlabki maxrajda u bor edi: minus uchda h kvadrat minus to'qqiz nolga aylanadi. Qo'yib tekshiring.",
      'Ты взял условие из ОТВЕТА. В сокращённой записи h плюс три нет, но в исходном знаменателе он был: при минус трёх h в квадрате минус девять обращается в нуль. Проверь подстановкой.',
      'You took the condition from the ANSWER. The cancelled record has no h plus three, but the original denominator did: at minus three h squared minus nine becomes zero. Check by substituting.') },
    { when: (s) => s.picked === 2, text: L(
      "Kasr to'g'ri, shart esa umuman yozilmagan. Qisqartirish taqiqni olib tashlamaydi: dastlabki kasr uchda ham, minus uchda ham mavjud emas edi.",
      'Дробь верна, а условие не записано вовсе. Сокращение запрет не снимает: исходная дробь не существовала ни при трёх, ни при минус трёх.',
      'The fraction is right, but the condition is missing entirely. Cancelling does not lift a ban: the original fraction did not exist at three nor at minus three.') },
    { when: (s) => s.picked === 3, text: L(
      "Noto'g'ri qavs qoldirilgan. Qisqargani h qo'shuv uch, demak pastda IKKINCHI qavs qoladi — h minus uch. h ni nolga teng qo'ying: dastlabki kasr to'qqiz bo'lingan minus to'qqiz, ya'ni minus bir.",
      'Оставлена не та скобка. Сократилась h плюс три, значит снизу остаётся ВТОРАЯ скобка — h минус три. Подставь h равное нулю: исходная дробь — девять делить на минус девять, то есть минус один.',
      'The wrong bracket was kept. What cancelled is h plus three, so the OTHER bracket is left below — h minus three. Put h equal to zero: the original is nine over minus nine, that is minus one.') },
  ],
  wrongText: L(
    "Ikkala qavatni ajrating, umumiy qavsni qisqartiring, shartni esa faqat DASTLABKI maxrajdan oling — u yerda ikkita nol bor. Keyin javobni son bilan tekshiring.",
    'Разложи оба этажа, сократи общую скобку, а условие возьми только из ИСХОДНОГО знаменателя — там два нуля. Потом проверь ответ числом.',
    'Factor both floors, cancel the common bracket, and take the condition only from the ORIGINAL denominator — it has two zeros. Then check the answer with a number.'),
};

export default function D03_07(props) { return <Choice data={DATA} {...props} />; }
