// Dars02 · Amaliyot 06 — Belgilash · 🟡 · tag: made_by_property
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Kontent: src/books/grade8/DARS02_AMALIYOT_KONTENT_V2.md §06
//
// Ilgari bu o'rinda `StrikeOut` turgan (barmoq bilan qisqartirish). Metodist
// qarori 2026-08-24: o'nta mexanika 1-darsdan olinadi, shuning uchun savol
// TANISHga aylandi — qaysi kasr xossa bilan yasalgan.
//
// «Xossa bilan yasalgan» degani: surat ham, maxraj ham BITTA va O'SHA
// ifodaga ko'paytirilgan, ya'ni umumiy ko'paytuvchi bor. Uchta topilishi kerak,
// va uchtasining sababi uch xil:
//   i1  qavs      (q + 2)
//   i3  son       3   (3q + 9 = 3(q + 3) — ko'rish kerak)
//   i5  harf      q   (q² − q = q(q − 1) — ko'rish kerak)
// Uchta noto'g'ri karta — bitta adashishning uch ko'rinishi (З1/З20):
// qo'shiluvchi ko'paytuvchi deb olinadi. i6 esa i5 ga ataylab o'xshaydi:
// q² + 4 ko'paytuvchilarga ajralmaydi.
// «Hammasi yoki hech narsa»: uchtasi ham topilishi kerak.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'made_by_property', level: '🟡',
  col: 172, itemSize: 20,
  items: [
    { id: 'i1', tokens: [{ n: '5(q + 2)', d: '(q − 7)(q + 2)' }], hit: true },
    { id: 'i2', tokens: [{ n: '5 + q', d: '7 + q' }] },
    { id: 'i3', tokens: [{ n: '3q', d: '3q + 9' }], hit: true },
    { id: 'i4', tokens: [{ n: 'q − 5', d: 'q − 7' }] },
    { id: 'i5', tokens: [{ n: 'q²', d: 'q² − q' }], hit: true },
    { id: 'i6', tokens: [{ n: 'q² + 4', d: 'q + 2' }] },
  ],
  eyebrow: L('Belgilash', 'Отметить', 'Mark'),
  setup: L(
    "Oltita kasr. Ba'zilari boshqa kasrdan asosiy xossa bilan yasalgan — ya'ni surat ham, maxraj ham bitta va o'sha ifodaga ko'paytirilgan.",
    'Шесть дробей. Некоторые сделаны из другой дроби по основному свойству — то есть и числитель, и знаменатель умножены на одно и то же.',
    'Six fractions. Some were made from another fraction by the basic property — that is, numerator and denominator are multiplied by the same thing.'),
  ask: L(
    "Asosiy xossa bilan yasalgan 3 kasrni belgilang.",
    'Отметь 3 дроби, сделанные по основному свойству.',
    'Mark the 3 fractions made by the basic property.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Uchtasida umumiy ko'paytuvchi bor, va u uch xil ko'rinishda: birinchisida qavs q qo'shuv ikki, ikkinchisida son uch — uch q qo'shuv to'qqiz bu uch karra q qo'shuv uch, uchinchisida harf q — q kvadrat minus q bu q karra q minus bir. Qolgan uchtasida ko'paytuvchi yo'q: besh qo'shuv q, q minus besh va q kvadrat qo'shuv to'rt — bularning hammasi QO'SHILUVCHI yoki AYIRILUVCHI.",
    'Верно. В трёх есть общий множитель, и он в трёх разных видах: в первой скобка q плюс два, во второй число три — три q плюс девять это три на q плюс три, в третьей буква q — q в квадрате минус q это q на q минус один. В остальных трёх множителя нет: пять плюс q, q минус пять и q в квадрате плюс четыре — это всё слагаемые и вычитаемые.',
    'Correct. Three have a common factor, and it comes in three shapes: the bracket q plus two in the first, the number three in the second — three q plus nine is three times q plus three — and the letter q in the third: q squared minus q is q times q minus one. The other three have no factor: five plus q, q minus five and q squared plus four are all TERMS.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('i2') !== -1 || s.extra.indexOf('i4') !== -1, text: L(
      "Qo'shiluvchi ham, ayiriluvchi ham ko'paytuvchi emas. Besh qo'shuv q ni ham, q minus beshni ham ko'paytuvchilarga ajratib bo'lmaydi — demak bu kasrni biror kasrga bir xil narsani ko'paytirib olib bo'lmaydi.",
      'Ни слагаемое, ни вычитаемое множителем не является. Ни пять плюс q, ни q минус пять на множители не разложить — значит эту дробь нельзя получить умножением на одно и то же.',
      'Neither a term added nor one subtracted is a factor. Neither five plus q nor q minus five can be split into factors, so this fraction cannot be obtained by multiplying by the same thing.') },
    { when: (s) => s.extra.indexOf('i6') !== -1, text: L(
      "q kvadrat qo'shuv to'rtni ko'paytuvchilarga ajratib bo'lmaydi: unda na q, na ikki ko'paytuvchi. Maxrajdagi q qo'shuv ikki bilan umumiy narsasi yo'q.",
      'q в квадрате плюс четыре на множители не разлагается: там ни q, ни два не множитель. С q плюс два из знаменателя общего нет ничего.',
      'q squared plus four cannot be factored: neither q nor two is a factor there. It has nothing in common with q plus two below.') },
    { when: (s) => s.miss.indexOf('i3') !== -1, text: L(
      "Ko'paytuvchi son ham bo'ladi: uch q qo'shuv to'qqiz — bu uch karra q qo'shuv uch. Demak surat ham, maxraj ham uchga ko'paytirilgan.",
      'Множителем бывает и число: три q плюс девять — это три на q плюс три. Значит и числитель, и знаменатель умножены на три.',
      'A number can be the factor too: three q plus nine is three times q plus three. So both numerator and denominator are multiplied by three.') },
    { when: (s) => s.miss.indexOf('i5') !== -1, text: L(
      "q kvadrat minus q — bu q karra q minus bir. Suratdagi q kvadrat ham q ga bo'linadi, demak umumiy ko'paytuvchi q.",
      'q в квадрате минус q — это q на q минус один. Числитель q в квадрате тоже делится на q, значит общий множитель — q.',
      'q squared minus q is q times q minus one. The numerator q squared is divisible by q too, so the common factor is q.') },
  ],
  wrongText: L(
    "Har kasrga bitta savol bering: surat ham, maxraj ham BITTA va O'SHA ifodaga bo'linadimi? Qo'shiluvchini ko'paytuvchi deb olmang — ba'zan ko'paytuvchini ko'rish uchun uni qavsdan chiqarish kerak.",
    'К каждой дроби один вопрос: и числитель, и знаменатель делятся на ОДНО И ТО ЖЕ? Слагаемое множителем не считай — иногда множитель надо сначала вынести за скобку.',
    'Ask one question of each fraction: are both numerator and denominator divisible by the SAME thing? Do not take a term for a factor — sometimes the factor has to be taken out of the bracket first.'),
};

export default function D02_06(props) { return <MarkAll data={DATA} {...props} />; }
