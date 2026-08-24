// Dars01 · Amaliyot 10 — Moslashtirish · 🔴 · tag: info_to_frac
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MatchPairs.
// Kontent: src/books/grade8/DARS01_AMALIYOT_KONTENT.md §10
//
// To'rt kasrning surati bir xil, farqi faqat maxrajda — demak javobni faqat
// chiziq tagi hal qiladi. Chapda ma'lumot SO'Z bilan (`items[].label`),
// o'ngda kasrlar (`targets[].tokens`), tanlangan juftlik EGRI CHIZIQ bilan
// birlashtiriladi (`connect: true`, metodist 2026-08-22). O'ng ustun har ochilganda
// aralashtiriladi. Taqiqlar SONI so'raladi: bir, ikki, nol va alohida holat —
// taqiq faqat nolda.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MatchPairs, L } from '../kit.jsx';

const DATA = {
  tag: 'info_to_frac', level: '🔴',
  connect: true,
  targetSize: 17,
  items: [
    { id: 'm1', label: L('faqat bitta taqiqlangan qiymat bor', 'есть ровно один запрет', 'there is exactly one ban') },
    { id: 'm2', label: L('ikkita taqiqlangan qiymat bor', 'есть два запрета', 'there are two bans') },
    { id: 'm3', label: L("taqiq umuman yo'q", 'запретов нет вовсе', 'there are no bans at all') },
    { id: 'm4', label: L('taqiq faqat nolda', 'запрет только в нуле', 'the ban is only at zero') },
  ],
  targets: [
    { id: 't1', tokens: [{ n: '5', d: 'a − 3' }] },
    { id: 't2', tokens: [{ n: '5', d: 'a² − 9' }] },
    { id: 't3', tokens: [{ n: '5', d: 'a² + 9' }] },
    { id: 't4', tokens: [{ n: '5', d: '4a' }] },
  ],
  answer: { m1: 't1', m2: 't2', m3: 't3', m4: 't4' },
  eyebrow: L('Moslashtirish', 'Соответствие', 'Match'),
  setup: L(
    "To'rt kasrning surati bir xil, farqi faqat maxrajda. Chapda har bir kasr haqida bitta ma'lumot turadi.",
    'У четырёх дробей одинаковый числитель, разница только в знаменателе. Слева про каждую дробь сказано одно.',
    'The four fractions share the same numerator; the difference is only in the denominator. On the left, one fact is stated about each fraction.'),
  ask: L(
    "Chapdan ma'lumotni bosing, keyin o'ngdan unga mos kasrni bosing.",
    'Нажми сведение слева, потом подходящую дробь справа.',
    'Tap a fact on the left, then tap the matching fraction on the right.'),
  correctText: L(
    "To'g'ri. a minus uch bitta joyda nolga aylanadi — uchda. a kvadrat minus to'qqiz ikki joyda: uchda va minus uchda, chunki har ikkisining kvadrati to'qqiz. a kvadrat qo'shuv to'qqiz esa hech qachon: eng kichik qiymati to'qqiz. To'rt a nolga faqat nolda aylanadi.",
    'Верно. a минус три обращается в нуль в одном месте — при трёх. a в квадрате минус девять в двух: при трёх и минус трёх, ведь квадрат обоих равен девяти. A в квадрате плюс девять — никогда: его наименьшее значение девять. Четыре a обращается в нуль только при нуле.',
    'Correct. a minus three becomes zero in one place — at three. a squared minus nine in two: at three and at minus three, since both squares are nine. a squared plus nine never does: its smallest value is nine. Four a becomes zero only at zero.'),
  wrongs: [
    { when: (s) => s.pair.m2 === 't3' || s.pair.m3 === 't2', text: L(
      "Ishorani ko'ring: bir maxrajda AYIRISH turadi, ikkinchisida QO'SHISH. Ayirish to'qqizga yetganda nolga tushadi, qo'shish esa hech qachon: uchni ham, minus uchni ham qo'yib tekshiring.",
      'Посмотри на знак: в одном знаменателе ВЫЧИТАНИЕ, в другом СЛОЖЕНИЕ. Вычитание доходит до нуля на девяти, сложение — никогда: подставь и три, и минус три.',
      'Look at the sign: one denominator has SUBTRACTION, the other ADDITION. Subtraction reaches zero at nine, addition never does: substitute both three and minus three.') },
    { when: (s) => s.pair.m4 && s.pair.m4 !== 't4', text: L(
      "To'rtga ko'paytirish yangi taqiq qo'shmaydi: to'rt a nolga faqat a nolda aylanadi. Boshqa hech qanday son bu maxrajni nolga aylantirmaydi.",
      'Умножение на четыре нового запрета не добавляет: четыре a обращается в нуль только при a равном нулю. Никакое другое число этот знаменатель не обнулит.',
      'Multiplying by four adds no new ban: four a becomes zero only at a equal to zero. No other number makes this denominator vanish.') },
    { when: (s) => s.pair.m1 === 't2', text: L(
      "Chiziqli maxrajning bitta noli bor, kvadratning esa ikkita bo'lishi mumkin. Kvadratli maxrajga minus uchni ham qo'yib ko'ring.",
      'У линейного знаменателя один нуль, у квадрата их может быть два. Подставь в квадратный знаменатель ещё и минус три.',
      'A linear denominator has one zero; a square can have two. Substitute minus three into the square denominator as well.') },
    { when: (s) => s.bad.length >= 3, text: L(
      "Har kasrda bitta ish qiling: maxrajni nolga tenglang va nechta yechim chiqqanini SANANG. Nechta yechim — shuncha taqiq.",
      'С каждой дробью делай одно: приравняй знаменатель к нулю и ПОСЧИТАЙ, сколько вышло решений. Сколько решений — столько запретов.',
      'Do one thing with every fraction: set the denominator to zero and COUNT the solutions. As many solutions as bans.') },
  ],
  wrongText: L(
    "Maxrajni nolga tenglab yechimlar sonini sanang: nol, bir yoki ikki. Ma'lumot aynan shu sonni aytadi.",
    'Приравняй знаменатель к нулю и посчитай решения: нуль, одно или два. Сведение говорит именно про это число.',
    'Set the denominator to zero and count the solutions: none, one or two. The fact on the left is about exactly that number.'),
};

export default function D01_10(props) { return <MatchPairs data={DATA} {...props} />; }
