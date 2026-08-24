// Dars03 · Amaliyot 08 — Pazl · 🔴 · tag: what_cancels
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> PairSlots.
// Kontent: src/books/grade8/DARS03_AMALIYOT_KONTENT_V2.md §08
//
// Ilgari bu o'rinda `TypeExpr` turgan: javob ifodasini yozish. Metodist
// qarori 2026-08-24: o'nta mexanika 1-darsdan olinadi, `TypeExpr` esa u yerda
// yo'q. Savol kuchaytirildi — bitta emas, UCH yozuv, va har birida NIMA
// qisqarishini aytish kerak.
//
// Uchala suratda BIR XIL yozuv turadi (r² − 9), farq faqat maxrajda — ya'ni
// javobni faqat chiziq TAGI hal qiladi:
//   (r² − 9)/(2r − 6)  = (r−3)(r+3) / 2(r−3)   -> qisqaradi (r − 3)
//   (r² − 9)/(r² + 3r) = (r−3)(r+3) / r(r+3)   -> qisqaradi (r + 3)
//   (r² − 9)/(9 − r²)  = −(9 − r²)/(9 − r²)    -> BUTUN yozuv qisqaradi
// Uchinchisi darsning chegarasi: hamma narsa qisqaradi va minus bir qoladi.
//
// SONLAR KICHIK (9 va 3, ilgari 36 va 6): pazl kartasi telefonda 54px, uzun
// yozuv karta ichida ikki qatorga bo'linib ketardi (o'lchov 2026-08-24).
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { PairSlots, L } from '../kit.jsx';

const DATA = {
  tag: 'what_cancels', level: '🔴',
  // YOZUV ZICH (bo'shliqsiz): pazl kartasi telefonda 54px, bo'shliqli yozuv
  // karta ichida ikki qatorga bo'linib ketardi va o'ng bo'lakning matni
  // ramkadan chiqib ketardi (o'lchov 2026-08-24). Matematika o'zgarmadi.
  cards: [
    { id: 'f1', tokens: [{ n: 'r²−9', d: '2r−6' }] },
    { id: 'f2', tokens: [{ n: 'r²−9', d: 'r²+3r' }] },
    { id: 'f3', tokens: [{ n: 'r²−9', d: '9−r²' }] },
    { id: 'v1', v: 'r−3' },
    { id: 'v2', v: 'r+3' },
    { id: 'v3', v: 'r²−9' },
  ],
  answer: [['f1', 'v1'], ['f2', 'v2'], ['f3', 'v3']],
  eyebrow: L('Pazl', 'Пазл', 'Puzzle'),
  setup: L(
    "Uch kasrning surati bir xil, farqi faqat maxrajda. Chapda kasr, o'ngda esa qisqaradigan ifoda turadi.",
    'У трёх дробей одинаковый числитель, разница только в знаменателе. Слева дробь, справа то, что сокращается.',
    'The three fractions share the same numerator; the difference is only in the denominator. On the left a fraction, on the right what cancels.'),
  ask: L(
    "Har kasrga nima qisqarishini toping: kartani bosing, keyin uyani bosing.",
    'Для каждой дроби найди, что сокращается: нажми карточку, потом ячейку.',
    'Find what cancels in each fraction: tap a card, then a slot.'),
  bank: L('Kartalar', 'Карточки', 'Cards'),
  correctText: L(
    "To'g'ri. Surat hamma joyda bir xil: r minus uch karra r qo'shuv uch. Birinchi maxrajda ikkitani chiqaramiz — ikki karra r minus uch, demak r minus uch qisqaradi. Ikkinchisida r ni chiqaramiz — r karra r qo'shuv uch, demak r qo'shuv uch qisqaradi. Uchinchisida maxraj suratning teskarisi: to'qqiz minus r kvadrat bu minus bir karra r kvadrat minus to'qqiz, ya'ni butun yozuv qisqaradi va minus bir qoladi.",
    'Верно. Числитель везде один: r минус три на r плюс три. В первом знаменателе выносим двойку — два на r минус три, значит сокращается r минус три. Во втором выносим r — r на r плюс три, значит сокращается r плюс три. В третьем знаменатель противоположен числителю: девять минус r в квадрате это минус один на r в квадрате минус девять, то есть сокращается вся запись и остаётся минус один.',
    'Correct. The numerator is the same everywhere: r minus three times r plus three. In the first denominator a two comes out — two times r minus three, so r minus three cancels. In the second an r comes out — r times r plus three, so r plus three cancels. In the third the denominator is the opposite of the numerator: nine minus r squared is minus one times r squared minus nine, so the whole record cancels and minus one is left.'),
  wrongs: [
    { when: (s) => s.mate.f1 === 'v2' || s.mate.f2 === 'v1', text: L(
      "Maxrajdan ko'paytuvchini chiqaring va SHUNGA qarang: ikki r minus olti bu ikki karra r minus uch, r kvadrat qo'shuv uch r esa r karra r qo'shuv uch. Qaysi qavs suratda ham bor — o'sha qisqaradi.",
      'Вынеси множитель из знаменателя и смотри на НЕГО: два r минус шесть это два на r минус три, а r в квадрате плюс три r это r на r плюс три. Какая скобка есть и в числителе — та и сокращается.',
      'Take the factor out of the denominator and look at THAT: two r minus six is two times r minus three, while r squared plus three r is r times r plus three. Whichever bracket is in the numerator too is the one that cancels.') },
    { when: (s) => s.mate.f3 && s.mate.f3 !== 'v3', text: L(
      "Uchinchi maxrajga diqqat qiling: to'qqiz minus r kvadrat — bu suratning TESKARISI, ya'ni minus bir karra r kvadrat minus to'qqiz. Bu yerda bitta qavs emas, butun yozuv qisqaradi. r ni nolga teng qo'ying: minus to'qqiz bo'lingan to'qqiz, ya'ni minus bir.",
      'Присмотрись к третьему знаменателю: девять минус r в квадрате — это ПРОТИВОПОЛОЖНОЕ числителю, минус один на r в квадрате минус девять. Здесь сокращается не одна скобка, а вся запись. Подставь r равное нулю: минус девять делить на девять, то есть минус один.',
      'Look closely at the third denominator: nine minus r squared is the OPPOSITE of the numerator, minus one times r squared minus nine. Here not one bracket cancels but the whole record. Put r equal to zero: minus nine over nine, that is minus one.') },
    { when: (s) => s.mate.f1 === 'v3' || s.mate.f2 === 'v3', text: L(
      "Butun yozuv faqat maxraj suratga teng yoki unga teskari bo'lganda qisqaradi. Bu yerda esa maxrajda faqat BITTA umumiy qavs bor — uni ko'paytuvchi sifatida ajratib oling.",
      'Вся запись сокращается только тогда, когда знаменатель равен числителю или противоположен ему. А здесь в знаменателе только ОДНА общая скобка — выдели её как множитель.',
      'The whole record cancels only when the denominator equals the numerator or is its opposite. Here the denominator shares just ONE bracket — take it out as a factor.') },
  ],
  wrongText: L(
    "Suratni bir marta ajrating: r minus uch karra r qo'shuv uch. Keyin har maxrajni ajratib, ikkalasida ham turgan ifodani toping.",
    'Разложи числитель один раз: r минус три на r плюс три. Потом разложи каждый знаменатель и найди то, что стоит и там, и там.',
    'Factor the numerator once: r minus three times r plus three. Then factor each denominator and find what stands in both.'),
};

export default function D03_08(props) { return <PairSlots data={DATA} {...props} />; }
