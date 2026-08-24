// Dars05 · Amaliyot 06 — Ko'paytirdikmi yoki bo'ldikmi · 🟡 · tag: mul_or_div_result
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
//
// To'rt ifoda, to'rt natija. Ifodalar JUFT-JUFT: bir xil kasrlar, faqat
// amal boshqa. Shuning uchun natijani ko'z bilan taxmin qilib bo'lmaydi —
// amalni o'qish kerak.
//   (m/3) · (6/m) = 2          (m/3) : (6/m) = m²/18
//   (3/m) · (m/3) = 1          (3/m) : (m/3) = 9/m²
// Birinchi juftlik ikkinchisidan farq qiladi: ko'paytmalar SON beradi,
// bo'linmalar esa harf bilan qoladi.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const DATA = {
  tag: 'mul_or_div_result', level: '🟡',
  itemSize: 14,
  items: [
    { id: 'm1', tokens: [{ n: 'm', d: '3' }, '·', { n: '6', d: 'm' }] },
    { id: 'm2', tokens: [{ n: 'm', d: '3' }, ':', { n: '6', d: 'm' }] },
    { id: 'm3', tokens: [{ n: '3', d: 'm' }, '·', { n: 'm', d: '3' }] },
    { id: 'm4', tokens: [{ n: '3', d: 'm' }, ':', { n: 'm', d: '3' }] },
  ],
  targets: [
    { id: 't1', label: '2' },
    { id: 't2', label: 'm² / 18' },
    { id: 't3', label: '1' },
    { id: 't4', label: '9 / m²' },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Juftlash', 'Пары', 'Pairs'),
  setup: L(
    "To'rt ifoda juft-juft: kasrlar bir xil, amal esa boshqa. Natijani faqat amalni o'qib topish mumkin.",
    'Четыре выражения попарно: дроби одинаковые, а действие разное. Результат можно найти, только прочитав действие.',
    'The four expressions come in pairs: the fractions are the same, the operation differs. The result can only be found by reading the operation.'),
  ask: L(
    "Chapdan ifodani bosing, keyin o'ngdan natijani bosing.",
    'Нажми выражение слева, потом результат справа.',
    'Tap an expression on the left, then its result on the right.'),
  correctText: L(
    "To'g'ri. Ko'paytirishda harflar qarama-qarshi qavatlarda uchrashadi va qisqaradi — shuning uchun ikkala ko'paytma ham SON beradi. Bo'lishda esa ikkinchi kasr ag'dariladi, harf o'sha qavatga ikkinchi marta tushadi va kvadratga aylanadi.",
    'Верно. При умножении буквы встречаются на противоположных этажах и сокращаются — поэтому оба произведения дают ЧИСЛО. А при делении вторая дробь переворачивается, буква во второй раз попадает на тот же этаж и возводится в квадрат.',
    'Correct. In multiplication the letters meet on opposite floors and cancel — that is why both products give a NUMBER. In division the second fraction is flipped, the letter lands on the same floor a second time and becomes squared.'),
  wrongs: [
    { when: (s) => s.pair.m1 === 't2' || s.pair.m2 === 't1', text: L(
      "Birinchi juftlikda amallar almashib ketdi. Ko'paytmada m tepada va pastda uchrashadi va qisqaradi — ikkilik qoladi. Bo'linmada esa ikkinchi kasr ag'dariladi va m tepaga ikkinchi marta chiqadi.",
      'В первой паре перепутаны действия. В произведении m встречается сверху и снизу и сокращается — остаётся двойка. А в частном вторую дробь переворачивают, и m второй раз оказывается сверху.',
      'The operations in the first pair got swapped. In the product m meets above and below and cancels — a two is left. In the quotient the second fraction is flipped and m goes up a second time.') },
    { when: (s) => s.pair.m3 === 't4' || s.pair.m4 === 't3', text: L(
      "Ikkinchi juftlikda amallar almashib ketdi. Uch bo'lingan m karra m bo'lingan uch — hamma narsa qisqaradi va bir qoladi. Bo'lishda esa uch bo'lingan m ikki marta olinadi.",
      'Во второй паре перепутаны действия. Три делить на m на m делить на три — всё сокращается и остаётся единица. А при делении три делить на m берётся дважды.',
      'The operations in the second pair got swapped. Three over m times m over three — everything cancels and one is left. In division three over m is taken twice.') },
    { when: (s) => s.pair.m2 === 't4' || s.pair.m4 === 't2', text: L(
      "Bo'linmalar almashib ketdi. Birinchisida m tepada edi, demak kvadrat ham tepada; ikkinchisida m pastda edi, demak kvadrat pastda.",
      'Частные перепутаны. В первом m была сверху, значит и квадрат сверху; во втором m была снизу, значит квадрат снизу.',
      'The quotients got swapped. In the first, m was on top, so the square is on top; in the second, m was below, so the square is below.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har ifodada avval AMALNI o'qing. Ko'paytirish bo'lsa — tepa tepaga, past pastga. Bo'lish bo'lsa — ikkinchi kasrni ag'daring va shundan keyin ko'paytiring.",
      'В каждом выражении сначала прочитай ДЕЙСТВИЕ. Умножение — верх на верх, низ на низ. Деление — переверни вторую дробь и только потом умножай.',
      'In each expression read the OPERATION first. Multiplication: top with top, bottom with bottom. Division: flip the second fraction, then multiply.') },
  ],
  wrongText: L(
    "Amal belgisiga qarang. Nuqta bo'lsa to'g'ridan-to'g'ri ko'paytiring; ikki nuqta bo'lsa avval ikkinchi kasrni ag'daring.",
    'Смотри на знак действия. Точка — умножай напрямую; двоеточие — сначала переверни вторую дробь.',
    'Look at the operation sign. A dot means multiply directly; a colon means flip the second fraction first.'),
};

export default function D05_06(props) { return <MatchPairs data={DATA} {...props} />; }
