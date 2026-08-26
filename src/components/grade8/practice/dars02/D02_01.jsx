// Dars02 · Amaliyot 01 — Ha yoki yo'q · 🟢 · tag: property_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Kontent: src/books/grade8/DARS02_AMALIYOT_KONTENT_V2.md §01
//
// Metodist qarori 2026-08-24: 2-6 darslar 1-darsning o'nta mexanikasida
// quriladi, har darsda BOSHQA ketma-ketlikda (skelet §2). 2-dars 1-pozitsiyada
// `TrueFalse` turadi: boshqaruv bitta bosish, tushuntirish talab qilmaydi.
//
// IKKALA JAVOB HAM «HA» (metodist qarori 2026-08-25). Ilgari har ha-yo'q
// topshirig'ida bittasi «ha», bittasi «yo'q» edi — yigirma uch topshiriqda
// birdek, va o'quvchi matematikaga qaramasdan naqsh bo'yicha bosardi. Endi
// kombinatsiya darsdan darsga o'zgaradi.
//   s1 — xossa BAJARILGAN holat: uchga ko'paytirish qonuniy;
//   s2 — xossa yana BAJARILGAN, lekin ko'paytuvchi MINUS BIR: ikkala qavatning
//        ishorasi almashgan, qiymat esa o'zgarmagan. Ko'p o'quvchi minusni
//        «boshqa amal» deb o'ylab «yo'q» bosadi.
// З1 (ikkala qavatga QO'SHISH) bu yerdan chiqdi va qoplovsiz qolmadi: u 03
// (Zones, i6) va 09 (ClozeBank, «qo'shsak» tuzog'i) da tekshiriladi.
// «Faqat bitta qavat ko'paytirildi» (З20) esa 02 (Choice) da.
// Dastlabki kasr `given` qatorida turadi — shu sababli qatorlar ingichka.
// `import React` SHART: LMS xom jsx ni klassik rejimda yuklaydi.
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { TrueFalse, L } from '../kit.jsx';

const DATA = {
  tag: 'property_claims', level: '🟢',
  itemSize: 16,
  given: [[{ n: 'a', d: 'a + 3' }]],
  givenLabel: L('Dastlabki:', 'Исходная:', 'Original:'),
  items: [
    { id: 's1', tokens: [{ n: '3a', d: '3(a + 3)' }], yes: true,
      claim: L('xossa bajarildi', 'свойство выполнено', 'the property holds') },
    { id: 's2', tokens: [{ n: '−a', d: '−(a + 3)' }], yes: true,
      claim: L('xossa bajarildi', 'свойство выполнено', 'the property holds') },
  ],
  yesLabel: L('Ha', 'Да', 'Yes'),
  noLabel: L("Yo'q", 'Нет', 'No'),
  eyebrow: L("Ha yoki yo'q", 'Да или нет', 'Yes or no'),
  setup: L(
    "Dastlabki kasrdan ikki yozuv yasaldi. Ikkalasida ham surat va maxraj bilan bir xil narsa qilingan.",
    'Из исходной дроби сделали две записи. В обеих с числителем и знаменателем сделали одно и то же.',
    'Two records were made from the original fraction. In both, the same thing was done to numerator and denominator.'),
  ask: L(
    "Yozuvda xossa bajarilgan bo'lsa «Ha» ni, buzilgan bo'lsa «Yo'q» ni bosing.",
    'Если в записи свойство выполнено — нажми «Да», если нарушено — «Нет».',
    'Tap «Yes» if the property holds in the record, «No» if it is broken.'),
  correctText: L(
    "To'g'ri. Ikkalasida ham xossa bajarilgan. Birinchisida ikkala qavat uchga KO'PAYTIRILGAN, uch esa nol emas. Ikkinchisida ko'paytuvchi minus bir: surat ham, maxraj ham ishorasini almashtirdi, minus bir esa nolga teng emas — demak bu ham qonuniy. a ni birga teng qo'ying: dastlabki kasr bir chorak, birinchi yozuv ham bir chorak, ikkinchisi esa minus bir bo'lingan minus to'rt, ya'ni yana bir chorak.",
    'Верно. В обеих свойство выполнено. В первой оба этажа УМНОЖЕНЫ на три, а три не нуль. Во второй множитель это минус один: и числитель, и знаменатель сменили знак, а минус один не равен нулю — значит это тоже законно. Подставь a равное одному: исходная даёт одну четвёртую, первая запись тоже, а вторая — минус один делить на минус четыре, то есть снова одну четвёртую.',
    'Correct. The property holds in both. In the first, both floors are MULTIPLIED by three, and three is not zero. In the second the factor is minus one: numerator and denominator both changed sign, and minus one is not zero — so that is legitimate too. Put a equal to one: the original gives one quarter, the first record gives one quarter, and the second gives minus one over minus four, which is one quarter again.'),
  wrongs: [
    { when: (s) => s.bad.indexOf('s2') !== -1, text: L(
      "Minus bir ham ko'paytuvchi, va u nolga teng emas — demak xossa buzilmagan. a ni birga teng qo'ying: dastlabki kasr bir chorak, bu yozuv esa minus bir bo'lingan minus to'rt. Ikki minus bo'linmada bir-birini yo'qotadi, natija o'sha bir chorak.",
      'Минус один тоже множитель, и он не равен нулю — значит свойство не нарушено. Подставь a равное одному: исходная даёт одну четвёртую, а эта запись минус один делить на минус четыре. Два минуса в делении уничтожают друг друга, результат та же одна четвёртая.',
      'Minus one is a factor too, and it is not zero — so the property is not broken. Put a equal to one: the original gives one quarter and this record gives minus one over minus four. Two minuses cancel in a division, and the result is the same one quarter.') },
    { when: (s) => s.bad.indexOf('s1') !== -1, text: L(
      "Uch — qonuniy ko'paytuvchi: u nol emas, va unga surat ham, maxraj ham ko'paytirilgan. Qavsni ochib ko'ring: uch karra a qo'shuv uch, ya'ni uch a qo'shuv to'qqiz.",
      'Три — законный множитель: он не нуль, и на него умножены и числитель, и знаменатель. Раскрой скобку: три на a плюс три — это три a плюс девять.',
      'Three is a legitimate factor: it is not zero, and both numerator and denominator are multiplied by it. Expand the bracket: three times a plus three is three a plus nine.') },
  ],
  wrongText: L(
    "Har yozuvga ikki savol bering: ikkala qavat bir xil ifodaga KO'PAYTIRILDIMI va o'sha ifoda nolga teng emasmi? Ishonchsiz bo'lsangiz a ni birga teng qo'yib ikkalasini hisoblang.",
    'К каждой записи два вопроса: оба этажа УМНОЖЕНЫ на одно и то же выражение и это выражение не нуль? Если не уверен, подставь a равное одному и посчитай обе.',
    'Ask two questions of each record: were both floors MULTIPLIED by the same expression, and is that expression non-zero? If unsure, put a equal to one and compute both.'),
};

export default function D02_01(props) { return <TrueFalse data={DATA} {...props} />; }
