// Dars26 · Amaliyot 10 — Juftlash · 🔴 · tag: system_to_answer
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
// Skelet: DARS21_30_AMALIYOT_SKELET.md §8 (26-dars, 10-pozitsiya)
//
// TO'RT SISTEMADA O'SHA IKKI SON — ikki va besh. Farq faqat TENGSIZLIK
// BELGILARIDA, natijalar esa to'rt xil turda:
//   x>2, x<5 -> oraliq        (nurlar bir-birini kesib o'tadi)
//   x>2, x>5 -> nur           (bittasi ikkinchisining ichida)
//   x<2, x<5 -> nur           (yana ichma-ich, lekin boshqa tomonga)
//   x>5, x<2 -> yechim yo'q   (nurlar umuman uchrashmaydi)
//
// Ya'ni sistemaning javobi doim oraliq bo'lmaydi, va «yechim yo'q» ham
// to'liq javob (T2).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const DATA = {
  tag: 'system_to_answer', level: '🔴',
  connect: true,
  targetSize: 14, itemSize: 15,
  items: [
    { id: 'm1', tokens: ['2 < x < 5'] },
    { id: 'm2', tokens: ['x > 5'] },
    { id: 'm3', tokens: ['x < 2'] },
    { id: 'm4', label: L("yechim yo'q", 'решений нет', 'no solutions') },
  ],
  targets: [
    { id: 't1', tokens: ['x > 2,   x < 5'] },
    { id: 't2', tokens: ['x > 2,   x > 5'] },
    { id: 't3', tokens: ['x < 2,   x < 5'] },
    { id: 't4', tokens: ['x > 5,   x < 2'] },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Juftlash', 'Пары', 'Pairs'),
  setup: L(
    "To'rt sistemada o'sha ikki son turibdi — ikki va besh. Farq faqat tengsizlik belgilarida, javoblar esa butunlay boshqa.",
    'В четырёх системах стоят одни и те же два числа — два и пять. Различие только в знаках неравенств, а ответы совершенно разные.',
    'The four systems hold the same two numbers — two and five. They differ only in the inequality signs, yet the answers are completely different.'),
  ask: L(
    "Chapdan javobni bosing, keyin o'ngdan uning sistemasini bosing.",
    'Нажми ответ слева, потом его систему справа.',
    'Tap an answer on the left, then its system on the right.'),
  correctText: L(
    "To'g'ri. Nurlar bir-biriga qarasa — oraliq; bir tomonga qarasa — tori qoladi; bir-biridan qochsa — yechim yo'q. To'rt sistemada o'sha ikki son turibdi, javobni esa faqat belgilar hal qildi.",
    'Верно. Лучи идут навстречу — промежуток; смотрят в одну сторону — остаётся более узкий; расходятся — решений нет. В четырёх системах те же два числа, а ответ решили только знаки.',
    'Correct. Rays running towards each other give a range; pointing the same way, the narrower one remains; running apart, there are no solutions. The four systems hold the same two numbers, and only the signs decided the answers.'),
  wrongs: [
    { when: (s) => s.pair.m4 !== 't4', text: L(
      "«Yechim yo'q» degan javob nurlar bir-biridan QOCHGAN sistemaga tegishli: x beshdan katta va x ikkidan kichik. Bunday son yo'q — beshdan katta bo'lgan hamma son ikkidan ham katta. Boshqa uch sistemada esa yechim bor, chunki nurlar ustma-ust tushadigan joy topiladi.",
      'Ответ «решений нет» относится к системе, где лучи РАСХОДЯТСЯ: x больше пяти и x меньше двух. Такого числа не бывает — всякое число, большее пяти, больше и двух. А в трёх других системах решение есть, ведь у лучей находится общая область.',
      'The answer «no solutions» belongs to the system where the rays run APART: x greater than five and x less than two. No such number exists — every number greater than five is greater than two too. In the other three systems there is a solution, since the rays do share a region.') },
    { when: (s) => s.pair.m2 === 't3' || s.pair.m3 === 't2', text: L(
      "Bu ikki sistemada nurlar bir tomonga qaraydi, lekin TOMONI boshqa. Ikkalasi ham o'ngga qaraganda tori beshdan boshlanadi: x beshdan katta. Ikkalasi ham chapga qaraganda esa tori ikkida tugaydi: x ikkidan kichik. Har safar TOR turgani qoladi, chunki u ikkinchisining ichida yotadi.",
      'В этих двух системах лучи смотрят в одну сторону, но СТОРОНЫ разные. Когда оба смотрят вправо, более узкий начинается с пяти: x больше пяти. Когда оба смотрят влево, более узкий кончается на двух: x меньше двух. Каждый раз остаётся более УЗКИЙ, ведь он лежит внутри второго.',
      'In these two systems the rays point the same way, but the DIRECTION differs. When both point right, the narrower one starts at five: x greater than five. When both point left, the narrower one ends at two: x less than two. Each time the NARROWER one remains, since it lies inside the other.') },
    { when: (s) => s.pair.m1 !== 't1', text: L(
      "Oraliq faqat nurlar BIR-BIRIGA QARAB yurganda chiqadi: x ikkidan katta va x beshdan kichik. Ikki chegara ikki tomondan chegaralaydi, natijada ular orasidagi bo'lak qoladi. Boshqa uch sistemada esa chegaralardan biri ortiqcha bo'lib qoladi yoki umuman kesishma yo'q.",
      'Промежуток выходит только тогда, когда лучи идут НАВСТРЕЧУ: x больше двух и x меньше пяти. Две границы ограничивают с двух сторон, и остаётся кусок между ними. А в трёх других системах одна из границ оказывается лишней или пересечения нет вовсе.',
      'A range appears only when the rays run TOWARDS each other: x greater than two and x less than five. Two boundaries close it off from both sides and the piece between them remains. In the other three systems one boundary turns out redundant, or there is no overlap at all.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har sistemani to'g'ri chiziqda tasavvur qiling: har tengsizlik bitta nur beradi. Nurlar bir-biriga qarab yursa — oraliq; bir tomonga qarasa — tori; bir-biridan qochsa — yechim yo'q.",
      'Представь каждую систему на числовой прямой: каждое неравенство даёт луч. Лучи идут навстречу — промежуток; смотрят в одну сторону — более узкий; расходятся — решений нет.',
      'Picture every system on the number line: each inequality gives a ray. Rays running towards each other give a range; rays pointing the same way give the narrower one; rays running apart give no solutions.') },
  ],
  wrongText: L(
    "Har tengsizlikni to'g'ri chiziqdagi nur deb tasavvur qiling va ikki nur qayerda ustma-ust tushishini toping. Uchta hol bor: oraliq, tor nur, va bo'sh kesishma.",
    'Представляй каждое неравенство лучом на числовой прямой и ищи, где два луча накладываются. Случая три: промежуток, более узкий луч и пустое пересечение.',
    'Picture each inequality as a ray on the number line and find where the two rays overlap. There are three cases: a range, the narrower ray, and an empty overlap.'),
};

export default function D26_10(props) { return <MatchPairs data={DATA} {...props} />; }
