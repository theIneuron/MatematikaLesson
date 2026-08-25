// Dars02 · Amaliyot 01 — Ha yoki yo'q · 🟢 · tag: property_claims
// Faqat MA'LUMOT. Mexanika: `practice/kit.jsx` -> TrueFalse.
// Kontent: src/books/grade8/DARS02_AMALIYOT_KONTENT_V2.md §01
//
// Metodist qarori 2026-08-24: 2-6 darslar 1-darsning o'nta mexanikasida
// quriladi, har darsda BOSHQA ketma-ketlikda (skelet §2). 2-dars 1-pozitsiyada
// `TrueFalse` turadi: boshqaruv bitta bosish, tushuntirish talab qilmaydi.
//
// IKKI qator, biri «ha», biri «yo'q» — javob naqshi o'z-o'zidan chiqmaydi.
//   s1 — xossa BAJARILGAN holat: uchga ko'paytirish qonuniy;
//   s2 — З1: ikkala qavatga bir xil son QO'SHILGAN, ko'paytirilmagan.
// «Faqat bitta qavat ko'paytirildi» (З20) bu yerda emas: u 03 (Zones, i6) va
// 02 (Choice, uchinchi variant) da tekshiriladi.
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
    { id: 's2', tokens: [{ n: 'a + 4', d: '(a + 3) + 4' }], yes: false,
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
    "To'g'ri. Birinchisida ikkala qavat uchga KO'PAYTIRILGAN, uch esa nol emas — xossa bajarilgan. Ikkinchisida ikkala qavatga to'rt QO'SHILGAN, bu esa boshqa amal. a ni birga teng qo'ying: dastlabki kasr bir chorak beradi, birinchi yozuv ham bir chorak, ikkinchisi esa besh sakkizdan.",
    'Верно. В первой оба этажа УМНОЖЕНЫ на три, а три не нуль — свойство выполнено. Во второй к обоим этажам ПРИБАВИЛИ четыре, а это другое действие. Подставь a равное одному: исходная даёт одну четвёртую, первая запись тоже одну четвёртую, вторая — пять восьмых.',
    'Correct. In the first, both floors are MULTIPLIED by three, and three is not zero — the property holds. In the second, four was ADDED to both floors, and that is a different action. Put a equal to one: the original gives one quarter, the first record gives one quarter too, the second gives five eighths.'),
  wrongs: [
    { when: (s) => s.ans.s2 === true, text: L(
      "Xossa KO'PAYTIRISH haqida. Bir xil sonni qo'shish kasrni o'zgartiradi: a ni birga teng qo'ying — dastlabki kasr bir chorak, bu yozuv esa besh sakkizdan beradi.",
      'Свойство про УМНОЖЕНИЕ. Прибавить одно и то же — значит изменить дробь: подставь a равное одному, исходная даёт одну четвёртую, а эта запись пять восьмых.',
      'The property is about MULTIPLYING. Adding the same thing changes the fraction: put a equal to one, the original gives one quarter and this record gives five eighths.') },
    { when: (s) => s.ans.s1 === false, text: L(
      "Uch — qonuniy ko'paytuvchi: u nol emas, va unga surat ham, maxraj ham ko'paytirilgan. Qavsni ochib ko'ring: uch karra a qo'shuv uch, ya'ni uch a qo'shuv to'qqiz.",
      'Три — законный множитель: он не нуль, и на него умножены и числитель, и знаменатель. Раскрой скобку: три на a плюс три — это три a плюс девять.',
      'Three is a legitimate factor: it is not zero, and both numerator and denominator are multiplied by it. Expand the bracket: three times a plus three is three a plus nine.') },
  ],
  wrongText: L(
    "Har yozuvga bitta savol bering: ikkala qavat bilan bir xil narsa KO'PAYTIRISH yo'li bilan qilindimi? Qo'shish bu xossa emas.",
    'К каждой записи один вопрос: с обоими этажами одно и то же сделали УМНОЖЕНИЕМ? Прибавление — это не свойство.',
    'Ask one question of each record: was the same thing done to both floors by MULTIPLYING? Adding is not this property.'),
};

export default function D02_01(props) { return <TrueFalse data={DATA} {...props} />; }
