// Dars15 · Amaliyot 04 — Juftlash · 🟡 · tag: abc_to_equation
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
// Skelet: DARS15_20_AMALIYOT_SKELET.md §3 (15-dars, 4-pozitsiya)
//
// TO'RT TENGLAMADA BIR XIL SONLAR: 1, 4, 3. Farqi faqat ISHORALARDA va
// TARTIBDA. Shuning uchun «sonlarni topib qo'yish» yo'li ishlamaydi — har
// koeffitsiyentni o'z joyida, o'z ishorasi bilan o'qish kerak (З39).
//
// Uchinchi va to'rtinchi juftlik eng qimmat: uchinchisida c manfiy,
// to'rtinchisida esa a va c O'RIN ALMASHGAN — uchlikning tartibi ham
// ma'noga ega.
// Chapda SO'Z (`items[].label`), o'ngda YOZUV (`targets[].tokens`).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const DATA = {
  tag: 'abc_to_equation', level: '🟡',
  connect: true,
  targetSize: 15,
  items: [
    { id: 'm1', label: L('a = 1, b = −4, c = 3', 'a = 1, b = −4, c = 3', 'a = 1, b = −4, c = 3') },
    { id: 'm2', label: L('a = 1, b = 4, c = 3', 'a = 1, b = 4, c = 3', 'a = 1, b = 4, c = 3') },
    { id: 'm3', label: L('a = 1, b = −4, c = −3', 'a = 1, b = −4, c = −3', 'a = 1, b = −4, c = −3') },
    { id: 'm4', label: L('a = 3, b = −4, c = 1', 'a = 3, b = −4, c = 1', 'a = 3, b = −4, c = 1') },
  ],
  targets: [
    { id: 't1', tokens: ['x² − 4x + 3 = 0'] },
    { id: 't2', tokens: ['x² + 4x + 3 = 0'] },
    { id: 't3', tokens: ['x² − 4x − 3 = 0'] },
    { id: 't4', tokens: ['3x² − 4x + 1 = 0'] },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Juftlash', 'Пары', 'Pairs'),
  setup: L(
    "To'rt tenglamada bir xil sonlar qatnashadi: bir, to'rt va uch. Farqi faqat ishoralarda va koeffitsiyentlarning o'rnida.",
    'В четырёх уравнениях участвуют одни и те же числа: один, четыре и три. Различаются они только знаками и местами коэффициентов.',
    'The same numbers appear in all four equations: one, four and three. They differ only in signs and in which place each coefficient takes.'),
  ask: L(
    "Chapdan koeffitsiyentlarni bosing, keyin o'ngdan uning tenglamasini bosing.",
    'Нажми коэффициенты слева, потом его уравнение справа.',
    'Tap the coefficients on the left, then its equation on the right.'),
  correctText: L(
    "To'g'ri. Har tenglamada uch koeffitsiyent o'z joyida o'qiladi: a — x kvadratning oldidan, b — x ning oldidan, c — harfsiz son.",
    'Верно. В каждом уравнении три коэффициента читаются по своим местам: a — перед икс квадрат, b — перед иксом, c — число без буквы.',
    'Correct. In every equation the three coefficients are read from their own places: a in front of x squared, b in front of x, c the number without a letter.'),
  wrongs: [
    { when: (s) => s.pair.m1 === 't2' || s.pair.m2 === 't1', text: L(
      "Bu ikki tenglamada faqat b ning ishorasi farq qiladi. x ning oldidagi belgiga qarang: minus to'rt x bo'lsa b minus to'rt, arti to'rt x bo'lsa b arti to'rt. Boshqa hamma narsa ikkalasida bir xil.",
      'В этих двух уравнениях различается только знак b. Смотри на знак перед иксом: если минус четыре икс, то b минус четыре; если плюс четыре икс, то b плюс четыре. Всё остальное у них одинаково.',
      'These two equations differ only in the sign of b. Look at the sign in front of x: minus four x means b is minus four, plus four x means b is plus four. Everything else is the same.') },
    { when: (s) => s.pair.m3 !== 't3', text: L(
      "Uchinchi uchlikda ozod had MANFIY. Tenglamaning oxiriga qarang: minus uch bo'lsa c minus uch, arti uch bo'lsa c arti uch. Bu ikki yozuv boshqa-boshqa tenglama: birinchisining ildizlari bir va uch, ikkinchisining ildizlari butun ham emas.",
      'В третьей тройке свободный член ОТРИЦАТЕЛЬНЫЙ. Смотри на конец уравнения: минус три — значит c минус три, плюс три — значит c плюс три. Это два разных уравнения: у первого корни один и три, у второго корни даже не целые.',
      'In the third triple the constant term is NEGATIVE. Look at the end of the equation: minus three means c is minus three, plus three means c is plus three. These are two different equations: the first has roots one and three, the second has roots that are not even whole.') },
    { when: (s) => s.pair.m4 !== 't4', text: L(
      "To'rtinchi uchlikda bosh koeffitsiyent uchga teng, ozod had esa birga. Bunday tenglamada x kvadratning oldida uch turadi — yozuvni boshidan o'qing. Uchlikning tartibi ham ma'noga ega: a, b, c.",
      'В четвёртой тройке старший коэффициент равен трём, а свободный член единице. В таком уравнении перед икс квадрат стоит три — читай запись с начала. Порядок в тройке тоже значим: a, b, c.',
      'In the fourth triple the leading coefficient is three and the constant term is one. In such an equation a three stands in front of x squared — read the record from the start. The order in the triple matters too: a, b, c.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har tenglamada uch joyni ketma-ket o'qing: x kvadratning oldi, x ning oldi, harfsiz son. Har birini ISHORASI bilan oling.",
      'В каждом уравнении читай три места по порядку: перед икс квадрат, перед иксом, число без буквы. Каждое бери ВМЕСТЕ со знаком.',
      'Read three places in order in every equation: in front of x squared, in front of x, the number without a letter. Take each one together with its sign.') },
  ],
  wrongText: L(
    "Koeffitsiyentni o'z joyidan va o'z ishorasi bilan o'qing. To'rt tenglamada sonlar bir xil, shuning uchun faqat ishora va o'rin ajratib turadi.",
    'Читай коэффициент с его места и вместе с его знаком. В четырёх уравнениях числа одинаковы, поэтому различают только знак и место.',
    'Read each coefficient from its own place together with its own sign. The numbers are the same in all four equations, so only the sign and the place tell them apart.'),
};

export default function D15_04(props) { return <MatchPairs data={DATA} {...props} />; }
