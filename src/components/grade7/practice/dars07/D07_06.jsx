// Dars07 · Amaliyot 06 — Noma'lum qayerda · 🟡 · tag: unknown_where
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TapTerms.
//
// 4x − 9 = 3x + 6. Noma'lum IKKI tomonda ham bor -- bu 9-darsga tayyorgarlik.
// Bu yerda o'quvchidan yechish so'ralmaydi, faqat noma'lumli hadlarni
// ajratish: 4x va 3x. 9 va 6 -- ozod hadlar.
// Xato: tenglik belgisidan keyingi qismni «javob» deb o'ylab, 3x ni
// belgilamaslik.
import React from 'react';
import { TapTerms, L } from '../kit.jsx';

const DATA = {
  tag: 'unknown_where', level: '🟡', exprSize: 28,
  eyebrow: L("Noma'lum qayerda", 'Где неизвестное', 'Where the unknown is'),
  setup: L(
    "Noma'lum tenglamaning bir tomonida ham, ikki tomonida ham bo'lishi mumkin. Yechishdan oldin uni topib olish kerak.",
    'Неизвестное может стоять в одной части уравнения, а может в обеих. Прежде чем решать, его надо найти.',
    'The unknown can stand in one side of the equation or in both. Before solving it has to be found.'),
  ask: L("Noma'lum qatnashgan HAMMA hadni belgilang.", 'Отметь ВСЕ слагаемые, в которых есть неизвестное.', 'Mark EVERY term that contains the unknown.'),
  note: L("Tenglik belgisining ikki tomoniga ham qarang.", 'Смотри по обе стороны знака равенства.', 'Look on both sides of the equals sign.'),
  parts: [
    { k: 'term', id: 't1', v: '4x' },
    { k: 'sign', v: '−' },
    { k: 'term', id: 't2', v: '9' },
    { k: 'op', v: '=' },
    { k: 'term', id: 't3', v: '3x' },
    { k: 'sign', v: '+' },
    { k: 'term', id: 't4', v: '6' },
  ],
  want: ['t1', 't3'],
  correctText: L(
    "To'g'ri. Noma'lum ikki tomonda ham bor: 4x va 3x. Ularni bir tomonga to'plash keyingi darslarning ishi.",
    'Верно. Неизвестное есть в обеих частях: 4x и 3x. Собирать их в одну часть — работа следующих уроков.',
    'Correct. The unknown appears on both sides: 4x and 3x. Gathering them into one side is the next lessons.'),
  wrongs: [
    { when: (s) => s.miss.indexOf('t3') !== -1, text: L(
      "Tenglik belgisidan keyin ham had bor: 3x. O'ng tomon «javob» emas, u ham ifoda.",
      'После знака равенства тоже есть слагаемое: 3x. Правая часть не «ответ», это тоже выражение.',
      'There is a term after the equals sign too: 3x. The right side is not "the answer", it is an expression as well.') },
    { when: (s) => s.extra.indexOf('t2') !== -1 || s.extra.indexOf('t4') !== -1, text: L(
      "9 va 6 da harf yo'q -- ular ozod hadlar. Noma'lum faqat harf turgan hadda bo'ladi.",
      'В 9 и 6 буквы нет — это свободные члены. Неизвестное только там, где стоит буква.',
      'The 9 and 6 have no letter — they are free terms. The unknown is only where the letter is.') },
  ],
  wrongText: L(
    "Har hadga qarang: unda x bormi? Tenglik belgisining ikki tomonini ham tekshiring.",
    'Смотри на каждое слагаемое: есть ли в нём x? Проверь обе стороны знака равенства.',
    'Look at each term: does it have an x? Check both sides of the equals sign.'),
};

export default function D07_06(props) { return <TapTerms data={DATA} {...props} />; }
