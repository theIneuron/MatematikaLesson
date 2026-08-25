// Dars03 · Amaliyot 01 — Belgilash · 🟢 · tag: factor_seen
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> MarkAll.
// Kontent: src/books/grade8/DARS03_AMALIYOT_KONTENT_V2.md §01
//
// Metodist qarori 2026-08-24: 2-6 darslar 1-darsning o'nta mexanikasida
// quriladi, har darsda boshqa ketma-ketlikda. 3-darsda 1-pozitsiyada `MarkAll`
// turadi: bitta bosish, boshqaruv tushuntirishni talab qilmaydi.
//
// Bu yerda hali QISQARTIRILMAYDI — faqat KO'RILADI: umumiy ko'paytuvchi bormi.
// Uchtasi ko'paytuvchilarga ajratilgan holda turadi, ya'ni javob ko'rinib
// turibdi; ajratish 05 va 08 da so'raladi.
// Uch noto'g'ri karta — darsning eng qimmat adashishi (З-qisqartirish):
//   i2  5f/(5 + f)      son bilan qo'shiluvchini qisqartirish
//   i4  (f² − 9)/(f² − 3)  «kvadratlar qisqaradi»
//   i6  (f + 3)/(f + 7)    qo'shiluvchilar qisqarmaydi
// «Hammasi yoki hech narsa»: uchtasi ham topilishi kerak.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { MarkAll, L } from '../kit.jsx';

const DATA = {
  tag: 'factor_seen', level: '🟢',
  col: 172, itemSize: 19,
  items: [
    { id: 'i1', tokens: [{ n: '(f − 3)(f + 3)', d: '3(f − 3)' }], hit: true },
    { id: 'i2', tokens: [{ n: '5f', d: '5 + f' }] },
    { id: 'i3', tokens: [{ n: '7(f + 2)', d: '(f + 2)(f − 1)' }], hit: true },
    { id: 'i4', tokens: [{ n: 'f² − 9', d: 'f² − 3' }] },
    { id: 'i5', tokens: [{ n: 'f(f − 8)', d: '4f' }], hit: true },
    { id: 'i6', tokens: [{ n: 'f + 3', d: 'f + 7' }] },
  ],
  eyebrow: L('Belgilash', 'Отметить', 'Mark'),
  setup: L(
    "Oltita kasr. Ba'zilarida surat va maxrajning umumiy ko'paytuvchisi bor va u ko'rinib turadi, ba'zilarida umuman yo'q.",
    'Шесть дробей. У некоторых есть общий множитель числителя и знаменателя, и он виден; у некоторых его нет вовсе.',
    'Six fractions. Some have a common factor of numerator and denominator, and it is visible; some have none at all.'),
  ask: L(
    "Umumiy ko'paytuvchisi bor 3 kasrni belgilang.",
    'Отметь 3 дроби, у которых есть общий множитель.',
    'Mark the 3 fractions that have a common factor.'),
  note: L('Uchta', 'Три', 'Three'),
  correctText: L(
    "To'g'ri. Uchtasida umumiy KO'PAYTUVCHI turibdi: f minus uch, f qo'shuv ikki va f ning o'zi. Ular ko'paytuvchi, chunki ularga butun surat ham, butun maxraj ham bo'linadi. Qolgan uchtasida bunday narsa yo'q: besh qo'shuv f da beshni ajratib bo'lmaydi, f kvadrat minus uch ko'paytuvchilarga ajralmaydi, f qo'shuv uch va f qo'shuv yetti esa umuman boshqa qavslar.",
    'Верно. В трёх стоит общий МНОЖИТЕЛЬ: f минус три, f плюс два и сама f. Они множители, потому что на них делится и весь числитель, и весь знаменатель. В остальных трёх такого нет: в пять плюс f пятёрку не выделить, f в квадрате минус три на множители не раскладывается, а f плюс три и f плюс семь — совсем разные скобки.',
    'Correct. Three carry a common FACTOR: f minus three, f plus two and f itself. They are factors because the whole numerator and the whole denominator are divisible by them. The other three have nothing like that: five cannot be taken out of five plus f, f squared minus three does not factor, and f plus three and f plus seven are quite different brackets.'),
  wrongs: [
    { when: (s) => s.extra.indexOf('i2') !== -1, text: L(
      "Besh f da besh — ko'paytuvchi, lekin besh qo'shuv f da u QO'SHILUVCHI. Qisqartirish uchun ikkala qavatning HAMMASI bir xil narsaga bo'linishi kerak. f ni birga teng qo'ying: besh bo'linadi oltiga, qisqartirish esa f bergan bo'lardi.",
      'В пять f пятёрка — множитель, а в пять плюс f она СЛАГАЕМОЕ. Для сокращения на одно и то же должен делиться ВЕСЬ этаж целиком. Подставь f равное одному: пять делить на шесть, а сокращение дало бы f.',
      'In five f the five is a factor, but in five plus f it is a TERM. To cancel, the WHOLE of each floor must be divisible by the same thing. Put f equal to one: five over six, while cancelling would give f.') },
    { when: (s) => s.extra.indexOf('i4') !== -1, text: L(
      "f kvadrat minus uchni ko'paytuvchilarga ajratib bo'lmaydi, demak f kvadrat minus to'qqiz bilan umumiy ko'paytuvchisi ham yo'q. Kvadratlar bir xil ko'rinadi, lekin bu qisqartirish uchun asos emas.",
      'f в квадрате минус три на множители не разложить, значит и общего множителя с f в квадрате минус девять нет. Квадраты выглядят одинаково, но это не основание для сокращения.',
      'f squared minus three cannot be factored, so it has no common factor with f squared minus nine either. The squares look alike, but that is no ground for cancelling.') },
    { when: (s) => s.extra.indexOf('i6') !== -1, text: L(
      "f qo'shuv uch va f qo'shuv yetti — ikki xil qavs. Ulardagi f ni alohida qisqartirib bo'lmaydi: u qavsning ichida, ya'ni qo'shiluvchi.",
      'f плюс три и f плюс семь — две разные скобки. Отдельно сократить в них f нельзя: она внутри скобки, то есть слагаемое.',
      'f plus three and f plus seven are two different brackets. The f inside cannot be cancelled on its own: it is a term inside the bracket.') },
    { when: (s) => s.miss.indexOf('i5') !== -1, text: L(
      "Ko'paytuvchi harfning o'zi ham bo'ladi: tepada f karra f minus sakkiz, pastda to'rt karra f. Ikkala qavat ham f ga bo'linadi.",
      'Множителем бывает и сама буква: сверху f на f минус восемь, снизу четыре на f. Оба этажа делятся на f.',
      'The letter itself can be the factor: above f times f minus eight, below four times f. Both floors are divisible by f.') },
  ],
  wrongText: L(
    "Har kasrga bitta savol bering: surat ham, maxraj ham BUTUNLIGICHA bitta va o'sha ifodaga bo'linadimi? Qavs ichidagi qo'shiluvchi bunday ifoda emas.",
    'К каждой дроби один вопрос: и числитель, и знаменатель делятся ЦЕЛИКОМ на одно и то же? Слагаемое внутри скобки таким выражением не является.',
    'Ask one question of each fraction: are numerator and denominator divisible AS A WHOLE by the same thing? A term inside a bracket is not such a thing.'),
};

export default function D03_01(props) { return <MarkAll data={DATA} {...props} />; }
